import type { AppConfig } from "../app/AppConfig"
import { pipe } from "../common/Function"
import type * as I from "../common/Int"
import * as RE from "../common/ReaderEither"
import { parseInitialPosition } from "../serde/ParseInitialPosition"
import type { Orientation } from "./Orientation"
import type { PlanetContext } from "./Planet"
import type { ObstacleHit, Position } from "./Position"
import { scale, validatePosition } from "./Position"

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

export function roverConfiguration(
  x: I.Int,
  y: I.Int,
  orientation: Orientation
): RoverConfiguration {
  return {
    orientation,
    position: { x, y }
  }
}

export class InvalidInitialPosition {
  readonly _tag = "InvalidInitialPosition"
  constructor(readonly hit: ObstacleHit) {}
}

export const makeRover = RE.accessM(
  ({ config, planetContext }: AppConfig & PlanetContext) =>
    pipe(
      RE.fromEither(parseInitialPosition(config.initial)),
      RE.chain(({ orientation, position }) =>
        pipe(
          validatePosition(position),
          RE.map(
            (position) => new Rover(scale(planetContext.planet)(position), orientation)
          ),
          RE.catchAll((hit) => RE.left(new InvalidInitialPosition(hit)))
        )
      )
    )
)
