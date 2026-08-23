# Provider Integration — Google Calendar

**Version:** 1.0  
**Date:** 2026-08-23  
**Status:** Ready for Development  
**Related:** v2/api/cross-cutting/webhooks.md  

---

## 1. Purpose

This document defines CreatorOS's Google Calendar integration.

Calendar is event-centric. It needs separate synchronization per calendar and its incremental-sync semantics must be implemented exactly.

---

## 2. Integration Mode

| Item | Value |
|---|---|
| Provider ID | `google_calendar` |
| Connector type | API Connector |
| OAuth | Authorization Code + PKCE, backend callback |
| Token storage | Backend encrypted vault |
| Raw event content persistence | Never |

---

## 3. Scopes

### 3.1 Conservative MVP scopes

| CreatorOS capability | Scope approach |
|---|---|
| List/read events | Calendar read-only |
| Create/update events | Narrowest Calendar write scope |
| Attendees, conferencing, private properties | Do not request unless feature requires |

Google Calendar scopes include highly privileged write and ACL scopes. Do not request them unless the exact feature needs them.

---

## 4. Core APIs

| Capability | API | Use |
|---|---|---|
| List calendars | `calendarList.list` | Discover user calendars |
| Initial event sync | `events.list` | Initial metadata sync |
| Incremental event sync | `events.list?syncToken=...` | Durable delta sync |
| Create event | `events.insert` | Explicit handoff |
| Update/delete event | `events.patch`, `events.update`, `events.delete` | Only for owned CreatorOS actions |
| Push notifications | `events.watch` | Trigger per-calendar delta sync |

---

## 5. Initial Sync

Request:

```http
GET https://www.googleapis.com/calendar/v3/calendars/primary/events
  ?singleEvents=true
  &showDeleted=true
  &maxResults=250
  &orderBy=updated
Authorization: Bearer <provider-access-token>
```

Rules:

- Paginate via `nextPageToken`.
- Persist `nextSyncToken` from final page only.
- Maintain one cursor per `connection + calendar_id`.

---

## 6. Incremental Sync

Request:

```http
GET https://www.googleapis.com/calendar/v3/calendars/primary/events
  ?syncToken=<stored-token>
Authorization: Bearer <provider-access-token>
```

Rules:

- With `syncToken`, results include only changes since that token.
- Deleted events are included.
- Cannot set `showDeleted=false` while using `syncToken`.
- If token expires, API returns `410 Gone`.
- On `410 Gone`, clear local storage for that calendar and perform full sync.

---

## 7. Event Insertion

```http
POST https://www.googleapis.com/calendar/v3/calendars/primary/events
Authorization: Bearer <provider-access-token>
Content-Type: application/json
```

```json
{
  "summary": "CreatorOS: Film UGC product demo",
  "description": "Created from CreatorOS receipt rcp_01JQ...",
  "start": {
    "dateTime": "2026-08-26T10:00:00+05:30",
    "timeZone": "Asia/Kolkata"
  },
  "end": {
    "dateTime": "2026-08-26T11:00:00+05:30",
    "timeZone": "Asia/Kolkata"
  },
  "extendedProperties": {
    "private": {
      "creatoros_receipt_id": "rcp_01JQ..."
    }
  }
}
```

Rules:

- Include an idempotency correlation value in `extendedProperties.private`.
- Persist the resulting Google event ID in the action receipt.
- Before retrying an ambiguous `events.insert` timeout, search/reconcile by receipt correlation marker.

---

## 8. Calendar Watch Channels

Create watch:

```http
POST https://www.googleapis.com/calendar/v3/calendars/primary/events/watch
Authorization: Bearer <provider-access-token>
Content-Type: application/json
```

```json
{
  "id": "cch_01JQ...",
  "type": "web_hook",
  "address": "https://hooks.creatoros.app/webhooks/google-calendar",
  "token": "<opaque-signed-channel-token>",
  "params": {
    "ttl": "604800"
  }
}
```

Rules:

- Channel has expiration determined by request and Calendar limits.
- Validate `X-Goog-Channel-ID`, `X-Goog-Channel-Token`, `X-Goog-Resource-ID`.
- Treat notification as a signal to run `events.list?syncToken=...`.
- Renew before expiry using overlap model.
- Stop channel when calendar/connection removed.
- Periodic polling remains mandatory.

---

## 9. Quotas

Current planning values:

| Dimension | Limit |
|---|---|
| Project | 10,000 requests/min |
| User/project | 600 requests/min/user/project |

Implications:

- Token bucket per Google user/connection and per Google Cloud project.
- Exponential backoff with jitter.
- Full resync only on `410 Gone`.
- Circuit breaking during broad provider incidents.
- Coalesce webhook-driven jobs.
- Bound initial historical discovery.

---

## 10. Calendar Edge Cases

| Edge Case | Handling |
|---|---|
| `410 Gone` on syncToken | Clear and full-resync that calendar |
| `nextSyncToken` only meaningful after all pages | Persist after final page |
| Webhook notification lacks event object | Delta-sync it |
| Push channel expires | Renew before deadline; fall back to polling |
| Recurring events duplicate-like records | Define series/instance policy |
| Event moved between calendars | Looks like delete plus create |
| Timezone changes | Handle all-day/recurring display carefully |
| Retry after timeout | Use receipt correlation marker |
| Read access without insert permission | Check capability before write |
| OAuth grant revoked | Mark reauth_required |
| Calendar-wide sync state reused across calendars | Never; one sync token per calendar |

---

## 11. Normalized Record Shape

Persist only:

```json
{
  "id": "cnt_01JQ...",
  "connection_id": "con_01JQ...",
  "provider": "google_calendar",
  "external_id": "event_123",
  "kind": "calendar_event",
  "title": "Deliver Brand X UGC video",
  "canonical_url": "https://calendar.google.com/calendar/event?...",
  "modified_at": "2026-08-22T14:19:00Z",
  "access_state": "available"
}
```

Do not persist descriptions, attendees, conferencing payloads, attachments, or private extended properties unless an explicit privacy rationale exists.

---

## 12. Change Log

| Version | Date | Summary |
|---|---|---|
| 1.0 | 2026-08-23 | Created Google Calendar provider integration specification. |
