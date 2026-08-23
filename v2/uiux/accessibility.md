# Accessibility Specification — CreatorOS v2

**Version:** 1.0  
**Date:** 2026-08-23  
**Status:** Ready for Design Implementation  
**Related:** v2/uiux/design-principles.md, v2/uiux/components.md  

---

## 1. Purpose

This document defines accessibility requirements for CreatorOS mobile.

Goal: meet WCAG 2.2 AA intent and platform accessibility expectations for a professional creator tool.

---

## 2. Accessibility Baseline

### 2.1 Contrast

| Text | Minimum Ratio |
|---|---|
| Normal text | 4.5:1 |
| Large text / bold 18pt+ | 3:1 |
| Essential UI components/states | 3:1 |

### 2.2 Touch Targets

| Platform | Minimum |
|---|---|
| iOS | 44×44 pt |
| Android | 48×48 dp |

### 2.3 Text Scaling

- iOS: support all Dynamic Type sizes, including accessibility sizes.
- Android: support font scaling at least up to 200%.
- Text wraps; no truncation of critical state, source, timestamp, or recovery text.

---

## 3. Screen Reader Requirements

### 3.1 Bottom Navigation

- Labels with icons.
- Selected state announced.
- No color-only selected indication.

### 3.2 Capture Button

- Accessible label: “Capture new idea.”
- Opens capture sheet with focus moved to text field.
- Voice capture announces recording state.

### 3.3 Search

- Accessible field label: “Search CreatorOS, Google Drive, Notion, and Calendar.”
- Announce results and coverage changes once:
  - “82 results. 3 of 4 sources searched.”
  - “Notion results may be stale.”
- Focus remains in search field while typing.
- Filters and result actions have accessible labels.

### 3.4 Source Badges

- Announce source and freshness:
  - “Google Drive, current.”
  - “Notion, cached two days ago.”
- Do not rely on provider logo/color alone.

### 3.5 Connection Health

- Announce state:
  - “Google Drive, needs reauthorization. 4 projects affected.”
  - “Notion, healthy, last synced 8 minutes ago.”
- Status is icon + text + color.

### 3.6 Action Receipts

- Complete label:
  - “Verified. Delivery link sent to Avery Chen. Nike Summer Launch. Two minutes ago.”
- Progress announced as:
  - “Uploading assets, three of six verified.”
- Do not announce every byte/progress update.

### 3.7 Empty/Error/Offline States

- Announce state and next action.
- Empty: “No projects yet. Create project.”
- Offline: “Offline. Three changes saved on this device.”
- Error: “Couldn’t upload. File is safe. Retry available.”

### 3.8 Swipe Actions

- Swipe actions have overflow menu alternatives.
- No gesture-only functionality.

---

## 4. Motion and Haptics

### 4.1 Reduced Motion

- Replace slide/bounce with fade or instant state change.
- Disable skeleton shimmer.
- No auto-scrolling or animated reordering.
- Motion never sole communicator of state.

### 4.2 Haptics

- Haptics are supplementary; never required for understanding.
- Provide visual/text confirmation.

---

## 5. Component-Specific Requirements

| Component | Requirement |
|---|---|
| Connection row | Text state + icon; direct Reconnect action; descriptive label |
| Receipt card | Complete accessible label; expandable details |
| Queue item | Explain target, size, dependency, reason not run |
| Search result | Source + freshness + project context |
| Coverage row | Explain completeness and unavailable sources |
| Delivery link | Announce status and recipient activity |
| OAuth preflight | Plain-language permission explanation |
| OAuth return | Restore focus to connection result |
| Sync banner | Announce offline/online transition once |

---

## 6. Testing Matrix

| Test | iOS | Android |
|---|---|---|
| VoiceOver/TalkBack navigation | Required | Required |
| Dynamic Type / font scale 200% | Required | Required |
| Dark mode / increase contrast | Required | Required |
| Reduce Motion | Required | Required |
| Touch target audit | Required | Required |
| Screen reader focus order | Required | Required |
| Long names/text | Required | Required |
| Offline states | Required | Required |
| Partial/error states | Required | Required |

---

## 7. Change Log

| Version | Date | Summary |
|---|---|---|
| 1.0 | 2026-08-23 | Created Accessibility Specification. |
