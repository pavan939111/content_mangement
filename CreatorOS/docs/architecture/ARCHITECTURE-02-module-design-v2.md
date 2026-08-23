# Technical Architecture Document — ARCHITECTURE-02 v2: Module Design

**Product:** CreatorOS v2  
**Version:** 2.0  
**Status:** Draft for Validation  
**Date:** 2026-08-23  
**Related PRD:** v2/creator_os_prd_v2.md  
**Reference to v1:** ../../../docs/architecture/ARCHITECTURE-02-module-design.md

---

## 1. Purpose

This document defines the **v2 module design** for CreatorOS.

It does not repeat the v1 module catalog where unchanged. Stable v1 modules are referenced. This document focuses on new v2 modules introduced by the connected workspace direction.

---

## 2. Reference to v1 Stable Modules

The following v1 modules remain valid and are reused:

- CoreDomain, CoreData, CoreSync, CorePlatform: v1 ARCH-02 §3.1
- InboxModule, CalendarModule, ScriptEditorModule, MediaPreviewModule, NotificationReminderModule, DataTransferModule: v1 ARCH-02 §3.2
- StorageService, RemoteConfigService, MediaProcessingService: v1 ARCH-02 §3.3

Where v2 changes behavior, the new modules below supersede or extend v1 modules.

---

## 3. New v2 Modules

| Module | Responsibility | FRS Reference |
|---|---|---|
| `ConnectedRecordModule` | Owns the Connected Content Record: core fields, external source links, next action, status, delivery state. | FRS-01 v2 |
| `ConnectorFrameworkModule` | Connector abstraction, account connection lifecycle, capability registry, OAuth state, health model. | FRS-07 v2 |
| `CrossToolSearchModule` | Federated search across local index and connected sources, result normalization, source provenance. | FRS-03 v2 |
| `HandoffActionModule` | Deep links, share sheets, document pickers, action receipts, delivery review state. | FRS-06 v2 |
| `ConnectionHealthModule` | Aggregates connection health, affected records, reconnection flows, verification receipts. | FRS-07 v2 |
| `BackendConnectorServiceModule` | Backend-side provider adapters, job queue, retries, webhooks, rate limiting, normalized index. | ARCH-07 v2 |

---

## 4. Module Boundaries and Data Ownership

| Module | Owns Data/Tables |
|---|---|
| ConnectedRecordModule | content_record, external_source_link, record_status, delivery_state |
| ConnectorFrameworkModule | connection_account, connector_capability, connection_health |
| CrossToolSearchModule | search_index_cache, external_result_cache |
| HandoffActionModule | action_receipt, handoff_action |
| BackendConnectorServiceModule | provider_operation, connector_job, webhook_event, sync_cursor |

---

## 5. Cross-Module Interaction

### 5.1 ConnectedRecordModule

Depends on:
- ConnectorFrameworkModule to resolve and validate external sources.
- CrossToolSearchModule to attach search results.
- HandoffActionModule to log actions and receipts.
- ConnectionHealthModule to show record-level health summary.

### 5.2 ConnectorFrameworkModule

Depends on:
- CorePlatform for secure storage.
- BackendConnectorServiceModule for provider-specific execution.
- RemoteConfigService for capability matrix.

### 5.3 CrossToolSearchModule

Depends on:
- CoreData for local FTS index.
- ConnectorFrameworkModule to know active connections.
- BackendConnectorServiceModule for external provider search.

### 5.4 HandoffActionModule

Depends on:
- CorePlatform for deep links/share sheets.
- ConnectorFrameworkModule for target provider info.
- ConnectedRecordModule for target record context.

### 5.5 ConnectionHealthModule

Depends on:
- ConnectorFrameworkModule for account status.
- ConnectedRecordModule to compute impacted records.

---

## 6. Dependency Graph

```text
UI Layer
  ↓
ConnectedRecordModule / CrossToolSearchModule / HandoffActionModule
  ↓
ConnectorFrameworkModule / ConnectionHealthModule
  ↓
CoreDomain / CoreData / CoreSync / CorePlatform
  ↓
BackendConnectorServiceModule (via network)
```

No circular dependencies. Feature modules use repository interfaces only.

---

## 7. Error Handling

Each v2 module maps errors to user-safe categories:

| Module | Error Examples | User Message |
|---|---|---|
| ConnectedRecordModule | invalid source link, missing required link | "Missing brief. Attach a document." |
| ConnectorFrameworkModule | auth_expired, rate_limited, permission_missing | "Reconnect Google Drive." |
| CrossToolSearchModule | provider_down, stale_result | "Some results may be outdated." |
| HandoffActionModule | deep_link_failed, share_failed | "Couldn't open CapCut. Try sharing instead." |
| BackendConnectorServiceModule | job_failed, webhook_timeout | "Action queued but not completed." |

---

## 8. Testing Strategy

| Module | Test Type |
|---|---|
| ConnectedRecordModule | Unit tests for next action, source link validation |
| ConnectorFrameworkModule | OAuth flow tests, capability registry tests |
| CrossToolSearchModule | Local + external search integration tests, source provenance |
| HandoffActionModule | Receipt integrity tests, deep link fallback tests |
| ConnectionHealthModule | Health state transitions, impact calculation |

---

## 9. Phase 2 Modules

Future modules:

- SocialPublishingModule — scheduled publishing via provider APIs.
- CollaborationModule — approvals and shared client views.
- AnalyticsModule — outcome tracking and lightweight insights.

These are explicitly out of scope for v2 MVP.

---

## 10. Change Log

| Version | Date | Summary |
|---|---|---|
| 2.0 | 2026-08-23 | New v2 module design. References v1 stable modules. |
