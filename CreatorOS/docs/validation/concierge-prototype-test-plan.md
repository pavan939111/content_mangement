# Concierge Prototype Test Plan — CreatorOS v2

**Version:** 1.1
**Date:** 2026-08-23
**Goal:** Validate the connected content record with 8–10 professional UGC creators using a genuinely human-powered concierge prototype before building the MVP cloud integration plane.

## 1. Prototype Definition

This is a **concierge prototype**, not a functional software prototype.

- The operator (human) maintains a lightweight mobile-friendly web page per participant.
- The page displays one content record at a time.
- The operator performs external searches manually using participant-shared access.
- The operator sends participants search answers and receipts through the existing record.

No OAuth, no provider APIs, no backend, no job queue.

## 2. Tooling

- Airtable or Notion for operator-maintained records.
- A simple public web view per record (e.g., Notion share link, Carrd, Softr).
- The participant shares a Drive folder and a Notion page manually with the operator.
- The operator finds and links source material by hand.

## 3. Test Flow

### Session 1 — Setup (20 minutes)

1. Participant shares one real campaign folder from Google Drive and one Notion brief page with the operator.
2. Operator creates a connected content record in Airtable/Notion and shares a read-only public link.
3. Participant views the record on their phone.
4. Operator adds the brief link, footage folder link, due date, and campaign name.
5. Participant requests a search: "Find my previous brand brief for skincare."
6. Operator performs the search manually and replies within 30 minutes with a result and source.

### Session 2 — Follow-up (next production cycle, 1–2 weeks later)

7. Participant opens the record again before the next campaign.
8. Operator asks: Did the record save time? Would you want this for every deliverable?
9. Operator logs any connection-style issue manually (e.g., "folder moved," "brief link expired").
10. Participant is asked to commit to a paid pilot using a payment link with card on file.

## 4. Success Metrics

| Metric | Target |
|---|---|
| Participated in concierge workflow | ≥8/10 |
| Used record for real campaign | ≥8/10 |
| Found search/context valuable | ≥6/10 |
| Returned for next campaign | ≥5/10 |
| Paid or committed to paid pilot | ≥5/10 |

## 5. Evidence

The prototype does not prove OAuth feasibility. It tests whether the **connected record and cross-tool context** are valuable enough to pay for.

OAuth feasibility is a separate technical spike, not part of this validation.

## 6. Change Log

| Version | Date | Summary |
|---|---|---|
| 1.1 | 2026-08-23 | Rescoped to genuine concierge prototype, removed OAuth and backend scope. |
