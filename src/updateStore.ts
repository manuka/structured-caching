import { cloneDeep, set } from "lodash"

import type { Caching } from "@/caching"
import { buildCachedPayload } from "@/caching/buildPayload"
import { cacheKeysValid } from "@/caching/keysValid"

export const updateCachingStore = <Store extends Caching.BaseStore, Data>({
  data,
  keys,
  metadata,
  store,
}: {
  data: Data
  keys: Caching.Keys<Store>
  metadata?: Partial<Caching.Metadata>
  store: Store
}): Store => {
  if (!cacheKeysValid(keys, store)) {
    console.error(
      `updateCachingStore failed due to invalid cache keys. The root key must exist on the store, and every key must be a non-numeric string:`,
      { data, keys, store },
    )

    return store
  }

  if (!data) {
    console.error(`updateCachingStore failed due to missing data:`, {
      data,
      keys,
      store,
    })

    return store
  }

  const payload = buildCachedPayload({
    data,
    ...metadata,
  })

  return set(cloneDeep(store), keys, payload)
}
