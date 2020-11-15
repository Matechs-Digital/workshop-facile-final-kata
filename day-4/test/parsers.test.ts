import { left, right } from "../src/common/Either"
import { IntIso } from "../src/common/Int"
import { Orientation } from "../src/domain/Orientation"
import { Planet } from "../src/domain/Planet"
import { parseObstacles } from "../src/serde/ObstaclesParser"
import {
  InitialPosition,
  parseInitialPosition
} from "../src/serde/ParseInitialPosition"
import { parsePlanet, ParsePlanetError } from "../src/serde/PlanetParser"

describe("Parsers", () => {
  it("parse planet config", () => {
    expect(parsePlanet("5x4")).toEqual(
      right(new Planet(IntIso.wrap(5), IntIso.wrap(4), new Set()))
    )
  })
  it("parse planet config - fail", () => {
    expect(parsePlanet("5x4x")).toEqual(left(new ParsePlanetError("5x4x")))
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
  it("parse initial position config", () => {
    expect(parseInitialPosition("1,3:W")).toEqual(
      right(new InitialPosition(IntIso.wrap(1), IntIso.wrap(3), Orientation.West))
    )
    expect(parseInitialPosition("1,3:N")).toEqual(
      right(new InitialPosition(IntIso.wrap(1), IntIso.wrap(3), Orientation.North))
    )
    expect(parseInitialPosition("1,3:S")).toEqual(
      right(new InitialPosition(IntIso.wrap(1), IntIso.wrap(3), Orientation.South))
    )
    expect(parseInitialPosition("1,3:E")).toEqual(
      right(new InitialPosition(IntIso.wrap(1), IntIso.wrap(3), Orientation.East))
    )
  })
})
