import * as P from "path"

import { LiveReadFile, readFile } from "./app/ReadFile"
import { pipe } from "./common/Function"
import * as RTE from "./common/ReaderTaskEither"
import * as TE from "./common/TaskEither"

pipe(
  RTE.tuple(
    readFile(P.join(__dirname, "../config/planet.txt")),
    readFile(P.join(__dirname, "../config/initial.txt")),
    readFile(P.join(__dirname, "../config/obstacles.txt"))
  ),
  RTE.provide(LiveReadFile),
  RTE.run,
  TE.fold(
    (e) => async () => {
      console.log(JSON.stringify(e, null, 2))
    },
    (s) => async () => {
      console.log(s)
    }
  )
)()
