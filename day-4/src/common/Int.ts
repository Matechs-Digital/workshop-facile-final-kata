/* istanbul ignore file */

import { left, right } from "../utils/either"
import { flow } from "../utils/flow"
import type { Newtype } from "../utils/newtype"
import { newtypeIso, newtypePrism } from "../utils/newtype"

export interface Int extends Newtype<"Int", number> {}

export class InvalidInteger {
  readonly _tag = "InvalidInteger"
}

export const Int = newtypePrism<Int>()((n) =>
  Number.isInteger(n) ? right(n) : left(new InvalidInteger())
)

export const IntIso = newtypeIso<Int>()

export const Zero = newtypeIso<Int>().wrap(0)

export const One = newtypeIso<Int>().wrap(1)

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
    newtypeIso<Int>().wrap
  )
}

export function add(m: Int) {
  return flow(Int.unwrap, (n) => n + Int.unwrap(m), newtypeIso<Int>().wrap)
}

export function sub(m: Int) {
  return flow(Int.unwrap, (n) => n - Int.unwrap(m), newtypeIso<Int>().wrap)
}

export const { unwrap, wrap } = Int
export const { wrap: wrapIso } = IntIso
