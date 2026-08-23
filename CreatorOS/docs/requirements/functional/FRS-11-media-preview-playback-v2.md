# Functional Requirements Specification — Module 11 v2
**Module:** Media Preview & Playback
**Version:** 2.0
**Date:** 2026-08-23
**Status:** Draft for Validation
**Related PRD:** docs/product/prd-v2.md
**Reference to v1:** ../archive/v1/requirements/functional/FRS-11-media-preview-playback.md

---

## 1. Purpose

This document defines the v2 delta for Media Preview & Playback.

Per the functional module status README, this module remains valid and works with external source references.

## 2. Reference to v1 Stable Requirements

- Thumbnail generation for video/image files remains valid
- Inline preview for common formats remains valid
- Playback controls for video clips remain valid

## 3. V2 Changes

| ID | Requirement | Priority | Description |
|---|---|---|---|
| MED-20 | External source preview via provider thumbnail | Should | For linked Drive files, CreatorOS may fetch and cache provider-generated thumbnails where scope permits. Raw media is never downloaded to device storage. |
| MED-21 | Open externally for full playback | Must | Full playback delegates to the native provider app or web browser via canonical URL. CreatorOS does not stream raw media itself. |

## 4. Change Log

| Version | Date | Summary |
|---|---|---|
| 2.0 | 2026-08-23 | Created v2 delta: preview via provider thumbnails only; playback delegates externally. |
