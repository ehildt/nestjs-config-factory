import { hashPayload } from '@ehildt/ckir-helpers/hash-payload';

// src/cache-return-value/cache-return-value.decorator.ts

// src/validate-return-value/validate-return-value.decorator.ts
var ValidateReturnValueError = class extends Error {
  constructor(message, cause) {
    super(message, { cause });
    this.name = new.target.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
};

// src/cache-return-value/cache-return-value.decorator.ts
function CacheReturnValue(schema) {
  return function(_target, propertyKey, descriptor) {
    if (descriptor?.get) {
      const originalGet = descriptor.get;
      descriptor.get = function() {
        const cache = getCacheFor(this);
        if (!cache.has(String(propertyKey))) {
          let value = originalGet.call(this);
          if (schema) {
            const { error, value: validated } = schema.validate(value, {
              abortEarly: false
            });
            if (error) throw new ValidateReturnValueError(`Schema violation`, error.details);
            value = validated;
          }
          cache.set(String(propertyKey), value);
        }
        return cache.get(String(propertyKey));
      };
    }
    if (descriptor?.value instanceof Function) {
      const originalMethod = descriptor.value;
      descriptor.value = function(...args) {
        const cache = getCacheFor(this);
        const key = hashPayload(`${String(propertyKey)}:${JSON.stringify(args)}`);
        if (!cache.has(key)) {
          let result = originalMethod.apply(this, args);
          if (schema) {
            const { error, value: validated } = schema.validate(result, {
              abortEarly: false
            });
            if (error) throw new ValidateReturnValueError(`Schema violation`, error.details);
            result = validated;
          }
          cache.set(key, result);
        }
        return cache.get(key);
      };
    }
  };
}
var INSTANCE_CACHE = /* @__PURE__ */ new WeakMap();
function getCacheFor(instance) {
  let cache = INSTANCE_CACHE.get(instance);
  if (!cache) {
    cache = /* @__PURE__ */ new Map();
    INSTANCE_CACHE.set(instance, cache);
  }
  return cache;
}

export { CacheReturnValue };
