/* istanbul ignore file */

import type { Either } from "./Either"
import { map } from "./Either"
import { pipe } from "./Function"

export interface Newtype<URI, T> {
  _URI: URI
  _T: T
}

export function newtype<T extends Newtype<any, any>>() {
  return {
    wrap: (_: T["_T"]): T => _ as any,
    unwrap: (_: T): T["_T"] => _ as any
  }
}

export function newtypeSmart<T extends Newtype<any, any>>() {
  return <E>(validate: (_: T["_T"]) => Either<E, T["_T"]>) => ({
    wrap: (_: T["_T"]): Either<E, T> =>
      pipe(
        validate(_),
        map((x) => x as any)
      ),
    unwrap: (_: T): T["_T"] => _ as any
  })
}
