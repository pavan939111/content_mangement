# Functional Requirements Specification — Module 06 v2  
**Module:** Handoff & Action Receipts  
**Version:** 2.0  
**Status:** Draft for Validation  
**Related PRD:** v2/creator_os_prd_v2.md  
**Reference to v1:** ../../../docs/requirements/functional/FRS-06-publishing-handoff.md

---

## 1. Purpose

This document defines **Handoff & Action Receipts** for CreatorOS v2.

It does not repeat v1 publishing handoff details. Where v1 requirements remain valid, they are referenced.

In v2, CreatorOS does not publish social content directly. Instead, it prepares content and hands it off to external tools—Google Drive, Notion, Canva, CapCut, Apple Notes, or native social apps—and records every handoff as a human-readable receipt.

This creates a verifiable workflow history and a trusted delivery record for professional UGC creators.

---

## 2. Reference to v1 Stable Requirements

The following v1 requirements remain valid where applicable:

- Platform capability matrix: v1 FRS-06 §4.2
- Platform-specific variants: v1 FRS-06 §4.3
- Pre-publication validation: v1 FRS-06 §4.4
- Manual mark as published: v1 FRS-06 PUB-M3

Where v2 replaces a requirement, the new requirements below supersede v1.

---

## 3. New Definitions

| Term | Definition |
|---|---|
| Handoff | A user-initiated action that moves or opens content in an external tool. |
| Action Receipt | An append-only timestamped record of a handoff or status change. |
| Delivery Review State | A lightweight state indicating whether a deliverable was shared with the client and acknowledged. |
| Verified Outcome | An outcome confirmed by an external system or provider. |
| User-Confirmed Outcome | An outcome confirmed by the creator manually, not by the external system. |
| Confirmation Mode | A UI pattern where important external actions require explicit user confirmation. |

---

## 4. Functional Requirements

### 4.1 Handoff Actions

| ID | Requirement | Priority | Description |
|---|---|---|---|
| HAR-01 | The system shall support handoffs to external tools via deep link, universal link, share sheet, file picker, or copy link. | Must | Core behavior. |
| HAR-02 | The system shall support handoffs to Google Drive, Google Docs, Google Calendar, Notion, Canva, CapCut, Apple Notes, and native social apps. | Must | MVP scope. |
| HAR-03 | The system shall allow a user to open an external source object in its native app or web. | Must | Example: open Drive file. |
| HAR-04 | The system shall allow a user to share content from a record via the OS share sheet. | Must | Example: send video to CapCut. |
| HAR-05 | The system shall allow a user to copy caption, brief, or delivery link to clipboard with one tap. | Must | Fast copy. |
| HAR-06 | The system shall allow a user to choose a destination folder or file using the system document picker. | Should | Export. |
| HAR-07 | The system shall not claim that an external action succeeded unless the target provider or user confirms it. | Must | Trust. |
| HAR-08 | The system shall provide a fallback action when a deep link fails: show URL, open web, or use share sheet. | Must | Reliability. |

### 4.2 Action Receipts

| ID | Requirement | Priority | Description |
|---|---|---|---|
| HAR-10 | The system shall record an append-only receipt for every handoff and important user action. | Must | Core. |
| HAR-11 | Each receipt shall contain: action type, target provider, target object, timestamp, initiator, outcome, evidence. | Must | Audit. |
| HAR-12 | Receipt outcome types shall include: `opened`, `shared`, `copied`, `linked`, `marked_delivered`, `failed`, `needs_attention`. | Must | State. |
| HAR-13 | The system shall mark an outcome as `opened` or `shared` without claiming the external tool processed the content. | Must | Honesty. |
| HAR-14 | The system shall allow the user to add an annotation to a receipt after creation. Annotations are stored as separate append-only records in a `receipt_annotation` table; the original receipt row is never modified or deleted. | Should | Context via separate records; see ARCHITECTURE-18 §5.6. |
| HAR-15 | Receipts shall be viewable in the connected content record and in a dedicated activity view. | Must | Review. |
| HAR-16 | Receipts shall be exportable as JSON/CSV. | Should | Portability. |
| HAR-17 | The system shall not allow receipt deletion by the user, only archiving or hiding. | Must | Integrity. |

### 4.3 Delivery Review State

| ID | Requirement | Priority | Description |
|---|---|---|---|
| HAR-20 | The system shall allow marking a record as `Delivered`. | Must | UGC delivery. |
| HAR-21 | When marking delivered, the system shall generate an immutable delivery receipt with timestamp and optional delivery link. | Must | Trust. |
| HAR-22 | The system shall support an optional client acknowledgment link that opens a lightweight shared view. | Should | Client confirmation. |
| HAR-23 | The shared view shall display only the intended record metadata and delivery link, not internal notes or other connected records. | Must | Privacy. |
| HAR-24 | The system shall allow the user to include a note with the delivery. | Should | Context. |
| HAR-25 | The system shall allow the user to undo a `Delivered` status within 10 seconds. | Should | Corrections. |

### 4.4 Confirmation & Safety

| ID | Requirement | Priority | Description |
|---|---|---|---|
| HAR-30 | The system shall require explicit confirmation for any action that changes external tool state or shares content outside the connected workspace. | Must | Trust. |
| HAR-31 | The system shall display what will happen before confirmation in plain language. | Must | Clarity. |
| HAR-32 | The system shall support a `Do not ask again` option only for non-destructive, reversible actions. | Should | Usability. |
| HAR-33 | The system shall never silently perform a handoff or external write in the background. | Must | Safety. |

### 4.5 Offline & Sync

| ID | Requirement | Priority | Description |
|---|---|---|---|
| HAR-40 | The system shall allow creating receipts offline for local actions. | Must | Mobile-first. |
| HAR-41 | Offline receipts shall sync to the backend when connectivity returns. | Must | No loss. |
| HAR-42 | External handoffs that require connectivity shall queue locally and execute when connectivity returns. | Should | Continuity. |
| HAR-43 | The system shall display a pending state for queued handoffs. | Should | Clarity. |

---

## 5. MVP Boundaries

### Included

- Deep links, share sheets, copy links, file pickers for connected tools.
- Action receipts for handoffs and user actions.
- Delivery review state with optional client link.
- Confirmation for external writes or shares.

### Excluded

- Social publishing APIs and scheduled auto-posting.
- External tool automation without user confirmation.
- Full approval workflows for teams.
- In-app editing or export rendering.

---

## 6. Acceptance Criteria Summary

| Scenario | Acceptance Criteria |
|---|---|
| Handoff to Drive | User taps "Open in Drive"; system logs receipt with outcome `opened`. |
| Share to CapCut | User taps "Share video"; system opens share sheet; receipt outcome `shared`. |
| Copy caption | User taps copy; system copies to clipboard and logs receipt. |
| Delivery | User marks Delivered; immutable delivery receipt generated. |
| Failed deep link | If deep link fails, system shows fallback and logs `failed` with recovery. |
| Offline receipt | User creates receipt offline; it syncs later. |

---

## 7. Change Log

| Version | Date | Summary |
|---|---|---|
| 2.0 | 2026-08-23 | New v2 document for Handoff & Action Receipts. References v1 for platform variants and validation. |
