# Contracts Package

## Purpose

Shared machine-readable contracts: OpenAPI-generated TypeScript types, shared Zod/JSON schemas, error code enums, and event payload definitions used across BFF, worker, and mobile clients.

## Technologies

- TypeScript
- openapi-typescript for type generation from `docs/api/openapi/creatoros-public.openapi.yaml`

## Key Documents

- `docs/api/openapi/creatoros-public.openapi.yaml`
- `docs/tdd/TDD-03-public-api-bff.md` §7 for contract workflow and backward-compatibility policy

## Build & Run

<!-- Placeholder: pnpm generate command pulling from the OpenAPI spec -->
