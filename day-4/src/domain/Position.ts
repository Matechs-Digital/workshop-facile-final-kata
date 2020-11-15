import * as E from "../common/Either"
import * as I from "../common/Int"
import type { Planet } from "./Planet"
import { InvalidHeight, InvalidWidth } from "./Planet"

export class Position {
  readonly _tag = "Position"
  constructor(readonly x: I.Int, readonly y: I.Int) {}
}

export const makePosition = (planet: Planet) => (
  x: I.Int,
  y: I.Int
): E.Either<InvalidWidth | InvalidHeight, Position> =>
  I.between(I.Zero, planet.width)(x)
    ? I.between(I.Zero, planet.height)(y)
      ? E.right(new Position(x, y))
      : E.left(new InvalidHeight())
    : E.left(new InvalidWidth())
