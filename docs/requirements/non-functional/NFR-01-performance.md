# Non-Functional Requirements — NFR-01: Performance

**Product:** CreatorOS  
**Version:** 1.0  
**Status:** Draft for Review  
**Related Module:** All functional modules (Search, Capture, Asset Library, Calendar, Publishing Handoff)  

---

## 1. Purpose

This document defines measurable performance requirements for CreatorOS. The app is a **local-first, mobile-first content workspace** for solo short-form creators. It must feel instant in daily use—especially when searching, capturing ideas, browsing media, and opening content records.

The performance targets are based on:
- Official Apple and Android performance guidelines
- SQLite FTS5 benchmarks and local search case studies
- Mobile media indexing/throttling constraints
- User-perceived responsiveness thresholds

All thresholds assume a **mainstream reference device** (2–4 year mid-tier phone) and a **library of up to 100,000 indexed metadata records**, unless otherwise stated.

---

## 2. Scope

Performance covers:

- Application startup (cold, warm, hot)
- Local full-text search and structured filtering
- Media thumbnail and proxy generation
- UI responsiveness and scrolling
- Database and indexing behavior
- Performance under background indexing and sync

**Out of scope:** cloud API performance, server-side performance, network-dependent operations (covered in NFR-08 and NFR-02).

---

## 3. Performance Categories and Requirements

### 3.1 Application Startup

| Startup Type | Target (Mainstream Device) | Low-End Device Budget |
|---|---|---|
| Cold startup to usable home screen | ≤1.0 s median, ≤1.8 s p95 | ≤2.5 s p95 |
| Warm startup | ≤300 ms median, ≤700 ms p95 | ≤1.0 s p95 |
| Hot resume | ≤150 ms median | ≤300 ms p95 |

**Requirements:**

- The first usable frame must render cached navigation and home content immediately.
- Cold startup shall not block on SQLite full integrity check. A lightweight quick_check may run after first interactive frame if it completes in <100 ms. If longer, it runs in background with results applied on next app open.
- Startup must not block on: full sync, OAuth token refresh, external drive scan, photo library enumeration, thumbnail/proxy generation, document extraction, or large FTS index rebuild.
- These tasks must run **after** first interactive frame, lazily and asynchronously.
- The app shall remain responsive during all background startup work.

**Rationale:**
Android ideal cold start is <500 ms; Android excessive threshold is 5 s. Apple has historically encouraged ~400 ms to first interactive screen for simple apps. For a database-heavy local library, ≤1.0 s cold is a defensible product target while treating <500 ms as a stretch goal.

---

### 3.2 Local Full-Text Search

| Operation | Target (Mainstream Device) | Low-End Device Budget |
|---|---|---|
| Search query, 1–3 keywords | ≤100 ms median, ≤250 ms p95 | ≤300 ms median, ≤700 ms p95 |
| Search with indexed filters (platform, type, status, date, tag) | ≤200 ms median, ≤450 ms p95 | ≤500 ms median, ≤850 ms p95 |
| Query yielding no results | ≤100 ms median, ≤250 ms p95 | ≤500 ms p95 |
| Load next 50 results | ≤100 ms median | ≤300 ms p95 |
| Open selected record metadata | ≤150 ms median | ≤400 ms p95 |
| Type-ahead search debounce | 100–150 ms | — |

**Database & Query Requirements:**

- Use SQLite **FTS5** with external-content tables to index scripts, captions, transcripts, notes, filenames, and tags.
- Use ordinary B-tree indexes for exact filters: platform, kind, status, date, duration, tag.
- Result pagination: **max 50 results per page**, using cursor/keyset pagination. Never use `OFFSET` for deep pages.
- Full-text queries shorter than **2 characters** must not execute.
- All FTS queries must run off the main thread.
- Debounce input by 100–150 ms; cancel in-flight queries when new keystroke arrives.
- Show cached previous results while new query runs.

**Rationale:**
SQLite FTS5 is proven capable of sub-100 ms queries on bounded result sets. Broad queries that materialize thousands of rows are the main source of latency; limiting result materialization and using FTS5 `bm25()` ranking keep responses fast.

---

### 3.3 Media Indexing & Thumbnail Generation

| Operation | Target (Mainstream) | Low-End Device Budget |
|---|---|---|
| First 100 metadata entries after source selection | ≤1 s | — |
| Cached image thumbnail display | ≤150 ms | ≤300 ms |
| Uncached image thumbnail display | ≤500 ms | ≤800 ms |
| Cached video thumbnail display | ≤250 ms | ≤400 ms |
| Uncached video thumbnail display | ≤1.0 s | ≤1.5 s |
| Image thumbnail generation throughput | 300–1,000/min | 100–400/min |
| Video thumbnail generation throughput | 30–120/min | 10–40/min |
| Contact sheet generation | 5–25/min | 2–10/min |
| Full initial metadata scan (10,000 local assets) | 2–10 min | 10–60 min |
| Cancel indexing response | ≤500 ms | ≤1 s |

**Requirements:**

- Metadata indexing and thumbnail extraction must **never** run on the main/UI thread.
- Use OS thumbnail APIs: iOS Quick Look/AVFoundation, Android `MediaMetadataRetriever`/`ThumbnailUtils`.
- Prefer embedded/system thumbnails when available to avoid decoding.
- Generate thumbnails only for visible items plus a small look-ahead window during browsing.
- Background thumbnail backlog runs only when idle/charging, with low concurrency.
- Do **not** generate video proxies automatically for the entire library. Proxy generation is opt-in and limited to selected/pinned projects.
- All indexing must be checkpointed and resumable after app termination.
- Cancel/pause must stop work within 500 ms and persist current cursor.

**Rationale:**
A 10,000-asset first scan with video thumbnails can take hours. Therefore, indexing must be incremental and non-blocking. The app must be usable immediately, indexing metadata first and thumbnails later.

---

### 3.4 UI Responsiveness & Scrolling

**Product Targets:**

| Metric | Target |
|---|---|
| Scroll frame rate | 60 fps minimum, target 90 Hz where supported |
| Main-thread long task | 0 ms (no DB, decode, transcode, network on main thread) |
| Foreground cancel response | ≤500 ms |
| Debounce search input | 100–150 ms |
| Tap to focused composer | ≤150 ms |
| Local autosave after pause | ≤1 s |

**Platform Failure Thresholds (not product targets):**

These thresholds are for crash/failure prevention only. They do not represent acceptable user experience.

| Metric | Android Failure Threshold |
|---|---|
| Frame render time | 700 ms (frozen frame) |
| Input event response | 5 s (ANR) |

**Requirements:**

- All long-running work—DB queries, file enumeration, bitmap decode, video frame extraction, PDF parsing, transcoding, sync—must be off the main thread.
- Use coroutines/executors with bounded concurrency.
- Thumbnail loads must be asynchronous; list scrolling must remain smooth.
- Use an LRU/2Q memory cache for thumbnails; disk cache for persistent thumbnails.
- On low-memory warnings, release rebuildable caches immediately.

**Rationale:**
Android defines smooth rendering as frames <16 ms and flags excessive main-thread work if an input event is not handled within 5 s. iOS watchdog terminates apps that block the main thread. Therefore, zero main-thread heavy work is non-negotiable.

---

### 3.5 Search During Background Indexing / Sync

| Scenario | Requirement |
|---|---|
| Search while background indexing is active | Search latency must not degrade by more than 25% |
| Search while sync queue is draining | No visible jank; search remains responsive |
| Search with external drive disconnected | Search returns cached metadata immediately, marking original unavailable |
| Search after cold restart | First search result ≤500 ms |

**Requirements:**

- Background index/sync work must be **throttled** when user is interacting.
- Use database `WAL` mode to allow concurrent reads during writes.
- Use separate queues/priorities: user-facing operations always higher priority than background work.
- If a background job is competing for I/O, it must yield within one frame budget.

---

## 4. Database Configuration (Performance-Critical)

| Setting | Recommendation |
|---|---|
| Search engine | SQLite FTS5, external-content mode |
| Canonical tables | Normalized metadata tables with B-tree indexes |
| DB page size | 4096 bytes initially |
| Journal mode | WAL |
| Synchronous | NORMAL for cache/index work; FULL for critical user edits |
| Busy timeout | 1–3 seconds |
| Cache size | 8–32 MB, tuned per device RAM class |
| Result page size | 20–50 rows |
| Index batches | 100–500 records per transaction |
| FTS maintenance | Incremental merge during idle, not full optimize on critical path |

**Schema sketch:**

```sql
CREATE TABLE content_item (
  id INTEGER PRIMARY KEY,
  kind TEXT NOT NULL,
  title TEXT,
  script_text TEXT,
  caption_text TEXT,
  transcript_text TEXT,
  file_name TEXT,
  file_path_hint TEXT,
  platform TEXT,
  status TEXT,
  created_at INTEGER,
  updated_at INTEGER,
  duration_ms INTEGER,
  media_type TEXT,
  parent_id INTEGER,
  source_id TEXT
);

CREATE VIRTUAL TABLE content_fts USING fts5(
  title,
  script_text,
  caption_text,
  transcript_text,
  file_name,
  tags_text,
  content='content_item',
  content_rowid='id',
  tokenize='unicode61 remove_diacritics 2'
);
```

---

## 5. Acceptance Criteria

```text
Startup
- Cold usable home screen: p50 ≤1.0 s, p95 ≤1.8 s.
- Warm: p50 ≤300 ms, p95 ≤700 ms.
- Hot: p50 ≤150 ms, p95 ≤300 ms.
- No full index/scan/sync/thumbnail work blocks first frame.

Search
- 1–3 keyword query: p50 ≤100 ms, p95 ≤250 ms.
- Filtered search: p50 ≤200 ms, p95 ≤450 ms.
- No-result query: p50 ≤100 ms, p95 ≤250 ms.
- Low-end Android p95: plain ≤700 ms, filtered ≤850 ms.
- Result page max 50; cursor pagination; no main-thread DB.

Indexing
- 10,000 local metadata records appear in ≤10 min on mainstream device.
- Visible thumbnails load within specified cached/uncached thresholds.
- Image thumbnail throughput ≥300/min on mainstream device.
- Video thumbnail throughput ≥30/min on mainstream device.
- Full indexing does not block user interaction.
- Cancel indexing responds within ≤500 ms.

UI
- 60 fps minimum while browsing.
- No frame >700 ms.
- No input delay approaching 5 s.
- Thumbnail loading asynchronous.

Database
- SQLite FTS5 external-content mode in production.
- WAL enabled.
- Search queries never run on main thread.
```

---

## 6. Source References

- [SQLite FTS5 Documentation](https://www.sqlite.org/fts5.html)
- [Android: Measuring App Performance](https://developer.android.com/topic/performance/measuring-performance)
- [Android: Slow Rendering](https://developer.android.com/topic/performance/vitals/render)
- [Android: ANR Guidance](https://developer.android.com/topic/performance/vitals/anr)
- [Apple: Reducing Launch Time](https://developer.apple.com/documentation/xcode/reducing-your-app-s-launch-time)
- [Android SQLite FTS Benchmark](https://dzolnai.medium.com/speed-up-searching-in-your-app-by-using-sqlite-and-fts-8896ab74b598)
- [SQLite Forum: FTS5 Performance Caveats](https://sqlite.org/forum/info/509bdbe534f58f20)
- [SQLite Tags Benchmark, 100k rows](https://simonwillison.net/2026/Mar/20/sqlite-tags-benchmark/)

---


## 5. Change Log

| Version | Date | Summary |
|---|---|---|
| 1.1 | 2026-08-22 | P2 updates: navigation IA, NFR-01 thresholds, version pins, uncited claims. |

