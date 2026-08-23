# Technical Architecture Document — ARCHITECTURE-01: Platform & UI

**Product:** CreatorOS  
**Version:** 1.1  
**Status:** Updated to reflect DEC-001 (native UI + shared KMP core)  
**Last Updated:** 2026-08-22  
**Related Document:** ARCHITECTURE-00 Overview, ARCHITECTURE-10 Decisions  
**Focus:** Native mobile UI architecture, presentation patterns, navigation, theming, accessibility, performance budgets

---

## 1. Purpose

This document defines the **platform-specific UI architecture** for CreatorOS on iOS and Android. It covers:

- Native platform choices and minimum versions
- Presentation architecture (MVVM + Clean Architecture) with shared KMP domain
- UI frameworks and component strategy
- Navigation architecture
- State management and data flow
- Theming, dynamic type, and accessibility integration
- UI performance budgets and testing strategy
- Localization and device compatibility approach

The goal is to produce a **buildable, maintainable, accessible, and high-performance** native UI layer that correctly implements the requirements from FRS modules and NFR-06/NFR-10.

---

## 2. Platform Choices and Justification

| Platform | Language | UI Framework | Min Version | Reason |
|---|---:|---|---:|---|
| iOS | Swift | SwiftUI | iOS 16 | Modern declarative UI, direct access to Dynamic Type, Dark Mode, Accessibility APIs. |
| Android | Kotlin | Jetpack Compose | Android 9 (API 28) | Modern declarative UI, Material 3, strong accessibility support, Kotlin-first. |

### Why Native + Declarative UI

**DEC-001** selected **native UI with a shared KMP core**. The UI layer is fully native SwiftUI/Compose; the shared core contains domain models, use cases, sync policies, API contracts, and remote config—but no UI code.

| Alternative | Rejected Because |
|---|---|
| Flutter/React Native | Weaker OS integration for media preview, background tasks, accessibility, storage APIs. Native chosen for best platform fidelity. |
| UIKit/XML Views | Older paradigm, more verbose; SwiftUI/Compose chosen for maintainability and speed of UI development. |
| KMP Compose Multiplatform UI | UI would become shared, but platform-specific accessibility, media integration, and navigation are better handled natively. DEC-001 keeps UI native. |

Evidence: Apple recommends SwiftUI for modern apps with automatic accessibility and Dynamic Type support. Android recommends Jetpack Compose for modern UI and Material 3. [developer.apple](https://developer.apple.com/xcode/swiftui/), [developer.android](https://developer.android.com/develop/ui/compose)

---

## 3. Presentation Architecture Pattern

Both platforms use **Model-View-ViewModel (MVVM)** combined with Clean Architecture principles. The ViewModel communicates with shared KMP use cases through platform-specific repository implementations.

### 3.1 Layer Responsibilities

| Layer | Responsibility | Platform |
|---|---|---|
| View | Render UI, capture user input, observe state, send intents | SwiftUI `View` / Compose `@Composable` |
| ViewModel | Hold UI state, handle user actions, call use cases from shared KMP core, expose state streams | `ObservableObject`/`@StateObject` / `ViewModel` |
| Shared KMP Core | Domain entities, use case contracts, business logic | Kotlin Multiplatform module |
| Repository | Data access abstraction, implemented natively | Protocol/Interface on each platform |
| Data Source | Local DB, sync outbox, file store, remote APIs | Concrete implementations |

### 3.2 UI State Management

| Platform | State Mechanism | Details |
|---|---|---|
| iOS | `@Published` properties on `ObservableObject`, `@StateObject`, `@EnvironmentObject` | SwiftUI observation |
| Android | `StateFlow` in `ViewModel`, `collectAsStateWithLifecycle()` in Compose | Lifecycle-aware |

Both platforms follow **unidirectional data flow**:

```
User Action → ViewModel → Shared KMP UseCase → Native Repository → Data Source
                              ↓
                         Result/State
                              ↓
                       ViewModel updates state
                              ↓
                         View renders
```

No business logic in Views. ViewModels survive configuration changes. On iOS, SwiftUI’s observation handles state invalidation; on Android, StateFlow + Lifecycle ensures no leaks.

---

## 4. Module and Package Structure

### 4.1 iOS Module Structure

```
CreatorOS/
├── App/
│   ├── CreatorOSApp.swift
│   ├── AppDelegate.swift
│   └── SceneDelegate.swift
├── Core/                // Native platform core utilities
│   ├── Entities/
│   ├── UseCases/
│   ├── Repositories/Protocols/
│   └── Utils/
├── SharedKMP/           // Generated framework from KMP module
│   └── SharedCore.framework
├── Features/
│   ├── Inbox/
│   ├── Library/
│   ├── Calendar/
│   ├── ContentDetail/
│   ├── ScriptEditor/
│   ├── MediaPreview/
│   ├── Publishing/
│   ├── Settings/
│   └── Onboarding/
├── DesignSystem/
│   ├── Theme/
│   ├── Components/
│   └── Tokens/
├── Services/           // Native platform services
│   ├── Database/
│   ├── Sync/
│   ├── Storage/
│   ├── Media/
│   └── Integrations/
└── Resources/
    ├── Localizable.xcstrings
    ├── Assets.xcassets
    └── Fonts/
```

### 4.2 Android Module Structure

```
app/
├── src/main/java/com/creatoros/
│   ├── CreatorOsApplication.kt
│   ├── core/
│   │   ├── entity/
│   │   ├── usecase/
│   │   ├── repository/
│   │   └── util/
│   ├── shared/          // KMP shared module dependency
│   │   └── SharedCore.kt
│   ├── feature/
│   │   ├── inbox/
│   │   ├── library/
│   │   ├── calendar/
│   │   ├── contentdetail/
│   │   ├── scripteditor/
│   │   ├── mediapreview/
│   │   ├── publishing/
│   │   ├── settings/
│   │   └── onboarding/
│   ├── design/
│   │   ├── theme/
│   │   ├── component/
│   │   └── token/
│   ├── service/
│   │   ├── database/
│   │   ├── sync/
│   │   ├── storage/
│   │   ├── media/
│   │   └── integration/
│   └── MainActivity.kt
└── res/
    ├── values/strings.xml
    ├── values/colors.xml
    ├── drawable/
    └── font/
```

Both follow feature-module organization while remaining a single deployable app.

---

## 5. Navigation Architecture

### 5.1 Primary Navigation

Bottom tab bar with four main destinations: Inbox, Library, Calendar, Projects.

| Tab | Destination |
|---|---|
| Inbox | Ideas |
| Library | Search & Assets |
| Calendar | Schedule |
| Projects | Content Items & Publishing |

Settings is accessible from the top bar gear icon on all tabs. Reminder Center is accessible from the Inbox and Calendar top bar actions.

**Note:** Settings is accessible from the top bar gear icon.

Quick Add button is a **floating action button** or persistent top-bar action accessible from all tabs.

### 5.2 iOS Navigation

Use **SwiftUI NavigationStack** with a coordinator/router.

- Tabs: `TabView`
- Nested navigation: `NavigationStack`
- Deep links: `onOpenURL` and `navigationDestination`
- Modal sheets: `.sheet` for capture, filters, share, and quick actions
- Full screen covers: `.fullScreenCover` for teleprompter and media playback

### 5.3 Android Navigation

Use **Jetpack Navigation Compose**.

- Tabs: `NavigationBar` + `NavHost`
- Nested navigation: `navigation` graphs per tab
- Deep links: `<deepLink>` in nav graph
- Modal sheets: `ModalBottomSheet`
- Full screen: separate `NavHost` or `Dialog`

Both must preserve navigation state when returning from external actions (camera, file picker, OAuth, native apps).

---

## 6. Design System and Theming

### 6.1 Design Tokens

Define semantic tokens in both platforms:

| Token Type | Examples |
|---|---|
| Color | Primary, Secondary, Background, Surface, Text, Error, Success, Warning |
| Typography | Body, Caption, Title, Headline, Script, Teleprompter |
| Spacing | XS, S, M, L, XL |
| Shape | Small, Medium, Large |
| Elevation | None, Low, Medium, High |

### 6.2 Theme Support

| Mode | Implementation |
|---|---|
| Light | Default semantic palette |
| Dark | Alternate semantic palette |
| System | Follow platform setting |
| High Contrast | Respect platform accessibility contrast |

- iOS: Asset Catalog with Color Sets supporting Light/Dark/High Contrast.
- Android: Compose `MaterialTheme` with light/dark color schemes; support high contrast via platform.

### 6.3 Dynamic Type / Font Scaling

- iOS: Use `.font(.body)` etc. from SwiftUI; support all Dynamic Type sizes including accessibility categories.
- Android: Use `sp` units; support font scaling up to 200%.
- All text containers must reflow; no fixed heights for essential text.
- Script teleprompter font size adjustable 16–96 pt independent of system.

### 6.4 Accessibility Integration

| Requirement | Platform Implementation |
|---|---|
| VoiceOver/TalkBack | `.accessibilityLabel`, `.accessibilityValue`, `.accessibilityHint` / `semantics` |
| Touch targets | min 44×44 pt / 48×48 dp |
| Color contrast | Semantic colors meet WCAG 2.2 AA |
| Reduce Motion | Respect system setting; disable nonessential animations |
| Bold Text / High Contrast | Use system fonts, no custom inaccessible fonts |

Evidence: Apple HIG Accessibility, Android Accessibility. [developer.apple](https://developer.apple.com/design/human-interface-guidelines/accessibility), [developer.android](https://developer.android.com/guide/topics/ui/accessibility)

---

## 7. UI Component Inventory

| Component | FRS | Description |
|---|---|---|
| QuickAddFAB | FRS-02 | Global floating action button |
| IdeaCard | FRS-02 | Inbox item card with tags, source, age |
| ContentItemCard | FRS-01 | Title, stage, readiness, thumbnails |
| AssetGrid | FRS-03 | Thumbnail grid with selection |
| SearchBar | FRS-03 | Global search with filters |
| ScriptEditorView | FRS-10 | Rich text editor |
| TeleprompterView | FRS-10 | Full-screen scrolling script |
| MediaPreviewView | FRS-11 | Video/audio/image playback, scrubber, timecode |
| ClipMarkerControls | FRS-04 | In/out markers |
| CalendarView | FRS-05 | Month/week/list with readiness |
| PublishingQueueView | FRS-06 | Pending/failed/scheduled posts |
| SettingsScreen | FRS-09 | Sections, toggles, connections |
| SyncCenterScreen | FRS-08 | Sync status, conflicts, retry |
| TrashScreen | FRS-12 | Deleted items |
| ReminderCenter | FRS-12 | Reminders list |
| OnboardingFlow | FRS-09 | Welcome, permission rationale |
| Paywall/Upgrade | FRS-14 | Plan comparison, purchase |

All components built as reusable design system components with semantic accessibility.

---

## 8. UI Performance Budgets

From NFR-01, NFR-06, NFR-07:

| Metric | Target |
|---|---|
| Frame rendering | 60 fps minimum; no frame >700 ms (failure threshold, not target) |
| Search result list scroll | 60 fps |
| Thumbnail loading | Async, cached; no jank |
| Cold startup to home | ≤1.0 s median |
| Warm | ≤300 ms |
| Hot | ≤150 ms |
| Debounce search input | 100–150 ms |
| Tap to focused composer | ≤150 ms |
| Local autosave after pause | ≤1 s |

Implementation:
- No DB/main-thread blocking.
- Image loading via async libraries (Kingfisher/Coil) with memory cache.
- Lazy rendering for grids/lists.
- Paging for results.
- Thumbnail downsampling.

---

## 9. UI Testing Strategy

### 9.1 Test Types

| Type | Platform Tools | Coverage |
|---|---|---|
| Unit tests (ViewModels) | XCTest / JUnit | Business logic, state transitions |
| Snapshot tests | SnapshotTesting / Paparazzi | Theme, Dynamic Type, RTL, localization |
| UI tests | XCUITest / Compose UI Test | Critical flows: capture, search, clip mark, publish handoff |
| Accessibility tests | XCUITest / Accessibility Scanner | VoiceOver/TalkBack, contrast, touch targets |

### 9.2 Critical UI Test Scenarios

- Capture text idea offline
- Search with filters
- Mark video in/out clip
- Set publishing reminder
- Restore deleted item
- Sync conflict resolution
- VoiceOver/TalkBack navigation
- Dynamic Type largest settings
- Dark mode/high contrast

Evidence: Apple testing, Android testing. [developer.apple](https://developer.apple.com/documentation/xctest), [developer.android](https://developer.android.com/training/testing)

---

## 10. Localization and Device Compatibility Implementation

### 10.1 Localization

- iOS: Use `String Catalog` (.xcstrings) for all strings, with pluralization.
- Android: Use `strings.xml` with `plurals`.
- Dates/numbers: `DateFormatter` / `DateFormat` with locale.
- RTL: leading/trailing constraints; no left/right fixed.

### 10.2 Device Compatibility

- Support iPhone SE (4.7") to iPad Pro.
- Android screen sizes: use adaptive layouts, `WindowSizeClass`.
- Foldables: use Compose adaptive layouts.
- Tablets: multi-column where beneficial, but not required for MVP.

---

## 11. Source References

- [Apple SwiftUI](https://developer.apple.com/xcode/swiftui/)  
- [Apple Human Interface Guidelines — Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)  
- [Apple Human Interface Guidelines — Typography](https://developer.apple.com/design/human-interface-guidelines/typography)  
- [Android Jetpack Compose](https://developer.android.com/develop/ui/compose)  
- [Android Navigation Compose](https://developer.android.com/guide/navigation)  
- [Android Accessibility](https://developer.android.com/guide/topics/ui/accessibility)  
- [Android Testing](https://developer.android.com/training/testing)  
- [Apple XCTest](https://developer.apple.com/documentation/xctest)


## 9. Change Log

| Version | Date | Summary |
|---|---|---|
| 1.1 | 2026-08-22 | P2 updates: navigation IA, NFR-01 thresholds, version pins, uncited claims. |

