# Technology Stack Document — CreatorOS

**Product:** CreatorOS  
**Version:** 1.0  
**Status:** Final for MVP Planning  
**Last Updated:** 2026-08-22  
**Related Documents:** ARCHITECTURE-00 to ARCHITECTURE-10, NFR-01 to NFR-11, FRS modules  

---

## 1. Purpose

This document defines the **complete technology stack** for CreatorOS MVP. It consolidates the decisions from ARCHITECTURE-10, providing the selected technologies, versions, licenses, key dependencies, and important caveats.

The stack is designed to meet the following core requirements:

- Local-first, offline-first architecture.
- Native mobile experience with full accessibility.
- SQLite with FTS5 and SQLCipher encryption.
- Lightweight backend for remote config, encrypted metadata backup, and platform integration (Phase 2).
- Media indexing and previews without raw media upload.
- Subscription management with offline entitlement.
- Observability with strict privacy.
- Maintainable, testable, and deployable.

---

## 2. Stack Overview by Layer

| Layer | Technology |
|---|---|
| iOS App | Swift (latest stable at project start), SwiftUI, iOS 16+ |
| Android App | Kotlin, Jetpack Compose, Android 9+ (API 28) |
| Shared Logic | Kotlin Multiplatform (KMP) — domain, sync, API, config |
| iOS Data | GRDB.swift + SQLCipher + FTS5 |
| Android Data | Room + SQLCipher + FTS5 |
| Backend | Supabase (Auth, Postgres/RLS, Storage, Edge Functions) |
| Remote Config | Custom signed JSON on Supabase Edge Function |
| Secure Storage | iOS Keychain, Android Keystore + Encrypted DataStore/SharedPreferences |
| OAuth | Authorization Code + PKCE; system browser flow |
| Media Processing (MVP) | iOS Quick Look/AVFoundation, Android MediaMetadataRetriever/ThumbnailUtils |
| Media Processing (Phase 2) | iOS AVAssetExportSession, Android Media3 Transformer |
| Subscription | RevenueCat |
| Speech-to-Text | Whisper.cpp (on-device) + OpenAI Whisper API (cloud fallback) |
| Rich-Text Editor | Native Compose/SwiftUI rich text backed by KMP data model |
| Push Notifications | Firebase Cloud Messaging (FCM) |
| Text Merge | KMP Diff-Match-Patch |
| Observability | Sentry + Apple MetricKit + Android Vitals |
| CI/CD | GitHub Actions + fastlane |
| Crash Reporting | Sentry (strict privacy) |
| Testing | XCTest/JUnit, Compose UI Test, XCUITest, Paparazzi/SnapshotTesting |
| Deployment | App Store Connect, Google Play Console, Supabase |

---

## 3. Mobile Development Stack

### 3.1 iOS

| Component | Selection | Version | Notes |
|---|---|---|---|
| Language | Swift | Current stable | SwiftUI-first |
| UI Framework | SwiftUI | iOS 16+ | Declarative UI, built-in accessibility |
| Minimum OS | iOS 16.0 | — | Covers majority active devices |
| Navigation | SwiftUI NavigationStack + TabView | — | Coordinator/router pattern |
| Dependency Injection | Manual composition root or Resolver | — | Constructor injection |
| Concurrency | Swift Concurrency (async/await, actors) | — | |
| Localization | String Catalog (.xcstrings) | — | Plurals, RTL |
| Theming | Asset Catalog Color Sets | — | Light/Dark/High Contrast |
| Accessibility | SwiftUI accessibility modifiers | — | VoiceOver, Dynamic Type |
| Testing | XCTest, XCUITest | — | Snapshot tests optional |
| Utilities | SFSpeechRecognizer | — | Native on-device transcription |
| Build System | Xcode + Swift Package Manager/CocoaPods | — | SPM preferred |

### 3.2 Android

| Component | Selection | Version | Notes |
|---|---|---|---|
| Language | Kotlin | Current stable | |
| UI Framework | Jetpack Compose | Current stable | Material 3, adaptive layouts |
| Minimum OS | Android 9 (API 28) | — | Scoped storage via SAF |
| Navigation | Jetpack Navigation Compose | — | Deep links |
| Dependency Injection | Hilt (Dagger) | — | Constructor injection |
| Coroutines | Kotlin Coroutines + Flow | — | |
| Localization | strings.xml with plurals | — | |
| Theming | Compose MaterialTheme | — | Light/Dark/High Contrast |
| Accessibility | Compose semantics | — | TalkBack, font scaling |
| Testing | JUnit, Espresso, Compose UI Test | — | |
| Utilities | SpeechRecognizer | — | Native on-device transcription |
| Build System | Gradle + KTS | — | |

---

## 4. Shared Logic — Kotlin Multiplatform (KMP)

| Component | Selection | Notes |
|---|---|---|
| Shared module | KMP with targets: iOS, Android | Domain models, repositories, use cases |
| Serialization | kotlinx.serialization | JSON, config parsing |
| Networking | Ktor client | Platform-specific engines |
| Database queries | SQLDelight (conditional) | Only if SQLCipher+FTS5 spike succeeds |
| Sync engine | Shared outbox, conflict rules, idempotency | Pure Kotlin |
| Text merge | Diff-Match-Patch | 3-way script/caption conflict resolution |
| Rich text model | Custom Markdown/CRDT model | Backs the native UI editors |
| Remote config model | Shared parser and validator | Ed25519 signature verification |
| Testing | CommonTest, kotlin.test | Shared unit tests |

**Important:** If the SQLCipher + SQLDelight KMP spike fails, fallback is fully native with mirrored domain logic. Native UI and native data drivers remain.

---

## 5. Data Persistence & Search

### 5.1 iOS Data Layer

| Component | Selection | Version | Notes |
|---|---|---|---|
| Database abstraction | GRDB.swift | Current stable | `DatabasePool`, migrations, FTS5 |
| Encryption | SQLCipher | latest | Must verify FTS5 enabled |
| Key storage | Keychain | — | Random per-install DB key |
| Full-text search | FTS5 external-content | — | `unicode61 remove_diacritics 2` |
| File protection | `NSFileProtectionComplete` | — | Database and sensitive files |
| Backups | Local encrypted SQLite copy | — | Automatic daily |

### 5.2 Android Data Layer

| Component | Selection | Version | Notes |
|---|---|---|---|
| Database abstraction | Room | Current stable | Coroutines/Flow support |
| Encryption | SQLCipher for Android | latest | `SupportOpenHelperFactory` |
| Key storage | Android Keystore | — | Random per-install DB key |
| Full-text search | FTS5 external-content via raw SQL | — | Explicit triggers |
| File protection | Internal storage | — | App-private |

### 5.3 Search Schema

- External-content FTS5 table `content_fts` with `content='search_content'`.
- Canonical `search_content` table maps entity type + ID to rowid.
- B-tree indexes for exact filters (platform, status, date, tag).
- Result pagination: max 50, cursor/keyset.
- Query latency targets: ≤100 ms p50, ≤250 ms p95 for 1–3 terms.

---

## 6. Sync & Local-First Architecture

| Component | Selection | Notes |
|---|---|---|
| Local source of truth | SQLite encrypted DB | |
| Durable outbox | `sync_operation` table | Same transaction as local change |
| Sync protocol | Custom REST API | Idempotent, per-entity ordering |
| Conflict resolution | Field-level LWW + three-way merge for text | Keep both on failure |
| Background sync | iOS BGAppRefreshTask / Android WorkManager | Checkpointed |
| Cloud backup | Client-encrypted metadata blobs | Raw media never synced |
| Encryption | TLS + client-side AES-256-GCM | Server cannot read plaintext |

---

## 7. Backend — Supabase

### 7.1 Services Used

| Service | Purpose |
|---|---|
| Supabase Auth | User accounts for cloud backup/sync (optional) |
| Postgres + RLS | Account, device, backup manifests, remote config versions, deletion requests |
| Supabase Storage | Encrypted blob storage for metadata backup |
| Edge Functions | Signed remote config endpoint, cloud backup authorization, account deletion, platform API proxy (Phase 2) |
| FCM / APNs | Phase 2 remote push notification orchestration via Edge Functions |
| RLS Policies | Per-user data isolation; default deny |

### 7.2 Remote Config

- Custom signed JSON document.
- Stored in Postgres or object storage as versioned blobs.
- Edge Function returns current version with signature.
- Client verifies Ed25519 signature using embedded public key.
- TTL and offline fallback per NFR-08.

### 7.3 Metadata Sync API

- POST `/v1/sync/operations`
- GET `/v1/sync/operations?since=...`
- POST `/v1/sync/checkpoint`
- All payloads encrypted client-side; server stores ciphertext only.

---

## 8. Authentication & Secure Storage

| Platform | Storage | Notes |
|---|---|---|
| iOS | Keychain Services | `kSecAttrAccessibleWhenUnlockedThisDeviceOnly` default |
| Android | Keystore + encrypted DataStore or EncryptedSharedPreferences | AES-GCM |
| OAuth | Authorization Code + PKCE S256 | System browser, no WebView |
| Token policies | Short-lived access tokens, rotation refresh, revoke on disconnect | |
| Root/jailbreak | None in MVP; optional risk signal Phase 2 | |

---

## 9. Media Processing

### 9.1 MVP

| Platform | Thumbnail Generation |
|---|---|
| iOS | Quick Look Thumbnailing, AVAssetImageGenerator, PHCachingImageManager |
| Android | MediaStore thumbnails, ThumbnailUtils, MediaMetadataRetriever.getScaledFrameAtTime |

- No proxy generation.
- No FFmpeg.
- App-size impact minimal.

### 9.2 Phase 2

| Platform | Proxy Generation |
|---|---|
| iOS | AVAssetExportSession with `AVAssetExportPresetLowQuality` |
| Android | Media3 Transformer |

- 360p H.264/AAC proxies.
- 15 fps default.
- 3–6 MB/minute.
- Only for selected projects/offline preview/clip marking.
- One transcode at a time.

### 9.3 Speech-to-Text

| Mode | Technology | Notes |
|---|---|---|
| On-device (Primary) | Whisper.cpp | Preserves privacy, works offline |
| Cloud (Fallback) | OpenAI Whisper API | Used when on-device is too slow or battery is low |

---

## 10. Subscription & Monetization

| Component | Selection | Notes |
|---|---|---|
| Subscription SDK | RevenueCat | iOS + Android |
| Store integration | StoreKit 2 / Google Play Billing | |
| Entitlement | Pro tier unlocks advanced features | |
| Offline behavior | Cached `CustomerInfo` | Previously verified Pro access |
| Restore | Explicit “Restore Purchases” button | |
| Webhooks | RevenueCat → backend entitlement projection | |

---

## 11. Observability & Telemetry

| Component | Selection | Notes |
|---|---|---|
| Crash reporting | Sentry | Strict privacy: no PII, client-side scrubbing |
| Performance monitoring | Sentry traces + MetricKit + Android Vitals | |
| Logging | OSLog (iOS), Timber/Logcat (Android) | Redacted, no user content |
| Metrics | Sync success, crash-free, search latency | Aggregated, no content |
| Privacy | Opt-in for non-fatal/performance; crash opt-in | No session replay/screenshots |
| Self-hosting option | GlitchTip + Prometheus | Phase 2 if needed |

---

## 12. CI/CD & Deployment

| Component | Selection | Notes |
|---|---|---|
| CI/CD | GitHub Actions | Self-hosted macOS runner for iOS |
| Mobile automation | fastlane | Build, test, deploy |
| Testing | XCTest/JUnit, Compose UI Test, XCUITest | Synthetic corpora only |
| Beta distribution | TestFlight, Google Play Internal/Closed | |
| Release | Staged rollout, phased release | |
| Backend deploy | Supabase migrations + Edge Functions | |

---

## 13. Key Libraries & Dependencies

### iOS

- GRDB.swift
- SQLCipher (via GRDB.SQLCipher or custom)
- RevenueCat
- Sentry
- UserNotifications (Local notifications for MVP)
- FirebaseMessaging (Phase 2 remote push via APNs)
- Whisper.cpp (iOS port)
- Swift Collections (optional)
- SwiftUI navigation helpers (optional)

### Android

- Room
- SQLCipher for Android
- Hilt
- Navigation Compose
- Coil (image loading for thumbnails)
- RevenueCat
- Sentry
- Local notifications (MVP)
- Firebase Cloud Messaging (Phase 2 remote push)
- Whisper.cpp (Android port)
- WorkManager
- Media3 (Phase 2)

### Shared KMP

- Kotlin Coroutines
- kotlinx.serialization
- Ktor client
- SQLDelight (only if spike succeeds)
- kotlinx-datetime
- diff-match-patch (or equivalent for text merge)

---

## 14. Licensing & Compliance Notes

| Technology | License |
|---|---|
| GRDB.swift | MIT-style |
| SQLCipher | Community/Commercial; verify FTS5 build |
| SQLite FTS5 | Public domain |
| Room / AndroidX | Apache 2.0 |
| Media3 | Apache 2.0 |
| Supabase | Open source / hosted service |
| RevenueCat | SDK free, service usage-based |
| Sentry | Open source / hosted service |
| KMP/Ktor | Apache 2.0 |
| SwiftUI/Compose | Platform SDK terms |

**Important:** Do not bundle FFmpeg without legal review. Use native media APIs for MVP.

---

## 15. Open Risks & Mitigations

| Risk | Mitigation |
|---|---|
| KMP + SQLCipher integration complexity | 2-week spike; fallback to native data drivers |
| Room + SQLCipher FTS5 availability | Verify compile option; use raw SQL migrations |
| RevenueCat offline entitlements for consumables | Use subscription only; not for consumable credits |
| Remote config stale kill switch | Hard expiry + backend enforcement for publishing |
| Sentry privacy breach | Strict `beforeSend` denylist, no replay |
| Supabase RLS misconfiguration | Test with negative access cases |
| Android background indexing limits | Checkpointed WorkManager jobs |

---

## 16. Final Stack Decision

> **CreatorOS is built as native SwiftUI + Jetpack Compose with a small KMP shared core.**
>
> **Data:** GRDB.swift + SQLCipher (iOS), Room + SQLCipher (Android), FTS5 external-content.
>
> **Backend:** Supabase with client-side encrypted metadata backup and signed remote config.
>
> **Media:** Native OS APIs for thumbnails; AVFoundation/Media3 for Phase 2 proxies.
>
> **Observability:** Sentry + MetricKit + Android Vitals, with strict privacy.
>
> **Subscription:** RevenueCat.
>
> **CI/CD:** GitHub Actions + fastlane.

This stack is optimized for a local-first, privacy-respecting, offline-capable creator app, while remaining buildable by a small team.

---

## 17. Change Log

| Version | Date | Summary |
|---|---|---|
| 1.2 | 2026-08-22 | P2 updates: navigation IA, NFR-01 thresholds, version pins, uncited claims. |
| 1.1 | 2026-08-22 | Added DEC-023 through DEC-026; updated stack and transcription semantics. |

---

**END OF TECHNOLOGY STACK DOCUMENT**
