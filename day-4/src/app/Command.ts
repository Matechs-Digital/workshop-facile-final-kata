export type Command = GoLeft | GoRight | GoForward | GoBackward

export class GoLeft {
  readonly _tag = "GoLeft"
}

export class GoRight {
  readonly _tag = "GoRight"
}

export class GoForward {
  readonly _tag = "GoForward"
}

export class GoBackward {
  readonly _tag = "GoBackward"
}

export const Commands = {
  Left: new GoLeft(),
  Right: new GoRight(),
  Forward: new GoForward(),
  Backward: new GoBackward()
}
