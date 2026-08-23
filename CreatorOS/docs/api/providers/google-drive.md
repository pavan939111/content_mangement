# Provider Integration — Google Drive

**Version:** 1.0  
**Date:** 2026-08-23  
**Status:** Ready for Development  
**Related:** v2/api/cross-cutting/webhooks.md  

---

## 1. Purpose

This document defines CreatorOS's Google Drive integration.

Google Drive is the primary discovery and delta-sync layer for files, folders, and Google Docs metadata.

---

## 2. Integration Mode

| Item | Value |
|---|---|
| Provider ID | `google_drive` |
| Connector type | API Connector |
| OAuth | Authorization Code + PKCE, backend callback |
| Token storage | Backend encrypted vault |
| Raw media upload | Never |

---

## 3. Scopes

### 3.1 Conservative MVP scopes

| CreatorOS capability | Scope approach |
|---|---|
| Find Drive files and display titles/URLs | `drive.metadata.readonly` or least-privilege equivalent |
| Write to Drive | Not in MVP |
| Read file content | Avoid unless a specific feature requires it |

Google may require OAuth app verification for sensitive/restricted scopes.

Do not request broad Drive access.

---

## 4. Core APIs

| Capability | API | Use |
|---|---|---|
| Discover files/folders | `files.list` | Initial metadata discovery |
| Retrieve metadata | `files.get` | Reconcile selected files |
| Search metadata/full-text | `files.list?q=...` | Provider fallback search only |
| Incremental changes | `changes.getStartPageToken`, `changes.list` | Durable delta sync |
| Shared Drives | `drives.list`, `files.list` with Shared Drive flags | Index authorized shared drives |
| Watch | `changes.watch`, `files.watch` | Push signal |
| Stop watch | `channels.stop` | Remove expired channel |

---

## 5. Initial Discovery

Request:

```http
GET https://www.googleapis.com/drive/v3/files
  ?q=trashed%20%3D%20false
  &pageSize=100
  &orderBy=modifiedTime%20desc
  &fields=nextPageToken,files(id,name,mimeType,modifiedTime,createdTime,webViewLink,md5Checksum,trashed,driveId,parents,permissions)
  &supportsAllDrives=true
  &includeItemsFromAllDrives=true
Authorization: Bearer <provider-access-token>
```

### 5.1 Rules

- Use `q` with explicit filters such as `trashed = false`.
- Use `fields` to reduce response size.
- Paginate until no `nextPageToken`.
- Persist normalized metadata in batches.
- Obtain a change start token only after discovery completes.
- Do not treat Drive search as a universal full-text engine.

---

## 6. Delta Sync

Request:

```http
GET https://www.googleapis.com/drive/v3/changes
  ?pageToken=<stored-token>
  &fields=nextPageToken,newStartPageToken,changes(fileId,removed,file(id,name,mimeType,modifiedTime,trashed,webViewLink,md5Checksum,driveId))
  &supportsAllDrives=true
Authorization: Bearer <provider-access-token>
```

### 6.1 Rules

- Begin with `changes.getStartPageToken`.
- Pass the token into `changes.list`.
- Consume all pages.
- Persist `newStartPageToken` only after final page.
- If a cursor fails, trigger full reconciliation.
- Mark removed items unavailable, not hard delete.

---

## 7. Shared Drives

Include Shared Drives:

- Use `supportsAllDrives=true`.
- Use `includeItemsFromAllDrives=true`.
- Use `corpora=drive` and `driveId` for targeted Shared Drive scans.
- Discover drives with `drives.list`.
- Keep cursor per user corpus, not per drive for MVP simplicity.

---

## 8. Search Fallback

Provider search only when product explicitly requests source search:

```http
GET https://www.googleapis.com/drive/v3/files
  ?q=fullText%20contains%20%27brief%27
  &pageSize=20
  &fields=files(id,name,modifiedTime,webViewLink)
Authorization: Bearer <provider-access-token>
```

Search behavior:

- Escape single quotes.
- Do not call per mobile keystroke.
- Cache results briefly server-side.
- Never expose raw provider result set to mobile.

---

## 9. Watch Channels

Create watch:

```http
POST https://www.googleapis.com/drive/v3/changes/watch?pageToken=<cursor>
Authorization: Bearer <provider-access-token>
Content-Type: application/json
```

```json
{
  "id": "dch_01JR...",
  "type": "web_hook",
  "address": "https://hooks.creatoros.app/webhooks/google-drive",
  "token": "v1.<random-256-bit-channel-secret>",
  "expiration": "1787479200000"
}
```

### 9.1 Rules

- Store channel ID, resource ID, encrypted token, expiry.
- Renew before expiry using overlap model.
- Notifications are hints.
- Google may reduce requested expiration.
- Valid HTTPS certificate required for callback.

---

## 10. Rate Limits and Quotas

Current planning values:

| Operation | Quota cost |
|---|---|
| `files.get` | 5 units |
| `files.list` | 100 units |
| Download | 200 units |
| Update | 50 units |

Limits:

- Per-minute project quota.
- Per-user-per-project quota.
- Watch channel create/stop consumes quota.
- Notifications do not consume quota.

Implications:

- Do not call `files.list` per mobile search.
- Use cursor-based delta sync for steady state.
- Apply token bucket per project and per connection.
- Use exponential backoff with full jitter.
- Do not retry permanent permission or validation failures.

---

## 11. Drive Edge Cases

| Edge Case | Handling |
|---|---|
| `nextPageToken` rejected | Discard and restart listing |
| Result order shifts during pagination | Deduplicate by file ID |
| Drive shortcut | Distinguish shortcut from target |
| Google-native Docs have no MD5 | Do not assume checksum exists |
| Empty, duplicate, Unicode filenames | Use file ID as identity |
| Trashed files included unless filtered | Filter `trashed=false` |
| Shared Drive flags omitted | Items appear missing |
| File moved across folders | Preserve file ID, update parent metadata |
| Access lost after indexing | Mark `permission_changed` |
| Watch delivery duplicated/out of order | Inbox dedupe + cursor reconciliation |
| Scope valid for metadata but not later action | Keep capability checks at action time |

---

## 12. Normalized Record Shape

Persist only:

```json
{
  "id": "cnt_01JQ...",
  "connection_id": "con_01JQ...",
  "provider": "google_drive",
  "external_id": "1AbCdEfG",
  "kind": "document",
  "title": "Summer Campaign Brief",
  "canonical_url": "https://drive.google.com/file/d/.../view",
  "modified_at": "2026-08-22T14:19:00Z",
  "access_state": "available"
}
```

Do not persist raw file bytes, descriptions, permission lists, or OAuth tokens.

---

## 13. Change Log

| Version | Date | Summary |
|---|---|---|
| 1.0 | 2026-08-23 | Created Google Drive provider integration specification. |
