import { isValidKeys } from "@/is/validKeys"

import type { StructuredCaching } from "@"
import type { StructuredElements } from "structured-elements"

export const updateStore = <
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
  metadata?: Partial<StructuredCaching.Metadata>
}): StructuredCaching.API<Store, Registry> => {
  if (!isValidKeys(api, keys)) {
    api.privateFunctions.debug(
      `updateStructuredCachingStore failed due to invalid cache keys. The root key must exist on the store, and every key must be a non-numeric string:`,
      { api, data, keys, metadata },
    )

    return api
  }

  if (!data) {
    api.privateFunctions.debug(
      `updateStructuredCachingStore failed due to missing data:`,
      {
        api,
        data,
        keys,
        metadata,
      },
    )

    return api
  }

  const payload = buildCachedPayload({
    data,
    ...metadata,
  })

  return set(cloneDeep(store), keys, payload)
}
