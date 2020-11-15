import * as E from "../common/Either"
import * as I from "../common/Int"
import type { Planet } from "./Planet"

export class Position {
  readonly _tag = "Position"
  constructor(readonly x: I.Int, readonly y: I.Int) {}
}

export class InvalidPositionWidth {
  readonly _tag = "InvalidPositionWidth"
}

export class InvalidPositionHeight {
  readonly _tag = "InvalidPositionHeight"
}

export const makePosition = (planet: Planet) => (
  x: I.Int,
  y: I.Int
): E.Either<InvalidPositionWidth | InvalidPositionHeight, Position> =>
  I.between(I.Zero, planet.width)(x)
    ? I.between(I.Zero, planet.height)(y)
      ? E.right(new Position(x, y))
      : E.left(new InvalidPositionHeight())
    : E.left(new InvalidPositionWidth())
