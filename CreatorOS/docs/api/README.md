# CreatorOS API Documentation

**Version:** 1.0  
**Date:** 2026-08-23  
**Status:** Ready for Development  
**Base URL:** `https://api.creatoros.app/v1`  

## 1. Purpose

This folder defines the CreatorOS public API.

- Mobile apps call only this API.
- Mobile apps never call Google, Notion, or the connector worker directly.
- The connector worker is private and network-isolated.

## 2. Key Decisions

| Decision | Choice |
|---|---|
| API style | REST/JSON |
| API version prefix | `/v1` |
| Contract format | OpenAPI 3.1 |
| Authentication | Supabase JWT Bearer token |
| Long-running work | `202 Accepted` + Operation resource |
| Mutations | Require `Idempotency-Key` |
| Pagination | Opaque cursor, max 50 |
| Errors | Single JSON envelope |
| Search | Normalized Postgres index, not live provider fan-out |
| Realtime | Polling first; Supabase Realtime deferred |
| Webhooks | Phase 2; durable inbox pattern when implemented |

## 3. Folder Structure

```
v2/api/
├── README.md
├── openapi/
│   └── creatoros-public.openapi.yaml
├── auth/
│   ├── oauth-flows.md
│   ├── token-vault.md
│   └── reauthorization.md
├── endpoints/
│   ├── connections.md
│   ├── connected-content.md
│   ├── search.md
│   ├── operations.md
│   ├── action-receipts.md
│   ├── delivery-links.md
│   └── remote-config.md
├── cross-cutting/
│   ├── errors.md
│   ├── idempotency.md
│   ├── pagination.md
│   ├── rate-limits.md
│   ├── caching.md
│   └── webhooks.md
└── providers/
    ├── google-drive.md
    ├── google-docs.md
    ├── google-calendar.md
    └── notion.md
```

## 4. Authority

- The OpenAPI spec is the machine-readable contract.
- Endpoint documents explain intent, examples, and mobile behavior.
- Cross-cutting documents define rules.
- Provider documents describe connector implementation details, never exposed to mobile.
