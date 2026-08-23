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