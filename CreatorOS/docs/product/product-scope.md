# CreatorOS Product Scope — MVP vs Full Product

**Version:** 1.0
**Date:** 2026-08-23
**Status:** Authoritative for planning
**Related:** v2/creator_os_prd_v2.md, v2/creator_os_vision_v2.md

---

## 1. Purpose

This document defines the boundary between the **MVP** and the **full product**.

The MVP is the smallest reliable version that tests the core hypothesis:

> Professional UGC creators will pay $12–15/month for a mobile connected content record that links their existing tools, provides cross-tool search, shows connection health, and produces trustworthy action receipts.

The full product is the longer-term vision that builds on validated MVP success.

---

## 2. Core Product Thesis — Both MVP and Full Product

CreatorOS is the trusted, mobile-native content record for professional UGC creators. It connects the tools they already use—Google Drive, Docs, Calendar, and Notion—into one searchable workspace and links each deliverable to its brief, script, source files, design, edit handoff, and delivery receipt.

CreatorOS does **not** replace editing, design, or social publishing tools. It orchestrates them.

---

## 3. MVP Scope

### 3.1 Included in MVP

| Area | MVP Scope |
|---|---|
| Core object | Connected Content Record |
| Target user | Professional UGC creators with 2–8 active brands |
| Platforms | Native iOS (SwiftUI) and Android (Jetpack Compose) |
| Local database | SQLCipher + FTS5 for offline content record and local search |
| Connected tools | Google Drive, Google Docs, Google Calendar, Notion via OAuth |
| Handoff-only tools | Canva, CapCut, Apple Notes via deep link, share sheet, file picker |
| Cross-tool search | Local index first, then external provider results with source provenance |
| Connection health | Healthy / stale / needs reauthorization / error, with one-tap reconnect |
| Action receipts | Append-only receipts for handoffs, links, copies, and deliveries |
| Next Action engine | Single recommended next action per record based on missing/stale links |
| Delivery review | Mark Delivered, optional client acknowledgment link |
| Offline behavior | Local record viewing and receipt creation offline; sync when connectivity returns |
| Backend | Supabase Auth + Postgres/RLS for identity/DB; dedicated Node/TypeScript connector service for provider orchestration |
| Search backend | PostgreSQL FTS + `pg_trgm`, no OpenSearch |
| Job queue | BullMQ + managed Redis with Postgres outbox |
| Token vault | Cloud KMS envelope encryption + encrypted Postgres token records |
| Subscriptions | RevenueCat: Free / Solo $12–15 / Pro $20–24 |
| Observability | Sentry + MetricKit + Android Vitals |

### 3.2 Explicitly Excluded from MVP

| Area | Reason |
|---|---|
| Social publishing APIs | Phase 2; API approval and reliability complexity |
| Analytics dashboards | Phase 2; requires social publishing data |
| Team collaboration/approvals | Phase 2/3; different buyer |
| In-app video/design editing | Never; we orchestrate, not replace |
| AI content generation | Phase 3; not validated as core need |
| MCP configuration or developer surfaces | Internal only if needed; not product surface |
| General automation builder | Phase 3; avoid Zapier competition |
| Webhooks for provider changes | Phase 2; use scheduled/user-triggered sync in MVP |
| OpenSearch | Deferred; Postgres sufficient |
| Multiple accounts per provider | Single account per provider in MVP; multiple later |
| Desktop/web app | Mobile-first only; web shared view only |
| Advanced repurposing clip library | Reuse v1 clip library only if needed; not central |

---

## 4. Full Product Scope — Beyond MVP

### 4.1 Phase 2

| Area | Scope |
|---|---|
| Agentic Command Layer | Intent engine, action planner, confirmation cards, multi-step execution, fallback to manual handoff |
| Social publishing | Instagram, TikTok, YouTube publishing via provider APIs where eligible |
| Webhooks | Provider change ingestion for Google Drive, Calendar, Notion |
| Analytics | Lightweight outcome tracking: views, engagement, delivery status linked to content record |
| Collaboration | Shareable delivery views, client feedback, simple approval states |
| Multiple accounts | Multiple Google/Notion accounts per user with labels |
| Additional connectors | Dropbox, iCloud Drive, OneDrive; Canva API for design search/export |
| Advanced search | Semantic/fuzzy search, saved searches, cross-tool ranking improvements |
| Desktop/web companion | Optional web app for review and heavier planning |

### 4.2 Phase 3

| Area | Scope |
|---|---|
| Advanced automation recipes | Multi-step saved workflows with user-defined triggers and actions |
| Proactive suggestions | Context-aware recommendations: reconnect tokens, archive old assets, reuse evergreen content |
| Deeper MCP integration | Use MCP adapters where providers expose stable remote MCP servers |
| AI assistance | LLM-assisted planning, ambiguous intent resolution, summarization |
| Team workspaces | Multi-user, roles, permissions, client portals |
| Advanced analytics | Creative performance comparisons, retention overlays |

---

## 5. Key Boundary Rules

1. **MVP decisions do not block full product goals.** The architecture supports later addition of social publishing, webhooks, analytics, and collaboration without rework.
2. **No feature enters MVP without validation evidence.** The concierge prototype and interviews determine whether connected record, search, health, and receipts justify paid adoption.
3. **Postgres is authoritative.** Queues are delivery machinery. Provider calls are idempotent. Webhooks are hints.
4. **Raw media never leaves the user's storage.** Only metadata titles, URLs, and hashes are indexed in the backend.
5. **RevenueCat entitlements:** Free, Solo, Pro. Server-side entitlement enforcement protects connector features.

---

## 5A. Agentic Vision Alignment

The full product is an **agentic connected workspace**, similar to how Claude connects to external tools through MCP.

The creator will be able to instruct CreatorOS in natural language, and CreatorOS will interpret, plan, ask for confirmation, execute, and return receipts for every action.

The MVP is manual-first to validate trust and reliability before adding the agent layer.

See `v2/creator_os_phase2_vision.md` for the complete future vision.

---

## 6. Success Criteria from MVP to Full Product

| Gate | Criteria |
|---|---|
| Validation | 20–30 interviews; 8–10 concierge campaigns; ≥5 actual paid pilots |
| MVP build | Core connected record + Google/Notion connectors + search + health + receipts |
| MVP launch | ≥50% of activated users connect 2+ sources; ≥40% create real campaign record |
| Full product | Social publishing, analytics, collaboration based on measured demand |

---

## 7. Change Log

| Version | Date | Summary |
|---|---|---|
| 1.0 | 2026-08-23 | Created MVP vs Full Product scope. |
| 1.1 | 2026-08-23 | Added agentic command layer vision and reorganized Phase 2/3 scope. |
