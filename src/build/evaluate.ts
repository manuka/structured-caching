import { buildEvaluationName } from "@/build/evaluationName"
import { buildPayload } from "@/build/payload"
import { withRetries } from "@/errorHandling/withRetries"
import { getCachedPayload } from "@/get/cachedPayload"
import { isFreshPayload } from "@/is/freshPayload"
import { isValidKeys } from "@/is/validKeys"

import type { StructuredCaching } from "@"
import type { StructuredElements } from "structured-elements"

const asCachedPayload = <
  Store extends StructuredCaching.BaseStore,
  Registry extends StructuredElements.BaseRegistry,
  Data,
>({
  api,
  data,
  keys,
  metadata,
}: {
  api: StructuredCaching.API<Store, Registry>
  data: Data
  keys: StructuredCaching.Keys<Store>
  metadata?: StructuredCaching.Metadata
}) => {
  const payload = buildPayload({
    data,
    ...metadata,
  })

  api.privateFunctions.updateStore({
    keys,
    payload,
  })

  return payload
}

export const buildEvaluate = <
  Store extends StructuredCaching.BaseStore,
  Registry extends StructuredElements.BaseRegistry,
>(
  api: StructuredCaching.API<Store, Registry>,
): StructuredCaching.Functions.Evaluate<Store> => {
  const evaluate: StructuredCaching.Functions.Evaluate<Store> = async ({
    attemptSalvage,
    allowSalvage = false,
    caller,
    fetch,
    keys,
    metadata,
    name = buildEvaluationName(keys),
    onValidationFailure,
    refresh,
    validator,
  }) => {
    // First check for a cached payload and return it if we find a fresh one.
    // Skip this step if the caller has requested a refresh.
    if (!refresh) {
      const cacheHit = getCachedPayload({
        api,
        keys,
        name,
        validator,
      })

      if (cacheHit && isFreshPayload(cacheHit)) {
        return cacheHit
      }
    }

    // Make sure that the keys are valid so that we don't risk breaking the store.
    if (!isValidKeys(api, keys)) {
      api.privateFunctions.debug(
        `StructuredCaching#evaluate failed due to invalid cache keys:`,
        {
          api,
          caller,
          fetchProcessName: fetch.processName,
          keys,
          metadata,
          name,
          refresh,
        },
      )
      return
    }

    // Call the fetch process using the error handling utility.
    const { result } = await withRetries({
      maxAttempts: fetch.maxAttempts,
      onFatalError: () => {
        api.privateFunctions.debug(
          `StructuredCaching#evaluate failed due to fatal error in fetch process:`,
          {
            api,
            caller,
            fetch,
            keys,
            metadata,
            name,
            refresh,
          },
        )
      },
      process: fetch.call,
      processName: fetch.processName,
      reportChannel: api.privateFunctions.debug,
      retryDelay: fetch.retryDelay,
    })

    // Check the result using the provided validator.
    const validationResult = validator.validate(result, name, attemptSalvage)

    // If the result is valid, cache it and return it.
    if (validationResult.valid) {
      return asCachedPayload({
        api,
        data: validationResult.subject,
        keys,
        ...metadata,
      })
    }

    // The caller might want to do something in response to a validation failure.
    if (onValidationFailure) {
      await onValidationFailure({
        cacheArgs: {
          allowSalvage,
          attemptSalvage,
          caller,
          fetch,
          keys,
          metadata,
          name,
          refresh,
          validator,
        },
        result: validationResult,
      })
    }

    // Attempt to salvage the data if the caller has requested that feature.
    if (allowSalvage && validationResult.salvage) {
      return asCachedPayload({
        api,
        data: validationResult.salvage,
        keys,
        ...metadata,
      })
    }

    // If we reach this point, we have failed to resolve any valid data.
    api.privateFunctions.debug(
      `StructuredCaching#evaluate failed to resolve any valid data:`,
      {
        api,
        caller,
        fetchProcessName: fetch.processName,
        keys,
        metadata,
        name,
        refresh,
        validationResult,
      },
    )
  }

  return evaluate
}
