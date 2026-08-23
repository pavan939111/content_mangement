// CreatorOS Android entry point.
//
// This file will bootstrap the Jetpack Compose activity.
// Persistence: Room + sqlcipher-android + FTS5 per TDD-01 section 6.2.
// Key management: Android Keystore wrapping SQLCipher passphrase per TDD-01 section 7.2.
// Background sync: WorkManager with network constraint per TDD-02 section 8.2.
//
// Derived from: docs/tdd/TDD-01-mobile-local-database-search.md; docs/tdd/TDD-02-offline-sync-local-operations.md
