# Non-Functional Requirements — NFR-11 v2: Maintainability, Observability & Compliance

**Product:** CreatorOS v2  
**Version:** 2.0  
**Status:** Draft for Validation  
**Date:** 2026-08-23  
**Reference to v1:** ../../../docs/requirements/non-functional/NFR-11-maintainability-observability-compliance.md

## 1. Purpose

This document defines v2-specific observability and compliance requirements for connector operations.

The v1 code quality, logging, and platform policy requirements remain valid.

## 2. New v2 Requirements

| ID | Requirement | Priority | Description |
|---|---|---|---|
| MOC-01 | Connector metrics | Must | The system shall collect per-provider action success rate, latency, retry count, and connection health. |
| MOC-02 | Privacy-safe logs | Must | Logs shall not contain provider tokens, user content, external source names, or full URLs with identifiers. |
| MOC-03 | Connector alerting | Must | Provider failure spikes, auth revocation waves, and DLQ depth shall trigger alerts. |
| MOC-04 | Connector compliance | Must | OAuth scopes and data handling shall comply with provider terms and privacy policies. |
| MOC-05 | Audit logs | Should | Connector action metadata shall be auditable without exposing content. |

## 3. References

- Code quality and testing: v1 NFR-11 §3
- Telemetry privacy: v1 NFR-11 §4
- App store compliance: v1 NFR-11 §5

## 4. Acceptance Criteria

- Provider metrics available in dashboard.
- No sensitive data in logs.
- Alerts configured for connector failure conditions.
- OAuth scopes disclosed and compliant.

## 5. Change Log

| Version | Date | Summary |
|---|---|---|
| 2.0 | 2026-08-23 | Added connector observability and compliance. |
