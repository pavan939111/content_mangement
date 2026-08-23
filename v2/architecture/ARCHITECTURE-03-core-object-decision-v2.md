# Architecture Decision — v2 Core Object

**Version:** 1.0
**Date:** 2026-08-23
**Status:** Decided

## Decision

For CreatorOS v2 MVP, the central object is **`connected_record`**, not `content_item`.

`content_item` remains in the v1 architecture and any legacy v1 features that are retained, but v2 features are built on `connected_record`.

There is no automatic migration from `content_item` to `connected_record` in MVP. v2 is a new core; v1 content records may be imported later as data migration or reference records.

## Precedence

Where v1 FRS/architecture references `content_item`, and v2 documents reference `connected_record`, the v2 document is authoritative for v2.

Where a v1 module is declared "remains valid," its requirements are reinterpreted against `connected_record` if that module is used in v2.

## Action

Update v2 PRD §7 to state this precedence and remove any implication that v1 `content_item` is the active core.

## Change Log

| Version | Date | Summary |
|---|---|---|
| 1.0 | 2026-08-23 | Defined connected_record as v2 core; content_item legacy. |
