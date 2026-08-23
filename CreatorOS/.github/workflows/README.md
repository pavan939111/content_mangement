# GitHub Actions Workflows

## Purpose

CI pipeline definitions implementing the stage gates from `docs/testing/release-gates.md`.

Expected workflows:

- **PR:** lint, OpenAPI diff check, generated-client compile, unit tests, DB integration tests, focused Pact verification
- **Main merge:** full migration chain, RLS/pgTAP suite, Schemathesis fuzz, contract artifact publish
- **Nightly:** E2E extended suite, performance benchmarks, device matrix
- **Weekly:** provider sandbox OAuth lifecycle tests
- **RC:** full release-gate validation per `mvp-definition-of-done.md`

## Setup

<!-- Placeholder: secrets configuration (SUPABASE_SERVICE_KEY, REVENUECAT_API_KEY, etc.), runner requirements -->
