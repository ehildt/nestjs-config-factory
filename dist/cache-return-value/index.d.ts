import Joi from 'joi';

declare function CacheReturnValue<T = unknown>(schema?: Joi.Schema<T>): MethodDecorator & PropertyDecorator;

export { CacheReturnValue };
