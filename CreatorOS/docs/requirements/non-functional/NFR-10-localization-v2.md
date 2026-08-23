# Non-Functional Requirements — NFR-10 v2: Localization Delta

**Product:** CreatorOS v2
**Version:** 2.0
**Date:** 2026-08-23
**Status:** Draft for Validation
**Reference to v1:** ../../../docs/requirements/non-functional/NFR-10-localization-device-compatibility-theming.md

---

## 1. Purpose

This document defines the v2-specific localization requirements for connected-content surfaces. The v1 i18n-from-day-one approach, RTL support, and platform string-resource patterns remain valid and are referenced.

## 2. Core Rule

All v2 user-facing strings must be defined in platform string resources:

- **iOS:** `Localizable.xcstrings` (String Catalogs) or `.strings` files; accessed via `String(localized:)` or SwiftUI `Text` with `LocalizedStringKey`.
- **Android:** `strings.xml` per locale; accessed via `stringResource(R.string.key)` in Compose.

Hardcoded user-facing literals in view code or backend response templates are a build failure caught by lint rules.

## 3. New v2 String Surfaces

The following surfaces were introduced in v2 and require localized strings from day one:

### 3.1 Connection Health States

| String Key Pattern | Example Value |
|---|---|
| `connection.health.healthy` | Healthy |
| `connection.health.stale` | Stale — cached {duration} ago |
| `connection.health.reauth_required` | Needs reauthorization |
| `connection.health.error` | Error |
| `connection.health.disconnected` | Disconnected |
| `connection.health.partial_access` | Limited access |
| `connection.health.affected_records_count` | {count} projects affected |

### 3.2 Receipt Action Types and Outcomes

| String Key Pattern | Example Value |
|---|---|
| `receipt.action.opened` | Opened |
| `receipt.action.shared` | Shared |
| `receipt.action.copied` | Copied |
| `receipt.action.linked` | Linked |
| `receipt.action.marked_delivered` | Marked delivered |
| `receipt.outcome.verified` | Verified by provider |
| `receipt.outcome.user_confirmed` | Confirmed by you |
| `receipt.annotation.add_button` | Add note to this receipt |

### 3.3 OAuth Consent and Reauthorization Messages

| String Key Pattern | Example Value |
|---|---|
| `oauth.consent.drive.description` | Search your Google Drive files and folders |
| `oauth.consent.calendar.description` | Read your calendar event titles and create due-date events |
| `oauth.consent.notion.description` | Search pages shared with CreatorOS |
| `oauth.reauth.banner_title` | Reconnect {provider} |
| `oauth.reauth.expired_message` | Access expired · reconnect to continue syncing |
| `oauth.interstitial.unverified_app` | CreatorOS is pending verification. Some Google Drive features may be limited. |

### 3.4 Search Coverage and Staleness

| String Key Pattern | Example Value |
|---|---|
| `search.coverage.complete` | All {count} sources searched |
| `search.coverage.partial` | {searched} of {total} sources searched |
| `search.coverage.offline` | Offline — showing on-device items |
| `search.coverage.reauth_excluded` | {provider} excluded — reconnect |
| `search.result.stale_label` | Cached {duration} ago |
| `search.empty.with_errors` | No matches in searched sources; some sources unavailable |
| `search.empty.true_empty` | No results for "{query}" |

### 3.5 Delivery Link and Client Acknowledgment

| String Key Pattern | Example Value |
|---|---|
| `delivery.share.title` | Delivery for review |
| `delivery.share.expires_notice` | This link expires on {date} |
| `delivery.client_ack.button` | Confirm received |
| `delivery.client_ack.thank_you` | Thank you for confirming |

### 3.6 API Error Messages (problem+json detail/title fields)

Backend error messages surfaced to users must have localized equivalents keyed by the stable `code` field:

| Error Code | Localized Detail Required |
|---|---|
| `RATE_LIMITED` | Yes |
| `CONNECTION_REAUTH_REQUIRED` | Yes |
| `PROVIDER_UNAVAILABLE` | Yes |
| `CONNECTION_LIMIT_REACHED` | Yes |
| `VALIDATION_FAILED` | Yes (with field-level details) |

The BFF returns English defaults; mobile maps `code` to localized strings for display.

## 4. Pseudolocalization Testing

Before each release candidate, run pseudolocalized builds for all new v2 surfaces:

- Enable iOS pseudolocale (e.g., "Double-Length Pseudolanguage") in scheme settings.
- Use Android's `en-XA` pseudolocale on emulators.

Verify:

- [ ] No truncated text at 1.5× expanded string length for health states, search banners, receipt actions
- [ ] Interpolated values ({count}, {provider}, {duration}) still render correctly with surrounding text expanded
- [ ] No layout breakage in Connection Health Center rows, search coverage banner, receipt list items
- [ ] Date/time formatting respects locale (relative timestamps like "cached 2 days ago")
- [ ] Plural forms handled correctly for affected-records count and result counts

## 5. MVP Language Scope

MVP ships English-only but with full string-resource extraction complete so that adding locales requires translation files only — no code changes. The FTS tokenizer (`unicode61 remove_diacritics 2`) already supports multilingual content indexing.

## 6. Change Log

| Version | Date | Summary |
|---|---|---|
| 2.0 | 2026-08-23 | Created v2 localization delta covering connection health, receipts, OAuth consent, search coverage, delivery links, API errors; required pseudolocalization testing. |
