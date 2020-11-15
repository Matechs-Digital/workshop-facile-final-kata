export class North {
  readonly _tag = "North"
}

export class South {
  readonly _tag = "South"
}

export class East {
  readonly _tag = "East"
}

export class West {
  readonly _tag = "West"
}

export type Orientation = North | South | East | West

export const Orientation = {
  North: new North(),
  South: new South(),
  East: new East(),
  West: new West()
}
