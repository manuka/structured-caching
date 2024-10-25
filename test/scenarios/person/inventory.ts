import { validThing } from "&/models/thing"
import { curryTestByInputType } from "&/scenarios/inputType"
import type { NestedTest } from "test-nested-scenarios"

export const curryTestByInventory = (): NestedTest.Scenario<{
  inventory: unknown
}> => {
  const invalidThing = {
    ...validThing,
    name: `Invalid Thing.name`,
    type: `Invalid Thing.type`,
  }

  return curryTestByInputType({
    arg: `inventory`,
    extraInputs: {
      "[]": [],
      "[(Valid Thing)]": [validThing],
      "[(Invalid Thing)]": [invalidThing],
      "[(Valid Thing), (Invalid Thing)]": [validThing, invalidThing],
    },
  })
}
