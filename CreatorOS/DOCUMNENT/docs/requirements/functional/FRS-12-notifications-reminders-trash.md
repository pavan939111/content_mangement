# Functional Requirements Specification — Module 12  
**Module:** Notifications, Reminders & Trash/History  
**Version:** 1.1  
**Status:** Draft for Review  
**Related Vision / PRD:** CreatorOS  
**Priority:** Must Have  

---

## 1. Purpose

The Notifications, Reminders & Trash/History module defines how users are alerted about important events, manage reminders for production and posting, and recover accidentally deleted or overwritten content.

The module must solve the validated problems:

> **Creators miss deadlines, forget native posting steps, and lose ideas or content due to accidental deletion or overwrites.**

> **Creators need a clear, non-intrusive notification system with control over what they receive.**

> **Trust requires undo, trash, and revision history so no user action is permanent without recovery.**

This module ensures:

- Notifications are relevant, timely, and user-configurable.
- Reminders support the full content workflow (film, edit, caption, publish natively).
- Deletions are soft and reversible.
- Revision history allows restoring previous versions.
- Trash bin retains deleted items for a reasonable period.
- All features work offline and sync correctly.

---

## 2. Scope

This module covers:

- In-app notification types and categories
- Notification preferences
- Reminder creation, editing, scheduling, snooze, and completion
- Reminder center and history
- Trash/recycle bin for deleted content
- Undo actions after destructive operations
- Revision history browsing and restore
- Data retention and purge policies
- Offline behavior and sync
- Accessibility and user experience

**Out of scope:** Push notification server infrastructure details, marketing/engagement notification campaigns, AI-generated reminders, social platform inbox notifications, multi-user collaboration notifications (Phase 2).

---

## 3. Key User Stories

### US-01 Get Reminded Before a Scheduled Post

**As a** creator,  
**I want to** set a reminder 30 minutes before a scheduled native post,  
**so that** I don’t forget to publish.

### US-02 Control Which Notifications I Receive

**As a** creator,  
**I want to** choose which notification types are enabled,  
**so that** I am not overwhelmed by alerts.

### US-03 Undo an Accidental Delete

**As a** creator,  
**I want to** tap Undo after deleting an idea or asset reference,  
**so that** my mistake is immediately reversed.

### US-04 Recover a Deleted Item from Trash

**As a** creator,  
**I want to** browse the Trash and restore a deleted content item,  
**so that** I can recover content after changing my mind.

### US-05 Restore an Older Script Version

**As a** creator,  
**I want to** view and restore a previous version of a script,  
**so that** I don’t lose good lines.

### US-06 See All My Reminders in One Place

**As a** creator,  
**I want to** open a Reminder Center showing upcoming and past reminders,  
**so that** I can manage my production schedule.

---

## 4. Functional Requirements

### 4.1 Notification Categories

| ID | Requirement | Priority | Description |
|---|---|---|---|
| NOT-01 | The system shall support the following notification categories: Production Reminders (film, edit, caption, cover), Publishing Reminders (native post), Deadline/At-Risk Warnings, Idea Follow-Up, Sync Alerts (conflict, pending, failed), Security/Account Alerts, Backup Reminders. | Must | Core categories. |
| NOT-02 | Each category shall have its own enable/disable switch in Settings > Notifications. | Must | Granular control. |
| NOT-03 | The system shall not send marketing or promotional notifications by default. | Must | Trust. |
| NOT-04 | The system shall provide a quiet hours setting during which non-critical notifications are suppressed. | Should | Reduce fatigue. |
| NOT-05 | Critical security/account alerts shall bypass quiet hours unless the user disables them explicitly. | Should | Safety. |
| NOT-06 | The system shall respect OS-level notification permissions and not send local notifications if denied. | Must | Platform. |
| NOT-07 | The system shall provide in-app notification center showing recent alerts, tappable to navigate to the relevant item. | Must | Usability. |
| NOT-08 | Notifications shall be actionable where applicable: "Mark as Published", "Snooze", "Retry Sync", "Resolve Conflict". | Should | Efficiency. |

### 4.2 Reminder Creation & Scheduling

| ID | Requirement | Priority | Description |
|---|---|---|---|
| REM-01 | The user shall be able to create a reminder associated with a Content Item, Asset, Clip, or standalone. | Must | Workflow. |
| REM-02 | Reminder fields: title, notes, due date/time, repeat option (none, daily, weekly, monthly), linked item, platform (optional). | Must | Core. |
| REM-03 | The system shall provide default reminder templates for common stages: "Film", "Edit", "Caption", "Thumbnail/Cover", "Post Natively". | Should | Reduce setup. |
| REM-04 | The system shall allow one-tap creation of reminders from Content Item detail, Calendar, and Publishing Handoff. | Must | Speed. |
| REM-05 | The system shall support reminders for native posting with automatic caption copy and deep link to platform app. | Must | From FRS-06. |
| REM-06 | The system shall allow rescheduling a reminder to another date/time. | Must | Flexibility. |
| REM-07 | The system shall allow snoozing a reminder for preset durations: 10 min, 30 min, 1 hour, tomorrow. | Should | Usability. |
| REM-08 | The system shall allow marking a reminder as completed, optionally logging completion time. | Must | Tracking. |
| REM-09 | The system shall support multiple reminders per Content Item or platform. | Should | Cross-platform. |
| REM-10 | The system shall allow recurring reminders for batch production days. | Should | Batching. |

### 4.3 Reminder Center & History

| ID | Requirement | Priority | Description |
|---|---|---|---|
| REM-11 | The system shall provide a Reminder Center screen accessible from the top bar action in Inbox and Calendar. | Must | Central. |
| REM-12 | The Reminder Center shall list upcoming reminders sorted by date/time. | Must | Standard. |
| REM-13 | The Reminder Center shall show completed and past reminders in a separate section. | Should | History. |
| REM-14 | The user shall be able to filter reminders by linked content type, status, and date. | Should | Focus. |
| REM-15 | The system shall display reminder context: linked Content Item title, platform, stage. | Must | Clarity. |
| REM-16 | Reminders shall persist across app restarts and sync via sync queue if cloud backup enabled. | Must | Reliability. |
| REM-17 | The system shall provide a "Mark All as Completed" for past reminders (optional). | Should | Cleanup. |

### 4.4 Trash / Recycle Bin

| ID | Requirement | Priority | Description |
|---|---|---|---|
| TRASH-01 | The system shall implement a Trash for deleted Content Items, Ideas, Clips, Asset References, and Scripts. | Must | Recovery. |
| TRASH-02 | Deleting a Content Item shall move it to Trash, not permanently remove it immediately. | Must | Safety. |
| TRASH-03 | The Trash shall show deleted items with title, type, deletion date, and remaining retention days. | Must | Info. |
| TRASH-04 | The user shall be able to restore an item from Trash, returning it to its previous state (stage, tags, relations). | Must | Recovery. |
| TRASH-05 | The user shall be able to permanently delete an item from Trash with explicit confirmation. | Must | Control. |
| TRASH-06 | Trash retention period: at least 30 days for Content Items and Scripts; 7 days for Ideas and Clip markers (configurable). | Must | Policy. |
| TRASH-07 | After retention period, items are permanently purged automatically, with a prior notification. | Should | Transparency. |
| TRASH-08 | Trash shall work offline for local deletions; sync tombstones should be used for cloud backup. | Must | Consistency. |
| TRASH-09 | Deleting original referenced files is never done by the app; Trash only contains app metadata. | Must | Trust. |

### 4.5 Undo Actions

| ID | Requirement | Priority | Description |
|---|---|---|---|
| UNDO-01 | The system shall show an Undo action immediately after destructive actions: delete, archive, change stage overwrite, bulk delete. | Must | Recover. |
| UNDO-02 | Undo availability duration: at least 5–10 seconds. | Must | UX. |
| UNDO-03 | Undo shall restore the exact previous state, including tags, relations, and attachments. | Must | Accuracy. |
| UNDO-04 | The system shall support undo for bulk operations where feasible. | Should | Bulk. |
| UNDO-05 | Undo shall be available via snackbar/toast with action button and via VoiceOver/TalkBack action. | Must | Accessibility. |
| UNDO-06 | Undo history for an editing session may be separate from persistent revision history. | Should | Clarity. |

### 4.6 Revision History Browsing & Restore

| ID | Requirement | Priority | Description |
|---|---|---|---|
| HIST-01 | The system shall provide a "Version History" entry in the detail view of scripts, captions, and long notes. | Must | Access. |
| HIST-02 | The version history screen shall list versions with timestamp, size/word count, and change summary. | Must | Browse. |
| HIST-03 | The user shall be able to preview a previous version. | Must | Compare. |
| HIST-04 | The user shall be able to restore a previous version, which creates a new version while preserving current. | Must | No loss. |
| HIST-05 | The system shall allow manual naming of a version (e.g., "Final for Reel"). | Should | User control. |
| HIST-06 | Version history for scripts/captions retains at least 20 revisions or 30 days. | Must | Minimum. |
| HIST-07 | Revision history shall be stored locally, encrypted at rest, and syncable. | Must | Privacy. |
| HIST-08 | The system shall allow exporting a list of versions with timestamps. | Should | Portability. |

### 4.7 Offline & Sync Behavior

| ID | Requirement | Priority | Description |
|---|---|---|---|
| OFFS-01 | Reminders and notifications shall work offline; device local notifications fire even without network. | Must | Offline-first. |
| OFFS-02 | Trash operations and undo shall work offline and sync when connectivity returns. | Must | Consistency. |
| OFFS-03 | Revision history creation shall work offline and sync via outbox. | Must | No loss. |
| OFFS-04 | Notification preferences and quiet hours shall sync across devices if cloud backup enabled. | Should | Consistent. |
| OFFS-05 | Sync conflicts involving reminder completion or deletion shall use tombstone and preserve user intent. | Should | Conflict. |
| OFFS-06 | When a sync alert requires action (auth, quota, conflict), the system shall generate a persistent notification until resolved. | Must | Trust. |

### 4.8 Accessibility

| ID | Requirement | Priority | Description |
|---|---|---|---|
| ACC-01 | All notification/reminder/trash screens shall be accessible via VoiceOver/TalkBack with proper labels. | Must | NFR-06. |
| ACC-02 | Undo actions shall be announced accessibly with a button label. | Must | Accessibility. |
| ACC-03 | Trash restore/permanent delete actions shall have clear confirmation and accessible labels. | Must | Safety. |
| ACC-04 | Reminders shall support large text and dynamic type. | Must | Accessibility. |
| ACC-05 | Notification categories shall be described in plain language, not ambiguous status. | Must | Cognitive. |

---

### 4.99 Missing MVP Requirements (Completeness Sweep)

| ID | Requirement | Priority | Description |
|---|---|---|---|
| NOT-M5 | Notification Grouping | Must | The system shall group notifications by content item to avoid cluttering the notification center. |

## 5. Data Model Considerations (Logical)

- **NotificationPreference** — per category.
- **Reminder** — linked to ContentItem/Asset/Clip or standalone.
- **TrashEntry** — soft-deleted record references.
- **Revision** — version snapshot for text records.
- **NotificationHistory** — in-app log.
- **UndoAction** — temporary state for reversal.

These will be refined during architecture design.

---

## 6. Acceptance Criteria Summary

| User Story | Acceptance Criteria |
|---|---|
| US-01 | User sets a reminder for a scheduled post; notification appears at set time with caption copy and deep link. |
| US-02 | User toggles off "Sync Alerts"; no sync notifications appear, but sync continues. |
| US-03 | User deletes a Content Item; Undo snackbar appears; tapping Undo restores item exactly. |
| US-04 | User opens Trash, sees deleted items with dates, restores one, returns to previous state. |
| US-05 | User views script version history, previews an older version, restores it; current version becomes history. |
| US-06 | User opens Reminder Center, sees upcoming reminders sorted, can complete, snooze, or edit. |

---

## 7. Dependencies

- **FRS-01 Core Content Record** — item deletion, revision history.
- **FRS-02 Idea Capture** — idea reminders.
- **FRS-03 Asset Library** — asset reference deletion.
- **FRS-05 Calendar & Readiness** — scheduling reminders.
- **FRS-06 Publishing Handoff** — native posting reminders.
- **FRS-08 Offline & Sync** — offline behavior, sync.
- **FRS-09 Settings** — notification preferences.
- **NFR-06 Accessibility** — accessibility requirements.
- **NFR-09 Reliability** — undo, revision, no loss.

---

## 8. Open Questions / Decisions Needed

1. Should Trash retention be configurable or fixed?  
   *Recommendation: Fixed default 30 days, configurable in Settings later.*

2. Should reminders support recurring patterns beyond daily/weekly/monthly?  
   *Recommendation: Not for MVP; custom recurrence later.*

3. Should revision history include rich text formatting diffs or just full snapshots?  
   *Recommendation: Full snapshots for MVP; diffs later.*

4. Should notification center also show cloud sync failures from connected services?  
   *Recommendation: Yes, sync alerts appear in notification center.*

5. Should Trash be accessible from bottom navigation or Settings only?  
   *Recommendation: From Library/Search and Settings, not a separate bottom tab.*

---
### 4.99 Missing MVP Requirements (Completeness Sweep)

| ID | Requirement | Priority | Description |
|---|---|---|---|
| NOT-M5 | Notification Grouping | Must | The system shall group notifications by content item to avoid cluttering the notification center. |

## 5. Change Log

| Version | Date | Summary |
|---|---|---|
| 1.1 | 2026-08-22 | P2 updates: navigation IA, NFR-01 thresholds, version pins, uncited claims. |


| 1.1 | 2026-08-22 | Completeness sweep: added missing requirements. |
