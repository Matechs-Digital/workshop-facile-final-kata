import * as A from "../common/Array"
import * as E from "../common/Either"
import { pipe } from "../common/Function"
import * as I from "../common/Int"
import type { Position, PositionHash } from "./Position"
import { hashPosition, scale } from "./Position"

export class Planet {
  readonly _tag = "Planet"
  constructor(
    readonly width: I.Int,
    readonly height: I.Int,
    readonly obstacles: Set<PositionHash>
  ) {}
}

export interface ObstaclePosition extends Position {}

export interface PlanetConfiguration {
  width: I.Int
  height: I.Int
}

export type InvalidPlanetConfig = InvalidPlanetHeight | InvalidPlanetWidth

export function makePlanet({
  height,
  width
}: PlanetConfiguration): E.Either<InvalidPlanetConfig, Planet> {
  return I.positive(width)
    ? I.positive(height)
      ? E.right(new Planet(width, height, new Set()))
      : E.left(new InvalidPlanetHeight())
    : E.left(new InvalidPlanetWidth())
}

export class InvalidPlanetWidth {
  readonly _tag = "InvalidPlanetWidth"
}

export class InvalidPlanetHeight {
  readonly _tag = "InvalidPlanetHeight"
}

export function addObstacles(...obstacles: readonly ObstaclePosition[]) {
  return (self: Planet) =>
    new Planet(
      self.width,
      self.height,
      pipe(
        obstacles,
        A.reduce(self.obstacles, (p, s) => s.add(hashPosition(scale(self)(p))))
      )
    )
}

export interface PlanetContext {
  planetContext: {
    planet: Planet
  }
}
