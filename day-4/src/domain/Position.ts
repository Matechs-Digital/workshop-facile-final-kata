import * as I from "../common/Int"
import type { Newtype } from "../common/Newtype"
import { newtype } from "../common/Newtype"

export interface Position {
  readonly x: I.Int
  readonly y: I.Int
}

export interface PositionHash extends Newtype<"PositionHash", string> {}

export const PositionHash = newtype<PositionHash>()

export function hashPosition(self: Position) {
  return PositionHash.wrap(`x: ${self.x} - y: ${self.y}`)
}

export function scale(to: { width: I.Int; height: I.Int }) {
  return (self: Position): Position => ({
    x: I.mod(to.width)(self.x),
    y: I.mod(to.height)(self.y)
  })
}
