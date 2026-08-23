# Delivery Links API

**Version:** 1.0  
**Date:** 2026-08-23  
**Status:** Ready for Development  
**Related:** v2/api/openapi/creatoros-public.openapi.yaml  

---

## 1. Purpose

This document defines the public Delivery Links API.

A delivery link is a short-lived public shareable view for client review or delivery confirmation.

It displays only intended delivery metadata. It never exposes internal notes, other connected records, tokens, or provider secrets.

---

## 2. Endpoints

| Method | Path | Purpose |
|---|---|---|
| POST | `/v1/connected-content/{recordId}/delivery-link` | Create a public delivery link |
| DELETE | `/v1/connected-content/{recordId}/delivery-link` | Revoke the link |

---

## 3. Create Delivery Link

Request:

```http
POST /v1/connected-content/rec_01JQ.../delivery-link
Authorization: Bearer <supabase-access-token>
Idempotency-Key: uuid
Content-Type: application/json
```

```json
{
  "expires_at": "2026-09-23T10:00:00Z",
  "note": "For client review only"
}
```

Response `201 Created`:

```json
{
  "public_url": "https://app.creatoros.app/d/rec_01JQ.../token_abc",
  "expires_at": "2026-09-23T10:00:00Z",
  "created_at": "2026-08-23T10:20:00Z"
}
```

---

## 4. Public Delivery View

The public URL opens a read-only view containing only:

- Title
- Brand/campaign if intentionally shared
- Delivery note
- Delivery URL if provided
- Expiry information

The view does not expose:

- Internal notes
- Other connected content records
- Connection names or account labels
- Action receipts
- Provider tokens or raw metadata
- Source URLs except the final delivery URL

---

## 5. Revoke Delivery Link

Request:

```http
DELETE /v1/connected-content/rec_01JQ.../delivery-link
Authorization: Bearer <supabase-access-token>
Idempotency-Key: uuid
```

Response `200 OK`:

```json
{
  "revoked": true,
  "record_id": "rec_01JQ...",
  "revoked_at": "2026-08-23T10:25:00Z"
}
```

After revocation, the public URL immediately returns `404` or a revoked notice.

---

## 6. Token and Expiry Rules

- Tokens are unguessable and short-lived by default.
- Tokens are 256-bit cryptographically secure random values, generated server-side using a CSPRNG (e.g., `crypto.randomBytes(32)`).
- The public URL embeds the raw token; the database stores only a SHA-256 hash of the token. Lookup is by hash comparison.
- Default expiry: 30 days, configurable.
- Expired links return `410 Gone`.
- Revoked links return `404`.
- Access logs are privacy-minimized.

### Rate Limiting

Public delivery view endpoints are rate limited independently of authenticated API endpoints:

| Scope | Limit | Window |
|---|---|---|
| Per IP address | 30 requests/minute | Sliding window |
| Per token hash | 60 requests/hour | Sliding window |

Exceeding limits returns `429 Too Many Requests` with a standard `Retry-After` header.
Rate limiting is enforced at the edge/gateway level before the application processes the request.

---

## 7. Error Cases

| Error | Public Code |
|---|---|
| Record not found | `NOT_FOUND` |
| Link already exists | `CONFLICT` |
| Invalid expiry | `VALIDATION_FAILED` |
| Link revoked | `NOT_FOUND` |
| Link expired | `GONE` |

---

## 8. Change Log

| Version | Date | Summary |
|---|---|---|
| 1.0 | 2026-08-23 | Created Delivery Links API specification. |
