# Technical Architecture Document — ARCHITECTURE-06: Security Architecture

**Product:** CreatorOS  
**Version:** 1.0  
**Status:** Draft for Review  
**Related Document:** ARCHITECTURE-00 Overview, ARCHITECTURE-03 Data Layer, ARCHITECTURE-04 Sync, ARCHITECTURE-05 Storage, NFR-05 Security & Privacy  
**Focus:** Threat model, encryption, authentication, OAuth, secure storage, privacy controls, data deletion, compliance, secure coding practices

---

## 1. Purpose

This document defines the **security architecture** for CreatorOS. The app is a local-first, offline-capable content workspace that handles sensitive user data: scripts, ideas, captions, transcripts, thumbnails, file paths, OAuth tokens, and optional cloud backup.

The security architecture must ensure:

- User content is protected at rest and in transit.
- OAuth tokens and secrets are never exposed.
- Raw media remains on-device by default; only metadata/thumbnails are managed.
- Users have full control over their data: export, deletion, revocation.
- The app meets platform and regulatory privacy expectations.
- Security does not harm usability or offline functionality.

This architecture builds on NFR-05, OWASP MASVS, RFC 8252/9700, and platform security guidelines.

---

## 2. Security Principles

1. **Defense in depth**: multiple layers of protection, not relying on one.
2. **Least privilege**: request only necessary permissions and scopes.
3. **Local-first privacy**: raw media and user content stay on-device by default.
4. **Secure by default**: encryption on, cloud off, raw media not uploaded.
5. **No secrets in app**: OAuth secrets and tokens handled securely.
6. **User control**: export, delete, disconnect, and privacy settings.
7. **Transparent processing**: user knows what is local vs cloud.
8. **Compliance by design**: GDPR, CCPA, platform policies.

---

## 3. Threat Model

### 3.1 Assets to Protect

| Asset | Sensitivity | Location |
|---|---|---|
| Ideas, scripts, notes, captions | High | Local DB |
| Transcripts | High | Local DB |
| File names, paths | High | Local DB |
| Tags, clip markers | Medium-High | Local DB |
| Thumbnails/proxies | High | App-private files |
| OAuth tokens | Critical | Keychain/Keystore |
| Database encryption key | Critical | Keychain/Keystore |
| Sync operations | High | Local DB |
| Raw media | High | User storage, never app-private |

### 3.2 Threat Actors

| Actor | Goal |
|---|---|
| Malicious attacker with physical access | Extract content, tokens |
| Malware on device | Steal data, intercept |
| Rogue cloud/backend | Read backup data |
| Network attacker | Eavesdrop, MITM |
| Malicious insider | Access user data |
| Platform/third-party SDK | Data leakage |
| User error | Accidental deletion/overwrite |

### 3.3 Attack Vectors

| Vector | Mitigation |
|---|---|
| Lost/stolen device | Device encryption, app lock optional, Keychain/Keystore, file protection |
| Rooted/jailbroken device | Detect risk, warn user, no guarantee |
| OAuth token theft | PKCE, secure storage, rotation, revocation |
| Plaintext DB read | SQLCipher encryption |
| Backup leakage | Encrypted local/cloud backups; no tokens |
| Thumbnail leak | Encrypted app-private cache |
| MITM | TLS 1.2+ pinning optional |
| Telemetry leakage | No content in logs |
| Accidental deletion | Trash, undo, revision history |
| Overbroad storage access | SAF/PhotoKit, least privilege |

---

## 4. Encryption Architecture

### 4.1 Data at Rest

| Data Store | Encryption |
|---|---|
| SQLite database (metadata, FTS, sync outbox) | SQLCipher AES-256-GCM |
| Thumbnails/proxies | Device-level encryption, platform-native app-private cache |
| Export archives | Optional AES-256 with user password |
| Local backups | Encrypted SQLite copy |
| Logs | Redacted; optionally encrypted |
| Temp files | Written to app-private, encrypted if sensitive |

### 4.2 Key Management

- Database encryption key generated randomly per installation.
- Key stored in iOS Keychain / Android Keystore.
- Never stored in UserDefaults/SharedPreferences or logs.
- Rekey on app update if needed.
- StrongBox/Secure Enclave-backed where available.

### 4.3 Data in Transit

- TLS 1.2+ for all network connections.
- HTTPS for remote config, metadata sync, cloud backup, platform APIs.
- Certificate validation; optional pinning for critical endpoints.
- Raw media never transmitted by CreatorOS.

---

## 5. Authentication & OAuth

### 5.1 OAuth Flow

- Use Authorization Code Grant with PKCE (S256) for all external providers.
- System browser / platform authentication session.
- No embedded WebViews for OAuth.
- Short-lived access tokens; rotating refresh tokens where supported.
- Server-side components never embed client secrets in app.

### 5.2 Token Storage

| Platform | Storage |
|---|---|
| iOS | Keychain |
| Android | Encrypted DataStore/Keystore-backed |

- Tokens never in SQLite, logs, backups, crash reports.
- Store token metadata: expiry, scopes, provider account ID.

### 5.3 Token Lifecycle

- Refresh token rotation on every refresh (if provider supports).
- On 401, refresh once, retry; if fails, mark reconnect required.
- Disconnect revokes remote token and deletes local token.
- Account deletion revokes all tokens.

---

## 6. Secure Storage of User Content

### 6.1 Local Database

- SQLCipher with `PRAGMA cipher_compatibility = 4` (or current).
- Key derived from Keychain/Keystore; use strong random key.
- Enable WAL only after encryption.
- No plaintext SQLite ever on disk.
- FTS index also encrypted within same DB.

### 6.2 File Storage

- Thumbnails/proxies stored in app-private directory.
- Files encrypted with a separate file encryption key or OS file protection.
- iOS: `FileProtectionComplete`.
- Android: internal storage + optional encrypted container.

### 6.3 Original Raw Media

- Never copied into app-private storage.
- Accessed via references only.
- If proxy/thumbnail generated, source file not moved.
- User can revoke source access; app removes reference.

---

## 7. Privacy Architecture

### 7.1 Data Minimization

- Default local-only mode.
- Cloud backup disabled by default.
- Only metadata/thumbnails indexed, not raw media.
- Telemetry minimized and opt-in or privacy-safe.

### 7.2 User Consent

- Permission requests contextual with rationale.
- Cloud backup requires explicit opt-in and data disclosure.
- Cloud transcription/tagging requires opt-in.
- Analytics/crash reporting opt-in where personal data included.

### 7.3 Privacy Controls

- Settings > Privacy shows connected services and scopes.
- User can disable cloud processing.
- User can delete local data, cloud backup, provider connections, account.
- User can export all data.

### 7.4 Data Retention

- Local revisions retained 30 days or 20 versions.
- Trash retention 30 days default.
- Tombstones retained 30–90 days.
- Cloud backup data deleted within 30 days of request.

---

## 8. Compliance Alignment

| Requirement | Implementation |
|---|---|
| GDPR | Data subject rights, export, deletion, consent, DPAs |
| CCPA | Notice, opt-out, deletion, service provider agreements |
| Apple App Store | Privacy labels, account deletion, in-app purchase |
| Google Play | Data Safety, deletion, privacy policy |
| OWASP MASVS | Level 1+ compliance |
| WCAG 2.2 AA | Accessibility (NFR-06) |

---

## 9. Secure Coding Practices

- Static analysis (SwiftLint, Detekt) in CI.
- Dependency scanning.
- No hardcoded secrets.
- No logging of sensitive data.
- Input validation and output encoding.
- Least privilege permissions.
- Penetration testing before cloud features launch.
- Security patch process.

---

## 10. Incident Response

- Plan includes token revocation, backup key rotation, user notification.
- Security contacts defined.
- Local logs redacted; remote logs privacy-safe.
- Breach notification as required by law.

---

## 11. Acceptance Criteria

```text
- Database encrypted with SQLCipher; key in Keychain/Keystore.
- OAuth tokens never plaintext.
- Raw media never uploaded by default.
- Cloud backup explicit opt-in with disclosure.
- User can export all data without subscription.
- User can delete account in-app.
- Permissions requested contextually.
- No sensitive data in logs/telemetry.
- Dependencies scanned for vulnerabilities.
- OAuth uses PKCE.
- Penetration test passed.
```

---

## 12. Source References

- [OWASP MASVS](https://mas.owasp.org/MASVS/)  
- [OWASP Mobile Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Mobile_Application_Security_Cheat_Sheet.html)  
- [RFC 8252 OAuth for Native Apps](https://www.rfc-editor.org/rfc/rfc8252.txt)  
- [RFC 9700 OAuth Security BCP](https://www.rfc-editor.org/rfc/rfc9700.pdf)  
- [Apple Platform Security](https://support.apple.com/guide/security-pdf/keybags-for-data-protection-sec6483d5760/web)  
- [Android Keystore](https://developer.android.com/privacy-and-security/keystore)  
- [SQLCipher](https://www.zetetic.net/sqlcipher/)  
- [GDPR](https://commission.europa.eu/law/law-topic/data-protection/information-individuals_en)  
- [CCPA](https://oag.ca.gov/privacy/ccpa)

---

