/**
 * RFC 9457 problem+json error handler.
 *
 * Maps internal errors to stable public codes per the catalog in errors.md.
 * Extensions: code, requestId, retryable, retryAfterSeconds, action, connection_id, details.
 *
 * Derived from: docs/tdd/TDD-03-public-api-bff.md section 9.1; docs/api/cross-cutting/errors.md
 */
