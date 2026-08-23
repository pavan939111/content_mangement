# Functional Requirements Specification — Module 06  
**Module:** Publishing Handoff  
**Version:** 1.1  
**Status:** Draft for Review  
**Related Vision / PRD:** CreatorOS  
**Priority:** Must Have (Handoff) / Should (API auto-publish)  

---

## 1. Purpose

The Publishing Handoff module prepares a Content Item for publication and manages the transition from “Ready” to “Published” across target platforms.

It must solve the validated problems:

> **Third-party tools cannot always publish every format or feature, and creators often need native final steps (trending sounds, drafts, platform-specific edits).**

> **Publishing status can be unclear: scheduled vs. published vs. failed vs. needs manual action.**

> **Cross-posting is not export-once-publish-everywhere; creators manually adapt and upload per platform.**

This module does **not** attempt to replace native platform apps or guarantee universal one-click publishing. Instead, it provides:

- A **capability matrix** that tells the user how each target platform can be published (auto, native draft, reminder, unsupported).
- A **publishing state machine** with clear transitions.
- **Platform-specific variant packaging** (captions, hashtags, titles, covers) linked to the Content Item.
- **Pre-publication validation** (aspect ratio, duration, file type, captions, cover, etc.).
- **Native handoff** with one-tap export/copy/deep link and reminders.
- **Failure logging** and recovery guidance.

In MVP, direct API auto-publishing may be limited or absent; the primary value is **clarity, preparation, and reliable handoff**.

---

## 2. Scope

This module covers:

- Publishing state model (Draft, Ready, Scheduled, Published, Failed, Requires Native Action)
- Platform capability matrix per connected account/content type
- Platform-specific variant management
- Pre-publication validation checks
- Native posting handoff (export, copy, deep link, reminders)
- Failure and retry guidance (if API publish attempted)
- Publishing history and live URL recording
- Integration with device share sheet and platform apps

**Out of scope:**  
Full social inbox, comment management, cross-platform analytics (FRS-09), AI auto-caption generation, guaranteed universal auto-publish.

---

## 3. Key User Stories

### US-01 See How I Can Publish to Each Platform

**As a** creator,  
**I want to** see whether I can auto-publish, schedule natively, or must post manually for each platform,  
**so that** I don’t assume a post went live when it didn’t.

### US-02 Prepare Platform-Specific Captions and Hashtags

**As a** creator,  
**I want to** store separate captions, hashtags, titles, and covers for Instagram, TikTok, YouTube, and X,  
**so that** I can quickly copy them when posting natively.

### US-03 Get a Reminder for Native Posting

**As a** creator,  
**I want to** set a reminder with a deep link to the native app and the caption already copied,  
**so that** I post at the right time without forgetting.

### US-04 Validate Before Publishing

**As a** creator,  
**I want to** know if my video is the wrong aspect ratio, too long, missing a cover, or missing a caption before I try to post,  
**so that** I can fix issues before hitting publish.

### US-05 Record When a Post Is Published

**As a** creator,  
**I want to** mark an item as published and store the live URL,  
**so that** I can track what went out and when.

### US-06 Handle Publishing Failures

**As a** creator,  
**I want to** see why an auto-publish attempt failed and what to do next,  
**so that** I can quickly recover without losing confidence.

---

## 4. Functional Requirements

### 4.1 Publishing State Machine

| ID | Requirement | Priority | Description |
|---|---|---|---|
| PUB-01 | The system shall track publishing states per Content Item as defined in NFR-08 §7.1. MVP-relevant states include: Draft, Ready, Scheduled, Published, Failed, Requires Native Action, Archived. | Must | Clear status. |
| PUB-02 | The system shall allow manual transition between allowed states. | Must | User control. |
| PUB-03 | The system shall record a timestamp and user for each state transition. | Should | History. |
| PUB-04 | The system shall show the current publishing state prominently in list, board, calendar, and detail views. | Must | Visibility. |
| PUB-05 | The state **Ready** shall require at least one target platform variant and a final export or equivalent link (subject to readiness from FRS-01). | Must | Avoid premature scheduling. |
| PUB-06 | The state **Scheduled** shall require a publish date/time and at least one platform variant. | Must | Basic readiness. |
| PUB-07 | The system shall allow marking an item as **Published** manually, with optional live URL(s). | Must | Native posts. |
| PUB-08 | If auto-publish is used, the system shall transition to **Published** only after platform confirmation; otherwise to **Failed**. | Should | Accuracy. |

### 4.2 Platform Capability Matrix

| ID | Requirement | Priority | Description |
|---|---|---|---|
| PUB-09 | The system shall maintain a **Platform Capability Matrix** that defines, for each platform and content type, whether the system can: **Auto-Publish**, **Schedule as Native Draft**, **Reminder Only**, or **Unsupported**. | Must | Sets expectations. |
| PUB-10 | The matrix shall be configurable via remote configuration because platform rules change. | Must | Maintainable. |
| PUB-11 | The matrix shall consider account type (personal, business, creator) and connection status when displaying capabilities. | Must | Accuracy. |
| PUB-12 | The system shall display the capability for each selected target platform in the Content Item detail and scheduling flow. | Must | Transparency. |
| PUB-13 | The system shall explain the reason if a capability is limited (e.g., “Account not professional”, “Facebook Page not connected”, “Unsupported format”). | Should | Actionable. |
| PUB-14 | The system shall not promise auto-publish for platforms/accounts where it is not supported. | Must | Avoid mislead. |

### 4.3 Platform Variants & Packaging

| ID | Requirement | Priority | Description |
|---|---|---|---|
| PUB-15 | The system shall allow storing platform-specific variants per Content Item for: Instagram, TikTok, YouTube Shorts, YouTube Long, X, Other. | Must | Cross-posting. |
| PUB-16 | Each variant shall include: caption, hashtags, title (if applicable), description, thumbnail/cover reference, and status. | Must | Complete package. |
| PUB-17 | The system shall allow duplicating a variant to another platform with edits. | Should | Efficiency. |
| PUB-18 | The system shall allow marking a variant as **Primary** per platform. | Should | Clarity. |
| PUB-19 | The system shall allow copying variant text to the clipboard with one tap. | Must | Native posting. |
| PUB-20 | The system shall allow exporting variant text and media reference to the share sheet. | Must | Handoff. |

### 4.4 Pre-Publication Validation

| ID | Requirement | Priority | Description |
|---|---|---|---|
| PUB-21 | The system shall validate per target platform: aspect ratio, duration, file size, file type, cover/thumbnail presence, caption presence, and required audio/text (where known). | Should | Prevent failures. |
| PUB-22 | The system shall show a validation summary with pass/fail per platform before scheduling or handoff. | Must | Clarity. |
| PUB-23 | Validation rules shall be configurable remotely and updated frequently. | Must | Platform changes. |
| PUB-24 | Validation shall be informational, not blocking; user can override. | Must | Flexibility. |
| PUB-25 | The system shall warn if the final export does not match the target platform’s recommended settings. | Should | Quality. |
| PUB-26 | The system shall allow running validation manually and automatically when a user attempts to schedule/mark ready. | Should | Convenience. |

### 4.5 Native Handoff

| ID | Requirement | Priority | Description |
|---|---|---|---|
| PUB-27 | For platforms where auto-publish is unsupported or user prefers native posting, the system shall provide a **Native Handoff** action. | Must | Core workflow. |
| PUB-28 | Native Handoff shall open the target platform’s app or web via deep link, if available, with the final asset ready to select. | Should | Speed. |
| PUB-29 | The system shall copy the caption/hashtags to the clipboard automatically when initiating native handoff. | Must | Reduce friction. |
| PUB-30 | The system shall allow setting a reminder at the scheduled time with the native handoff action. | Must | Don’t forget. |
| PUB-31 | The system shall provide a checklist for native posting: select file, paste caption, add sound, add cover, add location, tag accounts, publish. | Should | Guidance. |
| PUB-32 | The system shall allow marking the item as **Published** manually after native posting and adding the live URL. | Must | Record. |
| PUB-33 | The system shall support undo/mark as not published if mistakenly marked. | Should | Correction. |

### 4.6 Auto-Publish (Phase 2 / Optional)

| ID | Requirement | Priority | Description |
|---|---|---|---|
| PUB-34 | The system may support direct API auto-publish for platforms/accounts where APIs and user permissions allow. | Phase 2 | Not MVP. |
| PUB-35 | If auto-publish is available, the system shall allow scheduling a specific date/time. | Phase 2 | Convenience. |
| PUB-36 | The system shall attempt to publish via the platform API and record success/failure. | Phase 2 | Automation. |
| PUB-37 | On failure, the system shall provide the error reason and suggest native handoff. | Phase 2 | Recovery. |
| PUB-38 | The system shall not auto-retry more than a configurable number of times without user confirmation. | Phase 2 | Avoid duplicate posts. |
| PUB-39 | The system shall keep the scheduled state until a publish attempt is made; then transition appropriately. | Phase 2 | Clarity. |

### 4.7 Publishing History & Live URLs

| ID | Requirement | Priority | Description |
|---|---|---|---|
| PUB-40 | The system shall allow recording multiple live URLs per Content Item, one per platform. | Must | Traceability. |
| PUB-41 | The system shall store the publish date/time for each platform separately. | Must | Actual vs planned. |
| PUB-42 | The system shall display publishing history in the Content Item detail: platform, date, URL, status. | Should | Review. |
| PUB-43 | The system shall allow editing or removing a recorded live URL. | Should | Correct mistakes. |
| PUB-44 | The system shall support manual entry of live URL when platform cannot be auto-detected. | Must | Native posts. |

### 4.8 Reminders & Notifications

| ID | Requirement | Priority | Description |
|---|---|---|---|
| PUB-45 | The system shall allow setting reminders for native posting at the scheduled time. | Must | Core. |
| PUB-46 | The system shall allow setting a reminder lead time (e.g., 10 minutes before, 30 minutes before). | Should | Flexibility. |
| PUB-47 | The reminder shall include the platform, caption copy, and deep link/handoff action. | Must | Effectiveness. |
| PUB-48 | The system shall support notification actions: “Mark as Published” and “Snooze”. | Should | Quick action. |
| PUB-49 | The system shall allow multiple reminders for different platforms. | Should | Cross-posting. |
| PUB-50 | The system shall not send reminders if the item is already marked published for that platform. | Must | Avoid noise. |

### 4.9 Integrations & Data Control

| ID | Requirement | Priority | Description |
|---|---|---|---|
| PUB-51 | The system shall allow connecting platform accounts via OAuth for capabilities that require API (Phase 2). No platform account connections in MVP. | Phase 2 | For auto-publish. |
| PUB-52 | The system shall securely store platform credentials/tokens using device keychain/secure storage. | Must | Security. |
| PUB-53 | The system shall allow disconnecting a platform account at any time, with confirmation. | Must | Control. |
| PUB-54 | The system shall allow exporting publishing history and live URLs as part of full data export. | Must | Portability. |
| PUB-55 | The system shall not access or publish content without explicit user action for each item. | Must | Trust. |

### 4.10 Additional Publishing Handoff Requirements

| ID | Requirement | Priority | Description |
|---|---|---|---|
| PUB-M1 | Platform Connection Management UI | Phase 2 | Manage platform connections for publishing APIs. Not available in MVP (manual native handoff only). |
| PUB-M2 | Publishing Queue Screen | Must | The system shall provide a Publishing Queue screen listing all Content Items with scheduled, pending, failed, or needs-attention publishing states. The queue shall allow filtering by platform, state, and date, and support actions: retry, cancel scheduled post, mark for native action, and view error details. |
| PUB-M3 | Manual Mark as Published Workflow | Must | The system shall provide a clear workflow for manually marking an item as published. The user shall be able to select the platform, enter the live URL and publish date/time, and confirm. This action shall update the publishing state and record the live URL in the Content Item. |
| PUB-M4 | Platform-Specific Character Count Validation | Should | The system shall validate caption, title, and hashtag character counts against each target platform’s current limits. Character-count validation is Should for MVP because exact limits change and can be remote-configured. Basic length warnings are Must. |
| PUB-M5 | Deep-link registry for native handoff | Must | The system shall maintain a registry of supported deep links for native app handoff (TikTok, Instagram, YouTube) and define fallback behaviors when composition endpoints are unsupported. |
| PUB-M6 | Copy All Variant Text | Must | The system shall provide one-tap copy of all variant text (caption, hashtags, title if applicable) for a selected platform to the clipboard, for use in native posting. |
| PUB-M7 | Publishing History per Content Item | Must |  The system shall display a publishing history timeline in the Content Item detail view, listing each platform, published date/time, live URL, and status. The user shall be able to edit or remove a recorded live URL.  |
| PUB-M8 | Post Preview Mock | Should | The system shall allow the user to preview a simulated platform post with the selected media, caption, hashtags, and thumbnail/cover before publishing or handoff. This helps verify content packaging. |

---

## 5. Data Model Considerations (Logical)

The Publishing Handoff module will require:

- **PublishingState** (enum)
- **PlatformCapability** (config)
- **PlatformAccountConnection** (optional Phase 2)
- **PlatformVariant** (or reuse from FRS-01)
- **PublishingValidationResult**
- **PublishingAttempt** (for auto-publish attempts)
- **PublishedURLRecord**
- **PublishingReminder**

These will be refined during architecture design.

---

## 6. Acceptance Criteria Summary

| User Story | Acceptance Criteria |
|---|---|
| US-01 | For a selected Content Item, user sees per platform whether it’s Auto-Publish, Native Draft, Reminder Only, or Unsupported, with reason if limited. |
| US-02 | User can store different captions/hashtags for Instagram and TikTok; copying to clipboard works. |
| US-03 | User sets a native posting reminder; reminder notification includes deep link and copied caption. |
| US-04 | Validation shows aspect ratio/duration/caption/cover pass/fail for each target platform before scheduling. |
| US-05 | User manually marks an item as Published and enters live URL; item shows as Published in all views. |
| US-06 | If an auto-publish attempt fails, system shows error and offers native handoff. |

---

## 7. Dependencies

- **FRS-01 Core Content Record** — Platform variants, target platforms, readiness, and asset references.
- **FRS-03 Asset Library** — Final exports and thumbnails for validation.
- **FRS-05 Calendar** — Scheduling and reminders.
- **FRS-08 Offline & Sync** — Reminders and offline preparation.
- **FRS-07 Integrations** — OAuth connections for platform APIs (Phase 2).
- **FRS-02 Idea Capture** — Not directly, but original inspiration link may become live URL later.

---

## 8. Open Questions / Decisions Needed

1. Should we include any direct auto-publish in MVP (e.g., only YouTube via API) or defer all auto-publish to Phase 2?  
   *Recommendation: Defer all auto-publish to Phase 2. MVP focuses on handoff, validation, and reminders.*

2. Should the capability matrix be hardcoded for MVP or remotely configurable?  
   *Recommendation: Remotely configurable from day one; platform rules change frequently.*

3. How should we handle TikTok/Instagram native deep links?  
   *Recommendation: Use standard URL schemes where available; fallback to opening app store or web.*

4. Should the system attempt to auto-detect published status from platform APIs (Phase 2)?  
   *Recommendation: Yes, but only with user permission and for connected accounts.*

5. Should validation include hashtag limits?  
   *Confirmed: character-count validation is Should, not Must. Remote config handles limits.*

---

## Change Log
| Version | Date | Summary |
|---|---|---|
| 1.1 | 2026-08-22 | Added missing MVP requirements PUB-M1 to PUB-M7 under Section 4.10. |
| 1.2 | 2026-08-23 | Reordered PUB-M requirements table by ID. |
