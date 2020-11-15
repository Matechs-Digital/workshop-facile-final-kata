/* istanbul ignore file */

import { reduce } from "./Array"
import { pipe } from "./Function"

export interface Left<E> {
  readonly _tag: "Left"
  readonly left: E
}

export interface Right<A> {
  readonly _tag: "Right"
  readonly right: A
}

export type Either<E, A> = Left<E> | Right<A>

export function left<E>(e: E): Either<E, never> {
  return {
    _tag: "Left",
    left: e
  }
}

export function right<A>(a: A): Either<never, A> {
  return {
    _tag: "Right",
    right: a
  }
}

export function map<A, B>(f: (a: A) => B) {
  return <E>(fa: Either<E, A>): Either<E, B> =>
    fa._tag === "Left"
      ? fa
      : {
          _tag: "Right",
          right: f(fa.right)
        }
}

export function chain<A, E2, B>(f: (a: A) => Either<E2, B>) {
  return <E>(fa: Either<E, A>): Either<E | E2, B> =>
    fa._tag === "Left" ? fa : f(fa.right)
}

export function tuple<Es extends readonly Either<any, any>[]>(
  ...eithers: Es
): Either<
  { [k in keyof Es]: [Es[k]] extends [Either<infer E, any>] ? E : never }[number],
  { [k in keyof Es]: [Es[k]] extends [Either<any, infer A>] ? A : never }
> {
  const as = <any[]>[]

  for (const e of eithers) {
    if (e._tag === "Left") {
      return e
    }
    as.push(e.right)
  }

  return right(as) as any
}

export function fold<E, A, B, C>(onLeft: (e: E) => C, onRight: (a: A) => B) {
  return (self: Either<E, A>) =>
    self._tag === "Left" ? onLeft(self.left) : onRight(self.right)
}

export function catchAll<E, E1, B>(f: (e: E) => Either<E1, B>) {
  return <A>(self: Either<E, A>): Either<E1, A | B> =>
    self._tag === "Left" ? f(self.left) : self
}

export type EitherGetE<X extends Either<any, any>> = [X] extends [
  Either<infer E, infer A>
]
  ? E
  : never

export type EitherGetA<X extends Either<any, any>> = [X] extends [
  Either<infer E, infer A>
]
  ? A
  : never

function bind<E, A, K, N extends string>(
  tag: Exclude<N, keyof K>,
  f: (_: K) => Either<E, A>
) {
  return <E2>(
    mk: Either<E2, K>
  ): Either<
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
  return <E2>(
    mk: Either<E2, K>
  ): Either<
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

export function foreach<A, E, B>(f: (a: A) => Either<E, B>) {
  return (self: ReadonlyArray<A>): Either<E, readonly B[]> =>
    pipe(
      self,
      reduce(right([]) as Either<E, readonly B[]>, (a, ebs) =>
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
