import * as Command from "./app/Command"
import * as MR from "./app/Program"
import * as E from "./common/Either"
import { pipe } from "./common/Function"
import * as I from "./common/Int"
import { Orientation } from "./domain/Orientation"

const state = MR.begin({
  planet: {
    width: I.Five,
    height: I.Four
  },
  rover: {
    position: {
      x: I.Four,
      y: I.Zero
    },
    orientation: Orientation.West
  }
})

pipe(
  state,
  MR.nextMove(Command.Commands.Backward),
  E.fold(
    (e) => {
      console.error(e)
    },
    (a) => {
      console.log(JSON.stringify(a, null, 2))
    }
  )
)
