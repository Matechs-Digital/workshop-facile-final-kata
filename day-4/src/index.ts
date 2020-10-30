import * as I from "./common/Int"
import * as E from "./utils/either"
import { pipe } from "./utils/pipe"

export class Planet {
  readonly _tag = "Planet"
  constructor(readonly width: I.Int, readonly height: I.Int) {}
}

export function makePlanet(
  width: I.Int,
  height: I.Int
): E.Either<InvalidHeight | InvalidWidth, Planet> {
  return I.gte(I.Zero)(width)
    ? I.gte(I.Zero)(height)
      ? E.right(new Planet(width, height))
      : E.left(new InvalidHeight())
    : E.left(new InvalidWidth())
}

export class Position {
  readonly _tag = "Position"
  constructor(readonly x: I.Int, readonly y: I.Int) {}
}

export class InvalidWidth {
  readonly _tag = "InvalidWidth"
}

export class InvalidHeight {
  readonly _tag = "InvalidHeight"
}

export const makePosition = (planet: Planet) => (
  x: I.Int,
  y: I.Int
): E.Either<InvalidWidth | InvalidHeight, Position> =>
  I.between(I.Zero, planet.width)(x)
    ? I.between(I.Zero, planet.height)(y)
      ? E.right(new Position(x, y))
      : E.left(new InvalidHeight())
    : E.left(new InvalidWidth())

export const OrientationValues = ["N", "S", "E", "W"] as const

export type Orientation = typeof OrientationValues[number]

export class InvalidOrientation {
  readonly _tag = "InvalidOrientation"
}

export const makeOrientation = (o: string): E.Either<InvalidOrientation, Orientation> =>
  OrientationValues.includes(o as any)
    ? E.right(<Orientation>o)
    : E.left(new InvalidOrientation())

export class Rover {
  readonly _tag = "Rover"
  constructor(readonly position: Position, readonly orientation: Orientation) {}
}

export function makeRover(planet: Planet) {
  return (rover: Configuration["rover"]) =>
    pipe(
      makePosition(planet)(rover.position.x, rover.position.y),
      E.map((position) => new Rover(position, rover.orientation))
    )
}

export type Command = "l" | "r" | "f" | "b"

export interface Configuration {
  planet: {
    width: I.Int
    height: I.Int
  }
  rover: {
    position: {
      x: I.Int
      y: I.Int
    }
    orientation: Orientation
  }
}

export interface ProgramState {
  planet: Planet
  rover: Rover
}

export function initialState(config: Configuration) {
  return pipe(
    makePlanet(config.planet.width, config.planet.height),
    E.chain((planet) =>
      pipe(
        makeRover(planet)(config.rover),
        E.map((rover): ProgramState => ({ rover, planet }))
      )
    )
  )
}

export function move(command: Command) {
  return (state: ProgramState): ProgramState => {
    switch (command) {
      case "f": {
        switch (state.rover.orientation) {
          case "N": {
            return {
              planet: state.planet,
              rover: new Rover(
                new Position(
                  state.rover.position.x,
                  I.mod(state.planet.height)(I.add(I.One)(state.rover.position.y))
                ),
                "N"
              )
            }
          }
          case "S": {
            return {
              planet: state.planet,
              rover: new Rover(
                new Position(
                  state.rover.position.x,
                  I.mod(state.planet.height)(I.sub(I.One)(state.rover.position.y))
                ),
                "S"
              )
            }
          }
          case "E": {
            return {
              planet: state.planet,
              rover: new Rover(
                new Position(
                  I.mod(state.planet.width)(I.add(I.One)(state.rover.position.x)),
                  state.rover.position.y
                ),
                "E"
              )
            }
          }
          case "W": {
            return {
              planet: state.planet,
              rover: new Rover(
                new Position(
                  I.mod(state.planet.width)(I.sub(I.One)(state.rover.position.x)),
                  state.rover.position.y
                ),
                "W"
              )
            }
          }
        }
      }
      case "b": {
        switch (state.rover.orientation) {
          case "N": {
            return {
              planet: state.planet,
              rover: new Rover(
                new Position(
                  state.rover.position.x,
                  I.mod(state.planet.height)(I.sub(I.One)(state.rover.position.y))
                ),
                "S"
              )
            }
          }
          case "S": {
            return {
              planet: state.planet,
              rover: new Rover(
                new Position(
                  state.rover.position.x,
                  I.mod(state.planet.height)(I.add(I.One)(state.rover.position.y))
                ),
                "N"
              )
            }
          }
          case "E": {
            return {
              planet: state.planet,
              rover: new Rover(
                new Position(
                  I.mod(state.planet.width)(I.sub(I.One)(state.rover.position.x)),
                  state.rover.position.y
                ),
                "W"
              )
            }
          }
          case "W": {
            return {
              planet: state.planet,
              rover: new Rover(
                new Position(
                  I.mod(state.planet.width)(I.add(I.One)(state.rover.position.x)),
                  state.rover.position.y
                ),
                "E"
              )
            }
          }
        }
      }
      case "l": {
        switch (state.rover.orientation) {
          case "N": {
            return {
              planet: state.planet,
              rover: new Rover(
                new Position(
                  I.mod(state.planet.width)(I.sub(I.One)(state.rover.position.x)),
                  state.rover.position.y
                ),
                "W"
              )
            }
          }
          case "S": {
            return {
              planet: state.planet,
              rover: new Rover(
                new Position(
                  I.mod(state.planet.width)(I.add(I.One)(state.rover.position.x)),
                  state.rover.position.y
                ),
                "E"
              )
            }
          }
          case "E": {
            return {
              planet: state.planet,
              rover: new Rover(
                new Position(
                  state.rover.position.x,
                  I.mod(state.planet.height)(I.add(I.One)(state.rover.position.y))
                ),
                "N"
              )
            }
          }
          case "W": {
            return {
              planet: state.planet,
              rover: new Rover(
                new Position(
                  state.rover.position.x,
                  I.mod(state.planet.height)(I.sub(I.One)(state.rover.position.y))
                ),
                "S"
              )
            }
          }
        }
      }
      case "r": {
        switch (state.rover.orientation) {
          case "N": {
            return {
              planet: state.planet,
              rover: new Rover(
                new Position(
                  I.mod(state.planet.width)(I.add(I.One)(state.rover.position.x)),
                  state.rover.position.y
                ),
                "E"
              )
            }
          }
          case "S": {
            return {
              planet: state.planet,
              rover: new Rover(
                new Position(
                  I.mod(state.planet.width)(I.sub(I.One)(state.rover.position.x)),
                  state.rover.position.y
                ),
                "W"
              )
            }
          }
          case "E": {
            return {
              planet: state.planet,
              rover: new Rover(
                new Position(
                  state.rover.position.x,
                  I.mod(state.planet.height)(I.sub(I.One)(state.rover.position.y))
                ),
                "S"
              )
            }
          }
          case "W": {
            return {
              planet: state.planet,
              rover: new Rover(
                new Position(
                  state.rover.position.x,
                  I.mod(state.planet.height)(I.add(I.One)(state.rover.position.y))
                ),
                "N"
              )
            }
          }
        }
      }
    }
  }
}

export function nextMove(command: Command) {
  return <E>(e: E.Either<E, ProgramState>) => pipe(e, E.map(move(command)))
}
