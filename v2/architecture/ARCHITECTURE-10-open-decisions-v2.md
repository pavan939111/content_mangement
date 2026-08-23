# Technical Architecture Document — ARCHITECTURE-10 v2: Open Decisions

**Product:** CreatorOS v2  
**Version:** 2.0  
**Status:** Draft for Validation  
**Date:** 2026-08-23  
**Reference to v1:** ../../../docs/architecture/ARCHITECTURE-10-open-decisions.md

## 1. Purpose

This document records **v2-specific architecture and product decisions**.

Existing v1 decisions remain valid and are referenced. This document adds only decisions introduced by the connected workspace pivot.

## 2. New Decisions

| ID | Decision | Status |
|---|---|---|
| DEC-030 | Connector Framework architecture | ✅ Decided |
| DEC-031 | MVP connector set: Google Drive, Docs, Calendar, Notion | ✅ Decided |
| DEC-032 | MCP usage: internal only, not product surface | ✅ Decided |
| DEC-033 | Backend job worker technology | ⏳ Provisional |
| DEC-034 | Pricing: Free / Solo $12–15 / Pro $20–24 | ✅ Decided |
| DEC-035 | Client acknowledgment link for delivery | ✅ Decided |
| DEC-036 | Provider API cost monitoring | ✅ Decided |
| DEC-037 | Positioning: connected content record, not all-in-one OS | ✅ Decided |
| DEC-038 | Validation go/no-go before full build | ✅ Decided |
| DEC-039 | Google Drive Scope Strategy | ✅ Decided |

### DEC-039: Google Drive Scope Strategy

**Final Decision:** Google Drive search across the user's drive requires a restricted scope (`drive.readonly` or `drive.metadata.readonly`), which requires Google OAuth verification and an annual third-party CASA security assessment. The MVP will accept this requirement and plan for verification before production launch.

**Implications:**
- The concierge validation prototype will NOT depend on restricted Drive search. It will use human search or `drive.file` with Google Picker if OAuth is tested.
- MVP roadmap must include OAuth verification and CASA as launch blockers.
- The capability "Search files/folders across Drive" (FRS-07-v2 CNF-22) remains accurate but must be delivered using the restricted scope path.

**Owner:** Product + Security
**Date:** 2026-08-23

## 3. Reference to v1 Decisions

- DEC-001 through DEC-026 remain valid for local-first and mobile architecture.
- v1 decisions are in: ../../../docs/architecture/ARCHITECTURE-10-open-decisions.md

## 4. Change Log

| Version | Date | Summary |
|---|---|---|
| 2.0 | 2026-08-23 | Added v2 open decisions. |
| 1.1 | 2026-08-23 | Added DEC-039 Google scope strategy. |
