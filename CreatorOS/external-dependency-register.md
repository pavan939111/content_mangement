# External Dependency Register — CreatorOS v2

**Version:** 1.0
**Date:** 2026-08-23
**Status:** Active
**Purpose:** Track external dependencies that gate MVP launch, with owners and escalation paths.

---

| Dependency | Purpose | Owner Role | Escalation Path | Required By Date | Status |
|---|---|---|---|---|---|
| Google OAuth app verification | Approve restricted Drive scopes (`drive.metadata.readonly`) for production use | Product Lead + Security Lead | Google Cloud Console support → assigned TAM if available; escalate to Product Lead if >4 weeks | Before production launch (Phase 6, Week 12) | ☐ Not Started |
| Google CASA annual security assessment | Mandatory third-party assessment for apps using restricted Google scopes | Security Lead | CASA-assessor vendor → Google Cloud security team; escalate to Engineering Lead if blocking launch | Before production launch with restricted scopes; interim `drive.file` scope acceptable for beta (see DEC-039) | ☐ Not Started |
| Notion app review / integration approval | Public integration listing approval enabling OAuth for all users | Backend Architect | Notion Developer support forum → partner escalation via Product Lead | Before public beta (Week 10) | ☐ Not Started |
| RevenueCat account & product configuration | Subscription management, receipt validation, entitlement webhooks | Product Lead (setup) + Backend Architect (API keys) | RevenueCat support dashboard → CSM if on paid plan | Phase 3 start (Week 4) | ☐ Not Started |
| Supabase production project | Auth, Postgres database with RLS, Edge Functions for webhooks | Backend Architect | Supabase support → team plan required for SLA; escalate to Engineering Lead for provisioning delay | Phase 2 start (Week 2) | ☐ Not Started |
| Managed Redis + BullMQ infrastructure | Job queue delivery for connector worker | Platform Engineer | Infrastructure provider (e.g., Upstash, Redis Cloud, or self-managed on cloud VM) → DevOps lead | Phase 3 start (Week 4) | ☐ Not Started |
| Cloud KMS or equivalent key management | Envelope encryption for provider token vault | Security Lead + Backend Architect | Cloud provider KMS (GCP/AWS/Azure); key rotation policy documented in TDD-07 | Phase 3 start (Week 4) | ☐ Not Started |
| Apple App Store developer account | iOS distribution | Product Lead (account holder) | Apple Developer support → DUNS/legal entity resolution if needed | RC submission (Week 12) | ☐ Not Started |
| Google Play developer account | Android distribution | Product Lead (account holder) | Google Play Console support; new personal accounts have 20-tester requirement for closed testing | RC submission (Week 12) | ☐ Not Started |

## Review Cadence

- **Weekly during Phases 1–3** (Weeks 1–8): check status of Google verification/CASA/Notion review as these have longest lead times.
- **Before each phase exit gate**: confirm no dependency has slipped past its Required By Date.
- **Any change to Required By Date**: update this register and flag impact on `mvp-milestone-plan.md`.

## Change Log

| Version | Date | Summary |
|---|---|---|
| 1.0 | 2026-08-23 | Created external dependency register covering OAuth, CASA, Notion review, RevenueCat, Supabase, Redis, KMS, and store accounts. |
