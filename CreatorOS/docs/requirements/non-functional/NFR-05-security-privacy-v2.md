# Non-Functional Requirements — NFR-05 v2: Security & Privacy

**Product:** CreatorOS v2  
**Version:** 2.0  
**Status:** Draft for Validation  
**Date:** 2026-08-23  
**Reference to v1:** ../../../docs/requirements/non-functional/NFR-05-security-privacy.md

## 1. Purpose

This document defines v2-specific security and privacy requirements for connected-tool integration.

The v1 local encryption, key management, and OAuth token security remain valid and are referenced.

## 2. New v2 Requirements

| ID | Requirement | Priority | Description |
|---|---|---|---|
| SPC-01 | Multi-connector OAuth | Must | The system shall support isolated OAuth credentials per connected account, with per-provider scopes and revocation. |
| SPC-02 | Server-side token vault | Must | Provider refresh tokens used for backend actions shall be stored in a server-side encrypted vault, never on mobile except for direct device actions. |
| SPC-03 | Plain-language permission | Must | Before OAuth, the system shall show a plain-language explanation of requested permissions and capabilities. |
| SPC-04 | Read-only default | Must | External source access shall default to read-only. Write actions require explicit user confirmation per action. |
| SPC-05 | Immediate disconnect | Must | Disconnecting a provider shall immediately delete local credentials and revoke backend tokens best effort. |
| SPC-06 | Receipt privacy | Must | Shared delivery views shall expose only intended record metadata, never internal notes or other connected records. |
| SPC-07 | No secrets in logs | Must | Provider tokens, user content, and external source names shall never appear in logs, telemetry, or crash reports. |
| SPC-08 | Normalized index encryption | Must | The backend normalized index shall be encrypted at rest. Supabase Postgres encrypts all data at rest by default, satisfying this requirement without additional application-layer encryption. Access shall additionally be restricted to the connector service via database roles and RLS policies. |
| SPC-09 | Normalized index retention | Must | Indexed external metadata (titles, URLs, content hashes) shall be retained only while the connector is connected and the user's account is active. |
| SPC-10 | Connector data deletion | Must | On disconnect or account deletion, the backend shall delete all normalized-index entries for that connector within 30 days, and provide a deletion receipt. |
| SPC-11 | Consent for backend indexing | Must | Before enabling external search, the app shall inform the user that external object titles and URLs will be indexed in CreatorOS's backend to provide connected search. |
| SPC-12 | Receipt store separation | Must | Action receipts shall be stored in a separate encrypted receipt store, not in the operation log. The operation log shall contain only action metadata, never receipt evidence or target object content. |

## 3. References

- Local encryption and SQLCipher: v1 NFR-05 §4
- OAuth PKCE: v1 NFR-05 §5
- Data deletion: v1 NFR-05 §7; Export: v1 NFR-05 §8

## 4. Acceptance Criteria

- OAuth tokens are never plaintext.
- Each provider has its own token and scope.
- User can disconnect any provider in ≤2 taps and tokens are deleted immediately.
- Shared delivery link does not expose other records or notes.

## 5A. Normalized Index Encryption Clarification

SPC-08 requires encryption at rest for the normalized index. Supabase Postgres encrypts
data at rest by default using AES-256 at the storage layer. This satisfies SPC-08 without
requiring application-level column encryption on `normalized_index.title` or other indexed
fields. Application-layer encryption would prevent full-text search (`tsvector`, `pg_trgm`)
from functioning and is therefore not used.

If a future compliance requirement demands field-level encryption beyond infrastructure
encryption, the architecture must be revisited (e.g., deterministic encryption + blind indexes),
but this is explicitly not required for MVP.

## 5. Change Log

| Version | Date | Summary |
|---|---|---|
| 2.0 | 2026-08-23 | Added multi-connector OAuth and token vault requirements. |
