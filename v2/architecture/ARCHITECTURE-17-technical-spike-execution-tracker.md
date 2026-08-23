# Technical Spike Execution Tracker — KMP + SQLCipher + FTS5

**Product:** CreatorOS v2  
**Version:** 1.0  
**Date:** 2026-08-23  
**Status:** Not Started  
**Replaces:** Any prior simulated spike results (retracted)

---

## 1. Purpose

This tracker defines the real technical spike required before confirming DEC-001 and starting MVP development.

The spike validates:

1. FTS5 is available and functional in the selected SQLCipher builds on iOS and Android.
2. SQLCipher-encrypted SQLite with FTS5 meets local search and startup performance requirements at 100,000 records.
3. The local database architecture (GRDB + SQLCipher + FTS5 on iOS, Room + SQLCipher + FTS5 on Android) is reliable and measurable.
4. App size, battery, and memory impact are acceptable.

All results must be recorded with evidence: device, OS version, build hash, database settings, timings, and raw percentiles. No simulated data.

---

## 2. Research-Based Assumptions and Evidence

The spike is planned using the latest research, not prior simulated results.

| Assumption | Evidence Basis | Confidence |
|---|---|---|
| FTS5 is enabled in current GRDB SQLCipher integration from GRDB 6.7.0 onward | Official CocoaPods/GRDB docs | High |
| Maintained `sqlcipher-android` supports FTS5; deprecated `android-database-sqlcipher` should not be used | Zetetic docs and GitHub | High |
| KMP shared database driver is not low-risk; keep database native | SQLDelight discussions, Touchlab examples | High |
| Realistic warm FTS p95 on mid-range with SQLCipher + FTS5 at 100k records is below 100 ms if queries are bounded and FTS-first | Planning range from multiple adjacent benchmarks | Medium-Low |
| Low-end 4 GB device may have warm FTS p95 up to 200 ms and cold search-ready p95 up to 3.0 s | Planning range, no direct benchmark | Low |
| SQLCipher overhead for indexed queries is modest, but scans are expensive | Nokia 6.1 benchmark | Medium |
| App size addition for selected stack is 1.5–4.5 MB Android, 2.5–6.5 MB iOS without KMP DB bridge | Multiple SDK size reports | Medium |

These are hypotheses to be verified, not confirmed performance data.

---

## 3. Device Matrix

| Tier | Android Target | iOS Target | Why |
|---|---|---|---|
| Low-end | 4 GB RAM Snapdragon 6xx/Helio G-class, Android 12+ | Oldest supported iPhone with 3–4 GB RAM | Expose memory/storage/CPU constraints |
| Mid-range | 6–8 GB RAM Snapdragon 7-series/Dimensity 700–800 class | Mainstream iPhone 2–4 generations back | Representative core user experience |
| High-end | 8–12 GB RAM Snapdragon 8-series/Dimensity flagship | Current base iPhone | Scaling and consistency control |
| Control | Pixel A-series current | Current base iPhone | Predictable OS and CI reproducibility |

---

## 4. Synthetic Corpus

### 4.1 Dataset Requirements

- 100,000 total metadata records.
- Provider mix: Drive 45%, Docs 20%, Calendar 15%, Notion 20%.
- Object types: files, folders, documents, events, pages/databases.
- Title length: median 30–60 characters, long tail to 200+.
- Tokens: creator vocabulary — campaign, brief, script, shot list, invoice, brand, deliverable, revision, publish date.
- Filters: provider, type, status, date range, connection state, tags.
- 10–20% repetitive/near-duplicate titles.
- Unicode: emoji, accented Latin, CJK, RTL, punctuation.
- Soft-deleted/stale records for filter selectivity.

### 4.2 Generation Rules

- Deterministic seed.
- No actual user content, names, URLs, or tokens.
- Use public word lists or aggregated distributions.
- Insert in batches of 500–2,000 rows per transaction.

---

## 5. Measurement Protocol

### 5.1 Metrics and Tools

| Metric | iOS Tools | Android Tools | Notes |
|---|---|---|---|
| Search latency p50/p95/p99 | `os_signpost`, XCTest performance tests, Instruments Time Profiler | Jetpack Microbenchmark, Macrobenchmark `TraceSectionMetric`, Perfetto | Measure SQL-only and input-to-render separately |
| Cold/warm startup | XCTest `XCTApplicationLaunchMetric`, Instruments App Launch | Macrobenchmark `StartupTimingMetric` | Record TTID and TTFD |
| Save latency | XCTest with signposts, Instruments File Activity | Jetpack Microbenchmark, Perfetto | Compare `synchronous=NORMAL` and `FULL` |
| Battery | Instruments Energy Diagnostics, device energy logging, MetricKit | Android Studio Power Profiler, Batterystats/Battery Historian | Physical devices, controlled conditions |
| Memory | Instruments Allocations/Leaks/Memory Graph | Android Studio Memory Profiler, heap dumps, `dumpsys meminfo` | Track Java/native SQLite allocations |
| DB size | Filesystem measurement, `dbstat`, `PRAGMA` | Device Explorer/ADB, Database Inspector, SQL queries | Main DB, WAL, SHM, FTS shadow tables |

### 5.2 Test Scenarios

1. **Warm FTS query, 1 keyword + filters**
2. **Warm FTS query, 2–3 keywords + filters**
3. **Cold FTS query after database reopen**
4. **Cold app launch to interactive shell**
5. **Cold app launch to search-ready**
6. **Autosave transaction (NORMAL and FULL)**
7. **Sustained 30-minute local search/autosave**
8. **Database integrity after interrupted workload**

---

## 6. Acceptance Gates

| Metric | Low-end | Mid-range | High-end |
|---|---:|---:|---:|
| Warm 1–3 term FTS search p95 | ≤200 ms | ≤100 ms | ≤75 ms |
| Input-to-render search p95 | ≤300 ms | ≤180 ms | ≤120 ms |
| Cold startup to initial UI p95 | ≤2.0 s | ≤1.2 s | ≤0.9 s |
| Cold startup to search-ready p95 | ≤3.0 s | ≤1.8 s | ≤1.4 s |
| Autosave p95, WAL + NORMAL | ≤75 ms | ≤40 ms | ≤30 ms |
| Sustained-session memory growth | <20% | <15% | <10% |
| Database integrity after interrupted workload | 100% | 100% | 100% |

Battery and memory numeric claims are not part of the gate until device-lab measurements are complete.

---

## 7. Setup Checklist

- [ ] Pin exact SQLCipher versions for iOS and Android.
- [ ] Pin GRDB.swift/SQLCipher for iOS; confirm FTS5 flag.
- [ ] Use maintained `sqlcipher-android` for Android; configure Room SQLCipher open helper.
- [ ] Add FTS5 runtime test: create virtual table, insert, MATCH, verify row returned.
- [ ] Add `sqlite_compileoption_used('ENABLE_FTS5')` and `PRAGMA cipher_version` diagnostics.
- [ ] Enable WAL mode; test with concurrent search/write.
- [ ] Generate deterministic 100k-record corpus.
- [ ] Build release-like binaries with optimizations and no debugger.
- [ ] Prepare device matrix and log OS/build info.
- [ ] Configure benchmark scripts for p50/p95/p99 collection.

---

## 8. Execution Steps

1. Run FTS5 capability test on each platform.
2. Build corpus and measure insertion/index build time.
3. Execute warm/cold FTS search benchmarks; calculate percentiles.
4. Execute startup benchmarks; measure TTID and TTFD.
5. Execute autosave benchmarks with both synchronous modes.
6. Run memory profiling under load.
7. Run 30-minute battery tests with controls.
8. Measure app size after adding all selected SDKs.
9. Run database integrity check after simulated crash.
10. Record all results in `docs/architecture/spike-results.md` with evidence.

---

## 9. Go/No-Go Decision

- **GO** if all acceptance gates pass on mid and high tiers, and low tier does not show memory/size failures.
- **GO with conditions** if low tier exceeds search latency but mid/high pass; add targeted optimization.
- **NO-GO** if FTS5 unavailable, database integrity fails, or mid-tier search p95 exceeds 300 ms.

---

## 10. Risks

- SQLCipher overhead for unindexed scans can be severe. Use FTS5 and B-tree filters only.
- WAL mode under SQLCipher needs close/reopen testing.
- Kotlin/Native runtime may increase iOS size if KMP is retained beyond thin domain logic.
- Community SQLCipher KMP drivers are not official; do not use for MVP.

---

## 11. Change Log

| Version | Date | Summary |
|---|---|---|
| 1.0 | 2026-08-23 | Created execution tracker based on real research; retracted simulated results. |
