# Integration Test Cases — CreatorOS v2

**Version:** 1.0
**Date:** 2026-08-23
**Status:** Ready for Implementation
**Related:** v2/testing/test-strategy.md, TDD-01, TDD-03, TDD-04
**CI Frequency:** Every pull request (repository + DB); nightly for full migration chain

---

## 1. Purpose

Integration tests against real infrastructure (Postgres, Redis, encrypted SQLite) verifying transaction boundaries, RLS isolation, durable operations, and cross-component behavior.

## 2. Infrastructure Requirements

| Component | Approach |
|---|---|
| Postgres | Testcontainers (`postgres:16`), one per worker; migrations applied once per worker |
| Redis | Testcontainers (`redis:7`), fresh per test file for queue tests |
| SQLite/SQLCipher | Temporary encrypted database per test; never shared simulator DB |
| Isolation | Schema per test (SQL-heavy) or transaction rollback (read/write); unique queue names per test run |

## 3. Database & SQLCipher Integration Tests

### 3.1 Encryption and Key Management

| ID | Invariant | Method |
|---|---|---|
| INT-DB-01 | Database cannot be opened with no key or incorrect key | Attempt open with wrong key → error returned safely |
| INT-DB-02 | Correct key reopens data after simulated process restart | Close → reopen with correct key → all data intact |
| INT-DB-03 | Transaction atomicity: document update and outbox insert commit or roll back together | Force failure after document write but before outbox insert → neither persists |
| INT-DB-04 | Foreign keys enforce cascade delete on workspace removal | Delete workspace → connected records, links, receipts cascade |
| INT-DB-05 | Unique constraints prevent duplicate external source links | Insert duplicate `(record_id, provider, external_object_id)` → constraint violation caught as app error |
| INT-DB-06 | Database-full path stops writes without corrupting existing data | Simulate disk full → safe error, no partial write |

### 3.2 Migration Tests

| ID | Scenario | Assertions |
|---|---|---|
| INT-MG-01 | Add nullable column with default | Existing rows get default; no data loss |
| INT-MG-02 | Rename/rebuild table without losing queued outbox operations | All pending `local_operations` survive migration |
| INT-MG-03 | Backfill FTS after content schema change | Search results match pre-migration corpus |
| INT-MG-04 | Upgrade with partially completed prior sync | Sync state preserved or safely reset to `requires_full_resync` |
| INT-MG-05 | Older schema + newer server payload | Payload stored in JSONB column without schema break |
| INT-MG-06 | Migration fails midway | Database recoverable from backup/WAL; no silent deletion |
| INT-MG-07 | Run migration twice (idempotent startup) | Second run is a no-op; no duplicate indexes/columns |

### 3.3 FTS5 Integration Tests

| ID | Invariant | Assertions |
|---|---|---|
| INT-FTS-01 | Insert/update/delete propagates between content tables and FTS virtual tables via triggers | FTS row count matches content row count after each operation |
| INT-FTS-02 | Soft-deleted records do not appear in search results | `is_deleted=1` record excluded from MATCH results |
| INT-FTS-03 | Unicode normalization: emoji, CJK, RTL, diacritics searchable | Query "café" finds "Café"; CJK characters tokenized correctly |
| INT-FTS-04 | Pending local edits are searchable immediately offline | Insert record while offline → search returns it before sync |
| INT-FTS-05 | Search works after encrypt/reopen cycle | Results identical pre/post reopen |
| INT-FTS-06 | Large corpus query latency within NFR-01 budget at 10k records | p50 <100ms mid-range device equivalent |
| INT-FTS-07 | Prefix query returns expected matches for 3+ character prefixes | Results include prefix-matched titles |
| INT-FTS-08 | Empty/whitespace query returns recent records without FTS execution | No MATCH clause executed; recent list returned |

## 4. Postgres Repository Integration Tests

| ID | Invariant | Method |
|---|---|---|
| INT-PG-01 | Tenant-scoped read: tenant A cannot SELECT tenant B rows | Direct SQL under tenant A role → zero B rows returned |
| INT-PG-02 | Constraint failure translated to stable application error code | UNIQUE violation on idempotency key → typed error, not raw PG message |
| INT-PG-03 | Pagination cursor boundary conditions stable | Last item of page N = first context of page N+1 |
| INT-PG-04 | Soft delete preserves audit/receipt records; hard delete cascades properly | Soft-deleted record still has receipts; workspace delete cascades |
| INT-PG-05 | Timezone/null/Unicode/large JSONB handled without error | Insert extreme values → round-trip intact |

## 5. RLS / Tenant Isolation Tests (pgTAP)

Run directly against Postgres alongside migrations. For every exposed tenant table:

| ID | Policy Under Test | Expected Behavior |
|---|---|---|
| INT-RLS-01 | SELECT cross-tenant | Tenant A sees zero rows owned by tenant B |
| INT-RLS-02 | INSERT cross-tenant | Tenant A cannot insert row with tenant B's `workspace_id` |
| INT-RLS-03 | UPDATE cross-tenant | Tenant A cannot modify tenant B rows; cannot change own `workspace_id` |
| INT-RLS-04 | DELETE cross-tenant | Tenant A cannot delete tenant B rows |
| INT-RLS-05 | UPSERT bypass attempt | ON CONFLICT path does not allow tenant escalation |
| INT-RLS-06 | Token vault table | No client role can read `connection_token_vault` regardless of JWT claims |
| INT-RLS-07 | Missing/malformed JWT | Zero rows accessible under `anon` role with invalid claims |
| INT-RLS-08 | Membership revoked mid-session | Cached JWT with stale membership denied on next query |

## 6. Outbox & Idempotency Integration Tests

| ID | Invariant | Method |
|---|---|---|
| INT-OBX-01 | Atomic success: business mutation + operation + receipt + outbox event committed together | Single transaction → all four rows exist with matching correlation IDs |
| INT-OBX-02 | Rollback: forced error after business write but before outbox insert | Neither business mutation nor outbox event persists |
| INT-OBX-03 | Concurrent same-key race: two requests submit simultaneously | Only one operation/business mutation/outbox event created; both callers receive same result |
| INT-OBX-04 | Conflicting key reuse: same key different body/hash | Stable 409 response; zero additional side effects |
| INT-OBX-05 | Relay crash window: claim → publish → crash before marking published | Restart relay → event published again; downstream dedupes |
| INT-OBX-06 | Two relay instances compete for same outbox event | Exactly-one lease claim; expired lease reclaimable after crash |

## 7. BullMQ Worker Integration Tests

| ID | Invariant | Method |
|---|---|---|
| INT-BMQ-01 | Job added → claimed → processor runs → completion status/receipt written | Full happy path against real Redis |
| INT-BMQ-02 | Transient failure on attempts 1–2, success on attempt 3 | Retry policy respected; final state succeeded |
| INT-BMQ-03 | Attempts exhausted → failed terminal + DLQ entry + alert metric | No further automatic retries |
| INT-BMQ-04 | Duplicate job ID delivered twice → processor runs once (idempotent) | Single provider side effect; single receipt |
| INT-BMQ-05 | Worker graceful shutdown during active job | Job not lost; reclaimed by next worker or restarted instance |
| INT-BMQ-06 | Redis temporarily unavailable → relay retries publishing later | Outbox event remains unpublished; no data loss |
| INT-BMQ-07 | Stalled job recovery beyond max-stalled-count | Job marked failed; repair case created |
| INT-BMQ-08 | Queue payload contains only IDs, never tokens or user content | Assert payload schema excludes sensitive fields |

## 8. Change Log

| Version | Date | Summary |
|---|---|---|
| 1.0 | 2026-08-23 | Created integration test cases covering SQLCipher, migrations, FTS5, Postgres repositories, RLS/pgTAP, outbox/idempotency, BullMQ workers. |
