# Non-Functional Requirements — NFR-03: Storage & Bandwidth

**Product:** CreatorOS  
**Version:** 1.0  
**Status:** Draft for Review  
**Related Module:** FRS-03 Asset Library, FRS-07 Integrations, FRS-08 Offline & Sync  

---

## 1. Purpose

This document defines the **storage and bandwidth requirements** for CreatorOS. The app is a local-first mobile content workspace that indexes user media, generates thumbnails and optional proxies, stores metadata and transcripts locally, and syncs metadata to an optional cloud backup.

The goal is to avoid becoming another expensive cloud storage service. The product must:

- Store **metadata and previews**, not original raw media by default.
- Respect user storage and bandwidth constraints.
- Provide transparent cache controls and quotas.
- Minimize background data usage.
- Support large libraries (up to 100,000 indexed records) without exhausting device storage.

These requirements are based on research into SQLite FTS5 storage overhead, media thumbnail/proxy sizing, mobile OS storage limitations, and bandwidth best practices for local-first apps.

---

## 2. Scope

This document covers:

- Storage classes and estimated footprint
- Metadata and FTS index sizing
- Thumbnail and proxy cache sizing
- Cache quota management and eviction
- Bandwidth usage for sync and media processing
- Network constraints and offload policies
- Data export and portability storage considerations

**Out of scope:** Raw media storage (user-owned), cloud backup server architecture, platform API data transfer limits (covered in NFR-08).

---

## 3. Storage Classes and Footprint

### 3.1 Storage Classification

| Storage Type | Description | Default Location | Managed by App | User-Controllable |
|---|---|---|---|---|
| App binary / resources | Installed app | OS-managed | No | No |
| Local database (metadata, FTS, sync outbox) | CreatorOS-owned | App-private | Yes | Partial |
| Thumbnails | 256–512 px previews | App-private cache | Yes | Yes |
| Proxies | Low-res video/audio previews | App-private cache | Yes | Yes |
| Temporary files | Transcode/export work | App-private temp | Yes | Auto-cleaned |
| Export archives | User-initiated | User-selected | No | Yes |
| Raw media | Original videos/images | User storage/local/cloud/external | No | Yes |

### 3.2 Installed App Footprint

| Component | Target Size |
|---|---|
| Base app (Android delivered download) | 25–45 MB |
| Base app (iOS thinned download) | 30–55 MB |
| Installed binary + static assets | 60–110 MB |
| Maximum acceptable base download | ≤60 MB Android / ≤70 MB iOS |

**Requirements:**

- Do not bundle full FFmpeg, ML models, or all cloud SDKs in base app.
- Use OS media APIs (Quick Look, AVFoundation, MediaMetadataRetriever, ThumbnailUtils).
- Optional heavy features delivered as on-demand modules where platform supports.
- Track delivered size per device variant (AAB / App Thinning).

### 3.3 User-Generated Storage Footprint

| Data Class | Estimated Size per 1,000 Assets | Notes |
|---|---|---|
| Metadata + relationships | 1–5 MB | Normalized records |
| FTS index (short metadata) | 5–25 MB | Scripts, captions, tags |
| FTS index (transcript-heavy) | 20–100 MB | Full transcripts add significant text |
| Thumbnails (256–512 px) | 25–150 MB | Varies by content |
| Optional proxies | 100–500 MB+ | Only for selected videos |
| Total metadata + FTS only | 10–50 MB | Without thumbnails |
| Total metadata + FTS + thumbnails | 40–200 MB | Typical default |

For 100,000 indexed records, the estimated metadata + FTS footprint is **1–5 GB**, depending on transcript volume and whether full text is duplicated in the search layer. This range supersedes any earlier conflicting figures.

**Assumptions:**
- External-content FTS5 is used where possible to avoid duplicating text; however, the current `search_content` design may duplicate some searchable text. Until schema is finalised, plan for the higher end.
- Per ordinary asset metadata + FTS: 10–50 KB.
- Transcript-heavy assets can add 20–200 KB each.

**Requirements:**

- Store only compact metadata in canonical tables; use FTS5 external-content mode to avoid duplicating full text.
- Do not index binary opaque data.
- Use exact-match columns as `UNINDEXED` where appropriate.
- Avoid prefix indexes initially; they increase index size.
- Consider `detail=column` or `detail=none` if phrase/snippet requirements allow.

---

## 4. Thumbnail and Proxy Storage

### 4.1 Thumbnail Specifications

| Asset Type | Format | Target Dimensions | Typical Size |
|---|---|---|---|
| Grid thumbnail | JPEG/WebP | 256 px longest edge | 10–40 KB |
| Detail/list preview | JPEG/WebP | 512 px longest edge | 30–120 KB |
| Video poster frame | JPEG/WebP | 512 px longest edge | 30–150 KB |
| Contact sheet | JPEG/WebP | 768–1024 px | 100–400 KB |
| PDF/document page preview | JPEG/WebP | 512 px longest edge | 30–200 KB |

**Requirements:**

- Use one canonical 512 px disk thumbnail; derive smaller UI sizes in memory/cache.
- Store thumbnails in app-private cache with encrypted storage if content is personal.
- Use source signature (URI, size, mtime, partial hash) to avoid regenerating after no-op rescan.
- Thumbnail cache hit rate after first browse: ≥90% for recently visited folders.

### 4.2 Proxy Specifications

| Setting | Recommended Default |
|---|---|
| Container | MP4 |
| Video codec | H.264 Baseline/Main |
| Audio | AAC-LC, mono where acceptable |
| Resolution | 360p vertical 360×640 / horizontal 640×360 |
| Frame rate | 15 fps default; 24 fps only for precise clip marking |
| Video bitrate | 350–700 kbps |
| Audio bitrate | 32–64 kbps |
| Keyframe interval | 1–2 seconds |
| Purpose | Preview, rough clip marking, visual search—not publishing |

**Proxy Size per Minute:**

| Profile | Approx. Size/Minute |
|---|---|
| Minimal 360p 15fps | ~2.8 MB |
| Default 360p 15fps | ~4.0 MB |
| Higher-quality clip marker | ~5.6 MB |
| 480p review proxy | ~7.1 MB |

Practical planning target: **3–6 MB per minute** for 360p proxies.

**Requirements:**

- Proxy generation is **disabled by default** for library-wide indexing.
- Generate proxies only for:
  - Pinned/offline projects
  - Recently opened videos
  - Assets explicitly marked for offline preview
  - Videos chosen for clip marking or transcript search
- Proxy cache quota: **1–2 GB default, max 10% of free space**.
- Warn user before generating proxies when free storage is low.

---

## 5. Cache Quota Management

### 5.1 Default Quotas

| Cache Class | Default Quota | Policy |
|---|---|---|
| Thumbnails | 512 MB or 5% of free storage, whichever lower | LRU eviction |
| Proxies | Disabled by default; 1–2 GB when enabled | User-controlled |
| Temp/transcode output | 250 MB | Delete after task completion |
| Database WAL | Monitor; checkpoint when idle | Avoid foreground checkpoint stalls |
| Logs/diagnostics | 25–50 MB | Redact content and rotate |

### 5.2 Low Storage Behavior

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
- App must not crash or lose data when device storage is full; writes must fail safely with user notification.

---

## 6. Bandwidth Requirements

### 6.1 Network Usage Classes

| Operation | Network Type | Default Policy |
|---|---|---|
| Metadata sync | Wi-Fi or mobile (user-configurable) | Small payloads; allowed on mobile |
| Thumbnail download/preview | Wi-Fi preferred | User-initiated or cached |
| Proxy generation/download | Wi-Fi only | Requires charging or explicit user action |
| Cloud backup of metadata | Wi-Fi only by default | User can enable mobile |
| Document text extraction | Wi-Fi only | Background job |
| AI transcription | Wi-Fi only, opt-in | Explicit consent |
| Platform API publish (Phase 2) | Wi-Fi or mobile | User action |
| Analytics refresh (Phase 2) | Wi-Fi preferred | Cached, not per-screen |

**Requirements:**

- **Do not automatically sync raw media** over any network.
- Metadata sync payload per operation ≤256 KB; batch ≤1 MB.
- Batch uploads 10–50 ops foreground, 50–500 ops background.
- Respect OS network constraints (Android `NetworkType.CONNECTED`, iOS background URLSession).
- Show network usage in settings: approximate data used by sync, thumbnails, proxies.
- Users can pause sync and disable mobile data.

### 6.2 Background Data

- Background sync must use least-cost routing (Wi-Fi first).
- Use `NSURLSessionConfiguration.waitsForConnectivity` on iOS and WorkManager constraints on Android.
- Thumbnail/proxy downloads only on unmetered network unless user overrides.
- Respect low data mode / data saver.

### 6.3 Cloud Backup of Metadata

- Off by default.
- Explicit opt-in with data disclosure: titles, notes, scripts, captions, tags, transcripts, filenames, thumbnails, clip markers.
- Raw media never uploaded by default.
- Metadata backup is incremental after initial full sync.
- Estimated initial backup size for 10,000 assets: 10–250 MB depending on transcript volume.

---

## 7. Data Export and Portability

### 7.1 Export Requirements

| Export Type | Format |
|---|---|
| Ideas/scripts/notes/captions | Markdown + JSON |
| Tags/content calendar/status | CSV + JSON |
| Searchable metadata | JSON/CSV |
| Clip markers | JSON/CSV with source URI, in/out time, transcript |
| Asset relationships | JSON manifest |
| Thumbnails/proxies | Optional encrypted archive |
| Cloud backup manifest | JSON including backup version and date |

**Requirements:**

- Export includes schema version, creation time, app version, UUIDs, source references, tag relationships, and tombstone state if user requests full sync archive.
- Export must note that references are not original raw media unless separately exported.
- Export generation for ≤100k records: start ≤5 seconds, complete asynchronously with progress.
- Full data export must work offline.

---

## 8. Storage and Bandwidth Acceptance Criteria

```text
App package
- Android base download ≤45 MB target, ≤60 MB max.
- iOS thinned download ≤55 MB target, ≤70 MB max.
- No full FFmpeg, ML model, or archive-wide proxy engine in base package.

Metadata + FTS
- Target 5–25 KB per ordinary asset.
- 100,000 records ≤5 GB depending on transcript volume (see §3.3)..
- External-content FTS5 used; no full-text duplication.

Thumbnails
- Cache quota 512 MB or 5% free storage.
- Thumbnail hit rate ≥90% for recently visited folders.
- Cached thumbnail display ≤150 ms image, ≤250 ms video.

Proxies
- Disabled by default.
- 3–6 MB/min target size.
- Default quota 1–2 GB or 10% free space.
- Generated only for selected/pinned/offline items.

Bandwidth
- Raw media never auto-synced.
- Metadata sync batch ≤1 MB background.
- Wi-Fi default for thumbnail/proxy/backup.
- Respect low data mode and user data settings.
- Sync queue persists and respects network constraints.

Storage safety
- App does not crash when device storage is full.
- Clear cache without deleting content metadata.
- Storage settings show cache breakdown and clear controls.
- Original files never moved/deleted by app without explicit user action.
```

---

## 9. Source References

- [SQLite FTS5 Documentation](https://www.sqlite.org/fts5.html)  
- [Apple Quick Look Thumbnailing](https://developer.apple.com/documentation/quicklookthumbnailing)  
- [Apple AVFoundation Export Presets](https://developer.apple.com/documentation/avfoundation/export-presets)  
- [Android MediaMetadataRetriever](https://developer.android.com/reference/android/media/MediaMetadataRetriever)  
- [Android ThumbnailUtils](https://developer.android.com/reference/android/media/ThumbnailUtils)  
- [Android Media3 Transformer](https://developer.android.com/media/media3/transformer)  
- [Android Storage Overview](https://developer.android.com/training/data-storage)  
- [Google Play App Size](https://play.google.com/console/about/appsize/)  
- [Apple App Thinning](https://help.apple.com/xcode/mac/current/en.lproj/devbbdc5ce4f.html)

---

| 1.1 | 2026-08-22 | P2-2: Reconciled storage arithmetic; single 1�5 GB estimate for 100k records. |

