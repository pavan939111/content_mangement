# CreatorOS Product Requirements Document — v2

**Version:** 2.0  
**Date:** 2026-08-23  
**Status:** Draft for Validation  
**Replaces:** `creator_os_prd.md` v1.0  

---

## 1. Purpose

This document defines the **new product direction** for CreatorOS.

It does not repeat the v1 PRD. Where v1 requirements, architecture, or non-functional details remain valid, they are referenced explicitly.

---

## 2. Reference to v1

| Topic | v1 Reference |
|---|---|
| v1 PRD | `docs/creator_os_prd.md` |
| v1 Pain Points | `docs/creator_pain_points.md` |
| v1 Vision | `docs/creator_os_vision_v1_restored.md` |
| v1 Functional Requirements | `docs/requirements/functional/` |
| v1 Non-Functional Requirements | `docs/requirements/non-functional/` |
| v1 Architecture | `docs/architecture/` |

---

## 3. What Changed from v1

| Dimension | v1 | v2 |
|---|---|---|
| Product type | Local-first content workspace | Connected content record + coordination layer |
| Core object | Content Item | Connected Content Record |
| Integration model | Manual references, deep links | OAuth-connected tools + health + receipts |
| Target user | General solo short-form creators | Professional UGC creators |
| Network model | Offline-first core | Mobile control plane + cloud integration plane |
| Competitive frame | Notion alternative | Tool-neutral orchestration layer |

---

## 4. New Vision

> CreatorOS is the trusted, mobile-native content record for professional UGC creators.  
> It connects Google Drive, Docs, Calendar, and Notion into one searchable workspace and links each deliverable to its brief, script, source files, design, edit handoff, and delivery receipt.

---

## 5. New Target User

### Primary: Professional UGC Creator

- Creates 4–20 paid short-form assets per month.
- Works with 2–8 active brands.
- Uses Google Drive/Docs/Calendar, Notion, Canva, CapCut.
- Mobile-first.
- Loses time and trust when coordination breaks.

### Secondary: Freelance Social Media Manager (Future)

- Not MVP.

## 5.1 Hypothesis Statement

The v2 target segment and problem statement are **hypotheses derived from strategic reasoning and competitor research, not from the original v1 pain-point research.**

The v1 research covered general solo short-form creators. The v2 pivot targets professional UGC creators with brand deliverables. This segment has not been independently validated against the original 80 pain points.

Validation in `v2/requirements/validation/` is designed to test this segment and problem statement before MVP build.

---

## 6. New MVP Scope

### Included

- Connected Content Record
- Google Drive, Google Docs, Google Calendar, Notion connectors
- Cross-tool search
- Connection health
- Action receipts
- Canva/CapCut/Apple Notes handoff
- Delivery review state
- Offline capture

### Excluded (Phase 2+)

- Social publishing APIs
- Analytics
- Team approvals
- In-app editing/design
- MCP configuration
- General automation builder
- AI content generation

---

## 7. Reference to v1 Stable Requirements

**Core Object Precedence:** For CreatorOS v2 MVP, the central object is **`connected_record`**, not `content_item`. Where v1 FRS/architecture references `content_item` and v2 documents reference `connected_record`, the v2 document is authoritative for v2. Where a v1 module is declared "remains valid," its requirements are reinterpreted against `connected_record` if that module is used in v2.

The following v1 requirements remain valid and are reused where applicable (reinterpreted against `connected_record`):

- Idea capture: `FRS-02-idea-capture.md`
- Repurposing clip library: `FRS-04-repurposing-clip-library.md`
- Calendar/readiness: `FRS-05-calendar-readiness.md`
- Script editor: `FRS-10-script-text-editor.md`
- Media preview: `FRS-11-media-preview-playback.md`
- Notifications/reminders/trash: `FRS-12-notifications-reminders-trash.md`
- Import/export/backup: `FRS-13-import-export-backup-restore.md`
- Subscription: `FRS-14-subscription-monetization.md`

The new connected-content modules will be defined as **new v2 FRS documents**:

- `FRS-01-connected-content-record-v2.md`
- `FRS-03-cross-tool-search-v2.md`
- `FRS-06-handoff-action-receipts-v2.md`
- `FRS-07-connector-framework-v2.md`

These will not duplicate the v1 documents; they will supersede them for v2.

---

## 8. Pricing

| Plan | Price | Limits |
|---|---:|---|
| Free | $0 | 1 workspace, 2 connected sources, 10 active records, basic search |
| Solo | $12/month annual / $15 monthly | Unlimited records, all initial connectors, health, receipts |
| Pro | $20/month annual / $24 monthly | Higher sync frequency, advanced search, receipt export, multiple brands |

---

## 9. Validation

Validation documents will be created in `v2/requirements/validation/`:

- `user-interview-script.md`
- `concierge-prototype-test-plan.md`
- `validation-scorecard.md`

---

## 10. Next Steps

1. Create v2 folder structure.
2. Create v2 PRD (this document).
3. Create v2 vision mirror if needed.
4. Create validation documents.
5. Run validation.
6. If go, create full v2 FRS/NFR/ARCH documents.

---

**End of PRD v2**
