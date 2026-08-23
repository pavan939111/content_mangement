# Technical Architecture Document — ARCHITECTURE-04: Sync Architecture

**Product:** CreatorOS  
**Version:** 1.1  
**Status:** Updated to align with DEC-020, ancestor snapshot for three-way merge, and E2EE plaintext metadata envelope  
**Last Updated:** 2026-08-22  
**Related Document:** ARCHITECTURE-00 Overview, ARCHITECTURE-03 Data Layer, NFR-02 Offline Reliability & Sync, DEC-020  

---

## 1. Purpose

This document defines the **sync architecture** for CreatorOS. Sync is optional and asynchronous; it replicates local metadata to a cloud backup for multi-device use or disaster recovery. It never replaces the local database as the source of truth.

The sync architecture must guarantee:

- No data loss under network failure, app termination, or conflicts.
- Idempotency and deduplication.
- Clear, user-controllable sync states.
- Low impact on battery, bandwidth, and foreground performance.
- Background execution within iOS/Android constraints.
- Privacy by design: raw media is never synced; only metadata, thumbnails, and optional proxies.

This document builds on the durable outbox from ARCHITECTURE-03 and the reliability requirements in NFR-02.

---

## 2. Sync Principles

Derived from local-first software principles and NFR-02:

1. **Local-first**: local commits succeed without network.
2. **Outbox pattern**: every local mutation writes a durable sync operation atomically.
3. **Idempotent operations**: each operation has a unique ID; retries cannot duplicate.
4. **Per-entity ordering**: operations for the same entity preserve order; unrelated entities can sync in parallel.
5. **Conflict preservation**: no silent overwrite; both versions preserved if uncertain.
6. **User transparency**: sync states visible but nonintrusive.
7. **Background best-effort**: sync runs opportunistically but can be manually triggered.
8. **Raw media never auto-synced**: only metadata and optional cached previews.

---

## 3. Sync Scope

### 3.1 Synced Data Types (If Cloud Backup Enabled)

*(Same as previous)*

### 3.2 Not Synced

*(Same as previous)*

---

## 4. Durable Outbox Architecture

The outbox is the heart of sync. It is stored in the same encrypted SQLite database as canonical data.

### 4.1 Operation Record

Defined in ARCHITECTURE-03. Key fields:

```
operation_id UUID
device_id UUID
entity_type TEXT
entity_id TEXT
operation_type TEXT
payload JSON (encrypted)
base_revision INTEGER
local_revision INTEGER
parent_hash TEXT (ancestor snapshot hash for text merge)
created_at_local INTEGER
retry_count INTEGER
last_attempt_at INTEGER
failure_code TEXT
acknowledged_at INTEGER
```

**Added:** `parent_hash` stores a hash of the entity content at the base revision, providing the ancestor snapshot needed for three-way text merge.

### 4.2 Transactional Enqueue (DEC-020)

Every local mutation executes this transaction **natively** in the platform data layer:

1. Apply canonical table change.
2. Increment `local_revision`.
3. Update FTS via triggers.
4. Insert `sync_operation` row with `parent_hash` from previous content state.
5. Commit.

**Critical:** The sync operation insert occurs **inside the same native transaction** as the canonical write. The shared KMP sync engine does not write to the outbox; it only reads and processes queued operations after commit.

If transaction fails, rollback all. Sync operation is never created without the local change, and local change never commits without a sync operation (if sync is enabled).

### 4.3 Outbox State Machine

*(Same as previous)*

---

## 5. Sync Engine Components

### 5.1 SyncWorker

- Foreground: triggered on connectivity restore while app active.
- Background: iOS `BGAppRefreshTask` / Android `WorkManager`.
- Reads pending operations in batches.
- Uploads to Metadata Sync API.
- Marks acknowledged on server success.

### 5.2 Batch Sizing

*(Same as previous)*

### 5.3 Retry Strategy

*(Same as previous)*

### 5.4 Sync Status

*(Same as previous)*

---

## 6. Idempotency & Deduplication

- Every operation uses `operation_id` as idempotency key.
- Server maintains a set of processed operation IDs with TTL.
- Repeating an operation returns success without applying duplicate change.
- Create operations: if entity exists, treat as update or no-op.
- Delete operations: idempotent.
- Relationships: stable link IDs.

---

## 7. Conflict Resolution

### 7.1 Conflict Detection

Conflict occurs when the same entity is modified on two devices before sync convergence and both changes overlap in the same field or action.

Server detects conflict using **plaintext metadata envelope** containing: `entity_id`, `base_revision`, `operation_id`, `parent_hash`, `timestamp`, and `content_hash`. This metadata is not user content; it is necessary for sync correctness. The encrypted payload contains the actual content.

### 7.2 Resolution Strategies by Data Type

| Data Type | Strategy | Ancestor Requirement |
|---|---|---|
| Ideas, notes, tags, clip markers | Append-only merge | Not required |
| Separate fields on content item | Field-level LWW with revision | Not required |
| Scripts/captions/long notes | Three-way merge; keep both on failure | **Requires parent_hash ancestor snapshot** |
| Deletion vs modification | Tombstone wins; preserve modified copy | Required |
| Binary attachments | Versioned, never merged | Not required |
| Publishing state | Server/platform confirmation priority | Not required |
| Relationships | Idempotent set operations | Not required |

### 7.3 Conflict UI

*(Same as previous)*

---

## 8. Cloud Backup Service

### 8.1 Optional and Off by Default

*(Same as previous)*

### 8.2 Encryption

- TLS 1.2+ in transit.
- Client-side encryption preferred; server cannot decrypt payloads.
- **Plaintext metadata envelope** is separate from encrypted content payload. It contains only sync/entity identifiers and hashes, never content.
- Server may use metadata envelope for dedup and conflict detection without decrypting content.

### 8.3 Incremental Sync

*(Same as previous)*

### 8.4 Backup Manifest

*(Same as previous)*

---

## 9. Background Scheduling

*(Same as previous)*

---

## 10. Sync Flow Scenarios

### 10.1 Offline Edit, Later Sync

*(Same as previous, with native enqueue note)*

### 10.2 Conflict on Same Script

1. Device A and B both edit same script offline.
2. A syncs first; server accepts revision 5 with `parent_hash` H0.
3. B syncs with `base_revision` 4 and `parent_hash` H0.
4. Server detects same base revision and same parent hash.
5. Server returns conflict; B performs three-way merge using local new content, remote new content, and common ancestor identified by `parent_hash`.
6. If merge confident, B accepts merged revision; else creates conflict copy.
7. User sees conflict if unresolved.

### 10.3 Cloud Backup Restore

*(Same as previous)*

---

## 11. Acceptability Criteria

```text
- Local edit survives network loss and app termination.
- Sync operation enqueued in same native transaction as edit.
- Idempotent operations; no duplicate records.
- Conflict never overwrites silently.
- Pending sync visible but nonintrusive.
- Background sync starts within 15 min best-effort.
- Foreground sync starts within 2 s median.
- Raw media never synced.
- OAuth tokens never in sync payload.
- Conflict records retained >=30 days.
- Sync queue survives app kill and reboot.
- Three-way merge uses parent_hash ancestor snapshot.
```

---

## 12. Source References

*(Same as previous + SQLite FTS5 etc.)*
