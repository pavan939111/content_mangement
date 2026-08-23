# Functional Requirements Specification — Module 04 v2
**Module:** Repurposing Clip Library
**Version:** 2.0
**Date:** 2026-08-23
**Status:** Draft for Validation
**Related PRD:** docs/product/prd-v2.md
**Reference to v1:** ../archive/v1/requirements/functional/FRS-04-repurposing-clip-library.md

---

## 1. Purpose

This document defines the v2 delta for the Repurposing Clip Library.

Per the functional module status README, this module remains valid but is **not central to the v2 MVP**. The clip library applies to content records (`connected_record`).

## 2. Reference to v1 Stable Requirements

All v1 clip library requirements remain valid where applicable:

- Marking clips within longer videos with start/end timestamps
- Clip tagging, searching, and filtering
- Linking clips to parent content items
- Export of clip metadata

## 3. V2 Changes

| ID | Requirement | Priority | Description |
|---|---|---|---|
| CLP-20 | Clips attach to connected records | Should | When used in v2, clips shall link to `connected_record` instead of v1 `content_item`. |
| CLP-21 | Not required for MVP launch | Phase 2 | This module is not an MVP launch blocker. Implement if capacity allows after core connector/search/receipt features are complete. |

## 4. Change Log

| Version | Date | Summary |
|---|---|---|
| 2.0 | 2026-08-23 | Created v2 delta referencing v1; scoped as non-central to MVP. |
