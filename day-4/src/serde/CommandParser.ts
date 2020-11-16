import type { Command } from "../app/Command"
import { Commands } from "../app/Command"
import * as E from "../common/Either"
import { flow, pipe } from "../common/Function"

export class ParseCommandError {
  readonly _tag = "ParseCommandError"
  constructor(readonly actual: string) {}
}

export const commandRegex = /^(F|B|L|R)$/

export function parseCommand(
  commandString: string
): E.Either<ParseCommandError, Command> {
  const results = commandRegex.exec(commandString)

  if (results == null) {
    return E.left(new ParseCommandError(commandString))
  }

  const command = results[1]

  switch (command) {
    case "F": {
      return E.right(Commands.Forward)
    }
    case "B": {
      return E.right(Commands.Backward)
    }
    case "L": {
      return E.right(Commands.Left)
    }
    case "R": {
      return E.right(Commands.Right)
    }
    default: {
      throw new Error("absurd")
    }
  }
}

export function parseCommands(obstaclesConfig: string) {
  if (obstaclesConfig.length === 0) {
    return E.right([])
  }
  return pipe(
    obstaclesConfig.split(","),
    E.foreach(flow((s) => s.trim(), parseCommand))
  )
}
