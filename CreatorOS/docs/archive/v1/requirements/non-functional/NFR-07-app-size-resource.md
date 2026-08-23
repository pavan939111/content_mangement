# Non-Functional Requirements â€” NFR-07: App Size & Resource Usage

**Product:** CreatorOS  
**Version:** 1.0  
**Status:** Draft for Review  
**Related Module:** All modules, especially FRS-03 Asset Library, FRS-08 Offline & Sync  

---

## 1. Purpose

This document defines the **app size and resource usage requirements** for CreatorOS. The app is a lightweight, local-first mobile utility for solo short-form creators. It must not become a bloated media app; core value is search, organization, and workflow coordination, not media editing or storage.

The goals are to:

- Keep the base download small and install success high.
- Ensure fast cold/warm startup.
- Limit RAM usage to avoid background kills.
- Manage user-generated storage (metadata, thumbnails, proxies) transparently.
- Prevent unbounded resource consumption from indexing, sync, or media processing.

These requirements are based on official Apple and Android size/performance guidance, Google Play app size recommendations, and realistic footprint estimates for SQLite FTS and media preview caches.

---

## 2. Scope

This document covers:

- Application package size (download and installed)
- Startup performance (cold, warm, hot)
- Runtime memory (RAM) budgets
- User-data storage footprint and quotas
- Resource usage during indexing and background work
- CI/CD gates for size and resource regressions

**Out of scope:** Cloud/server resource usage, network bandwidth (NFR-03), battery/thermal (NFR-04), security (NFR-05), accessibility (NFR-06).

---

## 3. App Package Size

### 3.1 Target Distribution Sizes

| Metric | Target | Maximum / Degraded Budget |
|---|---:|---:|
| Android delivered download, base app | 25â€“45 MB | 60 MB |
| iOS thinned download | 30â€“55 MB | 70 MB |
| Installed binary + static assets | 60â€“110 MB | 140 MB |

### 3.2 Component Size Budgets

| Component | Android Delivered | iOS Thinned | Notes |
|---|---:|---:|---|
| Native shell/UI (SwiftUI/Compose) | 8-15 MB | 10-18 MB | Includes base app UI, navigation, design system |
| SQLite + FTS5 | <2 MB | <2 MB | System or bundled SQLite; FTS5 included |
| SQLCipher native library | 2-5 MB | 2-4 MB | Per-ABI/per-architecture; verify actual sizes |
| GRDB.swift (iOS only) | — | 1-3 MB | Swift framework, stripped |
| Room + KSP (Android only) | 1-2 MB | — | Android only |
| Kotlin Multiplatform framework | 1-4 MB | 2-6 MB | Kotlin/Native framework size varies with dependencies |
| Ktor client + kotlinx serialization | 1-2 MB | 1-3 MB | Shared networking/serialization |
| RevenueCat SDK | 0.5-1 MB | 1-2 MB | Native SDK |
| Sentry SDK | 1-2 MB | 1-2 MB | Crash/performance monitoring |
| Coil (Android) / Kingfisher (iOS) | 0.5-1 MB | 1-2 MB | Image loading library |
| Media3 (Phase 2) | 2-4 MB | — | Android only, deferred |
| App icons/fonts/static assets | 3-10 MB | 3-10 MB | Audit asset catalogs |
| Total | 25-45 MB | 30-55 MB | Recommended launch target |

These budgets are initial estimates based on selected stack components. They shall be validated during the technical spike and updated with measured numbers from actual release builds.

### 3.3 What Not to Ship in Base App

- Full FFmpeg build
- Full transcription model
- Large AI model
- All cloud-provider SDKs (except core networking/RevenueCat/Sentry)
- Multiple codec packages
- Unused platform architectures (ensure ABI split/bitcode stripping)

Use OS media APIs and on-demand feature delivery for optional heavy components.

**Requirement:**

> The base app shall not exceed 60 MB Android delivered download or 70 MB iOS thinned download. Optional heavy features must be delivered on demand.

### 3.4 Market Context

App size targets are set based on product and platform recommendations, not external market averages.

---

## 4. Startup Performance

> **Normative source:** [NFR-01-performance.md](NFR-01-performance.md), section 3.2.

---|---:|---:|---:|
| Cold | â‰¤1.0 s p50, â‰¤1.8 s p95 | <500 ms | â‰¥5 s |
| Warm | â‰¤300 ms p50, â‰¤700 ms p95 | <200 ms | â‰¥2 s |
| Hot | â‰¤150 ms p50, â‰¤300 ms p95 | <150 ms | â‰¥1.5 s |

**Requirements:**

- First frame must render cached navigation shell and home content immediately.
- Startup path must not wait for: full SQLite integrity check, FTS index verification/rebuild, cloud sync, OAuth refresh, external drive scan, photo library enumeration, thumbnail/proxy generation, document extraction, or large cache migration.
- Open local database lazily or with bounded read-only initial query.
- Start sync, source refresh, and indexing only after first interactive frame.
- Track and monitor startup p50/p95 per device class.

**Reference:** Android defines startup latency from icon tap to first frame; ideal cold <500 ms, excessive 5 s cold. Apple encourages ~400 ms to first interactive screen for simple apps.

---

## 5. Runtime Memory (RAM) Budgets

> **Normative source:** [NFR-04-battery-thermal-memory.md](NFR-04-battery-thermal-memory.md), section 4.

---|---:|---:|
| Home, inbox, calendar, notes | 80â€“120 MB | 150 MB |
| Full-text search, 50 results, no thumbnails | 90â€“140 MB | 170 MB |
| Search + 20â€“50 thumbnail grid | 120â€“180 MB | 250 MB |
| Script editor, one active transcript | 100â€“160 MB | 220 MB |
| Background metadata index | 60â€“100 MB | 150 MB |
| Thumbnail extraction | 100â€“180 MB | 250 MB |
| Video thumbnail/proxy task | 150â€“250 MB | Device-specific; serialize work |

### 5.2 Device-Class Budgets

| Device RAM Class | Ordinary UI | Thumbnail/Media Ceiling |
|---|---:|---:|
| 4 GB RAM Android | â‰¤100 MB | â‰¤160 MB |
| 6 GB RAM Android | â‰¤140 MB | â‰¤220 MB |
| 8 GB+ Android / modern iPhone | â‰¤180 MB | â‰¤280 MB |
| Memory warning / trim | Release to â‰¤50 MB | Cancel/defer media work |

**Requirements:**

- Do not load full 4K/8K assets into memory for grid thumbnails.
- Decode thumbnails at target render size (256â€“512 px).
- Keep only visible and prefetch-window images in memory.
- Use LRU/2Q memory cache, dynamically sized.
- FTS result pages limited to 20â€“50 rows.
- Store IDs and compact view models; do not hydrate full transcript text for every search hit.
- Serialize video frame extraction/transcoding on low/midrange devices.
- Respond to memory warnings / `onTrimMemory` by releasing non-visible caches.

**Reference:** Android recommends image downsampling and warns against decoding high-resolution images into small UI targets.

---

## 6. User-Generated Storage Footprint

### 6.1 Base App vs User Library

| Storage Layer | Typical Amount |
|---|---|
| Installed app binary/resources | 60â€“110 MB |
| SQLite metadata + FTS, 1,000 simple assets | 10-50 MB |
| SQLite metadata + FTS, 10,000 assets | 100-500 MB |
| SQLite metadata + FTS, 100,000 mixed records | 1-5 GB |
| 512 px thumbnail cache, 1,000 assets | 30â€“120 MB |
| 512 px thumbnail cache, 10,000 assets | 300 MBâ€“1.2 GB |
| Proxy cache | 3â€“6 MB/minute of selected video |
| Logs/temp files | Keep <100 MB; auto-prune |

**Requirement:**

> Budget 5â€“25 KB per ordinary asset for metadata+FTS. Transcript-heavy assets may use 30â€“200 KB each. These ranges are capacity-planning targets and must be validated on a real corpus.

### 6.2 Cache Quotas & Low Storage Behavior

> **Normative source:** [NFR-03-storage-bandwidth.md](NFR-03-storage-bandwidth.md), section 5.

---|---:|---|
| Thumbnails | 512 MB or 5% of free storage, whichever lower | LRU eviction |
| Proxies | Disabled by default; 1â€“2 GB when enabled | 10% free space ceiling |
| Temp/transcode output | 250 MB | Delete after task completion/cancel |
| Database WAL | Monitor; checkpoint when idle | Avoid foreground checkpoint stalls |
| Logs/diagnostics | 25â€“50 MB | Redact content and rotate |

### 6.3 Low Storage Behavior

| Free Storage Threshold | Required Action |
|---|---|
| <10% free | Stop nonessential thumbnail backlog and proxy work |
| <5 GB free | Warn user before proxy generation |
| <2 GB free | Disable proxy generation and aggressive cache growth |
| <1 GB free | Preserve core metadata DB, clear rebuildable preview cache first |

**Requirements:**

- Cache eviction must be automatic and non-destructive to metadata.
- Users can clear thumbnails/proxies without deleting content records.
- Storage settings screen shows cache breakdown and clear controls.
- App must not crash or lose data when device storage is full; writes fail safely with user notification.

---

## 7. Resource Usage During Indexing & Background Work

### 7.1 CPU and I/O Concurrency

| Operation | Foreground Policy | Background Policy |
|---|---|---|
| Search query | DB worker only | N/A |
| Metadata scan | 2â€“4 I/O tasks max | 1â€“2 tasks, checkpointed |
| Image thumbnails | 1â€“2 decode tasks | 1 task when idle/charging |
| Video thumbnail | 1 task | 1 task only if thermal/battery healthy |
| Proxy generation | 1 explicit task | Pause unless charging/user-approved |
| Cloud metadata sync | 1â€“2 concurrent requests | 1 constrained request |
| FTS bulk insert | 100â€“500 rows/transaction | 25â€“250 rows/transaction |

### 7.2 Memory During Media Processing

| Device RAM Class | Thumbnail/Decode Working-Set | Proxy/Transcode Working-Set |
|---|---:|---:|
| â‰¤4 GB RAM | 24â€“48 MB | 64â€“96 MB |
| 4â€“6 GB RAM | 48â€“96 MB | 96â€“160 MB |
| 8 GB+ RAM | 96â€“160 MB | 160â€“256 MB |
| Memory pressure | Release to 0â€“25% normal target | Cancel/defer noncritical processing |

**Requirements:**

- Never combine high-concurrency thumbnail decoding with video transcoding.
- Use cooperative cancellation at file boundaries.
- Persist queue state and checkpoint at asset boundaries.
- No incomplete thumbnail/proxy is exposed as complete.

---

## 8. App Size Governance & CI Gates

### 8.1 CI/CD Gates

| Metric | Warning | Block Release |
|---|---:|---:|
| Android delivered download | >45 MB | >60 MB |
| iOS thinned download | >55 MB | >70 MB |
| Installed app/resources | >110 MB | >140 MB |
| New dependency impact | >2 MB | Requires review |
| Media/transcoding bundle | >5 MB | Must be feature-gated/on-demand |
| Startup regression | >15% | >30% |
| Baseline UI memory regression | >20% | >35% |

### 8.2 Tracking Requirements

Track:
- Android Play-delivered size by ABI/density/language
- iOS App Store Connect thinned download and install size
- app binary vs user cache
- largest native libraries
- largest assets/fonts/locales
- cold/warm startup p50/p95
- baseline PSS/RSS/memory footprint by device class

**Reference:** Google Play emphasizes smaller apps download faster and have higher install success. Use AAB delivery, R8/resource shrinking, modularization, and on-demand features.

---

## 9. Recommended Acceptance Criteria

```text
App package
- Android per-device delivered base download: <=45 MB target, <=60 MB max.
- iOS thinned download: <=55 MB target, <=70 MB max.
- No full FFmpeg, ML model, or archive-wide proxy engine in base package.

Startup
- Cold usable UI: p50 <=1.0 s, p95 <=1.8 s.
- Warm start: p50 <=300 ms, p95 <=700 ms.
- Hot resume: p50 <=150 ms, p95 <=300 ms.
- No source scan, cloud sync, FTS rebuild, thumbnail generation, or proxy work
  on critical startup path.

Memory
- Normal browse/search: <=140 MB on mainstream devices.
- Heavy thumbnail screen: <=180 MB target, <=250 MB ceiling.
- 4 GB Android normal UI: <=100 MB.
- Release rebuildable caches on memory warning/trim.

Storage
- Metadata + FTS only: target 5â€“25 KB per ordinary asset.
- Thumbnail cache quota: 512 MB or 5% free storage, whichever is lower.
- Proxies disabled by default and never count as core app footprint.
- Show cache breakdown and clear controls.

Operational
- Measure cold/warm/hot start with Xcode Organizer/Instruments and Android
  Macrobenchmark/Play Vitals.
- Measure package size by actual delivered device variant, not raw IPA/AAB size.
- Maintain a representative 10k and 100k content-record test corpus.
```

---

## 10. Source References

- [Apple â€” Reducing app launch time](https://developer.apple.com/documentation/xcode/reducing-your-app-s-launch-time)  
- [Android â€” Measuring app performance](https://developer.android.com/topic/performance/measuring-performance)  
- [Android â€” App startup time](https://developer.android.com/topic/performance/vitals/launch-time)  
- [Apple â€” App thinning](https://help.apple.com/xcode/mac/current/en.lproj/devbbdc5ce4f.html)  
- [Android â€” Android App Bundle](https://developer.android.com/guide/app-bundle)  
- [Google Play â€” App size](https://play.google.com/console/about/appsize/)  
- [Android â€” Bitmap memory management](https://developer.android.com/topic/performance/graphics/manage-memory)  
- [Android â€” Image optimization](https://developer.android.com/develop/ui/compose/graphics/images/optimization)

---


## 6. Change Log

| Version | Date | Summary |
|---|---|---|
| 1.1 | 2026-08-22 | P2 updates: navigation IA, NFR-01 thresholds, version pins, uncited claims. |


| 1.1 | 2026-08-22 | P2-2: Reconciled storage arithmetic; single 1–5 GB estimate for 100k records. |







| 1.2 | 2026-08-22 | P2-4: De-duplicated content; added normative source pointers. |

| 1.3 | 2026-08-22 | P2-6: Rebaselined component budgets with selected tech stack. |
