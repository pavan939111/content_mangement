# Functional Requirements Specification — Module 13  
**Module:** Data Import/Export & Backup/Restore  
**Version:** 1.1  
**Status:** Draft for Review  
**Related Vision / PRD:** CreatorOS  
**Priority:** Must Have (Export & Backup) / Should Have (Import & Cloud Restore)  

---

## 1. Purpose

The Data Import/Export & Backup/Restore module defines how users bring external content into CreatorOS and how they take their content out—whether for backup, migration, or peace of mind.

The module must solve the validated problems:

> **Creators hesitate to adopt new tools if they fear data lock-in or loss.**

> **Creators have existing content scattered in Notes, Google Docs, Notion, and cloud storage that they need to migrate easily.**

> **Users need automatic backups and reliable restore to recover from device loss, corruption, or accidental deletion.**

This module is critical for trust. It ensures:

- Full data portability with portable, machine-readable formats.
- Import paths for common creator sources.
- Local backup for disaster recovery.
- Optional cloud backup for cross-device sync and restore.
- Restore flows that are non-destructive and recoverable.
- All export/import/backup actions respect privacy and security requirements.

---

## 2. Scope

This module covers:

- Data export of all user-created content
- Import from external sources (Google Docs/Keep, Notion, CSV, Markdown, JSON)
- Local backup (automatic and manual)
- Cloud backup (optional, encrypted)
- Restore from local or cloud backup
- Migration utilities
- Export/import of media references and metadata
- Undo/confirmation around import/restore
- Offline behavior and sync

**Out of scope:** Raw media backup (user-owned), full system backup, server backup internals, migration from every possible tool. These are addressed where possible but not exhaustive.

---

## 3. Key User Stories

### US-01 Export All My Data

**As a** creator,  
**I want to** export all my ideas, scripts, content records, tags, clip markers, and metadata as portable files,  
**so that** I can back up or move to another tool.

### US-02 Import Existing Scripts from Google Docs

**As a** creator,  
**I want to** import my old Google Docs scripts,  
**so that** I don’t have to retype them.

### US-03 Backup Automatically

**As a** creator,  
**I want to** create automatic local backups of my metadata,  
**so that** my data is safe if the app crashes or I delete something.

### US-04 Restore from Backup

**As a** creator,  
**I want to** restore from a local or cloud backup without losing current unsynced changes,  
**so that** recovery is safe.

### US-05 Export a Single Content Item

**As a** creator,  
**I want to** export one content item as a bundle (script, captions, thumbnail reference, metadata),  
**so that** I can share or archive it.

### US-06 Import from a Notion Export

**As a** creator,  
**I want to** import a Notion CSV/JSON export,  
**so that** my content calendar or ideas can be reused in CreatorOS.

---

## 4. Functional Requirements

**Note:** Cloud backup enables cross-device restore via a recovery passphrase. The user must save this passphrase. Loss of passphrase means backup cannot be restored.

### 4.1 Data Export

| ID | Requirement | Priority | Description |
|---|---|---|---|
| EXP-01 | The system shall allow exporting all user-created data as JSON, including Content Items, Ideas, Clips, Tags, Asset metadata, Reminders, Publishing history, and Relationships. | Must | Portability. |
| EXP-02 | The system shall allow exporting text content (scripts, captions, notes) as Markdown, in addition to JSON. | Must | Readable. |
| EXP-03 | The system shall allow exporting tabular data (calendar, status, tags, relationships) as CSV. | Should | Spreadsheet-friendly. |
| EXP-04 | The system shall allow exporting a single Content Item as a combined bundle: metadata + script + captions + thumbnail references. | Must | Sharing/archive. |
| EXP-05 | All exports shall include a schema version, app version, export timestamp, and UUIDs for records. | Must | Integrity. |
| EXP-06 | Exports shall note that references are not original raw media unless separately exported. | Must | Clarity. |
| EXP-07 | The system shall allow optional inclusion of thumbnails/proxies in an encrypted archive. | Should | Full preview backup. |
| EXP-08 | The system shall allow exporting data offline; export generation shall start ≤5 seconds and complete asynchronously with progress. | Must | Usability. |
| EXP-09 | The user shall be able to share export files via the system share sheet or save to Files. | Must | Portability. |
| EXP-10 | Export shall work without a paid subscription. | Must | Trust. |
| EXP-11 | The system shall provide export logs and verification hash. | Should | Integrity. |

### 4.2 Data Import

| ID | Requirement | Priority | Description |
|---|---|---|---|
| IMP-01 | The system shall allow importing text from Google Docs via share sheet or file picker. | Must | Migration. |
| IMP-02 | The system shall allow importing Markdown and plain text files as Ideas or Scripts. | Must | Standard. |
| IMP-03 | The system shall allow importing CSV files containing content records (title, date, caption, tags, status). | Should | Calendar migration. |
| IMP-04 | The system shall allow importing JSON exports from CreatorOS (full restore) or from Notion (limited). | Should | Migration. |
| IMP-05 | Imported records shall be created as drafts or Idea Inbox items by default, requiring user confirmation before becoming active Content Items. | Must | Safety. |
| IMP-06 | The system shall detect duplicate imports using UUID or content hash and offer skip/overwrite/duplicate. | Should | Avoid duplicates. |
| IMP-07 | The user shall be able to preview imported data before finalizing. | Should | Control. |
| IMP-08 | Import shall preserve original source information (e.g., "Imported from Google Docs"). | Should | Context. |
| IMP-09 | The system shall support canceling an import and rolling back partial changes. | Should | Safety. |
| IMP-10 | The system shall not overwrite existing records unless user explicitly chooses. | Must | Data safety. |

### 4.3 Local Backup

| ID | Requirement | Priority | Description |
|---|---|---|---|
| BACK-01 | The system shall create automatic local backups of the metadata database at least once per day. | Must | Disaster recovery. |
| BACK-02 | The system shall create a local backup before significant operations: major schema migration, cloud restore, clear local data. | Must | Safety. |
| BACK-03 | The user shall be able to create a manual local backup at any time from Settings. | Must | Control. |
| BACK-04 | Local backups shall be encrypted at rest and stored in app-private storage. | Must | Privacy. |
| BACK-05 | Local backups shall be portable and restorable on the same or a new device. | Must | Recovery. |
| BACK-06 | The system shall retain at least the last 5 local backups or 30 days of backup history. | Should | Retention. |
| BACK-07 | Backup creation shall work offline. | Must | Offline-first. |
| BACK-08 | The system shall display backup status: last backup time, size, and location. | Must | Transparency. |

### 4.4 Cloud Backup (Optional)

| ID | Requirement | Priority | Description |
|---|---|---|---|
| BACK-10 | Cloud backup is optional and off by default. | Phase 2 | Privacy. |
| BACK-11 | The user shall be able to enable cloud backup from Settings > Account. | Phase 2 | Sync. |
| BACK-12 | Before enabling, the system shall explain exactly which data is uploaded: metadata, tags, scripts, captions, transcripts, thumbnails, clip markers. Raw media is not uploaded. | Phase 2 | Consent. |
| BACK-13 | Cloud backup shall use TLS 1.2+ in transit and encrypted storage at rest. | Phase 2 | Security. |
| BACK-14 | The system shall support incremental backup after initial full sync. | Phase 2 | Efficiency. |
| BACK-15 | The user shall be able to pause/resume cloud backup and set backup frequency (manual, daily, weekly). | Phase 2 | Control. |
| BACK-16 | The system shall display last successful cloud backup time and pending changes. | Phase 2 | Trust. |
| BACK-17 | The user shall be able to delete cloud backup without deleting local data or account. | Phase 2 | Control. |
| BACK-18 | Cloud backup restore shall require authentication and explicit user confirmation. | Phase 2 | Security. |

### 4.5 Restore

| ID | Requirement | Priority | Description |
|---|---|---|---|
| REST-01 | The system shall allow restoring from local backup or cloud backup. | Must | Recovery. |
| REST-02 | Before restore, the system shall create a backup of current state. | Must | Non-destructive. |
| REST-03 | The user shall choose merge or replace for restore. | Should | Control. |
| REST-04 | Restore shall preserve existing local changes unless user chooses replace. | Must | No loss. |
| REST-05 | The system shall show a preview of what will be restored: counts of Content Items, Ideas, Clips, Tags, etc. | Should | Transparency. |
| REST-06 | The system shall handle conflicts during restore by creating conflict copies or asking user. | Must | Safety. |
| REST-07 | Restore from cloud shall re-link asset references when original sources are available. | Should | Practical. |
| REST-08 | If raw media sources are unavailable, metadata and thumbnails shall be restored and assets marked as Unavailable. | Must | Honesty. |
| REST-09 | The system shall provide progress and completion summary after restore. | Must | UX. |
| REST-10 | Restore shall work offline for local backups. | Must | Offline. |

### 4.6 Migration Utilities

| ID | Requirement | Priority | Description |
|---|---|---|---|
| MIG-01 | The system shall provide a "Start Migration" option in Settings or onboarding for importing existing content. | Should | User acquisition. |
| MIG-02 | The system shall support importing from Notion export (CSV/JSON) with mapping fields to CreatorOS Content Items. | Should | Migration. |
| MIG-03 | The system shall support importing Google Keep notes via Google Takeout if feasible. | Phase 2 | Complex. |
| MIG-04 | The system shall provide clear mapping and preview during import from external tools. | Should | Avoid errors. |
| MIG-05 | The system shall include source attribution for migrated records. | Should | Context. |

### 4.7 Integrity & Verification

| ID | Requirement | Priority | Description |
|---|---|---|---|
| INT-01 | All exports shall include checksums/hashes for verification. | Should | Integrity. |
| INT-02 | Imports shall validate file format and schema before applying changes. | Must | Avoid corruption. |
| INT-03 | The system shall reject malformed or unsupported import files with a clear error message. | Must | UX. |
| INT-04 | Backup files shall include version metadata and checksum. | Must | Reliability. |
| INT-05 | Restore shall verify backup integrity before applying. | Must | Safety. |

### 4.8 Offline & Performance

| ID | Requirement | Priority | Description |
|---|---|---|---|
| OFF-01 | Export, import, local backup, and local restore shall work offline. | Must | Offline-first. |
| OFF-02 | Cloud backup/restore shall queue when offline and complete when connectivity returns. | Must | Sync. |
| OFF-03 | Export generation for large libraries shall run asynchronously with progress indication, not block UI. | Must | Performance. |
| OFF-04 | Import processing for large files shall be batched and resumable. | Should | Robust. |
| OFF-05 | The system shall handle storage full errors during backup/export gracefully, with user notification and retry. | Must | Reliability. |

### 4.9 Privacy & Security

| ID | Requirement | Priority | Description |
|---|---|---|---|
| SEC-01 | Exports may contain personal content; the system shall warn user before sharing. | Should | Privacy. |
| SEC-02 | Optional export encryption shall be available with password/key. | Should | Security. |
| SEC-03 | Backups shall be encrypted at rest. | Must | Security. |
| SEC-04 | Imported files shall not be uploaded to any server unless cloud backup enabled. | Must | Privacy. |
| SEC-05 | Cloud backup delete shall remove server data, not only local references. | Must | Compliance. |
| SEC-06 | The system shall not include OAuth tokens, passwords, or secrets in exports or backups. | Must | Critical. |

### 4.10 Accessibility

| ID | Requirement | Priority | Description |
|---|---|---|---|
| ACC-01 | Import/export/backup/restore screens shall be accessible with VoiceOver/TalkBack. | Must | Accessibility. |
| ACC-02 | Progress indicators shall be announced. | Should | UX. |
| ACC-03 | Confirmation dialogs for restore/delete shall have clear, plain-language labels. | Must | Clarity. |
| ACC-04 | All actions shall have accessible touch targets and alternative text. | Must | NFR-06. |

---

### 4.99 Missing MVP Requirements (Completeness Sweep)

| ID | Requirement | Priority | Description |
|---|---|---|---|
| IMP-M6 | Resumable Export | Should | The system shall allow resuming a failed ZIP export if local storage ran out but was subsequently cleared. |

## 5. Data Model Considerations (Logical)

- **ExportBundle** — schema version, timestamp, checksum, contents.
- **ImportJob** — source, mapping, status, progress.
- **BackupRecord** — type (local/cloud), timestamp, size, checksum, status.
- **RestoreJob** — source, mode, progress, conflict count.
- **MigrationMapping** — external field mapping.

These will be refined during architecture design.

---

## 6. Acceptance Criteria Summary

| User Story | Acceptance Criteria |
|---|---|
| US-01 | User exports all data as JSON; file includes schema version, timestamp, and all records; export works offline. |
| US-02 | User imports a Google Doc via share sheet; content becomes a Script or Idea with source attribution. |
| US-03 | Automatic local backup is created at least daily; user can see last backup time. |
| US-04 | User restores from local backup; current data is first backed up; restore is non-destructive. |
| US-05 | User exports a single Content Item; bundle includes script, captions, thumbnail reference, and metadata. |
| US-06 | User imports a Notion CSV; preview appears; records are imported as drafts, not active content. |

---

## 7. Dependencies

- **FRS-01 Core Content Record** — source of exported/imported records.
- **FRS-02 Idea Capture** — import into Ideas.
- **FRS-03 Asset Library** — asset references in exports.
- **FRS-08 Offline & Sync** — offline and sync behavior.
- **FRS-09 Settings** — backup/export access.
- **NFR-05 Security & Privacy** — encryption, token exclusion.
- **NFR-09 Reliability & Integrity** — checksums, validation, no loss.

---

## 8. Open Questions / Decisions Needed

1. Should cloud backup be included in MVP or Phase 2?  
   *Recommendation: Phase 2 for actual cloud backup; MVP has local backup and manual export only. This reduces security and backend complexity.*

2. Should import from Notion be in MVP?  
   *Recommendation: Yes, basic CSV import for content calendar is Should; full Notion API import is Phase 2.*

3. Should export include thumbnails/proxies by default?  
   *Recommendation: No, optional encrypted archive to keep export size manageable.*

4. Should backup retention be configurable?  
   *Recommendation: Fixed default 5 backups or 30 days; configurable later.*

5. Should restore allow selective item restore or only full restore?  
   *Recommendation: Full restore for MVP; selective restore can be Phase 2.*

---


## 99. Change Log

| Version | Date | Summary |
|---|---|---|
| 1.1 | 2026-08-22 | Completeness sweep: added missing requirements. |
