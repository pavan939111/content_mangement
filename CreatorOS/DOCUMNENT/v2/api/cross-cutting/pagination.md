# API Pagination

**Version:** 1.0  
**Date:** 2026-08-23  
**Status:** Ready for Development  
**Related:** v2/api/openapi/creatoros-public.openapi.yaml  

---

## 1. Purpose

This document defines pagination rules for CreatorOS list and search APIs.

Rule:

> Use opaque cursor pagination for any feed that can change while the user scrolls. Never use offset pagination for connected content or search.

---

## 2. Cursor Pagination

### Request

```http
GET /v1/connected-content?limit=25&cursor=eyJ2IjoxLCJvZmZzZXQiOjI1fQ
Authorization: Bearer <supabase-access-token>
```

### Response

```json
{
  "data": [],
  "page": {
    "next_cursor": "eyJ2IjoxLCJvZmZzZXQiOjUwfQ",
    "has_more": true
  }
}
```

---

## 3. Cursor Rules

- Cursor is opaque and URL-safe.
- Cursor encodes the sort order and tie-break fields.
- Cursor includes query/filter fingerprint.
- Cursor does not replace authorization.
- Cursor is not a provider page token.
- Reusing a cursor with a different query returns `400 INVALID_CURSOR`.
- Cursor lifetime is limited; expired cursor returns `400 INVALID_CURSOR` or `410 GONE`.

---

## 4. Stable Sort Requirements

For deterministic pagination, every cursor must include all ordering fields plus a unique tie-breaker.

Example:

```sql
order by
  final_score desc,
  source_modified_at desc nulls last,
  id asc
```

For list endpoints:

```sql
order by
  updated_at desc,
  id asc
```

Do not rely on a relevance score alone because scores can tie.

---

## 5. Cursor Internals

A signed cursor may contain:

```json
{
  "v": 1,
  "workspace_id": "ws_01JQ...",
  "sort": "relevance",
  "query_hash": "sha256:...",
  "filters_hash": "sha256:...",
  "last_score": 0.8317,
  "last_modified_at": "2026-08-22T14:19:00Z",
  "last_id": "cnt_01JQ...",
  "issued_at": 1787475964,
  "expires_at": 1787476864
}
```

Encode and sign or encrypt the cursor. Never expose plain SQL predicates or trust client-provided fields.

---

## 6. Page Size

| Context | Default | Max |
|---|---|---|
| Connected content list | 25 | 50 |
| Search | 25 | 50 |
| Action receipts | 25 | 50 |
| Provider sync results | 100 | 1000 internal |

Mobile must not request unbounded page sizes.

---

## 7. Offset Pagination Policy

Offset pagination is prohibited for:

- Connected content
- Search
- Action receipts
- Any real-time changing feed

Offset may be used only for stable, rarely-changing, small datasets in internal admin APIs if necessary.

---

## 8. Cursor Failures

If a cursor is malformed, expired, signed incorrectly, or mismatched:

```json
{
  "error": {
    "code": "INVALID_CURSOR",
    "message": "This result cursor is invalid or no longer valid. Restart the search.",
    "retryable": true,
    "request_id": "req_01JQZ8F1JTEJ4A4T7XSNVN34F7"
  }
}
```

Client behavior:

- Discard local cursor.
- Restart search from the beginning.
- Preserve the user's query and filters.

---

## 9. Change Log

| Version | Date | Summary |
|---|---|---|
| 1.0 | 2026-08-23 | Created API pagination specification. |
