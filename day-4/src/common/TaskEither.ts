import { reduce } from "./Array"
import * as E from "./Either"
import { pipe } from "./Function"
import type { Option } from "./Option"
import type { Task } from "./Task"

export interface TaskEither<E, A> extends Task<E.Either<E, A>> {}

export function left<E>(e: E) {
  return fromEither(E.left(e))
}

export function right<A>(a: A) {
  return fromEither(E.right(a))
}

export function rightTask<A>(a: Task<A>): TaskEither<never, A> {
  return () => a().then(E.right)
}

export function fromEither<E, A>(self: E.Either<E, A>): TaskEither<E, A> {
  return () => Promise.resolve(self)
}

export function map<A, B>(f: (a: A) => B) {
  return <E>(fa: TaskEither<E, A>): TaskEither<E, B> => () => fa().then(E.map(f))
}

export function chain<A, E2, B>(f: (a: A) => TaskEither<E2, B>) {
  return <E>(fa: TaskEither<E, A>): TaskEither<E | E2, B> => () =>
    fa().then(
      (a): Promise<E.Either<E | E2, B>> =>
        a._tag === "Right" ? f(a.right)() : Promise.resolve(E.left(a.left))
    )
}

export function tuple<Es extends readonly TaskEither<any, any>[]>(
  ...tasks: Es
): TaskEither<
  { [k in keyof Es]: [Es[k]] extends [TaskEither<infer E, any>] ? E : never }[number],
  { [k in keyof Es]: [Es[k]] extends [TaskEither<any, infer A>] ? A : never }
> {
  return async () => {
    const as = <any[]>[]

    for (const t of tasks) {
      const x = await t()
      if (x._tag === "Left") {
        return t
      }
      as.push(x.right)
    }

    return right(as) as any
  }
}

export function fold<E, A, B, C>(
  onLeft: (e: E) => Task<C>,
  onRight: (a: A) => Task<B>
) {
  return (self: TaskEither<E, A>) => async () => {
    const x = await self()
    return x._tag === "Left" ? await onLeft(x.left)() : await onRight(x.right)()
  }
}

export function catchAll<E, E1, B>(f: (e: E) => TaskEither<E1, B>) {
  return <A>(self: TaskEither<E, A>): TaskEither<E1, A | B> => async () => {
    const x = await self()
    return x._tag === "Left" ? await f(x.left)() : E.right(x.right)
  }
}

export type TaskEitherGetE<X extends TaskEither<any, any>> = [X] extends [
  TaskEither<infer E, infer A>
]
  ? E
  : never

export type TaskEitherGetA<X extends TaskEither<any, any>> = [X] extends [
  TaskEither<infer E, infer A>
]
  ? A
  : never

function bind<E, A, K, N extends string>(
  tag: Exclude<N, keyof K>,
  f: (_: K) => TaskEither<E, A>
) {
  return <E2>(
    mk: TaskEither<E2, K>
  ): TaskEither<
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
    mk: TaskEither<E2, K>
  ): TaskEither<
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

export function foreach<A, E, B>(f: (a: A) => TaskEither<E, B>) {
  return (self: ReadonlyArray<A>): TaskEither<E, readonly B[]> =>
    pipe(
      self,
      reduce(right([]) as TaskEither<E, readonly B[]>, (a, ebs) =>
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

export function repeatUntilSome<E, A>(
  self: TaskEither<E, Option<A>>
): TaskEither<E, A> {
  return async () => {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const result = await self()

      if (result._tag === "Left") {
        return result
      }

      if (result.right._tag === "Some") {
        return E.right(result.right.value)
      }
    }
  }
}
