import * as RE from "../common/ReaderEither"

export interface AppConfig {
  config: { planet: string; initial: string; obstacles: string }
}

export function provideAppConfig(config: AppConfig["config"]) {
  return <R, E, A>(self: RE.ReaderEither<R & AppConfig, E, A>) =>
    RE.provide<AppConfig>({ config })(self)
}
