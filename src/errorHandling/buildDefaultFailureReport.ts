import type { ErrorHandling } from "@/errorHandling"

export const buildDefaultFailureReport = ({
  action,
  attempt,
  error,
  maxAttempts,
  processName,
  retryDelay,
}: { action: ErrorHandling.Action } & ErrorHandling.ProcessFailure) => {
  const message = [
    `Process ${processName} encountered an error on attempt ${attempt} of ${maxAttempts} and will `,
    action === `retry`
      ? `retry in ${retryDelay / 1000} seconds`
      : `${action}. Error:`,
  ].join(``)

  return [message, error]
}
