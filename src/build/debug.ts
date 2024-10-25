import type { StructuredCaching } from "@"
import type { StructuredElements } from "structured-elements"

export const buildDebug = <
  Store extends StructuredCaching.BaseStore,
  Registry extends StructuredElements.BaseRegistry,
>(
  api: StructuredCaching.API<Store, Registry>,
): StructuredCaching.Functions.LogDebugMessage => {
  return (message: string) => {
    if (api.debugEnabled()) {
      return api.internalCache.logDebugMessage(message)
    }
  }
}
