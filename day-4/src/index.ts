import * as MR from "./app/Program"
import type { ProgramState } from "./app/ProgramState"
import * as E from "./common/Either"
import { pipe } from "./common/Function"

const onError = (e: MR.ConfigError | MR.NextPositionObstacle): void => {
  console.error(JSON.stringify(e, null, 2))

  process.exit(1)
}

const onSuccess = (a: ProgramState): void => {
  console.log(JSON.stringify(a, null, 2))
  process.exit(0)
}

const runMain = E.fold(onError, onSuccess)

pipe(
  MR.begin({
    planet: "5x4",
    initial: "1,3:N",
    obstacles: "1,2 0,0 3,4"
  }),
  MR.moveForward,
  MR.moveLeft,
  runMain
)
