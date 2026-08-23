# Screen Inventory — CreatorOS v2

**Version:** 1.0  
**Date:** 2026-08-23  
**Status:** Ready for Design Implementation  
**Related:** v2/uiux/information-architecture.md  

---

## 1. Purpose

This document lists every screen and major component surface in CreatorOS v2.

It covers:

- Screen name
- Primary purpose
- Key content
- Main actions
- Entry points
- States

---

## 2. Global Surfaces

| Screen | Purpose | Key Content | Main Actions | States |
|---|---|---|---|---|
| Capture Sheet | Quickly capture an idea or task | Text field, voice, photo, import options | Save, voice record, attach | Default, voice recording |
| Search | Find anything across connected tools | Search field, type filters, coverage row, results | Search, filter, open result | Default, loading, empty, partial, offline, error |
| Profile / Menu | Access account and utilities | User identity, plan, connected tools, settings | Open settings, connected tools, receipts | Default |
| Connected Tools | Manage provider connections | Provider rows, health states, last synced | Connect, reconnect, manage, disconnect | Healthy, stale, reauth, partial, offline |
| Activity & Receipts | Show durable action history | Receipt cards grouped by date | Filter, expand, retry, view details | Default, empty, offline, error |
| Sync & Offline | Inspect queued work and offline availability | Queued actions, downloads, sync state | Retry, cancel, manage downloads | Offline, pending, syncing, complete |

---

## 3. Bottom-Tab Screens

### 3.1 Inbox

| Item | Detail |
|---|---|
| Purpose | Triage attention items |
| Key content | Unresolved items, client feedback, warnings, unsorted captures |
| Actions | Do now, schedule, assign, archive, snooze, reconnect |
| Entry | Bottom navigation |
| States | Empty, loading, offline, error |

### 3.2 Projects

| Item | Detail |
|---|---|
| Purpose | Move active client work forward |
| Key content | Project cards, stages, due dates, delivery state |
| Actions | Open project, create project |
| Entry | Bottom navigation |
| States | Empty, loading, offline, error |

#### Project Detail

| Item | Detail |
|---|---|
| Purpose | Execute one project |
| Key content | Work, assets, notes, timeline, delivery |
| Actions | Add task, attach source, send delivery, change stage |
| Entry | Tap project card |
| States | Default, loading, offline, stale source, partial sync |

---

### 3.3 Plan

| Item | Detail |
|---|---|
| Purpose | Show time-bound work |
| Key content | Today, upcoming, deadlines, connected calendar events |
| Actions | Schedule task, open event, connect calendar |
| Entry | Bottom navigation |
| States | Empty, loading, offline, calendar disconnected |

---

### 3.4 Library

| Item | Detail |
|---|---|
| Purpose | Find and reuse knowledge/assets |
| Key content | Search, recents, source filters, scripts, assets, templates, saved items |
| Actions | Search, filter, open item, connect source |
| Entry | Bottom navigation |
| States | Empty, loading, offline, partial coverage, error |

---

## 4. Connected Tool Detail

| Screen | Purpose | Key Content | Main Actions |
|---|---|---|---|
| Google Drive Detail | Manage Drive connection and coverage | Access state, last indexed, included/excluded folders, affected projects, recent activity | Refresh, manage access, reconnect, disconnect |
| Google Docs Detail | Manage Docs connection | Access state, last synced, affected projects, recent activity | Refresh, manage access, reconnect, disconnect |
| Google Calendar Detail | Manage Calendar connection | Access state, synced calendars, affected events, last synced | Refresh, manage access, reconnect, disconnect |
| Notion Detail | Manage Notion connection | Access state, shared pages/databases, affected projects, last synced | Refresh, review pages, reconnect, disconnect |

---

## 5. Delivery Surface

| Screen | Purpose | Key Content | Main Actions |
|---|---|---|---|
| Delivery Preview | Prepare a client delivery link | Delivery title, note, recipient, expiry | Create link, send |
| Delivery Link Detail | View delivery state | Public link, recipient activity, expiry, receipts | Copy link, revoke, send again |
| Public Delivery View | Client-facing read-only view | Delivery metadata only | Open/download final asset, approve if configured |

---

## 6. Receipt Detail

| Screen | Purpose | Key Content | Main Actions |
|---|---|---|---|
| Receipt Detail | Show proof and outcome of an action | Human-readable action, source, target, outcome, evidence, technical details | Retry, reconnect, open target, copy ID |

---

## 7. OAuth / Connection Flow

| Screen | Purpose | Key Content | Main Actions |
|---|---|---|---|
| OAuth Preflight | Explain requested access | Provider, capabilities, what CreatorOS will/won’t do | Continue, cancel |
| Provider Auth Browser | Provider-controlled consent | Google/Notion account and consent screens | Provider-native |
| Connection Verification | Confirm access and begin sync | Account identity, access state, indexing progress | Continue to app |
| Connection Summary | Show connected result | Provider, account, scope, coverage, last verified, receipt | Open Library, view connected tools |
| Reauth Preflight | Explain expired access | Impact, affected projects | Reconnect, not now |
| Account Selection | For multiple provider accounts | Existing connections, add account | Add account, select account |

---

## 8. States Matrix

Every screen must support these states where relevant:

| State | Example |
|---|---|
| Default | Normal populated content |
| Loading | Skeleton or inline progress |
| Empty | “No projects yet” |
| Offline | “Saved on this device” |
| Stale | “Cached 2 days ago” |
| Partial | “3 of 4 sources searched” |
| Error | “Couldn’t upload; retry” |
| Reauth required | “Reconnect Google Drive” |
| High text scale | All labels wrap, no truncation |
| Dark mode | All surfaces readable |
| Reduced motion | Fade/replace instead of slide/bounce |

---

## 9. Change Log

| Version | Date | Summary |
|---|---|---|
| 1.0 | 2026-08-23 | Created Screen Inventory. |
