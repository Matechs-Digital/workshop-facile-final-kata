import type { NextPositionObstacle } from "./app/Program"
import { begin, moveForward, moveLeft, runEither } from "./app/Program"
import type { ProgramState } from "./app/ProgramState"
import * as E from "./common/Either"
import { pipe } from "./common/Function"
import type { ParseError } from "./serde/ParseError"

const onError = (e: ParseError | NextPositionObstacle): void => {
  console.error(JSON.stringify(e, null, 2))

  process.exit(1)
}

const onSuccess = (a: ProgramState): void => {
  console.log(JSON.stringify(a, null, 2))
  process.exit(0)
}

pipe(
  begin,
  moveForward,
  moveLeft,
  runEither({
    planet: "5x4",
    initial: "1,3:N",
    obstacles: "1,2 0,0 3,4"
  }),
  E.fold(onError, onSuccess)
)
