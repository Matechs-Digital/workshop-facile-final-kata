export type NonEmptyArray<A> = readonly A[] & { readonly 0: A }

export function append<A>(a: A) {
  return (self: NonEmptyArray<A>): NonEmptyArray<A> => [...self, a] as any
}
