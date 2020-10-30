/* istanbul ignore file */

import type { Either } from "./either"
import { map } from "./either"
import { pipe } from "./pipe"

export interface Newtype<URI, T> {
  _URI: URI
  _T: T
}

export function newtypeIso<T extends Newtype<any, any>>() {
  return {
    wrap: (_: T["_T"]): T => _ as any,
    unwrap: (_: T): T["_T"] => _ as any
  }
}

export function newtypePrism<T extends Newtype<any, any>>() {
  return <E>(validate: (_: T["_T"]) => Either<E, T["_T"]>) => ({
    wrap: (_: T["_T"]): Either<E, T> =>
      pipe(
        validate(_),
        map((x) => x as any)
      ),
    unwrap: (_: T): T["_T"] => _ as any
  })
}
