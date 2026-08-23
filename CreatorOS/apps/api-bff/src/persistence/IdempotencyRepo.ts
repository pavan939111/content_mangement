/**
 * Idempotency key storage with canonical request hash comparison.
 * Unique constraint on (workspace_id, actor_user_id, method, route_template, idempotency_key).
 *
 * Derived from: docs/architecture/ARCHITECTURE-18-database-erd-v2.md section 5.8
 */
