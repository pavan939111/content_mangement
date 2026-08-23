# Functional Requirements Specification — Module 05 v2
**Module:** Calendar & Readiness
**Version:** 2.0
**Date:** 2026-08-23
**Status:** Draft for Validation
**Related PRD:** docs/product/prd-v2.md
**Reference to v1:** ../archive/v1/requirements/functional/FRS-05-calendar-readiness.md

---

## 1. Purpose

This document defines the v2 delta for Calendar & Readiness.

Per ARCHITECTURE-02-next-action-precedence-v2, the v1 readiness engine (CR-32–37, CAL-10/11) is superseded by the v2 Next Action engine (CCR-20–23). The Google Calendar connector is retained.

## 2. Reference to v1 Stable Requirements

- Calendar view rendering (CAL-01 through CAL-05) remains valid
- Due-date display and filtering remain valid
- Readiness computation is superseded — see Next Action precedence decision

## 3. V2 Changes

| ID | Requirement | Priority | Description |
|---|---|---|---|
| CAL-20 | Next Action supersedes readiness | Must | The calendar view uses `next_action` from CCR-20–23 instead of the v1 readiness score. |
| CAL-21 | Google Calendar due-date events | Must | Due dates on connected records can create simple events in Google Calendar via the connector (see HAR/CNF scope). |
| CAL-22 | Calendar view shows connected records | Should | Calendar displays connected_record due dates alongside any external Calendar event links attached to records. |

## 4. Acceptance Criteria Summary

| Scenario | Criteria |
|---|---|
| Record with due date | Shows in calendar view with next_action indicator. |
| Create Calendar event | Event created once via idempotent operation; receipt logged. |

## 5. Change Log

| Version | Date | Summary |
|---|---|---|
| 2.0 | 2026-08-23 | Created v2 delta: Next Action supersedes readiness; Calendar connector retained. |
