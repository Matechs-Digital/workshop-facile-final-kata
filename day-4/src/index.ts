import * as P from "path"

import { provideAppConfig } from "./app/AppConfig"
import type { Console } from "./app/Console"
import { error, LiveConsole, log } from "./app/Console"
import type { NextPositionObstacle } from "./app/Program"
import { actualize, begin, nextBatch, providePlanet } from "./app/Program"
import { LiveReadFile, readFile } from "./app/ReadFile"
import { getStrLn, LiveReadline } from "./app/Readline"
import { pipe } from "./common/Function"
import { matchTag } from "./common/Match"
import { none, some } from "./common/Option"
import * as RTE from "./common/ReaderTaskEither"
import * as TE from "./common/TaskEither"
import type { Orientation } from "./domain/Orientation"
import type { Position } from "./domain/Position"
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

          return pipe(
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
        })
      )
    )
  ),
  providePlanet
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
  RTE.provide(LiveConsole),
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
