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
import { parseCommands } from "./serde/CommandParser"

export class AtomicRef<A> {
  private ref: A
  constructor(initial: A) {
    this.ref = initial
  }
  readonly get = () => this.ref
  readonly set = (a: A) => {
    this.ref = a
  }
}

export const runMainLoop = pipe(
  begin,
  RTE.chain(
    RTE.repeatWithState((state) =>
      pipe(
        getStrLn,
        RTE.chain((s) => {
          if (s.length === 0) {
            return RTE.right(none)
          }

          return RTE.sync(() => {
            console.log(parseCommands(s))
            return some(state)
          })
        })
      )
    )
  ),
  providePlanet
)

pipe(
  RTE.tuple(
    readFile(P.join(__dirname, "../config/planet.txt")),
    readFile(P.join(__dirname, "../config/initial.txt")),
    readFile(P.join(__dirname, "../config/obstacles.txt"))
  ),
  RTE.chain(([planet, initial, obstacles]) =>
    pipe(runMainLoop, provideAppConfig({ initial, obstacles, planet }))
  ),
  RTE.provide(LiveReadFile),
  RTE.provide(LiveReadline),
  RTE.run,
  TE.fold(
    (e) => async () => {
      console.error(JSON.stringify(e, null, 2))
      process.exit(1)
    },
    () => async () => {
      process.exit(0)
    }
  )
)()
