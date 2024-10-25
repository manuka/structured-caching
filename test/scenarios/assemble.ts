import type { NestedTest } from "test-nested-scenarios"

export type ScenarioInputs = Record<string, unknown>

export const assembleScenario = <TestArgs, Arg extends keyof TestArgs>({
  addTest,
  arg,
  inputs,
}: {
  addTest: NestedTest.AddTestFunction<TestArgs>
  arg: Arg
  inputs: Record<string, unknown>
}) => {
  for (const description in inputs) {
    describe(`${description},`, () => {
      addTest({
        [arg]: inputs[description],
      } as unknown as Partial<TestArgs>)
    })
  }
}
