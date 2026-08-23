# Release Gates — CreatorOS v2

**Version:** 1.0
**Date:** 2026-08-23
**Status:** Ready for Implementation
**Related:** v2/testing/test-strategy.md, v2/api/openapi/creatoros-public.openapi.yaml, all TDDs

---

## 1. Purpose

Define mandatory gates for promoting builds through environments. No stage may be skipped.

## 2. Artifact Promotion Chain

Promote immutable artifacts; never rebuild per environment:

```text
commit SHA
  → contract artifact (OpenAPI spec hash)
  → BFF container image
  → worker container image
  → generated Swift/Kotlin client
  → signed iOS/Android build
```

Attach the same commit SHA, OpenAPI version/hash, migration version, and generated-client version to all test reports and deployment metadata.

## 3. Stage Gates

### Pull Request

| Gate | Tool | Blocking |
|---|---|---|
| Type/lint checks | Platform linters | Yes |
| OpenAPI lint + compatibility diff | Spectral / oasdiff | Yes: no unapproved breaking change |
| Generated client compile (Swift/Kotlin/TypeScript) | CI build step | Yes |
| Unit tests | Swift Testing / JUnit 5 / Vitest | Yes |
| Repository/DB integration tests | Testcontainers Postgres/Redis + encrypted SQLite | Yes |
| Focused Pact verification | Pact broker | Yes for changed interactions |
| Route-level OpenAPI response validation | Fastify inject + schema check | Yes |

### Merge to Main

| Gate | Detail |
|---|---|
| Full migration chain from every historical schema version | Fixture-driven migration suite |
| Full pgTAP RLS suite against real Postgres | All allow/deny policies pass |
| Expanded Schemathesis fuzz against OpenAPI | No 5xx from invalid inputs |
| Contract artifact published and versioned | Tagged with commit SHA |

### Ephemeral Integration Environment

BFF + worker + Postgres + Redis + provider stubs deployed together:

| Gate | Detail |
|---|---|
| E2E durable-operation suite passes | Receipt/idempotency invariants proven |
| Outbox relay publishes all events within SLA | No unpublished backlog after test window |
| Worker processes all queued jobs without duplicate side effects | Provider stub call counts match expected |

### Staging

Production-like configuration with test Supabase project and sandbox tenants:

| Gate | Detail |
|---|---|
| OAuth smoke: connect/disconnect/reconnect each provider | Real sandbox credentials |
| Webhook configuration validated if enabled | Signature verification passes on staging endpoint |
| Remote config loads and applies correctly | Feature flags resolve as expected |
| Performance smoke: launch + search latency within budget | Automated benchmark pass |

### Canary Release

Small controlled internal/QA cohort with feature flags enabled:

| Metric | Hold Period Threshold |
|---|---|
| BFF p95 latency | Within NFR-01-v2 budget |
| 4xx error rate | Below 2% excluding validation errors |
| 5xx error rate | Below 0.1% |
| Duplicate operation detected | Zero tolerance: immediate rollback |
| Cross-tenant data leak signal | Zero tolerance: immediate halt |
| Token/credential leak in logs | Zero tolerance: immediate halt |
| Queue lag p95 | Under 60 seconds sustained |
| Receipt state distribution anomalous | Investigate before expanding |

Compare flagged vs control cohort metrics before expanding rollout.

### Broad Release

Phased mobile rollout (10% → 50% → 100%) with backend already at full capacity.

Rollback triggers:

- Crash-free session rate drops below baseline by more than 0.5%
- Any security or data-integrity alert fires
- Provider API breaking change detected via canary probes

### Post-Release Monitoring

- Synthetic probes hitting critical API paths every 5 minutes
- Contract drift detection: scheduled Schemathesis run against production
- Provider change monitoring: watch Google/Notion changelogs and deprecation notices

## 4. Feature Flag Testing Requirements

Every behavior-gating flag must be tested in four modes:

1. **Off:** legacy behavior unchanged
2. **On:** new behavior works for eligible tenant/version
3. **Mid-operation flip:** accepted operations continue under persisted policy; no semantic change halfway
4. **Rollback:** disabling flag does not orphan queued operations, receipts, or local state

## 5. Change Log

| Version | Date | Summary |
|---|---|---|
| 1.0 | 2026-08-23 | Created release gates defining promotion stages from PR through post-release monitoring. |
