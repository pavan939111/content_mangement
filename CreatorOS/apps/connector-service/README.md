# Connector Service

## Purpose

Owns provider OAuth token refresh, provider API clients, adapter framework, and normalized search index maintenance. Called by the worker; never directly by mobile.

## Technologies

- Node.js/TypeScript
- Google API client libraries (Drive v3, Calendar v3)
- Notion REST API with pinned Notion-Version header
- Cloud KMS for token vault decryption

## Key Documents

- `docs/tdd/TDD-05-provider-adapter-framework.md` — adapter contract, capability model, error normalization
- `docs/tdd/TDD-07-oauth-token-vault-connection-health.md` — token lifecycle, refresh serialization
- `docs/api/providers/google-drive.md`, `google-calendar.md`, `google-docs.md`, `notion.md` — per-provider integration specs
- `docs/architecture/ARCHITECTURE-13-connector-architecture-v2.md` — connector abstraction

## Build & Run

<!-- Placeholder: KMS credentials setup, Google/Notion OAuth client IDs, sandbox tenant configuration -->
