import type { ScenarioInputs } from "&/scenarios/assemble"
import { assembleScenario } from "&/scenarios/assemble"
import type { NestedTest } from "test-nested-scenarios"

const baseline = new Date(`2020-12-25`)

const addSeconds = (seconds: number) => {
  return new Date(baseline.getTime() + seconds * 1000)
}

const baseInputs = {
  baseline,
  "one minute later": addSeconds(60),
  "one hour later": addSeconds(3600),
  "one day later": addSeconds(86400),
}

export const curryTestByReferenceTime = <
  TestArgs extends { referenceTime: Date },
>({
  defaultInputs = baseInputs,
  extraInputs,
}: {
  defaultInputs?: ScenarioInputs
  extraInputs?: ScenarioInputs
} = {}) => {
  const inputs = {
    ...defaultInputs,
    ...extraInputs,
  }

  return (addTest: NestedTest.AddTestFunction<TestArgs>) => {
    describe(`referenceTime`, () => {
      assembleScenario({
        addTest,
        arg: `referenceTime`,
        inputs,
      })
    })
  }
}
