import { Provider, DynamicModule } from '@nestjs/common';

interface ConfigFactoryOptions {
    global?: boolean;
    providers?: Array<Provider>;
}

declare class ConfigFactoryModule {
    static forRoot({ global, providers }?: ConfigFactoryOptions): DynamicModule;
}

export { ConfigFactoryModule, type ConfigFactoryOptions };
