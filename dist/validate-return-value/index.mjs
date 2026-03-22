// src/validate-return-value/validate-return-value.decorator.ts
function ValidateReturnValue(schema) {
  return function(target, propertyKey, descriptor) {
    if (descriptor?.get) {
      const originalGet = descriptor.get;
      descriptor.get = function() {
        const value = originalGet.call(this);
        const { error, value: validated } = schema.validate(value, {
          abortEarly: false
        });
        if (!error) return validated;
        throw new ValidateReturnValueError(`Schema violation`, error.details);
      };
      return;
    }
    if (descriptor?.value instanceof Function) {
      const originalMethod = descriptor.value;
      descriptor.value = function(...args) {
        const result = originalMethod.apply(this, args);
        const { error, value: validated } = schema.validate(result, {
          abortEarly: false
        });
        if (!error) return validated;
        throw new ValidateReturnValueError(`Schema violation`, error.details);
      };
      return;
    }
    const privateKey = Symbol(propertyKey);
    Object.defineProperty(target, propertyKey, {
      configurable: true,
      enumerable: true,
      get: function() {
        const value = this[privateKey];
        const { error, value: validated } = schema.validate(value, {
          abortEarly: false
        });
        if (!error) return validated;
        throw new ValidateReturnValueError(`Schema violation`, error.details);
      }
    });
  };
}
var ValidateReturnValueError = class extends Error {
  constructor(message, cause) {
    super(message, { cause });
    this.name = new.target.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
};

export { ValidateReturnValue, ValidateReturnValueError };
