import * as MR from "../src"
import * as I from "../src/common/Int"
import * as E from "../src/utils/either"
import { pipe } from "../src/utils/pipe"

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
        planet: { _tag: "Planet", width: 5, height: 4 },
        rover: {
          _tag: "Rover",
          position: { _tag: "Position", x: 0, y: 0 },
          orientation: "N"
        },
        history: [
          {
            _tag: "Point",
            position: { _tag: "Position", x: 0, y: 0 },
            orientation: "N"
          }
        ]
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
        planet: { _tag: "Planet", width: 5, height: 4 },
        rover: {
          _tag: "Rover",
          position: { _tag: "Position", x: 0, y: 0 },
          orientation: "N"
        },
        history: [
          {
            _tag: "Point",
            position: { _tag: "Position", x: 0, y: 3 },
            orientation: "N"
          },
          {
            _tag: "Point",
            position: { _tag: "Position", x: 0, y: 0 },
            orientation: "N"
          }
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
        planet: { _tag: "Planet", width: 5, height: 4 },
        rover: {
          _tag: "Rover",
          position: { _tag: "Position", x: 0, y: 3 },
          orientation: "S"
        },
        history: [
          {
            _tag: "Point",
            position: { _tag: "Position", x: 0, y: 0 },
            orientation: "S"
          },
          {
            _tag: "Point",
            position: { _tag: "Position", x: 0, y: 3 },
            orientation: "S"
          }
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
        planet: { _tag: "Planet", width: 5, height: 4 },
        rover: {
          _tag: "Rover",
          position: { _tag: "Position", x: 0, y: 0 },
          orientation: "E"
        },
        history: [
          {
            _tag: "Point",
            position: { _tag: "Position", x: 4, y: 0 },
            orientation: "E"
          },
          {
            _tag: "Point",
            position: { _tag: "Position", x: 0, y: 0 },
            orientation: "E"
          }
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
        planet: { _tag: "Planet", width: 5, height: 4 },
        rover: {
          _tag: "Rover",
          position: { _tag: "Position", x: 4, y: 0 },
          orientation: "W"
        },
        history: [
          {
            _tag: "Point",
            position: { _tag: "Position", x: 0, y: 0 },
            orientation: "W"
          },
          {
            _tag: "Point",
            position: { _tag: "Position", x: 4, y: 0 },
            orientation: "W"
          }
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
        planet: { _tag: "Planet", width: 5, height: 4 },
        rover: {
          _tag: "Rover",
          position: { _tag: "Position", x: 0, y: 3 },
          orientation: "S"
        },
        history: [
          {
            _tag: "Point",
            position: { _tag: "Position", x: 0, y: 0 },
            orientation: "N"
          },
          {
            _tag: "Point",
            position: { _tag: "Position", x: 0, y: 3 },
            orientation: "S"
          }
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
        planet: { _tag: "Planet", width: 5, height: 4 },
        rover: {
          _tag: "Rover",
          position: { _tag: "Position", x: 0, y: 0 },
          orientation: "N"
        },
        history: [
          {
            _tag: "Point",
            position: { _tag: "Position", x: 0, y: 3 },
            orientation: "S"
          },
          {
            _tag: "Point",
            position: { _tag: "Position", x: 0, y: 0 },
            orientation: "N"
          }
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
        planet: { _tag: "Planet", width: 5, height: 4 },
        rover: {
          _tag: "Rover",
          position: { _tag: "Position", x: 4, y: 0 },
          orientation: "W"
        },
        history: [
          {
            _tag: "Point",
            position: { _tag: "Position", x: 0, y: 0 },
            orientation: "E"
          },
          {
            _tag: "Point",
            position: { _tag: "Position", x: 4, y: 0 },
            orientation: "W"
          }
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
        planet: { _tag: "Planet", width: 5, height: 4 },
        rover: {
          _tag: "Rover",
          position: { _tag: "Position", x: 0, y: 0 },
          orientation: "E"
        },
        history: [
          {
            _tag: "Point",
            position: { _tag: "Position", x: 4, y: 0 },
            orientation: "W"
          },
          {
            _tag: "Point",
            position: { _tag: "Position", x: 0, y: 0 },
            orientation: "E"
          }
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
        planet: { _tag: "Planet", width: 5, height: 4 },
        rover: {
          _tag: "Rover",
          position: { _tag: "Position", x: 4, y: 0 },
          orientation: "W"
        },
        history: [
          {
            _tag: "Point",
            position: { _tag: "Position", x: 0, y: 0 },
            orientation: "N"
          },
          {
            _tag: "Point",
            position: { _tag: "Position", x: 4, y: 0 },
            orientation: "W"
          }
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
        planet: { _tag: "Planet", width: 5, height: 4 },
        rover: {
          _tag: "Rover",
          position: { _tag: "Position", x: 0, y: 0 },
          orientation: "E"
        },
        history: [
          {
            _tag: "Point",
            position: { _tag: "Position", x: 4, y: 0 },
            orientation: "S"
          },
          {
            _tag: "Point",
            position: { _tag: "Position", x: 0, y: 0 },
            orientation: "E"
          }
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
        planet: { _tag: "Planet", width: 5, height: 4 },
        rover: {
          _tag: "Rover",
          position: { _tag: "Position", x: 0, y: 0 },
          orientation: "N"
        },
        history: [
          {
            _tag: "Point",
            position: { _tag: "Position", x: 0, y: 3 },
            orientation: "E"
          },
          {
            _tag: "Point",
            position: { _tag: "Position", x: 0, y: 0 },
            orientation: "N"
          }
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
        planet: { _tag: "Planet", width: 5, height: 4 },
        rover: {
          _tag: "Rover",
          position: { _tag: "Position", x: 0, y: 3 },
          orientation: "S"
        },
        history: [
          {
            _tag: "Point",
            position: { _tag: "Position", x: 0, y: 0 },
            orientation: "W"
          },
          {
            _tag: "Point",
            position: { _tag: "Position", x: 0, y: 3 },
            orientation: "S"
          }
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
        planet: { _tag: "Planet", width: 5, height: 4 },
        rover: {
          _tag: "Rover",
          position: { _tag: "Position", x: 0, y: 0 },
          orientation: "E"
        },
        history: [
          {
            _tag: "Point",
            position: { _tag: "Position", x: 4, y: 0 },
            orientation: "N"
          },
          {
            _tag: "Point",
            position: { _tag: "Position", x: 0, y: 0 },
            orientation: "E"
          }
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
        planet: { _tag: "Planet", width: 5, height: 4 },
        rover: {
          _tag: "Rover",
          position: { _tag: "Position", x: 4, y: 0 },
          orientation: "W"
        },
        history: [
          {
            _tag: "Point",
            position: { _tag: "Position", x: 0, y: 0 },
            orientation: "S"
          },
          {
            _tag: "Point",
            position: { _tag: "Position", x: 4, y: 0 },
            orientation: "W"
          }
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
        planet: { _tag: "Planet", width: 5, height: 4 },
        rover: {
          _tag: "Rover",
          position: { _tag: "Position", x: 0, y: 3 },
          orientation: "S"
        },
        history: [
          {
            _tag: "Point",
            position: { _tag: "Position", x: 0, y: 0 },
            orientation: "E"
          },
          {
            _tag: "Point",
            position: { _tag: "Position", x: 0, y: 3 },
            orientation: "S"
          }
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
        planet: { _tag: "Planet", width: 5, height: 4 },
        rover: {
          _tag: "Rover",
          position: { _tag: "Position", x: 0, y: 0 },
          orientation: "N"
        },
        history: [
          {
            _tag: "Point",
            position: { _tag: "Position", x: 0, y: 3 },
            orientation: "W"
          },
          {
            _tag: "Point",
            position: { _tag: "Position", x: 0, y: 0 },
            orientation: "N"
          }
        ]
      })
    )
  })
})
