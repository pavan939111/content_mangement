# Provider Integration — Google Docs

**Version:** 1.0  
**Date:** 2026-08-23  
**Status:** Ready for Development  
**Related:** v2/api/providers/google-drive.md  

---

## 1. Purpose

This document defines CreatorOS's Google Docs integration.

Google Docs API is for Google-native document structure and editing. It is not a document-discovery API and does not provide an independent full-text search endpoint.

---

## 2. Integration Mode

| Item | Value |
|---|---|
| Provider ID | `google_docs` |
| Connector type | API Connector |
| OAuth | Authorization Code + PKCE, backend callback |
| Token storage | Backend encrypted vault |
| Raw content persistence | Never |

---

## 3. Scopes

### 3.1 Conservative MVP scopes

| CreatorOS capability | Scope approach |
|---|---|
| Discover Docs via Drive | Use Drive metadata/read-only scope |
| Read document structure | Only if explicit feature requires it; avoid broad content read |
| Write document changes | Separate explicit handoff scope |

Do not request Docs write access until a specific handoff feature requires it.

---

## 4. Core APIs

| Capability | API | Use |
|---|---|---|
| Discover Docs | Drive `files.list` filtered by Docs MIME type | Required discovery path |
| Read structured document | `documents.get` | Optional metadata/hash extraction |
| Write document changes | `documents.batchUpdate` | Explicit handoff actions only |
| Find raw Doc metadata | Drive `files.get` | Title, URL, timestamps, MIME type |
| Search Docs | Drive `files.list?q=fullText...` | Limited provider fallback |

---

## 5. Discovery — Use Drive, Not Docs API

Google Docs API does not list documents.

Discover Docs with Drive:

```http
GET https://www.googleapis.com/drive/v3/files
  ?q=mimeType%20%3D%20%27application%2Fvnd.google-apps.document%27%20and%20trashed%20%3D%20false
  &fields=nextPageToken,files(id,name,modifiedTime,webViewLink,mimeType)
Authorization: Bearer <provider-access-token>
```

For search:

```http
GET https://www.googleapis.com/drive/v3/files
  ?q=mimeType%20%3D%20%27application%2Fvnd.google-apps.document%27%20and%20fullText%20contains%20%27brief%27
  &fields=files(id,name,modifiedTime,webViewLink)
Authorization: Bearer <provider-access-token>
```

Notes:

- Drive full-text search is provider-controlled.
- It is not a replacement for CreatorOS normalized search.
- It may not cover every document content state.

---

## 6. `documents.get`

```http
GET https://docs.googleapis.com/v1/documents/1AbCdEfG
Authorization: Bearer <provider-access-token>
```

Use only when necessary.

Rules:

- Do not persist the returned body/content tree.
- Do not log response bodies.
- Do not use for routine index refresh.
- If a content hash is needed, calculate in memory and persist only the hash.
- Prefer Drive metadata for change detection.

---

## 7. `documents.batchUpdate`

Example safe action:

```http
POST https://docs.googleapis.com/v1/documents/1AbCdEfG:batchUpdate
Authorization: Bearer <provider-access-token>
Content-Type: application/json
```

```json
{
  "requests": [
    {
      "insertText": {
        "location": { "index": 1 },
        "text": "CreatorOS handoff note\n"
      }
    }
  ],
  "writeControl": {
    "requiredRevisionId": "ALm37..."
  }
}
```

Rules:

- Use only after explicit user action.
- Check connection capability and scopes.
- Create action receipt before execution.
- Use idempotency and conflict policy.
- Apply revision-aware writes.
- Do not build a general-purpose editor.

---

## 8. Quotas

Current planning values:

| Type | Limit |
|---|---|
| Read requests | 3,000/min/project |
| Read requests per user | 300/min/user/project |
| Write requests | 600/min/project |
| Write requests per user | 60/min/user/project |

Implications:

- Queue write actions per connection/document.
- Do not run mass `documents.get` after every Drive notification.
- Use Drive changes to identify candidate Docs.
- Coalesce related write requests into one `batchUpdate` where safe.
- Retry transient 429/5xx with jittered exponential backoff.

---

## 9. Google Docs Edge Cases

| Edge Case | Handling |
|---|---|
| Docs API has no search endpoint | Use Drive discovery/search |
| A document accessible in Drive but token lacks edit scope | Keep capability checks at action time |
| `documents.get` returns large structured document | Process transiently, persist only hash/metadata |
| Concurrent editors invalidate indexes | Use revision-aware reads and intent-based updates |
| Hard-coded character indexes fragile | Refetch current state before writes |
| `batchUpdate` atomic for its request list only | Not automatically idempotent across duplicate job delivery |
| Docs can contain tables, tabs, suggestions, headers, footers | Avoid general-purpose editor |
| Drive full-text search not guarantee of complete indexing | Do not treat as universal full-text |
| Raw Docs content not a stable hash | Canonicalize before hashing |
| A Docs ID is generally a Drive file ID | Still use Drive for discovery/permissions |

---

## 10. Normalized Record Shape

Persist only:

```json
{
  "id": "cnt_01JQ...",
  "connection_id": "con_01JQ...",
  "provider": "google_docs",
  "external_id": "1AbCdEfG",
  "kind": "document",
  "title": "Brand X Script",
  "canonical_url": "https://docs.google.com/document/d/1AbCdEfG/edit",
  "modified_at": "2026-08-22T14:19:00Z",
  "access_state": "available"
}
```

Do not persist document body, comments, suggestions, or full document structure.

---

## 11. Change Log

| Version | Date | Summary |
|---|---|---|
| 1.0 | 2026-08-23 | Created Google Docs provider integration specification. |
