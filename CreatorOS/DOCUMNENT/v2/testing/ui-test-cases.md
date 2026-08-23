# UI Test Cases — CreatorOS v2

**Version:** 1.0
**Date:** 2026-08-23
**Status:** Ready for Implementation
**Related:** v2/testing/test-strategy.md, v2/uiux/state-matrix.md, v2/uiux/components.md
**CI Frequency:** Every PR (component); nightly (visual regression + navigation)

---

## 1. Purpose

Component-level UI tests for screen state, semantics, validation, and navigation. Deliberately narrow: SwiftUI/Compose views receive ViewState and emit intents; test state transitions without full rendering where possible.

## 2. Tools

| Platform | Framework |
|---|---|
| iOS | SwiftUI Preview tests; XCUITest for critical flows |
| Android | Compose UI Test (`createComposeRule`); `TestNavHostController` for navigation graphs |
| Visual | Point-Free swift-snapshot-testing (iOS); Paparazzi/Roborazzi (Android) |

## 3. Navigation Tests

| ID | Scenario | Assertions |
|---|---|---|
| UI-NAV-01 | Bottom nav switches between primary destinations | Correct destination composables displayed; back stack correct |
| UI-NAV-02 | Record detail → search result deep link | Opens correct record with source links visible |
| UI-NAV-03 | Connection Health Center → connection detail → reconnect flow | Navigation stack preserves context on return |
| UI-NAV-04 | OAuth redirect returns to app → connection status updated | Deep link handled; no duplicate navigation entry |
| UI-NAV-05 | Settings → export → file share sheet dismissed | Returns to Settings without crash or stale state |

## 4. Screen State Matrix Tests

Test every feature surface against the global states from `v2/uiux/state-matrix.md`:

| State | Expected Treatment | Test Assertions |
|---|---|---|
| Online, current | Normal rendering; no banner | No offline/sync indicator visible |
| Offline | Compact top banner + contextual labels | Banner text accurate; actions still functional locally |
| Syncing | Inline progress; not blocking overlay | Content remains interactive during sync |
| Back online | Brief confirmation with pending count | Shows number of synced changes |
| Reauth required | Persistent contextual warning | Provider name shown; Reconnect button prominent |
| Provider outage | Provider-specific explanation + retry time | Not a generic error message |

## 5. Search Screen Tests

| ID | Scenario | Assertions |
|---|---|---|
| UI-SRCH-01 | Complete coverage: all sources searched | All N sources badge shown; no warnings |
| UI-SRCH-02 | Partial coverage: one source unavailable | Missing source named; retry/reconnect offered |
| UI-SRCH-03 | Indexing in progress: Drive updating | Available results shown immediately alongside progress indicator |
| UI-SRCH-04 | Stale results from cached source | Stale label + timestamp on affected cards |
| UI-SRCH-05 | Offline: showing on-device items only | Local/cached results; external section hidden or labeled |
| UI-SRCH-06 | Reauth required: Calendar excluded | Calendar excluded message; other results unaffected |
| UI-SRCH-07 | True empty: query has no matches anywhere | Clear "no results" message with query echoed |
| UI-SRCH-08 | Incomplete empty: some sources had errors but no matches found | Distinguishes from true empty; suggests checking connections |

## 6. Connection Health Row Tests

| ID | Health State | Visual Treatment | Primary Action |
|---|---|---|---|
| UI-HLT-01 | Healthy/current | Quiet row + last-sync timestamp | View details |
| UI-HLT-02 | Healthy/stale | Amber clock indicator | Refresh now |
| UI-HLT-03 | Needs reauthorization | High-priority warning + affected count | Reconnect |
| UI-HLT-04 | Error/retry pending | Error icon + cause + estimated retry | Retry / view details |
| UI-HLT-05 | Partial access | Limited access badge + scope detail | Review access |
| UI-HLT-06 | Disconnected | Muted row | Connect again |

## 7. Receipt List Tests

| ID | Scenario | Assertions |
|---|---|---|
| UI-RCP-01 | Receipt list renders with action type icons and timestamps | Each receipt shows correct icon per action_type |
| UI-RCP-02 | Verified outcome shows provider confirmation indicator | Distinguished visually from user_confirmed outcomes |
| UI-RCP-03 | Annotation added → appears below original without modifying it | Original fields intact; annotation timestamp separate |
| UI-RCP-04 | Long evidence text truncates with expand option | No layout break at maximum text scale |

## 8. Snapshot Testing Coverage

Capture deterministic snapshots for:

- Empty, loading, populated, offline, syncing, conflict, error states
- Dynamic Type at minimum, default, and accessibility sizes
- Light and dark themes
- RTL layout direction
- Key screens: record detail card, search results, health center rows, delivery view, paywall

Dynamic data must be made deterministic before snapshotting (fixed timestamps, seeded content).

## 9. Accessibility Identifier Convention

All interactive elements must use stable identifiers for automation:

```text
iOS:     accessibilityIdentifier("record-detail.attach-source")
Android: Modifier.testTag("record-detail.attach-source")
```

Never select by localized display text or child index.

## 10. Change Log

| Version | Date | Summary |
|---|---|---|
| 1.0 | 2026-08-23 | Created UI test cases covering navigation, state matrix, search coverage states, health rows, receipts, snapshots, accessibility identifiers. |
