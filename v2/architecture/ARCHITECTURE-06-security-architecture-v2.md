# Technical Architecture Document — ARCHITECTURE-06 v2: Security Architecture

**Product:** CreatorOS v2  
**Version:** 2.0  
**Status:** Draft for Validation  
**Date:** 2026-08-23  
**Reference to v1:** ../../../docs/architecture/ARCHITECTURE-06-security-architecture.md

## 1. Purpose

This document defines **v2 security architecture** for multiple OAuth-connected tools.

The v1 local encryption, threat model, and secure storage remain authoritative. This document adds connector-specific security.

## 2. Connector OAuth Security

- OAuth 2.0 Authorization Code + PKCE for all API connectors.
- Minimum necessary scopes per provider.
- System browser authentication; no embedded WebView.
- Server-side token vault for backend-managed actions.
- Device Keychain/Keystore for direct mobile actions.
- Immediate token revocation on disconnect.

## 3. Permission Model

- Read-only default for external sources.
- Write actions require explicit per-action confirmation.
- Plain-language capability explanation before OAuth.

## 4. Data Protection

- Receipts and external source links encrypted at rest.
- Provider tokens never in logs, telemetry, or crash reports.
- The backend operation log stores no user content.
- Action receipts are stored in a separate encrypted receipt store and may contain user-confirmed evidence or target object identifiers.
- The normalized index stores external titles and URLs, encrypted at rest, with retention and deletion rules defined in NFR-05-v2 SPC-08 through SPC-11.

## 5. Reference to v1 Stable Security

- Local database encryption: v1 ARCH-06 §4
- Key management: v1 ARCH-06 §4.2
- Token lifecycle: v1 ARCH-06 §5
- Threat model: v1 ARCH-06 §3

## 6. Change Log

| Version | Date | Summary |
|---|---|---|
| 2.0 | 2026-08-23 | Added multi-connector OAuth and permission security. |
