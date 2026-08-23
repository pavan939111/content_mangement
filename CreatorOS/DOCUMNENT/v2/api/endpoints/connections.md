# Connections API

**Version:** 1.0  
**Date:** 2026-08-23  
**Status:** Ready for Development  
**Related:** v2/api/openapi/creatoros-public.openapi.yaml  

---

## 1. Purpose

This document defines the public Connections API used by the mobile app.

A connection is a user-authorized provider account link in a workspace.

Rule:

> A connection is never just a provider name. It is `workspace + provider + provider_account_id`.

---

## 2. Endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/v1/connections` | List connected accounts |
| GET | `/v1/connections/{connectionId}` | Get connection detail |
| GET | `/v1/connections/{connectionId}/health` | Get health state |
| POST | `/v1/connections/oauth/start` | Start OAuth flow |
| GET | `/v1/connections/oauth/transactions/{transactionId}` | Check OAuth result |
| POST | `/v1/connections/{connectionId}:reauthorize` | Reauthorize provider |
| POST | `/v1/connections/{connectionId}:sync` | Request manual sync |
| DELETE | `/v1/connections/{connectionId}` | Disconnect provider |

---

## 3. List Connections

Request:

```http
GET /v1/connections
Authorization: Bearer <supabase-access-token>
```

Response `200 OK`:

```json
{
  "data": [
    {
      "id": "con_01JQKAB9F3RFFHPE4SZVWE1S7W",
      "provider": "google_drive",
      "provider_account_label": "creator@studio.example",
      "status": "healthy",
      "capabilities": {
        "drive_metadata_search": true,
        "calendar_read": true
      },
      "last_sync_at": "2026-08-23T09:18:41Z"
    }
  ],
  "page": {
    "next_cursor": null,
    "has_more": false
  }
}
```

---

## 4. Get Connection Detail

Request:

```http
GET /v1/connections/con_01JQKAB9F3RFFHPE4SZVWE1S7W
Authorization: Bearer <supabase-access-token>
```

Response:

```json
{
  "id": "con_01JQKAB9F3RFFHPE4SZVWE1S7W",
  "provider": "google_drive",
  "provider_account_label": "creator@studio.example",
  "scopes": [
    "https://www.googleapis.com/auth/drive.metadata.readonly"
  ],
  "status": "healthy",
  "capabilities": {
    "drive_metadata_search": true
  },
  "last_sync_at": "2026-08-23T09:18:41Z",
  "reauthorize_required_at": null
}
```

Mobile never receives refresh tokens, access tokens, provider cursors, or raw provider diagnostics.

---

## 5. Get Connection Health

Request:

```http
GET /v1/connections/con_01JQKAB9F3RFFHPE4SZVWE1S7W/health
Authorization: Bearer <supabase-access-token>
```

Response:

```json
{
  "connection_id": "con_01JQKAB9F3RFFHPE4SZVWE1S7W",
  "state": "healthy",
  "last_success": "2026-08-23T09:18:41Z",
  "last_attempt": "2026-08-23T09:18:41Z",
  "error_message": null,
  "affected_records_count": 12
}
```

---

## 6. Request Manual Sync

Request:

```http
POST /v1/connections/con_01JQKAB9F3RFFHPE4SZVWE1S7W:sync
Authorization: Bearer <supabase-access-token>
Idempotency-Key: uuid
```

Response `202 Accepted`:

```json
{
  "operation": {
    "id": "op_01JQH0D6M97QF6QGC0XRJA9PD2",
    "type": "connection_sync",
    "status": "queued"
  }
}
```

Sync is asynchronous and durable.

---

## 7. Disconnect Connection

Request:

```http
DELETE /v1/connections/con_01JQKAB9F3RFFHPE4SZVWE1S7W
Authorization: Bearer <supabase-access-token>
Idempotency-Key: uuid
```

Response `202 Accepted`:

```json
{
  "operation": {
    "id": "op_01JQH0D6M97QF6QGC0XRJA9PD2",
    "type": "connection_disconnect",
    "status": "queued"
  }
}
```

On disconnect:

- Queue provider revocation best effort.
- Delete token vault row.
- Mark connection `disconnected`.
- Mobile does not receive provider token details.

---

## 8. Error Cases

| Error | Public Code |
|---|---|
| Invalid provider | `VALIDATION_FAILED` |
| Plan limit reached | `CONNECTION_LIMIT_REACHED` |
| Not found | `NOT_FOUND` |
| Reauth required | `CONNECTION_REAUTH_REQUIRED` |
| Provider already connected | `PROVIDER_ACCOUNT_ALREADY_CONNECTED` |

---

## 9. Change Log

| Version | Date | Summary |
|---|---|---|
| 1.0 | 2026-08-23 | Created Connections API specification. |
