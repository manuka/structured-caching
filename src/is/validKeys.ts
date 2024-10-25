import { isArray } from "@/is/array"
import { isValidKeyType } from "@/is/validKeyType"

import type { StructuredCaching } from "@"
import type { StructuredElements } from "structured-elements"

export const isValidKeys = <
  Store extends StructuredCaching.BaseStore,
  Registry extends StructuredElements.BaseRegistry,
>(
  api: StructuredCaching.API<Store, Registry>,
  keys: unknown,
): keys is StructuredCaching.Keys<Store> => {
  if (!isArray(keys)) {
    return false
  }

  let keyTypesValid = true

  const keyTypes = {} as Record<keyof typeof keys, boolean>

  for (const key in keys) {
    if (isValidKeyType(key)) {
      keyTypes[key] = true
    } else {
      keyTypes[key] = false
      keyTypesValid = false
    }
  }

  const rootKey = keys[0] as keyof typeof keys

  const rootKeyValid = rootKey && keys[rootKey] !== undefined

  if (!keyTypesValid || !rootKeyValid) {
    api.privateFunctions.debug(
      `isValidKeys failed. Every key must be a non-numeric string and the root key must exist in the store.`,
      {
        api,
        keys,
        keyTypes,
        keyTypesValid,
        rootKey,
        rootKeyValid,
      },
    )
    return false
  }

  return true
}
