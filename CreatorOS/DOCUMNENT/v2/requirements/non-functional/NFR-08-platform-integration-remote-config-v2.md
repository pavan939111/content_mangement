# Non-Functional Requirements — NFR-08 v2: Platform Integration & Remote Config

**Product:** CreatorOS v2  
**Version:** 2.0  
**Status:** Draft for Validation  
**Date:** 2026-08-23  
**Reference to v1:** ../../../docs/requirements/non-functional/NFR-08-platform-integration-remote-config.md

## 1. Purpose

This document defines v2-specific integration health and remote configuration requirements for connected tools.

The v1 remote config signing, capability matrix, and rate-limit patterns remain valid.

## 2. New v2 Requirements

| ID | Requirement | Priority | Description |
|---|---|---|---|
| PIC-01 | Connector health SLO | Must | At least 99% of healthy connections shall have a successful sync within the last 24 hours or be explicitly marked stale. |
| PIC-02 | Reconnection UX | Must | When a connection is stale or needs reauthorization, affected content records shall show a warning and a one-tap reconnect. |
| PIC-03 | Capability matrix remote update | Must | The capability matrix for each connector shall be remotely updatable without app release. |
| PIC-04 | Provider fallback | Must | When a provider is unavailable, the system shall fall back to handoff actions (deep link/share sheet) where possible. |
| PIC-05 | Provider rate-limit handling | Must | The system shall respect provider rate limits, queue background work, and show user-safe retry times. |
| PIC-06 | Webhook reliability | Should | Where webhooks are used, they shall be validated, deduplicated, and normalized to incremental sync events. |
| PIC-07 | Integration isolation | Must | One provider failing must not block other provider operations. |

## 3. References

- Remote config schema and signing: v1 NFR-08 §6
- Publishing state machine: v1 NFR-08 §7 (Phase 2)

## 4. Acceptance Criteria

- Connector health visible in less than 2 seconds from record view.
- Provider outage does not disable other connectors.
- Rate limit messages include retry time.
- Stale connections can be reauthorized in under 1 minute.

## 5. Change Log

| Version | Date | Summary |
|---|---|---|
| 2.0 | 2026-08-23 | Added connector health SLOs and fallback requirements. |
