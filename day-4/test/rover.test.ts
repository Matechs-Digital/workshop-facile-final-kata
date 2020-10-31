import * as MR from "../src"
import * as I from "../src/common/Int"
import * as E from "../src/utils/either"
import { pipe } from "../src/utils/pipe"

const planet = new MR.Planet(I.wrapIso(5), I.wrapIso(4))

describe("Rover", () => {
  it("init", () => {
    const state = MR.initialState({
      planet: {
        width: I.wrapIso(5),
        height: I.wrapIso(4)
      },
      rover: {
        position: {
          x: I.wrapIso(0),
          y: I.wrapIso(0)
        },
        orientation: "N"
      }
    })

    expect(state).toEqual(
      E.right({
        planet,
        rover: new MR.Rover(new MR.Position(I.wrapIso(0), I.wrapIso(0)), "N"),
        history: [new MR.Point(new MR.Position(I.wrapIso(0), I.wrapIso(0)), "N")]
      })
    )
  })

  it("move forward looking north (at edge)", () => {
    const state = MR.initialState({
      planet: {
        width: I.wrapIso(5),
        height: I.wrapIso(4)
      },
      rover: {
        position: {
          x: I.wrapIso(0),
          y: I.wrapIso(3)
        },
        orientation: "N"
      }
    })

    const program = pipe(state, MR.nextMove("f"))

    expect(program).toEqual(
      E.right({
        planet,
        rover: new MR.Rover(new MR.Position(I.wrapIso(0), I.wrapIso(0)), "N"),
        history: [
          new MR.Point(new MR.Position(I.wrapIso(0), I.wrapIso(3)), "N"),
          new MR.Point(new MR.Position(I.wrapIso(0), I.wrapIso(0)), "N")
        ]
      })
    )
  })

  it("move forward looking south (at the edge)", () => {
    const state = MR.initialState({
      planet: {
        width: I.wrapIso(5),
        height: I.wrapIso(4)
      },
      rover: {
        position: {
          x: I.wrapIso(0),
          y: I.wrapIso(0)
        },
        orientation: "S"
      }
    })

    const program = pipe(state, MR.nextMove("f"))

    expect(program).toEqual(
      E.right({
        planet,
        rover: new MR.Rover(new MR.Position(I.wrapIso(0), I.wrapIso(3)), "S"),
        history: [
          new MR.Point(new MR.Position(I.wrapIso(0), I.wrapIso(0)), "S"),
          new MR.Point(new MR.Position(I.wrapIso(0), I.wrapIso(3)), "S")
        ]
      })
    )
  })

  it("move forward looking east (at the edge)", () => {
    const state = MR.initialState({
      planet: {
        width: I.wrapIso(5),
        height: I.wrapIso(4)
      },
      rover: {
        position: {
          x: I.wrapIso(4),
          y: I.wrapIso(0)
        },
        orientation: "E"
      }
    })

    const program = pipe(state, MR.nextMove("f"))

    expect(program).toEqual(
      E.right({
        planet,
        rover: new MR.Rover(new MR.Position(I.wrapIso(0), I.wrapIso(0)), "E"),
        history: [
          new MR.Point(new MR.Position(I.wrapIso(4), I.wrapIso(0)), "E"),
          new MR.Point(new MR.Position(I.wrapIso(0), I.wrapIso(0)), "E")
        ]
      })
    )
  })

  it("move forward looking west (at the edge)", () => {
    const state = MR.initialState({
      planet: {
        width: I.wrapIso(5),
        height: I.wrapIso(4)
      },
      rover: {
        position: {
          x: I.wrapIso(0),
          y: I.wrapIso(0)
        },
        orientation: "W"
      }
    })

    const program = pipe(state, MR.nextMove("f"))

    expect(program).toEqual(
      E.right({
        planet,
        rover: new MR.Rover(new MR.Position(I.wrapIso(4), I.wrapIso(0)), "W"),
        history: [
          new MR.Point(new MR.Position(I.wrapIso(0), I.wrapIso(0)), "W"),
          new MR.Point(new MR.Position(I.wrapIso(4), I.wrapIso(0)), "W")
        ]
      })
    )
  })

  it("move backward looking north (at the edge)", () => {
    const state = MR.initialState({
      planet: {
        width: I.wrapIso(5),
        height: I.wrapIso(4)
      },
      rover: {
        position: {
          x: I.wrapIso(0),
          y: I.wrapIso(0)
        },
        orientation: "N"
      }
    })

    const program = pipe(state, MR.nextMove("b"))

    expect(program).toEqual(
      E.right({
        planet,
        rover: new MR.Rover(new MR.Position(I.wrapIso(0), I.wrapIso(3)), "S"),
        history: [
          new MR.Point(new MR.Position(I.wrapIso(0), I.wrapIso(0)), "N"),
          new MR.Point(new MR.Position(I.wrapIso(0), I.wrapIso(3)), "S")
        ]
      })
    )
  })

  it("move backward looking south (at the edge)", () => {
    const state = MR.initialState({
      planet: {
        width: I.wrapIso(5),
        height: I.wrapIso(4)
      },
      rover: {
        position: {
          x: I.wrapIso(0),
          y: I.wrapIso(3)
        },
        orientation: "S"
      }
    })

    const program = pipe(state, MR.nextMove("b"))

    expect(program).toEqual(
      E.right({
        planet,
        rover: new MR.Rover(new MR.Position(I.wrapIso(0), I.wrapIso(0)), "N"),
        history: [
          new MR.Point(new MR.Position(I.wrapIso(0), I.wrapIso(3)), "S"),
          new MR.Point(new MR.Position(I.wrapIso(0), I.wrapIso(0)), "N")
        ]
      })
    )
  })

  it("move backward looking east (at the edge)", () => {
    const state = MR.initialState({
      planet: {
        width: I.wrapIso(5),
        height: I.wrapIso(4)
      },
      rover: {
        position: {
          x: I.wrapIso(0),
          y: I.wrapIso(0)
        },
        orientation: "E"
      }
    })

    const program = pipe(state, MR.nextMove("b"))

    expect(program).toEqual(
      E.right({
        planet,
        rover: new MR.Rover(new MR.Position(I.wrapIso(4), I.wrapIso(0)), "W"),
        history: [
          new MR.Point(new MR.Position(I.wrapIso(0), I.wrapIso(0)), "E"),
          new MR.Point(new MR.Position(I.wrapIso(4), I.wrapIso(0)), "W")
        ]
      })
    )
  })

  it("move backward looking west (at the edge)", () => {
    const state = MR.initialState({
      planet: {
        width: I.wrapIso(5),
        height: I.wrapIso(4)
      },
      rover: {
        position: {
          x: I.wrapIso(4),
          y: I.wrapIso(0)
        },
        orientation: "W"
      }
    })

    const program = pipe(state, MR.nextMove("b"))

    expect(program).toEqual(
      E.right({
        planet,
        rover: new MR.Rover(new MR.Position(I.wrapIso(0), I.wrapIso(0)), "E"),
        history: [
          new MR.Point(new MR.Position(I.wrapIso(4), I.wrapIso(0)), "W"),
          new MR.Point(new MR.Position(I.wrapIso(0), I.wrapIso(0)), "E")
        ]
      })
    )
  })

  it("move left looking north (at the edge)", () => {
    const state = MR.initialState({
      planet: {
        width: I.wrapIso(5),
        height: I.wrapIso(4)
      },
      rover: {
        position: {
          x: I.wrapIso(0),
          y: I.wrapIso(0)
        },
        orientation: "N"
      }
    })

    const program = pipe(state, MR.nextMove("l"))

    expect(program).toEqual(
      E.right({
        planet,
        rover: new MR.Rover(new MR.Position(I.wrapIso(4), I.wrapIso(0)), "W"),
        history: [
          new MR.Point(new MR.Position(I.wrapIso(0), I.wrapIso(0)), "N"),
          new MR.Point(new MR.Position(I.wrapIso(4), I.wrapIso(0)), "W")
        ]
      })
    )
  })

  it("move left looking south (at the edge)", () => {
    const state = MR.initialState({
      planet: {
        width: I.wrapIso(5),
        height: I.wrapIso(4)
      },
      rover: {
        position: {
          x: I.wrapIso(4),
          y: I.wrapIso(0)
        },
        orientation: "S"
      }
    })

    const program = pipe(state, MR.nextMove("l"))

    expect(program).toEqual(
      E.right({
        planet,
        rover: new MR.Rover(new MR.Position(I.wrapIso(0), I.wrapIso(0)), "E"),
        history: [
          new MR.Point(new MR.Position(I.wrapIso(4), I.wrapIso(0)), "S"),
          new MR.Point(new MR.Position(I.wrapIso(0), I.wrapIso(0)), "E")
        ]
      })
    )
  })

  it("move left looking east (at the edge)", () => {
    const state = MR.initialState({
      planet: {
        width: I.wrapIso(5),
        height: I.wrapIso(4)
      },
      rover: {
        position: {
          x: I.wrapIso(0),
          y: I.wrapIso(3)
        },
        orientation: "E"
      }
    })

    const program = pipe(state, MR.nextMove("l"))

    expect(program).toEqual(
      E.right({
        planet,
        rover: new MR.Rover(new MR.Position(I.wrapIso(0), I.wrapIso(0)), "N"),
        history: [
          new MR.Point(new MR.Position(I.wrapIso(0), I.wrapIso(3)), "E"),
          new MR.Point(new MR.Position(I.wrapIso(0), I.wrapIso(0)), "N")
        ]
      })
    )
  })

  it("move left looking west (at the edge)", () => {
    const state = MR.initialState({
      planet: {
        width: I.wrapIso(5),
        height: I.wrapIso(4)
      },
      rover: {
        position: {
          x: I.wrapIso(0),
          y: I.wrapIso(0)
        },
        orientation: "W"
      }
    })

    const program = pipe(state, MR.nextMove("l"))

    expect(program).toEqual(
      E.right({
        planet,
        rover: new MR.Rover(new MR.Position(I.wrapIso(0), I.wrapIso(3)), "S"),
        history: [
          new MR.Point(new MR.Position(I.wrapIso(0), I.wrapIso(0)), "W"),
          new MR.Point(new MR.Position(I.wrapIso(0), I.wrapIso(3)), "S")
        ]
      })
    )
  })

  it("move right looking north (at the edge)", () => {
    const state = MR.initialState({
      planet: {
        width: I.wrapIso(5),
        height: I.wrapIso(4)
      },
      rover: {
        position: {
          x: I.wrapIso(4),
          y: I.wrapIso(0)
        },
        orientation: "N"
      }
    })

    const program = pipe(state, MR.nextMove("r"))

    expect(program).toEqual(
      E.right({
        planet,
        rover: new MR.Rover(new MR.Position(I.wrapIso(0), I.wrapIso(0)), "E"),
        history: [
          new MR.Point(new MR.Position(I.wrapIso(4), I.wrapIso(0)), "N"),
          new MR.Point(new MR.Position(I.wrapIso(0), I.wrapIso(0)), "E")
        ]
      })
    )
  })

  it("move right looking south (at the edge)", () => {
    const state = MR.initialState({
      planet: {
        width: I.wrapIso(5),
        height: I.wrapIso(4)
      },
      rover: {
        position: {
          x: I.wrapIso(0),
          y: I.wrapIso(0)
        },
        orientation: "S"
      }
    })

    const program = pipe(state, MR.nextMove("r"))

    expect(program).toEqual(
      E.right({
        planet,
        rover: new MR.Rover(new MR.Position(I.wrapIso(4), I.wrapIso(0)), "W"),
        history: [
          new MR.Point(new MR.Position(I.wrapIso(0), I.wrapIso(0)), "S"),
          new MR.Point(new MR.Position(I.wrapIso(4), I.wrapIso(0)), "W")
        ]
      })
    )
  })

  it("move right looking east (at the edge)", () => {
    const state = MR.initialState({
      planet: {
        width: I.wrapIso(5),
        height: I.wrapIso(4)
      },
      rover: {
        position: {
          x: I.wrapIso(0),
          y: I.wrapIso(0)
        },
        orientation: "E"
      }
    })

    const program = pipe(state, MR.nextMove("r"))

    expect(program).toEqual(
      E.right({
        planet,
        rover: new MR.Rover(new MR.Position(I.wrapIso(0), I.wrapIso(3)), "S"),
        history: [
          new MR.Point(new MR.Position(I.wrapIso(0), I.wrapIso(0)), "E"),
          new MR.Point(new MR.Position(I.wrapIso(0), I.wrapIso(3)), "S")
        ]
      })
    )
  })

  it("move right looking west (at the edge)", () => {
    const state = MR.initialState({
      planet: {
        width: I.wrapIso(5),
        height: I.wrapIso(4)
      },
      rover: {
        position: {
          x: I.wrapIso(0),
          y: I.wrapIso(3)
        },
        orientation: "W"
      }
    })

    const program = pipe(state, MR.nextMove("r"))

    expect(program).toEqual(
      E.right({
        planet,
        rover: new MR.Rover(new MR.Position(I.wrapIso(0), I.wrapIso(0)), "N"),
        history: [
          new MR.Point(new MR.Position(I.wrapIso(0), I.wrapIso(3)), "W"),
          new MR.Point(new MR.Position(I.wrapIso(0), I.wrapIso(0)), "N")
        ]
      })
    )
  })

  it("run batches of commands", () => {
    const state = MR.initialState({
      planet: {
        width: I.wrapIso(5),
        height: I.wrapIso(4)
      },
      rover: {
        position: {
          x: I.wrapIso(0),
          y: I.wrapIso(0)
        },
        orientation: "E"
      }
    })

    const program = pipe(state, MR.nextBatch("f", "r", "f"))

    expect(program).toEqual(
      E.right({
        planet,
        rover: new MR.Rover(new MR.Position(I.wrapIso(1), I.wrapIso(2)), "S"),
        history: [
          new MR.Point(new MR.Position(I.wrapIso(0), I.wrapIso(0)), "E"),
          new MR.Point(new MR.Position(I.wrapIso(1), I.wrapIso(0)), "E"),
          new MR.Point(new MR.Position(I.wrapIso(1), I.wrapIso(3)), "S"),
          new MR.Point(new MR.Position(I.wrapIso(1), I.wrapIso(2)), "S")
        ]
      })
    )
  })
})
