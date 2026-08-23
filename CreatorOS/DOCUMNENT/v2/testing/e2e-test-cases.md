# E2E Test Cases — CreatorOS v2

**Version:** 1.0
**Date:** 2026-08-23
**Status:** Ready for Implementation
**Related:** v2/testing/test-strategy.md, TDD-02, TDD-03, TDD-04, TDD-07
**CI Frequency:** PR smoke (critical journeys) + nightly (full suite)

---

## 1. Purpose

End-to-end tests covering critical user journeys across mobile app layers, BFF, connector worker, and provider stubs. Deliberately narrow: 5–15% of automated assertions.

## 2. Tools

| Platform | Framework |
|---|---|
| iOS | XCUITest |
| Android | Compose Test / Espresso instrumentation |
| Backend | Ephemeral integration environment (BFF + worker + Postgres + Redis + provider stubs) |

## 3. Critical Journey Smoke Tests (Every PR)

| ID | Journey | Assertions |
|---|---|---|
| E2E-01 | First launch → sign up → initial local workspace created | Workspace visible; no crash; connection setup screen offered; can skip to local-only mode |
| E2E-02 | Create record offline → force app restart → reconnect → receipt synced | Record persists after restart; operation replays with same idempotency key; receipt appears in activity view |
| E2E-03 | Edit record → remote conflict introduced → resolution outcome displayed | Conflict banner or auto-resolved state per policy; audit trail shows resolution |
| E2E-04 | Search locally while offline including Unicode query | Results render from local FTS; no network dependency; coverage shows offline state |
| E2E-05 | Failed connector action → durable error and retry available | Error message is safe/actionable; Retry button triggers same idempotent operation |
| E2E-06 | Database migration fixture upgrade → old content accessible after update | App launches on new schema; pre-upgrade records searchable |
| E2E-07 | Free-plan limit reached mid-action → upgrade prompt shown without data loss | Existing records preserved; indexing paused; prompt dismissible |

## 4. Extended Journey Tests (Nightly)

### 4.1 Connection Lifecycle

| ID | Scenario | Assertions |
|---|---|---|
| E2E-10 | Connect Google Drive via OAuth sandbox | Connection appears Healthy; capabilities listed; consent screen shown before OAuth redirect |
| E2E-11 | Token expires → Health Center shows Needs Reauthorization with affected count | Reconnect flow completes; stale status cleared only after verification sync |
| E2E-12 | Disconnect provider → tokens deleted; normalized index cleaned within SLA | Vault row removed; index entries for that connector deleted; deletion receipt available |
| E2E-13 | Connect Notion → search returns Notion pages with source badge | Provider icon, title, last-updated timestamp visible on results |

### 4.2 Search & Coverage

| ID | Scenario | Assertions |
|---|---|---|
| E2E-20 | Federated search across Drive + Notion with one healthy and one stale provider | Local results first; external results labeled; stale provider flagged per CTS-50–52 |
| E2E-21 | Search with zero results while some sources unavailable | No matches in searched sources message shown; not generic empty |
| E2E-22 | Attach a search result to a connected record | Source link appears on record detail with provenance metadata |

### 4.3 Handoff & Receipts

| ID | Scenario | Assertions |
|---|---|---|
| E2E-30 | Open external source from record → receipt logged as opened | Receipt timestamp, initiator, outcome visible in activity view |
| E2E-31 | Share to CapCut via share sheet → receipt logged as shared | Outcome classified as user_confirmed, not verified |
| E2E-32 | Mark delivered → immutable delivery receipt generated; optional client ack link works | Receipt cannot be edited or deleted; public view shows only intended metadata |
| E2E-33 | Add annotation to receipt → original receipt unchanged | Annotation appears below receipt; original fields intact |

### 4.4 Settings & Account

| ID | Scenario | Assertions |
|---|---|---|
| E2E-40 | Navigate to Connection Health Center → all connections listed with health states | Each row shows provider icon, status label, affected-record count, primary action button |
| E2E-41 | Export data as JSON from Settings → file downloads regardless of subscription tier | Export not gated by plan; contains connected records and receipts |
| E2E-42 | Delete account with typed confirmation → tokens revoked; local data cleared | Confirmation requires typing DELETE; vault rows removed; local DB discarded |

## 5. Correlation & Observability Assertions

Every E2E test must assert correlation fields appear in sanitized logs:

```text
testRunId
operationId
idempotencyKey
tenantId / workspaceId
contractVersion
bffBuildSha
workerBuildSha
```

A failed E2E test must produce a traceable contract breach, not a vague timeout.

## 6. Change Log

| Version | Date | Summary |
|---|---|---|
| 1.0 | 2026-08-23 | Created E2E test cases covering critical journeys, connection lifecycle, search/coverage, handoff/receipts, settings/account. |
