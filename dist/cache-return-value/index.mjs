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
var DEFAULT_TTL_MS = 5 * 60 * 1e3;
function isJoiSchema(value) {
  return typeof value === "object" && value !== null && "type" in value && typeof value.validate === "function";
}
function parseConfig(config) {
  if (config === false) return { ttl: false };
  if (config === void 0) return { ttl: DEFAULT_TTL_MS };
  if (typeof config === "number") return { ttl: config };
  if (isJoiSchema(config)) return { schema: config, ttl: DEFAULT_TTL_MS };
  return {
    schema: config.schema,
    ttl: config.ttl ?? DEFAULT_TTL_MS
  };
}
function validateValue(value, schema) {
  if (schema) {
    const { error, value: validated } = schema.validate(value, {
      abortEarly: false
    });
    if (error) throw new ValidateReturnValueError(`Schema violation`, error.details);
    return validated;
  }
  return value;
}
function isExpired(entry, ttl) {
  if (ttl === false) return false;
  return Date.now() - entry.timestamp > ttl;
}
function CacheReturnValue(config) {
  return function(_target, propertyKey, descriptor) {
    const { schema, ttl } = parseConfig(config);
    const setCache = (instance, key, value, refreshPromise) => {
      let instanceCache = INSTANCE_CACHE.get(instance);
      if (!instanceCache) {
        instanceCache = /* @__PURE__ */ new Map();
        INSTANCE_CACHE.set(instance, instanceCache);
      }
      instanceCache.set(key, { value, timestamp: Date.now(), refreshPromise });
    };
    if (descriptor?.get) {
      const originalGet = descriptor.get;
      descriptor.get = function() {
        const cache = getCacheFor(this);
        const key = String(propertyKey);
        const entry = cache.get(key);
        if (!entry) {
          const value = validateValue(originalGet.call(this), schema);
          setCache(this, key, value);
          return value;
        }
        if (!isExpired(entry, ttl)) return entry.value;
        const staleValue = entry.value;
        if (entry.refreshPromise) return staleValue;
        const refreshPromise = (async () => {
          return validateValue(await originalGet.call(this), schema);
        })();
        setCache(this, key, staleValue, refreshPromise);
        refreshPromise.then((freshValue) => {
          setCache(this, key, freshValue);
        }).catch(() => {
          setCache(this, key, staleValue);
        });
        return staleValue;
      };
    }
    if (descriptor?.value instanceof Function) {
      const originalMethod = descriptor.value;
      descriptor.value = function(...args) {
        const cache = getCacheFor(this);
        const key = hashPayload(`${String(propertyKey)}:${JSON.stringify(args)}`);
        const entry = cache.get(key);
        if (!entry) {
          const result = validateValue(originalMethod.apply(this, args), schema);
          setCache(this, key, result);
          return result;
        }
        if (!isExpired(entry, ttl)) return entry.value;
        const staleValue = entry.value;
        if (entry.refreshPromise) return staleValue;
        const refreshPromise = (async () => {
          return validateValue(await originalMethod.apply(this, args), schema);
        })();
        setCache(this, key, staleValue, refreshPromise);
        refreshPromise.then((freshValue) => {
          setCache(this, key, freshValue);
        }).catch(() => {
          setCache(this, key, staleValue);
        });
        return staleValue;
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
