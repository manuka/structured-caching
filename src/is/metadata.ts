import { isRecord } from "@/is/record"

import type { StructuredCaching } from "@"

export const isMetadata = (
  subject: unknown,
): subject is StructuredCaching.Metadata => {
  if (!isRecord(subject)) {
    return false
  }

  if (!subject.cachedAt) {
    return false
  }

  if (subject.expiresAt && typeof subject.expiresAt !== `number`) {
    return false
  }

  if (subject.expiry && typeof subject.expiry !== `number`) {
    return false
  }

  return true
}
