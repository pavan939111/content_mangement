# State Matrix — CreatorOS v2

**Version:** 1.0  
**Date:** 2026-08-23  
**Status:** Ready for Design Implementation  
**Related:** v2/uiux/components.md  

---

## 1. Purpose

This document defines the user-visible states for core CreatorOS surfaces.

Every component and screen must handle the states relevant to its data and actions.

---

## 2. Global Application States

| State | Visual Treatment | User Message | Primary Action |
|---|---|---|---|
| Online, current | Normal | None required | — |
| Offline | Compact top banner + contextual labels | “Offline — changes saved on this device” | View queued actions |
| Syncing | Inline progress, not global overlay | “Syncing changes…” | — |
| Back online | Short confirmation | “Back online · Syncing 3 saved changes” | — |
| Reauth required | Persistent contextual warning | “Reconnect Google Drive” | Reconnect |
| Provider outage | Explain provider-side issue + retry time | “Google Drive is temporarily unavailable” | Try again |
| Low storage | Explain effect on downloads/uploads | “Downloads paused to free space” | Manage storage |

---

## 3. Search States

| State | Search Coverage UI | Result Treatment |
|---|---|---|
| Complete | “All 4 sources searched” | No warning |
| Partial | “3 of 4 sources searched” | Missing source shown; retry/reconnect |
| Indexing | “Google Drive is updating…” | Available results shown immediately |
| Stale | “Notion cached 2 days ago” | Results retained with stale label |
| Offline | “Offline — showing on-device items” | Local/cached results only |
| Reauth required | “Calendar excluded — reconnect” | Do not imply zero Calendar matches |
| Source error | “Google Drive couldn’t be searched” | Cached content preserved; retry |
| Permission restricted | “Some Notion pages may be unavailable” | Scope explanation |
| True empty | “No results for ‘query’” | Search title only / clear filters |
| Incomplete empty | “No matches in searched sources; some sources unavailable” | Retry/reconnect |

---

## 4. Connection Health States

| State | Treatment | Message | Action |
|---|---|---|---|
| Healthy/current | Quiet row + timestamp | “Last indexed 12 min ago” | View details |
| Healthy/stale | Amber clock + time/scope | “Cached 2 days ago” | Refresh now |
| Needs reauthorization | High-priority warning | “Access expired · 4 projects affected” | Reconnect |
| Error/retry pending | Error state + cause + retry time | “Sync delayed” | Retry/view details |
| Offline | Global indicator + cache label | “Saved on this device” | Work offline |
| Partial coverage | “Limited access” + scope detail | “3 folders excluded” | Review access |
| Disconnected | Muted state | “Connect again” | Connect |

---

## 5. Action Receipt States

| State | Icon | Label | Primary Action |
|---|---|---|---|
| Requested | Circle | “Requested” | — |
| Saved locally | Device icon | “Saved on this device” | Undo if relevant |
| Queued | Clock | “Queued to sync” | View queue / cancel if safe |
| Sent | Arrow | “Sending to Google Drive…” | View progress |
| Accepted | Provider check | “Accepted by Google Drive” | View receipt |
| Verified | Check-circle | “Verified” | Open target |
| Partial | Warning triangle | “Completed with 1 issue” | Retry failed items |
| Failed | Error-circle | “Couldn’t complete” | Retry / reconnect / resolve |
| Needs attention | Alert | “Action needed” | Resolve |
| Superseded | Muted check | “Superseded by later update” | View latest |

---

## 6. Delivery Link States

| State | Label | Action |
|---|---|---|
| Draft saved | “Delivery draft saved on this device” | Continue |
| Link created | “Delivery link ready” | Copy / send |
| Link sent | “Sent to Avery” | View delivery |
| Recipient opened | “Opened by recipient” | View activity |
| Approved | “Approved by Avery” | View receipt |
| Expired | “Link expired” | Create new |
| Revoked | “Revoked by you” | Restore/close |

---

## 7. Sync Queue Item States

| State | Label | User Control |
|---|---|---|
| Waiting for connection | “Waiting for connection” | Retry when online |
| Waiting for Wi-Fi | “Waiting for Wi-Fi · 842 MB” | Use cellular |
| Waiting for power | “Deferred for battery” | Sync now |
| Waiting for dependency | “Waiting for upload to finish” | View dependency |
| Retrying | “Retrying automatically at 4:20 PM” | Retry now / cancel |
| Needs attention | “Needs attention” | Reconnect/resolve |
| Complete | “Verified” | View receipt |

---

## 8. Project State Indicators

| State | Treatment |
|---|---|
| Current | No warning |
| Stale source | Amber source chip + “Last synced 2 days ago” |
| Blocked | “Awaiting client feedback” |
| Reauth needed | “Reconnect Drive to refresh assets” |
| Offline edits | “Saved on this device · 2 changes queued” |

---

## 9. Dense-State Test Cases

Design and test these dense cases:

- 20+ search results from mixed sources
- 50+ activity receipts
- Long client/project names
- 200% text scale
- Dark mode
- Offline mode
- Partial coverage
- Reauth required
- Multiple provider accounts
- Conflict resolution

---

## 10. Change Log

| Version | Date | Summary |
|---|---|---|
| 1.0 | 2026-08-23 | Created State Matrix. |
