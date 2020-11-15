import { reduce } from "../common/Array"
import * as E from "../common/Either"
import { flow, pipe } from "../common/Function"
import * as I from "../common/Int"
import { matchTag } from "../common/Match"
import { Orientation } from "../domain/Orientation"
import type { PlanetConfiguration } from "../domain/Planet"
import { makePlanet } from "../domain/Planet"
import { PlanetPosition } from "../domain/PlanetPosition"
import type { RoverConfiguration } from "../domain/Rover"
import { makeRover, Rover } from "../domain/Rover"
import type { Command, GoBackward, GoForward, GoLeft, GoRight } from "./Command"
import type { ProgramState } from "./ProgramState"
import { HistoryEntry } from "./ProgramState"

export interface ProgramConfiguration {
  planet: PlanetConfiguration
  rover: RoverConfiguration
}

export function begin(config: ProgramConfiguration) {
  return pipe(
    makePlanet(config.planet),
    E.chain(
      flow(
        makeRover(config.rover),
        E.map(
          (rover): ProgramState => ({
            rover,
            history: [new HistoryEntry(rover.position, rover.orientation)]
          })
        )
      )
    )
  )
}

export type ConfigError = E.EitherGetE<ReturnType<typeof begin>>

export function nextPosition(
  state: ProgramState,
  position: PlanetPosition,
  orientation: Orientation
): ProgramState {
  return {
    rover: new Rover(state.rover.planet, position, orientation),
    history: [...state.history, new HistoryEntry(position, orientation)]
  }
}

export const move: (_: Command) => (_: ProgramState) => ProgramState = matchTag({
  GoForward: goForward,
  GoBackward: goBackward,
  GoLeft: goLeft,
  GoRight: goRight
})

export function nextMove(command: Command) {
  return <E>(e: E.Either<E, ProgramState>) => pipe(e, E.map(move(command)))
}

export function nextBatch(...commands: readonly [Command, ...Command[]]) {
  return <E>(e: E.Either<E, ProgramState>): E.Either<E, ProgramState> =>
    pipe(
      e,
      E.map((s) =>
        pipe(
          commands,
          reduce(s, (c, x) => move(c)(x))
        )
      )
    )
}

export function goForward(_: GoForward) {
  return (state: ProgramState): ProgramState =>
    pipe(
      state.rover.orientation,
      matchTag({
        North: () =>
          nextPosition(
            state,
            new PlanetPosition(
              state.rover.position.x,
              I.mod(state.rover.planet.height)(I.add(I.One)(state.rover.position.y))
            ),
            Orientation.North
          ),
        South: () =>
          nextPosition(
            state,
            new PlanetPosition(
              state.rover.position.x,
              I.mod(state.rover.planet.height)(I.sub(I.One)(state.rover.position.y))
            ),
            Orientation.South
          ),
        East: () =>
          nextPosition(
            state,
            new PlanetPosition(
              I.mod(state.rover.planet.width)(I.add(I.One)(state.rover.position.x)),
              state.rover.position.y
            ),
            Orientation.East
          ),
        West: () =>
          nextPosition(
            state,
            new PlanetPosition(
              I.mod(state.rover.planet.width)(I.sub(I.One)(state.rover.position.x)),
              state.rover.position.y
            ),
            Orientation.West
          )
      })
    )
}

export function goBackward(_: GoBackward) {
  return (state: ProgramState): ProgramState =>
    pipe(
      state.rover.orientation,
      matchTag({
        North: () =>
          nextPosition(
            state,
            new PlanetPosition(
              state.rover.position.x,
              I.mod(state.rover.planet.height)(I.sub(I.One)(state.rover.position.y))
            ),
            Orientation.South
          ),
        South: () =>
          nextPosition(
            state,
            new PlanetPosition(
              state.rover.position.x,
              I.mod(state.rover.planet.height)(I.add(I.One)(state.rover.position.y))
            ),
            Orientation.North
          ),
        East: () =>
          nextPosition(
            state,
            new PlanetPosition(
              I.mod(state.rover.planet.width)(I.sub(I.One)(state.rover.position.x)),
              state.rover.position.y
            ),
            Orientation.West
          ),
        West: () =>
          nextPosition(
            state,
            new PlanetPosition(
              I.mod(state.rover.planet.width)(I.add(I.One)(state.rover.position.x)),
              state.rover.position.y
            ),
            Orientation.East
          )
      })
    )
}

export function goLeft(_: GoLeft) {
  return (state: ProgramState): ProgramState =>
    pipe(
      state.rover.orientation,
      matchTag({
        North: () =>
          nextPosition(
            state,
            new PlanetPosition(
              I.mod(state.rover.planet.width)(I.sub(I.One)(state.rover.position.x)),
              state.rover.position.y
            ),
            Orientation.West
          ),
        South: () =>
          nextPosition(
            state,
            new PlanetPosition(
              I.mod(state.rover.planet.width)(I.add(I.One)(state.rover.position.x)),
              state.rover.position.y
            ),
            Orientation.East
          ),
        East: () =>
          nextPosition(
            state,
            new PlanetPosition(
              state.rover.position.x,
              I.mod(state.rover.planet.height)(I.add(I.One)(state.rover.position.y))
            ),
            Orientation.North
          ),
        West: () =>
          nextPosition(
            state,
            new PlanetPosition(
              state.rover.position.x,
              I.mod(state.rover.planet.height)(I.sub(I.One)(state.rover.position.y))
            ),
            Orientation.South
          )
      })
    )
}

export function goRight(_: GoRight) {
  return (state: ProgramState): ProgramState =>
    pipe(
      state.rover.orientation,
      matchTag({
        North: () =>
          nextPosition(
            state,
            new PlanetPosition(
              I.mod(state.rover.planet.width)(I.add(I.One)(state.rover.position.x)),
              state.rover.position.y
            ),
            Orientation.East
          ),
        South: () =>
          nextPosition(
            state,
            new PlanetPosition(
              I.mod(state.rover.planet.width)(I.sub(I.One)(state.rover.position.x)),
              state.rover.position.y
            ),
            Orientation.West
          ),
        East: () =>
          nextPosition(
            state,
            new PlanetPosition(
              state.rover.position.x,
              I.mod(state.rover.planet.height)(I.sub(I.One)(state.rover.position.y))
            ),
            Orientation.South
          ),
        West: () =>
          nextPosition(
            state,
            new PlanetPosition(
              state.rover.position.x,
              I.mod(state.rover.planet.height)(I.add(I.One)(state.rover.position.y))
            ),
            Orientation.North
          )
      })
    )
}
