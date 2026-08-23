# Functional Requirements Specification — Module 08 v2
**Module:** Offline & Sync
**Version:** 2.0
**Date:** 2026-08-23
**Status:** Draft for Validation
**Related PRD:** docs/product/prd-v2.md
**Reference to v1:** ../archive/v1/requirements/functional/FRS-08-offline-sync.md

---

## 1. Purpose

This document defines the v2 delta for Offline & Sync.

The v1 model was local-only MVP with cloud backup deferred. V2 introduces mandatory cloud integration (Supabase + BFF + connector worker). The v1 statement "MVP is local-only" is invalid for v2.

## 2. Reference to v1 Stable Requirements

- Local-first data persistence and durability (OFF-01 through OFF-04) remain valid
- Offline search via FTS5 (OFF-06) remains valid
- Conflict handling approach (OFF-07) remains valid at the local level
- OFF-05 ("shall not require account") is superseded: account is now required for cloud features but local-only mode still works without one for basic capture/viewing

## 3. V2 Changes

| ID | Requirement | Priority | Description |
|---|---|---|---|
| OFF-20 | Account required for cloud features | Must | Sign-in via Supabase Auth required before connecting providers, syncing receipts, or using cross-tool search. Local-only capture/view still works without sign-in. |
| OFF-21 | Durable outbox for all mutations | Must | Every mutation creates a durable local operation with idempotency key before network submission per TDD-02. |
| OFF-22 | Background sync scheduling | Must | iOS BGTaskScheduler (best-effort) and Android WorkManager (constrained) trigger sync on foreground/network restore per TDD-02 §8. |
| OFF-23 | Multi-device via backend reconciliation | Should | Multiple devices reconcile through server-side operations/receipts; last-write-wins with audit trail per ARCHITECTURE-16 §2. |

## 4. Acceptance Criteria Summary

| Scenario | Criteria |
|---|---|
| Offline edit then restart then reconnect | Edit persists; same idempotency key replayed; no duplicate. |
| Kill app mid-sync | Pending operation survives relaunch. |

## 5. Change Log

| Version | Date | Summary |
|---|---|---|
| 2.0 | 2026-08-23 | Created v2 delta: cloud integration mandatory; outbox pattern defined; multi-device via backend. |
