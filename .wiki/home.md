# Home

A NestJS configuration library providing decorators and modules for caching return values and validating configurations.

## Modules

| Module | Description |
|--------|-------------|
| [Config-Factory](Config-Factory) | NestJS module for registering configuration providers |
| [Cache-Return-Value](Cache-Return-Value) | Decorator that caches method/getter return values with optional Joi validation |
| [Validate-Return-Value](Validate-Return-Value) | Decorator that validates method/getter return values against a Joi schema |

## Installation

```bash
npm install @ehildt/nestjs-config-factory
```

## Peer Dependencies

```bash
npm install @ehildt/ckir-helpers @nestjs/common joi
```
