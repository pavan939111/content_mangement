# Android Application

## Purpose

Native Android client providing the same CreatorOS experience as iOS with platform-idiomatic UI.

## Technologies

- Jetpack Compose (minSdk 28 / Android 9)
- Room + sqlcipher-android + FTS5 for encrypted local persistence
- WorkManager for background sync
- RevenueCat SDK; Sentry SDK

## Key Documents

- `docs/tdd/TDD-01-mobile-local-database-search.md`
- `docs/tdd/TDD-02-offline-sync-local-operations.md`
- `docs/uiux/state-matrix.md` (in original Content_management repo) for UI states
- `docs/testing/integration-test-cases.md` §3 for SQLCipher/migration test expectations

## Build & Run

<!-- Placeholder: Gradle wrapper setup, SQLCipher dependency pinning, Room schema export config, signing -->
