import { Module } from '@nestjs/common';

var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
var ConfigFactoryModule = class {
  /**
   * Creates a dynamic module with the specified configuration providers.
   * All providers are automatically exported for use by other modules.
   *
   * @param options - Configuration options
   * @param options.global - Whether to register as a global module
   * @param options.providers - Array of configuration provider classes
   *
   * @example
   * ConfigFactoryModule.forRoot({
   *   global: true,
   *   providers: [DatabaseConfigService, AppConfigService],
   * });
   */
  static forRoot({ global = false, providers = [] } = {}) {
    if (!providers.length)
      console.warn("[ConfigFactoryModule] No providers registered.");
    return {
      global,
      module: ConfigFactoryModule,
      providers,
      exports: providers
    };
  }
};
ConfigFactoryModule = __decorateClass([
  Module({})
], ConfigFactoryModule);

export { ConfigFactoryModule };
