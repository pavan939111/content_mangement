# Functional Requirements Specification — Module 07 v2  
**Module:** Connector Framework  
**Version:** 2.0  
**Status:** Draft for Validation  
**Related PRD:** v2/creator_os_prd_v2.md  
**Reference to v1:** ../../../docs/requirements/functional/FRS-07-integrations-storage.md

---

## 1. Purpose

This document defines the **Connector Framework** for CreatorOS v2.

It does not repeat v1 storage and share-sheet integration details. Where v1 requirements remain valid, they are referenced.

The Connector Framework is the core mechanism that lets CreatorOS connect to external tools—Google Drive, Google Docs, Google Calendar, and Notion in MVP—and present a uniform, safe, and observable connection model to the user.

---

## 2. Reference to v1 Stable Requirements

The following v1 requirements remain valid where applicable:

- Local file and external drive indexing: v1 FRS-07 §4.2
- Share-sheet import/export: v1 FRS-07 §4.3
- Calendar and reminders integration: v1 FRS-07 §4.5
- Data export/portability: v1 FRS-07 §4.8

Where v2 changes behavior, the new requirements below supersede v1.

---

## 3. New Definitions

| Term | Definition |
|---|---|
| Connector | A module that enables CreatorOS to search, read, attach, open, or handoff content from one external tool. |
| Connected Account | A user-authorized external account instance for a provider. |
| Capability | A specific action or read operation a connector supports. |
| Capability Matrix | A structured registry of supported capabilities per connector. |
| Connection Health | Live status of an account connection: healthy, stale, needs reauthorization, error. |
| Action Execution | A provider- or backend-mediated operation triggered from CreatorOS. |
| OAuth Token Vault | Secure server-side or device-side storage for connector credentials. |

---

## 4. Functional Requirements

### 4.1 Connector Model

| ID | Requirement | Priority | Description |
|---|---|---|---|
| CNF-01 | The system shall support a modular Connector abstraction for all external tools. | Must | Core. |
| CNF-02 | Each Connector shall declare its capabilities, auth type, rate limits, and user-visible display name. | Must | Consistency. |
| CNF-03 | The system shall support connecting and disconnecting individual connector accounts. | Must | Control. |
| CNF-04 | The system shall support multiple accounts of the same provider, with user-defined labels. | Should | Example: “Work Drive” vs “Personal Drive.” |
| CNF-05 | The system shall store only non-secret connection metadata locally; credentials shall be in secure storage. | Must | Security. |

### 4.2 Authentication and Authorization

| ID | Requirement | Priority | Description |
|---|---|---|---|
| CNF-10 | The system shall use OAuth 2.0 Authorization Code with PKCE for all compatible connectors. | Must | Standard. |
| CNF-11 | The system shall request the minimum scopes required for intended capabilities. | Must | Least privilege. |
| CNF-12 | The system shall show a plain-language permission explanation before starting OAuth. | Must | Trust. |
| CNF-13 | The system shall support reauthorization when a token expires or permissions are revoked. | Must | Recovery. |
| CNF-14 | The system shall allow the user to disconnect an account and immediately delete local credentials. | Must | Control. |
| CNF-15 | The system shall never collect or store third-party account passwords. | Must | Safety. |

### 4.3 Capability Registry

| ID | Requirement | Priority | Description |
|---|---|---|---|
| CNF-20 | The system shall maintain a capability registry per connected connector. | Must | Clarity. |
| CNF-21 | Each capability shall define whether it is read-only, write, export, handoff, or notify. | Must | Safety. |
| CNF-22 | The system shall display available capabilities in user-readable terms: “Search your Drive,” “Open documents,” “Create calendar events.” | Must | Understandable. |
| CNF-23 | The system shall not show a capability that is not yet available or not authorized. | Must | Accuracy. |

### 4.4 Connection Health Model

| ID | Requirement | Priority | Description |
|---|---|---|---|
| CNF-30 | The system shall maintain connection health for every connected account. | Must | Trust. |
| CNF-31 | Health states shall be: `Authorizing`, `Healthy`, `Syncing`, `Degraded`, `Stale`, `Reauth required` (`reauth_required`), `Revoked`, `Error`, `Disconnected`. This is the canonical vocabulary used across API schemas, local database, and backend ERD. | Must | State model. |
| CNF-32 | The system shall record last successful sync, last attempted sync, and last error. | Must | Diagnostics. |
| CNF-33 | The system shall display which content records rely on an unhealthy connector. | Must | Impact. |
| CNF-34 | The system shall provide one-tap recovery actions: reconnect, verify, or open provider settings. | Must | Recovery. |
| CNF-35 | After successful reconnection, the system shall log a receipt and verify affected records. | Should | Trust. |

### 4.5 Action Execution Model

| ID | Requirement | Priority | Description |
|---|---|---|---|
| CNF-40 | The system shall define an action execution flow for each connector capability. | Must | Standard. |
| CNF-41 | Foreground user actions shall execute from the mobile app where feasible. | Must | Example: open link. |
| CNF-42 | Durable, scheduled, or rate-limited actions shall execute via the backend connector service. | Must | Example: sync, export, webhooks. |
| CNF-43 | Every action shall use a stable idempotency key. | Must | Prevent duplicates. |
| CNF-44 | The system shall maintain action state: queued, running, succeeded, failed, retrying, needs_attention. | Must | Observability. |
| CNF-45 | The system shall not retry non-idempotent writes automatically without user confirmation. | Must | Safety. |

### 4.6 Connector Error Normalization

| ID | Requirement | Priority | Description |
|---|---|---|---|
| CNF-50 | The system shall normalize external connector errors into user-safe categories. | Must | UX. |
| CNF-51 | Error categories shall include: `rate_limited`, `auth_expired`, `permission_missing`, `provider_down`, `network_error`, `invalid_input`, `unknown`. | Must | Consistency. |
| CNF-52 | The system shall display a short, actionable message for each error category. | Must | Recovery. |
| CNF-53 | The system shall never expose raw provider stack traces or OAuth tokens. | Must | Security. |

### 4.7 MVP Connector Set

| Connector | Required Capabilities |
|---|---|
| Google Drive | Search files/folders, read metadata, attach to record, open in Drive. |
| Google Docs | Search docs, read title/snippet, attach active script/brief, open in Docs. |
| Google Calendar | List/read events, create due-date event from record, open in Calendar. |
| Notion | Search pages/databases, read title/snippet, attach brief/planning page, open in Notion. |

---

## 5. MVP Boundaries

### Included

- Four initial connectors: Google Drive, Docs, Calendar, Notion.
- OAuth 2.0 + PKCE with scoped permissions.
- Capability registry with user-readable display.
- Connection health model with impact and reconnect.
- Basic action execution and error normalization.
- Store connection metadata without secrets.

### Excluded

- Social platform publishing connectors.
- CapCut/Canva API automation.
- Apple Notes cloud API.
- User-defined custom connectors.
- MCP configuration or developer-facing connector builder.

---

## 6. Acceptance Criteria Summary

| Scenario | Acceptance Criteria |
|---|---|
| Connect Google Drive | User completes OAuth, connector appears as Healthy, capabilities listed. |
| Permission denied | User sees plain-language required permission before OAuth; reconnect path available. |
| Health warning | Expired Notion token marks affected records and offers Reconnect. |
| Disconnect | User disconnects; local credential deleted; connector state Disconnected. |
| Error normalization | Google rate limit error shows “We’re waiting for Google Drive’s request limit.” |
| Idempotency | Duplicate action attempt does not create duplicate external write. |

---

## 7. Change Log

| Version | Date | Summary |
|---|---|---|
| 2.0 | 2026-08-23 | New v2 document for Connector Framework. References v1 for local storage and share-sheet behavior. |
