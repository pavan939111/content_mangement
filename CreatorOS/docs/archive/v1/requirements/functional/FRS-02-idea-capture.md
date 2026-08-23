# Functional Requirements Specification — Module 02  
**Module:** Idea Capture  
**Version:** 1.1  
**Status:** Draft for Review  
**Related Vision / PRD:** CreatorOS  
**Priority:** Must Have  

---

## 1. Purpose

The Idea Capture module enables a solo short-form creator to capture an idea in the moment—via text, voice, photo, video, link, or imported share—even when offline.

It must solve the validated problem:

> **Creators capture inspiration in too many disconnected places, lose ideas before production, and struggle to turn quick notes into planned content.**

This module must be **frictionless**, requiring zero mandatory fields at capture time. The system must preserve as much context as possible automatically and ensure captured ideas enter a manageable inbox that can later become a Content Item.

---

## 2. Scope

This module covers:

- Capture modalities: text, voice, photo, video, link, share-sheet import
- Automatic context preservation
- Voice transcription
- Idea Inbox and basic triage
- Conversion from Idea → Content Item
- Resurfacing and reminders
- Offline capture and sync behavior

**Out of scope:**  
Script editing, asset search, calendar scheduling, publishing, analytics, and collaboration. Those modules will consume or link to captured ideas.

---

## 3. Key User Stories

### US-01 Capture an Idea Instantly

**As a** solo creator,  
**I want to** capture a thought in one tap from the home screen or share sheet,  
**so that** I don’t lose the idea.

### US-02 Capture Voice While Offline

**As a** creator,  
**I want to** record a voice note while I’m offline or in airplane mode,  
**so that** my idea is saved even without internet.

### US-03 Preserve Source Context Automatically

**As a** creator,  
**I want to** save a TikTok/Instagram/YouTube link or screenshot with its source and preview,  
**so that** I remember why I saved it.

### US-04 Convert an Idea into Content

**As a** creator,  
**I want to** turn a captured idea into a Content Item without retyping,  
**so that** it moves from my head into my production workflow.

### US-05 See Unprocessed Ideas

**As a** creator,  
**I want to** see a list of ideas I haven’t processed yet,  
**so that** they don’t silently disappear.

---

## 4. Functional Requirements

### 4.1 Capture Modalities

| ID | Requirement | Priority | Description |
|---|---|---|---|
| CAP-01 | The system shall allow capture of plain text ideas. | Must | Primary capture method. |
| CAP-02 | The system shall allow capture of voice notes using the device microphone. | Must | Voice is a preferred capture method for creators on the go. |
| CAP-03 | The system shall allow capture of photos and screenshots from the device photo library or camera. | Must | Visual inspiration and references. |
| CAP-04 | The system shall allow capture of a short video clip from the camera or gallery as an idea reference. | Should | Some ideas are visual/motion-based. |
| CAP-05 | The system shall allow capture of a URL/link via share sheet or paste. | Must | Reference videos, trends, tools, articles. |
| CAP-06 | The system shall allow capture from the device share sheet: Photos, Files, Notes, Google Docs, YouTube, TikTok, Instagram, browser, and other installed apps. | Must | Prevents copy-paste friction. |
| CAP-07 | The system shall allow capture directly from the app home screen via a prominent **Quick Add** action. | Must | One-tap capture. |
| CAP-08 | The system shall allow capture via a home screen widget for iOS and Android. | Should | Even faster access. |

### 4.2 Zero Friction Capture

| ID | Requirement | Priority | Description |
|---|---|---|---|
| CAP-09 | The system shall not require any field at capture time other than the captured content itself. | Must | Mandatory fields kill idea capture. |
| CAP-10 | The system shall save the idea immediately upon tapping **Save** or when the capture flow is dismissed. | Must | Prevent accidental loss. |
| CAP-11 | The system shall allow the user to add optional fields after capture: title, note, tags, content pillar, intended platform. | Should | Context enrichment can happen later. |
| CAP-12 | The system shall display a confirmation after capture without opening the full idea editor. | Should | User should not be diverted from current task. |

### 4.3 Automatic Context Preservation

| ID | Requirement | Priority | Description |
|---|---|---|---|
| CAP-13 | For URL captures, the system shall automatically store: original URL, platform name, and preview thumbnail where available. | Must | Preserve source context. |
| CAP-14 | For share-sheet captures from social apps, the system shall extract available metadata: author/account, caption text, timestamp, and link. | Should | Helps recall why the item was saved. |
| CAP-15 | For photo/video captures, the system shall store capture timestamp, device, and optional location if permission granted. | Should | Time and place can later trigger memory. |
| CAP-16 | The system shall allow the user to attach a **Reason / Context Note** such as “saw this in a comment thread” or “competitor hook example.” | Should | Addresses lost inspiration context. |
| CAP-17 | The system shall store a **Source Type** automatically when identifiable: URL, Photo, Voice, Text, Video, File, Share Sheet. | Must | Used for filtering and search. |
| CAP-18 | The system shall not overwrite manually entered context with automatic metadata. | Must | User judgment wins. |

### 4.4 Voice Capture and Transcription

| ID | Requirement | Priority | Description |
|---|---|---|---|
| CAP-19 | The system shall allow recording a voice note with a minimum of two taps. | Must | Fast capture. |
| CAP-20 | The system shall store the original audio file locally. | Must | Preserve original tone/context. |
| CAP-21 | The system shall automatically transcribe voice notes using on-device speech recognition when available and battery/thermal state permits. Cloud transcription is optional and requires explicit user action. | Must | Voice memos not searchable without transcription. |
| CAP-22 | The system shall allow on-device transcription where possible, with cloud transcription as optional fallback. | Should | Privacy and offline benefits. |
| CAP-23 | The system shall display transcription status: Pending, Transcribing, Completed, Failed. Cloud transcription costs are metered by plan (Free: 5/month, Pro: unlimited). On-device transcription is free and unmetered. | Must | User knows whether search will work. |
| CAP-24 | The system shall allow the user to edit the transcript. | Must | Transcription may have errors. |
| CAP-25 | The system shall allow search within voice transcripts. | Must | Converts voice to actionable/searchable idea. |
| CAP-26 | The system shall link the audio and transcript as one idea record. | Must | Preserve both. |

### 4.5 Idea Inbox

| ID | Requirement | Priority | Description |
|---|---|---|---|
| CAP-27 | The system shall maintain a dedicated **Idea Inbox** separate from active Content Items. | Must | Prevents idea backlog from mixing with production. |
| CAP-28 | The system shall display captured ideas in the Idea Inbox in reverse chronological order by default. | Must | Most recent first. |
| CAP-29 | The system shall allow filtering the Idea Inbox by source type, content pillar, date, and status. | Should | Fast triage. |
| CAP-30 | The system shall provide the following idea statuses: Unprocessed, Needs Context, Selected, Scheduled, Archived. | Must | Basic triage without complex workflow. |
| CAP-31 | The system shall allow bulk selection and bulk archive/delete. | Should | Cleanup. |
| CAP-32 | The system shall allow an idea to be converted into a Content Item with one action. | Must | Core transition. |
| CAP-33 | When converted, the system shall prefill the Content Item with idea text, tags, source context, and attachments. | Must | Avoid retyping. |
| CAP-34 | The idea record shall remain accessible but link to the created Content Item. | Should | Traceability. |

### 4.6 Resurfacing and Reminders

| ID | Requirement | Priority | Description |
|---|---|---|---|
| CAP-35 | The system shall show unprocessed ideas in a weekly **Review Queue**. | Should | Creators forget captured ideas. |
| CAP-36 | The system shall allow setting a reminder on an individual idea for a future date/time. | Should | Follow-up. |
| CAP-37 | The system shall provide optional default reminders for ideas not processed within 24 hours, 7 days, and 30 days. | Should | Resurface decaying ideas. |
| CAP-38 | The system shall allow the user to disable idea reminders globally. | Must | Avoid notification fatigue. |
| CAP-39 | The system shall allow archiving an idea without deleting it. | Must | Keep inbox clean. |
| CAP-40 | The system shall allow deleting an idea permanently with confirmation. | Must | User control. |

### 4.7 Offline Capture and Sync

| ID | Requirement | Priority | Description |
|---|---|---|---|
| CAP-41 | The system shall allow all capture types to work offline: text, voice, photo from camera, video from camera, link. | Must | Mobile/offline is a core differentiator. |
| CAP-42 | Gallery/share-sheet import from apps requiring network may be limited offline; local files/photos shall work offline. | Must | Local first. |
| CAP-43 | The system shall save all offline captures to the local database before any sync. | Must | No data loss. |
| CAP-44 | The system shall show pending sync state for items not yet backed up. | Should | Trust. |
| CAP-45 | When network returns, the system shall automatically sync in background. | Must | User should not need manual action. |
| CAP-46 | The system shall handle sync conflicts by keeping both versions or asking the user. | Should | Avoid overwriting. |

### 4.8 Additional Idea Capture Requirements

| ID | Requirement | Priority | Description |
|---|---|---|---|
| CAP-M1 | Home Screen Widget | Should | The system shall support an optional home screen widget on iOS and Android that provides quick access to capture actions and recent ideas. The widget shall display at least the latest 5 unprocessed ideas and include buttons for Text, Voice, and Photo capture. The widget shall work offline and update when the app is opened. |
| CAP-M2 | Import from Existing Notes | Phase 2 | The system shall allow the user to import existing notes from Google Keep, Apple Notes, and Notion as Ideas via file export/import or share-sheet. Imported notes shall become Ideas with source metadata and original text preserved. |
| CAP-M3 | Voice Note Playback Controls | Must | The system shall provide playback controls for voice notes: play, pause, seek/scrub, playback speed (0.5x, 1x, 1.5x, 2x), and skip silence. These controls shall be available in the Idea detail view and the media preview screen. |
| CAP-M4 | Audio Transcription Editing UI | Should | The system shall provide a dedicated transcription review screen for voice notes, showing the audio waveform with synchronized transcript segments. The user shall be able to tap a segment to jump to that audio position and edit the transcript text inline. |
| CAP-M5 | Idea Duplicate/Merge | Should | The system shall allow merging two selected Ideas into one, combining their text, attachments, tags, and source context. The merged idea shall retain a reference to the original ideas and allow undo. |
| CAP-M6 | Unsupported Share-Sheet Fallback | Must | When a shared item from another app cannot be fully imported (e.g., only text/URL provided), the system shall show a preview with the available content and allow the user to annotate before saving. The captured item shall still be saved as an Idea with source type “Other”. |
| CAP-M7 | Idea Sorting | Should | The Idea Inbox shall support sorting by: date created, date modified, source type, content pillar, and status. The default sort shall be date created descending. |

---

## 5. User Flow Summary

### Primary Capture Flow

1. User taps **Quick Add**.
2. System shows capture options: Text, Voice, Photo, Video, Link.
3. User selects or shares content.
4. System saves immediately.
5. Optional automatic metadata extraction occurs in background.
6. Item appears in Idea Inbox.

### Voice Idea Flow

1. User taps **Voice**.
2. Recording starts.
3. User stops.
4. Audio saved locally.
5. If offline, transcription queued.
6. If online, transcription starts.
7. Transcript attached to idea.

### Share-Sheet Flow

1. User opens any app, selects content, taps Share.
2. Selects CreatorOS from share sheet.
3. System creates an Idea with available source context.
4. User returns to CreatorOS later to triage.

### Convert to Content Item

1. User opens Idea Inbox.
2. Selects an idea.
3. Taps **Convert to Content**.
4. System creates a Content Item with prefilled data.
5. User can choose stage/target platform or continue later.

---

## 6. Acceptance Criteria Summary

| User Story | Acceptance Criteria |
|---|---|
| US-01 | User can create a text idea in under 3 taps, with no required fields, and it appears in the Idea Inbox. |
| US-02 | User can record a voice idea while offline; audio is saved locally and transcription occurs after network returns. |
| US-03 | User shares a TikTok link; the idea record stores the URL, platform, and preview if available. |
| US-04 | User can convert an idea to a Content Item in one action; title, notes, tags, and attachments carry over. |
| US-05 | Unprocessed ideas are listed separately from active Content Items and can be sorted by age. |

---

## 7. Dependencies

- **FRS-01 Core Content Record** — Idea conversion creates a Content Item.
- **FRS-03 Asset Library & Search** — Captured media and links will be indexed and searchable.
- **FRS-08 Offline & Sync** — Provides local-first storage and sync queue.
- **FRS-07 Integrations** — Share-sheet and social platform metadata extraction depend on integrations.

---

## 8. Open Questions / Decisions Needed

1. Should voice transcription be free and unlimited in MVP, or gated by plan?  
   *Recommendation: Free for MVP with monthly limit; Pro later for unlimited.*

2. Should the home screen Quick Add be a floating action button or bottom tab?  
   *Recommendation: Floating action button, always visible, opens capture sheet.*

3. Should AI auto-extract concepts/hooks from voice notes in MVP?  
   *Recommendation: No. Transcription only. AI extraction can come in Phase 2/3.*

4. Should photos captured as ideas also be indexed as assets?  
   *Recommendation: Yes, but as lightweight references; full media indexing is handled in FRS-03.*

5. Should the system allow batch import from Notes/Google Keep in MVP?  
   *Confirmed: share-sheet capture is sufficient for MVP. Import from Keep/Apple Notes/Notion is Phase 2.*

---

## Change Log
| Version | Date | Summary |
|---|---|---|
| 1.1 | 2026-08-22 | Added missing MVP requirements CAP-M1 to CAP-M7 under Section 4.8. |
| CAP-M8 | Transcription semantics | Must | The system shall specify supported transcription languages, expected accuracy, max audio length, and graceful failure for unsupported languages. For MVP, on-device transcription supports English (US) with a target word error rate (WER) of <=15% in quiet conditions; other languages and cloud transcription are Phase 2. |
