# Technical Architecture Document — ARCHITECTURE-08: Observability

**Product:** CreatorOS  
**Version:** 1.0  
**Status:** Draft for Review  
**Last Updated:** 2026-08-22  
**Related Documents:** ARCHITECTURE-00 Overview, DEC-012, NFR-04 Battery & Device Resources, NFR-11 Supportability  

---

## 1. Purpose

This document defines the **observability and monitoring architecture** for CreatorOS. 

For a local-first application, traditional server-side observability (where every action is logged to the cloud) directly conflicts with user privacy and offline capabilities. Therefore, observability in CreatorOS is strictly segmented into:

1. **Crash & Error Reporting:** Critical for app stability.
2. **Native Performance Metrics:** Critical for maintaining battery and thermal limits.
3. **Local Diagnostics:** User-controlled logs for support.
4. **Usage Analytics (Phase 2):** Opt-in telemetry for product improvement.

---

## 2. Architecture Decisions

### 2.1 DEC-012: Observability Stack

**Decision:** 
- Use **Sentry** for crash reporting and non-fatal error tracking across iOS, Android, and the shared KMP core.
- Use **Apple MetricKit** (iOS) and **Android Vitals / Firebase Performance** (Android) for native performance monitoring.

**Rationale:** 
Sentry provides excellent de-obfuscation and symbolication for Kotlin Multiplatform alongside native Swift/Kotlin. MetricKit and Android Vitals are selected for performance monitoring because they read metrics directly from the OS with zero SDK overhead, which is essential to meet NFR-04 (no background battery drain).

---

## 3. Crash & Error Reporting (Sentry)

### 3.1 Scope

- **Fatal Crashes:** Uncaught exceptions, native crashes (C++ / SQLite level), Out of Memory (OOM) kills.
- **Non-Fatal Errors:** Handled but unexpected errors, such as:
  - FTS index corruption
  - Sync queue stuck / repeated failures
  - Video decoder initialization failures

### 3.2 Privacy & Data Sanitization

To ensure CreatorOS remains a trusted, private tool:
- **No PII:** Emails, names, and IP addresses are stripped at the edge (Sentry server-side scrubbing).
- **No Content:** Content titles, script text, clip notes, and asset filenames are explicitly redacted from breadcrumbs and stack traces.
- **Anonymized IDs:** The SDK uses a random installation UUID, not a user ID (unless explicitly opted-in for a support ticket).

### 3.3 Breadcrumbs

Breadcrumbs provide context leading up to a crash. They are limited to system-level events:
- UI View transitions (e.g., `Navigated to IdeaInbox`)
- Network connectivity changes (`Network: offline`)
- Sync state transitions (`Sync: started`)
- Low memory warnings

---

## 4. Performance Monitoring

Given the heavy use of media, FTS5, and background sync, performance tracking is vital.

### 4.1 iOS (MetricKit)

CreatorOS uses `MXMetricManager` to receive daily aggregated performance reports directly from iOS.
- **Key Metrics Tracked:**
  - `applicationLaunchMetrics` (Cold and warm start times)
  - `applicationResponsivenessMetrics` (Hang rate > 250ms)
  - `memoryMetrics` (Peak memory, background memory)
  - `cellularConditionMetrics` / `networkTransferMetrics`
- **Delivery:** These payloads are tiny JSON files sent to the lightweight backend (or Sentry) for aggregation.

### 4.2 Android (Android Vitals / Firebase Perf)

- **Key Metrics Tracked:**
  - App Startup Time (target: < 2s cold)
  - Slow rendering / frozen frames (Jank)
  - Application Not Responding (ANR) rates
- **Delivery:** Monitored via the Play Console. Firebase Performance is evaluated but must be configured to never send data while on cellular data to respect bandwidth.

---

## 5. Local Diagnostics & Logging

Because telemetry is minimized, local diagnostics are the primary tool for customer support.

### 5.1 Local Log Store

- The app writes operational logs (e.g., sync steps, FTS query durations, database migrations) to a local rolling file.
- **Implementation:** CocoaLumberjack (iOS) / Timber (Android) or a KMP logging equivalent (e.g., Kermit).
- **Retention:** Max 5 MB or 3 days of logs.

### 5.2 User-Initiated Export

- Users can go to **Settings > Support > Export Diagnostics**.
- The app generates a ZIP file containing:
  - The local log files.
  - An anonymized snapshot of `publishing_state` and `sync_operation` metadata (no actual content).
  - Device info (OS version, app version, available storage).
- The user can email this ZIP or attach it to a support ticket.

---

## 6. Usage Analytics (Phase 2)

- **MVP:** No behavioral analytics (e.g., Mixpanel, Amplitude, Google Analytics) are included. The focus is entirely on stability and privacy.
- **Phase 2:** Opt-in, anonymized analytics to answer questions like:
  - Which capture mode (text, voice, photo) is most popular?
  - What is the drop-off rate in the onboarding flow?
- If implemented, analytics will be fully anonymized, heavily batched, and easily disabled in Settings.

---

## 7. Acceptance Criteria

- Crash reporting (Sentry) initializes successfully on both iOS and Android.
- Simulated crashes are reported with correct KMP and native stack traces.
- Content text, tags, and titles do not appear in any Sentry payload.
- Local logs rotate at 5 MB and are successfully bundled via the "Export Diagnostics" UI.
- MetricKit payloads are successfully received and parsed.
