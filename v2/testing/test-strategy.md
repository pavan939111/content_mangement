# Test Strategy — CreatorOS v2

**Version:** 1.0  
**Status:** In Review  
**Related:** `v2/architecture/` suite, `v2/testing/` suite

---

## 1. Core Testing Philosophy

A production strategy for CreatorOS v2 must be **local-first, deterministic, and pyramid-shaped**:
- **Offline operation, encryption, migrations, and local search** are core product behaviors, not implementation details.
- **Sync is an at-least-once distributed workflow**. The critical proof is that user intent survives interruptions, duplicates, and ambiguous outcomes to converge to a correct durable state.
- **Real Infrastructure for Integration**: Correctness hinges on transaction boundaries, durable outbox records, and tenant isolation. These must be tested with real Postgres, Redis, and encrypted SQLite—not generic mocks.

---

## 2. Test Pyramid & Tooling

Keep UI automation deliberately narrow (5–15% of automated assertions). Place most coverage in fast unit, database, and sync-contract tests.

| Layer | Scope / Purpose | Recommended Tools |
|---|---|---|
| **Pure Unit Tests** | Domain rules, reducers, conflict resolution, retry policy, error classification | iOS: Swift Testing<br>Android: JUnit 5, Coroutines Test<br>Backend: Vitest/Jest + Fake clock/IDs |
| **Data/Integration** | SQLite/SQLCipher queries, FTS5, Postgres transactions, BullMQ lifecycle, RLS | iOS: XCTest + SQLCipher temp DB<br>Android: Instrumented JUnit + SQLite<br>Backend: Testcontainers (Postgres, Redis) |
| **API Contract** | Fastify routes, schema validation, auth hooks, OpenAPI 3.1 compliance | Backend: Fastify `app.inject()`, Schemathesis, Spectral (lint) |
| **UI/Component** | Screen state, semantics, navigation, empty/error/offline states | iOS: SwiftUI previews / XCTest<br>Android: Compose UI Test, Turbine |
| **Visual/Non-Functional** | Accessibility, snapshots, performance baselines (startup, search latency) | iOS: `swift-snapshot-testing`, XCTest metrics<br>Android: Paparazzi/Roborazzi, Macrobenchmark |
| **End-to-End UI** | Critical journeys across app layers | iOS: XCUITest<br>Android: Espresso/Compose instrumentation |
| **Provider Sandbox** | Actual OAuth, webhooks, permissions, API rate limits | Dedicated Google Cloud/Notion test tenants |

---

## 3. Mobile Test Architecture

Mobile architecture centers around the local encrypted database as the primary source of truth.

### 3.1 Boundaries & Fakes
Do not test view code directly. Use Dependency Injection to provide replaceable test equivalents:
- **FakeClock**: Test retry windows and token expiry without sleeping.
- **FakeConnectivity**: Explicitly switch among offline, slow, reconnecting, and online states.
- **FakeAuth / StubAPI**: Deterministic sync testing.
- **TemporaryEncryptedDatabase**: Create a unique encrypted DB per test (never a shared simulator DB).

### 3.2 SQLCipher & Migrations
- **Query Correctness**: Run against a fresh encrypted database. Test key initialization, rotation, transaction atomicity, foreign keys, and safe recovery from full/corrupt files.
- **Migrations**: Preserve canonical database fixtures. Test migrations from older schemas seeded with unsynced outbox edits to prove idempotent startup behavior.
- **FTS5**: Test sync between content and virtual tables. Assert Unicode normalizations, deletion propagation (hidden from results), and search latency.

### 3.3 State Machine Testing
Test the sync engine as a deterministic state machine transitions (idle → queued → uploading → acknowledged, plus retries/conflicts). Define explicit failure points (M1–M8) capturing process death before, during, and after DB commits and HTTP responses.

---

## 4. Backend Test Architecture

The backend test suite must validate tenant isolation and durable at-least-once execution.

### 4.1 Postgres & Redis Integration
- Use **Testcontainers** for isolated, real Postgres and Redis instances.
- **Tenant Isolation (RLS)**: Test Row-Level Security directly in Postgres (using pgTAP). Verify `tenant_id` boundaries for SELECT, INSERT, UPDATE, DELETE.
- **Queue/Worker Integration**: Test BullMQ worker claiming, transient failures, exponential backoff, duplicate job delivery, queue pausing, and stalled job recovery against real Redis.

### 4.2 Transactional Outbox & Idempotency
Test strict invariants for the outbox relay:
- **Atomic Success**: Business state and outbox event commit in the same transaction.
- **Rollback**: Simulate failures to ensure no orphaned state persists.
- **Relay Crashes**: Kill processes during lease claiming, publishing, and cleanup to verify deduplication downstream.
- **Idempotency**: Repeatedly dispatching a command with the same idempotency key must not result in duplicate provider side effects.

---

## 5. Mocking Policy & Provider Sandboxes

Mocks are sufficient for domain logic, but real endpoints are required for provider API quirks.

| Test Concern | Approach |
|---|---|
| Connector payload mapping, pagination | In-memory fake / stub |
| HTTP request formatting, 4xx/5xx handling | Recorded sanitized fixtures |
| OAuth redirect, token refresh/revocation | Real sandbox test tenant |
| Webhook delivery & signatures | Signed local fixture + Real Sandbox |
| Rate Limits (429) & Retry-After | Fixtures + Controlled low-quota project |

**Test Tenants**: Create a dedicated Google Workspace and Notion test environment. Never use production credentials. Seed data with a strict TTL and run automated cleanup scripts.

---

## 6. Contract Testing

Treat **OpenAPI 3.1** as an enforced public contract shared by iOS, Android, and the BFF.

- **Spec-First Workflow**: Author `openapi.yaml`, generate types, and bind Fastify schema validation.
- **Validation**: Use `app.inject()` to assert that runtime responses match the OpenAPI schema. Run Schemathesis to fuzz boundary inputs.
- **Mobile Compatibility**: Ensure additive-only changes on `/v1`. Generate and compile Swift/Kotlin clients in CI to verify backward compatibility.
- **Consumer-Driven Contracts**: Optionally use Pact for asynchronous BFF ↔ worker events or high-risk interactions.

---

## 7. UI, Snapshot, and Accessibility Strategy

Quality is tested as a state-and-scale matrix: every feature must work in empty, loading, cached, offline, and error states—at maximum text scaling and in dark mode.

- **Accessibility**: Use `accessibilityIdentifier` (iOS) and `testTag` (Android). Run automated accessibility audits (e.g., `performAccessibilityAudit()`, Compose checks). Verify color contrast meets WCAG 2.2 AA.
- **Snapshot Testing**: Capture dynamic type, light/dark themes, RTL, and offline banner states using deterministic data.
- **Performance Gates**: Microbenchmark cold/warm launch, local DB unlock, FTS query latency, and dense UI scrolling.

---

## 8. CI/CD & Release Gates

### 8.1 Pull Request Pipeline
- Lint, type checks, OpenAPI drift/diff checks.
- Pure unit tests, Fastify route injections, and DB/Queue integrations via Testcontainers.
- Mobile SQLite integration and outbox transactions.
- Snapshot visual regression checks.

### 8.2 Nightly Pipeline
- Full simulator/emulator matrix and physical device farm.
- Expanded migration matrix from all historical versions.
- Property/Fuzz tests for sync orders, webhooks, and crash/restart sequences.
- Provider sandbox smoke tests (Google/Notion real API calls on test tenants).
- Performance regressions (launch time, memory peak, DB I/O).

### 8.3 Release Candidate Gates
**Block release on:**
- Migration that alters/loses tenant data.
- RLS allow/deny regression.
- Duplicate connector side effect under idempotent retry.
- Committed domain mutation missing an outbox record.
- OpenAPI breaking change.
- Any leaking of provider tokens, IDs, or stack traces in responses.

---

## 9. Change Log

| Version | Date | Summary |
|---|---|---|
| 1.0 | 2026-08-23 | Created Test Strategy based on production best practices. |
