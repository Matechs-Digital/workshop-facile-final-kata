import { reduce } from "../common/Array"
import * as E from "../common/Either"
import { pipe } from "../common/Function"
import * as I from "../common/Int"
import { matchTag } from "../common/Match"
import { Orientation } from "../domain/Orientation"
import { addObstacles } from "../domain/Planet"
import type { ObstacleHit } from "../domain/PlanetPosition"
import { PlanetPosition, validatePlanetPosition } from "../domain/PlanetPosition"
import { makeRover, Rover } from "../domain/Rover"
import { parseObstacles } from "../serde/ObstaclesParser"
import { parseInitialPosition } from "../serde/ParseInitialPosition"
import { parsePlanet } from "../serde/PlanetParser"
import type { Command, GoBackward, GoForward, GoLeft, GoRight } from "./Command"
import { Commands } from "./Command"
import type { ProgramState } from "./ProgramState"
import { HistoryEntry } from "./ProgramState"

export type ConfigError = E.EitherGetE<ReturnType<typeof begin>>

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
): E.Either<NextPositionObstacle, ProgramState> {
  return pipe(
    validatePlanetPosition(new PlanetPosition(state.rover.planet, x, y)),
    E.map(
      (position): ProgramState => ({
        rover: new Rover(state.rover.planet, position, orientation),
        history: [...state.history, new HistoryEntry(position, orientation)]
      })
    ),
    E.catchAll((e) => E.left(new NextPositionObstacle(state, e)))
  )
}

export const move: (
  _: Command
) => (_: ProgramState) => E.Either<NextPositionObstacle, ProgramState> = matchTag({
  GoForward: goForward,
  GoBackward: goBackward,
  GoLeft: goLeft,
  GoRight: goRight
})

export function nextMove(command: Command) {
  return <E>(e: E.Either<E, ProgramState>) => pipe(e, E.chain(move(command)))
}

export function nextBatch(...commands: readonly [Command, ...Command[]]) {
  return <E>(e: E.Either<E, ProgramState>) =>
    pipe(
      e,
      E.chain((s) =>
        pipe(
          commands,
          reduce(<E.Either<NextPositionObstacle, ProgramState>>E.right(s), (c, x) =>
            pipe(x, E.chain(move(c)))
          )
        )
      )
    )
}

export function goForward(_: GoForward) {
  return (state: ProgramState): E.Either<NextPositionObstacle, ProgramState> =>
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
  return (state: ProgramState): E.Either<NextPositionObstacle, ProgramState> =>
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
  return (state: ProgramState): E.Either<NextPositionObstacle, ProgramState> =>
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
  return (state: ProgramState): E.Either<NextPositionObstacle, ProgramState> =>
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

export function begin(config: { planet: string; initial: string; obstacles: string }) {
  return pipe(
    E.do,
    E.bind("planet", () => parsePlanet(config.planet)),
    E.bind("initialPosition", () => parseInitialPosition(config.initial)),
    E.bind("obstacles", () => parseObstacles(config.obstacles)),
    E.let("planetWithObstacles", ({ obstacles, planet }) =>
      addObstacles(...obstacles)(planet)
    ),
    E.let("rover", ({ initialPosition, planetWithObstacles }) =>
      makeRover(initialPosition)(planetWithObstacles)
    ),
    E.map(
      ({ rover }): ProgramState => ({
        rover,
        history: [new HistoryEntry(rover.position, rover.orientation)]
      })
    )
  )
}