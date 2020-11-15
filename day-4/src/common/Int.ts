/* istanbul ignore file */

import { left, right } from "./Either"
import { flow } from "./Function"
import type { Newtype } from "./Newtype"
import { newtype, newtypeSmart } from "./Newtype"

export interface Int extends Newtype<"Int", number> {}

export class InvalidInteger {
  readonly _tag = "InvalidInteger"
}

export const Int = newtypeSmart<Int>()((n) =>
  Number.isInteger(n) ? right(n) : left(new InvalidInteger())
)

export const IntIso = newtype<Int>()

export const Zero = newtype<Int>().wrap(0)
export const One = newtype<Int>().wrap(1)
export const Two = newtype<Int>().wrap(2)
export const Three = newtype<Int>().wrap(3)
export const Four = newtype<Int>().wrap(4)
export const Five = newtype<Int>().wrap(5)

export function between(min: Int, max: Int) {
  return flow(Int.unwrap, (n) => n >= Int.unwrap(min) && n <= Int.unwrap(max))
}

export function gte(min: Int) {
  return flow(Int.unwrap, (n) => n >= Int.unwrap(min))
}

export function mod(m: Int) {
  return flow(
    Int.unwrap,
    (n) => n % Int.unwrap(m),
    (n) => (n < 0 ? n + Int.unwrap(m) : n),
    newtype<Int>().wrap
  )
}

export function add(m: Int) {
  return flow(Int.unwrap, (n) => n + Int.unwrap(m), newtype<Int>().wrap)
}

export function sub(m: Int) {
  return flow(Int.unwrap, (n) => n - Int.unwrap(m), newtype<Int>().wrap)
}

export const positive = gte(Zero)

export const { unwrap, wrap } = Int
export const { wrap: wrapIso } = IntIso

export const increment = add(One)

export const decrement = sub(One)
