# Non-Functional Requirements — NFR-05: Security & Privacy

**Product:** CreatorOS  
**Version:** 1.0  
**Status:** Draft for Review  
**Related Module:** All modules, especially FRS-07 Integrations, FRS-08 Offline & Sync  

---

## 1. Purpose

This document defines the **security and privacy requirements** for CreatorOS. The app is a local-first, mobile-first content workspace that stores user-generated content, metadata, transcripts, thumbnails, and OAuth tokens locally, with optional cloud backup and platform integrations.

The goal is to ensure:

- User content is protected at rest and in transit.
- OAuth tokens are handled securely.
- Privacy disclosures are accurate and complete.
- Users have full control over their data: export, deletion, and revocation.
- The app meets platform and regulatory expectations for personal content.

All requirements are based on official Apple/Android security guidance, OWASP Mobile Application Security Cheat Sheet, OAuth standards, and GDPR/CCPA principles.

---

## 2. Scope

This document covers:

- Data classification and sensitivity
- Encryption at rest and in transit
- OAuth token storage and lifecycle
- Privacy disclosures and consent
- Data deletion and account management
- Data export and portability
- Threat model and mitigations
- Operational security

**Out of scope:** Server-side security architecture, cloud provider security details, platform-specific API permissions beyond mobile integration, full legal compliance (requires counsel).

---

## 3. Data Classification & Sensitivity

| Data Type | Sensitivity | Local Treatment | Cloud Default |
|---|---|---|---|
| Ideas, scripts, notes, captions | High | Encrypt at rest | Off by default |
| Transcript excerpts | High | Encrypt at rest | Off by default |
| File names, paths, folder names | High | Encrypt at rest | Off by default |
| Asset tags, clip markers, timestamps | Medium–High | Encrypt at rest | Off by default |
| Thumbnail/proxy previews | High | Encrypt at rest | Off by default |
| Raw media | High | Do not copy/store by default | Never upload by default |
| OAuth access tokens | Critical | Secure token store only | Never sync |
| OAuth refresh tokens | Critical | Secure token store only | Never sync |
| Device IDs / sync IDs | Medium | Protected app database | Only if backup enabled |
| Crash logs / diagnostics | Medium | Minimize and redact | Opt-in or disclosed |

**Requirement:**

> Treat thumbnails, transcripts, captions, filenames, and tags as personal data. Raw media stays local by default.

---

## 4. Encryption Requirements

### 4.1 Local Data Encryption

| Store | Minimum Required Protection | Recommended Implementation |
|---|---|---|
| Local SQLite DB | AES-256 authenticated encryption | SQLCipher or equivalent encrypted SQLite |
| FTS indexes | Encrypted with containing DB | No plaintext shadow search files |
| Thumbnails | Device-level encryption | Platform-native app-private cache |
| Proxies | Device-level encryption | Platform-native cache, quota-managed |
| Export archives | AES-256 with user-controlled password/key option | Encrypted ZIP/container |
| OAuth tokens | Platform secure store | iOS Keychain / Android Keystore-backed encrypted store |
| Cloud backup | TLS 1.2+ in transit + encrypted at rest | Prefer client-side envelope encryption |
| App logs | Redacted, no content/token/path data | Structured privacy-safe telemetry |

**Implementation requirements:**

- iOS:
  - OAuth tokens, DB encryption key, backup key in **Keychain**.
  - Sensitive files use `NSFileProtectionComplete` or `CompleteUnlessOpen` as appropriate.
  - Local database encrypted with SQLCipher or equivalent AES-256-GCM.
- Android:
  - Encryption keys in **Android Keystore**, StrongBox-backed where available.
  - OAuth tokens in encrypted DataStore/SharedPreferences or secure credential manager.
  - SQLite database encrypted with SQLCipher or equivalent AES-256-GCM.

**Requirement:**

> All app-owned metadata, scripts, captions, transcripts, FTS indexes, and sync queues are encrypted at rest using authenticated encryption with OS-protected keys. Thumbnails and proxies rely on device-level encryption.

### 4.2 Encryption in Transit

- All network communication uses HTTPS/TLS 1.2 or higher.
- Cloud backup uploads metadata, thumbnails, and optional proxies over TLS.
- Raw media is never uploaded by default.
- For cloud backup, prefer client-side envelope encryption so server cannot read user content. If end-to-end encryption is claimed, the server must not possess decryption keys.

---

## 5. OAuth Token Requirements

### 5.1 OAuth Flow

Use for all external service integrations (cloud storage, social platforms):

- Authorization Code Grant
- PKCE with `S256`
- System browser / platform authentication session
- No embedded WebView credential flow
- Short-lived access tokens
- Rotating refresh tokens or sender-constrained refresh tokens where provider supports
- Explicit revocation on disconnect/account deletion

**Reference:** RFC 8252 requires PKCE for public native clients. RFC 9700 requires sender-constrained or rotating refresh tokens for public clients.

### 5.2 Token Storage

| Platform | Requirement |
|---|---|
| iOS | Store refresh token and token metadata in Keychain (`kSecClassGenericPassword`). Use `kSecAttrAccessibleWhenUnlockedThisDeviceOnly` unless background refresh requires less restrictive setting. |
| Android | Store encryption key in Android Keystore. Store token ciphertext in encrypted DataStore/SharedPreferences. |
| Both | Never store tokens in plaintext SQLite, preferences, logs, analytics, crash reports, clipboard, deep links, or sync backup. |

**Requirement:**

> OAuth access/refresh tokens never appear in plaintext databases, logs, backups, screenshots, analytics, or cloud sync payloads.

### 5.3 Token Lifecycle

| Requirement | Threshold |
|---|---|
| Access token persistence | Avoid if possible; otherwise encrypted secure storage |
| Refresh token persistence | Secure storage only |
| Refresh token rotation | Every refresh, where provider supports |
| Token expiration handling | Refresh within 5 minutes of expiry or on 401 |
| Revoked token response | Stop retries after one refresh attempt; require reconnect |
| Token deletion on disconnect | Local deletion within 1 second; provider revocation best effort within 60 s |
| Token deletion on account deletion | Local deletion immediately; provider revocation queued and retried |
| Token log exposure | Zero tolerance |

---

## 6. Privacy Disclosure Requirements

### 6.1 In-App Disclosure

Before enabling optional cloud backup, clearly state:

> “Your content stays on this device by default. If you enable backup, the app uploads selected metadata such as titles, notes, scripts, captions, tags, transcript text, file names, thumbnails, and clip markers. Original videos and photos are not uploaded unless you explicitly export or share them.”

Also disclose:
- what data is processed on-device vs cloud
- AI transcript/tagging processing location (local or cloud)
- cloud provider/subprocessor
- encryption model (provider-managed, client-side, end-to-end if true)
- retention period
- deletion/export mechanism
- analytics/crash-reporting data
- connected-account scope and revocation path

### 6.2 App Store & Play Disclosures

| Store | Minimum Requirement |
|---|---|
| Apple App Store | Privacy policy URL, App Privacy disclosure, accurate collection/use/linking/tracking claims, in-app account-deletion path if accounts exist |
| Google Play | Data Safety form, disclosure of collection/sharing/security practices, account/data deletion disclosures where applicable |
| Both | Keep disclosures accurate for first-party code, SDKs, cloud backup, crash reporting, analytics, and OAuth provider integrations |

**Requirement:**

> Privacy policy, App Store privacy label, and Google Play Data Safety must be complete and accurate before release. Do not claim end-to-end encryption unless server cannot decrypt user payloads.

---

## 7. Data Deletion & Account Management

### 7.1 Deletion Types

| Action | Required Outcome |
|---|---|
| Delete local content item | Remove local canonical record, FTS entry, thumbnails, proxies, relations; create tombstone if sync enabled |
| Clear local cache | Remove rebuildable thumbnails/proxies only; preserve metadata/content |
| Disconnect provider | Delete OAuth tokens immediately; stop future access; offer removal of imported metadata |
| Disable cloud backup | Stop uploads; keep local data; ask whether to delete cloud backup |
| Delete cloud backup | Remove cloud metadata, encrypted blobs, server indexes, retained revisions, thumbnail/proxy copies |
| Delete account | Remove account identity, server-side content/backups, tokens, devices, logs where permitted |

### 7.2 Deletion Targets

| Requirement | Target |
|---|---|
| Local deletion reflected in UI/search | ≤1 second |
| Local token deletion after disconnect | ≤1 second |
| Cloud deletion request acknowledged | Immediately |
| Cloud active-record deletion | ≤30 days |
| Backup/revision/purge completion | ≤30 days |
| Account deletion initiation | In-app, ≤3 taps from settings |
| Export generation for ≤100k records | Start ≤5 seconds; async with progress |
| Tombstone retention | 30–90 days |
| Raw media retention | None by default |

**Requirement:**

> If account creation is offered, in-app account deletion is required by Apple and Google. Provide separate deletion paths for local data, cloud backup, provider connections, and full account.

---

## 8. Data Export & Portability

### 8.1 Export Formats

| Export Type | Format |
|---|---|
| Ideas/scripts/notes/captions | Markdown + JSON |
| Tags/content calendar/status | CSV + JSON |
| Searchable metadata | JSON/CSV |
| Clip markers | JSON/CSV with source URI, in/out time, transcript |
| Asset relationships | JSON manifest |
| Thumbnails/proxies | Optional encrypted archive |
| Cloud backup manifest | JSON including backup version and date |

**Requirement:**

- Export includes schema version, creation time, app version, UUIDs, source references, tag relationships, and tombstone state if user requests full archive.
- Export must note that references are not original raw media unless separately exported.
- Full export works offline.
- Export must not require a paid subscription.

---

## 9. Threat Model & Mitigations

| Threat | Mitigation |
|---|---|
| Lost/stolen unlocked device | App lock/biometric gate; file protection; secure tokens; encrypted DB |
| Rooted/jailbroken device | Detect as risk signal; warn before cloud backup/token connection; do not claim absolute protection |
| Backup leakage | Client-side encryption; no token backup; encrypted archives |
| OAuth token theft | Keychain/Keystore storage, PKCE, rotation, revocation, short access-token lifetime |
| Sensitive thumbnail leak | Encrypted app-private cache; no shared external cache |
| Transcript/metadata leakage | Encrypt DB/FTS, redact logs, cloud opt-in |
| Malicious cloud provider or breach | Client-side envelope encryption; ideally user-controlled recovery key |
| Accidental deletion | Revisions, tombstones, export, restore window |
| Overbroad filesystem access | Use SAF/PhotoKit/document picker; least privilege |
| Telemetry leakage | No user content in telemetry; opt-in diagnostics; scrub paths/title/caption data |

**Requirement:**

> Follow OWASP Mobile Application Security Cheat Sheet. Use platform APIs instead of custom crypto. Use Secure Enclave/StrongBox where available.

---

## 10. Operational Security

- No content text, filenames, paths, tokens, or transcript excerpts in telemetry.
- Dependency/SBOM review and security patch process.
- Penetration test before cloud backup/OAuth launch.
- Incident response runbook including token revocation and backup-key rotation.
- Log security events locally, redacted, and user-reviewable.

---

## 11. Recommended Acceptance Criteria

```text
Local protection
- All app-owned metadata, scripts, captions, transcripts, FTS indexes, and sync queues are encrypted at rest with authenticated encryption. Thumbnails and proxies use device-level encryption.
- OAuth access/refresh tokens never appear in plaintext databases, logs,
  backups, screenshots, analytics, or cloud sync payloads.

Authentication and tokens
- OAuth uses Authorization Code + PKCE S256.
- Refresh tokens use rotation or sender-constraining where supported.
- Tokens are stored in iOS Keychain / Android Keystore-backed secure storage.
- Disconnect removes local tokens immediately and revokes remotely best effort.

Cloud backup
- Off by default.
- Explicit consent describes uploaded metadata categories.
- Raw media is not uploaded by default.
- TLS required in transit.
- Client-side encryption strongly recommended; E2EE/zero knowledge claimed only
  when server cannot decrypt user payloads.

Privacy controls
- Privacy policy, App Store privacy label, and Google Play Data Safety are complete.
- User can inspect backup state, provider scopes, and last sync.
- User can export data in machine-readable formats.
- User can delete local data, cloud backup, provider connection, and account separately.

Deletion
- In-app account deletion if accounts exist.
- Google Play web deletion path if accounts exist.
- Local deletion updates FTS/cache in <=1 second.
- Cloud active data deletion target <=30 days.
- Sync tombstones/revisions retained 30–90 days with disclosure.

Operational security
- No content text, filenames, paths, tokens, or transcript excerpts in telemetry.
- Dependency/SBOM review and security patch process.
- Penetration test before cloud backup/OAuth launch.
- Incident response runbook includes token revocation and backup-key rotation.
```

---

## 12. Source References

- [Apple Platform Security — Data Protection keybags](https://support.apple.com/guide/security-pdf/keybags-for-data-protection-sec6483d5760/web)  
- [Android Developers — Android Keystore](https://developer.android.com/privacy-and-security/keystore)  
- [OWASP — Mobile Application Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Mobile_Application_Security_Cheat_Sheet.html)  
- [RFC 8252 — OAuth 2.0 for Native Apps](https://www.rfc-editor.org/rfc/rfc8252.txt)  
- [RFC 9700 — OAuth 2.0 Security BCP](https://www.rfc-editor.org/rfc/rfc9700.pdf)  
- [Google OAuth best practices](https://developers.google.com/identity/protocols/oauth2/resources/best-practices)  
- [Apple App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)  
- [Apple account deletion support](https://developer.apple.com/support/offering-account-deletion-in-your-app/)  
- [Google Play account and data deletion](https://support.google.com/googleplay/android-developer/answer/13327111)  
- [EDPB — Data subject rights](https://www.edpb.europa.eu/topics/key-gdpr-concepts/data-subject-rights_en)  
- [European Commission — GDPR individual rights](https://commission.europa.eu/law/law-topic/data-protection/information-individuals_en)  
- [California Attorney General — CCPA](https://oag.ca.gov/privacy/ccpa)

---
