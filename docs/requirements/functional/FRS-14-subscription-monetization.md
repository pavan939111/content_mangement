# Functional Requirements Specification — Module 14  
**Module:** Subscription & Monetization  
**Version:** 1.1  
**Status:** Draft for Review  
**Related Vision / PRD:** CreatorOS  
**Priority:** Optional for MVP — Required only if monetization is part of initial launch

---

## 1. Purpose

The Subscription & Monetization module defines how CreatorOS offers free and paid plans, manages entitlements, handles purchases and restores, and enforces feature limits without harming user trust.

The module must solve the validated problems:

> **Creators are sensitive to subscription fatigue, surprise paywalls, retroactive feature removal, and billing/cancellation issues.**

> **A local-first creator tool must never lock users out of their own content or force them to pay to export or delete their data.**

> **Monetization must be transparent, predictable, and aligned with the app’s value: more storage, deeper search, cloud backup, advanced automation.**

This module ensures:

- Free tier is usable and meaningful for evaluation.
- Paid tier provides clear, valuable upgrades.
- No retroactive paywalls or watermarking of user-created content.
- Users can always access, export, and delete their data, even after cancellation.
- Purchases and entitlements work offline with appropriate grace periods.
- Subscription status is transparent and manageable.

---

## 2. Scope

This module covers:

- Free and paid plan definitions
- Feature entitlement mapping
- Purchase flow and receipt validation
- Restore purchases
- Subscription management (upgrade, downgrade, cancel)
- Trial and promotion handling
- Offline entitlement behavior
- Expiry and grace period
- User communication and trust
- Privacy and store compliance

**Out of scope:** Actual payment processing backend details, promotional campaigns, referral systems, ad-based monetization, enterprise licensing.

---

## 3. Key User Stories

### US-01 Use a Useful Free Tier

**As a** new creator,  
**I want to** use the app for free with enough storage and features to evaluate it,  
**so that** I can decide if it fits my workflow before paying.

### US-02 Upgrade to Pro

**As a** creator,  
**I want to** upgrade to Pro to get more indexed assets, AI transcription, and cloud backup,  
**so that** I can manage my full content library.

### US-03 Restore My Purchase

**As a** creator,  
**I want to** restore my Pro subscription on a new device,  
**so that** I don’t pay twice.

### US-04 Cancel Without Losing My Data

**As a** creator,  
**I want to** cancel my subscription but still access and export all my content,  
**so that** I am not locked in.

### US-05 See What Is Free vs Paid

**As a** creator,  
**I want to** clearly see which features require Pro before I attempt to use them,  
**so that** I am not surprised by a paywall.

---

## 4. Functional Requirements

### 4.1 Subscription Plans & Tiers

| ID | Requirement | Priority | Description |
|---|---|---|---|
| SUB-01 | The system shall define at least two plans: **Free** and **Pro**. | Must | Clear monetization. |
| SUB-02 | Plan definitions, limits, and feature entitlements shall be remotely configurable, but changes shall not apply retroactively to already-used entitlements in the current billing period. | Must | Trust. |
| SUB-03 | The Free plan shall be a fully functional, unlimited-time evaluation tier with meaningful limits. | Must | Adoption. |
| SUB-04 | The Pro plan shall provide expanded limits and advanced features: unlimited indexed assets, AI/cloud transcription, cloud backup, AI/semantic search (Phase 2), and future collaboration/analytics. | Should | Value. |
| SUB-05 | The system shall not require a subscription for core local functionality: idea capture, basic search, content records, scripts, clip marking, manual publishing handoff, export. | Must | Avoid crippling core. |
| SUB-06 | The system shall not watermark, reduce quality, or restrict export of user-created content based on subscription status. | Must | Trust. |

### 4.2 Entitlements & Feature Gating

| ID | Requirement | Priority | Description |
|---|---|---|---|
| SUB-10 | Feature gates shall be defined per feature and checked against current entitlement status. | Must | Enforcement. |
| SUB-11 | The system shall display a clear “Pro” badge or label on features that require a paid plan. | Must | Transparency. |
| SUB-12 | When a user attempts to use a Pro feature while on Free, the system shall show an upgrade screen explaining the benefit, with pricing and restore option. | Must | UX. |
| SUB-13 | Users shall be able to dismiss the upgrade screen and continue using free features. | Must | No forced flow. |
| SUB-14 | The system shall allow trying a Pro feature before purchasing only if a trial is active. | Should | Trial. |
| SUB-15 | Feature availability shall be remotely configurable without app update, but core local features shall never be remotely removed from Free. | Must | Avoid retroactive pain. |
| SUB-16 | The system shall not gate data export, deletion, local backup, or account deletion behind a subscription. | Must | Trust. |

### 4.3 Free Tier Limits (Default Recommendations)

| Feature / Resource | Free Limit | Pro Limit |
|---|---:|---:|
| Indexed assets | 500 | Unlimited |
| Content Items | 100 | Unlimited |
| Ideas | Unlimited | Unlimited |
| Scripts | Unlimited | Unlimited |
| Clips | 50 | Unlimited |
| Voice transcription | 5 per month | Unlimited |
| Cloud backup | Not included | Included |
| Advanced search filters | Basic (platform, type, date, tag, pillar) | AI/semantic search (Phase 2) |
| Publishing handoff manual | Included | Included |
| Platform API auto-publish (Phase 2) | Not included | Included |
| Collaboration (Phase 2) | Not included | Included |
| Analytics aggregation (Phase 2) | Basic | Pro |

**Requirement:** These limits are defaults and shall be remotely adjustable without removing existing user access to already-created data.

### 4.4 Purchase & Onboarding

| ID | Requirement | Priority | Description |
|---|---|---|---|
| SUB-20 | The system shall support in-app purchases through Apple App Store and Google Play using platform-native billing. | Must | Standard. |
| SUB-21 | The system shall not require creating a CreatorOS account to make a purchase; store account is sufficient. | Should | Reduce friction. |
| SUB-22 | The system shall validate purchase receipts through the platform billing library and backend validation where available. | Must | Security. |
| SUB-23 | The system shall display a clear pricing screen with plan comparison before purchase. | Must | Transparency. |
| SUB-24 | The system shall show subscription duration and renewal terms. | Must | Legal/trust. |
| SUB-25 | The system shall provide a “Restore Purchases” action in Settings > Account. | Must | Standard. |
| SUB-26 | The system shall restore prior purchases without creating duplicate charges. | Must | Reliability. |
| SUB-27 | The system shall support introductory offers and free trials where configured, with clear expiration date. | Should | Marketing. |
| SUB-28 | The system shall not start a paid subscription without explicit user confirmation and platform confirmation. | Must | Trust. |

### 4.5 Subscription Management

| ID | Requirement | Priority | Description |
|---|---|---|---|
| SUB-30 | The system shall show current plan, billing cycle, renewal date, and price in Settings > Account. | Must | Transparency. |
| SUB-31 | The user shall be able to upgrade, downgrade, or cancel from within the app. | Must | Platform requirement. |
| SUB-32 | The system shall provide a direct link to platform subscription management (Apple/Google). | Must | Standard. |
| SUB-33 | The system shall support cancellation without losing local data. | Must | Trust. |
| SUB-34 | After cancellation, Pro features remain active until the end of the paid period. | Must | Fairness. |
| SUB-35 | After expiration, existing data remains fully viewable and exportable. Creating new items beyond Free limits is blocked; editing existing items is allowed up to Free limits. No data is hidden or deleted. | Must | No data loss. |
| SUB-36 | The system shall not delete or hide user content due to subscription lapse. | Must | Critical trust. |
| SUB-37 | The system shall provide a “Resubscribe” option with previous plan information. | Should | Winback. |

### 4.6 Offline & Grace Period

| ID | Requirement | Priority | Description |
|---|---|---|---|
| SUB-40 | The system shall cache the user’s current entitlement status locally with expiry timestamp. | Must | Offline. |
| SUB-41 | If offline and local entitlement is valid, Pro features shall remain available. | Must | Offline-first. |
| SUB-42 | If subscription status cannot be verified due to network, the system shall allow a grace period of at least 7 days before downgrading, provided local receipt/token existed. | Should | Avoid false downgrade. |
| SUB-43 | When the grace period ends without verification, the system shall notify user and apply Free limits, but never delete data. | Must | Trust. |
| SUB-44 | The system shall retry entitlement verification automatically when connectivity returns. | Should | Seamless. |
| SUB-45 | Local data export and viewing shall always be available regardless of subscription status. | Must | User control. |

### 4.7 Privacy & Trust

| ID | Requirement | Priority | Description |
|---|---|---|---|
| SUB-50 | The system shall disclose billing terms, subscription price, duration, and auto-renewal clearly before purchase. | Must | Compliance. |
| SUB-51 | The system shall not use dark patterns: no countdown timers, misleading “free” claims, or hidden charges. | Must | Trust. |
| SUB-52 | The system shall not change feature entitlement or limits mid-cycle without prior notice and no retroactive removal. | Must | Fairness. |
| SUB-53 | The system shall not require subscription to delete an account or export data. | Must | Trust. |
| SUB-54 | Purchase data shall be handled securely and not shared beyond billing/receipt validation. | Must | Privacy. |
| SUB-55 | The system shall provide receipts and billing history through the platform store. | Should | Transparency. |
| SUB-56 | The system shall communicate clearly if a feature is cloud-dependent and may incur additional cost. | Should | Honesty. |

### 4.8 Accessibility

| ID | Requirement | Priority | Description |
|---|---|---|---|
| SUB-60 | Upgrade/paywall screens shall be accessible with VoiceOver/TalkBack, adequate contrast, and large text support. | Must | Accessibility. |
| SUB-61 | Subscription status and billing information shall be understandable in plain language. | Must | Cognitive. |
| SUB-62 | Restore purchase action shall be easy to find and accessible. | Must | Usability. |
| SUB-63 | The system shall provide accessible alternative text for plan comparison and feature lists. | Must | NFR-06. |

---

### 4.99 Missing MVP Requirements (Completeness Sweep)

No additional requirements needed after completeness sweep.

## 5. Data Model Considerations (Logical)

- **PlanDefinition** — plan ID, name, limits, entitlements, version.
- **EntitlementStatus** — user ID, plan ID, valid until, grace period end.
- **FeatureGate** — feature key, required plan.
- **PurchaseRecord** — transaction ID, product ID, store, date, status.
- **TrialStatus** — eligibility, start/end dates.
- **RemoteConfigOverride** — plan/limit changes from config.

These will be finalized during architecture design.

---

## 6. Acceptance Criteria Summary

| User Story | Acceptance Criteria |
|---|---|
| US-01 | New user can download and use app for free; can create ideas, scripts, content items, and search. Free limits are visible. |
| US-02 | User upgrades to Pro via native purchase; Pro features unlock immediately; plan shown in Settings. |
| US-03 | User taps Restore Purchases on new device; Pro status is restored without double charge. |
| US-04 | User cancels subscription; Pro remains until end of paid period; all data remains accessible and exportable. |
| US-05 | Pro features are clearly marked; attempting to use one shows upgrade screen with pricing and restore. |

---

## 7. Dependencies

- **FRS-09 Onboarding, Settings & Account Management** — account and purchase management UI.
- **FRS-13 Data Import/Export & Backup/Restore** — export must not be gated.
- **NFR-05 Security & Privacy** — secure purchase handling, no secret leakage.
- **NFR-08 Platform Integration & Remote Config** — remotely configurable plan/limits.
- **NFR-09 Reliability & Integrity** — no data loss on downgrade.
- **Apple App Store / Google Play billing** — platform constraints.

---

## 8. Open Questions / Decisions Needed

1. Should the MVP include subscription at all, or launch free first?  
   *Recommendation: Launch free or with limited Pro only if revenue is needed immediately; monetization can be added later without compromising trust.*

2. What is the exact free asset limit?  
   *Recommendation: 500 indexed assets and 100 content items initially; validate with beta users.*

3. Should cloud backup be Pro-only?  
   *Recommendation: Yes, local backup and export remain free.*

4. Should AI transcription be free for a few uses per month?  
   *Recommendation: Yes, free tier includes 5 transcriptions/month to demonstrate value.*

5. Should there be a lifetime purchase option?  
   *Recommendation: No for MVP; consider later if demand exists.*

---
| SUB-M1 | Free-tier limit reached mid-index | Must | If a user reaches the free-tier limit during a background index scan, the system shall pause indexing, notify the user, and prompt for upgrade, without losing already indexed data. |


## 99. Change Log

| Version | Date | Summary |
|---|---|---|
| 1.1 | 2026-08-22 | Completeness sweep: added missing requirements. |
