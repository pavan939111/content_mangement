# Design Tokens — CreatorOS v2

**Version:** 1.0  
**Date:** 2026-08-23  
**Status:** Ready for Design Implementation  
**Related:** v2/uiux/components.md  

---

## 1. Purpose

This document defines the design tokens used across iOS and Android.

Token system rules:

- Three layers: reference tokens, semantic tokens, component tokens.
- Product code uses semantic/component tokens only.
- Raw values are not used directly in screens.
- Token values differ by platform/theme; semantic meaning remains stable.

---

## 2. Token Layers

| Layer | Purpose | Example |
|---|---|---|
| Reference tokens | Raw primitives | `blue.600`, `space.16`, `radius.12` |
| Semantic tokens | Product meaning | `content.primary`, `surface.canvas`, `status.warning` |
| Component tokens | Component-specific values | `receiptCard.container`, `sourceBadge.label` |

---

## 3. Color Tokens

### 3.1 Semantic Color Roles

| Token | Role |
|---|---|
| `surface.canvas` | Main screen background |
| `surface.raised` | Card/elevated background |
| `surface.selected` | Selected list/card background |
| `content.primary` | Primary text |
| `content.secondary` | Metadata/description text |
| `content.tertiary` | Subtle hint text |
| `border.subtle` | Dividers, quiet borders |
| `border.strong` | Strong boundaries |
| `action.primary` | Main action |
| `action.onPrimary` | Text/icon on primary action |
| `status.success` | Verified/complete |
| `status.warning` | Stale/partial/attention |
| `status.error` | Failed/needs action |
| `status.info` | Informational/offline |
| `status.pending` | Queued/syncing |
| `source.google` | Google source accent |
| `source.notion` | Notion source accent |
| `source.local` | On-device source accent |

### 3.2 State Rules

- Status colors are always paired with icon and text.
- Avoid green checkmarks for routine healthy connections.
- Provider brand colors are for source badges, not global UI state.
- Dark mode and high-contrast variants defined for every status token.

---

## 4. Typography Tokens

| Token | Typical Use | Notes |
|---|---|---|
| `display` | Rare onboarding/headline | Not for everyday screens |
| `screenTitle` | Screen heading | One per screen |
| `sectionTitle` | Group separators | Calm emphasis |
| `itemTitle` | Project/document/receipt title | 1–2 lines |
| `body` | Descriptions/snippets | Comfortable line height |
| `metadata` | Source, timestamp, project | Secondary but readable |
| `label` | Buttons, tabs, chips, badges | Medium/semibold |
| `monoMetadata` | Receipt IDs, technical details | Secondary only |

Platform mapping:

- iOS: Dynamic Type text styles.
- Android: Material 3 typography roles with sp scaling.

---

## 5. Spacing Tokens

```text
2   micro gap
4   compact icon/text gap
8   related control separation
12  compact row internal gap
16  screen gutter / card padding
20  section-to-list transition
24  major group separation
32  major section separation
40  empty-state spacing
48  empty-state vertical breathing room
```

Defaults:

- Phone screen side padding: 16.
- Compact row vertical padding: 12–14.
- Standard card padding: 16.
- Group separation: 24.
- Minimum adjacent target separation: 8.

---

## 6. Shape Tokens

| Token | Use |
|---|---|
| `control` | Buttons, inputs, small controls |
| `card` | Card summaries |
| `sheet` | Modal sheets |
| `pill` | Chips, badges |
| `avatar` | User/provider avatars |

---

## 7. Elevation Tokens

| Token | Use |
|---|---|
| `flat` | Canvas and plain rows |
| `raised` | Cards, sticky headers |
| `floating` | FAB, capture control |
| `modal` | Sheets, dialogs, popovers |

Elevation is used sparingly. Most content uses dividers or spacing instead of shadows.

---

## 8. Motion Tokens

| Token | Duration | Use |
|---|---|---|
| `fast` | 100–150 ms | Button press, toggles |
| `standard` | 200–300 ms | Screen transition |
| `deliberate` | 300–400 ms | Sheet entrance |
| `reducedMotionFallback` | Instant/fade | Reduce Motion enabled |

Rules:

- No decorative animation.
- No auto-bouncing status.
- Motion is not the only communicator of state.

---

## 9. Platform Mapping

| Token | iOS | Android |
|---|---|---|
| Color | Asset catalog semantic colors | Material `ColorScheme` + fallback scheme |
| Typography | Dynamic Type styles | Material 3 typography |
| Spacing | SwiftUI spacing constants | Compose dp |
| Shape | SwiftUI corner radii | Compose shapes |
| Elevation | SwiftUI shadows | Compose tonal elevation |
| Motion | SwiftUI animations; Respect Reduce Motion | Compose animations; animator duration scale |

---

## 10. Implementation Rules

1. Tokens are named and versioned.
2. Component code never references raw values.
3. Dark mode and high contrast are part of token definition.
4. Provider brand colors are isolated from semantic state colors.
5. Change-log token changes with visual regression checks.

---

## 11. Change Log

| Version | Date | Summary |
|---|---|---|
| 1.0 | 2026-08-23 | Created Design Tokens. |
