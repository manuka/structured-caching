import type { StructuredCaching } from "@"
import { cloneDeep, set } from "lodash"
import type { StructuredElements } from "structured-elements"

export const buildUpdateStore = <
  Store extends StructuredCaching.BaseStore,
  Registry extends StructuredElements.BaseRegistry,
>(
  api: StructuredCaching.API<Store, Registry>,
): StructuredCaching.Functions.UpdateStore<Store> => {
  const updateStore: StructuredCaching.Functions.UpdateStore<Store> = ({
    keys,
    payload,
  }) => {
    const store = set(cloneDeep(api.internalCache.store), keys, payload)

    api.internalCache.store = store

    return store
  }

  return updateStore
}
