import { validThing } from "&/models/thing"
import { curryTestByInputType } from "&/scenarios/inputType"
import type { NestedTest } from "test-nested-scenarios"

export const curryTestByParts = (): NestedTest.Scenario<{
  parts: unknown
}> => {
  const invalidThing = {
    ...validThing,
    id: `Invalid Thing.id`,
    name: `Invalid Thing.name`,
    type: `Invalid Thing.type`,
  }

  return curryTestByInputType({
    arg: `parts`,
    extraInputs: {
      "{}": {},
      "{ (Valid Thing) }": { [validThing.id]: validThing },
      "{ (Invalid Thing)}": { [invalidThing.id]: invalidThing },
      "{ (Valid Thing), (Invalid Thing)}": {
        [validThing.id]: validThing,
        [invalidThing.id]: invalidThing,
      },
      "{ (Valid Thing), [InvalidThing.id]: (Valid Thing)}": {
        [validThing.id]: validThing,
        [invalidThing.id]: validThing,
      },
      "{ [id]: undefined, (Valid Thing) }": {
        UndefinedThing: undefined,
        [validThing.id]: validThing,
      },
    },
  })
}
