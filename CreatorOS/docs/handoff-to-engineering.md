# Handoff to Engineering — CreatorOS v2 MVP

**Date:** 2026-08-23
**Audience:** Engineering team starting MVP implementation

---

## What Is Ready to Build

The documentation suite is complete and internally consistent. The following are fully specified and can be implemented immediately:

| Area | Ready? | Start From |
|---|---|---|
| OpenAPI 3.1 public API contract | ✅ | `docs/api/openapi/creatoros-public.openapi.yaml` — validate, generate clients, scaffold Fastify routes |
| Backend database schema | ✅ | `docs/architecture/ARCHITECTURE-18-database-erd-v2.md` — all 15 backend tables with DDL-level detail |
| Local SQLite schema + FTS5 | ✅* | `docs/tdd/TDD-01-mobile-local-database-search.md` — full DDL, triggers, search queries (*pending spike confirmation of KMP approach) |
| BFF implementation | ✅ | `docs/tdd/TDD-03-public-api-bff.md` — auth middleware, error mapping, idempotency, outbox pattern |
| Connector worker | ✅ | `docs/tdd/TDD-04-connector-worker-durable-operations.md` — job types, retry policy, claim pattern |
| Provider adapters | ✅ | `docs/tdd/TDD-05-provider-adapter-framework.md` + per-provider specs in `docs/api/providers/` |
| OAuth/token vault | ✅ | `docs/tdd/TDD-07-oauth-token-vault-connection-health.md` — refresh serialization, rotation, health states |
| Offline sync (mobile) | ✅ | `docs/tdd/TDD-02-offline-sync-local-operations.md` — outbox, cursor reconciliation, background scheduling |
| Rate limiting & observability | ✅ | `docs/tdd/TDD-08-rate-limiting-scheduling-observability.md` — metrics names, alert thresholds |
| RevenueCat entitlements | ✅ | `docs/architecture/ARCHITECTURE-20-revenuecat-entitlement-enforcement.md` — validation flow, cache design, enforcement points |
| Testing strategy & cases | ✅ | `docs/testing/` — unit through release-gate cases mapped to TDD invariants |
| Release process | ✅ | `docs/testing/release-gates.md` — stage promotion criteria, rollback triggers, feature-flag testing modes |

## What Must Be Executed Before or In Parallel With Development

These items cannot be resolved through documentation alone:

### Technical Spike (Gate — must pass before mobile persistence code)

- Execute per `mvp-milestone-plan.md` Phase 1 and `ARCHITECTURE-17-technical-spike-execution-tracker.md`
- Confirms or rejects DEC-001 (KMP shared core) based on real device measurements
- Validates FTS5 availability in SQLCipher builds on both platforms
- **If NO-GO:** revise persistence architecture before writing production database code

### Product Validation (Gate for go/no-go at Week 4)

- Run interviews and concierge prototype per `docs/validation/validation-execution-tracker.md`
- Runs in parallel with spike and core foundation phases
- **If NO-GO:** halt build. If PIVOT: reassess scope before continuing past Phase 2.

### Google OAuth Verification & CASA Assessment

- Submit Google OAuth app for verification with restricted Drive scopes
- Begin CASA annual security assessment
- Longest lead-time dependency: start immediately; may take weeks to months
- Interim option documented in DEC-039: launch beta with `drive.file` scope if CASA is pending
- See `external-dependency-register.md` for owner assignments needed

## Three Next Major Actions

| # | Action | Owner Role | Timeline | Blocking? |
|---|---|---|---|---|
| 1 | Execute technical spike per ARCHITECTURE-17 tracker | Mobile Architect | Weeks 1–2 | Yes — gates mobile persistence approach |
| 2 | Launch product validation (interviews + concierge) | Product Lead | Weeks 1–4 | Yes at Week 4 go/no-go gate |
| 3 | Submit Google OAuth verification + initiate CASA | Security Lead + Product Lead | Immediately (long lead time) | Blocks production launch with restricted scopes; not blocking development |

## Where to Find Documentation

| If you need... | Look in |
|---|---|
| Product vision, scope, success metrics | `docs/product/` |
| Functional requirements (what to build) | `docs/requirements/functional/` |
| Performance/security/reliability targets | `docs/requirements/non-functional/` |
| How requirements map to tests | `docs/requirements/traceability/` |
| System architecture and data model | `docs/architecture/` |
| API endpoints, schemas, provider integrations | `docs/api/` |
| Detailed technical designs per component | `docs/tdd/` |
| Test cases and release criteria | `docs/testing/` |
| User research instruments | `docs/validation/` |
| External dependencies needing action | `external-dependency-register.md` |

## Suggested Reading Order by Role

**Backend engineer:** PRD → ARCH-00 → ARCH-15 → ARCH-18 → TDD-03 → TDD-04 → TDD-07 → OpenAPI spec

**Mobile engineer:** PRD → FRS-01 → TDD-01 → TDD-02 → state-matrix (in original repo) → testing suite

**DevOps/platform:** ARCH-00 → ARCH-11 → NFR-01 §4 SLOs → external-dependency-register → release-gates

**QA:** test-strategy → all test-case files → traceability matrix → mvp-definition-of-done
