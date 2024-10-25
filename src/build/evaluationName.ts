import type { StructuredCaching } from "@"

export const buildEvaluationName = <Store extends StructuredCaching.BaseStore>(
  keys: StructuredCaching.Keys<Store>,
): string => {
  return `StructuredCaching#evaluate, keys: ${JSON.stringify(keys)}`
}
