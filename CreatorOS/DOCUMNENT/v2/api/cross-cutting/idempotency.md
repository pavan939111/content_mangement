# API Idempotency

**Version:** 1.0  
**Date:** 2026-08-23  
**Status:** Ready for Development  
**Related:** v2/api/openapi/creatoros-public.openapi.yaml  

---

## 1. Purpose

This document defines idempotency rules for CreatorOS public APIs.

Mobile networks are unreliable. The app may retry after timeouts, app suspension, airplane mode, process death, or user action.

Idempotency must prevent duplicate records, duplicate provider actions, and duplicate billing events.

---

## 2. Which Requests Require Idempotency-Key

All mutating requests must include an `Idempotency-Key` header.

This includes:

- `POST /v1/connections/oauth/start`
- `POST /v1/connections/{id}:reauthorize`
- `POST /v1/connections/{id}:sync`
- `DELETE /v1/connections/{id}`
- `POST /v1/connected-content`
- `PATCH /v1/connected-content/{id}`
- `DELETE /v1/connected-content/{id}`
- `POST /v1/connected-content/{id}/links`
- `POST /v1/connected-content/{id}/delivery`
- `POST /v1/search:refresh`
- `POST /v1/operations/{id}:cancel`
- Any future billing or plan mutation

GET requests must not require idempotency keys.

---

## 3. Key Requirements

| Rule | Requirement |
|---|---|
| Format | UUIDv4 or cryptographically secure random string ≥128 bits |
| Scope | User + workspace + method + route template |
| Generation | Client generates once when the user confirms intent |
| Persistence | Client persists key with pending local command |
| Reuse | Same key + same request returns original result |
| Conflict | Same key + different request returns `409 IDEMPOTENCY_KEY_REUSED` |
| Missing key | Required endpoint returns `400 IDEMPOTENCY_KEY_REQUIRED` |
| Retention | 24–72 hours; longer for billing/provider actions |

---

## 4. Request Hash

Backend computes:

```text
SHA256(
  workspace_id + "\n" +
  method + "\n" +
  route_template + "\n" +
  canonical_json(normalized_request_body)
)
```

Volatile headers such as Date, User-Agent, tracing IDs, and JWT are excluded.

If the same key arrives with a different request hash, the backend returns:

```json
{
  "error": {
    "code": "IDEMPOTENCY_KEY_REUSED",
    "message": "This key was already used with a different request.",
    "retryable": false,
    "request_id": "req_01JQP7AATQHGT688MX9F6W8V7M"
  }
}
```

---

## 5. Replay Behavior

### Same key, same request after ambiguous timeout

```http
HTTP/1.1 202 Accepted
Idempotent-Replay: true
Location: /v1/operations/op_01JQP4YF8PB00TPED8B7F25Q9J
```

Response returns the original operation and receipt.

---

## 6. Server-Side Storage

Use a dedicated table:

```sql
create table api_idempotency_keys (
  id bigserial primary key,
  workspace_id uuid not null,
  actor_user_id uuid not null,
  method text not null,
  route_template text not null,
  idempotency_key text not null,
  request_hash text not null,
  response_status integer,
  response_body jsonb,
  operation_id text,
  receipt_id text,
  state text not null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  unique (workspace_id, actor_user_id, method, route_template, idempotency_key)
);
```

---

## 7. Concurrent Requests

Two simultaneous requests with the same key must not create duplicate work.

Backend must:

- Claim the key atomically inside a database transaction.
- Let the winning request proceed.
- Return the in-progress operation to the losing request.
- Never create two receipts or two provider actions.

---

## 8. Mobile Client Rules

- Generate the key at user intent, not at retry time.
- Persist pending command locally before network call.
- Reuse key after app kill, timeout, backgrounding, and explicit retry.
- After ambiguous failure, fetch operation/receipt before offering retry.
- Never directly retry Google/Notion provider writes from the app.
- Never use timestamp, random ID per retry, or device clock as the key.

---

## 9. Example Pending Command

```ts
type PendingCommand = {
  localId: string;
  idempotencyKey: string;
  request: HandoffRequest;
  createdAt: string;
  retryCount: number;
};
```

When retrying, use the same `idempotencyKey`.

---

## 10. Change Log

| Version | Date | Summary |
|---|---|---|
| 1.0 | 2026-08-23 | Created API idempotency specification. |
