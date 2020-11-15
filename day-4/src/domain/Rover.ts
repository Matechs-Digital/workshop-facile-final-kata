import * as E from "../common/Either"
import { pipe } from "../common/Function"
import type * as I from "../common/Int"
import type { Orientation } from "./Orientation"
import type { Planet } from "./Planet"
import type { PlanetPosition } from "./PlanetPosition"
import { makePlanetPosition } from "./PlanetPosition"

export class Rover {
  readonly _tag = "Rover"
  constructor(
    readonly planet: Planet,
    readonly position: PlanetPosition,
    readonly orientation: Orientation
  ) {}
}

export interface RoverConfiguration {
  position: {
    x: I.Int
    y: I.Int
  }
  orientation: Orientation
}

export function makeRover(rover: RoverConfiguration) {
  return (planet: Planet) =>
    pipe(
      planet,
      makePlanetPosition(rover.position.x, rover.position.y),
      E.map((position) => new Rover(planet, position, rover.orientation))
    )
}
