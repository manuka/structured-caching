import { isExpiredPayload } from "@/is/expiredPayload"

import type { StructuredCaching } from "@"

export const isFreshPayload = <Data>(
  payload: StructuredCaching.Payload<Data>,
  referenceTimestamp: StructuredCaching.Timestamp = Date.now(),
): boolean => {
  return !isExpiredPayload(payload, referenceTimestamp)
}
