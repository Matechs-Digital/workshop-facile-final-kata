import * as RTE from "../common/ReaderTaskEither"

export interface Console {
  console: {
    log: (message: string) => RTE.ReaderTaskEither<unknown, never, void>
    error: (message: string) => RTE.ReaderTaskEither<unknown, never, void>
  }
}

export function log(message: string) {
  return RTE.accessM(({ console: { log } }: Console) => log(message))
}

export function error(message: string) {
  return RTE.accessM(({ console: { error } }: Console) => error(message))
}

export const LiveConsole: Console = {
  console: {
    log: (message) =>
      RTE.sync(() => {
        console.log(message)
      }),
    error: (message) =>
      RTE.sync(() => {
        console.error(message)
      })
  }
}
