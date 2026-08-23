# Action Receipts API

**Version:** 1.0  
**Date:** 2026-08-23  
**Status:** Ready for Development  
**Related:** v2/api/openapi/creatoros-public.openapi.yaml  

---

## 1. Purpose

This document defines the public Action Receipts API.

An action receipt is an immutable, append-only record of a handoff, provider action, status change, or delivery event.

The receipt is the user-visible source of truth for what happened and what remains.

---

## 2. Endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/v1/action-receipts/{receiptId}` | Get one receipt |
| GET | `/v1/connected-content/{recordId}/receipts` | List receipts for a record |
| POST | `/v1/connected-content/{recordId}/receipts/{receiptId}/annotation` | Add a note to a receipt |

---

## 3. Action Receipt Object

```json
{
  "id": "rcp_01JQH0D6...",
  "record_id": "rec_01JQZ57PQB3VT8QZASQ3XKDV8S",
  "operation_id": "op_01JQH0D6...",
  "action_type": "opened",
  "target_provider": "canva",
  "target_object": "Design A",
  "timestamp": "2026-08-23T10:12:00Z",
  "initiator": "user",
  "outcome": "opened",
  "evidence": "canva://design/...",
  "annotation": null
}
```

### Fields

| Field | Description |
|---|---|
| `id` | Unique receipt ID |
| `record_id` | Owning connected content record |
| `operation_id` | Related operation if async |
| `action_type` | `opened`, `shared`, `copied`, `linked`, `marked_delivered`, `failed` |
| `target_provider` | Provider or handoff target |
| `target_object` | Safe object identifier |
| `timestamp` | Event time |
| `initiator` | `user`, `backend`, `system` |
| `outcome` | Verified or user-confirmed outcome |
| `evidence` | Safe URL, file reference, or excerpt |
| `annotation` | Optional post-creation note |

---

## 4. List Receipts for a Record

Request:

```http
GET /v1/connected-content/rec_01JQ.../receipts?limit=25&cursor=opaque
Authorization: Bearer <supabase-access-token>
```

Response:

```json
{
  "data": [
    {
      "id": "rcp_01JQH0D6...",
      "action_type": "opened",
      "target_provider": "canva",
      "target_object": "Design A",
      "timestamp": "2026-08-23T10:12:00Z",
      "initiator": "user",
      "outcome": "opened",
      "evidence": "canva://design/...",
      "annotation": null
    }
  ],
  "page": {
    "next_cursor": null,
    "has_more": false
  }
}
```

---

## 5. Get One Receipt

Request:

```http
GET /v1/action-receipts/rcp_01JQH0D6...
Authorization: Bearer <supabase-access-token>
```

Response:

```json
{
  "id": "rcp_01JQH0D6...",
  "record_id": "rec_01JQ...",
  "action_type": "marked_delivered",
  "target_provider": null,
  "target_object": null,
  "timestamp": "2026-08-23T10:15:00Z",
  "initiator": "user",
  "outcome": "marked_delivered",
  "evidence": "https://drive.google.com/drive/folders/...",
  "annotation": "Client approved final folder"
}
```

---

## 6. Add Annotation

Annotations are the only allowed addition after receipt creation. The original receipt fields are immutable.

Request:

```http
POST /v1/connected-content/rec_01JQ.../receipts/rcp_01JQ.../annotation
Authorization: Bearer <supabase-access-token>
Content-Type: application/json
```

```json
{
  "annotation": "Client approved this version in chat."
}
```

Response `200 OK`:

```json
{
  "id": "rcp_01JQ...",
  "annotation": "Client approved this version in chat."
}
```

---

## 7. Immutability Rules

- Receipts cannot be updated or deleted after creation.
- Only annotations may be added.
- Modifying the original receipt fields is not allowed.
- Users may archive or hide receipts, but the data remains.
- Backend operation log never stores raw user content.

---

## 8. Outcome Types

| Outcome | Meaning |
|---|---|
| `opened` | External app or link opened; completion not verified |
| `shared` | Content shared via OS share sheet |
| `copied` | Caption or link copied |
| `linked` | External source attached to record |
| `marked_delivered` | User confirmed delivery |
| `failed` | Action failed with safe error |
| `needs_attention` | Action requires user action |

For provider-confirmed outcomes, include provider reference when available.

For non-verifiable outcomes like `opened`, do not claim provider success.

---

## 9. Error Cases

| Error | Public Code |
|---|---|
| Receipt not found | `NOT_FOUND` |
| Record not found | `NOT_FOUND` |
| Missing annotation body | `VALIDATION_FAILED` |
| Modify immutable fields | `FORBIDDEN` |

---

## 10. Data Rules

- Evidence may contain safe URLs or excerpts, never tokens or raw provider payloads.
- Receipts are encrypted at rest where they include user content.
- Receipts are append-only at the database level.

---

## 11. Change Log

| Version | Date | Summary |
|---|---|---|
| 1.0 | 2026-08-23 | Created Action Receipts API specification. |
