import * as E from "../common/Either"
import type * as I from "../common/Int"
import type { Planet } from "./Planet"
import { hashPosition, scale } from "./Position"

export class PlanetPosition {
  readonly _tag = "PlanetPosition"
  readonly x: I.Int
  readonly y: I.Int
  constructor(readonly planet: Planet, x: I.Int, y: I.Int) {
    const scaled = scale(planet)({ x, y })
    this.x = scaled.x
    this.y = scaled.y
  }
}

export const makePlanetPosition = (x: I.Int, y: I.Int) => (
  planet: Planet
): PlanetPosition => new PlanetPosition(planet, x, y)

export function move(x: I.Int, y: I.Int) {
  return (self: PlanetPosition) => new PlanetPosition(self.planet, x, y)
}

export class ObstacleHit {
  readonly _tag = "ObstacleHit"
  constructor(readonly position: PlanetPosition) {}
}

export function validatePlanetPosition(
  self: PlanetPosition
): E.Either<ObstacleHit, PlanetPosition> {
  if (self.planet.obstacles.has(hashPosition(self))) {
    return E.left(new ObstacleHit(self))
  }
  return E.right(self)
}
