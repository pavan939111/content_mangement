// CreatorOS iOS entry point.
//
// This file will bootstrap the SwiftUI app lifecycle.
// Persistence: GRDB.swift + SQLCipher + FTS5 per TDD-01 section 6.
// Key management: iOS Keychain with .afterFirstUnlockThisDeviceOnly accessibility per TDD-01 section 7.1.
// Background sync: BGTaskScheduler best-effort per TDD-02 section 8.1.
//
// Derived from: docs/tdd/TDD-01-mobile-local-database-search.md; docs/tdd/TDD-02-offline-sync-local-operations.md
