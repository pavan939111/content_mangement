/**
 * Google Drive adapter implementing the ProviderAdapter interface.
 *
 * Capabilities: search via Drive files.list, delta sync via changes.getStartPageToken/list,
 * read metadata, attach, open. Watch channel registration deferred to Phase 2 webhooks.
 * Rate limits: files.list = 100 units, files.get = 5 units per Google quota model.
 *
 * Derived from: docs/api/providers/google-drive.md; docs/architecture/ARCHITECTURE-13 section 4
 */
