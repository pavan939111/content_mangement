# Functional Requirements Specification — Module 01 v2  
**Module:** Connected Content Record  
**Version:** 2.0  
**Status:** Draft for Validation  
**Related PRD:** v2/creator_os_prd_v2.md  
**Reference to v1:** ../../../docs/requirements/functional/FRS-01-core-content-record.md

---

## 1. Purpose

This document defines the **Connected Content Record** for CreatorOS v2.

It does not repeat v1 content. Where v1 requirements remain valid, they are referenced.

The Connected Content Record is the central object for professional UGC creators. It links a brand deliverable to its external sources—brief, script, footage, design, edit handoff—and tracks status, health, and human-readable actions.

---

## 2. Reference to v1 Stable Requirements

The following v1 requirements remain valid and are reused for base record management:

- Content item lifecycle and stage model: see v1 FRS-01 §4.2
- Platform variants: see v1 FRS-01 §4.4
- Views and filters: see v1 FRS-01 §4.6
- Bulk operations: see v1 FRS-01 CR-M6

Where v2 changes behavior, the new requirements below supersede v1.

---

## 3. New Definitions

| Term | Definition |
|---|---|
| Connected Content Record | A content record that links to external sources and records actions/handoffs. |
| External Source Link | A reference to a real object in an external tool (Google Doc, Drive folder, Notion page, Canva design). |
| Source Provenance | Metadata describing how a link was resolved: explicit URL, object ID, canonical URL, metadata match, or user confirmation. |
| Next Action | The single most important action a creator should take next for this record. |
| Action Receipt | A timestamped, append-only record of an action performed on or through the record. |
| Connection Health | Aggregated status of all external sources linked to the record: healthy, stale, needs reauthorization, error. |

---

## 4. Functional Requirements

### 4.1 Connected Record Structure

| ID | Requirement | Priority | Description |
|---|---|---|---|
| CCR-01 | The system shall support creating a Connected Content Record for a brand deliverable. | Must | Core object. |
| CCR-02 | The record shall contain: title, brand/client, campaign, due date, status, next action, notes. | Must | Basic fields. |
| CCR-03 | The system shall support linking external sources via search or manual URL. | Must | Google Drive/Docs/Calendar/Notion in MVP. |
| CCR-04 | The record shall display all linked external sources as chips with provider icon and last-updated timestamp. | Must | Context. |
| CCR-05 | The system shall compute and display a single recommended next action based on missing or stale required links. | Must | Buffer-inspired clarity. |
| CCR-06 | The system shall support an ordered list of actions with timestamps and outcomes. | Must | Action receipts. |
| CCR-07 | The system shall support a delivery state with optional client acknowledgment link. | Should | UGC delivery. |

### 4.2 External Source Linking

| ID | Requirement | Priority | Description |
|---|---|---|---|
| CCR-10 | The system shall allow the user to attach an external source to the record. | Must | Attachment. |
| CCR-11 | Each external source link shall store: provider, external object ID if available, canonical URL, display name, link type, last verified timestamp, connection status. | Must | Provenance. |
| CCR-12 | The system shall use a strict source resolution order: explicit user URL → durable object ID → exact canonical URL match → metadata match → user confirmation. | Must | Never silently infer. |
| CCR-13 | The system shall display source provenance and confidence when a link was resolved by metadata match. | Should | Trust. |
| CCR-14 | The system shall mark an external source as stale if the provider reports changes or the connection was interrupted. | Should | Health. |
| CCR-15 | The system shall allow the user to remove an external source link without deleting the record. | Must | Control. |

### 4.3 Next Action Engine

| ID | Requirement | Priority | Description |
|---|---|---|---|
| CCR-20 | The system shall compute next action based on missing required link types: brief, script, footage, design, edit handoff, delivery link. | Must | Action clarity. |
| CCR-21 | The next action shall be displayed prominently on the record card and detail view. | Must | Visibility. |
| CCR-22 | The next action shall include a single-tap action button where possible: "Attach brief," "Open Drive folder," "Hand off to CapCut," "Mark delivered." | Must | Low friction. |
| CCR-23 | The system shall recalculate next action immediately after any source link or status change. | Must | Accuracy. |

### 4.4 Action Receipts

| ID | Requirement | Priority | Description |
|---|---|---|---|
| CCR-30 | The system shall record an append-only receipt for every external action or handoff. | Must | Trust. |
| CCR-31 | Each receipt shall contain: action type, target provider, target object, timestamp, initiator, outcome, evidence (e.g., linked URL, copied text, opened deep link). | Must | Auditability. |
| CCR-32 | The system shall record outcomes that are user-confirmed separately from those only observed. | Must | Example: "Opened CapCut" vs "Marked delivered." |
| CCR-33 | The system shall allow the user to view the receipt history for a record. | Must | Review. |
| CCR-34 | The system shall allow exporting the receipt history as JSON/CSV. | Should | Portability. |

### 4.5 Connection Health

| ID | Requirement | Priority | Description |
|---|---|---|---|
| CCR-40 | The system shall display per-record connection health summary. | Must | Health. |
| CCR-41 | If any linked external source is stale, expired, or unavailable, the record shall show a warning with affected source. | Must | Transparency. |
| CCR-42 | The system shall provide a one-tap reconnect or reauthorization action from the record detail. | Must | Recovery. |
| CCR-43 | After reconnection, the system shall verify the source and log a receipt. | Should | Trust. |

### 4.6 Offline & Sync

| ID | Requirement | Priority | Description |
|---|---|---|---|
| CCR-50 | The record and its metadata shall be readable offline. | Must | Mobile-first. |
| CCR-51 | External source revalidation shall be queued and executed when connectivity returns. | Should | Reliability. |
| CCR-52 | Action receipts created offline shall sync when connectivity returns. | Must | No loss. |

---

## 5. MVP Boundaries

### Included

- Google Drive, Docs, Calendar, Notion external sources.
- Next action for missing or stale required links.
- Action receipts for user-confirmed actions and handoffs.
- Basic connection health with reconnect.
- Offline record viewing and local receipt creation.

### Excluded

- Social publishing APIs.
- Multi-user approvals.
- In-app editing/design.
- MCP configuration.
- General automation builder.

---

## 6. Acceptance Criteria Summary

| Scenario | Acceptance Criteria |
|---|---|
| Create connected record | User can create record, attach Google Doc brief and Drive folder. |
| Source provenance | Record shows source provider, URL, last verified time, and status. |
| Next action | If no script link, record shows "Attach script" as next action with one-tap search. |
| Action receipt | Opening a Drive folder logs a receipt with timestamp and outcome. |
| Connection health | Expired Drive token causes warning and one-tap reconnect. |
| Offline | Record and receipts are viewable offline; sync later. |

---

## 7. Change Log

| Version | Date | Summary |
|---|---|---|
| 2.0 | 2026-08-23 | New v2 document for Connected Content Record. References v1 for base CRUD and lifecycle. |
