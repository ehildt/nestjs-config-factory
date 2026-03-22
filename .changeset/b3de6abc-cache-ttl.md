---
"@ehildt/nestjs-config-factory": minor
---

Add TTL support and stale-while-revalidate to CacheReturnValue decorator

- Cache entries now expire after 5 minutes by default
- Support `ttl` option to customize expiration time (in milliseconds)
- Support `false` for permanent caching
- Stale-while-revalidate strategy: returns stale value immediately while refreshing in background
- Accept number directly as TTL shorthand (e.g., `@CacheReturnValue(60000)`)
- Accept config object with `schema` and `ttl` properties
- Shared refresh promise prevents duplicate fetches during concurrent reads
