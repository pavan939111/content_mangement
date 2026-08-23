/**
 * Google Calendar adapter.
 *
 * Capabilities: events.list with syncToken, event creation with CreatorOS operation ID in private extended properties.
 * Handles timezone/DST transitions and sync token invalidation triggering safe full resync.
 *
 * Derived from: docs/api/providers/google-calendar.md
 */
