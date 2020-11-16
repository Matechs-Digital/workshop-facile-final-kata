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

export const provideLiveAppConfig = RTE.provideM(
  pipe(
    RTE.tuple(
      readFile(P.join(__dirname, "../../config/planet.txt")),
      readFile(P.join(__dirname, "../../config/initial.txt")),
      readFile(P.join(__dirname, "../../config/obstacles.txt"))
    ),
    RTE.map(
      ([planet, initial, obstacles]): AppConfig => ({
        config: { initial, obstacles, planet }
      })
    )
  )
)
