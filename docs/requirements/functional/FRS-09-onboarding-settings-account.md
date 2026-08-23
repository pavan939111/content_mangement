# Functional Requirements Specification — Module 09  
**Module:** Onboarding, Settings & Account Management  
**Version:** 1.1  
**Status:** Draft for Review  
**Related Vision / PRD:** CreatorOS  
**Priority:** Must Have (Onboarding & Settings) / Should Have (Account for cloud backup/sync)  

---

## 1. Purpose

The Onboarding, Settings & Account Management module defines how users first experience CreatorOS, how they configure the app to fit their workflow, and how they manage their optional account, cloud backup, and connected services.

The module must solve the validated problems:

> **Creators hesitate to adopt new tools if setup is complex, permissions are overwhelming, or they fear data lock-in.**

> **Creators need a clear, simple first-run experience and central control over storage, notifications, privacy, and account data.**

The module ensures:

- First-run experience is fast, non-blocking, and permission-light.
- Settings are organized and accessible.
- Account creation is optional for local use but available for cloud backup and cross-device sync.
- Users can export data, disconnect services, and delete their account without friction.
- Privacy and trust are maintained through transparent controls.

---

## 2. Scope

This module covers:

- First-run onboarding flow
- Permission requests and rationale
- Sample data / starter content (optional)
- Main Settings screen and subsections
- Notification preferences
- Storage and cache management
- Privacy and data controls
- Appearance and display options
- Account creation, login, logout
- Cloud backup enable/disable
- Account deletion and data export access
- In-app support and diagnostics

**Out of scope:** Subscription/paywall (FRS-14 if needed), actual cloud backup implementation, advanced account security (2FA), social account connection UI (covered in FRS-06/07).

---

## 3. Key User Stories

### US-01 Complete First-Run Setup Without Friction

**As a** new creator,  
**I want to** start using the app quickly without creating an account or granting many permissions upfront,  
**so that** I can try it before committing.

### US-02 Understand Why a Permission Is Needed

**As a** creator,  
**I want to** see a clear explanation before granting camera, microphone, photo, or file access,  
**so that** I feel in control of my data.

### US-03 Customize Settings to My Workflow

**As a** creator,  
**I want to** adjust capture defaults, notification preferences, storage limits, and appearance,  
**so that** the app fits how I work.

### US-04 Create an Account for Cloud Backup

**As a** creator,  
**I want to** optionally create an account and enable encrypted cloud backup,  
**so that** my metadata is safe across devices.

### US-05 Disconnect Services and Delete My Account

**As a** creator,  
**I want to** disconnect cloud storage, platform accounts, or delete my entire account from settings,  
**so that** I maintain full control over my data.

---

## 4. Functional Requirements

**Note:** Cloud backup enables cross-device restore via a recovery passphrase. The user must save this passphrase. Loss of passphrase means backup cannot be restored.

### 4.1 First-Run Onboarding

| ID | Requirement | Priority | Description |
|---|---|---|---|
| ON-01 | The system shall present a brief welcome screen with the product name, tagline, and a single "Get Started" action. | Must | Immediate clarity. |
| ON-02 | The system shall not require account creation or sign-in before the user can create local content. | Must | Local-first principle. |
| ON-03 | The system shall offer an optional "Explore a sample project" during onboarding to demonstrate key features. | Should | Helps user understand value. |
| ON-04 | The system shall not request any permissions during onboarding except those required for basic app function (none). Permissions shall be requested contextually when the user first uses a feature. | Must | Avoid permission fatigue. |
| ON-05 | The system shall provide a brief, dismissible explanation of how local-first storage works: "Your content stays on this device by default." | Must | Build trust. |
| ON-06 | The system shall allow skipping all onboarding screens and going directly to the main app. | Must | No forced flow. |
| ON-07 | The system shall preserve onboarding state so the user does not see the full onboarding again after first completion. | Must | Seamless return. |
| ON-08 | The system shall offer to set up a default workflow during onboarding: choose primary platforms (TikTok, Instagram, YouTube Shorts), content pillars, and capture defaults. | Should | Personalizes initial experience. |
| ON-09 | The system shall include a "Restore from backup" option during onboarding if a local or cloud backup is available. | Should | Recovery path. |

---

### 4.2 Permission Requests

| ID | Requirement | Priority | Description |
|---|---|---|---|
| ON-10 | Camera permission shall be requested only when the user first attempts to capture a photo or video from the camera. | Must | Contextual. |
| ON-11 | Microphone permission shall be requested only when the user first attempts voice capture. | Must | Contextual. |
| ON-12 | Photo library / Media access permission shall be requested only when the user attempts to import from the photo library or index local media. | Must | Contextual. |
| ON-13 | File/folder access permission shall be requested only when the user selects a folder to index. | Must | Contextual. |
| ON-14 | Each permission request shall be preceded by an in-app rationale screen explaining why the permission is needed and what will happen if denied. | Must | Privacy expectation. |
| ON-15 | If a permission is denied, the system shall not repeatedly prompt the user. It shall provide a settings link where the user can enable it later. | Must | Good UX. |
| ON-16 | The system shall handle partially denied permissions (e.g., limited photo access on iOS) gracefully, showing what is available and how to change it. | Must | Platform-specific. |

---

### 4.3 Main Settings Screen

| ID | Requirement | Priority | Description |
|---|---|---|---|
| SET-01 | The system shall provide a Settings screen accessible from the main navigation. | Must | Standard. |
| SET-02 | Settings shall be organized into logical sections: Account, Content & Capture, Notifications, Storage & Sync, Privacy, Appearance, Support, About. | Must | Findability. |
| SET-03 | Each section shall display a summary of current status (e.g., "2 connected accounts", "Offline mode", "Cache: 450 MB"). | Should | At-a-glance. |
| SET-04 | Settings changes shall be saved locally and applied immediately without app restart. | Must | Usability. |
| SET-05 | Settings screen shall work fully offline. | Must | Local-first. |
| SET-06 | The system shall provide search within Settings (optional for MVP). | Phase 2 | Large settings sets benefit. |

---

### 4.4 Content & Capture Settings

| ID | Requirement | Priority | Description |
|---|---|---|---|
| SET-10 | The user shall be able to set default capture destination: Idea Inbox, specific Content Item, or Asset Library. | Should | Personalization. |
| SET-11 | The user shall be able to set default content pillars and target platforms for new Content Items. | Should | Reduces repeat entry. |
| SET-12 | The user shall be able to set default workflow stages order and visibility. | Should | FRS-01 flexibility. |
| SET-13 | The user shall be able to enable/disable automatic voice transcription and choose local-only or cloud transcription. | Must | Privacy and cost. |
| SET-14 | The user shall be able to set default script text size and style. | Should | Accessibility and preference. |
| SET-15 | The user shall be able to set default clip marker quality note and suggested platform. | Should | Repurposing speed. |

---

### 4.5 Notification Settings

| ID | Requirement | Priority | Description |
|---|---|---|---|
| SET-20 | The system shall allow toggling notifications for: idea reminders, content deadlines, at-risk warnings, publishing reminders, sync conflicts, and account/security alerts. | Must | Control. |
| SET-21 | Each notification category shall have its own enable/disable switch. | Must | Granular. |
| SET-22 | The user shall be able to set quiet hours for non-critical notifications. | Should | Reduce fatigue. |
| SET-23 | The system shall respect platform notification permissions and not send notifications if the user has disabled them at OS level. | Must | Platform. |
| SET-24 | The system shall provide a preview of what each notification type looks like. | Should | Clarity. |
| SET-25 | The system shall not send marketing notifications by default. | Must | Trust. |

---

### 4.6 Storage & Sync Settings

| ID | Requirement | Priority | Description |
|---|---|---|---|
| SET-30 | The user shall be able to see current storage usage: app size, metadata DB, thumbnails, proxies, temp files, logs. | Must | Transparency. |
| SET-31 | The user shall be able to set thumbnail cache quota: default 512 MB or 5% free storage. | Must | Manage storage. |
| SET-32 | The user shall be able to set proxy cache quota: default disabled; 1–2 GB when enabled. | Must | Manage storage. |
| SET-33 | The user shall be able to clear thumbnail cache, proxy cache, and temp files independently without deleting metadata/content. | Must | Data control. |
| SET-34 | The user shall be able to enable/disable cloud backup and choose backup frequency (manual, daily, weekly). | Must | Sync control. |
| SET-35 | The user shall be able to pause/resume sync for individual connected services. | Should | Control. |
| SET-36 | The user shall be able to set sync network constraints: Wi-Fi only, Wi-Fi + mobile data. | Must | Bandwidth. |
| SET-37 | The user shall be able to select which projects or content types are included/excluded from cloud backup. | Should | Privacy. |
| SET-38 | The system shall display last successful backup time and pending sync count. | Must | Trust. |

---

### 4.7 Privacy Settings

| ID | Requirement | Priority | Description |
|---|---|---|---|
| SET-40 | The system shall provide a Privacy section listing all connected services, their scopes, and last access time. | Must | Transparency. |
| SET-41 | The user shall be able to disconnect any connected service or platform account from this section. | Must | Control. |
| SET-42 | The system shall provide a "Local-only mode" toggle that disables all network access except explicit user-initiated actions like export/share. | Should | Privacy. |
| SET-43 | The user shall be able to enable/disable optional cloud features: cloud transcription, AI tagging, diagnostics. | Must | Consent. |
| SET-44 | The system shall provide a privacy policy link and explain what data is processed locally vs cloud. | Must | Compliance. |
| SET-45 | The system shall allow exporting all personal data from this section. | Must | Portability. |
| SET-46 | The user shall be able to delete all local data from this section with confirmation. | Must | Control. |

---

### 4.8 Appearance & Display Settings

| ID | Requirement | Priority | Description |
|---|---|---|---|
| SET-50 | The system shall support Light, Dark, and System appearance modes. | Must | Accessibility. |
| SET-51 | The user shall be able to set default calendar view (month, week, list) and board/list default. | Should | Preference. |
| SET-52 | The user shall be able to set default script text size, font, and line spacing. | Should | Readability. |
| SET-53 | The system shall support dynamic type / font scaling from OS settings. | Must | Accessibility. |
| SET-54 | The system shall respect Reduce Motion and other OS accessibility settings automatically. | Must | Accessibility. |

---

### 4.9 Account Management

| ID | Requirement | Priority | Description |
|---|---|---|---|
| ACC-01 | Account creation is optional. The user can use all local features without an account. | Must | Local-first. |
| ACC-02 | The user shall be able to create an account using email/password or a supported third-party sign-in (Apple/Google) from the Settings > Account section. | Should | Cloud backup. |
| ACC-03 | The system shall clearly explain why an account is useful: encrypted cloud backup, cross-device sync, restore. | Must | Rationale. |
| ACC-04 | The system shall allow the user to log out without losing local data. | Must | Control. |
| ACC-05 | The system shall allow the user to change their email/password and manage security settings. | Should | Account security. |
| ACC-06 | The system shall allow the user to delete their account from within the app. | Must | Platform requirement. |
| ACC-07 | Before account deletion, the system shall warn that cloud backup will be deleted, connected services will be revoked, and local data may remain unless separately cleared. | Must | Clarity. |
| ACC-08 | The system shall provide a separate "Delete Cloud Backup" action that removes server-side backup without deleting the account. | Must | Data control. |
| ACC-09 | The system shall provide "Disconnect All Services" action that revokes all OAuth tokens and marks connections as disconnected. | Should | Quick security. |
| ACC-10 | The system shall allow exporting account data (metadata, preferences, backup manifest) in machine-readable format. | Must | Portability. |

---

### 4.10 Support & Diagnostics

| ID | Requirement | Priority | Description |
|---|---|---|---|
| SUP-01 | The system shall provide an in-app Help / Support section with FAQs and troubleshooting guides. | Should | Self-service. |
| SUP-02 | The system shall allow the user to export diagnostic logs (redacted) for support. | Should | Debugging. |
| SUP-03 | The system shall show app version, build number, and open-source licenses. | Must | Legal. |
| SUP-04 | The system shall provide a feedback option that does not collect personal data unless explicitly included by user. | Should | Improvement. |
| SUP-05 | The system shall include a "Check for Updates" link to app store (platform-specific). | Should | Convenience. |

---

### 4.99 Missing MVP Requirements (Completeness Sweep)

No additional requirements needed after completeness sweep.

## 5. Data Model Considerations (Logical)

The Settings & Account module may require:

- **AppSettings** (key-value with types)
- **NotificationPreference**
- **StorageQuotaConfig**
- **SyncServiceConfig**
- **AccountProfile**
- **CloudBackupConfig**
- **OAuthTokenMetadata** (existing)
- **DiagnosticLog**

These will be finalized during architecture design.

---

## 6. Acceptance Criteria Summary

| User Story | Acceptance Criteria |
|---|---|
| US-01 | User can complete onboarding in under 1 minute without creating an account or granting permissions. |
| US-02 | When camera access is first requested, a rationale screen is shown; denying does not block other features. |
| US-03 | User can change default capture destination, notification toggles, storage quotas, and appearance from Settings. |
| US-04 | User can create an account, enable encrypted cloud backup, and see last backup time. |
| US-05 | User can disconnect services and delete account from Settings; account deletion includes cloud backup deletion warning and confirmation. |

---

## 7. Dependencies

- **FRS-01 Core Content Record** — default workflow stages and content types.
- **FRS-02 Idea Capture** — default capture settings.
- **FRS-03 Asset Library** — storage quota settings.
- **FRS-07 Integrations** — connected services and OAuth.
- **FRS-08 Offline & Sync** — sync settings and backup controls.
- **NFR-05 Security & Privacy** — account deletion, export, privacy settings.

---

### 4.x Missing MVP Requirements (Corrected)

| ID | Requirement | Priority | Description |
|---|---|---|---|
| SET-M1 | App Lock / Biometric Gate | Should | The system shall support locking the app with device biometrics (Face ID, Touch ID) to protect sensitive content and file paths. |
| SET-M2 | Content Pillar Management | Must | The system shall support a content pillar management interface allowing users to create, rename, list, and delete content pillars. |
| ON-M1 | First-run source selection and initial index experience | Must | The system shall provide an explicit first-run experience for selecting storage sources and display clear progress/status during the initial large-scale file indexing. |

## 8. Open Questions / Decisions Needed

1. Should onboarding include a full interactive tutorial or a simple 3-step static guide?  
   *Recommendation: Static 2–3 screens with skip option; interactive tutorial later if needed.*

2. Should account creation be via email or Apple/Google sign-in in MVP?  
   *Recommendation: Apple Sign-In and Google Sign-In first; email/password can be Phase 2.*

3. Should the Settings screen include search in MVP?  
   *Recommendation: No; keep MVP simple. Add in Phase 2 if settings grow.*

4. Should "Local-only mode" be a hard network kill switch or just disable background sync?  
   *Recommendation: Hard kill switch that disables all network activity except user-initiated share/export, with clear indicator.*

5. Should cloud backup be included in MVP or Phase 2?  
   *Recommendation: Cloud backup is Should for MVP; local export and manual backup are Must. Cloud can be Phase 2 if timeline is tight.*

---


## 99. Change Log

| Version | Date | Summary |
|---|---|---|
| 1.1 | 2026-08-22 | Completeness sweep: added missing requirements. |
