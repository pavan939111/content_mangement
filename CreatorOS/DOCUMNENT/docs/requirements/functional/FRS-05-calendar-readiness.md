# Functional Requirements Specification — Module 05  
**Module:** Calendar & Readiness  
**Version:** 1.1  
**Status:** Draft for Review  
**Related Vision / PRD:** CreatorOS  
**Priority:** Must Have  

---

## 1. Purpose

The Calendar & Readiness module provides a **planning surface** for content items. It uses the same Content Item data as the list and board views, but adds time-based visualization, readiness signals, deadline risk warnings, reminders, and batch production awareness.

It must solve the validated problems:

> **Creators duplicate their schedule across task boards, calendars, and schedulers.**

> **A calendar date does not mean the content is ready; creators manually check what is missing.**

> **Batch production depends on strong pre-planning, and long-range plans conflict with trends.**

This module does not replace scheduling/publishing tools; it shows **what is planned, what is ready, and what needs attention before the publish date**.

---

## 2. Scope

This module covers:

- Calendar views (month, week, list)
- Separate display of publish date and due date
- Readiness indicators derived from Content Item asset completeness
- At-risk warnings
- Reminders for production stages and native posting
- Batch planning view
- Scheduling lanes (fixed, evergreen, trend-responsive, backlog)
- Rescheduling without context loss
- Offline calendar access
- Integration with device calendars (optional)

**Out of scope:**  
Actual auto-publishing, platform API scheduling, analytics, social inbox. Those belong to FRS-06 and later phases.

---

## 3. Key User Stories

### US-01 See This Week’s Content at a Glance

**As a** creator,  
**I want to** open a calendar and see what is scheduled for the week,  
**so that** I can plan my time.

### US-02 Know What Is Ready and What Is Missing

**As a** creator,  
**I want to** see readiness status directly on calendar items,  
**so that** I don’t discover missing captions or thumbnails on posting day.

### US-03 Get a Warning Before a Deadline Slips

**As a** creator,  
**I want to** be alerted when a scheduled item is missing required assets,  
**so that** I can fix it before the publish date.

### US-04 Plan a Batch Production Day

**As a** creator,  
**I want to** see how many items are ready to film or edit for a selected day,  
**so that** I can batch efficiently.

### US-05 Move a Post Without Losing Work

**As a** creator,  
**I want to** drag a calendar item to a new date,  
**so that** my script, assets, captions, and history move with it.

### US-06 Separate Fixed, Evergreen, and Trend Content

**As a** creator,  
**I want to** tag planned content as fixed, evergreen, or trend-responsive,  
**so that** I know which items can be moved or swapped.

---

## 4. Functional Requirements

### 4.1 Calendar Views

| ID | Requirement | Priority | Description |
|---|---|---|---|
| CAL-01 | The system shall provide a **Month View** showing content items on their publish date by default. | Must | Standard planning. |
| CAL-02 | The system shall provide a **Week View** with time-of-day granularity where relevant. | Must | Weekly workflow. |
| CAL-03 | The system shall provide a **List View** sorted by date, showing items with metadata. | Must | Alternative for dense data. |
| CAL-04 | The system shall allow toggling between showing **Publish Date** and **Due Date**. | Must | Different dates matter. |
| CAL-05 | The system shall display content items using title, thumbnail (if available), platform icons, and readiness color. | Must | At-a-glance. |
| CAL-06 | The system shall support drag-and-drop date changes on calendar views. | Must | Rescheduling. |
| CAL-07 | The system shall allow filters in calendar view: platform, stage, content pillar, readiness, scheduling lane, tags. | Should | Focus. |
| CAL-08 | The system shall support offline viewing of previously synced calendar data. | Must | Offline-first. |
| CAL-09 | The system shall allow setting a default calendar view (month/week/list). | Should | Preference. |

### 4.2 Readiness Display

| ID | Requirement | Priority | Description |
|---|---|---|---|
| CAL-10 | The system shall display a readiness badge or color on each calendar item: **Complete**, **In Progress**, **Missing Assets**, **At Risk**. | Must | Clear signal. |
| CAL-11 | Readiness shall be computed using the Content Item’s current stage, target platforms, and attachment roles (from FRS-01). | Must | Single source of truth. |
| CAL-12 | The system shall show a tooltip or compact summary listing missing assets when the item is not Complete. | Must | Actionable. |
| CAL-13 | The system shall allow the user to tap an item to see full readiness details in the Content Item detail view. | Must | Drill-down. |
| CAL-14 | The system shall update readiness in real time when assets are attached, removed, or platform variants changed. | Must | Accurate. |
| CAL-15 | The system shall not block stage movement based on readiness. | Must | Flexible workflow. |

### 4.3 At-Risk Warnings

| ID | Requirement | Priority | Description |
|---|---|---|---|
| CAL-16 | The system shall mark an item as **At Risk** when its publish date is within 24 hours and required assets are missing. | Should | Deadline risk. |
| CAL-17 | The system shall allow the user to configure the at-risk window (e.g., 24h, 48h, 7 days). | Should | Customization. |
| CAL-18 | The system shall surface at-risk items prominently: notification, calendar badge, and a dedicated **Needs Attention** list. | Should | Avoid missed posts. |
| CAL-19 | The system shall allow the user to dismiss an at-risk warning for a specific item, with optional snooze. | Should | Reduce noise. |
| CAL-20 | The system shall not send excessive reminders; all at-risk notifications shall be subject to user notification preferences. | Must | Avoid fatigue. |

### 4.4 Reminders

| ID | Requirement | Priority | Description |
|---|---|---|---|
| CAL-21 | The system shall allow setting reminders for each Content Item: time and note. | Must | Basic. |
| CAL-22 | The system shall provide default reminder templates for common stages: **Film**, **Edit**, **Caption**, **Thumbnail/Cover**, **Post Natively**. | Should | Reduces setup. |
| CAL-23 | The system shall allow reminders to be linked to a target platform. | Should | Platform-specific posting reminders. |
| CAL-24 | The system shall support one-tap creation of reminders from calendar item detail. | Must | Fast. |
| CAL-25 | The system shall allow exporting reminders/events to Google Calendar and Apple Calendar as read-only events (Should). Two-way sync is Phase 2. | Should | Existing habits. |
| CAL-26 | The system shall support offline reminder creation; reminders sync when connectivity returns. | Must | Offline-first. |
| CAL-27 | The system shall allow snoozing and completing reminders. | Should | Usability. |

### 4.5 Batch Planning & Production Views

| ID | Requirement | Priority | Description |
|---|---|---|---|
| CAL-28 | The system shall provide a simple batch planning view for a selected date or week. Complex capacity planning is Phase 2. | Must | Validated batching pain. |
| CAL-29 | The batch view shall show grouped counts: Ready to Film, Needs Filming, Ready to Edit, In Edit, Ready to Post, Scheduled. | Should | Workload awareness. |
| CAL-30 | The system shall allow selecting multiple items and assigning a common production block (e.g., “Film Wednesday”). | Should | Batch action. |
| CAL-31 | The system shall display per-item readiness in batch view. | Must | See gaps. |
| CAL-32 | The system shall allow filtering batch view by platform, content pillar, or scheduling lane. | Should | Focus. |
| CAL-33 | The system shall show the number of items that can be completed in a batch based on user-defined capacity (optional). | Phase 2 | Not MVP. |
| CAL-34 | The system shall allow exporting a batch plan as a shareable checklist or calendar invite. | Phase 2 | Optional. |

### 4.6 Scheduling Lanes

| ID | Requirement | Priority | Description |
|---|---|---|---|
| CAL-35 | The system shall support a **Scheduling Lane** field on Content Items: **Fixed**, **Evergreen**, **Trend-responsive**, **Backlog**. | Should | Flexible planning. |
| CAL-36 | The system shall display lanes as distinct colors or tags in calendar and list views. | Should | Visual distinction. |
| CAL-37 | The system shall allow filtering by lane. | Should | Use case. |
| CAL-38 | The system shall allow swapping a scheduled **Trend-responsive** item with a **Backlog** or **Evergreen** item in one action, preserving original item data. | Should | Response to trends. |
| CAL-39 | The system shall suggest freeing up flexible slots when a user overplans fixed items. | Phase 2 | Not MVP. |
| CAL-40 | The system shall not enforce lane rules; lanes are informational. | Must | User control. |

### 4.7 Rescheduling & Data Integrity

| ID | Requirement | Priority | Description |
|---|---|---|---|
| CAL-41 | Changing the publish date or due date shall not affect attached assets, script, captions, variants, or history. | Must | No loss. |
| CAL-42 | The system shall allow rescheduling via drag-and-drop, date picker, or bulk action. | Must | Efficiency. |
| CAL-43 | The system shall maintain a version history of date changes with timestamps. | Should | Audit. |
| CAL-44 | The system shall preserve source/derivative relationships when rescheduling derivative content. | Must | Traceability. |
| CAL-45 | The system shall display any existing reminders when rescheduling and prompt the user to update them. | Should | Avoid stale reminders. |

### 4.8 Offline, Sync & Integration

| ID | Requirement | Priority | Description |
|---|---|---|---|
| CAL-46 | Calendar data shall be stored locally and available offline. | Must | Offline-first. |
| CAL-47 | Changes made offline shall sync when connectivity returns; conflicts shall be handled by FRS-08. | Must | Data integrity. |
| CAL-48 | Two-way sync with Google Calendar and Apple Calendar is Phase 2. Read-only calendar export remains Should (see INT-31). | Phase 2 | Ecosystem integration. |
| CAL-49 | The system shall not require a Google/Apple calendar account for basic calendar use. | Must | Privacy. |
| CAL-50 | The system shall allow exporting the calendar view as a static shareable image/PDF (optional). | Phase 2 | Not MVP. |

### 4.9 Additional Calendar & Readiness Requirements

| ID | Requirement | Priority | Description |
|---|---|---|---|
| CAL-M1 | Timezone Handling | Must | The system shall allow the user to set a local timezone for the calendar. All scheduled dates/times shall be displayed in the user's local timezone, with the target platform's timezone clearly indicated when different. When scheduling, the system shall warn if the target platform timezone differs from the user's local timezone. |
| CAL-M2 | Batch Scheduling | Should | The system shall allow selecting multiple Content Items and assigning the same publish date and/or time in one action. |
| CAL-M3 | Calendar Filters | Must | The calendar view shall support filtering by platform, stage, scheduling lane, content pillar, tags, and readiness state. |
| CAL-M4 | Readiness Threshold Configuration UI | Should | The system shall provide a settings screen where the user can customize the required assets for each stage, beyond the default mapping. Customizations shall apply to readiness computation and at-risk warnings. |
| CAL-M5 | Calendar Conflict Warning | Should | The system shall detect and warn when two Content Items for the same target platform are scheduled at the same date/time. |
| CAL-M6 | Due Date vs Publish Date Display | Must | The calendar shall visually distinguish due dates from publish dates using different colors, labels, or icons. Users shall be able to toggle between due date and publish date views. |

---

## 5. Data Model Considerations (Logical)

The Calendar & Readiness module will use existing structures from FRS-01 and add:

- **CalendarEvent** (or use ContentItem dates directly)
- **Reminder**
- **SchedulingLane** (enum or tag)
- **ReadinessSnapshot** (computed)
- **AtRiskRule** (user-configurable)
- **BatchPlan** (optional in MVP; can be a filtered view)

This logical model will be finalized during architecture design.

---

## 6. Acceptance Criteria Summary

| User Story | Acceptance Criteria |
|---|---|
| US-01 | User opens Month View and sees items on their publish dates with platform icons and readiness colors. |
| US-02 | An item missing a thumbnail for a target platform shows a red/orange readiness indicator and can be tapped to see missing assets. |
| US-03 | An item whose publish date is within the configured at-risk window and missing required assets appears in Needs Attention list. |
| US-04 | User selects a production day; batch view shows counts and which items are ready/not ready to film/edit. |
| US-05 | User drags an item to a new date; all attachments, variants, and history remain intact; reminders are updated or prompted. |
| US-06 | User assigns lanes (Fixed, Evergreen, Trend-responsive, Backlog) and filters calendar accordingly. |

---

## 7. Dependencies

- **FRS-01 Core Content Record** — Stage, required assets, platform variants, publish/due dates, readiness logic.
- **FRS-03 Asset Library** — Asset references and locations needed for readiness.
- **FRS-04 Repurposing Clip Library** — Derivative items may have scheduling needs.
- **FRS-08 Offline & Sync** — Local-first storage, sync, conflict handling.
- **FRS-07 Integrations** — Device calendar/reminder sync.

---

## 8. Open Questions / Decisions Needed

1. Should at-risk warnings trigger push notifications, in-app only, or both?  
   *Recommendation: In-app badge and optional push notifications, user-configurable.*

2. Should batch planning view be included in MVP or Phase 2?  
   *Confirmed: simple batch view is Must. Complex capacity planning Phase 2.*

3. Should scheduling lanes be a core field or just a tag?  
   *Recommendation: Dedicated field with default lanes, editable list.*

4. Should the system support time-of-day scheduling in MVP?  
   *Recommendation: Yes, for remind/planning, but publish time only relevant for manual/native posting; no auto-publish yet.*

5. Should we sync with Google/Apple Calendar in MVP?  
   *Confirmed: two-way sync Phase 2; read-only export Should.*

---

## Change Log
| Version | Date | Summary |
|---|---|---|
| 1.1 | 2026-08-22 | Added missing MVP requirements CAL-M1 to CAL-M6 under Section 4.9. |
