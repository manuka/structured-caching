import type { ErrorHandling } from "@/errorHandling"
import { buildDefaultFailureReport } from "@/errorHandling/buildDefaultFailureReport"
import { defaultHandleError } from "@/errorHandling/defaultHandleError"
import { deliverReport } from "@/errorHandling/deliverReport"

export const withRetries = async <
  Result,
  GetFallbackResult extends
    | ErrorHandling.Functions.GetFallbackResult<Result>
    | undefined,
>({
  attempt = 1,
  getFallbackResult,
  handleError = defaultHandleError,
  maxAttempts = 3,
  onFatalError,
  process,
  processName,
  reportChannel,
  retryDelay = 350,
}: {
  attempt?: number
  getFallbackResult?: GetFallbackResult
  handleError?: ErrorHandling.Functions.OnError
  maxAttempts?: number
  onFatalError: ErrorHandling.Functions.OnFatalError
  process: ErrorHandling.Functions.Process<Result>
  processName: string
  reportChannel?: ErrorHandling.ReportChannel | ErrorHandling.ProvidedChannel
  retryDelay?: number
}): Promise<ErrorHandling.Completion<Result>> => {
  try {
    const result = await process()
    return { outcome: `success`, result }
  } catch (error) {
    const failure: ErrorHandling.ProcessFailure = {
      attempt,
      maxAttempts,
      error,
      processName,
      retryDelay,
    }

    const errorHandlingStrategy = await handleError({
      ...failure,
      fallbackAvailable: Boolean(getFallbackResult),
    })

    const { action } = errorHandlingStrategy

    const channel = reportChannel || errorHandlingStrategy.reportChannel

    if (channel) {
      deliverReport({
        channel,
        report:
          errorHandlingStrategy.report ||
          buildDefaultFailureReport({
            ...failure,
            action,
          }),
      })
    }

    if (action === `abort`) {
      if (getFallbackResult) {
        return {
          error,
          outcome: `fallback`,
          result: await getFallbackResult(failure),
        }
      }

      return {
        error,
        outcome: `abort`,
        result: undefined,
      }
    }

    if (action === `retry`) {
      const completion = await new Promise<ErrorHandling.Completion<Result>>(
        (resolve, reject) => {
          setTimeout(async () => {
            try {
              const retry = await withRetries({
                attempt: attempt + 1,
                handleError,
                maxAttempts,
                onFatalError,
                process,
                processName,
                retryDelay,
              })
              resolve(retry)
            } catch (error) {
              reject(error)
            }
          }, retryDelay)
        },
      )

      return completion
    }

    // If we reach this point, the action is 'fatal'.
    const fallback = getFallbackResult && (await getFallbackResult(failure))

    await onFatalError(failure)

    return {
      error,
      outcome: fallback ? `fallback` : `abort`,
      result: fallback,
    }
  }
}
