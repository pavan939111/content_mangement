# Accessibility Test Cases — CreatorOS v2

**Version:** 1.0
**Date:** 2026-08-23
**Status:** Ready for Implementation
**Related:** v2/uiux/accessibility.md, NFR-06-accessibility-v2, v2/requirements/non-functional/NFR-06
**CI Frequency:** Automated checks every PR; manual VoiceOver/TalkBack pass before release

---

## 1. Purpose

Verify CreatorOS meets WCAG 2.2 AA intent and native platform accessibility standards across all v2 surfaces.

## 2. Automated Checks (Every PR)

| ID | Check | Tool | Pass Criteria |
|---|---|---|---|
| A11Y-01 | Contrast: normal text ≥4.5:1 | Compose accessibility checks; XCTest audit | No low-contrast failures on any screen |
| A11Y-02 | Contrast: large text ≥3:1 | Same | Large/bold text passes |
| A11Y-03 | Touch targets ≥44×44pt (iOS) / ≥48×48dp (Android) | Accessibility audit | All actionable controls meet minimum |
| A11Y-04 | Every actionable element has accessible label | `performAccessibilityAudit()` (iOS); `enableAccessibilityChecks()` (Android) | Zero unlabeled interactive elements |
| A11Y-05 | Color not sole indicator of state | Snapshot review + audit | Health states use text labels alongside color |

## 3. Screen Reader Tests (VoiceOver / TalkBack)

### 3.1 Navigation

| ID | Element | Expected Announcement |
|---|---|---|
| A11Y-SR-01 | Bottom navigation items | Label + selected state announced; icon-only items have accessible labels |
| A11Y-SR-02 | Tab bar selected state | Announces "selected" or equivalent trait |
| A11Y-SR-03 | Back button | "Back" or destination-specific label |

### 3.2 Search

| ID | Element | Expected Announcement |
|---|---|---|
| A11Y-SR-10 | Search field | Label includes scope: Search CreatorOS, Google Drive, Notion, and Calendar |
| A11Y-SR-11 | Coverage change (partial → complete) | Announced once via accessibility live region; not repeated per result |
| A11Y-SR-12 | Result count after search completes | "N results found" announced |
| A11Y-SR-13 | Stale result indicator | Announced as text (e.g., cached 2 days ago), not just visual badge |

### 3.3 Connection Health Center

| ID | Element | Expected Announcement |
|---|---|---|
| A11Y-SR-20 | Health state row | Provider name + state text (e.g., Google Drive, needs reauthorization) |
| A11Y-SR-21 | Affected records count | Number included in announcement |
| A11Y-SR-22 | Primary action button (Reconnect/Refresh/Retry) | Clear action verb announced |

### 3.4 Receipts

| ID | Element | Expected Announcement |
|---|---|---|
| A11Y-SR-30 | Receipt item | Action type + timestamp + outcome in logical order |
| A11Y-SR-31 | Verified vs user-confirmed distinction | Text difference announced (not icon-only) |
| A11Y-SR-32 | Add annotation button | Accessible label: Add note to this receipt |

### 3.5 OAuth Flow

| ID | Element | Expected Announcement |
|---|---|---|
| A11Y-SR-40 | Pre-OAuth consent screen | Permission explanation readable in logical order; no focus traps |
| A11Y-SR-41 | OAuth system browser return | Focus moves to connection status confirmation |

## 4. Dynamic Type & Text Scaling

| ID | Scenario | Pass Criteria |
|---|---|---|
| A11Y-DT-01 | Maximum accessibility size (iOS AX5) | All text wraps; no truncation of critical state/source/timestamp/recovery text |
| A11Y-DT-02 | Android font scale at 200% | Layout adapts without overlap or clipped content |
| A11Y-DT-03 | Record detail card at maximum scale with all fields populated | Content scrollable; action buttons remain reachable |
| A11Y-DT-04 | Health Center row at maximum scale | Status text wraps to next line if needed; action button visible |

## 5. Reduced Motion

| ID | Scenario | Pass Criteria |
|---|---|---|
| A11Y-RM-01 | Sync animations with Reduce Motion enabled | Animations replaced with opacity/crossfade transitions |
| A11Y-RM-02 | Pull-to-refresh indicator | Non-animated fallback available |

## 6. Manual Exploratory Pass (Pre-Release Checklist)

- [ ] Navigate entire app using only VoiceOver/TalkBack
- [ ] Complete a record creation flow without sighted assistance
- [ ] Verify error messages are announced when they appear
- [ ] Test modal dismissal via screen reader gesture
- [ ] Verify sync status changes are announced appropriately
- [ ] Confirm shared delivery web view is keyboard-navigable
- [ ] Test high-contrast/dark mode for all primary screens
- [ ] Verify RTL layout does not break reading order for Arabic/Hebrew content

## 7. Change Log

| Version | Date | Summary |
|---|---|---|
| 1.0 | 2026-08-23 | Created accessibility test cases covering automated audits, screen reader announcements, dynamic type, reduced motion, manual checklist. |
