# Testing Documentation

This directory contains the testing documentation for CreatorOS Phase 2.

## Document Index

1. [Test Strategy](test-strategy.md) — Overall testing philosophy, pyramid, tooling, and CI approach.
2. [Unit Test Cases](unit-test-cases.md) — Domain rules, state machines, search parser, entitlements, retry policy.
3. [Integration Test Cases](integration-test-cases.md) — SQLCipher, migrations, FTS5, Postgres/RLS, outbox/idempotency, BullMQ workers.
4. [E2E Test Cases](e2e-test-cases.md) — Critical user journeys across mobile + BFF + worker + provider stubs.
5. [UI Test Cases](ui-test-cases.md) — Component states, navigation, search coverage matrix, health rows, receipts.
6. [Accessibility Test Cases](accessibility-test-cases.md) — Automated audits, VoiceOver/TalkBack, dynamic type, reduced motion.
7. [Performance Test Cases](performance-test-cases.md) — Launch, search, rendering, sync bursts, memory budgets per NFR-01-v2.
8. [Provider Sandbox Tests](provider-sandbox-tests.md) — Real Google/Notion OAuth, webhooks, rate limits, API compatibility.
9. [Release Gates](release-gates.md) — Stage promotion criteria from PR through post-release monitoring.

## CI Frequency Summary

| Frequency | Suites |
|---|---|
| Every PR | Unit, repository integration, UI component, focused Pact |
| Nightly | Full migration chain, RLS suite, E2E extended journeys, performance benchmarks |
| Weekly / RC | Provider sandbox (OAuth lifecycle, webhook delivery), full device matrix |
