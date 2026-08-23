# Functional Requirements Specification — Module 08  
**Module:** Offline & Sync  
**Version:** 1.1  
**Status:** Draft for Review  
**Related Vision / PRD:** CreatorOS  
**Priority:** Must Have  

---

## 1. Purpose

The Offline & Sync module ensures CreatorOS is a **local-first application** that works reliably without an internet connection and syncs intelligently when connectivity returns.

It must solve the validated problems:

> **Notion/Milanote are weak offline and mobile; creators need fast capture and access even without internet.**

> **Mobile capture is separated from production workflow; creators often work in the field, on planes, or in areas with poor connectivity.**

> **Creators must trust that their ideas, scripts, tags, and metadata are never lost due to sync errors.**

This module defines how the app stores data locally, which features are available offline, how changes are queued and synced, how conflicts are handled, and how users can selectively download previews/proxies.

**Key principle:** Original raw media files are **not** stored or synced by CreatorOS unless explicitly requested. Only metadata, thumbnails, proxies, and user-created content are handled locally and optionally synced to a user-selected backup destination.

---

## 2. Scope

This module covers:

- Local-first data storage (on-device database)
- Offline availability of core features
- Sync queue and background sync
- Conflict detection and resolution
- Selective download/caching of previews
- Offline indicators and sync status
- Data integrity and no-loss guarantees
- Security and privacy for local data
- Manual sync and sync controls

**Out of scope:**  
Cloud backup implementation (that is covered in FRS-07 integrations), real-time collaboration, server-side database design, and platform API sync. Those will be addressed later.

---

## 3. Key User Stories

### US-01 Work Offline Completely

**As a** creator,  
**I want to** capture ideas, write notes, attach tags, change statuses, and search my local library without internet,  
**so that** my workflow never stops.

### US-02 Know What Hasn’t Synced

**As a** creator,  
**I want to** see which items are pending sync,  
**so that** I know my data is safe and current.

### US-03 Avoid Losing Changes When Sync Conflicts Occur

**As a** creator,  
**I want to** be notified when two versions of the same item conflict,  
**so that** I can choose which one to keep instead of losing work.

### US-04 Control Offline Storage Usage

**As a** creator,  
**I want to** selectively cache previews and metadata for certain projects,  
**so that** my phone storage is not filled with files I don’t need offline.

### US-05 See When I’m Offline

**As a** creator,  
**I want to** see a clear offline indicator,  
**so that** I know which features may be limited.

### US-06 Manually Sync When Needed

**As a** creator,  
**I want to** trigger a manual sync,  
**so that** I can ensure changes are backed up before switching devices.

---

## 4. Functional Requirements

### 4.1 Local-First Data Storage

| ID | Requirement | Priority | Description |
|---|---|---|---|
| OFF-01 | The system shall store all user-created content locally on the device: Content Items, Ideas, Clips, Tags, metadata, platform variants, reminders, and publishing history. | Must | Offline access. |
| OFF-02 | The system shall use a transactional local database that preserves data integrity on app crash or power loss. | Must | No data loss. |
| OFF-03 | The system shall generate a unique local identifier for every record immediately upon creation, even offline. | Must | Sync identity. |
| OFF-04 | The system shall support full-text search on locally stored text fields (scripts, captions, transcripts, notes, tags). | Must | Offline search. |
| OFF-05 | The system shall not require an account or internet connection for initial app use or local-only mode. | Must | Privacy and friction. |
| OFF-06 | The system shall allow optional account creation for cloud backup/sync. Account creation is not mandatory. | Should | User choice. |
| OFF-07 | The system shall encrypt the local database using SQLCipher (AES-256-CBC + HMAC-SHA512). Device-level encryption is enabled by default and is the fallback protection layer. | Must | Security. |
| OFF-08 | The system shall include a local write-ahead log or equivalent to ensure that all changes are durable before acknowledging to the UI. | Must | Reliability. |

### 4.2 Offline Capabilities

| ID | Requirement | Priority | Description |
|---|---|---|---|
| OFF-09 | The following actions shall work offline: capture idea (text/voice/photo/video/link), create/edit Content Item, add/edit tags, add/edit platform variants, change stage/status, set reminders, mark clip timecodes, attach local file references, and search local library. | Must | Core workflow. |
| OFF-10 | The system shall allow viewing cached thumbnails and proxies offline if previously downloaded. | Should | Media preview. |
| OFF-11 | The system shall allow playing a cached proxy offline. | Should | Useful preview. |
| OFF-12 | If a requested original media file is not cached and the device is offline, the system shall show the metadata and thumbnail but clearly indicate that the original file is unavailable. | Must | Honest state. |
| OFF-13 | The system shall allow editing a transcript or metadata offline; changes are saved locally. | Must | Workflow. |
| OFF-14 | The system shall allow creating reminders offline; device notifications will fire even if the app is offline. | Must | Native posting. |
| OFF-15 | The system shall not attempt network calls when offline; it shall queue any necessary sync or cloud actions. | Must | Battery and reliability. |

### 4.3 Sync Queue

| ID | Requirement | Priority | Description |
|---|---|---|---|
| OFF-16 | The system shall maintain a sync queue for all local changes that need to be synchronized with any connected cloud/backup service. | Must | Reliability. |
| OFF-17 | The sync queue shall persist across app restarts. | Must | No lost changes. |
| OFF-18 | Each sync queue item shall include: record type, record ID, change type (create/update/delete), timestamp, and payload. | Must | Audit. |
| OFF-19 | The system shall automatically process the sync queue when connectivity is restored and the user has allowed sync. | Must | Seamless. |
| OFF-20 | The system shall show sync status: Pending, Syncing, Completed, Failed, Retrying. | Must | Transparency. |
| OFF-21 | The system shall allow the user to retry failed sync items manually. | Should | Control. |
| OFF-22 | The system shall implement exponential backoff for automatic retries. | Should | Avoid repeated failures. |
| OFF-23 | The system shall not sync raw media files automatically; only metadata and optionally thumbnails/proxies. | Must | Bandwidth/storage. |
| OFF-24 | The system shall allow the user to disable automatic sync entirely. | Must | Privacy/control. |
| OFF-25 | The system shall allow manual sync on demand from a settings or sync status screen. | Should | User action. |

### 4.4 Conflict Detection & Resolution

| ID | Requirement | Priority | Description |
|---|---|---|---|
| OFF-26 | The system shall detect conflicts when the same record has been modified both locally and remotely since last sync. | Must | Avoid loss. |
| OFF-27 | When a conflict is detected, the system shall not silently overwrite either version. | Must | Trust. |
| OFF-28 | The system shall default to keeping both versions and marking the conflict for user resolution, where feasible. | Should | Safety. |
| OFF-29 | For scripts and captions, the system shall perform three-way merge using ancestor snapshot. For simple metadata fields, field-level LWW is acceptable. | Must | User control. |
| OFF-30 | For simple metadata fields, the system may automatically use last-write-wins but shall keep a backup of the overwritten version for a configurable period. | Should | Balance automation and safety. |
| OFF-31 | The system shall store conflict resolution outcomes in the record history. | Should | Audit. |
| OFF-32 | The system shall allow the user to set a default conflict policy (e.g., “Always ask,” “Keep newer,” “Keep local”). | Should | Preference. |
| OFF-33 | The system shall never delete data as part of conflict resolution without explicit user confirmation. | Must | Data safety. |

### 4.5 Background Sync & Connectivity

| ID | Requirement | Priority | Description |
|---|---|---|---|
| OFF-34 | The system shall use OS background tasks where available to sync when the app is backgrounded or the device is connected to power/Wi-Fi. | Should | Seamless. |
| OFF-35 | The system shall sync metadata only over Wi-Fi by default, unless the user allows mobile data. | Must | Bandwidth. |
| OFF-36 | The system shall not drain battery excessively; sync frequency shall be adaptive or manual. | Must | User experience. |
| OFF-37 | The system shall monitor connectivity changes and resume sync automatically when connection returns. | Should | Reliability. |
| OFF-38 | The system shall handle sync for multiple connected services (e.g., Google Drive metadata + optional cloud backup) as separate queues. | Should | Clarity. |
| OFF-39 | The system shall allow per-service sync settings. | Should | Control. |

### 4.6 Selective Download & Caching

| ID | Requirement | Priority | Description |
|---|---|---|---|
| OFF-40 | The system shall allow the user to mark specific Content Items, Projects, or Asset folders as **Available Offline**. | Should | Storage management. |
| OFF-41 | When marked offline, the system shall download and cache metadata, thumbnails, and proxies for the selected items, not raw originals. | Should | Efficient. |
| OFF-42 | The system shall estimate and display the storage size required for offline caching before downloading. | Should | Transparency. |
| OFF-43 | The system shall allow the user to remove offline caches for selected items without deleting metadata. | Must | Control. |
| OFF-44 | The system shall automatically manage cache size, with a configurable maximum cache size (e.g., 1GB, 5GB). | Should | Prevent storage overload. |
| OFF-45 | The system shall warn when cache is near the configured limit and offer cleanup options. | Should | User awareness. |
| OFF-46 | The system shall not cache original media without explicit user action. | Must | Avoid storage surprises. |

### 4.7 Offline Indicators & Status

| ID | Requirement | Priority | Description |
|---|---|---|---|
| OFF-47 | The system shall display a clear offline/online indicator in the main UI. | Must | User awareness. |
| OFF-48 | The system shall show last synced timestamp and pending sync count. | Should | Trust. |
| OFF-49 | The system shall visually distinguish content available offline from cloud-only content. | Must | Clarity. |
| OFF-50 | The system shall show sync status per connected service: Connected, Syncing, Pending, Error, Disconnected. | Should | Manageability. |
| OFF-51 | The system shall display sync errors with a brief, actionable message. | Should | User can fix. |
| OFF-52 | The system shall not display intrusive sync notifications; status shall be quietly visible. | Must | UX. |

### 4.8 Data Integrity & Reliability

| ID | Requirement | Priority | Description |
|---|---|---|---|
| OFF-53 | The system shall never lose local changes due to sync failure, app termination, or network loss. | Must | Core promise. |
| OFF-54 | The system shall perform local backup of the metadata database at least once per day or on significant changes, stored securely. | Should | Disaster recovery. |
| OFF-55 | The system shall allow restoring from a local backup if the app data is corrupted. | Phase 2 | Recovery. |
| OFF-56 | The system shall verify data integrity after sync by comparing record hashes or equivalent. | Should | Consistency. |
| OFF-57 | The system shall log sync and data events locally for user review. | Should | Transparency. |
| OFF-58 | The system shall not allow empty or corrupt records to overwrite valid local records. | Must | Safety. |

### 4.9 Security & Privacy

| ID | Requirement | Priority | Description |
|---|---|---|---|
| OFF-59 | Offline local data shall be encrypted at rest using platform security standards. | Must | Privacy. |
| OFF-60 | The system shall not store plaintext credentials or tokens in the local database; use secure storage. | Must | Security. |
| OFF-61 | If cloud backup is used, the user shall be informed about what data is backed up and where. | Must | Transparency. |
| OFF-62 | The system shall allow the user to clear all local data with a single action, including caches, database, and files, after confirmation. | Must | Control. |
| OFF-63 | The system shall not require cloud backup for offline functionality. | Must | No forced dependency. |

### 4.9 Additional Offline & Sync UI Requirements

| ID | Requirement | Priority | Description |
|---|---|---|---|
| OFF-M1 | Sync Center UI | Phase 2 | The system shall provide a dedicated Sync Center screen listing all connected services. MVP is local-only (Remote Config only). Sync Center and conflict resolution UI are Phase 2. Durable outbox and local-first data integrity remain Must for all edits. |
| OFF-M2 | Conflict Resolution Screen | Phase 2 | The system shall provide a conflict resolution screen for each detected conflict. MVP is local-only (Remote Config only). Sync Center and conflict resolution UI are Phase 2. Durable outbox and local-first data integrity remain Must for all edits. |
| OFF-M3 | Backup Restore Flow | Should | The system shall allow the user to restore from a local backup (and cloud backup if enabled) from the Settings or Sync Center. The restore flow shall be non-destructive: before restoring, the system shall create a backup of the current state. The user shall be able to choose between merge and replace. |
| OFF-M4 | Offline Indicator Placement | Must | The system shall display a persistent but non-intrusive offline indicator in the main navigation (e.g., top bar or tab bar) when the device is offline or sync is pending. The indicator shall clearly distinguish offline, syncing, pending, and error states using icons and text labels. |
| OFF-M5 | Manual Sync Trigger & Progress | Should | The system shall provide a manual "Sync Now" button in Sync Center and optionally in Settings. When triggered, the system shall display progress (e.g., "Syncing 5 of 20 items") and a completion status. |
| OFF-M6 | Selective Sync by Project | Should | The system shall allow the user to mark specific Content Items, Projects, or folders as "Available Offline" or "Sync to Cloud". For offline availability, the system shall download metadata, thumbnails, and proxies for the selected items. For cloud sync, the user shall be able to include/exclude specific projects. |
| OFF-M7 | Clear Local Data / Reset App | Should | The system shall provide a "Clear Local Data" action in Settings that removes all app-owned data (metadata, thumbnails, proxies, sync queue, caches) after explicit confirmation. The user shall be warned that this does not affect original files. The action shall not require cloud connection. |

---

## 5. Data Model Considerations (Logical)

The Offline & Sync module will require:

- **LocalDatabase** (SQLite or equivalent)
- **SyncQueueItem**
- **SyncServiceState**
- **ConflictRecord**
- **OfflineCacheEntry**
- **RecordChangeLog**
- **LastSyncTimestamp** per service

These will be refined during architecture design.

---

## 6. Acceptance Criteria Summary

| User Story | Acceptance Criteria |
|---|---|
| US-01 | Airplane mode: user can create idea, edit content item, add tags, search local library; all changes appear after reconnecting. |
| US-02 | Pending sync count is shown; after reconnecting, it decreases as changes sync. |
| US-03 | User edits item offline; changes are saved to local database and persist; no data is lost. (Multi-device sync is Phase 2). |
| US-04 | User marks a project offline; proxies/metadata are downloaded; storage used is visible and configurable. |
| US-05 | Offline indicator is visible; cloud-only assets show a different icon from locally available ones. |
| US-06 | Manual sync button triggers sync; status updates to Syncing and then Completed/Error. |

---

## 7. Dependencies

- **FRS-01 Core Content Record** — Local storage of content items.
- **FRS-02 Idea Capture** — Offline capture and sync.
- **FRS-03 Asset Library** — Offline metadata/proxies and sync of indexes.
- **FRS-04 Repurposing Clip Library** — Offline clip creation and sync.
- **FRS-05 Calendar** — Offline calendar and reminders.
- **FRS-06 Publishing Handoff** — Offline preparation, reminders.
- **FRS-07 Integrations** — Sync with cloud storage/backup.

---

## 8. Open Questions / Decisions Needed

1. Should the MVP include cloud backup of metadata, or only local-only with manual export?  
   *Confirmed: MVP local-only with manual export. Cloud sync and UI are Phase 2.*

2. Should offline caching include video proxies in MVP?  
   *Recommendation: Yes, but only low-resolution and user-controlled. This is important for offline preview.*

3. Should automatic conflict resolution be default or always ask?  
   *Recommendation: Default to “Always ask” for text records; simple fields can auto-merge with backup. This balances safety and usability.*

4. Should sync queue be processed only on Wi-Fi by default?  
   *Recommendation: Yes, Wi-Fi default, with optional mobile data setting.*

5. Should local backup be automatic and invisible or manual?  
   *Recommendation: Automatic daily backup stored locally; no user action required. Cloud backup later.*

---

## Change Log
| Version | Date | Summary |
|---|---|---|
| 1.1 | 2026-08-22 | Added missing MVP requirements OFF-M1 to OFF-M7 under Section 4.9. |
| OFF-M8 | Multi-device behavior without cloud sync | Must | For MVP (local-only), multi-device sync is not supported; the system shall operate as a single-device source of truth. |
