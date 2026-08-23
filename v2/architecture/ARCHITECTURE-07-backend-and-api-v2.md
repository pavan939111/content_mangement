# Technical Architecture Document — ARCHITECTURE-07 v2: Backend & API

**Product:** CreatorOS v2  
**Version:** 2.0  
**Status:** Draft for Validation  
**Date:** 2026-08-23  
**Related PRD:** v2/creator_os_prd_v2.md  
**Reference to v1:** ../../../docs/architecture/ARCHITECTURE-07-backend-and-api.md

---

## 1. Purpose

This document defines the **v2 backend and API architecture** for CreatorOS.

It does not repeat v1 backend details that remain valid. Stable v1 services are referenced. The new backend role is the **cloud integration plane**: it hosts OAuth token handling, connector adapters, job queues, webhooks, rate limiting, and normalized search indexing.

---

## 2. Reference to v1 Stable Backend Services

The following v1 backend services remain valid:

- Remote Config Service: v1 ARCH-07 §5
- Account Service: v1 ARCH-07 §9
- Error format and API standards: v1 ARCH-07 §4
- Deployment environment strategy: v1 ARCH-09

Where v2 changes behavior, the new services below supersede v1.

---

## 3. New Backend Services

| Service | Responsibility |
|---|---|
| Connector Gateway | Receives mobile connector actions, validates tokens, routes to provider adapters. |
| OAuth Token Vault | Stores encrypted provider refresh tokens; never exposes tokens to mobile. |
| Provider Adapter | Implements connector-specific search, read, link, and action logic. |
| Connector Registry | Maintains connector metadata, capability matrix, rate limits, scopes. |
| Job Queue | Durable queue for sync, retries, webhooks, and background provider calls. |
| Rate-Limit Scheduler | Centralized per-provider/per-account rate-limit enforcement. |
| Webhook Ingestion | Receives provider webhooks, normalizes events, triggers incremental sync. |
| Normalized Index Service | Stores searchable metadata from connected sources for fast retrieval. |
| Operation/Audit Log | Append-only log of provider operations and receipt data. |

---

## 4. API Design

### 4.1 General

- RESTful JSON over HTTPS.
- TLS 1.2+.
- OAuth 2.0 Bearer for authenticated mobile endpoints.
- Idempotency-Key header for all mutating requests.
- Versioned base path: `/v2/`.

### 4.2 Key Endpoints

| Endpoint | Purpose |
|---|---|
| `POST /v2/connectors` | Connect a new external account. |
| `DELETE /v2/connectors/{id}` | Disconnect an account. |
| `GET /v2/connectors/{id}/health` | Get connection health. |
| `POST /v2/connectors/{id}/search` | Execute provider search. |
| `POST /v2/records` | Create connected content record metadata. |
| `GET /v2/records/{id}` | Get record with source links and receipts. |
| `POST /v2/records/{id}/links` | Attach external source link. |
| `POST /v2/actions` | Create a connector action/job. |
| `GET /v2/actions/{id}` | Get action state. |
| `POST /v2/webhooks/{provider}` | Provider webhook ingestion. |

---

## 5. Connector Execution Flow

```text
Mobile App
  → persists intent locally
  → calls Connector Gateway
        ↓
Gateway authenticates + selects Provider Adapter
        ↓
Adapter checks Rate-Limit Scheduler
        ↓
Adapter calls external provider API
        ↓
Result normalized
        ↓
Operation/Audit Log updated
        ↓
Response to mobile + push notification if background
```

---

## 6. OAuth Token Vault

- Tokens encrypted with cloud KMS or equivalent.
- Mobile app never stores provider refresh tokens for backend-managed actions.
- Device-only OAuth may store tokens in Keychain/Keystore for direct mobile provider calls.
- Token refresh occurs server-side when possible.
- Token revoke is immediate on disconnect.

---

## 7. Job Queue and Retries

| Requirement | Behavior |
|---|---|
| Queue type | Durable, provider-isolated |
| Idempotency | All jobs carry a stable `operation_id`. |
| Retry policy | Exponential backoff with jitter; respect provider retry headers. |
| Non-retryable | `auth_expired`, `permission_missing`, `invalid_input`, `provider_quota_exhausted`. |
| Timeout | Provider call timeout ≤30 s unless provider performs async processing. |
| DLQ | Failed jobs move to dead-letter queue for manual inspection after retry exhaustion. |

---

## 8. Webhook Ingestion

- Providers that support webhooks: Google Drive, Google Calendar, Notion (Phase 2).
- Webhooks map external changes to connector accounts.
- Ingestion normalized to events: `created`, `updated`, `deleted`, `permission_changed`, `auth_revoked`.
- Events update connector health and trigger incremental sync.

---

## 9. Rate-Limit Scheduler

- Centralized per-provider and per-account buckets.
- Uses provider-specific quotas from Remote Config.
- Returns user-safe rate-limit state to mobile.
- Prevents concurrent mobile devices from exceeding quota.

---

## 10. Security

- All provider secrets server-side only.
- Backend endpoints require CreatorOS account auth.
- CSRF-safe for OAuth callbacks.
- Audit log stores operation metadata, never user content.
- Connector tokens encrypted and never logged.

---

## 11. Observability

- Metrics: action success rate, connector health, job latency, retry rate, webhook lag.
- Dashboards per provider and global.
- Alerts on connector failure spikes or auth revocation events.
- Privacy-safe logs only.

---

## 12. MVP Boundaries

### Included

- Connector Gateway, OAuth Token Vault, Provider Adapters for Google Drive/Docs/Calendar/Notion.
- Job queue with idempotency.
- Rate-limit scheduler.
- Webhook ingestion is Phase 2.
- Normalized index for external search.

### Excluded

- Social publishing job queues.
- Analytics pipeline.
- Collaboration/review backend.
- MCP server hosting (optional future, not MVP).

---

## 13. Change Log

| Version | Date | Summary |
|---|---|---|
| 2.0 | 2026-08-23 | New v2 backend & API architecture. References v1 for config and account services. |
