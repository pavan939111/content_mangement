# Technical Architecture Document — ARCHITECTURE-03: Data Layer

**Product:** CreatorOS  
**Version:** 1.1  
**Status:** Updated to fix E1, E2, E3, E4, E5, and outbox boundary  
**Last Updated:** 2026-08-22  
**Related Document:** ARCHITECTURE-00 Overview, ARCHITECTURE-02 Module Design, DEC-020  

---

## 1. Purpose

This document defines the **data layer architecture** for CreatorOS. The data layer is the foundation of the local-first, offline-first system. It ensures:

- All user-created content is stored durably on-device.
- Full-text search across ideas, scripts, captions, transcripts, and metadata is fast.
- Data is encrypted at rest and isolated from original raw media.
- Transactions guarantee consistency between canonical records, sync outbox, and search index.
- Schema migrations are safe and versioned.
- File storage (thumbnails, proxies, temp files) is managed without duplicating originals.

The data layer is built on **SQLite with FTS5**, encrypted via **SQLCipher**, and exposed through repository interfaces defined in ARCHITECTURE-02.

**Important:** The database drivers are **platform-specific**: GRDB.swift on iOS, Room on Android. The shared KMP core does not perform database transactions. Transactional outbox inserts are implemented natively inside each platform repository.

---

## 2. Data Layer Responsibilities

| Responsibility | Description |
|---|---|
| Persistence | Store all user-created metadata and relationships. |
| Search | Full-text search via FTS5 across all text fields. |
| Sync Outbox | Durable queue of local changes for optional cloud replication. |
| File Management | Store app-generated thumbnails, proxies, temp files; never original raw media. |
| Encryption | Encrypt database and files at rest. |
| Transactions | Atomic multi-table writes. |
| Migrations | Forward-only, versioned schema migrations. |
| Caching | In-memory caches for performance. |
| Observability | Local logs for database operations and integrity. |

---

## 3. Technology Choices

### 3.1 SQLite + FTS5

| Choice | Rationale | Evidence |
|---|---|---|
| SQLite | Single-file, transactional, works offline, proven on mobile. | SQLite atomic commit docs |
| FTS5 | Full-text indexing with external content mode, ranking, snippets. | SQLite FTS5 docs |
| WAL mode | Better reader/writer concurrency. | SQLite WAL docs |
| External-content FTS5 | Avoids duplicating text; index is compact. | SQLite FTS5 |

### 3.2 SQLCipher

| Choice | Rationale | Evidence |
|---|---|---|
| SQLCipher | AES-256-CBC with per-page HMAC-SHA512 authentication. This is authenticated encryption, but not AEAD/GCM. | SQLCipher design docs |
| Secure key storage | Database key stored in iOS Keychain / Android Keystore. | NFR-05 |

**Correction:** Previously this document and others stated "AES-256-GCM". That was incorrect. SQLCipher uses AES-256-CBC + HMAC-SHA512. All references have been updated.

### 3.3 File Storage

- App-private directory for thumbnails, proxies, temp files.
- Encrypted at rest using OS file protection or application-layer encryption.
- Original raw media remains in user-selected locations via references.

### 3.4 Binary/Serialization

- All JSON payloads use structured formats with schema versioning.
- `Codable` (Swift) / `kotlinx.serialization` (Kotlin) for models.
- UUIDs for all records.

---

## 4. Database Schema (Logical)

Schema is organized by owning module. Tables are normalized; FTS5 external content indexes selected text columns.

### 4.1 Core Tables

*(Include all tables from previous version, but fix E4 and E5 gaps.)*

#### `publishing_state`

| Column | Type | Description |
|---|---|---|
| content_item_id | TEXT | |
| platform | TEXT | |
| state | TEXT | |
| live_url | TEXT | |
| publish_date | INTEGER | |
| error_code | TEXT | |
| error_message | TEXT | |
| attempt_count | INTEGER | |
| PRIMARY KEY | (content_item_id, platform) | Composite key |

## 4.8 Additional Tables (Schema Gaps Resolved)

### `content_pillar`

| Column | Type | Description |
|---|---|---|
| id | TEXT PK | UUID |
| name | TEXT UNIQUE | Pillar name |
| created_at | INTEGER | |

### `content_tag`

| Column | Type | Description |
|---|---|---|
| id | TEXT PK | UUID |
| name | TEXT UNIQUE | Tag name |

### `content_tag_link`

| Column | Type | Description |
|---|---|---|
| content_item_id | TEXT FK | |
| tag_id | TEXT FK | |
| PRIMARY KEY | (content_item_id, tag_id) | |

### `stage_transition`

| Column | Type | Description |
|---|---|---|
| id | TEXT PK | |
| content_item_id | TEXT FK | |
| from_stage | TEXT | |
| to_stage | TEXT | |
| timestamp | INTEGER | |
| reason | TEXT | |

### `script`

| Column | Type | Description |
|---|---|---|
| id | TEXT PK | |
| content_item_id | TEXT FK nullable | |
| title | TEXT | |
| script_text | TEXT | |
| script_type | TEXT | short, long, carousel, podcast |
| created_at | INTEGER | |
| updated_at | INTEGER | |
| deleted_at | INTEGER | |

### `script_version`

| Column | Type | Description |
|---|---|---|
| id | TEXT PK | |
| script_id | TEXT FK | |
| script_text | TEXT | |
| version_number | INTEGER | |
| created_at | INTEGER | |
| change_summary | TEXT | |

### `clip` (already in ARCH-03 but missing `content_item_id`)

Add column `content_item_id TEXT FK` to `clip` table.

### `reminder`

| Column | Type | Description |
|---|---|---|
| id | TEXT PK | |
| entity_type | TEXT | content_item, asset, clip, idea |
| entity_id | TEXT | |
| title | TEXT | |
| notes | TEXT | |
| due_date | INTEGER | |
| repeat_type | TEXT | none, daily, weekly, monthly |
| platform | TEXT | optional |
| completed | INTEGER | |
| created_at | INTEGER | |

### `trash_entry`

| Column | Type | Description |
|---|---|---|
| id | TEXT PK | |
| entity_type | TEXT | |
| entity_id | TEXT | |
| deleted_at | INTEGER | |
| retain_until | INTEGER | |

### `revision`

| Column | Type | Description |
|---|---|---|
| id | TEXT PK | |
| entity_type | TEXT | |
| entity_id | TEXT | |
| snapshot | TEXT JSON | |
| version_number | INTEGER | |
| created_at | INTEGER | |

### `backup_record`

| Column | Type | Description |
|---|---|---|
| id | TEXT PK | |
| backup_type | TEXT | local, cloud |
| file_path | TEXT | |
| created_at | INTEGER | |
| size_bytes | INTEGER | |
| checksum | TEXT | |
| status | TEXT | |

### `notification_preference`

| Column | Type | Description |
|---|---|---|
| category | TEXT PK | |
| enabled | INTEGER | |

### `storage_connection`

| Column | Type | Description |
|---|---|---|
| id | TEXT PK | |
| provider | TEXT | drive, dropbox, icloud, onedrive |
| account_id | TEXT | |
| state | TEXT | connected, disconnected, expired |
| scopes | TEXT | |
| last_sync_at | INTEGER | |
| token_metadata | TEXT JSON | (no raw token) |

### `remote_config_cache`

| Column | Type | Description |
|---|---|---|
| config_version | TEXT PK | |
| payload | TEXT JSON | |
| signature | TEXT | |
| fetched_at | INTEGER | |

### `entitlement`

| Column | Type | Description |
|---|---|---|
| user_id | TEXT PK | |
| plan_id | TEXT | |
| valid_until | INTEGER | |
| grace_until | INTEGER | |
| source | TEXT | appstore, playstore |

### `purchase_record`

| Column | Type | Description |
|---|---|---|
| transaction_id | TEXT PK | |
| product_id | TEXT | |
| store | TEXT | |
| purchased_at | INTEGER | |
| status | TEXT | |

---

## 5. Full-Text Search Schema

Use FTS5 external-content tables **with explicit triggers**. The previous statement "the FTS5 external-content index updates automatically" is false. The user must maintain triggers.

### 5.1 iOS (GRDB) FTS5 setup

```sql
CREATE VIRTUAL TABLE content_fts USING fts5(
  title,
  script_text,
  caption_text,
  transcript_text,
  filename,
  tags_text,
  content='content_item',
  content_rowid='id',
  tokenize='unicode61 remove_diacritics 2'
);

CREATE TRIGGER content_ai AFTER INSERT ON content_item BEGIN
  INSERT INTO content_fts(rowid, title, script_text, caption_text, transcript_text, filename, tags_text)
  VALUES (new.id, new.title, new.script_text, new.caption_text, new.transcript_text, new.filename, new.tags_text);
END;

CREATE TRIGGER content_ad AFTER DELETE ON content_item BEGIN
  INSERT INTO content_fts(content_fts, rowid, title, script_text, caption_text, transcript_text, filename, tags_text)
  VALUES('delete', old.id, old.title, old.script_text, old.caption_text, old.transcript_text, old.filename, old.tags_text);
END;

CREATE TRIGGER content_au AFTER UPDATE ON content_item BEGIN
  INSERT INTO content_fts(content_fts, rowid, title, script_text, caption_text, transcript_text, filename, tags_text)
  VALUES('delete', old.id, old.title, old.script_text, old.caption_text, old.transcript_text, old.filename, old.tags_text);
  INSERT INTO content_fts(rowid, title, script_text, caption_text, transcript_text, filename, tags_text)
  VALUES (new.id, new.title, new.script_text, new.caption_text, new.transcript_text, new.filename, new.tags_text);
END;
```

### 5.2 Android (Room) FTS5 setup

Use raw SQL migrations with the same trigger definitions.

---

## 6. Transaction Strategy

### 6.1 Atomic Local Writes

Every user-visible save uses a single SQLite transaction that:

1. Applies canonical table update.
2. Increments `local_revision`.
3. Updates `search_content` (or triggers update FTS).
4. Inserts `sync_operation` row if cloud backup is enabled **or if sync is enabled**.
5. Updates activity log/trash/tombstone as needed.

If any statement fails, rollback all. UI confirms only after commit.

**Outbox boundary (DEC-020):** The sync operation insert is performed by the **native repository** (GRDB/Room) within the same transaction. The shared KMP sync engine never directly writes to the outbox table; it only reads and processes queued operations.

### 6.2 Transaction Manager

`TransactionManager` exposed by native data layer:

```swift
protocol TransactionManager {
    func perform<T>(_ operation: () throws -> T) throws -> T
    func performAsync<T>(_ operation: () async throws -> T) async throws -> T
}
```

Kotlin equivalent uses `withTransaction` extension.

### 6.3 Durability Settings

| Setting | Value |
|---|---|
| Journal mode | WAL |
| Synchronous | FULL for critical edits; NORMAL for cache/index rebuild |
| Foreign keys | ON |
| Busy timeout | 3 seconds |

---

## 7. Migrations

*(Same as before)*

---

## 8. Encryption

### 8.1 Database Encryption

- Use SQLCipher with AES-256-CBC + HMAC-SHA512 (page-level).
- Database key generated randomly, stored in iOS Keychain / Android Keystore.
- Key never stored in UserDefaults/SharedPreferences or logs.
- Rekey on app update if necessary.

### 8.2 File Encryption

- Thumbnails/proxies stored in app-private directory.
- iOS: Data Protection class `Complete`.
- Android: files in internal storage; optional additional encryption if content is human-readable.

---

## 9. Caching

*(Same as before)*

---

## 10. Data Access Pattern

All repositories use asynchronous APIs. The native repository implementation includes the outbox insert.

### Swift Example

```swift
protocol AssetRepository {
    func getAsset(id: UUID) async throws -> Asset?
    func searchAssets(query: SearchQuery) async throws -> [AssetSearchResult]
    func addTag(assetId: UUID, tag: String) async throws
    func setAvailability(assetId: UUID, availability: Availability) async throws
}
```

### Kotlin Example

```kotlin
interface AssetRepository {
    suspend fun getAsset(id: String): Asset?
    suspend fun searchAssets(query: SearchQuery): List<AssetSearchResult>
    suspend fun addTag(assetId: String, tag: String)
}
```

No DAO access outside owning module. Cross-module reads through repository.

---

## 11. Data Flow Scenarios

*(Update scenario 1 to show native outbox insert)*

### 11.1 Create Content Item

1. UI → ContentViewModel.createItem()
2. ViewModel → Shared KMP CreateContentItemUseCase
3. UseCase → Native ContentRepository (iOS/Android) → Transaction:
   - insert content_item
   - insert platform_variant
   - update search_content (triggers)
   - **insert sync_operation (native)**
4. Return ContentItem to UI.

*(Other scenarios similar)*

---

## 12. Acceptance Criteria

```text
- Every user edit commits atomically before UI confirmation.
- Search returns results <=100 ms median for 1-3 keywords.
- Database encrypted at rest; key in Keychain/Keystore.
- Migrations forward-only, transactional, backup before.
- Sync operation enqueued in same transaction as local edit.
- FTS index remains consistent after any transaction (via triggers).
- Original raw media never stored in app-private directory.
- Thumbnail/proxy cache quota enforced.
- Data export includes schema version and checksum.
```

---

## 13. Source References

- [SQLite FTS5](https://www.sqlite.org/fts5.html)  
- [SQLite Atomic Commit](https://www.sqlite.org/atomiccommit.html)  
- [SQLite WAL](https://www.sqlite.org/wal.html)  
- [SQLCipher Design](https://www.zetetic.net/sqlcipher/design/)  
- [OWASP MASVS](https://mas.owasp.org/MASVS/)  
- [Android Room](https://developer.android.com/training/data-storage/room)  
- [iOS Core Data/SQLite](https://developer.apple.com/documentation/coredata)  
- [Ink & Switch Local-First](https://www.inkandswitch.com/essay/local-first/local-first.pdf)
