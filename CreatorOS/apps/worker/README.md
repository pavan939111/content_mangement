# Worker (BullMQ Job Processor)

## Purpose

Consumes jobs from BullMQ queues, claims operations atomically from Postgres, executes provider-bound work via the connector service, writes receipts, handles retries/backoff/DLQ.

## Technologies

- Node.js/TypeScript
- BullMQ with Redis
- Postgres as source of truth (BullMQ is delivery machinery only)

## Key Documents

- `docs/tdd/TDD-04-connector-worker-durable-operations.md` — job types, retry policy, failure matrix, claim pattern
- `docs/tdd/TDD-08-rate-limiting-scheduling-observability.md` — rate limiting layers, queue isolation, metrics
- `docs/architecture/ARCHITECTURE-18-database-erd-v2.md` §5.14–5.15 for connector_job_state and repair_cases schemas

## Build & Run

<!-- Placeholder: REDIS_URL, DATABASE_URL, worker concurrency configuration per queue -->
