import type { ParseObstaclesError } from "./ObstaclesParser"
import type { ParseInitialPositionError } from "./ParseInitialPosition"
import type { ParsePlanetError } from "./PlanetParser"

export type ParseError =
  | ParseInitialPositionError
  | ParsePlanetError
  | ParseObstaclesError
