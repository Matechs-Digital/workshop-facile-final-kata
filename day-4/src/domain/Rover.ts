import * as E from "../common/Either"
import { pipe } from "../common/Function"
import type * as I from "../common/Int"
import type { Orientation } from "./Orientation"
import type { Planet } from "./Planet"
import type { Position } from "./Position"
import { makePosition } from "./Position"

export class Rover {
  readonly _tag = "Rover"
  constructor(readonly position: Position, readonly orientation: Orientation) {}
}

export interface RoverConfiguration {
  position: {
    x: I.Int
    y: I.Int
  }
  orientation: Orientation
}

export function makeRover(planet: Planet) {
  return (rover: RoverConfiguration) =>
    pipe(
      makePosition(planet)(rover.position.x, rover.position.y),
      E.map((position) => new Rover(position, rover.orientation))
    )
}
