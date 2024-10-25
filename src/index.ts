import { buildDebug } from "@/build/debug"
import { buildEvaluate as buildEvaluate } from "@/build/evaluate"
import { buildUpdateStore } from "@/build/updateStore"

import type { StructuredElements } from "structured-elements"

export namespace StructuredCaching {
  export type BaseStore = Record<string, unknown>

  export type API<
    Store extends BaseStore,
    Registry extends StructuredElements.BaseRegistry,
  > = {
    debugEnabled: () => boolean

    evaluate: Functions.Evaluate<Store>

    getStore: () => Store

    privateFunctions: {
      debug: Functions.LogDebugMessage
      getStructuredElementsAPI: () => StructuredElements.API<Registry>
      updateStore: Functions.UpdateStore<Store>
    }

    internalCache: {
      debug?: Functions.LogDebugMessage
      evaluate?: Functions.Evaluate<Store>
      logDebugMessage: Functions.LogDebugMessage
      store: Store
      updateStore?: Functions.UpdateStore<Store>
    }
  }

  export const setup = <
    Store extends BaseStore,
    Registry extends StructuredElements.BaseRegistry,
  >({
    buildStore,
    debugEnabled,
    getStructuredElementsAPI,
    logDebugMessage = console.log,
  }: {
    buildStore: Functions.BuildStore<Store, Registry>
    debugEnabled: () => boolean
    getStructuredElementsAPI: () => StructuredElements.API<Registry>
    logDebugMessage?: Functions.LogDebugMessage
  }): API<Store, Registry> => {
    const api: API<Store, Registry> = {
      debugEnabled,

      evaluate: (args) => {
        if (api.internalCache.evaluate) {
          return api.internalCache.evaluate(args)
        }

        const evaluate = buildEvaluate(api)
        api.internalCache.evaluate = evaluate

        return evaluate(args)
      },

      getStore: () => {
        return api.internalCache.store
      },

      privateFunctions: {
        debug: (...args) => {
          if (api.internalCache.debug) {
            return api.internalCache.debug(...args)
          }

          const debug = buildDebug(api)
          api.internalCache.debug = debug

          return debug(...args)
        },

        getStructuredElementsAPI,

        updateStore: (args) => {
          if (api.internalCache.updateStore) {
            return api.internalCache.updateStore(args)
          }

          const updateStore = buildUpdateStore(api)
          api.internalCache.updateStore = updateStore

          return updateStore(args)
        },
      },

      // Interacting with this cache directly is not supported.
      internalCache: {
        debug: undefined,
        evaluate: undefined,
        logDebugMessage,
        store: buildStore({
          structuredElementsAPI: getStructuredElementsAPI(),
        }),
        updateStore: undefined,
      },
    }

    return api
  }

  export type EvaluateArgs<
    Store extends BaseStore,
    CacheKeys extends Keys<Store>,
    Data,
  > = {
    attemptSalvage?: StructuredElements.Functions.AttemptSalvage<`item`>
    allowSalvage?: boolean
    caller: string
    fetch: FetchProcess<Data>
    keys: CacheKeys
    metadata?: Partial<Metadata>
    name?: string
    refresh?: boolean
    validator: StructuredElements.Validator<Data>
  }

  export type FetchProcess<Data> = {
    call: Functions.Fetch<Data>
    maxAttempts?: number
    processName: string
    retryDelay?: number
  }

  export type ContextData<Store extends BaseStore> = {
    cache: Functions.Evaluate<Store>
    processing: string | undefined
    store: Store
  }

  export type Metadata = {
    cachedAt: Timestamp
    expiresAt?: Timestamp
    expiry?: number // The maximum allowable number of milliseconds between cachedAt and when it should be considered to have expired
  }

  // Keys cannot be numeric strings, eg '1', because they cause JavaScript to see the record as an Array
  export type Key = string

  export type Keys<Store extends BaseStore> = [keyof Store, ...Key[]]

  export type Payload<Data> = {
    caching: Metadata
    data: Data
  }

  export type Timestamp = number // unix milliseconds, eg. Date.getTime()

  export namespace Functions {
    export type BuildStore<
      Store extends BaseStore,
      Registry extends StructuredElements.BaseRegistry,
    > = (args: {
      structuredElementsAPI: StructuredElements.API<Registry>
    }) => Store

    export type Evaluate<Store extends BaseStore> = <
      CacheKeys extends Keys<Store>,
      Data,
    >(
      args: EvaluateArgs<Store, CacheKeys, Data> & {
        onValidationFailure?: OnValidationFailure<Store, CacheKeys, Data>
      },
    ) => Promise<Payload<Data> | undefined>

    export type Fetch<Data> = () => Promise<Data>

    export type LogDebugMessage = (
      message: string,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...optionalParams: any[]
    ) => void

    export type UpdateStore<Store extends BaseStore> = <
      CacheKeys extends Keys<Store>,
      Data,
    >(args: {
      keys: CacheKeys
      payload: Payload<Data>
    }) => Store

    export type OnValidationFailure<
      Store extends BaseStore,
      CacheKeys extends Keys<Store>,
      Data,
    > = (args: {
      cacheArgs: EvaluateArgs<Store, CacheKeys, Data>
      result: StructuredElements.ValidationResult<Data>
    }) => Promise<void> | void
  }
}
