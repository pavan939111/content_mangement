# Architecture Decision — Next Action vs Readiness

**Version:** 1.0
**Date:** 2026-08-23

## Decision

For v2 MVP, **Next Action supersedes the v1 readiness engine**.

The v1 readiness requirements CR-32 through CR-37 and CAL-10/CAL-11 are superseded for v2. Next Action (CCR-20 through CCR-23) is the single engine for determining what is missing and what to do next.

Any v1 modules that depend on readiness must be interpreted as using Next Action when used in v2.

## Change Log

| Version | Date | Summary |
|---|---|---|
| 1.0 | 2026-08-23 | Next Action supersedes v1 readiness. |
