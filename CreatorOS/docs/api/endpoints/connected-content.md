# Connected Content API

**Version:** 1.0  
**Date:** 2026-08-23  
**Status:** Ready for Development  
**Related:** v2/api/openapi/creatoros-public.openapi.yaml  

---

## 1. Purpose

This document defines the public Connected Content API.

A connected content record represents one brand deliverable or creator content item. It links external sources through a connection.

---

## 2. Endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/v1/connected-content` | List records |
| POST | `/v1/connected-content` | Create record |
| GET | `/v1/connected-content/{recordId}` | Get record |
| PATCH | `/v1/connected-content/{recordId}` | Update record |
| DELETE | `/v1/connected-content/{recordId}` | Soft delete |
| POST | `/v1/connected-content/{recordId}/links` | Attach source link |
| DELETE | `/v1/connected-content/{recordId}/links/{linkId}` | Remove source link |
| POST | `/v1/connected-content/{recordId}/delivery` | Mark delivered |

---

## 3. List Records

Request:

```http
GET /v1/connected-content?status=draft&limit=25&cursor=opaque
Authorization: Bearer <supabase-access-token>
```

Response:

```json
{
  "data": [
    {
      "id": "rec_01JQZ57PQB3VT8QZASQ3XKDV8S",
      "brand": "Brand X",
      "campaign": "Summer 2026",
      "title": "Summer skincare UGC video",
      "due_date": "2026-08-30T17:00:00Z",
      "status": "draft",
      "delivery_status": null,
      "next_action": "Attach a brief or script",
      "updated_at": "2026-08-23T10:00:00Z"
    }
  ],
  "page": {
    "next_cursor": "eyJ2IjoxLCJvZmZzZXQiOjI1fQ",
    "has_more": true
  }
}
```

---

## 4. Create Record

Request:

```http
POST /v1/connected-content
Authorization: Bearer <supabase-access-token>
Idempotency-Key: uuid
Content-Type: application/json
```

```json
{
  "title": "Summer skincare UGC video",
  "brand": "Brand X",
  "campaign": "Summer 2026",
  "due_date": "2026-08-30T17:00:00Z",
  "status": "draft",
  "notes": "Initial hook: glow routine"
}
```

Response `201 Created`:

```json
{
  "id": "rec_01JQZ57PQB3VT8QZASQ3XKDV8S",
  "title": "Summer skincare UGC video",
  "brand": "Brand X",
  "campaign": "Summer 2026",
  "due_date": "2026-08-30T17:00:00Z",
  "status": "draft",
  "next_action": "Attach a brief or script",
  "created_at": "2026-08-23T10:00:00Z",
  "updated_at": "2026-08-23T10:00:00Z"
}
```

---

## 5. Get Record

Request:

```http
GET /v1/connected-content/rec_01JQZ57PQB3VT8QZASQ3XKDV8S
Authorization: Bearer <supabase-access-token>
```

Response:

```json
{
  "id": "rec_01JQZ57PQB3VT8QZASQ3XKDV8S",
  "brand": "Brand X",
  "campaign": "Summer 2026",
  "title": "Summer skincare UGC video",
  "due_date": "2026-08-30T17:00:00Z",
  "status": "draft",
  "delivery_status": null,
  "next_action": "Attach a brief or script",
  "notes": "Initial hook: glow routine",
  "external_sources": [
    {
      "id": "link_01JQP...",
      "provider": "google_drive",
      "display_name": "Brand X Brief",
      "link_type": "brief",
      "status": "healthy",
      "last_verified_at": "2026-08-23T10:05:00Z"
    }
  ],
  "created_at": "2026-08-23T10:00:00Z",
  "updated_at": "2026-08-23T10:00:00Z"
}
```

---

## 6. Update Record

Request:

```http
PATCH /v1/connected-content/rec_01JQZ57PQB3VT8QZASQ3XKDV8S
Authorization: Bearer <supabase-access-token>
Content-Type: application/json
```

```json
{
  "status": "scripting",
  "notes": "Script draft ready"
}
```

Response `200 OK`: updated record.

Only provided fields are updated. `id`, `created_at`, and external sources are not modified via PATCH.

---

## 7. Soft Delete Record

Request:

```http
DELETE /v1/connected-content/rec_01JQZ57PQB3VT8QZASQ3XKDV8S
Authorization: Bearer <supabase-access-token>
Idempotency-Key: uuid
```

Response `202 Accepted`:

```json
{
  "operation": {
    "id": "op_01JQ...",
    "type": "connected_content_delete",
    "status": "queued"
  }
}
```

Soft-deleted records are excluded from default list and search.

---

## 8. Attach External Source Link

Request:

```http
POST /v1/connected-content/rec_01JQZ57PQB3VT8QZASQ3XKDV8S/links
Authorization: Bearer <supabase-access-token>
Idempotency-Key: uuid
Content-Type: application/json
```

```json
{
  "provider": "google_drive",
  "external_object_id": "1AbCdEfG",
  "canonical_url": "https://drive.google.com/file/d/1AbCdEfG/view",
  "display_name": "Brand X Brief",
  "link_type": "brief",
  "match_method": "user_confirmed"
}
```

Response `201 Created`:

```json
{
  "id": "link_01JQ...",
  "record_id": "rec_01JQZ57PQB3VT8QZASQ3XKDV8S",
  "provider": "google_drive",
  "display_name": "Brand X Brief",
  "status": "healthy",
  "last_verified_at": "2026-08-23T10:05:00Z"
}
```

---

## 9. Remove Source Link

Request:

```http
DELETE /v1/connected-content/rec_01JQ.../links/link_01JQ...
Authorization: Bearer <supabase-access-token>
Idempotency-Key: uuid
```

Response `202 Accepted`:

```json
{
  "operation": {
    "id": "op_01JQ...",
    "type": "source_link_remove",
    "status": "queued"
  }
}
```

Removing a link never deletes the external provider object.

---

## 10. Mark Delivered

Request:

```http
POST /v1/connected-content/rec_01JQ.../delivery
Authorization: Bearer <supabase-access-token>
Content-Type: application/json
```

```json
{
  "delivery_url": "https://drive.google.com/drive/folders/...",
  "note": "Final delivery folder"
}
```

Response `200 OK`:

```json
{
  "id": "rec_01JQ...",
  "delivery_status": "delivered",
  "delivered_at": "2026-08-23T10:15:00Z",
  "delivery_url": "https://drive.google.com/drive/folders/..."
}
```

An immutable action receipt is created automatically.

---

## 11. Error Cases

| Error | Public Code |
|---|---|
| Invalid status transition | `VALIDATION_FAILED` |
| Record not found | `NOT_FOUND` |
| Source link not found | `NOT_FOUND` |
| Provider connection reauth required | `CONNECTION_REAUTH_REQUIRED` |
| Duplicate source link | `CONFLICT` |

---

## 12. Data Rules

- Records contain only normalized metadata.
- External source links store provider URL, ID, display name, type, status.
- Raw provider content, tokens, cursors, and secret data are never returned.
- `external_sources` show only safe projections.

---

## 13. Change Log

| Version | Date | Summary |
|---|---|---|
| 1.0 | 2026-08-23 | Created Connected Content API specification. |
