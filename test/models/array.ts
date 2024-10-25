import type { Test } from "&"

export const buildTestArray = ({
  base,
  length,
}: {
  base: Test.RecordWithId
  length: number
}) => {
  return Array.from({ length }, (_, index) => {
    return {
      ...base,
      id: `${base.id}-${index}`,
    }
  })
}
