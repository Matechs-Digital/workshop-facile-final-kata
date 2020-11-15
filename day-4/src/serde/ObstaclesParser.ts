import { reduce } from "../common/Array"
import * as E from "../common/Either"
import { pipe } from "../common/Function"
import * as I from "../common/Int"
import type { InvalidPlanetConfig, ObstaclePosition, Planet } from "../domain/Planet"
import { makePlanet } from "../domain/Planet"

export class ParseObstaclesError {
  readonly _tag = "ParseObstaclesError"
  constructor(readonly actual: string) {}
}

export const obstacleRegex = /^(\d+),(\d+)$/

export function parseObstacle(
  obstacleConfig: string
): E.Either<ParseObstaclesError | I.InvalidInteger, ObstaclePosition> {
  const results = obstacleRegex.exec(obstacleConfig)

  if (results == null) {
    return E.left(new ParseObstaclesError(obstacleConfig))
  }

  if (results.length !== 3) {
    return E.left(new ParseObstaclesError(obstacleConfig))
  }

  return pipe(
    E.tuple(I.parse(results[1]), I.parse(results[2])),
    E.map(([x, y]): ObstaclePosition => ({ x, y }))
  )
}

export function parseObstacles(
  obstaclesConfig: string
): E.Either<ParseObstaclesError | I.InvalidInteger, readonly ObstaclePosition[]> {
  return pipe(
    obstaclesConfig.split(" "),
    reduce(
      E.right([]) as E.Either<
        ParseObstaclesError | I.InvalidInteger,
        readonly ObstaclePosition[]
      >,
      (s, obsOrErr) =>
        pipe(
          obsOrErr,
          E.chain((obs) =>
            pipe(
              parseObstacle(s),
              E.map((o) => [...obs, o])
            )
          )
        )
    )
  )
}
