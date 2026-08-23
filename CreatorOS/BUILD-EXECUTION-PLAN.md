# Build Execution Plan — CreatorOS v2 MVP

**Version:** 1.0
**Date:** 2026-08-23
**Status:** Active
**Audience:** Every engineer joining the project. Read this file first.

---

## 1. Build Start Prerequisites

| # | Prerequisite | What Is Needed | Defining Document | Blocker? |
|---|---|---|---|---|
| P-01 | Supabase production project | Auth enabled, Postgres with RLS, Edge Functions for webhooks | external-dependency-register.md | Hard blocker for Phase 2 |
| P-02 | Managed Redis instance | For BullMQ job delivery | external-dependency-register.md | Hard blocker for Phase 5 |
| P-03 | Cloud KMS (or equivalent) | Key management for token vault envelope encryption | docs/tdd/TDD-07 §2 | Hard blocker for Phase 5 |
| P-04 | RevenueCat account and products configured | Free/Solo/Pro subscription products in store consoles | external-dependency-register.md; docs/architecture/ARCHITECTURE-20 | Parallel: needed by Phase 9 |
| P-05 | Google OAuth client IDs | Consent screen configured; redirect URIs registered | docs/api/auth/oauth-flows.md | Hard blocker for Phase 5 provider testing |
| P-06 | Notion integration created | Internal integration for dev; public listing submitted later | docs/api/providers/notion.md | Hard blocker for Phase 5 Notion adapter testing |
| P-07 | Apple Developer and Google Play accounts | Distribution certificates and signing | external-dependency-register.md | Parallel: needed for Phase 10 RC |
| P-08 | Physical device test matrix | Low-end, mid-range, high-end per spike tracker section 3 | docs/architecture/ARCHITECTURE-17-technical-spike-execution-tracker.md | Hard blocker for Phase 0 spike |
| P-09 | Deterministic synthetic corpus generator | 100k records with specified provider mix, Unicode, duplicates | ARCHITECTURE-17 section 4 | Hard blocker for Phase 0 spike |
| P-10 | CI/CD pipeline | GitHub Actions with stage gates per release gates PR stage | docs/testing/release-gates.md section 3 | Parallel: must be live before Phase 2 merge |
| P-11 | Remote config and feature flag service | Signed JSON endpoint on Supabase Edge Functions | docs/product/product-scope.md | Parallel: needed before Phase 5 feature gating |
| P-12 | Secrets manager access | Backend secret store for KMS keys, OAuth client secrets, RevenueCat keys | docs/tdd/TDD-07 section 9.2 | Hard blocker for Phase 5 |
| P-13 | Sentry projects created | iOS, Android, BFF, worker DSNs | docs/product/product-scope.md observability row | Parallel |
| P-14 | Analytics platform chosen | Needs human decision: not defined in repository | docs/requirements/traceability/traceability-matrix-v2.md defines event names but not tool | Parallel: needed before Phase 8 instrumentation |

---

## 2. Phase Plan

Phases are ordered by dependency. Each phase lists objective, entry criteria, build tasks, documents, acceptance criteria, verification steps, exit criteria, and dependencies.

---

### Phase 0: Technical Spike

**Objective:** Confirm or reject DEC-001 (KMP shared core) based on real device measurements of SQLCipher + FTS5 performance, battery, memory, and app size.

**Entry criteria:** Device matrix reserved (P-08); corpus generator ready (P-09).

**Key build tasks (in order):**
1. Pin SQLCipher versions for iOS and Android; confirm FTS5 compile flag at runtime.
2. Build deterministic 100k-record corpus generator per ARCHITECTURE-17 section 4.
3. Implement minimal GRDB plus SQLCipher plus FTS5 harness (iOS) and Room plus SQLCipher harness (Android) using the schema from TDD-01 section 6.
4. Run measurement protocol per ARCHITECTURE-17 section 5: warm and cold search latency, cold startup TTID and TTFD, autosave latency in NORMAL and FULL modes, sustained 30-minute session, database integrity after simulated crash.
5. Record all results with evidence (device model, OS version, build hash, percentiles).
6. Update DEC-001 status to Confirmed or NO-GO.

**Documents to read:** ARCHITECTURE-17 (entire); TDD-01 section 6; DEC-001 in ARCHITECTURE-10-open-decisions-v2.md

**Acceptance criteria (from ARCHITECTURE-17 section 6):**
- Warm 1 to 3 term FTS p95 at most 100 ms mid-range and at most 200 ms low-end
- Cold startup to search-ready p95 at most 1.8 s mid-range
- Autosave p95 at most 40 ms mid-range with WAL and NORMAL
- Memory growth under 15 percent over 30 minutes mid-range
- Database integrity 100 percent after interrupted workload

**Verification steps:**
- Results reviewed by Mobile Architect against gates above
- DEC-001 updated in ARCHITECTURE-10-open-decisions-v2.md

**Exit criteria:** All acceptance gates met on mid and high tiers; low tier shows no memory or size failures; DEC-001 finalized. If NO-GO: revise persistence approach and re-spike before Phase 2.

**Dependencies:** None. This is the first activity.

---

### Phase 1: Foundation and Repository Setup

**Objective:** Stand up monorepo structure, CI pipeline, and cloud infrastructure so subsequent phases can merge code.

**Entry criteria:** Spike running or passed for non-persistence tasks; can start in parallel with Phase 0.

**Key build tasks:**
1. Initialize Xcode project (iOS) and Gradle project (Android) per apps READMEs.
2. Initialize Node/TypeScript monorepo packages per packages READMEs.
3. Scaffold Fastify BFF app per TDD-03 section 8.1 structure.
4. Scaffold BullMQ worker per TDD-04 section 8.1 structure.
5. Provision Supabase project, Redis, and Cloud KMS per prerequisites P-01, P-02, P-03.
6. Configure GitHub Actions CI per workflows README and release gates PR stage.
7. Set up remote config service per product scope document.

**Documents:** apps and packages READMEs; docs/testing/release-gates.md; docs/architecture/ARCHITECTURE-11-technology-stack-v2.md

**Acceptance criteria:**
- CI runs lint and unit tests on every PR
- Supabase migrations apply cleanly to staging project
- Redis reachable from worker scaffold

**Exit criteria:** Empty PR passes all CI checks; infrastructure reachable from local dev.

**Dependencies:** None hard; parallel with Phase 0.

---

### Phase 2: Core Data and Authentication

**Objective:** Implement encrypted local database schema, backend Postgres migrations, Supabase Auth integration in BFF, and RLS isolation.

**Entry criteria:** Phase 1 complete; spike confirmed DEC-001.

**Key build tasks:**
1. Implement local SQLite schema per TDD-01 section 6 including connected_record, external_source_link, connections, sync_state, local_operations, action_receipts, search_content with FTS virtual table and triggers.
2. Implement forward-only transactional migrations per TDD-01 section 8.
3. Write Postgres migrations per ARCHITECTURE-18 sections 5.1 through 5.15 into supabase/migrations.
4. Implement Supabase JWT validation plugin in BFF per TDD-03 section 8.2.
5. Write pgTAP RLS tests per integration-test-cases.md section 5 and run them.
6. Implement encryption key storage: iOS Keychain afterFirstUnlockThisDeviceOnly; Android Keystore wrapping SQLCipher key per TDD-01 section 7.

**Documents:** TDD-01 entire; TDD-03 section 8; ARCHITECTURE-18 entire; integration-test-cases.md sections 3 through 5

**Acceptance criteria (from TDD-01 section 11):**
- FTS returns non-deleted records only
- Database opens only with correct key
- Pending operations survive process death
- RLS blocks cross-workspace access with all pgTAP tests passing

**Exit criteria:** All acceptance criteria pass in CI; no P0 bugs against schema or migrations.

**Dependencies:** Phase 1 complete.

---

### Phase 3: Connected Content Record

**Objective:** Implement connected_record CRUD flow end to end: local creation, BFF endpoint, durable operation, receipt.

**Entry criteria:** Phase 2 exit criteria met.

**Key build tasks:**
1. Implement ContentRepository for local CRUD on connected_record and external_source_link per TDD-01 section 7.
2. Implement BFF routes for connected-content CRUD and links per OpenAPI paths.
3. Implement local_operations outbox insert atomically with record mutations per TDD-02 section 4.
4. Implement SyncCoordinator submitting pending operations with persisted idempotency key per TDD-02 section 6.
5. Implement BGTaskScheduler and WorkManager scheduling per TDD-02 section 8.

**Documents:** FRS-01-connected-content-record-v2.md; TDD-01 section 7; TDD-02 entire; docs/api/endpoints/connected-content.md; docs/uiux/user-flows.md section 5

**Acceptance criteria (from FRS-01 CCR series and TDD-02 section 11):**
- Create record offline then restart then reconnect produces synced receipt without duplicate (E2E journey E2E-02)
- Same idempotency key replayed produces one operation
- Validation failure becomes terminal state
- OAuth invalid becomes blocked_reauth state

**Exit criteria:** Offline create edit delete cycle proven durable across process death and network loss.

**Dependencies:** Phase 2 complete.

---

### Phase 4: Public API and Durable Operations

**Objective:** Complete BFF command endpoints with idempotency enforcement, transactional outbox, operation and receipt state machines, and crash-safe processing.

**Entry criteria:** Phase 3 core CRUD working locally and via API.

**Key build tasks:**
1. Implement api_idempotency_keys claim logic per TDD-03 section 6 and cross-cutting idempotency rules.
2. Implement transactional_outbox insert in same DB transaction as business mutation per ARCHITECTURE-18 section 5.7.
3. Implement outbox relay using FOR UPDATE SKIP LOCKED claim pattern.
4. Implement operations and action_receipts state machines per ARCHITECTURE-18 sections 5.4 and 5.5.
5. Implement receipt_annotations separate append-only table per ARCHITECTURE-18 section 5.6.
6. Implement problem-plus-json error handler per TDD-03 section 9.1 and errors.md.

**Documents:** TDD-03 entire; TDD-04 sections 4 and 5; errors.md; idempotency.md

**Acceptance criteria (from TDD-03 section 11):**
- Duplicate command returns original operation
- Same key different body returns 409 conflict
- Outbox event committed atomically with operation
- Generated clients compile against OpenAPI spec

**Exit criteria:** Idempotency and durability invariants proven under fault injection.

**Dependencies:** Phase 3 complete.

---

### Phase 5: Connector Worker and Provider Adapters

**Objective:** Implement connector service: BullMQ queues, provider adapters for Drive, Docs, Calendar, and Notion; token vault with refresh serialization; rate limiting and retry policies.

**Entry criteria:** Phase 4 durable operations passing. Google and Notion OAuth credentials available (P-05, P-06). Redis and KMS provisioned (P-02, P-03). Secrets in manager (P-12).

**Key build tasks (in order):**
1. Implement token vault with encrypted token columns, KMS encrypt and decrypt, and conditional update for rotation per TDD-07 section 8.2.
2. Implement ConnectionLock for serialized token refresh per connection per TDD-07 section 8.
3. Implement OAuth flows: start, callback exchange, reauthorize, disconnect per TDD-07 section 7.1 and oauth-flows.md.
4. Implement ProviderAdapter interface and capability registry per TDD-05 section 4.
5. Implement GoogleDriveAdapter: files.list discovery, changes delta sync using start page token, watch channel registration deferred to Phase 2 webhooks.
6. Implement GoogleCalendarAdapter: events.list with sync token; event creation with operation ID in extended properties.
7. Implement GoogleDocsHydrator: metadata via Drive; content fetch only when policy permits.
8. Implement NotionAdapter: search, page metadata, depth-limited block traversal; refresh token rotation handling.
9. Implement rate limiter with Redis token buckets plus Postgres fallback per TDD-08 section 6.
10. Implement retry policies per TDD-04 section 8.3: exponential backoff with jitter; Retry-After honored without consuming attempt.
11. Implement DLQ routing after max attempts per TDD-04 section 9.1.

**Documents:** TDD-05 entire; TDD-07 entire; TDD-08 entire; all four provider specs in docs/api/providers/; ARCHITECTURE-15 entire

**Acceptance criteria (from provider-sandbox-tests.md):**
- OAuth lifecycle tests PS-OA-01 through PS-OA-10 pass deterministically
- Sandbox OAuth lifecycle tests PS-SBX-01 through PS-SBX-07 pass weekly against real tenants
- Drive discovery, delta sync, watch channels, and rate limit tests pass
- Calendar event creation with timezone handling and sync token invalidation tests pass
- Notion search, refresh rotation, webhook signatures, and version pinning tests pass
- Concurrent refresh serialized per connection
- Refresh rotation atomic for Notion replacing both tokens in one transaction

**Verification steps:**
- Provider sandbox suite green against real Google Workspace and Notion QA tenants
- Rate limiter honors Retry-After without burning normal retry attempts
- Token never appears in logs, payloads, or receipts verified by CI assertion

**Exit criteria:** All four adapters return normalized results through full stack from mobile intent to BFF operation to queue to adapter to receipt under sandbox conditions.

**Dependencies:** Phases 2, 3, 4 complete; external credentials provisioned.

---

### Phase 6: Search and Connection Health

**Objective:** Implement local FTS5 search, normalized backend index with connected search endpoint, connection health states with recovery UX.

**Entry criteria:** Phase 5 adapters returning real provider data.

**Key build tasks:**
1. Implement local SearchRepository querying search_fts per TDD-01 section 6.4 query template.
2. Implement normalized_index population during sync jobs per ARCHITECTURE-15 section 8.
3. Implement GET search endpoint backed by normalized index per OpenAPI path and NFR-01-v2 PER targets.
4. Implement search coverage computation for complete, partial, stale, and unavailable providers per FRS-03 CTS-50 through CTS-52 and uiux state matrix section 3.
5. Implement ConnectionHealthService tracking canonical state transitions per TDD-07 section 4.
6. Implement reauthorization UX flow per uiux user flows section 10.
7. Implement stale-result labeling on search result cards per SearchResult is_stale field in OpenAPI.

**Documents:** FRS-03-cross-tool-search-v2.md entire; TDD-01 section 6; ARCHITECTURE-15 section 8; NFR-01-performance-v2.md PER targets; state-matrix.md sections 3 and 4

**Acceptance criteria (from FRS-03 and NFR-01-v2):**
- Local search works fully offline per CTS-60
- External results labeled by source with icon, timestamp, and status per CTS-22 and CTS-23
- Stale sources show warning banner per CTS-51
- Connected search first page p50 at most 1 second and p95 at most 2 seconds per PER-01 and PER-02
- Local results render before external regardless of provider latency per PER-03
- Provider timeout at 3 seconds shows partial results not failure per PER-04

**Exit criteria:** Search coverage accurately reflects provider health; performance budgets met on target devices.

**Dependencies:** Phase 5 complete.

---

### Phase 7: Webhook and Reconciliation (Deferred)

**Objective:** Determine scope; implement only if MVP requires it.

**Determination:** Per product-scope.md and the TDD-06 header, webhooks are Phase 2, not MVP. The MVP uses scheduled polling and user-triggered sync only.

**Action for this build:**
- Mark as DEFERRED.
- Do not implement inbox, signature verification, or channel lifecycle in MVP.
- Ensure scheduled polling fallback is robust enough that webhook absence does not degrade UX beyond documented staleness thresholds per OFS-02.
- Retain TDD-06 and cross-cutting webhooks doc as the authoritative design for future implementation.
- Exclude from current release gates and DoD checklist.

**Dependencies:** None for MVP build. Revisit post-launch.

---

### Phase 8: UI/UX Implementation

**Objective:** Build all screens per information architecture; implement every state from the state matrix; verify accessibility and localization.

**Entry criteria:** Phases 3 through 6 provide working data layer for UI binding.

**Key build tasks:**
1. Implement bottom navigation and primary destinations per information-architecture.md.
2. Implement record detail screen with source link chips, receipts list, and next action indicator per FRS-01 CCR-04 through CCR-06 and screen-inventory.md.
3. Implement search screen with coverage banner per state-matrix.md section 3 and FRS-03 CTS series.
4. Implement Connection Health Center screen per FRS-09 ONB-30 through ONB-35 and state-matrix.md section 4.
5. Implement capture sheet per user-flows.md section 3 and FRS-02.
6. Implement settings screens per FRS-09 ONB-20 through ONB-23.
7. Implement delivery share view per FRS-06 HAR-22 and HAR-23 and delivery-links.md security spec.
8. Extract all strings to resources per NFR-10-localization-v2.md section 3 surfaces list.
9. Apply design tokens per design-tokens.md.
10. Set accessibility identifiers on all actionable elements per accessibility.md convention.

**Documents:** All files in docs/uiux/; FRS-01, FRS-02, FRS-06, FRS-09 v2; NFR-10-localization-v2.md; ui-test-cases.md; accessibility-test-cases.md

**Acceptance criteria:**
- All eight search coverage states render correctly per UI-SRCH-01 through UI-SRCH-08
- All six connection health rows display correct treatment per UI-HLT-01 through UI-HLT-06
- Receipt list distinguishes verified versus user confirmed outcomes per UI-RCP-02
- Automated accessibility audits pass per A11Y-01 through A11Y-05
- Dynamic Type at maximum size causes no truncation of critical text per A11Y-DT-01

**Exit criteria:** Zero unlabeled interactive elements; zero contrast failures; all critical journeys navigable by screen reader alone.

**Dependencies:** Phases 3 through 6 complete.

---

### Phase 9: Testing, Performance, and Release Prep

**Objective:** Run full verification pyramid against real infrastructure; validate performance budgets; prepare release candidate artifacts.

**Entry criteria:** Phase 8 UI complete; all features code-complete.

**Key build tasks:**
1. Run full unit test suite across iOS, Android, and backend. All green.
2. Run integration suite against real Postgres, Redis, and SQLCipher including migration chain from every historical fixture.
3. Run nightly E2E extended suite covering connection lifecycle, search coverage, handoff and receipts, settings and account.
4. Run provider sandbox weekly suite against real tenants.
5. Run performance benchmarks per performance-test-cases.md scenarios with all budgets met.
6. Run Schemathesis fuzzing against staging OpenAPI with zero unexpected 5xx responses.
7. Generate release candidate builds signed for distribution.
8. Prepare App Store and Play Store submission assets.
9. Verify RevenueCat entitlement enforcement end to end per ARCHITECTURE-20 including purchase, cache update, and gated action allowance.
10. Verify CASA status approved or interim scope strategy documented and accepted per DEC-039.

**Documents:** mvp-definition-of-done.md; release-gates.md; performance-test-cases.md; provider-sandbox-tests.md; ARCHITECTURE-20

**Acceptance criteria:**
- All suites green in CI
- Performance budgets met on mid-range reference device
- Binary size delta within spike tracker estimates
- Zero P0 or P1 security or data loss bugs open
- RevenueCat entitlement cache updates on webhook event tested in sandbox

**Exit criteria:** RC build tagged; canary cohort plan ready; store submissions uploaded.

**Dependencies:** Phases 3 through 8 complete; external dependencies resolved.

---

### Phase 10: Release

**Objective:** Canary rollout, phased expansion, post-release monitoring.

**Entry criteria:** Phase 9 exit criteria met; DoD checklist all items checked or risk-accepted.

**Key build tasks:**
1. Deploy canary build to internal QA cohort with feature flags enabled per release gates canary section.
2. Monitor metrics against rollback thresholds including crash-free rate, error rates, duplicate-operation signal, and credential-leak signal.
3. Expand rollout in phases from 10 percent to 50 percent to 100 percent as thresholds hold.
4. Enable synthetic probes and contract drift detection per release gates post-release monitoring section.
5. Monitor support channels for unexpected behavior.

**Exit criteria:** Full rollout stable; monitoring dashboards healthy; no rollback triggered.

**Dependencies:** Phase 9 complete; founder sign-off on DoD.

---

## 3. Critical Verification Gates

| Gate | When It Applies | What Must Pass | Reference Document |
|---|---|---|---|
| Spike Gate | End of Phase 0 | Real-device measurements meet ARCHITECTURE-17 acceptance gates on mid and high tiers; DEC-001 finalized | ARCHITECTURE-17 |
| Database Migration Gate | End of Phase 2 and each migration change | Full migration chain from historical fixtures passes; pgTAP RLS suite green; encrypted database integrity preserved | integration-test-cases.md sections 3.2 and 5 |
| OpenAPI Contract Gate | Every PR enforced in CI | Spectral lint clean; no duplicate paths; generated clients compile; no unapproved breaking change in diff | release-gates.md PR stage |
| Idempotency and Crash-Safety Gate | End of Phase 4 and connector changes | Atomicity tests pass under concurrent same-key and relay crash conditions; duplicate job delivery produces single side effect | integration-test-cases.md sections 6 and 7 |
| RLS Isolation Gate | End of Phase 2 and each migration | All pgTAP allow and deny policies pass across SELECT INSERT UPDATE DELETE and upsert bypass attempts | integration-test-cases.md section 5 |
| Provider Integration Gate | End of Phase 5 and weekly thereafter | All provider sandbox scenarios pass against real tenants covering OAuth adapters rate limits signatures | provider-sandbox-tests.md |
| Offline Sync Gate | End of Phase 3 and sync changes | TDD-02 section 11 invariants pass: operation persists across process kill; replay deduplicates; cursor advances only after commit | TDD-02 section 11 |
| Connected Search Gate | End of Phase 6 | PER-01 p50 within 1 second; PER-02 p95 within 2 seconds; PER-03 local first rendering; PER-04 timeout partial results on target device | NFR-01-performance-v2.md |
| Accessibility Gate | End of Phase 8 | Automated audits A11Y-01 through A11Y-05 pass; manual VoiceOver and TalkBack checklist complete | accessibility-test-cases.md |
| Performance Gate | Nightly from Phase 6 and blocking at RC | Performance scenario budgets met with regression under 10 percent versus baseline | performance-test-cases.md |
| Release Candidate Gate | Transition from Phase 9 to Phase 10 | All DoD items checked or risk accepted; canary metrics within rollback thresholds for hold period | mvp-definition-of-done.md and release-gates.md |
| Final MVP DoD Gate | Before broad release | Every DoD item checked; sign-off completed by Product Engineering Security Design leads | mvp-definition-of-done.md |

---

## 4. Day One Instructions

If you are starting today do this first:

1. Read `docs/handoff-to-engineering.md` for overview of what is ready and what gates exist.
2. Read `docs/product/mvp-milestone-plan.md` to understand where you are in the timeline and what your phase expects.
3. Find the spike tracker at `docs/architecture/ARCHITECTURE-17-technical-spike-execution-tracker.md`. If you are mobile this is likely your first task.
4. Find the OpenAPI contract at `docs/api/openapi/creatoros-public.openapi.yaml`. If you are backend generate your client types from this.
5. Find the MVP Definition of Done at `docs/product/mvp-definition-of-done.md` to understand what done means before writing code.
6. Execute your first task based on role:
   - Mobile: run the spike per ARCHITECTURE-17 setup checklist
   - Backend: scaffold Fastify app per TDD-03 section 8.1 and run migrations from ARCHITECTURE-18
   - DevOps: provision Supabase Redis KMS per external-dependency-register.md
   - QA: write pgTAP RLS tests per integration-test-cases.md section 5
7. Record evidence: measurements test results and decisions go into the relevant document change log or results file not into chat messages.
8. When to ask instead of guess: if you find behavior not covered by any document in docs/ or a conflict between two documents or a decision marked provisional that blocks your task stop and ask the engineering lead. Do not invent defaults.

---

## 5. Documents Reference Index

| Document | Role | When to Read |
|---|---|---|
| docs/product/vision-v2.md | Product north star | Onboarding week 1 |
| docs/product/prd-v2.md | What we are building and why | Onboarding |
| docs/product/product-scope.md | MVP IN and OUT boundaries | Onboarding and when scoping a ticket |
| docs/product/mvp-definition-of-done.md | Objective completion checklist | Before declaring any phase done |
| docs/product/mvp-milestone-plan.md | Phase ordering and timeline | Planning and every sprint start |
| docs/requirements/functional/FRS-01-connected-content-record-v2.md | Core object requirements | Phase 3 |
| docs/requirements/functional/FRS-03-cross-tool-search-v2.md | Search behavior | Phase 6 |
| docs/requirements/functional/FRS-06-handoff-action-receipts-v2.md | Handoffs and receipts | Phase 4 |
| docs/requirements/functional/FRS-07-connector-framework-v2.md | Connector framework rules | Phase 5 |
| docs/requirements/functional/FRS-09-onboarding-settings-account-v2.md | Account settings health center | Phase 8 |
| docs/requirements/functional/FRS-14-subscription-monetization-v2.md | Pricing plans and limits | Phase 9 entitlement work |
| Other FRS v2 deltas (02 04 05 08 10 11 12 13) | Retained modules adapted for connected_record | When touching those features |
| docs/requirements/non-functional/NFR-01-performance-v2.md | Latency targets and SLOs | Phase 6 onward |
| docs/requirements/non-functional/NFR-02-offline-sync-v2.md | Sync freshness and staleness rules | Phase 3 |
| docs/requirements/non-functional/NFR-04-battery-thermal-memory-v2.md | Energy and memory constraints | Phase 0 spike and Phase 6 |
| docs/requirements/non-functional/NFR-05-security-privacy-v2.md | Token index receipt privacy rules | All phases and security review |
| docs/requirements/non-functional/NFR-07-app-size-resource-v2.md | Binary size budget | Phase 0 and Phase 9 |
| docs/requirements/non-functional/NFR-09-reliability-integrity-v2.md | Receipt immutability and idempotency rules | Phase 4 |
| docs/requirements/non-functional/NFR-10-localization-v2.md | String resources and pseudolocalization rules | Phase 8 |
| docs/requirements/non-functional/NFR-11-maintainability-observability-compliance-v2.md | Logging metrics compliance posture | Phase 4 onward |
| docs/requirements/non-functional/NFR-12-quality-cost-capacity-v2.md | Cost and capacity targets | Architecture reviews |
| docs/requirements/traceability/traceability-matrix-v2.md | Requirements tests metrics mapping | Impact analysis |
| docs/architecture/ARCHITECTURE-00-overview-v2.md | System level architecture | Onboarding |
| docs/architecture/ARCHITECTURE-03-data-layer-v2.md | Data layer decisions | Phase 2 |
| docs/architecture/ARCHITECTURE-13-connector-architecture-v2.md | Connector abstraction | Phase 5 |
| docs/architecture/ARCHITECTURE-14-tool-capability-matrix-v2.md | What each provider can and cannot do | Phase 5 |
| docs/architecture/ARCHITECTURE-15-backend-connector-service-v2.md | Backend service components | Phases 4 and 5 |
| docs/architecture/ARCHITECTURE-17-technical-spike-execution-tracker.md | Spike protocol and gates | Phase 0 |
| docs/architecture/ARCHITECTURE-18-database-erd-v2.md | Authoritative database schema | Phase 2 onward |
| docs/architecture/ARCHITECTURE-20-revenuecat-entitlement-enforcement.md | Subscription enforcement design | Phase 9 |
| docs/architecture/ARCHITECTURE-10-open-decisions-v2.md | Architecture decision records | When a decision affects your task |
| docs/api/openapi/creatoros-public.openapi.yaml | Machine readable API contract | Backend and mobile daily |
| docs/api/auth/oauth-flows.md | OAuth sequence details | Phase 5 |
| docs/api/auth/token-vault.md | Vault schema and access rules | Phase 5 |
| docs/api/auth/reauthorization.md | Reauthorization UX contract | Phase 6 |
| docs/api/cross-cutting/errors.md | Error code catalog and format | All API work |
| docs/api/cross-cutting/idempotency.md | Idempotency key rules | Phases 3 and 4 |
| docs/api/cross-cutting/pagination.md | Cursor pagination rules | Phase 3 |
| docs/api/cross-cutting/rate-limits.md | Rate limit headers and behavior | Phases 5 and 6 |
| docs/api/cross-cutting/webhooks.md | Webhook design for Phase 2 | Reference only for MVP |
| docs/api/providers/google-drive.md | Drive integration spec | Phase 5 |
| docs/api/providers/google-docs.md | Docs integration spec | Phase 5 |
| docs/api/providers/google-calendar.md | Calendar integration spec | Phase 5 |
| docs/api/providers/notion.md | Notion integration spec | Phase 5 |
| docs/tdd/TDD-01-mobile-local-database-search.md | Local DB search implementation detail | Phases 2 and 3 |
| docs/tdd/TDD-02-offline-sync-local-operations.md | Offline sync implementation detail | Phase 3 |
| docs/tdd/TDD-03-public-api-bff.md | BFF implementation detail | Phases 3 and 4 |
| docs/tdd/TDD-04-connector-worker-durable-operations.md | Worker implementation detail | Phases 4 and 5 |
| docs/tdd/TDD-05-provider-adapter-framework.md | Adapter framework detail | Phase 5 |
| docs/tdd/TDD-06-webhook-ingestion-reconciliation.md | Webhook design Phase 2 reference | Deferred |
| docs/tdd/TDD-07-oauth-token-vault-connection-health.md | OAuth token vault detail | Phase 5 |
| docs/tdd/TDD-08-rate-limiting-scheduling-observability.md | Rate limits observability detail | Phases 5 and 6 |
| docs/uiux/information-architecture.md | Navigation structure | Phase 8 |
| docs/uiux/screen-inventory.md | Screen list with purpose | Phase 8 |
| docs/uiux/user-flows.md | Step by step user journeys | Phase 8 |
| docs/uiux/state-matrix.md | Global and component state treatments | Phase 8 |
| docs/uiux/components.md | Reusable component specs | Phase 8 |
| docs/uiux/design-tokens.md | Visual tokens | Phase 8 |
| docs/uiux/accessibility.md | Accessibility baseline | Phase 8 |
| docs/testing/test-strategy.md | Testing philosophy and pyramid | QA onboarding |
| docs/testing/unit-test-cases.md | Unit level expectations | Every PR |
| docs/testing/integration-test-cases.md | DB RLS outbox worker expectations | Phases 2 through 5 |
| docs/testing/e2e-test-cases.md | Journey level expectations | Phases 8 and 9 |
| docs/testing/ui-test-cases.md | Screen state expectations | Phase 8 |
| docs/testing/accessibility-test-cases.md | Accessibility audit expectations | Phase 8 |
| docs/testing/performance-test-cases.md | Performance budgets and scenarios | Phases 6 and 9 |
| docs/testing/provider-sandbox-tests.md | Real provider test scenarios | Phase 5 and weekly |
| docs/testing/release-gates.md | Stage promotion criteria | Every merge and RC |
| docs/validation/validation-execution-tracker.md | User validation status | Product decisions |
| external-dependency-register.md | External actions and owners | Weekly standup |
| docs/handoff-to-engineering.md | Role based reading guide | Day one |

---

## 6. Risks and Decision Points

### Provisional Technical Decisions

| Decision | Status | Blocking? |
|---|---|---|
| DEC-001 KMP shared core | Gated on spike execution | Blocks mobile persistence approach confirmation; spike resolves it |

### External Dependencies Needing Owner Assignment

See external-dependency-register.md for the full list. Critical items needing named owners:

| Dependency | Why It Matters |
|---|---|
| Google OAuth verification plus CASA assessment | Longest lead time; determines whether restricted Drive scopes are available at launch |
| Notion public integration review | Required for user facing Notion connector at launch |
| RevenueCat product configuration | Required before Phase 9 entitlement testing |

### Human Decisions Required Before Specific Phases

| Decision | Needed By | Consequence of Delay |
|---|---|---|
| Choose analytics platform Mixpanel Amplitude PostHog or other | Before Phase 8 instrumentation | Launch gate metrics cannot be instrumented. Traceability mapping defines events but not tool |
| Interim drive.file scope versus waiting for full CASA approval | By Week 8 per milestone plan | Determines whether Drive search ships at beta or is limited to Picker selected files |
| Team size confirmation against milestone plan | Immediately | Timeline assumes small team. Adjust phases if staffing differs |
| Assign named owners in dependency register | Immediately | Unowned dependencies stall without accountability |

### Risks That Could Force Phase Reordering

| Risk | Likelihood | Impact on Plan |
|---|---|---|
| Spike fails FTS5 or memory gates on low end devices | Medium | Requires persistence architecture revision before Phase 2; timeline shifts right |
| CASA takes longer than twelve weeks | High | Invoke interim scope option DEC-039 Option B so Drive search ships with Picker only at beta |
| Validation result is PIVOT at Week 4 | Unknown | Halt build past Phase 2 and reassess scope before investing in connectors |
| Provider API breaking change mid build | Low | Adapters isolate provider quirks. Fix contained within Phase 5 scope |
| Notion review delayed beyond Phase 5 | Medium | Test with internal integration. Ship Notion connector behind a flag until approved |

---

This document is derived exclusively from existing repository documentation. No technical facts have been invented. Items requiring human judgment are explicitly flagged above.
