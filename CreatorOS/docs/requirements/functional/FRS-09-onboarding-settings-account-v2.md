# Functional Requirements Specification — Module 09 v2
**Module:** Onboarding, Settings & Account Management
**Version:** 2.0
**Date:** 2026-08-23
**Status:** Draft for Validation
**Related PRD:** v2/creator_os_prd_v2.md
**Reference to v1:** ../../../docs/requirements/functional/FRS-09-onboarding-settings-account.md

---

## 1. Purpose

This document defines the **v2 delta** for Onboarding, Settings & Account Management.

It does not repeat v1 content. Where v1 requirements remain valid, they are referenced.

In v2, the app requires an account (Supabase Auth) and manages OAuth-connected provider accounts. The v1 local-only, no-account model is superseded. The Connection Health Center is a new first-class surface.

## 2. Reference to v1 Stable Requirements

The following v1 requirements remain valid where applicable:

- App Lock / Biometric Gate (SET-M1): v1 FRS-09 §4.9 — reinterpreted for account-based auth.
- Content Pillar Management (SET-M2): v1 FRS-09 §4.9 — works on `connected_record` instead of `content_item`.
- First-run source selection (ON-M1): v1 FRS-09 §4.9 — replaced by connection setup flow below.

Where v2 changes behavior, the new requirements below supersede v1.

## 3. New Definitions

| Term | Definition |
|---|---|
| Account Creation | Supabase Auth email/password or OAuth sign-in creating a workspace. |
| Connection Setup Flow | Guided flow connecting Google Drive/Docs/Calendar and Notion via OAuth. |
| Connection Health Center | Dedicated screen listing all connections with health state, affected records, and recovery actions. |
| Workspace | A single user's data boundary in v2; one workspace per account in MVP. |

## 4. Functional Requirements

### 4.1 Account & Authentication

| ID | Requirement | Priority | Description |
|---|---|---|---|
| ONB-01 | The system shall require account creation or sign-in before any cloud-connected feature is available. | Must | Supabase Auth required for BFF access. |
| ONB-02 | The system shall support email/password and Google OAuth sign-in via Supabase Auth. | Must | Standard auth providers. |
| ONB-03 | The system shall allow the user to view their account email and plan status in Settings. | Must | Transparency. |
| ONB-04 | The system shall allow the user to delete their account and all associated data. | Must | Data control per NFR-05. |
| ONB-05 | The system shall support biometric app lock after initial login (reusing v1 SET-M1 pattern). | Should | Local security layer. |

### 4.2 First-Run & Connection Setup

| ID | Requirement | Priority | Description |
|---|---|---|---|
| ONB-10 | After first sign-in, the system shall present a connection setup screen offering Google Drive, Google Docs, Google Calendar, and Notion connectors. | Must | Replaces v1 local source selection. |
| ONB-11 | Each connector option shall display a plain-language explanation of requested permissions before starting OAuth. | Must | Informed consent per SPC-03. |
| ONB-12 | The system shall allow skipping all connections and using local-only features without penalty. | Must | Free tier must be useful without connectors. |
| ONB-13 | If the Google OAuth app is in testing/unverified mode, the system shall display a clear interstitial explaining reduced trust and scope limitations. | Must | Per ARCHITECTURE-16 §5. |
| ONB-14 | The system shall show progress during each connector's initial sync and indicate partial availability while backfilling. | Must | Set expectations for large Drive indexes. |

### 4.3 Settings

| ID | Requirement | Priority | Description |
|---|---|---|---|
| ONB-20 | Settings shall include: Account (email, plan), Connections (link to Health Center), Notifications preferences, Appearance, Data Export, Privacy Policy, Terms of Service, App version. | Must | Standard settings surface. |
| ONB-21 | The system shall allow the user to manage notification preferences for connection health alerts and delivery reminders independently. | Should | Granular control. |
| ONB-22 | The system shall provide a Data Export action that exports connected records and receipts as JSON/CSV. | Must | Portability per SUB principles. |
| ONB-23 | The system shall not gate export behind subscription tier. | Must | Trust principle from FRS-14-v2. |

### 4.4 Connection Health Center

| ID | Requirement | Priority | Description |
|---|---|---|---|
| ONB-30 | The system shall provide a dedicated Connection Health Center screen listing every connected account with its current health state, last sync timestamp, and number of affected records. | Must | Core trust surface per CNF-30–34. |
| ONB-31 | Each connection row shall offer a context-appropriate primary action: Refresh Now (healthy/stale), Reconnect (needs reauth), Retry (error), Connect Again (disconnected). | Must | One-tap recovery per CNF-34. |
| ONB-32 | Tapping an unhealthy connection shall navigate to a detail view showing: error category in plain language, which linked records are affected, and recovery instructions. | Must | Impact visibility. |
| ONB-33 | The Health Center shall be accessible from both the main navigation and contextual banners on search and record screens. | Must | Discoverability. |
| ONB-34 | After successful reconnection from the Health Center, the system shall trigger verification sync and clear stale status only after confirmed success. | Must | Per OFS-04. |
| ONB-35 | The Health Center shall display connection capabilities granted per provider in readable terms (e.g., "Search your Drive," "Read event titles"). | Should | Transparency per CNF-22. |

### 4.5 Account Deletion & Data Cleanup

| ID | Requirement | Priority | Description |
|---|---|---|---|
| ONB-40 | Deleting the account shall revoke all provider tokens, delete the normalized index, delete all connected records and receipts server-side, and clear local encrypted storage. | Must | Complete cleanup. |
| ONB-41 | The system shall confirm intent with a typed confirmation ("DELETE") before executing account deletion. | Must | Prevent accidental loss. |
| ONB-42 | The system shall provide a deletion receipt confirming when all backend data was removed. | Should | Audit trail per SPC-10. |

## 5. MVP Boundaries

### Included

- Supabase Auth account creation and sign-in.
- Connection setup flow with consent screens.
- Connection Health Center with per-connection actions.
- Settings surface with account, connections, export, and preferences.
- Account deletion with full data cleanup.

### Excluded

- Multi-workspace management (Phase 2).
- Team/member management (Phase 3).
- Custom domain or white-label auth.
- Social sign-in beyond Google (Apple Sign-In deferred unless store requirement).

## 6. Acceptance Criteria Summary

| Scenario | Acceptance Criteria |
|---|---|
| New user signup | User creates account, sees connection setup, can skip and use locally. |
| Connect Google Drive | User taps Drive, sees permission explanation, completes OAuth, sees Healthy status. |
| Token expires | Health Center shows "Needs Reauthorization" on Drive row with 4 affected records; tap Reconnect completes flow. |
| Export data | User taps Export in Settings; JSON file downloads without paywall. |
| Delete account | User types DELETE, confirms; tokens revoked; index cleared; deletion receipt shown. |

## 7. Change Log

| Version | Date | Summary |
|---|---|---|
| 2.0 | 2026-08-23 | Created v2 delta for account-based onboarding, connection setup, Health Center, and account deletion. |
