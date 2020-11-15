export function reduce<A, S>(
  a: readonly A[],
  initial: S,
  reducer: (a: A, s: S) => S
): S {
  let current = initial
  for (const x of a) {
    current = reducer(x, current)
  }
  return current
}
