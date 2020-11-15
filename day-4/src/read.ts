import * as P from "path"

import { provideAppConfig } from "./app/AppConfig"
import { begin, providePlanet } from "./app/Program"
import type { ProgramState } from "./app/ProgramState"
import { LiveReadFile, readFile } from "./app/ReadFile"
import { getStrLn, LiveReadline } from "./app/Readline"
import { pipe } from "./common/Function"
import { none, some } from "./common/Option"
import * as RTE from "./common/ReaderTaskEither"
import * as TE from "./common/TaskEither"

function runLoop<R, E>(e: RTE.ReaderTaskEither<R, E, ProgramState>) {
  return pipe(
    e,
    RTE.chain((initial) =>
      RTE.repeatUntilSome(
        pipe(
          getStrLn,
          RTE.chain((s) => {
            if (s.length === 0) {
              return RTE.right(some(undefined))
            }

            return RTE.sync(() => {
              console.log(s)
              return none
            })
          })
        )
      )
    )
  )
}

pipe(
  RTE.tuple(
    readFile(P.join(__dirname, "../config/planet.txt")),
    readFile(P.join(__dirname, "../config/initial.txt")),
    readFile(P.join(__dirname, "../config/obstacles.txt"))
  ),
  RTE.chain(([planet, initial, obstacles]) =>
    pipe(
      begin,
      runLoop,
      providePlanet,
      provideAppConfig({ initial, obstacles, planet })
    )
  ),
  RTE.provide(LiveReadFile),
  RTE.provide(LiveReadline),
  RTE.run,
  TE.fold(
    (e) => async () => {
      console.error(JSON.stringify(e, null, 2))
    },
    (s) => async () => {
      console.log(JSON.stringify(s, null, 2))
    }
  )
)()
