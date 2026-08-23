# Technical Architecture Document — ARCHITECTURE-07: Backend & API

**Product:** CreatorOS  
**Version:** 1.0  
**Status:** Draft for Review  
**Related Document:** ARCHITECTURE-00 Overview, ARCHITECTURE-04 Sync, ARCHITECTURE-06 Security, NFR-08 Platform Integration & Remote Config  
**Focus:** Lightweight backend services, API design, remote configuration, metadata sync, cloud backup, platform API proxy, analytics aggregation (Phase 2), authentication, rate limiting, deployment

---

## 1. Purpose

This document defines the **backend and API architecture** for CreatorOS. The app is local-first, but requires a minimal backend to support:

- Remote configuration delivery
- Optional encrypted metadata sync and cloud backup
- Platform API mediation for publishing and analytics (Phase 2)
- OAuth token handling where server-side secrets are required
- Analytics aggregation (Phase 2)

The backend is intentionally **lightweight** and not user-facing for MVP. The app remains fully functional without it. All user data is encrypted and minimally processed server-side.

---

## 2. Backend Principles

1. **Serve the app, not replace it**: backend supports sync/config/integrations, not core functionality.
2. **Privacy by design**: no raw media upload; metadata is encrypted.
3. **Minimal data retention**: only necessary metadata, tombstone retention.
4. **Idempotent APIs**: safe retries.
5. **Centralized rate limiting**: platform quotas managed server-side.
6. **Config-driven**: platform rules remotely configurable.
7. **Stateless where possible**: sync operations are simple.

---

## 3. Backend Service Components

**MVP Note:** The MVP backend consists solely of the Remote Config Service (signed JSON endpoint).

| Service | Purpose | Phase |
|---|---|---|
| **Remote Config Service** | Serve signed JSON config for platform capabilities, media rules, feature flags, limits | Must (MVP) |
| **Metadata Sync API** | Accept encrypted sync operations from clients; serve them to other devices | Phase 2 |
| **Cloud Backup Service** | Store encrypted metadata backups, thumbnails/proxies (optional) | Phase 2 |
| **Platform API Proxy** | Centralize OAuth, rate limiting, publishing status polling, analytics fetch | Phase 2 |
| **Analytics Aggregation Service** | Aggregate and cache platform metrics, compute creative-variable comparisons | Phase 2 |
| **Account Service** | Handle user account creation, auth, deletion | Phase 2 |

---

## 4. API Design Standards

### 4.1 General

- RESTful JSON over HTTPS.
- TLS 1.2+ required.
- Content-Type: `application/json`.
- Authentication via OAuth 2.0 Bearer token where needed, or API key for backend-to-backend.
- Idempotency-Key header for mutating requests.
- Request IDs for tracing (client-generated or server-generated).

### 4.2 Versioning

- URL-based: `/v1/...`
- Deprecation header and warnings.
- Avoid breaking changes without migration period.

### 4.3 Error Format

```json
{
  "error": {
    "code": "RATE_LIMITED",
    "message": "Too many requests. Retry after 30s.",
    "retry_after_seconds": 30,
    "details": {}
  }
}
```

Error codes mapped from NFR-08; never expose raw provider errors.

---

## 5. Remote Config Service

### 5.1 Endpoint

```
GET /v1/config?platform=ios&version=1.0&build=123
Authorization: none (or app token)
```

### 5.2 Response

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
      "media_rules": { "reel": { "aspect_ratios": ["9:16"], "max_duration_seconds": 180, "caption_max_chars": 2200 } },
      "quota_mode": "query_live"
    }
  },
  "feature_flags": {
    "cloud_backup": true,
    "ai_transcription": false
  },
  "limits": {
    "free_assets": 500,
    "pro_assets": 100000
  }
}
```

### 5.3 Requirements

- Signed payload (JWT or HMAC).
- Client caches with TTL and fallback as per NFR-08.
- Atomic updates, no partial configs.
- Dashboard for operators to update without app release.
- Config changes audited.

---

## 6. Metadata Sync API

### 6.1 Purpose

Allow users with cloud backup enabled to sync metadata across devices and restore.

### 6.2 Authentication

- User account required.
- Bearer token issued from Account Service.
- All data encrypted client-side; server sees ciphertext blobs only.

### 6.3 Endpoints

```
POST /v1/sync/operations
Body: { "operations": [ { "operation_id": "...", "device_id": "...", "entity_type": "...", "payload": "base64_encrypted", "local_revision": 5 } ] }
Response: { "accepted": [ { "operation_id": "..." } ], "conflicts": [ ... ] }

GET /v1/sync/operations?since=<cursor>&limit=100
Response: { "operations": [...], "next_cursor": "..." }

POST /v1/sync/checkpoint
Body: { "device_id": "...", "last_operation_id": "..." }
```

### 6.4 Server Behavior

- Validate idempotency; ignore duplicate operation IDs.
- Store operations as encrypted blobs.
- Track per-device cursor.
- Detect potential conflicts via base revision; return conflict metadata without inspecting plaintext.
- Retention: sync operation blobs retained 90 days, then purged.

### 6.5 Encryption

- Client uses envelope encryption: content encrypted with per-device data key; data key encrypted with user recovery key or account key.
- Server never has plaintext.
- End-to-end encryption (zero-knowledge) is technically feasible because server only stores ciphertext.

### 6.5.1 Key Recovery Model (DEC-022)

When the user enables cloud backup, the app generates a random data encryption key (DEK) for metadata backup. This DEK is used to encrypt all backup payloads. To allow cross-device restore, the DEK is wrapped:

1. A recovery passphrase is generated locally (or chosen by user) and shown once with a printable recovery code.
2. A key-encryption key (KEK) is derived from the passphrase using Argon2id (or PBKDF2-HMAC-SHA256) with a random salt.
3. The DEK is encrypted with the KEK (AES-256-GCM) and uploaded to the server as `wrapped_dek`.
4. The server stores `wrapped_dek`, salt, and KDF parameters, but never the passphrase or DEK.

On a new device:
1. User enters recovery passphrase.
2. Client derives KEK using stored salt and KDF parameters.
3. Client downloads `wrapped_dek` and decrypts it to obtain DEK.
4. Client downloads encrypted backup blobs and decrypts locally.

If the user loses the recovery passphrase, encrypted backups cannot be decrypted. The app will clearly communicate this at backup setup.

---

## 7. Cloud Backup Service

### 7.1 Purpose

Store encrypted metadata backup and optionally thumbnails/proxies for restoration.

### 7.2 Data Model

- Backup manifest (JSON) with record counts, timestamps, checksums.
- Encrypted blobs in object storage.
- Separate retention policy per backup class.

### 7.3 Endpoints

```
POST /v1/backup/initiate
POST /v1/backup/upload/{backup_id}
POST /v1/backup/complete
GET /v1/backup/list
GET /v1/backup/{backup_id}/manifest
POST /v1/backup/{backup_id}/restore
DELETE /v1/backup/{backup_id}
```

### 7.4 Requirements

- Client-side encryption before upload.
- Raw media never uploaded.
- Backups are incremental where possible.
- Deletion requests processed within 30 days.

---

## 8. Platform API Proxy

### 8.1 Purpose

Mediate all platform API calls for publishing and analytics to centralize:

- OAuth tokens and refresh
- Rate limiting and quota
- Publishing attempts and idempotency
- Status polling
- Analytics data fetching

### 8.2 Endpoints (Phase 2)

```
POST /v1/publish
Body: { "content_item_id": "...", "platform": "tiktok", "variant": {...}, "idempotency_key": "..." }
Response: { "job_id": "..." }

GET /v1/publish/{job_id}
Response: { "state": "uploading|processing|published|failed", "error": {...} }

POST /v1/analytics/posts/sync
GET /v1/analytics/posts?content_item_id=...
```

### 8.3 Server Behavior

- Queue per platform and account.
- Enforce rate limits centrally.
- Handle OAuth refresh.
- Return normalized errors to app.
- Idempotency prevents duplicate posts.
- Status polling with bounded intervals.

### 8.4 Security

- OAuth client secrets stored server-side only.
- Server issues short-lived session tokens to app.
- App never sees provider client secret.

---

## 9. Account Service

### 9.1 Purpose

Handle user account creation, authentication, and deletion for cloud sync/backup.

### 9.2 Features

- Email/password + Apple/Google sign-in.
- JWT access tokens + refresh tokens.
- Account deletion endpoint.
- Web deletion path for Google Play.

### 9.3 Data Retention

- Account data deleted within 30 days of deletion request.
- Sync/backup data purged with account deletion.

---

## 10. Rate Limiting & Quotas

### 10.1 Server-Side Rate Limits

| API | Limit |
|---|---|
| Config fetch | 1 req/min/device; cached |
| Sync upload | 100 ops/request; 10 req/min/user |
| Platform publish | Per platform quota |
| Analytics fetch | User-initiated, bounded |

### 10.2 Implementation

- Token bucket / sliding window per API key, user, or platform.
- Retry-After headers.
- Central quota tracking for platform APIs.

---

## 11. Deployment Architecture

### 11.1 Infrastructure

- Cloud provider: AWS/GCP/Azure (TBD).
- API Gateway for routing.
- Serverless functions for config/sync; managed database for account/sync metadata.
- Object storage for encrypted backups.
- Redis for rate limiting and caching.

### 11.2 Environments

- Dev, Staging, Production.
- Remote config can be staged/rolled back.

### 11.3 Observability

- Logs to centralized system (privacy-safe).
- Monitoring for sync success, config availability, API health.
- Alerts on SLO breaches from NFR-08/NFR-09.

---

## 12. Acceptance Criteria

```text
- Remote config fetch success >=99.9%.
- Config cached offline with fallback.
- Sync operations idempotent; duplicates rejected.
- Cloud backup encrypted end-to-end.
- Platform API proxy enforces rate limits; no direct mobile-provider secrets.
- Account deletion works in-app and web.
- Raw media never stored on server.
- Server APIs are versioned and documented.
- Errors are actionable and not raw provider errors.
```

---

## 13. Source References

- [RFC 8252 OAuth for Native Apps](https://www.rfc-editor.org/rfc/rfc8252.txt)  
- [RFC 9700 OAuth Security BCP](https://www.rfc-editor.org/rfc/rfc9700.pdf)  
- [Android WorkManager](https://developer.android.com/develop/background-work/background-tasks/persistent/getting-started/define-work)  
- [Apple BackgroundTasks](https://developer.apple.com/documentation/BackgroundTasks)  
- [AWS API Gateway](https://aws.amazon.com/api-gateway/)  
- [Google Cloud API Gateway](https://cloud.google.com/api-gateway)  
- [OWASP API Security](https://owasp.org/www-project-api-security/)  
- [SQLCipher](https://www.zetetic.net/sqlcipher/)

---
