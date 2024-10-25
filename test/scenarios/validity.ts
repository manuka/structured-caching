import type { ScenarioInputs } from "&/scenarios/assemble"
import { assembleScenario } from "&/scenarios/assemble"
import type { NestedTest } from "test-nested-scenarios"

export const curryValidityTest = <TestArgs, SubjectArg extends keyof TestArgs>({
  arg,
  extraInputs,
  blank,
  invalid,
  valid,
}: {
  arg: SubjectArg
  extraInputs?: ScenarioInputs
  blank?: undefined | null | false
  invalid: TestArgs[SubjectArg]
  valid: TestArgs[SubjectArg]
}) => {
  const inputs = {
    [`${blank}`]: blank,
    "(Invalid)": invalid,
    "(Valid)": valid,
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
