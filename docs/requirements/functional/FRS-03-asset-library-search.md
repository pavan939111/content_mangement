# Functional Requirements Specification — Module 03  
**Module:** Asset Library & Search  
**Version:** 1.1  
**Status:** Draft for Review  
**Related Vision / PRD:** CreatorOS  
**Priority:** Must Have  

---

## 1. Purpose

The Asset Library & Search module is the central **indexing and retrieval system** for all creator-owned assets: videos, images, audio, scripts, captions, thumbnails, design files, and imported references.

It must solve the validated problems:

> **Creators cannot quickly find old clips, scripts, thumbnails, or captions. Retrieval depends on memory, filenames, folder discipline, spreadsheets, and drive hunting.**

The module must work across local device storage, connected cloud accounts, and external drive catalogs—**without forcing the user to upload raw media**. It shall store metadata, thumbnails/proxies, and searchable references, leaving original files in place.

This module also feeds all other modules: Content Item attachments, repurposing clip library, calendar readiness, and publishing handoff rely on asset references.

---

## 2. Scope

This module covers:

- Supported asset types
- Indexing of local, cloud, and external storage
- Automatic metadata extraction (basic)
- Thumbnail/proxy generation and storage
- Manual and suggested tagging
- Unified search across all indexed assets
- Filters and views
- Asset location and availability tracking
- Duplicate detection
- Usage history (where an asset has been used)
- Non-destructive metadata handling
- Offline access to metadata and cached proxies
- Privacy and data control

**Out of scope:**  
Full enterprise DAM/MAM, AI visual search (Phase 3), cloud processing of full raw media, actual editing, and asset sharing/collaboration (Phase 2).

---

## 3. Key User Stories

### US-01 Find an Old Clip

**As a** creator,  
**I want to** search for “beach sunset b-roll” and see all matching clips with previews,  
**so that** I don’t have to rewatch hours of footage.

### US-02 Search Across Multiple Storage Locations

**As a** creator,  
**I want to** search my phone, Google Drive, Dropbox, and an external SSD index in one place,  
**so that** I don’t have to remember where each file lives.

### US-03 See File Availability

**As a** creator,  
**I want to** know if an asset is online, on a disconnected drive, or only in the cloud,  
**so that** I don’t chase a file I can’t access right now.

### US-04 Search by Transcript or Spoken Words

**As a** creator,  
**I want to** search for a phrase that was spoken in a video,  
**so that** I can find the exact moment without watching the whole video.

### US-05 Filter by Content Context

**As a** creator,  
**I want to** filter assets by content pillar, platform, date, type, and usage history,  
**so that** I can narrow down results quickly.

### US-06 Avoid Duplicate Storage

**As a** creator,  
**I want to** detect when the same file exists in multiple locations,  
**so that** I can free up space and avoid confusion.

---

## 4. Functional Requirements

### 4.1 Asset Types & Indexing

| ID | Requirement | Priority | Description |
|---|---|---|---|
| AS-01 | The system shall support indexing of the following asset types: video, image, audio, document, design file, archive, and other. | Must | Covers creator media and reference files. |
| AS-02 | The system shall index files from device local storage, camera roll, and Google Drive (Must). Dropbox, iCloud Drive, OneDrive, and other providers are Phase 2. External drives via manual index are Must. | Should | Bring-your-own-storage. |
| AS-03 | The system shall not upload or copy original files unless explicitly requested by the user for backup. | Must | Preserve storage cost and trust. |
| AS-04 | The system shall create and store a **thumbnail** for every indexed image and video. For video, a representative frame or contact sheet. | Must | Fast visual browsing. |
| AS-05 | The system shall generate and store a lightweight **proxy/preview** for video and audio where feasible. Thumbnails are Must, but proxies are Phase 2. | Phase 2 | Enables offline preview without full file. |
| AS-06 | The system shall index text content of documents, scripts, and captions for full-text search. | Must | Search scripts/captions. |
| AS-07 | The system shall index audio/video transcripts when available or generated. | Must | Search by spoken words. |
| AS-08 | The system shall allow manual addition of external files/folders/links that cannot be automatically indexed. | Should | Flexibility. |
| AS-09 | The system shall support background indexing with progress indication and pause/resume. | Must | Large libraries. |
| AS-10 | The system shall avoid blocking the UI during indexing. | Must | Mobile responsiveness. |

### 4.2 Metadata Extraction & Tagging

| ID | Requirement | Priority | Description |
|---|---|---|---|
| AS-11 | The system shall automatically extract basic metadata from files: filename, type, size, date created/modified, duration (media), resolution, codec, orientation. | Must | Search and filtering. |
| AS-12 | The system shall automatically generate tags from folder names, filename keywords, and attached Content Item metadata. | Should | Reduce manual tagging. |
| AS-13 | The system shall support manual tagging of any asset with multiple tags. | Must | User control. |
| AS-14 | The system shall allow batch tagging of multiple selected assets. | Should | Efficiency. |
| AS-15 | The system shall store tags separately from original filenames; renaming originals is not required. | Must | Non-destructive metadata. |
| AS-16 | The system shall provide tag suggestions based on similar assets or prior user tags, but allow rejection. | Should | Avoid tagging burden. |
| AS-17 | The system shall allow custom metadata fields per asset (e.g., content pillar, usage rights, client, project). | Phase 2 | Useful but not MVP-critical. |
| AS-18 | The system shall record the original file path/URI for each asset. | Must | Location tracking. |

### 4.3 Search Capabilities

| ID | Requirement | Priority | Description |
|---|---|---|---|
| AS-19 | The system shall provide a global search bar accessible from all main screens. | Must | Core discovery. |
| AS-20 | Search shall match across: filename, title, tags, transcript text, document content, notes, script text, captions, folder name, platform, date, and content pillar. | Must | Unified search. |
| AS-21 | Search shall support simple keyword and multi-word queries. | Must | Basic. |
| AS-22 | Search shall support filtering by: asset type, date range, duration, platform, content pillar, availability, usage status, and tags. | Must | Narrow results. |
| AS-23 | Search shall support exact phrase matching where possible. | Should | Precision. |
| AS-24 | Search results shall display thumbnail, type, title/filename, tags, date, and source location. | Must | Recognition. |
| AS-25 | Search results shall show the original file location and whether it is currently available. | Must | Avoid chasing unavailable files. |
| AS-26 | Search shall work offline for all locally cached metadata and proxies. | Must | Offline-first. |
| AS-27 | Search shall support relevance ranking with most recent and frequently used assets prioritized. | Should | Practical. |
| AS-28 | Search shall be performant: results for metadata search shall return in under 2 seconds for a 100k-item library. | Must | UX. |
| AS-29 | The system shall support saving frequent searches or filters as smart collections. | Phase 2 | Useful later. |

### 4.4 Filters & Views

| ID | Requirement | Priority | Description |
|---|---|---|---|
| AS-30 | The system shall provide an **Asset Library** main view with grid and list layouts. | Must | Browsing. |
| AS-31 | The system shall support sorting by: date added, date modified, size, duration, title, usage frequency. | Must | Organization. |
| AS-32 | The system shall support grouping by type, platform, content pillar, project, or source location. | Should | Context. |
| AS-33 | The system shall provide a detail view for a single asset showing metadata, tags, thumbnails/proxy preview, source location, linked Content Items, usage history, and duplicates. | Must | Complete context. |
| AS-34 | The system shall provide a **Recent** view of recently added or recently used assets. | Should | Quick access. |
| AS-35 | The system shall provide a **Favorites/Pinned** view for assets marked important. | Should | User preference. |

### 4.5 Storage Integration & Location Tracking

| ID | Requirement | Priority | Description |
|---|---|---|---|
| AS-36 | The system shall connect to Google Drive via OAuth (Must). Dropbox, iCloud Drive, and OneDrive are Phase 2. | Should | BYO storage. |
| AS-37 | The system shall allow indexing an external drive manually by scanning its contents and storing metadata/proxies even after the drive is disconnected. | Must | External drive workflows. |
| AS-38 | The system shall store the **location type**: local, cloud, external, or linked. | Must | Availability logic. |
| AS-39 | The system shall display availability states: Available, Cloud Only, External Disconnected, Offline Cached, Missing. | Must | Clear user communication. |
| AS-40 | The system shall support reconnection of a disconnected drive to revalidate files. | Should | Re-index. |
| AS-41 | The system shall support one-click open/export/share of an asset, subject to availability. | Must | Action. |
| AS-42 | The system shall not move, delete, or rename original files without explicit user action. | Must | Trust. |

### 4.6 Duplicate Detection & Usage History

| ID | Requirement | Priority | Description |
|---|---|---|---|
| AS-43 | The system shall detect exact duplicates (same file hash) across indexed locations. | Should | Storage cleanup. |
| AS-44 | The system shall show detected duplicates grouped with their locations. | Should | User decision. |
| AS-45 | The system shall allow user to mark duplicates as “keep both” or “delete/remove reference.” Deletion is only possible with explicit confirmation. | Should | Control. |
| AS-46 | The system shall record which Content Items use an asset and which published posts used it. | Should | Usage history. |
| AS-47 | The system shall display usage history in asset detail: linked Content Items, clip derivatives, published URLs. | Should | Reuse context. |
| AS-48 | The system shall use usage data to inform search ranking (frequently used assets appear higher). | Should | Practical value. |

### 4.7 Offline & Sync

| ID | Requirement | Priority | Description |
|---|---|---|---|
| AS-49 | The system shall store all asset metadata locally. | Must | Offline search. |
| AS-50 | The system shall allow selective download of thumbnails/proxies for offline preview. | Should | User-controlled. |
| AS-51 | The system shall not automatically download original media unless user opts in per file or batch. | Must | Storage and bandwidth. |
| AS-52 | The system shall show sync status for cloud-indexed metadata changes. | Should | Trust. |
| AS-53 | The system shall support background sync of metadata and thumbnail updates when connectivity is available. | Should | Current data. |
| AS-54 | The system shall handle sync conflicts by preserving both versions or prompting the user. | Should | Avoid data loss. |

### 4.8 Privacy & Data Control

| ID | Requirement | Priority | Description |
|---|---|---|---|
| AS-55 | All metadata and thumbnails/proxies shall be stored securely on device by default. | Must | Privacy. |
| AS-56 | Cloud backup of metadata shall be optional and clearly disclosed. | Should | Trust. |
| AS-57 | The user shall be able to delete the entire index/metadata without affecting original files. | Must | Control. |
| AS-58 | The system shall allow export of the asset index as JSON/CSV, including metadata and locations. | Must | Portability. |
| AS-59 | The system shall allow opting out of cloud-based AI/metadata extraction; basic extraction from filenames and file properties remains local. | Should | Privacy preference. |

### 4.9 Additional Asset Library & Search Requirements

| ID | Requirement | Priority | Description |
|---|---|---|---|
| AS-M1 | Unified Global Search | Must | The system shall provide a unified global search across Ideas, Content Items, Assets, Clips, Scripts, Captions, Transcripts, Tags, and File Metadata. Global search results shall be grouped by entity type and sortable by relevance or date. The global search bar shall be accessible from all main screens and support the same filters as asset search where applicable. |
| AS-M2 | Asset Detail Actions | Must | The system shall provide quick actions in the Asset Detail view: Open in Editor, Share, Copy Reference, Add to Content Item, Mark Favorite, Edit Metadata (rename title, edit tags), and Remove Reference. Removing a reference shall not delete the original file. |
| AS-M3 | Asset Preview Screen | Must | **Normative source:** [FRS-11-media-preview-playback.md](FRS-11-media-preview-playback.md). |
| AS-M4 | Multi-Select & Batch Operations | Should | The system shall allow selecting multiple assets in the library and performing batch actions: add/remove tags, assign content pillar, delete references, export metadata, or add to a Content Item. Batch delete requires confirmation. |
| AS-M5 | Search Filters for Availability | Should | The system shall allow filtering assets by availability state: Available, Cloud Only, External Disconnected, Offline Cached, or Missing. |
| AS-M6 | Search Filters for Usage History | Should | The system shall allow filtering assets by usage history: Used in Content Item, Published, Unused, or Used in Clip Library. |
| AS-M7 | Saved Searches / Smart Collections | Phase 2 | The system shall allow users to save filter criteria as saved searches / smart collections and rerun them later. |
| AS-M8 | Asset Tag Editing UI | Must | The system shall provide inline tag editing directly from asset lists and detail views. Tags shall support quick add, search, and removal without navigating to a separate editing screen. |
| AS-M9 | Manual Add Unindexed File | Should | The system shall allow manually adding a file reference that was not automatically indexed, such as a cloud link or a file outside watched folders. The user shall be able to enter a title, source URL/path, media type, and tags. |
| AS-M10 | Tag Management | Must | The system shall support a tag management interface allowing users to rename, merge, delete, and list all tags. |
| AS-M11 | Search relevance specification | Must | The system shall prioritize search results using BM25, boosting recent and frequently used assets, and provide clear zero-result behavior. |

---

## 5. Data Model Considerations (Logical)

The Asset Library will require at least:

- **Asset**
- **AssetType**
- **StorageLocation**
- **Thumbnail/Proxy**
- **Tag**
- **AssetTag**
- **ContentItemAssetLink** (relation to Content Items)
- **DuplicateGroup**
- **UsageHistory** (or derived from ContentItemAssetLink + published posts)
- **SyncState**

This logical model will be refined during architecture design.

---

## 6. Acceptance Criteria Summary

| User Story | Acceptance Criteria |
|---|---|
| US-01 | Searching “beach sunset” returns matching clips with thumbnails; clicking shows location and preview. |
| US-02 | User connects Google Drive and Dropbox; search results include assets from both alongside local files. |
| US-03 | Asset detail shows if the file is on a disconnected external drive; user can see location but cannot preview until reconnected. |
| US-04 | When transcript exists, searching a spoken phrase returns the video asset at the correct timecode. |
| US-05 | Filters for type, platform, date, content pillar, and usage status return correct results. |
| US-06 | Duplicate files are grouped and user can see all locations; user can remove one reference without deleting the other. |

---

## 7. Dependencies

- **FRS-01 Core Content Record** — Assets attach to Content Items; usage history depends on links.
- **FRS-02 Idea Capture** — Captured media/links become assets or references.
- **FRS-04 Repurposing Clip Library** — Clips are assets with timecode metadata; search must include them.
- **FRS-08 Offline & Sync** — Provides local-first database and sync infrastructure.
- **FRS-07 Integrations** — Cloud storage APIs and share-sheet integrations.

---

## 8. Open Questions / Decisions Needed

1. Should the MVP include cloud storage integration (Google Drive/Dropbox) or start local-only?  
   *Confirmed: Local + Google Drive first; Dropbox/iCloud/OneDrive later. Priorities updated.*

2. Should we generate video proxies in MVP?  
   *Recommendation: Yes, but only low-resolution, with user-controlled offline caching. This is important for preview and offline access.*

3. Should duplicate detection use exact hash only, or also perceptual similarity?  
   *Recommendation: Exact hash for MVP. Perceptual later if needed.*

4. Should AI tagging (visual/content analysis) be included in MVP?  
   *Recommendation: No. Use filename, folder, existing metadata, and transcript only for MVP to avoid complexity/privacy issues.*

5. How large a library should we optimize for?  
   *Recommendation: 100,000 metadata records with acceptable search performance; original media remains external.*

---

## Change Log
| Version | Date | Summary |
|---|---|---|
| 1.1 | 2026-08-22 | Added missing MVP requirements AS-M1 to AS-M6, AS-M8, AS-M9 under Section 4.9. |
| 1.2 | 2026-08-22 | P2-4: De-duplicated content; added normative source pointers. |
| 1.2 | 2026-08-23 | Added AS-M7 Saved Searches / Smart Collections as Phase 2 to resolve skipped ID. |
