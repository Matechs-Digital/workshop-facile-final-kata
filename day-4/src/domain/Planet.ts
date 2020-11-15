import * as A from "../common/Array"
import * as E from "../common/Either"
import { pipe } from "../common/Function"
import * as I from "../common/Int"
import { SerializableSet } from "../common/SerializableSet"
import type { Position, PositionHash } from "./Position"
import { hashPosition, scale } from "./Position"

export class Planet {
  readonly _tag = "Planet"
  constructor(
    readonly width: I.Int,
    readonly height: I.Int,
    readonly obstacles: SerializableSet<PositionHash>
  ) {}
}

export interface ObstaclePosition extends Position {}

export interface PlanetConfiguration {
  width: I.Int
  height: I.Int
  obstacles: readonly ObstaclePosition[]
}

export type InvalidPlanetConfig = InvalidPlanetHeight | InvalidPlanetWidth

export function makePlanet({
  height,
  obstacles,
  width
}: PlanetConfiguration): E.Either<InvalidPlanetConfig, Planet> {
  return I.positive(width)
    ? I.positive(height)
      ? E.right(
          new Planet(
            width,
            height,
            pipe(
              obstacles,
              A.reduce(new SerializableSet(), (p, m) =>
                m.add(hashPosition(scale({ width, height })(p)))
              )
            )
          )
        )
      : E.left(new InvalidPlanetHeight())
    : E.left(new InvalidPlanetWidth())
}

export class InvalidPlanetWidth {
  readonly _tag = "InvalidPlanetWidth"
}

export class InvalidPlanetHeight {
  readonly _tag = "InvalidPlanetHeight"
}
