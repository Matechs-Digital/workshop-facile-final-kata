import { createInterface } from "readline"

import type { ReaderTaskEither } from "../common/ReaderTaskEither"
import { accessM, rightTask } from "../common/ReaderTaskEither"

export interface Readline {
  readline: {
    getStrLn: ReaderTaskEither<unknown, never, string>
  }
}

export const LiveReadline: Readline = {
  readline: {
    getStrLn: rightTask(
      () =>
        new Promise((resolve) => {
          const rl = createInterface({
            input: process.stdin,
            output: process.stdout
          })
          rl.question("> ", (answer) => {
            rl.close()
            resolve(answer)
          })
        })
    )
  }
}

export const getStrLn = accessM((r: Readline) => r.readline.getStrLn)
