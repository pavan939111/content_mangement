# Global Requirement ID Registry

**Product:** CreatorOS  
**Version:** 1.0  
**Purpose:** This registry establishes a **global, conflict-free naming convention** for all requirement IDs across functional and non-functional documents. It resolves the ID collisions identified during verification and provides a mapping from legacy short IDs to new fully-qualified IDs.

---

## 1. Naming Convention

All requirement IDs shall follow this pattern:

```
[Document Prefix]-[Module Prefix]-[Short ID]
```

Where:

- **Document Prefix** = FRS / NFR / PRD / ARCH
- **Module Prefix** = short code unique within that document type (e.g., `FRS02`, `FRS12`, `NFR05`)
- **Short ID** = original short ID (e.g., `CAP`, `ACC`, `INT`)

**Example:**

- Legacy: `CAP-01`
- New: `FRS02-CAP-01`

This ensures IDs are globally unique and traceable.

---

## 2. Module Prefix Registry — Functional Documents

| FRS Module | Module Prefix | Short ID Prefixes Used |
|---|---|---|
| FRS-01 Core Content Record | `FRS01` | `CR`, `CRM` |
| FRS-02 Idea Capture | `FRS02` | `CAP`, `CAPM` |
| FRS-03 Asset Library & Search | `FRS03` | `AS`, `ASM` |
| FRS-04 Repurposing Clip Library | `FRS04` | `RP`, `RPM` |
| FRS-05 Calendar & Readiness | `FRS05` | `CAL`, `CALM` |
| FRS-06 Publishing Handoff | `FRS06` | `PUB`, `PUBM` |
| FRS-07 Integrations & Storage Connections | `FRS07` | `INT`, `INTM` |
| FRS-08 Offline & Sync | `FRS08` | `OFF`, `OFFM` |
| FRS-09 Onboarding, Settings & Account Management | `FRS09` | `ON`, `SET`, `ACC`, `SUP` |
| FRS-10 Script & Text Editor | `FRS10` | `SE` |
| FRS-11 Media Preview & Playback | `FRS11` | `MP` |
| FRS-12 Notifications, Reminders & Trash/History | `FRS12` | `NOT`, `REM`, `TRASH`, `UNDO`, `HIST`, `ACC` |
| FRS-13 Data Import/Export & Backup/Restore | `FRS13` | `EXP`, `IMP`, `BACK`, `REST`, `INT`, `OFF` |
| FRS-14 Subscription & Monetization | `FRS14` | `SUB` |
| FRS-15 Analytics & Performance (Phase 2) | `FRS15` | `AN` |
| FRS-16 Collaboration & Approval (Phase 2) | `FRS16` | `COL` |

---

## 3. Module Prefix Registry — Non-Functional Documents

| NFR Document | Module Prefix |
|---|---|
| NFR-01 Performance | `NFR01` |
| NFR-02 Offline Reliability & Sync | `NFR02` |
| NFR-03 Storage & Bandwidth | `NFR03` |
| NFR-04 Battery, Thermal & Memory | `NFR04` |
| NFR-05 Security & Privacy | `NFR05` |
| NFR-06 Accessibility & Usability | `NFR06` |
| NFR-07 App Size & Resource Usage | `NFR07` |
| NFR-08 Platform Integration & Remote Config | `NFR08` |
| NFR-09 Reliability & Data Integrity | `NFR09` |
| NFR-10 Localization, Device Compatibility & Theming | `NFR10` |
| NFR-11 Maintainability, Observability & Compliance | `NFR11` |

---

## 4. Collision Resolution Map

The following legacy IDs collided across modules. This mapping disambiguates them.

| Legacy ID | Collides With | New Fully-Qualified ID |
|---|---|---|
| `ACC-01` (FRS-09 Account) | `ACC-01` (FRS-12 Accessibility) | `FRS09-ACC-01` |
| `ACC-02` (FRS-09 Account) | `ACC-02` (FRS-12 Accessibility) | `FRS09-ACC-02` |
| ... | ... | ... |
| `INT-01` (FRS-07 Integrations) | `INT-01` (FRS-13 Integrity) | `FRS07-INT-01` |
| `INT-02` (FRS-07 Integrations) | `INT-02` (FRS-13 Integrity) | `FRS07-INT-02` |
| `OFF-01` (FRS-08 Offline & Sync) | `OFF-01` (FRS-13 Offline & Performance) | `FRS08-OFF-01` |
| `OFF-02` (FRS-08 Offline & Sync) | `OFF-02` (FRS-13 Offline & Performance) | `FRS08-OFF-02` |
| ... | ... | ... |

---

## 5. Usage Rules

1. **New IDs** MUST use the fully-qualified form: `FRS02-CAP-01`, `NFR05-SEC-01`.
2. **Existing legacy IDs** in documents should be gradually migrated. Until migrated, this registry serves as the disambiguation authority.
3. **Traceability matrices** must use the fully-qualified IDs to avoid ambiguity.
4. When referencing a requirement from another document, use the fully-qualified ID.

---

## 6. Next Steps

- Update existing FRS/NFR documents to use the new IDs progressively.
- Use this registry in all traceability matrices.
- Add this registry to the README.


## v2 Prefix Registry

| v2 Module | Prefix |
|---|---|
| FRS-01 v2 Connected Content Record | CCR |
| FRS-03 v2 Cross-Tool Search | CTS |
| FRS-06 v2 Handoff & Action Receipts | HAR |
| FRS-07 v2 Connector Framework | CNF |
| NFR-02 v2 Offline & Sync | OFS |
| NFR-03 v2 Storage & Bandwidth | SWB |
| NFR-05 v2 Security & Privacy | SPC |
| NFR-08 v2 Platform Integration | PIC (rename from INT) |
| NFR-09 v2 Reliability & Integrity | RIN |
| NFR-11 v2 Maintainability/Observability | MOC |
| NFR-12 v2 Quality/Cost/Capacity | QCC |