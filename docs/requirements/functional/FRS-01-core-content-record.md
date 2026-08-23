# Functional Requirements Specification — Module 01  
**Module:** Core Content Record  
**Version:** 1.1  
**Status:** Draft for Review  
**Related Vision / PRD:** CreatorOS  
**Priority:** Must Have  

---

## 1. Purpose

The Core Content Record is the foundational object in CreatorOS. It represents **one piece of content** from its earliest idea to its final published state, including all associated assets, metadata, workflow stages, platform variants, and publishing outcomes.

Without this module, every other feature—search, calendar, repurposing, publishing handoff—has no coherent center to connect to.

The Core Content Record must solve the validated problem:

> **Creators have no unified post/project record linking idea, script, raw footage, edit file, final export, thumbnail, caption, schedule, published URL, and performance.**

---

## 2. Scope

This module covers:

- Data model of a Content Item
- Lifecycle and workflow states
- Relations between Content Items (source/derivative)
- Attachment of external assets and references
- Platform-specific variants (captions, titles, covers)
- Status and readiness computation
- Views derived from Content Items (list, board, calendar)

**Out of scope:**  
Actual capture, search, scheduling execution, publishing API integrations, analytics, collaboration. Those are separate modules and will reference this one.

---

## 3. Key User Stories

### US-01 Create a Content Item

**As a** solo creator,  
**I want to** create a content item from an idea, script draft, or imported asset,  
**so that** I can start organizing my work immediately.

### US-02 See All Related Assets in One Place

**As a** creator,  
**I want to** see the script, raw footage, edit file, final export, thumbnail, caption, and schedule in one view,  
**so that** I don’t have to search across apps.

### US-03 Move Through Flexible Stages

**As a** creator,  
**I want to** change the stage of a content item (Idea → Scripting → Filming → Editing → Ready → Scheduled → Published),  
**so that** I can track progress my own way.

### US-04 Link Source and Derivative Content

**As a** creator,  
**I want to** mark one content item as derived from another (e.g., a Short from a long video),  
**so that** I can trace where clips and posts came from.

### US-05 Define Platform Variants

**As a** creator,  
**I want to** store different captions, titles, hashtags, and covers for Instagram, TikTok, YouTube, and X,  
**so that** I can prepare platform-specific packaging without duplicating the whole item.

### US-06 Know Whether This Item Is Ready

**As a** creator,  
**I want to** see whether required assets for the current stage are missing,  
**so that** I can avoid last-minute panic before posting.

---

## 4. Functional Requirements

### 4.1 Content Item Data Model

| ID | Requirement | Priority | Description |
|---|---|---|---|
| CR-01 | The system shall allow creation of a **Content Item** with the following core fields: title, description/notes, content pillar, target platform(s), tags, status, due date, publish date, live URL(s). | Must | Basic metadata to identify and organize the item. |
| CR-02 | The system shall allow the Content Item to exist without any mandatory fields except a unique identifier and creation date. | Must | Capture should be frictionless; all enrichment optional. |
| CR-03 | The system shall support a free-text **Notes** field with rich text formatting (bold, italic, lists, links). | Should | Creators need to keep context and research notes. |
| CR-04 | The system shall support a **Script** field or linked script document with version history. | Must | Script is a core part of content workflow. |
| CR-05 | The system shall support a **Hook** field and **CTA** field. | Must | Short-form creators think in hooks and calls to action. |
| CR-06 | The system shall support multiple **Tags** per item, with manual creation and suggestions. | Must | For search and organization. |
| CR-07 | The system shall support one or more **Content Pillars** (categories) per item. | Must | Used for planning and analysis. |
| CR-08 | The system shall support a **Target Platform** list: Instagram, TikTok, YouTube Shorts, YouTube Long, X, Other. | Must | Platform-specific packaging and publishing depend on this. |
| CR-09 | The system shall support one or more **Live URLs** associated with published versions. | Should | To connect item to actual post. |

### 4.2 Lifecycle and Workflow States

| ID | Requirement | Priority | Description |
|---|---|---|---|
| CR-10 | The system shall provide default stages: **Idea, Research, Scripting, Filming, Editing, Ready, Scheduled, Published, Archived, Reuse.** | Must | Cover the full creator workflow. |
| CR-11 | The system shall allow users to create custom stages and reorder them. | Must | No consistent workflow order exists; users need flexibility. |
| CR-12 | The system shall allow users to skip stages without warnings. | Must | Some creators skip scripting or filming; workflow must not block. |
| CR-13 | The system shall allow users to move backward between stages. | Must | Creators often revise after editing. |
| CR-14 | The system shall record stage transition history (timestamps). | Should | Useful for review and understanding bottlenecks. |
| CR-15 | The system shall allow multiple items to be in the same stage for board/list views. | Must | Board view requirement. |
| CR-16 | The system shall allow setting a **Due Date** separately from a **Publish Date**. | Must | Production deadline vs publishing date are different. |
| CR-17 | The system shall allow a Publish Date with optional time zone. | Must | For scheduling and reminders. |

### 4.3 Asset Attachments and References

| ID | Requirement | Priority | Description |
|---|---|---|---|
| CR-18 | The system shall allow attaching assets to a Content Item as **references**, not necessarily copied files. | Must | Avoid duplicate storage; support BYO storage. |
| CR-19 | Attachment types shall include: local file, cloud file/folder (Drive, Dropbox, iCloud, OneDrive), external drive file, editor project link, design link (Canva), URL. | Must | Creators use diverse storage. |
| CR-20 | The system shall store metadata for each attachment: type, name, source location, file path/URL, size, date modified, thumbnail/proxy (if media). | Must | Search and display require metadata. |
| CR-21 | The system shall allow assigning a **role** to an attachment: raw footage, select, edit project, final export, thumbnail/cover, script, caption document, music, sound effect, other. | Must | Roles drive readiness and search. |
| CR-22 | The system shall allow multiple attachments per role. | Must | Example: multiple raw takes, multiple thumbnail variants. |
| CR-23 | The system shall maintain a **version** field for attachments that represent final exports or thumbnails. | Should | To track iterations. |
| CR-24 | The system shall allow linking a **source Content Item** to a derivative Content Item. | Must | To support repurposing traceability. |
| CR-25 | The system shall allow one Content Item to have multiple derivatives and one derivative to have one primary source. | Must | A source can branch into many clips; a clip comes from one source. |
| CR-26 | The system shall allow attaching **platform-specific variants** (caption, title, hashtags, cover) as structured fields, not just free text. | Must | Needed for publishing handoff. |

### 4.4 Platform-Specific Variants

| ID | Requirement | Priority | Description |
|---|---|---|---|
| CR-27 | The system shall allow multiple **Platform Variant** records per Content Item, keyed by platform. | Must | Instagram, TikTok, YouTube Shorts, X. |
| CR-28 | Each Platform Variant shall store: platform, caption, hashtags, title (if applicable), description, thumbnail/cover attachment reference, and status. | Must | Full packaging per platform. |
| CR-29 | The system shall allow duplication of a variant across platforms with edits. | Should | Speeds up cross-posting. |
| CR-30 | The system shall store variant-specific fields only when different from the default item fields. | Should | Reduce redundancy. |
| CR-31 | The system shall allow setting a variant as **Primary** for each platform. | Should | For published URL association. |

### 4.5 Readiness Computation

| ID | Requirement | Priority | Description |
|---|---|---|---|
| CR-32 | The system shall compute readiness based on required attachments and variant completeness per target platform. | Must | To warn about missing assets. |
| CR-33 | The system shall define default required roles per stage:  
- Scripting: script  
- Filming: at least one raw footage attachment  
- Editing: at least one edit project or final export  
- Ready: final export, thumbnail/cover, caption per target platform  
- Scheduled: publish date, platform variant complete. | Must | Defaults reduce setup burden; user can customize. |
| CR-34 | The system shall allow users to customize required roles per stage. | Should | Not all creators need same assets. |
| CR-35 | The system shall display a **Readiness State**: Complete, In Progress, Missing Assets, At Risk. | Must | Clear visual indicator. |
| CR-36 | The system shall show exactly which assets are missing. | Must | Actionable. |
| CR-37 | The system shall not block stage movement based on readiness; readiness is informational only. | Must | Avoid rigid enforcement. |

### 4.6 Views Derived from Content Items

| ID | Requirement | Priority | Description |
|---|---|---|---|
| CR-38 | The system shall provide a **List View** of Content Items with sortable columns: title, stage, due date, publish date, platform, readiness, tags. | Must | Core navigation. |
| CR-39 | The system shall provide a **Board View** with columns representing stages. Drag-and-drop to change stage. | Must | Kanban-style workflow. |
| CR-40 | The system shall provide a **Calendar View** showing items by publish date and/or due date. | Must | Planning. |
| CR-41 | The system shall provide a **Detail View** for a single item showing all fields, attachments, variants, history, and actions. | Must | Primary editing interface. |
| CR-42 | All views shall filter by tags, platforms, content pillar, stage, and readiness. | Must | Find what’s relevant. |
| CR-43 | The system shall support search within all views (delegates to search module). | Must | Search is core. |

### 4.7 Permissions & Data Control

| ID | Requirement | Priority | Description |
|---|---|---|---|
| CR-44 | The Content Item is private by default. | Must | Solo creator privacy. |
| CR-45 | The system shall allow manual sharing only via explicit user action (later collaboration module). | Should | Phase 2. |
| CR-46 | The system shall allow export of a Content Item as a portable file (JSON, Markdown, CSV) including metadata and attachment references. | Must | Avoid lock-in. |
| CR-47 | The system shall allow deletion of a Content Item without deleting original referenced files. | Must | Data control. |

### 4.8 Additional Content Item Management Requirements

| ID | Requirement | Priority | Description |
|---|---|---|---|
| CR-M1 | Revision History UI | Must | The system shall allow the user to view previous versions of scripts and captions, compare versions, and restore an older version. Revision history shall retain at least the last 20 revisions or 30 days of changes. |
| CR-M2 | Duplicate Content Item | Should | The system shall allow duplicating an existing Content Item with one action, copying its core metadata and optionally its linked asset references, platform variants, and tags. |
| CR-M3 | Pin / Favorite Content Item | Should | The user shall be able to mark a Content Item as pinned/favorite for quick access from the main list or dashboard. |
| CR-M4 | Content Item Activity Log | Should | The system shall record a timestamped activity log for major changes to a Content Item, including creation, stage changes, title/caption edits, platform variant changes, and deletion. The log shall be visible in the Content Item detail view. |
| CR-M5 | Content Templates | Phase 2 | The system shall support optional reusable templates for common content types, e.g., Short, Long, Carousel, Podcast. Templates may define default fields such as target aspect ratio, hook prompt, CTA prompt, and suggested stages. Deferred. Data model should allow defaults. |
| CR-M6 | Bulk Operations on Content Items | Should | The system shall allow selecting multiple Content Items and performing bulk actions: change stage/status, add/remove tags, assign scheduling lane, set due date, archive, or delete. Bulk delete requires confirmation. |
| CR-M7 | Footage Culling / Selects Workflow | Should | The system shall provide a bulk-triage/culling workflow to rate, reject, and compare raw footage takes. |

---

## 5. Data Model Considerations (Logical)

The Content Record will require at minimum:

- **ContentItem**
- **ContentStage** (or status history)
- **AttachmentReference**
- **PlatformVariant**
- **ContentRelationship** (source/derivative)
- **Tag**
- **ContentPillar**

This logical model will be finalized in the architecture phase.

---

## 6. Acceptance Criteria Summary

| User Story | Acceptance Criteria |
|---|---|
| US-01 | User can create a Content Item with only a title (optional) and it appears in the list. |
| US-02 | User can view attached script, raw footage, final export, thumbnail, caption, and schedule on one detail screen. |
| US-03 | User can move an item from Idea to Scripting and back; stage history is recorded. |
| US-04 | User can set a source item for a derivative; detail view shows the source and its derivative(s). |
| US-05 | User can add platform-specific caption, hashtags, title, and cover for Instagram and TikTok without duplicating the item. |
| US-06 | When an item is in Ready but missing a caption for target platform, the system shows Missing Assets and lists the missing item. |

---

## 7. Dependencies

- **FRS-02 Idea Capture** will create Content Items.
- **FRS-03 Asset Library & Search** will provide attachment references and metadata.
- **FRS-05 Calendar** will use Content Item dates and readiness.
- **FRS-06 Publishing Handoff** will use Platform Variants and Live URLs.
- **FRS-04 Repurposing Clip Library** will create derivative Content Items linked to source.

---

## 8. Open Questions / Decisions Needed

1. Should the system enforce a minimum set of required roles for “Ready” by default, or keep it purely informational? *(Current recommendation: informational, default roles shown but not enforced)*
2. Should Content Item support sub-items or tasks? *(Recommendation: No, keep separate from task management for MVP)*
3. Should we include a “Templates” feature for Content Items now or later? *(Confirmed: deferred to Phase 2. This decision is now reflected in CR-M5 priority.)*

---

## Change Log
| Version | Date | Summary |
|---|---|---|
| 1.1 | 2026-08-22 | Added missing MVP requirements CR-M1 to CR-M6 under Section 4.8. |
