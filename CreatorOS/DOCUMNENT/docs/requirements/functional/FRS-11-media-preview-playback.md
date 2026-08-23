# Functional Requirements Specification — Module 11  
**Module:** Media Preview & Playback  
**Version:** 1.1  
**Status:** Draft for Review  
**Related Vision / PRD:** CreatorOS  
**Priority:** Must Have  

---

## 1. Purpose

The Media Preview & Playback module defines how users view, play, scrub, and interact with media assets inside CreatorOS. It supports images, videos, audio files, PDFs, and document previews.

The module must solve the validated problems:

> **Creators cannot quickly preview old clips or footage without opening external apps, especially when files are on disconnected drives or cloud-only.**

> **Clip marking and repurposing require frame-accurate preview, timecode selection, and transcript synchronization.**

> **Users need confidence that the file they are about to use is the correct version and matches the context.**

The module provides a fast, offline-friendly preview layer that works with thumbnails and proxies, not necessarily original full-resolution files. It integrates with:

- Asset Library for opening assets.
- Repurposing Clip Library for marking in/out points.
- Script Editor for linking media.
- Content Record for viewing attachments.
- Idea Capture for reviewing captured media.

---

## 2. Scope

This module covers:

- Full-screen preview for images, video, audio, PDFs, and supported documents
- Playback controls: play/pause, seek, volume, playback speed, skip silence (audio)
- Video scrubbing and frame stepping
- Timecode display and selection
- In/out marking for clip creation
- Transcript display and synchronization with playback
- Navigation between assets in a list or project
- Metadata overlay and tagging from preview
- Offline behavior using cached thumbnails/proxies
- Availability indicators and fallback
- Accessibility support and alternative controls
- Export/share actions from preview

**Out of scope:** Full editing, effects, color grading, transcoding within preview, AI scene detection, real-time collaboration, comments/annotations overlays.

---

## 3. Key User Stories

### US-01 Preview a Video from Search Results

**As a** creator,  
**I want to** tap a video in search results and play a low-res preview immediately,  
**so that** I can quickly verify if it's the right clip.

### US-02 Scrub and Step Frame-by-Frame

**As a** creator,  
**I want to** scrub through a video and step frame by frame to find the exact moment,  
**so that** I can set precise in/out points.

### US-03 Mark a Reusable Moment While Previewing

**As a** creator,  
**I want to** set in and out points during playback and save that range as a clip,  
**so that** I can reuse it later without reopening the source.

### US-04 Listen to Audio and Read Transcript

**As a** creator,  
**I want to** play audio and see the transcript highlighted in sync,  
**so that** I can find spoken words quickly.

### US-05 Preview a File Even When Original Is Unavailable

**As a** creator,  
**I want to** see a cached thumbnail/proxy when the original is on a disconnected drive or cloud-only,  
**so that** I can still identify the content.

### US-06 Navigate Between Assets in Context

**As a** creator,  
**I want to** swipe or use next/previous to move through assets in a folder or search result,  
**so that** I can review a series quickly.

---

## 4. Functional Requirements

**MVP proxy limitation:** proxy generation is Phase 2. Video preview and frame-stepping require locally accessible originals or previously cached proxies (not generated in MVP).

### 4.1 General Preview Behavior

| ID | Requirement | Priority | Description |
|---|---|---|---|
| MP-01 | The system shall provide a full-screen preview for supported media types: images, videos, audio, PDFs, and documents. | Must | Core. |
| MP-02 | The preview shall open with the best available local rendition: cached proxy/thumbnail first, original if locally available, otherwise remote/cloud stream with user consent. | Must | Performance and offline. |
| MP-03 | The preview shall display a clear availability indicator: Available, Cached Preview, Cloud Only, External Disconnected, Missing. | Must | User awareness. |
| MP-04 | The preview shall display the asset title, duration, date, and source location in an overlay or top bar. | Should | Context. |
| MP-05 | The preview shall allow closing and returning to the previous screen with one tap or swipe down. | Must | Navigation. |
| MP-06 | The preview shall support landscape and portrait orientations for video. | Should | Usability. |
| MP-07 | The preview shall respect system appearance (dark/light) and dynamic type. | Must | Accessibility. |
| MP-08 | The preview shall work offline for cached content without network requests. | Must | Offline-first. |

### 4.2 Image Preview

| ID | Requirement | Priority | Description |
|---|---|---|---|
| MP-10 | The system shall display images with pinch-to-zoom and pan, with double-tap to toggle zoom. | Must | Standard. |
| MP-11 | The system shall provide accessible zoom controls as an alternative to pinch. | Must | Accessibility. |
| MP-12 | The system shall display image metadata (dimensions, file size, date) in a collapsible panel. | Should | Detail. |
| MP-13 | The system shall allow swiping left/right to navigate to previous/next image in the current list or result set. | Must | Context. |

### 4.3 Video Playback

| ID | Requirement | Priority | Description |
|---|---|---|---|
| MP-20 | The system shall provide video playback using a locally cached proxy, locally available original, or streamed original with user consent. For MVP, proxy generation is not available; playback of cloud-only or disconnected originals requires explicit streaming/download. | Should | Performance. |
| MP-21 | The system shall support play/pause, seek, volume control, and playback speed (0.25x–2.0x). | Must | Standard. |
| MP-22 | The system shall provide frame-stepping forward/backward during pause for frame-accurate navigation, **only when a locally decodable rendition is available**. For assets without a local proxy, frame stepping is not available in MVP. | Should | Clip marking. |
| MP-23 | The system shall display current timecode and total duration prominently. | Must | Precision. |
| MP-24 | The system shall allow tap to show/hide controls; controls auto-hide after 3 seconds during playback. | Should | UX. |
| MP-25 | The system shall provide a scrubbing bar with preview thumbnail on drag where available. | Should | Efficiency. |
| MP-26 | The system shall support audio track selection if multiple tracks exist. | Phase 2 | Not MVP. |
| MP-27 | The system shall provide full-screen toggle. | Must | Standard. |
| MP-28 | The system shall remember last playback position per video and offer resume. | Should | Continuity. |
| MP-29 | The system shall not auto-play videos in grid/list views; playback starts only on user action in preview. | Must | Battery/data. |

### 4.4 Audio Playback

| ID | Requirement | Priority | Description |
|---|---|---|---|
| MP-30 | The system shall provide audio playback with play/pause, seek, volume, and playback speed (0.5x–2.0x). | Must | Standard. |
| MP-31 | The system shall support skip silence toggle (available where supported). | Should | Efficiency. |
| MP-32 | The system shall display a waveform if available, generated from the proxy or original. | Should | Navigation. |
| MP-33 | The system shall allow tapping the waveform to seek. | Should | Usability. |
| MP-34 | The system shall keep screen on during audio playback if user enables setting. | Should | Convenience. |

### 4.5 PDF / Document Preview

| ID | Requirement | Priority | Description |
|---|---|---|---|
| MP-40 | The system shall render the first page of PDFs as thumbnail and allow full preview with page navigation. | Should | Document support. |
| MP-41 | The system shall support text selection and copy in PDFs when text layer exists. | Should | Utility. |
| MP-42 | The system shall display document metadata (pages, file size, author if available). | Should | Detail. |
| MP-43 | For unsupported document types, the system shall show a placeholder with file info and option to open in system viewer or share. | Must | Fallback. |

### 4.6 Transcript & Playback Sync

| ID | Requirement | Priority | Description |
|---|---|---|---|
| MP-50 | If a transcript exists for a video/audio asset, the preview screen shall display it in a scrollable panel synchronized with playback. | Must | Core. |
| MP-51 | The current transcript segment shall be highlighted as playback progresses. | Must | Usability. |
| MP-52 | The user shall be able to tap a transcript segment to seek to that timecode. | Must | Efficiency. |
| MP-53 | The transcript panel shall be collapsible and adjustable in size. | Should | UX. |
| MP-54 | The transcript shall remain viewable offline if previously cached. | Must | Offline. |

### 4.7 In/Out Marking & Clip Creation

| ID | Requirement | Priority | Description |
|---|---|---|---|
| MP-60 | The preview screen shall include “Mark In” and “Mark Out” controls while paused or during playback. | Must | Repurposing. |
| MP-61 | When both in and out points are set, the system shall show the selected range with timecode and duration. | Must | Clarity. |
| MP-62 | The user shall be able to adjust in/out points by dragging markers on the scrubber or using frame-step buttons. | Must | Precision. |
| MP-63 | The system shall provide a “Save as Clip” action that creates a Clip record from the selected range, transferring the transcript excerpt and source reference. | Must | Integration. |
| MP-64 | If a transcript exists, the selected transcript segment shall be auto-filled into the Clip when saved. | Must | Efficiency. |
| MP-65 | The user shall be able to discard selection with one action. | Must | UX. |

### 4.8 Navigation & Context

| ID | Requirement | Priority | Description |
|---|---|---|---|
| MP-70 | The preview shall support navigating to previous/next item in the originating list, search result, project, or library view. | Must | Context. |
| MP-71 | The user shall be able to open the asset detail view from the preview. | Must | Metadata. |
| MP-72 | The user shall be able to add/edit tags or mark favorite from the preview. | Should | Efficiency. |
| MP-73 | The user shall be able to share/export the asset or its proxy from the preview. | Should | Handoff. |

### 4.9 Offline & Performance

| ID | Requirement | Priority | Description |
|---|---|---|---|
| MP-80 | If only a low-res proxy is available (Phase 2), the system shall use it and indicate that the original is not available. For MVP, if no proxy exists and the asset is not locally accessible, the system shall show the thumbnail and prompt the user to download/open the original. | Should | Honesty. |
| MP-81 | If no preview/proxy is available and original is remote, the system shall show a thumbnail/placeholder and offer to stream or open in system app with user consent. | Must | Data. |
| MP-82 | The system shall not stream original media automatically unless the user has enabled mobile data and explicitly taps play/stream. | Must | Bandwidth. |
| MP-83 | Media loading shall be asynchronous; the preview UI shall not block. | Must | Responsiveness. |
| MP-84 | The system shall cancel media loading when preview is closed, freeing resources. | Should | Resource. |

### 4.10 Accessibility

| ID | Requirement | Priority | Description |
|---|---|---|---|
| MP-90 | All controls shall have accessible labels and be reachable by VoiceOver/TalkBack. | Must | NFR-06. |
| MP-91 | Scrubbing and frame stepping shall be available via accessible custom actions. | Must | Alternative to gesture. |
| MP-92 | Zoom controls for images shall be accessible. | Must | Alternative to pinch. |
| MP-93 | Transcript sync shall be announced appropriately without overwhelming the screen reader. | Should | UX. |
| MP-94 | The system shall respect Reduce Motion and avoid auto-advancing focus. | Must | Accessibility. |

---

### 4.99 Missing MVP Requirements (Completeness Sweep)

| ID | Requirement | Priority | Description |
|---|---|---|---|
| MP-M5 | Aspect Ratio Toggle | Should | The system shall allow toggling the preview fit/fill to check how the media looks in 9:16 vs 1:1. |

## 5. Data Model Considerations (Logical)

- **MediaAsset** (from FRS-03)
- **Proxy/Thumbnail** (from FRS-03)
- **Transcript** (existing)
- **Clip** (from FRS-04)
- **MediaSessionState** (playback position, speed, in/out points)
- **PreviewCache** (status, availability)

No new major entities beyond those already defined; this module mainly specifies UI/UX behavior on top of existing data.

---

## 6. Acceptance Criteria Summary

| User Story | Acceptance Criteria |
|---|---|
| US-01 | Tapping a video result opens preview and plays a proxy within 1 second on cached content. |
| US-02 | Frame-step buttons move by one frame; timecode updates accurately. |
| US-03 | Mark In/Out, Save as Clip creates a Clip record with transcript excerpt and source reference. |
| US-04 | Audio playback highlights transcript segments; tapping segment seeks to that time. |
| US-05 | For a file on disconnected external drive, preview shows thumbnail and “Original unavailable” message, but allows searching metadata. |
| US-06 | Swiping left/right navigates through the originating list without going back to grid. |

---

## 7. Dependencies

- **FRS-03 Asset Library & Search** — source assets, thumbnails, proxies, availability.
- **FRS-04 Repurposing Clip Library** — clip creation from in/out.
- **FRS-08 Offline & Sync** — offline caching and sync of proxies/transcripts.
- **FRS-10 Script & Text Editor** — possible inline asset preview.
- **NFR-01 Performance** — media loading thresholds.
- **NFR-06 Accessibility** — accessible controls.

---

## 8. Open Questions / Decisions Needed

1. Should we support streaming original cloud files inside preview in MVP?  
   *Recommendation: Yes, but only with explicit user tap and Wi-Fi/mobile data setting; default to proxy if available.*

2. Should we generate waveform for audio in MVP?  
   *Recommendation: Basic waveform from proxy, if cost is low. Can be Phase 2 if performance concerns.*

3. Should we support multi-audio tracks in MVP?  
   *Recommendation: No, Phase 2.*

4. Should frame stepping be available for cloud-only originals?  
   *Recommendation: No, frame stepping requires local proxy. If unavailable, user must download proxy first.*

5. Should preview support casting (AirPlay/Chromecast)?  
   *Recommendation: No for MVP.*

---


## 99. Change Log

| Version | Date | Summary |
|---|---|---|
| 1.1 | 2026-08-22 | Completeness sweep: added missing requirements. |
