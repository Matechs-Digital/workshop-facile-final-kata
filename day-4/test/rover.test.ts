import * as Command from "../src/app/Command"
import * as MR from "../src/app/Program"
import * as ProgramState from "../src/app/ProgramState"
import * as E from "../src/common/Either"
import { pipe } from "../src/common/Function"
import * as I from "../src/common/Int"
import { Orientation } from "../src/domain/Orientation"
import { Rover } from "../src/domain/Rover"

describe("Rover", () => {
  it("init", () => {
    const state = pipe(
      MR.begin,
      MR.runEither({
        planet: "5x4",
        initial: "0,0:N",
        obstacles: ""
      })
    )

    expect(state).toEqual(
      E.right({
        rover: new Rover({ x: I.Zero, y: I.Zero }, Orientation.North),
        history: [
          new ProgramState.HistoryEntry({ x: I.Zero, y: I.Zero }, Orientation.North)
        ]
      })
    )
  })

  it("move forward looking north (at edge)", () => {
    const program = pipe(
      MR.begin,
      MR.nextMove(Command.Commands.Forward),
      MR.runEither({
        planet: "5x4",
        initial: "0,3:N",
        obstacles: ""
      })
    )

    expect(program).toEqual(
      E.right({
        rover: new Rover({ x: I.Zero, y: I.Zero }, Orientation.North),
        history: [
          new ProgramState.HistoryEntry({ x: I.Zero, y: I.Three }, Orientation.North),
          new ProgramState.HistoryEntry({ x: I.Zero, y: I.Zero }, Orientation.North)
        ]
      })
    )
  })

  it("move forward looking south (at the edge)", () => {
    const program = pipe(
      MR.begin,
      MR.nextMove(Command.Commands.Forward),
      MR.runEither({
        planet: "5x4",
        initial: "0,0:S",
        obstacles: ""
      })
    )

    expect(program).toEqual(
      E.right({
        rover: new Rover({ x: I.Zero, y: I.Three }, Orientation.South),
        history: [
          new ProgramState.HistoryEntry({ x: I.Zero, y: I.Zero }, Orientation.South),
          new ProgramState.HistoryEntry({ x: I.Zero, y: I.Three }, Orientation.South)
        ]
      })
    )
  })

  it("move forward looking east (at the edge)", () => {
    const program = pipe(
      MR.begin,
      MR.nextMove(Command.Commands.Forward),
      MR.runEither({
        planet: "5x4",
        initial: "4,0:E",
        obstacles: ""
      })
    )

    expect(program).toEqual(
      E.right({
        rover: new Rover({ x: I.Zero, y: I.Zero }, Orientation.East),
        history: [
          new ProgramState.HistoryEntry({ x: I.Four, y: I.Zero }, Orientation.East),
          new ProgramState.HistoryEntry({ x: I.Zero, y: I.Zero }, Orientation.East)
        ]
      })
    )
  })

  it("move forward looking west (at the edge)", () => {
    const program = pipe(
      MR.begin,
      MR.nextMove(Command.Commands.Forward),
      MR.runEither({
        planet: "5x4",
        initial: "0,0:W",
        obstacles: ""
      })
    )

    expect(program).toEqual(
      E.right({
        rover: new Rover({ x: I.Four, y: I.Zero }, Orientation.West),
        history: [
          new ProgramState.HistoryEntry({ x: I.Zero, y: I.Zero }, Orientation.West),
          new ProgramState.HistoryEntry({ x: I.Four, y: I.Zero }, Orientation.West)
        ]
      })
    )
  })

  it("move backward looking north (at the edge)", () => {
    const program = pipe(
      MR.begin,
      MR.nextMove(Command.Commands.Backward),
      MR.runEither({
        planet: "5x4",
        initial: "0,0:N",
        obstacles: ""
      })
    )

    expect(program).toEqual(
      E.right({
        rover: new Rover({ x: I.Zero, y: I.Three }, Orientation.South),
        history: [
          new ProgramState.HistoryEntry({ x: I.Zero, y: I.Zero }, Orientation.North),
          new ProgramState.HistoryEntry({ x: I.Zero, y: I.Three }, Orientation.South)
        ]
      })
    )
  })

  it("move backward looking south (at the edge)", () => {
    const program = pipe(
      MR.begin,
      MR.nextMove(Command.Commands.Backward),
      MR.runEither({
        planet: "5x4",
        initial: "0,3:S",
        obstacles: ""
      })
    )

    expect(program).toEqual(
      E.right({
        rover: new Rover({ x: I.Zero, y: I.Zero }, Orientation.North),
        history: [
          new ProgramState.HistoryEntry({ x: I.Zero, y: I.Three }, Orientation.South),
          new ProgramState.HistoryEntry({ x: I.Zero, y: I.Zero }, Orientation.North)
        ]
      })
    )
  })

  it("move backward looking east (at the edge)", () => {
    const program = pipe(
      MR.begin,
      MR.nextMove(Command.Commands.Backward),
      MR.runEither({
        planet: "5x4",
        initial: "0,0:E",
        obstacles: ""
      })
    )

    expect(program).toEqual(
      E.right({
        rover: new Rover({ x: I.Four, y: I.Zero }, Orientation.West),
        history: [
          new ProgramState.HistoryEntry({ x: I.Zero, y: I.Zero }, Orientation.East),
          new ProgramState.HistoryEntry({ x: I.Four, y: I.Zero }, Orientation.West)
        ]
      })
    )
  })

  it("move backward looking west (at the edge)", () => {
    const program = pipe(
      MR.begin,
      MR.nextMove(Command.Commands.Backward),
      MR.runEither({
        planet: "5x4",
        initial: "4,0:W",
        obstacles: ""
      })
    )

    expect(program).toEqual(
      E.right({
        rover: new Rover({ x: I.Zero, y: I.Zero }, Orientation.East),
        history: [
          new ProgramState.HistoryEntry({ x: I.Four, y: I.Zero }, Orientation.West),
          new ProgramState.HistoryEntry({ x: I.Zero, y: I.Zero }, Orientation.East)
        ]
      })
    )
  })

  it("move left looking north (at the edge)", () => {
    const program = pipe(
      MR.begin,
      MR.nextMove(Command.Commands.Left),
      MR.runEither({
        planet: "5x4",
        initial: "0,0:N",
        obstacles: ""
      })
    )

    expect(program).toEqual(
      E.right({
        rover: new Rover({ x: I.Four, y: I.Zero }, Orientation.West),
        history: [
          new ProgramState.HistoryEntry({ x: I.Zero, y: I.Zero }, Orientation.North),
          new ProgramState.HistoryEntry({ x: I.Four, y: I.Zero }, Orientation.West)
        ]
      })
    )
  })

  it("move left looking south (at the edge)", () => {
    const program = pipe(
      MR.begin,
      MR.nextMove(Command.Commands.Left),
      MR.runEither({
        planet: "5x4",
        initial: "4,0:S",
        obstacles: ""
      })
    )

    expect(program).toEqual(
      E.right({
        rover: new Rover({ x: I.Zero, y: I.Zero }, Orientation.East),
        history: [
          new ProgramState.HistoryEntry({ x: I.Four, y: I.Zero }, Orientation.South),
          new ProgramState.HistoryEntry({ x: I.Zero, y: I.Zero }, Orientation.East)
        ]
      })
    )
  })

  it("move left looking east (at the edge)", () => {
    const program = pipe(
      MR.begin,
      MR.nextMove(Command.Commands.Left),
      MR.runEither({
        planet: "5x4",
        initial: "0,3:E",
        obstacles: ""
      })
    )

    expect(program).toEqual(
      E.right({
        rover: new Rover({ x: I.Zero, y: I.Zero }, Orientation.North),
        history: [
          new ProgramState.HistoryEntry({ x: I.Zero, y: I.Three }, Orientation.East),
          new ProgramState.HistoryEntry({ x: I.Zero, y: I.Zero }, Orientation.North)
        ]
      })
    )
  })

  it("move left looking west (at the edge)", () => {
    const program = pipe(
      MR.begin,
      MR.nextMove(Command.Commands.Left),
      MR.runEither({
        planet: "5x4",
        initial: "0,0:W",
        obstacles: ""
      })
    )

    expect(program).toEqual(
      E.right({
        rover: new Rover({ x: I.Zero, y: I.Three }, Orientation.South),
        history: [
          new ProgramState.HistoryEntry({ x: I.Zero, y: I.Zero }, Orientation.West),
          new ProgramState.HistoryEntry({ x: I.Zero, y: I.Three }, Orientation.South)
        ]
      })
    )
  })

  it("move right looking north (at the edge)", () => {
    const program = pipe(
      MR.begin,
      MR.nextMove(Command.Commands.Right),
      MR.runEither({
        planet: "5x4",
        initial: "4,0:N",
        obstacles: ""
      })
    )

    expect(program).toEqual(
      E.right({
        rover: new Rover({ x: I.Zero, y: I.Zero }, Orientation.East),
        history: [
          new ProgramState.HistoryEntry({ x: I.Four, y: I.Zero }, Orientation.North),
          new ProgramState.HistoryEntry({ x: I.Zero, y: I.Zero }, Orientation.East)
        ]
      })
    )
  })

  it("move right looking south (at the edge)", () => {
    const program = pipe(
      MR.begin,
      MR.nextMove(Command.Commands.Right),
      MR.runEither({
        planet: "5x4",
        initial: "0,0:S",
        obstacles: ""
      })
    )

    expect(program).toEqual(
      E.right({
        rover: new Rover({ x: I.Four, y: I.Zero }, Orientation.West),
        history: [
          new ProgramState.HistoryEntry({ x: I.Zero, y: I.Zero }, Orientation.South),
          new ProgramState.HistoryEntry({ x: I.Four, y: I.Zero }, Orientation.West)
        ]
      })
    )
  })

  it("move right looking east (at the edge)", () => {
    const program = pipe(
      MR.begin,
      MR.nextMove(Command.Commands.Right),
      MR.runEither({
        planet: "5x4",
        initial: "0,0:E",
        obstacles: ""
      })
    )

    expect(program).toEqual(
      E.right({
        rover: new Rover({ x: I.Zero, y: I.Three }, Orientation.South),
        history: [
          new ProgramState.HistoryEntry({ x: I.Zero, y: I.Zero }, Orientation.East),
          new ProgramState.HistoryEntry({ x: I.Zero, y: I.Three }, Orientation.South)
        ]
      })
    )
  })

  it("move right looking west (at the edge)", () => {
    const program = pipe(
      MR.begin,
      MR.nextMove(Command.Commands.Right),
      MR.runEither({
        planet: "5x4",
        initial: "0,3:W",
        obstacles: ""
      })
    )

    expect(program).toEqual(
      E.right({
        rover: new Rover({ x: I.Zero, y: I.Zero }, Orientation.North),
        history: [
          new ProgramState.HistoryEntry({ x: I.Zero, y: I.Three }, Orientation.West),
          new ProgramState.HistoryEntry({ x: I.Zero, y: I.Zero }, Orientation.North)
        ]
      })
    )
  })

  it("run batches of commands", () => {
    const program = pipe(
      MR.begin,
      MR.nextBatch(
        Command.Commands.Forward,
        Command.Commands.Right,
        Command.Commands.Forward
      ),
      MR.runEither({
        planet: "5x4",
        initial: "0,0:E",
        obstacles: ""
      })
    )

    expect(program).toEqual(
      E.right({
        rover: new Rover({ x: I.One, y: I.Two }, Orientation.South),
        history: [
          new ProgramState.HistoryEntry({ x: I.Zero, y: I.Zero }, Orientation.East),
          new ProgramState.HistoryEntry({ x: I.One, y: I.Zero }, Orientation.East),
          new ProgramState.HistoryEntry({ x: I.One, y: I.Three }, Orientation.South),
          new ProgramState.HistoryEntry({ x: I.One, y: I.Two }, Orientation.South)
        ]
      })
    )
  })
})
