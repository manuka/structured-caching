import type { ScenarioInputs } from "&/scenarios/assemble"
import { assembleScenario } from "&/scenarios/assemble"
import type { NestedTest } from "test-nested-scenarios"

const baseInputs = {
  array: [],
  null: null,
  number: 1,
  object: {},
  string: `string`,
  undefined: undefined,
}

export const curryTestByInputType = <
  TestArgs,
  SubjectArg extends keyof TestArgs,
>({
  arg,
  defaultInputs = baseInputs,
  extraInputs,
}: {
  arg: SubjectArg
  defaultInputs?: ScenarioInputs
  extraInputs?: ScenarioInputs
}) => {
  const inputs = {
    ...defaultInputs,
    ...extraInputs,
  }

  return (addTest: NestedTest.AddTestFunction<TestArgs>) => {
    describe(`${String(arg)}:`, () => {
      assembleScenario({
        addTest,
        arg,
        inputs,
      })
    })
  }
}
