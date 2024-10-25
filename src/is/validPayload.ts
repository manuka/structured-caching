import { isMetadata } from "@/is/metadata"
import { isRecord } from "@/is/record"

import type { StructuredCaching } from "@"

export const isValidPayload = (
  subject: unknown,
): subject is StructuredCaching.Payload<unknown> => {
  if (isRecord(subject)) {
    if (!isMetadata(subject.caching)) {
      return false
    }

    return subject.data !== undefined
  }

  return false
}
