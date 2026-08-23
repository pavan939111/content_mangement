# Non-Functional Requirements — NFR-09 v2: Reliability & Integrity

**Product:** CreatorOS v2  
**Version:** 2.0  
**Status:** Draft for Validation  
**Date:** 2026-08-23  
**Reference to v1:** ../../../docs/requirements/non-functional/NFR-09-reliability-integrity.md

## 1. Purpose

This document defines v2-specific reliability and integrity requirements for external source links, action receipts, and connection state.

The v1 local durability and transactional integrity remain valid.

## 2. New v2 Requirements

| ID | Requirement | Priority | Description |
|---|---|---|---|
| RIN-01 | Receipt integrity | Must | Action receipts shall be append-only and immutable after creation. User annotations are stored as separate append-only rows in a `receipt_annotations` table (see ARCHITECTURE-18 §5.6), never modifying the original receipt fields. Users may archive or hide receipts but never delete or edit them. |
| RIN-02 | External source uniqueness | Must | Each external source link shall be unique per record per provider per external object ID. |
| RIN-03 | No silent source mismatch | Must | The system shall never silently attach a similarly named external object without explicit user confirmation. |
| RIN-04 | Connection health accuracy | Must | Health state shall reflect real provider auth and sync status, not optimistic assumptions. |
| RIN-05 | Verification receipt | Must | After reconnection, the system shall log a verification receipt and validate affected records. |
| RIN-06 | Action idempotency | Must | All backend connector actions shall use idempotency keys to prevent duplicate external writes. |
| RIN-07 | DLQ recovery | Should | Failed non-retryable provider jobs shall be visible in a dead-letter queue and inspectable by support. |

## 3. References

- Local transaction integrity: v1 NFR-09 §4
- Conflict handling: v1 NFR-09 §6

## 4. Acceptance Criteria

- Receipts cannot be modified or deleted.
- Duplicate external links are prevented.
- Reconnection produces a verification receipt.
- No duplicate provider write occurs from retries.

## 5. Change Log

| Version | Date | Summary |
|---|---|---|
| 2.0 | 2026-08-23 | Added receipt integrity and connector reliability requirements. |
