# Functional Requirements Specification — Module 12 v2
**Module:** Notifications, Reminders & Trash
**Version:** 2.0
**Date:** 2026-08-23
**Status:** Draft for Validation
**Related PRD:** docs/product/prd-v2.md
**Reference to v1:** ../archive/v1/requirements/functional/FRS-12-notifications-reminders-trash.md

---

## 1. Purpose

This document defines the v2 delta for Notifications, Reminders & Trash.

Per the functional module status README, this module remains valid and works with `connected_record`.

## 2. Reference to v1 Stable Requirements

- Local notifications for reminders remain valid (DEC-025: local notifications MVP; remote push Phase 2)
- Trash/soft-delete with recovery window remains valid
- Notification preferences screen remains valid

## 3. V2 Changes

| ID | Requirement | Priority | Description |
|---|---|---|---|
| NRT-20 | Trash operates on connected_record | Must | Soft-delete applies to `connected_record`; recovery window per v1 spec. |
| NRT-21 | Connection health notifications | Must | When a connection transitions to reauth_required or error state, the system shall show a local notification prompting reconnect per CNF-34. |
| NRT-22 | Delivery reminder | Should | If a connected_record has a due date and status is not Delivered, the system may show a local reminder notification at user-configured lead time. |

## 4. Change Log

| Version | Date | Summary |
|---|---|---|
| 2.0 | 2026-08-23 | Created v2 delta: trash on connected_record; connection health notifications; delivery reminders. |
