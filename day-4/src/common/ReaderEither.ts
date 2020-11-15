import * as A from "./Array"
import * as E from "./Either"
import { pipe } from "./Function"
import type { Option } from "./Option"
import type { Task } from "./Task"
import * as TE from "./TaskEither"

export interface ReaderEither<R, E, A> {
  (r: R): E.Either<E, A>
}

export function left<E>(e: E) {
  return fromEither(E.left(e))
}

export function right<A>(a: A) {
  return fromEither(E.right(a))
}

export function access<R, A>(f: (r: R) => A): ReaderEither<R, never, A> {
  return (r) => E.right(f(r))
}

export function accessM<R, R2, E, A>(
  f: (r: R) => ReaderEither<R2, E, A>
): ReaderEither<R & R2, E, A> {
  return (r) => f(r)(r)
}

export function provide<R>(r: R) {
  return <R2, E, A>(self: ReaderEither<R & R2, E, A>): ReaderEither<R2, E, A> => (r2) =>
    self({ ...r2, ...r })
}

export function run<E, A>(self: ReaderEither<unknown, E, A>) {
  return self({})
}

export function fromEither<E, A>(self: E.Either<E, A>): ReaderEither<unknown, E, A> {
  return () => self
}

export function map<A, B>(f: (a: A) => B) {
  return <R, E>(fa: ReaderEither<R, E, A>): ReaderEither<R, E, B> => (r) =>
    pipe(fa(r), E.map(f))
}

export function chain<R2, A, E2, B>(f: (a: A) => ReaderEither<R2, E2, B>) {
  return <R, E>(fa: ReaderEither<R, E, A>): ReaderEither<R & R2, E | E2, B> => (r) =>
    pipe(
      fa(r),
      E.chain((a) => f(a)(r))
    )
}

export function tuple<Es extends readonly ReaderEither<any, any, any>[]>(
  ...tasks: Es
): ReaderEither<
  {
    [k in keyof Es]: [Es[k]] extends [ReaderEither<infer R, any, any>] ? R : never
  }[number],
  {
    [k in keyof Es]: [Es[k]] extends [ReaderEither<any, infer E, any>] ? E : never
  }[number],
  { [k in keyof Es]: [Es[k]] extends [ReaderEither<any, any, infer A>] ? A : never }
> {
  return (r) => {
    const as = <any[]>[]

    for (const t of tasks) {
      const x = t(r)
      if (x._tag === "Left") {
        return x
      }
      as.push(x.right)
    }

    return right(as) as any
  }
}

export function catchAll<R1, E, E1, B>(f: (e: E) => ReaderEither<R1, E1, B>) {
  return <R, A>(self: ReaderEither<R, E, A>): ReaderEither<R & R1, E1, A | B> => (
    r
  ) => {
    const x = self(r)
    return x._tag === "Left" ? f(x.left)(r) : E.right(x.right)
  }
}

export type ReaderEitherGetR<X extends ReaderEither<any, any, any>> = [X] extends [
  ReaderEither<infer R, infer E, infer A>
]
  ? R
  : never

export type ReaderEitherGetE<X extends ReaderEither<any, any, any>> = [X] extends [
  ReaderEither<infer R, infer E, infer A>
]
  ? E
  : never

export type ReaderEitherGetA<X extends ReaderEither<any, any, any>> = [X] extends [
  ReaderEither<infer R, infer E, infer A>
]
  ? A
  : never

function bind<R, E, A, K, N extends string>(
  tag: Exclude<N, keyof K>,
  f: (_: K) => ReaderEither<R, E, A>
) {
  return <R2, E2>(
    mk: ReaderEither<R2, E2, K>
  ): ReaderEither<
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
    mk: ReaderEither<R2, E2, K>
  ): ReaderEither<
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

export function foreach<R, A, E, B>(f: (a: A) => ReaderEither<R, E, B>) {
  return (self: ReadonlyArray<A>): ReaderEither<R, E, readonly B[]> =>
    pipe(
      self,
      A.reduce(right([]) as ReaderEither<R, E, readonly B[]>, (a, ebs) =>
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

export function repeatUntilSome<R, E, A>(
  self: ReaderEither<R, E, Option<A>>
): ReaderEither<R, E, A> {
  return (r) => {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const result = self(r)

      if (result._tag === "Left") {
        return result
      }

      if (result.right._tag === "Some") {
        return E.right(result.right.value)
      }
    }
  }
}

export function reduce<S>(initial: S) {
  return <R, E, A>(f: (a: A, s: S) => ReaderEither<R, E, S>) => (
    as: ReadonlyArray<A>
  ) =>
    pipe(
      as,
      A.reduce(right(initial) as ReaderEither<R, E, S>, (a, ms) =>
        pipe(
          ms,
          chain((s) => f(a, s))
        )
      )
    )
}
