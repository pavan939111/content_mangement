# Remote Config API

**Version:** 1.0  
**Date:** 2026-08-23  
**Status:** Ready for Development  
**Related:** v2/api/openapi/creatoros-public.openapi.yaml  

---

## 1. Purpose

This document defines the public Remote Config API.

Remote config controls runtime product behavior:

- Provider capability matrix
- Search limits
- Publishing rules
- Feature flags
- Kill switches

It is signed and cached on-device. It is never a security boundary.

---

## 2. Endpoint

| Method | Path | Purpose |
|---|---|---|
| GET | `/v1/config` | Fetch signed remote configuration |

---

## 3. Request

```http
GET /v1/config?platform=ios&app_version=1.0.0&build=123
Authorization: Bearer <supabase-access-token>
```

---

## 4. Response

```json
{
  "config_version": "2026-08-23.1",
  "issued_at": "2026-08-23T10:00:00Z",
  "soft_expires_at": "2026-08-24T10:00:00Z",
  "hard_expires_at": "2026-09-06T10:00:00Z",
  "payload": {
    "capabilities": {
      "google_drive": {
        "search": true,
        "attach": true,
        "open": true
      },
      "notion": {
        "search": true,
        "attach": true,
        "open": true
      }
    },
    "limits": {
      "search_page_size": 50,
      "connected_sources_free": 2,
      "connected_sources_solo": 5
    },
    "flags": {
      "webhooks_enabled": false
    }
  },
  "signature": "base64-ed25519-signature"
}
```

---

## 5. Client Behavior

1. Fetch config on app launch and foreground resume.
2. Verify Ed25519 signature using embedded public key.
3. Validate schema, `config_version`, and timestamps.
4. Store only signature-verified configs in encrypted local storage.
5. Use cached config when offline.

---

## 6. Fallback Rules

| Situation | Behavior |
|---|---|
| Valid cached config, online | Use cache; refresh opportunistically |
| Valid cached config, offline | Use cache |
| Cache soft-expired | Use cache; refresh on foreground |
| Cache hard-expired | Revert safe defaults for risky features |
| Invalid signature | Reject config; use last valid cache |
| No cached config, offline | Use embedded defaults |

---

## 7. Rule: Config Is Not Authorization

- Config can hide or disable mobile actions.
- Backend always enforces actual authorization, quotas, and provider capabilities.
- A modified client cannot gain access to server-side features.
- Config never contains provider tokens, secrets, user data, or private URLs.

---

## 8. Change Log

| Version | Date | Summary |
|---|---|---|
| 1.0 | 2026-08-23 | Created Remote Config API specification. |
