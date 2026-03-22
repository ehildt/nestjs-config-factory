import { hashPayload } from "@ehildt/ckir-helpers/hash-payload";
import Joi from "joi";

import { ValidateReturnValueError } from "../validate-return-value/validate-return-value.decorator.ts";

/**
 * Decorator that caches the return value of a method or a getter property. \
 * Optionally validates the cached value against a Joi schema.
 *
 * @template T - The expected type of the return value.
 * @param {Joi.Schema<T>} [schema] - Optional Joi schema to validate the return value.
 * @returns {MethodDecorator & PropertyDecorator} A decorator that caches the return value and validates it if a schema is provided.
 */
export function CacheReturnValue<T = unknown>(schema?: Joi.Schema<T>): MethodDecorator & PropertyDecorator {
  return function (_target: any, propertyKey: string | symbol, descriptor?: PropertyDescriptor): void {
    // Getter caching
    if (descriptor?.get) {
      const originalGet = descriptor.get;
      descriptor.get = function (): unknown {
        const cache = getCacheFor(this);
        if (!cache.has(String(propertyKey))) {
          let value = originalGet.call(this);

          if (schema) {
            const { error, value: validated } = schema.validate(value, {
              abortEarly: false,
            });
            if (error) throw new ValidateReturnValueError(`Schema violation`, error.details);
            value = validated;
          }

          cache.set(String(propertyKey), value);
        }
        return cache.get(String(propertyKey));
      };
    }

    // Method caching
    if (descriptor?.value instanceof Function) {
      const originalMethod = descriptor.value;
      descriptor.value = function (...args: unknown[]): unknown {
        const cache = getCacheFor(this);
        const key = hashPayload(`${String(propertyKey)}:${JSON.stringify(args)}`);
        if (!cache.has(key)) {
          let result = originalMethod.apply(this, args);

          if (schema) {
            const { error, value: validated } = schema.validate(result, {
              abortEarly: false,
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

// Instance cache
const INSTANCE_CACHE: WeakMap<object, Map<string, unknown>> = new WeakMap();
function getCacheFor(instance: object): Map<string, unknown> {
  let cache = INSTANCE_CACHE.get(instance);
  if (!cache) {
    cache = new Map<string, unknown>();
    INSTANCE_CACHE.set(instance, cache);
  }
  return cache;
}
