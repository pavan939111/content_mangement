# P2 Backlog — Documentation & Engineering Improvements

**Product:** CreatorOS  
**Version:** 1.0  
**Status:** Backlog for MVP development sprints  
**Priority:** Medium — not blockers  
**Related:** Verification Report §4.2, §6.4, §6.5, §7.1 P2 list  

---

## 1. Purpose

This backlog lists medium-priority tasks identified during the Claude verification review. These tasks improve documentation consistency, fill measurement gaps, and reduce technical risk, but they do not block the start of MVP development.

Each item has a unique ID, description, owner, and suggested sprint.

---

## 2. P2 Items

### P2-1 — Fix NFR-01 §3.4 internal contradiction

**Description:** NFR-01 currently lists "60 fps minimum," "No frame exceeding 700 ms," and "Input event response ≤5 s" in the same table. The latter two are Android failure thresholds, not targets. Separate them into two tables: "Product Targets" and "Platform Failure Thresholds."

**Acceptance Criteria:** NFR-01 §3.4 clearly distinguishes targets from thresholds. No conflicting statements remain.

**Suggested Sprint:** Sprint 1

---

### P2-2 — Fix NFR-03 storage arithmetic and re-baseline

**Description:** NFR-03 §3.3 gives two conflicting storage estimates for 100k records: 10–50 MB per 1,000 (→ 1–5 GB) and 0.5–2.5 GB total. Reconcile to one range and document assumptions.

**Acceptance Criteria:** NFR-03 and NFR-07 use a single consistent storage estimate, with formula and assumptions.

**Suggested Sprint:** Sprint 1

---

### P2-3 — Add missing NFR areas

**Description:** The verification report identified six missing NFR areas:

1. Search quality (precision/recall, relevance, zero-result behaviour)
2. Transcription quality, latency, and cost
3. Indexing correctness (completeness percentage, failure handling)
4. Capacity beyond assets (Content Items, Clips, Ideas, tags, revisions, outbox depth)
5. Unit economics / cost per user
6. Data residency

Add these to the appropriate NFR documents or create a new NFR-12.

**Acceptance Criteria:** Each missing area has a dedicated requirement with measurable target and owner.

**Suggested Sprint:** Sprint 2

---

### P2-4 — De-duplicate NFR/architecture overlap

**Description:** Multiple sections are duplicated across NFR-03, NFR-07, and ARCH-05, with no declared normative source. Example: cache quotas, startup targets, memory budgets, export formats, conflict strategies.

**Acceptance Criteria:** Each duplicated topic has one normative document; others reference it. No contradictory copies remain.

**Suggested Sprint:** Sprint 2

---

### P2-5 — Apply the `-M` completeness sweep to FRS-09 through FRS-16

**Description:** FRS-01 to FRS-08 were updated with missing MVP requirements (`-M` block) and version 1.1 change logs. FRS-09 through FRS-16 have not received the same sweep.

**Acceptance Criteria:** FRS-09 through FRS-16 each receive a completeness review, add missing requirements, and update to v1.1 with a change log.

**Suggested Sprint:** Sprint 3

---

### P2-6 — Rebaseline NFR-07 app-size budgets

**Description:** NFR-07 component budgets were created before the tech stack was chosen. They do not account for KMP framework, Ktor, SQLDelight, RevenueCat, Sentry, or SQLCipher. Re-evaluate with actual dependency sizes.

**Acceptance Criteria:** NFR-07 component table includes all selected dependencies and realistic sizes; total targets updated if necessary.

**Suggested Sprint:** Sprint 3

---

### P2-7 — Add glossary, FRS-level traceability matrix, and data dictionary

**Description:** No glossary, no FRS-level traceability matrix, no data dictionary currently exist. These are needed for maintainability.

**Acceptance Criteria:**
- `docs/requirements/glossary.md` defines all domain terms.
- `docs/requirements/traceability-matrix.md` maps pain points → FRS → NFR → ARCH → tests.
- `docs/architecture/data-dictionary.md` defines all database tables and columns.

**Suggested Sprint:** Sprint 4

---

### P2-8 — Reconcile navigation IA to one list

**Description:** NFR-06, ARCH-01, and FRS-12 have different bottom navigation descriptions. After recent updates, the correct IA is four tabs: Inbox, Library, Calendar, Projects; Settings in top bar; Reminder Center accessible from Inbox/Calendar.

**Acceptance Criteria:** All documents reference the same navigation IA.

**Suggested Sprint:** Sprint 1

---

### P2-9 — Refresh stale version pins and uncited market claims

**Description:** Version pins like Swift 5.9, Kotlin 1.9, Compose BOM 2024, GRDB 6.x may be outdated. Uncited claims: "Android 9 covers over 90% of devices," "median iPhone app download 49.7 MB."

**Acceptance Criteria:** Version pins updated to current stable versions; market claims removed or sourced.

**Suggested Sprint:** Sprint 1

---

### P2-10 — Verify all missing functional requirements added

**Description:** P1-11 added ten missing functional requirements. Confirm each appears in the correct module with correct priority and no duplicate or conflicting ID.

**Acceptance Criteria:** The ten requirements (CR-M7, SET-M1, AS-M10, SET-M2, SUB-M1, CAP-M8, OFF-M8, ON-M1, AS-M11, PUB-M5) are present and traceable.

**Suggested Sprint:** Sprint 1

---

## 3. Completion Criteria

All P2 items are complete when:

- Documents are internally consistent.
- All open questions are resolved or explicitly deferred.
- No duplicate/contradictory sections remain.
- Missing NFR areas are added.
- Traceability is possible from pain point to requirement to test.

---

## 4. Change Log

| Version | Date | Summary |
|---|---|---|
| 1.0 | 2026-08-22 | Created P2 backlog from verification report. |
