# Technical Architecture Document — ARCHITECTURE-05: Storage Architecture

**Product:** CreatorOS  
**Version:** 1.0  
**Status:** Draft for Review  
**Related Document:** ARCHITECTURE-00 Overview, ARCHITECTURE-03 Data Layer, NFR-03 Storage & Bandwidth, NFR-04 Battery/Thermal/Memory  
**Focus:** Local file storage, external drive indexing, cloud storage integration, thumbnail/proxy pipeline, cache management, availability tracking

---

## 1. Purpose

This document defines the **storage architecture** for CreatorOS. The app manages a large catalog of user-owned media but **does not store raw media itself**. It references files in user-selected locations and stores only lightweight metadata, thumbnails, and optional low-resolution proxies.

The storage architecture ensures:

- No duplication of user raw media.
- Persistent references to local, external, and cloud files.
- Availability tracking even when sources are disconnected.
- Efficient thumbnail/proxy generation and cache management.
- Storage quotas that protect user device capacity.
- Security and privacy for app-generated previews.
- Seamless integration with existing cloud providers.

This architecture directly supports FRS-03 Asset Library, FRS-07 Integrations & Storage Connections, and FRS-11 Media Preview & Playback.

---

## 2. Storage Principles

1. **Bring-your-own-storage**: raw media stays in user-selected locations.
2. **Metadata-first**: only lightweight metadata is stored in local database.
3. **Preview caching**: thumbnails and proxies are generated and cached for fast access.
4. **Availability transparency**: every asset shows current availability.
5. **Non-destructive**: the app never deletes, moves, or renames user originals.
6. **Quota-controlled**: app-generated caches have explicit storage limits.
7. **Offline-friendly**: cached previews remain available offline.
8. **Privacy-preserving**: all previews/metadata encrypted at rest.

---

## 3. Storage Types and Ownership

| Storage Type | Description | Ownership | Managed by CreatorOS |
|---|---|---|---|
| Raw media | User videos, images, audio | User (local/cloud/external) | No — only referenced |
| Metadata database | SQLite + FTS5 | App-private | Yes |
| Thumbnails | 256–512 px previews | App-private cache | Yes |
| Proxies | Low-res video/audio previews | App-private cache | Yes |
| Temp files | Transcode/export intermediates | App-private temp | Yes, auto-cleaned |
| Export archives | User-initiated exports | User-selected location | No |
| Local backups | Metadata DB snapshots | App-private | Yes |
| Cloud metadata backup | Optional encrypted metadata | CreatorOS backend | Yes (if enabled) |

---

## 4. Local File Storage Layout

### 4.1 App-Private Directory Structure

```
AppPrivate/
├── Database/
│   ├── creatoros.sqlite
│   └── backups/
│       ├── backup_2026-08-22T10-00-00Z.sqlite.enc
│       └── ...
├── Thumbnails/
│   ├── {asset_id}.jpg
│   └── ...
├── Proxies/
│   ├── {asset_id}.mp4
│   └── ...
├── Temp/
│   ├── transcode_...tmp
│   └── ...
├── Exports/
│   └── ...
└── Logs/
    └── ...
```

### 4.2 Platform Directories

| Platform | App-Private Path | Notes |
|---|---|---|
| iOS | `Application Support/` and `Caches/` | Database and user data in `Application Support`; thumbnails/proxies in `Caches` or `Application Support` depending on criticality. |
| Android | `filesDir/` and `cacheDir/` | Database and persistent metadata in `filesDir`; rebuildable caches in `cacheDir`. |

### 4.3 File Protection

- iOS: `FileProtectionType.complete` for sensitive files, especially database and metadata. Thumbnails/proxies can use `completeUnlessOpen` if background processing requires access while locked, but must be encrypted.
- Android: Internal storage is already sandboxed; optional application-layer encryption for thumbnails/proxies.

---

## 5. External Drive Indexing

### 5.1 Source Registry

Every user-selected source (folder, drive, cloud) is registered as a `StorageSource`:

```json
{
  "source_id": "uuid",
  "kind": "local_folder | cloud_provider | external_drive",
  "uri": "content://... or /path or drive://",
  "display_name": "My SSD",
  "permission_state": "granted | revoked | expired",
  "last_scan_cursor": "opaque",
  "last_scan_at": "timestamp",
  "availability": "online | disconnected"
}
```

### 5.2 Indexing Workflow

1. User selects folder/drive via system picker (SAF/Files).
2. App persists URI permissions.
3. Background scanner enumerates files, extracting basic metadata.
4. For each file, creates an `Asset` record and stores source reference.
5. Generates thumbnail/proxy later, based on priority.

### 5.3 Disconnected Drive Behavior

- When external drive unavailable, assets remain searchable by metadata/thumbnail.
- `availability` set to `disconnected`.
- Original file cannot be previewed unless proxy cached.
- On reconnect, app detects source and offers update/reindex.
- Cached thumbnails/proxies remain accessible offline.

### 5.4 Source Signature

Each asset has a `source_signature`:

```
source_signature = sha256(provider_id + ":" + uri + ":" + size + ":" + mtime)
```

Used to detect if file changed and whether cached preview is stale.

---

## 6. Cloud Storage Integration

### 6.1 Supported Providers

| Provider | MVP Priority | Access Pattern |
|---|---|---|
| Google Drive | Must | OAuth 2.0, read-only file listing + metadata |
| Dropbox | Should | OAuth 2.0, file listing + metadata |
| iCloud Drive | Phase 2 | Files provider integration |
| OneDrive | Phase 2 | OAuth 2.0 |

### 6.2 Access Model

- OAuth 2.0 with PKCE.
- Read-only access to selected folders by default.
- App never modifies/deletes remote files.
- Metadata indexing only; raw files not downloaded unless user explicitly requests.
- Optional streaming or download for preview when no proxy exists.

### 6.3 Folder Selection

- User selects specific folders, not entire drive.
- Folder selection stored as `CloudFolderSource` with provider, folder ID, name.
- Background refresh updates metadata on schedule or user action.

### 6.4 Rate Limits and Sync

- Respect provider rate limits and pagination.
- Use server-side caching for provider metadata to reduce app-side API calls.
- Offline: previously indexed cloud metadata remains searchable.

---

## 7. Thumbnail & Proxy Generation Pipeline

### 7.1 Thumbnail Generation

| Asset Type | Method | Priority |
|---|---|---|
| Image | Decode with OS image APIs at target size | High |
| Video | Extract representative frame using `MediaMetadataRetriever` (Android) / AVFoundation (iOS) | High |
| PDF | Render first page | Medium |
| Audio | Generate waveform or generic icon | Low |
| Unsupported | Generic placeholder | Low |

### 7.2 Proxy Generation

**Note:** Video proxy generation is deferred to Phase 2. In MVP, offline preview and clip marking work only for locally available originals.

Proxies are low-resolution MP4/H.264 previews:

- Resolution: 360p (360×640 vertical / 640×360 horizontal)
- Frame rate: 15 fps default
- Audio: AAC-LC 32–64 kbps
- Bitrate: 350–700 kbps video
- Keyframe interval: 1–2 s
- Size: ~3–6 MB per minute

Generated only for:
- Selected/pinned projects
- Recently opened videos
- Explicitly marked for offline preview
- Clip marking/transcript search workflows

### 7.3 Pipeline Stages

```
Source file
  → Metadata extraction
  → Thumbnail generation (if needed)
  → Proxy generation (optional, queued)
  → Cache write (atomic rename)
  → Database update (asset_id, paths, source_signature)
```

### 7.4 Concurrency and Throttling

- Thumbnail generation: max 1–2 concurrent tasks.
- Proxy generation: 1 task, charging/idle only.
- Pause/resume with checkpoints.
- Thermal/battery-aware as per NFR-04.

---

## 8. Cache Management and Quotas

> **Normative source:** [NFR-03-storage-bandwidth.md](../requirements/non-functional/NFR-03-storage-bandwidth.md), section 5.

---|---|---|
| Thumbnails | 512 MB or 5% free storage | LRU |
| Proxies | Disabled; 1–2 GB when enabled | User-controlled / LRU |
| Temp | 250 MB | Auto-delete after task |
| Logs | 25–50 MB | Rotate and prune |
| Database WAL | Monitor | Checkpoint on idle |

### 8.2 Low Storage Behavior

| Free Storage | Action |
|---|---|
| <10% | Stop thumbnail backlog and proxy work |
| <5 GB | Warn before proxy generation |
| <2 GB | Disable proxy generation and aggressive cache growth |
| <1 GB | Clear rebuildable preview cache first, protect metadata DB |

### 8.3 User Controls

- Clear thumbnail cache
- Clear proxy cache
- Clear temp files
- Set cache quotas
- View cache breakdown
- Mark projects for offline caching

---

## 9. Availability State Machine

| State | Meaning | User-Facing Behavior |
|---|---|---|
| `available` | Original accessible locally or via cloud | Full preview/playback possible |
| `cached_preview` | Only proxy/thumbnail available | Preview proxy; original not available |
| `cloud_only` | Original in cloud, no proxy | Show thumbnail; stream/download on user action |
| `external_disconnected` | External drive not mounted | Show metadata/thumbnail; mark original unavailable |
| `missing` | File not found at last known location | Show placeholder; offer locate/relink |
| `permission_denied` | Source permission revoked | Show metadata; link to settings |

The availability state is computed dynamically from source registry and file presence.

---

## 10. Data Deletion and Integrity

- Deleting an asset reference never deletes original file.
- Deleting thumbnail/proxy is always safe; can regenerate.
- Local backups preserve metadata; raw media is user’s responsibility but references remain.
- Soft delete assets by setting `deleted_at`; sync tombstones if cloud backup enabled.
- Permanent purge removes only app metadata/cache, never originals.

---

## 11. Security and Privacy

- App-private files encrypted at rest.
- Thumbnails/proxies may contain personal content; encrypted.
- Cloud sync of thumbnails/proxies is optional and encrypted.
- OAuth tokens never stored in file system; in Keychain/Keystore.
- No raw media transmitted to any server.
- Source URIs/paths are sensitive; stored in encrypted DB only.

---

## 12. Acceptance Criteria

```text
- Raw media never stored in app-private directory.
- Assets searchable after external drive disconnect.
- Thumbnails load <=500 ms uncached for images, <=1 s for videos.
- Proxy generation requires charging or explicit user action.
- Cache quotas enforced; LRU eviction works.
- Source signature detects changes.
- Availability states update correctly.
- Deleting asset reference doesn't delete original.
- Cloud storage integrations read-only; no remote modification.
- All app-generated caches encrypted at rest.
- Storage full errors handled gracefully, no data loss.
```

---

## 13. Source References

- [Android Storage Access Framework](https://developer.android.com/training/data-storage/shared/documents-files)  
- [Android MediaMetadataRetriever](https://developer.android.com/reference/android/media/MediaMetadataRetriever)  
- [Apple File System Programming Guide](https://developer.apple.com/library/archive/documentation/FileManagement/Conceptual/FileSystemProgrammingGuide/Introduction/Introduction.html)  
- [Apple Quick Look Thumbnailing](https://developer.apple.com/documentation/quicklookthumbnailing)  
- [Apple AVFoundation Export Presets](https://developer.apple.com/documentation/avfoundation/export-presets)  
- [Google Drive API](https://developers.google.com/drive/api)  
- [Dropbox API](https://www.dropbox.com/developers/documentation)  
- [SQLCipher](https://www.zetetic.net/sqlcipher/)

---



| 1.2 | 2026-08-22 | P2-4: De-duplicated content; added normative source pointers. |
