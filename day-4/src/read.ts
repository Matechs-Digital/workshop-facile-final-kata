import { getStrLn } from "./app/Readline"
import { pipe } from "./common/Function"
import * as TE from "./common/TaskEither"

pipe(
  TE.rightTask(getStrLn),
  TE.fold(
    (e) => async () => {
      console.log(JSON.stringify(e, null, 2))
    },
    (s) => async () => {
      console.log(s)
    }
  )
)()
