# Component Inventory — CreatorOS v2

**Version:** 1.0  
**Date:** 2026-08-23  
**Status:** Ready for Design Implementation  
**Related:** v2/uiux/design-tokens.md  

---

## 1. Purpose

This document defines the reusable UI components used across CreatorOS.

Components follow these rules:

- Semantic tokens only; no hard-coded colors/spacing.
- List-first; cards only for actionable summaries.
- Native platform components with shared semantic behavior.
- Every component includes default, disabled, loading, empty, offline, stale, partial, error, and large-text states as relevant.

---

## 2. Core Components

### 2.1 Bottom Navigation

| Property | Detail |
|---|---|
| Use | Primary navigation |
| Destinations | Inbox, Projects, Plan, Library |
| Labels | Text labels visible with icons |
| State | Selected/unselected; never color-only |
| Mobile rules | Preserve per-tab state; do not hide/reorder tabs temporarily |

### 2.2 Capture Button

| Property | Detail |
|---|---|
| Use | Persistent global capture action |
| Platform | iOS raised circular + / toolbar action; Android Material 3 FAB |
| Behavior | Opens Capture Sheet |
| Accessibility label | “Capture new idea” |

### 2.3 Search Field

| Property | Detail |
|---|---|
| Use | Global and contextual search |
| Platform | Native search field |
| Behavior | Search-as-you-type with debounce |
| Accessibility label | “Search CreatorOS, Google Drive, Notion, and Calendar” |

### 2.4 List Row

| Property | Detail |
|---|---|
| Use | Default content primitive |
| Structure | Leading icon/thumbnail, title, metadata, optional tertiary warning line |
| Rules | Whole row tappable; max 3 lines before expand; trailing menu not multiple tiny icons |
| Accessibility | Complete label including source/status/time |

### 2.5 Card Summary

| Property | Detail |
|---|---|
| Use | Actionable grouped summaries |
| Examples | Connection health warning, queued actions, delivery ready |
| Structure | Title, body, metadata, one primary action, optional secondary |
| Rules | One primary action per card; no nested cards |

### 2.6 Source Badge

| Property | Detail |
|---|---|
| Use | Show result/record source |
| Structure | Provider icon + text + exceptional state |
| States | Google Drive, Google Docs, Notion, Google Calendar, CreatorOS, On device |
| Rules | Never logo-only; include exceptional state text |

### 2.7 Coverage Row

| Property | Detail |
|---|---|
| Use | Search result coverage and freshness |
| Structure | Results count + sources searched summary + info action |
| States | Complete, partial, stale, offline, error, reauth |
| Rules | Present before final “No results” message |

### 2.8 Status Label

| Property | Detail |
|---|---|
| Use | Represent system states |
| States | Verified, Queued, Accepted, Partial, Failed, Needs attention, Stale, Offline |
| Rules | Icon + text + semantic color; never color-only |

### 2.9 Receipt Card

| Property | Detail |
|---|---|
| Use | Activity timeline |
| Structure | Status icon, human-readable action, metadata line, optional impact/recovery line |
| Rules | Append-only history; grouped routine events; never group errors |

### 2.10 Connection Row

| Property | Detail |
|---|---|
| Use | Connected tools list |
| Structure | Provider name, account identity, health state, last verified time |
| Actions | Reconnect, manage access, refresh, disconnect |
| Rules | Show freshness/coverage, not only green checkmark |

### 2.11 Sync Queue Item

| Property | Detail |
|---|---|
| Use | Show queued external actions |
| Structure | Action, target, source, timestamp, dependency, status |
| Actions | Retry now, cancel if safe, view dependency |
| Rules | Explain why not yet run |

### 2.12 Empty State

| Property | Detail |
|---|---|
| Use | Explain absent content |
| Structure | Short explanation + next action |
| Rules | Distinguish empty, offline-no-cache, filtered-empty, error, partial |

### 2.13 Offline Banner

| Property | Detail |
|---|---|
| Use | Global offline indication |
| Structure | “Offline — changes saved on this device” + queued count |
| Rules | Dismissible; not a blocking modal |

### 2.14 Problem Banner

| Property | Detail |
|---|---|
| Use | Connection or sync failure |
| Structure | Provider/object, impact, primary action |
| Rules | Visible at point of consequence; persistent until resolved or dismissed into connected tools/activity |

---

## 3. Composite Surfaces

| Surface | Composed From |
|---|---|
| Capture Sheet | Capture input, voice button, photo option, import option |
| Search Screen | Search field, type chips, coverage row, list rows, filter sheet |
| Project Detail | Section headers, list rows, card summaries, source badges, delivery action |
| Delivery Detail | Delivery card, status labels, receipt cards, copy/revoke actions |
| Connected Tools | Connection rows grouped by attention state |
| Activity & Receipts | Receipt cards grouped by date, filter chips |
| Sync & Offline | Sync queue items, downloads, sync status |

---

## 4. Platform Implementation

| Component | iOS | Android |
|---|---|---|
| Bottom navigation | `TabView` | Material 3 `NavigationBar` |
| Capture button | Raised `+` control | Material 3 FAB |
| Search field | SwiftUI searchable/search sheet | Compose SearchBar/full-screen search |
| List row | SwiftUI `List` | Compose `LazyColumn` |
| Sheet | SwiftUI sheet | `ModalBottomSheet` |
| Badge/Chip | SwiftUI `Text` with capsule shape | Compose `AssistChip`/`SuggestionChip` |
| Progress | SwiftUI `ProgressView` | Compose `LinearProgressIndicator` |
| Empty state | SwiftUI `ContentUnavailableView` | Compose custom state layout |

---

## 5. Component Design Rules

1. Use semantic tokens, never raw hex.
2. Design all relevant states before implementation.
3. Ensure 44×44 pt / 48×48 dp touch targets.
4. Every status component pairs color with icon and text.
5. List rows carry the main content; cards are exceptions.
6. Keep action density low: one primary action per surface.
7. Test at 200% text scale and long creator/client names.

---

## 6. Change Log

| Version | Date | Summary |
|---|---|---|
| 1.0 | 2026-08-23 | Created Component Inventory. |
