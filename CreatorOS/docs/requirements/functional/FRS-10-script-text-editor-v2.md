# Functional Requirements Specification — Module 10 v2
**Module:** Script & Text Editor
**Version:** 2.0
**Date:** 2026-08-23
**Status:** Draft for Validation
**Related PRD:** docs/product/prd-v2.md
**Reference to v1:** ../archive/v1/requirements/functional/FRS-10-script-text-editor.md

---

## 1. Purpose

This document defines the v2 delta for Script & Text Editor.

Per the functional module status README, this module remains valid and works on `connected_record`.

## 2. Reference to v1 Stable Requirements

All v1 editor requirements remain valid:

- Markdown-based rich text (bold, italic, headings, lists, blockquote) per DEC-024
- Auto-save with debounce
- Word count and reading time
- Undo/redo history
- Version comparison view

## 3. V2 Changes

| ID | Requirement | Priority | Description |
|---|---|---|---|
| SE-20 | Editor operates on connected_record fields | Must | Scripts and notes edited are stored against `connected_record` notes field, not v1 `content_item`. |
| SE-21 | Optional external script link | Should | A connected_record may link to an external Google Doc or Notion page as the authoritative script source via source_link; internal editor used when no external link exists. |

## 4. Change Log

| Version | Date | Summary |
|---|---|---|
| 2.0 | 2026-08-23 | Created v2 delta referencing v1; editor operates on connected_record. |
