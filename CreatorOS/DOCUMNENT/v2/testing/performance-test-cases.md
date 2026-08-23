# Performance Test Cases — CreatorOS v2

**Version:** 1.0
**Date:** 2026-08-23
**Status:** Ready for Implementation
**Related:** NFR-01-performance-v2, TDD-01, ARCHITECTURE-17-technical-spike-execution-tracker
**CI Frequency:** Nightly (benchmark suite); release candidate (full device matrix)

---

## 1. Purpose

Measure user-perceived performance paths against NFR-01-v2 budgets and spike-tracker acceptance gates.

## 2. Tools

| Platform | Tools |
|---|---|
| iOS | XCTest metrics, Instruments Time Profiler, MetricKit |
| Android | Jetpack Microbenchmark, Macrobenchmark, Perfetto |

## 3. Performance Scenarios

### 3.1 Launch & Startup

| ID | Scenario | Dataset | Metric | Budget |
|---|---|---|---|---|
| PERF-L-01 | Cold launch to usable local workspace | Encrypted DB 10k records no network | Time to first meaningful content | ≤2.0s p95 low-end |
| PERF-L-02 | Cold launch with pending outbox | 100 queued operations | DB decrypt + outbox recovery time | Within launch budget |
| PERF-L-03 | Warm relaunch with cached state | 1k records | Resume time | ≤0.5s |

### 3.2 Local Search

| ID | Scenario | Dataset | Metric | Budget |
|---|---|---|---|---|
| PERF-S-01 | Warm FTS query 1 keyword + filters | 100k corpus | Query p50 | ≤100ms mid-range |
| PERF-S-02 | Warm FTS query 3 keywords + filters | Same | Query p95 | ≤200ms low-end |
| PERF-S-03 | Cold FTS query after database reopen | Same | First-query after unlock | Within search-ready budget |
| PERF-S-04 | Rapid typing with debounce/cancellation | Simulated keystrokes | Stale query cancellation + dropped frames | No frames >16ms on mid-range |
| PERF-S-05 | Unicode/diacritic/phrase/prefix/no-result queries separately | Mixed corpus | Per-category latency | All within general budget |
| PERF-S-06 | Search during concurrent sync writes | Active outbox processing | Latency under contention | No blocking >300ms |

### 3.3 Connected Search

| ID | Scenario | Metric | Budget |
|---|---|---|---|
| PERF-CS-01 | External search first page from connected sources | Mobile UI latency p50 | ≤1.0s per NFR-01-v2 PER-01 |
| PERF-CS-02 | External search first page p95 | Mobile UI latency | ≤2.0s per NFR-01-v2 PER-02 |
| PERF-CS-03 | Local results render before external results | Ordering verified | Local never blocked by external provider latency (PER-03) |
| PERF-CS-04 | Provider timeout at 3s triggers partial results | Timeout indicator visible; not full failure (PER-04) |

### 3.4 Scroll & Rendering

| ID | Scenario | Dataset | Metric | Budget |
|---|---|---|---|---|
| PERF-R-01 | Dense feed scroll: long titles badges metadata images | 500 items | Janky frame percentage | <1% on mid-range |
| PERF-R-02 | Record detail with very long notes | 100k character content | Time to first content + edit responsiveness | No perceived lag |
| PERF-R-03 | Receipt list scroll with 200 entries | Full history | Smoothness + memory peak | No OOM; cell recycling works |

### 3.5 Offline & Sync

| ID | Scenario | Dataset | Metric | Budget |
|---|---|---|---|---|
| PERF-O-01 | Offline edit burst: 100 rapid edits disconnected | In-memory queue | Per-edit UI response + transaction latency | Each save <50ms perceived |
| PERF-O-02 | Reconnect sync burst: 100–1000 queued operations replayed | Outbox upload | UI responsiveness during upload | No ANR/freeze; progress indicated |
| PERF-O-03 | Migration or FTS reindex on realistic corpus | 50k records upgrade | Startup impact + memory + progress reporting | Completes without OOM; progress visible |

### 3.6 Memory & Resource

| ID | Scenario | Duration/Scope | Metric | Budget |
|---|---|---|---|---|
| PERF-M-01 | Sustained 30-min search/autosave session | 30 minutes continuous | Memory growth vs baseline | <15% growth mid-range |
| PERF-M-02 | Database size after heavy indexing | Post-index snapshot | Main DB + WAL + SHM + FTS shadow tables | Documented baseline for regression tracking |
| PERF-M-03 | App binary size impact of selected SDKs | Release build | Platform-specific delta | Within spike estimates: 1.5–4.5MB Android / 2.5–6.5MB iOS |

## 4. Regression Gating Policy

- Establish baselines on reference hardware (mid-range device tier) before gating.
- Compare nightly benchmark results to baseline; flag regressions exceeding 10% for investigation.
- Block release candidate if cold-launch or search-latency budgets from NFR-01-v2 are exceeded.
- Do not copy generic industry numbers; use CreatorOS-specific budgets defined in this document and the spike tracker.

## 5. Change Log

| Version | Date | Summary |
|---|---|---|
| 1.0 | 2026-08-23 | Created performance test cases covering launch, local/connected search, rendering, offline sync bursts, and memory/resource budgets. |
