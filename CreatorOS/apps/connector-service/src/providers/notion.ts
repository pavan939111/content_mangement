/**
 * Notion adapter.
 *
 * Search pages/databases shared with integration; depth-limited block traversal.
 * Refresh token rotation returns both access AND refresh tokens requiring atomic vault update.
 * Notion-Version header pinned per request.
 *
 * Derived from: docs/api/providers/notion.md; docs/tdd/TDD-07 section 2 Notion rotation note
 */
