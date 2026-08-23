# Non-Functional Requirements — NFR-12 v2: Quality, Cost & Capacity

**Product:** CreatorOS v2  
**Version:** 2.0  
**Status:** Draft for Validation  
**Date:** 2026-08-23  
**Reference to v1:** ../../../docs/requirements/non-functional/NFR-12-quality-cost-capacity.md

## 1. Purpose

This document defines v2-specific quality, cost, and capacity requirements for connected-tool features.

The v1 search quality, transcription, indexing, and unit-economics requirements remain valid.

## 2. New v2 Requirements

| ID | Requirement | Priority | Description |
|---|---|---|---|
| QCC-01 | Connected search relevance | Must | External search results shall be relevant and include source provenance; zero-result suggestions shall be shown. |
| QCC-02 | Connector cost model | Must | Provider API costs shall be modeled and monitored per user and per provider. |
| QCC-03 | Capacity for active records | Must | The system shall support at least 1,000 active connected content records per user without search or health degradation. |
| QCC-04 | Rate-limit headroom | Should | The system shall keep a 10% headroom on provider quotas for interactive user actions. |
| QCC-05 | Search result freshness | Must | External search results shall display last-updated timestamps, and cached results shall be marked as such. |

## 3. References

- Search latency: v1 NFR-01 §3.2
- Transcription quality/cost: v1 NFR-12 §3
- Unit economics: v1 NFR-12 §6

## 4. Acceptance Criteria

- Connected search returns local results <100ms and external results with provenance.
- Provider API costs tracked per user.
- 1,000 active records per user without degradation.
- Interactive actions always get quota priority.

## 5. Change Log

| Version | Date | Summary |
|---|---|---|
| 2.0 | 2026-08-23 | Added connected search, cost, and capacity requirements. |
