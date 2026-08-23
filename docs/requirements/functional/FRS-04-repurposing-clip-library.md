# Functional Requirements Specification â€” Module 04  
**Module:** Repurposing Clip Library  
**Version:** 1.1  
**Status:** Draft for Review  
**Related Vision / PRD:** CreatorOS  
**Priority:** Must Have  

---

## 1. Purpose

The Repurposing Clip Library enables creators to **identify, save, organize, and reuse short moments** from long-form videos, raw footage, voice notes, and existing content.

It must solve the validated problems:

> **Manual repurposing is slow and repetitive. Creators scrub footage, mark timestamps, export segments, reframe, caption, and repackage across platforms.**

> **Reuse candidates are often not captured during the original edit, forcing creators to rewatch old footage later.**

The module shifts reuse from â€œrediscovery laterâ€ to â€œcapture once at the source.â€ It creates a persistent, searchable clip bank where each clip retains its original context, transcript, hook, and reuse history.

**Important nuance from research:**  
- The need for a â€œclip bankâ€ is strong but the exact full metadata schema is partly inferred.  
- Duplicate/reuse tracking was unconfirmed as a major pain; we include provenance as optional, not as a core marketing claim.  
- The product must not claim platform policy compliance or duplicate-content safety.

---

## 2. Scope

This module covers:

- Marking a reusable moment on video/audio with in/out timecode
- Storing clip metadata: transcript excerpt, hook, topic, quality, suggested platform
- Maintaining a Clip Library separate from raw footage
- Linking source content and all derivatives
- Searching and filtering clips
- Platform-specific packaging checklists
- Usage and publishing history
- Exporting marked moments to editors / platform drafts

**Out of scope:**  
Automatic AI clip generation (Phase 3), actual video editing, automatic posting, policy compliance analysis.

---

## 3. Key User Stories

### US-01 Mark a Reusable Moment During Review

**As a** creator,  
**I want to** select in/out points on a video and save it as a clip,  
**so that** I can reuse that moment later without rewatching the full source.

### US-02 Save Context with the Clip

**As a** creator,  
**I want to** store the transcript, hook, topic, and suggested platform with each clip,  
**so that** I know why I saved it and how to use it.

### US-03 Find a Clip by Hook or Topic

**As a** creator,  
**I want to** search my Clip Library for â€œreaction hookâ€ or â€œproductivity tip,â€  
**so that** I can quickly find reuse candidates.

### US-04 Trace a Clip to Its Source

**As a** creator,  
**I want to** see which long video a clip came from and its timecode,  
**so that** I can return to the source if I need more context.

### US-05 See Where a Clip Has Been Published

**As a** creator,  
**I want to** know if a clip has already been used on TikTok, Reels, Shorts, or X,  
**so that** I can decide whether to reuse or adapt it.

### US-06 Package a Clip for Multiple Platforms

**As a** creator,  
**I want to** see platform-specific requirements (9:16, captions, cover, CTA) for a selected clip,  
**so that** I can prepare it correctly for each destination.

---

## 4. Functional Requirements

**MVP proxy limitation:** low-res video proxies are deferred to Phase 2. Clip preview and in/out marking are available only for assets with locally accessible original files. Assets that are cloud-only or on disconnected drives will display metadata and thumbnail only, and clip marking will be disabled until proxies are implemented.

### 4.1 Clip Marking and Capture

| ID | Requirement | Priority | Description |
|---|---|---|---|
| RP-01 | The system shall allow the user to select in/out timecodes on a video or audio asset to create a **Clip**. | Must | Core repurposing action. |
| RP-02 | The system shall allow timecode selection while previewing a video or audio proxy, including scrubbing and frame stepping. | Must | Accurate selection. |
| RP-03 | The system shall allow creating a clip from any indexed video or audio asset in the Asset Library. | Must | Works across all sources. |
| RP-04 | The system shall allow creating a clip from a Content Itemâ€™s raw footage or final export attachment. | Must | Integrated into workflow. |
| RP-05 | The system shall allow creating a clip from the current editing tool via share-sheet or export, where supported. | Should | Reduce friction. |
| RP-06 | The system shall auto-generate a clip thumbnail from the selected start frame. | Should | Visual recognition. |
| RP-07 | The system shall allow the user to edit in/out points after creation. | Must | Refinement. |
| RP-08 | The system shall allow deleting a clip without deleting the source file. | Must | Non-destructive. |

### 4.2 Clip Metadata and Context

| ID | Requirement | Priority | Description |
|---|---|---|---|
| RP-09 | When transcript is available, the system shall automatically populate the clipâ€™s **transcript excerpt** from the source transcript between in/out points. | Must | Core context. |
| RP-10 | The system shall allow the user to edit the transcript excerpt. | Must | Correct transcription errors. |
| RP-11 | The system shall support manual fields: **hook**, **topic/content pillar**, **quality note**, **suggested platform(s)**, **CTA**, and **tags**. | Must | Enables meaningful search. |
| RP-12 | The system shall auto-fill topic/tags from source Content Item or source asset metadata where available. | Should | Reduce manual entry. |
| RP-13 | The system shall allow marking a clip as **Candidate**, **Approved**, **Used**, or **Archived**. | Must | Lifecycle clarity. |
| RP-14 | The system shall record when and by whom the clip was created (local user only in MVP). | Must | Audit. |
| RP-15 | The system shall not require any metadata fields to save a clip; timecode is sufficient. | Must | Low friction. |

### 4.3 Clip Library and Search

| ID | Requirement | Priority | Description |
|---|---|---|---|
| RP-16 | The system shall maintain a dedicated **Clip Library** separate from raw footage and regular assets. | Must | Focused reuse workspace. |
| RP-17 | The system shall display clips as cards with thumbnail, duration, hook, topic, source, and status. | Must | Fast scanning. |
| RP-18 | The system shall provide list and grid views. | Should | Preference. |
| RP-19 | The system shall support search across clip transcript, hook, topic, tags, source title, and notes. | Must | Core discoverability. |
| RP-20 | The system shall support filters: status, platform, topic, duration, source, date, usage history. | Must | Targeted retrieval. |
| RP-21 | The system shall allow opening the source asset at the exact timecode. | Must | Traceability. |
| RP-22 | The system shall allow sorting by date created, duration, most used, and last used. | Should | Efficiency. |
| RP-23 | The system shall allow batch operations: tag, archive, delete, change status. | Should | Cleanup. |

### 4.4 Source / Derivative Relationships

| ID | Requirement | Priority | Description |
|---|---|---|---|
| RP-24 | The system shall store the source asset and timecode for every clip. | Must | Non-negotiable context. |
| RP-25 | The system shall link a clip to its parent **Content Item** if created from one. | Must | Cross-reference. |
| RP-26 | When a clip is converted into a new Content Item, the system shall create a **source-derivative** relationship. | Must | Traceability. |
| RP-27 | The system shall support multiple derivatives from one source and multiple platform variants from one clip. | Must | Real repurposing. |
| RP-28 | The system shall display source and derivative relationships in both clip detail and Content Item detail. | Must | Navigable. |
| RP-29 | The system shall preserve derivative relationships even if the source asset is moved or offline. | Must | Resilient. |

### 4.5 Platform Packaging and Variants

| ID | Requirement | Priority | Description |
|---|---|---|---|
| RP-30 | The system shall provide a **platform packaging checklist** per clip for TikTok, Instagram Reels, YouTube Shorts, and X. | Should | Validated cross-platform friction. |
| RP-31 | The checklist shall include: aspect ratio (9:16), duration, captions/subtitles, cover/thumbnail, hook/CTA, hashtags, sound/music, native text/effects. | Should | Practical guidance. |
| RP-32 | The system shall allow storing **platform-specific variants** for a clip: caption, hashtags, title, cover, and exported file version. | Should | Prep for publishing. |
| RP-33 | The system shall allow creating a platform variant from the clipâ€™s source, either as an export task or a linked file. | Should | Handoff. |
| RP-34 | The system shall integrate with FRS-06 Publishing Handoff to attach a clip variant to a scheduled Content Item. | Should | Avoid duplicate work. |
| RP-35 | The system shall not claim that packaging guarantees native platform feature parity. | Must | Avoid overpromise. |

### 4.6 Usage History and Provenance

| ID | Requirement | Priority | Description |
|---|---|---|---|
| RP-36 | The system shall record when a clip has been used in a Content Item or published post. | Should | Reuse awareness. |
| RP-37 | The system shall display usage history: platforms, dates, linked Content Items, published URLs. | Should | Informed reuse. |
| RP-38 | The system shall indicate if a clip has been **Published**, **Used in Draft**, or **Unused**. | Should | Quick status. |
| RP-39 | The system shall allow filtering by usage history (e.g., â€œUnused clips onlyâ€). | Should | Fresh content. |
| RP-40 | The system shall not present usage history as a platform policy compliance check. It is informational only. | Must | Avoid unvalidated claim. |
| RP-41 | The system shall optionally warn when a user reuses a clip that is already used in the same target platform within a short period. | Phase 2 | Helpful but not core. |

### 4.7 Export and Integration

| ID | Requirement | Priority | Description |
|---|---|---|---|
| RP-42 | The system shall allow exporting a clipâ€™s metadata as JSON/CSV. | Must | Portability. |
| RP-43 | The system shall allow exporting the clip timecode and transcript to the clipboard or share sheet. | Should | Handoff. |
| RP-44 | The system shall allow opening the source file directly in an installed editor if available. | Should | Real workflow. |
| RP-45 | The system shall allow generating a new Content Item from a clip with one action, prefilled with clip metadata. | Must | Core transition. |
| RP-46 | The system shall not silently create a separate copy of the raw source video unless the user explicitly exports/renders. | Must | Storage control. |

### 4.8 Additional Clip Library & Repurposing Requirements

| ID | Requirement | Priority | Description |
|---|---|---|---|
| RP-M1 | Clip Preview Before Saving | Should | The system shall allow the user to preview the selected in/out range of a locally available video or audio asset before saving it as a Clip. For cloud-only or disconnected assets, preview may be limited to the cached thumbnail until proxies are available in Phase 2. |
| RP-M2 | Export Clip Metadata to Editor | Should | The system shall allow exporting the clip's timecode, transcript excerpt, hook, and source reference to the clipboard or share sheet for use in an external editor. This does not require local proxy generation. |
| RP-M3 | Batch Clip Creation | Should | The system shall allow creating multiple clips from the same source asset in one session, such as marking several in/out ranges sequentially and saving them as separate Clip records. |
| RP-M4 | Clip Detail Editing UI | Must | The system shall provide a dedicated Clip detail screen where the user can edit in/out timecodes, transcript excerpt, hook, topic, tags, status, and suggested platform. Changes shall be saved locally and reflected in the Clip Library immediately. |
| RP-M5 | Clip Deletion & Undo | Must | **Normative source:** [FRS-12-notifications-reminders-trash.md](FRS-12-notifications-reminders-trash.md), section on Undo/Trash. |
| RP-M6 | Clip Sharing | Should | The system shall allow sharing Clip metadata and a proxy preview via the system share sheet. The shared content shall include the clip's hook, transcript excerpt, tags, and source attribution. |
| RP-M7 | Batch Clip Actions | Should | The system shall allow selecting multiple clips and performing bulk actions: change status, add/remove tags, archive, or delete. Bulk delete requires confirmation. |

---

## 5. Data Model Considerations (Logical)

The Repurposing Clip Library requires at minimum:

- **Clip**
- **ClipStatus**
- **SourceAssetReference** (source asset + in/out timecode)
- **ClipTranscriptSegment** (or excerpt)
- **ClipTag**
- **ContentItemClipLink** (when clip becomes content)
- **ClipPlatformVariant**
- **ClipUsageHistory**
- **SourceDerivativeRelationship**

This logical model will be refined during architecture design.

---

## 6. Acceptance Criteria Summary

| User Story | Acceptance Criteria |
|---|---|
| US-01 | User can preview a video, set in/out points, and save a clip; clip appears in Clip Library with thumbnail and duration. |
| US-02 | If source transcript exists, clip detail shows the transcript excerpt between in/out points; user can edit it. |
| US-03 | Searching for a hook phrase or topic returns matching clips with source and status visible. |
| US-04 | Clip detail shows source asset and timecode; tapping opens source at the correct timecode. |
| US-05 | Clip detail shows published platforms and dates if linked; user can filter by Used/Unused. |
| US-06 | User can convert a clip into a Content Item; title, tags, hook, transcript, and source link carry over. |

---

## 7. Dependencies

- **FRS-01 Core Content Record** â€” Clip conversion creates Content Items; source/derivative relationships rely on it.
- **FRS-03 Asset Library & Search** â€” Clip source files must be indexed and searchable; transcript search depends on asset transcripts.
- **FRS-06 Publishing Handoff** â€” Platform variants and usage history connect to publishing.
- **FRS-08 Offline & Sync** â€” Clip creation and metadata must work offline.
- **FRS-07 Integrations** â€” Share-sheet export to editors and platform drafts.

---

## 8. Open Questions / Decisions Needed

1. Should the MVP allow actual clip export/render inside the app, or only store timecodes and reference the source?  
   *Recommendation: Store timecodes and reference only. Render/export may be Phase 2 or handled by external editors.*

2. Should the system auto-generate clips using AI transcript analysis in MVP?  
   *Recommendation: No. Manual marking only. AI suggestions can come later to avoid accuracy/trust issues.*

3. Should the Clip Library include audio-only clips (e.g., voice note moments)?  
   *Recommendation: Yes, audio can be clipped and transcribed like video.*

4. How should usage history be tracked when a clip is posted natively outside CreatorOS?  
   *Recommendation: Manual link/confirmation in MVP. Automatic tracking where platform APIs permit in later phases.*

5. Should platform-specific packaging checklists be mandatory or informational?  
   *Recommendation: Informational checklists, not blocking. Users may ignore if not relevant.*

---

## Change Log
| Version | Date | Summary |
|---|---|---|
| 1.1 | 2026-08-22 | Added missing MVP requirements RP-M1 to RP-M7 under Section 4.8. |

| 1.2 | 2026-08-22 | P2-4: De-duplicated content; added normative source pointers. |

