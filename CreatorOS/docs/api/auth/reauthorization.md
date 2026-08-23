# Provider Reauthorization

**Version:** 1.0  
**Date:** 2026-08-23  
**Status:** Ready for Development  
**Related:** v2/api/auth/oauth-flows.md, v2/api/auth/token-vault.md  

---

## 1. Purpose

This document defines how CreatorOS handles expired, revoked, or insufficient provider access.

Core rule:

> Reauthorization is a new OAuth transaction bound to an existing connection. It never silently replaces an account.

---

## 2. When Reauthorization Is Required

| Condition | Connection State | User Action |
|---|---|---|
| Provider refresh token invalid | `reauth_required` | Reconnect provider |
| User revoked CreatorOS access | `reauth_required` | Reconnect or disconnect |
| Required scope missing | `reauth_required` | Grant additional access |
| Provider account deleted | `revoked` | Choose new account or disconnect |
| Google app unverified / token expired | `reauth_required` | Reconnect after verification |

---

## 3. Endpoint

```http
POST /v1/connections/{connectionId}:reauthorize
Authorization: Bearer <supabase-access-token>
Idempotency-Key: 9f7b557c-e7c8-4a8f-835a-b5321b4f6e84
Content-Type: application/json
```

Request:

```json
{
  "requested_capabilities": [
    "drive_metadata_search",
    "calendar_read"
  ]
}
```

Response `201 Created`:

```json
{
  "transaction_id": "oat_01JQKCN9R7HEA13YGAM3ZB63G1",
  "provider": "google_drive",
  "mode": "reauthorize",
  "authorization_url": "https://accounts.google.com/o/oauth2/v2/auth?...",
  "expires_at": "2026-08-23T09:30:00Z"
}
```

---

## 4. Backend Flow

1. Validate JWT and workspace access.
2. Load the existing `connection_id`.
3. Confirm the connection is owned by the current workspace.
4. Create a short-lived OAuth transaction bound to that connection.
5. Return authorization URL.

Callback success:

1. Exchange code server-side.
2. Retrieve provider account identity.
3. Compare account identity to the existing connection.

### Account matches

- Update scopes and token vault.
- Clear `reauthorize_required_at`.
- Set status `healthy`.
- Enqueue delta sync.

### Account differs

Do not silently replace.

Return a choice:

- Reauthorize same account.
- Create a separate connection.
- Disconnect old connection and replace.

---

## 5. User-Visible States

| State | Message |
|---|---|
| `reauth_required` | “Reconnect Google Drive to continue.” |
| `revoked` | “Access was removed. Reconnect or disconnect.” |
| `reauth_required` for missing scope | “Grant calendar access to use this action.” |
| `reauthorizing` | “Completing Google authorization…” |

---

## 6. Rules

- Never use the same OAuth transaction twice.
- Never replace provider account automatically.
- Always preserve action receipts and connection identity.
- Always require explicit user confirmation for account replacement.
- Do not reset connection metadata on scope-only reauthorization.

---

## 7. Change Log

| Version | Date | Summary |
|---|---|---|
| 1.0 | 2026-08-23 | Created provider reauthorization specification. |
