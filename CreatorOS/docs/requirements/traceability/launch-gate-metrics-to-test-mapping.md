# Traceability Matrix — CreatorOS v2

**Version:** 1.2  
**Date:** 2026-08-23  
**Purpose:** Map validated pain points and v2 needs to specific v2 requirement IDs.

| Pain / Need | Key v2 Requirement IDs | v2 NFR | v2 ARCH |
|---|---|---|---|
| Fragmented workflow across tools | CCR-01, CCR-03, CTS-20, CNF-01 | NFR-02-v2, NFR-08-v2 | ARCH-00-v2, ARCH-02-v2 |
| No unified source-of-truth record | CCR-01, CCR-02, CCR-03, CCR-04 | NFR-09-v2 | ARCH-03-v2 |
| Lost brief/script/assets | CTS-01, CTS-10, CTS-20, CTS-22 | NFR-01-v2, NFR-12-v2 | ARCH-07-v2 |
| Manual handoffs and unclear status | HAR-01, HAR-10, HAR-11, HAR-20 | NFR-09-v2 | ARCH-15-v2 |
| Broken or stale tool connections | CNF-30, CNF-31, CNF-33, CNF-34 | NFR-08-v2 | ARCH-13-v2, ARCH-15-v2 |
| No actionable next step | CCR-20, CCR-21, CCR-22, CCR-23 | NFR-01-v2 | ARCH-02-v2 |
| Pricing trust and subscription fatigue | FRS-14-v2 SUB-01, SUB-05, SUB-06, SUB-16 | NFR-12-v2 | ARCH-10-v2 |
| Cross-tool search needed | CTS-01, CTS-10, CTS-20, CTS-40 | NFR-01-v2, NFR-12-v2 | ARCH-03-v2, ARCH-07-v2 |
| Mobile-first requirement | CCR-01, CCR-50, HAR-40 | NFR-02-v2 | ARCH-00-v2 |
| Professional UGC deliverable tracking | CCR-01, CCR-30, HAR-20, HAR-21 | NFR-09-v2 | ARCH-15-v2 |

**Note:** This matrix now provides requirement-level traceability and launch-gate metric-to-test mapping below.

---

## Launch Gate Metrics to Test Mapping

This section maps each PM-defined launch success gate to the analytics instrumentation source and the test that verifies correct measurement.

| Launch Gate Metric | Definition / Instrumentation Source | Responsible Test | Verification Method |
|---|---|---|---|
| ≥50% of activated users connect 2+ sources | Analytics event `connection_activated` fired on successful OAuth completion per provider; activated = completed sign-up + first session. Aggregate: distinct workspaces with ≥2 active connections ÷ total activated workspaces in cohort window. | `e2e-test-cases.md` E2E-10 (Connect Google Drive), E2E-13 (Connect Notion); provider-sandbox-tests PS-SBX-01 | CI asserts analytics event emitted with correct properties after sandbox OAuth; dashboard query validated against staging seed data |
| ≥40% of activated users create a real campaign record | Analytics event `connected_record_created` with property `has_source_links`; real campaign = record with ≥1 external source link attached. Denominator: activated users from same cohort. | `e2e-test-cases.md` E2E-02 (create offline → sync), E2E-22 (attach search result to record) | Integration test asserts event payload contains `has_source_links=true` only when a link exists; E2E verifies full flow end-to-end |
| ≥30% of activated users return unprompted for next production cycle | Retention cohort analysis: user opens app (any foreground session) during week N+1 after initial campaign without push notification trigger. Source: `app_foreground` event joined to `connected_record_created` cohort. | `e2e-test-cases.md` E2E-02 validates durable state across restarts that enables genuine return visits; no direct automation — measured via product analytics dashboard post-launch | Manual verification of dashboard query against test tenant data before RC |
| ≥5% of free users convert to paid at $12–15/month | RevenueCat webhook `INITIAL_PURCHASE` or `PRODUCT_CHANGE` to Solo/Pro entitlement, correlated with workspace previously at Free tier. Source: `entitlement_cache.plan` transitions in backend DB + RevenueCat dashboard. | Unit tests for `ARCHITECTURE-20` enforcement points (plan-gate rejection at limits); integration test INT-OBX for webhook-driven cache invalidation | Sandbox purchase through StoreKit/Play Billing in provider-sandbox-tests; assert webhook updates cached plan and BFF allows gated action afterward |
| Search time to locate specific brief/asset ≤30 seconds | Measured as time from search field focus to tap on target result (user-perceived task completion), captured via `search_completed` event with duration_ms. Baseline established in concierge validation (8 min → target 30 sec). | `performance-test-cases.md` PERF-S-01 through PERF-S-06 (local latency budgets); PERF-CS-01/02 (connected search p50/p95) | Automated benchmarks enforce component latencies summing well under 30s budget; E2E-04 validates search flow completes while offline |
| Connection health issue detected and resolved ≥1 per active user/month | Composite: `connection_health_degraded` event fired on transition to stale/reauth/error + `connection_reauthorized` event on recovery within same month. Both events include connection_id for deduplication. | `provider-sandbox-tests.md` PS-OA-05/08/PS-SBX-05/06 (revoke → reauth cycle); `e2e-test-cases.md` E2E-11 (token expires → reconnect clears stale) | Sandbox test triggers real token revocation then reauthorization, asserting both analytics events fire in sequence; TDD-07 unit tests verify health state transitions emit correctly |

**Instrumentation note:** All analytics events must be privacy-safe per SPC-07: no user content, no external object titles, no tokens. Events carry only IDs, counts, durations, and enum states.
