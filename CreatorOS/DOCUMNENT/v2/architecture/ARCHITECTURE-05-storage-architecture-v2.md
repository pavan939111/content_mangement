# Technical Architecture Document — ARCHITECTURE-05 v2: Storage Architecture

**Product:** CreatorOS v2  
**Version:** 2.0  
**Status:** Draft for Validation  
**Date:** 2026-08-23  
**Reference to v1:** ../../../docs/architecture/ARCHITECTURE-05-storage-architecture.md

## 1. Purpose

This document defines **v2 storage architecture** for external source metadata and provider indexing.

The v1 local storage model, BYO-storage, thumbnails/proxies, and cache quotas remain authoritative.

## 2. New Storage Concepts

| Concept | Description |
|---|---|
| External Source Catalog | Normalized metadata for linked provider objects. |
| Provider Metadata Cache | Title, URL, updated_at, content hash, source status. |
| Action Receipt Store | Append-only receipt storage. |
| Connection Health Store | Per-account health state. |

## 3. Storage Locations

| Data | Location |
|---|---|
| Local connected records | Local SQLite |
| External source links | Local SQLite |
| Action receipts | Local SQLite + backend operation log |
| Provider metadata cache | Backend normalized index + local cache for active records |
| Raw provider files | Never stored by CreatorOS |
| Provider thumbnails/previews | Local cache only where user-approved |

## 4. Quotas and Cost Control

- Provider API usage tracked separately from local storage.
- External metadata cache limited to active records and recent searches.
- Raw media upload is prohibited.

## 5. Reference to v1 Stable Storage

- Local file storage layout: v1 ARCH-05 §4
- External drive indexing: v1 ARCH-05 §5
- Thumbnail/proxy pipeline: v1 ARCH-05 §7
- Cache quotas: v1 ARCH-05 §8

## 6. Change Log

| Version | Date | Summary |
|---|---|---|
| 2.0 | 2026-08-23 | Added external source metadata and provider cache architecture. |
