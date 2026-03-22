# Config-Factory

A NestJS module that registers configuration providers, typically used with the `@CacheReturnValue` decorator.

## Import

```typescript
import { ConfigFactoryModule } from '@ehildt/nestjs-config-factory/config-factory';
```

## Interface

```typescript
interface ConfigFactoryOptions {
  global?: boolean;
  providers?: Array<Provider>;
}
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `global` | `boolean` | `false` | If `true`, makes all providers available throughout the application without explicit import |
| `providers` | `Array<Provider>` | `[]` | Array of NestJS providers (typically services with `@Injectable()`) to register |

## Usage

### Basic Setup

```typescript
import { Module } from '@nestjs/common';
import { ConfigFactoryModule } from '@ehildt/nestjs-config-factory/config-factory';
import { AppConfigService } from './app-config.service';

@Module({
  imports: [
    ConfigFactoryModule.forRoot({
      providers: [AppConfigService],
    }),
  ],
})
export class AppModule {}
```

### Global Configuration

For application-wide config services, use `global: true`:

```typescript
import { Module } from '@nestjs/common';
import { ConfigFactoryModule } from '@ehildt/nestjs-config-factory/config-factory';
import { AppConfigService } from './app-config.service';
import { DatabaseConfigService } from './database-config.service';
import { CacheConfigService } from './cache-config.service';

@Module({
  imports: [
    ConfigFactoryModule.forRoot({
      global: true,
      providers: [
        AppConfigService,
        DatabaseConfigService,
        CacheConfigService,
      ],
    }),
  ],
})
export class AppModule {}
```

With `global: true`, any service can inject these config services without importing the module:

```typescript
@Injectable()
export class UserService {
  constructor(
    private readonly appConfig: AppConfigService,
    private readonly dbConfig: DatabaseConfigService,
  ) {}
}
```

### Warning

If no providers are provided, a console warning is issued:

```typescript
ConfigFactoryModule.forRoot({}) 
// Warns: "[ConfigFactoryModule] No providers registered."
```

## See Also

- [Cache-Return-Value](Cache-Return-Value) - Decorator for caching config values
