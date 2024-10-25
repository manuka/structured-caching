export const isRecord = (
  subject: unknown,
): subject is Record<string | number | symbol, unknown> => {
  if (!subject) {
    return false
  }

  return typeof subject === `object`
}
