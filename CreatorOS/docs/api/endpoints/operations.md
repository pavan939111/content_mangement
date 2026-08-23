# Operations API

**Version:** 1.0  
**Date:** 2026-08-23  
**Status:** Ready for Development  
**Related:** v2/api/openapi/creatoros-public.openapi.yaml  

---

## 1. Purpose

This document defines the public Operations API.

An operation is a durable asynchronous unit of work initiated by the mobile app.

Long-running provider actions do not block HTTP requests. The backend returns `202 Accepted` and the mobile app polls the operation.

---

## 2. Endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/v1/operations/{operationId}` | Get operation state |
| POST | `/v1/operations/{operationId}:cancel` | Cancel a cancellable operation |

---

## 3. Operation Object

```json
{
  "id": "op_01JQH0D6M97QF6QGC0XRJA9PD2",
  "type": "connection_sync",
  "status": "running",
  "created_at": "2026-08-23T09:32:10Z",
  "completed_at": null,
  "receipt_id": "rcp_01JQH0D6...",
  "error": null
}
```

### Fields

| Field | Description |
|---|---|
| `id` | Unique operation ID |
| `type` | `connection_sync`, `content_handoff`, `connected_content_delete`, `source_link_remove`, `connection_disconnect`, `search_refresh` |
| `status` | `queued`, `running`, `succeeded`, `failed`, `cancelled` |
| `created_at` | Creation timestamp |
| `completed_at` | Completion timestamp |
| `receipt_id` | Related action receipt where applicable |
| `error` | Safe error envelope |

---

## 4. Get Operation

Request:

```http
GET /v1/operations/op_01JQH0D6M97QF6QGC0XRJA9PD2
Authorization: Bearer <supabase-access-token>
```

Response `200 OK`:

```json
{
  "id": "op_01JQH0D6M97QF6QGC0XRJA9PD2",
  "type": "content_handoff",
  "status": "succeeded",
  "created_at": "2026-08-23T09:32:10Z",
  "completed_at": "2026-08-23T09:32:42Z",
  "receipt_id": "rcp_01JQH0D6...",
  "error": null
}
```

---

## 5. Failed Operation

Response `200 OK`:

```json
{
  "id": "op_01JQH0D6M97QF6QGC0XRJA9PD2",
  "type": "content_handoff",
  "status": "failed",
  "created_at": "2026-08-23T09:32:10Z",
  "completed_at": "2026-08-23T09:32:42Z",
  "receipt_id": "rcp_01JQH0D6...",
  "error": {
    "code": "CONNECTION_REAUTH_REQUIRED",
    "message": "Reconnect Notion to complete this handoff.",
    "retryable": false,
    "action": "reauthenticate",
    "connection_id": "con_01JQGXMJQ3T7SQ9VK6WBPHH2G1",
    "request_id": "req_01JQH0..."
  }
}
```

The mobile app must render the safe `message` and `action`, never raw provider errors.

---

## 6. Cancel Operation

Only operations with status `queued` or `retry_scheduled` can be cancelled.

Request:

```http
POST /v1/operations/op_01JQH0D6...:cancel
Authorization: Bearer <supabase-access-token>
Idempotency-Key: uuid
```

Response `200 OK`:

```json
{
  "id": "op_01JQH0D6...",
  "status": "cancelled",
  "completed_at": "2026-08-23T09:35:00Z"
}
```

Cancellation is best effort. If the provider work already began and cannot be cancelled, the backend returns:

```json
{
  "error": {
    "code": "OPERATION_NOT_CANCELLABLE",
    "message": "This action has already started and cannot be cancelled.",
    "retryable": false,
    "request_id": "req_01JQ..."
  }
}
```

---

## 7. Polling Behavior

Recommended mobile polling:

- Initial poll after 2 seconds
- Then 5, 10, 20, 30 seconds
- If status remains `queued` or `running`, stop after 5 minutes and show deferred status
- Refresh when app returns to foreground
- Always reconcile by operation ID, never create a new operation on retry

---

## 8. Idempotency

When the mobile app retries the same command with the same `Idempotency-Key`, the backend returns the original operation:

```http
HTTP/1.1 202 Accepted
Idempotent-Replay: true
Location: /v1/operations/op_01JQH0D6M97QF6QGC0XRJA9PD2
```

The mobile app should then poll that operation.

---

## 9. Error Cases

| Error | Public Code |
|---|---|
| Operation not found | `NOT_FOUND` |
| Cancellation not possible | `OPERATION_NOT_CANCELLABLE` |
| Reauthorization required | `CONNECTION_REAUTH_REQUIRED` |
| Provider unavailable | `PROVIDER_UNAVAILABLE` |
| Rate limited | `RATE_LIMITED` |

---

## 10. Data Rules

- Operations never expose provider cursors, raw payloads, or internal queue IDs.
- Operation errors are normalized and user-safe.
- Receipt remains immutable even if operation cancels.

---

## 11. Change Log

| Version | Date | Summary |
|---|---|---|
| 1.0 | 2026-08-23 | Created Operations API specification. |
