import type { Orientation } from "../domain/Orientation"
import type { Planet } from "../domain/Planet"
import type { Position } from "../domain/Position"
import type { Rover } from "../domain/Rover"

export interface ProgramState {
  planet: Planet
  rover: Rover
  history: readonly HistoryEntry[]
}

export class HistoryEntry {
  readonly _tag = "HistoryEntry"
  constructor(readonly position: Position, readonly orientation: Orientation) {}
}
