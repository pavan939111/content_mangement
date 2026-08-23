# Technical Architecture Document — ARCHITECTURE-03 v2: Data Layer

**Product:** CreatorOS v2  
**Version:** 2.0  
**Status:** Draft for Validation  
**Date:** 2026-08-23  
**Reference to v1:** ../../../docs/architecture/ARCHITECTURE-03-data-layer.md

## 1. Purpose

This document defines **v2 data layer additions** for the connected workspace.

The v1 local-first SQLite + FTS5 + SQLCipher foundation remains authoritative for local content, search, and sync outbox. This document adds only the new tables and relationships required by external connectors, receipts, and health.

## 2. New Tables

| Table | Purpose |
|---|---|
| `connected_record` | Main connected content record table. |
| `external_source_link` | Links a record to an external object from a connected provider. |
| `connection_account` | Stores non-secret connected account metadata. |
| `connection_health` | Stores current health state for each connection. |
| `action_receipt` | Append-only receipt of handoffs and actions. |
| `receipt_annotation` | Separate append-only annotation records attached to receipts. |
| `provider_operation` | Caches backend provider operation metadata for UI. |
| `search_result_cache` | Caches normalized external search results. |

## 3. Key Columns

### `connected_record`

- `id`, `brand`, `campaign`, `title`, `due_date`, `status`, `delivery_status`, `next_action`, `notes`, `created_at`, `updated_at`

### `external_source_link`

- `id`, `record_id`, `provider`, `external_object_id`, `canonical_url`, `display_name`, `link_type`, `match_method`, `confidence`, `last_verified_at`, `status`

### `connection_account`

- `id`, `provider`, `account_id`, `display_name`, `scopes`, `auth_state`, `created_at`, `updated_at`

### `connection_health`

- `account_id`, `state`, `last_success`, `last_attempt`, `error_message`, `affected_records_count`

### `action_receipt`

- `id`, `record_id`, `action_type`, `target_provider`, `target_object`, `timestamp`, `initiator`, `outcome`, `evidence`

### `provider_operation`

- `operation_id`, `provider`, `account_id`, `action_type`, `state`, `retry_count`, `created_at`, `updated_at`

### `search_result_cache`

- `id`, `provider`, `query_hash`, `external_id`, `title`, `type`, `url`, `updated_at`, `cached_at`

## 4. Indexes and Constraints

- Unique constraint on `external_source_link(record_id, provider, external_object_id)`.
- Index `action_receipt(record_id, timestamp)`.
- Index `search_result_cache(provider, query_hash)`.
- Index `connection_health(account_id)`.
- Receipts are append-only; no update/delete after creation.
- User annotations on receipts are stored in a separate `receipt_annotation` table (see ARCHITECTURE-18 §5.6); the original receipt row is never modified.

## 5. Data Integrity

- Connection health is updated only by backend verification or explicit reauthorization.
- Receipts are immutable after creation.
- Receipt annotations are also append-only but are separate rows, not columns on the receipt.
- External source links never silently match ambiguous results.


## 5A. Local Search Index for Connected Records

The v1 FTS5 external-content `search_content` table shall be extended to include v2 connected records and external source links.

Add columns/projections:

- `search_content` shall support `entity_type = 'connected_record'` and `entity_type = 'external_source_link'`.
- For `connected_record`, indexed text fields: `title`, `brand`, `campaign`, `notes`, `next_action`.
- For `external_source_link`, indexed text fields: `display_name`, `provider`, `external_object_id`, `canonical_url`.

Triggers:

- Insert/update/delete triggers on `connected_record` and `external_source_link` must update `search_content` in the same transaction, following v1 ARCH-03 §5 trigger patterns.

This makes CTS-10/CTS-11 implementable.

## 6. Reference to v1 Stable Data Layer

- SQLite schema conventions, SQLCipher encryption, FTS5, WAL, migrations: v1 ARCH-03 §4, §5, §6, §7.
- Local entity tables unchanged.

## 7. Change Log

| Version | Date | Summary |
|---|---|---|
| 2.0 | 2026-08-23 | Added v2 connected record, external source, health, receipt tables. |
