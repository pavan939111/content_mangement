# Database Package

## Purpose

Canonical schema definitions, migration files (SQLite local + Postgres backend), and seed/migration test fixtures shared between platforms and CI.

## Technologies

- SQL migration files (numbered, forward-only)
- GRDB DatabaseMigrator (iOS) / Room Migration (Android) consuming these definitions

## Key Documents

- `docs/architecture/ARCHITECTURE-18-database-erd-v2.md` — authoritative ERD and all table DDLs
- `docs/tdd/TDD-01-mobile-local-database-search.md` §6 for local schema + FTS triggers
- `docs/testing/integration-test-cases.md` §3.2 for migration test requirements

## Build & Run

<!-- Placeholder: migration runner script instructions -->
