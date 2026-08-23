# Technical Architecture Document — ARCHITECTURE-15 v2: Backend Connector Service

**Product:** CreatorOS v2  
**Version:** 2.0  
**Status:** Draft for Validation  
**Date:** 2026-08-23  
**Related:** v2/architecture/ARCHITECTURE-07-backend-and-api-v2.md  
**Related:** v2/architecture/ARCHITECTURE-13-connector-architecture-v2.md  
**Related FRS:** v2/requirements/functional/FRS-07-connector-framework-v2.md

---

## 1. Purpose

This document defines the **Backend Connector Service** for CreatorOS v2.

It is the durable execution engine for all provider-facing work that cannot be reliably performed on mobile:

- External tool search
- Scheduled and webhook-triggered sync
- OAuth token refresh and lifecycle
- Rate-limit enforcement
- Provider action execution with retries
- Normalized cross-tool index maintenance
- Action audit and receipt generation

The mobile app remains the command surface; the backend connector service is the execution plane.

---

## 2. Design Principles

1. **Provider isolation** — a failure in one provider does not affect others.
2. **Idempotency first** — every operation has a stable `operation_id`; retries cannot duplicate side effects.
3. **Central rate limiting** — no mobile device can bypass provider quotas.
4. **Durable by default** — jobs persist across crashes, restarts, and retries.
5. **Privacy-safe** — no user content stored in logs; only metadata and operation state.
6. **Rebuildable index** — normalized search index is derived from external sources and can always be rebuilt.
7. **Mobile never holds provider secrets** — tokens are stored in a server-side vault.
8. **Observable** — every job, retry, and failure is measurable and traceable.

> The connector service is designed as the execution layer for both manual MVP actions and future Phase 2 agent-driven plans. The same job queue, idempotency keys, rate-limit scheduler, and operation log will be reused by the agentic command layer.

---

## 3. System Components

```text
Mobile App
   ↓ HTTPS / OAuth
Connector Gateway API
   ↓
OAuth Token Vault ─── Provider Adapter Registry
   ↓                        ↓
Job Queue ───→ Retry Worker ──→ Provider API
   ↓                              ↑
Rate-Limit Scheduler               │
   ↑                              │
Webhook Ingestion ────────────────┘
   ↓
Normalized Index
   ↓
Operation Log
```

---

## 4. Component Responsibilities

### 4.1 Connector Gateway API

- Receives all mobile connector requests.
- Validates CreatorOS account and connector permissions.
- Routes requests to the correct Provider Adapter.
- Returns normalized response or job status.

### 4.2 OAuth Token Vault

- Stores encrypted provider refresh tokens and access tokens.
- Refreshes tokens server-side when required.
- Revokes tokens on disconnect or account deletion.
- Never sends refresh tokens to the mobile app.
- Uses cloud KMS or equivalent for encryption.

### 4.3 Provider Adapter Registry

- Maintains a map of provider ID → adapter implementation.
- Each adapter implements the common Connector Contract.
- Adapters contain provider-specific logic for search, read, attach, open, sync, webhooks, and errors.

### 4.4 Job Queue

- Durable queue with one logical queue per provider.
- Each job contains:
  - `operation_id`
  - `account_id`
  - `provider`
  - `action_type`
  - `input`
  - `created_at`
  - `max_attempts`
  - `state`
- Persisted in a database or managed queue service.

### 4.5 Retry Worker

- Consumes jobs from queues.
- Applies per-provider retry policy.
- Marks jobs as `succeeded`, `failed_retriable`, `failed_non_retriable`, or `needs_user_action`.
- Moves exhausted jobs to Dead Letter Queue.
- Supports graceful shutdown and checkpointing.

### 4.6 Rate-Limit Scheduler

- Central token bucket per provider per account.
- Reads provider rate limits from Remote Config.
- Rejects or delays jobs that would exceed quota.
- Returns user-safe `rate_limited` state with retry time.

### 4.7 Webhook Ingestion

- Exposes signed webhook endpoints per provider.
- Validates provider signatures.
- Normalizes events to CreatorOS event types:
  - `created`
  - `updated`
  - `deleted`
  - `permission_changed`
  - `auth_revoked`
- Enqueues incremental sync jobs instead of executing webhook work immediately.

### 4.8 Normalized Index

- Stores searchable metadata from connected sources.
- Schema:
  - `external_id`
  - `provider`
  - `title`
  - `type`
  - `url`
  - `updated_at`
  - `account_id`
  - `content_hash`
- Used by Cross-Tool Search for fast external results.
- Rebuilt incrementally from sync cursors or on full reauthorization.

### 4.9 Operation Log

- Append-only log of every provider action.
- Fields:
  - `operation_id`
  - `action`
  - `provider`
  - `account_id`
  - `outcome`
  - `timestamp`
  - `error_category`
- Does not store user content.
- Feeds action receipts in the mobile app.

---

## 5. Job Queue Design

### 5.1 Queue Isolation

- One queue per provider: `google_drive`, `google_docs`, `google_calendar`, `notion`.
- This prevents a large Drive sync from delaying Notion or Calendar actions.

### 5.2 Job States

```text
queued
running
succeeded
failed_retriable
failed_non_retriable
needs_user_action
cancelled
dead
```

### 5.3 Retry Policy

| Failure Type | Retry Behavior |
|---|---|
| Network error | Exponential backoff with jitter, max 5 attempts |
| 5xx provider error | Exponential backoff, max 5 attempts |
| Rate limited | Delay until provider reset or Retry-After |
| Auth expired | One refresh attempt, then `needs_user_action` |
| Permission missing | `needs_user_action` immediately |
| Invalid input | `failed_non_retriable` immediately |
| Provider down | Backoff until provider health check succeeds |

### 5.4 Idempotency

- Every job has a stable `operation_id`.
- Provider adapters must support idempotency keys where available.
- Retrying a job never duplicates a create/export action.

---

## 6. Rate-Limit Scheduler

- Uses token buckets per provider and account.
- Respects provider-specific limits from Remote Config.
- Prioritizes interactive user actions over background sync.
- When quota exhausted:
  - interactive action returns `rate_limited` immediately with retry time.
  - background job is delayed until tokens replenish.

---

## 7. Webhook Ingestion

- Endpoint format: `POST /v2/webhooks/{provider}`.
- Signature validation mandatory.
- Webhook payloads are converted to internal events and enqueued as sync jobs.
- No webhook work executes synchronously; this keeps ingestion fast and safe.
- Replay protection via event ID deduplication.

---


## 7A. Webhook Channel Lifecycle (Phase 2)

When webhooks are implemented, the backend must manage channel lifecycle:

- Register watch channel with provider when a connector becomes healthy.
- Track channel ID, provider, account, expiry time, resource type.
- Schedule renewal job before expiry (Google Drive Files default 3,600 s; Changes max 604,800 s).
- Re-register after OAuth reauthorization.
- Delete channel on disconnect.
- Verify SSL certificate requirement for webhook endpoint.

## 8. Normalized Index Maintenance

- Updated only by sync jobs.
- Uses provider cursors and high-water marks.
- Content hash detects changes.
- Supports full rebuild per provider if necessary.
- Never stores raw file content.

---

## 9. Observability

| Metric | Purpose |
|---|---|
| Job success rate by provider | Detect provider issues |
| Job latency p50/p95 | Performance |
| Retry count | Instability |
| DLQ depth | Blocked work |
| Rate-limit hits | Quota pressure |
| Webhook processing lag | Ingestion health |
| OAuth refresh failures | Connection trust |

Alerts:
- Provider failure rate >10% for 15 minutes.
- DLQ depth >100.
- OAuth refresh failure spike.
- Search latency p95 >2.0 s (per NFR-01-v2).

---

## 10. Security

- Provider secrets in cloud KMS.
- Token vault encrypted at rest and in transit.
- All backend endpoints require CreatorOS account auth.
- OAuth scopes minimized per connector.
- Operation log access restricted to support/engineering.
- No raw provider tokens in logs, metrics, or job payloads.

---

## 11. MVP Boundaries

### Included

- Gateway, token vault, provider adapters for Drive/Docs/Calendar/Notion.
- Job queue with retries and DLQ.
- Rate-limit scheduler.
- Webhook ingestion is Phase 2.
- Normalized index.
- Operation log.

### Excluded

- Social publishing jobs.
- Analytics pipeline.
- Collaboration/review backend.
- MCP server hosting.
- User-defined provider adapters.

---

## 12. Change Log

| Version | Date | Summary |
|---|---|---|
| 2.0 | 2026-08-23 | Created backend connector service architecture with deep reasoning. |
| 2.1 | 2026-08-23 | Added agentic future alignment notes. |
