import { createInterface } from "readline"

import * as RTE from "../common/ReaderTaskEither"

export interface Readline {
  readline: {
    getStrLn: RTE.ReaderTaskEither<unknown, never, string>
  }
}

export const LiveReadline: Readline = {
  readline: {
    getStrLn: RTE.rightTask(
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

export const provideLiveReadLine = RTE.provide(LiveReadline)

export const getStrLn = RTE.accessM((r: Readline) => r.readline.getStrLn)
