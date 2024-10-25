export const isNumericString = (subject: string) => {
  return !Number.isNaN(Number(subject))
}
