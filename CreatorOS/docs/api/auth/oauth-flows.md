# OAuth Connection Flows

**Version:** 1.0  
**Date:** 2026-08-23  
**Status:** Ready for Development  
**Related:** v2/api/openapi/creatoros-public.openapi.yaml  

---

## 1. Purpose

This document defines the OAuth connection flows for Google Drive, Google Docs, Google Calendar, and Notion.

Key rules:

- Mobile app only initiates a connection.
- Mobile app never receives provider access or refresh tokens.
- The backend owns the OAuth callback and token exchange.
- Authorization Code + PKCE with system browser.
- No embedded WebView for provider authentication.

---

## 2. Endpoints Involved

| Method | Path | Purpose |
|---|---|---|
| POST | `/v1/connections/oauth/start` | Begin provider connection |
| GET | `/v1/oauth/callback/{provider}` | Provider redirects here. Backend only. |
| GET | `/v1/connections/oauth/transactions/{transactionId}` | Mobile checks result |

---

## 3. Prerequisites

Before a user can connect a provider:

- User has a valid CreatorOS session (Supabase JWT).
- The selected provider is enabled for the user's workspace.
- The user has not exceeded the plan's connected-source limit.
- The backend has a server-owned OAuth client for that provider.

---

## 4. Step 1: Start Connection

Request:

```http
POST /v1/connections/oauth/start
Authorization: Bearer <supabase-access-token>
Idempotency-Key: 5f3f518a-71e1-4d20-989f-53c3e6522b3c
Content-Type: application/json
```

```json
{
  "provider": "google_drive",
  "requested_capabilities": [
    "drive_metadata_search",
    "calendar_read"
  ],
  "return_to": "creatoros://connections"
}
```

Backend actions:

1. Validate Supabase JWT.
2. Resolve current user and workspace.
3. Confirm plan allows another connection.
4. Map requested capabilities to provider-specific OAuth scopes.
5. Generate:
   - Opaque `state`
   - PKCE `code_verifier`
   - `code_challenge`
   - Short-lived transaction ID
6. Persist encrypted/verifiable state.
7. Return authorization URL.

Response `201 Created`:

```json
{
  "transaction_id": "oat_01JQKCN9R7HEA13YGAM3ZB63G1",
  "provider": "google_drive",
  "authorization_url": "https://accounts.google.com/o/oauth2/v2/auth?...",
  "expires_at": "2026-08-23T09:30:00Z"
}
```

---

## 5. Step 2: System Browser

Mobile app opens `authorization_url` in:

- iOS: `ASWebAuthenticationSession`
- Android: Chrome Custom Tabs or platform browser

The user approves or denies provider scopes.

**No provider tokens return to the app.**

---

## 6. Step 3: Provider Callback

Google callback:

```http
GET /v1/oauth/callback/google?code=4%2F0AbC...&state=oa_state_...
Host: api.creatoros.app
```

Notion callback:

```http
GET /v1/oauth/callback/notion?code=temporary_code&state=oa_state_...
Host: api.creatoros.app
```

Backend callback handler:

1. Require HTTPS.
2. Look up transaction by hashed `state`.
3. Verify:
   - One-time use
   - Provider matches
   - Not expired
   - Workspace/user binding intact
   - Redirect binding intact
4. Atomically consume transaction.
5. Exchange authorization code server-to-server using PKCE verifier.
6. Retrieve stable provider identity.
7. Create or update `provider_connections` and encrypted token vault record.
8. Enqueue initial sync job.
9. Redirect to app completion link without tokens.

---

## 7. Step 4: Mobile Checks Result

Mobile opens completion link, then calls:

```http
GET /v1/connections/oauth/transactions/oat_01JQKCN9R7HEA13YGAM3ZB63G1
Authorization: Bearer <supabase-access-token>
```

Success response:

```json
{
  "transaction_id": "oat_01JQKCN9R7HEA13YGAM3ZB63G1",
  "status": "succeeded",
  "connection": {
    "id": "con_01JQKAB9F3RFFHPE4SZVWE1S7W",
    "provider": "google_drive",
    "provider_account_label": "creator@studio.example",
    "status": "initial_sync_queued"
  },
  "operation": {
    "id": "op_01JQKD0MW6VD5RHSCG7C5PKE3Z",
    "status": "queued"
  }
}
```

Failure response:

```json
{
  "transaction_id": "oat_01JQKCN9R7HEA13YGAM3ZB63G1",
  "status": "failed",
  "error": {
    "code": "PROVIDER_CONSENT_DENIED",
    "message": "Google access was not granted.",
    "retryable": true,
    "request_id": "req_01JQKDZVA8VCHVVD3HWA6AE99M"
  }
}
```

---

## 8. Transaction States

| State | Meaning |
|---|---|
| `pending` | Waiting for provider callback |
| `succeeded` | Token exchanged, connection created |
| `failed` | Provider denied or exchange failed |
| `expired` | Transaction timed out |

---

## 9. Error Cases

| Error | Public Code | Mobile Behavior |
|---|---|---|
| User denies consent | `PROVIDER_CONSENT_DENIED` | Show retry option |
| Transaction expired | `OAUTH_TRANSACTION_EXPIRED` | Restart flow |
| Unknown state | `OAUTH_STATE_INVALID` | Restart flow |
| Provider account already connected | `PROVIDER_ACCOUNT_ALREADY_CONNECTED` | Show existing connection |
| Plan limit reached | `CONNECTION_LIMIT_REACHED` | Upgrade prompt |

---

## 10. Security Rules

- Never expose `code_verifier`, client secret, or provider tokens to mobile.
- State is one-time and consumed atomically.
- Callback requires HTTPS.
- Token exchange happens only server-side.
- Provider credentials encrypted at rest in the backend vault.
- Provider tokens never stored on the mobile device.

---

## 11. Change Log

| Version | Date | Summary |
|---|---|---|
| 1.0 | 2026-08-23 | Created OAuth connection flows. |
