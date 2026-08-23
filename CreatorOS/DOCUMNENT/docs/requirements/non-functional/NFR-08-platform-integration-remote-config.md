# Non-Functional Requirements — NFR-08: Platform Integration & Remote Config

**Product:** CreatorOS  
**Version:** 1.0  
**Status:** Draft for Review  
**Related Module:** FRS-06 Publishing Handoff, FRS-07 Integrations, FRS-09 Analytics (Phase 2)  

---

## 1. Purpose

This document defines the **platform integration and remote configuration requirements** for CreatorOS. The app integrates with social platforms (YouTube, TikTok, Instagram, X) for publishing, status verification, and analytics, and with cloud storage providers for file indexing. Platform rules, APIs, scopes, quotas, and publish semantics vary and change frequently.

The goals are to:

- Treat all platform integrations as optional, capability-gated adapters.
- Keep the app fully functional offline without any integration.
- Use a remote configuration layer to handle changing platform rules.
- Avoid embedding provider secrets in the app.
- Ensure publishing status is accurate and idempotent.
- Handle rate limits, OAuth lifecycles, and partial failures gracefully.

These requirements are based on platform API documentation, OAuth standards, and best practices for mobile platform integrations.

---

## 2. Scope

This document covers:

- General integration architecture and principles
- API rate limits and pagination for major platforms
- OAuth requirements for platform connections
- Remote configuration design and fallback behavior
- Publishing status state machine
- Analytics refresh cadence
- User-facing error handling
- Testing and observability requirements

**Out of scope:** Specific server implementation details, platform API terms beyond mobile integration requirements.

---

## 3. General Integration Principles

| Principle | Requirement |
|---|---|
| Offline independence | Local capture, planning, scripts, tagging, search, calendar, and native publishing reminders work with zero API connectivity |
| Integration isolation | Each platform adapter can fail, be disabled, or be rolled back without degrading local data |
| Capability discovery | UI queries a remote capability matrix before offering publish, analytics, native handoff, or status verification |
| No API secret in app | Mobile app uses PKCE and server-issued integration/session state; client secrets remain server-side |
| Idempotent publishing | Every publish intent has a stable idempotency key and local operation ID |
| Status accuracy | Never display “Published” until platform API confirms success or a verified post URL/ID is available |
| User transparency | Show platform, connected account, scope, permission, delivery mode, quota state, and last successful refresh |
| Partial failure | A TikTok failure must not block Instagram/YouTube actions for the same content item |
| Rules resilience | Cached remote configuration remains usable offline with expiry/version metadata |

**Requirement:**

> Platform integrations are optional. The app must be fully functional for local content management without any connected platform account.

---

## 4. API Rate Limits and Pagination

Platform rate limits change often and vary by endpoint, account type, app tier, region, and user token. The following are capacity-planning values only; the app must read live limits where available and not hard-code them.

### 4.1 YouTube

| Area | Planning Value | Design Requirement |
|---|---:|---|
| Default daily project quota | 10,000 quota units/day | Track quota cost per operation |
| `search.list` | 100 units/call | Avoid broad repeated search polling |
| `videos.insert` upload | 1,600 units/call | Reserve quota; uploads can exhaust daily quota quickly |
| Pagination | Each page costs quota | Cache page results; request only on user scroll |
| Quota reset | Daily, midnight Pacific | Persist quota state and reset logic |

**Requirement:** Use server-side quota management. Mobile app shall not make direct high-volume YouTube API calls.

### 4.2 TikTok

| Area | Planning Value | Design Requirement |
|---|---:|---|
| Direct-post initialization | 6 requests/min/user token | Serialize direct-publish attempts per account |
| Publish status polling | 30 requests/min/user token | Poll with backoff, never per-screen refresh |
| Common user/video endpoints | 600 requests/min/app | Apply local throttling and caching |
| Throttle response | HTTP 429 + `rate_limit_exceeded` | Honor retry window; disable aggressive retry |
| Pagination | Endpoint-specific cursor/page model | Store cursors and deduplicate by platform ID |

### 4.3 Instagram / Meta Graph API

| Area | Planning Guidance | Design Requirement |
|---|---|---|
| General Graph calls | Dynamic, app/business/user scoped | Read usage headers and handle dynamic limits |
| Published-content cap | Do not hard-code a number | Query `content_publishing_limit` before enqueue |
| Publishing eligibility | Professional account + required Page/account linkage | Validate before displaying auto-publish |
| Container lifecycle | Create/upload container → poll readiness → publish | Persist each intermediate state |
| Analytics pagination | Cursor-based Graph paging | Persist cursor and fetch incremental pages |
| Rate-limit response | Retry with exponential backoff | Queue, do not spam retries |

**Note:** Third-party reports of Instagram publishing caps conflict (50 vs 100 per 24h). Treat server-returned quota as authoritative.

### 4.4 X

| Area | Planning Guidance | Design Requirement |
|---|---|---|
| Window | Often 15 min or 24 h | Read endpoint-specific docs/config |
| Scope | Per-user and per-app limits | Track both account and app budget |
| 429 handling | Stop until reset | Respect reset header/time |
| Pagination | `next_token` / `pagination_token` | Persist token; deduplicate results |
| OAuth refresh | Requires `offline.access` scope | Request only when background access needed |

### 4.5 Client Behavior

```text
Mobile app
  → asks backend for current platform capability/quota status
  → submits publish intent or analytics-refresh request
  → receives immediate local state: “Queued for platform”
  → backend executes platform request under central quota controls
  → backend returns state update / push notification / next sync delta
```

### 4.6 Required Controls

| Control | Requirement |
|---|---|
| Per-platform queue | Separate queues for YouTube, TikTok, Instagram, X |
| Per-account queue | Serialize publish requests unless provider supports concurrency |
| Per-endpoint budget | Track calls, remaining quota, reset time, response headers |
| Shared app budget | Backend centrally enforces app-wide quota |
| 429 response | Pause affected endpoint/account until `Retry-After` or reset |
| 5xx/timeout | Exponential backoff with jitter |
| Pagination | Demand-driven; first page only by default; cache cursors |
| Analytics | Stale-while-revalidate cache; no full refresh on app open |
| Publish retries | Retry only if idempotent and platform outcome known/accepted |
| Unknown outcome | Query post/publish status before retrying to avoid duplicates |

### 4.7 Recommended Retry Schedule

| Failure | Retry |
|---|---|
| 429 | Use server/provider reset or `Retry-After`; no speculative retry |
| 500/502/503/504 | 30 s, 2 min, 10 min, 1 h, then manual/overnight queue |
| Timeout after publish submission | Query provider status first; do not republish blindly |
| OAuth 401 | Refresh once; if refresh fails, mark `Reconnect required` |
| 403 scope/eligibility | Stop retrying; explain missing account type/scope |
| Validation/media spec error | Stop retrying; show actionable format/caption/asset error |
| Provider outage | Pause platform queue; show “Platform temporarily unavailable” |

---

## 5. OAuth Requirements for Platform Integrations

### 5.1 OAuth Flow

Use:
- Authorization Code flow
- PKCE `S256`
- System browser / platform authentication session
- Short-lived access tokens
- Secure local storage for user token material
- Backend token vault or provider-token exchange where architecture permits
- Rotating refresh tokens where provider supports
- Revocation on disconnect/deletion

**Reference:** RFC 8252 requires PKCE for public native clients. RFC 9700 requires refresh-token rotation or sender-constrained refresh tokens for public clients.

### 5.2 Refresh Strategy

| Event | Recommendation |
|---|---|
| On account connect | Store expiry, scope, provider account ID, provider user ID, token family/version |
| Before API call | Refresh if token expires in <5 min |
| 401/invalid token | Attempt one serialized refresh, then retry once |
| Refresh succeeds | Atomically replace old refresh token/token metadata |
| Refresh fails | Stop queue, mark account `Reconnect required` |
| User disconnects | Revoke remotely if supported; delete local token immediately |
| Account deletion | Revoke all provider tokens and delete token metadata |
| Background analytics/sync | Require provider-approved offline scope/refresh capability |

### 5.3 OAuth Status Model

```text
Disconnected
  → Connecting
  → Connected / Healthy
  → Expiring Soon
  → Refreshing
  → Reconnect Required
  → Revoked
  → Error / Provider Unavailable
```

**Requirement:**

> Never display “Connected” if scopes are insufficient for the requested feature. Display capability separately: analytics, native handoff, direct publishing.

---

## 6. Remote Configuration

### 6.1 Why Remote Config Is Mandatory

Platform rules change more frequently than mobile release cycles:
- API versions deprecate
- media specs change
- account eligibility changes
- publish quotas change
- native-only features appear/disappear
- OAuth scopes change
- endpoint availability varies by country/account type
- app review requirements change

Remote config should control **behavior and validation**, not security boundaries. Never use remote config to deliver executable code, secrets, OAuth client secrets, or bypass platform policy.

### 6.2 Remote Configuration Schema

Example:

```json
{
  "config_version": "2026-08-22.4",
  "generated_at": "2026-08-22T10:00:00Z",
  "expires_at": "2026-08-29T10:00:00Z",
  "platforms": {
    "instagram": {
      "enabled": true,
      "direct_publish": false,
      "native_handoff": true,
      "required_account_type": ["business", "creator"],
      "required_scopes": ["instagram_basic"],
      "media_rules": {
        "reel": {
          "aspect_ratios": ["9:16"],
          "max_duration_seconds": 180,
          "caption_max_chars": 2200
        }
      },
      "quota_mode": "query_live"
    }
  }
}
```

### 6.3 Update Policy

| Config Type | Fetch Frequency | Cache TTL | Offline Fallback |
|---|---:|---:|---|
| Critical kill switches | App start + every foreground resume | 1–6 h | Last known good config |
| Platform media rules | Daily foreground check | 24 h | Last known good; show “verify in platform” if stale >7 days |
| Publishing capability matrix | App start + before publish | 1–6 h | Disable direct publish if stale >24 h; allow native handoff |
| Rate-limit defaults | Daily | 24 h | Provider headers/live backend data override |
| UI copy/education | Weekly | 7 days | Cached config |
| Experiment flags | App start | 24 h | Cached config |

### 6.4 Fallback Behavior

| Condition | Required Behavior |
|---|---|
| Config unavailable, cached config valid | Use cached config |
| Config unavailable, cached config expired <7 days | Use cache; mark platform rules “may be outdated” |
| Config unavailable, cache stale ≥7 days | Disable automated publishing; retain native handoff and local scheduling |
| Config signature invalid | Reject config; use last verified config |
| Config parser failure | Reject atomically; never partially apply |
| Platform kill switch enabled | Stop new API jobs, preserve queue, show contextual reason |
| Backend adapter outage | Retain local intent; queue or route user to native handoff |

### 6.5 Security Requirements

- Sign remote configuration payloads.
- Pin config schema version.
- Validate `generated_at` and `expires_at`.
- Use HTTPS/TLS.
- Keep last 3 verified config versions locally.
- Roll back atomically.
- Audit all kill-switch changes.
- Do not remotely reduce user privacy settings or enable cloud upload without explicit consent.

---

## 7. Publishing Status State Machine

### 7.1 Required States

```text
Draft
  → Ready for Platform
  → Needs Native Action
  → Queued
  → Uploading
  → Processing
  → Awaiting Publish
  → Published
  → Failed
  → Retry Scheduled
  → Reconnect Required
  → Blocked by Quota
  → Blocked by Platform Rule
  → Cancelled
  → Unknown Outcome
```

### 7.2 State Definitions

| State | Meaning | User-Facing Message |
|---|---|---|
| Draft | Content incomplete or unapproved | “Draft” |
| Ready for Platform | Local requirements complete | “Ready for TikTok” |
| Needs Native Action | Cannot auto-publish; user must finish in app | “Finish in Instagram” |
| Queued | Accepted by backend/local queue | “Queued to publish” |
| Uploading | Media transfer in progress | “Uploading to platform” |
| Processing | Platform transcodes/checks media | “Platform is processing video” |
| Awaiting Publish | Container/media ready; publish call pending | “Ready to publish” |
| Published | Verified platform ID/URL received | “Published” |
| Failed | Terminal failure with actionable reason | “Publishing failed: caption too long” |
| Retry Scheduled | Transient failure; automatic retry planned | “Retrying at 14:30” |
| Reconnect Required | Token invalid/revoked | “Reconnect YouTube” |
| Blocked by Quota | Rate/publish quota exceeded | “Publishing limit reached; resumes at…” |
| Blocked by Platform Rule | Format/account/scope/spec problem | “Requires a professional Instagram account” |
| Cancelled | User cancelled prior to accepted publish | “Cancelled” |
| Unknown Outcome | Request timed out after send; platform result unknown | “Checking whether this post was published” |

### 7.3 State Transition Requirements

- Every transition persisted with:
  - timestamp
  - actor: user, app, backend, platform
  - provider request ID where available
  - provider post/container ID where available
  - retry count
  - original error payload mapped to user-safe error code
- “Published” requires platform confirmation—not only successful upload initiation.
- “Failed” must name platform, failed step, retry possibility, corrective action.
- “Unknown Outcome” must perform status lookup before any retry.
- Local status must distinguish: scheduled intention, server queue accepted, upload accepted, processing, verified live post.

### 7.4 Status Polling

| Phase | Poll Schedule | Stop Condition |
|---|---|---|
| Immediately after upload | 5 s, 10 s, 20 s | Published/failed |
| Long platform processing | 1 min, 2 min, 5 min | 30 min total |
| Still unresolved | 15 min / background refresh | 24 h or provider terminal result |
| User opens post detail | One immediate status refresh if quota permits | Cached result otherwise |
| After 24 h unknown | Mark action required | User can open native platform |

Do not poll every post from every app device. Poll centrally on backend or one designated operation worker.

---

## 8. Analytics Refresh Requirements

| Data Type | Recommended Cadence |
|---|---|
| Newly published post status | Near-real time for first 30 min, bounded polling |
| Core performance metrics | 6–24 h |
| Existing post analytics | Daily or user-initiated |
| Historical backfill | Background low-priority, paginated |
| Comments/engagement | User-initiated or scheduled if value justifies quota |
| Cross-platform dashboard | Cached snapshot with “last updated” timestamp |

Pagination:
- Default 20–50 posts per page in app UI.
- Fetch only first page on initial open.
- Store provider cursor/token per connected account and endpoint.
- Persist high-water marks.
- Deduplicate by immutable provider object ID.

---

## 9. User-Facing Error Requirements

| Error Type | Required Message Pattern |
|---|---|
| Offline | “Saved locally. Connect to the internet to publish.” |
| Native-only requirement | “This post needs a final step in TikTok to add native audio.” |
| Token expired | “Reconnect Instagram to continue publishing.” |
| Quota reached | “Instagram publishing limit reached. Try again after [time].” |
| Media mismatch | “Video needs a vertical 9:16 export for this destination.” |
| Caption too long | “Caption is 240 characters over this platform’s limit.” |
| Provider processing | “YouTube is processing your video. We’ll check again.” |
| Unknown outcome | “We’re checking whether this was published to avoid duplicates.” |
| Provider outage | “TikTok is temporarily unavailable. Your post remains saved locally.” |
| Config stale | “Platform rules may have changed. Finish in the native app to verify.” |

**Requirement:** Never show raw OAuth/API errors, HTTP status only, provider stack traces, “Something went wrong” without next action, or “Published” before verification.

---

## 10. Testing & Observability

### 10.1 Required Test Doubles

- rate-limit exhaustion
- 429 plus `Retry-After`
- expired/revoked access token
- refresh-token rotation
- missing publishing scope
- professional/account eligibility failure
- media validation error
- provider 5xx and timeout
- upload accepted but status unknown
- pagination cursor expiration
- remote-config outage
- stale remote config
- kill switch activation
- provider API version deprecation

### 10.2 Service Level Objectives

| SLO | Target |
|---|---:|
| Platform capability-config fetch success | ≥99.9% daily |
| Publishing status update after provider terminal result | ≤60 s p95 |
| User-safe error mapping coverage | 100% of known provider error classes |
| Duplicate publishes caused by retry | 0 tolerated |
| Remote-config rollback | ≤15 min |
| Stale critical platform rule in active auto-publish | 0 tolerated |
| OAuth reconnect guidance display | ≤60 s after terminal token failure |
| Failed platform action preserving local content | 100% |

---

## 11. Recommended Acceptance Criteria

```text
Integration isolation
- App remains fully functional offline with no platform account connected.
- Disabling or rolling back an adapter never affects local data.

Capability discovery
- Before publishing, UI shows per-platform capability:
  auto-publish, native handoff, reminder only, unsupported.
- Capability reason displayed for limited accounts/scopes.

OAuth
- Authorization Code + PKCE S256.
- Refresh tokens rotated or sender-constrained where supported.
- Tokens stored in Keychain/Keystore; never in plaintext.
- Reconnect guidance appears within 60 s of terminal token failure.

Publishing status
- Never display “Published” without platform confirmation.
- Failed states include actionable corrective action.
- Unknown outcome triggers status lookup before retry.
- Duplicate publish retries: 0.

Remote config
- Critical platform rules remotely configurable.
- Offline cache with expiry/version.
- Stale config >7 days disables direct publishing but keeps native handoff.
- Kill switches rollback within 15 min.

Rate limits
- Backend centrally enforces quotas.
- 429 pauses affected platform until reset.
- Analytics refresh cached; no full refresh on app open.

Errors
- User-safe error messages for all known failure classes.
- No raw OAuth/API errors.
```

---

## 12. Source References

- [YouTube Data API quota calculator](https://developers.google.com/youtube/v3/determine_quota_cost)  
- [Meta Graph API rate limiting](https://developers.facebook.com/docs/graph-api/overview/rate-limiting/)  
- [TikTok API rate limits](https://developers.tiktok.com/doc/tiktok-api-v2-rate-limit)  
- [TikTok Content Posting API: status management](https://developers.tiktok.com/doc/content-posting-api-reference-get-video-status)  
- [X API rate limits](https://docs.x.com/fundamentals/rate-limits)  
- [X OAuth 2.0 Authorization Code + PKCE](https://docs.x.com/fundamentals/authentication/oauth-2-0/authorization-code)  
- [RFC 8252: OAuth for Native Apps](https://www.rfc-editor.org/rfc/rfc8252.txt)  
- [RFC 9700: OAuth 2.0 Security BCP](https://www.rfc-editor.org/rfc/rfc9700.pdf)

---
