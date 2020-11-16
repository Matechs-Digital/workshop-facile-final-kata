import * as RTE from "./ReaderTaskEither"

export interface Ref<A> {
  get: RTE.ReaderTaskEither<unknown, never, A>
  set: (a: A) => RTE.ReaderTaskEither<unknown, never, A>
  update: (f: (a: A) => A) => RTE.ReaderTaskEither<unknown, never, A>
}

export function makeRef<A>(a: A): Ref<A> {
  let current = a
  return {
    get: RTE.sync(() => current),
    set: (a) =>
      RTE.sync(() => {
        current = a
        return a
      }),
    update: (f) =>
      RTE.sync(() => {
        current = f(current)
        return current
      })
  }
}
