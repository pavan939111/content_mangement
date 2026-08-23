# Technical Architecture Document — ARCHITECTURE-04 v2: Sync Architecture

**Product:** CreatorOS v2  
**Version:** 2.0  
**Status:** Draft for Validation  
**Date:** 2026-08-23  
**Reference to v1:** ../../../docs/architecture/ARCHITECTURE-04-sync-architecture.md

## 1. Purpose

This document defines **v2 sync architecture** for connector-aware external source synchronization.

The v1 local durable outbox, idempotency, conflict handling, and background scheduling remain authoritative. This document adds only connector sync behavior.

## 2. New Sync Types

| Sync Type | Trigger |
|---|---|
| Local outbox sync | Existing v1 local changes |
| Connector incremental sync | User action, webhook, schedule |
| Connection health sync | Token expiry, provider API status |
| Search index sync | External metadata updates |

## 3. Connector Incremental Sync Flow

1. Backend receives scheduled job or user-initiated sync. Webhook-triggered sync is Phase 2..
2. Provider adapter fetches changes using stored cursor.
3. Normalized index updates affected external objects.
4. Connection health updates.
5. Mobile notification if connected records are affected.
6. Action receipt generated for verified changes.

## 4. Offline Behavior

- Local records and receipts are available offline.
- External source state displays last verified time.
- Reauthorization triggers verification sync before clearing stale status.

## 5. Reliability

- All connector jobs are idempotent.
- Per-provider retries with backoff.
- Cursor persistence across restarts.
- Dead-letter queue for non-retryable failures.

## 6. Reference to v1 Stable Sync

- Durable outbox: v1 ARCH-04 §4
- Conflict resolution: v1 ARCH-04 §7
- Background scheduling: v1 ARCH-04 §9

## 7. Change Log

| Version | Date | Summary |
|---|---|---|
| 2.0 | 2026-08-23 | Added connector sync architecture. |
