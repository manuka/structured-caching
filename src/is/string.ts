export const isString = (subject: unknown): subject is string => {
  return typeof subject === `string`
}
