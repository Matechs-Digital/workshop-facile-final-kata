import type { Orientation } from "../domain/Orientation"
import type { PlanetPosition } from "../domain/PlanetPosition"
import type { Rover } from "../domain/Rover"

export interface ProgramState {
  rover: Rover
  history: readonly HistoryEntry[]
}

export class HistoryEntry {
  readonly _tag = "HistoryEntry"
  constructor(readonly position: PlanetPosition, readonly orientation: Orientation) {}
}
