# Functional Requirements — CreatorOS v2

## Module Status

| v1 Module | v2 Document | Status |
|---|---|---|
| FRS-01 Core Content Record | FRS-01-connected-content-record-v2.md | Superseded — core object changed to `connected_record` |
| FRS-02 Idea Capture | FRS-02-idea-capture-v2.md | Remains valid with reinterpretation — offline capture retained; promotion to connected_record added |
| FRS-03 Asset Library & Search | FRS-03-cross-tool-search-v2.md | Superseded — cross-tool search replaces asset-library search; local FTS retained |
| FRS-04 Repurposing Clip Library | FRS-04-repurposing-clip-library-v2.md | Remains valid but not central to v2 MVP |
| FRS-05 Calendar & Readiness | FRS-05-calendar-readiness-v2.md | Partially superseded — Next Action replaces readiness; Calendar connector retained |
| FRS-06 Publishing Handoff | FRS-06-handoff-action-receipts-v2.md | Superseded — handoff and receipts replace publishing handoff |
| FRS-07 Integrations & Storage | FRS-07-connector-framework-v2.md | Superseded — connector framework replaces integrations |
| FRS-08 Offline & Sync | FRS-08-offline-sync-v2.md | Partially superseded — cloud integration mandatory; local-only statement invalid |
| FRS-09 Onboarding/Settings/Account | FRS-09-onboarding-settings-account-v2.md | Superseded — account-based onboarding, connection setup, health center |
| FRS-10 Script Editor | FRS-10-script-text-editor-v2.md | Remains valid — operates on connected_record |
| FRS-11 Media Preview | FRS-11-media-preview-playback-v2.md | Remains valid — external source references only |
| FRS-12 Notifications/Reminders/Trash | FRS-12-notifications-reminders-trash-v2.md | Remains valid — connected_record + health notifications added |
| FRS-13 Import/Export/Backup | FRS-13-import-export-backup-restore-v2.md | Remains valid — includes connected records and receipts |
| FRS-14 Subscription | FRS-14-subscription-monetization-v2.md | Superseded — pricing and limits changed |
| FRS-15 Analytics | Not applicable | Deferred Phase 2 — out of MVP scope |
| FRS-16 Collaboration | Not applicable | Deferred Phase 3 — out of MVP scope |

## Canonical Vocabulary

- Core object: `connected_record`
- Health states: `authorizing`, `healthy`, `syncing`, `degraded`, `stale`, `reauth_required`, `revoked`, `error`, `disconnected`
- Receipt outcomes: `verified`, `user_confirmed`, `pending`, `failed`
