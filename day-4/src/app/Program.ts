import { pipe } from "../common/Function"
import * as I from "../common/Int"
import { matchTag } from "../common/Match"
import * as NA from "../common/NonEmptyArray"
import { none, some } from "../common/Option"
import * as RTE from "../common/ReaderTaskEither"
import { Orientation } from "../domain/Orientation"
import type { PlanetContext } from "../domain/Planet"
import { addObstacles } from "../domain/Planet"
import type { ObstacleHit, Position } from "../domain/Position"
import { validatePosition } from "../domain/Position"
import type { InvalidInitialPosition } from "../domain/Rover"
import { makeRover, Rover } from "../domain/Rover"
import type { ParseCommandError } from "../serde/CommandParser"
import { parseCommands } from "../serde/CommandParser"
import { parseObstacles } from "../serde/ObstaclesParser"
import type { ParseInitialPositionError } from "../serde/ParseInitialPosition"
import { parsePlanet } from "../serde/PlanetParser"
import type { AppConfig } from "./AppConfig"
import type { Command, GoBackward, GoForward, GoLeft, GoRight } from "./Command"
import { Commands } from "./Command"
import type { Console } from "./Console"
import { error, log } from "./Console"
import type { ProgramState } from "./ProgramState"
import { HistoryEntry } from "./ProgramState"
import type { Readline } from "./Readline"
import { getStrLn } from "./Readline"

export class NextPositionObstacle {
  readonly _tag = "NextPositionObstacle"
  constructor(
    readonly previousState: ProgramState,
    readonly obstacleHit: ObstacleHit
  ) {}
}

export function nextPosition(
  state: ProgramState,
  x: I.Int,
  y: I.Int,
  orientation: Orientation
): RTE.ReaderTaskEither<PlanetContext, NextPositionObstacle, ProgramState> {
  return pipe(
    validatePosition({ x, y }),
    RTE.map(
      (position): ProgramState => ({
        rover: new Rover(position, orientation),
        history: NA.append(new HistoryEntry(position, orientation))(state.history)
      })
    ),
    RTE.catchAll((e) => RTE.left(new NextPositionObstacle(state, e)))
  )
}

export const move: (
  c: Command,
  s: ProgramState
) => RTE.ReaderTaskEither<PlanetContext, NextPositionObstacle, ProgramState> = (c, s) =>
  pipe(
    c,
    matchTag({
      GoForward: goForward,
      GoBackward: goBackward,
      GoLeft: goLeft,
      GoRight: goRight
    })
  )(s)

export function nextMove(command: Command) {
  return <R, E>(e: RTE.ReaderTaskEither<R, E, ProgramState>) =>
    pipe(
      e,
      RTE.chain((s) => move(command, s))
    )
}

export function nextBatch(commands: readonly Command[]) {
  return (s: ProgramState) => pipe(commands, RTE.reduce(s)(move))
}

export function goForward(_: GoForward) {
  return (
    state: ProgramState
  ): RTE.ReaderTaskEither<PlanetContext, NextPositionObstacle, ProgramState> =>
    pipe(
      state.rover.orientation,
      matchTag({
        North: () =>
          nextPosition(
            state,
            state.rover.position.x,
            I.increment(state.rover.position.y),
            Orientation.North
          ),
        South: () =>
          nextPosition(
            state,
            state.rover.position.x,
            I.decrement(state.rover.position.y),
            Orientation.South
          ),
        East: () =>
          nextPosition(
            state,
            I.increment(state.rover.position.x),
            state.rover.position.y,
            Orientation.East
          ),
        West: () =>
          nextPosition(
            state,
            I.decrement(state.rover.position.x),
            state.rover.position.y,
            Orientation.West
          )
      })
    )
}

export function goBackward(_: GoBackward) {
  return (
    state: ProgramState
  ): RTE.ReaderTaskEither<PlanetContext, NextPositionObstacle, ProgramState> =>
    pipe(
      state.rover.orientation,
      matchTag({
        North: () =>
          nextPosition(
            state,
            state.rover.position.x,
            I.decrement(state.rover.position.y),
            Orientation.South
          ),
        South: () =>
          nextPosition(
            state,
            state.rover.position.x,
            I.increment(state.rover.position.y),
            Orientation.North
          ),
        East: () =>
          nextPosition(
            state,
            I.decrement(state.rover.position.x),
            state.rover.position.y,
            Orientation.West
          ),
        West: () =>
          nextPosition(
            state,
            I.increment(state.rover.position.x),
            state.rover.position.y,
            Orientation.East
          )
      })
    )
}

export function goLeft(_: GoLeft) {
  return (
    state: ProgramState
  ): RTE.ReaderTaskEither<PlanetContext, NextPositionObstacle, ProgramState> =>
    pipe(
      state.rover.orientation,
      matchTag({
        North: () =>
          nextPosition(
            state,
            I.decrement(state.rover.position.x),
            state.rover.position.y,
            Orientation.West
          ),
        South: () =>
          nextPosition(
            state,
            I.increment(state.rover.position.x),
            state.rover.position.y,
            Orientation.East
          ),
        East: () =>
          nextPosition(
            state,
            state.rover.position.x,
            I.increment(state.rover.position.y),
            Orientation.North
          ),
        West: () =>
          nextPosition(
            state,
            state.rover.position.x,
            I.decrement(state.rover.position.y),
            Orientation.South
          )
      })
    )
}

export function goRight(_: GoRight) {
  return (
    state: ProgramState
  ): RTE.ReaderTaskEither<PlanetContext, NextPositionObstacle, ProgramState> =>
    pipe(
      state.rover.orientation,
      matchTag({
        North: () =>
          nextPosition(
            state,
            I.increment(state.rover.position.x),
            state.rover.position.y,
            Orientation.East
          ),
        South: () =>
          nextPosition(
            state,
            I.decrement(state.rover.position.x),
            state.rover.position.y,
            Orientation.West
          ),
        East: () =>
          nextPosition(
            state,
            state.rover.position.x,
            I.decrement(state.rover.position.y),
            Orientation.South
          ),
        West: () =>
          nextPosition(
            state,
            state.rover.position.x,
            I.increment(state.rover.position.y),
            Orientation.North
          )
      })
    )
}

export const moveRight = nextMove(Commands.Right)

export const moveLeft = nextMove(Commands.Left)

export const moveForward = nextMove(Commands.Forward)

export const moveBackward = nextMove(Commands.Backward)

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

export const begin = pipe(
  makeRover,
  RTE.map(
    (rover): ProgramState => ({
      rover,
      history: [new HistoryEntry(rover.position, rover.orientation)]
    })
  )
)

export function actualize(self: ProgramState): ProgramState {
  return {
    history: [self.history[self.history.length - 1]],
    rover: self.rover
  }
}

export function prettyObstacle(e: NextPositionObstacle): string {
  return `O:${e.previousState.rover.position.x}:${
    e.previousState.rover.position.y
  }:${prettyOrientation(e.previousState.rover.orientation)}`
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

export const main: RTE.ReaderTaskEither<
  AppConfig & PlanetContext & Readline & Console,
  ParseInitialPositionError | InvalidInitialPosition | ParseCommandError,
  void
> = pipe(
  begin,
  RTE.chain(
    RTE.repeatWithState((state) =>
      pipe(
        getStrLn,
        RTE.chain((commandsInput) =>
          commandsInput.length === 0
            ? RTE.right(none)
            : pipe(
                commandsInput,
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
