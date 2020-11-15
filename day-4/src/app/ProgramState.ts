import type { NonEmptyArray } from "../common/NonEmptyArray"
import type { Orientation } from "../domain/Orientation"
import type { Position } from "../domain/Position"
import type { Rover } from "../domain/Rover"

export interface ProgramState {
  rover: Rover
  history: NonEmptyArray<HistoryEntry>
}

export class HistoryEntry {
  readonly _tag = "HistoryEntry"
  constructor(readonly position: Position, readonly orientation: Orientation) {}
}
