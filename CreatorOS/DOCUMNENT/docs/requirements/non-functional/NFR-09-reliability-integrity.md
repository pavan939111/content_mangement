# Non-Functional Requirements — NFR-09: Reliability & Data Integrity

**Product:** CreatorOS  
**Version:** 1.0  
**Status:** Draft for Review  
**Related Module:** All modules, especially FRS-08 Offline & Sync, FRS-03 Asset Library, FRS-01 Core Content Record  

---

## 1. Purpose

This document defines the **reliability and data integrity requirements** for CreatorOS. The app is a local-first, mobile-first content workspace. Users trust it with their ideas, scripts, media references, tags, and publishing history. Data loss, silent corruption, or inconsistent states would be catastrophic for trust and retention.

The goals are to:

- Guarantee no data loss for user-created content and metadata under normal operation, app crashes, power loss, network failure, and sync conflicts.
- Ensure data remains consistent across local database, FTS index, sync queue, and file references.
- Provide recovery mechanisms: local backup, export, undo, revision history.
- Detect and prevent corruption from crashes or partial writes.
- Maintain clear auditability without compromising privacy.
- Define measurable reliability targets for local and synced data.

These requirements draw on earlier NFR documents—especially NFR-02 Offline & Sync, NFR-03 Storage & Bandwidth, and NFR-04 Battery/Thermal/Memory—and on local-first software principles.

---

## 2. Scope

This document covers:

- Local data durability and transactional integrity
- Crash recovery and atomicity
- Data validation and corruption detection
- File/reference consistency
- Sync idempotency and eventual consistency
- Backup, restore, and revision history
- Export and portability
- Error handling and user communication
- Audit logging and privacy-safe telemetry
- Reliability SLOs and acceptance criteria

**Out of scope:** Server-side backup infrastructure, cloud storage provider reliability, platform API reliability (covered in NFR-08).

---

## 3. Core Reliability Principles

1. **Local-first source of truth:** The local database is authoritative. Cloud sync replicates local state; it never overrides local state without conflict resolution.
2. **Atomic writes:** User-visible “saved” means committed to a durable local transaction.
3. **No silent data loss:** Any operation that risks losing user content must be reversible or recoverable.
4. **Idempotent sync:** Repeating an operation must not create duplicates or inconsistent state.
5. **Consistent indexes:** FTS and relation tables must remain consistent with canonical records after any transaction.
6. **Detect, don’t guess:** Corrupt or partial records are quarantined and surfaced, never silently applied.
7. **User control:** Users can export, restore, and delete with clear understanding of consequences.

---

## 4. Local Data Durability & Transactions

### 4.1 Atomicity and Durability

| Requirement | Threshold |
|---|---|
| User-visible “Saved” after local edit | ≤100 ms median, ≤250 ms p95 |
| Commit to local database before UI confirmation | 100% |
| Survive app background/termination after commit | 100% |
| Survive device power loss after commit | 100% |
| No partial writes visible to user | 100% |
| No main-thread writes blocking UI | 0 |

**Implementation requirements:**

- All mutations to canonical records, FTS index, sync outbox, and file metadata must occur in a **single SQLite transaction**.
- Use `WAL` journal mode.
- For critical user edits (script, caption, status change, clip marker), use `synchronous=FULL` to ensure durability.
- For rebuildable index/cache data, `synchronous=NORMAL` is acceptable, provided it can be rebuilt from canonical data.
- Binary file writes (thumbnails, proxies, exports) use atomic pattern: write temp file → fsync → rename → update metadata transaction.
- If any step fails, the transaction rolls back; no partial state remains.

### 4.2 Local Database Integrity

| Requirement | Detail |
|---|---|
| Start-up integrity check | Lightweight `PRAGMA quick_check` or equivalent on cold start |
| Corruption detection | On detection, quarantine DB, attempt recovery from WAL, and notify user |
| Auto-repair | If minor corruption, attempt to salvage unaffected records |
| Backup before repair | Always create a copy of the corrupt DB before automated repair |
| FTS consistency | FTS index rebuildable from canonical tables if corruption detected |
| Schema migrations | Forward-only, transactional, with rollback on failure |

**Requirement:**

> A corrupt or partially written database must never be opened in a way that silently loses user data. The app shall detect, quarantine, back up, and attempt recovery while keeping the user informed.

---

## 5. File and Asset Reference Integrity

### 5.1 Referenced Files

- CreatorOS does not own raw media; it stores **references** to files in user-selected locations.
- If a referenced file is missing, moved, renamed, or permission-revoked, the app must:
  - Keep the metadata and thumbnail.
  - Mark the asset as **Missing** or **Unavailable**.
  - Show last known location.
  - Offer user actions: locate file, reconnect drive, re-link, or remove reference.
- If a file is found again via reindex or user action, automatically restore availability and update metadata if changed.

### 5.2 Thumbnail/Proxy Consistency

- Every thumbnail/proxy has a source signature: file URI, size, mtime, partial hash.
- If source file changes, the cached thumbnail/proxy is marked stale and regenerated when convenient.
- If a thumbnail/proxy is missing, the app can regenerate from source if available; otherwise, display a placeholder.
- No incomplete thumbnail/proxy is ever exposed as complete.

### 5.3 Deletion Safety

- Deleting a Content Item, Idea, Clip, or Asset reference must never delete original raw media.
- Deletes are soft-deletes (tombstones) in syncable records and retained for 30–90 days.
- Undo deletion must be available for at least 5–10 seconds after any destructive action.
- Permanent purge requires explicit user confirmation and is only allowed after tombstone retention period and successful sync.

---

## 6. Sync Reliability & Idempotency

(These requirements are cross-referenced from NFR-02, but restated for data integrity.)

### 6.1 Idempotency

| Requirement | Detail |
|---|---|
| Every sync operation has a stable `operation_id` | UUID, immutable |
| Server/cloud uses idempotency key | Same `operation_id`, never creates duplicates |
| Repeating an operation is safe | Produces same end state |
| Create operations | If entity ID already exists, treat as update or no-op |
| Delete operations | Idempotent: if already deleted, no error |
| Attach/detach relations | Idempotent with stable relation IDs |
| Tag operations | Set semantics; duplicate additions are no-ops |

### 6.2 Ordering and Consistency

- Per-entity operation ordering is preserved; global ordering is not required.
- If an operation depends on a prior operation on the same entity, they must be applied in order.
- Unrelated entities may sync in parallel.
- Server/cloud must detect out-of-order or duplicate operations and resolve using revision/operation IDs.

### 6.3 Conflict and Merge Guarantees

> **Normative source:** [NFR-02-offline-sync.md](NFR-02-offline-sync.md), section 5.

---

## 7. Backup, Restore, and Revision History

### 7.1 Local Revision History

| Record Type | Retention |
|---|---|
| Scripts, captions, long notes | Last 20 revisions or 30 days, whichever is longer |
| Content Item metadata | Last 10 revisions |
| Tags, relations | Operation history only |
| Deletion tombstones | 30–90 days |

### 7.2 Automatic Local Backup

- The app shall create a local backup of the metadata database at least once per day or after significant changes (e.g., 100 new records).
- Local backups stored in app-private storage, encrypted at rest.
- User can trigger manual backup at any time.
- Backups are portable and restorable on the same or a new device.

### 7.3 Restore

- User can restore from a local backup after reinstalling or if data becomes corrupt.
- Restore process is non-destructive: current data is first backed up.
- User can choose to merge or replace current data.
- Restore from cloud backup is available if cloud backup enabled and account authenticated.

### 7.4 Cloud Backup (Optional)

- Off by default.
- Encrypted in transit and at rest; client-side encryption preferred.
- Incremental backup after initial full sync.
- Backup manifest includes version, timestamps, and record counts.
- Restore from cloud downloads metadata and thumbnails; raw media references are re-linked when sources are available.

---

## 8. Data Validation & Corruption Detection

### 8.1 Record Validation

- Before applying any local or remote change, validate required fields and types.
- Reject records with invalid UTF-8, malformed timestamps, or missing IDs.
- Corrupt remote payloads are quarantined with a user-visible diagnostic entry.
- Do not allow empty or corrupt records to overwrite valid local records.

### 8.2 Checksums/Hashes

- For large text fields (scripts, transcripts), store a content hash to detect silent corruption.
- On read, optionally verify hash if performance allows; at minimum verify on sync and export.
- For file references, store partial hash where feasible to detect source file changes.

### 8.3 FTS Index Rebuild

- If FTS index is out of sync with canonical records (detected via count mismatch or corruption), rebuild from canonical tables.
- Rebuild is done in background with checkpointing; does not block user.

---

## 9. Error Handling & User Communication

### 9.1 User-Facing Errors

| Scenario | Required User Message |
|---|---|
| Local save failure | “Unable to save. Check device storage and try again.” |
| Database corruption detected | “Your data may be affected. We’ve created a backup and are attempting recovery. Do not delete the app.” |
| Sync operation pending >24 h | “Some changes haven’t backed up. Check your connection.” |
| Sync conflict | “This item was edited on another device. Review both versions.” |
| File missing/unavailable | “Original file not found. Last known location: [path]. Reconnect drive or locate file.” |
| Export failure | “Export incomplete. Some files could not be read.” |
| Restore completed | “Restore complete. [N] items restored. Conflicts: [M].” |
| Undo available | “Deleted. Tap Undo to restore.” |

### 9.2 Never Show

- Raw database errors, stack traces, OAuth errors, HTTP status codes alone.
- False success when operation actually failed.
- “Published” before platform verification.

---

## 10. Audit Logging (Privacy-Safe)

- The system shall maintain a local audit log of critical actions:
  - record creation, modification, deletion
  - stage/status changes
  - tag and relation changes
  - clip marker creation
  - publishing state transitions
  - sync conflict resolutions
  - backup/restore events
- Logs must not contain user content, full filenames, paths, tokens, or transcript excerpts.
- Logs are encrypted at rest and retained for 30–90 days.
- User can export redacted logs if needed for support.

---

## 11. Reliability SLOs and Targets

| Metric | Target |
|---|---:|
| User-confirmed local edits surviving app/network/power failure | 100% |
| Silent data loss due to sync/conflict/corruption | 0 incidents tolerated |
| Duplicate records due to sync retries | 0 tolerated |
| Corrupt record overwriting valid record | 0 tolerated |
| Local database available after crash | 99.99% within 5 minutes |
| FTS index consistency with canonical records | 100% after any transaction |
| Missing file reference detection | 100% on access or periodic scan |
| Backup success rate (local) | ≥99.9% |
| Restore success from backup | ≥99.9% |
| Conflict resolution preserving both versions | 100% |
| Audit log coverage of critical actions | 100% |
| Undo action availability after destructive actions | 100% for 5–10 seconds |
| Sync idempotency | 100% |

---

## 12. Recommended Acceptance Criteria

```text
Local durability
- All user-visible saves are committed durably before UI confirmation.
- No partial writes visible after crash/power loss.
- Atomic file writes for thumbnails/proxies/exports.

Database integrity
- Quick integrity check on cold start; corruption is detected and quarantined.
- Automatic backup before any repair attempt.
- FTS index rebuildable and verified.

File references
- Missing/unavailable files are marked, not silently dropped.
- Deleting app records never deletes original files.
- Undo for deletes available for at least 5 seconds.

Sync
- All sync operations idempotent.
- No operation can cause duplicate records.
- Conflicts never silently overwrite; both versions preserved.
- Conflict records retained ≥30 days.

Backup/restore
- Local backup at least daily.
- Restore is non-destructive and creates backup of current state first.
- Export works offline and includes schema/version.

Errors
- User-facing messages for all known failure modes.
- No raw technical errors.
- No false success states.

Audit
- Critical actions logged privacy-safely.
- Logs encrypted and retained 30–90 days.
- User can export redacted logs.
```

---

## 13. Source References

- [Ink & Switch — Local-First Software](https://www.inkandswitch.com/essay/local-first/local-first.pdf)  
- [Obsidian Help — Sync conflicts](https://obsidian.md/help/sync/troubleshoot)  
- [Bear FAQ — Conflicted notes](https://bear.app/faq/how-bear-pro-handles-conflicted-notes/)  
- [Notion Help — Offline pages](https://www.notion.com/help/use-pages-offline)  
- [SQLite Documentation — Atomic Commit](https://www.sqlite.org/atomiccommit.html)  
- [Android Developers — Data and file storage overview](https://developer.android.com/guide/topics/data/data-storage)  
- [Apple Developer — File System Programming Guide](https://developer.apple.com/library/archive/documentation/FileManagement/Conceptual/FileSystemProgrammingGuide/Introduction/Introduction.html)

---


| 1.2 | 2026-08-22 | P2-4: De-duplicated content; added normative source pointers. |
