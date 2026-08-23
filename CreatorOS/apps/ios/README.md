# iOS Application

## Purpose

Native iOS client providing the CreatorOS mobile experience: connected content records, cross-tool search, connection health, action receipts, and offline capture.

## Technologies

- SwiftUI (iOS 16+)
- GRDB.swift + SQLCipher + FTS5 for encrypted local persistence
- RevenueCat SDK for subscription management
- Sentry SDK for crash reporting and performance monitoring

## Key Documents

Before implementing, read:

- `docs/tdd/TDD-01-mobile-local-database-search.md` — database schema, encryption, FTS triggers, migrations
- `docs/tdd/TDD-02-offline-sync-local-operations.md` — outbox pattern, background scheduling, reconciliation
- `docs/requirements/functional/FRS-01-connected-content-record-v2.md` — core object behavior
- `docs/testing/unit-test-cases.md` and `docs/testing/e2e-test-cases.md` — expected test coverage

## Build & Run

<!-- Placeholder: Xcode project setup, dependency installation (SPM), SQLCipher configuration, signing requirements -->
