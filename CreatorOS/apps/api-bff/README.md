# Public API BFF

## Purpose

The only public HTTP API mobile apps call. Validates Supabase JWTs, enforces workspace authorization and plan limits, creates durable operations/receipts/outbox events transactionally, returns RFC 9457 problem+json errors.

## Technologies

- Node.js/TypeScript on managed containers (DEC-033)
- Fastify with OpenAPI 3.1 schema validation
- Postgres direct connection with RLS-aware transactions
- RevenueCat server API for entitlement validation

## Key Documents

- `docs/tdd/TDD-03-public-api-bff.md` — architecture, error mapping, idempotency, security
- `docs/api/openapi/creatoros-public.openapi.yaml` — machine-readable contract
- `docs/architecture/ARCHITECTURE-20-revenuecat-entitlement-enforcement.md` — plan enforcement design
- `docs/architecture/ARCHITECTURE-18-database-erd-v2.md` §5.4–5.8 for operational table schemas

## Build & Run

<!-- Placeholder: pnpm install, environment variables (DATABASE_URL, SUPABASE_JWKS_URL, REVENUECAT_API_KEY), local dev server command -->
