import { pipe } from "../common/Function"
import type { NonEmptyArray } from "../common/NonEmptyArray"
import * as RTE from "../common/ReaderTaskEither"
import type { Ref } from "../common/Ref"
import { makeRef } from "../common/Ref"
import type { Orientation } from "../domain/Orientation"
import type { Position } from "../domain/Position"
import type { Rover } from "../domain/Rover"
import { makeRover } from "../domain/Rover"

export interface RoverState {
  rover: Rover
  history: NonEmptyArray<RoverHistoricPosition>
}

export class RoverHistoricPosition {
  readonly _tag = "HistoryEntry"
  constructor(readonly position: Position, readonly orientation: Orientation) {}
}

export interface RoverContext {
  roverState: {
    ref: Ref<RoverState>
  }
}

export const getCurrentState = RTE.accessM(
  ({ roverState: { ref } }: RoverContext) => ref.get
)

export const setCurrentState = (state: RoverState) =>
  RTE.accessM(({ roverState: { ref } }: RoverContext) => ref.set(state))

export const updateCurrentState = (f: (state: RoverState) => RoverState) =>
  RTE.accessM(({ roverState: { ref } }: RoverContext) => ref.update(f))

export const actualize = updateCurrentState((self) => ({
  history: [self.history[self.history.length - 1]],
  rover: self.rover
}))

export const provideLiveRoverContext = pipe(
  makeRover,
  RTE.chain((rover) =>
    makeRef<RoverState>({
      rover,
      history: [new RoverHistoricPosition(rover.position, rover.orientation)]
    })
  ),
  RTE.map(
    (ref): RoverContext => ({
      roverState: {
        ref
      }
    })
  ),
  RTE.provideM
)
