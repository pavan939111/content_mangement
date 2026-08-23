# API Caching and Freshness

**Version:** 1.0  
**Date:** 2026-08-23  
**Status:** Ready for Development  
**Related:** v2/api/openapi/creatoros-public.openapi.yaml  

---

## 1. Purpose

This document defines caching and freshness rules for CreatorOS public APIs.

Goal:

- Keep mobile search and list views fast.
- Avoid stale data that misleads creators.
- Never allow caching to become an authorization or privacy bypass.

---

## 2. Cache Layers

| Layer | Purpose | Authority |
|---|---|---|
| Mobile local cache | Instant UI restore and offline rendering | Backend remains authority |
| BFF/server cache | Reduce duplicate computation | Short-lived |
| Postgres normalized index | Product search data | Authoritative for indexed metadata |
| Provider response cache | Reduce external provider calls | Server-only, very short TTL |
| CDN/shared cache | Not used for authenticated user content | — |

Authenticated CreatorOS content must not be stored in shared public CDN caches.

---

## 3. HTTP Cache Control

For authenticated search:

```http
Cache-Control: private, max-age=0, must-revalidate
Vary: Authorization
ETag: "search-v1-7c24bf2b..."
```

For connection metadata:

```http
Cache-Control: private, max-age=15, stale-while-revalidate=60
ETag: "con-state-49d6..."
```

Rules:

- Use `private` for user/workspace-specific data.
- Never use `public`.
- Always vary on `Authorization`.
- ETag values must reflect content state, not only timestamps.

---

## 4. Connection Freshness Classes

| Class | Definition | Search behavior |
|---|---|---|
| Fresh | Synced within 5 minutes | Return indexed results as current |
| Soft stale | 5–60 minutes | Return results; enqueue debounced delta sync |
| Hard stale | Over 60 minutes | Return results with prominent stale marker; enqueue priority sync |
| Degraded | Last sync failed or provider issue | Return last known results; mark `partial` |
| Reauth required | Token revoked/expired | Exclude or mark source unavailable according to product policy |
| No prior sync | Never synced | Return unavailable; prompt connect/sync |

---

## 5. Search Coverage Response

Search responses include coverage:

```json
{
  "coverage": {
    "state": "partial",
    "fresh_providers": ["google_drive"],
    "stale_providers": [],
    "unavailable_providers": ["notion"]
  }
}
```

Mobile uses this to:

- Show “Updated 5 minutes ago.”
- Show “Notion is reconnecting.”
- Avoid categorical “No results” when coverage is partial.

---

## 6. Stale-While-Revalidate

Use the pattern at the application layer for connection metadata and low-risk views:

```http
Cache-Control: private, max-age=15, stale-while-revalidate=60
```

Meaning:

- Serve cached value for up to 15 seconds without waiting.
- Trigger background refresh after 15 seconds.
- Serve stale value for up to 60 seconds while refreshing.

Never use this for:

- Provider token state
- Action receipts
- Billing/plan state
- Permission decisions

---

## 7. Provider Response Cache

Provider responses are cached only server-side and are never exposed to mobile.

- Google Drive / Docs / Calendar: cache metadata responses briefly.
- Notion: cache search/page metadata for a short TTL.
- Provider cache is not authoritative.
- Before a provider write, always fetch/reconcile fresh state.

---

## 8. Cache Invalidation

Invalidate local normalized records when:

- A delta sync detects update, move, archive, delete, or permission change.
- A connection disconnects or reauthorizes.
- A provider webhook triggers reconciliation.
- A handoff creates or mutates a provider object.
- An action receipt completes.
- Workspace membership changes.

When an item is deleted at the source:

```json
{
  "access_state": "deleted",
  "search_visible": false,
  "deleted_at": "2026-08-23T09:11:08Z"
}
```

Exclude from normal search, but retain minimal audit linkage for receipts.

---

## 9. Mobile Local Cache Rules

- Store last search result page with query and cursor pairing.
- Render cached results immediately, then refresh.
- Merge results by stable ID.
- Discard cached cursors after query/filter/sort changes.
- Never use stale local cache for permission or health decisions.
- Encrypt local cache and clear on sign-out or workspace removal.

---

## 10. Change Log

| Version | Date | Summary |
|---|---|---|
| 1.0 | 2026-08-23 | Created API caching and freshness specification. |
