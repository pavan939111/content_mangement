# Glossary

**Product:** CreatorOS  
**Version:** 1.0  
**Purpose:** Defines terms used across requirements and architecture.

| Term | Definition |
|---|---|
| Asset | Any indexed file (video, image, audio, document, PDF) or referenced external file. |
| Availability | The current state of an asset's original file: available, cloud_only, external_disconnected, cached_preview, missing, permission_denied. |
| Backlog | Scheduling lane for ideas that are not yet planned for a specific date. |
| Batch production | Creating multiple pieces of content in a single session to increase efficiency. |
| Capability matrix | A structured registry of supported capabilities per connector. In v2, it defines which actions (search, read, attach, open, create, export, notify) are available for each connected tool. It replaces the v1 publishing-specific meaning. |
| Clip | A selected in/out range of a source video or audio asset, stored for reuse. |
| Content item | The central record representing a piece of content from idea to published post. |
| Content pillar | A recurring theme or category of content (e.g., tutorials, behind-the-scenes). |
| Derived content | A content item created from another source item (e.g., Short from long video). |
| Durable outbox | Local table storing pending sync operations atomically with content changes. |
| Evergreen | Content that remains relevant over time and can be reused or reposted. |
| FTS5 | SQLite full-text search module used for indexing and querying text. |
| Indexing | Scanning files and extracting metadata, thumbnails, and optional proxies. |
| Native handoff | Manual publishing flow where the user finishes posting in the platform app. |
| Platform variant | Platform-specific version of caption, title, hashtags, or cover for a content item. |
| Proxy | Low-resolution video/audio preview generated for fast playback. |
| Readiness | Computed state indicating whether a content item has all required assets for its stage. |
| Scheduling lane | Classification of planned content: fixed, evergreen, trend-responsive, backlog. |
| Source/derivative | Relationship between original content and repurposed derivatives. |
| Storage source | User-selected folder, drive, or cloud provider containing assets. |
| Sync outbox | Same as durable outbox; table of operations to upload to cloud backup. |
| Thumbnail | Small image preview of an asset. |
| Tombstone | Marker indicating a record was deleted, used for sync propagation. |
| Variant | See Platform variant. |
| Connected Content Record | A content record that links to external sources and records actions/handoffs. |
| External Source Link | A reference to a real object in an external tool (Google Doc, Drive folder, Notion page, Canva design). |
| Source Provenance | Metadata describing how a link was resolved: explicit URL, object ID, canonical URL, metadata match, or user confirmation. |
| Next Action | The single most important action a creator should take next for a content record, computed from missing or stale required links. |
| Action Receipt | An append-only, timestamped record of an action performed on or through a content record. |
| Connection Health | Aggregated status of all external sources linked to a record: healthy, stale, needs reauthorization, error. |
| Connected Source | An external tool account linked to CreatorOS via OAuth. |
| Stale Result | A search result whose source connection has expired or whose metadata may be outdated. |
| Resolution Waterfall | An ordered attempt to resolve an ambiguous query against local index first, then connected sources in a defined order. |
| Handoff | A user-initiated action that moves or opens content in an external tool. |
| Verified Outcome | An outcome confirmed by an external system or provider. |
| User-Confirmed Outcome | An outcome confirmed by the creator manually, not by the external system. |
| Normalized Index | Backend service storing searchable metadata from connected sources for fast retrieval. |
| Connector | A module that enables CreatorOS to search, read, attach, open, or handoff content from one external tool. |

---

## Change Log

| Version | Date | Summary |
|---|---|---|
| 1.0 | 2026-08-22 | Created glossary. |
