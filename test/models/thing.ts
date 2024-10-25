import { Test } from "&"

export type Thing = {
  id: string
  name: string
  parts: Record<string, Thing>
  type: "widget" | "gadget"
  weight: number | null
}

export const ThingModel: Test.Model<"Thing"> = () => {
  return {
    id: `string`,
    name: `string`,
    parts: Test.Modelling.reference(`collection`, `Thing`),
    type: Test.Modelling.equality(`item`, [`gadget`, `widget`]),
    weight: [`number`, null],
  }
}

export const validThing: Thing = {
  id: `Valid Thing.id`,
  name: `Valid Thing.name`,
  parts: {},
  type: `gadget`,
  weight: 1,
}

export const invalidThing = {
  id: `Invalid Thing.id`,
  name: `Invalid Thing.name`,
  parts: {},
  type: `Invalid Thing.type`,
  weight: `Invalid Thing.weight`,
}
