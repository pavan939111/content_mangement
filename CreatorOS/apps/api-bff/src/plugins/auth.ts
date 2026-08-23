/**
 * Supabase JWT validation plugin.
 *
 * Validates Bearer tokens against Supabase JWKS endpoint.
 * Derives Principal from verified token claims.
 * Never trusts user-provided user_id or workspace_id from request body.
 *
 * Derived from: docs/tdd/TDD-03-public-api-bff.md section 8.2
 */
