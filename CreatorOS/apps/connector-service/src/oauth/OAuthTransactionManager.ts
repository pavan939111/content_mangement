/**
 * OAuth transaction lifecycle management.
 *
 * Manages oauth_transactions table with PKCE code_verifier_hash, state machine (pending/completed/failed/expired/consumed).
 * Handles connect/reauthorize/switch_account modes; consumes transactions once on callback.
 *
 * Derived from: docs/tdd/TDD-07 section 7.1 and ARCHITECTURE-18 section 5.12
 */
