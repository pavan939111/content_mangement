# CreatorOS — Full Suite Verification Report (v1 + v2)

**Reviewer:** Independent senior product & technical reviewer
**Date:** 2026-08-23
**Scope:** 87 documents — v1 root (3), v1 governance (9), v1 FRS (16), v1 NFR (12), v1 architecture (15), v2 product (2), v2 FRS (4), v2 NFR (8), v2 architecture (13), v2 validation (3)
**Method:** Full read of the v2 suite and all v1 governance/changed documents; byte-level diff of v1 against the pre-P2 snapshot; cross-document reference and ID checking; verification of external platform claims against primary sources (Google Workspace API docs, Google Cloud OAuth verification docs, SQLite, SQLCipher)

---

## 1. Executive Summary

### Overall verdict

**Not ready.** Not for MVP build, and not yet for validation without a short fix pass.

The v2 strategic thinking is the strongest work in this repository. The pivot from "local-first workspace" to "connected content record for professional UGC creators" is well-argued, the positioning statements are sharp and specific, the tool capability matrix is unusually honest about what each provider can and cannot do, and the backend connector service design (ARCH-15) is a competent, buildable piece of systems engineering. The narrowing of the target segment is exactly the kind of decision that makes a small product viable.

But three categories of problem block execution.

**First, two completion artifacts in this repository assert work that was not performed.** `docs/architecture/spike-results.md` reports five-device, 100,000-record performance measurements, 30-minute battery tests, and built app sizes — and is dated the same day as the spike plan that defines the two-week exercise. On the strength of it, DEC-001 was flipped from "Provisional — gated on spike" to "✅ Confirmed", retiring the largest technical risk in the programme. Separately, `docs/requirements/functional/P2-10-verification.md` certifies that ten previously-missing requirements are present; **five of them are not in the files it names**, and a sixth is marked "Corrected" while still sitting in the wrong table. This is more serious than any individual documentation defect, because it means the repository's own status signals cannot currently be trusted as evidence of anything.

**Second, v1 and v2 have not actually been reconciled — they have been layered.** v2 declares eight v1 FRS modules "remain valid," but those modules are built on a `content_item` core object that v2 replaces with `connected_record`, with no relationship, migration, or statement of precedence. Four further v1 modules (FRS-08, FRS-09, FRS-15, FRS-16) are mentioned nowhere in v2 at all — neither reused nor superseded. v1's readiness engine and v2's Next Action engine both exist as `Must`, computing the same thing by different rules. v1 FRS-14's pricing table and v2's pricing model contradict each other while v2 declares FRS-14 valid. And the v1 vision document has been physically overwritten by the v2 vision — the two files are byte-identical, so there is no longer a v1 vision to reference, though the v2 PRD references it.

**Third, the single largest feasibility risk in v2 appears in no document.** Cross-tool search over Google Drive — the headline capability — requires `drive.readonly` or `drive.metadata.readonly`. Both are **restricted scopes** under Google's classification, requiring OAuth app verification plus an annual third-party CASA security assessment. The non-sensitive alternative, `drive.file`, only grants access to files the user explicitly opens through the Google Picker or that the app itself created — which cannot support "search your Drive." This is verified against Google's own documentation and is not mentioned in FRS-07, ARCH-13, ARCH-14, NFR-05-v2, ARCH-10-v2, any risk table, or the validation plan.

### Top strengths

1. **ARCHITECTURE-14 (Tool Capability Matrix)** is the best document in either version. It states exactly what each provider supports, names the limitation for each, and its §6 "Deep Reasoning Notes" explicitly refuses to overpromise ("CapCut and Apple Notes are handoff-only because there is no reliable public API. This protects the product from overpromising"). This is the discipline the rest of the suite needs.
2. **ARCHITECTURE-15 (Backend Connector Service)** is genuinely buildable: provider-isolated queues, explicit job state machine, per-failure-type retry policy, idempotency keys, DLQ, token-bucket rate limiting. An engineer could start from this.
3. **The action receipt concept is a real product insight.** Separating "verified outcome" from "user-confirmed outcome" (CCR-32, HAR-13) is honest engineering that turns an unavoidable limitation — you cannot confirm what CapCut did with your file — into a trust feature.
4. **Positioning is concrete and testable.** The four head-to-head statements in vision §9 are specific enough to be falsified in an interview, which is what §7 of the interview script does.
5. **Several P2 items were genuinely well executed.** NFR-01 §3.4 now cleanly separates product targets from platform failure thresholds; NFR-03's storage arithmetic is reconciled to a single 1–5 GB figure with stated assumptions; NFR-07's dependency budget now includes KMP, Ktor, SQLCipher, RevenueCat and Sentry; navigation IA is consistent across NFR-06, ARCH-01 and FRS-12; uncited market claims were removed.

### Top risks and gaps

| # | Issue | Severity |
|---|---|---|
| B1 | `spike-results.md` presents unperformed measurements as evidence; DEC-001 marked Confirmed on that basis | **Blocker** |
| B2 | `P2-10-verification.md` certifies five requirements that do not exist in the named files | **Blocker** |
| B3 | v1 vision document destroyed — byte-identical to the v2 vision | **Blocker** |
| B4 | `content_item` vs `connected_record`: no relationship, migration, or precedence defined | **Blocker** |
| B5 | Google restricted-scope + CASA requirement absent from all documents | **Blocker** |
| B6 | FRS-08, FRS-09, FRS-15, FRS-16 orphaned — no v2 status anywhere | **Blocker** |
| B7 | Backend normalized index contradicts the v1 zero-knowledge posture that v2 NFR-05 declares still valid | **High** |
| B8 | Concierge prototype scope ≈ the MVP itself, defeating validate-before-build | **High** |
| B9 | Two competing "what's missing" engines (v1 readiness, v2 Next Action), both `Must` | **High** |
| B10 | v1 FRS-14 pricing contradicts v2 pricing while declared "remains valid" | **High** |
| B11 | 22 broken `v1/..` reference paths across the v2 suite | **High** |
| B12 | v2 requirement prefixes unregistered; `INT-*` collision reintroduced | **High** |

---

## 2. V1/V2 Coherence Assessment

### 2.1 Does v2 correctly reference v1 where stable?

**Structurally yes; mechanically no; substantively only in part.**

The pattern is right. Every v2 document opens with a "Reference to v1 Stable Requirements" section, states that it does not repeat v1, and declares that v2 supersedes where behaviour changes. That is the correct way to run a versioned suite.

The execution has three defects.

**(a) Every cross-version link is broken.** All 22 "Reference to v1" paths use the form `v1/../docs/...` — for example `v2/requirements/functional/FRS-01-connected-content-record-v2.md:6`. There is no `v1/` directory. From `v2/requirements/functional/`, the correct relative path is `../../../docs/requirements/functional/`. Every single cross-version reference in the suite fails to resolve.

**(b) Some section references point at the wrong sections.**

| v2 document | Claims | Actual v1 content |
|---|---|---|
| FRS-03-v2 §2 | "Thumbnail/proxy cache: v1 FRS-03 §4.2" | §4.2 is *Metadata Extraction & Tagging*; thumbnails are AS-04/AS-05 in §4.1 |
| NFR-12-v2 §3 | "Search latency: v1 NFR-12 §2" | v1 NFR-12 §2 is *Search Quality*; latency lives in NFR-01 §3.2 |
| NFR-05-v2 §3 | "Data deletion and export: v1 NFR-05 §7" | §7 is deletion; export is §8 |

Correctly resolved references (spot-checked): FRS-01-v2 → v1 FRS-01 §4.2/§4.4/§4.6/CR-M6 ✅; FRS-06-v2 → v1 FRS-06 §4.2/§4.3/§4.4/PUB-M3 ✅; FRS-07-v2 → v1 FRS-07 §4.2/§4.3/§4.5/§4.8 ✅; NFR-02-v2 → v1 NFR-02 §4/§7/§8 ✅.

**(c) Several "remains valid" claims are false.** These are the substantive failures and they are covered in §2.3 below.

### 2.2 Is it clear which document is authoritative for each topic?

**For NFRs, yes.** `v2/requirements/non-functional/README.md` is a genuinely good artifact: a twelve-row table stating, per NFR area, whether v2 is "Unchanged — reference v1" or "Updated — see [file]". This is the clearest authority declaration in the suite and should be the template for the rest.

**For FRS, partially.** The v2 PRD §7 lists eight v1 modules as reused and four v2 modules as superseding. But:

- **FRS-08 (Offline & Sync), FRS-09 (Onboarding/Settings/Account), FRS-15 (Analytics), FRS-16 (Collaboration) appear in no v2 document.** Verified: `grep -rn "FRS-08\|FRS-09\|FRS-15\|FRS-16" v2/` returns nothing. They are neither reused nor superseded nor deferred. FRS-09 is not a minor omission — v2 needs an account (backend auth per ARCH-07-v2 §10), a connection settings surface, OAuth consent screens, and a Connection Health Center, all of which are onboarding/settings territory.
- **No v2 counterpart or reuse statement exists for ARCH-01 (Platform & UI), ARCH-09 (Deployment), or ARCH-12 (Spike Plan).** ARCH-00-v2 §2 lists ARCH-01 and ARCH-09 as "remains valid," which covers those two, but the v2 traceability matrix §5 refers to "`ARCH-01 v2`" as though it exists. It does not.

**For architecture, mostly.** ARCH-00-v2 §2 enumerates the seven v1 architecture documents that remain valid. This is clear. The problem is that at least three of those claims are wrong (§2.3).

### 2.3 Contradictions between versions

| # | Contradiction | v1 position | v2 position |
|---|---|---|---|
| C1 | **Core object** | `content_item` is the centre; ARCH-03 §4.1, data-dictionary row 1 | `connected_record` is the centre; ARCH-03-v2 §2. No relationship, FK, migration or precedence defined |
| C2 | **"What's missing" engine** | Readiness: CR-32…CR-37, CAL-10 (`Must`), CAL-11 "Readiness shall be computed using the Content Item's stage, target platforms, and attachment roles" (`Must`) | Next Action: CCR-20…CCR-23 (`Must`), computed from "missing required link types: brief, script, footage, design, edit handoff, delivery link". Both live; neither references the other |
| C3 | **Pricing** | FRS-14 §4.3: Free = 500 indexed assets / 100 Content Items / 50 clips / 5 transcriptions | PRD-v2 §8: Free = 1 workspace / 2 connected sources / 10 active records. Solo $12–15, Pro $20–24. v2 PRD §7 declares FRS-14 "remains valid" |
| C4 | **MVP network model** | FRS-08 OFF-M1/OFF-M2: "MVP is local-only (Remote Config only)"; OFF-05 "shall not require an account or internet connection" (`Must`) | ARCH-00-v2: mandatory cloud integration plane; ARCH-07-v2 §10 "All backend endpoints require CreatorOS account auth" |
| C5 | **Backend knowledge of user content** | NFR-05 §4.1 + ARCH-07 §6.5: client-side envelope encryption, "server never has plaintext"; NFR-05-v2 §1 declares v1 encryption "remains valid" | ARCH-15 §4.8 Normalized Index stores `title`, `url`, `type`, `content_hash` per external object, server-readable, to serve search |
| C6 | **Receipt mutability** | — | ARCH-03-v2 §4: "Receipts are append-only; no update/delete after creation except archiving"; RIN-01 same. But HAR-14: "allow the user to edit or annotate a receipt after creation" (`Should`) |
| C7 | **Backend content policy** | — | ARCH-06-v2 §4 and ARCH-07-v2 §10: "Backend operation log stores no user content." But HAR-41 syncs receipts to the backend, and receipts carry `evidence` (copied text, URLs) and `target_object` per HAR-11 |
| C8 | **Webhooks in MVP** | — | ARCH-14 §6: "the MVP does not depend on [webhooks]… webhooks are a later optimization". ARCH-07-v2 §12 and ARCH-15 §11 both list webhook ingestion as MVP-included; ARCH-04-v2 §3 makes a webhook step 1 of the sync flow |
| C9 | **Canva webhooks** | — | ARCH-07-v2 §8: "Providers that support webhooks: Google Drive, Google Calendar, Notion, **Canva**". ARCH-14 §3 capability matrix: Canva Webhooks = **No** |
| C10 | **Connected search latency** | — | ARCH-00-v2 §7: "connected search ≤1.5 s". ARCH-15 §9: alert at "Search latency p95 >2s". NFR README: NFR-01 "Unchanged — reference v1", and v1 NFR-01 has no external-search target. Three positions, no normative home |

### 2.4 Duplicated content between versions

Duplication is well controlled — this is a real strength of the v2 authoring approach. The v2 documents are deliberately thin and delta-only. The one instance of genuine duplication is severe:

**`docs/creator_os_vision.md` and `v2/creator_os_vision_v2.md` are byte-identical** (verified: `diff -q` reports no difference; both 9,104 bytes, identical mtime). The v1 vision was 11,944 bytes in the original audit. It has been overwritten by the v2 vision. Consequences:

- There is no v1 vision document in the repository.
- v2 PRD §2 lists "v1 Vision | `creator_os_vision.md`" as a reference to prior context — it now points at itself.
- The v1 record — original personas, MVP scope, non-goals, the 45/28/3 validation summary — is lost from that file, though most of it survives in `creator_pain_points.md`, `canonical-top-10-pain-points.md` and `pain-point-validation-record.md`.

Note also that the root documents moved into `docs/` (`docs/creator_os_prd.md`, `docs/creator_os_vision.md`, `docs/creator_pain_points.md`), while the review brief and the v2 PRD §2 reference table both place them at the repository root. Every path in that table is wrong.

---

## 3. Product Strategy & Pivot Assessment

### 3.1 Is the pivot well-reasoned?

**Yes, and it is the strongest strategic work in the repository.**

The reasoning holds up on four counts:

1. **It narrows rather than broadens.** v1 targeted "solo short-form creators" — a segment defined by content format, not by a budget or a pain with money attached. v2 targets professional UGC creators with 2–8 active brands and 4–20 paid deliverables per month. That segment has clients, deadlines, and a direct financial cost to disorganisation. This is the right direction for a small team.
2. **It abandons the weakest v1 premise.** v1's "offline-first everything" was built partly on pain point #59, which the v1 PRD itself classified as *unconfirmed*. v2 keeps offline capture (where the evidence is strong — pain #54–58 at 94% confidence) and drops offline-first as the organising principle.
3. **It picks a defensible competitive position.** Vision §9's four comparisons are specific and each identifies a real gap: Notion templates do not know when a Drive file changes; schedulers manage publishing, not upstream production; MCP requires configuration a phone user will not do.
4. **It refuses to compete where it would lose.** The exclusion list (social publishing APIs, analytics, in-app editing, AI generation, automation builder) removes exactly the features that would have put CreatorOS against well-funded incumbents.

### 3.2 Does the pivot align with the research?

**Partially — and the gap is not acknowledged.**

The 80 validated pain points in `creator_pain_points.md` were gathered from **general solo short-form creators**, not from professional UGC creators with brand clients. The v2 target user is a different population.

Mapping the canonical top 10 against v2:

| Canonical rank | Pain | Survives the pivot? |
|---:|---|---|
| 1 | Fragmented workflow across apps | ✅ Direct — this is the v2 thesis |
| 2 | No unified post/project record | ✅ Direct — the Connected Content Record |
| 4 | Searching old clips is manual | ✅ Reframed as cross-tool search |
| 6 | Mobile/offline weakness | ⚠️ Partially — offline capture retained, offline-first dropped |
| 10 | Pricing trust / subscription fatigue | ⚠️ v2 adds a subscription; the trust requirements are v1's, and their limits contradict v2's |
| 3 | Idea loss capture → production | ⚠️ Deferred to v1 FRS-02 with no v2 integration point |
| 5 | Manual repurposing | ⚠️ Deferred to v1 FRS-04; the clip library targets a repurposing workflow, not a client-deliverable workflow |
| 7 | Calendar readiness | ❌ Superseded in practice by Next Action, but not formally |
| 8 | Scheduler unreliability / shallow analytics | ❌ Explicitly out of v2 scope |
| 9 | Storage/search limits for large raw libraries | ⚠️ Reframed; BYO-storage retained |

**Only two of the top ten map cleanly and directly.** Four others survive in reframed form. The v2 vision §3 problem statement — briefs in Docs, footage in Drive, designs in Canva, deadlines in Calendar, delivery in email — is *plausible* and coherent, but **no document cites evidence for it from the 80-point research**. It reads as a well-reasoned hypothesis, not a validated finding. The v2 traceability matrix §2 asserts the mapping without evidence, and its first column ("Pain / Need") mixes validated pain points with new hypotheses without distinguishing them.

To be fair to the authors: they clearly know this, which is why an entire validation suite exists. The problem is that no document *says* it. There is no statement anywhere of the form "the v2 segment and problem statement are hypotheses not covered by the v1 research, and validation must establish them." Without that, a reader inherits v1's "validated, not assumptions" claim and applies it to v2, where it does not hold.

### 3.3 Segment, pricing, positioning, MVP scope

**Segment.** Well defined and screenable (interview script §1 is a usable screener). Unvalidated: no TAM estimate, no sourcing plan, and no evidence that professional UGC creators are reachable at acceptable cost. GTM (vision §11) names "UGC creator communities" without naming one.

**Pricing.** The structure is sound — priced per connected workspace and record capacity rather than per channel (vision §10), which correctly avoids the trap that makes schedulers expensive. Three problems:
- It contradicts v1 FRS-14 (C3 above) while v1 FRS-14 is declared valid.
- There is **no cost model behind it**. NFR-12-v2 QCC-02 requires provider API costs to be "modeled and monitored"; no model exists. v1 NFR-12 §6 set a ceiling of 30% of net revenue for cloud cost per Pro user. At $12/month annual, that is $3.60/user/month to cover Supabase, Redis/BullMQ, the normalized index, webhook ingestion, Sentry, RevenueCat's cut, and app store fees (15–30%). After store fees a $12 plan nets roughly $8.40–10.20. This may work, but nobody has checked, and pricing trust is a top-10 validated pain.
- The Free tier (2 connected sources, 10 active records) is generous enough that a creator with a handful of brands may never need to pay.

**Positioning.** Strong. The interview script §7 A/B test is the right way to validate it.

**MVP scope.** Appropriately narrow and consistent across PRD §6, vision §7, and the FRS/architecture MVP-boundary sections. One inconsistency: vision §7 includes "Basic delivery review state with shareable record link" and HAR-22 makes the client acknowledgment link a `Should`, but a shared web view is a distinct surface (hosting, auth, privacy per HAR-23/SPC-06) with no architecture behind it — it appears in no v2 architecture document.

### 3.4 Unresolved strategic risks

| # | Risk | Status in documents |
|---|---|---|
| S1 | **Google restricted-scope verification + annual CASA assessment** gates the core feature | **Absent everywhere.** See §6.3 |
| S2 | The v2 segment and problem statement are not covered by the v1 research | Implicit in the existence of the validation suite; stated nowhere |
| S3 | No unit-economics model behind the announced prices | QCC-02 requires one; none exists |
| S4 | Dependence on four third-party APIs whose terms, quotas and availability the product does not control | ARCH-00-v2 §8 lists "Provider APIs change or break" with mitigations, but no ToS review, no per-provider commercial risk assessment |
| S5 | Notion API terms for a commercial integration; Google Workspace ToS | MOC-04 requires compliance generically; no review recorded |
| S6 | Two-sided abandonment risk: the product is only valuable if the creator connects ≥2 tools, and OAuth to Google Drive is the highest-friction first action in the funnel | Vision §12 measures it (≥50% connect 2+ sources) but no mitigation is designed |
| S7 | Building v2 while eight v1 modules remain nominally in scope implies an MVP far larger than the v2 documents describe | Unaddressed — see §4.3 |

---

## 4. Functional Requirements Check

### 4.1 Are the v2 functional modules fully specified?

**Reasonably, at requirement level. Four modules, 87 requirements, clear priorities, MVP boundaries, and acceptance criteria in each.** The specification quality is comparable to the better v1 modules.

Assessment per module:

| Module | Requirements | Assessment |
|---|---|---|
| FRS-01-v2 Connected Content Record | CCR-01…CCR-52 | Good. The source-resolution order (CCR-12) and the verified/user-confirmed distinction (CCR-32) are strong. **Gap:** no requirement defines what happens to a record's external links when the connector is disconnected, or when the external object is deleted at source |
| FRS-03-v2 Cross-Tool Search | CTS-01…CTS-63 | Good. Local-first-then-federated (CTS-10, CTS-20) is the right pattern. **Gap:** no relevance or ranking requirement for merged local+external results — the merge order is defined ("append external after local") but not the ranking within or across |
| FRS-06-v2 Handoff & Action Receipts | HAR-01…HAR-43 | Strong. HAR-07, HAR-13 and HAR-33 are exactly the right constraints. **Conflict:** HAR-14 vs RIN-01/ARCH-03-v2 §4 on receipt mutability |
| FRS-07-v2 Connector Framework | CNF-01…CNF-53 | Strong. Capability registry, health model, error normalization all well specified. **Gap:** CNF-11 "minimum scopes required" does not name the scopes, which is where the CASA problem hides |

**Cross-cutting gaps in the v2 FRS set:**

- **No requirement for the OAuth consent/verification state.** If the app is unverified or pending CASA, users see a Google warning interstitial. No requirement covers what the app shows in that case.
- **No requirement for connector-level data deletion.** SPC-05 covers token deletion on disconnect. Nothing covers deleting the cached external metadata (titles, URLs) held in the backend normalized index — which is a GDPR erasure obligation.
- **No requirement for the shared delivery view** as a surface (HAR-22 assumes it; nothing specifies hosting, expiry, revocation, or auth).
- **No requirement covering multiple accounts of the same provider in search results** — CNF-04 allows multiple Drive accounts (`Should`), but CTS-22/CTS-23 label results only by provider, not by account.

### 4.2 Do all validated pain points map to some requirement?

**At v1 level, yes.** `docs/requirements/traceability-matrix.md` maps all ten canonical pain points to FRS/NFR/ARCH. Its quality is poor (see §7) but coverage exists.

**At v2 level, no — and two mappings are wrong.** The v2 traceability matrix §3 lists "Calendar readiness → FRS-05" and "Pricing/monetization mechanics → FRS-14" as "v1-first, implementation largely unchanged". Both are false: FRS-05's readiness engine is superseded in practice by the Next Action engine, and FRS-14's pricing is contradicted by v2's.

### 4.3 Are unchanged v1 modules properly referenced?

**No. This is blocker B6, and it is the largest functional gap in the suite.**

| v1 module | v2 status | Assessment |
|---|---|---|
| FRS-01 | Superseded by FRS-01-v2 | ✅ Declared. But FRS-01-v2 §2 preserves only §4.2, §4.4, §4.6 and CR-M6 — silently orphaning roughly 40 requirements (CR-01…CR-09 data model, §4.3 asset attachments, §4.5 readiness, §4.7 permissions, CR-M1…CR-M5, CR-M7) with no statement of whether they survive |
| FRS-02, 04, 05, 10, 11, 12, 13, 14 | "Remain valid" (PRD-v2 §7) | ⚠️ Declared, but all eight are built on `content_item`, which v2 replaces. FRS-05 and FRS-14 additionally conflict with v2 (C2, C3) |
| FRS-03, 06, 07 | Superseded by v2 counterparts | ✅ Declared |
| **FRS-08 Offline & Sync** | **No mention in v2** | ❌ Orphaned — and it contains the "MVP is local-only" statement that v2 contradicts |
| **FRS-09 Onboarding/Settings/Account** | **No mention in v2** | ❌ Orphaned — v2 needs an account, connection settings, OAuth consent UI and a Health Center, all of which belong here |
| **FRS-15 Analytics (Phase 2)** | **No mention in v2** | ❌ Orphaned |
| **FRS-16 Collaboration (Phase 2)** | **No mention in v2** | ❌ Orphaned |

The practical consequence: **the true v2 MVP scope is undefined.** If the eight "remain valid" modules are in the MVP, the build is v1 plus v2 — far larger than v2's own MVP boundary sections describe. If they are not, v2 has no idea capture, no clip library, no script editor, no media preview, no reminders, no export and no subscription, several of which v2 explicitly depends on (PRD-v2 §6 lists "Offline capture"; §8 defines pricing implemented by FRS-14).

### 4.4 Missing or over-scoped requirements

**Missing (v2):** connector data deletion; OAuth-unverified-app state; shared delivery view specification; ranking across merged results; external-object-deleted-at-source handling; per-account result labelling.

**Missing (v1, still outstanding from the previous audit):** `SET-M1` app lock, `SET-M2` content pillar management, `ON-M1` first-run indexing experience, `AS-M10` tag management, `AS-M11` search relevance — **all five certified as present by `P2-10-verification.md` and all five absent** (verified by grep against the named files). App lock in particular is still named as the primary lost-device mitigation in NFR-05 §9 and ARCH-06 §3.3 with no requirement behind it.

**Over-scoped:** the concierge prototype (§8). Also `SCR-M6` (`Must`, "read-only mode … when actively being read in the teleprompter") depends on the teleprompter, which is Phase 2 — a `Must` requirement gated on a deferred feature, introduced by the P2-5 sweep.

**Residual v1 defects not fixed:** `SE-28`…`SE-31` remain `Should` while their parent feature `SE-24`…`SE-27` is Phase 2. `CR-M7` is still inside FRS-01's Change Log table rather than §4.8. `AS-M7` is still a skipped ID.

---

## 5. Non-Functional Requirements Check

### 5.1 Do the v2 NFRs correctly extend v1?

**The structure is excellent; the content is thin in three places.**

`v2/requirements/non-functional/README.md` is the model artifact of the whole suite: one row per NFR area, explicit "Unchanged — reference v1" or "Updated — see [file]". Every other authority question in this repository should be answered this way.

The seven v2 NFR documents are delta-only and internally coherent. Coverage by area:

| Area | v2 coverage | Assessment |
|---|---|---|
| Offline & sync (OFS-01…08) | Connector-aware sync, stale detection, token refresh resilience | ✅ Adequate |
| Storage & bandwidth (SWB-01…06) | API quota, external metadata cache, no raw media | ✅ Adequate |
| Security & privacy (SPC-01…07) | Multi-connector OAuth, token vault, read-only default | ⚠️ Major gap — see §5.3 |
| Platform integration (INT-01…07) | Health SLO, reconnection UX, fallback, isolation | ✅ Good. INT-01 (99% synced within 24h or explicitly stale) is a real SLO |
| Reliability (RIN-01…07) | Receipt integrity, source uniqueness, idempotency, DLQ | ✅ Good |
| Maintainability (MOC-01…05) | Connector metrics, alerting, compliance | ⚠️ Thin — MOC-04 "comply with provider terms" with no review process |
| Quality/cost/capacity (QCC-01…05) | Search relevance, cost model, 1,000 records | ⚠️ Weak — see §5.4 |

### 5.2 Missing NFR coverage

| Gap | Detail |
|---|---|
| **No v2 performance NFR** | README says NFR-01 "Unchanged", but v2 introduces network-dependent search. ARCH-00-v2 §7 asserts "connected search ≤1.5 s"; ARCH-15 §9 alerts at "p95 >2s". Neither has a normative home, and the two numbers disagree |
| **No accessibility delta** | README says NFR-06 "Unchanged", but v2 adds OAuth flows, connection health states, receipt lists and a shared web view — all new surfaces with no accessibility requirements. NFR-06's status-pattern table (§6.2) has no rows for connector health states |
| **No app-size delta** | README says NFR-07 "Unchanged". ARCH-11-v2 §5 asserts "No heavy provider SDKs on mobile", which is plausible, but the claim is not carried into NFR-07's budget as a constraint |
| **No data residency update** | v1 NFR-12 §7 requires a region decision. v2 adds a backend holding external object titles and URLs. Residency is now materially more important and is not revisited |
| **No provider ToS/compliance process** | MOC-04 states the obligation; nothing defines who reviews, when, or what happens on a term change |

### 5.3 The security gap — backend now holds user content

This is B7 and it is the most consequential NFR problem.

v1's security posture is client-side encryption with a server that cannot read user data: NFR-05 §4.1 requires all app-owned metadata encrypted at rest; ARCH-07 §6.5 specifies envelope encryption where "the server never has plaintext"; the v1 acceptance criteria state "E2EE/zero knowledge claimed only when server cannot decrypt user payloads."

v2 NFR-05 §1 states: "The v1 local encryption, key management, and OAuth token security remain valid."

But ARCH-15 §4.8 specifies a **Normalized Index** on the backend storing, per external object: `title`, `type`, `url`, `updated_at`, `account_id`, `content_hash`. This must be server-readable to serve CTS-21 external search. Document titles and URLs from a creator's Drive and Notion are user content and are personal data. The backend now holds a searchable plaintext copy of a meaningful slice of the user's workspace.

That may be the right trade — federated search essentially requires it — but the documents do not acknowledge it. Consequently there is:

- No requirement for encryption at rest of the normalized index beyond generic infrastructure practice
- No retention policy for indexed external metadata
- No deletion requirement when a connector is disconnected or an account deleted
- No consent screen requirement disclosing that titles and URLs leave the device (SPC-03 covers OAuth permissions, not CreatorOS-side retention)
- No update to the privacy disclosure text in NFR-05 §6.1, which still says "Your content stays on this device by default"
- No residency decision for this data

There is also a direct internal contradiction (C7): ARCH-06-v2 §4 and ARCH-07-v2 §10 both state the backend operation log stores no user content, while HAR-41 requires receipts — which carry `evidence` and `target_object` per HAR-11 — to sync to the backend.

### 5.4 Contradictory or unrealistic thresholds

| # | Issue |
|---|---|
| T1 | **Connected search latency stated three ways** — ≤1.5 s (ARCH-00-v2 §7), p95 >2 s alert (ARCH-15 §9), unchanged-from-v1 (NFR README). Given four sequential provider round-trips plus normalization, ≤1.5 s p95 is optimistic; Google Drive `files.list` alone commonly takes 300–800 ms |
| T2 | **QCC-01 is unmeasurable** — "External search results shall be relevant" with no metric. v1 NFR-12 §2 defines Recall@20 ≥90–99% and Precision@10 ≥70% for local search. v2's federated search, the headline feature, has strictly weaker quality requirements than the feature it extends |
| T3 | **INT-01 vs OFS-02 unit mismatch** — INT-01 requires sync within 24h; OFS-02 defines staleness by "provider-specific threshold". Two staleness definitions, no reconciliation |
| T4 | **QCC-03 (1,000 active connected records) vs v1 NFR-12 §5 (10,000 Content Items)** — a 10× difference between two capacity statements for overlapping entities |
| T5 | **NFR-02-v2 acceptance ("sync within 2 minutes of connectivity restoration") vs v1 NFR-02 §6 ("foreground sync start within 2 s median")** — measuring different things (completion vs start) without saying so |
| T6 | **QCC-04 (10% quota headroom) is under-specified** — Google Drive quota is per-project across all users, not per account. A 10% headroom on a shared project quota behaves very differently from a per-user reserve, and the document does not distinguish them |
| T7 | **v1 residual:** NFR-03 §84 gives "1–5 GB depending on transcript volume" while the acceptance block says "100,000 records ≤5 GB **without transcripts**" — the 1–5 GB range already spans transcript variation, so the acceptance line misstates it |

---

## 6. Architecture Check

### 6.1 Is the mobile control plane + cloud integration plane design coherent?

**Yes. This is the best-reasoned architectural decision in either version.**

ARCH-00-v2 §5.1 states the case correctly: phones cannot host long-lived automation or persistent local MCP servers, so durable execution belongs on the backend while the phone stays the command surface. This resolves the v1 tension where background limits (iOS ~30 s refresh, Android ~10 min WorkManager) made reliable integration impossible.

The component split is clean: Connector Gateway, Token Vault, Provider Adapter Registry, per-provider Job Queue, Retry Worker, Rate-Limit Scheduler, Webhook Ingestion, Normalized Index, Operation Log. ARCH-15's design principles (provider isolation, idempotency first, central rate limiting, durable by default, rebuildable index) are the right ones, and the job state machine and per-failure-type retry table are directly implementable.

### 6.2 Data layer, sync, storage, security, backend, observability

| Document | Verdict | Findings |
|---|---|---|
| ARCH-03-v2 Data Layer | ⚠️ **Incomplete** | Seven new tables with sensible columns and constraints. But: **(a)** no relationship between `connected_record` and v1 `content_item` (B4); **(b)** neither new table is added to v1's FTS5 `search_content` projection, yet CTS-11 requires local search over content records — the local search half of the headline feature has no index; **(c)** no migration plan; **(d)** contradicts HAR-14 on receipt mutability |
| ARCH-04-v2 Sync | ⚠️ Thin | 1.8 KB for the sync model of a four-provider integration product. Makes webhooks step 1 of the primary flow (contradicting ARCH-14 §6). No sync-cursor recovery design, no reconciliation of the "verify affected records" pass in OFS-04 |
| ARCH-05-v2 Storage | ✅ Adequate | Correctly keeps raw media out. Clear on what lives where |
| ARCH-06-v2 Security | ⚠️ Thin, and wrong on one point | 1.5 KB. §4 "Backend operation log stores no user content" is contradicted by the receipt sync path (C7). Does not address the normalized index at all |
| ARCH-07-v2 Backend & API | ✅ Good | Ten endpoints, idempotency headers, versioned path, clear service split. §8 Canva-webhooks claim contradicts ARCH-14 (C9) |
| ARCH-08-v2 Observability | ✅ Good for its size | Seven connector metrics, health-transition alerting, privacy-safe logging. Correctly extends the v1 ARCH-08 that now exists |
| ARCH-10-v2 Decisions | ⚠️ Incomplete | Nine decisions (DEC-030…038), one provisional. Verified: v1 contains exactly DEC-001…DEC-026, so "DEC-001 through DEC-026 remain valid" is accurate. **Missing decisions:** core-object relationship, Google scope strategy, backend hosting region, whether FRS-08's local-only MVP is superseded, shared delivery view hosting, v1 module disposition |
| ARCH-11-v2 Tech Stack | ✅ Adequate | Sensible backend stack. Correctly isolates provider SDKs from the mobile binary |
| ARCH-13 Connector Architecture | ✅ Good | Clean Connector Contract, four connector types, capability model, lifecycle |
| ARCH-14 Capability Matrix | ✅ **Excellent** | The strongest document in the suite. Honest per-tool limitations; §6 explicitly protects against overpromising |
| ARCH-15 Backend Connector Service | ✅ **Strong** | Buildable. Provider-isolated queues, job states, retry policy per failure type, DLQ, token buckets |

### 6.3 Technical errors and unrealistic assumptions

**E1 — Google restricted scopes and CASA (blocker B5).** Verified against Google's documentation:

- `drive.readonly` and `drive.metadata.readonly` are classified **restricted**. `drive.file` is non-sensitive but grants access only to files "you open with an app or that the user shares with an app while using the Google Picker API or the app's file picker."
- Apps requesting restricted scopes must complete OAuth app verification **and** an annual **CASA** (Cloud App Security Assessment); "all applications must be revalidated every year."

FRS-07-v2 §4.7 requires "Search files/folders" across the connected Drive, and CTS-21 requires backend-executed provider search. That cannot be built on `drive.file`. So the MVP's headline capability requires a restricted scope, which requires verification plus a recurring third-party security assessment before production launch.

This appears in **no document**: not FRS-07-v2 (CNF-11 says "minimum scopes" without naming them), not ARCH-13 §7, not ARCH-14 §5 Limitations, not NFR-05-v2, not MOC-04, not ARCH-00-v2 §8 risks, not ARCH-10-v2, not the validation plan. It affects launch timeline, cost, and whether the concierge prototype can run outside Google's 100-test-user cap.

**E2 — Webhook channel expiry and renewal.** Verified: Google Drive push notification channels expire — Files resource maximum 86,400 s (default 3,600 s), Changes resource maximum 604,800 s — and "there's no automatic way to renew a notification channel… you must replace it with a new one by calling the `watch` method." The webhook endpoint also requires a valid, non-self-signed SSL certificate.

ARCH-15's job list contains no channel-renewal job, and no document mentions expiry. With a one-hour default on Files watches, an un-renewed channel silently stops delivering — producing exactly the stale-data failure that connection health is meant to prevent.

**E3 — Local search has no index for the new core object.** ARCH-03-v2 adds `connected_record` and `external_source_link` but does not extend v1's external-content FTS5 `search_content` projection or its triggers (v1 ARCH-03 §5). CTS-10/CTS-11 require instant local results across "content records". As specified, they cannot be served.

**E4 — `search_result_cache` has no eviction mechanism in the schema.** SWB-05 requires age/usage eviction (`Should`); the table has `cached_at` but no TTL, size cap, or eviction job.

**E5 — ARCH-14's "Google Docs: search via Drive search" is correct but under-specified.** Drive search returns file metadata; matching *inside* document text requires either Drive's `fullText` search (restricted scope, and indexing lag) or per-document reads. The matrix says "exact document ID required for full content read" but CTS-20 implies content-level search across Docs. The capability and the requirement do not quite line up.

**E6 — Rate-limit model conflates two quota types.** ARCH-15 §6 uses "token buckets per provider and account". Google Workspace APIs enforce both per-project and per-user quotas; Notion enforces roughly three requests/second per integration. A per-account bucket does not protect a shared per-project quota, which is the one that will actually be exhausted as users scale.

### 6.4 Is the backend connector service complete and buildable?

**Close to buildable, with four gaps.**

Present and adequate: gateway, token vault, adapter registry, per-provider queues, job states, retry policy, DLQ, rate limiting, webhook validation and dedup, normalized index with cursors and content hashing, operation log, observability, security.

Missing:

1. **Webhook channel lifecycle** — registration, renewal before expiry, re-registration after reauthorization, cleanup on disconnect (E2).
2. **Normalized index privacy lifecycle** — retention, deletion on disconnect/account deletion, encryption, residency (§5.3).
3. **Initial backfill design** — the index is "rebuilt incrementally from sync cursors", but the first sync of a large Drive has no described strategy (scope, pagination budget, quota consumption, user-visible progress, partial-availability behaviour).
4. **Multi-device coordination** — ARCH-07-v2 §9 says the scheduler "prevents concurrent mobile devices from exceeding quota", but nothing defines how two devices reconcile record state, or what happens to receipts created offline on two devices.

---

## 7. Traceability Check

### 7.1 Does `traceability-matrix-v2.md` map correctly?

**Partially. It maps at module granularity, which is too coarse to be verifiable.**

Strengths: three-way mapping (FRS/NFR/ARCH) per row; separate sections for carried-over v1 pain points and new v2 needs; an explicit acceptance statement.

Problems:

1. **No requirement-level IDs.** Rows name modules ("FRS-01 Connected Content Record"), never requirements (CCR-12, CTS-40). This directly violates `requirement-id-registry.md` §5.3: "Traceability matrices must use the fully-qualified IDs to avoid ambiguity."
2. **§6 claims "No orphan requirements without traceability" — unverifiable and false.** At module granularity nothing can be checked, and four v1 modules (FRS-08, 09, 15, 16) are genuinely orphaned.
3. **Two rows are wrong.** §3 lists Calendar readiness (FRS-05) and Pricing (FRS-14) as "implementation largely unchanged"; both conflict with v2 (C2, C3).
4. **Validated pain points and new hypotheses are mixed** in §2's first column with no marking of which is which.
5. **§5 references documents that do not exist** — "`ARCH-01 v2`" and "`NFR-02..NFR-12-v2.md`" as a range where only seven of eleven exist.
6. **No test mapping**, though BACKLOG-P2 P2-7's acceptance criteria required "pain points → FRS → NFR → ARCH → tests".

### 7.2 Does the v1 traceability matrix remain valid?

**It is thin and contains errors.** At 1,018 bytes it is a ten-row pain-point table with no requirement IDs — the same violation of the registry. Two mappings are substantively wrong:

- Pain 5 (Manual repurposing) → **ARCH-04** (Sync Architecture). Should be ARCH-02/ARCH-03.
- Pain 10 (Pricing trust) → **ARCH-06** (Security Architecture). Should be ARCH-10 (pricing decisions) or none.

Pain 3 (Idea loss) maps to NFR-02 only, omitting the reminder/resurfacing requirements. Pain 6 (Mobile/offline) maps to FRS-08 only, omitting FRS-02 offline capture.

### 7.3 Orphan requirements and broken links

| Category | Count | Detail |
|---|---|---|
| Broken cross-version paths | **22** | All `v1/..` references across v2 |
| Orphaned v1 modules | **4** | FRS-08, FRS-09, FRS-15, FRS-16 |
| Silently orphaned v1 requirements | **~40** | FRS-01 requirements outside the four groups FRS-01-v2 §2 preserves |
| Requirements certified present but absent | **5** | SET-M1, SET-M2, ON-M1, AS-M10, AS-M11 |
| Unregistered ID prefixes | **17** | v2: CCR, CTS, HAR, CNF, OFS, SWB, SPC, INT, RIN, MOC, QCC. v1 P2-5 sweep: SCR, PRV, ANA, NOT-M, IMP-M, COL-P |
| Reintroduced ID collisions | **1** | `INT-*` now means Integrations (v1 FRS-07), Integrity (v1 FRS-13), **and** Platform Integration (v2 NFR-08) |
| Skipped IDs | **1** | AS-M7 |
| Misplaced requirement | **1** | CR-M7 inside FRS-01's Change Log table |

The requirement-ID registry — created specifically to end collisions — was not updated for v2 and was not applied by the P2-5 sweep. The problem it solved has returned.

---

## 8. Validation Plan Check

### 8.1 Is the plan executable?

**Not as written.** The interview script is good. The prototype plan is not executable in its stated form, and the scorecard has a structural weakness.

**`user-interview-script.md` — strong.** Screener is specific and disqualifying. Q4–Q6 ask for *recent specific incidents* rather than opinions, which is correct technique. Q6 in particular ("How do you currently know if a Google Drive token is expired?") tests whether the connection-health pain is felt or invented. Withholding the product name and the A/B positioning test in §7 are both right.

*Weaknesses:* Q13 ("If this saved you 30–60 minutes per week… would you pay?") and Q14 (anchoring on "$12–15/month" before asking what feels fair) are leading; ask for current spend and an unprompted number first. No question probes switching cost from an existing Notion template — the most likely reason a creator says yes and then does nothing.

**`concierge-prototype-test-plan.md` — this is B8, and it is a category error.** §1 scopes the prototype as "Google OAuth for Drive, Docs, Calendar, and Notion… manual and API-based search… basic receipt log… simple connection health indicator."

That is not a concierge prototype. A concierge prototype fakes the backend with human effort so you can test demand before building. This scope requires four OAuth integrations, a search layer, a receipt store and a health model — which is substantially the MVP's cloud integration plane, the most expensive and riskiest part of the build. **Building it to decide whether to build it defeats the purpose of the go/no-go gate.**

A genuine concierge version: the creator shares a Drive folder and a Notion page with the operator; the operator maintains the record by hand in a simple mobile web page and sends the creator search answers and receipts over the course of a real campaign. That tests the same hypotheses — is the connected record valuable, is search worth paying for, do receipts build trust — in days rather than weeks, with no OAuth.

*Additional issues:* no owner, no timeline, no budget (30 interviews × $50 = $1,500 plus prototype build). No recruitment channel. Sessions 1 and 2 are 5–7 days apart, but "returned unprompted for next production cycle" (a scorecard critical metric) needs a longer window than one week.

**Unaddressed: the unverified-app warning.** With a Google OAuth client in testing mode, users see an "unverified app" interstitial and the project is capped at 100 test users. Since the plan requires participants to connect Drive and the interview explicitly measures trust ("What would make you trust it enough to connect Google Drive and Notion?"), this warning will confound the primary trust measurement. Not mentioned.

### 8.2 Is the scorecard sufficient to de-risk the pivot?

**Partially.**

Good: eight metrics, four flagged critical, explicit GO and NO-GO rules, evidence source per metric.

Problems:

1. **Willingness to pay accepts "verbal."** The evidence column reads "Verbal or actual pilot commitment." Stated willingness to pay is the least reliable signal in product validation. The vision §13 sets a stronger bar ("At least 5 pay or commit to a pilot"); the scorecard weakens it. Require an actual charge or a signed pilot with a card on file.
2. **A dead zone in the decision rules.** GO requires no critical metric at 0. NO-GO requires *more than one* critical metric at 0. Exactly one critical zero, with a total ≥14, satisfies neither rule — it lands in "Pivot or iterate" only by implication. State it.
3. **No hypothesis register.** Nothing enumerates the falsifiable claims (segment exists and is reachable; connection breakage is a felt pain; receipts are valued, not noise; $12–15 clears the bar; mobile is the primary surface) and maps each to the metric that tests it.
4. **The 20–30 interview target has no justification** and is not tied to a saturation criterion.
5. **No negative-result plan.** "Pivot or iterate: refine positioning or connector set" is not a plan. What would be tried, and what would trigger stopping?
6. **Nothing tests the segment's reachability or acquisition cost**, which S6 identifies as a core commercial risk.

---

## 9. Documentation Quality Check

### 9.1 The completion-artifact problem

Two documents assert work that was not done. This is the most damaging quality issue in the repository because it corrupts the signal everything else relies on.

**`docs/architecture/spike-results.md`** reports a completed KMP + SQLCipher + FTS5 spike: FTS query p50/p95 across five named physical devices, filtered-query latency, autosave latency, cold-start p50/p95, a 30-minute scripted battery test, iOS thinned IPA at 38 MB, Android base AAB at 28 MB, and a kill-mid-transaction atomicity test. It concludes "GO" and "The risk of KMP/SQLCipher integration is retired."

The spike plan (`ARCHITECTURE-12-technical-spike-plan.md`) that defines this two-week exercise is dated **2026-08-22**. The results document is dated **2026-08-22**. No repository, commit, build artifact, raw dataset or test harness is referenced. A two-week, five-device, 100,000-record benchmark cannot have been planned and completed on the same day.

`ARCHITECTURE-10-open-decisions.md` line 32 now reads `DEC-001 | Native UI + KMP shared core | ✅ Confirmed`. **The largest technical risk in the programme has been marked retired on the basis of a document describing measurements that were not taken.**

**`docs/requirements/functional/P2-10-verification.md`** certifies ten requirements as "Found" or "Found / Corrected". Verified by direct grep against the named files:

| ID | Claimed location | Actual |
|---|---|---|
| CR-M7 | FRS-01 | ⚠️ Present but still in the Change Log table, not §4.8 — marked "Corrected", not corrected |
| SET-M1 | FRS-09 | ❌ **Absent** |
| SET-M2 | FRS-09 | ❌ **Absent** |
| ON-M1 | FRS-09 | ❌ **Absent** |
| AS-M10 | FRS-03 | ❌ **Absent** |
| AS-M11 | FRS-03 | ❌ **Absent** |
| SUB-M1 | FRS-14 | ✅ Present |
| CAP-M8 | FRS-02 | ✅ Present |
| OFF-M8 | FRS-08 | ✅ Present |
| PUB-M5 | FRS-06 | ✅ Present (and the prior PUB-M5 collision was correctly renumbered to PUB-M8) |

Five of ten are absent. The likely mechanism: these requirements were briefly written into stray fragment files (`FRS-03-asset-library.md`, `FRS-09-settings-onboarding.md`) that were later deleted without merging their contents. The verification document was written from intent rather than from the files.

### 9.2 P2 backlog status (verified)

| P2 | Status | Evidence |
|---|---|---|
| P2-1 Separate targets from failure thresholds | ✅ **Done, well** | NFR-01 §3.4 now has "Product Targets" and "Platform Failure Thresholds (not product targets)" as separate tables |
| P2-2 Reconcile storage arithmetic | ✅ **Done** | NFR-03 §84: single 1–5 GB figure, "supersedes any earlier conflicting figures". Minor residual: acceptance line says "≤5 GB without transcripts" |
| P2-3 Add missing NFR areas | ✅ **Done** | NFR-12 created with all six areas as §2–§7 |
| P2-4 De-duplicate | ✅ **Done** | Normative-source pointers added; `P2-4-deduplication-log.md` records ten topics and their normative homes |
| P2-5 `-M` sweep FRS-09…16 | ⚠️ **Done with defects** | Sweep applied, but introduced unregistered prefixes (SCR, PRV, ANA) and `SCR-M6` (`Must`) depends on the Phase 2 teleprompter |
| P2-6 Rebaseline app-size budgets | ✅ **Done, well** | NFR-07 §3.2 now itemises SQLCipher, GRDB, Room+KSP, KMP framework, Ktor, RevenueCat, Sentry, Coil/Kingfisher |
| P2-7 Glossary, traceability, data dictionary | ⚠️ **Created but thin** | All three exist. Glossary has no v2 terms and defines "capability matrix" only in its v1 publishing sense — now ambiguous with the connector capability matrix. Data dictionary omits `content_pillar`, `revision`, `search_content`, script tables, and all v2 tables. Traceability matrix has errors (§7.2) |
| P2-8 Reconcile navigation IA | ✅ **Done** | NFR-06 §4.2, ARCH-01 §5.1 and FRS-12 REM-11 all now state four bottom tabs with Settings and Reminder Center in the top bar |
| P2-9 Version pins and uncited claims | ✅ **Done** | Stale pins updated; the "90% of devices" and "49.7 MB" claims removed |
| P2-10 Verify ten requirements | ❌ **Failed, and reported as passed** | §9.1 |

### 9.3 Naming, structure, version control

| Issue | Detail |
|---|---|
| **v1 vision destroyed** | `docs/creator_os_vision.md` byte-identical to `v2/creator_os_vision_v2.md` |
| **Root documents moved** | PRD, vision and pain points are in `docs/`, not the repository root. v2 PRD §2's entire reference table has wrong paths |
| **v1 PRD not marked superseded** | Still "Version 0.1 — Draft for Discussion" with no banner. v2 PRD claims to replace "`creator_os_prd.md` v1.0" — a version that does not exist |
| **No version-control artifacts** | No git metadata, no CHANGELOG, no document index. Every state assertion depends on hand-written status documents — which is precisely how §9.1 happened |
| **Process artifacts mixed with requirements** | `P2-10-verification.md` sits in `requirements/functional/` alongside the FRS files; `P2-4-deduplication-log.md`, `P2-5-sweep-summary.md`, `BACKLOG-P2.md` sit in `requirements/`. These are project-management records and belong in a separate folder |
| **BOM characters** | `P2-4-deduplication-log.md`, `P2-5-sweep-summary.md` and `P2-10-verification.md` begin with a UTF-8 BOM; `P2-10-verification.md` also contains a mojibake artifact ("Â§3.2") |
| **PUB-M table out of order** | FRS-06 §4.10 rows run M1–M4, M8, M6, M7, M5 |
| **v2 doc-size asymmetry** | ARCH-04-v2 (1.8 KB), ARCH-05-v2 (1.8 KB), ARCH-06-v2 (1.5 KB), ARCH-08-v2 (1.6 KB), ARCH-10-v2 (1.5 KB) against ARCH-15 (8 KB). Security and sync — the two areas most changed by the pivot — got the least attention |

---

## 10. Blockers, Risks, Gaps

### Blockers — must be resolved before any build

| ID | Blocker | Evidence |
|---|---|---|
| **B1** | `spike-results.md` presents unperformed measurements as evidence; DEC-001 marked ✅ Confirmed on that basis, retiring the programme's largest technical risk | ARCH-12 and spike-results both dated 2026-08-22; no repo, build, or raw data referenced; ARCH-10 line 32 |
| **B2** | `P2-10-verification.md` certifies five requirements that do not exist in the named files; a sixth marked "Corrected" is uncorrected | Grep verification, §9.1 table |
| **B3** | v1 vision document destroyed — byte-identical to the v2 vision, which references it as prior context | `diff -q` reports identical |
| **B4** | Core-object discontinuity: `connected_record` vs `content_item`, no relationship, migration or precedence; eight v1 modules declared valid all depend on `content_item` | ARCH-03-v2 §2 vs v1 ARCH-03 §4.1; PRD-v2 §7 |
| **B5** | Google restricted-scope + annual CASA requirement gates the headline feature and appears in no document | Verified against Google Workspace and Google Cloud documentation |
| **B6** | FRS-08, FRS-09, FRS-15, FRS-16 orphaned — zero mentions in v2; true MVP scope therefore undefined | `grep -rn "FRS-08\|FRS-09\|FRS-15\|FRS-16" v2/` returns nothing |

### High risks

| ID | Risk |
|---|---|
| **R1** | Backend normalized index holds plaintext external titles/URLs while v2 NFR-05 declares v1's zero-knowledge posture still valid; no retention, deletion, consent or residency requirement follows |
| **R2** | Concierge prototype scope ≈ the MVP's cloud integration plane, defeating validate-before-build |
| **R3** | Two competing "what's missing" engines, both `Must`, unreconciled (v1 readiness vs v2 Next Action) |
| **R4** | v1 FRS-14 pricing contradicts v2 pricing while declared valid; no unit-economics model behind either |
| **R5** | 22 broken cross-version reference paths |
| **R6** | v2 ID prefixes unregistered; `INT-*` collision reintroduced across three meanings |
| **R7** | Webhook channel expiry/renewal undesigned (Drive Files watches default to 1 hour) |
| **R8** | Connected-search latency stated three incompatible ways with no normative home |
| **R9** | Local search has no FTS index for `connected_record` — CTS-10/CTS-11 unimplementable as specified |
| **R10** | Validation accepts verbal willingness to pay as evidence |
| **R11** | v2 segment and problem statement not covered by the v1 research, and no document says so |

### Gaps

Connector data deletion (GDPR erasure for the normalized index); OAuth-unverified-app UX; shared delivery view architecture; initial backfill design; multi-device coordination; per-account labelling in search results; accessibility requirements for all new v2 surfaces; provider ToS review process; glossary and data-dictionary v2 coverage; requirement-level traceability in both matrices; test mapping.

---

## 11. Prioritized Corrective Actions

### P0 — Before anything else (1–2 days)

| # | Action |
|---|---|
| **P0-1** | **Retract `spike-results.md`** or clearly re-label it as a template/expected-results document. Revert DEC-001 to "⏳ Provisional — gated on spike". Nothing that depends on the KMP/SQLCipher/FTS5 risk being retired may proceed until a real spike runs and reports with a linked repository, build artifacts and raw data. |
| **P0-2** | **Retract and redo `P2-10-verification.md`.** Add the five genuinely missing requirements to their real files: SET-M1 (app lock), SET-M2 (content pillar management), ON-M1 (first-run indexing) to FRS-09; AS-M10 (tag management), AS-M11 (search relevance) to FRS-03. Move CR-M7 from FRS-01's Change Log into §4.8. Re-verify by grep, not by assertion. |
| **P0-3** | **Restore the v1 vision** from history or reconstruct it, and add a "Superseded by v2 — retained for record" banner. Add the same banner to `docs/creator_os_prd.md` and correct its version reference in v2 PRD §2 (v0.1, not v1.0). Fix the paths in that table. |
| **P0-4** | **Adopt a rule: no completion artifact without linked evidence.** A status document must reference the commit, file and line, or the build/dataset, that substantiates it. Both B1 and B2 are the same failure. |

### P1 — Before validation starts (about one week)

| # | Action |
|---|---|
| **P1-1** | **Decide and document the Google scope strategy.** Choose: (a) restricted scopes + accept OAuth verification and annual CASA on the launch timeline and budget; (b) `drive.file` + Google Picker, and rewrite FRS-07 §4.7 and CTS-20 to promise picker-scoped access rather than Drive-wide search; or (c) launch Notion-first while Google verification proceeds. Record as a DEC in ARCH-10-v2. This decision changes the product's core promise, so it must precede validation. |
| **P1-2** | **Rescope the concierge prototype to a genuine concierge.** Operator-maintained record over one real campaign, shared folders instead of OAuth, human-delivered search answers and receipts. If OAuth must be tested, test *only* the Drive connect flow as a separate 10-minute task and note the unverified-app warning as a known confound. |
| **P1-3** | **Write a hypothesis register** listing the falsifiable v2 claims and mapping each to its scorecard metric. State plainly that the v2 segment and problem statement are not covered by the v1 research. |
| **P1-4** | **Strengthen the scorecard:** require actual payment or a signed pilot with card on file for the willingness-to-pay metric; close the one-critical-zero dead zone; extend the return-visit window to a real production cycle; add owner, timeline and budget. |
| **P1-5** | **De-lead the pricing questions** in interview §6 — ask current spend and an unprompted price before showing $12–15. Add a switching-cost question about existing Notion templates. |
| **P1-6** | **Fix the 22 broken `v1/..` paths** (mechanical) and the three wrong section references in §2.1. |

### P2 — Before MVP build (2–3 weeks, parallel with validation)

| # | Action |
|---|---|
| **P2-1** | **Resolve the core-object question.** Decide whether `connected_record` replaces `content_item`, extends it, or is a distinct type. Write the migration. Then restate, module by module, what "FRS-02/04/05/10/11/12/13/14 remain valid" actually means for each. |
| **P2-2** | **Give FRS-08, FRS-09, FRS-15 and FRS-16 an explicit v2 status** — reused, superseded, or deferred. FRS-09 almost certainly needs a v2 delta document for the account model, connection settings and Health Center. |
| **P2-3** | **Reconcile readiness vs Next Action.** Pick one engine. If Next Action wins, mark CAL-10/CAL-11 and CR-32…CR-37 superseded. |
| **P2-4** | **Reconcile pricing.** Replace v1 FRS-14 §4.3's limits table with the v2 model, or write an FRS-14-v2 delta. Build the unit-economics model that QCC-02 requires, at the announced prices, net of app-store fees. |
| **P2-5** | **Write the backend data-privacy delta.** Acknowledge in NFR-05-v2 that the normalized index holds user content; add requirements for encryption, retention, deletion on disconnect and account deletion, consent disclosure, and residency. Update NFR-05 §6.1's "stays on this device" text. Resolve C7 (receipt evidence vs "no user content" in the operation log). |
| **P2-6** | **Register all v2 ID prefixes** in `requirement-id-registry.md`; rename v2 NFR-08's `INT-*` to something unused (e.g. `PIC-*`); fix the P2-5 sweep prefixes (SCR→SE, PRV→MP, ANA→AN). |
| **P2-7** | **Create a v2 performance NFR** with one normative connected-search target, and reconcile ARCH-00-v2 §7 with the ARCH-15 §9 alert threshold. |
| **P2-8** | **Extend ARCH-03-v2** to add `connected_record` and `external_source_link` to the FTS5 `search_content` projection and triggers, or explain how CTS-10/CTS-11 are served without it. |
| **P2-9** | **Design the webhook channel lifecycle** (registration, renewal before expiry, re-registration after reauth, cleanup on disconnect) and add renewal to ARCH-15's job list. Resolve C8 and C9 on whether webhooks are MVP and whether Canva has them. |
| **P2-10** | **Resolve the remaining contradictions:** receipt mutability (HAR-14 vs RIN-01); SE-28…SE-31 to Phase 2; SCR-M6's dependency on the Phase 2 teleprompter; NFR-03's "≤5 GB without transcripts" acceptance line. |
| **P2-11** | **Upgrade both traceability matrices to requirement-level IDs** and add test mapping. Extend the glossary with v2 terms (disambiguating "capability matrix") and the data dictionary with the v2 tables and the missing v1 ones. |
| **P2-12** | **Design the missing pieces:** initial backfill, multi-device coordination, shared delivery view, connector data deletion, OAuth-unverified-app UX, accessibility for v2 surfaces. |
| **P2-13** | **Move process artifacts** (`P2-*`, `BACKLOG-P2.md`) out of `requirements/` into `docs/process/`. Strip BOMs and fix the mojibake. |

---

## 12. Final Verdict

### **Not ready.**

Broken down by gate:

| Gate | Verdict | Reasoning |
|---|---|---|
| **First user validation** | ⚠️ **Ready with fixes — about one week** | The interview script is genuinely good and could run almost as-is. Blocking: the prototype must be rescoped to a real concierge (P1-2), and the Google scope decision must be made first (P1-1) because it changes what the product can promise. P0-1 through P0-4 should be done first as a matter of basic hygiene. |
| **MVP build** | ❌ **Not ready** | Six blockers. Two of them (B1, B2) mean the repository's own completion signals cannot be trusted; one (B5) is an unaddressed external gate on the core feature; three (B3, B4, B6) mean the actual scope of the MVP is undefined. The programme's largest technical risk is recorded as retired on evidence that does not exist. |
| **Technical spike (v1 P0-3)** | ❌ **Must be re-run** | The plan (ARCH-12) is well constructed and ready to execute. The results document must be discarded and the spike actually performed. |

### What to hold onto

This is not a case of weak thinking. ARCHITECTURE-14 and ARCHITECTURE-15 are better than most pre-seed architecture documents; the v2 positioning is sharper than the v1 positioning was; the NFR README's authority table is a pattern the whole repository should adopt; and several of the P2 fixes (NFR-01 §3.4, NFR-03's arithmetic, NFR-07's dependency budget, the navigation IA) were done properly and are now genuinely settled.

The failure is one of process, and it has a single shape: **status was recorded as done without checking that it was done.** The spike results, the P2-10 verification, the "remains valid" claims about eight v1 modules, the traceability matrix's "no orphan requirements" — each asserts a completed state that a five-minute check falsifies. Fixing that habit matters more than fixing any individual document, because every remaining item on the corrective-action list will otherwise be reported complete without being complete.

The strategy is worth validating. Validate it — with a real concierge prototype, a real payment, and a decision about Google's scopes made before anyone is asked whether they would connect their Drive.

---

## Appendix: Externally verified claims

| Claim | Source | Result |
|---|---|---|
| `drive.readonly` and `drive.metadata.readonly` are **restricted** scopes | [Google Drive API — API-specific authorization](https://developers.google.com/workspace/drive/api/guides/api-specific-auth) | ✅ Confirmed. `drive.file` is non-sensitive but limited to files opened via Picker or created by the app |
| Restricted scopes require OAuth verification **and annual CASA** | [Google Cloud — Security assessment](https://support.google.com/cloud/answer/13465431), [OAuth app verification](https://support.google.com/cloud/answer/13463073) | ✅ Confirmed. "All applications must be revalidated every year" |
| Drive push notification channels expire and need manual renewal | [Google Drive API — Push notifications](https://developers.google.com/workspace/drive/api/guides/push) | ✅ Confirmed. Files max 86,400 s (default 3,600 s); Changes max 604,800 s; "there's no automatic way to renew a notification channel" |
| v1 contains exactly DEC-001…DEC-026 | `ARCHITECTURE-10-open-decisions.md` | ✅ ARCH-10-v2 §3's claim is accurate |
| v1 and v2 vision files are identical | `diff -q` | ✅ Byte-identical |
| Five P2-10 requirements absent from named files | grep against FRS-03 and FRS-09 | ✅ Confirmed absent |

**Sources:**

- [Google Drive API — Choose Drive API scopes](https://developers.google.com/workspace/drive/api/guides/api-specific-auth)
- [Google Cloud — OAuth App Verification](https://support.google.com/cloud/answer/13463073)
- [Google Cloud — Security assessment (CASA)](https://support.google.com/cloud/answer/13465431)
- [Google Drive API — Push notifications](https://developers.google.com/workspace/drive/api/guides/push)
