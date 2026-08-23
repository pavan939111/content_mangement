# Technical Architecture Document — ARCHITECTURE-02: Module Design

**Product:** CreatorOS  
**Version:** 1.1  
**Status:** Updated to fix circular dependency, FTS ownership, module references, and DEC-020 alignment  
**Last Updated:** 2026-08-22  
**Related Document:** ARCHITECTURE-00 Overview, ARCHITECTURE-01 Platform & UI, ARCHITECTURE-03 Data Layer, DEC-020  

---

## 1. Purpose

This document defines the **module decomposition** of CreatorOS. It maps each functional module (FRS-01 to FRS-16, including Phase 2 modules) to internal architectural modules, specifying:

- Module responsibilities
- Public interfaces and dependencies
- Data ownership and boundaries
- Cross-module interaction patterns
- Dependency injection strategy
- Error handling boundaries
- Testing isolation

The goal is a maintainable, testable, modular monolith that can evolve into separate libraries or services later without rework.

---

## 2. Module Decomposition Principles

Derived from ARCHITECTURE-00 and NFR-11:

1. **Single responsibility**: each module owns one clear domain area.
2. **Explicit boundaries**: modules communicate through interfaces, not direct database/UI access.
3. **No circular dependencies**: dependencies flow downward (UI → Domain → Data → Platform).
4. **Feature modules are independent**: can be built/tested separately.
5. **Platform isolation**: platform-specific code isolated behind protocols/interfaces.
6. **Data ownership**: only the owning module may write to its data; others read via repository interfaces.

---

## 3. Module Catalog

We define three module layers:

- **Core Modules**: shared, domain-agnostic infrastructure.
- **Feature Modules**: user-facing functionality.
- **Service Modules**: infrastructure services used across features.

### 3.1 Core Modules

| Module | Responsibility | Key Interfaces |
|---|---|---|
| `CoreDomain` | Base entities, use-case protocols, repository interfaces, common models (ContentItem, Asset, Clip, etc.) | `Entity`, `Repository`, `UseCase`, `Result` |
| `CoreData` | Local SQLite database, migrations, FTS5 integration, transaction management. **Native per platform (GRDB/Room)** | `Database`, `Dao`, `TransactionRunner` |
| `CoreSync` | Durable outbox processing, sync queue, conflict detection/merge policies. **Shared KMP engine; native outbox writes** | `SyncEngine`, `SyncOperation`, `ConflictResolver` |
| `CorePlatform` | OS abstractions: logging, threading, device info, permission abstractions. | `Logger`, `DispatcherProvider`, `PermissionService` |
| `CoreUI/DesignSystem` | Design tokens, reusable UI components, theme management, accessibility helpers. | `Theme`, `Button`, `Card`, `EmptyState`, `LoadingView` |

### 3.2 Feature Modules

| Feature Module | FRS | Responsibility | Dependencies |
|---|---|---|---|
| `InboxModule` | FRS-02 | Idea capture, inbox, voice transcription, reminders, convert to ContentItem | CoreDomain, CoreData, CoreSync, StorageService |
| `ContentModule` | FRS-01 | ContentItem CRUD, lifecycle stages, platform variants, readiness, activity log | CoreDomain, CoreData, CoreSync, AssetModule |
| `AssetModule` | FRS-03 | Asset indexing, metadata, thumbnails/proxies, search, filters, global search | CoreDomain, CoreData, CoreSync, StorageService |
| `ClipModule` | FRS-04 | Clip library, in/out markers, source/derivative links, repurposing | CoreDomain, CoreData, CoreSync, AssetModule |
| `CalendarModule` | FRS-05 | Calendar/board/list views, readiness, at-risk warnings, reminders, batch | CoreDomain, CoreData, ContentModule, NotificationReminderModule |
| `PublishingModule` | FRS-06 | Publishing state machine, capability matrix, platform variants, native handoff, queue | CoreDomain, CoreData, CoreSync, ContentModule, RemoteConfigService |
| `IntegrationModule` | FRS-07 | Cloud storage connections, local/external drive indexing, share-sheet, editor links | CoreDomain, CoreData, CoreSync, AssetModule |
| `OnboardingSettingsModule` | FRS-09 | First-run, permissions, settings, account, privacy, support | CoreDomain, CoreData, CoreSync, IntegrationModule, NotificationReminderModule |
| `ScriptEditorModule` | FRS-10 | Script editor, formatting, version history, teleprompter, import/export | CoreDomain, CoreData, CoreSync, ContentModule |
| `MediaPreviewModule` | FRS-11 | Image/video/audio/PDF preview, scrubbing, timecode, transcript sync, clip marking | CoreDomain, CoreData, AssetModule, ClipModule |
| `NotificationReminderModule` | FRS-12 | Notifications, reminders, trash, undo, revision history | CoreDomain, CoreData, CoreSync, PublishingModule |
| `DataTransferModule` | FRS-13 | Export/import, backup/restore, migration | CoreDomain, CoreData, CoreSync, StorageService |
| `SubscriptionModule` | FRS-14 | Plans, entitlements, purchase, restore, grace period | CoreDomain, CoreData, RemoteConfigService |
| `AnalyticsModule` | FRS-15 (Phase 2) | Cross-platform metrics, creative comparison, retention overlay, review prompts | CoreDomain, CoreData, PublishingModule, IntegrationModule |
| `CollaborationModule` | FRS-16 (Phase 2) | Sharing, comments, approvals, asset handoff | CoreDomain, CoreData, IntegrationModule, PublishingModule |

**Fixed:** Previous version had a circular dependency (`ClipModule → MediaPreviewModule` and `MediaPreviewModule → ClipModule`). This is resolved: `MediaPreviewModule` depends on `ClipModule` for saving clips, but `ClipModule` does **not** depend on `MediaPreviewModule`. Clip marking UI lives in MediaPreview, while Clip data and domain logic live in ClipModule.

### 3.3 Service Modules

| Service Module | Responsibility | Used By |
|---|---|---|
| `StorageService` | Abstract file storage across local, cloud, external; generate thumbnails/proxies | AssetModule, MediaPreviewModule, DataTransferModule |
| `RemoteConfigService` | Fetch/cache remote config, capability matrix, feature flags, platform rules | PublishingModule, SubscriptionModule, AnalyticsModule |
| `PlatformAPIService` | Server-mediated platform APIs (publish, analytics) | PublishingModule, AnalyticsModule |
| `MediaProcessingService` | Video thumbnail, proxy generation, audio waveform, transcription | AssetModule, MediaPreviewModule, InboxModule |
| `PermissionService` | Contextual permission requests and status | InboxModule, IntegrationModule |
| `BackupRestoreService` | Local/cloud backup, restore operations | DataTransferModule, CoreSync |

---

## 4. Module Interfaces and Data Ownership

Each feature module exposes a set of use cases and repository interfaces. Other modules access data only through these interfaces, never directly via DAOs or database tables.

### 4.1 Example: ContentModule Public Interface

```
protocol ContentItemRepository {
    func createItem(_ item: ContentItemDraft) async throws -> ContentItem
    func updateItem(_ item: ContentItem) async throws
    func deleteItem(id: UUID, soft: Bool) async throws
    func getItem(id: UUID) async throws -> ContentItem?
    func getItems(filter: ContentFilter, page: Pagination) async throws -> [ContentItem]
    func observeItems(filter: ContentFilter) -> AsyncStream<[ContentItem]>
    func addAssetReference(itemId: UUID, assetRef: AssetReference) async throws
    func removeAssetReference(itemId: UUID, assetRefId: UUID) async throws
    func addPlatformVariant(itemId: UUID, variant: PlatformVariant) async throws
    func computeReadiness(itemId: UUID) async throws -> ReadinessState
    func getActivityLog(itemId: UUID) async throws -> [ActivityEvent]
}
```

Other modules interact with ContentModule via `ContentItemRepository`, not by importing `ContentDao`.

### 4.2 Data Ownership Rules

| Module | Owns Tables/Data |
|---|---|
| Inbox | Ideas, CaptureRecords, TranscriptionJobs |
| Content | ContentItems, PlatformVariants, ActivityLog, ContentAssetLinks |
| Asset | Assets, Tags, AssetMetadata, Thumbnails/ProxyRefs, DuplicateGroups |
| Clip | Clips, SourceDerivativeLinks |
| Calendar | No persistent tables beyond ContentItem dates; reminders are in Notification module |
| Publishing | PublishingStates, PublishingAttempts, LiveURLs, CapabilityMatrixCache |
| Integration | StorageConnections, ExternalDriveCatalogs, ImportJobs |
| NotificationReminder | Reminders, NotificationPreferences, TrashEntries, UndoActions, RevisionHistory |
| DataTransfer | BackupRecords, RestoreJobs, ExportBundles |
| Subscription | Entitlements, PurchaseRecords |
| CoreSync | Outbox, SyncQueue, ConflictRecords |
| CoreData | FTS5 virtual tables and trigger definitions shared across modules |

**Fixed:** Previous version stated AssetModule "owns the global FTS index across entities." That was inconsistent. The FTS virtual tables and search index are owned by `CoreData`; AssetModule's `SearchService` queries them through a common search interface. Each feature module owns its canonical data and its own FTS trigger definitions.

---

## 5. Cross-Module Interaction Patterns

### 5.1 Synchronous Use-Case Calls

- Direct method calls for immediate reads/writes within same process.
- Example: Calendar module calls `ContentModule.getItems(filter: stage == .scheduled)` to show calendar items.
- Must be asynchronous (async/await or coroutines) to avoid blocking UI.

### 5.2 Event/Observation Patterns

- For cross-module state changes, use observation (AsyncStream/StateFlow/Combine).
- Example: Asset module observes ContentModule’s asset link changes to update usage history; Calendar observes ContentItem changes to refresh readiness.

### 5.3 Transactional Boundaries

- Only the owning module can initiate a write transaction on its data.
- If a use case spans two modules (e.g., converting Idea → ContentItem), it uses a **transactional use case** in the app layer, not inside a single module.
- Cross-module transactions are coordinated via a `TransactionManager` exposed by CoreData. The use case executes:

```
transaction {
    inboxRepository.deleteIdea(id)
    contentRepository.createItem(draft)
    syncEngine.enqueueOperation(.createItem)
}
```

If any step fails, rollback all.

**DEC-020:** The sync engine enqueue is implemented natively within the repository, inside the same transaction. The shared KMP sync engine does not directly write to the outbox; it only processes queued operations after commit.

### 5.4 Sync Integration

- Every module that owns syncable data must enqueue a sync operation within the same local transaction as its own change.
- CoreSync provides `SyncEngine.enqueue(operation)`. The owning module calls it **inside the native transaction**; the transaction ensures atomicity.
- Example: ContentModule update item → enqueue `content_item.update` operation.

### 5.5 Search Integration

- CoreData owns the global FTS index across entities.
- AssetModule hosts the `SearchService` that queries across Ideas, ContentItems, Assets, Clips, Scripts, Transcripts.
- Other modules use `SearchService.search(query, entityTypes, filters)`.
- SearchService delegates to CoreData’s FTS accessor, joining with each module’s canonical tables via views or relationships.

---

## 6. Dependency Injection Strategy

Use **constructor injection** for all modules and services, with a manual composition root or a DI framework.

| Platform | DI Framework |
|---|---|
| iOS | `Resolver` or manual composition root |
| Android | Hilt (Dagger) |

- Modules depend on protocol interfaces, not concrete types.
- The composition root constructs the object graph: services, repositories, use cases, view models.
- No service locator used inside feature modules to avoid hidden dependencies.

### Example Composition Root (simplified)

```
let database = try SQLiteDatabase(configuration)
let syncEngine = SyncEngine(database: database, api: metadataAPI)
let assetRepository = AssetRepository(database: database, storageService: storageService)
let contentRepository = ContentRepository(database: database, syncEngine: syncEngine)
let searchService = SearchService(database: database)
let viewModel = LibraryViewModel(
    assetRepository: assetRepository,
    searchService: searchService
)
```

This allows unit tests to inject mocks.

---

## 7. Error Handling Boundaries

Each module defines its own error types and maps them to user-facing messages at the UI layer.

| Module | Error Examples | User Message |
|---|---|---|
| CoreData | `databaseCorrupt`, `writeFailed` | “Unable to save. Check storage and try again.” |
| CoreSync | `conflictDetected`, `authExpired`, `quotaExceeded` | Specific messages from NFR-02/NFR-08 |
| Storage | `fileMissing`, `driveDisconnected`, `permissionDenied` | “Original file not found. Reconnect drive or locate file.” |
| Integration | `oauthRevoked`, `connectionFailed` | “Reconnect Google Drive.” |

- Modules should not throw raw technical errors across boundaries.
- Use `Result<T, DomainError>` types at repository interfaces.
- UI layer maps `DomainError` to localized, actionable messages.

---

## 8. Module Testing Isolation

| Test Type | Strategy |
|---|---|
| Unit tests | Test each module in isolation with mock repositories/services. |
| Integration tests | Combine modules: e.g., ContentModule + CoreData + CoreSync to test transactional outbox. |
| UI tests | Use fake repositories preloaded with fixtures. |
| Cross-module contract tests | Ensure interfaces remain compatible when modules evolve. |

Each module has a public API test suite that verifies:
- inputs and outputs
- error conditions
- sync outbox enqueue on writes
- no direct database leaks

---

## 9. Phase 2 Modules Integration

Phase 2 modules (Analytics, Collaboration) are designed as isolated modules that plug into the same architecture.

| Phase 2 Module | Integration Point |
|---|---|
| Analytics | Reads from ContentModule (content items), PublishingModule (live URLs), and IntegrationModule (platform accounts). Writes to its own analytics cache tables. |
| Collaboration | Uses ContentModule and AssetModule for shared items; adds CollaborationModule-specific tables for comments, approvals, share links. Integrates with PublishingModule for approved asset handoff. |

They do not alter existing module contracts in MVP, only add new repositories.

---

## 10. Module Dependency Graph

```
UI Layer
   ↓
Feature Modules (Inbox, Content, Asset, Clip, Calendar, Publishing, etc.)
   ↓
CoreDomain interfaces
   ↓
CoreData / CoreSync / CorePlatform implementations
   ↓
Service Modules (Storage, RemoteConfig, PlatformAPI, MediaProcessing)
```

No upward dependencies. Feature modules may depend on other feature modules only through their public repository interfaces (e.g., Calendar → Content), never through internal classes.

---

## 11. Architectural Decisions Record (ADR) Summary

| Decision | Rationale |
|---|---|
| Modular monolith | Simpler than microservices, meets MVP needs, can extract later. |
| Feature modules with repository interfaces | Clean boundaries, testability. |
| Transactional outbox across modules | Ensures atomicity of local writes + sync enqueue. Native insert (DEC-020). |
| CoreData owns FTS | Avoids ownership conflict; modules own canonical data and triggers. |
| Constructor injection | Explicit dependencies, testable. |
| DomainError mapping | Consistent user communication. |
| MediaPreview → Clip one-way dependency | Prevents circular dependency. |

---

## 12. Source References

- [Android Guide to App Architecture](https://developer.android.com/topic/architecture)  
- [Apple App Architecture](https://developer.apple.com/documentation/swiftui/app-architecture)  
- [Ink & Switch Local-First](https://www.inkandswitch.com/essay/local-first/local-first.pdf)  
- [SQLite FTS5](https://www.sqlite.org/fts5.html)  
- [OWASP Mobile Security](https://cheatsheetseries.owasp.org/cheatsheets/Mobile_Application_Security_Cheat_Sheet.html)
