# Functional Requirements Specification — Module 03 v2  
**Module:** Cross-Tool Search  
**Version:** 2.0  
**Status:** Draft for Validation  
**Related PRD:** v2/creator_os_prd_v2.md  
**Reference to v1:** ../../../docs/requirements/functional/FRS-03-asset-library-search.md

---

## 1. Purpose

This document defines **Cross-Tool Search** for CreatorOS v2.

It does not repeat v1 local asset library and full-text search details. Where v1 requirements remain valid, they are referenced.

Cross-Tool Search is the ability to search across a creator’s local index and connected external sources—Google Drive, Google Docs, Google Calendar, Notion—from one mobile interface, with clear source provenance and current connection status.

---

## 2. Reference to v1 Stable Requirements

The following v1 local search and asset indexing requirements remain valid and are reused:

- Local asset indexing and metadata extraction: v1 FRS-03 §4.1
- Full-text search with FTS5: v1 FRS-03 §4.3
- Thumbnail/proxy cache: v1 FRS-03 §4.1 (AS-04, AS-05)
- Filters and sorting: v1 FRS-03 §4.4
- Availability states for local/cloud/external sources: v1 FRS-03 §4.5

Where v2 changes behavior, the new requirements below supersede v1.

---

## 3. New Definitions

| Term | Definition |
|---|---|
| Federated Search | A search query that returns results from multiple connected sources and the local index in one view. |
| Source Provenance | Metadata showing which connected account or local index produced a result. |
| Connected Source | An external tool account linked to CreatorOS via OAuth. |
| Result Card | A normalized UI representation of a search result, preserving source-specific details. |
| Stale Result | A result whose source connection has expired or whose metadata may be outdated. |
| Resolution Waterfall | An ordered attempt to resolve an ambiguous query against local index first, then connected sources in a defined order. |

---

## 4. Functional Requirements

### 4.1 Unified Search Input

| ID | Requirement | Priority | Description |
|---|---|---|---|
| CTS-01 | The system shall provide a single search bar accessible from all primary screens. | Must | Central entry point. |
| CTS-02 | The search bar shall support querying across local index and connected sources. | Must | Federated search. |
| CTS-03 | The system shall debounce input by 100–150 ms and cancel in-flight queries when new input arrives. | Must | Performance. |
| CTS-04 | The system shall support minimum query length of 2 characters for live search. | Must | Avoid noise. |
| CTS-05 | The system shall preserve recent searches and provide clear zero-result suggestions. | Should | Usability. |

### 4.2 Local-First Search Layer

| ID | Requirement | Priority | Description |
|---|---|---|---|
| CTS-10 | The system shall search the local index first and return instant results before external source queries complete. | Must | Local-first. |
| CTS-11 | Local results shall include ideas, scripts, content records, assets, clips, and tags. | Must | Scope. |
| CTS-12 | Local search shall work offline with cached metadata and FTS index. | Must | Offline. |
| CTS-13 | Local results shall display source as “On this device” and include last-updated timestamp. | Must | Provenance. |

### 4.3 External Source Search

| ID | Requirement | Priority | Description |
|---|---|---|---|
| CTS-20 | When the user has connected sources, the system shall append external results after local results. | Must | Federated. |
| CTS-21 | External source queries shall be executed via the CreatorOS backend or provider API, not direct mobile-to-provider bulk calls. | Must | Reliability and rate limits. |
| CTS-22 | External results shall be clearly labeled by provider: Google Drive, Google Docs, Google Calendar, Notion. | Must | Provenance. |
| CTS-23 | Each external result shall include provider icon, title, external URL, last updated timestamp, and connection status. | Must | Context. |
| CTS-24 | If a connected source is stale, expired, or unavailable, the system shall mark its results as possibly outdated or hide them with a clear message. | Must | Trust. |
| CTS-25 | The user shall be able to filter results by source, type, date, and status. | Should | Refinement. |
| CTS-26 | The user shall be able to open an external result in its native app or web via deep link or URL. | Must | Handoff. |

### 4.4 Search Result Normalization

| ID | Requirement | Priority | Description |
|---|---|---|---|
| CTS-30 | The system shall normalize results into a common card format while preserving provider-specific details. | Must | UX. |
| CTS-31 | Each card shall show: title, source badge, type, date, snippet, and available actions. | Must | Readable. |
| CTS-32 | The system shall allow tapping a result to preview, open, attach to a content record, or copy link. | Must | Actionable. |
| CTS-33 | The system shall show a loading indicator for external source results that are still fetching. | Must | Feedback. |

### 4.5 Source Resolution & Provenance

| ID | Requirement | Priority | Description |
|---|---|---|---|
| CTS-40 | The system shall use a strict resolution order: local index → explicit linked source object ID → connected source search result → user choice. | Must | No silent ambiguity. |
| CTS-41 | When a search result is from a connected source, the system shall store source provider, external object ID if available, canonical URL, and match confidence. | Must | Traceability. |
| CTS-42 | The system shall not automatically assume that similarly named results are the same object without user confirmation. | Must | Avoid wrong linking. |
| CTS-43 | The system shall display match confidence only when the result was resolved via metadata or fuzzy match. | Should | Transparency. |

### 4.6 Connection Health in Search

| ID | Requirement | Priority | Description |
|---|---|---|---|
| CTS-50 | The search interface shall indicate when a connected source is unhealthy or stale. | Must | Trust. |
| CTS-51 | If a source is unhealthy, the system shall show a banner: “Some results may be outdated. Reconnect [source].” | Must | Action. |
| CTS-52 | The system shall not silently omit unhealthy sources without explicit user awareness. | Must | Transparency. |
| CTS-53 | Reconnecting a source shall refresh its search results and update source status. | Should | Recovery. |

### 4.7 Offline & Sync Behavior

| ID | Requirement | Priority | Description |
|---|---|---|---|
| CTS-60 | Local search shall work fully offline. | Must | Mobile-first. |
| CTS-61 | External source results from the last successful sync shall be available offline, with a timestamp of last fetch. | Should | Context. |
| CTS-62 | When offline, the system shall show a banner: “Showing cached results. Connect to search [source] live.” | Must | Clarity. |
| CTS-63 | A queued external search shall execute automatically when connectivity returns. | Should | Continuity. |

---

## 5. MVP Boundaries

### Included

- Local search across CreatorOS records, ideas, scripts, assets, tags.
- External search for Google Drive, Google Docs, Google Calendar, Notion.
- Source badges and connection-aware result warnings.
- Open external result in native app/web.
- Basic filters by source and type.

### Excluded

- Social platform search.
- AI semantic search.
- Full content indexing of all external documents without user selection.
- General web search.

---

## 6. Acceptance Criteria Summary

| Scenario | Acceptance Criteria |
|---|---|
| Local search | User searches a term offline and sees local results instantly. |
| Federated search | User with connected Drive/Notion sees external results labeled by source. |
| Source health | Expired Drive token shows a warning and omits or flags Drive results. |
| Open external result | Tapping a Drive result opens the file in Google Drive app or web. |
| Source provenance | A result from Notion shows Notion icon, page title, URL, and last updated. |
| Offline external results | Cached external results show with last fetch timestamp. |

---

## 7. Change Log

| Version | Date | Summary |
|---|---|---|
| 2.0 | 2026-08-23 | New v2 document for Cross-Tool Search. References v1 for local FTS and asset indexing. |
