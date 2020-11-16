import { pipe } from "../common/Function"
import * as RTE from "../common/ReaderTaskEither"
import type { Planet } from "../domain/Planet"
import { addObstacles } from "../domain/Planet"
import { parseObstacles } from "../serde/ObstaclesParser"
import { parsePlanet } from "../serde/PlanetParser"
import type { AppConfig } from "./AppConfig"

export interface PlanetContext {
  planetContext: {
    planet: Planet
  }
}

export const provideLivePlanetContext = pipe(
  pipe(
    RTE.do,
    RTE.bind("config", () => RTE.access(({ config }: AppConfig) => config)),
    RTE.bind("planet", ({ config }) => RTE.fromEither(parsePlanet(config.planet))),
    RTE.bind("obstacles", ({ config }) =>
      RTE.fromEither(parseObstacles(config.obstacles))
    ),
    RTE.let("planetWithObstacles", ({ obstacles, planet }) =>
      addObstacles(...obstacles)(planet)
    ),
    RTE.map(({ planet }): PlanetContext => ({ planetContext: { planet } })),
    RTE.provideM
  )
)
