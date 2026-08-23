# Non-Functional Requirements — NFR-12: Quality, Cost, and Capacity

**Product:** CreatorOS  
**Version:** 1.0  
**Status:** Draft for Review  
**Related Documents:** NFR-01 Performance, NFR-03 Storage, FRS-02 Idea Capture, FRS-03 Asset Library, FRS-14 Subscription  

---

## 1. Purpose

This document defines non-functional requirements for areas that were identified as missing in the verification report:

1. Search quality
2. Transcription quality, latency, and cost
3. Indexing correctness
4. Capacity beyond assets
5. Unit economics / cost per user
6. Data residency

These requirements ensure that CreatorOS meets user expectations for search relevance, transcription accuracy, indexing completeness, scalability, cost transparency, and compliance.

---

## 2. Search Quality

| ID | Requirement | Priority | Description |
|---|---|---|---|
| SQ-01 | Search relevance baseline | Must | For a 100k-record corpus, a 1–3 term FTS query shall return results using BM25 ranking, with recent and frequently used assets boosted by at least 1.2x. |
| SQ-02 | Precision@10 target | Should | For a representative evaluation set of 50 common creator queries, Precision@10 shall be at least 0.7 on average. |
| SQ-03 | Recall@10 target | Should | For the same evaluation set, Recall@10 shall be at least 0.8 on average. |
| SQ-04 | Zero-result behavior | Must | When a query yields no results, the system shall show a clear empty state with suggestions: check spelling, try broader terms, or browse recent assets. |
| SQ-05 | Typo tolerance | Should | For English queries, the system shall handle minor typos via fuzzy matching or phonetic suggestions where feasible. If not supported in MVP, the empty state must indicate this. |

---

## 3. Transcription Quality, Latency, and Cost

| ID | Requirement | Priority | Description |
|---|---|---|---|
| TQ-01 | Language scope | Must | MVP transcription supports English (US) only. Other languages are Phase 2. |
| TQ-02 | Word error rate | Should | Under quiet recording conditions, on-device transcription shall achieve a WER of ≤15%. The system shall log and report WER in aggregate for quality monitoring. |
| TQ-03 | Latency | Must | For a 1-minute voice note, transcription shall complete within 30 seconds of recording when the device is online and not under thermal/power constraints. If delayed, the UI shall show status. |
| TQ-04 | Audio length limit | Must | The system shall support transcription of voice notes up to 15 minutes. Longer recordings may be truncated or queued with user notification. |
| TQ-05 | Cost model | Must | On-device transcription is free and unmetered. Cloud transcription is metered: Free tier includes 5 cloud transcriptions per month; Pro includes unlimited cloud transcription. |
| TQ-06 | Failure handling | Must | If transcription fails (unsupported language, low confidence, no speech detected), the system shall preserve the original audio and allow manual retry or edit. |

---

## 4. Indexing Correctness

| ID | Requirement | Priority | Description |
|---|---|---|---|
| IC-01 | Completeness | Must | For a user-selected folder/drive with N supported files, the system shall successfully index metadata for at least 99% of non-corrupt, non-DRM-protected files. |
| IC-02 | Failure reporting | Must | Files that fail indexing shall be listed in a “Skipped files” report with reason (unsupported format, permission, corrupt, too large). |
| IC-03 | No silent drops | Must | The system shall not silently skip files during indexing. Every skipped file must be recorded. |
| IC-04 | Re-index behavior | Must | If a file changes (size, mtime, hash), the system shall re-index its metadata and refresh thumbnails/proxies as needed. |
| IC-05 | Consistency check | Should | The system shall support a manual “Verify index” action that checks database records against selected sources and reports missing, changed, or orphaned records. |

---

## 5. Capacity Beyond Assets

| ID | Requirement | Priority | Description |
|---|---|---|---|
| CAP-01 | Content Items | Should | The system shall support at least 10,000 Content Items without search or list performance degradation beyond NFR-01. |
| CAP-02 | Ideas | Should | The system shall support at least 50,000 Ideas without degradation. |
| CAP-03 | Clips | Should | The system shall support at least 20,000 Clips without degradation. |
| CAP-04 | Tags | Should | The system shall support at least 5,000 unique tags. |
| CAP-05 | Revisions | Should | The system shall support at least 20 revisions per script/caption for up to 10,000 text records. |
| CAP-06 | Sync outbox depth | Must | The sync outbox shall support at least 50,000 pending operations without affecting local save latency beyond NFR-02. |

---

## 6. Unit Economics / Cost Per User

| ID | Requirement | Priority | Description |
|---|---|---|---|
| UE-01 | Cost model documented | Must | Before enabling any paid cloud feature (cloud backup, cloud transcription, analytics), the expected cost per active user shall be documented, including provider costs, storage, bandwidth, and support. |
| UE-02 | Free tier margin | Must | The Free tier shall have a positive or near-zero marginal cost. Cloud features shall be metered or limited to avoid unpredictable expense. |
| UE-03 | Pro tier margin | Should | Pro tier pricing shall cover the projected cloud cost plus a gross margin of at least 50%. |
| UE-04 | Cost review cadence | Should | Unit costs shall be reviewed quarterly and adjusted in the product plan if costs exceed budget. |

---

## 7. Data Residency

| ID | Requirement | Priority | Description |
|---|---|---|---|
| DR-01 | Primary region | Must | For MVP, the selected backend (Supabase) region shall be explicitly chosen and documented. |
| DR-02 | Data location disclosure | Must | The privacy policy and settings shall state where cloud backup metadata and support data are stored. |
| DR-03 | Future multi-region | Phase 2 | The architecture shall support selecting additional data regions for enterprise/agency customers. |
| DR-04 | Compliance with local law | Should | If the user is in a jurisdiction with data residency requirements, the system shall not force them to use cloud features; local-only mode remains available. |

---

## 8. Acceptance Criteria

```text
Search quality
- Zero-result state includes suggestions.
- Precision@10 ≥0.7 and Recall@10 ≥0.8 on evaluation set.

Transcription
- English-only MVP.
- WER ≤15% in quiet conditions.
- Latency ≤30s for 1-minute note.
- Free tier: 5 cloud transcriptions/month; Pro unlimited.

Indexing
- 99% metadata completeness for supported files.
- Skipped files reported with reasons.
- No silent drops.

Capacity
- 10k Content Items, 50k Ideas, 20k Clips, 5k tags with no degradation.
- Outbox supports 50k pending operations.

Unit economics
- Cost per active user documented before cloud feature launch.
- Free tier near-zero marginal cost.

Data residency
- Primary region documented.
- Local-only mode always available.
```

---

## 9. Source References

- [SQLite FTS5](https://www.sqlite.org/fts5.html)  
- [Apple Speech Recognition](https://developer.apple.com/documentation/speech)  
- [Android SpeechRecognizer](https://developer.android.com/reference/android/speech/SpeechRecognizer)  
- [GDPR Data Residency](https://gdpr-info.eu/)  
- [CCPA](https://oag.ca.gov/privacy/ccpa)  
- [Supabase Regions](https://supabase.com/docs/guides/platform/regions)  
- [RevenueCat Pricing](https://www.revenuecat.com/pricing/)  

---

## 10. Change Log

| Version | Date | Summary |
|---|---|---|
| 1.0 | 2026-08-22 | Created NFR-12 to address missing NFR areas. |
