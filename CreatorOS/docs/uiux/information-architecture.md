# Information Architecture — CreatorOS v2

**Version:** 1.0  
**Date:** 2026-08-23  
**Status:** Ready for Design Implementation  
**Related:** v2/creator_os_prd_v2.md, v2/uiux/design-principles.md  

---

## 1. Purpose

This document defines the mobile information architecture for CreatorOS.

It establishes:

- Primary destinations
- Global utilities
- Content hierarchy
- Navigation behavior
- Where connected tools and settings live
- Desktop/tablet differences

---

## 2. Primary Navigation

Use four bottom destinations:

```text
[ Inbox ] [ Projects ] [ Plan ] [ Library ]
```

### 2.1 Destination Responsibilities

| Destination | Job | Primary Content |
|---|---|---|
| Inbox | Triage what needs attention | Mentions, client feedback, approvals, overdue work, connection warnings, unsorted captures |
| Projects | Move active client work forward | Active projects, deliverables, next actions, delivery state, project assets |
| Plan | See and act on time-bound work | Today, upcoming shoots, deadlines, calendar events, scheduled tasks |
| Library | Find and reuse knowledge/assets | Universal search, source filters, scripts, assets, templates, saved items, recents |

### 2.2 Tab Order

```text
Inbox · Projects · Plan · Library
```

### 2.3 Labels

Keep text labels visible with icons. Never use icon-only bottom navigation.

---

## 3. Persistent Capture Action

Use a persistent **Capture** control, visually separate from the bottom tabs.

### 3.1 Placement

- iOS: prominent raised circular `+` control or toolbar action.
- Android: Material 3 FAB.

### 3.2 Capture Sheet

On tap, open a bottom sheet with:

1. **Type idea**
2. **Voice note**
3. **Photo / screenshot**
4. **Import from share sheet**
5. **New task**
6. **New project** — secondary

Default destination: **Unsorted Inbox**.

Every capture saves locally immediately.

---

## 4. Global Utilities

The following are utilities, not bottom destinations:

- **Search** — full-screen “Find anything” surface, reachable from every screen.
- **Profile / Settings** — user avatar/menu.
- **Connected tools** — inside Profile.
- **Activity & receipts** — inside Profile and contextual object timelines.
- **Sync & offline** — inside Profile and contextual queue surfaces.
- **Help / support** — inside Profile.

---

## 5. Screen Hierarchy

### 5.1 Inbox

```text
Inbox
├── Needs attention
│   ├── Client feedback
│   ├── Connection warnings
│   ├── Approvals
│   └── Overdue items
├── Unsorted captures
└── Reconnect needed
```

Each item has one primary resolution action: Do now, Schedule, Assign to project, Archive, Snooze, Reconnect.

### 5.2 Projects

```text
Projects
├── Active projects
│   └── Project detail
│       ├── Work
│       ├── Assets
│       ├── Notes
│       ├── Timeline
│       └── Delivery
└── Archived projects
```

Project card shows:

- Client/project name
- Stage
- Next action
- Due date
- Delivery status
- Connected-source summary
- Sync warning only when action needed

### 5.3 Plan

```text
Plan
├── Today
├── Upcoming
├── Unscheduled due soon
└── Calendar events
```

Plan includes scheduled CreatorOS work and connected Google Calendar events.

### 5.4 Library

```text
Library
├── Search
├── Recents
├── Saved searches
├── Connected-source filters
│   ├── Google Drive
│   ├── Google Docs
│   ├── Notion
│   ├── Google Calendar
│   └── CreatorOS
├── Scripts
├── Assets
├── Templates
├── Briefs
└── Delivery links
```

---

## 6. Search Surface

Search is a full-screen experience accessible from all tabs.

### 6.1 Structure

```text
← Search CreatorOS, Drive, Docs, Notion, Calendar     ×

[All] [Files] [Notes] [Events] [Projects] [Deliveries]

Coverage row: 82 results · 3 of 4 sources searched    ⓘ

Results list

[Filters]
```

### 6.2 Entry Points

- Library tab search icon.
- Global search icon on other tabs.
- iOS Spotlight, Shortcuts, widgets.
- Android launcher shortcuts, widgets, voice intent, share targets.

---

## 7. Connected Tools Surface

Connected tools are not a bottom tab.

### 7.1 Entry Points

1. **Profile → Connected tools** — full management screen.
2. **Contextual source chips** — in search results and project detail.
3. **Actionable health banners** — where a connection problem affects current work.

### 7.2 Connected Tools Screen

Group by attention state:

```text
Connected tools

Attention required
• Notion — Reconnect

Up to date
• Google Drive — Last indexed 12 min ago
• Google Docs — Last indexed 12 min ago
• Google Calendar — Last synced 8 min ago
```

---

## 8. Navigation State Behavior

- Preserve each tab’s navigation state.
- Switching tabs does not reset scroll position or open detail screens.
- Search preserves the last query while the app process remains alive.
- OAuth return restores the originating context.
- After app relaunch, reopen the last active tab and project if safe.

---

## 9. Mobile vs Desktop/Tablet

| Area | Mobile | Desktop/Tablet |
|---|---|---|
| Navigation | Four bottom tabs + Capture | Sidebar/navigation rail + command palette |
| Search | Full-screen overlay | Persistent field + filters |
| Project work | Single-column drill-in | Split-pane overview |
| Connections | Profile screen | Dedicated settings page |
| Library | Search-first screen | Folder/tree + search |
| Activity | Receipt timeline | Audit table + filters |

Do not copy desktop density into mobile.

---

## 10. Change Log

| Version | Date | Summary |
|---|---|---|
| 1.0 | 2026-08-23 | Created Information Architecture. |
