# Status Evidence Rule

**Version:** 1.0
**Date:** 2026-08-23

## Rule

Any document claiming a task is complete must link to verifiable evidence:

- File path and line number
- Commit hash
- Build artifact
- Raw dataset
- Test result output

## Prohibited

- Asserting completion without a linked check
- Marking decisions Confirmed based on templates or simulated results
- Writing verification from intent instead of file inspection

## Enforcement

Before any document is marked done, a second check must confirm the referenced evidence exists.
