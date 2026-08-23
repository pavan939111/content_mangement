# Technical Architecture Document — ARCHITECTURE-00 v2: Overview

**Product:** CreatorOS v2  
**Version:** 2.0  
**Status:** Draft for Validation  
**Date:** 2026-08-23  
**Related PRD:** v2/creator_os_prd_v2.md  
**Reference to v1:** ../../../docs/architecture/ARCHITECTURE-00-overview.md

---

## 1. Purpose

This document defines the **v2 technical architecture** for CreatorOS.

It does not repeat v1 architecture details that remain valid. Where v1 concepts are stable, they are referenced.

CreatorOS v2 is a **mobile control plane plus cloud integration plane**. The mobile app remains local-first for capture and core content records, while a lightweight backend executes durable connector work—search, sync, webhooks, retries, and rate-limit management.

---

## 2. Reference to v1 Stable Architecture

The following v1 architecture decisions remain valid and are reused:

- Native SwiftUI + Jetpack Compose UI: v1 ARCH-01
- Local-first database with SQLCipher + FTS5: v1 ARCH-03
- Durable outbox and local sync: v1 ARCH-04
- Bring-your-own-storage model: v1 ARCH-05
- Security and OAuth token storage: v1 ARCH-06
- Observability approach: v1 ARCH-08
- Deployment and CI/CD: v1 ARCH-09

Where v2 changes behavior, this document and later v2 architecture documents supersede v1.

---

## 3. What Changed from v1

| Dimension | v1 | v2 |
|---|---|---|
| Product role | Local-first content workspace | Mobile content record + tool orchestration |
| Core object | Content Item | Connected Content Record |
| Data model | Internal entities and manual links | External source links, provenance, receipts |
| Network model | Offline-first core; optional cloud backup | Mobile control plane + cloud integration plane |
| Backend scope | Remote config, optional backup | Connector gateway, job queue, sync (webhooks Phase 2) |
| Integrations | Storage references, deep links | OAuth-connected tools with health and actions |
| Primary user | General solo creator | Professional UGC creator |

---

## 4. High-Level System Architecture

```text
┌──────────────────────────── CreatorOS Mobile App (iOS/Android) ─────────────────────────────┐
│                                                                                            │
│  Native UI: SwiftUI / Jetpack Compose                                                      │
│  Domain: KMP shared core for content record, connector state, receipts, policies          │
│  Local Data: SQLite + SQLCipher + FTS5 for records, links, receipts, local search         │
│  Connection Manager: OAuth flows, secure token handling, connector status                 │
│  Action Layer: handoff actions, deep links, share sheets, document picker                 │
│  Offline Action Outbox: local pending actions                                             │
│                                                                                            │
└────────────────────────────────────┬───────────────────────────────────────────────────────┘
                                     │ HTTPS / OAuth / sync
                                     ▼
┌──────────────────────────── CreatorOS Backend / Cloud Integration Plane ───────────────────┐
│                                                                                            │
│  OAuth callback & token vault                                                                │
│  Connector registry & provider adapters                                                      │
│  Capability registry                                                                         │
│  Job queue, retry worker, rate-limit scheduler                                              │
│  Incremental sync (webhook ingestion: Phase 2)                                               │
│  Normalized content-metadata index                                                           │
│  Operation/audit log                                                                         │
│  Remote config & capability matrix                                                           │
│                                                                                            │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Core Architecture Principles

### 5.1 Mobile is the command surface, not the automation host

Phones cannot run long-lived automation or persistent local MCP servers. They can:

- Capture ideas offline
- View linked sources
- Trigger foreground actions
- Open tools via deep links/share sheets
- Queue durable work

Durable execution belongs to the backend.

### 5.2 The Connected Content Record is the product center

Every workflow links back to one record containing external source references, source provenance, next action, receipts, and health summary.

### 5.3 Integration modes are explicit

| Mode | Examples | Label |
|---|---|---|
| Connected account | Google Drive, Docs, Calendar, Notion | "Connected: search and act" |
| App handoff | Canva, CapCut, Apple Notes | "Open or share with app" |
| Publishing integration | Social platforms | Phase 2 |
| Device integration | Apple Reminders | iOS-only, future |

### 5.4 Connection health is first-class

Users must know when a connected account is stale, expired, or failed, and which records are affected.

### 5.5 Action receipts build trust

Every external action is logged with outcome type and evidence. Verified outcomes are separated from user-confirmed outcomes.

### 5.6 Provider APIs direct, MCP only where stable

CreatorOS uses direct provider APIs and OAuth as primary. MCP may be used as an internal adapter if a provider’s remote MCP server is stable, but is not the product story.

### 5.7 Agentic Future Alignment

The MVP architecture is manual-first, but it is designed to support an agentic command layer in Phase 2.

Key enablers already present:
- Capability registry in the connector framework
- Action receipts for every external action
- Connection health model
- Backend connector service with idempotent jobs

In Phase 2, a new Agent/Intent Engine module will consume the same connector capabilities and receipts, allowing creators to instruct CreatorOS in natural language and receive a plan of actions with confirmations.

No MVP decision should create a closed architecture that prevents later automation. All external actions remain capability-based, approval-safe, and auditable.

---

## 6. Key Data Flows

### 6.1 Connect a Tool

1. User taps Connect Google Drive.
2. App opens system browser OAuth.
3. Backend or app exchanges code, stores tokens securely.
4. App shows connection as Healthy and lists capabilities.
5. Receipt logged.

### 6.2 Search Across Tools

1. User enters query.
2. App returns local indexed results instantly.
3. Backend executes scoped provider searches in parallel.
4. External results are appended with source and health status.
5. User can open or attach results.

### 6.3 Handoff and Receipt

1. User taps "Open in CapCut" or "Share video."
2. App performs deep link/share sheet.
3. App logs receipt: action, target, timestamp, outcome, evidence.
4. If deep link fails, fallback shown and receipt state `failed`.

### 6.4 Connection Health Recovery

1. Backend detects expired token or failed sync.
2. App marks affected records with warning.
3. User taps Reconnect.
4. OAuth reauthorization.
5. Verify and log receipt.

---

## 7. Cross-Cutting Concerns Mapped to NFRs

| Concern | v2 Impact | Reference |
|---|---|---|
| Performance | Local search ≤100 ms; connected search ≤2.0 s p95 (see NFR-01-v2) | v1 NFR-01 + v2 update |
| Offline & sync | Local capture/offline receipts; connector-aware sync | v2 NFR-02 |
| Storage & bandwidth | Connector API quota usage; cached external metadata | v2 NFR-03 |
| Security & privacy | OAuth tokens per connector; scopes; no secrets | v2 NFR-05 |
| Integration & remote config | Connector health SLOs; capability matrix | v2 NFR-08 |
| Reliability | Receipt integrity; external state consistency | v2 NFR-09 |
| Cost & capacity | Connector API cost model | v2 NFR-12 |

---

## 8. Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Provider APIs change or break | Connector adapter isolation, remote config, health monitoring |
| OAuth complexity | System-browser PKCE, scoped tokens, per-provider vault |
| Rate limits | Backend central quota, caching, backoff, user-visible wait state |
| Tool lacks API | Handoff-only mode: deep link, share sheet, picker |
| User distrust | Plain-language permissions, receipts, easy disconnect |
| Connected search slow | Local-first results + async external results |
| Mobile background limits | Backend executes durable jobs |
| Connection fatigue | Health center with one-tap recovery |

---

## 9. MVP Connector Set

| Connector | Mode | Required Capabilities |
|---|---|---|
| Google Drive | Connected account | Search files, read metadata, attach, open |
| Google Docs | Connected account | Search docs, read title/snippet, attach, open |
| Google Calendar | Connected account | Read events, create due-date event, open |
| Notion | Connected account | Search pages, read title/snippet, attach, open |
| Canva | App handoff | Deep link/open design, share export |
| CapCut | App handoff | Share media, open project/file |
| Apple Notes | App handoff | Share import/export |

---

## 10. Next Steps

- Create v2 architecture documents for module design, backend, and connector architecture.
- Update v2 NFRs for integration, sync, security, and cost.
- Run validation per v2 PRD.
- If validation passes, implement MVP.

---

## 11. Change Log

| Version | Date | Summary |
|---|---|---|
| 2.0 | 2026-08-23 | New v2 architecture overview. References v1 for stable local-first and UI architecture. |
| 2.1 | 2026-08-23 | Added agentic future alignment notes. |
