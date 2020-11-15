export const pattern: <N extends string>(
  n: N
) => {
  <
    X extends { [k in N]: string },
    K extends { [k in X[N]]: (_: Extract<X, { [_tag in N]: k }>) => any }
  >(
    _: K
  ): (m: X) => ReturnType<K[keyof K]>
  <
    X extends { [k in N]: string },
    K extends Partial<{ [k in X[N]]: (_: Extract<X, { [_tag in N]: k }>) => any }>,
    H
  >(
    _: K & { [k in X[N]]?: (_: Extract<X, { [_tag in N]: k }>) => any },
    __: (_: Exclude<X, { _tag: keyof K }>) => H
  ): (m: X) => { [k in keyof K]: ReturnType<NonNullable<K[k]>> }[keyof K] | H
} = (n) =>
  ((_: any, d: any) => (m: any) => {
    return (_[m[n]] ? _[m[n]](m) : d(m)) as any
  }) as any

export const matchTag = pattern("_tag")
