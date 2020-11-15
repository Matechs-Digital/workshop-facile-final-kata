import * as Command from "../src/app/Command"
import * as MR from "../src/app/Program"
import * as ProgramState from "../src/app/ProgramState"
import * as E from "../src/common/Either"
import { pipe } from "../src/common/Function"
import * as I from "../src/common/Int"
import { Orientation } from "../src/domain/Orientation"
import { Planet } from "../src/domain/Planet"
import { PlanetPosition } from "../src/domain/PlanetPosition"
import { Rover } from "../src/domain/Rover"

const planet = new Planet(I.Five, I.Four, new Set())

describe("Rover", () => {
  it("init", () => {
    const state = MR.begin({
      planet: {
        width: I.Five,
        height: I.Four,
        obstacles: []
      },
      rover: {
        position: {
          x: I.Zero,
          y: I.Zero
        },
        orientation: Orientation.North
      }
    })

    expect(state).toMatchObject(
      E.right({
        rover: new Rover(planet, new PlanetPosition(I.Zero, I.Zero), Orientation.North),
        history: [
          new ProgramState.HistoryEntry(
            new PlanetPosition(I.Zero, I.Zero),
            Orientation.North
          )
        ]
      })
    )
  })

  it("move forward looking north (at edge)", () => {
    const state = MR.begin({
      planet: {
        width: I.Five,
        height: I.Four,
        obstacles: []
      },
      rover: {
        position: {
          x: I.Zero,
          y: I.Three
        },
        orientation: Orientation.North
      }
    })

    const program = pipe(state, MR.nextMove(Command.Commands.Forward))

    expect(program).toMatchObject(
      E.right({
        rover: new Rover(planet, new PlanetPosition(I.Zero, I.Zero), Orientation.North),
        history: [
          new ProgramState.HistoryEntry(
            new PlanetPosition(I.Zero, I.Three),
            Orientation.North
          ),
          new ProgramState.HistoryEntry(
            new PlanetPosition(I.Zero, I.Zero),
            Orientation.North
          )
        ]
      })
    )
  })

  it("move forward looking south (at the edge)", () => {
    const state = MR.begin({
      planet: {
        width: I.Five,
        height: I.Four,
        obstacles: []
      },
      rover: {
        position: {
          x: I.Zero,
          y: I.Zero
        },
        orientation: Orientation.South
      }
    })

    const program = pipe(state, MR.nextMove(Command.Commands.Forward))

    expect(program).toMatchObject(
      E.right({
        rover: new Rover(
          planet,
          new PlanetPosition(I.Zero, I.Three),
          Orientation.South
        ),
        history: [
          new ProgramState.HistoryEntry(
            new PlanetPosition(I.Zero, I.Zero),
            Orientation.South
          ),
          new ProgramState.HistoryEntry(
            new PlanetPosition(I.Zero, I.Three),
            Orientation.South
          )
        ]
      })
    )
  })

  it("move forward looking east (at the edge)", () => {
    const state = MR.begin({
      planet: {
        width: I.Five,
        height: I.Four,
        obstacles: []
      },
      rover: {
        position: {
          x: I.Four,
          y: I.Zero
        },
        orientation: Orientation.East
      }
    })

    const program = pipe(state, MR.nextMove(Command.Commands.Forward))

    expect(program).toMatchObject(
      E.right({
        rover: new Rover(planet, new PlanetPosition(I.Zero, I.Zero), Orientation.East),
        history: [
          new ProgramState.HistoryEntry(
            new PlanetPosition(I.Four, I.Zero),
            Orientation.East
          ),
          new ProgramState.HistoryEntry(
            new PlanetPosition(I.Zero, I.Zero),
            Orientation.East
          )
        ]
      })
    )
  })

  it("move forward looking west (at the edge)", () => {
    const state = MR.begin({
      planet: {
        width: I.Five,
        height: I.Four,
        obstacles: []
      },
      rover: {
        position: {
          x: I.Zero,
          y: I.Zero
        },
        orientation: Orientation.West
      }
    })

    const program = pipe(state, MR.nextMove(Command.Commands.Forward))

    expect(program).toMatchObject(
      E.right({
        rover: new Rover(planet, new PlanetPosition(I.Four, I.Zero), Orientation.West),
        history: [
          new ProgramState.HistoryEntry(
            new PlanetPosition(I.Zero, I.Zero),
            Orientation.West
          ),
          new ProgramState.HistoryEntry(
            new PlanetPosition(I.Four, I.Zero),
            Orientation.West
          )
        ]
      })
    )
  })

  it("move backward looking north (at the edge)", () => {
    const state = MR.begin({
      planet: {
        width: I.Five,
        height: I.Four,
        obstacles: []
      },
      rover: {
        position: {
          x: I.Zero,
          y: I.Zero
        },
        orientation: Orientation.North
      }
    })

    const program = pipe(state, MR.nextMove(Command.Commands.Backward))

    expect(program).toMatchObject(
      E.right({
        rover: new Rover(
          planet,
          new PlanetPosition(I.Zero, I.Three),
          Orientation.South
        ),
        history: [
          new ProgramState.HistoryEntry(
            new PlanetPosition(I.Zero, I.Zero),
            Orientation.North
          ),
          new ProgramState.HistoryEntry(
            new PlanetPosition(I.Zero, I.Three),
            Orientation.South
          )
        ]
      })
    )
  })

  it("move backward looking south (at the edge)", () => {
    const state = MR.begin({
      planet: {
        width: I.Five,
        height: I.Four,
        obstacles: []
      },
      rover: {
        position: {
          x: I.Zero,
          y: I.Three
        },
        orientation: Orientation.South
      }
    })

    const program = pipe(state, MR.nextMove(Command.Commands.Backward))

    expect(program).toMatchObject(
      E.right({
        rover: new Rover(planet, new PlanetPosition(I.Zero, I.Zero), Orientation.North),
        history: [
          new ProgramState.HistoryEntry(
            new PlanetPosition(I.Zero, I.Three),
            Orientation.South
          ),
          new ProgramState.HistoryEntry(
            new PlanetPosition(I.Zero, I.Zero),
            Orientation.North
          )
        ]
      })
    )
  })

  it("move backward looking east (at the edge)", () => {
    const state = MR.begin({
      planet: {
        width: I.Five,
        height: I.Four,
        obstacles: []
      },
      rover: {
        position: {
          x: I.Zero,
          y: I.Zero
        },
        orientation: Orientation.East
      }
    })

    const program = pipe(state, MR.nextMove(Command.Commands.Backward))

    expect(program).toMatchObject(
      E.right({
        rover: new Rover(planet, new PlanetPosition(I.Four, I.Zero), Orientation.West),
        history: [
          new ProgramState.HistoryEntry(
            new PlanetPosition(I.Zero, I.Zero),
            Orientation.East
          ),
          new ProgramState.HistoryEntry(
            new PlanetPosition(I.Four, I.Zero),
            Orientation.West
          )
        ]
      })
    )
  })

  it("move backward looking west (at the edge)", () => {
    const state = MR.begin({
      planet: {
        width: I.Five,
        height: I.Four,
        obstacles: []
      },
      rover: {
        position: {
          x: I.Four,
          y: I.Zero
        },
        orientation: Orientation.West
      }
    })

    const program = pipe(state, MR.nextMove(Command.Commands.Backward))

    expect(program).toMatchObject(
      E.right({
        rover: new Rover(planet, new PlanetPosition(I.Zero, I.Zero), Orientation.East),
        history: [
          new ProgramState.HistoryEntry(
            new PlanetPosition(I.Four, I.Zero),
            Orientation.West
          ),
          new ProgramState.HistoryEntry(
            new PlanetPosition(I.Zero, I.Zero),
            Orientation.East
          )
        ]
      })
    )
  })

  it("move left looking north (at the edge)", () => {
    const state = MR.begin({
      planet: {
        width: I.Five,
        height: I.Four,
        obstacles: []
      },
      rover: {
        position: {
          x: I.Zero,
          y: I.Zero
        },
        orientation: Orientation.North
      }
    })

    const program = pipe(state, MR.nextMove(Command.Commands.Left))

    expect(program).toMatchObject(
      E.right({
        rover: new Rover(planet, new PlanetPosition(I.Four, I.Zero), Orientation.West),
        history: [
          new ProgramState.HistoryEntry(
            new PlanetPosition(I.Zero, I.Zero),
            Orientation.North
          ),
          new ProgramState.HistoryEntry(
            new PlanetPosition(I.Four, I.Zero),
            Orientation.West
          )
        ]
      })
    )
  })

  it("move left looking south (at the edge)", () => {
    const state = MR.begin({
      planet: {
        width: I.Five,
        height: I.Four,
        obstacles: []
      },
      rover: {
        position: {
          x: I.Four,
          y: I.Zero
        },
        orientation: Orientation.South
      }
    })

    const program = pipe(state, MR.nextMove(Command.Commands.Left))

    expect(program).toMatchObject(
      E.right({
        rover: new Rover(planet, new PlanetPosition(I.Zero, I.Zero), Orientation.East),
        history: [
          new ProgramState.HistoryEntry(
            new PlanetPosition(I.Four, I.Zero),
            Orientation.South
          ),
          new ProgramState.HistoryEntry(
            new PlanetPosition(I.Zero, I.Zero),
            Orientation.East
          )
        ]
      })
    )
  })

  it("move left looking east (at the edge)", () => {
    const state = MR.begin({
      planet: {
        width: I.Five,
        height: I.Four,
        obstacles: []
      },
      rover: {
        position: {
          x: I.Zero,
          y: I.Three
        },
        orientation: Orientation.East
      }
    })

    const program = pipe(state, MR.nextMove(Command.Commands.Left))

    expect(program).toMatchObject(
      E.right({
        rover: new Rover(planet, new PlanetPosition(I.Zero, I.Zero), Orientation.North),
        history: [
          new ProgramState.HistoryEntry(
            new PlanetPosition(I.Zero, I.Three),
            Orientation.East
          ),
          new ProgramState.HistoryEntry(
            new PlanetPosition(I.Zero, I.Zero),
            Orientation.North
          )
        ]
      })
    )
  })

  it("move left looking west (at the edge)", () => {
    const state = MR.begin({
      planet: {
        width: I.Five,
        height: I.Four,
        obstacles: []
      },
      rover: {
        position: {
          x: I.Zero,
          y: I.Zero
        },
        orientation: Orientation.West
      }
    })

    const program = pipe(state, MR.nextMove(Command.Commands.Left))

    expect(program).toMatchObject(
      E.right({
        rover: new Rover(
          planet,
          new PlanetPosition(I.Zero, I.Three),
          Orientation.South
        ),
        history: [
          new ProgramState.HistoryEntry(
            new PlanetPosition(I.Zero, I.Zero),
            Orientation.West
          ),
          new ProgramState.HistoryEntry(
            new PlanetPosition(I.Zero, I.Three),
            Orientation.South
          )
        ]
      })
    )
  })

  it("move right looking north (at the edge)", () => {
    const state = MR.begin({
      planet: {
        width: I.Five,
        height: I.Four,
        obstacles: []
      },
      rover: {
        position: {
          x: I.Four,
          y: I.Zero
        },
        orientation: Orientation.North
      }
    })

    const program = pipe(state, MR.nextMove(Command.Commands.Right))

    expect(program).toMatchObject(
      E.right({
        rover: new Rover(planet, new PlanetPosition(I.Zero, I.Zero), Orientation.East),
        history: [
          new ProgramState.HistoryEntry(
            new PlanetPosition(I.Four, I.Zero),
            Orientation.North
          ),
          new ProgramState.HistoryEntry(
            new PlanetPosition(I.Zero, I.Zero),
            Orientation.East
          )
        ]
      })
    )
  })

  it("move right looking south (at the edge)", () => {
    const state = MR.begin({
      planet: {
        width: I.Five,
        height: I.Four,
        obstacles: []
      },
      rover: {
        position: {
          x: I.Zero,
          y: I.Zero
        },
        orientation: Orientation.South
      }
    })

    const program = pipe(state, MR.nextMove(Command.Commands.Right))

    expect(program).toMatchObject(
      E.right({
        rover: new Rover(planet, new PlanetPosition(I.Four, I.Zero), Orientation.West),
        history: [
          new ProgramState.HistoryEntry(
            new PlanetPosition(I.Zero, I.Zero),
            Orientation.South
          ),
          new ProgramState.HistoryEntry(
            new PlanetPosition(I.Four, I.Zero),
            Orientation.West
          )
        ]
      })
    )
  })

  it("move right looking east (at the edge)", () => {
    const state = MR.begin({
      planet: {
        width: I.Five,
        height: I.Four,
        obstacles: []
      },
      rover: {
        position: {
          x: I.Zero,
          y: I.Zero
        },
        orientation: Orientation.East
      }
    })

    const program = pipe(state, MR.nextMove(Command.Commands.Right))

    expect(program).toMatchObject(
      E.right({
        rover: new Rover(
          planet,
          new PlanetPosition(I.Zero, I.Three),
          Orientation.South
        ),
        history: [
          new ProgramState.HistoryEntry(
            new PlanetPosition(I.Zero, I.Zero),
            Orientation.East
          ),
          new ProgramState.HistoryEntry(
            new PlanetPosition(I.Zero, I.Three),
            Orientation.South
          )
        ]
      })
    )
  })

  it("move right looking west (at the edge)", () => {
    const state = MR.begin({
      planet: {
        width: I.Five,
        height: I.Four,
        obstacles: []
      },
      rover: {
        position: {
          x: I.Zero,
          y: I.Three
        },
        orientation: Orientation.West
      }
    })

    const program = pipe(state, MR.nextMove(Command.Commands.Right))

    expect(program).toMatchObject(
      E.right({
        rover: new Rover(planet, new PlanetPosition(I.Zero, I.Zero), Orientation.North),
        history: [
          new ProgramState.HistoryEntry(
            new PlanetPosition(I.Zero, I.Three),
            Orientation.West
          ),
          new ProgramState.HistoryEntry(
            new PlanetPosition(I.Zero, I.Zero),
            Orientation.North
          )
        ]
      })
    )
  })

  it("run batches of commands", () => {
    const state = MR.begin({
      planet: {
        width: I.Five,
        height: I.Four,
        obstacles: []
      },
      rover: {
        position: {
          x: I.Zero,
          y: I.Zero
        },
        orientation: Orientation.East
      }
    })

    const program = pipe(
      state,
      MR.nextBatch(
        Command.Commands.Forward,
        Command.Commands.Right,
        Command.Commands.Forward
      )
    )

    expect(program).toMatchObject(
      E.right({
        rover: new Rover(planet, new PlanetPosition(I.One, I.Two), Orientation.South),
        history: [
          new ProgramState.HistoryEntry(
            new PlanetPosition(I.Zero, I.Zero),
            Orientation.East
          ),
          new ProgramState.HistoryEntry(
            new PlanetPosition(I.One, I.Zero),
            Orientation.East
          ),
          new ProgramState.HistoryEntry(
            new PlanetPosition(I.One, I.Three),
            Orientation.South
          ),
          new ProgramState.HistoryEntry(
            new PlanetPosition(I.One, I.Two),
            Orientation.South
          )
        ]
      })
    )
  })
})
