import type * as I from "../common/Int"
import type { Orientation } from "./Orientation"
import type { Planet } from "./Planet"
import { PlanetPosition } from "./PlanetPosition"

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
    new Rover(
      planet,
      new PlanetPosition(planet, rover.position.x, rover.position.y),
      rover.orientation
    )
}
