import { withRetries as withRetriesFn } from "@/errorHandling/withRetries"

export namespace ErrorHandling {
  export type Action = `abort` | `fatal` | `retry`

  export type Completion<Result> = {
    error?: unknown
    outcome: Outcome
    result?: Result
  }

  export type Outcome = `abort` | `fallback` | `success`

  export type ProcessFailure = {
    attempt: number
    error: unknown
    maxAttempts: number
    processName: string
    retryDelay: number
  }

  export type ProvidedChannel = typeof console.log

  export type Report = Parameters<
    typeof console.error | typeof console.log | typeof console.warn
  >

  export type ReportChannel = `error` | `log` | `warn`

  export type Strategy = {
    action: Action
    report?: Report
    reportChannel?: ReportChannel
  }

  export const withRetries = withRetriesFn

  export namespace Functions {
    export type GetFallbackResult<Result> = (
      args: ProcessFailure,
    ) => Promise<Result> | Result

    export type OnError = (
      args: ProcessFailure & { fallbackAvailable: boolean },
    ) => Promise<Strategy> | Strategy

    export type OnFatalError = (args: ProcessFailure) => Promise<void> | void

    export type Process<Result> = () => Promise<Result> | Result
  }
}
