# Provider Integration — Notion

**Version:** 1.0  
**Date:** 2026-08-23  
**Status:** Ready for Development  
**Related:** v2/api/cross-cutting/webhooks.md  

---

## 1. Purpose

This document defines CreatorOS's Notion integration.

Notion is used for:

- Finding accessible pages and data sources
- Linking briefs, planning pages, and creator content
- Explicit handoff actions like creating pages or appending content

Notion is not:

- A full workspace export
- A guaranteed full-text search engine
- A source of complete change history

---

## 2. Integration Mode

| Item | Value |
|---|---|
| Provider ID | `notion` |
| Connector type | API Connector |
| OAuth | Authorization Code + PKCE, backend callback |
| Token storage | Backend encrypted vault |
| Raw content persistence | Never |
| API versioning | Pin `Notion-Version` header in every request |

---

## 3. Scopes and Access Model

- Notion integration sees only pages/data sources explicitly shared with it.
- "No results" may mean lack of sharing, deleted content, changed permissions, or incomplete sync—not merely an empty workspace.
- Request minimal privileges for search first.
- Request additional handoff capabilities only when the user invokes that feature.

---

## 4. Core APIs

| Capability | API | Use |
|---|---|---|
| Find accessible pages/data sources | `POST /v1/search` | Discovery by title/type |
| Retrieve a page | `GET /v1/pages/{page_id}` | Page metadata/properties |
| Retrieve a data source | `GET /v1/data_sources/{id}` | Schema and parent context |
| Query a data source | Query endpoint | Structured data-source discovery |
| Retrieve blocks | `GET /v1/blocks/{block_id}/children` | Optional transient content processing |
| Create/update pages | Page create/update endpoints | Explicit handoff |
| Create/update blocks | Block endpoints | Explicit content handoff |
| Webhooks | Notion webhook subscriptions/events | Trigger sync/reconciliation |

---

## 5. Search and Discovery

Request:

```http
POST https://api.notion.com/v1/search
Authorization: Bearer <notion-access-token>
Notion-Version: <pinned-version>
Content-Type: application/json
```

```json
{
  "query": "campaign",
  "filter": {
    "property": "object",
    "value": "page"
  },
  "page_size": 50
}
```

### 5.1 Important Limitations

- Search is title-centric and limited to integration access.
- It is not a full content export or complete workspace index.
- Search cannot be assumed to be authoritative full-text search.
- Data-source query can return a maximum of 10,000 results; when hit, results may be incomplete.
- Page title and rich-text properties can be empty, fragmented, or schema-dependent.

---

## 6. Pagination

Notion list endpoints use:

```json
{
  "object": "list",
  "results": [],
  "next_cursor": "opaque-cursor",
  "has_more": true
}
```

Continue with:

```json
{
  "start_cursor": "opaque-cursor",
  "page_size": 100
}
```

Default and maximum page size is 100. Responses can contain fewer items.

Do not assume `has_more: false` always means global completeness; check endpoint-specific behavior.

---

## 7. Pages, Data Sources, and Blocks

- A page is metadata/properties.
- Content lives in child blocks.
- Use page retrieval for title, URL, icon metadata, parent reference, timestamps, and selected safe properties.
- Do not recursively pull blocks to populate a generic search index.
- If a handoff needs a source reference, process block content transiently only where product policy permits.
- Limit block traversal depth and total blocks per job.

---

## 8. Notion Rate Limits

Notion enforces request limits and returns HTTP 429.

Operational recommendation:

- Token bucket keyed at least by `provider + workspace/integration + connection`.
- Start conservatively at around 2 requests/second per connection until production measurements validate the provider's applicable current allowance.
- Serialize bulk block traversal and data-source queries.
- On `429`, use `Retry-After` if sent; otherwise use exponential backoff with full jitter.
- Coalesce webhook-triggered jobs.
- Do not create multiple integration tokens to evade limits.

---

## 9. Webhooks

### 9.1 Verification Handshake

Notion sends a one-time verification POST with:

```json
{
  "verification_token": "notion-verification-token"
}
```

Store the verification token encrypted with the subscription/connection.

### 9.2 Event Signature

Notion signs webhook events using `X-Notion-Signature`.

Verify HMAC-SHA256 over the **unaltered raw request body** using the verification token.

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

### 9.3 Rules

- Capture raw bytes before JSON parsing.
- Reject absent/malformed signature.
- Use constant-time comparison.
- Acknowledge quickly; defer API reads and database work to queue.
- Deduplicate by event ID where available.
- Treat webhook as hint; fetch fresh page/data-source/block metadata after receiving it.
- Maintain scheduled reconciliation because events can be missed.

---

## 10. Notion Errors and Versioning

Pin a Notion API version in every request using:

```http
Notion-Version: <pinned-version>
```

| HTTP/code | Meaning | CreatorOS action |
|---|---|---|
| 400 `validation_error` | Invalid request | Fail action receipt; do not retry |
| 400 `invalid_grant` | OAuth code/refresh invalid, revoked, expired | Mark connection `reauth_required` |
| 401 `unauthorized` | Bad/missing/expired token | Refresh once; reauthorize if unresolved |
| 403 `restricted_resource` | Integration has no access | Mark item unavailable |
| 404 `object_not_found` | Missing/deleted/inaccessible | Mark item unavailable |
| 409 `conflict_error` | State/write collision | Refetch and reconcile |
| 429 `rate_limited` | Provider throttle | Delay using Retry-After/backoff |
| 5xx | Provider transient failure | Retry with bounded backoff |

---

## 11. Refresh Token Rotation

Notion refresh returns a new access token **and** a new refresh token.

Vault update must atomically replace both values.

Concurrent refresh must be locked per connection.

Stale concurrent refresh writes can break a healthy connection.

---

## 12. Notion Edge Cases

| Edge Case | Handling |
|---|---|
| Page exists but not shared with integration | Mark inaccessible if action requires it |
| User removes integration access after sync | Reconcile on next request/refresh |
| Search is not full workspace indexing | Do not claim complete full-text coverage |
| Data-source query caps at 10,000 results | Treat incomplete result as partial sync |
| Page title fragmented/empty | Use safe fallback labels |
| Blocks nested and paginated | Limit recursion depth and requests |
| Page moved/archived/restored/reparented | Reconcile current state |
| Schema/property IDs change | Centralize Notion version handling |
| Refresh token rotation | Atomic vault update |
| API version changes response shape | Pin and upgrade deliberately |
| Webhook signature fails due to body parsing | Preserve raw bytes |
| Webhook duplicated/out-of-order | Inbox dedupe + current state reconciliation |
| Write timeout ambiguous | Use CreatorOS receipt/correlation metadata |
| A page URL is not proof of current user access | Provider remains authority at open time |

---

## 13. Normalized Record Shape

Persist only:

```json
{
  "id": "cnt_01JQ...",
  "connection_id": "con_01JQ...",
  "provider": "notion",
  "external_id": "pg_123",
  "kind": "notion_page",
  "title": "Brand X Content Plan",
  "canonical_url": "https://notion.so/Brand-X-Content-Plan-...",
  "modified_at": "2026-08-22T14:19:00Z",
  "access_state": "available"
}
```

Do not persist block content, page body, database rows, comments, or OAuth tokens.

---

## 14. Change Log

| Version | Date | Summary |
|---|---|---|
| 1.0 | 2026-08-23 | Created Notion provider integration specification. |
