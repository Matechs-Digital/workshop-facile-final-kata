import * as E from "../common/Either"
import * as I from "../common/Int"
import type { Newtype } from "../common/Newtype"
import { newtype } from "../common/Newtype"
import type { Planet } from "./Planet"

export interface PlanetPositionHash extends Newtype<"PlanetPositionHash", string> {}

export const PlanetPositionHash = newtype<PlanetPositionHash>()

export class PlanetPosition {
  readonly _tag = "PlanetPosition"
  constructor(readonly x: I.Int, readonly y: I.Int) {}
}

export class InvalidPlanetPositionX {
  readonly _tag = "InvalidPlanetPositionX"
}

export class InvalidPlanetPositionY {
  readonly _tag = "InvalidPlanetPositionY"
}

export type InvalidPlanetPosition = InvalidPlanetPositionY | InvalidPlanetPositionX

export const makePlanetPosition = (
  x: I.Int,
  y: I.Int
): ((planet: Planet) => E.Either<InvalidPlanetPosition, PlanetPosition>) => (planet) =>
  I.between(I.Zero, planet.width)(x)
    ? I.between(I.Zero, planet.height)(y)
      ? E.right(new PlanetPosition(x, y))
      : E.left(new InvalidPlanetPositionY())
    : E.left(new InvalidPlanetPositionX())

export function hashPlanetPosition(self: PlanetPosition) {
  return PlanetPositionHash.wrap(`x: ${self.x} - y: ${self.y}`)
}
