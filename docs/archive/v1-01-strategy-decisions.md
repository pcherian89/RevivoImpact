# Revivo Impact — strategy decisions (expert review, Nov 2026)

Source: the owner's strategy document (summary in `04-owner-strategy-summary.md`) reviewed by a strategy board
(product strategy, competitive intelligence, naming, sport-for-development M&E, website IA) and a prototype design board.

## What it is
**Revivo Impact** — sports programme delivery & impact for multi-site sports foundations, sport-for-development
organisations and CSR programme managers (secondary: federation development teams, club foundations, government sport
departments). An operational product used all year, not a quarterly reporting tool.
**Promise:** connect what a funded programme promised, delivered, spent and evidenced, so problems show up within weeks and
every reported number links back to its records.
**Tagline (only on its own page/prototype):** "Deliver sport. Show the evidence." — NOT "Demonstrate impact" (contradicts
the honesty rule) and NEVER "AI built for the pulse of sport" (retired; the website tagline is "Pulse of Sport. Mind of the Game.").
**Guardrail line on every page:** "Shows what was delivered and spent, with the evidence. It does not on its own prove social impact."

## Why customers would choose it (vs Upshot, Views, Submittable, Salesforce Nonprofit, Makerble)
Offline registers, dashboards, surveys and AI-drafted reports are already standard — match them, don't sell them. Own:
1. **Commitment-to-Evidence Chain** — promise → delivery → spend → exceptions → reviewed funder statement; click any number to
   its source records. Linking spending to delivery is the gap competitors leave.
2. **Early warnings that lead to action** — a missed session starts a workflow: reason → revised plan → approval → closed.
3. **Per-purpose consent shared with Revivo Pathway** — data, photos and stories consented separately; funders see only what
   consent allows (aggregates, never children's identities).
4. **Built for where incumbents aren't** — regional pricing, multilingual coach notes, shared low-cost phones.

## Rules
- No impact proof, SROI, "X% improvement" or causal claims; AI never produces numbers or approves anything; humans approve
  spending, recovery plans and reports (four-eyes).
- Not an accounting system, full grants suite, fundraising CRM, athlete platform or evaluation service.
- Global product: no India/Kerala positioning in the prototype or on the website. Currency: USD default with a demo switch
  (USD / GBP / INR), labelled illustrative. Check that fictional organisation and school names are not real organisations.
- Fictional-data banner on every screen. Children's data: design for UK GDPR and India's DPDP Act (verifiable parental
  consent) — design consideration only, never a compliance claim.
- No dashboard screenshots on the website; prototype screens live only inside the labelled demo.

## Website (later, only when the prototype exists and the owner approves)
Follow the Pathway pattern (website CLAUDE.md §5d): `revivo-impact` in products.ts linked to Sports Programme Management
(chip) + Funding & Impact Reporting; remove sports-programme-management from Pathway; `/impact` page + `/impact/demo`
(noindex); main nav becomes one "Prototypes" item → `/prototypes` (two entries); homepage proof line "See prototypes
working."; footer "Prototypes" group. Capability names stay (4×4). Website changes are done in the website chat, not here.

## Validation (runs alongside the build)
10 discovery interviews (foundations, S4D NGOs, CSR implementation partners, club foundations, federation development,
government officers); collect ≥3 real funder report templates to shape the funder statement; review Upshot's public help
docs and book demos honestly as Revivo; test prices in ₹ and £; data-protection review of the consent model; ask one CSR
funder whether it would require or pay for the tool. Production only after the owner's go/no-go (≥10 interviewed, ≥6
confirm the problem, ≥2 willing to test, ≥1 open to a paid pilot).
