import type * as E from "../common/Either"
import { pipe } from "../common/Function"
import * as I from "../common/Int"
import { matchTag } from "../common/Match"
import * as NA from "../common/NonEmptyArray"
import * as RE from "../common/ReaderTaskEither"
import { Orientation } from "../domain/Orientation"
import type { PlanetContext } from "../domain/Planet"
import { addObstacles } from "../domain/Planet"
import type { ObstacleHit } from "../domain/Position"
import { validatePosition } from "../domain/Position"
import type { InvalidInitialPosition } from "../domain/Rover"
import { makeRover, Rover } from "../domain/Rover"
import { parseObstacles } from "../serde/ObstaclesParser"
import type { ParseError } from "../serde/ParseError"
import { parsePlanet } from "../serde/PlanetParser"
import type { AppConfig } from "./AppConfig"
import { provideAppConfig } from "./AppConfig"
import type { Command, GoBackward, GoForward, GoLeft, GoRight } from "./Command"
import { Commands } from "./Command"
import type { ProgramState } from "./ProgramState"
import { HistoryEntry } from "./ProgramState"

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
): RE.ReaderTaskEither<PlanetContext, NextPositionObstacle, ProgramState> {
  return pipe(
    validatePosition({ x, y }),
    RE.map(
      (position): ProgramState => ({
        rover: new Rover(position, orientation),
        history: NA.append(new HistoryEntry(position, orientation))(state.history)
      })
    ),
    RE.catchAll((e) => RE.left(new NextPositionObstacle(state, e)))
  )
}

export const move: (
  c: Command,
  s: ProgramState
) => RE.ReaderTaskEither<PlanetContext, NextPositionObstacle, ProgramState> = (c, s) =>
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
  return <R, E>(e: RE.ReaderTaskEither<R, E, ProgramState>) =>
    pipe(
      e,
      RE.chain((s) => move(command, s))
    )
}

export function nextBatch(...commands: readonly [Command, ...Command[]]) {
  return <R, E>(e: RE.ReaderTaskEither<R, E, ProgramState>) =>
    pipe(
      e,
      RE.chain((s) => pipe(commands, RE.reduce(s)(move)))
    )
}

export function goForward(_: GoForward) {
  return (
    state: ProgramState
  ): RE.ReaderTaskEither<PlanetContext, NextPositionObstacle, ProgramState> =>
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
  ): RE.ReaderTaskEither<PlanetContext, NextPositionObstacle, ProgramState> =>
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
  ): RE.ReaderTaskEither<PlanetContext, NextPositionObstacle, ProgramState> =>
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
  ): RE.ReaderTaskEither<PlanetContext, NextPositionObstacle, ProgramState> =>
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

export function providePlanet<R, E, A>(
  self: RE.ReaderTaskEither<R & PlanetContext, E, A>
) {
  return RE.accessM(({ config }: AppConfig) =>
    pipe(
      RE.do,
      RE.bind("planet", () => RE.fromEither(parsePlanet(config.planet))),
      RE.bind("obstacles", () => RE.fromEither(parseObstacles(config.obstacles))),
      RE.let("planetWithObstacles", ({ obstacles, planet }) =>
        addObstacles(...obstacles)(planet)
      ),
      RE.chain(({ planet }) =>
        pipe(
          self,
          RE.provide<PlanetContext>({ planetContext: { planet } })
        )
      )
    )
  )
}

export const begin = pipe(
  makeRover,
  RE.map(
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

export const runTaskEither = (config: AppConfig["config"]) => (
  self: RE.ReaderTaskEither<
    AppConfig & PlanetContext,
    ParseError | NextPositionObstacle | InvalidInitialPosition,
    ProgramState
  >
) => pipe(self, providePlanet, provideAppConfig(config), RE.run)
