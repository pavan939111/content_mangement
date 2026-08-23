# Domain Package (KMP Shared Core)

## Purpose

Kotlin Multiplatform shared logic: sync state machine, conflict resolution policies, search query compilation, entitlement gate rules, operation serialization. Consumed by iOS (via Kotlin/Native framework) and Android.

**Note:** Per DEC-001, this package is gated on the technical spike confirming KMP viability with SQLCipher. If the spike fails, domain logic is implemented natively per platform.

## Technologies

- Kotlin Multiplatform
- kotlinx-coroutines, kotlinx-serialization
- No direct database or network access (pure logic)

## Key Documents

- `docs/architecture/ARCHITECTURE-17-technical-spike-execution-tracker.md` — spike gates that determine whether KMP is used
- `docs/tdd/TDD-02-offline-sync-local-operations.md` §4 for sync state machine definition

## Build & Run

<!-- Placeholder: Gradle KMP configuration, iOS framework export task -->
