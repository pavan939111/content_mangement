# MVP Definition of Done — CreatorOS v2

**Version:** 1.0
**Date:** 2026-08-23
**Status:** Active
**Purpose:** Objective checklist for declaring the v2 MVP code-complete and ready for release candidate.

---

## 1. Functional Requirements Complete

- [ ] All Must-have requirements in `FRS-01-connected-content-record-v2.md` pass their acceptance criteria (CCR-01 through CCR-07, CCR-10 through CCR-16, CCR-20 through CCR-23, CCR-30 through CCR-33).
- [ ] All Must-have requirements in `FRS-03-cross-tool-search-v2.md` pass acceptance criteria (CTS series).
- [ ] All Must-have requirements in `FRS-06-handoff-action-receipts-v2.md` pass acceptance criteria (HAR series).
- [ ] All Must-have requirements in `FRS-07-connector-framework-v2.md` pass acceptance criteria (CNF series).
- [ ] All Must-have requirements in `FRS-09-onboarding-settings-account-v2.md` pass acceptance criteria (ONB series).
- [ ] All Must-have NFR-v2 deltas pass: performance (PER), offline sync (OFS), security/privacy (SPC), reliability (RIN), platform integration, quality/cost.
- [ ] Retained v1 modules (idea capture, clip library, script editor, media preview, notifications, import/export) function against `connected_record` without regression.

## 2. Critical User Flows Implemented and Tested

- [ ] First launch and onboarding flow (`user-flows.md` §2)
- [ ] Idea capture flow (§3)
- [ ] Connecting a provider flow (§4)
- [ ] Creating a project / connected record flow (§5)
- [ ] Cross-tool search flow (§6)
- [ ] Preparing and sending a delivery flow (§7)
- [ ] Connection failure handling flow (§8)
- [ ] Offline action and sync flow (§9)
- [ ] Reauthorization flow (§10)

## 3. Test Suites Written and Passing in CI

- [ ] Unit test suite passes on every PR (iOS Swift Testing + Android JUnit 5 + backend Vitest)
- [ ] Integration test suite passes: SQLCipher encryption, migrations, FTS5, Postgres RLS/pgTAP, outbox/idempotency, BullMQ workers
- [ ] E2E critical journey smoke tests pass on every PR (7 journeys from `e2e-test-cases.md` §3)
- [ ] E2E extended nightly suite passes (connection lifecycle, search coverage, handoff/receipts, settings/account)
- [ ] Accessibility automated audits pass (`performAccessibilityAudit()` iOS; Compose accessibility checks Android)
- [ ] Provider sandbox tests pass weekly and at RC (OAuth lifecycle, Drive/Calendar/Notion integration, webhook signatures)
- [ ] Performance benchmark suite passes within budgets defined in `performance-test-cases.md`
- [ ] Release gates reviewed and all stage criteria met per `release-gates.md`
- [ ] Contract tests pass: OpenAPI lint clean, generated clients compile for Swift/Kotlin/TypeScript, Schemathesis fuzz produces no 5xx

## 4. Technical Spike Executed

- [ ] KMP + SQLCipher + FTS5 spike executed per `ARCHITECTURE-17-technical-spike-execution-tracker.md` with real device measurements on mid-range and low-end tiers
- [ ] All acceptance gates met (warm search p95, cold startup, autosave latency, memory growth, DB integrity)
- [ ] DEC-001 status updated to "Confirmed" based on real results in `spike-results.md`

## 5. API Contract Validated

- [ ] OpenAPI specification validates with zero errors (Spectral lint)
- [ ] No duplicate path keys; all mutating endpoints have Idempotency-Key parameter
- [ ] Error responses consistently use RFC 9457 problem+json format
- [ ] Generated TypeScript client compiles and type-checks
- [ ] Generated Swift client compiles against example payloads
- [ ] Generated Kotlin client compiles against example payloads
- [ ] Backward compatibility diff shows no unapproved breaking changes

## 6. Database Migrations Verified

- [ ] All local SQLite migrations pass on encrypted databases with realistic data fixtures
- [ ] Full migration chain tested from every historical schema version
- [ ] Backend Postgres migrations applied cleanly in test environment
- [ ] pgTAP RLS suite passes: all tenant isolation allow/deny policies verified
- [ ] Outbox transactional atomicity proven under forced failure conditions

## 7. Performance Budgets Met

- [ ] Local FTS5 search p50 ≤100ms on mid-range device tier at 100k record corpus
- [ ] Connected search first page p50 ≤1.0s, p95 ≤2.0s (NFR-01-v2 PER-01/02)
- [ ] Local results render before external results regardless of provider latency
- [ ] Provider timeout at 3s produces partial results, not full failure
- [ ] Cold launch to usable workspace ≤2.0s p95 on low-end device
- [ ] Sustained 30-minute session memory growth <15% on mid-range
- [ ] App binary size delta within spike-tracker estimates for both platforms

## 8. Google OAuth / CASA Readiness

- [ ] Google OAuth app verification submitted OR approved
- [ ] CASA annual security assessment completed OR interim scope strategy documented and approved:
    - Option A: Restricted scope (`drive.metadata.readonly`) with full CASA approval before production launch
    - Option B: Interim launch using `drive.file` scope with Google Picker only (reduced capability documented in UI)
- [ ] Chosen option explicitly recorded in DEC-039 with sign-off from Product and Security

## 9. RevenueCat Entitlement Enforcement

- [ ] BFF validates purchase tokens via RevenueCat server API
- [ ] Entitlement state cached server-side with 24-hour TTL per `ARCHITECTURE-20-revenuecat-entitlement-enforcement.md`
- [ ] Plan limits enforced server-side: Free = 2 connected sources / 10 active records; Solo = unlimited sources/records; Pro = advanced features
- [ ] RevenueCat webhook invalidates cached entitlement state on upgrade/downgrade/cancellation
- [ ] Grace period behavior follows Apple/Google store policy
- [ ] Client-side entitlement status never trusted for server-side authorization decisions

## 10. Security and Data Integrity

- [ ] Zero P0 or P1 security vulnerabilities open
- [ ] Zero P0 or P1 data-loss bugs open
- [ ] Provider tokens confirmed absent from logs, receipts, queue payloads, analytics, and crash reports
- [ ] Token vault encrypted with KMS-managed keys; worker-only decrypt access verified
- [ ] Webhook signature verification tested against both valid and forged requests
- [ ] Disconnect deletes vault rows immediately and triggers best-effort revocation

## 11. Rollout Readiness

- [ ] Release gates document reviewed and accepted by engineering lead
- [ ] Canary cohort plan defined with rollback thresholds predeclared
- [ ] Phased rollout schedule (10% → 50% → 100%) agreed
- [ ] Feature flags tested in all four modes (off/on/mid-flip/rollback)
- [ ] Runbooks written for defined alert conditions

---

## Sign-Off

| Role | Name | Date | Signature |
|---|---|---|---|
| Product Lead | _________________ | _______ | _________________ |
| Engineering Lead | _________________ | _______ | _________________ |
| Security Lead | _________________ | _______ | _________________ |
| Design Lead | _________________ | _______ | _________________ |

All items must be checked before the MVP is declared code-complete. Partial completion requires explicit risk acceptance documented by Product and Engineering leads.
