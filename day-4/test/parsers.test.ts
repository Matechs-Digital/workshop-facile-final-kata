import { left, right } from "../src/common/Either"
import { IntIso } from "../src/common/Int"
import { Planet } from "../src/domain/Planet"
import { parseObstacles } from "../src/serde/ObstaclesParser"
import { parsePlanet, ParsePlanetError } from "../src/serde/PlanetParser"

describe("Parsers", () => {
  it("parse planet config", () => {
    expect(parsePlanet("5x4")).toMatchObject(
      right(new Planet(IntIso.wrap(5), IntIso.wrap(4), new Set()))
    )
  })
  it("parse planet config - fail", () => {
    expect(parsePlanet("5x4x")).toMatchObject(left(new ParsePlanetError("5x4x")))
  })
  it("parse obstacles config", () => {
    expect(parseObstacles("1,2 0,0 3,4")).toEqual(
      right([
        { x: 1, y: 2 },
        { x: 0, y: 0 },
        { x: 3, y: 4 }
      ])
    )
  })
})
