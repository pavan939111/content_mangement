# Non-Functional Requirements — NFR-02 v2: Offline & Sync

**Product:** CreatorOS v2  
**Version:** 2.0  
**Status:** Draft for Validation  
**Date:** 2026-08-23  
**Reference to v1:** ../../../docs/requirements/non-functional/NFR-02-offline-sync.md

## 1. Purpose

This document defines v2-specific offline and sync requirements for the connected workspace.

The v1 local-first durability, durable outbox, and conflict handling remain valid and are referenced.

## 2. New v2 Requirements

| ID | Requirement | Priority | Description |
|---|---|---|---|
| OFS-01 | Connector-aware sync | Must | The system shall support incremental sync of external source metadata when connectivity returns. |
| OFS-02 | Stale source detection | Must | The system shall mark an external source as stale if the provider connection was interrupted or last sync exceeds a provider-specific threshold. |
| OFS-03 | Offline external source status | Must | When offline, the app shall show the last verified external source status and timestamp, and clearly indicate that live verification is unavailable. |
| OFS-04 | Reconnection verification | Must | After reauthorizing a connector, the system shall verify the connection and revalidate affected records before clearing stale status. |
| OFS-05 | Action receipt sync | Must | Action receipts created offline shall sync to the backend when connectivity returns. |
| OFS-06 | Queued handoff actions | Should | Handoffs requiring connectivity shall be queued locally and executed when connectivity returns, with visible pending state. |
| OFS-07 | Provider outage handling | Must | If a provider is down, the system shall preserve local work and show a provider-specific outage notice, not a generic failure. |
| OFS-08 | Token refresh resilience | Must | The system shall attempt one automatic token refresh and, if it fails, mark the connection as needs reauthorization without repeated retries. |

## 3. References

- Local-first durability, WAL, synchronous settings: v1 NFR-02 §4
- Conflict resolution: v1 NFR-02 §7
- Background scheduling: v1 NFR-02 §8

## 4. Acceptance Criteria

- Offline captures and receipts sync within 2 minutes of connectivity restoration on foreground.
- Stale sources are visible on affected content records.
- Reconnection clears stale status only after successful verification.
- Provider outage does not lose local edits or receipts.

## 5. Change Log

| Version | Date | Summary |
|---|---|---|
| 2.0 | 2026-08-23 | Added v2 connector-aware sync and stale detection. |
