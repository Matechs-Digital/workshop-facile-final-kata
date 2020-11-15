import * as E from "../common/Either"
import * as I from "../common/Int"
import type { Planet } from "./Planet"

export class PlanetPosition {
  readonly _tag = "PlanetPosition"
  constructor(readonly x: I.Int, readonly y: I.Int) {}
}

export class InvalidPlanetPositionWidth {
  readonly _tag = "InvalidPlanetPositionWidth"
}

export class InvalidPlanetPositionHeight {
  readonly _tag = "InvalidPlanetPositionHeight"
}

export type InvalidPlanetPosition =
  | InvalidPlanetPositionHeight
  | InvalidPlanetPositionWidth

export const makePlanetPosition = (
  x: I.Int,
  y: I.Int
): ((planet: Planet) => E.Either<InvalidPlanetPosition, PlanetPosition>) => (planet) =>
  I.between(I.Zero, planet.width)(x)
    ? I.between(I.Zero, planet.height)(y)
      ? E.right(new PlanetPosition(x, y))
      : E.left(new InvalidPlanetPositionHeight())
    : E.left(new InvalidPlanetPositionWidth())
