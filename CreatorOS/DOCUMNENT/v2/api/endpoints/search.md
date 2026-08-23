# Search API

**Version:** 1.0  
**Date:** 2026-08-23  
**Status:** Ready for Development  
**Related:** v2/api/openapi/creatoros-public.openapi.yaml  

---

## 1. Purpose

This document defines the public Connected Search API.

Search is not a live fan-out to Google and Notion.

Search queries CreatorOS's normalized Postgres index and returns fast results with coverage and freshness metadata.

---

## 2. Endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/v1/search` | Search normalized connected content |
| POST | `/v1/search:refresh` | Enqueue async provider refresh |

---

## 3. Search Request

```http
GET /v1/search?q=campaign+brief&providers=google_drive,notion&types=document,notion_page&limit=25&cursor=opaque
Authorization: Bearer <supabase-access-token>
```

### Query Parameters

| Parameter | Required | Description |
|---|---|---|
| `q` | Yes | 2–200 normalized Unicode characters |
| `providers` | No | Comma-separated provider filter |
| `types` | No | Comma-separated type filter |
| `sort` | No | `relevance`, `modified_desc`, `title_asc` |
| `limit` | No | Default 25, max 50 |
| `cursor` | No | Opaque URL-safe cursor |

---

## 4. Search Response

```json
{
  "data": [
    {
      "id": "cnt_01JQZ57PQB3VT8QZASQ3XKDV8S",
      "provider": "google_drive",
      "kind": "document",
      "title": "Summer Campaign Brief",
      "canonical_url": "https://docs.google.com/document/d/1AbCdEfG/edit",
      "modified_at": "2026-08-22T14:19:00Z",
      "match": {
        "kind": "exact_title",
        "highlights": ["Summer <mark>Campaign Brief</mark>"]
      },
      "freshness": {
        "state": "fresh",
        "indexed_at": "2026-08-23T09:06:04Z",
        "source_modified_at": "2026-08-22T14:19:00Z"
      }
    }
  ],
  "page": {
    "next_cursor": "eyJ2IjoxLCJzb3J0IjoicmVsZXZhbmNlIiwic2Vl...",
    "has_more": true
  },
  "coverage": {
    "state": "partial",
    "searched_providers": ["google_drive", "notion"],
    "fresh_providers": ["google_drive"],
    "stale_providers": [],
    "unavailable_providers": ["notion"]
  },
  "meta": {
    "request_id": "req_01JQZ6B8J0RCY3V39KR06C35V9"
  }
}
```

---

## 5. Coverage and Empty Results

### Complete empty result

```json
{
  "data": [],
  "page": { "next_cursor": null, "has_more": false },
  "coverage": {
    "state": "complete",
    "fresh_providers": ["google_drive", "notion"],
    "stale_providers": [],
    "unavailable_providers": []
  }
}
```

Meaning: true empty, no matches exist in currently covered sources.

### Partial empty result

```json
{
  "data": [],
  "page": { "next_cursor": null, "has_more": false },
  "coverage": {
    "state": "partial",
    "fresh_providers": [],
    "stale_providers": ["google_drive"],
    "unavailable_providers": ["notion"]
  }
}
```

Meaning: no local matches found, but coverage is incomplete. Do not show categorical "No results".

---

## 6. Refresh Request

```http
POST /v1/search:refresh
Authorization: Bearer <supabase-access-token>
Idempotency-Key: uuid
Content-Type: application/json
```

```json
{
  "providers": ["google_drive", "notion"]
}
```

Response `202 Accepted`:

```json
{
  "operation": {
    "id": "op_01JR03AJ7E0R30XPRSF0V2C4G3",
    "type": "connection_refresh",
    "status": "queued"
  }
}
```

Mobile should poll `GET /v1/operations/{operationId}`.

---

## 7. Cursor Rules

- Cursor is opaque and URL-safe.
- Cursor includes query/filter/sort fingerprint.
- Reusing a cursor with a different query returns `400 INVALID_CURSOR`.
- Cursor is not a provider page token.
- Cursor does not replace authorization.

---

## 8. Error Cases

| Error | Public Code |
|---|---|
| Query too short | `VALIDATION_FAILED` |
| Invalid cursor | `INVALID_CURSOR` |
| Rate limited | `RATE_LIMITED` |
| Provider unavailable | `PROVIDER_UNAVAILABLE` |

---

## 9. Mobile Behavior

- Debounce input 150–250 ms.
- Render local cache immediately.
- Read `coverage` to show stale/incomplete state.
- Never show categorical "No results" when coverage is `partial`.
- Never retry provider calls directly.
- Poll refresh operation; don't reopen search aggressively.

---

## 10. Change Log

| Version | Date | Summary |
|---|---|---|
| 1.0 | 2026-08-23 | Created Search API specification. |
