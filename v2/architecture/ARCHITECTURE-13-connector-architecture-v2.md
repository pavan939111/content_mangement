# Technical Architecture Document — ARCHITECTURE-13 v2: Connector Architecture

**Product:** CreatorOS v2  
**Version:** 2.0  
**Status:** Draft for Validation  
**Date:** 2026-08-23  
**Related PRD:** v2/creator_os_prd_v2.md  
**Related FRS:** v2/requirements/functional/FRS-07-connector-framework-v2.md  
**Related Architecture:** v2/architecture/ARCHITECTURE-07-backend-and-api-v2.md

---

## 1. Purpose

This document defines the **Connector Architecture** for CreatorOS v2.

It specifies how external tools are represented, connected, discovered, executed, monitored, and disconnected.

---

## 2. Connector Abstraction

Every external tool implements a common Connector Contract:

```text
connect()
disconnect()
getConnectionHealth()
listCapabilities()
search(query, cursor)
getItem(externalId)
performAction(action, input, idempotencyKey)
sync(cursor)
handleWebhook(event)
classifyError(error)
rateLimitPolicy()
```

---

## 3. Connector Types

| Type | Description | Example |
|---|---|---|
| API Connector | Direct provider REST/GraphQL API. | Google Drive, Docs, Calendar, Notion |
| Remote MCP Connector | Provider-hosted MCP server, if stable. | Optional future |
| Handoff Connector | No API; deep link/share sheet only. | CapCut, Apple Notes |
| Device Connector | OS-level access, single platform. | Apple Reminders (future) |

---

## 4. Connector Registry

Each registered connector stores:

- Provider ID and display name
- Auth type and OAuth scopes
- Capability list
- Rate-limit profile
- Webhook support flag
- Supported search and action types
- Provider environment/status config from Remote Config

---

## 5. Capability Model

| Capability | Read/Write | Description |
|---|---|---|
| `search` | Read | Search external source by keyword/filters. |
| `read_metadata` | Read | Fetch title, snippet, dates, owner, source status. |
| `attach` | Read | Link an external object to a content record. |
| `open` | Read | Deep link or open in native/web app. |
| `create_draft` | Write | Create a document/page/event from a record. |
| `export` | Write | Export/send content to provider. |
| `notify` | Write | Subscribe to provider changes. |

---

## 6. Connection Lifecycle

```text
Disconnected
  → Connecting
  → Connected / Healthy
  → Stale
  → Needs reauthorization
  → Error
  → Disconnected
```

Each transition is recorded with timestamp and reason.

---

## 7. OAuth and Token Handling

- OAuth 2.0 Authorization Code + PKCE.
- System browser.
- Scoped minimum-necessary permissions.
- Backend vault for provider refresh tokens.
- Device Keychain/Keystore for direct mobile tokens.
- Immediate revoke on disconnect.
- Never log tokens or provider secrets.

---

## 8. Action Execution

### 8.1 Foreground Actions

- Initiated by user on mobile.
- Examples: open deep link, share sheet, copy caption.
- Result logged as receipt.

### 8.2 Background/Durable Actions

- Executed by backend Connector Service.
- Examples: scheduled sync, webhook-triggered refresh, provider export.
- Job queue with retries and idempotency.

---

## 9. Error Normalization

Provider errors mapped to:

```text
auth_expired
permission_missing
rate_limited
provider_down
network_error
invalid_input
unknown
```

Each error type has a plain-language mobile message.

---

## 10. Health Model

Per connection:

- Last success
- Last attempt
- Failure count
- Health state
- Affected content records
- Recovery action

---

## 11. Observability

- Action success/failure by provider.
- Connector health transitions.
- OAuth reauthorization events.
- Search latency and result quality.

---

## 12. MVP Connectors

| Connector | Type | Required Capabilities |
|---|---|---|
| Google Drive | API Connector | search, read_metadata, attach, open |
| Google Docs | API Connector | search, read_metadata, attach, open, optional create_draft |
| Google Calendar | API Connector | read events, create due-date event, open |
| Notion | API Connector | search, read_metadata, attach, open |
| Canva | Handoff Connector | open, share |
| CapCut | Handoff Connector | share, open |
| Apple Notes | Handoff Connector | share/import |

---

## 13. MVP Boundaries

### Included

- Common Connector Contract.
- Connector Registry.
- Capability model.
- OAuth lifecycles.
- Health model with reconnect.
- Error normalization.
- Direct provider APIs, no local MCP server.

### Excluded

- Custom user-created connectors.
- Social publishing connectors.
- MCP configuration UI.
- In-app editing/design.

---

## 14. Change Log

| Version | Date | Summary |
|---|---|---|
| 2.0 | 2026-08-23 | New v2 Connector Architecture. |
