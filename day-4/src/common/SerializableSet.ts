export class SerializableSet<A> {
  private innerSet: Set<A>
  constructor(from?: Iterable<A>) {
    this.innerSet = new Set(from)
  }
  toJSON() {
    return Array.from(this.innerSet)
  }
  readonly add = (a: A) => new SerializableSet(this.innerSet.add(a))
  readonly has = (a: A) => this.innerSet.has(a)
}
