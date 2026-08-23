# Functional Requirements Specification — Module 10  
**Module:** Script & Text Editor  
**Version:** 1.1  
**Status:** Draft for Review  
**Related Vision / PRD:** CreatorOS  
**Priority:** Must Have  

---

## 1. Purpose

The Script & Text Editor module provides a dedicated, mobile-friendly writing environment for scripts, captions, notes, hooks, and descriptions. It is the primary tool for content planning and scripting within CreatorOS.

The module must solve the validated problems:

> **Creators write scripts in Google Docs, Notion, or separate note apps, disconnected from their footage, assets, and posting workflow.**

> **Scripting is time-consuming and often done on mobile; creators need version history, formatting, and offline access.**

> **Scripts must be searchable, linked to shot lists, footage, and repurposed clips, and usable as teleprompter during filming.**

This module ensures that scripts are first-class content objects within CreatorOS, fully integrated with the Content Record, Asset Library, and Repurposing Clip Library.

---

## 2. Scope

This module covers:

- Text editor with rich formatting (minimal for mobile)
- Script-specific structure: title, hook, body, CTA, shot list, timestamps
- Version history and restore
- Teleprompter mode
- Import/export text (Markdown, plain text, Google Docs via share sheet)
- Linking script sections to assets/clips
- Offline editing and autosave
- Accessibility and text scaling
- Search integration

**Out of scope:** Full document collaboration, complex rich text with images/videos inline, real-time co-editing, advanced screenplay formatting (Final Draft style). These can be Phase 2+.

---

## 3. Key User Stories

### US-01 Write a Short-Form Script from Scratch

**As a** creator,  
**I want to** write a hook, body, and CTA in a simple editor on my phone,  
**so that** I can prepare my short video script anytime.

### US-02 Format Script for Readability

**As a** creator,  
**I want to** use headings, bold, lists, and timestamps,  
**so that** my script is easy to follow while filming.

### US-03 Use Script as Teleprompter

**As a** creator,  
**I want to** scroll my script automatically at adjustable speed while recording,  
**so that** I can deliver lines without memorizing.

### US-04 Recover Previous Version

**As a** creator,  
**I want to** view and restore an earlier version of my script,  
**so that** I don’t lose good lines.

### US-05 Import from Google Docs / Notes

**As a** creator,  
**I want to** import an existing script from Google Docs or Apple Notes,  
**so that** I don’t have to retype it.

### US-06 Link Script Sections to Footage

**As a** creator,  
**I want to** attach a clip or shot reference to a script line,  
**so that** I know which footage corresponds to which part.

---

## 4. Functional Requirements

### 4.1 Core Editor

| ID | Requirement | Priority | Description |
|---|---|---|---|
| SE-01 | The system shall provide a full-screen, distraction-free text editor for scripts and notes. | Must | Writing is core. |
| SE-02 | The system shall support plain text with minimal formatting: bold, italic, underline, headings (H1/H2), bulleted and numbered lists, and blockquote. | Must | Mobile-friendly. |
| SE-03 | The system shall support Markdown input optionally; formatting can be applied via toolbar or Markdown syntax. | Should | Familiar to many creators. |
| SE-04 | The system shall autosave continuously after each edit with debounce ≤1 second, persisting to the local database. | Must | No data loss. |
| SE-05 | The system shall show a “Saved” indicator and allow manual save. | Must | User confidence. |
| SE-06 | The system shall support undo/redo within the editor session, independent of version history. | Must | Basic editing. |
| SE-07 | The system shall support word count, character count, and reading time. | Should | Useful for captions/limits. |
| SE-08 | The system shall support dark/light theme and dynamic text scaling from OS. | Must | Accessibility. |
| SE-09 | The system shall keep the editor functional offline with no network calls. | Must | Offline-first. |
| SE-10 | The system shall provide keyboard shortcuts where available (e.g., external keyboard): bold, italic, undo, save. | Should | Power users. |

### 4.2 Script Structure & Fields

| ID | Requirement | Priority | Description |
|---|---|---|---|
| SE-11 | The system shall provide optional script sections: **Hook**, **Body**, **CTA**, and **Notes**. | Must | Short-form structure. |
| SE-12 | The system shall allow adding multiple **Timestamps** within the script to mark time-based sections. | Must | Align with video. |
| SE-13 | The system shall allow creating a **Shot List** inside the script, with each shot having a description and optional linked asset. | Should | Production. |
| SE-14 | The system shall allow assigning a **Script Type**: Short, Long, Carousel, Podcast, Other. | Should | Organization. |
| SE-15 | The system shall allow tagging specific lines as **Hook candidates**, **Caption text**, or **Thumbnail text**. | Should | Repurposing. |
| SE-16 | The system shall allow attaching a **CTA style** template (e.g., “Follow for more,” “Link in bio”). | Should | Consistency. |

### 4.3 Version History

| ID | Requirement | Priority | Description |
|---|---|---|---|
| SE-17 | The system shall automatically create a version snapshot every 5 minutes of active editing and at significant events (save, close, sync). | Must | Recovery. |
| SE-18 | The system shall retain at least the last 20 versions or 30 days of history per script. | Must | Minimum. |
| SE-19 | The user shall be able to view a list of previous versions with timestamp and word count. | Must | Browse. |
| SE-20 | The system shall allow previewing an old version side-by-side or overlay with current. | Should | Compare. |
| SE-21 | The user shall be able to restore an older version, which becomes a new version; the current version is preserved as history. | Must | No loss. |
| SE-22 | The system shall allow naming/saving a version manually (e.g., “Final for Reel”). | Should | User control. |
| SE-23 | Version history shall be searchable and exportable. | Should | Portability. |

### 4.4 Teleprompter Mode

| ID | Requirement | Priority | Description |
|---|---|---|---|
| SE-24 | The system shall provide a full-screen teleprompter view of the script. | Phase 2 | High value for creators. |
| SE-25 | The system shall allow adjustable scroll speed (words per minute). | Phase 2 | Core teleprompter. |
| SE-26 | The system shall allow adjustable font size (16–96 pt) and high-contrast theme. | Phase 2 | Readability. |
| SE-27 | The system shall support pause/play with a large button and tap gesture. | Phase 2 | Easy control. |
| SE-28 | The system shall support mirror mode (horizontal flip) for use with teleprompter rigs. | Phase 2 | Professional. |
| SE-29 | The system shall keep the screen awake while teleprompter is active, with a battery warning. | Phase 2 | Practical. |
| SE-30 | The system shall sync teleprompter position with timestamps if available. | Phase 2 | Useful. |
| SE-31 | The system shall not auto-play audio or read script unless user initiates accessibility feature. | Phase 2 | Avoid surprise. |

### 4.5 Import / Export

| ID | Requirement | Priority | Description |
|---|---|---|---|
| SE-32 | The system shall support importing text from share sheet: Google Docs, Apple Notes, plain text, Markdown files. | Must | Migration. |
| SE-33 | The system shall support exporting script as plain text, Markdown, or PDF. | Must | Portability. |
| SE-34 | The system shall support copy entire script or selected sections to clipboard. | Must | Quick use. |
| SE-35 | The system shall support exporting script with timestamps as a CSV/JSON for editor integration. | Should | Workflow. |
| SE-36 | Imported text shall become a Script attached to a Content Item or as standalone Script note, user selectable. | Must | Flexibility. |

### 4.6 Linking Script to Assets & Clips

| ID | Requirement | Priority | Description |
|---|---|---|---|
| SE-37 | The user shall be able to link an asset (video/image) or a Clip to any line/section of the script. | Should | Traceability. |
| SE-38 | The linked reference shall display as an inline chip or footnote. | Should | Context. |
| SE-39 | Clicking the linked asset shall open the asset preview or clip detail. | Should | Navigation. |
| SE-40 | The system shall automatically link script segments to clips created from the same source if transcript matches (Phase 2). | Phase 2 | AI later. |
| SE-41 | The system shall allow quick search of assets while script is open to insert references. | Should | Efficiency. |

### 4.7 Search & Integration

| ID | Requirement | Priority | Description |
|---|---|---|---|
| SE-42 | All script text shall be indexed in FTS for global search. | Must | Findability. |
| SE-43 | The user shall be able to search within the current script (find/replace). | Must | Editing. |
| SE-44 | The system shall show search results from other scripts while editing, as suggestions. | Should | Cross-reference. |
| SE-45 | The script shall be associated with a Content Item (or standalone), and accessible from Content Item detail. | Must | Core relationship. |
| SE-46 | The script editor shall be accessible from Idea detail when converting idea to script. | Should | Workflow. |

---

### 4.99 Missing MVP Requirements (Completeness Sweep)

| ID | Requirement | Priority | Description |
|---|---|---|---|
| SE-M6 | Read-only mode | Phase 2 | The system shall provide a read-only mode for scripts when they are actively being read in the teleprompter or locked. |

## 5. Data Model Considerations (Logical)

- **Script** entity linked to ContentItem or standalone.
- **ScriptSection** or **ScriptBlock** for structured parts.
- **ScriptVersion** storing snapshots.
- **ScriptAssetLink** for inline references.
- **ScriptTag** / metadata.
- **TeleprompterSettings** as part of user preferences.

These will be refined during architecture design.

---

## 6. Acceptance Criteria Summary

| User Story | Acceptance Criteria |
|---|---|
| US-01 | User can create a script with Hook, Body, CTA sections, save offline, and see it in Content Item. |
| US-02 | Formatting toolbar works; script displays bold/headings/lists correctly. |
| US-03 | Teleprompter starts, scrolls at adjustable speed, pauses/resumes, screen stays awake. |
| US-04 | Version history list is accessible; restore creates new version preserving current. |
| US-05 | User can import a Google Doc via share sheet; content becomes script. |
| US-06 | User can add a clip reference to a script line; tapping opens clip detail. |

---

## 7. Dependencies

- **FRS-01 Core Content Record** — script belongs to content item.
- **FRS-02 Idea Capture** — conversion to script.
- **FRS-03 Asset Library** — inline asset reference.
- **FRS-04 Repurposing Clip Library** — clip reference.
- **FRS-08 Offline & Sync** — autosave, version sync.
- **NFR-06 Accessibility** — large text, teleprompter accessibility.

---

## 8. Open Questions / Decisions Needed

1. Should the editor be WYSIWYG or Markdown-based?  
   *Recommendation: WYSIWYG with Markdown shortcuts for MVP; full Markdown view optional.*

2. Should we support inline images/videos in scripts?  
   *Recommendation: No inline media; use linked references to keep editor light.*

3. Should teleprompter mode be part of MVP?  
   *Confirmed: Teleprompter is deferred to Phase 2 to reduce MVP scope.*

4. How long should version history be retained in free tier?  
   *Recommendation: 20 versions or 30 days, whichever longer; Pro can extend.*

5. Should we provide script templates?  
   *Recommendation: Yes, a few built-in templates for Short, Long, Carousel.*

---


## 99. Change Log

| Version | Date | Summary |
|---|---|---|
| 1.1 | 2026-08-22 | Completeness sweep: added missing requirements. |
| 1.2 | 2026-08-23 | Changed teleprompter-dependent read-only mode from Must to Phase 2. |
