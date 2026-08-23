# Functional Requirements Specification — Module 07  
**Module:** Integrations & Storage Connections  
**Version:** 1.1  
**Status:** Draft for Review  
**Related Vision / PRD:** CreatorOS  
**Priority:** Must Have (Storage & Share-Sheet) / Phase 2 (Platform Publishing APIs)  

---

## 1. Purpose

The Integrations & Storage Connections module defines how CreatorOS connects to external services, cloud storage providers, local file systems, device calendars, editing tools, and (later) social platform APIs.

It must solve the validated problems:

> **Creators already use Google Drive, Dropbox, iCloud, local folders, external drives, CapCut, Canva, and native platform apps. A new tool must integrate with these rather than force migration.**

> **Cloud storage cost and privacy concerns are real; the app must bring-your-own-storage and avoid becoming another expensive cloud drive.**

> **Creators need easy import from share-sheet and export to maintain control of their data.**

This module ensures CreatorOS is an **open, connected, and trustworthy control center**, not a closed silo.

---

## 2. Scope

This module covers:

- Supported cloud storage providers
- Local device file access and external drive indexing
- Share-sheet import/export
- Device calendar and reminders integration
- Deep links / export to editing and design tools
- Social platform account connections (Phase 2)
- Authentication and secure credential storage
- Permission management and user control
- Data export/import formats
- Offline and sync behavior for integrations
- Privacy and trust controls

**Out of scope:**  
Building a new cloud storage service, full API auto-publish logic (that's FRS-06), enterprise SSO, or advanced collaboration permissions (Phase 2).

---

## 3. Key User Stories

### US-01 Connect My Google Drive

**As a** creator,  
**I want to** connect my Google Drive account,  
**so that** CreatorOS can index my files without uploading them.

### US-02 Index an External Drive

**As a** creator,  
**I want to** index an external SSD while it’s connected and keep the catalog after it’s disconnected,  
**so that** I can still search my old footage.

### US-03 Import from Any App via Share Sheet

**As a** creator,  
**I want to** share a video, photo, or link from any app into CreatorOS,  
**so that** I don’t have to download and re-upload.

### US-04 Open a File in CapCut or Canva

**As a** creator,  
**I want to** tap an asset and open it in CapCut or Canva,  
**so that** I can continue editing without exporting manually.

### US-05 Export All My Data

**As a** creator,  
**I want to** export my scripts, tags, metadata, and index as portable files,  
**so that** I am not locked into CreatorOS.

### US-06 Control Which Services Are Connected

**As a** creator,  
**I want to** see and disconnect any connected service at any time,  
**so that** I stay in control of my data.

---

## 4. Functional Requirements

### 4.1 Cloud Storage Providers

| ID | Requirement | Priority | Description |
|---|---|---|---|
| INT-01 | The system shall support connecting to **Google Drive** via OAuth 2.0, with read-only file listing and metadata access by default. | Must | Most common creator storage. |
| INT-02 | The system shall support connecting to **Dropbox** via OAuth 2.0. | Should | Second most used. |
| INT-03 | The system shall support connecting to **iCloud Drive** and **OneDrive** where platform APIs allow. | Phase 2 | Broader coverage later. |
| INT-04 | The system shall index cloud files by storing metadata and optional thumbnails/proxies locally; it shall not upload original files unless the user explicitly enables backup. | Must | Bring-your-own-storage. |
| INT-05 | The system shall allow selective folder indexing for cloud accounts (user chooses folders, not entire drive). | Must | Privacy and performance. |
| INT-06 | The system shall respect cloud provider rate limits and permissions; if read-only, it shall not attempt to modify or delete remote files. | Must | Safety. |
| INT-07 | The system shall show connection status: Connected, Disconnected, Expired, Needs Reauthentication. | Must | Clarity. |
| INT-08 | The system shall allow re-authentication when OAuth tokens expire, with clear prompts. | Must | Reliability. |
| INT-09 | The system shall allow disconnecting a cloud account; local metadata may remain but will be marked as “Cloud Disconnected”. | Must | User control. |

### 4.2 Local Files & External Drives

| ID | Requirement | Priority | Description |
|---|---|---|---|
| INT-10 | The system shall allow the user to select local folders on the device for indexing via system file picker. | Must | Local-first. |
| INT-11 | The system shall allow indexing files from external drives (USB, SSD, SD card) when mounted. | Must | Validated creator storage pattern. |
| INT-12 | The system shall store a persistent catalog of external drive contents, including file paths, sizes, dates, and thumbnails, so they remain searchable after disconnection. | Must | Search disconnected drives. |
| INT-13 | The system shall mark external drive assets as **Disconnected** when the drive is not mounted, and **Available** when remounted. | Must | Availability tracking. |
| INT-14 | The system shall support re-indexing an external drive to update changes. | Should | Data freshness. |
| INT-15 | The system shall not copy or move original files from local/external storage into app-private storage unless the user explicitly requests import/copy. | Must | Storage control. |
| INT-16 | The system shall store generated thumbnails/proxies in app-private storage by default. It shall not write to user-selected external storage. Storing alongside originals is not supported in MVP. | Should | Storage management. |
| INT-17 | The system shall warn when device storage is low and allow clearing cached proxies/thumbnails without deleting metadata. | Should | Storage pressure. |

### 4.3 Share-Sheet Import & Export

| ID | Requirement | Priority | Description |
|---|---|---|---|
| INT-18 | The system shall register as a share target on iOS and Android for: text, URLs, images, videos, audio, and documents. | Must | Core capture integration. |
| INT-19 | When receiving a share, the system shall create an Idea or Asset with automatic metadata extraction where possible (source app, URL, preview). | Must | Context preservation. |
| INT-20 | The system shall allow the user to choose the destination: Idea Inbox, Asset Library, or specific Content Item. | Should | Flexibility. |
| INT-21 | The system shall support exporting content via share sheet: captions, hashtags, transcripts, file links, thumbnails, and metadata. | Must | Publishing and collaboration handoff. |
| INT-22 | The system shall allow copying caption/hashtag text to clipboard directly from any platform variant. | Must | Native posting. |
| INT-23 | The system shall support sharing an asset reference or proxy preview from the Asset Library. | Should | Quick send to editors. |
| INT-24 | The system shall not upload shared content to any external server unless the user has explicitly enabled cloud sync or backup. | Must | Privacy. |

### 4.4 Editing & Design Tool Integration

| ID | Requirement | Priority | Description |
|---|---|---|---|
| INT-25 | The system shall allow opening an asset in an installed compatible editor or design app via deep link or system “Open In” action. | Should | Integrate, not replace. |
| INT-26 | The system shall specifically support handoff to **CapCut** and **Canva** where their deep links/URL schemes are available. | Should | Validated tools. |
| INT-27 | The system shall allow sharing a video/image asset to a compatible editing app via share sheet. | Must | Cross-app workflow. |
| INT-28 | The system shall maintain a reference to the original asset and the externally edited file if the user imports it back. | Should | Version tracking. |
| INT-29 | The system shall not attempt to control or monitor external editing apps. | Must | Platform limits. |
| INT-30 | The system shall provide a manual “Mark as edited” action to link a new export to the source asset. | Should | Traceability. |

### 4.5 Calendar & Reminders Integration

| ID | Requirement | Priority | Description |
|---|---|---|---|
| INT-31 | The system shall allow exporting reminders/events to Google Calendar and Apple Calendar as read-only events. | Should | Existing habits. |
| INT-32 | The system shall allow importing events from Google/Apple Calendar with user permission, but only for content-related events. | Phase 2 | Later. |
| INT-33 | The system shall not require a calendar account for basic internal reminders. | Must | Privacy. |
| INT-34 | The system shall use device notification APIs for native reminders when no external calendar is connected. | Must | Functionality. |
| INT-35 | The system shall sync internal reminders with external calendars only if the user explicitly enables two-way sync. | Phase 2 | Trust. |

### 4.6 Social Platform Account Connections (Phase 2)

| ID | Requirement | Priority | Description |
|---|---|---|---|
| INT-36 | The system may allow connecting social platform accounts (YouTube, TikTok, Instagram, X) via OAuth for publishing and analytics. | Phase 2 | Not MVP. |
| INT-37 | Connected platform accounts shall have clearly scoped permissions: publishing, analytics, or both. | Phase 2 | Transparency. |
| INT-38 | The system shall not require platform connection for MVP manual handoff. | Must | Reduce friction. |
| INT-39 | The system shall allow disconnecting any platform account at any time, with revocation of tokens. | Phase 2 | Security. |
| INT-40 | The system shall not store social platform passwords; only OAuth tokens. | Phase 2 | Security. |

### 4.7 Authentication & Security

| ID | Requirement | Priority | Description |
|---|---|---|---|
| INT-41 | The system shall use OAuth 2.0 with PKCE for cloud storage and social platform connections where supported. | Must | Modern security. |
| INT-42 | Access tokens and refresh tokens shall be stored in the device secure enclave/keychain/keystore, not in plain text. | Must | Credential safety. |
| INT-43 | The system shall request only the minimum required scopes for each integration. | Must | Privacy. |
| INT-44 | The system shall provide a clear list of connected services with permissions and last used date. | Must | Transparency. |
| INT-45 | The system shall allow the user to revoke a service connection, which shall delete stored tokens immediately. | Must | Control. |
| INT-46 | The system shall not share or sell user data or metadata to third parties. | Must | Trust. |
| INT-47 | The system shall log integration actions (connect, disconnect, reauth, sync) locally for user review. | Should | Auditability. |

### 4.8 Data Export & Portability

| ID | Requirement | Priority | Description |
|---|---|---|---|
| INT-48 | The system shall export all user-created data (Content Items, Ideas, Clips, Tags, Asset metadata, Publishing history) as JSON files. | Must | Avoid lock-in. |
| INT-49 | The system shall export metadata and indexes as CSV where tabular data is appropriate. | Should | Flexibility. |
| INT-50 | The system shall allow exporting a single Content Item as a combined bundle (metadata + attachment references + captions + thumbnails) without original raw media. | Should | Portability. |
| INT-51 | The system shall allow importing previously exported JSON to restore metadata into a new or existing account. | Phase 2 | Recovery. |
| INT-52 | The system shall include export date and version information in exported files. | Should | Clarity. |
| INT-53 | The system shall not require a paid subscription to export user data. | Must | Trust. |

### 4.9 Offline & Sync Behavior for Integrations

| ID | Requirement | Priority | Description |
|---|---|---|---|
| INT-54 | Cloud storage metadata and thumbnails that have been previously synced shall be available offline. | Must | Offline search. |
| INT-55 | When offline, changes to local metadata shall be stored locally and synced to cloud integration when connectivity returns. | Must | Data integrity. |
| INT-56 | The system shall show sync status for connected services: idle, syncing, queued, error. | Should | Trust. |
| INT-57 | The system shall not attempt to sync large raw media files automatically; only metadata and optional thumbnails/proxies. | Must | Bandwidth and cost. |
| INT-58 | The system shall allow pausing/resuming sync for individual services. | Should | Control. |
| INT-59 | The system shall resolve sync conflicts using the same mechanisms as FRS-08 (last-write-wins with backup or user choice). | Must | Consistency. |

### 4.10 Privacy & Trust Controls

| ID | Requirement | Priority | Description |
|---|---|---|---|
| INT-60 | The system shall provide a **Privacy Center** screen where users can see all connected services, permissions, and data processed locally vs cloud. | Should | Transparency. |
| INT-61 | The system shall allow the user to disable all cloud processing for metadata extraction/tagging; basic local extraction remains. | Should | Privacy preference. |
| INT-62 | The system shall clearly indicate when AI features require cloud processing and obtain explicit opt-in. | Should | Trust. |
| INT-63 | The system shall not require account creation for core local functionality; optional sync/backup may require account. | Should | Friction. |
| INT-64 | The system shall provide a clear **Delete All Data** action that removes local app data and, with user confirmation, revokes integrations. | Should | Control. |

### 4.11 Additional Integration & Storage Connection Requirements

| ID | Requirement | Priority | Description |
|---|---|---|---|
| INT-M1 | Import from Google Docs/Sheets | Should | The system shall allow importing scripts or content calendars from Google Docs and Google Sheets via the share sheet or direct file import. Imported documents shall become Content Items or Ideas with the source format and original text preserved. |
| INT-M2 | OAuth Error Handling UX | Must | The system shall provide clear, actionable OAuth error handling. When a connected service token expires, is revoked, or loses scope, the user shall see a specific message and a one-tap action to reconnect or adjust permissions. Retries shall stop automatically until the user takes action. |
| INT-M3 | Cloud Storage Sync Status Detail | Must | For each connected cloud storage service, the system shall display sync status: Connected, Syncing, Pending, Error, Disconnected, plus the last successful sync timestamp and the number of pending changes. Errors shall include a short reason and action. |
| INT-M4 | Folder Selection & Permission Persistence | Must | The system shall provide a clear folder selection workflow using the platform file picker (iOS Files/Documents, Android Storage Access Framework). Selected folders shall persist across app restarts. If permission is later revoked, the system shall mark the source as Needs Permission and guide the user to re-select the folder. |
| INT-M5 | External Drive Reconnection Flow | Must | When an external drive that was previously indexed is reconnected, the system shall detect it and offer to update or re-index the drive. The user shall be able to choose: Update Changes Only, Full Reindex, or Ignore. Previously cached metadata and thumbnails shall remain available regardless. |
| INT-M6 | User Consent for Cloud Access | Should | Before connecting any cloud storage or platform account, the system shall display an explicit consent screen explaining what data will be accessed, what permissions are required, and that the user can revoke access at any time. No connection shall be initiated without this confirmation. |

---

## 5. Data Model Considerations (Logical)

The Integrations module will require:

- **IntegrationConnection** (service, status, scopes, timestamps)
- **StorageProviderConfig** (provider type, selected folders)
- **ExternalDriveCatalog**
- **ShareImportRecord**
- **ExportBundle**
- **SyncQueueItem** (or shared with FRS-08)
- **PrivacyPreference**

These will be refined during architecture design.

---

## 6. Acceptance Criteria Summary

| User Story | Acceptance Criteria |
|---|---|
| US-01 | User connects Google Drive via OAuth; selected folders are indexed; no original files are uploaded. |
| US-02 | User indexes an external SSD; after disconnection, asset entries remain searchable and show “Disconnected”. |
| US-03 | User shares a video from Photos to CreatorOS; a new Idea or Asset is created with source context. |
| US-04 | User taps an asset and chooses “Open in CapCut”; the asset opens in CapCut. |
| US-05 | User exports all data; JSON files contain Content Items, Ideas, Clips, Tags, metadata, and publishing history. |
| US-06 | User disconnects Google Drive; stored tokens are removed and local metadata remains but shows “Cloud Disconnected”. |

---

## 7. Dependencies

- **FRS-03 Asset Library & Search** — Uses storage integrations for indexing and search.
- **FRS-02 Idea Capture** — Share-sheet import creates Ideas.
- **FRS-05 Calendar & Readiness** — Calendar integration for reminders.
- **FRS-06 Publishing Handoff** — Platform account connections (Phase 2).
- **FRS-08 Offline & Sync** — Sync queue and conflict handling.
- **FRS-01 Core Content Record** — Export includes Content Items.

---

## 8. Open Questions / Decisions Needed

1. Should Google Drive be the only cloud storage in MVP, or also Dropbox?  
   *Recommendation: Google Drive first, Dropbox soon after; iCloud/OneDrive Phase 2.*

2. Should external drive indexing require the drive to be connected once, then allow later metadata-only browsing?  
   *Recommendation: Yes, exactly as described.*

3. Should share-sheet import default to Idea or Asset Library?  
   *Recommendation: Default to Idea Inbox, with option to change destination. Users can later promote to asset if needed.*

4. Should we support direct file writing (e.g., export proxies/thumbnails to a user-selected folder) in MVP?  
   *Confirmed: keep external storage read-only. Proxies stored app-private.*

5. Should the Privacy Center be in MVP or Phase 2?  
   *Recommendation: A simple version (connected services, disconnect, data export) in MVP; detailed privacy center later.*

---

## Change Log
| Version | Date | Summary |
|---|---|---|
| 1.1 | 2026-08-22 | Added missing MVP requirements INT-M1 to INT-M6 under Section 4.11. |
