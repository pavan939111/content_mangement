# MVP Milestone Plan — CreatorOS v2

**Version:** 1.0
**Date:** 2026-08-23
**Status:** Planning — assumes small team (2–3 engineers, 1 designer, part-time PM)
**Related:** mvp-definition-of-done.md, ARCHITECTURE-17-technical-spike-execution-tracker.md

---

## 1. Overview

The MVP is delivered in six phases over approximately 14 weeks. The technical spike is a **gate, not a skippable phase**: if the spike fails its acceptance criteria, the build plan must be revised before proceeding.

Validation (user interviews and concierge prototype) runs as a **parallel track** during Weeks 1–4. It does not block the spike or core schema work but gates the go/no-go decision at Week 4.

## 2. Phase Timeline

```text
Wk 1──2──3──4──5──6──7──8──9──10──11──12──13──14
│ SPIKE │
│ VALIDATION (parallel)    │
        │ CORE FOUNDATION  │
                │ CONNECTORS          │
                                │ INTEGRATION   │
                                            │ POLISH    │
                                                    │ RC/LAUNCH │
```

## 3. Phase Details

### Phase 1: Technical Spike (Weeks 1–2)

| Item | Detail |
|---|---|
| **Primary deliverables** | Spike results with real device measurements; DEC-001 confirmed or revised architecture decision |
| **Entry criteria** | Device matrix reserved; corpus generator ready; GRDB/SQLCipher and sqlcipher-android versions pinned |
| **Exit criteria** | All acceptance gates from ARCHITECTURE-17 met on mid-range tier; low-tier shows no memory/size failures; DEC-001 status updated |
| **Dependencies** | None (first activity) |
| **Gate rule** | If NO-GO: stop, revise persistence approach, re-spike. Do not proceed to Phase 2. |

### Parallel Track: Validation (Weeks 1–4)

| Item | Detail |
|---|---|
| **Primary deliverables** | 15–18 interviews completed; 10–12 concierge completions; ≥5 paid pilot commitments; scorecard calculated |
| **Entry criteria** | Recruitment outreach started Day 1; payment links ready |
| **Exit criteria** | Go/No-Go/Pivot decision per validation-scorecard thresholds by end of Week 4 |
| **Gate rule** | If NO-GO: halt build. If PIVOT: reassess scope before continuing past Phase 2. |

### Phase 2: Core Foundation (Weeks 2–4)

| Item | Detail |
|---|---|
| **Primary deliverables** | Local SQLite schema + migrations + FTS5 triggers implemented; Supabase project set up; BFF skeleton with Fastify + OpenAPI generation; auth middleware (Supabase JWT); `connected_record` CRUD endpoints live in dev |
| **Entry criteria** | Spike passed (DEC-001 confirmed); OpenAPI spec frozen at v1.1 |
| **Exit criteria** | Unit tests pass for repository layer; integration tests pass for SQLCipher open/close/migrate; pgTAP RLS suite green; CI pipeline runs all PR checks |
| **Dependencies** | Supabase production project provisioned (see external-dependency-register.md) |

### Phase 3: Connector Workers & Provider Adapters (Weeks 4–8)

| Item | Detail |
|---|---|
| **Primary deliverables** | Token vault with KMS envelope encryption; OAuth flows (connect/reauthorize/disconnect) for all four providers; provider adapters for Drive, Docs, Calendar, Notion; BullMQ queues + outbox relay + retry worker; normalized index populated via delta sync |
| **Entry criteria** | Core foundation complete (Phase 2 exit); Google OAuth client configured; Notion integration approved |
| **Exit criteria** | Provider sandbox tests pass weekly; idempotent job processing proven under duplicate delivery; concurrent refresh serialized per connection; webhook signature verification tested against real providers |
| **Dependencies** | RevenueCat account configured; managed Redis provisioned; Cloud KMS available |
| **Risk note** | This is the longest phase. If CASA assessment is not yet approved, use interim `drive.file` scope for development testing and plan restricted-scope activation post-launch. |

### Phase 4: Search, Health, Receipts & Offline Sync Integration (Weeks 8–10)

| Item | Detail |
|---|---|
| **Primary deliverables** | Federated search (local FTS + backend normalized index); connection health center UI; action receipt recording and display; local outbox sync coordinator; offline capture → queued → synced flow complete |
| **Entry criteria** | Connector adapters stable enough to return real metadata |
| **Exit criteria** | E2E critical journeys E2E-01 through E2E-07 pass; search coverage states match state-matrix; receipt immutability verified; offline restart preserves operations |
| **Dependencies** | Phases 2 and 3 complete |

### Phase 5: E2E Testing, Polish & Accessibility (Weeks 10–12)

| Item | Detail |
|---|---|
| **Primary deliverables** | Full nightly test suite operational; accessibility audits passing; performance benchmarks within NFR-01-v2 budgets on target devices; UI polish across all screens; localization strings extracted to resources; dark mode/RTL verified |
| **Entry criteria** | All functional features code-complete |
| **Exit criteria** | Zero P0 bugs; zero P1 bugs without documented workaround; accessibility checklist complete; performance regression suite passes |
| **Dependencies** | Phase 4 complete; design QA sign-off received |

### Phase 6: Release Candidate & Launch Prep (Weeks 12–14)

| Item | Detail |
|---|---|
| **Primary deliverables** | RC build tagged; canary cohort deployed; App Store / Play Store submissions prepared; release notes drafted; monitoring dashboards verified; runbooks finalized |
| **Entry criteria** | MVP Definition of Done checklist items all checked or explicitly risk-accepted |
| **Exit criteria** | Canary metrics within thresholds for hold period; store submissions uploaded; rollback plan reviewed by engineering lead |
| **Dependencies** | CASA approved OR interim scope accepted; developer accounts active |

## 4. Critical Path Dependencies

```text
Spike ──→ Core Foundation ──→ Connectors ──→ Integration ──→ Polish ──→ RC
                                    ↑                              ↑
                              Supabase/KMS/Redis           CASA or interim scope
                              provisioned                  approved
```

## 5. Change Log

| Version | Date | Summary |
|---|---|---|
| 1.0 | 2026-08-23 | Created MVP milestone plan with six phases over 14 weeks, parallel validation track, and explicit gate rules. |
