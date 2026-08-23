/**
 * Connection incremental sync processor.
 *
 * Claims operations atomically from connector_job_state table, invokes provider adapter sync capability,
 * advances cursor only after full page commit, writes receipt on completion.
 * Default retry: 10 attempts exponential backoff from 30 seconds.
 *
 * Derived from: docs/tdd/TDD-04 section 8.3 retry policy and TDD-05 adapter contract
 */
