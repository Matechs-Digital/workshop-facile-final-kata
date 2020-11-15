import * as RTE from "../common/ReaderTaskEither"

export interface AppConfig {
  config: { planet: string; initial: string; obstacles: string }
}

export function provideAppConfig(config: AppConfig["config"]) {
  return <R, E, A>(self: RTE.ReaderTaskEither<R & AppConfig, E, A>) =>
    RTE.provide<AppConfig>({ config })(self)
}
