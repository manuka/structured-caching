import { Test } from "&"
import { type Thing, validThing } from "&/models/thing"

export type Person = {
  id: string
  inventory: Thing[]
  name: string
  roleId?: number
}

export const PersonModel: Test.Model<"Person"> = () => {
  return {
    id: `string`,
    inventory: Test.Modelling.reference(`array`, `Thing`),
    name: `string`,
    roleId: [`number`, undefined],
  }
}

export const validPerson: Person = {
  id: `Valid Person.id`,
  inventory: [validThing],
  name: `Valid Person.name`,
}

export const invalidPerson = {
  id: `Invalid Person.id`,
  inventory: undefined,
  name: `Invalid Person.name`,
}
