# Technical Architecture Document — ARCHITECTURE-14 v2: Tool Capability Matrix

**Product:** CreatorOS v2  
**Version:** 2.0  
**Status:** Draft for Validation  
**Date:** 2026-08-23  
**Related:** v2/architecture/ARCHITECTURE-13-connector-architecture-v2.md  
**Related FRS:** v2/requirements/functional/FRS-07-connector-framework-v2.md

---

## 1. Purpose

This document defines the **exact capabilities** supported for each tool connector in the CreatorOS v2 MVP.

It converts the general Connector Architecture into a concrete, buildable capability list per provider, with clear boundaries and user-visible actions.

---

## 2. Connector Types

| Tool | Connector Type |
|---|---|
| Google Drive | API Connector |
| Google Docs | API Connector |
| Google Calendar | API Connector |
| Notion | API Connector |
| Canva | Handoff Connector |
| CapCut | Handoff Connector |
| Apple Notes | Handoff Connector |

---

## 3. Capability Matrix

| Tool | Search | Read Metadata | Attach | Open | Create Draft | Export | Webhooks |
|---|---|---|---|---|---|---|---|
| Google Drive | Yes | Yes | Yes | Yes | No (MVP) | No (MVP) | Yes |
| Google Docs | Via Drive search | Yes | Yes | Yes | Yes (optional) | No | Via Drive |
| Google Calendar | Events | Yes | Yes (event link) | Yes | Yes (event) | No | Yes |
| Notion | Pages / Databases | Yes | Yes | Yes | Optional | No | Yes |
| Canva | No | Limited via link | Yes (design link) | Deep link | No | Share sheet | No |
| CapCut | No | No | Yes (project link) | Deep link / share | No | Share sheet | No |
| Apple Notes | No | No | Import/export only | Share | No | Share sheet | No |

---

## 4. MVP User-Visible Actions

### 4.1 Google Drive

- Search for files and folders within connected Drive.
- Read file/folder metadata: title, type, date, owner, URL.
- Attach a Drive file or folder as an external source on a content record.
- Open the attached file or folder in the Google Drive app or web.
- Copy link to clipboard.

### 4.2 Google Docs

- Search for documents using Drive-backed search.
- Read document title, snippet, and modified date.
- Attach an existing document as the brief/script for a record.
- Open the document in Google Docs app or web.
- Create a draft Google Doc from a CreatorOS script (optional capability, visible only if enabled).

### 4.3 Google Calendar

- List and read calendar events within a date range.
- Attach an event link to a content record.
- Open an event in Google Calendar app or web.
- Create a simple due-date event from a content record, with title and optional notes.

### 4.4 Notion

- Search accessible pages and databases.
- Read page/database title, snippet, and modified date.
- Attach a Notion page as the brief or planning reference.
- Open the page in Notion app or web.
- Copy link to clipboard.

### 4.5 Canva

- Open an existing Canva design via deep link or URL.
- Share an asset or link to Canva using the system share sheet.
- Copy design link to clipboard.

### 4.6 CapCut

- Share a prepared video or asset to CapCut using the system share sheet.
- Open a linked CapCut project or file if a deep link is available.
- Copy link or file path to clipboard for manual import.

### 4.7 Apple Notes

- Share text, images, or files to Apple Notes using the system share sheet.
- Import content from Apple Notes via share sheet or document picker.
- Open a note using a URL or share action if available.

---

## 5. Limitations

| Tool | Key Limitation |
|---|---|
| Google Drive | Avoid exporting/uploading in MVP; use share sheet or open in Drive instead. |
| Google Docs | Search is performed through Drive file metadata; exact document ID required for full content read. |
| Google Calendar | No full two-way sync; only read events and create simple due-date events. |
| Notion | No full bidirectional block-level sync; only search, metadata, attach, open. |
| Canva | Asynchronous export requires backend polling if added later; not in MVP. |
| CapCut | No public project API; handoff only. |
| Apple Notes | No public API for third-party search or sync; handoff only. |

---

## 6. Deep Reasoning Notes

- The matrix is deliberately **narrow and reliable**. Every capability we claim must be implementable with documented APIs or dependable OS handoff mechanisms.
- **Write actions are minimized** in MVP. The only write we commit to is Google Calendar event creation and optional Google Docs draft creation. Everything else is read, open, attach, or share.
- **Social platforms are intentionally absent** from the matrix. They enter Phase 2 as publishing integrations, not connected content sources.
- **CapCut and Apple Notes are handoff-only** because there is no reliable public API. This protects the product from overpromising and keeps the connector framework honest.
- **Webhooks are noted only where useful and stable**, but the MVP does not depend on them for core search or attach flows. Incremental sync is primary; webhooks are a later optimization.
- **Source provenance** from Cross-Tool Search relies on this matrix: every result card displays only the capabilities applicable to that tool.

---

## 7. MVP Boundaries

### Included

- Search, read metadata, attach, open, copy link.
- One optional write action: create Google Calendar event, optionally create Google Doc draft.
- Handoff actions for Canva, CapCut, Apple Notes via deep link/share/picker.
- Source provenance and connection health per tool.

### Excluded

- Social publishing capabilities.
- Canva export APIs.
- CapCut project automation.
- Apple Notes sync.
- General file editing inside CreatorOS.
- Team/client approvals beyond delivery share link.

---

## 8. Change Log

| Version | Date | Summary |
|---|---|---|
| 2.0 | 2026-08-23 | Created v2 tool capability matrix after deep reasoning. |
