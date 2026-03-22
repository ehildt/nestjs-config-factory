# Cache-Return-Value

Decorates methods and getter properties to cache their return values. Optionally validates cached values against a Joi schema.

## Import

```typescript
import { CacheReturnValue } from '@ehildt/nestjs-config-factory/cache-return-value';
```

## Usage

### Caching Getter Properties

```typescript
import { Injectable } from '@nestjs/common';
import { CacheReturnValue } from '@ehildt/nestjs-config-factory/cache-return-value';

@Injectable()
export class AppConfigService {
  @CacheReturnValue()
  get config() {
    console.log('Computing config...');
    return { port: 3000, env: 'development' };
  }
}

const service = new AppConfigService();
service.config; // Logs "Computing config..."
service.config; // Returns cached value (no log)
```

### Caching Methods

```typescript
@CacheReturnValue()
getUserById(id: number) {
  console.log(`Fetching user ${id}...`);
  return { id, name: 'John' };
}

getUserById(1); // Logs "Fetching user 1..."
getUserById(1); // Returns cached value
getUserById(2); // Logs "Fetching user 2..." (different args)
```

### With Joi Validation

```typescript
import Joi from 'joi';

const UserSchema = Joi.object({
  id: Joi.number().required(),
  name: Joi.string().required(),
});

@CacheReturnValue(UserSchema)
getUserById(id: number) {
  return { id, name: 'John' };
}

getUserById(1); // Validates against UserSchema
getUserById(1); // Returns cached, validated value
```

## Features

### Instance Isolation

Each class instance has its own cache. Different instances do not share cached values.

### Method Argument Hashing

Method caches are keyed by a hash of the method name and serialized arguments, enabling separate caches for different argument combinations.

### Automatic Validation

When a Joi schema is provided, return values are validated before caching. Invalid values throw `ValidateReturnValueError`.

## Complete Example

```typescript
import { Injectable } from '@nestjs/common';
import { CacheReturnValue } from '@ehildt/nestjs-config-factory/cache-return-value';
import Joi from 'joi';
import { hashPayload } from '@ehildt/ckir-helpers/hash-payload';

const DatabaseConfigSchema = Joi.object({
  host: Joi.string().required(),
  port: Joi.number().port().required(),
  database: Joi.string().required(),
});

@Injectable()
export class DatabaseConfigService {
  @CacheReturnValue(DatabaseConfigSchema)
  get config() {
    return {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'myapp',
    };
  }

  @CacheReturnValue(Joi.object({ id: Joi.number().required() }))
  async fetchUser(id: number) {
    // Simulated database call
    return { id, name: 'User ' + id };
  }
}
```

## See Also

- [Validate-Return-Value](Validate-Return-Value) - Standalone validation decorator
- [Config-Factory](Config-Factory) - Module for registering config services
