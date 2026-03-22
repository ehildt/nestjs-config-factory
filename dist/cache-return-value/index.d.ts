import Joi from 'joi';

interface CacheConfig<T = unknown> {
    schema?: Joi.Schema<T>;
    ttl?: number | false;
}
declare function CacheReturnValue<T = unknown>(config?: Joi.Schema<T> | CacheConfig<T> | false): MethodDecorator & PropertyDecorator;

export { type CacheConfig, CacheReturnValue };
