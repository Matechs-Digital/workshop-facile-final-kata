import * as A from "./Array"
import * as E from "./Either"
import { pipe } from "./Function"
import type { Option } from "./Option"
import type { Task } from "./Task"
import * as TE from "./TaskEither"

export interface ReaderTaskEither<R, E, A> {
  (r: R): TE.TaskEither<E, A>
}

export function left<E>(e: E) {
  return fromEither(E.left(e))
}

export function right<A>(a: A) {
  return fromEither(E.right(a))
}

export function rightTask<A>(a: Task<A>): ReaderTaskEither<unknown, never, A> {
  return () => TE.rightTask(a)
}

export function access<R, A>(f: (r: R) => A): ReaderTaskEither<R, never, A> {
  return (r) => TE.right(f(r))
}

export function accessM<R, R2, E, A>(
  f: (r: R) => ReaderTaskEither<R2, E, A>
): ReaderTaskEither<R & R2, E, A> {
  return (r) => f(r)(r)
}

export function provide<R>(r: R) {
  return <R2, E, A>(
    self: ReaderTaskEither<R & R2, E, A>
  ): ReaderTaskEither<R2, E, A> => (r2) => self({ ...r2, ...r })
}

export function provideM<R3, E2, R>(mr: ReaderTaskEither<R3, E2, R>) {
  return <R2, E, A>(
    self: ReaderTaskEither<R & R2, E, A>
  ): ReaderTaskEither<R2 & R3, E | E2, A> =>
    pipe(
      mr,
      chain((r) => provide(r)(self))
    )
}

export function run<E, A>(self: ReaderTaskEither<unknown, E, A>) {
  return self({})
}

export function fromEither<E, A>(
  self: E.Either<E, A>
): ReaderTaskEither<unknown, E, A> {
  return () => TE.fromEither(self)
}

export function fromTaskEither<E, A>(
  self: TE.TaskEither<E, A>
): ReaderTaskEither<unknown, E, A> {
  return () => self
}

export function sync<A>(f: () => A): ReaderTaskEither<unknown, never, A> {
  return () => () => Promise.resolve(E.right(f()))
}

export function map<A, B>(f: (a: A) => B) {
  return <R, E>(fa: ReaderTaskEither<R, E, A>): ReaderTaskEither<R, E, B> => (
    r
  ) => () => fa(r)().then(E.map(f))
}

export function chain<R2, A, E2, B>(f: (a: A) => ReaderTaskEither<R2, E2, B>) {
  return <R, E>(fa: ReaderTaskEither<R, E, A>): ReaderTaskEither<R & R2, E | E2, B> => (
    r
  ) => () =>
    fa(r)().then(
      (a): Promise<E.Either<E | E2, B>> =>
        a._tag === "Right" ? f(a.right)(r)() : Promise.resolve(E.left(a.left))
    )
}

export function tuple<Es extends readonly ReaderTaskEither<any, any, any>[]>(
  ...tasks: Es
): ReaderTaskEither<
  [Es[number]] extends [ReaderTaskEither<infer R, infer E, infer A>] ? R : never,
  [Es[number]] extends [ReaderTaskEither<infer R, infer E, infer A>] ? E : never,
  Readonly<
    {
      [k in keyof Es]: [Es[k]] extends [ReaderTaskEither<any, any, infer A>] ? A : never
    }
  >
> {
  return (r) => async () => {
    const as = <any[]>[]

    for (const t of tasks) {
      const x = await t(r)()
      if (x._tag === "Left") {
        return x
      }
      as.push(x.right)
    }

    return E.right(as) as any
  }
}

export function catchAll<R1, E, E1, B>(f: (e: E) => ReaderTaskEither<R1, E1, B>) {
  return <R, A>(
    self: ReaderTaskEither<R, E, A>
  ): ReaderTaskEither<R & R1, E1, A | B> => (r) => async () => {
    const x = await self(r)()
    return x._tag === "Left" ? await f(x.left)(r)() : E.right(x.right)
  }
}

export type ReaderTaskEitherGetR<X extends ReaderTaskEither<any, any, any>> = [
  X
] extends [ReaderTaskEither<infer R, infer E, infer A>]
  ? R
  : never

export type ReaderTaskEitherGetE<X extends ReaderTaskEither<any, any, any>> = [
  X
] extends [ReaderTaskEither<infer R, infer E, infer A>]
  ? E
  : never

export type ReaderTaskEitherGetA<X extends ReaderTaskEither<any, any, any>> = [
  X
] extends [ReaderTaskEither<infer R, infer E, infer A>]
  ? A
  : never

function bind<R, E, A, K, N extends string>(
  tag: Exclude<N, keyof K>,
  f: (_: K) => ReaderTaskEither<R, E, A>
) {
  return <R2, E2>(
    mk: ReaderTaskEither<R2, E2, K>
  ): ReaderTaskEither<
    R & R2,
    E | E2,
    K &
      {
        [k in N]: A
      }
  > =>
    pipe(
      mk,
      chain((k) =>
        pipe(
          f(k),
          map(
            (
              a
            ): K &
              {
                [k in N]: A
              } => ({ ...k, [tag]: a } as any)
          )
        )
      )
    )
}

function let_<A, K, N extends string>(tag: Exclude<N, keyof K>, f: (_: K) => A) {
  return <R2, E2>(
    mk: ReaderTaskEither<R2, E2, K>
  ): ReaderTaskEither<
    R2,
    E2,
    K &
      {
        [k in N]: A
      }
  > =>
    pipe(
      mk,
      map(
        (
          k
        ): K &
          {
            [k in N]: A
          } => ({ ...k, [tag]: f(k) } as any)
      )
    )
}

const do_ = right({})

export { let_ as let, bind, do_ as do }

export function foreach<R, A, E, B>(f: (a: A) => ReaderTaskEither<R, E, B>) {
  return (self: ReadonlyArray<A>): ReaderTaskEither<R, E, readonly B[]> =>
    pipe(
      self,
      A.reduce(right([]) as ReaderTaskEither<R, E, readonly B[]>, (a, ebs) =>
        pipe(
          ebs,
          chain((bs) =>
            pipe(
              f(a),
              map((b) => [...bs, b])
            )
          )
        )
      )
    )
}

export function repeatWithState<S, R, E>(
  self: (s: S) => ReaderTaskEither<R, E, Option<S>>
): (s: S) => ReaderTaskEither<R, E, void> {
  return (s) => (r) => async () => {
    let current = s
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const result = await self(current)(r)()

      if (result._tag === "Left") {
        return result
      }

      if (result.right._tag === "None") {
        return E.right(undefined)
      } else {
        current = result.right.value
      }
    }
  }
}

export function reduce<S>(initial: S) {
  return <R, E, A>(f: (a: A, s: S) => ReaderTaskEither<R, E, S>) => (
    as: ReadonlyArray<A>
  ) =>
    pipe(
      as,
      A.reduce(right(initial) as ReaderTaskEither<R, E, S>, (a, ms) =>
        pipe(
          ms,
          chain((s) => f(a, s))
        )
      )
    )
}
