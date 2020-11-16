import type { AppConfig } from "../app/AppConfig"
import type { PlanetContext } from "../app/PlanetContext"
import { pipe } from "../common/Function"
import type * as I from "../common/Int"
import * as RTE from "../common/ReaderTaskEither"
import { parseInitialPosition } from "../serde/ParseInitialPosition"
import type { Orientation } from "./Orientation"
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

export const makeRover = RTE.accessM(
  ({ config, planetContext }: AppConfig & PlanetContext) =>
    pipe(
      RTE.fromEither(parseInitialPosition(config.initial)),
      RTE.chain(({ orientation, position }) =>
        pipe(
          validatePosition(position),
          RTE.map(
            (position) => new Rover(scale(planetContext.planet)(position), orientation)
          ),
          RTE.catchAll((hit) => RTE.left(new InvalidInitialPosition(hit)))
        )
      )
    )
)
