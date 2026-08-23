# API Rate Limits and Quotas

**Version:** 1.0  
**Date:** 2026-08-23  
**Status:** Ready for Development  
**Related:** v2/api/openapi/creatoros-public.openapi.yaml  

---

## 1. Purpose

This document defines rate-limiting rules for:

- CreatorOS public mobile API
- Connector worker provider calls
- Plan-based product quotas

Goal: prevent retry storms, protect provider quotas, and keep the mobile experience responsive without exposing internal limits.

---

## 2. Public API Rate Limits

### 2.1 Headers

Every public response includes:

```http
RateLimit-Policy: "search";q=60;w=60
RateLimit: "search";r=47;t=38
Retry-After: 38
```

For compatibility, also include:

```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 47
X-RateLimit-Reset: 1787476042
```

### 2.2 Standard 429 Response

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 20
Content-Type: application/json
```

```json
{
  "error": {
    "code": "RATE_LIMITED",
    "message": "Too many search requests. Try again shortly.",
    "retryable": true,
    "retry_after_seconds": 20,
    "request_id": "req_01JQZAQNHAFJ0BSCACZD2VSMGW"
  }
}
```

---

## 3. Plan-Based Mobile Limits

Starting defaults:

| Endpoint category | Free | Solo $12 | Pro $20 |
|---|---:|---:|---:|
| Search requests | 30/min/workspace | 90/min | 180/min |
| Manual connection refresh | 3/hour | 12/hour | 30/hour |
| Search page size | 25 | 50 | 50 |
| Connected sources | 2 | 5 | 10 |
| Background sync priority | Low | Normal | High |

These are product-policy limits, not provider-enforced values.

Tune after measuring cost and provider quotas.

---

## 4. Provider Quota Management

### 4.1 Keys

Use scoped keys:

```text
google:project
google:connection:{connectionId}
google:workspace:{providerWorkspaceId}

notion:integration
notion:connection:{connectionId}

creatoros:workspace:{workspaceId}:plan
```

### 4.2 Architecture

- Redis stores atomic fast-path token buckets for low-latency admission control.
- Postgres stores authoritative provider/connection scheduling state and next-eligible timestamps.
- Postgres survives Redis failure so recovery is safe.
- Provider `Retry-After` is treated as authoritative over configured assumptions.
- The mobile app never sees or manages provider quota internals.

---

## 5. Worker Rate-Limit Behavior

When a provider returns `429`:

1. Parse `Retry-After`.
2. Update the relevant provider/connection bucket.
3. Delay only affected jobs.
4. Return the job to waiting state without burning normal retry attempts.
5. Coalesce other queued work for the same provider/connection.

Example BullMQ behavior:

```ts
if (response.status === 429) {
  const delayMs = parseRetryAfter(response.headers.get("retry-after"));
  await scheduleRetry(receipt.id, delayMs ?? backoffWithJitter(attempt));
  throw Worker.RateLimitError();
}
```

---

## 6. Sync Job Deduplication

A burst of webhooks or manual refresh requests must not create a burst of provider scans.

Deduplicate by connection:

```ts
await syncQueue.add(
  "sync-connection",
  { connectionId },
  {
    jobId: `sync:${connectionId}`,
    deduplication: {
      id: `sync:${connectionId}`,
      ttl: 30_000,
      extend: true,
      replace: true
    }
  }
);
```

Postgres remains authoritative for cursors and sync state.

---

## 7. Retry Backoff

Default transient failure backoff:

```text
base: 2 seconds
attempts: 5
cap: 10 minutes
jitter: full jitter
```

Long provider incidents:

```text
1 min, 5 min, 15 min, 1 hour, then repair/DLQ
```

Never tightly retry provider 429/5xx and consume quota.

---

## 8. Error Surfacing to Mobile

Mobile only sees:

- `RATE_LIMITED`
- `PROVIDER_UNAVAILABLE`
- `CONNECTION_REAUTH_REQUIRED`

Never raw `429`, `Retry-After`, queue names, provider quotas, or internal diagnostics.

---

## 9. Change Log

| Version | Date | Summary |
|---|---|---|
| 1.0 | 2026-08-23 | Created API rate limits and quotas specification. |
