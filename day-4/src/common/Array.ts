export function reduce<A, S>(
  initial: S,
  reducer: (a: A, s: S) => S
): (a: readonly A[]) => S {
  return (a) => {
    let current = initial
    for (const x of a) {
      current = reducer(x, current)
    }
    return current
  }
}
