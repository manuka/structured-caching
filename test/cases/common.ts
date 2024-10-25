import { Test } from "&"
import type { Thing } from "&/models/thing"
import { curryTestByInputType } from "&/scenarios/inputType"
import { curryTestByParts } from "&/scenarios/thing/parts"
import type { StructuredElements } from "structured-elements"
import type { NestedTest } from "test-nested-scenarios"

type TestArgs = {
  id: unknown
  name: unknown
  parts: unknown
  type: unknown
  weight: unknown
}

type Expectation = ({
  subject,
  validator,
}: {
  subject: unknown
  validator: StructuredElements.Validator<Thing, "item">
}) => void

const expectedTestArgs = [`id`, `name`, `parts`, `type`, `weight`]

const curryRunTest = ({
  expectation,
}: {
  expectation: Expectation
}): NestedTest.RunTestFunction<TestArgs> => {
  return (testArgs) => {
    const validator = Test.Modelling.validator(`Thing`, `item`)

    expectation({ subject: testArgs, validator })
  }
}

const scenarios: NestedTest.Scenario<TestArgs>[] = [
  curryTestByParts(),
  curryTestByInputType({
    arg: `id`,
    defaultInputs: { string: `string`, undefined: undefined },
  }),
  curryTestByInputType({ arg: `name` }),
  curryTestByInputType({
    arg: `type`,
    defaultInputs: { string: `string`, undefined: undefined },
    extraInputs: {
      gadget: `gadget`,
      widget: `widget`,
    },
  }),
  curryTestByInputType({ arg: `weight` }),
]

export const setupValidatorThingItemTest = ({
  expectation,
}: {
  expectation: Expectation
}) => {
  return {
    runTest: curryRunTest({ expectation }),
    expectedTestArgs,
    scenarios,
  }
}
