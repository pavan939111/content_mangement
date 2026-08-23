# Technical Architecture Document — ARCHITECTURE-08 v2: Observability

**Product:** CreatorOS v2  
**Version:** 2.0  
**Status:** Draft for Validation  
**Date:** 2026-08-23  
**Reference to v1:** ../../../docs/architecture/ARCHITECTURE-08-observability.md

## 1. Purpose

This document defines **v2 observability** for connector operations.

The v1 logging, crash reporting, metrics, dashboards, and privacy controls remain authoritative.

## 2. New Connector Metrics

| Metric | Purpose |
|---|---|
| Action success rate by provider | Detect provider issues |
| Job latency p50/p95 | Performance |
| Retry count | Instability |
| DLQ depth | Blocked work |
| Rate-limit hits | Quota pressure |
| Webhook processing lag | Ingestion health |
| OAuth refresh failures | Trust |

## 3. Health Transition Events

Track and alert on:
- Connection state changes
- Reauthorization events
- Provider failure spikes
- Auth revocation waves

## 4. Privacy-Safe Logging

- No user content, provider tokens, full URLs with identifiers, or external source names.
- Operation IDs correlate mobile and backend events.
- Error categories normalized.

## 5. Dashboards

- Provider health dashboard
- Connector job queue dashboard
- Search performance dashboard
- User action receipt health

## 6. Reference to v1 Stable Observability

- Sentry + MetricKit + Android Vitals: v1 ARCH-08
- Local logging and telemetry: v1 ARCH-08
- Privacy denylist: v1 ARCH-08

## 7. Change Log

| Version | Date | Summary |
|---|---|---|
| 2.0 | 2026-08-23 | Added connector observability. |
