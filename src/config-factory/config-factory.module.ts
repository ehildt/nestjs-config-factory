import { DynamicModule, Module } from "@nestjs/common";

import { ConfigFactoryOptions } from "./config-factory.model.ts";

@Module({})
export class ConfigFactoryModule {
  static forRoot({ global = false, providers = [] }: ConfigFactoryOptions = {}): DynamicModule {
    if (!providers.length)
      // eslint-disable-next-line no-console
      console.warn("[ConfigFactoryModule] No providers registered.");

    return {
      global,
      module: ConfigFactoryModule,
      providers,
      exports: providers,
    };
  }
}
