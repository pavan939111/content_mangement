/**
 * Layered rate limiter with Redis token buckets plus Postgres next_allowed_at_ms fallback.
 *
 * Scopes: public API (user/workspace), provider adapters (project/workspace/connection/action-class).
 * Honors Retry-After header without consuming normal retry attempts.
 *
 * Derived from: docs/tdd/TDD-08-rate-limiting-scheduling-observability.md sections 3 and 6
 */
