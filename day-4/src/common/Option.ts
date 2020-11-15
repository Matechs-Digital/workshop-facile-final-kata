/* istanbul ignore file */

import { reduce } from "./Array"
import { pipe } from "./Function"

export interface None {
  readonly _tag: "None"
}

export interface Some<A> {
  readonly _tag: "Some"
  readonly value: A
}

export type Option<A> = None | Some<A>

export const none: Option<never> = { _tag: "None" }

export function some<A>(a: A): Option<A> {
  return {
    _tag: "Some",
    value: a
  }
}

export function map<A, B>(f: (a: A) => B) {
  return (fa: Option<A>): Option<B> =>
    fa._tag === "None"
      ? fa
      : {
          _tag: "Some",
          value: f(fa.value)
        }
}

export function chain<A, B>(f: (a: A) => Option<B>) {
  return (fa: Option<A>): Option<B> => (fa._tag === "None" ? fa : f(fa.value))
}

export function tuple<Es extends readonly Option<any>[]>(
  ...eithers: Es
): Option<{ [k in keyof Es]: [Es[k]] extends [Option<infer A>] ? A : never }> {
  const as = <any[]>[]

  for (const e of eithers) {
    if (e._tag === "None") {
      return e
    }
    as.push(e.value)
  }

  return some(as) as any
}

export function fold<A, B, C>(onNone: () => C, onSome: (a: A) => B) {
  return (self: Option<A>) => (self._tag === "None" ? onNone() : onSome(self.value))
}

export function catchAll<B>(f: () => Option<B>) {
  return <A>(self: Option<A>): Option<A | B> => (self._tag === "None" ? f() : self)
}

export type OptionGetA<X extends Option<any>> = [X] extends [Option<infer A>]
  ? A
  : never

function bind<A, K, N extends string>(
  tag: Exclude<N, keyof K>,
  f: (_: K) => Option<A>
) {
  return (
    mk: Option<K>
  ): Option<
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
  return (
    mk: Option<K>
  ): Option<
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

const do_ = some({})

export { let_ as let, bind, do_ as do }

export function foreach<A, B>(f: (a: A) => Option<B>) {
  return (self: ReadonlyArray<A>): Option<readonly B[]> =>
    pipe(
      self,
      reduce(some([]) as Option<readonly B[]>, (a, ebs) =>
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
