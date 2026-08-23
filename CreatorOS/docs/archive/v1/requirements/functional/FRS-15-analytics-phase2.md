# Functional Requirements Specification — Module 09  
**Module:** Analytics & Performance  
**Version:** 1.1  
**Status:** Draft for Review — Phase 2  
**Related Vision / PRD:** CreatorOS  
**Priority:** Phase 2 (Not MVP)

---

## 1. Purpose

The Analytics & Performance module defines how CreatorOS collects, aggregates, and presents platform performance data for a creator’s content, and how it links that data back to the actual creative decisions—hook, title, thumbnail, caption, duration, source footage, and repurposed clips.

The module must solve the validated problems:

> **Analytics are fragmented across platform apps; creators manually switch between YouTube Studio, TikTok, Instagram, and X to compare posts.**

> **Performance data is not connected to creative variables; creators cannot see which hook, cover, or caption caused a post to perform better or worse.**

> **Retention and view data require manual interpretation; platforms show where viewers drop but not why.**

> **Creators forget to review performance and mark evergreen content for reuse.**

This module is Phase 2 because it requires platform API connections, server-side aggregation, and careful handling of rate limits and privacy. It builds on the Content Record, Publishing Handoff, and Asset Library modules.

---

## 2. Scope

This module covers:

- Connecting platform accounts for analytics
- Pulling and caching performance metrics per post
- Mapping metrics to CreatorOS Content Items
- Unified cross-platform dashboard
- Comparing posts by creative variables
- Retention curve overlay with script/transcript markers
- Review prompts and evergreen identification
- Exporting analytics data
- Handling platform API limits and partial data
- Offline cached analytics views

**Out of scope:** Real-time social listening, comment inbox, competitor analysis, AI-driven content recommendations, predictive analytics, sentiment analysis, audience demographic deep-dives beyond basic metrics, multi-user collaboration analytics.

---

## 3. Key User Stories

### US-01 See All Platform Metrics in One Dashboard

**As a** creator,  
**I want to** view performance metrics from TikTok, Instagram, YouTube, and X in a single dashboard,  
**so that** I don’t switch between four apps.

### US-02 Compare Posts by Hook or Format

**As a** creator,  
**I want to** filter posts by hook style, duration, content pillar, or thumbnail type and compare their average performance,  
**so that** I can identify what works best.

### US-03 Understand Where Viewers Dropped

**As a** creator,  
**I want to** view a retention curve with my script/transcript markers overlaid,  
**so that** I can see which line or scene caused the drop.

### US-04 Get Reminded to Review Performance

**As a** creator,  
**I want to** receive a weekly/monthly review prompt after posts have accumulated data,  
**so that** I can mark winners for reuse or update.

### US-05 Export Analytics

**As a** creator,  
**I want to** export performance data and my annotations as CSV/JSON,  
**so that** I can use it in spreadsheets or reports.

---

## 4. Functional Requirements

### 4.1 Platform Account Connection for Analytics

| ID | Requirement | Priority | Description |
|---|---|---|---|
| AN-01 | The system shall allow connecting platform accounts for analytics separately from publishing connections, with user-scoped permissions. | Must | User control. |
| AN-02 | The system shall support analytics connections for YouTube, TikTok, Instagram, and X where platform APIs allow. | Must | Coverage. |
| AN-03 | The system shall display the status and scope of each analytics connection: Connected, Expired, Reconnect Required, Limited Data. | Must | Transparency. |
| AN-04 | The user shall be able to disconnect analytics without affecting publishing handoff or local data. | Must | Separation. |
| AN-05 | The system shall request only the minimum necessary scopes for read-only analytics. | Must | Privacy. |

### 4.2 Data Collection & Aggregation

| ID | Requirement | Priority | Description |
|---|---|---|---|
| AN-10 | The system shall fetch post-level metrics: views/impressions, likes, comments, shares, saves, watch time/average view duration, retention (where available), and reach. | Must | Core metrics. |
| AN-11 | The system shall fetch data incrementally using platform pagination and store high-water marks. | Must | Efficiency. |
| AN-12 | The system shall use server-side caching and aggregation to respect platform rate limits. The mobile app shall not call platform APIs directly for bulk analytics. | Must | NFR-08. |
| AN-13 | The system shall store metrics with the platform post ID and map them to Content Item IDs. | Must | Linkage. |
| AN-14 | The system shall handle missing or delayed platform data gracefully, showing “Data unavailable” or “Updated 2 days ago” rather than errors. | Must | UX. |
| AN-15 | The system shall refresh data at user-defined intervals (daily, weekly) or on manual request, within rate limits. | Should | Control. |
| AN-16 | The system shall not fetch full historical data by default; initial sync shall cover recent posts (e.g., last 90 days) with option for backfill. | Should | Quota. |
| AN-17 | The system shall deduplicate posts by immutable platform ID to avoid double counting. | Must | Accuracy. |

### 4.3 Unified Dashboard & Views

| ID | Requirement | Priority | Description |
|---|---|---|---|
| AN-20 | The system shall provide a dashboard showing aggregated performance across all connected platforms, with filters by platform, date range, content pillar, and status. | Must | Central. |
| AN-21 | The dashboard shall show top-performing posts and low performers, with basic metrics. | Must | Action. |
| AN-22 | The system shall provide a list view of all tracked posts with columns: thumbnail, title, platform, date, views, engagement rate, saves, and quick actions (view detail, mark evergreen, open source content). | Must | Browse. |
| AN-23 | The system shall provide a post detail analytics view showing per-platform metrics, charts, and linked creative variables. | Must | Detail. |
| AN-24 | The system shall support sorting and filtering by any metric and custom filters. | Should | Flexibility. |
| AN-25 | The system shall cache dashboard data for offline viewing with a “last updated” timestamp. | Should | Offline. |
| AN-26 | The system shall use platform-native metric definitions; when aggregating, it shall not combine incompatible metrics (e.g., TikTok “views” vs YouTube “impressions”). | Must | Accuracy. |

### 4.4 Creative Variable Comparison

| ID | Requirement | Priority | Description |
|---|---|---|---|
| AN-30 | The system shall allow the user to assign creative variables to a Content Item: hook style, title pattern, thumbnail type, caption style, duration bucket, content pillar, source clip, and edit template. | Must | Basis for analysis. |
| AN-31 | The system shall allow filtering and grouping posts by these creative variables across platforms. | Must | Core value. |
| AN-32 | The system shall display comparative metrics (average views, engagement rate, retention) per variable group. | Should | Insight. |
| AN-33 | The system shall highlight statistically meaningful patterns only when enough data exists; otherwise show cautionary note. | Should | Avoid false conclusions. |
| AN-34 | The system shall not automatically claim causation; it shall present correlations as hypotheses for the user to explore. | Must | Trust. |
| AN-35 | The user shall be able to save a comparison view as a saved filter for recurring review. | Should | Efficiency. |

### 4.5 Retention & Timecode Analysis

| ID | Requirement | Priority | Description |
|---|---|---|---|
| AN-40 | For platforms providing retention curves (e.g., YouTube), the system shall display the retention graph alongside the script/transcript with timecode markers. | Should | Insight. |
| AN-41 | The system shall allow the user to click a retention drop point and see the corresponding script line or transcript segment. | Should | Actionable. |
| AN-42 | The system shall store edit markers from the Repurposing Clip Library to overlay on retention. | Should | Integration. |
| AN-43 | The system shall not assume a single cause for retention drops; it shall show possible correlations only. | Must | Accuracy. |
| AN-44 | Retention data shall be cached locally and accessible offline. | Should | Offline. |

### 4.6 Review Prompts & Evergreen Detection

| ID | Requirement | Priority | Description |
|---|---|---|---|
| AN-50 | The system shall allow setting a performance review window per post (e.g., 7, 30, 90 days after publish). | Must | Workflow. |
| AN-51 | When the review window elapses, the system shall generate a reminder to review the post. | Must | From FRS-12. |
| AN-52 | The review prompt shall include basic metrics and quick actions: Mark as Evergreen, Repurpose, Update, Archive, Ignore. | Must | Efficiency. |
| AN-53 | The system shall allow batch review of multiple posts. | Should | Batch. |
| AN-54 | Evergreen-marked posts shall be added to a filterable Evergreen list for reuse. | Must | Repurposing. |
| AN-55 | The system shall support monthly/quarterly summary reports with top performers and trends. | Should | Strategy. |
| AN-56 | The system shall not require the user to complete review before taking other actions; reviews are optional. | Must | No forced flow. |

### 4.7 Export & Portability

| ID | Requirement | Priority | Description |
|---|---|---|---|
| AN-60 | The user shall be able to export analytics data and annotations as CSV or JSON. | Must | Portability. |
| AN-61 | Export shall include post ID, platform, content item ID, metrics, creative variables, and review tags. | Must | Complete. |
| AN-62 | Export shall work offline using cached data. | Should | Offline. |
| AN-63 | The system shall include a note on metric definitions and date ranges in exports. | Should | Clarity. |

### 4.8 Privacy & Data Control

| ID | Requirement | Priority | Description |
|---|---|---|---|
| AN-70 | Analytics data shall be stored securely and encrypted at rest. | Must | NFR-05. |
| AN-71 | The user shall be able to disconnect analytics and delete cached analytics data without affecting local content. | Must | Control. |
| AN-72 | The system shall not share analytics data with third parties without explicit consent. | Must | Privacy. |
| AN-73 | The system shall comply with platform API terms regarding data retention and display. | Must | Legal. |

### 4.9 Performance & Offline

| ID | Requirement | Priority | Description |
|---|---|---|---|
| AN-80 | Dashboard and list views shall load cached data within 500 ms median. | Must | UX. |
| AN-81 | Server calls for analytics refresh shall be asynchronous and not block UI. | Must | UX. |
| AN-82 | The system shall use stale-while-revalidate strategy for dashboard refresh. | Should | Freshness. |
| AN-83 | The system shall not auto-refresh analytics while user is actively scrolling or interacting, to avoid jank. | Must | UX. |
| AN-84 | Analytics features shall be disabled gracefully if no platform accounts are connected; the user sees an empty state with connect prompt. | Must | Clarity. |

### 4.10 Accessibility

| ID | Requirement | Priority | Description |
|---|---|---|---|
| AN-90 | Charts and metrics shall have text alternatives and be accessible via VoiceOver/TalkBack. | Must | NFR-06. |
| AN-91 | Color shall not be the only indicator for performance status; use text and icons. | Must | Accessibility. |
| AN-92 | Filters and sort controls shall be keyboard/screen-reader accessible. | Must | NFR-06. |

---

### 4.99 Missing MVP Requirements (Completeness Sweep)

| ID | Requirement | Priority | Description |
|---|---|---|---|
| ANA-P1 | Offline Analytics Caching | Phase 2 | The system shall cache analytical events offline and sync them when a connection is restored. |

## 5. Data Model Considerations (Logical)

- **PlatformAccountAnalytics** — token, scopes, platform, status.
- **PostMetric** — platform post ID, content item ID, platform, metric type, value, timestamp, source.
- **CreativeVariableAssignment** — content item ID, variable type, value.
- **ReviewReminder** — content item ID, window, status.
- **SavedFilter** — user-defined filter criteria.
- **EvergreenMark** — content item ID, date, reason.

These will be refined during architecture design.

---

## 6. Acceptance Criteria Summary

| User Story | Acceptance Criteria |
|---|---|
| US-01 | User sees aggregated dashboard with posts from all connected platforms; filters work. |
| US-02 | User filters posts by hook style and sees average views per hook group. |
| US-03 | For a YouTube post with retention data, user opens retention graph and taps a drop point to see corresponding script line. |
| US-04 | After 30 days, user receives a review reminder; can mark post as Evergreen and it appears in Evergreen list. |
| US-05 | User exports analytics as CSV; file includes metrics and annotations. |

---

## 7. Dependencies

- **FRS-01 Core Content Record** — content item association.
- **FRS-03 Asset Library** — thumbnails, source clips.
- **FRS-04 Repurposing Clip Library** — clip markers and timecodes.
- **FRS-06 Publishing Handoff** — platform post IDs and live URLs.
- **FRS-07 Integrations** — platform account connections.
- **FRS-08 Offline & Sync** — caching and offline.
- **FRS-12 Notifications & Reminders** — review prompts.
- **NFR-05 Security & Privacy** — data handling.
- **NFR-08 Platform Integration & Remote Config** — API limits, capability matrix.

---

## 8. Open Questions / Decisions Needed

1. Which platforms should be supported first for analytics?  
   *Recommendation: YouTube and TikTok first; Instagram and X later because API constraints vary.*

2. Should analytics be available on Free tier?  
   *Recommendation: Basic analytics free; advanced comparison and retention overlay Pro.*

3. Should the system automatically pull analytics daily or require manual refresh?  
   *Recommendation: Daily background refresh for connected accounts with Wi-Fi, with manual refresh option.*

4. Should retention overlay be limited to YouTube?  
   *Recommendation: Yes initially; TikTok/Instagram retention is limited.*

5. Should the system generate a weekly summary notification?  
   *Recommendation: Optional, user-configurable.*

---


## 99. Change Log

| Version | Date | Summary |
|---|---|---|
| 1.1 | 2026-08-22 | Completeness sweep: added missing requirements. |
