# Non-Functional Requirements — NFR-01 v2: Performance

**Product:** CreatorOS v2
**Version:** 2.0
**Date:** 2026-08-23
**Reference:** v1 NFR-01-performance.md for local performance.

## 1. Purpose

Defines v2 connected-search performance targets.

## 2. Requirements

| ID | Requirement | Priority | Description |
|---|---|---|---|
| PER-01 | Connected search p50 | Must | External search results from connected sources shall return first page within 1.0 s p50, measured at the mobile UI after local results render. |
| PER-02 | Connected search p95 | Must | External search results shall return first page within 2.0 s p95. |
| PER-03 | Local-first rendering | Must | Local indexed results shall appear before external results and shall never be blocked by external provider latency. |
| PER-04 | Stale-result handling | Must | If a provider does not respond within 3.0 s, the system shall show partial results with a provider timeout indicator, not fail the entire search. |
| PER-05 | Search alert threshold | Must | Backend alerting shall trigger when connected-search p95 exceeds 2.0 s across a 15-minute window. |

## 3. Normative Authority

This document is the single normative source for connected-search latency. ARCH-00-v2 §7 and ARCH-15 §9 shall reference these values.

## 4. Availability and SLOs

These are internal engineering SLOs for the MVP. They are not user-facing contractual SLAs.

| ID | SLO | Target |
|---|---|---|
| SLO-01 | Public BFF API monthly uptime | ≥99.5% (≈3.6 hours downtime/month) |
| SLO-02 | BFF request latency p95, non-provider-bound endpoints (auth, CRUD records, receipts read, settings) | ≤500 ms |
| SLO-03 | Connector worker job completion p95 for interactive handoffs, measured from API acceptance to terminal receipt | ≤5 minutes |
| SLO-04 | Background sync freshness: at least 99% of healthy connections have a successful sync within 24 hours or are explicitly marked stale in the UI | ≥99% within 24h |

### Error Budget Policy

- Monthly error budget = 1 − 99.5% = 0.5% of requests may fail (5xx + timeout).
- If the monthly error budget is fully consumed before month end, a **stabilization sprint** is triggered: feature releases pause, on-call prioritizes reliability work until budget recovers above 50%.
- Duplicate-operation, cross-tenant-leak, or credential-leak signals are zero-tolerance events that trigger immediate rollback regardless of remaining budget.

## 5. Alert Threshold Alignment

Alert thresholds defined in TDD-08 §10 and ARCHITECTURE-15 §9 must be consistent with these SLOs:

| Existing Alert | Aligned SLO |
|---|---|
| Search latency p95 >2.0s | Supports PER-02; alert fires before user-visible degradation |
| Provider failure rate >10% for 15 min | Feeds into overall availability calculation |
| Outbox oldest unpublished >5 min | Supports SLO-03 interactive handoff target |
| Queue depth >1000 | Early-warning signal protecting SLO-03/SLO-04 |

## Change Log

| Version | Date | Summary |
|---|---|---|
| 2.0 | 2026-08-23 | Initial v2 performance requirements. |
| 2.1 | 2026-08-23 | Added Availability and SLOs section with uptime, latency, sync freshness targets and error-budget policy. |
