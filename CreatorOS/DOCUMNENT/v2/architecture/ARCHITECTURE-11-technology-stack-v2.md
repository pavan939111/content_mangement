# Technical Architecture Document — ARCHITECTURE-11 v2: Technology Stack

**Product:** CreatorOS v2  
**Version:** 2.0  
**Status:** Draft for Validation  
**Date:** 2026-08-23  
**Reference to v1:** ../../../docs/architecture/ARCHITECTURE-11-technology-stack.md

## 1. Purpose

This document defines **v2 technology stack additions** for the backend connector service and external integrations.

The v1 mobile stack and native development approach remain authoritative.

## 2. Mobile Stack

Reference v1:

- iOS: SwiftUI, GRDB.swift + SQLCipher + FTS5
- Android: Jetpack Compose, Room + SQLCipher + FTS5
- Shared: KMP shared core
- Secure storage: iOS Keychain / Android Keystore
- Subscription: RevenueCat
- Observability: Sentry + MetricKit + Android Vitals

## 3. Backend Connector Service Stack

| Component | Recommended |
|---|---|
| API Gateway | Supabase Edge Functions or Node.js/TypeScript on managed container |
| Connector Gateway | TypeScript/Node.js |
| Job Queue | Redis + BullMQ or equivalent managed queue |
| Retry Worker | Node.js worker or serverless job runner |
| Rate-Limit Scheduler | Redis token buckets |
| Token Vault | Cloud KMS + encrypted database |
| Webhook Ingestion | Signed endpoints via Edge Functions/API |
| Normalized Index | PostgreSQL or OpenSearch |
| Operation Log | PostgreSQL append-only table |

## 4. Provider SDKs

- Google Drive/Docs/Calendar: Google API client libraries via OAuth
- Notion: Notion API via REST
- Canva: handoff only in MVP; no SDK
- CapCut/Apple Notes: handoff only via share sheet/deep link

## 5. App Size and Cost Impact

- No heavy provider SDKs on mobile.
- Backend provider SDKs isolated from mobile binary.
- Connector API costs tracked via NFR-12 v2.

## 6. Reference to v1 Technology Stack

- Mobile technologies, dependencies, licenses: v1 ARCH-11

## 7. Change Log

| Version | Date | Summary |
|---|---|---|
| 2.0 | 2026-08-23 | Added backend connector service stack and provider SDKs. |
