# Data Dictionary — CreatorOS

**Version:** 1.1  
**Date:** 2026-08-23  
**Purpose:** Defines database tables and key columns across v1 and v2.

## v1 Tables

| Table | Key Columns | Description |
|---|---|---|
| content_item | id, kind, title, script_text, hook, cta, status, content_pillar, created_at, updated_at, deleted_at | Central content record (v1 core) |
| platform_variant | id, content_item_id, platform, caption, hashtags, title, description, thumbnail_asset_id | Platform-specific packaging |
| content_asset_link | id, content_item_id, asset_id, role, version | Links assets to content items |
| source_derivative_link | source_id, derivative_id, relation_type | Tracks repurposed content |
| asset | id, title, file_name, file_path_hint, source_type, provider, media_type, mime_type, size_bytes, duration_ms, width, height, availability, index_status | Indexed asset metadata |
| asset_tag | id, name | Tag definitions |
| asset_tag_link | asset_id, tag_id | Asset-tag many-to-many |
| thumbnail_proxy | asset_id, thumbnail_path, proxy_path, source_signature, status | Cached previews |
| idea | id, source_type, content_text, audio_path, transcript, source_url, status | Idea capture records |
| clip | id, source_asset_id, content_item_id, in_time_ms, out_time_ms, transcript_excerpt, hook, topic, status | Reusable clip |
| publishing_state | content_item_id, platform, state, live_url, publish_date, error_code | Publishing state per platform |
| sync_operation | operation_id, entity_type, entity_id, operation_type, payload, parent_hash, local_revision, retry_count, acknowledged_at | Durable outbox |
| reminder | id, entity_type, entity_id, title, due_date, repeat_type, completed | Reminders |
| trash_entry | id, entity_type, entity_id, deleted_at, retain_until | Soft-deleted records |
| backup_record | id, backup_type, file_path, created_at, size_bytes, checksum | Local/cloud backup metadata |
| storage_connection | id, provider, account_id, state, scopes, last_sync_at | Connected cloud providers |
| remote_config_cache | config_version, payload, signature, fetched_at | Cached signed config |
| entitlement | user_id, plan_id, valid_until, grace_until, source | Subscription entitlement |
| purchase_record | transaction_id, product_id, store, purchased_at, status | Purchase history |
| content_pillar | id, name, created_at | Content pillar definitions |
| revision | id, entity_type, entity_id, snapshot, version_number, created_at | Revision history |
| search_content | rowid, entity_type, entity_id, title, script_text, caption_text, transcript_text, file_name, notes, tags_text, updated_at | Canonical row source for FTS5 external-content index |
| script | id, content_item_id, title, script_text, script_type, created_at, updated_at, deleted_at | Script records |
| script_version | id, script_id, script_text, version_number, created_at, change_summary | Script version history |

## v2 Tables

| Table | Key Columns | Description |
|---|---|---|
| connected_record | id, brand, campaign, title, due_date, status, delivery_status, next_action, notes, created_at, updated_at | Connected content record (v2 core) |
| external_source_link | id, record_id, provider, external_object_id, canonical_url, display_name, link_type, match_method, confidence, last_verified_at, status | Links record to external provider object |
| connection_account | id, provider, account_id, display_name, scopes, auth_state, created_at, updated_at | Connected account metadata (non-secret) |
| connection_health | account_id, state, last_success, last_attempt, error_message, affected_records_count | Health state per connection |
| action_receipt | id, record_id, action_type, target_provider, target_object, timestamp, initiator, outcome, evidence | Append-only action receipts |
| provider_operation | operation_id, provider, account_id, action_type, state, retry_count, created_at, updated_at | Backend provider operation metadata |
| search_result_cache | id, provider, query_hash, external_id, title, type, url, updated_at, cached_at | Cached external search results |

## Notes

- Receipts are append-only; no update/delete after creation except archiving.
- `external_source_link` has unique constraint on (record_id, provider, external_object_id).
- `search_content` drives the FTS5 external-content index; triggers keep it synchronized with canonical tables.
- v2 `connected_record` supersedes v1 `content_item` as the active core. v1 tables remain for legacy or retained module use.
