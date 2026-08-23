# Functional Requirements Specification — Module 13 v2
**Module:** Import, Export, Backup & Restore
**Version:** 2.0
**Date:** 2026-08-23
**Status:** Draft for Validation
**Related PRD:** docs/product/prd-v2.md
**Reference to v1:** ../archive/v1/requirements/functional/FRS-13-import-export-backup-restore.md

---

## 1. Purpose

This document defines the v2 delta for Import, Export, Backup & Restore.

Per the functional module status README, this module remains valid and may reference `connected_record`.

## 2. Reference to v1 Stable Requirements

- JSON export with schema version and checksum remains valid
- Import from JSON export remains valid
- Export is never gated by subscription tier per SUB principles

## 3. V2 Changes

| ID | Requirement | Priority | Description |
|---|---|---|---|
| IMP-20 | Export includes connected records and receipts | Must | JSON export includes all connected_records, external_source_links, and action_receipts with schema version. |
| IMP-21 | Export excludes provider tokens and raw media | Must | Export contains metadata and URLs only; never OAuth tokens or binary media. |
| IMP-22 | Export available regardless of subscription tier | Must | Per SUB principles and ONB-23: export not gated by plan. |

## 4. Change Log

| Version | Date | Summary |
|---|---|---|
| 2.0 | 2026-08-23 | Created v2 delta: export includes connected records and receipts; excludes tokens and media; ungated. |
