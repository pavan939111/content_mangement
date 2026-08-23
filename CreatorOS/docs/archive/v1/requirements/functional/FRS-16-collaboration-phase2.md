# Functional Requirements Specification — Module 10  
**Module:** Collaboration & Approval  
**Version:** 1.1  
**Status:** Draft for Review — Phase 2  
**Related Vision / PRD:** CreatorOS  
**Priority:** Phase 2 (Not MVP)

---

## 1. Purpose

The Collaboration & Approval module enables creators, editors, clients, and team members to share content, gather timestamped feedback, and approve final versions within a structured workflow—without scattering conversations across email, WhatsApp, Drive, and DMs.

The module must solve the validated problems:

> **Collaboration with editors/clients is fragmented: files shared via Drive/WeTransfer, feedback arrives through email, WhatsApp, DMs, or scanned notes.**

> **Editor-to-scheduler handoff is inefficient; creators download large files, re-upload to scheduling tools, and manage version confusion manually.**

> **There is no clear review/approval state linked to the final asset that goes to publishing.**

This module is Phase 2 because it requires multi-user permissions, sharing infrastructure, and external access—not needed for the solo creator MVP. However, it is designed to integrate cleanly with the existing Content Record, Asset Library, and Publishing Handoff.

---

## 2. Scope

This module covers:

- User roles and permissions for collaboration
- Sharing content items or assets with external users
- Review links and lightweight client review
- Timestamped comments and annotations
- Approval workflow and version locking
- Notifications for review and approval events
- Asset handoff from editor to scheduler
- Version history and compare
- Activity log and audit trail
- Offline behavior and sync for collaborators

**Out of scope:** Real-time co-editing, team workspaces with multiple editors simultaneously editing the same script, advanced project management, billing per seat, granular enterprise permissions, external file storage collaboration beyond review.

---

## 3. Key User Stories

### US-01 Share a Draft for Review

**As a** creator,  
**I want to** send a shareable review link for a draft video or script to my editor/client,  
**so that** they can provide feedback without needing a CreatorOS account.

### US-02 Leave Timestamped Comments

**As a** reviewer,  
**I want to** click on a video timestamp and leave a comment,  
**so that** the creator knows exactly which moment I’m referring to.

### US-03 Approve a Version

**As a** client,  
**I want to** approve a specific version of a video,  
**so that** the creator knows it’s final and can schedule it.

### US-04 Get Notified When Review Is Ready

**As a** creator,  
**I want to** receive a notification when a reviewer comments or approves,  
**so that** I can act quickly.

### US-05 Hand Off Approved Asset to Publishing

**As a** creator,  
**I want to** mark an approved asset as the final version and have it directly usable in the publishing queue,  
**so that** I don’t have to re-download and re-upload.

### US-06 See Review History and Versions

**As a** creator,  
**I want to** view all comments, version changes, and approvals on a content item,  
**so that** I have a clear audit trail.

---

## 4. Functional Requirements

### 4.1 Roles & Permissions

| ID | Requirement | Priority | Description |
|---|---|---|---|
| COL-01 | The system shall support the following roles for collaboration: Owner (creator), Editor, Reviewer/Client, and Viewer. | Must | Clear permissions. |
| COL-02 | Owner shall have full permissions: edit, share, delete, approve, schedule, and manage permissions. | Must | Control. |
| COL-03 | Editor shall be able to upload new versions, edit assigned content items/scripts, and leave comments. | Must | Workflow. |
| COL-04 | Reviewer/Client shall be able to view shared content, leave timestamped comments, and approve/reject versions. | Must | Lightweight review. |
| COL-05 | Viewer shall have read-only access and may comment if allowed by Owner. | Should | Optional. |
| COL-06 | Permissions shall be set per shared item or workspace, with ability to revoke at any time. | Must | Safety. |
| COL-07 | The system shall support external users (no account) with access via secure share link, limited to review actions only. | Must | Low friction. |
| COL-08 | External user access shall expire after a configurable period (default 30 days) or upon manual revocation. | Should | Security. |
| COL-09 | The system shall not allow external users to access other content beyond the shared item. | Must | Privacy. |

### 4.2 Sharing & Review Links

| ID | Requirement | Priority | Description |
|---|---|---|---|
| COL-10 | The Owner shall be able to generate a shareable review link for a Content Item, Asset, Script, or Clip. | Must | Core. |
| COL-11 | The link shall open a web-based or in-app review view where available, with the media/preview and comment thread. | Must | Accessibility. |
| COL-12 | The link shall support optional password protection. | Should | Security. |
| COL-13 | The Owner shall be able to revoke a share link at any time. | Must | Control. |
| COL-14 | The system shall record share link creation, access, and revocation in the activity log. | Should | Audit. |
| COL-15 | The Owner shall be able to see whether a reviewer has opened the link and when. | Should | Status. |

### 4.3 Timestamped Comments & Annotations

| ID | Requirement | Priority | Description |
|---|---|---|---|
| COL-20 | Reviewers shall be able to click on a video/audio timestamp and add a comment linked to that timecode. | Must | Precision. |
| COL-21 | For images, PDFs, and scripts, reviewers shall be able to select an area or text range and comment. | Should | Flexibility. |
| COL-22 | Comments shall support plain text, and optionally emoji reactions and @mentions (internal users). | Should | Communication. |
| COL-23 | Comment threads shall be visible in chronological order and filterable by version or status. | Must | Organization. |
| COL-24 | The Creator/Editor shall be able to reply to comments and mark them as Resolved. | Must | Workflow. |
| COL-25 | Resolved comments shall be visually distinguished but remain accessible. | Should | Traceability. |
| COL-26 | The system shall support comment export as PDF or CSV. | Should | Records. |

### 4.4 Version Management & Approval

| ID | Requirement | Priority | Description |
|---|---|---|---|
| COL-30 | Editors/creators shall be able to upload new versions of a video or asset to the same Content Item. | Must | Versioning. |
| COL-31 | Each version shall have a version number, upload date, uploader, and optional note. | Must | Clarity. |
| COL-32 | The system shall show a version history with thumbnails and key metadata. | Must | Traceability. |
| COL-33 | Reviewers shall be able to compare two versions side-by-side or toggle between versions. | Should | Evaluation. |
| COL-34 | The Reviewer/Client shall be able to mark a version as **Approved** or **Changes Requested**. | Must | Approval. |
| COL-35 | Approval shall be recorded with timestamp, user, and optional note. | Must | Audit. |
| COL-36 | The Owner/Editor shall be able to set a version as **Final** after approval. | Must | Closure. |
| COL-37 | Once a version is marked Final, the system shall lock it from accidental overwrite; new changes require a new version. | Must | Integrity. |
| COL-38 | The system shall support multiple reviewers providing independent approvals, with optional requirement for all or at least one approval before Final. | Should | Flexibility. |

### 4.5 Notifications & Activity

| ID | Requirement | Priority | Description |
|---|---|---|---|
| COL-40 | Internal users shall receive in-app and optional push notifications for: new comments, new versions, approval requests, and approvals/rejections. | Must | Communication. |
| COL-41 | External reviewers shall receive email notifications with link when invited (if email provided). | Should | Access. |
| COL-42 | The system shall not send excessive notifications; daily digest option is available. | Should | Reduce fatigue. |
| COL-43 | The activity log shall record all collaboration events: link created, viewed, comments, version upload, approval, permission change. | Must | Audit. |
| COL-44 | The activity log shall be viewable in the Content Item detail, filterable by event type. | Should | Usability. |

### 4.6 Asset Handoff to Publishing

| ID | Requirement | Priority | Description |
|---|---|---|---|
| COL-50 | When a version is approved and marked Final, it shall be directly attachable to the Publishing Queue without re-upload. | Must | Efficiency. |
| COL-51 | The approved version shall retain its source file reference, metadata, and platform variant links. | Must | No loss. |
| COL-52 | The system shall prevent scheduling a version that is not marked Ready/Approved unless explicitly overridden. | Should | Accuracy. |
| COL-53 | The system shall support direct handoff to native publishing via existing FRS-06 flows, using the approved version. | Must | Integration. |
| COL-54 | If the approved file is stored in cloud storage, the system shall allow the user to download/export once for native upload. | Should | Practical. |

### 4.7 Offline & Sync

| ID | Requirement | Priority | Description |
|---|---|---|---|
| COL-60 | Internal collaborators shall be able to view cached versions and leave comments offline; comments sync when connectivity returns. | Should | Flexibility. |
| COL-61 | External reviewers require network to access review links; offline mode not applicable. | Must | Platform. |
| COL-62 | Sync conflicts on collaboration events (comments, approvals) shall be handled using the same conflict mechanisms as FRS-08, with comments merged as append-only. | Must | Consistency. |
| COL-63 | Approval state changes shall be idempotent and propagated correctly. | Must | Reliability. |

### 4.8 Security & Privacy

| ID | Requirement | Priority | Description |
|---|---|---|---|
| COL-70 | Share links shall use unguessable tokens and be transmitted over HTTPS. | Must | Security. |
| COL-71 | External review links shall not expose other content or metadata. | Must | Privacy. |
| COL-72 | Comments and activity logs shall be encrypted at rest and in transit. | Must | Security. |
| COL-73 | The Owner shall be able to delete a comment or revoke access; deletion shall be reflected in activity log. | Must | Control. |
| COL-74 | The system shall not share user emails or personal data with external reviewers beyond what the Owner explicitly provides. | Must | Privacy. |

### 4.9 Accessibility

| ID | Requirement | Priority | Description |
|---|---|---|---|
| COL-80 | Review view and comments shall be accessible via VoiceOver/TalkBack and keyboard. | Must | NFR-06. |
| COL-81 | Timestamped comments shall be navigable with accessible controls. | Must | Accessibility. |
| COL-82 | Approval buttons and version compare shall have clear labels and touch targets. | Must | NFR-06. |
| COL-83 | Notification settings for collaboration shall be user-configurable and plain-language. | Must | Usability. |

---

### 4.99 Missing MVP Requirements (Completeness Sweep)

| ID | Requirement | Priority | Description |
|---|---|---|---|
| COL-P1 | Conflict Indicator | Phase 2 | The system shall display a visual indicator when a collaborator is currently editing the same content item. |

## 5. Data Model Considerations (Logical)

- **SharedLink** — token, expiry, permissions, status.
- **CommentThread** — linked to content item, version, timestamp, author, status.
- **Version** — version number, uploader, file reference, status (draft, under review, approved, final).
- **Approval** — reviewer, version, decision, timestamp, note.
- **ActivityEvent** — event type, actor, timestamp, metadata.
- **ExternalReviewer** — optional profile for external users.

These will be refined during architecture design.

---

## 6. Acceptance Criteria Summary

| User Story | Acceptance Criteria |
|---|---|
| US-01 | Owner generates a review link; external user can view and comment without an account. |
| US-02 | Reviewer clicks a timestamp and adds a comment; comment is linked to that timecode. |
| US-03 | Client approves a version; approval is recorded with timestamp and user. |
| US-04 | Creator receives notification when comment or approval occurs. |
| US-05 | Approved version is marked Final and appears in Publishing Queue without re-upload. |
| US-06 | Version history shows all uploads, comments, and approvals; activity log is complete. |

---

## 7. Dependencies

- **FRS-01 Core Content Record** — collaboration centered on content items.
- **FRS-03 Asset Library** — asset versions and references.
- **FRS-06 Publishing Handoff** — final approved version handoff.
- **FRS-08 Offline & Sync** — sync for offline comments.
- **FRS-12 Notifications & Reminders** — collaboration notifications.
- **FRS-13 Data Import/Export** — export of comments/history.
- **NFR-05 Security & Privacy** — share links, encryption.
- **NFR-08 Platform Integration & Remote Config** — external link hosting.

---

## 8. Open Questions / Decisions Needed

1. Should external reviewers be allowed to upload files, or only comment?  
   *Recommendation: Comment-only for external reviewers; internal editors can upload versions.*

2. Should share links require password by default?  
   *Recommendation: No, but available as option. Links expire after 30 days by default.*

3. Should collaboration be available on all plans or Pro only?  
   *Recommendation: Pro for teams/multi-user; basic share link for review could be Free with limits.*

4. Should we support multiple reviewers with independent approvals in MVP (Phase 2)?  
   *Recommendation: Yes for Phase 2, but keep simple: any approval or all approval configurable.*

5. Should the app support real-time co-editing of scripts?  
   *Recommendation: No, that is a major undertaking; versioned asynchronous edits are sufficient.*

---


## 99. Change Log

| Version | Date | Summary |
|---|---|---|
| 1.1 | 2026-08-22 | Completeness sweep: added missing requirements. |
