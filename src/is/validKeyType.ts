import { isNumericString } from "@/is/numericString"
import { isString } from "@/is/string"

import type { StructuredCaching } from "@"

export const isValidKeyType = (key: unknown): key is StructuredCaching.Key => {
  return isString(key) && !isNumericString(key)
}
