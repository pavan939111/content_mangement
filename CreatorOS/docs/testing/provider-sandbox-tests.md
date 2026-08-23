# Provider Sandbox Tests — CreatorOS v2

**Version:** 1.0
**Date:** 2026-08-23
**Status:** Ready for Implementation
**Related:** TDD-05, TDD-06, TDD-07, v2/api/providers/*.md, v2/api/cross-cutting/webhooks.md
**CI Frequency:** Weekly + release candidate; OAuth smoke on every staging deploy

---

## 1. Purpose

Tests against real Google and Notion sandbox tenants validating assumptions that mocks cannot prove: OAuth consent configuration, scopes, permission behavior, pagination quirks, webhook subscription mechanics, rate limits, and API-version compatibility.

## 2. Environment Requirements

| Item | Requirement |
|---|---|
| Google tenant | Dedicated QA Workspace; test-only folders/accounts |
| Notion workspace | Dedicated QA integration with limited page access |
| Webhook endpoint | HTTPS-only, non-production hostname, distinct from production route |
| Credentials | Test-only OAuth client IDs; never production secrets in CI |
| Data TTL | All seeded data cleaned up after each run; no persistent test artifacts |
| Rate limit safety | Use low-quota test project; respect provider quotas in test design |

## 3. Mock vs Real Call Policy

| Concern | Fake/Stub | Real Sandbox |
|---|---|---|
| Payload mapping / error classification | Yes (unit) | No |
| Outbox, idempotency, receipts | Real Postgres/Redis | No |
| HTTP request formatting | Fixture stub | Periodic validation |
| OAuth redirect/callback/exchange | Stub most paths | **Yes — every path** |
| Token refresh and revocation | Stub plus controlled revocation | **Yes** |
| Permissions/sharing changes | Fixture role matrix | Yes |
| Rate limits and Retry-After | Fixture with fake clock | Controlled low-quota project |
| Drive/Calendar webhook delivery | Signed local fixture | Dedicated HTTPS sandbox endpoint |
| Notion webhook signature/retry | Signed local fixture | Dedicated QA subscription |
| Provider API version compatibility | Archived fixtures | Scheduled canary calls |

## 4. OAuth Token Lifecycle Tests

### 4.1 Local/Deterministic Tests

| ID | Scenario | Assertions |
|---|---|---|
| PS-OA-01 | Successful authorization-code exchange | Tokens stored encrypted; mobile receives only safe Connection projection |
| PS-OA-02 | State mismatch rejected | Callback rejected; transaction not consumed |
| PS-OA-03 | Missing PKCE verifier | Exchange fails with clear error; no partial token storage |
| PS-OA-04 | Duplicate callback replay | Transaction marked consumed once; second attempt rejected |
| PS-OA-05 | User denies consent at provider screen | `PROVIDER_CONSENT_DENIED` surfaced; no connection row created |
| PS-OA-06 | Access-token expiry triggers refresh under connection lock | One refresh; concurrent callers await result |
| PS-OA-07 | Refresh returns rotated refresh token (Notion) | Both tokens atomically replaced in vault |
| PS-OA-08 | Refresh returns `invalid_grant` | Connection transitions to `reauth_required`; retries stop |
| PS-OA-09 | Concurrent refresh attempts serialized per connection | Only one network call to provider; others reuse winner's token |
| PS-OA-10 | Disconnect deletes vault row immediately | Row absent after DELETE; revocation call best-effort |

### 4.2 Controlled Sandbox Tests (Weekly / RC)

| ID | Scenario | Assertions |
|---|---|---|
| PS-SBX-01 | Authorize QA owner via real Google consent screen | Only expected scopes granted; no extra permissions requested |
| PS-SBX-02 | Verify granted scopes match configured minimum | Scope list matches capability registry |
| PS-SBX-03 | Make one minimal reversible call per provider (e.g., files.list pageSize=1) | 200 OK; response schema matches adapter expectation |
| PS-SBX-04 | Exercise refresh with short-lived credential where feasible | New access token obtained; old one invalidated |
| PS-SBX-05 | Revoke access via provider UI or revocation endpoint | Next connector job → `reauth_required`; original operation retained |
| PS-SBX-06 | Reauthorize and verify safe resume | Health returns to Healthy; affected records revalidated |
| PS-SBX-07 | Google testing-mode 7-day token expiry handled explicitly | Not treated as production defect; lifecycle coverage documented |

## 5. Google Drive Sandbox Tests

| ID | Scenario | Assertions |
|---|---|---|
| PS-GD-01 | Initial discovery: files.list with fields/servesAllDrives | Metadata normalized correctly; Shared Drives included when authorized |
| PS-GD-02 | Delta sync: changes.getStartPageToken → changes.list | Cursor advances only after full page commit |
| PS-GD-03 | File moved/renamed/trashed between syncs | Next delta reflects change; stale link flagged |
| PS-GD-04 | Permission revoked on shared folder | Item becomes inaccessible; status updated without crash |
| PS-GD-05 | Watch channel created and notification received on file change | Inbox event deduped; reconciliation enqueued |
| PS-GD-06 | Watch channel expires → renewal creates replacement before expiry | Old channel stopped; new channel active during overlap |
| PS-GD-07 | Duplicate change notification delivered twice | Single sync job executed (dedupe by message number) |
| PS-GD-08 | 429 rate-limit response honors Retry-After | Job delayed exactly; normal retry attempts not consumed |
| PS-GD-09 | Search fallback uses fullText contains query safely | Results cached server-side; raw response not sent to mobile |

## 6. Google Calendar Sandbox Tests

| ID | Scenario | Assertions |
|---|---|---|
| PS-GC-01 | Create due-date event from record using operation ID in extended properties | Event created once despite duplicate job delivery |
| PS-GC-02 | Timezone/DST transition for due date | Event created at correct local time |
| PS-GC-03 | Calendar removed/unshared after initial sync | Items become unavailable; health degrades gracefully |
| PS-GC-04 | Sync token invalidated by provider | Safe full resync triggered; no data loss |
| PS-GC-05 | 429 quota response honored | Backoff respected; non-idempotent insert not blindly retried |

## 7. Notion Sandbox Tests

| ID | Scenario | Assertions |
|---|---|---|
| PS-NOT-01 | Page shared with integration appears in search | Title/snippet/URL normalized correctly |
| PS-NOT-02 | Page unshared from integration after sync | Item marked unavailable on next request |
| PS-NOT-03 | Nested blocks with depth limit enforced | Traversal stops at configured max depth; no runaway API calls |
| PS-NOT-04 | Archived/restored page reconciled | Current state reflected; stale cache cleared |
| PS-NOT-05 | Duplicate webhook events converge | Idempotent processing; single state update |
| PS-NOT-06 | 429 respects Retry-After header | Delayed job; no tight retry loop |
| PS-NOT-07 | Notion-Version header pinned across requests | Correct version sent; upgrade tested explicitly before bumping |
| PS-NOT-08 | Refresh token rotation: both access and refresh replaced atomically | Vault updated as single transaction; no partial state |

## 8. Webhook Signature Verification Tests

| ID | Provider | Scenario | Assertions |
|---|---|---|---|
| PS-WH-01 | Notion | Valid signature over raw body | Accepted; inbox event created |
| PS-WH-02 | Notion | Invalid signature (modified body) | Rejected with 401; no sync enqueued |
| PS-WH-03 | Notion | Missing signature header | Rejected; security metric incremented |
| PS-WH-04 | Google Drive | Correct channel ID + valid token header | Accepted; reconciliation job deduped |
| PS-WH-05 | Google Drive | Unknown/expired channel ID | 404 or 204; no work enqueued |
| PS-WH-06 | Google Calendar | Out-of-order message numbers | Gap detected; cursor-based sync fills missing data |
| PS-WH-07 | All | Replay after acknowledgment uncertainty | Inbox unique constraint prevents duplicate processing |

## 9. Change Log

| Version | Date | Summary |
|---|---|---|
| 1.0 | 2026-08-23 | Created provider sandbox tests covering OAuth lifecycle, Google Drive/Calendar, Notion, webhook signatures, rate limits. |
