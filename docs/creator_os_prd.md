# Product Requirements Document  
> **Superseded by v2:** This v1 PRD is retained for reference. The current product definition is `v2/creator_os_prd_v2.md`.

**Product Name:** CreatorOS *(Working Title)*  
**Document Version:** 0.1 — Draft for Discussion  
**Target User:** Solo short-form content creators  
**Platform:** Mobile-first (iOS / Android), with optional desktop/web later  

---

## 1. Background & Problem Statement

Content creators today manage their work across a fragmented stack:

- Ideas in Notes / Google Keep / screenshots / DMs
- Scripts in Google Docs / Notion
- Raw footage in phone storage, external drives, Google Drive, Dropbox
- Editing in CapCut / Premiere / DaVinci
- Thumbnails and covers in Canva
- Scheduling in Buffer / Later / Metricool
- Publishing and analytics in native platform apps

This creates daily coordination overhead, lost ideas, slow retrieval of old clips, manual repurposing, missed publishing steps, and burnout.

**The product opportunity is not to replace editors, design tools, storage, or schedulers.**  
It is to build a **creator control center**: one mobile-first, offline-capable workspace that connects the idea, script, raw footage, edits, final exports, captions, thumbnails, schedule, publishing status, and performance around a single content record.

---

## 2. Research Validation Summary

The requirements below are based on validated creator pain points, not assumptions.

| Verdict | Count | Meaning |
|---|---|---|
| ✅ Confirmed | 45 | Direct evidence from Reddit, G2, Trustpilot, App Store, creator forums |
| 🟡 Partially Confirmed | 28 | Real problem, but narrower evidence or severity varies |
| ❌ Unconfirmed | 3 | Insufficient evidence; do not build first |
| ⏳ Pending | 0 | All validated |

### Canonical Top 10 Validated Problems

| Rank | Pain Point | Validated Verdict | Confidence |
|---:|---|---:|---:|
| 1 | Fragmented workflow across too many apps | Confirmed | 93% |
| 2 | No unified post/project record linking all assets | Partially Confirmed | 75% |
| 3 | Idea loss between capture and production | Confirmed | 91% |
| 4 | Searching old clips/scripts/thumbnails is manual and unreliable | Confirmed | 92% |
| 5 | Manual repurposing and reuse of old content | Confirmed | 93% |
| 6 | Mobile/offline weaknesses in existing creator tools | Confirmed | 94% |
| 7 | Calendar does not reflect production readiness | Partially Confirmed | 74% |
| 8 | Scheduler unreliability and shallow analytics | Confirmed/Partially | 75–84% |
| 9 | Storage/search limitations for large raw media libraries | Confirmed | 88–92% |
| 10 | Pricing trust and subscription fatigue | Confirmed | 88–93% |

*(For full details and FRS mapping, see [Canonical Top 10 Pain Points](docs/requirements/canonical-top-10-pain-points.md))*

### Unconfirmed or Weak Points — Not MVP Drivers

- Duplicate reuse tracking  
- “No fast local search” as a standalone claim  
- “New tool must show immediate time savings”  

---

## 3. Goals & Non-Goals

### Goals

- Reduce manual coordination between tools.
- Make old content and assets quickly searchable.
- Enable offline capture and offline access to scripts, notes, tags, and cached previews.
- Preserve context from idea to published post.
- Make repurposing faster by capturing reusable moments early.
- Provide clear publishing readiness and platform-specific handoff states.
- Respect existing storage and creative tools; do not force migration.

### Non-Goals — MVP

- Full video editor
- Full graphic design suite
- Enterprise DAM/MAM system
- Universal one-click auto-publishing guarantee
- Full client review/approval platform
- Social inbox/comment management
- AI-generated content creation
- Advanced predictive analytics

---

## 4. Target Users & Personas

### Primary Persona: Solo Short-Form Creator

- Creates Reels, TikToks, YouTube Shorts
- Posts 3–7 times per week
- Uses phone for filming, CapCut for editing, Canva for covers
- Stores files across phone, Drive, Dropbox, external SSD
- Schedules manually or with Buffer/Later/Metricool
- Has no assistant or editor

### Secondary Persona: Editor-Assisted Creator / Social Media Manager

- Works with a freelance editor or small team
- Sends files through Drive/Dropbox/WeTransfer
- Reviews content via email, WhatsApp, DMs
- Needs approvals and final asset handoff

**MVP focus:** Primary persona.  
**Phase 2:** Collaboration for secondary persona.

---

## 5. Jobs-to-be-Done

As a solo content creator, I need to:

1. Capture an idea instantly, in any format, even offline.
2. Convert that idea into a planned content item without retyping.
3. Write and link scripts to planned shots and final footage.
4. Find any old clip, script, thumbnail, or caption quickly.
5. See all assets for a post in one place.
6. Know whether a scheduled post is actually ready.
7. Publish or hand off to native apps with clear requirements.
8. Reuse old footage without rewatching everything.
9. Track what worked and which assets were used.

---

## 6. Product Scope

### MVP — Must Have

- Core content record
- Idea capture inbox
- Unified search and asset library
- Repurposing marker and clip library
- Basic calendar with readiness warnings
- Platform-aware publishing status
- Bring-your-own-storage integrations
- Offline-first capture and search
- Transparent export/trust controls

### Phase 2 — Should Have

- Lightweight collaboration/approval
- Cross-platform analytics aggregation
- Creative-variable performance comparison
- Evergreen review prompts and reuse scheduling
- More automated metadata extraction

### Out of Scope

- Full editing
- Full design
- Native platform replacement
- Automatic duplicate-content policy compliance

---

## 7. Functional Requirements

### 7.1 Core Content Record

| ID | Requirement | Priority | Rationale |
|---|---|---|---|
| CR-01 | The system shall allow the user to create a Content Item with at least: title, idea, script, notes, hook, CTA, content pillar, target platform(s), status, tags, due date, publish date, live URL(s). | Must | Validated lack of unified post record |
| CR-02 | The system shall support non-linear, flexible workflow stages: Idea, Research, Scripting, Filming, Editing, Ready, Scheduled, Published, Archived, Reuse. Stages may be reordered, skipped, or customized. | Must | No consistent workflow order exists |
| CR-03 | The system shall allow linking external assets to a Content Item as references: local files, cloud files, folders, editor project files, design links, and URLs. | Must | Workflow fragmented across tools |
| CR-04 | The system shall maintain source/derivative relationships between original content, clips, and repurposed posts. | Must | Manual repurposing and lost context |
| CR-05 | The system shall preserve version history for scripts, captions, titles, thumbnails, and exported file versions. | Should | Version tracking missing |
| CR-06 | The system shall provide list, board, and calendar views driven by the same Content Item data. | Must | Creators duplicate status across tools |

---

### 7.2 Idea & Capture

| ID | Requirement | Priority | Rationale |
|---|---|---|---|
| CAP-01 | The system shall allow offline capture of text, voice, photo, video, and link. | Must | Mobile/offline weakness |
| CAP-02 | The system shall support share-sheet import from Notes, Photos, Files, Google Docs, YouTube, TikTok, Instagram, and browsers. | Must | Inspiration fragmented across sources |
| CAP-03 | The system shall automatically transcribe voice notes and store the transcript with the original audio. | Must | Voice memos not searchable/actionable |
| CAP-04 | The system shall automatically capture source context where available: original URL, platform, timestamp, preview image. User can optionally add reason, content pillar, intended format. | Should | Saved inspiration loses context |
| CAP-05 | The system shall maintain an Idea Inbox separate from production Content Items. | Must | Ideas lost between capture and production |
| CAP-06 | The user shall be able to convert an idea into a Content Item in one action. | Must | Manual idea-to-calendar transition |
| CAP-07 | The system shall resurface unprocessed ideas after 24 hours, 7 days, or 30 days with optional reminders. | Should | Creators forget captured ideas |
| CAP-08 | Capture shall require no mandatory fields. | Must | Avoid capture friction |

---

### 7.3 Asset Library & Search

| ID | Requirement | Priority | Rationale |
|---|---|---|---|
| AS-01 | The system shall index local device files, connected cloud storage, and external drive catalogs without forcing original media upload. | Must | Storage cost and trust |
| AS-02 | The system shall generate and store lightweight thumbnails/proxies for media previews. | Must | Fast retrieval and offline preview |
| AS-03 | The system shall provide unified search across scripts, captions, transcripts, tags, filenames, notes, dates, platforms, and post URLs. | Must | Old assets hard to search |
| AS-04 | The system shall support transcript/timecode search and jump-to-preview when available. | Should | Search by spoken words |
| AS-05 | The system shall provide filters: type, platform, status, date range, content pillar, location, camera, previous use, connected/external drive. | Must | Memory-based retrieval |
| AS-06 | The system shall display original file location and availability: online, offline, external disconnected. | Must | Assets across drives |
| AS-07 | The system shall suggest tags from metadata, transcript, folder name, prior projects, and allow quick correction. | Should | Manual tagging burden |
| AS-08 | The system shall detect duplicate files and display them as linked items. | Should | Storage clutter |
| AS-09 | The system shall track asset usage history, including which Content Item and published post used it. | Should | Reuse without context |
| AS-10 | The system shall not require renaming original files; metadata shall be stored separately. | Must | Generic filenames, avoid migration |

---

### 7.4 Repurposing & Clip Library

| ID | Requirement | Priority | Rationale |
|---|---|---|---|
| RP-01 | The user shall be able to mark a reusable moment on a video/audio file with in/out timecode. | Must | Manual repurposing |
| RP-02 | The system shall store each marked moment with transcript excerpt, hook, topic, suggested platform, and quality note. | Must | Reuse candidates lost |
| RP-03 | The system shall maintain a Clip Library separate from raw footage. | Must | Need for clip bank |
| RP-04 | Each clip shall retain source asset, timecode, transcript, tags, status, and all derivatives. | Must | Repurposed clips lose context |
| RP-05 | The system shall link original long-form/source content to all repurposed derivatives. | Should | Platform-specific transformation |
| RP-06 | The system shall provide a platform-specific packaging checklist: aspect ratio, duration, captions, cover, CTA, sound, platform-native steps. | Should | Cross-posting friction |
| RP-07 | The user shall be able to search clips by transcript, topic, hook, date, source, and platform. | Must | Search old moments |
| RP-08 | The system shall show “used before” history as optional provenance. It shall not claim platform policy compliance. | Should | Reuse risk is unconfirmed |

---

### 7.5 Planning & Calendar

| ID | Requirement | Priority | Rationale |
|---|---|---|---|
| CAL-01 | The system shall provide calendar, list, and board views from the same Content Item data. | Must | Schedule duplicated across tools |
| CAL-02 | The system shall compute readiness based on attached assets: script, raw footage/selects, edit/export, cover, caption, hashtags. | Must | Calendar date does not equal readiness |
| CAL-03 | The system shall show an at-risk warning when a scheduled Content Item is missing required components. | Should | Deadlines slip |
| CAL-04 | The system shall provide a batch production view showing ready/unready counts for a selected production day. | Should | Batch production depends on pre-planning |
| CAL-05 | The system shall support separate scheduling lanes: fixed, evergreen, trend-responsive, backlog. | Should | Long-range plans conflict with trends |
| CAL-06 | The system shall support reminders for filming, editing, caption, cover, and native posting. | Should | Schedulers require manual final work |
| CAL-07 | The user shall be able to reschedule a Content Item while preserving all assets, captions, and metadata. | Must | Reduce admin work |
| CAL-08 | The system shall provide periodic review prompts to mark content as evergreen, update, repurpose, or archive. | Phase 2 | Monthly review is manual |

---

### 7.6 Publishing & Platform Handoff

| ID | Requirement | Priority | Rationale |
|---|---|---|---|
| PUB-01 | The system shall allow connecting accounts for YouTube, TikTok, Instagram, and X where platform APIs permit. | Phase 2 | Cross-posting friction |
| PUB-02 | The system shall display a platform capability matrix: auto-publish, native draft, reminder only, unsupported. | Must | Native platform constraints |
| PUB-03 | The system shall maintain canonical publishing states as defined in NFR-08 (15 states). | Must | Publishing status unclear |
| PUB-04 | The system shall support platform-specific variants for caption, hashtags, cover, title, description, and CTA. | Must | Cross-posting not export-once |
| PUB-05 | The system shall validate asset requirements before scheduling: aspect ratio, duration, file size, codec, cover, caption length. | Should | Platform requirements differ |
| PUB-06 | When native posting is required, the system shall provide a reminder with one-tap export/copy/deep link to the native app. | Should | Native posting reminders |
| PUB-07 | The system shall record published URL/ID where APIs permit and log failures with retry/reconnect instructions. | Must | Publishing reliability |
| PUB-08 | The system shall not claim universal one-click publishing. It shall clearly state platform/API limitations. | Must | Avoid overpromising |

---

### 7.7 Integrations

| ID | Requirement | Priority | Rationale |
|---|---|---|---|
| INT-01 | Connect Google Drive, local folders, and external drives (Must). Dropbox, iCloud Drive, OneDrive are Phase 2. | Must | Bring-your-own-storage |
| INT-02 | Support import via share sheet from Notes, Photos, Files, Google Docs, YouTube, TikTok, Instagram. | Must | Capture fragmentation |
| INT-03 | Support read-only/calendar integration with Google Calendar and Apple Calendar for reminders. | Should | Manual calendar work |
| INT-04 | Support deep links or share/export paths to CapCut, Canva, and common editors. | Should | Integrate, don’t replace |
| INT-05 | Provide full data export: scripts, notes, tags, metadata, relationships, thumbnails, and proxies in portable formats. | Must | Trust and avoiding lock-in |
| INT-06 | Use platform APIs only for supported actions. Where unsupported, fall back to reminder/native handoff. | Must | Platform constraints |

---

### 7.8 Offline & Sync

| ID | Requirement | Priority | Rationale |
|---|---|---|---|
| OFF-01 | The system shall use a local-first database for scripts, notes, tags, metadata, and cached thumbnails/proxies. | Must | Notion/Milanote offline weakness |
| OFF-02 | Capture and search shall work offline for all locally cached records. | Must | Mobile capture separated from production |
| OFF-03 | The system shall display a sync queue with pending, retrying, failed, and last-synced states. | Should | Sync reliability |
| OFF-04 | The user shall control selective download of original media. Full raw media download shall not be required for basic workflows. | Must | Storage cost and privacy |
| OFF-05 | The system shall detect sync conflicts and allow the user to choose which version to keep. | Should | Conflict resolution |
| OFF-06 | Pinned projects and recent items shall be available offline. | Should | Offline access |

---

### 7.9 Analytics — Phase 2

| ID | Requirement | Priority | Rationale |
|---|---|---|---|
| AN-01 | Aggregate post-level metrics across connected platforms where APIs permit. | Phase 2 | Analytics fragmented |
| AN-02 | Preserve native metric definitions and provide deep links to native analytics. | Phase 2 | Avoid misleading metrics |
| AN-03 | Link performance to creative variables: hook, cover/title, caption, duration, topic, template, source clip. | Phase 2 | Performance not connected to creative choices |
| AN-04 | Where YouTube retention data is available, allow timecode-linked review against script/transcript/edit markers. | Phase 2 | Retention requires manual interpretation |
| AN-05 | Present insights as hypotheses, not deterministic causal claims. | Phase 2 | Avoid false attribution |
| AN-06 | Generate review prompts with actions: reuse, update, sequel, archive. | Phase 2 | Monthly review manual |

---

### 7.10 Collaboration — Phase 2

| ID | Requirement | Priority | Rationale |
|---|---|---|---|
| COL-01 | Provide shareable review links for a specific content version. | Phase 2 | Collaboration fragmented |
| COL-02 | Support timestamped comments/feedback on video or image preview. | Phase 2 | Feedback scattered |
| COL-03 | Support approval states: In Review, Changes Requested, Approved. | Phase 2 | No clear review workflow |
| COL-04 | Link the approved asset version directly to the Content Item and publish queue where supported. | Phase 2 | Editor-to-scheduler handoff |
| COL-05 | Do not require clients to create an account for basic review. | Phase 2 | Avoid adoption friction |

---

### 7.11 Trust, Pricing & Export

| ID | Requirement | Priority | Rationale |
|---|---|---|---|
| TR-01 | The system shall show clear free/paid boundaries before the user invests work. | Must | CapCut/watermark trust issue |
| TR-02 | There shall be no retroactive watermark, paywall, or loss of access to user-created metadata/assets. | Must | Pricing trust |
| TR-03 | The system shall support self-service cancellation and explicit renewal notifications. | Should | Later billing complaints |
| TR-04 | The system shall not force raw media upload. Users shall be able to connect existing storage and index metadata/proxies. | Must | Storage cost and privacy |
| TR-05 | The system shall be transparent about AI/cloud processing. Local-first options shall be available for basic features. | Should | Cloud privacy concern |
| TR-06 | The user shall be able to delete metadata/index without deleting original files. | Should | Data control |

---

## 8. Non-Functional Requirements

> **Note:** This section is superseded by the normative NFR documents NFR-01 through NFR-11 in `docs/requirements/non-functional/`. For all non-functional requirements, refer to those documents.

*(For full non-functional requirements, see the `NFR-01` to `NFR-11` documents in `docs/requirements/non-functional/`.)*

---

## 9. Key User Stories & Acceptance Criteria

### US-01 — Capture Idea Offline

**As a** solo creator,  
**I want to** record a voice idea while offline,  
**so that** I do not lose the idea when I have no signal.

**Acceptance Criteria:**

- User can record voice in airplane mode.
- Audio is saved locally.
- Once network is available, audio can be transcribed.
- Idea appears in Idea Inbox.
- No mandatory fields block capture.

---

### US-02 — Find an Old Clip or Script

**As a** creator,  
**I want to** search across my old scripts, captions, transcripts, and clips,  
**so that** I can reuse material without rewatching everything.

**Acceptance Criteria:**

- User searches a keyword.
- Results include scripts, captions, transcript matches, and media items.
- Filters by date, platform, content pillar, and file type work.
- If a clip is on a disconnected drive, its location and availability are shown.
- User can preview a thumbnail/proxy if available.

---

### US-03 — Know Whether a Scheduled Post Is Ready

**As a** creator,  
**I want to** see whether my scheduled post has all needed assets,  
**so that** it does not fail or require last-minute work.

**Acceptance Criteria:**

- Calendar item shows readiness state.
- Missing script/footage/export/cover/captions is flagged.
- At-risk state is visible at least 24 hours before scheduled time.
- User can reschedule without losing content.

---

### US-04 — Mark a Reusable Moment

**As a** creator,  
**I want to** mark a portion of a long video with timecode and hook,  
**so that** I can repurpose it later without rewatching.

**Acceptance Criteria:**

- User can select in/out timecode.
- Transcript excerpt is saved automatically where available.
- User can add hook, topic, platform, and quality note.
- The moment appears in the Clip Library.
- Searching the hook or topic finds the clip.

---

### US-05 — Publish with Platform Handoff

**As a** creator,  
**I want to** know if I can auto-publish or must post natively,  
**so that** I do not assume a post went live when it did not.

**Acceptance Criteria:**

- Platform capability matrix shows auto-publish/native/unsupported.
- Publishing state updates after attempt.
- If failure occurs, user sees reason and retry/reconnect instructions.
- If native posting is required, user receives a reminder and can export/copy content quickly.

---

## 10. Success Metrics

| Metric | Target |
|---|---|
| Time to locate an existing asset | Reduce by 50% compared with current creator stack |
| Idea-to-scheduled conversion | At least 40% of captured ideas reach a scheduled/published state within 30 days |
| Missed publishing due to readiness | Reduce scheduled-at-risk posts through warnings |
| Repurposing output | Increase number of derivative clips/posts per source video |
| D7 retention | 25%+ of new users still active after 7 days |
| D30 retention | 15%+ of new users still active after 30 days |
| Offline usage | At least 30% of captures occur while offline or on poor connection |
| Storage opt-in | Majority of users connect existing storage rather than upload raw media |

---

## 11. Assumptions

1. Primary target is solo short-form creators using a phone as their main device.
2. Creators already use cloud storage/Drive/Dropbox and are willing to connect them.
3. Platform APIs will continue to limit some publishing and analytics; native handoff is acceptable.
4. Full raw video upload is not required for MVP; proxy/thumbnail indexing is sufficient.
5. Core value is workflow coordination and search, not editing or design.
6. Creators will tolerate some upfront setup if it removes recurring manual work.

---

## 12. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Platform API limits break publishing | Build native handoff/reminder first; do not depend on universal auto-publish. |
| Users resist another tool | Integrate existing storage/editors; provide share-sheet import and quick time-to-value with search. |
| Cloud storage costs make users distrust | Bring-your-own-storage; store only metadata/proxies; clear quotas. |
| Automatic tagging/AI is inaccurate | Make suggestions editable, explainable, optional. |
| Offline media management creates device storage issues | Use selective caching, proxies, and user-controlled downloads. |
| Collaboration features dilute MVP | Defer to Phase 2; focus solo creator first. |
| Platform rules change frequently | Maintain a remote configuration capability matrix. |
| Pricing trust | Transparent tier boundaries, self-service cancellation, full export. |

---

## 13. Traceability Matrix

| Top Validated Pain Point | Pain IDs | Primary Requirements |
|---|---|---|
| Fragmented workflow / too many tools | #1, #2, #5, #78 | CR-01, CR-03, CR-06, INT-01, INT-02 |
| Old clips/scripts hard to search | #24–32, #79 | AS-01, AS-03, AS-04, AS-05, AS-06, AS-09 |
| Manual repurposing | #35, #37, #39 | RP-01, RP-02, RP-03, RP-04, RP-06 |
| Platform constraints / cross-posting | #22, #71, #72, #74 | PUB-02, PUB-04, PUB-05, PUB-06, PUB-08 |
| Mobile/offline weakness | #54, #55, #57 | CAP-01, OFF-01, OFF-02, OFF-04 |
| Pricing trust / subscription burden | #60, #62, #64, #66 | TR-01, TR-02, TR-03, TR-04 |
| Idea loss | #7–13 | CAP-03, CAP-04, CAP-05, CAP-06, CAP-07 |
| Calendar readiness | #14–18, #20, #23 | CAL-01, CAL-02, CAL-03, CAL-04, CAL-07 |
| Analytics fragmentation | #49–53 | AN-01, AN-03, AN-04, AN-06 |
| Unified post record gap | #3, #4, #30, #47 | CR-01, CR-03, CR-04, CR-05 |
| Collaboration issues | #68–70 | COL-01, COL-02, COL-03, COL-04 |

---

## 14. Next Steps

1. Review and approve this PRD structure.
2. Convert top requirements into user flows and wireframes.
3. Build a clickable prototype for the core loop:
   - Capture idea → Search asset → Create/link content → Schedule → Publish handoff.
4. Validate the prototype with 5–10 solo creators.
5. Prioritize backlog using effort vs validated severity.
6. Finalize MVP development scope and milestones.
