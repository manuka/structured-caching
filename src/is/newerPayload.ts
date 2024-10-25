import type { StructuredCaching } from "@"

export const isNewerCachedPayload = <Data>({
  payload,
  reference,
}: {
  payload?: StructuredCaching.Payload<Data>
  reference?: StructuredCaching.Payload<Data>
}) => {
  if (!payload) {
    return false
  }

  if (!reference) {
    return true
  }

  return payload.caching.cachedAt > reference.caching.cachedAt
}
