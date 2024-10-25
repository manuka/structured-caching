import { isRecord } from "@/is/record"
import { isValidPayload } from "@/is/validPayload"

import type { StructuredCaching } from "@"
import type { StructuredElements } from "structured-elements"

export const getCachedPayload = <
  Store extends StructuredCaching.BaseStore,
  Registry extends StructuredElements.BaseRegistry,
  Data,
>({
  api,
  keys,
  name = keys.join(`.`),
  validator,
}: {
  api: StructuredCaching.API<Store, Registry>
  keys: StructuredCaching.Keys<Store>
  name?: string
  validator: StructuredElements.Validator<Data>
}) => {
  const payload = keys.reduce((accumulator: unknown, key) => {
    if (!isRecord(accumulator)) {
      return
    }

    return accumulator[key]
  }, api.internalCache.store)

  if (!payload) {
    return
  }

  if (!isValidPayload(payload)) {
    api.privateFunctions.debug(
      `getCachedPayload found and ignored an entry in the store that wasn't a correctly cached payload:`,
      { api, keys, payload },
    )
    return
  }

  if (!validator.isValid(payload.data, name)) {
    api.privateFunctions.debug(
      `getCachedPayload found and ignored a payload in the store with invalid data:`,
      { api, keys, payload },
      { failures: validator.getFailures(payload.data, name) },
    )
    return
  }

  return payload as StructuredCaching.Payload<Data>
}
