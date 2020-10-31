import * as MR from "../src"
import * as I from "../src/common/Int"
import * as E from "../src/utils/either"
import { pipe } from "../src/utils/pipe"

const planet = new MR.Planet(I.Five, I.Four)

describe("Rover", () => {
  it("init", () => {
    const state = MR.initialState({
      planet: {
        width: I.Five,
        height: I.Four
      },
      rover: {
        position: {
          x: I.Zero,
          y: I.Zero
        },
        orientation: "N"
      }
    })

    expect(state).toEqual(
      E.right({
        planet,
        rover: new MR.Rover(new MR.Position(I.Zero, I.Zero), "N"),
        history: [new MR.Point(new MR.Position(I.Zero, I.Zero), "N")]
      })
    )
  })

  it("move forward looking north (at edge)", () => {
    const state = MR.initialState({
      planet: {
        width: I.Five,
        height: I.Four
      },
      rover: {
        position: {
          x: I.Zero,
          y: I.Three
        },
        orientation: "N"
      }
    })

    const program = pipe(state, MR.nextMove("f"))

    expect(program).toEqual(
      E.right({
        planet,
        rover: new MR.Rover(new MR.Position(I.Zero, I.Zero), "N"),
        history: [
          new MR.Point(new MR.Position(I.Zero, I.Three), "N"),
          new MR.Point(new MR.Position(I.Zero, I.Zero), "N")
        ]
      })
    )
  })

  it("move forward looking south (at the edge)", () => {
    const state = MR.initialState({
      planet: {
        width: I.Five,
        height: I.Four
      },
      rover: {
        position: {
          x: I.Zero,
          y: I.Zero
        },
        orientation: "S"
      }
    })

    const program = pipe(state, MR.nextMove("f"))

    expect(program).toEqual(
      E.right({
        planet,
        rover: new MR.Rover(new MR.Position(I.Zero, I.Three), "S"),
        history: [
          new MR.Point(new MR.Position(I.Zero, I.Zero), "S"),
          new MR.Point(new MR.Position(I.Zero, I.Three), "S")
        ]
      })
    )
  })

  it("move forward looking east (at the edge)", () => {
    const state = MR.initialState({
      planet: {
        width: I.Five,
        height: I.Four
      },
      rover: {
        position: {
          x: I.Four,
          y: I.Zero
        },
        orientation: "E"
      }
    })

    const program = pipe(state, MR.nextMove("f"))

    expect(program).toEqual(
      E.right({
        planet,
        rover: new MR.Rover(new MR.Position(I.Zero, I.Zero), "E"),
        history: [
          new MR.Point(new MR.Position(I.Four, I.Zero), "E"),
          new MR.Point(new MR.Position(I.Zero, I.Zero), "E")
        ]
      })
    )
  })

  it("move forward looking west (at the edge)", () => {
    const state = MR.initialState({
      planet: {
        width: I.Five,
        height: I.Four
      },
      rover: {
        position: {
          x: I.Zero,
          y: I.Zero
        },
        orientation: "W"
      }
    })

    const program = pipe(state, MR.nextMove("f"))

    expect(program).toEqual(
      E.right({
        planet,
        rover: new MR.Rover(new MR.Position(I.Four, I.Zero), "W"),
        history: [
          new MR.Point(new MR.Position(I.Zero, I.Zero), "W"),
          new MR.Point(new MR.Position(I.Four, I.Zero), "W")
        ]
      })
    )
  })

  it("move backward looking north (at the edge)", () => {
    const state = MR.initialState({
      planet: {
        width: I.Five,
        height: I.Four
      },
      rover: {
        position: {
          x: I.Zero,
          y: I.Zero
        },
        orientation: "N"
      }
    })

    const program = pipe(state, MR.nextMove("b"))

    expect(program).toEqual(
      E.right({
        planet,
        rover: new MR.Rover(new MR.Position(I.Zero, I.Three), "S"),
        history: [
          new MR.Point(new MR.Position(I.Zero, I.Zero), "N"),
          new MR.Point(new MR.Position(I.Zero, I.Three), "S")
        ]
      })
    )
  })

  it("move backward looking south (at the edge)", () => {
    const state = MR.initialState({
      planet: {
        width: I.Five,
        height: I.Four
      },
      rover: {
        position: {
          x: I.Zero,
          y: I.Three
        },
        orientation: "S"
      }
    })

    const program = pipe(state, MR.nextMove("b"))

    expect(program).toEqual(
      E.right({
        planet,
        rover: new MR.Rover(new MR.Position(I.Zero, I.Zero), "N"),
        history: [
          new MR.Point(new MR.Position(I.Zero, I.Three), "S"),
          new MR.Point(new MR.Position(I.Zero, I.Zero), "N")
        ]
      })
    )
  })

  it("move backward looking east (at the edge)", () => {
    const state = MR.initialState({
      planet: {
        width: I.Five,
        height: I.Four
      },
      rover: {
        position: {
          x: I.Zero,
          y: I.Zero
        },
        orientation: "E"
      }
    })

    const program = pipe(state, MR.nextMove("b"))

    expect(program).toEqual(
      E.right({
        planet,
        rover: new MR.Rover(new MR.Position(I.Four, I.Zero), "W"),
        history: [
          new MR.Point(new MR.Position(I.Zero, I.Zero), "E"),
          new MR.Point(new MR.Position(I.Four, I.Zero), "W")
        ]
      })
    )
  })

  it("move backward looking west (at the edge)", () => {
    const state = MR.initialState({
      planet: {
        width: I.Five,
        height: I.Four
      },
      rover: {
        position: {
          x: I.Four,
          y: I.Zero
        },
        orientation: "W"
      }
    })

    const program = pipe(state, MR.nextMove("b"))

    expect(program).toEqual(
      E.right({
        planet,
        rover: new MR.Rover(new MR.Position(I.Zero, I.Zero), "E"),
        history: [
          new MR.Point(new MR.Position(I.Four, I.Zero), "W"),
          new MR.Point(new MR.Position(I.Zero, I.Zero), "E")
        ]
      })
    )
  })

  it("move left looking north (at the edge)", () => {
    const state = MR.initialState({
      planet: {
        width: I.Five,
        height: I.Four
      },
      rover: {
        position: {
          x: I.Zero,
          y: I.Zero
        },
        orientation: "N"
      }
    })

    const program = pipe(state, MR.nextMove("l"))

    expect(program).toEqual(
      E.right({
        planet,
        rover: new MR.Rover(new MR.Position(I.Four, I.Zero), "W"),
        history: [
          new MR.Point(new MR.Position(I.Zero, I.Zero), "N"),
          new MR.Point(new MR.Position(I.Four, I.Zero), "W")
        ]
      })
    )
  })

  it("move left looking south (at the edge)", () => {
    const state = MR.initialState({
      planet: {
        width: I.Five,
        height: I.Four
      },
      rover: {
        position: {
          x: I.Four,
          y: I.Zero
        },
        orientation: "S"
      }
    })

    const program = pipe(state, MR.nextMove("l"))

    expect(program).toEqual(
      E.right({
        planet,
        rover: new MR.Rover(new MR.Position(I.Zero, I.Zero), "E"),
        history: [
          new MR.Point(new MR.Position(I.Four, I.Zero), "S"),
          new MR.Point(new MR.Position(I.Zero, I.Zero), "E")
        ]
      })
    )
  })

  it("move left looking east (at the edge)", () => {
    const state = MR.initialState({
      planet: {
        width: I.Five,
        height: I.Four
      },
      rover: {
        position: {
          x: I.Zero,
          y: I.Three
        },
        orientation: "E"
      }
    })

    const program = pipe(state, MR.nextMove("l"))

    expect(program).toEqual(
      E.right({
        planet,
        rover: new MR.Rover(new MR.Position(I.Zero, I.Zero), "N"),
        history: [
          new MR.Point(new MR.Position(I.Zero, I.Three), "E"),
          new MR.Point(new MR.Position(I.Zero, I.Zero), "N")
        ]
      })
    )
  })

  it("move left looking west (at the edge)", () => {
    const state = MR.initialState({
      planet: {
        width: I.Five,
        height: I.Four
      },
      rover: {
        position: {
          x: I.Zero,
          y: I.Zero
        },
        orientation: "W"
      }
    })

    const program = pipe(state, MR.nextMove("l"))

    expect(program).toEqual(
      E.right({
        planet,
        rover: new MR.Rover(new MR.Position(I.Zero, I.Three), "S"),
        history: [
          new MR.Point(new MR.Position(I.Zero, I.Zero), "W"),
          new MR.Point(new MR.Position(I.Zero, I.Three), "S")
        ]
      })
    )
  })

  it("move right looking north (at the edge)", () => {
    const state = MR.initialState({
      planet: {
        width: I.Five,
        height: I.Four
      },
      rover: {
        position: {
          x: I.Four,
          y: I.Zero
        },
        orientation: "N"
      }
    })

    const program = pipe(state, MR.nextMove("r"))

    expect(program).toEqual(
      E.right({
        planet,
        rover: new MR.Rover(new MR.Position(I.Zero, I.Zero), "E"),
        history: [
          new MR.Point(new MR.Position(I.Four, I.Zero), "N"),
          new MR.Point(new MR.Position(I.Zero, I.Zero), "E")
        ]
      })
    )
  })

  it("move right looking south (at the edge)", () => {
    const state = MR.initialState({
      planet: {
        width: I.Five,
        height: I.Four
      },
      rover: {
        position: {
          x: I.Zero,
          y: I.Zero
        },
        orientation: "S"
      }
    })

    const program = pipe(state, MR.nextMove("r"))

    expect(program).toEqual(
      E.right({
        planet,
        rover: new MR.Rover(new MR.Position(I.Four, I.Zero), "W"),
        history: [
          new MR.Point(new MR.Position(I.Zero, I.Zero), "S"),
          new MR.Point(new MR.Position(I.Four, I.Zero), "W")
        ]
      })
    )
  })

  it("move right looking east (at the edge)", () => {
    const state = MR.initialState({
      planet: {
        width: I.Five,
        height: I.Four
      },
      rover: {
        position: {
          x: I.Zero,
          y: I.Zero
        },
        orientation: "E"
      }
    })

    const program = pipe(state, MR.nextMove("r"))

    expect(program).toEqual(
      E.right({
        planet,
        rover: new MR.Rover(new MR.Position(I.Zero, I.Three), "S"),
        history: [
          new MR.Point(new MR.Position(I.Zero, I.Zero), "E"),
          new MR.Point(new MR.Position(I.Zero, I.Three), "S")
        ]
      })
    )
  })

  it("move right looking west (at the edge)", () => {
    const state = MR.initialState({
      planet: {
        width: I.Five,
        height: I.Four
      },
      rover: {
        position: {
          x: I.Zero,
          y: I.Three
        },
        orientation: "W"
      }
    })

    const program = pipe(state, MR.nextMove("r"))

    expect(program).toEqual(
      E.right({
        planet,
        rover: new MR.Rover(new MR.Position(I.Zero, I.Zero), "N"),
        history: [
          new MR.Point(new MR.Position(I.Zero, I.Three), "W"),
          new MR.Point(new MR.Position(I.Zero, I.Zero), "N")
        ]
      })
    )
  })

  it("run batches of commands", () => {
    const state = MR.initialState({
      planet: {
        width: I.Five,
        height: I.Four
      },
      rover: {
        position: {
          x: I.Zero,
          y: I.Zero
        },
        orientation: "E"
      }
    })

    const program = pipe(state, MR.nextBatch("f", "r", "f"))

    expect(program).toEqual(
      E.right({
        planet,
        rover: new MR.Rover(new MR.Position(I.One, I.Two), "S"),
        history: [
          new MR.Point(new MR.Position(I.Zero, I.Zero), "E"),
          new MR.Point(new MR.Position(I.One, I.Zero), "E"),
          new MR.Point(new MR.Position(I.One, I.Three), "S"),
          new MR.Point(new MR.Position(I.One, I.Two), "S")
        ]
      })
    )
  })
})
