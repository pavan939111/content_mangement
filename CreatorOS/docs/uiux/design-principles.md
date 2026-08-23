# UI/UX Design Principles — CreatorOS v2

**Version:** 1.0  
**Date:** 2026-08-23  
**Status:** Ready for Design Implementation  
**Related:** v2/creator_os_prd_v2.md, v2/creator_os_product_scope.md  

---

## 1. Purpose

This document defines the product design principles that guide every screen, component, and interaction in CreatorOS.

These principles ensure the product feels:

- Calm, not cluttered.
- Fast and task-oriented.
- Trustworthy about connected state.
- Native on iOS and Android.
- Accessible to professional creators in real work conditions.

---

## 2. Core Product Design Principles

### 2.1 Mobile-First, One-Thumb Efficient

Primary tasks must be reachable from the lower half of the screen.

- Bottom navigation for primary destinations.
- Persistent capture control in thumb reach.
- Key actions near the content they affect.
- No hidden gesture-only interactions.
- Navigation state preserved per tab.

---

### 2.2 Calm Surfaces, Strong Hierarchy

Visual density should come from information hierarchy, not decoration.

- Lists are the primary content primitive.
- Cards are reserved for actionable summaries.
- Use whitespace and type weight before shadows and color.
- One primary action per screen.
- Metadata earns its space but stays secondary.

---

### 2.3 Explicit Truthfulness

Never show a state that implies success when the action is only queued or accepted.

- Distinguish Saved locally, Queued, Accepted, Verified, Partial, Failed.
- Search always shows coverage: “3 of 4 sources searched.”
- Connection health includes freshness, coverage, and last sync outcome.
- OAuth success is not connection success; verification follows.
- Receipts are append-only and human-readable.

---

### 2.4 Local-First, Sync Truthful

The local database is the working copy.

- CreatorOS-native edits save immediately.
- External work queues locally and syncs later.
- Offline is a mode, not an error.
- The UI explains what is available offline and what is not.
- Background sync timing is never promised as exact.

---

### 2.5 Status Language First, Color Second

Color never communicates state alone.

- Use icon + text + semantic color together.
- Use plain language: “Queued to sync,” “Cached 2 days ago,” “Reconnect required.”
- Avoid decorative green checkmarks for routine health.
- Reserve red/amber for actionable exceptions and impact.

---

### 2.6 Native Platform Behavior

CreatorOS should feel native on each platform.

- iOS: SwiftUI, system authentication browser, Dynamic Type, safe areas.
- Android: Jetpack Compose, Material 3, Chrome Custom Tabs/Auth Tab, font scaling.
- Shared semantics, platform-native components and transitions.
- Do not create identical rendering if it breaks platform expectations.

---

### 2.7 Accessibility-First

Accessibility is part of the initial design, not a retroactive fix.

- 44×44 pt iOS / 48×48 dp Android touch targets.
- WCAG 2.2 AA contrast intent.
- VoiceOver/TalkBack complete labels.
- Large text and 200% font scaling without truncation.
- Reduced Motion respected.
- All gesture actions have accessible alternatives.

---

### 2.8 Design for Real Work Density

CreatorOS is for professional UGC creators managing real paid work.

- Screens must work with 20+ search results, 50+ receipts, long client names.
- Dense lists should remain scannable.
- Key metadata: source, project, time, status.
- Empty, loading, error, offline, partial, and stale states are designed first.

---

## 3. Decision Rules

When design choices conflict, use these rules:

1. Trustworthiness beats celebration. Never show false completion.
2. Clarity beats feature count. Remove controls that don’t help the current task.
3. Local action beats remote explanation. Let the user act, then show state.
4. Contextual impact beats global settings. Surface connection issues where they matter.
5. Calm beats flashy. Avoid heavy motion, bright status colors, or playful copy in client work.

---

## 4. Product Voice

CreatorOS is:

- Professional and specific.
- Honest about uncertainty.
- Actionable in every state.
- Respectful of creator time and client relationships.

Example microcopy:

- Good: “Google Drive reconnect required. 4 projects may be outdated.”
- Bad: “Oops, connection failed.”
- Good: “Saved on this device. Queued to sync.”
- Bad: “Almost done!”
- Good: “Searched 3 of 4 sources. Notion needs attention.”
- Bad: “No results.”

---

## 5. Change Log

| Version | Date | Summary |
|---|---|---|
| 1.0 | 2026-08-23 | Created UI/UX Design Principles. |
