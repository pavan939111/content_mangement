# Non-Functional Requirements — NFR-06: Accessibility & Usability

**Product:** CreatorOS  
**Version:** 1.0  
**Status:** Draft for Review  
**Related Module:** All functional modules, especially capture, search, calendar, and publishing handoff  

---

## 1. Purpose

This document defines the **accessibility and usability requirements** for CreatorOS. The app is a mobile-first content workspace for solo short-form creators. It must be usable by people with diverse abilities, including those using screen readers, large text, switch control, voice control, and external keyboards.

The goal is to:

- Meet WCAG 2.2 AA-level visual standards.
- Support system text scaling and screen readers end-to-end.
- Make capture, search, tagging, scheduling, and publishing workflows accessible.
- Ensure fast, one-handed operation for creators during filming.
- Provide clear status feedback without relying solely on color.

These requirements are based on official Apple and Android accessibility guidelines, WCAG 2.2, and usability best practices for mobile productivity apps.

---

## 2. Scope

This document covers:

- Touch targets and navigation accessibility
- Dynamic type and text scaling
- Color contrast and non-visual status indicators
- VoiceOver and TalkBack support
- Voice input accessibility
- Fast capture usability and interaction steps
- Cognitive accessibility
- Reduced motion and system preferences
- Usability performance thresholds
- Accessibility testing requirements

**Out of scope:** Platform-specific implementation details beyond requirements, full WCAG compliance for non-mobile surfaces.

---

## 3. Core Requirements

### 3.1 General Acceptance Targets

| Area | Requirement |
|---|---|
| iOS touch targets | Minimum 44×44 pt; target 48×48 pt for primary controls |
| Android touch targets | Minimum 48×48 dp; minimum 8 dp spacing between adjacent targets |
| Body text contrast | ≥4.5:1 against background |
| Large text contrast | ≥3:1 where WCAG large-text definition applies |
| Status/UI indicator contrast | ≥3:1 against adjacent colors; never convey state by color alone |
| Text scaling | Support all system Dynamic Type / font-scale settings without clipping, overlap, or inaccessible actions |
| Android text | Use `sp`, support at least 200% font scaling as release criterion |
| iOS text | Support Dynamic Type through accessibility size categories; no fixed-height text containers for essential content |
| VoiceOver/TalkBack | Every meaningful control, status, thumbnail, list item, and progress state has an accessible name, role, value/state, and action |
| Fast capture | One primary tap from any main app surface; at most 2 interactions to save a text idea |
| Voice capture | One primary tap to start; one action to stop/save; transcript/edit state announced accessibly |
| Keyboard navigation | All key workflows complete with external keyboard, switch control, VoiceOver, or TalkBack |
| Motion | Respect Reduce Motion / Animator Duration Scale; no critical state conveyed only through animation |

---

## 4. Touch Targets and Navigation

### 4.1 Minimum Touch Sizes

| Platform | Minimum | Product Target | Notes |
|---|---:|---:|---|
| iOS / iPadOS | 44×44 pt | 48×48 pt for primary actions | Use 48 pt for capture, add, record, search, filters, schedule, publish |
| Android | 48×48 dp | 48–56 dp for primary actions | Android states 48 dp is about 9 mm physical size |
| Compact icon rows | Maintain target using invisible hit slop | 48 dp/pt touch box | Visual icon can be 20–24 dp/pt; hit area must be larger |
| Adjacent controls | — | ≥8 dp separation where possible | Avoid accidental activation |
| Destructive actions | 48×48 minimum | 56 dp/pt or confirmation | Delete, disconnect account, purge cache |

### 4.2 Navigation Requirements

- Bottom navigation must expose **four primary destinations**: Inbox, Library/Search, Calendar, Projects.
- Keep **Settings** as a top-bar gear icon accessible from all tabs.
- Keep **Reminder Center** accessible from Inbox and Calendar via top-bar action.
- Keep **Capture** globally available as a prominent floating action button or persistent top-bar action.
- Do not require drag-and-drop for any essential workflow:
  - provide “Move to project,” “Change status,” “Schedule,” and “Add tag” actions
  - expose these as VoiceOver rotor/TalkBack custom actions
- Avoid gesture-only workflows:
  - swipe-to-delete must have an accessible menu/button alternative
  - pinch-to-zoom asset previews must have zoom controls
  - long press must have an overflow-menu alternative
- Preserve navigation state when returning from:
  - camera/photo picker
  - Files picker
  - OAuth authorization
  - native platform publishing handoff
  - external-drive/file-provider flow

---

## 5. Dynamic Type and Text Scaling

### 5.1 Requirements

| Content type | Minimum behavior |
|---|---|
| Scripts | Scale through all iOS accessibility sizes and Android ≥200% font scale; preserve editing, selection, and teleprompter view |
| Captions/hashtags | Wrap; never truncate essential caption text solely because font is enlarged |
| Search results | Reflow to one-column row/card layout at large sizes |
| Metadata chips | Wrap into multiline sections or collapse behind accessible “More metadata” control |
| Calendar | Switch from dense grid to agenda/list view at large type |
| Tables/boards | Offer list/agenda alternative; do not require visual column scanning |
| Thumbnail grids | Reduce columns as font/display scale increases; keep filename/status readable |
| Bottom sheets/dialogs | Scrollable with visible/announced close action |

### 5.2 Recommended Scaling Policy

| Platform | Minimum Support | Release Target |
|---|---:|---:|
| iOS | All standard Dynamic Type sizes | All accessibility categories, including the largest |
| Android | 100–150% font scale | 100–200% font scale |
| Web/shared components, if any | 200% zoom equivalent | 400% reflow where practical |

**Requirement:**

> Essential text never clips, overlaps, or becomes inaccessible behind fixed layouts.

### 5.3 Script/Teleprompter Mode

Provide:
- 16–96 pt configurable script size, scaled from user preference
- high-contrast themes
- optional extra line spacing from 1.0× to 2.0×
- variable scroll speed
- pause/resume via large button and hardware/keyboard control
- VoiceOver/TalkBack-compatible controls, but avoid reading entire scrolling script automatically unless user initiates it
- screen awake option with clear battery notice
- mirror mode only as optional visual feature, never required

---

## 6. Color and Status Indicators

### 6.1 Contrast Requirements

| Element | Minimum Ratio | Additional Rule |
|---|---:|---|
| Normal body text | 4.5:1 | Applies below 18 pt regular / 14 pt bold equivalent |
| Large text | 3:1 | Only when it meets WCAG large-text criteria |
| Buttons/icons/borders/status chips | 3:1 | Against adjacent colors/background |
| Focus indicators | 3:1 | Must remain visible in focused/unfocused states |
| Error/success/warning/pending | 3:1 plus non-color cue | Use icon, label, pattern, or text |
| Disabled state | Platform convention | Must remain distinguishable; do not use low contrast for essential explanatory text |

### 6.2 Status Pattern

Never rely on red/yellow/green alone.

| State | Visual | Text | Screen-reader announcement |
|---|---|---|---|
| Saved locally | Check icon | “Saved on this device” | “Saved locally” |
| Syncing | Spinner | “Syncing” | “Sync in progress” |
| Pending offline | Cloud outline + dot | “Sync pending” | “Saved locally, sync pending” |
| Published | Check/arrow icon | “Published” | “Published to TikTok” |
| Failed | Error icon | “Publishing failed” | “Publishing failed. Action required.” |
| Needs native action | Phone/app icon | “Finish in Instagram” | “Requires native posting in Instagram” |
| Conflict | Split/merge icon | “Review conflict” | “Conflict requires review” |

**Requirement:**

> Failed sync/publish/native-action states must have text plus icon plus accessible announcement.

---

## 7. VoiceOver and TalkBack

### 7.1 Required Semantics

Every meaningful element must provide:

| Semantic field | iOS | Android |
|---|---|---|
| Name | `accessibilityLabel` | `contentDescription` / semantic text |
| Role | trait, e.g. button/selected/header | role inferred from native component/semantics |
| Current state | `accessibilityValue`, traits | state description/semantics |
| Hint where needed | `accessibilityHint` | click/long-click/custom action labels |
| Custom actions | `accessibilityAction` | `CustomAccessibilityAction` |
| Grouping | accessibility container/group | `screenReaderFocusable` / merged semantics |
| Live updates | announcements | accessibility live region |

### 7.2 Required Screen-Reader Flows

Test every release with VoiceOver and TalkBack for:

1. Capture text idea.
2. Record and save voice idea.
3. Add photo/video/reference.
4. Search scripts, captions, tags, and transcript excerpts.
5. Open a search result and locate matched text.
6. Mark video in/out clip range using accessible controls.
7. Change status and add tags.
8. Schedule a post.
9. Handle “needs native action” publishing handoff.
10. Review sync status, retry failure, resolve conflict.
11. Delete, restore, export, and disconnect an account.

### 7.3 Asset Descriptions

For each thumbnail/media item:
- announce media type: “Video,” “Image,” “PDF,” “Audio”
- announce title/filename, duration, date, project, and status
- announce source availability: “External drive unavailable” where relevant
- announce whether a transcript exists
- allow user-created alt note/description for visual reference assets
- do not make VoiceOver/TalkBack speak long filenames by default if a meaningful title exists

Example:

> “Video. Summer packing B-roll. 14 seconds. Recorded June 2. Tagged beach, luggage. Used in one post. Transcript available. Double tap to open; swipe up for clip markers.”

---

## 8. Voice Input Requirements

### 8.1 Capture Flow

| Step | Requirement |
|---|---|
| Start | One primary tap from any primary screen |
| Permission | Explain microphone purpose before OS prompt |
| Recording state | Large stop button; timer; visible and announced state |
| Save | One action to stop/save |
| Offline behavior | Save audio locally even if transcription unavailable |
| Transcription | Clearly label “Processing locally” vs “Processing in cloud” |
| Failure | Preserve original audio; show retry, edit manually, and delete options |
| Privacy | Do not upload audio/transcript without explicit consent if cloud processing optional |

### 8.2 Voice Input Accessibility

- Voice capture controls must not depend on holding a button continuously.
- Support external keyboard shortcut, e.g. `⌘/Ctrl + Shift + Space`, where platform-appropriate.
- Announce recording start/stop, duration, and local-save status.
- Provide text fallback for every voice-only action.
- Respect system dictation and assistive-access features.
- Avoid auto-starting transcription audio playback.
- Preserve user speech verbatim until optional AI summarization is explicitly applied.

---

## 9. Fast Capture Usability

### 9.1 Maximum-Step Requirement

Recommended product requirement:

> From any main screen, a creator must be able to create and locally save a text idea in **one primary tap plus one confirm/save action at most**. Voice capture must begin in one tap and save in one stop action.

| Capture type | Target interactions |
|---|---:|
| Text idea from main surface | 1 tap to open focused composer → type → auto-save or one Save tap |
| Quick text with persistent capture bar | 0–1 taps → type → auto-save |
| Voice idea | 1 tap Start → 1 tap Stop/Save |
| Photo/video reference | 1 tap Capture → native picker/camera confirmation |
| Web/social link | Share sheet → 1 app destination tap → auto-import |
| Clip marker while previewing | 1 tap “Mark” → optional label later |
| Add tag to captured item | Optional, never required for save |

### 9.2 Capture Design Rules

- Do not require selection of project, platform, content pillar, status, tag, or deadline before first save.
- Default new items to `Inbox`.
- Auto-save text drafts within **≤1 second** after the user pauses typing.
- Persist draft locally before app backgrounding.
- Offer optional “Add details” after save.
- Maintain a visible undo for accidental discard/delete for at least **5–10 seconds**.
- Return focus to original context after capture.
- Keep capture composer accessible at large text sizes and with screen readers.

---

## 10. Cognitive Accessibility

- Use familiar, stable labels:
  - “Save locally”
  - “Sync pending”
  - “Ready to post”
  - “Needs review”
  - “Finish in TikTok”
- Avoid status names that require interpretation:
  - avoid only “Queued,” “Staged,” “Hydrated,” “Dirty,” or “Resolved”
- Keep one clear primary action per screen.
- Use progressive disclosure:
  - capture first
  - enrich later
  - schedule later
- Allow creator-defined terminology for workflow states, but preserve plain-language accessibility labels.
- Provide undo and revision history instead of destructive confirmation-heavy flows.
- Offer list alternatives to calendar, kanban, grid, and timeline views.
- Do not require users to remember invisible state:
  - show missing cover, missing caption, missing export, pending sync, or native-posting requirement directly on the item.

---

## 11. Reduced Motion, Haptics, and Feedback

| System preference | Requirement |
|---|---|
| Reduce Motion | Replace nonessential animated transitions with fades/static changes |
| Reduce Transparency | Ensure surfaces remain distinguishable |
| Bold Text / Increased Contrast | Reflow without clipping; preserve hierarchy |
| Haptic disabled | Do not rely on haptic feedback for success/failure |
| Screen reader active | Avoid auto-advancing focus or disruptive toast messages |
| Captions/subtitles | Do not use animated text as the only way to convey app instructions |

Provide immediate nonvisual feedback for:
- capture saved
- recording started/stopped
- sync blocked
- source unavailable
- publish handed off to native app
- publish failed
- destructive action completed/undone

---

## 12. Usability Performance Requirements

| Interaction | User-perceived threshold |
|---|---:|
| Tap Capture → focused composer visible | ≤150 ms median; ≤300 ms p95 |
| Local autosave after pause | ≤1 s |
| Add a tag/status | ≤300 ms visual update |
| Open recent asset | ≤250 ms cached |
| Voice record start confirmation | ≤200 ms |
| Screen-reader focus change | ≤100 ms after navigation |
| Native publishing handoff | ≤1 s to launch/deep-link or show exact fallback steps |
| Undo action availability | Visible for 5–10 s |
| Search result announcement | First result or count within ≤500 ms after results are ready |

---

## 13. Testing Requirements

### 13.1 Automated

- iOS:
  - XCTest accessibility identifiers
  - Dynamic Type snapshots across all categories
  - VoiceOver-focused UI tests where feasible
  - color-contrast verification in design system
- Android:
  - Accessibility Scanner
  - Espresso accessibility checks
  - Compose semantics tests
  - TalkBack manual regression
  - font scale tests: 1.0×, 1.3×, 1.5×, 2.0×
  - dark mode/high-contrast validation

### 13.2 Manual Release Matrix

| Test | iOS | Android |
|---|---|---|
| Screen reader | VoiceOver | TalkBack |
| Large text | Largest accessibility Dynamic Type | 200% font scale |
| Display scaling | Larger text + larger display | Font/display size largest supported |
| Color | Light, dark, increased contrast | Light, dark, high-contrast where available |
| Motor | Switch Control / keyboard | Switch Access / keyboard |
| Motion | Reduce Motion | Animator Duration Scale disabled |
| Capture | Text, voice, file, photo, share sheet | Text, voice, file, photo, share sheet |
| Status | Sync pending, error, conflict, native-action | Same |

---

## 14. Recommended Acceptance Criteria

```text
Touch and navigation
- Every interactive control: >=44x44 pt on iOS, >=48x48 dp on Android.
- Primary capture/publish controls: target >=48x48 pt/dp.
- No essential action requires drag, long press, pinch, color perception, or visual-only text.

Typography
- All scripts, captions, search results, asset metadata, and sync/publish states
  work at all iOS Dynamic Type accessibility categories.
- Android works at 200% font scale.
- Essential text never clips, overlaps, or becomes inaccessible behind fixed layouts.

Contrast and states
- Normal text >=4.5:1.
- Large text and required UI components >=3:1.
- Status never communicated by color alone.
- Failed sync/publish/native-action states have text plus icon plus accessible announcement.

Screen readers
- 100% of meaningful controls have accessible name, role, and state.
- Custom gestures have VoiceOver/TalkBack alternatives.
- Capture, search, tag, clip mark, schedule, sync retry, publish handoff,
  export, and delete work end-to-end with VoiceOver and TalkBack.

Fast capture
- Text idea: one primary tap to composer, autosave or one Save action.
- Voice note: one tap start, one action stop/save.
- No metadata selection required before initial save.
- Capture is locally persisted within <=1 second.

Usability
- Calendar/board/grid has accessible list/agenda alternative.
- Script/teleprompter supports large type, high contrast, variable speed, and
  non-gesture-only controls.
- Respect Reduce Motion, Bold Text, Increased Contrast, and screen-reader focus.
```

---

## 15. Source References

- [Apple Human Interface Guidelines — Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)  
- [Apple Human Interface Guidelines — VoiceOver](https://developer.apple.com/design/human-interface-guidelines/voiceover)  
- [Android — Make apps more accessible](https://developer.android.com/guide/topics/ui/accessibility/apps)  
- [Android — Accessibility principles and TalkBack actions](https://developer.android.com/guide/topics/ui/accessibility/principles)  
- [W3C — WCAG 2.2](https://www.w3.org/TR/WCAG22/)

---


## 7. Change Log

| Version | Date | Summary |
|---|---|---|
| 1.1 | 2026-08-22 | P2 updates: navigation IA, NFR-01 thresholds, version pins, uncited claims. |

