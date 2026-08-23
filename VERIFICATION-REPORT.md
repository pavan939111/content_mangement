# CreatorOS â€” Documentation Verification Report

**Reviewer role:** Senior product & technical reviewer (independent audit)
**Date:** 2026-08-22
**Scope:** 44 documents â€” `creator_pain_points.md`, `creator_os_vision.md`, `creator_os_prd.md`, 16 FRS, 12 NFR, 12 architecture documents
**Method:** Full read of every file; cross-document consistency checking; verification of key technical claims against primary sources (SQLite, SQLCipher, Android/Apple developer documentation)

---

## 1. Executive Summary

### Overall assessment

**The product thinking is sound. The documentation set is not yet buildable.**

The strategic core â€” a local-first, mobile-first "system of record" that coordinates existing creator tools rather than replacing them â€” is well-reasoned and defensible against the research. The NFR set is unusually rigorous for a pre-development product: it is platform-accurate, quantified, and cites primary sources. That is genuinely above average.

But the set fails the "buildable" test on six specific points, and it fails the "traceable" test structurally. The architecture documents were written in sequence and **the later ones silently contradict the earlier ones without the earlier ones being updated**. ARCHITECTURE-00 rejects cross-platform and commits to "two codebases"; ARCHITECTURE-10/11 introduce a Kotlin Multiplatform shared core. ARCHITECTURE-11 removes video proxies from MVP; four `Must` requirements in FRS-04 and FRS-11 depend on them. An engineer starting from ARCHITECTURE-01 today would build the wrong system.

Separately, the evidentiary chain that the whole set claims to rest on â€” "80 validated pain points, 45 confirmed / 28 partial / 3 unconfirmed" â€” **is not present in any document**. `creator_pain_points.md` lists 80 points with no verdicts. 45 + 28 + 3 = 76, not 80. The confidence percentages that appear in the vision (93%, 92%, 74%â€¦) appear nowhere else and cite no source. For a document set whose central credibility claim is "based on validated pain points, not assumptions," this is the most consequential gap in the entire review.

**Verdict: not ready for implementation planning.** It is roughly 2â€“3 weeks of focused remediation plus one technical spike away from being ready, and none of the remediation requires re-doing the research or the product thinking.

### Top strengths

1. **NFR quality.** NFR-01 through NFR-11 are the strongest artefacts here. Real thresholds (p50/p95, per device class), real platform constraints (iOS ~30 s BGAppRefreshTask, Android ~10 min WorkManager, Android 15 media-FGS 6 h budget), real citations. NFR-02's durable-outbox spec and NFR-08's publishing state machine are production-grade thinking.
2. **Honest scope discipline in the right places.** The set repeatedly refuses to overpromise: PUB-08 and PUB-14 forbid claiming universal one-click publishing; RP-08/RP-40 explicitly refuse to present reuse history as platform-policy compliance; AN-34 forbids causal claims. This is the correct response to a market full of tools that overclaim.
3. **Trust requirements treated as first-class.** TR-01â€¦TR-06, SUB-05/06/16/53, EXP-10, INT-53 collectively encode "no retroactive paywall, export never gated, delete never gated." Given that pricing distrust is a top-10 validated pain, making it a requirement rather than a marketing line is the right call.
4. **Bring-your-own-storage is architecturally consistent.** The reference-not-copy model holds across FRS-03, FRS-07, NFR-03, ARCHITECTURE-05 with no contradictions. Availability state modelling (`available` / `cloud_only` / `external_disconnected` / `missing` / `permission_denied`) is thorough.
5. **Decisions are actually recorded.** ARCHITECTURE-10 gives every decision an ID, owner, date, and rationale. Most teams at this stage have a Slack thread.

### Top risks and gaps

| # | Risk | Severity |
|---|---|---|
| B1 | Native-vs-KMP contradiction: ARCH-00/01/02/03 describe a different system than ARCH-10/11 | **Blocker** |
| B2 | The transactional outbox â€” the foundation of every no-data-loss guarantee â€” cannot be implemented as specified with the chosen stack (GRDB on iOS + Room on Android + shared Kotlin sync engine) | **Blocker** |
| B3 | ARCH-11 removes video proxies from MVP; RP-02, MP-20, MP-22, MP-80, OFF-11 (`Must`) depend on them. The core repurposing loop breaks for cloud-only and disconnected assets | **Blocker** |
| B4 | Per-install encryption key (DEC-006) + client-side encryption (ARCH-07 Â§6.5) makes the promised cross-device backup/restore (ACC-03, SET-34, REST-01 â€” all `Must`) cryptographically impossible. No recovery-key design exists | **Blocker** |
| B5 | MVP backend scope is undecided: ARCH-00/ARCH-07 make Remote Config `Must (MVP)`; FRS-08, FRS-09 and FRS-13 open questions all recommend MVP be local-only | **Blocker** |
| B6 | ARCHITECTURE-08 (Observability) is an empty 33-byte stub, referenced by ARCH-09 and required by NFR-11 Â§4 | **Blocker** |
| B7 | The 45/28/3 validation verdicts are not recorded per pain point anywhere; the counts don't sum to 80; confidence percentages are unsourced | **High** |
| B8 | Requirement-ID collisions across modules (`ACC-*`, `INT-*`, `OFF-*`, and every PRD prefix) make traceability and test mapping impossible | **High** |
| B9 | Requirements systematically contradicted by their own Open Questions â€” at least 9 instances where a `Must`/`Should` requirement says one thing and the recommendation at the bottom of the same document says the opposite | **High** |
| B10 | Missing stack decisions for `Must` features: speech-to-text (CAP-21/22/23), rich-text editing (FRS-10), push notification delivery, text three-way merge | **High** |

---

## 2. Problem Validation Check

### 2.1 The structural problem first

The review brief states 80 pain points were validated via Perplexity with 45 confirmed / 28 partially confirmed / 3 unconfirmed. **No document in the set records a verdict against any individual pain point.**

- `creator_pain_points.md` lists all 80 with evidence quotes for perhaps 15 of them, and **no verdict column at all**.
- `creator_os_vision.md` Â§14 and `creator_os_prd.md` Â§2 assert the 45/28/3 counts in summary tables.
- **45 + 28 + 3 = 76.** Four pain points are unaccounted for in every document that states the split.
- The vision Â§2 table introduces per-pain confidence percentages (93%, 92%, 93%, 91%, 94%, 91%, 88â€“93%, 74%) that appear in no other document, are attached to only 8 of 80 points, and cite no source.

**Consequence:** it is currently impossible for anyone â€” including this review â€” to check whether a requirement is grounded in a *confirmed* or a *partially confirmed* pain. The audit below therefore triangulates from the PRD's explicit "Unconfirmed" list (Â§2) and the vision's confidence table, which is all the evidence the documents provide.

### 2.2 Three different "Top 10" lists

| Rank | `creator_pain_points.md` (Deep Reasoning Conclusion) | `creator_os_vision.md` Â§14 | `creator_os_prd.md` Â§2 (only 8 items) |
|---:|---|---|---|
| 1 | Fragmented workflow across too many apps | Fragmented workflow | Fragmented workflow / too many tools |
| 2 | **No unified post/project record** | Old clips hard to search | Old clips/scripts/thumbnails hard to search |
| 3 | Idea loss between capture and production | Manual repurposing | Manual repurposing |
| 4 | Searching old clips is manual/unreliable | **Platform constraints / cross-posting** | Platform constraints / cross-posting |
| 5 | Manual repurposing | Notion/Milanote weak mobile/offline | Weak mobile/offline |
| 6 | Mobile/offline weaknesses | Pricing trust / subscription fatigue | Pricing trust / subscription fatigue |
| 7 | Calendar â‰  production readiness | Idea loss | Idea loss |
| 8 | Scheduler unreliability & shallow analytics | Calendar readiness | **Publishing status and readiness unclear** |
| 9 | **Storage/search limits for large raw libraries** | Scheduler analytics shallow | â€” |
| 10 | Pricing trust / subscription burden | **No unified post/project record** | â€” |

**Findings:**
- The vision's list **drops** "Storage/search limitations for large raw media libraries" (rank 9 in the source document) and **adds** "Platform constraints and cross-posting friction" (not in the source top 10 at all). No document explains the substitution.
- The PRD's list is 8 items, reorders again, and merges "publishing status" and "readiness" into one item that exists in neither of the other two lists.
- "No unified post/project record" is rank **2** in the source and rank **10** in the vision â€” yet it is the single most load-bearing concept in the entire architecture (the Content Item). The demotion is unexplained and, on the evidence, wrong.

**This must be reconciled to one canonical list before requirements are prioritised**, because the top-10 list is what the MVP scope claims to be derived from.

### 2.3 Pain point representation audit

The table below covers every pain point where representation is questionable, plus the top-10 items. Pain points not listed are, on inspection, adequately and non-controversially represented.

| Pain # | Pain (abbrev.) | Verdict available in docs | How represented | Correct? | Comment |
|---|---|---|---|---|---|
| 1, 2, 5, 78 | Fragmented workflow, too many tools | Confirmed (93%, vision) | CR-01/03/06, INT-01/02; whole product premise | âœ… | Well grounded |
| 3, 4, 30, 47 | No unified post/project record | Implied confirmed | FRS-01 entire module | âœ… | But demoted to #10 in vision â€” see Â§2.2 |
| 6 | No consistent workflow order | Not stated | CR-11/12/13 (custom, skippable, reversible stages) | âœ… | Correctly translated into flexibility, not a fixed pipeline |
| 7â€“13 | Idea loss / capture fragmentation | Confirmed (91%, vision) | FRS-02 entire module | âœ… | Strong |
| **11** | **More capture methods can increase loss** â€” creator deliberately limits capture surfaces | Not stated | **Not addressed** | âŒ | FRS-02 adds 8 capture modalities + widget + share sheet + Notes/Keep/Notion import. This is the *opposite* of what the evidence says. Only mitigation is CAP-35 Review Queue, priority `Should`. A counter-signal in the research has been inverted into a feature list. |
| 14â€“18, 20, 23 | Calendar / readiness / batch | **74% â€” lowest confidence in the vision table** | FRS-05 full module; CAL-02 `Must` | âš ï¸ | **This is the clearest case of a weakly-validated pain treated as fully confirmed.** A whole MVP module, a `Must` readiness engine (CR-32â€¦CR-37), at-risk warnings, batch views and scheduling lanes rest on the weakest data point the documents contain. |
| 19 | Long-range plans conflict with trends | Not stated | CAL-05, CAL-35â€¦CAL-40 (scheduling lanes) | âœ… | Reasonable |
| 21, 63 | Publishing reliability, posts fail, disconnects | Confirmed | PUB-01â€¦PUB-08; MVP has no auto-publish so cannot fail | âœ… | Correctly answered by *not building* the failing thing |
| 22, 71, 72, 74 | Cross-posting / platform constraints | 91% | PUB-02/04/05/06/08, capability matrix | âœ… | Best-handled area in the set |
| 24â€“32, 79 | Old clips hard to find | 92% | FRS-03 entire module | âœ… | Strong |
| **32** | **Storage overload / cloud pricing** | Confirmed | AS-01/03, TR-04, NFR-03 | âš ï¸ | Addressed for *raw media*, but the app's own footprint is projected at **0.5â€“2.5 GB for 100k records** (NFR-03 Â§3.3, NFR-07 Â§6.1). The product may reproduce the pain it claims to solve. See Â§4. |
| 33, 68, 70 | Download/re-upload loops, editorâ†’scheduler handoff | Confirmed | **Phase 2 only** (COL-50â€¦COL-54) | âš ï¸ | Legitimate deferral, but the PRD traceability matrix maps these to Phase-2 requirements without flagging that MVP has no answer. State it as a known MVP gap. |
| 34 | Thumbnails/reusable creative assets hard to rediscover | Not stated | AS-11â€¦AS-16 tagging, AS-30 library | âœ… | Covered generically; no dedicated template/intro/SFX library as the pain describes |
| 35, 37, 39 | Manual repurposing | 93% | FRS-04 entire module | âœ… | Strong â€” and **B3 breaks it**, see Â§5 |
| **40** | **Duplicate reuse tracking** | **Unconfirmed (PRD Â§2)** | RP-08 `Should` (provenance only), RP-40 `Must` (explicitly *not* a compliance check), RP-41 Phase 2 | âœ… | **Exemplary handling.** This is how an unconfirmed point should be treated. Use it as the template for the others. |
| **42** | **Filming produces volumes needing manual culling** (6â€“10 looks, 2 h of footage, separate review days) | Not stated | **No requirement** | âŒ | The only trace is CR-21's `select` attachment role. There is no rate/reject/compare-takes workflow anywhere. This is a substantial, concretely described pain with zero functional coverage. |
| 41 | Script disconnected from footage | Not stated | SE-37â€¦SE-41 (link script line â†’ asset/clip) | âœ… | Covered â€” this is the legitimate justification for FRS-10 existing at all |
| 43, 44 | Editing passes, caption timing | Not stated | Out of scope (non-goal: full editor) | âœ… | Correct exclusion |
| 45, 46 | Thumbnail/caption decisions at inconsistent times | Not stated | CR-26/27, PUB-15/16 (variants prepared early) | âœ… | Reasonable |
| 48 | Creators manually build complex systems | Not stated | ON-01â€¦ON-08 low-setup onboarding | âš ï¸ | Partially â€” but the MVP as specified has 6 view surfaces, custom stages, lanes, pillars, tags, templates and readiness rules to configure. The product risks *becoming* pain #48. |
| 49â€“53 | Analytics fragmented / shallow | Confirmed | FRS-15, all Phase 2 | âœ… | Correct deferral; PRD is explicit |
| 54â€“58 | Mobile/offline weakness | **94% â€” highest confidence** | FRS-08, NFR-02, whole local-first architecture | âœ… | Strongest evidence in the set, and it drives the strongest part of the architecture |
| **59** | **"No fast local search for media"** | **Unconfirmed (PRD Â§2)** | AS-26, AS-28, OFF-04, NFR-01 Â§3.2 â€” an entire NFR document and the headline value prop | âŒ | **Direct contradiction.** The PRD lists this as an unconfirmed point that is "not an MVP driver," and then the MVP is built on it. Either the verdict is wrong (likely â€” it overlaps heavily with the 94%-confidence #58 and 92%-confidence #24) or the product's primary technical investment is unvalidated. This must be resolved explicitly, not left implicit. |
| 60â€“67 | Pricing trust, tool reliability | 88â€“93% | TR-01â€¦TR-06, FRS-14 SUB-05/06/16/53 | âœ… | Well handled |
| 67 | Cloud privacy â€” reluctance to upload raw footage | Confirmed | TR-04, AS-03, NFR-05 | âœ… | Architecturally enforced, not just promised |
| 69 | Collaboration fragmented | Confirmed | FRS-16, Phase 2 | âœ… | Correct deferral |
| 73, 75 | Publishing status unclear; native-posting reminders needed | Confirmed | PUB-03, PUB-27â€¦PUB-33, PUB-45â€¦PUB-50 | âœ… | Strong |
| 76, 77 | Burnout from coordination overhead | Confirmed | Implicit product premise | âš ï¸ | No requirement and no success metric measures coordination-time reduction. "Time to locate an asset" is the only proxy. |
| **80** | **"New tool must show time savings quickly"** | **Unconfirmed (PRD Â§2)** | Treated as a design constraint (ON-01â€¦ON-07, CAP-09) | âš ï¸ | Reasonable treatment, but no success metric measures time-to-first-value, and no requirement defines the "first 5 minutes" experience. If this point *is* real (and pain #48 suggests it is), the MVP's configuration surface is a threat to it. |

### 2.4 Misrepresentation flags â€” summary

1. **Unrecorded verdicts (B7).** The 45/28/3 split cannot be checked against any point. Counts don't sum to 80.
2. **Pain #59 treated as confirmed** while listed as unconfirmed. The single most important inconsistency in the validation chain.
3. **Pain #11 inverted.** Research says more capture surfaces cause loss; the product adds capture surfaces without adding triage capacity.
4. **Pain #14â€“18 (74% confidence) elevated to a full `Must` MVP module** with no acknowledgement of its weaker evidence base.
5. **Pain #42 has no functional requirement.**
6. **Top-10 list substituted** between the research document and the vision without explanation.
7. **Unsourced confidence percentages** in a document set whose thesis is "validated, not assumed."

---

## 3. Functional Requirements Check

### 3.1 Top-10 pain points â†’ FRS module mapping

Using the source document's canonical top 10 (`creator_pain_points.md`):

| # | Validated pain | Primary FRS | Supporting FRS | Coverage |
|---|---|---|---|---|
| 1 | Fragmented workflow across apps | FRS-01 (CR-01â€¦CR-47) | FRS-07, FRS-13 | âœ… Complete |
| 2 | No unified post/project record | FRS-01 | FRS-04 (source/derivative), FRS-06 (variants) | âœ… Complete |
| 3 | Idea loss capture â†’ production | FRS-02 (CAP-01â€¦CAP-M7) | FRS-12 (reminders), FRS-08 (offline) | âœ… Complete â€” but see pain #11 |
| 4 | Searching old clips is manual | FRS-03 (AS-01â€¦AS-M9) | FRS-11 (preview), FRS-10 (script FTS) | âœ… Complete |
| 5 | Manual repurposing | FRS-04 (RP-01â€¦RP-M7) | FRS-11 (in/out marking) | âš ï¸ **Broken by B3** â€” proxy removal |
| 6 | Mobile/offline weakness | FRS-08 (OFF-01â€¦OFF-M7) | NFR-02, all modules | âš ï¸ MVP cloud scope undecided (B5) |
| 7 | Calendar â‰  readiness | FRS-05 (CAL-01â€¦CAL-M6) | FRS-01 (CR-32â€¦CR-37) | âœ… Complete â€” but weakest evidence (74%) |
| 8 | Scheduler unreliability, shallow analytics | FRS-06 (reliability half) | FRS-15 (analytics, Phase 2) | âœ… MVP half covered; analytics correctly deferred |
| 9 | Storage/search limits for large raw libraries | FRS-03, FRS-07 | NFR-03 | âš ï¸ Covered for user media; **the app's own 0.5â€“2.5 GB footprint is unaddressed** |
| 10 | Pricing trust / subscription burden | FRS-14, FRS-13 | TR-01â€¦TR-06 (PRD) | âœ… Complete |

**No top-10 pain point is entirely without a functional requirement.** Two are compromised by architectural decisions (#5, #6) and one is only half-addressed (#9).

### 3.2 Missing functional requirements for MVP

| # | Gap | Why it matters | Suggested priority |
|---|---|---|---|
| M1 | **Footage culling / selects workflow** (pain #42) | Concretely described pain â€” "6â€“10 looks," "2 hours of footage," "separate days reviewing and selecting." Only CR-21's `select` role exists. No rate, reject, compare-takes, or bulk-triage flow. | `Should` for MVP |
| M2 | **App lock / biometric gate** | Named as the primary mitigation for lost/stolen device in NFR-05 Â§9 and ARCH-06 Â§3.3, but exists as **no requirement in any FRS**. The app holds scripts, transcripts and file paths classified "High" sensitivity. | `Should` |
| M3 | **Tag management** (rename, merge, delete, list) | Tags appear in 40+ requirements and are central to search. AS-M8 covers inline add/remove only. Without merge/rename, a 100k-asset library accumulates unusable tag sprawl â€” reproducing pain #26. | `Must` |
| M4 | **Content pillar management** | Pillars are referenced in ~15 requirements as a filter and grouping dimension. Nothing defines how a user creates, renames or deletes one. | `Must` |
| M5 | **Free-tier limit reached mid-index** | SUB-35 covers subscription *expiry*. Nothing defines behaviour when a Free user's 500-asset index limit is hit during a background scan of a 10,000-file drive â€” the most likely first-run experience. Directly threatens pain #80 and #60â€“67 (trust). | `Must` |
| M6 | **Transcription language, accuracy and failure semantics** | CAP-21â€¦CAP-26 are `Must` but never state supported languages, expected accuracy, maximum audio length, or behaviour on unsupported language. FRS-14 meters it at 5/month, implying cloud cost, with no unit economics anywhere. | `Must` |
| M7 | **Multi-device behaviour before cloud sync exists** | FRS-08's own acceptance criterion US-03 reads "Two devices edit same item" â€” but if MVP is local-only (per its own Open Q1), there is no two-device scenario. Either the criterion or the scope is wrong. | Resolve, then specify |
| M8 | **First-run source selection and initial index experience** | ON-08 covers platforms and pillars. Nothing covers "connect your first storage source and watch 10,000 files index," which NFR-01 says takes 2â€“10 minutes on a mainstream device. This is the make-or-break first session. | `Must` |
| M9 | **Search relevance specification** | AS-27 (`Should`) says "recent and frequently used prioritised." Nothing else. NFR-01 mentions `bm25()`. For a product whose core value is search, there is no relevance requirement, no zero-result behaviour spec, and no NFR for search *quality* (only latency). | `Must` |
| M10 | **Deep-link registry for native handoff** | PUB-28 (`Should`) and PUB-M6 depend on TikTok/Instagram/YouTube URL schemes. No document enumerates them, states which currently support pre-filled composition, or defines the fallback. This is the mechanical core of the MVP's publishing value. | `Must` |

### 3.3 Over-engineered or out-of-scope for MVP

| # | Item | Assessment |
|---|---|---|
| O1 | **FRS-10 Teleprompter (SE-24â€¦SE-31, `Must`)** â€” full-screen scroll, WPM control, 16â€“96 pt, mirror mode, screen-awake, timestamp sync | **Traces to no pain point among the 80.** It is not in the vision's MVP scope (Â§8), not in the PRD's MVP scope (Â§6), and appears for the first time at FRS level as a `Must`. FRS-10's own Open Q3 defends it as "a differentiator" â€” which is a market argument, not a validation argument, in a document set whose thesis is that requirements are validated. **Cut to Phase 2 or produce validation evidence.** |
| O2 | **FRS-10 as a full module** â€” shot lists, script types, CTA templates, find/replace, PDF export, version compare, WYSIWYG + Markdown | The validated pain (#41) is "script is disconnected from footage." That justifies SE-37â€¦SE-41 (link script lines to assets) and a plain editor. It does not justify a document-editing product. **Also: no rich-text editor component is chosen in the tech stack** â€” neither SwiftUI nor Compose ships one. This is a significant unbudgeted build. |
| O3 | **FRS-11 frame-stepping (MP-22, `Must`)** | Frame-accurate stepping requires a local decodable rendition. With proxies removed from MVP (B3) this is unimplementable for anything not locally cached. Either restore proxies or downgrade MP-22 to `Should` for locally-available assets only. |
| O4 | **FRS-13 migration suite** â€” Notion CSV/JSON import, Google Docs import, Google Keep via Takeout, field mapping, preview, rollback | Contradicts FRS-02's own Open Q5 ("Later. Share-sheet capture is enough for MVP") and FRS-13's own Open Q2 (partial). A full import/mapping engine is a multi-sprint build for a use case that occurs once per user. |
| O5 | **FRS-14 Subscription module in MVP** | The module's own Open Q1 recommends launching free. Header says "Optional for MVP." Yet it contains 40+ requirements at `Must`, and DEC-016 commits to RevenueCat. Decide: if launch is free, this is Phase 2 and RevenueCat is not an MVP dependency. |
| O6 | **PUB-M1 Platform Connection Management UI (`Must`)** | An MVP-`Must` settings screen for managing platform connections that, per PUB-51 and INT-36, **do not exist until Phase 2**. Same for PUB-M2's `retry` action and PUB-01's `Auto-Publish Queued` state. |
| O7 | **CAL-48 two-way Google/Apple Calendar sync (`Should`)** | PRD INT-03 says "read-only/calendar integration." INT-31 says "export as read-only events." CAL-48 says two-way. FRS-05 Open Q5 says two-way is Phase 2. Three of the four say read-only; CAL-48 should be corrected. |
| O8 | **Six view surfaces in MVP** â€” list, board (drag-drop Kanban with custom reorderable stages), calendar (month/week/list), asset library (grid/list), clip library (grid/list), batch planning view | Each is individually justified. Together, with custom stages, lanes, pillars, tags, templates and configurable readiness rules, the MVP's configuration surface risks reproducing pain #48 ("creators manually build complex workflow systems") and #64 ("Notion flexibility becomes complexity"). Recommend deferring board-view stage customisation (CR-11 reorder/custom) and CAL-M4 readiness-threshold configuration to Phase 2. |
| O9 | **AS-M3 full-screen asset preview (`Must`) duplicates all of FRS-11** | Two modules specify the same screen. Delete AS-M3, reference FRS-11. |
| O10 | **CR-M5 Content Templates (`Should`)** | Contradicted by FRS-01's own Open Q3: "Later, but data model should allow defaults." |

### 3.4 Requirement conflicts â€” catalogue

Conflicts fall into three classes. Every one needs a written resolution before development.

**Class A â€” a requirement contradicted by its own document's Open Question (systematic; 9 instances):**

| Requirement | Says | Open Question in same doc says |
|---|---|---|
| FRS-01 CR-M5 (`Should`) | Support content templates | Q3: "Later" |
| FRS-02 CAP-M2 (`Should`) | Import from Keep/Apple Notes/Notion | Q5: "Later. Share-sheet is enough for MVP" |
| FRS-03 AS-02, AS-36 (`Must`) | Index Drive, Dropbox, iCloud, OneDrive | Q1: "Local + Google Drive first; Dropbox/iCloud later" |
| FRS-05 CAL-28 (`Should`) | Batch planning view | Q2: "A simple batch view is **Must**" |
| FRS-05 CAL-48 (`Should`) | Two-way calendar sync | Q5: "full two-way sync can be Phase 2" |
| FRS-06 PUB-M4 (`Must`) | Character-count validation | Q5: "**Should**, not Must, as rules change" |
| FRS-07 INT-16 (`Should`) | Optionally store proxies alongside originals if writable | Q4: "No, keep read-only for external storage" |
| FRS-08 OFF-M1/M2 (`Must`) + all of Â§4.3â€“4.5 | Sync Center, conflict resolution, multi-device sync | Q1: "MVP can be local-only with manual export" |
| FRS-13 BACK-10â€¦BACK-18 (mostly `Must`) | Cloud backup enable/pause/delete/restore | Q1: "Phase 2 for actual cloud backup" |

**Class B â€” cross-document conflicts:**

| # | Conflict | Documents |
|---|---|---|
| C1 | **Cloud storage provider scope.** All four providers `Must` vs Drive `Must` / Dropbox `Should` / iCloud+OneDrive Phase 2 | FRS-03 AS-02, AS-36 vs FRS-07 INT-01â€¦INT-03 vs PRD INT-01 vs ARCH-05 Â§6.1 |
| C2 | **Platform account connections.** `Should` for MVP vs Phase 2 | PRD PUB-01 vs FRS-06 PUB-51, PUB-34 vs FRS-07 INT-36 |
| C3 | **Publishing state machine.** 7 states vs 8 states vs 15 states vs 7 differently-named states | PRD PUB-03 vs FRS-06 PUB-01 vs NFR-08 Â§7.1 vs ARCH-03 `publishing_state` |
| C4 | **Local DB encryption.** "Device-level encryption / Encrypted SharedPreferences equivalent" vs "SQLCipher AES-256, no plaintext shadow search files" | FRS-08 OFF-07 vs NFR-05 Â§4.1 / ARCH-03 Â§8 |
| C5 | **Voice transcription trigger.** "Automatically transcribe when network available" (`Must`) vs "OCR/transcription: charging only by default" | FRS-02 CAP-21 vs NFR-04 Â§3.1 |
| C6 | **Transcription cost model.** Unlimited automatic (`Must`) vs 5/month on Free vs "on-device where possible" | FRS-02 CAP-21/22 vs FRS-14 Â§4.3 vs FRS-02 Q1 |
| C7 | **Advanced search filters tiering.** Listed as a Pro feature in SUB-04, listed as `Included` for both Free and Pro in the Â§4.3 table | FRS-14 internal |
| C8 | **Calendar integration direction.** Read-only export vs two-way sync | PRD INT-03 / FRS-07 INT-31 vs FRS-05 CAL-25, CAL-48 |
| C9 | **Video proxies in MVP.** `Should` generate + Open Q "Yes, important" vs "No proxy generation" in MVP | FRS-03 AS-05/Q2, FRS-04 RP-02, FRS-11 MP-20/22 vs ARCH-11 Â§9.1 |
| C10 | **Performance targets.** Search <2 s / cold start <5 s vs search â‰¤100 ms p50 / cold start â‰¤1.0 s p50 | PRD Â§8 NFR-02, FRS-03 AS-28 vs NFR-01 Â§3.1â€“3.2 |
| C11 | **Startup integrity check.** "Startup must not block on SQLite integrity check" vs "Lightweight `PRAGMA quick_check` on cold start" | NFR-01 Â§3.1 / NFR-07 Â§4.2 vs NFR-09 Â§4.2 |
| C12 | **Text merge strength.** Three-way merge required vs "merge (for text fields if possible)" `Should` | NFR-02 Â§7.1, NFR-09 Â§6.3 vs FRS-08 OFF-29 |
| C13 | **Thumbnail/proxy encryption.** AES-256 authenticated encryption required vs plain `{asset_id}.jpg` / `.mp4` on disk, "optional application-layer encryption" on Android | NFR-05 Â§4.1 / ARCH-06 Â§4.1 vs ARCH-05 Â§4.1, Â§4.3, ARCH-03 Â§8.2 |
| C14 | **Primary navigation.** "3â€“5 destinations" listing 5, plus Reminder Center "from main navigation" (6th) vs "four main destinations" followed by a five-row table | NFR-06 Â§4.2, FRS-12 REM-11 vs ARCH-01 Â§5.1 |
| C15 | **Data above Free limits after downgrade.** "no retroactive loss of access" vs "remains accessible/exportable but **not editable** beyond free limits" | PRD TR-02 / SUB-06 vs SUB-35 |

**Class C â€” internal contradictions within one document:**

- NFR-01 Â§3.4: "60 fps minimum" and "No frame exceeding 700 ms" and "Input event response â‰¤5 s" in the same table. The latter two are the Android *frozen-frame* and *ANR* failure thresholds, not targets. As written, a 699 ms frame is compliant.
- NFR-03: Â§3.3 table gives 10â€“50 MB metadata+FTS per 1,000 assets (â†’ 1â€“5 GB at 100k); Â§3.3 prose and Â§8 give 0.5â€“2.5 GB (5â€“25 KB/asset). Two-fold discrepancy in the same document.
- ARCH-01 Â§5.1: "four main destinations" followed by five rows.
- FRS-14 Â§4.1 SUB-04 vs Â§4.3 table on advanced search filters (see C7).
- FRS-08 has two sections numbered Â§4.9.

---

## 4. Non-Functional Requirements Check

### 4.1 Coverage table

| NFR area | Document | Covered? | Measurable? | Aligned with architecture & stack? | Issues |
|---|---|---|---|---|---|
| Performance | `NFR.md` (titled NFR-01) | âœ… Excellent | âœ… p50/p95, per device class | âš ï¸ | **Filename doesn't match its own title**; 6+ documents cross-reference a non-existent `NFR-01-performance.md`. Contradicts PRD Â§8 by 10â€“20Ã—. "No frame >700 ms" and "input â‰¤5 s" are failure thresholds masquerading as requirements. Targets not re-validated against SQLCipher overhead. |
| Offline & sync | NFR-02 | âœ… Excellent | âœ… Best-quantified doc in the set | âŒ | Presupposes a sync **server** throughout (server ack, remote revision, operation-level SLOs, "single-user multi-device"). FRS-08/13 open questions recommend MVP be local-only. Requires three-way text merge that FRS-08 makes optional and that the data layer stores no ancestor for. |
| Storage & bandwidth | NFR-03 | âœ… Thorough | âš ï¸ | âš ï¸ | Internal arithmetic contradiction (1â€“5 GB vs 0.5â€“2.5 GB at 100k). Sizing assumes external-content FTS5 avoids text duplication â€” **ARCH-03's actual schema duplicates all text into `search_content`**, so real footprint is higher than every estimate here. Proxy sizing is moot given ARCH-11 removed proxies from MVP. |
| Battery, thermal, memory | NFR-04 | âœ… Excellent | âœ… %/hour, MB per RAM class, concurrency limits | âœ… | Conflicts with CAP-21 (`Must` auto-transcribe) via charging-only default. Battery budgets not re-derived for SQLCipher + `synchronous=FULL` + per-second autosave. |
| Security & privacy | NFR-05 | âœ… Excellent | âœ… | âš ï¸ | **Factual error: "SQLCipher or equivalent AES-256-GCM."** SQLCipher 4 uses AES-256-**CBC** with per-page HMAC-SHA512. Requires encrypted thumbnails/proxies that ARCH-05 stores as plain files and that no thumbnail pipeline (Coil/Kingfisher) or media player supports without custom work. |
| Accessibility & usability | NFR-06 | âœ… Excellent | âœ… WCAG 2.2 AA, touch targets, interaction counts | âœ… | Best-in-class. Only issue: navigation destination count conflicts with ARCH-01. |
| App size & resources | NFR-07 | âœ… Thorough | âœ… CI gates with warn/block | âŒ | **Component budget predates the stack.** No line for the KMP framework, Ktor, SQLDelight, RevenueCat SDK or Sentry SDK. Targets of 25â€“45 MB Android / 30â€“55 MB iOS were computed for a plain native app. ~60% duplicated verbatim from NFR-03 and NFR-01 with no statement of which is normative. |
| Platform integration & remote config | NFR-08 | âœ… Excellent | âœ… SLOs, retry schedules, quota tables | âš ï¸ | Strongest platform-realism in the set. But its 15-state publishing machine conflicts with FRS-06 (8) and ARCH-03 (7), and its backend-mediated model conflicts with the undecided MVP backend scope (B5). |
| Reliability & data integrity | NFR-09 | âœ… Excellent | âœ… Explicit SLO table | âš ï¸ | "FTS index consistency 100% after any transaction" is **unimplementable as ARCH-03 specifies it** (see Â§5, E2). `quick_check` on cold start contradicts NFR-01/NFR-07 startup rules. |
| Localization & theming | NFR-10 | âœ… Adequate | âš ï¸ | âœ… | MVP language support is "strongly recommended but optional" â€” not a requirement. "Android 9 covers over 90% of active devices" is uncited and, in 2026, likely stale. Min API 28 with NFR-04 referencing Android 15 behaviours gives a 7-version test matrix with no matrix defined. |
| Maintainability & compliance | NFR-11 | âœ… Thorough | âœ… Coverage %, patch SLAs | âš ï¸ | MA-01's module list omits Script Editor, Media Preview, Notifications/Trash, Import/Export and Subscription â€” five modules that exist in ARCH-02. Alert threshold "p95 search > 500 ms" conflicts with NFR-01's â‰¤250 ms p95. Crash-free â‰¥99.5% is below current norms for a utility app. |
| Observability | NFR-11 Â§4 | âœ… In NFR | â€” | âŒ | **ARCHITECTURE-08 is an empty 33-byte stub.** No observability architecture exists despite NFR-11 Â§4 requirements, DEC-012, and ARCH-09's reference to it. |
| Compliance | NFR-11 Â§5 | âœ… Thorough | âš ï¸ | âœ… | GDPR/CCPA/COPPA/store policies covered. **Data residency is named as a requirement but no region decision exists** (DEC-007 picks Supabase; no region, no DPA list, no subprocessor register). |

### 4.2 NFR areas that are missing entirely

| Missing NFR | Why it's needed |
|---|---|
| **Search quality** | Only latency is specified. No precision/recall target, no relevance evaluation set, no zero-result or typo-tolerance behaviour. The product's #1 differentiator has no quality requirement. |
| **Transcription quality, latency and cost** | CAP-21 is `Must`. No WER target, no max audio length, no language list, no per-minute cost model. FRS-14 meters it, implying real unit cost, with no economics anywhere. |
| **Indexing correctness** | NFR-01 specifies indexing *throughput* but not *completeness*. What percentage of a 10,000-file drive must index successfully? What happens to the failures? |
| **Capacity beyond assets** | 100,000 assets is the only scale target. No limit is stated for Content Items, Clips, Ideas, tags, revisions or sync-outbox depth â€” all of which affect the same DB and the same latency budget. |
| **Cost / unit economics** | Pricing trust is a top-10 validated pain. Nothing anywhere models Supabase, Sentry, RevenueCat or STT cost per user, so the "transparent, no retroactive paywall" promise (TR-01/TR-02) is unbacked. |
| **Data residency** | Named in NFR-11 Â§5.2 as a requirement; no decision made. |

### 4.3 Overly stringent

- **"0 tolerated"** for silent data loss, silent overwrite and duplicate publishes (NFR-02 Â§6.1, NFR-09 Â§11). Correct as engineering principles, but stated as SLOs with no measurement definition â€” you cannot measure "0 silent overwrites" without instrumenting for a thing that is by definition silent. Reframe as invariants enforced by design + specific tests.
- **"FTS index consistency with canonical records: 100% after any transaction"** (NFR-09 Â§11) â€” achievable only with in-transaction triggers, which ARCH-03 does not specify (E2).
- **Search â‰¤100 ms p50 at 100k records** on API-28-era hardware, through SQLCipher, with filter joins and `bm25()` ranking. Defensible for bounded FTS5 queries in isolation; not yet evidenced for this query shape on this stack. Must be measured in the spike, not assumed.
- **Local save â‰¤100 ms p50 with `synchronous=FULL`** (NFR-02 Â§4.1) combined with SE-04's â‰¤1 s autosave debounce means an fsync roughly every second while a user types a script, on an encrypted database. This is the single most likely NFR to fail in practice, and it also threatens NFR-04's â‰¤1% battery per 30 minutes of active use.

### 4.4 Too loose

- **"Input event response â‰¤5 s"** (NFR-01 Â§3.4) â€” the Android ANR threshold. Using a crash-prevention limit as a UX requirement.
- **"No frame exceeding 700 ms"** â€” the Android *frozen frame* definition. Contradicts the 60 fps line directly above it.
- **Crash-free sessions â‰¥99.5%** (NFR-11) â€” permits ~1 crash per 200 sessions in an app whose core promise is "never lose your ideas."
- **MVP localization "strongly recommended but optional"** (NFR-10 Â§3.1) â€” not a requirement.
- **PRD Â§8 NFR-02 "search under 2 seconds, cold start under 5 seconds"** â€” 20Ã— and 5Ã— looser than NFR-01. The PRD's NFR section should be deleted and replaced with a pointer to the NFR documents, which supersede it.

---

## 5. Architecture & Tech Stack Check

### 5.1 Document-by-document verification

| Document | Verdict | Key findings |
|---|---|---|
| ARCH-00 Overview | âŒ **Superseded but not updated** | Â§3.2 explicitly rejects cross-platform and Â§9 decides "Native mobile â€” two codebases; shared logic via domain layer." ARCH-10/11 introduce KMP. This document now actively misleads. It also makes Remote Config `Must (MVP)` â€” the only place the MVP backend is asserted. |
| ARCH-01 Platform & UI | âŒ **Superseded but not updated** | Â§2 rejects cross-platform again. Â§4.1/4.2 show duplicated `Core/Entities`, `Core/UseCases` in *both* iOS and Android trees â€” i.e. mirrored, not shared, domain logic. Â§5.1 says "four main destinations," lists five. Otherwise a good, buildable UI spec. |
| ARCH-02 Module Design | âš ï¸ Good, with real defects | Solid ownership model. But: **circular dependency** (`ClipModule â†’ MediaPreviewModule` and `MediaPreviewModule â†’ ClipModule`) violating its own principle 3. **Ownership contradiction**: AssetModule "owns the global FTS index across entities" while Â§4.2 says only the owning module may write its data. Still references superseded "FRS-09 (P2)" / "FRS-10 (P2)" instead of FRS-15/16, and claims to map "FRS-01 to FRS-14" when 16 exist. Revision history is owned by NotificationModule while also specified in FRS-01 and FRS-10. |
| ARCH-03 Data Layer | âŒ **Contains two substantive technical errors and significant schema gaps** | See Â§5.3 E1â€“E5. This is the most consequential document in the set and needs the most work. |
| ARCH-04 Sync | âš ï¸ Sound design, one unresolved tension | Outbox, idempotency, per-entity ordering, retry classes are all correct. But Â§8.2 ("server cannot decrypt") vs Â§6/Â§7.1 (server dedups and detects conflicts by base revision) needs an explicit plaintext-metadata envelope spec. **Three-way merge is required with no ancestor snapshot stored anywhere in the schema.** |
| ARCH-05 Storage | âš ï¸ Strong, one contradiction | Availability state machine and source-signature design are excellent. Â§4.1 stores previews as plain `{asset_id}.jpg` / `.mp4`, contradicting Â§11 and NFR-05. External-drive enumeration via SAF on Android (a full SSD walk through `DocumentFile`) is a known severe-performance path that is not acknowledged. |
| ARCH-06 Security | âš ï¸ Good, repeats E1 | Threat model is proper. Repeats "SQLCipher AES-256-GCM". Names app-lock/biometric as a mitigation for which no requirement exists (M2). `PRAGMA cipher_compatibility = 4` is a downgrade-compatibility pragma, not a security setting â€” likely copied without intent. |
| ARCH-07 Backend & API | âš ï¸ Reasonable, one blocking gap | API design, error format, idempotency headers, rate limits are all appropriate. **Â§6.5 envelope encryption has no key-recovery design and no key-loss story**, which is B4. "Cloud provider TBD" in Â§11.1 was resolved in DEC-007 but never back-propagated. |
| ARCH-08 Observability | âŒ **Empty file (33 bytes)** | Referenced by ARCH-09's header. Required by NFR-11 Â§4. DEC-012 decided the tooling. The architecture was never written. |
| ARCH-09 Deployment | âœ… Solid | CI/CD gates, staged rollout, IaC, migration policy, canary â€” all appropriate and consistent with NFR-11. No significant issues. |
| ARCH-10 Open Decisions | âš ï¸ Good format, questionable statuses | Every decision has ID, owner, date, rationale â€” a real strength. But see Â§5.6. |
| ARCH-11 Technology Stack | âš ï¸ Plausible stack, three blocking inconsistencies | See Â§5.4 and Â§5.5. |

### 5.2 Does the architecture correctly implement local-first / offline-first?

**In principle, yes.** The three stated principles (local DB is source of truth; cloud optional and asynchronous; integrate don't replace) are correct for the validated problem, and the durable-outbox pattern in NFR-02/ARCH-04 is the right mechanism.

**In practice, one link in the chain is broken.** Every no-data-loss guarantee in the set â€” NFR-02 Â§4.1, NFR-09 Â§4.1, ARCH-03 Â§6.1, ARCH-04 Â§4.2 â€” depends on a single SQLite transaction that atomically (1) applies the canonical write, (2) increments the revision, (3) updates the search index, and (4) inserts the sync operation.

The chosen stack (ARCH-11 Â§2, Â§5) puts the **sync engine in shared Kotlin** ("Sync engine â€” shared outbox, conflict rules, idempotency â€” Pure Kotlin") but the **database drivers in GRDB (Swift) on iOS and Room (Kotlin/JVM) on Android**. A Kotlin Multiplatform module cannot enlist in a GRDB transaction. On iOS, the shared sync engine physically cannot write the outbox row inside the same transaction as the canonical write performed by Swift/GRDB code.

There are only two coherent resolutions, and neither is chosen:
- **(a)** Move the data layer to SQLDelight for both targets, making the transaction boundary shared â€” which is what DEC-001's risk note ("SQLCipher + SQLDelight/KMP integration is not turnkey") gestures at but does not decide; or
- **(b)** Keep GRDB + Room and move the outbox write natively per platform, reducing the "shared sync engine" to protocol, serialisation, conflict-policy and retry logic â€” which is defensible but must be written down, because it changes what the KMP module *is*.

**This is B2 and it is the most important technical finding in this review.**

### 5.3 Data layer verification â€” technical errors

**E1 â€” "SQLCipher AES-256-GCM" is factually wrong.** Stated in NFR-05 Â§4.1, ARCH-03 Â§8.1, ARCH-06 Â§4.1 and ARCH-11 Â§6. Verified against Zetetic's design documentation: SQLCipher uses **AES-256 in CBC mode**, with a per-page **HMAC-SHA512** over the ciphertext and IV providing authentication. It is authenticated encryption, but not AEAD/GCM. Not cosmetic: NFR-05's "authenticated encryption with OS-protected keys" claims and any future security review must be stated in SQLCipher's actual terms.

**E2 â€” "the FTS5 external-content index updates automatically" is false.** ARCH-03 Â§5 states: *"When a canonical record changes, the owning module updates `search_content` within the same transaction, and the FTS5 external-content index updates automatically."* Verified against the SQLite FTS5 documentation, which states the opposite: *"It is still the responsibility of the user to ensure that the contents of an external content FTS5 table are kept up to date with the content table. One way to do this is with triggers."* Deletes in particular require the special `INSERT INTO fts(fts, rowid, â€¦) VALUES('delete', â€¦)` form.

Consequences: NFR-09's "FTS index consistency with canonical records: 100% after any transaction" is currently unimplemented; ARCH-11 Â§5.2 correctly says "explicit triggers" for Android but Â§5.1 (iOS) does not; and ARCH-03, which is the normative data-layer document, teaches the wrong thing.

**E3 â€” the external-content FTS5 rationale is defeated by the actual schema.** External-content mode was chosen specifically to avoid duplicating text (NFR-03 Â§3.3 "avoids duplicating text; index is compact"; ARCH-00 Â§9). But ARCH-03 Â§5 creates a `search_content` table holding full copies of `title`, `script_text`, `caption_text`, `transcript_text`, `file_name`, `notes` and `tags_text` â€” duplicating text that already lives in `content_item`, `idea`, `clip` and the script tables. The text is now stored **twice in canonical form plus once in the index**. Every storage estimate in NFR-03 and NFR-07 understates the real footprint. Either index each canonical table separately with per-table external-content FTS5 tables, or keep `search_content` and re-baseline the storage numbers.

**E4 â€” `publishing_state` primary key is wrong.** ARCH-03 Â§4.5 declares `content_item_id TEXT PK` on a table that carries a `platform` column, while PUB-40 and PUB-41 (`Must`) require one live URL and one publish timestamp **per platform** per item. The primary key must be composite `(content_item_id, platform)`.

**E5 â€” schema gaps against `Must` requirements:**

| Missing | Required by |
|---|---|
| Content-item tag tables (only `asset_tag` exists) | CR-06 (`Must`); `search_content.tags_text` |
| Workflow/stage definition table for custom, reorderable stages | CR-10, CR-11 (`Must`) |
| Stage-transition history | CR-14 (`Should`) |
| `clip.content_item_id` | RP-25 (`Must`) |
| `script` and `script_version` tables | SE-17â€¦SE-23 (`Must`), CR-M1 (`Must`) |
| `content_pillar` table | CR-07 (`Must`) |
| Ancestor/base snapshot for three-way merge | NFR-02 Â§7.1, NFR-09 Â§6.3 |
| Definitions for `reminder`, `trash_entry`, `revision`, `backup_record`, `notification_preference`, `storage_connection`, `remote_config_cache`, `entitlement`, `purchase_record` | Listed by name only in Â§4.7 |

Also: `content_item.kind` includes `idea` while a separate `idea` table exists â€” ambiguous. And ARCH-03 Â§6.1 step 4 inserts the sync operation **only "if cloud backup is enabled"**, which means enabling backup later has no change history to replay; the full-initial-upload path is not specified.

### 5.4 Sync, storage, security, backend, observability, deployment â€” consistency

| Area | Internally consistent? | Notes |
|---|---|---|
| Sync | âš ï¸ | Outbox/idempotency/ordering all coherent. Broken by B2 (transaction boundary) and by the unresolved E2EE-vs-server-conflict-detection tension. No ancestor storage for the required three-way merge. |
| Storage | âš ï¸ | Coherent except plain-file previews vs mandated encryption (C13), and unacknowledged SAF enumeration cost for external drives. |
| Security | âš ï¸ | Coherent and thorough except E1, the encrypted-preview practicality problem, and the missing app-lock requirement. |
| Backend | âŒ | MVP scope contradicted between ARCH-00/07 (`Must`) and three FRS open questions (Phase 2). Key recovery undesigned (B4). |
| Observability | âŒ | Architecture document is empty. |
| Deployment | âœ… | Consistent and appropriate. |

### 5.5 Tech stack â€” justification, gaps, mismatches

**Is the stack justified?** Partly. Supabase, RevenueCat, Sentry, GitHub Actions + fastlane, SwiftUI + Compose, and SQLite/FTS5/SQLCipher are all defensible choices for a small team building this product, and DEC-004's reasoning for GRDB (migrations, observation, raw SQL access for external-content FTS5) is genuinely good.

**But the justification has three weaknesses:**

1. **Alternatives are named, not evaluated.** There is no comparison of SQLDelight-for-both-platforms vs GRDB+Room; no Firebase vs Supabase vs custom comparison; no RevenueCat vs direct StoreKit 2 / Play Billing analysis; no discussion of Core Data, Realm or ObjectBox; and â€” most notably â€” **Compose Multiplatform is never mentioned**, despite being the natural counterfactual to "native UI + KMP shared core."
2. **DEC-001's evidence is a name-drop.** "Cash App and Netflix use KMP" is not evidence for *this* application, whose hardest problem is an encrypted FTS5 database with a transactional outbox â€” precisely where KMP is least mature. DEC-001 concedes this ("not turnkey," "2-week spike is mandatory") while still marking itself âœ… Decided.
3. **No cost model exists.** Not for Supabase, Sentry, RevenueCat, or speech-to-text. Given that pricing trust is a top-10 validated pain and TR-01/TR-02 promise no retroactive paywalls, committing to a stack without unit economics is a direct risk to the product's central trust promise.

**Mismatches between stack and requirements:**

| # | Mismatch |
|---|---|
| S-A | **Proxies removed from MVP** (ARCH-11 Â§9.1 "No proxy generation") while RP-02, MP-20, MP-22, MP-80 and OFF-11 are `Must` and depend on them. Without proxies, clip marking and offline preview do not work for cloud-only or disconnected-drive assets â€” which is the exact scenario pains #25, #29 and #35 describe. **This breaks the core repurposing loop.** |
| S-B | **No speech-to-text component.** CAP-21/22/23 are `Must`; NFR-03 governs its bandwidth; FRS-14 meters and monetises it. The stack names no Apple Speech / `SFSpeechRecognizer`, no Android `SpeechRecognizer`, no on-device model, no cloud vendor, no cost, no language list. **This is the largest single stack gap.** |
| S-C | **No rich-text editor.** FRS-10 SE-02 (`Must`) requires bold/italic/headings/lists/blockquote with Markdown shortcuts. Neither SwiftUI nor Compose ships a production rich-text editor; this is a build-or-buy decision with real cost. |
| S-D | **No text-diff / three-way-merge library** despite NFR-02 and NFR-09 requiring three-way merge. |
| S-E | **No push notification infrastructure.** FRS-12 NOT-01 includes sync alerts; COL-40 requires push. Supabase alone does not provide APNs/FCM orchestration. |
| S-F | **No iOS image-loading library.** Coil is listed for Android; ARCH-01 mentions Kingfisher; ARCH-11 Â§13's iOS list has none. Relevant because encrypted thumbnails (NFR-05) require a custom decoder hook in whichever library is chosen. |
| S-G | **No waveform (MP-32), PDF render (MP-40/41) or PDF export (SE-33) components.** Native APIs exist for all three but none is named or budgeted. |
| S-H | **NFR-07 size budgets predate the stack.** No line item for the KMP framework, Ktor, SQLDelight, RevenueCat or Sentry against a 30â€“55 MB iOS thinned target. |
| S-I | **Stale version pins** in a document dated 2026-08-22: Swift 5.9, Kotlin 1.9, Compose BOM 2024, GRDB 6.x. |
| S-J | **DEC-010 says "never store tokens in SQLCipher"** while ARCH-03 Â§4.7 lists `storage_connection` among the database tables â€” needs an explicit statement that only token *metadata* (expiry, scopes, account ID) lives there. |

### 5.6 Risks with the KMP + SQLCipher + FTS5 approach

This was asked explicitly. There are eight, ordered by severity.

| # | Risk | Impact | Mitigation |
|---|---|---|---|
| R1 | **The KMP boundary sits exactly across the transactional outbox** (B2). A shared Kotlin sync engine cannot join a GRDB transaction on iOS. | Breaks every no-data-loss guarantee in NFR-02 and NFR-09 | Decide (a) SQLDelight both platforms, or (b) native outbox writes with KMP reduced to policy/serialisation. Write it down before the spike. |
| R2 | **No first-class SQLCipher driver for SQLDelight.** On iOS you need a `NativeSqliteDriver` built against a SQLCipher-enabled SQLite; on Android you wire `SupportOpenHelperFactory`. Both are achievable; neither is documented here. | Spike may consume more than 2 weeks | Time-box each platform separately; define "spike success" as a measured benchmark, not "it compiles." |
| R3 | **FTS5 must be compiled into the SQLCipher build on both platforms.** SQLCipher amalgamations do not enable FTS5 by default. ARCH-11 flags "must verify" for iOS only. | If unavailable on Android, the entire search architecture needs rework | Verify on day 1 of the spike, on a real API 28 device, not an emulator. Document the fallback (bundled SQLite via Requery, or FTS4). |
| R4 | **SQLDelight cannot model FTS5 external-content tables or their triggers.** They will be raw SQL migrations outside the type-safe layer â€” negating a large part of SQLDelight's value proposition and reintroducing the class of bug E2 describes. | Reduces the benefit of choosing SQLDelight at all | Accept and plan for hand-written, individually-tested trigger migrations with a consistency-check test in CI. |
| R5 | **Two divergent persistence stacks** (GRDB vs Room) means two migration engines, two trigger implementations, two encryption configurations. Every guarantee â€” atomic outbox, FTS consistency, `synchronous=FULL` durability â€” must be proven **twice**. | Doubles the highest-risk surface area for a small team | This is the strongest argument for resolving R1 toward SQLDelight-for-both. |
| R6 | **The performance combination is untested.** SQLCipher page-level decryption + `synchronous=FULL` + â‰¤1 s autosave debounce + a 0.5â€“2.5 GB database + filtered `bm25()`-ranked FTS5 queries, on API-28-era hardware, against a â‰¤100 ms p50 target and a â‰¤1%/30 min battery budget. | The most likely place the NFRs fail in production | **The spike must produce measurements against a 100k synthetic corpus, not a proof of compilation.** Measure: cold start, p50/p95 search, save latency, battery over a 30-minute session. |
| R7 | **The fallback is more expensive than the primary path.** DEC-001's fallback is "fully native with mirrored domain logic" â€” which duplicates the sync and conflict engine, the highest-risk code in the product, across two languages. The fallback is stated but not costed. | A failed spike leaves the team worse off than if they had started native-with-duplication deliberately | Cost the fallback now. If it is unacceptable, the spike is not optional-with-fallback; it is a gate. |
| R8 | **iOS binary size.** KMP framework + Ktor + SQLCipher + Sentry + RevenueCat against a 30â€“55 MB thinned target that was budgeted for a plain native app. | Possible CI gate failure at NFR-07 thresholds | Add a size measurement to the spike deliverable. |

### 5.7 Are open decisions resolved appropriately?

**Format: yes, and this is a genuine strength.** ID, statement, rationale, dependencies, owner, date â€” all present for all 19. Most teams do not have this.

**Substance: four problems.**

1. **DEC-001 is marked âœ… Decided while carrying a mandatory spike and a fallback.** It is not decided; it is a decision gated on evidence that does not yet exist. Status should be **Provisional â€” gated on spike**, and every downstream document that depends on it (ARCH-02, ARCH-03, ARCH-11) should say so.
2. **There is no decision for Android persistence.** DEC-004 decides iOS (GRDB + SQLCipher). Room appears for the first time in ARCH-11 Â§5.2 with no corresponding DEC entry, no rationale, and no consideration of the Room-vs-FTS5-external-content problem.
3. **DEC-006 defers the problem that DEC-007 and DEC-008 depend on.** "Cross-device restore key management deferred until cloud backup is required" â€” but cloud backup *is* required by FRS-09 SET-34 (`Must`), ACC-03 (`Must`), FRS-13 REST-01 (`Must`) and BACK-11. With a random per-install key and client-side encryption, **restore on a new device is cryptographically impossible**. There is also no key-loss recovery story anywhere in the set. This is B4.
4. **Four `Must`-level features have no decision at all**: speech-to-text, rich-text editing, push notification delivery, and (post-ARCH-11) the media proxy strategy. Decisions are also not linked back to the requirements they satisfy, so nothing catches a `Must` with no supporting decision.

**Evidence quality across decisions is uneven.** DEC-004, DEC-009, DEC-012 and DEC-016 have real reasoning. DEC-001's evidence is a case-study name-drop. DEC-003's "covers majority of active devices" is uncited. DEC-010's link list cites "Room FTS5," which does not support the external-content-plus-triggers pattern the design actually needs.

---

## 6. Documentation Quality Check

### 6.1 Structure and clarity

The template is consistent and good: Purpose â†’ Scope â†’ User Stories â†’ Requirements (ID / requirement / priority / description) â†’ Data Model â†’ Acceptance Criteria â†’ Dependencies â†’ Open Questions â†’ Change Log. Requirements are individually addressable and prioritised. Acceptance criteria are concrete. Source references are real URLs to primary documentation, and the ones I spot-checked (SQLite FTS5, SQLCipher design, and the March 2026 SQLite tags benchmark) all resolve and say what the documents claim they say â€” with the exception of E1 and E2, where the document contradicts its own cited source.

### 6.2 Files that do not exist, are empty, or are misnamed

| Issue | Detail |
|---|---|
| **Empty stubs** | `ARCHITECTURE-08-observability.md` (33 bytes â€” title line only); `FRS-09-analytics-phase2.md` (28 bytes); `FRS-10-collaboration-phase2.md` (32 bytes) |
| **Orphaned duplicates** | The two FRS stubs above are superseded by `FRS-15-analytics-phase2.md` and `FRS-16-collaboration-phase2.md`. They must be deleted â€” they currently make FRS-09 and FRS-10 ambiguous. |
| **Filename â‰  content** | NFR-01 lives in `NFR.md`. There is no `NFR-01-performance.md`, yet FRS-11, FRS-12, FRS-13, FRS-14 and ARCH-00 all reference "NFR-01". |
| **Filename â‰  review brief** | The structure supplied for this review lists `TECH-STACK.md`, `FRS-09-onboarding-settings-account.md`, `FRS-10-script-text-editor.md`, `FRS-11-media-preview-playback.md`, `FRS-12-notifications-reminders-trash.md`, `FRS-13-import-export-backup-restore.md`, and `NFR-01-performance.md`. On disk these are `ARCHITECTURE-11-technology-stack.md`, `FRS-09-onboarding-settings-account.md`, `FRS-10-script-text-editor.md`, `FRS-12-notifications-reminders-trash.md`, `FRS-13-import-export-backup-restore.md`, and `NFR.md`. Someone is working from a stale map. |
| **Header â‰  filename** | `FRS-15-analytics-phase2.md` is headed "Module 09"; `FRS-16-collaboration-phase2.md` is headed "Module 10". |
| **Skipped ID** | FRS-03 jumps AS-M6 â†’ AS-M8; the change log acknowledges the gap but leaves it. |
| **Duplicate section numbers** | FRS-08 has two sections numbered Â§4.9. |

### 6.3 Requirement-ID collisions (B8)

There is no global ID registry, and prefixes are reused with different meanings:

| Prefix | Meaning A | Meaning B |
|---|---|---|
| `ACC-*` | Account Management (FRS-09, ACC-01â€¦ACC-10) | Accessibility (FRS-12 ACC-01â€¦05, FRS-13 ACC-01â€¦04) |
| `INT-*` | Integrations (FRS-07, INT-01â€¦INT-64) | Integrity & Verification (FRS-13, INT-01â€¦INT-05) |
| `OFF-*` | Offline & Sync (FRS-08, OFF-01â€¦OFF-63) | Offline & Performance (FRS-13, OFF-01â€¦OFF-05) |
| `CR-*`, `CAP-*`, `AS-*`, `RP-*`, `CAL-*`, `PUB-*`, `INT-*`, `OFF-*`, `TR-*`, `AN-*`, `COL-*` | PRD Â§7 numbering | Completely different FRS numbering with the same prefixes |

The PRD's Â§13 traceability matrix maps pain IDs to PRD requirement IDs â€” which then do not correspond to the FRS requirements that implement them. **Traceability terminates at the PRD boundary.** There is no FRS-level traceability matrix anywhere, and no requirementâ†’test mapping.

### 6.4 Duplicate content

Substantial verbatim or near-verbatim duplication, with **no document declaring which copy is normative**:

| Content | Appears in |
|---|---|
| Cache quotas + low-storage behaviour tables | NFR-03 Â§5.1â€“5.2, NFR-07 Â§6.2â€“6.3, ARCH-05 Â§8.1â€“8.2 |
| Startup targets | NFR-01 Â§3.1, NFR-07 Â§4.2 |
| Memory budgets by device class | NFR-04 Â§5.1, NFR-07 Â§5.2 |
| Export format table | NFR-03 Â§7.1, NFR-05 Â§8.1 |
| Conflict-strategy-by-data-type table | NFR-02 Â§7.1, NFR-09 Â§6.3, ARCH-04 Â§7.2 |
| Proxy specifications | NFR-03 Â§4.2, ARCH-05 Â§7.2 |
| Version history requirements | FRS-01 CR-M1, FRS-10 SE-17â€¦SE-23, FRS-12 HIST-01â€¦HIST-08 |
| Undo/trash | FRS-12 Â§4.4â€“4.5, partially FRS-04 RP-M5 |
| Full-screen media preview | FRS-03 AS-M3, all of FRS-11 |
| Sync status states | FRS-07 INT-M3, FRS-08 OFF-50, NFR-02 Â§9.2 |

When these drift â€” and NFR-03 Â§3.3 vs Â§8 has already drifted within a single document â€” there is no rule for which wins.

### 6.5 Version and maturity drift

- FRS-01 through FRS-08 are **v1.1** with change logs recording a "missing MVP requirements" sweep that added the `-M` requirement blocks.
- FRS-09 through FRS-16 are **v1.0**, have **no change log**, and have **no `-M` block** â€” meaning that completeness sweep was never applied to eight of the sixteen modules.
- The **PRD is v0.1 "Draft for Discussion"** while ARCH-11 is "Final for MVP Planning." The foundation document is less mature than everything built on it, and its NFR section (Â§8) is now demonstrably superseded.
- ARCH-00 through ARCH-09 are v1.0 and were not revised after ARCH-10 v1.1 changed the platform decision.

### 6.6 Sourcing and evidence quality

**Strong:** Apple and Android developer documentation, SQLite FTS5, RFC 8252/9700, OWASP MASVS, WCAG 2.2, Ink & Switch, platform API rate-limit pages. These are the right sources and they are used correctly almost everywhere.

**Weak or absent:**
- The pain-point validation itself has **no citations** â€” no thread URLs, no review IDs, no dates, no verdict record (B7). This is the sourcing gap that matters most, because it is the one the entire document set claims to rest on.
- The vision's confidence percentages have no source.
- "A 2026 dataset suggests median iPhone app download around 49.7 MB" (NFR-07 Â§3.4) â€” no citation.
- "Android 9 covers over 90% of active devices" (NFR-10 Â§4.1, DEC-003) â€” no citation, and likely stale for 2026.
- "Cash App and Netflix use KMP" (DEC-001) â€” a case-study link, offered as evidence for a decision whose actual risk lies elsewhere.
- NFR-01's benchmark basis mixes primary SQLite/Android documentation with a Medium post and a personal blog. The blog post (Simon Willison's March 2026 SQLite tags benchmark) does exist and is relevant â€” but a tagging benchmark is not a benchmark of this application's query shape.
- **Two citations are contradicted by the documents that cite them:** ARCH-03 cites the FTS5 documentation while stating the opposite of what it says (E2); NFR-05/ARCH-03/ARCH-06/ARCH-11 cite SQLCipher while misstating its cipher mode (E1).

### 6.7 Missing documentation

- No glossary (readiness, lane, pillar, variant, select, proxy, availability all carry specific meanings).
- No FRS-level traceability matrix (pain â†’ FRS requirement â†’ test).
- No requirementâ†’test mapping despite NFR-11 requiring 100% critical-flow UI test coverage.
- No index or navigation document; `docs/requirements/README.md` is three lines.
- No ADR directory despite NFR-11 MA-14 requiring ADRs (ARCH-10 partially serves this).
- No data dictionary; ARCH-03 Â§4.7 lists nine tables by name with no columns.

---

## 7. Final Recommendations

### 7.1 Corrective actions required before development starts

**P0 â€” Blockers. Nothing should be coded until these are resolved.**

| # | Action | Owner | Est. |
|---|---|---|---|
| P0-1 | **Rewrite ARCH-00 Â§3.2/Â§9 and ARCH-01 Â§2/Â§4** to reflect DEC-001 (native UI + KMP shared core). Mark every architecture document with the DEC IDs it depends on. Until this is done, ARCH-00/01 actively mislead. | Mobile Architect | 2 days |
| P0-2 | **Resolve the transactional-outbox boundary (B2).** Choose SQLDelight-for-both or native-outbox-with-thin-KMP. Update ARCH-02, ARCH-03, ARCH-04 and ARCH-11 consistently. Add a DEC entry for Android persistence. | Data + Mobile Architect | 3 days |
| P0-3 | **Run the KMP + SQLCipher + FTS5 spike, defined as a measurement exercise.** Success criteria: FTS5 confirmed present in the SQLCipher build on a real API 28 device and on iOS 16; cold start, p50/p95 search, save latency and 30-minute battery measured against a 100,000-record synthetic corpus; iOS thinned binary size measured. Compilation alone is not success. Cost the native fallback before starting. | Mobile Architect | 2 weeks |
| P0-4 | **Decide the MVP proxy strategy (B3).** Either restore low-res proxy generation to MVP (and accept the app-size, battery and encryption consequences) or downgrade RP-02, MP-20, MP-22, MP-80, OFF-11 and restrict clip marking to locally-available assets â€” and say so explicitly in FRS-04 and FRS-11. | Product + Mobile Architect | 2 days |
| P0-5 | **Design key management for cross-device restore (B4)**, or remove cross-device backup/restore from MVP. If kept: specify the recovery-key model, the key-loss UX, and whether the E2EE claim survives. Update DEC-006, ARCH-07 Â§6.5, FRS-09 ACC-03/SET-34, FRS-13 Â§4.4â€“4.5. | Security Architect | 3 days |
| P0-6 | **Decide MVP backend scope (B5)** â€” local-only, or remote-config-only, or remote-config + optional encrypted backup. Then reconcile ARCH-00 Â§4.2, ARCH-07 Â§3, FRS-08 Q1, FRS-09 Q5, FRS-13 Q1, FRS-06 PUB-10/PUB-23 and all of NFR-02's server-dependent SLOs. | Product + Backend Architect | 2 days |
| P0-7 | **Write ARCHITECTURE-08 Observability (B6).** | Observability Lead | 2 days |
| P0-8 | **Fix ARCH-03**: correct E1 (CBC + HMAC-SHA512, not GCM) everywhere; correct E2 and specify the FTS5 triggers explicitly; resolve E3 (drop `search_content` or re-baseline storage); fix E4 (composite PK); fill the E5 schema gaps including an ancestor snapshot for three-way merge. | Data Architect | 4 days |

**P1 â€” High. Required before sprint planning.**

| # | Action |
|---|---|
| P1-1 | **Publish the pain-point validation record (B7).** One row per pain point: verdict, confidence, evidence source, date. Reconcile the count to 80. Attach the vision's confidence percentages to their sources or delete them. |
| P1-2 | **Resolve pain #59.** Either correct the "unconfirmed" verdict with evidence, or acknowledge in the PRD that the primary technical investment rests on a partially-validated premise. |
| P1-3 | **Reconcile the three Top-10 lists to one canonical list**, and explain the substitution of "storage/search limits" for "platform constraints." |
| P1-4 | **Establish a global requirement-ID registry (B8).** Namespace every ID by module (`FRS02-CAP-01`, `FRS12-ACC-01`). Delete the PRD's Â§7 requirement IDs or explicitly mark them as superseded by the FRS. |
| P1-5 | **Fold every Open Question recommendation back into requirement priorities**, or delete the recommendation. All nine Class-A conflicts in Â§3.4. |
| P1-6 | **Resolve the 15 Class-B cross-document conflicts** in Â§3.4, especially C1 (storage providers), C3 (publishing state machine â€” pick NFR-08's), C4 (encryption), C5/C6 (transcription), C9 (proxies) and C10 (performance targets). |
| P1-7 | **Delete the PRD's Â§8 NFR section** and replace it with a pointer to NFR-01â€¦NFR-11. Promote the PRD from v0.1 or mark it explicitly superseded on NFRs. |
| P1-8 | **Decide the four missing stack items (B10):** speech-to-text (with cost model and language list), rich-text editor, push notification delivery, text three-way merge. Add DEC entries. |
| P1-9 | **Cut or justify FRS-10's teleprompter.** If it stays as `Must`, produce the validation evidence; the document set's own standard demands it. |
| P1-10 | **Delete the three empty stub files** and fix the NFR-01 filename. |
| P1-11 | **Add the ten missing functional requirements** in Â§3.2, prioritising M3 (tag management), M4 (pillar management), M5 (free-limit-during-index), M8 (first-run indexing) and M10 (deep-link registry). |
| P1-12 | **Fix the ARCH-02 circular dependency** (Clip â†” MediaPreview) and the FTS ownership contradiction. Update its FRS-09/FRS-10 references to FRS-15/FRS-16. |

**P2 â€” Medium. Address during the first sprints.**

| # | Action |
|---|---|
| P2-1 | Fix the NFR-01 Â§3.4 internal contradiction: separate *targets* (60 fps, 16 ms) from *failure thresholds* (700 ms frozen frame, 5 s ANR). |
| P2-2 | Fix the NFR-03 storage arithmetic and re-baseline against the E3 resolution. |
| P2-3 | Add the six missing NFR areas in Â§4.2 â€” search quality, transcription quality/cost, indexing correctness, capacity beyond assets, unit economics, data residency. |
| P2-4 | De-duplicate the NFR/architecture overlap in Â§6.4; declare one normative source per topic and cross-reference the rest. |
| P2-5 | Apply the `-M` completeness sweep to FRS-09 through FRS-16; bring them to v1.1 with change logs. |
| P2-6 | Rebaseline NFR-07 app-size budgets against the actual dependency list. |
| P2-7 | Add a glossary, an FRS-level traceability matrix, a requirementâ†’test map, and a data dictionary. |
| P2-8 | Reconcile navigation IA to one destination list across NFR-06, ARCH-01 and FRS-12. |
| P2-9 | Refresh stale version pins and uncited market claims (Android 9 coverage, median app size). |
| P2-10 | Add M1 (footage culling), M2 (app lock), M6 (transcription semantics), M9 (search relevance) as requirements. |

### 7.2 Prioritised issue list

| Rank | Issue | Class | Section |
|---:|---|---|---|
| 1 | Transactional outbox unimplementable with chosen stack | Blocker | 5.2 |
| 2 | Native-vs-KMP contradiction across architecture documents | Blocker | 5.1 |
| 3 | Proxies removed from MVP while five `Must` requirements depend on them | Blocker | 5.5 S-A |
| 4 | Cross-device restore cryptographically impossible as specified | Blocker | 5.7 |
| 5 | MVP backend scope undecided across six documents | Blocker | 3.4 Class A, 5.4 |
| 6 | ARCHITECTURE-08 Observability empty | Blocker | 5.1 |
| 7 | FTS5 external-content "updates automatically" is false | Technical error | 5.3 E2 |
| 8 | Pain-point verdicts unrecorded; counts don't sum to 80 | Validation | 2.1 |
| 9 | Requirement-ID collisions destroy traceability | Structural | 6.3 |
| 10 | Nine requirements contradicted by their own Open Questions | Consistency | 3.4 A |
| 11 | Missing stack decisions for four `Must` features | Gap | 5.5 |
| 12 | Pain #59 unconfirmed but load-bearing | Validation | 2.3 |
| 13 | SQLCipher cipher mode misstated in four documents | Technical error | 5.3 E1 |
| 14 | External-content FTS5 rationale defeated by actual schema | Technical error | 5.3 E3 |
| 15 | Fifteen cross-document requirement conflicts | Consistency | 3.4 B |
| 16 | Encrypted previews vs plain-file storage vs 60 fps thumbnails | Conflict | 3.4 C13 |
| 17 | Schema gaps against `Must` requirements | Gap | 5.3 E5 |
| 18 | Performance targets differ 10â€“20Ã— between PRD and NFR-01 | Conflict | 3.4 C10 |
| 19 | Teleprompter `Must` with no validation basis | Scope | 3.3 O1 |
| 20 | Pain #42 (culling) and #11 (capture overload) unaddressed | Coverage | 2.3 |
| 21 | Ten missing MVP functional requirements | Gap | 3.2 |
| 22 | Six missing NFR areas | Gap | 4.2 |
| 23 | Duplicate content with no normative source | Quality | 6.4 |
| 24 | Three empty stub files; NFR-01 filename mismatch | Quality | 6.2 |
| 25 | FRS-09â€¦16 never received the completeness sweep | Quality | 6.5 |

### 7.3 Readiness verdict

**Not ready for implementation planning.**

Specifically:

- **Ready to plan now:** FRS-01 (Core Content Record), FRS-02 (Idea Capture), FRS-05 (Calendar & Readiness), FRS-09 (Onboarding & Settings), FRS-12 (Notifications & Trash) â€” subject to the ID-registry fix and the Class-A open-question reconciliation. These are internally coherent and their architectural dependencies are settled.
- **Blocked on the spike (P0-3):** everything touching the data layer, search, sync and offline behaviour â€” which is FRS-03, FRS-04, FRS-08, FRS-11 and the NFR-01/NFR-02 targets. This is the majority of the product's differentiated value.
- **Blocked on decisions, not the spike:** FRS-06 (backend scope, capability-matrix source, state machine), FRS-07 (provider scope), FRS-13 (cloud backup in or out), FRS-14 (subscription in MVP or not), FRS-10 (teleprompter and rich-text-editor build).

**Path to ready:** the P0 list is roughly 2â€“3 weeks of architecture and product work running in parallel with the 2-week spike, plus about a week of P1 documentation remediation. None of it requires new user research, and none of it invalidates the product thesis. The problem is not that the thinking is wrong â€” it is that the documents stopped agreeing with each other somewhere between ARCHITECTURE-03 and ARCHITECTURE-10, and nobody went back to reconcile them.

Re-review the P0 items as a set once resolved; the six blockers interact (proxy strategy affects storage and battery; backend scope affects sync, key management and NFR-02's SLOs), so resolving them individually risks producing a new set of contradictions.

---

## Appendix: Verified external claims

| Claim in documents | Verification | Result |
|---|---|---|
| "SQLCipher â€¦ AES-256-GCM" (NFR-05, ARCH-03, ARCH-06, ARCH-11) | Zetetic SQLCipher design documentation | âŒ **False.** AES-256-CBC with per-page HMAC-SHA512 |
| "FTS5 external-content index updates automatically" (ARCH-03 Â§5) | SQLite FTS5 documentation, Â§4.4.3 external content tables | âŒ **False.** "It is still the responsibility of the user to ensure that the contents of an external content FTS5 table are kept up to date â€¦ One way to do this is with triggers." |
| SQLite tags benchmark, 100k rows (NFR-01 reference) | simonwillison.net, 20 March 2026 | âœ… Exists; compares 5 tagging strategies at 100k rows; FTS5 places second to a many-to-many table |
| Room supports FTS5 external-content with triggers (DEC-010 reference) | Android Room documentation | âš ï¸ Room's FTS entity annotations do not express external-content tables or their triggers; ARCH-11 Â§5.2 correctly concedes raw SQL is required, ARCH-03 does not |
| iOS ~30 s background refresh, Android ~10 min WorkManager, Android 15 media-FGS 6 h/24 h (NFR-02, NFR-04) | Apple BackgroundTasks, Android developer documentation | âœ… Consistent with platform guidance |
| RFC 8252 PKCE for native apps; RFC 9700 refresh-token rotation (NFR-05, NFR-08) | IETF | âœ… Correctly applied |

**Sources consulted for verification:**

- [SQLCipher Design](https://www.zetetic.net/sqlcipher/design/)
- [SQLite FTS5 Documentation](https://www.sqlite.org/fts5.html)
- [Room â€” Define data using entities](https://developer.android.com/training/data-storage/room/defining-data)
- [Applying FTS to Room â€” CommonsWare](https://commonsware.com/Room/pages/chap-roomfts-002.html)
- [SQLite Tags Benchmark, 100k rows](https://simonwillison.net/2026/Mar/20/sqlite-tags-benchmark/)

