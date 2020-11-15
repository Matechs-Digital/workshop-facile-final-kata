/* istanbul ignore file */

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
