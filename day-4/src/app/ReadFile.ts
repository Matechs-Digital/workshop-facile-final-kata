import * as FS from "fs"

import * as E from "../common/Either"
import * as RTE from "../common/ReaderTaskEither"

export class ReadFileError {
  readonly _tag = "ReadFileError"
  constructor(readonly error: NodeJS.ErrnoException) {}
}

export interface ReadFile {
  readFile: {
    read: (file: string) => RTE.ReaderTaskEither<unknown, ReadFileError, string>
  }
}

export const LiveReadFile: ReadFile = {
  readFile: {
    read: (file) =>
      RTE.fromTaskEither(
        () =>
          new Promise((res) => {
            FS.readFile(file, (err, data) => {
              if (err) {
                res(E.left(new ReadFileError(err)))
              } else {
                res(E.right(data.toString("utf8")))
              }
            })
          })
      )
  }
}

export const provideLiveReadFile = RTE.provide(LiveReadFile)

export function readFile(file: string) {
  return RTE.accessM(({ readFile: { read } }: ReadFile) => read(file))
}
