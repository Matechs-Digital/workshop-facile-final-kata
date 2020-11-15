import { reduce } from "./Array"
import { pipe } from "./Function"

export interface Task<A> {
  (): Promise<A>
}

export function of<A>(a: A): Task<A> {
  return () => Promise.resolve(a)
}

export function map<A, B>(f: (a: A) => B) {
  return (fa: Task<A>): Task<B> => () => fa().then(f)
}

export function chain<A, B>(f: (a: A) => Task<B>) {
  return (fa: Task<A>): Task<B> => () => fa().then((a) => f(a)())
}

export function tuple<Es extends readonly Task<any>[]>(
  ...tasks: Es
): Task<{ [k in keyof Es]: [Es[k]] extends [Task<infer A>] ? A : never }> {
  return async () => {
    const as = <any[]>[]

    for (const t of tasks) {
      as.push(await t())
    }

    return as as any
  }
}

export type TaskGetA<X extends Task<any>> = [X] extends [Task<infer A>] ? A : never

function bind<A, K, N extends string>(tag: Exclude<N, keyof K>, f: (_: K) => Task<A>) {
  return (
    mk: Task<K>
  ): Task<
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
    mk: Task<K>
  ): Task<
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

const do_ = of({})

export { let_ as let, bind, do_ as do }

export function foreach<A, B>(f: (a: A) => Task<B>) {
  return (self: ReadonlyArray<A>): Task<readonly B[]> =>
    pipe(
      self,
      reduce(of([]) as Task<readonly B[]>, (a, ebs) =>
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
