import { Test } from "&"
import { validPerson } from "&/models/person"
import { curryTestByReferenceTime } from "&/scenarios/referenceTime"
import { cloneDeep } from "lodash"
import { type NestedTest, testNestedScenarios } from "test-nested-scenarios"

type Step = {
  call: (args: Omit<TestArgs, "steps">) => Promise<unknown>
  delay: number
}

type TestArgs = {
  referenceTime: number | Date
  steps: Step[]
}

describe(`stuff`, () => {
  const runTest: NestedTest.RunTestFunction<TestArgs> = async ({
    referenceTime,
    steps,
  }) => {
    jest.useFakeTimers().setSystemTime(referenceTime)

    const person1 = {
      ...validPerson,
      id: `person1`,
    }

    const results = steps.map(async ({ call, delay }) => {
      await new Promise((resolve) => {
        setTimeout(resolve, delay)
      })

      const callResult = await call({ referenceTime })

      return {
        callResult,
        store: cloneDeep(Test.Caching.getStore()),
      }
    })

    expect(results).toMatchSnapshot()

    const evaluateResult1 = Test.Caching.evaluate({
      caller: `stuff`,
      fetch: {
        call: () => {
          return Promise.resolve(person1)
        },
        processName: `stuff.fetchPerson1`,
      },
      keys: [`people`, `subject`],
      validator: Test.Modelling.validator(`Person`),
    })

    Test.cleanUp()
  }

  const steps = [
    {
      call: () => {
        return Test.Caching.evaluate({
          caller: `stuff.step1`,
          fetch: {
            call: () => {
              return Promise.resolve(validPerson)
            },
            processName: `stuff.fetchPerson1`,
          },
          keys: [`people`, `subject`],
          validator: Test.Modelling.validator(`Person`),
        })
      },
      delay: 0,
    },
    {
      call: () => {
        return Test.Caching.evaluate({
          caller: `stuff.step1`,
          fetch: {
            call: () => {
              return Promise.resolve(validPerson)
            },
            processName: `stuff.fetchPerson1`,
          },
          keys: [`people`, `subject`],
          validator: Test.Modelling.validator(`Person`),
        })
      },
      delay: 0,
    },
  ]

  const scenarios: NestedTest.Scenario<TestArgs>[] = [
    curryTestByReferenceTime(),
  ]

  testNestedScenarios({
    expectedTestArgs: [],
    scenarios,
    runTest,
  })
})
