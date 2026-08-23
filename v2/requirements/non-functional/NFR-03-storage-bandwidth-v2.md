# Non-Functional Requirements — NFR-03 v2: Storage & Bandwidth

**Product:** CreatorOS v2  
**Version:** 2.0  
**Status:** Draft for Validation  
**Date:** 2026-08-23  
**Reference to v1:** ../../../docs/requirements/non-functional/NFR-03-storage-bandwidth.md

## 1. Purpose

This document defines v2-specific storage and bandwidth requirements for connected-tool metadata and API usage.

The v1 storage model for local metadata, thumbnails, and caches remains valid and is referenced.

## 2. New v2 Requirements

| ID | Requirement | Priority | Description |
|---|---|---|---|
| SWB-01 | Connector API quota monitoring | Must | The system shall track provider API usage per connected account and enforce provider-specific quotas from remote config. |
| SWB-02 | External metadata cache | Must | The system shall cache external source metadata locally only for active content records and recent search results. |
| SWB-03 | Raw media never uploaded | Must | The system shall never upload raw media to the CreatorOS backend; only metadata and user-approved thumbnails/proxies are transferred. |
| SWB-04 | Provider API bandwidth | Must | The system shall batch background provider calls and avoid transferring more data than necessary. |
| SWB-05 | Cache eviction for external results | Should | External search result cache shall be evicted by age and usage to control storage footprint. |
| SWB-06 | Cost visibility | Must | The app shall show connector API usage and any applicable costs where relevant, especially for metered cloud actions. |

## 3. References

- Local cache quotas: v1 NFR-03 §5
- Bandwidth policies: v1 NFR-03 §6
- Export/portability: v1 NFR-03 §7

## 4. Acceptance Criteria

- Provider API quota is visible and enforced.
- External metadata cache stays under the configured limit.
- No raw media is transmitted to CreatorOS backend.
- Background sync respects user mobile data settings.

## 5. Change Log

| Version | Date | Summary |
|---|---|---|
| 2.0 | 2026-08-23 | Added connector API quota and external metadata cache requirements. |
