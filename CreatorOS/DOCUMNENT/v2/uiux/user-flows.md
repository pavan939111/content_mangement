# User Flows — CreatorOS v2

**Version:** 1.0  
**Date:** 2026-08-23  
**Status:** Ready for Design Implementation  
**Related:** v2/uiux/information-architecture.md  

---

## 1. Purpose

This document defines the primary user flows in CreatorOS.

It covers:

- First launch and onboarding
- Capturing ideas
- Connecting a provider
- Creating a project
- Searching across tools
- Preparing and sending a delivery
- Handling connection failure
- Offline action and sync
- Reauthorization

Each flow includes entry point, steps, success state, failure state, and mobile behavior.

---

## 2. First Launch and Onboarding

**Entry:** App install and first open.

### Flow

1. Show product value in one screen.
2. Offer optional quick setup: choose content pillars and platforms.
3. Do not force account creation.
4. Do not request permissions upfront.
5. Show Capture Sheet when user taps Capture.
6. Show “Connect Google Drive / Notion” in Library empty state.

### Rules

- No mandatory permissions during onboarding.
- Local-only usage must be possible.
- Permissions requested contextually.

---

## 3. Capturing an Idea

**Entry:** Capture button from any tab.

### Flow

1. User taps Capture.
2. Capture Sheet opens with text field focused.
3. User types or selects voice/photo/import.
4. Capture saves immediately to local database.
5. Inline confirmation: “Saved to Inbox”.
6. Item appears in Inbox > Unsorted captures.

### Offline Behavior

- Local save always succeeds.
- External sync occurs later.
- Receipt state: “Saved on this device”.

---

## 4. Connecting a Provider

**Entry:** Profile → Connected tools, or Library empty state, or project needs source.

### Flow

1. User selects provider.
2. OAuth Preflight explains requested capabilities.
3. User taps Continue to provider.
4. System browser opens provider authentication.
5. Provider account selection and consent occur.
6. User returns to CreatorOS.
7. Connection Verification screen shows account identity and access state.
8. Initial indexing begins.
9. Connection Summary screen shows coverage and last verified.

### Failure States

| Failure | UX |
|---|---|
| User cancels | Neutral: “Not connected; no data changed.” |
| Provider denies | Impact explanation + Try again |
| Callback error | “We couldn’t finish; try again” |
| Partial scope | “Connected with limited access” |

---

## 5. Creating a Project

**Entry:** Projects tab → Create project.

### Flow

1. User taps Create project.
2. Enters project/client name.
3. Optional: attach brief from Drive/Docs/Notion.
4. Optional: set campaign and due date.
5. Project is created locally.
6. Project appears in Projects list.
7. Project detail opens.

### Rules

- Project creation does not require connected source.
- Local-first save.
- Next action engine suggests first next step.

---

## 6. Searching Across Tools

**Entry:** Library tab or global search icon.

### Flow

1. User opens Search.
2. Local indexed results render first.
3. User types query.
4. Source badges and coverage row update.
5. Filters can narrow by type, source, project, date.
6. User taps a result.
7. Detail or preview opens in provider or local view.

### Coverage Rules

- Always show what was searched.
- “No results” only when coverage is complete.
- Partial/offline/error states have specific actions.

---

## 7. Preparing and Sending a Delivery

**Entry:** Project detail → Delivery.

### Flow

1. User opens Delivery.
2. Selects final asset or enters delivery URL.
3. Adds recipient, note, optional expiry.
4. Creates delivery link.
5. Link is created and receipt recorded.
6. User can copy, send, or revoke.

### States

| State | UI |
|---|---|
| Local draft saved | “Saved on this device” |
| Link created | “Delivery link ready” |
| Link sent | “Sent to Avery” |
| Recipient opened | “Opened by recipient” |
| Recipient approved | “Approved by Avery” |
| Link revoked | “Revoked by you” |

---

## 8. Handling Connection Failure

**Entry:** Search coverage, project source chip, Inbox warning, or Connected tools.

### Flow

1. System detects stale/reauth/failure.
2. Contextual banner appears where impact occurs.
3. User taps Reconnect or View issue.
4. Reauth Preflight explains impact.
5. User completes provider flow.
6. Verification screen confirms access.
7. Sync starts and produces receipt.

### Rules

- Never show false success before verification.
- Preserve cached data and local work.
- Show affected projects count.
- Offer repair, not disconnect-first.

---

## 9. Offline Action and Sync

**Entry:** User edits content while offline.

### Flow

1. User edits a CreatorOS-native object.
2. UI shows “Saved on this device”.
3. Sync queue adds external action if needed.
4. When online, sync runs.
5. Receipt updates to Sent/Accepted/Verified/Partial/Failed.
6. User can inspect queued actions in Sync & Offline.

### Rules

- Local work is never blocked.
- Queued actions are inspectable.
- Background timing is not promised as exact.
- Conflicts preserve both versions.

---

## 10. Reauthorization

**Entry:** Connected tools warning or contextual banner.

### Flow

1. System marks connection `reauth_required`.
2. User sees “Reconnect provider” with impact.
3. Taps Reconnect.
4. Repair OAuth flow starts.
5. Provider account selected or confirmed.
6. Access verified.
7. Cached data remains.
8. Sync refreshes affected content.
9. Receipt records repair.

### Rules

- Reauth is not a new connection.
- Do not silently replace provider account.
- Preserve receipts and project links.

---

## 11. Change Log

| Version | Date | Summary |
|---|---|---|
| 1.0 | 2026-08-23 | Created User Flows. |
