# Non-Functional Requirements — NFR-10: Localization, Device Compatibility & Theming

**Product:** CreatorOS  
**Version:** 1.0  
**Status:** Draft for Review  
**Related Module:** All functional modules, especially FRS-09 Settings, FRS-10 Script Editor, FRS-11 Media Preview

---

## 1. Purpose

This document defines the **localization, device compatibility, and theming requirements** for CreatorOS. The app is a mobile-first content workspace for solo short-form creators worldwide. It must launch successfully in multiple markets, function across a wide range of devices and OS versions, and respect user system preferences for appearance and text size.

The goals are to:

- Support internationalization (i18n) from day one to reduce retrofit cost.
- Define minimum supported OS versions and device classes.
- Ensure a consistent, accessible appearance in light, dark, and high-contrast modes.
- Handle platform fragmentation gracefully without blocking core features.
- Meet Apple App Store and Google Play global release expectations.

These requirements are based on official Apple and Android platform guidelines, common mobile localization practices, and earlier NFRs (NFR-06 Accessibility, NFR-07 App Size).

---

## 2. Scope

This document covers:

- Supported languages and locale formatting
- Internationalization architecture
- Right-to-left (RTL) support
- Pseudolocalization and testing
- Minimum iOS/Android versions
- Device classes and screen size compatibility
- Android scoped storage and iOS photo library behavior
- Theming: light, dark, high contrast, font scaling
- Dynamic type and display scaling
- Localization of accessibility labels
- CI/CD gates for localization and compatibility

**Out of scope:** Actual translation content/strings, server-side localization, voice transcription language models beyond app UI, payment currency localization.

---

## 3. Localization & Internationalization

### 3.1 Supported Languages

| Requirement | Detail |
|---|---|
| MVP launch languages | English (US) as primary. Support for additional languages is strongly recommended but optional for MVP. |
| Phase 2 languages | Spanish (es), Portuguese (pt-BR), Hindi (hi), Indonesian (id), Arabic (ar), German (de), French (fr), Japanese (ja). |
| Language selection | Follow device system language by default; allow in-app language override in Settings (Phase 2). |

**Requirement:**

> The app architecture shall be internationalized from MVP. All user-facing strings must be externalized in resource files, not hardcoded.

### 3.2 Locale Formatting

| Data Type | Requirement |
|---|---|
| Date | Use locale-aware date formatting. Do not hardcode MM/DD/YYYY. |
| Time | Respect user’s 12/24-hour preference and timezone. |
| Numbers | Use locale-aware decimal and grouping separators for counts, storage sizes, durations. |
| Plurals | Use platform pluralization rules (iOS `stringsdict`, Android `plurals`) for word counts, results, assets. |
| Units | Use localized units where appropriate (MB/GB, seconds/minutes). |

### 3.3 Internationalization Architecture

| Requirement | Detail |
|---|---|
| String resources | iOS: `Localizable.strings` / `.xcstrings`; Android: `strings.xml`. |
| No hardcoded strings | All UI text must come from resources. |
| Accessibility labels | Must also be localized. |
| Date/time APIs | Use `DateFormatter`/`DateTimeFormatter` with locale, not custom formatters. |
| Testing | Run pseudolocalization tests to catch truncation and expansion issues. |

### 3.4 Right-to-Left (RTL) Support

| Requirement | Detail |
|---|---|
| RTL languages | If Arabic or Hebrew is supported, the UI must mirror correctly. |
| Layout | Use leading/trailing constraints; avoid fixed left/right positions. |
| Icons | Directional icons (arrow, back, forward) must flip in RTL. |
| Text alignment | Use natural text alignment. |
| Testing | Include RTL layout tests in CI if RTL languages are in supported set. |

### 3.5 Localization Testing

| Requirement | Detail |
|---|---|
| Pseudolocalization | Run app with pseudo-locale to detect unlocalized strings, truncation, layout issues. |
| Screen validation | Test all key screens in each supported language for clipped text, overflow, and layout breaks. |
| Locked strings | Ensure dynamic text (from user content) is not localized. |
| Locale switching | App must not restart when language changes; UI updates dynamically (Phase 2). |

---

## 4. Device & OS Compatibility

### 4.1 Minimum OS Versions

| Platform | Minimum Version | Rationale |
|---|---|---|
| iOS | iOS 16.0 | Covers majority of active devices; supports SwiftUI/Photos modern APIs. |
| Android | Android 9 (API 28) | Minimum API 28 selected to cover a wide range of active devices; actual distribution checked before release; supports scoped storage changes in API 29+. |

**Requirement:**

> The app shall support iOS 16+ and Android 9+ at launch. Features requiring newer APIs shall degrade gracefully on older versions.

### 4.2 Device Classes

The app must function correctly on:

| Class | Examples | Screen |
|---|---|---|
| Small phone | iPhone SE, 4.7" Android | ≥4.7" |
| Standard phone | iPhone 13/14, Pixel 6/7 | 5.8–6.5" |
| Large phone | iPhone Pro Max, Galaxy S23 Ultra | 6.7"+ |
| Small tablet | iPad Mini, Galaxy Tab A | 8–9" |
| Large tablet | iPad Pro 12.9", Galaxy Tab S | 10–13" |

**Requirements:**

- Support portrait and landscape where appropriate, especially for video preview and teleprompter.
- Use adaptive layouts (size classes, constraint layout) to handle varying screen sizes.
- Calendar/board views must have list alternatives for narrow screens.
- Touch targets must remain 44×44 pt / 48×48 dp across devices.
- Do not assume a single screen ratio; avoid fixed-size views.

### 4.3 Screen Size and Foldables

| Requirement | Detail |
|---|---|
| Foldable support | Android: handle folded/unfolded states. iOS: not applicable. |
| Multi-window | Support split-screen on Android where feasible; at minimum do not break. |
| Dynamic display scaling | Respect user display size changes. |
| Tablets | Provide multi-column layouts where useful (e.g., Library + Detail), but do not require tablet-specific features for MVP. |

### 4.4 Android Scoped Storage Compatibility

| API Level | Behavior | Requirement |
|---|---|---|
| API 28 | Legacy storage access possible | Use MediaStore and SAF; avoid MANAGE_EXTERNAL_STORAGE |
| API 29+ | Scoped storage enforced for most apps | Use SAF for user-selected folders; persist URI permissions |
| API 30+ | Scoped storage full enforcement | Same as above |
| API 33+ | Granular media permissions for photos/videos | Request READ_MEDIA_IMAGES / READ_MEDIA_VIDEO as needed; handle deny |

**Requirement:**

> The app shall use Storage Access Framework for folder selection and MediaStore for media access on Android. It shall not require `MANAGE_EXTERNAL_STORAGE` unless eligible and necessary, and if used, must comply with Google Play policy.

### 4.5 iOS Photo Library Compatibility

| Feature | Requirement |
|---|---|
| Limited photo access | Handle `PHAuthorizationStatus.limited`. Show picker to add more photos if needed. |
| Full access denied | Use document picker for file import. |
| Photo library changes | Observe `PHPhotoLibraryChangeObserver` to refresh indexes. |

**Requirement:**

> The app shall never assume full photo library access. It shall work with limited photos and provide a document picker fallback for file import.

---

## 5. Theming & Appearance

### 5.1 Light / Dark / System Mode

| Requirement | Detail |
|---|---|
| Supported modes | Light, Dark, System. |
| Default | Follow system setting. |
| Manual override | In-app setting in Settings > Appearance. |
| All screens | All UI surfaces must support both themes with correct contrast. |
| Media preview | Video/image preview background should adapt but not distort content. |
| Charts/indicators | Colors must meet contrast requirements in both modes. |

### 5.2 Color Palette & Semantic Colors

| Requirement | Detail |
|---|---|
| Semantic colors | Use semantic color tokens (primary, secondary, background, surface, text, error, success, warning) defined for both themes. |
| No hardcoded colors | Colors must be defined in asset catalogs / resource files. |
| Dynamic adjustment | Colors must adapt to system dark mode and high contrast. |
| Brand color | Primary brand color must remain recognizable in both modes. |
| Contrast | Text and icons must maintain ≥4.5:1 (normal) and ≥3:1 (large/UI) in both themes. |

### 5.3 Dynamic Type & Font Scaling

| Requirement | Detail |
|---|---|
| iOS | Support all Dynamic Type categories, including accessibility sizes. |
| Android | Support font scaling up to at least 200%. |
| Fixed containers | Avoid fixed-height text containers that clip enlarged text. |
| Script editor | Script font size independent of system scaling; teleprompter font size adjustable 16–96 pt. |
| Calendar | Switch to agenda/list view at large font sizes. |
| Tables | Provide list alternatives for dense tables. |
| Testing | UI tests at 1.0×, 1.3×, 1.5×, 2.0× font scale. |

### 5.4 High Contrast & Bold Text

| Requirement | Detail |
|---|---|
| High contrast mode | Respect system "Increase Contrast" / "High Contrast Text" settings. |
| Bold text | Respect system bold text; UI should not break. |
| Color-only indication | Never rely on color alone; use icons, labels, and text as secondary cues. |
| Focus indicators | Visible focus in high contrast mode with ≥3:1 contrast. |
| Testing | Validate high contrast themes in CI screenshot tests. |

---

## 6. Acceptance Criteria

```text
Localization
- All user-facing strings are externalized in resource files.
- App launches in English without missing or placeholder strings.
- Date/time/number formatting follows locale.
- Plurals use platform pluralization rules.
- If RTL languages are supported, UI mirrors and icons flip correctly.
- Pseudolocalization testing passes with no clipped/unlocalized critical strings.

Device compatibility
- App installs and runs on iOS 16+ and Android 9+.
- Core features work on small phone, large phone, and at least one tablet form factor.
- Android scoped storage workflows work on API 28, 29, 30+.
- iOS limited photo access is handled gracefully.
- No MANAGE_EXTERNAL_STORAGE required.
- App handles split-screen and foldable states without crashes.

Theming
- Light, Dark, and System modes work on all screens.
- Semantic colors meet contrast ratios in both modes.
- All text respects Dynamic Type / font scaling up to 200%.
- High contrast and bold text do not break layouts.
- Status indicators use more than color.
- Teleprompter font size adjustable 16–96 pt.
```

---

## 7. Source References

- [Apple Human Interface Guidelines — Localization](https://developer.apple.com/design/human-interface-guidelines/localization)  
- [Apple Human Interface Guidelines — Dark Mode](https://developer.apple.com/design/human-interface-guidelines/dark-mode)  
- [Apple Human Interface Guidelines — Typography](https://developer.apple.com/design/human-interface-guidelines/typography)  
- [Android Localization Checklist](https://developer.android.com/distribute/best-practices/launch/localization-checklist)  
- [Android Support Different Screens](https://developer.android.com/guide/topics/large-screens/support-different-screen-sizes)  
- [Android Storage Access Framework](https://developer.android.com/training/data-storage/shared/documents-files)  
- [Apple PhotoKit Limited Library](https://developer.apple.com/documentation/photokit/photolibrary)  
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/)

---


## 6. Change Log

| Version | Date | Summary |
|---|---|---|
| 1.1 | 2026-08-22 | P2 updates: navigation IA, NFR-01 thresholds, version pins, uncited claims. |

