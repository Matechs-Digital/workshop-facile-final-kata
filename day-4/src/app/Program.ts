import { pipe } from "../common/Function"
import * as I from "../common/Int"
import { matchTag } from "../common/Match"
import * as NA from "../common/NonEmptyArray"
import { none } from "../common/Option"
import * as RTE from "../common/ReaderTaskEither"
import { Orientation } from "../domain/Orientation"
import type { PlanetContext } from "../domain/Planet"
import { addObstacles } from "../domain/Planet"
import type { Position } from "../domain/Position"
import { validatePosition } from "../domain/Position"
import { Rover } from "../domain/Rover"
import { parseCommands } from "../serde/CommandParser"
import { parseObstacles } from "../serde/ObstaclesParser"
import { parsePlanet } from "../serde/PlanetParser"
import type { AppConfig } from "./AppConfig"
import type { Command, GoBackward, GoForward, GoLeft, GoRight } from "./Command"
import { Commands } from "./Command"
import { error, log } from "./Console"
import type { RoverContext, RoverState } from "./ProgramState"
import {
  actualize,
  getCurrentState,
  RoverHistoricPosition,
  updateCurrentState
} from "./ProgramState"
import { getStrLn } from "./Readline"

export class NextPositionObstacle {
  readonly _tag = "NextPositionObstacle"
  constructor(readonly position: Position, readonly orientation: Orientation) {}
}

export function nextPosition(
  x: I.Int,
  y: I.Int,
  orientation: Orientation
): RTE.ReaderTaskEither<
  PlanetContext & RoverContext,
  NextPositionObstacle,
  RoverState
> {
  return pipe(
    validatePosition({ x, y }),
    RTE.chain((position) =>
      updateCurrentState((state) => ({
        rover: new Rover(position, orientation),
        history: NA.append(new RoverHistoricPosition(position, orientation))(
          state.history
        )
      }))
    ),
    RTE.catchAll((e) => RTE.left(new NextPositionObstacle(e.position, orientation)))
  )
}

export const move: (
  c: Command
) => RTE.ReaderTaskEither<
  PlanetContext & RoverContext,
  NextPositionObstacle,
  RoverState
> = (c) =>
  pipe(
    c,
    matchTag({
      GoForward: goForward,
      GoBackward: goBackward,
      GoLeft: goLeft,
      GoRight: goRight
    })
  )

export function goForward(_: GoForward) {
  return pipe(
    getCurrentState,
    RTE.chain((state) =>
      pipe(
        state.rover.orientation,
        matchTag({
          North: () =>
            nextPosition(
              state.rover.position.x,
              I.increment(state.rover.position.y),
              Orientation.North
            ),
          South: () =>
            nextPosition(
              state.rover.position.x,
              I.decrement(state.rover.position.y),
              Orientation.South
            ),
          East: () =>
            nextPosition(
              I.increment(state.rover.position.x),
              state.rover.position.y,
              Orientation.East
            ),
          West: () =>
            nextPosition(
              I.decrement(state.rover.position.x),
              state.rover.position.y,
              Orientation.West
            )
        })
      )
    )
  )
}

export function goBackward(_: GoBackward) {
  return pipe(
    getCurrentState,
    RTE.chain((state) =>
      pipe(
        state.rover.orientation,
        matchTag({
          North: () =>
            nextPosition(
              state.rover.position.x,
              I.decrement(state.rover.position.y),
              Orientation.South
            ),
          South: () =>
            nextPosition(
              state.rover.position.x,
              I.increment(state.rover.position.y),
              Orientation.North
            ),
          East: () =>
            nextPosition(
              I.decrement(state.rover.position.x),
              state.rover.position.y,
              Orientation.West
            ),
          West: () =>
            nextPosition(
              I.increment(state.rover.position.x),
              state.rover.position.y,
              Orientation.East
            )
        })
      )
    )
  )
}

export function goLeft(_: GoLeft) {
  return pipe(
    getCurrentState,
    RTE.chain((state) =>
      pipe(
        state.rover.orientation,
        matchTag({
          North: () =>
            nextPosition(
              I.decrement(state.rover.position.x),
              state.rover.position.y,
              Orientation.West
            ),
          South: () =>
            nextPosition(
              I.increment(state.rover.position.x),
              state.rover.position.y,
              Orientation.East
            ),
          East: () =>
            nextPosition(
              state.rover.position.x,
              I.increment(state.rover.position.y),
              Orientation.North
            ),
          West: () =>
            nextPosition(
              state.rover.position.x,
              I.decrement(state.rover.position.y),
              Orientation.South
            )
        })
      )
    )
  )
}

export function goRight(_: GoRight) {
  return pipe(
    getCurrentState,
    RTE.chain((state) =>
      pipe(
        state.rover.orientation,
        matchTag({
          North: () =>
            nextPosition(
              I.increment(state.rover.position.x),
              state.rover.position.y,
              Orientation.East
            ),
          South: () =>
            nextPosition(
              I.decrement(state.rover.position.x),
              state.rover.position.y,
              Orientation.West
            ),
          East: () =>
            nextPosition(
              state.rover.position.x,
              I.decrement(state.rover.position.y),
              Orientation.South
            ),
          West: () =>
            nextPosition(
              state.rover.position.x,
              I.increment(state.rover.position.y),
              Orientation.North
            )
        })
      )
    )
  )
}

export const moveRight = move(Commands.Right)

export const moveLeft = move(Commands.Left)

export const moveForward = move(Commands.Forward)

export const moveBackward = move(Commands.Backward)

export function provideLivePlanet<R, E, A>(
  self: RTE.ReaderTaskEither<R & PlanetContext, E, A>
) {
  return RTE.accessM(({ config }: AppConfig) =>
    pipe(
      RTE.do,
      RTE.bind("planet", () => RTE.fromEither(parsePlanet(config.planet))),
      RTE.bind("obstacles", () => RTE.fromEither(parseObstacles(config.obstacles))),
      RTE.let("planetWithObstacles", ({ obstacles, planet }) =>
        addObstacles(...obstacles)(planet)
      ),
      RTE.chain(({ planet }) =>
        pipe(
          self,
          RTE.provide<PlanetContext>({ planetContext: { planet } })
        )
      )
    )
  )
}

export function prettyObstacle(e: NextPositionObstacle) {
  return `O:${e.position.x}:${e.position.y}:${prettyOrientation(e.orientation)}`
}

export function prettyPosition(position: Position, orientation: Orientation): string {
  return `${position.x}:${position.y}:${prettyOrientation(orientation)}`
}

export function prettyOrientation(orientation: Orientation) {
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

export const main = RTE.repeatUntilStop(
  pipe(
    getStrLn,
    RTE.chain((commandsInput) =>
      commandsInput.length === 0
        ? RTE.right(RTE.Stop)
        : pipe(
            commandsInput,
            parseCommands,
            RTE.fromEither,
            RTE.chain(RTE.foreach(move)),
            RTE.andThen(
              pipe(
                getCurrentState,
                RTE.chain(({ history }) =>
                  pipe(
                    history,
                    RTE.foreach(({ orientation, position }) =>
                      log(prettyPosition(position, orientation))
                    )
                  )
                ),
                RTE.andThen(actualize),
                RTE.andThen(RTE.sync(() => none))
              )
            ),
            RTE.catchAll((e) =>
              e._tag === "NextPositionObstacle"
                ? pipe(
                    pipe(
                      getCurrentState,
                      RTE.chain(({ history }) =>
                        pipe(
                          history,
                          RTE.foreach(({ orientation, position }) =>
                            log(prettyPosition(position, orientation))
                          )
                        )
                      )
                    ),
                    RTE.andThen(error(prettyObstacle(e))),
                    RTE.andThen(actualize),
                    RTE.andThen(RTE.right(none))
                  )
                : RTE.left(e)
            )
          )
    )
  )
)
