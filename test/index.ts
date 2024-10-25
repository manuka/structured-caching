import { StructuredCaching } from "@"
import { type Person, PersonModel } from "&/models/person"
import { type Thing, ThingModel } from "&/models/thing"
import { StructuredElements } from "structured-elements"

export namespace Test {
  export const blankStore = {
    people: {},
    things: {},
  }

  export type Store = {
    people: Record<string, Person>
    things: Record<string, Thing>
  }

  export const Caching = StructuredCaching.setup<Store, Registry>({
    buildStore: () => {
      return blankStore
    },
    debugEnabled: () => {
      return process.env.DEBUG_OUTPUT === `true`
    },
    getStructuredElementsAPI: () => {
      return Modelling
    },
  })

  export const cleanUp = () => {
    Caching.internalCache.store = blankStore
    jest.useRealTimers()
  }

  export type Registry = {
    Person: Person
    Thing: Thing
  }

  export type RecordWithId = Record<string, unknown> & { id: string }

  export type Model<ModelId extends keyof Registry> =
    StructuredElements.Functions.BuildModelExpectation<Registry, ModelId>

  export const Modelling = StructuredElements.setup<Registry>({
    debugEnabled: () => {
      return true
    },
    models: () => {
      return {
        Person: PersonModel,
        Thing: ThingModel,
      }
    },
  })
}
