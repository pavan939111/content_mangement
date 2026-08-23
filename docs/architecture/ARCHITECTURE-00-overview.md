# Technical Architecture Document — ARCHITECTURE-00: Overview

**Product:** CreatorOS  
**Version:** 1.1  
**Status:** Updated to reflect DEC-001 and DEC-020  
**Last Updated:** 2026-08-22  
**Related Documents:** PRD, FRS modules, NFR documents, DEC-001, DEC-020  

---

## 1. Executive Summary

CreatorOS is a **local-first, offline-first mobile application** for solo short-form content creators. Its primary value is to provide a **single content workspace** that connects idea capture, script writing, media organization, search, repurposing, planning, and publishing handoff—without duplicating or replacing existing creative tools.

The architecture is built around three principles:

1. **Local database is the source of truth.** All user content is stored on-device and works fully offline.
2. **Cloud is optional and asynchronous.** Metadata sync and backup are user-controlled and never required for core functionality.
3. **Integrate, don’t replace.** CreatorOS connects to existing storage (Drive/Dropbox/local), editors (CapCut/Canva), and social platforms (native handoff), rather than trying to substitute them.

The system uses a **modular monolith** on mobile with a **lightweight backend** for remote configuration, optional cloud backup, and platform API mediation. This architecture balances simplicity, reliability, and long-term scalability while respecting platform constraints and privacy expectations.

---

## 2. Goals and Constraints

### 2.1 Architectural Goals

| Goal | Description |
|---|---|
| Offline-first | All core features must work without connectivity. |
| Local-first durability | User data survives app restart, device reboot, and network loss. |
| Low friction adoption | No mandatory account, minimal permissions, quick time-to-value. |
| Privacy by design | Raw media stays on user device by default; only metadata/thumbnails managed. |
| Trust and transparency | Full export, no data lock-in, clear free/paid boundaries. |
| Integrability | Works alongside existing tools, not as a replacement. |
| Performance | Search and capture must feel instant; background work throttled. |
| Maintainability | Modular, testable, observable, and compliant. |

### 2.2 Key Constraints

| Constraint | Source |
|---|---|
| iOS background execution limited (~30 s refresh tasks) | Apple BackgroundTasks |
| Android background jobs may be stopped (~10 min) | Android WorkManager/JobScheduler |
| Platform API rate limits and changing rules | YouTube, TikTok, Instagram, X |
| Mobile storage and battery limitations | NFR-03, NFR-04 |
| User trust sensitivity to subscription/pricing | Validated pain points #60–67, #76–80 |
| Accessibility compliance (WCAG 2.2 AA) | NFR-06 |

These constraints directly inform architectural decisions.

---

## 3. Architectural Style

### 3.1 Chosen Style: Local-First, Offline-First, Modular Monolith with Native UI and Shared KMP Core

CreatorOS uses a **modular monolith** with **native iOS (SwiftUI) and Android (Jetpack Compose) user interfaces**, and a **Kotlin Multiplatform (KMP) shared core** for domain logic, sync engine policies, API contracts, and remote configuration models.

**Key architectural decisions (DEC):**

- **DEC-001:** Native UI + shared KMP core. This means the UI layer is fully native, while the domain and sync logic are shared. However, the **database drivers and transactional outbox writes are platform-specific** (GRDB on iOS, Room on Android). The KMP shared core does not directly perform database transactions; instead, it defines the sync operation protocol and conflict resolution policies, which are implemented natively in the data layer within the local transaction boundary.
- **DEC-020:** Outbox transaction boundary. To preserve the atomic invariant "content mutation + sync enqueue in same transaction," the outbox insert is performed by the platform-native data layer (GRDB/Room) inside the same transaction as the canonical write. The shared KMP sync engine only processes queued operations after they are committed locally.

This hybrid approach leverages KMP for business logic while keeping the critical local-first data integrity guarantees in native code, where they are most reliable.

### 3.2 Why Not Other Styles?

| Rejected Style | Reason |
|---|---|
| Microservices | Too complex for MVP; unnecessary distributed system overhead. |
| Cross-platform UI (Flutter/React Native) | Weaker native media/storage/accessibility integration. DEC-001 chose native UI for best platform fidelity. |
| Full server-centric | Violates local-first requirement; would require connectivity and increase privacy risk. |
| Fully native with duplicated logic | Higher maintenance for a small team; KMP reduces duplication in domain/sync without compromising native UI. |

---

## 4. High-Level System Components

```
┌─────────────────────────────── Mobile App (iOS / Android) ────────────────────────────────┐
│                                                                                          │
│  Presentation Layer (SwiftUI / Jetpack Compose) — native                                 │
│                                                                                          │
│  Shared KMP Core:                                                                        │
│    Domain entities, use cases, sync policies, conflict rules, API contracts, remote config│
│                                                                                          │
│  Data Layer — native per platform:                                                       │
│    iOS: GRDB.swift + SQLCipher + FTS5                                                     │
│    Android: Room + SQLCipher + FTS5                                                      │
│    File Store (Thumbnails/Proxies/Temp)                                                  │
│    Sync Outbox (native transactional insert)                                             │
│                                                                                          │
│  Platform Adapters (Storage/Media/Background)                                            │
│                                                                                          │
└───────────────────────────────┬──────────────────────────────────────────────────────────┘
                                │ HTTPS / OAuth / Sync
                                ▼
┌─────────────────────────────── Lightweight Backend / Cloud ──────────────────────────────┐
│                                                                                          │
│  Remote Config Service          (platform rules, capability matrix)                     │
│  Metadata Sync API              (optional, encrypted)                                    │
│  Cloud Backup Service           (optional, client-side encryption)                       │
│  Platform API Proxy             (OAuth, rate limiting, status polling)                   │
│  Analytics Aggregation          (Phase 2)                                                │
│                                                                                          │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

### 4.1 Mobile App Layers

| Layer | Responsibility |
|---|---|
| Presentation | UI components, navigation, state binding, accessibility. |
| Shared KMP Core | Domain models, use case contracts, sync engine state machine, conflict policy, API DTOs, remote config model. |
| Data (native) | Local persistence, search, transactional outbox writes, file management, remote data sources. |
| Platform Adapters | OS-specific integrations: storage providers, social APIs, media codecs, background tasks. |

### 4.2 Backend Services

| Service | MVP Phase |
|---|---|
| Remote Config | Must (minimal) |
| Metadata Sync API | Phase 2 |
| Cloud Backup | Phase 2 |
| Platform API Proxy | Phase 2 |
| Analytics Aggregation | Phase 2 |

The backend is intentionally lightweight; the app functions fully without it.

---

## 5. Key Architectural Principles with Evidence

### 5.1 Local-First Data Ownership

**Principle:** User content is stored locally and owned by the user. Cloud is optional replication.

**Evidence:**  
- Ink & Switch’s *Local-First Software* essay argues that local-first apps provide better user agency, privacy, and offline support.  
- Validated pain point: creators fear data lock-in and subscription trust issues (NFR-05, FRS-13).  
- Notion/Milanote offline limitations cause user frustration (validated pain #54–55).

**Implementation:** SQLite with FTS5 is the source of truth; sync outbox persists changes before cloud.

### 5.2 Offline-First by Default

**Principle:** Every core action works without network.

**Evidence:**  
- Apple/Android background execution limits make guaranteed sync impossible; local-first is the only reliable path.  
- Creators often work in mobile/offline conditions (validated pain #57, #58).  
- NFR-02 requires 100% local durability.

### 5.3 Integrate, Don’t Replace

**Principle:** CreatorOS coordinates with existing tools, not replace them.

**Evidence:**  
- Validated pain: creators prefer specialist tools (CapCut, Canva) and multi-tool stacks (FRS-07).  
- Building an editor or design suite would be high effort, low differentiation.

### 5.4 Bring-Your-Own-Storage

**Principle:** Raw media remains in user-selected storage; only metadata/thumbnails indexed.

**Evidence:**  
- Storage cost and privacy are major trust concerns (validated pain #32, #66–67).  
- NFR-03 mandates no raw media upload by default.

### 5.5 Platform-Aware Publishing Handoff

**Principle:** System clearly distinguishes auto-publish, native handoff, and unsupported actions.

**Evidence:**  
- Platform APIs have varying limits and native-only features (NFR-08).  
- Validated pain #21–22, #71–75: publishing reliability and cross-posting friction.

### 5.6 Server-Mediated Integrations

**Principle:** OAuth secrets, rate limits, and remote config centralized in a lightweight backend.

**Evidence:**  
- RFC 8252 requires PKCE for native apps, but client secrets still must not be embedded.  
- Platform rate limits need centralized quota control (NFR-08).  
- Remote config must be signed and controlled server-side (NFR-08).

---

## 6. Data Flow Overview

### 6.1 Local Content Creation

1. User creates/edits content in UI.
2. ViewModel calls Domain UseCase (from shared KMP core).
3. UseCase delegates to native repository (iOS/Android) to perform a **single local transaction**:
   - Apply canonical table update.
   - Increment `local_revision`.
   - Update `search_content`.
   - Insert `sync_operation` row (if sync enabled).
4. UI receives confirmation only after local commit.
5. Sync engine (shared KMP logic) later reads pending operations from outbox and attempts upload.

### 6.2 Search Flow

1. User types query.
2. UI debounces input (100–150 ms).
3. UseCase queries FTS5 with filters via native repository.
4. Results returned ≤100 ms median.
5. Thumbnails loaded asynchronously.

### 6.3 Sync Flow (Optional Cloud Backup)

1. Connectivity returns.
2. Sync worker (platform-native trigger) calls shared KMP sync engine.
3. Sync engine reads pending operations from native outbox table.
4. Operations uploaded via HTTPS to Metadata Sync API.
5. Server acknowledges; native repository marks operations complete.
6. Conflicts handled per NFR-02 using shared KMP conflict policies.

### 6.4 Publishing Handoff (MVP)

1. User selects Content Item → target platform.
2. System checks remote config capability matrix (from shared KMP model).
3. If native handoff needed, copies caption, provides deep link/reminder.
4. User marks Published manually with URL.
5. Publishing state stored locally in native DB.

---

## 7. Cross-Cutting Concerns Mapped to NFRs

| Concern | Addressed By | NFR |
|---|---|---|
| Performance | Async DB, FTS pagination, thumbnail caching | NFR-01 |
| Offline reliability | Durable outbox, conflict resolution | NFR-02 |
| Storage management | BYO storage, cache quotas | NFR-03 |
| Battery/thermal/memory | Background throttling, device-class budgets | NFR-04 |
| Security/privacy | SQLCipher, Keychain/Keystore, no raw media upload | NFR-05 |
| Accessibility | Semantic UI, dynamic type, VoiceOver/TalkBack | NFR-06 |
| App size/resources | No FFmpeg/ML in base, on-demand modules | NFR-07 |
| Platform integration | Remote config, capability matrix, rate-limit proxy | NFR-08 |
| Reliability/data integrity | Transactional writes, backup/restore, tombstones | NFR-09 |
| Localization/theming | Externalized strings, light/dark/system, RTL | NFR-10 |
| Maintainability/observability | Modular architecture, logging, crash reporting | NFR-11 |

---

## 8. Architecture Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Sync conflicts leading to data loss | Durable outbox, field-level LWW, conflict copies, revision history |
| Platform API changes breaking publishing | Remote config capability matrix, native handoff first |
| External drive disconnection | Persistent catalog with availability state |
| Large media library performance | Metadata-only indexing, FTS5 bounded queries, proxy/thumbnail caching |
| OAuth token compromise | PKCE, secure storage, short-lived tokens, rotation |
| User distrust of subscription | Transparent pricing, no retroactive paywalls, full export |
| Android fragmentation | Min API 28, scoped storage via SAF, device-class budgets |
| iOS background restrictions | Local-first, small checkpointed tasks |

---

## 9. Technology-Agnostic Decisions

| Decision | Rationale |
|---|---|
| Modular monolith | Simpler than microservices for MVP; modules communicate via interfaces. |
| SQLite + FTS5 | Proven local search, transactional, external-content reduces duplication. |
| Durable outbox | Ensures sync reliability and idempotency. Native transactional insert. |
| Server-mediated integrations | Centralized rate limits, OAuth, and remote config. |
| BYO storage | Respects user storage and privacy. |
| Native UI + shared KMP core | Best platform integration and UX, with shared domain/sync logic. |

Actual tech stack selections are in `ARCHITECTURE-11: Technology Stack`.

---

## 10. Source References

- [Ink & Switch — Local-First Software](https://www.inkandswitch.com/essay/local-first/local-first.pdf)  
- [SQLite FTS5 Documentation](https://www.sqlite.org/fts5.html)  
- [Apple BackgroundTasks](https://developer.apple.com/documentation/BackgroundTasks)  
- [Android WorkManager](https://developer.android.com/develop/background-work/background-tasks/persistent/getting-started/define-work)  
- [RFC 8252 — OAuth for Native Apps](https://www.rfc-editor.org/rfc/rfc8252.txt)  
- [RFC 9700 — OAuth 2.0 Security BCP](https://www.rfc-editor.org/rfc/rfc9700.pdf)  
- [OWASP Mobile Application Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Mobile_Application_Security_Cheat_Sheet.html)  
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)  
- [Android App Architecture Guide](https://developer.android.com/topic/architecture)  
- [Google Play App Size](https://play.google.com/console/about/appsize/)
