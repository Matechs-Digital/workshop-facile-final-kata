import { getStrLn, LiveReadline } from "./app/Readline"
import { pipe } from "./common/Function"
import { provide, run } from "./common/ReaderTaskEither"
import * as TE from "./common/TaskEither"

pipe(
  getStrLn,
  provide(LiveReadline),
  run,
  TE.fold(
    (e) => async () => {
      console.log(JSON.stringify(e, null, 2))
    },
    (s) => async () => {
      console.log(s)
    }
  )
)()
