# CreatorOS Vision Document — v2

**Version:** 2.0  
**Date:** 2026-08-23  
**Status:** Draft for Validation & Alignment  
**Previous Version:** v1.0 — Local-First Content Workspace  

---

## 1. Vision Statement

> **CreatorOS is the trusted, mobile-native content record for professional UGC creators.**  
> It connects the tools they already use—Google Drive, Docs, Calendar, and Notion—into one clear, searchable workspace.  
> For every brand deliverable, CreatorOS links the brief, script, source files, design, edit handoff, and delivery receipt, so creators always know what’s current, what’s missing, and what happens next.

---

## 2. The Shift from v1 to v2

| | v1 | v2 |
|---|---|---|
| Primary value | Local-first content library | Connected content record and orchestration layer |
| Core object | Content Item | Connected Content Record with external sources & receipts |
| Integration model | References and manual links | OAuth-connected tools + deep links/share sheets |
| Target user | General solo short-form creators | Professional UGC creators with brand deliverables |
| Product position | "System of record" | "Trusted coordination layer" |
| Network dependence | Offline-first always | Mobile-first, cloud-assisted, offline for local capture |
| Competitive frame | Notion alternative | Complement to Notion, Drive, Canva, CapCut, schedulers |

---

## 3. Problem Statement

Professional UGC creators manage client work across multiple disconnected tools:

- Briefs and scripts live in Google Docs, Notion, or DMs.
- Raw footage and assets live in Drive folders.
- Designs live in Canva.
- Edits live in CapCut.
- Deadlines live in Google Calendar.
- Delivery confirmation lives in email and Drive links.

**The result:**

- Creators lose time searching for "the current brief" or "the latest footage folder."
- Handoffs between tools are manual and unverifiable.
- Connection breaks (expired Drive token, stale Notion page) go unnoticed until they cause a missed delivery.
- There is no single record that answers: *What is this content? Where is everything? What's next? Did it go out?*

This creates stress, missed deadlines, and lost trust with brands.

---

## 4. Target User

### Primary persona: Professional UGC Creator

- Creates paid short-form video deliverables for 2–8 active brands.
- Delivers 4–20 assets per month.
- Uses Google Drive/Docs/Calendar, Notion, Canva, CapCut, and native social apps.
- Works primarily from mobile.
- Feels the cost of disorganization directly in missed deadlines, revision loops, and client dissatisfaction.

### Secondary persona: Freelance Social Media Manager (future)

- Manages 3–10 client accounts.
- Has higher willingness to pay but expects approvals, reporting, and permissions.
- Not the initial MVP target.

---

## 5. Market Opportunity

- The creator economy is large, but the addressable wedge is **professional UGC creators with active client work**.
- Existing "Creator OS" products are mostly **Notion templates**—manual dashboards that don't connect to real files, edits, or publishing state.
- Scheduling tools like Buffer and Metricool manage **publishing**, not upstream production context.
- No current product combines a **connected content record, cross-tool search, connection health, and human-readable handoff receipts** in a mobile-first experience.

**The white space is clear:** a neutral coordination layer that connects existing tools rather than replacing them.

---

## 6. Product Concept

### 6.1 The Connected Content Record

Each content record represents one UGC deliverable and contains:

- Client / brand
- Campaign / brief reference
- Script or hook document
- Raw footage folder
- Canva design link or exported asset
- CapCut handoff or export reference
- Calendar due date
- Delivery link and status
- Connection health indicators for each linked source
- Action receipts: a timestamped log of what happened, where, and when

### 6.2 Cross-Tool Search

A single mobile search bar retrieves:

- Scripts, briefs, notes, and captions
- Drive files and folders
- Notion pages
- Calendar events
- Linked content records

Every result shows **source, last updated, and current status**.

### 6.3 Connection Health

Each connected account shows:

- Healthy / stale / needs reauthorization / error
- Last successful sync
- Affected content records
- One-tap recovery action
- Verification receipt after reconnection

This prevents silent breakage and builds trust.

### 6.4 Action Receipts

Every cross-tool action is recorded:

- **Opened CapCut handoff** at 10:42 PM
- **Linked Drive folder** at 10:47 PM
- **Copied delivery caption** at 11:02 PM
- **Marked delivered** at 11:15 PM

Creators always know what actually happened, even if the external tool can’t confirm it.

---

## 7. MVP Scope

### Included

- Google Drive, Google Docs, Google Calendar, and Notion connectors via OAuth
- One Connected Content Record type with stages: `Idea → Scripting → Filming → Editing → Ready → Delivered`
- Cross-tool search over connected sources + local index
- Connection Health Center
- Action Receipts for handoffs and internal status changes
- Canva/CapCut/Apple Notes handoffs via deep links, share sheets, and file pickers
- Mobile-first experience with offline local capture
- Basic delivery review state with shareable record link

### Excluded (Phase 2+)

- Social publishing APIs / scheduling
- Analytics dashboards
- Collaboration approvals for teams
- In-app video/design editing
- AI content generation
- MCP configuration or developer surfaces
- General automation builder

---

## 8. Key Differentiators

| Differentiator | Why It Matters |
|---|---|
| Connected content record | Links real external sources, not manual notes. |
| Cross-tool search | Finds brief, files, and edits in seconds. |
| Connection health | Prevents stale-source failures and shows impact. |
| Action receipts | Turns handoffs into verifiable history. |
| Mobile-native | Designed for UGC creators who work from their phone. |
| Tool-neutral | Does not compete with Canva, CapCut, Notion, or schedulers. |

---

## 9. Competitive Positioning

**Against Notion templates:**  
*“Notion doesn’t know when your Drive file changes or your Canva export finishes. CreatorOS does.”*

**Against Buffer/Metricool:**  
*“They manage publishing. We manage everything before and around publishing—so you always know what’s current, what’s missing, and what happens next.”*

**Against Raycast/MCP:**  
*“You don’t need to configure servers or learn MCP. You need one connected record that works from your phone.”*

**Against Repurpose.io:**  
*“They automate distribution. We connect the upstream work and produce receipts you can trust.”*

---

## 10. Pricing Strategy

| Plan | Price | Key Limits |
|---|---:|---|
| Free | $0 | 1 workspace, 2 connected sources, 10 active records, basic search, manual sync |
| Solo | $12/month annual / $15 monthly | Unlimited records, all Google/Notion connectors, connection health, action receipts, saved searches |
| Pro | $20/month annual / $24 monthly | Higher sync frequency, advanced cross-tool search, receipt history/export, multiple brands/workspaces |

**Pricing principle:** Do not price per channel. Price by connected workspace and record capacity.

---

## 11. Go-To-Market

**Initial channel:** UGC creator communities, creator education content, and portfolio/workflow discussions.

**Narrative:**  
*“Turn a brand brief into a script, footage folder, edit handoff, and delivery link—without hunting through Drive, Notes, and DMs.”*

**First-session goal:**  
Within 5 minutes, a creator should:

1. Connect Google Drive or Notion.
2. Create one content record from a real campaign.
3. Attach a brief, asset folder, and due date.
4. See a search result that would otherwise take five minutes to find.
5. Get a receipt for a handoff.

---

## 12. Success Metrics

| Metric | Target |
|---|---|
| OAuth connection completion (2+ sources) | ≥50% of activated users |
| Real campaign record created | ≥40% of activated users |
| Unprompted return next production cycle | ≥30% of activated users |
| Paid conversion at $12–15/month | ≥5% of free users |
| Connection health issue detected & resolved | ≥1 per active user/month |
| Time to locate a specific brief/asset | ≤30 seconds |

---

## 13. Validation Plan

Before full build, validate with **20–30 professional UGC creators**:

1. **User interviews:** recent lost asset, broken link, or missed deadline stories.
2. **Concierge prototype:** Google Drive + Docs + Notion connected record, search, receipts.
3. **Paid pilot:** 5–10 creators at $10–20/month after using it for a real campaign.
4. **Retention test:** unprompted return for next production cycle.

**Go/no-go threshold:**

- At least 10 users connect two or more sources.
- At least 8 use a record for a real campaign.
- At least 6 return unprompted.
- At least 5 pay or commit to a pilot.
- Qualitative feedback attributes value to cross-tool clarity, not AI writing.

---
