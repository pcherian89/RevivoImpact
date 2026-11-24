# Revivo Impact — start here

**Goal now:** a simple, clickable, end-to-end **demo prototype** on fictional data (English) that a funder or programme
director understands in about 10 minutes. Not a real system: no real data, nothing online without the owner's approval.

**What it is:** Revivo Impact connects what a funded sports programme promised, delivered, spent and evidenced, so problems
show up within weeks and every reported number links back to its records. Revivo's second prototype, after Revivo Pathway.

## Read, in order
1. `docs/01-strategy-decisions.md` — positioning, differences from competitors, rules, what not to claim. Don't re-decide.
2. `docs/02-prototype-brief.md` — the journey, the 13 screens, the Commitment-to-Evidence Chain, AI moments, fictional
   data (Horizon Sports Foundation, "Play Every Day", 6 sites, 108/120 sessions…), images, definition of done.
3. The design system: `pcherian89/RevivoPathway` → `docs/03-design-brief.md` (tokens, fonts, signal motifs, photo style,
   Daylight theme). Revivo Impact must look like the same family as Revivo Pathway and the Revivo website
   (`pcherian89/Revivo_Webpage`), while feeling distinct: Pathway follows a child's journey; Impact follows a
   programme's chain.
4. Background only: `docs/04-owner-strategy-summary.md`.

## How to build it
- **Same approach as Revivo Pathway:** reuse its shell and patterns — guided journey with "Show me" / "I'll do it", explore
  by role, demo clock, reset, Daylight theme, per-purpose consent, four-eyes approvals, audit trail, fictional-data banner —
  copied from `pcherian89/RevivoPathway` (and its live build at `pcherian89/Revivo_Webpage` → `public/pathway-demo.html`).
  Never edit those repositories; copy from them.
- **Output:** one self-contained HTML file with seeded, deterministic data (like `pathway-demo.html`), so it can later sit on
  the website at `/impact/demo`.
- **Keep it simple:** 13 screens + 2 shared panels, one connected workflow (not six dashboards). Every screen has one job.
  If something adds complexity without helping the 10-minute story, leave it out.

## First tasks, in order
1. Set up the project from the Pathway prototype's shell and design system; confirm it builds to one HTML file.
2. Seed the fictional data exactly as in the brief (numbers must reconcile) with the USD / GBP / INR demo switch.
3. Programme Home + the Commitment-to-Evidence Chain with click-through to source records.
4. Coach Today + Session register on a phone (offline feel, under a minute), voice-note summary.
5. Greenpark early warning → Site detail → recovery plan → second-person approval.
6. Budget & spend (expense with document → approval; spend follows delivery).
7. Consent (a parent withdraws photo consent on a phone → photos leave the report) + Evidence library.
8. Report builder (AI draft from verified records only, every figure linked) → review → four-eyes approval → Funder view
   (aggregates only) → funder decision; Audit trail; "Ask about this programme".
9. Guided journey (10 steps, ~10 minutes), explore by role, reset; Daylight theme; phone, tablet and laptop checks.
10. Images (the owner generates them from the brief's prompts; dark placeholders until then), demo script, final review.

## Working rules
- The owner is not technical: explain each step in plain language, show screenshots on phone, tablet and laptop, say what's next.
- Work on a branch; don't merge to main, put anything online, buy services or add credentials without asking.
- Never: impact-proof or causal claims, SROI, AI-produced numbers, real organisation names, India-only positioning,
  "AI built for the pulse of sport".
