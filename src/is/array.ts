export const isArray = <T>(subject: unknown): subject is T[] => {
  return Array.isArray(subject)
}
