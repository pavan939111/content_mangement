# Non-Functional Requirements — NFR-07 v2: App Size & Resource

**Product:** CreatorOS v2
**Version:** 2.0
**Date:** 2026-08-23
**Status:** Draft for Validation
**Reference to v1:** ../archive/v1/requirements/non-functional/NFR-07-app-size-resource.md
**Related:** ARCHITECTURE-11-technology-stack-v2.md, ARCHITECTURE-17 (spike tracker size estimates)

---

## 1. Purpose

This document defines the v2 delta for app binary size and resource footprint given the addition of backend-connected features.

## 2. Reference to v1 Stable Requirements

- Baseline app size targets without connector SDKs remain valid
- Asset optimization guidelines (image formats, font subsetting) remain valid

## 3. New v2 Requirements

| ID | Requirement | Priority | Description |
|---|---|---|---|
| ASR-20 | No heavy provider SDKs on mobile | Must | Google Drive/Calendar and Notion SDKs shall not be bundled in mobile binaries. All provider API calls route through the BFF/connector service. Mobile uses lightweight HTTP client only. |
| ASR-21 | Binary size delta budget | Must | Total added binary size from v2 dependencies (RevenueCat SDK, Sentry updates, KMP runtime if confirmed) shall not exceed spike-tracker estimates: 4.5 MB Android max; 6.5 MB iOS max. Exceeding requires architecture review. |
| ASR-22 | Local storage quota for cached metadata | Should | Local SQLite database plus cached external metadata should not exceed 200 MB for a typical user with 1000 connected records at 100k indexed items. LRU eviction applies per NFR-04 BTM-22. |
| ASR-23 | Dependency audit before RC | Must | A dependency tree audit shall confirm no unused or oversized libraries are bundled in the release build. Tree-shaking and proguard rules applied where applicable. |

## 4. Acceptance Criteria

- Release build binary size measured against baseline; delta documented and within budget.
- No direct Google or Notion SDK imports present in mobile source code (CI lint check).
- Storage usage after synthetic corpus indexing within defined quota.

## 5. Change Log

| Version | Date | Summary |
|---|---|---|
| 2.0 | 2026-08-23 | Created v2 delta: no mobile provider SDKs, binary size delta budget, storage quota, dependency audit gate. |
