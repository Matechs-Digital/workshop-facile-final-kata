import { provideLiveAppConfig } from "./app/AppConfig"
import { provideLiveConsole } from "./app/Console"
import { main, provideLivePlanet } from "./app/Program"
import { provideLiveReadFile } from "./app/ReadFile"
import { provideLiveReadLine } from "./app/Readline"
import * as E from "./common/Either"
import { pipe } from "./common/Function"
import * as RTE from "./common/ReaderTaskEither"

pipe(
  main,
  provideLivePlanet,
  provideLiveAppConfig,
  provideLiveReadFile,
  provideLiveReadLine,
  provideLiveConsole,
  RTE.run
)().then(
  E.fold(
    (e) => {
      console.error(JSON.stringify(e, null, 2))
      process.exit(1)
    },
    () => {
      process.exit(0)
    }
  )
)
