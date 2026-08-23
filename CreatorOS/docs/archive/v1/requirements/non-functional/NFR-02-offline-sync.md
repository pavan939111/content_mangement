# Non-Functional Requirements — NFR-02: Offline Reliability & Sync

**Product:** CreatorOS  
**Version:** 1.0  
**Status:** Draft for Review  
**Related Module:** FRS-08 Offline & Sync, all functional modules  

---

## 1. Purpose

This document defines the **offline reliability and synchronization requirements** for CreatorOS. The app is a local-first mobile workspace for solo short-form creators. It must allow complete core functionality without an internet connection, while ensuring that when connectivity returns, all local changes are synchronized safely, transparently, and without data loss.

The requirements are based on:

- Official iOS and Android background execution constraints  
- Local-first software principles (Ink & Switch)  
- Conflict handling patterns from Obsidian, Bear, Notion, and Logseq  
- Real-world sync failure reports and mobile background job limitations  

All thresholds assume a mainstream reference device and a single-user multi-device usage pattern unless otherwise stated.

---

## 2. Scope

This document covers:

- Offline availability of core features  
- Local data durability and write guarantees  
- Sync queue architecture and behavior  
- Sync timing and background execution  
- Conflict detection and resolution  
- Selective offline caching  
- User-facing sync status and indicators  
- Data integrity and no-loss guarantees  

**Out of scope:** Cloud storage provider specifics, server-side implementation, real-time collaboration, platform API rate limits (covered in NFR-08). These may be referenced but are defined elsewhere.

---

## 3. Offline Availability

### 3.1 Core Offline Features

| Feature | Offline Availability |
|---|---|
| Capture idea (text, voice, photo, video, link) | Must work offline |
| Create/edit Content Item | Must work offline |
| Add/edit tags, status, platform variants | Must work offline |
| Set reminders | Must work offline (device notifications fire) |
| Mark clip timecodes | Must work offline |
| Attach local file references | Must work offline |
| Search local library (scripts, captions, transcripts, tags, metadata) | Must work offline |
| View cached thumbnails/proxies | Must work offline if previously downloaded |
| View original media | Only if cached locally; otherwise show metadata + thumbnail and mark original unavailable |
| Edit transcript | Must work offline |
| Create/update clip markers | Must work offline |
| Basic calendar views and readiness checks | Must work offline |
| Publishing handoff preparation (copy caption, set reminder) | Must work offline |
| Manual export of data | Must work offline |

**Requirement:**

> The app shall not require an internet connection for any of the above features after initial installation and optional account setup. Account setup is not mandatory for local use.

---

## 4. Local Durability

### 4.1 Write Guarantees

| Requirement | Threshold |
|---|---|
| Local edit save (UI shows “Saved”) | ≤100 ms median, ≤250 ms p95 |
| Sync operation enqueue after local commit | ≤50 ms |
| User-confirmed edits survive loss of network | 100% |
| User-confirmed edits survive app backgrounding/termination | 100% |
| Silent overwrite of local unsynced changes | 0 tolerated |
| Local data loss due to crash/power loss | 0 tolerated |

**Implementation requirements:**

- All user-created content is committed to a transactional local database **before** the UI acknowledges the save.
- Use SQLite **WAL** journal mode.
- For critical user edits (script, caption, status change, clip marker), use `synchronous=FULL`.
- For rebuildable cache/index data, `synchronous=NORMAL` is acceptable.
- Each local commit writes the canonical record update, increments a local revision, and persists a durable sync operation in the same transaction.
- Raw media is never copied into app-private storage unless explicitly requested.
- Local revisions are retained for at least 30 days or the last 20 revisions per text record.

### 4.2 Attachment and File Safety

- Thumbnails and proxies are written to immutable temp files first, then atomically renamed.
- Incomplete files are never exposed as complete.
- Deleting a Content Item or Asset reference does not delete original referenced files.
- Soft delete / tombstone is used for syncable records; purge only after retention window and confirmed sync.

---

## 5. Sync Queue Architecture

### 5.1 Durable Outbox Pattern

The app shall use a **transactional outbox** stored locally:

```text
local_content_change
    ↓
single local DB transaction:
  1. apply canonical record update
  2. increment local revision / HLC
  3. write immutable sync_operation row
  4. update local search index
    ↓
UI confirms local save
    ↓
sync worker reads pending operations
    ↓
upload operation batch
    ↓
server ack + remote revision
    ↓
mark operations acknowledged
```

### 5.2 Minimum Sync Operation Fields

```text
operation_id        UUID, immutable, globally unique
device_id           UUID, stable per installation
entity_type         content_item | tag | relation | marker | settings
entity_id           UUID
operation_type      create | patch | delete | attach | detach
base_revision       remote revision observed at edit time
local_revision      monotonic local revision / HLC
payload             canonical patch or operation
created_at_local    wall-clock timestamp
retry_count
last_attempt_at
failure_code
acknowledged_at
```

### 5.3 Queue Behavior

- The sync queue must be persisted before reporting success to the user.
- Each operation uses `operation_id` as idempotency key.
- Batch uploads:
  - Foreground: 10–50 operations or ≤256 KB
  - Background: 50–500 operations or ≤1 MB
- Preserve ordering **per entity**; unrelated entities may sync in parallel.
- Coalesce superseded field updates before upload but retain local revision history.
- Do not coalesce operations whose intermediate history matters (e.g., clip marker creation, publish handoff, delete/restore).
- Persist retry status and failure category.
- Treat auth/quota/permission failures as `blocked`, not endlessly retryable.

---

## 6. Sync Timing

| Event | User-perceived Target | Technical Requirement |
|---|---|---|
| Local save after edit | ≤100 ms median, ≤250 ms p95 | Transaction committed locally before UI shows “Saved” |
| Enqueue sync operation | ≤50 ms after local commit | Same transaction where possible |
| Foreground sync after connectivity returns | Start within 2 s median, 10 s p95 | Trigger immediately on app-visible connectivity restoration |
| Background sync after connectivity returns | Start within 15 min best effort | OS scheduling is not deterministic |
| Small metadata mutation upload | ≤5 s median on healthy Wi-Fi | Includes operation upload and acknowledgment |
| Sync completion badge after queue drains | ≤2 s after ack | UI updates after server acknowledgment |
| Retry first transient failure | 10–30 s | Android WorkManager minimum backoff 10 s; default exponential delay 30 s |
| Retry persistent failure | Exponential backoff capped at 1–5 h | Preserve queue indefinitely until success/user action |
| Automatic retry age for unsynced changes | At least 30 days | Do not discard unsynced changes automatically |
| Stale-sync warning after pending changes | 24 h | Earlier for auth/quota/permission errors |
| Critical unresolved conflict alert | Immediate when detected | Do not bury under generic sync status |

### 6.1 Sync Success and Error Budgets

| Metric | Recommended Threshold |
|---|---|
| Operation-level sync success, healthy network | ≥99.9% within 24 h |
| Queue drain success, healthy network | ≥99.5% within 24 h |
| Unrecoverable data-loss incidents | 0 tolerated |
| Silent overwrite incidents | 0 tolerated |
| Sync conflict rate, single user multi-device | Instrument; target <0.1% of edited records/month |
| Conflict rate requiring manual action | Target <0.01% of edits/month |
| Failed syncs due to auth/quota/permission | Surface within 60 s |
| Oldest pending operation | Alert at 24 h; high-severity at 7 days |

---

## 7. Conflict Detection & Resolution

### 7.1 Conflict Model by Data Type

| Data type | Recommended merge strategy |
|---|---|
| New ideas, notes, tags, clip markers | Append-only operation log / set-union |
| Separate fields on a content item | Field-level last-write-wins with revision metadata |
| Checklists/status transitions | LWW with audit trail; reject invalid transitions |
| Captions / scripts / long notes | Must use three-way text merge; preserve both variants on failure |
| Tags | Observed-remove set or tombstone-aware set |
| Asset relations | Stable relation IDs, idempotent add/remove |
| Thumbnail/final-export selection | Explicit user resolution if two devices select different finals |
| Deletion | Tombstone with retention window, e.g. 30–90 days |
| Binary attachments/proxies | Immutable versioned blob; never merge |
| Publishing state | Server/API confirmation has priority; preserve local intent |

### 7.2 Default Behavior

- **Auto-merge where safety is high:** independent fields, tag additions, new clip markers, new records.
- **Preserve both versions where safety is uncertain:** same script paragraph edited offline on two devices, competing final-export selection, conflicting delete vs modify, multiple caption rewrites.
- **Never silently discard user content.** If merge confidence is low, create a recoverable conflict copy with device and timestamp attribution. Retain both until user resolves or archive policy expires.

### 7.3 Conflict UX Requirements

When a conflict is detected, show:

- What conflicted: “Script for ‘Summer packing Reel’”
- Why: “Edited on iPhone and iPad while both were offline”
- Versions: device name, edit time, sync time, character/field changes
- Safe options:
  - Keep both as separate drafts
  - Merge automatically with preview
  - Use this version
  - Compare changes
  - Export both

**Rules:**

- Never default to destructive overwrite.
- Keep all variants for at least 30 days.
- Conflict records remain available for ≥30 days.
- Users can export conflicting versions.

### 7.4 Conflict Visibility

| State | UI Treatment |
|---|---|
| All synced | Quiet checkmark; last sync time accessible |
| Syncing | Subtle spinner only if >2 s |
| Pending offline | Small persistent cloud-with-dot icon; no modal |
| Pending >24 h | Banner in settings/sync center |
| Requires login/permission/quota | Persistent actionable banner |
| Conflict | Badge on affected item and sync center; notification only for high-value content |
| Background task delayed | No error unless pending > alert threshold |

---

## 8. Connectivity & Background Sync

### 8.1 Platform Constraints

| Platform | Constraint | Requirement |
|---|---|---|
| iOS | Background refresh tasks get up to ~30 s; execution is system-controlled | Keep background work under 25 s; always checkpoint |
| iOS | Force-quit prevents background tasks | Resume all work on next foreground launch |
| Android | WorkManager jobs may be stopped around 10 min | Use checkpointed batches ≤8 min |
| Android | Network/Battery constraints defer jobs | Use WorkManager with network constraint; battery constraints only for heavy work |

### 8.2 Background Execution Policy

- Use WorkManager (Android) and BGAppRefreshTask / BGProcessingTask (iOS) for non-urgent sync.
- Foreground sync on connectivity restore when app is active.
- Background sync starts within 15 min best effort, not guaranteed.
- Sync metadata only; raw media is never auto-synced.
- Battery/thermal constraints: defer heavy work when battery <20% or thermal moderate/severe.
- Sync queue must survive app kill, device reboot, and background-task expiration.
- Use exponential backoff with jitter for transient failures.

---

## 9. Selective Offline Caching

### 9.1 Requirements

| Requirement | Detail |
|---|---|
| User can mark Content Items/Projects/Asset folders as **Available Offline** | Downloads metadata, thumbnails, proxies; not originals |
| Storage size estimation before downloading | Show estimated size |
| Remove offline cache without deleting metadata | Must |
| Configurable cache quota | Thumbnails: 512 MB or 5% free; proxies: 1–2 GB or 10% free |
| Warn when cache near limit | Must |
| Do not cache originals automatically | Must |

### 9.2 Offline Indicators

- Clear offline/online indicator in main UI.
- Last synced timestamp and pending count.
- Visual distinction between locally available and cloud-only content.
- Per-service sync status: Connected, Syncing, Pending, Error, Disconnected.
- Sync errors with actionable messages.

---

## 10. Data Integrity & Recovery

- All local changes are in a transactional DB; no partial state.
- Daily local backup of metadata DB (optional).
- Restore from local backup if DB corrupted (Phase 2).
- Verify data integrity after sync (hash comparison).
- Log sync events locally for user review.
- Do not allow empty/corrupt records to overwrite valid local records.
- If a sync payload is corrupt, quarantine operation and preserve data.

---

## 11. Acceptance Criteria

```text
Local edits
- 100% of user-confirmed edits survive loss of network.
- 100% of user-confirmed edits survive app backgrounding/foregrounding.
- 0 silent overwrites of local unsynced changes.

Sync
- Queue persistence survives app kill and device restart.
- On healthy Wi-Fi with app foregrounded, 95% of metadata edits begin sync within 2 s.
- On healthy Wi-Fi, 99.9% of sync operations complete within 24 h.
- Failed auth/quota/permission conditions are surfaced in ≤60 s.
- Offline queue begins draining within 15 min best effort after connectivity returns in background; within 2 s median when app foregrounded.

Conflicts
- Text conflicts preserve both versions or produce a reviewable merge.
- Binary assets are versioned, never merged destructively.
- No conflict path discards content without recoverable revision history.
- Conflict records remain available for ≥30 days.
- User can export conflicting versions.

UX
- Every edit displays local-save state without waiting for network.
- Pending sync remains visible but nonintrusive.
- Sync problems with required user action are persistent and actionable.
- Users can see oldest pending operation and last successful cloud backup.
```

---

## 12. Source References

- [Ink & Switch — Local-First Software](https://www.inkandswitch.com/essay/local-first/local-first.pdf)  
- [Android Developers — WorkManager](https://developer.android.com/develop/background-work/background-tasks/persistent/getting-started/define-work)  
- [Apple Developer — Background Tasks](https://developer.apple.com/documentation/BackgroundTasks)  
- [Obsidian Help — Sync conflicts](https://obsidian.md/help/sync/troubleshoot)  
- [Bear FAQ — Conflicted notes](https://bear.app/faq/how-bear-pro-handles-conflicted-notes/)  
- [Notion Help — Offline pages](https://www.notion.com/help/use-pages-offline)  
- [Logseq forum — offline/sync failure reports](https://discuss.logseq.com/t/logseq-sync-is-not-beta-software/23112?page=2)

---
