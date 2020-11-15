import { right } from "../src/common/Either"
import { IntIso } from "../src/common/Int"
import { Planet } from "../src/domain/Planet"
import { parsePlanet } from "../src/serde/PlanetParser"

describe("Parsers", () => {
  it("parse planet config", () => {
    expect(parsePlanet("5x4")).toMatchObject(
      right(new Planet(IntIso.wrap(5), IntIso.wrap(4), new Set()))
    )
  })
})
