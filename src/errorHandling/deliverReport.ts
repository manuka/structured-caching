import type { ErrorHandling } from "@/errorHandling"

const deliveryMethods = {
  error: console.error,
  log: console.log,
  warn: console.warn,
}

const isProvidedChannel = (
  subject: ErrorHandling.ReportChannel | typeof console.log,
): subject is typeof console.log => {
  return typeof subject === `function`
}

export const deliverReport = <
  Channel extends ErrorHandling.ReportChannel | typeof console.log,
>({
  channel,
  report,
}: {
  channel: Channel
  report: ErrorHandling.Report
}) => {
  const deliveryMethod = isProvidedChannel(channel)
    ? channel
    : deliveryMethods[channel as ErrorHandling.ReportChannel]

  return deliveryMethod(...report)
}
