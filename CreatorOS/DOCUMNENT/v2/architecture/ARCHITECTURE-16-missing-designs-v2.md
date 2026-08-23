# Architecture Document — v2 Missing Designs

**Version:** 1.0
**Date:** 2026-08-23

## 1. Initial Backfill

- First sync of a large Drive must be scoped to selected folders, paginated, and quota-aware.
- User sees progress and partial availability.
- Backfill job is provider-isolated, cancellable, resumable.

## 2. Multi-Device Coordination

- Local changes on two devices reconcile via backend sync using connected record ID and updated_at.
- Receipts from both devices sync idempotently.
- Conflicts in connected record fields use last-write-wins with receipt audit.

## 3. Shared Delivery View

- Public link with expiry and revoke action.
- Displays only delivery metadata, never internal notes.
- Hosted by CreatorOS backend with no client account required.

## 4. Connector Data Deletion

- Covered by NFR-05-v2 SPC-09/SPC-10.

## 5. OAuth Unverified-App UX

- If app is unverified or pending CASA, show a clear interstitial before Google OAuth and explain the reduced capability.
- Do not proceed with restricted Drive scope in testing mode for non-trusted users.

## 6. Accessibility for v2 Surfaces

- Create `v2/requirements/non-functional/NFR-06-accessibility-v2.md` with:

# NFR-06 v2: Accessibility Additions

## New Requirements

| ID | Requirement | Priority | Description |
|---|---|---|---|
| ACC-01 | Connector health states | Must | All connector health states shall be announced by VoiceOver/TalkBack with text labels, not color alone. |
| ACC-02 | OAuth flow accessibility | Must | OAuth consent and connection screens shall support screen readers, large text, and reduced motion. |
| ACC-03 | Receipt list accessibility | Must | Receipts shall be navigable by screen reader and provide clear action labels. |
| ACC-04 | Shared delivery view accessibility | Should | The shared delivery view shall meet WCAG 2.2 AA for public web content. |
