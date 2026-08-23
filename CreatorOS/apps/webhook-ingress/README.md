# Webhook Ingress (Phase 2)

## Purpose

Receives provider webhook notifications (Google Drive changes.watch, Google Calendar events.watch, Notion event delivery). Verifies signatures, persists to webhook_inbox, enqueues reconciliation. No synchronous provider calls.

**Note:** Per product scope, webhooks are Phase 2. The MVP uses scheduled polling only. This service is scaffolded for future use; see TDD-06 for the authoritative design.

## Technologies

- Node.js/TypeScript (Fastify or standalone Express receiver)
- Raw body capture before JSON parsing (required for signature verification)

## Key Documents

- `docs/tdd/TDD-06-webhook-ingestion-reconciliation.md` — inbox pattern, channel lifecycle, dedupe rules
- `docs/api/cross-cutting/webhooks.md` — Google channel tokens, Notion HMAC-SHA256 verification

## Build & Run

<!-- Placeholder: HTTPS endpoint provisioning, channel secret management, Phase 2 activation flag -->
