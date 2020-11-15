import * as Command from "./app/Command"
import * as MR from "./app/Program"
import type { ProgramState } from "./app/ProgramState"
import * as E from "./common/Either"
import { pipe } from "./common/Function"
import * as I from "./common/Int"
import { Orientation } from "./domain/Orientation"

const config: MR.ProgramConfiguration = {
  planet: {
    width: I.Five,
    height: I.Four,
    obstacles: []
  },
  rover: {
    position: {
      x: I.Four,
      y: I.Zero
    },
    orientation: Orientation.West
  }
}

const onError = (e: MR.ConfigError | MR.NextPositionObstacle): void => {
  console.error(JSON.stringify(e, null, 2))
  process.exit(1)
}

const onSuccess = (a: ProgramState): void => {
  console.log(JSON.stringify(a, null, 2))
}

const runMain = E.fold(onError, onSuccess)

pipe(
  config,
  MR.begin,
  MR.moveBackward,
  MR.moveForward,
  MR.moveLeft,
  MR.moveRight,
  runMain
)
