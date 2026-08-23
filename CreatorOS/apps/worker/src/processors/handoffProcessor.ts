/**
 * Content handoff processor for interactive user actions routed to providers.
 *
 * Default retry: 12 attempts exponential backoff from 10 seconds.
 * Reconciles before repeating non-idempotent writes after timeout.
 *
 * Derived from: docs/tdd/TDD-04 sections 8.2 and 8.3
 */
