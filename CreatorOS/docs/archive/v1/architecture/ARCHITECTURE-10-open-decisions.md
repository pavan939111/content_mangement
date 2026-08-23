# Technical Architecture Document — ARCHITECTURE-10: Open Decisions

**Product:** CreatorOS  
**Version:** 1.1  
**Status:** Updated with Final Decisions  
**Last Updated:** 2026-08-22  
**Related Documents:** ARCHITECTURE-00 to ARCHITECTURE-09, NFR-01 to NFR-11, FRS modules  

---

## 1. Purpose

This document records the **resolved architectural and technology decisions** for CreatorOS. It was previously open for discussion; after deep research, all decisions are now finalized for MVP development.

Each decision includes:
- Decision ID
- Decision statement
- Final selected option
- Rationale and evidence
- Dependencies
- Decision owner
- Decision date

This document serves as the **Architecture Decision Record (ADR)** for the tech stack and key architectural choices.

---

## 2. Decision Summary

| Decision ID | Decision Area | Final Decision | Status |
|---|---|---|---|
| DEC-001 | Mobile Frameworks & Shared Logic | Native UI + KMP shared core | ⏳ Provisional — gated on real technical spike |
| DEC-002 | iOS Minimum OS | iOS 16.0 | ✅ Decided |
| DEC-003 | Android Minimum API | Android 9 (API 28) | ✅ Decided |
| DEC-004 | iOS Data Persistence | GRDB.swift + SQLCipher | ✅ Decided |
| DEC-005 | FTS5 Tokenizer | `unicode61 remove_diacritics 2` (MVP) | ✅ Decided |
| DEC-006 | Database Encryption Key Management | Random per-install key in Keychain/Keystore | ✅ Decided |
| DEC-007 | Backend Cloud Provider | Supabase (MVP) | ✅ Decided |
| DEC-008 | Metadata Sync API Implementation | Custom REST API with durable outbox | ✅ Decided |
| DEC-009 | Remote Config Service | Custom signed JSON endpoint on Supabase Edge Function | ✅ Decided |
| DEC-010 | OAuth Token Storage | iOS Keychain / Android Keystore + encrypted DataStore | ✅ Decided |
| DEC-011 | Root/Jailbreak Detection | None in MVP; optional risk signal Phase 2 | ✅ Decided |
| DEC-012 | Crash Reporting & Telemetry | Sentry + MetricKit + Android Vitals | ✅ Decided |
| DEC-013 | Telemetry Privacy Approach | No user content; opt-in performance; denylist | ✅ Decided |
| DEC-014 | CI/CD Platform | GitHub Actions + fastlane | ✅ Decided |
| DEC-015 | Test Data Strategy | Synthetic corpora only; no production data | ✅ Decided |
| DEC-016 | Subscription Management | RevenueCat | ✅ Decided |
| DEC-017 | Feature Flag Platform | Same signed remote config service | ✅ Decided |
| DEC-018 | Analytics Aggregation | Server-mediated proxy (Phase 2) | ✅ Decided |
| DEC-019 | Collaboration Backend | Same lightweight backend (Phase 2) | ✅ Decided |
| DEC-020 | Outbox Transaction Boundary | Native outbox insert; shared KMP sync engine | ✅ Decided |
| DEC-021 | Android Persistence | Room + SQLCipher + FTS5 raw SQL | ✅ Decided |
| DEC-022 | Backup Key Recovery | User-managed passphrase | ✅ Decided |
| DEC-023 | Speech-to-Text | Whisper.cpp (on-device) + OpenAI Whisper API (cloud fallback) | ✅ Decided |
| DEC-024 | Rich-Text Editor | Native Compose/SwiftUI rich text components backed by KMP data model | ✅ Decided |
| DEC-025 | Push Notification | Firebase Cloud Messaging (FCM) | ✅ Decided |
| DEC-026 | Three-Way Merge | Shared KMP custom 3-way text merge based on Diff-Match-Patch | ✅ Decided |

---

## 3. Final Decisions

### DEC-001: Mobile Frameworks & Shared Logic

**Final Decision:** Native SwiftUI + Jetpack Compose, with a Kotlin Multiplatform (KMP) shared core for domain, sync, API contracts, and remote configuration.

**Status:** **Provisional — gated on real technical spike**

**Rationale:**
- CreatorOS’s hardest work is local-first data consistency and platform-specific media/storage behavior, not generic UI.
- KMP reduces duplication in domain models, sync/outbox behavior, query contracts, remote-config parsing, and API adapters.
- Native UI preserves best accessibility, performance, and platform integration.
- The real technical spike has not been executed yet. SQLCipher + FTS5 viability and the outbox atomicity boundary must be confirmed by measured results per ARCHITECTURE-17 before this decision is finalized.

**Evidence:** Cash App and Netflix use KMP for shared logic while retaining native platform delivery.

**Owner:** Lead Mobile Architect  
**Date:** 2026-08-22 (revised 2026-08-23: fabricated spike claim removed; status reverted to Provisional)

---

### DEC-002: iOS Minimum Deployment Target

**Final Decision:** iOS 16.0.

**Rationale:** Modern SwiftUI features, broad active-device coverage, and alignment with NFR-10.

**Owner:** Product Owner  
**Date:** 2026-08-22

---

### DEC-003: Android Minimum API Level

**Final Decision:** Android 9 (API 28).

**Rationale:** Selected as a stable API level that supports required Android features while balancing device reach; scoped storage via SAF works; aligns with NFR-10.

**Owner:** Mobile Lead  
**Date:** 2026-08-22

---

### DEC-004: iOS Data Persistence

**Final Decision:** GRDB.swift + SQLCipher.

**Rationale:**
- Strong migration, transaction, observation, concurrency, and FTS5 support.
- SQLCipher integration documented.
- Provides raw SQL access for external-content FTS5 and triggers.
- Must verify FTS5 enabled in chosen SQLCipher build.

**Owner:** Data Architect  
**Date:** 2026-08-22

---

### DEC-005: FTS5 Tokenizer & Language Support

**Final Decision:** `unicode61 remove_diacritics 2` for MVP.

**Rationale:** Simple, supports Latin languages, low overhead. Porter stemmer or ICU tokenizer can be added later if multilingual search becomes critical.

**Owner:** Data Architect  
**Date:** 2026-08-22

---

### DEC-006: Database Encryption Key Management

**Final Decision:** Random per-install key stored in iOS Keychain / Android Keystore.

**Rationale:** Strong, simple, no user passphrase required. Cross-device restore key management deferred until cloud backup is required.

**Owner:** Security Architect  
**Date:** 2026-08-22

---

### DEC-007: Backend Cloud Provider

**Final Decision:** Supabase for MVP.

**Rationale:**
- PostgreSQL + RLS + Auth + Storage + Edge Functions fit small team.
- Excellent for client-encrypted metadata backup.
- Raw media never uploaded.
- Phase 2: dedicated TypeScript provider-integration worker; move to AWS only if workloads justify.

**Owner:** Backend Architect  
**Date:** 2026-08-22

---

### DEC-008: Metadata Sync API Implementation

**Final Decision:** Custom REST API with durable outbox.

**Rationale:** Full control, simple conflict model, no unnecessary CRDT complexity for MVP. CRDT considered Phase 2 for collaboration.

**Owner:** Backend Lead  
**Date:** 2026-08-22

---

### DEC-009: Remote Config Service

**Final Decision:** Custom signed JSON endpoint on Supabase Edge Function, versioned in Postgres/object storage.

**Rationale:**
- Provides signed config, TTL, offline fallback, and anti-rollback.
- No vendor lock-in.
- Firebase Remote Config is a managed fallback but not required.

**Owner:** Backend Architect  
**Date:** 2026-08-22

---

### DEC-010: OAuth Token Storage

**Final Decision:** iOS Keychain Direct APIs / Android Keystore + encrypted DataStore or EncryptedSharedPreferences.

**Rationale:** Tokens are small, highly sensitive credentials with lifecycle different from content DB. Never store tokens in SQLCipher.

**Owner:** Security Architect  
**Date:** 2026-08-22

---

### DEC-011: Root/Jailbreak Detection

**Final Decision:** None in MVP. Optional light detection as risk signal in Phase 2.

**Rationale:** Bypassable, false-positive risk, not needed for local-first MVP. Prioritize secure storage, PKCE, and server-side controls.

**Owner:** Security Architect  
**Date:** 2026-08-22

---

### DEC-012: Crash Reporting & Telemetry

**Final Decision:** Sentry (privacy-minimizing configuration) + Apple MetricKit + Android Vitals.

**Rationale:** Strong native SDKs, client-side scrubbing, offline event buffering, performance tracing. No session replay/screenshots.

**Owner:** Observability Lead  
**Date:** 2026-08-22

---

### DEC-013: Telemetry Privacy Approach

**Final Decision:** No user content, filenames, paths, tokens. Opt-in for non-fatal and performance. Crash reporting can be enabled with consent. Strict denylist.

**Owner:** Privacy Officer  
**Date:** 2026-08-22

---

### DEC-014: CI/CD Platform

**Final Decision:** GitHub Actions with self-hosted macOS runner for iOS, plus fastlane.

**Rationale:** Cost-effective, widely used, mobile CI support.

**Owner:** DevOps  
**Date:** 2026-08-22

---

### DEC-015: Test Data Strategy

**Final Decision:** Synthetic corpora only. No production data in test environments. Anonymized opt-in data later.

**Owner:** QA Lead  
**Date:** 2026-08-22

---

### DEC-016: Subscription Management

**Final Decision:** RevenueCat.

**Rationale:**
- Cross-platform entitlement abstraction.
- Cached customer state works offline for previously verified purchases.
- Explicit Restore Purchases.
- Avoid custom receipt validation until scale demands.

**Owner:** Product/Monetization  
**Date:** 2026-08-22

---

### DEC-017: Feature Flag Platform

**Final Decision:** Use the same signed remote config service.

**Rationale:** Avoid additional dependency; config already supports signed JSON, TTL, deterministic rollout.

**Owner:** Backend Architect  
**Date:** 2026-08-22

---

### DEC-018: Analytics Aggregation Approach

**Final Decision:** Server-mediated analytics proxy with server-side caching and scheduled fetch.

**Rationale:** Respect platform rate limits, centralize quota, preserve privacy. Phase 2.

**Owner:** Analytics Architect  
**Date:** 2026-08-22

---

### DEC-019: Collaboration Backend

**Final Decision:** Same lightweight backend (Supabase) with comment/approval API and object storage for shared assets.

**Rationale:** Meets Phase 2 needs without new infrastructure.

**Owner:** Backend Architect  
**Date:** 2026-08-22

---

### DEC-020: Outbox Transaction Boundary

**Final Decision:** The durable sync outbox insert is performed **natively** inside the platform-specific database transaction (GRDB on iOS, Room on Android). The shared KMP sync engine only reads and processes queued operations after local commit.

**Rationale:** A shared Kotlin module cannot enlist in a GRDB transaction on iOS. To preserve the invariant "content mutation + sync enqueue in same transaction," the outbox write must be native. KMP remains for sync policies, idempotency, conflict rules, and API contracts.

**Owner:** Data + Mobile Architect  
**Date:** 2026-08-22

---

### DEC-021: Android Persistence Layer

**Final Decision:** Room + SQLCipher for Android, with explicit FTS5 external-content tables and triggers via raw SQL migrations.

**Rationale:** Strong Android maturity, first-class coroutines/Flow, supported SQLCipher via `SupportOpenHelperFactory`. FTS5 external-content tables require raw SQL, which is acceptable.

**Owner:** Data Architect  
**Date:** 2026-08-22

---

### DEC-022: Backup Key Recovery

**Final Decision:** Use a user-managed recovery passphrase to wrap the backup data encryption key. The server stores only the wrapped key and salt; never the plaintext key or passphrase.

**Rationale:** A random per-install key (DEC-006) makes cross-device restore impossible. This design adds a recovery path while preserving client-side encryption and zero-knowledge.

**Owner:** Security Architect  
**Date:** 2026-08-22

---

### DEC-023: Speech-to-Text Technology

**Final Decision:** Use native on-device speech recognition for MVP (iOS `SFSpeechRecognizer`, Android `SpeechRecognizer`). Cloud-based speech-to-text is Phase 2, metered by plan.

**Rationale:** On-device is free, private, works offline, and meets MVP needs for English transcription. Cloud adds cost, latency, and privacy complexity.

**Owner:** Mobile Architect  
**Date:** 2026-08-22

---

### DEC-024: Rich-Text Editor Component

**Final Decision:** Build a minimal native text editor supporting bold, italic, headings, lists, and blockquote via Markdown syntax shortcuts. Do not integrate a heavy third-party rich-text editor for MVP.

**Rationale:** FRS-10 SE-02 requires basic formatting. A lightweight Markdown-based editor is sufficient and avoids unbudgeted library risk. Full WYSIWYG is Phase 2.

**Owner:** Mobile Architect  
**Date:** 2026-08-22

---

### DEC-025: Push Notification Infrastructure

**Final Decision:** MVP uses local notifications only. Phase 2 adds remote push via Firebase Cloud Messaging (FCM) and Apple Push Notification service (APNs), orchestrated through Supabase Edge Functions.

**Rationale:** MVP reminders can be handled locally. Remote push is required only when collaboration and server-initiated notifications are introduced.

**Owner:** Backend Architect  
**Date:** 2026-08-22

---

### DEC-026: Three-Way Merge Library

**Final Decision:** Use `diff-match-patch` or equivalent library on each platform, with a shared ancestor snapshot stored in the sync outbox.

**Rationale:** NFR-02 and NFR-09 require three-way merge for scripts/captions. The outbox already stores `parent_hash`; the merge implementation can use an established diff library.

**Owner:** Data Architect  
**Date:** 2026-08-22

---

## 4. Architecture Decision Log

| Date | Decision ID | Decision | Owner |
|---|---|---|---|
| 2026-08-22 | DEC-001 | Native UI + KMP shared core | Mobile Architect |
| 2026-08-22 | DEC-002 | iOS 16+ | Product Owner |
| 2026-08-22 | DEC-003 | Android API 28+ | Mobile Lead |
| 2026-08-22 | DEC-004 | GRDB.swift + SQLCipher | Data Architect |
| 2026-08-22 | DEC-005 | unicode61 FTS5 | Data Architect |
| 2026-08-22 | DEC-006 | Keychain/Keystore random key | Security Architect |
| 2026-08-22 | DEC-007 | Supabase backend | Backend Architect |
| 2026-08-22 | DEC-008 | Custom metadata sync API | Backend Lead |
| 2026-08-22 | DEC-009 | Custom signed config endpoint | Backend Architect |
| 2026-08-22 | DEC-010 | Keychain/Keystore tokens | Security Architect |
| 2026-08-22 | DEC-011 | No root detection MVP | Security Architect |
| 2026-08-22 | DEC-012 | Sentry + MetricKit/Vitals | Observability Lead |
| 2026-08-22 | DEC-013 | Privacy-safe telemetry | Privacy Officer |
| 2026-08-22 | DEC-014 | GitHub Actions + fastlane | DevOps |
| 2026-08-22 | DEC-015 | Synthetic test data | QA Lead |
| 2026-08-22 | DEC-016 | RevenueCat | Product Owner |
| 2026-08-22 | DEC-017 | Signed config feature flags | Backend Architect |
| 2026-08-22 | DEC-018 | Server-side analytics proxy | Analytics Architect |
| 2026-08-22 | DEC-019 | Supabase collaboration backend | Backend Architect |
| 2026-08-22 | DEC-020 | Native outbox insert | Data + Mobile Architect |
| 2026-08-22 | DEC-021 | Room + SQLCipher + FTS5 | Data Architect |
| 2026-08-22 | DEC-022 | Backup Key Recovery | Security Architect |
| 2026-08-22 | DEC-023 | Whisper.cpp + OpenAI Whisper API | Mobile Lead |
| 2026-08-22 | DEC-024 | Native rich text + KMP data model | Mobile Architect |
| 2026-08-22 | DEC-025 | FCM Push Notifications | Backend Architect |
| 2026-08-22 | DEC-026 | KMP Diff-Match-Patch merge | Data Architect |

---

## 5. Next Steps

1. Create a **Technology Stack Document** summarizing all selections, version constraints, licensing notes, and security posture.
2. Run the **KMP + SQLCipher + FTS5 technical spike** before finalizing the shared data layer.
3. Set up CI/CD with GitHub Actions and fastlane.
4. Begin implementation following the architecture documents.

---

## 6. Source References

- [Kotlin Multiplatform Case Studies](https://kotlinlang.org/docs/multiplatform/case-studies.html)  
- [GRDB.swift + SQLCipher](https://github.com/mezhevikin/GRDB.SQLCipher.swift)  
- [Room FTS5](https://developer.android.com/training/data-storage/room/defining-data)  
- [SQLCipher for Android](https://github.com/sqlcipher/sqlcipher-android)  
- [Supabase](https://supabase.com/)  
- [RevenueCat](https://www.revenuecat.com/)  
- [Sentry Mobile Privacy](https://docs.sentry.io/security-legal-pii/security/mobile-privacy/)  
- [Apple Keychain Services](https://developer.apple.com/documentation/Security/keychain-services)  
- [Android Keystore](https://developer.android.com/privacy-and-security/keystore)  
- [RFC 8252](https://www.rfc-editor.org/rfc/rfc8252.txt)

---

**END OF UPDATED ARCHITECTURE-10**


## 7. Change Log

| Version | Date | Summary |
|---|---|---|
| 1.1 | 2026-08-22 | Added DEC-023 through DEC-026; updated stack and transcription semantics. |
| 1.2 | 2026-08-22 | P2 updates: navigation IA, NFR-01 thresholds, version pins, uncited claims. |
| 1.3 | 2026-08-23 | Retracted spike results; DEC-001 reverted to Provisional. |

