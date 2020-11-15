import { createInterface } from "readline"

import type { Task } from "../common/Task"

export const getStrLn: Task<string> = () =>
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
