# API Error Handling

**Version:** 1.0  
**Date:** 2026-08-23  
**Status:** Ready for Development  
**Related:** v2/api/openapi/creatoros-public.openapi.yaml  

---

## 1. Purpose

This document defines the standard error model for all CreatorOS public APIs.

The goal is:

- One consistent error envelope.
- Safe, actionable messages for mobile users.
- No leakage of provider internals, tokens, SQL, stack traces, or raw API failures.
- Reliable retry classification for mobile and backend.

---

## 2. Error Envelope

All non-2xx responses use:

```json
{
  "error": {
    "code": "RATE_LIMITED",
    "message": "Too many search requests. Try again shortly.",
    "retryable": true,
    "retry_after_seconds": 20,
    "action": "retry_later",
    "connection_id": null,
    "details": [],
    "request_id": "req_01JQH2KVH80PAKZGYAT3V58AN6"
  }
}
```

### Fields

| Field | Type | Description |
|---|---|---|
| `code` | string | Stable machine-readable error code |
| `message` | string | User-safe message |
| `retryable` | boolean | Whether the client may retry |
| `retry_after_seconds` | integer/null | Backoff guidance |
| `action` | string/null | Suggested mobile action |
| `connection_id` | string/null | Related connection when applicable |
| `details` | array | Field-level details where useful |
| `request_id` | string | Correlation ID for support |

---

## 3. Public Error Codes

| HTTP | Code | Retryable | Mobile behavior |
|---|---|---|---|
| 400 | `VALIDATION_FAILED` | false | Highlight invalid fields |
| 400 | `IDEMPOTENCY_KEY_REQUIRED` | false | Add key and retry once |
| 400 | `INVALID_CURSOR` | true | Restart search |
| 401 | `UNAUTHENTICATED` | true | Refresh Supabase session once |
| 403 | `FORBIDDEN` | false | Hide/explain access |
| 404 | `NOT_FOUND` | false | Remove stale local entity |
| 409 | `CONFLICT` | true | Refresh and resolve |
| 409 | `IDEMPOTENCY_KEY_REUSED` | false | Reuse original body or report |
| 422 | `CONNECTION_REAUTH_REQUIRED` | false | Start reconnect flow |
| 429 | `RATE_LIMITED` | true | Respect Retry-After |
| 503 | `PROVIDER_UNAVAILABLE` | true | Show delayed status |
| 504 | `OPERATION_TIMED_OUT` | true | Poll operation later |

Additional provider-related codes:

| Code | Meaning |
|---|---|
| `PROVIDER_CONSENT_DENIED` | User denied provider OAuth |
| `OAUTH_TRANSACTION_EXPIRED` | OAuth transaction timed out |
| `OAUTH_STATE_INVALID` | OAuth state is invalid/consumed |
| `PROVIDER_ACCOUNT_ALREADY_CONNECTED` | Duplicate provider account |
| `CONNECTION_LIMIT_REACHED` | Plan limit reached |

---

## 4. Validation Details

For `VALIDATION_FAILED`, include field-specific details:

```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Some fields need attention.",
    "retryable": false,
    "request_id": "req_01JQ...",
    "details": [
      {
        "field": "query",
        "reason": "too_short",
        "minimum_length": 2
      }
    ]
  }
}
```

---

## 5. Provider Error Mapping

Provider-specific errors are normalized inside the connector worker. Mobile never sees:

- Google/Notion error bodies
- OAuth token reasons
- Rate-limit internals
- Stack traces
- SQL messages

Example worker mapping:

| Provider result | Public code |
|---|---|
| Token revoked/invalid_grant | `CONNECTION_REAUTH_REQUIRED` |
| 429 rate_limited | `RATE_LIMITED` |
| 403 permission missing | `FORBIDDEN` |
| 404 object missing | `NOT_FOUND` |
| 5xx / timeout | `PROVIDER_UNAVAILABLE` |
| Invalid input | `VALIDATION_FAILED` |

---

## 6. Logging and Correlation

- Every error includes a `request_id`.
- Backend stores sanitized diagnostics linked to `request_id`.
- Logs never contain raw provider payloads, tokens, or content.
- Support can retrieve provider-safe details internally.

---

## 7. Change Log

| Version | Date | Summary |
|---|---|---|
| 1.0 | 2026-08-23 | Created API error handling specification. |
