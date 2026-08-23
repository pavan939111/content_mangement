# Unit Test Cases — CreatorOS v2

**Version:** 1.0
**Date:** 2026-08-23
**Status:** Ready for Implementation
**Related:** v2/testing/test-strategy.md, TDD-01, TDD-02, TDD-03, TDD-04
**CI Frequency:** Every pull request

---

## 1. Purpose

Fast, deterministic tests for domain rules, state machines, conflict resolution, operation serialization, retry policy, and entitlement gates. No database, network, or UI rendering.

## 2. Tools

| Platform | Framework |
|---|---|
| iOS | Swift Testing (primary), XCTest (platform integration) |
| Android | JUnit 5 + kotlinx-coroutines-test + Turbine |
| Backend | Vitest/Jest with fake clock/IDs |

## 3. Test Support Fakes (Required)

| Fake | Purpose |
|---|---|
| `FakeClock` | Deterministic retry windows, backoff, token expiry |
| `FakeUUIDGenerator` | Predictable IDs for receipts/idempotency assertions |
| `FakeConnectivity` | Offline / slow / reconnecting / online states |
| `StubAPI` | Deterministic API responses for sync testing |
| `DeterministicScheduler` | Controlled background task execution |

## 4. Sync State Machine Tests

| ID | Invariant | Assertions |
|---|---|---|
| UNIT-SM-01 | `idle → queued → uploading → acknowledged` transitions correctly on success | State matches expected sequence; no skipped states |
| UNIT-SM-02 | Transient network failure moves to retryable state with backoff | `next_retry_at` computed from backoff policy + jitter |
| UNIT-SM-03 | Permanent 400 validation failure moves to terminal failed | No further automatic retries scheduled |
| UNIT-SM-04 | OAuth `invalid_grant` moves to `blocked_reauth` | Retry stops until reauthorization completes |
| UNIT-SM-05 | Conflict response triggers defined merge/conflict policy | Resolution recorded in audit trail |
| UNIT-SM-06 | Same operation submitted N times yields same durable state as once | Idempotency invariant: `apply(C,K)^n = apply(C,K)^1` |
| UNIT-SM-07 | Successful acknowledgement removes only the matching operation | Other pending operations unaffected |

## 5. Document Edit Tests

| ID | Invariant | Assertions |
|---|---|---|
| UNIT-DE-01 | Title/content normalization preserves Unicode, strips unsafe HTML | Normalized text stored correctly |
| UNIT-DE-02 | Operation creation produces stable ordering by timestamp + sequence | Replaying edits produces identical order |
| UNIT-DE-03 | Duplicate edit suppression prevents double-insert of same change | Single row per logical edit |
| UNIT-DE-04 | Merge policy executes correctly (server wins / local wins / field merge) | Chosen policy applied deterministically; conflict logged if applicable |

## 6. Search Query Parser Tests

| ID | Invariant | Assertions |
|---|---|---|
| UNIT-SQ-01 | Multi-word query compiles to AND semantics | FTS query string correct |
| UNIT-SQ-02 | Prefix matching enabled only for queries ≥3 characters | Short queries use exact match or return empty |
| UNIT-SQ-03 | Empty/whitespace query bypasses FTS, returns recent records | No FTS MATCH executed |
| UNIT-SQ-04 | Malformed FTS syntax escaped to literal tokens | No SQL injection or FTS parse error |
| UNIT-SQ-05 | Query length limit enforced | Queries >200 chars truncated/rejected |

## 7. Entitlement Gate Tests

| ID | Invariant | Assertions |
|---|---|---|
| UNIT-EG-01 | Free tier: connector features gated at plan limit | Upgrade prompt shown when limit reached |
| UNIT-EG-02 | Solo tier: unlimited records, all initial connectors available | No gating on connected records |
| UNIT-EG-03 | Pro tier: advanced search, receipt export enabled | Feature flags resolve to true |
| UNIT-EG-04 | Grace period: expired subscription retains access temporarily | Grace end date respected; no premature downgrade |
| UNIT-EG-05 | Cancellation: data remains accessible and exportable | Export action not gated by subscription status |

## 8. View Model State Tests

| ID | State | Expected UI Model |
|---|---|---|
| UNIT-VMS-01 | Loading | Spinner/skeleton, no stale content shown |
| UNIT-VMS-02 | Cached content loaded | Content rendered from local DB immediately |
| UNIT-VMS-03 | Stale content refreshing | Cached content visible + refresh indicator |
| UNIT-VMS-04 | Offline with cached results | Results shown + offline banner |
| UNIT-VMS-05 | Offline with no cache | Empty state + offline explanation |
| UNIT-VMS-06 | Permission denied | Clear error + settings deep link |
| UNIT-VMS-07 | Expired auth token | Reconnect prompt, no crash |
| UNIT-VMS-08 | Error retry available | Error message + Retry button functional |

## 9. Retry Policy Unit Tests

| ID | Scenario | Assertions |
|---|---|---|
| UNIT-RP-01 | Exponential backoff computes correct delays for attempt 1–5 | Delay = base × 2^(n−1) ± jitter, capped at max |
| UNIT-RP-02 | `Retry-After` header overrides computed backoff | Next retry uses provider-specified delay |
| UNIT-RP-03 | Non-retryable error codes skip backoff entirely | Terminal state set immediately |
| UNIT-RP-04 | Max attempts reached triggers DLQ/dead-letter path | Operation marked terminal; alert metric incremented |
| UNIT-RP-05 | Clock change does not affect ordering | Monotonic clock used for scheduling decisions |

## 10. Change Log

| Version | Date | Summary |
|---|---|---|
| 1.0 | 2026-08-23 | Created unit test cases covering sync state machine, document edits, search parser, entitlements, view model states, retry policy. |
