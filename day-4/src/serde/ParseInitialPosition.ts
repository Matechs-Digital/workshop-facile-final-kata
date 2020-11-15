import * as E from "../common/Either"
import { pipe } from "../common/Function"
import * as I from "../common/Int"
import { Orientation } from "../domain/Orientation"
import type { InvalidPlanetConfig, Planet } from "../domain/Planet"
import { makePlanet } from "../domain/Planet"

export class ParseInitialPositionError {
  readonly _tag = "ParsePlanetError"
  constructor(readonly actual: string) {}
}

export const initialPositionRegex = /^(\d+),(\d+):(N|S|E|W)$/

export class InitialPosition {
  readonly _tag = "InitialPosition"
  constructor(readonly x: I.Int, readonly y: I.Int, readonly o: Orientation) {}
}

export function parseInitialPosition(
  initialPositionConfig: string
): E.Either<ParseInitialPositionError, InitialPosition> {
  const results = initialPositionRegex.exec(initialPositionConfig)

  if (results == null) {
    return E.left(new ParseInitialPositionError(initialPositionConfig))
  }

  if (results.length !== 4) {
    return E.left(new ParseInitialPositionError(initialPositionConfig))
  }

  const o = results[3]

  const orientation =
    o === "N"
      ? Orientation.North
      : o === "S"
      ? Orientation.South
      : o === "W"
      ? Orientation.West
      : Orientation.East

  return pipe(
    E.tuple(I.parse(results[1]), I.parse(results[2])),
    E.map(([x, y]) => new InitialPosition(x, y, orientation)),
    E.catchAll(() => E.left(new ParseInitialPositionError(initialPositionConfig)))
  )
}
