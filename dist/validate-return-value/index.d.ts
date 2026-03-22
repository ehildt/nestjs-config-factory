import Joi from 'joi';

declare function ValidateReturnValue<T>(schema: Joi.Schema<T>): (target: any, propertyKey: string, descriptor?: PropertyDescriptor) => void;
declare class ValidateReturnValueError extends Error {
    constructor(message?: string, cause?: unknown);
}

export { ValidateReturnValue, ValidateReturnValueError };
