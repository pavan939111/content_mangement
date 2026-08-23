# Non-Functional Requirements — NFR-04 v2: Battery, Thermal & Memory

**Product:** CreatorOS v2
**Version:** 2.0
**Date:** 2026-08-23
**Status:** Draft for Validation
**Reference to v1:** ../archive/v1/requirements/non-functional/NFR-04-battery-thermal-memory.md
**Related:** NFR-01-performance-v2.md, TDD-02 (background sync), ARCHITECTURE-17 (spike tracker)

---

## 1. Purpose

This document defines the v2 delta for battery, thermal, and memory constraints introduced by connector-aware background sync and external search.

The v1 local-only battery/thermal/memory budgets remain valid as a baseline.

## 2. Reference to v1 Stable Requirements

- Background task energy budgets per platform remain valid
- Thermal throttling behavior on sustained workloads remains valid
- Memory ceiling targets per device tier remain valid

## 3. New v2 Requirements

| ID | Requirement | Priority | Description |
|---|---|---|---|
| BTM-20 | Connector sync energy budget | Must | Incremental provider sync jobs shall not consume more than 5% of daily battery budget per connection under normal usage (4 or fewer syncs per day per connection). Full resync is user-initiated only. |
| BTM-21 | No background polling loops | Must | The app shall not maintain persistent network connections or tight polling loops in the background. Sync is event-driven (foreground, network restore) or scheduled via BGTaskScheduler/WorkManager with minimum intervals. |
| BTM-22 | Normalized index cache memory cap | Must | Cached external search results and normalized metadata held locally shall be bounded by an LRU eviction policy with a configurable memory ceiling (default: 50 MB). |
| BTM-23 | Thermal awareness for bulk operations | Should | If the OS signals thermal throttling during a full resync or FTS rebuild, the system shall pause non-critical work until temperature normalizes. |
| BTM-24 | Spike-tracker memory gates apply | Must | Sustained-session memory growth budgets from ARCHITECTURE-17 (under 15% mid-range over 30 minutes) include connector metadata caching overhead. |

## 4. Acceptance Criteria

- 30-minute session with active search plus one incremental sync shows memory growth within spike-tracker budget.
- No continuous background network activity when app is suspended.
- Battery historian / Instruments Energy Log shows no abnormal drain from connector jobs.

## 5. Change Log

| Version | Date | Summary |
|---|---|---|
| 2.0 | 2026-08-23 | Created v2 delta: connector sync energy budget, no-polling constraint, cache memory cap, thermal pause. |
