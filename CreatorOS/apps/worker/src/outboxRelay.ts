/**
 * Outbox relay: claims unpublished events from transactional_outbox using FOR UPDATE SKIP LOCKED,
 * publishes to BullMQ queues, then marks published_at.
 * Crash-safe: if relay crashes after publish but before marking, event republished and downstream deduplicates.
 *
 * Derived from: docs/architecture/ARCHITECTURE-18-database-erd-v2.md section 5.7;
 * docs/testing/integration-test-cases.md INT-OBX-05
 */
