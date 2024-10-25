import React from "react"

import type { Caching } from "@/caching"
import { contextPlaceholderFunction } from "@/context/placeholderFunction"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let CachingContextSingleton: any

export const getCachingContext = <Store extends Caching.BaseStore>({
  buildStore,
}: {
  buildStore?: Caching.Functions.BuildStore<Store>
} = {}): React.Context<Caching.ContextData<Store>> => {
  if (CachingContextSingleton) {
    return CachingContextSingleton
  }

  if (!buildStore) {
    throw new Error(
      `Caching#getContext could not initialise because it was not provided a buildStore function on its first call. The argument is optional for subsequent calls, as they will return the CachingContextSingleton.`,
    )
  }

  CachingContextSingleton = React.createContext<Caching.ContextData<Store>>({
    cache: contextPlaceholderFunction,
    processing: `getCachingContext`,
    store: buildStore(),
  })

  return CachingContextSingleton
}
