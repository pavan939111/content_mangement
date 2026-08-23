/**
 * Structured logging with privacy denylist enforcement.
 *
 * Never log: provider tokens, request bodies, user content, raw provider payloads,
 * full idempotency keys (use hash), SQLCipher keys.
 * Correlation IDs propagated: request_id, trace_id, correlation_id, workspace_id, operation_id.
 *
 * Derived from: docs/tdd/TDD-08-rate-limiting-scheduling-observability.md section 10;
 * docs/tdd/TDD-01 section 10 privacy rules
 */
