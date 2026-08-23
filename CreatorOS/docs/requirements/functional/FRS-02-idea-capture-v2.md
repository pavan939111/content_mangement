# Functional Requirements Specification — Module 02 v2
**Module:** Idea Capture
**Version:** 2.0
**Date:** 2026-08-23
**Status:** Draft for Validation
**Related PRD:** docs/product/prd-v2.md
**Reference to v1:** ../archive/v1/requirements/functional/FRS-02-idea-capture.md

---

## 1. Purpose

This document defines the v2 delta for Idea Capture. It does not repeat v1 content.

Idea capture remains a core offline-first capability. In v2, captured ideas can be promoted to Connected Content Records (`connected_record`) rather than v1 `content_item`.

## 2. Reference to v1 Stable Requirements

The following v1 requirements remain valid where applicable:

- Quick capture with minimal friction (CAP-01 through CAP-05)
- Voice capture with transcription (CAP-06 through CAP-08; see CAP-M8 for MVP English-only scope)
- Photo/attachment capture (CAP-09, CAP-10)
- Capture queue durability when offline (CAP-11)
- Tag/pillar assignment at capture time (CAP-12)

## 3. V2 Changes

| ID | Requirement | Priority | Description |
|---|---|---|---|
| CAP-20 | Promote to connected record | Should | A captured idea shall be promotable to a `connected_record` via explicit user action, carrying over title, notes, tags, and pillar. |
| CAP-21 | Capture works without any connection | Must | Idea creation is fully local; no account or network required for initial capture. |
| CAP-22 | Captured ideas searchable in local FTS | Must | Idea text indexed in FTS5 alongside connected records per TDD-01. |

## 4. Acceptance Criteria Summary

| Scenario | Criteria |
|---|---|
| Capture while offline | Idea saved locally; visible in list; queued for sync if account active. |
| Voice capture (English) | Transcription appears; user can edit before saving. |
| Promote idea to record | New `connected_record` created with carried-over fields; idea marked as promoted. |

## 5. Change Log

| Version | Date | Summary |
|---|---|---|
| 2.0 | 2026-08-23 | Created v2 delta referencing v1 stable requirements; added promotion to connected_record. |
