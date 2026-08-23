# Traceability — Module to Documentation Map

This file maps every scaffolded module to the documentation that defines it.

## Apps

| Module | Doc Source | Key Sections |
|---|---|---|
| `apps/ios/` | ARCHITECTURE-11 §2; TDD-01; TDD-02 | SwiftUI, GRDB+SQLCipher+FTS5, BGTaskScheduler |
| `apps/android/` | ARCHITECTURE-11 §2; TDD-01; TDD-02 | Compose, Room+SQLCipher, WorkManager |
| `apps/api-bff/src/plugins/auth.ts` | TDD-03 §8.2 | Supabase JWKS validation |
| `apps/api-bff/src/plugins/error-handler.ts` | TDD-03 §9.1; cross-cutting/errors.md | RFC 9457 problem+json |
| `apps/api-bff/src/modules/content/routes.ts` | FRS-01 v2; OpenAPI /connected-content/* | CRUD, links, delivery, receipts |
| `apps/api-bff/src/modules/connections/routes.ts` | OpenAPI /connections/*; TDD-07 §7.1 | OAuth lifecycle, sync, health |
| `apps/api-bff/src/modules/search/routes.ts` | FRS-03 v2; OpenAPI /search | Coverage, staleness, NFR-01 PER targets |
| `apps/api-bff/src/modules/operations/routes.ts` | docs/api/endpoints/operations.md | Polling, cancellation |
| `apps/api-bff/src/persistence/ContentRepository.ts` | ARCHITECTURE-18 §4.1–4.2 | connected_record, external_source_link |
| `apps/api-bff/src/persistence/OutboxRepository.ts` | ARCHITECTURE-18 §5.7 | Transactional outbox with SKIP LOCKED |
| `apps/api-bff/src/persistence/IdempotencyRepo.ts` | ARCHITECTURE-18 §5.8 | api_idempotency_keys unique constraint |
| `apps/connector-service/src/credentials/TokenVault.ts` | TDD-07 §2, 8.2; ARCHITECTURE-18 §5.3 | KMS envelope encryption, rotation |
| `apps/connector-service/src/oauth/OAuthTransactionManager.ts` | TDD-07 §7.1; ARCHITECTURE-18 §5.12 | oauth_transactions state machine |
| `apps/connector-service/src/providers/google-drive.ts` | providers/google-drive.md | files.list, changes delta sync |
| `apps/connector-service/src/providers/google-calendar.ts` | providers/google-calendar.md | syncToken, extended properties |
| `apps/connector-service/src/providers/google-docs.ts` | providers/google-docs.md | Drive-backed metadata discovery |
| `apps/connector-service/src/providers/notion.md` | providers/notion.md | Search, block traversal, token rotation |
| `apps/worker/src/outboxRelay.ts` | ARCHITECTURE-18 §5.7 | SKIP LOCKED claim, crash-safe publish |
| `apps/worker/src/rateLimiter.ts` | TDD-08 §3, 6 | Redis buckets + Postgres fallback |
| `apps/worker/src/processors/syncProcessor.ts` | TDD-04 §8.3 | Incremental sync retry policy |
| `apps/worker/src/processors/handoffProcessor.ts` | TDD-04 §8.3 | Interactive handoff retry policy |

## Packages

| Module | Doc Source |
|---|---|
| `packages/contracts/src/index.ts` | TDD-03 §7.1 contract workflow; OpenAPI spec |
| `packages/domain/build.gradle.kts` | DEC-001 (gated on spike); TDD-02 §4 state machine |
| `packages/database/migrations/` | ARCHITECTURE-18 §5 all table DDLs |
| `packages/observability/src/logger.ts` | TDD-08 §10 privacy denylist; NFR-05-v2 SPC-07 |

## Supabase

| Module | Doc Source |
|---|---|
| `supabase/migrations/` | ARCHITECTURE-18 §5.1–5.15 |
| `supabase/tests/rls_test.sql` | integration-test-cases.md §5 INT-RLS-01–08 |

## CI

| Module | Doc Source |
|---|---|
| `.github/workflows/ci.yml` | release-gates.md §3 PR stage |
