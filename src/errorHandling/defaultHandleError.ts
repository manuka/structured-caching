import type { ErrorHandling } from "@/errorHandling"

export const defaultHandleError: ErrorHandling.Functions.OnError = ({
  attempt,
  fallbackAvailable,
  maxAttempts,
}): ErrorHandling.Strategy => {
  return {
    action:
      attempt < maxAttempts ? `retry` : fallbackAvailable ? `abort` : `fatal`,
    reportChannel: `warn`,
  }
}
