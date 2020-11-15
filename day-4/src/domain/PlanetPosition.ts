import * as E from "../common/Either"
import * as I from "../common/Int"
import type { Newtype } from "../common/Newtype"
import { newtype } from "../common/Newtype"
import type { Planet } from "./Planet"

export interface PlanetPositionHash extends Newtype<"PlanetPositionHash", string> {}

export const PlanetPositionHash = newtype<PlanetPositionHash>()

export class PlanetPosition {
  readonly _tag = "PlanetPosition"
  readonly x: I.Int
  readonly y: I.Int
  constructor(readonly planet: Planet, x: I.Int, y: I.Int) {
    this.x = I.mod(planet.width)(x)
    this.y = I.mod(planet.height)(y)
  }
}

export const makePlanetPosition = (
  x: I.Int,
  y: I.Int
): ((planet: Planet) => PlanetPosition) => (planet) => new PlanetPosition(planet, x, y)

export function hashPlanetPosition(self: PlanetPosition) {
  return PlanetPositionHash.wrap(`x: ${self.x} - y: ${self.y}`)
}

export function move(x: I.Int, y: I.Int) {
  return (self: PlanetPosition) =>
    new PlanetPosition(
      self.planet,
      I.mod(self.planet.width)(x),
      I.mod(self.planet.height)(y)
    )
}
