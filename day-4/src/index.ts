import { provideLiveAppConfig } from "./app/AppConfig"
import { error, log, provideLiveConsole } from "./app/Console"
import type { NextPositionObstacle } from "./app/Program"
import { actualize, begin, nextBatch, provideLivePlanet } from "./app/Program"
import { provideLiveReadFile } from "./app/ReadFile"
import { getStrLn, provideLiveReadLine } from "./app/Readline"
import * as E from "./common/Either"
import { pipe } from "./common/Function"
import { matchTag } from "./common/Match"
import { none, some } from "./common/Option"
import * as RTE from "./common/ReaderTaskEither"
import type { Orientation } from "./domain/Orientation"
import type { Position } from "./domain/Position"
import { parseCommands } from "./serde/CommandParser"

export const main = pipe(
  begin,
  RTE.chain(
    RTE.repeatWithState((state) =>
      pipe(
        getStrLn,
        RTE.chain((s) =>
          s.length === 0
            ? RTE.right(none)
            : pipe(
                s,
                parseCommands,
                RTE.fromEither,
                RTE.chain((commands) => nextBatch(commands)(state)),
                RTE.chain((nextState) =>
                  pipe(
                    nextState.history,
                    RTE.foreach(({ orientation, position }) =>
                      log(prettyPosition(position, orientation))
                    ),
                    RTE.chain(() => RTE.sync(() => some(actualize(nextState))))
                  )
                ),
                RTE.catchAll((e) =>
                  e._tag === "NextPositionObstacle"
                    ? pipe(
                        e.previousState.history,
                        RTE.foreach(({ orientation, position }) =>
                          log(prettyPosition(position, orientation))
                        ),
                        RTE.chain(() => error(prettyObstacle(e))),
                        RTE.chain(() => RTE.right(some(actualize(e.previousState))))
                      )
                    : RTE.left(e)
                )
              )
        )
      )
    )
  )
)

function prettyObstacle(e: NextPositionObstacle): string {
  return `O:${e.previousState.rover.position.x}:${
    e.previousState.rover.position.y
  }:${prettyOrientation(e.previousState.rover.orientation)}`
}

function prettyPosition(position: Position, orientation: Orientation): string {
  return `${position.x}:${position.y}:${prettyOrientation(orientation)}`
}

function prettyOrientation(orientation: Orientation) {
  return pipe(
    orientation,
    matchTag({
      North: () => "N",
      South: () => "S",
      East: () => "E",
      West: () => "W"
    })
  )
}

pipe(
  main,
  provideLivePlanet,
  provideLiveAppConfig,
  provideLiveReadFile,
  provideLiveReadLine,
  provideLiveConsole,
  RTE.run
)().then(
  E.fold(
    (e) => {
      console.error(JSON.stringify(e, null, 2))
      process.exit(1)
    },
    () => {
      process.exit(0)
    }
  )
)
