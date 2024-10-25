import type { StructuredCaching } from "@"

export const isExpiredPayload = <DataType>(
  payload: StructuredCaching.Payload<DataType>,
  referenceTimestamp = Date.now(),
): boolean => {
  const { cachedAt, expiresAt, expiry } = payload.caching

  if (expiresAt && expiresAt < referenceTimestamp) {
    return true
  }

  if (expiry && referenceTimestamp - cachedAt > expiry) {
    return true
  }

  return false
}
