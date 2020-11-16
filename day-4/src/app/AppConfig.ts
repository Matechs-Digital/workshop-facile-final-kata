import * as P from "path"

import { pipe } from "../common/Function"
import * as RTE from "../common/ReaderTaskEither"
import { readFile } from "./ReadFile"

export interface AppConfig {
  config: { planet: string; initial: string; obstacles: string }
}

export function provideAppConfig(config: AppConfig["config"]) {
  return <R, E, A>(self: RTE.ReaderTaskEither<R & AppConfig, E, A>) =>
    RTE.provide<AppConfig>({ config })(self)
}

export class InvalidPlanetFile {
  readonly _tag = "InvalidPlanetFile"
  constructor(readonly actual: string) {}
}

export const provideLiveAppConfig = RTE.provideM(
  pipe(
    RTE.tuple(
      readFile(P.join(__dirname, "../../config/planet.txt")),
      readFile(P.join(__dirname, "../../config/initial.txt"))
    ),
    RTE.chain(([planet, initial]) => {
      const lines = planet.split("\n")
      if (lines.length !== 2) {
        return RTE.left(new InvalidPlanetFile(planet))
      } else {
        return RTE.right([lines[0], initial, lines[1]])
      }
    }),
    RTE.map(
      ([planet, initial, obstacles]): AppConfig => ({
        config: { initial, obstacles, planet }
      })
    )
  )
)
