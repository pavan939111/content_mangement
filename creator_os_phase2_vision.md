# CreatorOS Phase 2 Vision — Agentic Connected Workspace

**Version:** 1.0  
**Date:** 2026-08-23  
**Status:** Vision & Context — not MVP scope  
**Related:** v2/creator_os_prd_v2.md, v2/creator_os_product_scope.md  

---

## 1. Clarification of Product Concept

CreatorOS is **not like Discord**. It is like **Claude with MCP for creators**.

In the same way that Claude connects to external tools through MCP, reasons about the user’s request, and executes actions across those tools, CreatorOS will become the **agentic workspace** for professional UGC creators.

The creator will be able to say:

> “Find my latest skincare campaign brief, link it to the footage folder, create a calendar event for delivery, and open CapCut with the final video.”

CreatorOS will interpret the request, select the right connected tools, ask for confirmation on writes, execute the actions, and return a receipt for every step.

This document captures that future vision so that every MVP decision today keeps that path open.

---

## 2. Phase 1 — MVP: Manual-First Connected Record

**Current product:** The creator manually connects Google Drive, Docs, Calendar, and Notion. They manually create connected content records, search across tools, view connection health, and trigger handoff actions with receipts.

This is the foundation. It proves:

- Users will connect their tools.
- A connected record saves time.
- Connection health and action receipts build trust.
- Cross-tool search is valuable.

The MVP is **manual-first** because:

- Mobile agent UX and LLM reliability are still maturing.
- We must validate the core problem before adding an agent layer.
- The local-first and connection-reliability layers must be rock solid first.

---

## 3. Phase 2 — Agentic Command Layer

In Phase 2, CreatorOS adds an **agentic command layer** on top of the MVP foundation.

### 3.1 Core Concept

A command/action bar or assistant panel where the creator can type or speak an instruction in natural language.

Example instructions:

- “Link my current Drive folder to this content record.”
- “Create a Google Doc from my script.”
- “Schedule a delivery reminder in Calendar.”
- “Open the latest CapCut project for this campaign.”
- “Find all briefs related to Brand X and attach them to the current record.”
- “Prepare a delivery package and send me the review link.”

CreatorOS will:

1. Parse the instruction into a structured action plan.
2. Identify required connectors and permissions.
3. Show a confirmation card before executing.
4. Execute actions via the backend connector service.
5. Return a step-by-step receipt with success/failure states.

### 3.2 Intent Engine

The agent layer will include:

- A deterministic intent parser for common creator commands.
- Optional LLM assistance for ambiguous or multi-step requests.
- A policy engine that decides which actions require explicit confirmation.
- A capability-aware planner that knows what each connected tool can and cannot do.
- Fallback to manual handoff when automation is not safe or possible.

### 3.3 Approval and Safety

- Reads and searches may run automatically.
- Writes, exports, schedules, deliveries, and publishing actions require confirmation.
- The user can approve each action individually or approve a whole safe batch.
- Every action remains auditable through the existing receipt system.
- The system never silently executes multi-step workflows without consent.

### 3.4 Interaction Model

The agent appears as:

- A persistent “Ask or Command” bar accessible from any screen.
- Context-aware: it knows the currently open record, connected tools, and recent search.
- It proposes a plan, not just a single action.
- It shows progress and partial success clearly.
- It never pretends to complete an action it cannot verify.

---

## 4. Phase 3 — Advanced Automation & Reasoning

Phase 3 extends the agent with:

- Multi-step saved recipes and automations.
- More advanced natural language understanding.
- Deeper integration with MCP where stable.
- Proactive suggestions: “Your Drive token will expire soon. Reconnect now?”
- Automated delivery packaging, repurposing suggestions, and performance review prompts.

This phase is only possible after:

- The connected record and receipts are trusted.
- Connection health and recovery are proven.
- Agentic actions are accepted by creators with appropriate controls.

---

## 5. Relationship to MCP

MCP remains an **internal implementation mechanism**, not the user-facing product.

CreatorOS may use MCP-compatible adapters for certain providers in Phase 2/3 if those providers expose stable remote MCP servers. Direct provider APIs remain the primary path.

The user-facing story is never “MCP.” It is:

> “Connect your tools, tell CreatorOS what you want, and it handles the rest—with receipts you can trust.”

---

## 6. Product Boundary Principles

1. The MVP never blocks the Phase 2 vision.
2. Every manual action in Phase 1 becomes an automated/agent-capable action in Phase 2.
3. Approval, health, and receipts are non-negotiable.
4. Raw media never leaves user storage.
5. The user is always in control; automation assists, it does not replace judgment.

---

## 7. Change Log

| Version | Date | Summary |
|---|---|---|
| 1.0 | 2026-08-23 | Created Phase 2 agentic vision document. |
