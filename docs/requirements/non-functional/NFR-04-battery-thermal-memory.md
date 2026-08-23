# Non-Functional Requirements — NFR-04: Battery, Thermal & Memory

**Product:** CreatorOS  
**Version:** 1.0  
**Status:** Draft for Review  
**Related Module:** FRS-03 Asset Library, FRS-08 Offline & Sync, all modules  

---

## 1. Purpose

This document defines the **battery, thermal, and memory requirements** for CreatorOS. The app performs local media indexing, thumbnail generation, optional proxy transcoding, full-text search, and background sync. These tasks can be CPU-, I/O-, and memory-intensive, especially on mid-range and older phones.

The goal is to ensure:

- No excessive battery drain from background indexing or sync.
- No device overheating (thermal throttling).
- No out-of-memory crashes or excessive memory pressure.
- The app remains responsive during all background work.
- Work is safely paused/resumed based on battery, thermal, and memory conditions.

These requirements are based on official Android and iOS platform guidelines, power management best practices, and mobile media processing constraints.

---

## 2. Scope

This document covers:

- Battery consumption budgets
- Low-battery and low-power-mode behavior
- Thermal state thresholds and responses
- Memory budgets per device class
- Image/video thumbnail memory management
- Background work constraints and execution limits
- ANR and watchdog prevention
- User-visible progress and control

**Out of scope:** Storage quotas (NFR-03), security (NFR-05), sync payload bandwidth (NFR-03/08).

---

## 3. Battery Requirements

### 3.1 Battery Consumption Budgets

| Workload | Target Battery Usage |
|---|---|
| Metadata-only scan (local files) | ≤2% per hour |
| Image thumbnail background indexing | ≤3% per hour |
| Video thumbnail background indexing | ≤5% per hour |
| Foreground user-started thumbnail indexing | ≤8% per hour, with visible progress |
| Proxy generation/transcoding | Requires charging or explicit user start |
| OCR/transcription | Charging only by default |
| Normal app browsing/search | ≤1% per 30 minutes active use |

**Requirements:**

- Background media processing (thumbnails, proxies, transcription) must not run on battery unless user explicitly initiates.
- Proxy generation must require charging or explicit user action.
- OCR/transcription must default to charging-only.
- All battery budgets are validated on physical devices across device classes.

### 3.2 Low Battery / Low Power Mode Behavior

| Condition | Required Behavior |
|---|---|
| Battery <20% and not charging | Pause nonessential scans, thumbnail generation, proxies, OCR, transcription |
| Low Power Mode / Battery Saver | Metadata-only; defer preview/proxy work |
| Battery <10% | Stop all background media work; only lightweight sync |
| Charging + idle | Allow larger thumbnail/proxy batches |

**Requirements:**

- The app must detect low power mode (iOS) and battery saver (Android) and adjust work.
- If battery drops below 20% while proxy generation is running, pause and persist checkpoint.
- Resume automatically when charging or battery >30% (configurable).
- Provide user-visible reason for paused work: “Paused to save battery.”

---

## 4. Thermal Requirements

Android exposes thermal states via `PowerManager`. iOS exposes thermal pressure notifications.

### 4.1 Thermal State Thresholds

| Thermal State | Media Work Policy |
|---|---|
| None / Light | Metadata scan and low-concurrency thumbnails allowed |
| Moderate | Pause video thumbnails, contact sheets, proxies; reduce image thumbnail concurrency to 1 |
| Severe | Stop all media decode, proxy, OCR, transcription; persist queue |
| Critical / Emergency | Stop all background work, release caches and decoder resources |
| Shutdown | No application action expected |

**Requirements:**

- Register for thermal state callbacks on both platforms.
- Before opening a media file, check current thermal state.
- On severe thermal state, stop all media processing and show “Paused due to device temperature.”
- Resume only when thermal state returns to none/light.
- Persist progress at safe boundaries so no work is lost.

---

## 5. Memory Requirements

### 5.1 Memory Budgets by Device Class

| Device RAM Class | Normal UI Working Set | Thumbnail/Media Ceiling |
|---|---|---|
| ≤4 GB RAM | ≤100 MB | ≤160 MB |
| 4–6 GB RAM | ≤140 MB | ≤220 MB |
| 8 GB+ RAM / modern iPhone | ≤180 MB | ≤280 MB |
| Memory warning / trim | Release to ≤50 MB | Cancel/defer media work |

**Requirements:**

- App must not exceed these budgets during normal operation.
- On memory warnings, release non-visible image caches, thumbnail decode caches, and recyclable objects.
- Use `onTrimMemory` (Android) and `didReceiveMemoryWarning` (iOS) to clear caches.
- Do not keep full-resolution images or raw video frames in memory.
- Decode thumbnails at target size only; never load original 4K/8K images into memory for previews.

### 5.2 Image and Video Memory Rules

| Rule | Requirement |
|---|---|
| Decode size | Downsample to UI target size; never decode original for thumbnail |
| Bitmap cache | LRU/2Q with size limit based on device class |
| Video frame extraction | One decoder/transcoder at a time |
| Proxy generation | Bounded memory; use Media3 Transformer on Android, AVFoundation on iOS |
| Contact sheets | Generate at reduced resolution; release frames after compositing |
| Cache flushing | Clear 50–75% of preview memory cache on background/memory warning |
| FTS queries | Materialize max 50 results; hydrate only required fields |
| Search results | Store IDs and compact view models, not full transcript text per hit |

**Requirements:**

- Image thumbnails must be decoded at 256–512 px, never original resolution.
- Maintain a configurable memory cache size per device RAM class.
- Use one video decoder/transcoder at a time on devices with ≤6 GB RAM.
- Never keep decoded video frames in memory for longer than needed.
- On `TRIM_MEMORY_BACKGROUND` or `TRIM_MEMORY_UI_HIDDEN`, clear UI thumbnail cache; on stronger trim levels, release all rebuildable caches.

---

## 6. Background Work Constraints

### 6.1 Platform Execution Limits

| Platform | Work Type | Practical Limit | Requirement |
|---|---|---|---|
| iOS | `BGAppRefreshTask` | ~30 s | Work chunks ≤25 s, checkpoint |
| iOS | `BGProcessingTask` | System-controlled | No fixed window; resumable |
| Android | WorkManager / JobScheduler | Often stopped ~10 min | Work chunks ≤8 min, checkpoint |
| Android | Foreground service (media) | Must call `startForeground()` within 5 s | Use only for explicit user-initiated long tasks |
| Android | Media processing FGS (Android 15) | 6 h per 24 h rolling | Track usage, avoid exceeding |

**Requirements:**

- All background jobs must be idempotent, checkpointed, and resumable.
- Foreground services must show a persistent user-visible notification.
- Media processing foreground service must track its 6-hour budget and stop when nearing limit.
- Background execution must never be required for core local functionality.

### 6.2 Pause/Resume Policies

Automatically pause when:

- battery <20%
- Battery Saver / Low Power Mode enabled
- thermal state ≥ moderate for video work
- thermal state ≥ severe for all indexing
- free storage <10% or <2 GB
- user begins scrolling, typing, editing, searching, recording
- external drive disconnected
- source permission revoked
- app enters background without eligible task
- iOS expiration handler fires
- Android worker stopped/cancelled

Resume when:

- app returns foreground and user idle
- device charging
- unmetered Wi-Fi available for cloud metadata/transcript work
- thermal state returns to none/light
- external drive reconnects
- user taps “Resume indexing”

**Requirements:**

- Check battery, thermal, storage, and user interaction state before and during each media task.
- Persist cursor/checkpoint at asset boundaries.
- Show pause reason in UI.
- Do not silently resume; user must be informed.

---

## 7. ANR and Watchdog Prevention

### 7.1 Android ANR

- Input event must be handled within **5 seconds**; any main-thread blocking >5 s risks ANR.
- No file enumeration, SQLite FTS rebuild, bitmap decode, video frame extraction, PDF parse, transcoding, hashing, or network sync on the main thread.
- Use coroutines/executors with bounded concurrency.
- Keep UI frame budget 16 ms at 60 fps; treat any main-thread task >8 ms as suspicious during scrolling.
- Use `StrictMode` in debug builds.
- Use Macrobenchmark/Perfetto/JankStats in CI.

### 7.2 iOS Watchdog

- No long-running tasks on the main thread; watchdog can terminate the app.
- Use background queues for all media processing.
- Handle background task expiration quickly: stop decoder/export, persist checkpoint, close temp file.
- Do not assume tasks run after force quit.

### 7.3 Requirements

- **Zero** main-thread heavy work.
- All I/O, DB queries, bitmap operations, video processing off the main thread.
- Use async/await or equivalent with proper cancellation.
- All task cancellation must be cooperative and complete within ≤500 ms.

---

## 8. Queueing and Throttling Strategy

### 8.1 Priority Classes

| Queue | Examples | Execution Policy |
|---|---|---|
| P0: user-blocking | Selected video thumbnail, explicit preview, current-folder metadata | Immediate; 1–2 workers max |
| P1: near-visible | Next 20–50 grid items | Run after P0; cancelable |
| P2: metadata backlog | Filename, dimensions, duration, cloud metadata | Small batches; foreground/idle allowed |
| P3: thumbnails | Non-visible images/videos | Idle, charging preferred |
| P4: document text extraction | PDFs, DOCX, transcript imports | Idle/charging/network-aware |
| P5: proxies/contact sheets | Clip-marking proxies, contact sheets | Explicit request or charging+idle only |
| P6: OCR/transcription | Expensive enrichment | User opt-in; charging/unmetered conditions |

### 8.2 Concurrency Limits

| Work Type | Foreground | Background Normal | Background Low Battery/Thermal |
|---|---|---|---|
| Metadata enumeration | 2–4 I/O tasks | 1–2 | 0–1 |
| Image thumbnails | 2 | 1 | 0 |
| Video thumbnails | 1 | 1 | 0 |
| Video proxies | 1 explicit | 0 unless charging+approved | 0 |
| Sync metadata | 2 network requests | 1 | 0 if battery critical |
| FTS insertion | 1 DB writer | 1 | 0–1 small batches |

**Requirements:**

- Use these concurrency limits as default; adjust per device class and thermal state.
- Never combine high-concurrency thumbnail decoding with video transcoding.
- Persist queue state and checkpoint at file boundaries.

---

## 9. User Controls and Visibility

| Control | Requirement |
|---|---|
| Pause all indexing | Must |
| Resume now | Must |
| Index only current folder/project | Should |
| Generate previews for selected assets | Should |
| Wi-Fi only | Must |
| Charging only | Must |
| Limit cache to X GB | Should |
| Clear proxy cache | Must |
| Show queue count, current item, remaining estimate, pause reason | Should |

**Requirements:**

- Provide a settings screen for indexing, battery, storage, and network preferences.
- Show current indexing status with pause/resume control.
- When work is paused due to battery/thermal/storage, display reason and allow user to override if safe.

---

## 10. Recommended Acceptance Criteria

```text
Responsiveness
- 0 main-thread media decode/transcode operations.
- No input ANR; no UI input delay approaching 5 seconds.
- 60 fps target when browsing indexed results.
- Foreground cancel responds in <=500 ms.

Battery
- Metadata scan <=2% battery/hour.
- Image thumbnails <=3% battery/hour background.
- Video thumbnails <=5% battery/hour background.
- Proxy generation requires charging or explicit user initiation.
- Pause at battery <20% for nonessential work.

Thermal
- Pause video thumbnails/contact sheets at moderate thermal state.
- Stop all media decode/transcode at severe thermal state.
- Resume only when thermal returns to none/light.

Memory
- Decode at target thumbnail size only.
- Preview memory cache max:
  <=48 MB on <=4 GB devices,
  <=96 MB on 4–6 GB devices,
  <=160 MB on 8 GB+ devices.
- One video decoder/transcoder at a time.

Execution
- iOS background refresh task performs <=25 seconds of work.
- Android Job/Worker work chunks <=8 minutes.
- All jobs checkpoint at asset boundaries.
- Background jobs are resumable after OS termination.

Reliability
- No incomplete thumbnail/proxy visible as complete.
- Source disconnect leaves metadata searchable.
- Pause reason visible to user.
- No scheduled job is required for local-first correctness.
```

---

## 11. Source References

- [Apple — Choosing Background Strategies](https://developer.apple.com/documentation/backgroundtasks/choosing-background-strategies-for-your-app)  
- [Apple — Background Tasks](https://developer.apple.com/documentation/BackgroundTasks)  
- [Android — JobScheduler](https://developer.android.com/reference/kotlin/android/app/job/JobScheduler)  
- [Android — Background Execution Limits](https://developer.android.com/about/versions/oreo/background)  
- [Android — ANR guidance](https://developer.android.com/topic/performance/vitals/anr)  
- [Android — Keep your app responsive](https://developer.android.com/topic/performance/anrs/keep-your-app-responsive)  
- [Android — Foreground service timeouts](https://developer.android.com/develop/background-work/services/fgs/timeout)  
- [Android — Thermal API](https://developer.android.com/games/optimize/adpf/thermal)  
- [Android — Bitmap memory management](https://developer.android.com/topic/performance/graphics/manage-memory)

---
