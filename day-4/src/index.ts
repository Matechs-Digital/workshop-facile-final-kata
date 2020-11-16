import { provideLiveAppConfig } from "./app/AppConfig"
import { provideLiveConsole } from "./app/Console"
import { provideLivePlanetContext } from "./app/PlanetContext"
import { main } from "./app/Program"
import { provideLiveReadFile } from "./app/ReadFile"
import { provideLiveReadLine } from "./app/Readline"
import { provideLiveRoverContext } from "./app/RoverContext"
import * as E from "./common/Either"
import { flow, pipe } from "./common/Function"
import { matchTag } from "./common/Match"
import * as RTE from "./common/ReaderTaskEither"

pipe(
  main,
  provideLiveRoverContext,
  provideLivePlanetContext,
  provideLiveAppConfig,
  provideLiveReadFile,
  provideLiveReadLine,
  provideLiveConsole,
  RTE.run
)().then(
  E.fold(
    flow(
      matchTag({
        InvalidPlanetFile: ({ actual }) => `Invalid planet file:\n${actual}`,
        InvalidInitialPosition: ({ hit }) =>
          `Invalid initial position hitting obstacle at: ${hit.position.x}, ${hit.position.y}`,
        ParseCommandError: ({ actual }) => `Invalid command string: ${actual}`,
        ParseObstaclesError: ({ actual }) => `Invalid obstacle config: ${actual}`,
        ParsePlanetError: ({ actual }) => `Invalid planet config: ${actual}`,
        ReadFileError: ({ error }) => `Unknown error reading file: ${error.message}`
      }),
      (error) => {
        console.error(error)
        process.exit(1)
      }
    ),
    () => {
      process.exit(0)
    }
  )
)
