# CreatorOS

CreatorOS is a mobile-native connected content workspace for professional UGC creators. It links the brief, script, source files, design, edit handoff, and delivery for every brand deliverable across Google Drive, Google Docs, Google Calendar, and Notion — so creators always know what's current, what's missing, and what happens next.

## Architecture at a Glance

| Layer | Technology |
|---|---|
| iOS | SwiftUI + GRDB + SQLCipher + FTS5 |
| Android | Jetpack Compose + Room + SQLCipher + FTS5 |
| Public API (BFF) | Node.js/TypeScript + Fastify + OpenAPI 3.1 |
| Connector Worker | Node.js/TypeScript + BullMQ + Redis |
| Auth & Database | Supabase (Auth + Postgres/RLS) |
| Search Index | PostgreSQL (tsvector + pg_trgm) |
| Subscriptions | RevenueCat |
| Observability | Sentry + MetricKit / Android Vitals |
| Token Security | Cloud KMS envelope encryption |

## Documentation

| Section | Path | Contents |
|---|---|---|
| **Product** | `docs/product/` | Vision, PRD, scope, definition of done, milestone plan |
| **Functional Requirements** | `docs/requirements/functional/` | FRS-01, FRS-03, FRS-06, FRS-07, FRS-09, FRS-14 |
| **Non-Functional Requirements** | `docs/requirements/non-functional/` | Performance/SLOs, security, offline sync, reliability, localization, storage, accessibility |
| **Traceability** | `docs/requirements/traceability/` | Requirement matrix, launch-gate metric mapping |
| **UI/UX** | `docs/uiux/` | Design principles, information architecture, screen inventory, user flows, state matrix, components, design tokens |
| **Architecture** | `docs/architecture/` | System overview, data layer, connector service, ERD, RevenueCat design |
| **API Specification** | `docs/api/` | OpenAPI 3.1 spec, auth flows, endpoint docs, cross-cutting rules, provider integrations |
| **Technical Design Docs** | `docs/tdd/` | TDD-01 through TDD-08 covering mobile DB through observability |
| **Testing** | `docs/testing/` | Test strategy, unit through release-gate test cases |
| **Validation** | `docs/validation/` | Interview scripts, concierge prototype plan, scorecard |
| **V1 Archive** | `docs/archive/v1/` | Original local-first workspace documentation (superseded, reference only) |

## Repository Structure

```text
CreatorOS/
├── docs/                    # All product/design/engineering documentation
│   ├── product/             # Vision, PRD, scope, DoD, milestones
│   ├── requirements/        # FRS + NFR + traceability
│   ├── uiux/                # Design specs and user flows
│   ├── architecture/        # Technical architecture documents
│   ├── api/                 # OpenAPI spec + endpoint/provider docs
│   ├── tdd/                 # Technical design documents
│   ├── testing/             # Test strategy and test cases
│   ├── validation/          # User validation instruments
│   └── archive/v1/          # Superseded v1 documentation (reference only)
├── apps/
│   ├── ios/                 # iOS application (SwiftUI)
│   ├── android/             # Android application (Jetpack Compose)
│   ├── api-bff/             # Public API BFF (Fastify)
│   ├── connector-service/   # Provider adapters + token vault
│   ├── worker/              # BullMQ job processing
│   └── webhook-ingress/     # Provider webhook receivers
├── packages/
│   ├── contracts/           # OpenAPI types, shared schemas
│   ├── domain/              # KMP shared domain logic
│   ├── database/            # Migration files, schema definitions
│   └── observability/       # Logging, metrics, tracing utilities
├── supabase/
│   ├── migrations/          # Postgres migration files
│   └── tests/               # pgTAP RLS test suite
├── infra/                   # Infrastructure-as-code definitions
├── scripts/                 # Build/deploy/utility scripts
└── .github/workflows/       # CI pipeline definitions
```

## Implementation Status

| Item | Status |
|---|---|
| Documentation suite | ✅ Complete — build-ready |
| Technical spike (KMP + SQLCipher + FTS5) | ❌ Not executed — see `mvp-milestone-plan.md` Phase 1 |
| Product validation (interviews/concierge) | ❌ Not started — see `docs/validation/validation-execution-tracker.md` |
| Google OAuth verification / CASA | ❌ Not submitted — see `external-dependency-register.md` |
| Code implementation | ❌ Not started — scaffolding only |

## Getting Started (For Engineers)

1. Read `docs/handoff-to-engineering.md`
2. Review `docs/product/mvp-milestone-plan.md` for phase ordering
3. Read the TDDs relevant to your area before writing code
4. Check `external-dependency-register.md` for items you may need to unblock
