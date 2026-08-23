# Webhook Ingestion

**Version:** 1.0  
**Date:** 2026-08-23  
**Status:** Ready for Development  
**Related:** v2/api/openapi/creatoros-public.openapi.yaml  

---

## 1. Purpose

This document defines webhook ingestion for CreatorOS v2.

Webhooks are hints, not truth.

Core rule:

> Receive → authenticate → persist → enqueue → acknowledge.  
> Never call Google or Notion synchronously inside the webhook handler.

A webhook signals that something changed. The provider cursor remains the source of truth for synchronization.

---

## 2. Webhook Endpoints

These are public provider-facing routes, separate from the mobile API.

```text
POST https://hooks.creatoros.app/webhooks/google-drive
POST https://hooks.creatoros.app/webhooks/google-calendar
POST https://hooks.creatoros.app/webhooks/notion
```

### Requirements

- HTTPS only with valid publicly trusted certificates.
- Separate per-provider routes and middleware.
- Strict body-size limits before parsing.
- Short request deadline, usually under 1 second.
- No provider tokens or sensitive data in logs.
- No reliance on IP allowlists alone.

---

## 3. Durable Inbox Pattern

### 3.1 Tables

```sql
create table webhook_inbox (
  id uuid primary key,
  provider text not null check (
    provider in ('google_drive', 'google_calendar', 'notion')
  ),
  connection_id text,
  subscription_id text,
  provider_event_id text,
  dedupe_key text not null,
  channel_id text,
  resource_id text,
  message_number bigint,
  event_type text,
  payload_sha256 text not null,
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  processing_status text not null check (
    processing_status in ('received', 'enqueued', 'processed', 'ignored', 'failed')
  ),
  safe_headers jsonb not null default '{}'::jsonb,
  safe_payload jsonb,
  unique (provider, dedupe_key)
);

create table outbox_events (
  id uuid primary key,
  event_type text not null,
  aggregate_id uuid not null,
  payload jsonb not null,
  status text not null default 'pending',
  available_at timestamptz not null default now(),
  published_at timestamptz
);
```

### 3.2 Handler Sequence

```ts
await db.transaction(async (tx) => {
  const event = await verifyWebhook(req);

  const inserted = await tx.webhookInbox.insertIfAbsent({
    provider: event.provider,
    dedupeKey: event.dedupeKey,
    connectionId: event.connectionId,
    channelId: event.channelId,
    resourceId: event.resourceId,
    messageNumber: event.messageNumber,
    providerEventId: event.providerEventId,
    eventType: event.eventType,
    payloadSha256: sha256(event.rawBody),
    safeHeaders: event.safeHeaders,
    safePayload: event.safePayload
  });

  if (inserted) {
    await tx.outboxEvents.insert({
      id: crypto.randomUUID(),
      eventType: "webhook.received.v1",
      aggregateId: inserted.id,
      payload: {
        webhookInboxId: inserted.id,
        connectionId: event.connectionId,
        provider: event.provider
      }
    });
  }
});

return new Response(null, { status: 204 });
```

### 3.3 Rules

- Acknowledge only after transaction commit.
- If inbox insert fails, return 503 so provider retries.
- If queue publish fails, outbox publisher retries.
- Do not make webhook acknowledgment depend on BullMQ availability.

---

## 4. Provider Authentication

### 4.1 Google Drive and Google Calendar

Google does not provide a general HMAC body signature.

Use a high-entropy secret supplied when creating the watch channel.

Validate:

- `X-Goog-Channel-ID` resolves to an active channel.
- `X-Goog-Channel-Token` matches stored channel token in constant time.
- `X-Goog-Resource-ID` matches stored watched resource.
- Channel is not expired.
- All headers are present and syntactically valid.

Important headers:

```http
X-Goog-Channel-ID: dch_01JR...
X-Goog-Channel-Token: <opaque-secret>
X-Goog-Resource-ID: 0B8...
X-Goog-Resource-State: change
X-Goog-Message-Number: 43
```

Drive and Calendar message numbers are **not sequential**. They are monotonic with possible gaps.

### 4.2 Notion

Notion uses HMAC-SHA256 over the raw request body.

Header:

```text
X-Notion-Signature: sha256=<hex-digest>
```

Verification:

```ts
function verifyNotionSignature(
  rawBody: Buffer,
  receivedSignature: string,
  verificationToken: string
): boolean {
  const expected = createHmac("sha256", verificationToken)
    .update(rawBody)
    .digest("hex");

  const expectedBuffer = Buffer.from(expected, "utf8");
  const receivedBuffer = Buffer.from(
    receivedSignature.replace(/^sha256=/, ""),
    "utf8"
  );

  return (
    expectedBuffer.length === receivedBuffer.length &&
    timingSafeEqual(expectedBuffer, receivedBuffer)
  );
}
```

Rules:

- Capture raw bytes before JSON parsing.
- Reject absent/malformed signature.
- Use constant-time comparison.
- Resolve subscription only after validating it exists and is active.
- Cap raw request size before buffering.

---

## 5. Deduplication and Ordering

### 5.1 Inbox dedupe keys

| Provider | Dedupe key |
|---|---|
| Google Drive | `google_drive:{channel_id}:{message_number}` |
| Google Calendar | `google_calendar:{channel_id}:{message_number}` |
| Notion | `notion:{subscription_id}:{event_id}` |

Enforce uniqueness in Postgres, not in memory.

### 5.2 Second-level work deduplication

Several valid notifications can map to the same sync.

Deduplicate work by:

```text
sync:google-drive:{connectionId}
sync:google-calendar:{connectionId}:{calendarId}
sync:notion:{connectionId}
```

This turns a burst of 100 notifications into one current reconciliation job.

---

## 6. Provider Reconciliation Rules

A webhook does not contain complete object state.

| Provider | Action after webhook |
|---|---|
| Google Drive | `changes.list(pageToken=<stored cursor>)` |
| Google Calendar | `events.list(syncToken=<calendar-specific token>)` |
| Notion | Fetch current page/data-source/block state via REST |

Never advance a provider cursor based on webhook message number.

---

## 7. Google Channel Renewal

Google Drive and Calendar watch channels expire. They are not automatically renewed.

### 7.1 Channel table

```sql
create table provider_watch_channels (
  id text primary key,
  connection_id text not null,
  provider text not null,
  resource_kind text not null,
  resource_id text not null,
  channel_secret_ciphertext bytea not null,
  expires_at timestamptz not null,
  status text not null check (
    status in ('active', 'renewing', 'superseded', 'stopped', 'expired')
  ),
  last_message_number bigint,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### 7.2 Renewal workflow

1. Scheduled worker scans active channels approaching expiry.
2. Create a new watch channel before old expiration.
3. Persist new channel and token transactionally.
4. Keep old and new channels valid during a brief overlap.
5. Reconcile via cursor-based sync.
6. Stop old channel with `channels.stop`.
7. Mark old channel superseded.

### 7.3 Fallback

Always run periodic polling even if webhooks are healthy. Notifications can be delayed, duplicated, or lost.

---

## 8. Failure Scenarios

| Failure | Handling |
|---|---|
| Worker unavailable but ingress healthy | `204` after inbox+outbox transaction committed |
| Database unavailable | Return `503`; rely on provider retry and periodic polling |
| Forged request with unknown channel | `404` or `204`; security metric; no sync enqueue |
| Matching channel but bad token | `401`/`403`; do not persist as valid |
| Duplicate notification | Inbox unique constraint no-op |
| Message number gap | Sync from cursor; do not infer missed files |
| Channel expires during downtime | Scheduled reconciliation/polling; renew channel |
| Watch creation succeeds but DB write fails | Stop newly created channel; alert/retry registration |
| Persistent poison job | Mark failed, safe diagnostics, route to repair/DLQ |

---

## 9. Operational Checklist

1. Create `webhook_inbox` with unique provider-specific dedupe keys.
2. Write inbox row and outbox event in one transaction.
3. Acknowledge only after commit.
4. Use Drive `changes.list` and Calendar `events.list?syncToken` as reconciliation truth.
5. Create, track, renew, overlap, and stop Google channels.
6. Generate 256-bit unique channel tokens and verify in constant time.
7. Verify Notion HMAC over raw body.
8. Deduplicate sync jobs separately from raw webhook deliveries.
9. Poll periodically even when webhooks healthy.
10. Monitor auth failures, callback latency, inbox depth, queue delay, channel expiry, cursor resets, duplicate ratio.
11. Never synchronously call providers from webhook handler.
12. Webhook delivery is disposable; persisted inbox and provider cursor are durable.

---

## 10. Change Log

| Version | Date | Summary |
|---|---|---|
| 1.0 | 2026-08-23 | Created webhook ingestion specification. |
