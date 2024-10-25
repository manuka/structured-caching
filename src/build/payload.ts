import type { StructuredCaching } from "@"

export const buildPayload = <DataType>({
  cachedAt = Date.now(),
  data,
  expiresAt,
  expiry,
}: {
  data: DataType
} & Partial<StructuredCaching.Metadata>): StructuredCaching.Payload<DataType> => {
  return {
    caching: {
      cachedAt,
      expiresAt: expiresAt || (expiry ? cachedAt + expiry : undefined),
      expiry,
    },
    data,
  }
}
