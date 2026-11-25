# Revivo Impact — start here

**Status (25 Nov 2026): P1 is complete and waiting at the approval gate.** The founder answered all 18 decisions and
set a new direction (an open, controlled, two-sided ecosystem); every document has been updated. The P1 package, the
clickable shell and the open points are in **`09-p1-design-package.md`**. Do not start P2 until the founder approves.

This file is for a new session with no prior context. Read it fully, then follow the read order in §4.

## 1. What Revivo Impact is, in one breath

Revivo Impact is an **open, controlled, two-sided sports funding & sponsorship platform**. If you need funding for
sport, it helps you find it; if you want to fund sport, it helps you find credible opportunities and understand how
your support is used. Athletes, guardians, coaches, clubs and other organisations join free, build one reusable
sporting profile, discover funding and sponsors, apply or send structured requests. Foundations, companies, brands,
government bodies, federations and verified individual sponsors join, discover athletes, teams and initiatives, publish
scholarships, select fairly, make offers, and follow every funding relationship: committed, released, received, spent
and verified, sporting progress, review. **Discover → Apply or Connect → Fund → Track → Review.** Sports only.

It is Revivo Sportech's second prototype after **Revivo Pathway** (talent identification). The two are fully
independent products that share one design family.

- **Tagline** (on Impact's own surfaces only; founder decision D1): "Connecting sport with opportunity."
- **Supporting line:** "Find funding. Support sporting talent. See how your support is used."
- **Honesty line** (where impact is implied): "Delivery and spending records show what was delivered and spent; they do
  not on their own prove social impact."

## 2. The founder's ten P0 questions (answers updated after P1)

| # | Question | Answer |
|---|---|---|
| 1 | **What is Revivo Impact?** | An open, controlled, two-sided platform that connects sport with funding and manages the relationship before, during and after funding. One internal record, the funding agreement, sits at the centre; the interface names it by type (Scholarship award, Sponsorship agreement, Programme grant…). |
| 2 | **Who uses it?** | Seekers: adult athletes, guardians for under-18s, coaches, teams, clubs, academies, schools, federations, sports charities, programme operators. Funders: foundations, CSR teams, corporate sponsors, sports brands, government sports bodies, federations, institutional funders, verified individual sponsors. Organisations can be on both sides. Inside funders, reviewers, verifiers, approvers and finance staff are **permissions**. |
| 3 | **Who pays?** | Institutions first (subscriptions; hypotheses only). Athletes, parents and coaches never pay for basic use. No commissions or payments assumed. |
| 4 | **How do athletes and funders find each other?** | Both ways, across all participating organisations: seekers discover opportunities and sponsors (and send structured requests to funders that accept them); funders discover athletes, funding requests, teams and initiatives (and express interest or make offers). Funders also share links and accept nominations. Minors are never searchable; funders see only anonymised requests. |
| 5 | **How is funding awarded and tracked?** | Rules check eligibility; a reviewer verifies evidence fact by fact; a different person approves; the recipient accepts. Finance records each release (simulated); the recipient confirms receipt; updates add expenses, sporting progress or deliverables; a reviewer verifies; a person records the review. Every figure opens its records. |
| 6 | **How does it work without Revivo Pathway?** | Completely: own registration, profiles, verification, consent, discovery, agreements, reporting and admin. Pathway appears only as an optional, simulated import in Explore. |
| 7 | **How is it different?** | Hypotheses: sport-specific reusable profiles verified fact by fact; two-way discovery with safeguarding built in; nomination-native rounds; money states that reconcile; support followed to verified spending and sporting progress (no sponsorship marketplace checked does this, `08` §2.0). |
| 8 | **Strongest commercial use case?** | A foundation or company runs a sports scholarship round from a shareable link and tracks every award; its opportunity also appears in Discover. The prototype shows the whole two-sided ecosystem around it. |
| 9 | **Main demonstration journey?** | Journey A (13 steps, about 10 minutes): Tallwater publishes; Amira (19, judo, no prior relationship) registers, has her federation confirm her result, discovers 5 opportunities from 5 organisations, applies with help, is scored by two reviewers and selected by a third person, accepts, receives instalment 1, reports spending and progress, and Tallwater reviews. Journeys B–E: two-way discovery and sponsorship, programme funding, existing funding, coach and guardian safeguarding (`03` §5). |
| 10 | **What is excluded?** | Public donations and crowdfunding; real payments; free messaging; e-signatures; committee scoring and appeals; sponsorship inventory and valuation; non-sport funding; real logins; voice-note AI (`02` §13). |

## 3. Key facts to keep identical everywhere

| Item | Value (source of truth: `05`) |
|---|---|
| Main fictional funder | **Tallwater Sports Foundation** (replaces "Horizon Sports Foundation"; decision D5) |
| Main opportunity | **Emerging Athletes Scholarship**: $250,000 announced, up to 50 awards, tiers $3,500 / $4,500 / $5,000, ages 15–21, 9 sports, deadline Fri 30 Apr 2027 |
| Selection result | 143 applications → 46 offered ($214,500 = 27 × $5,000 + 13 × $4,500 + 6 × $3,500), 2 on the waiting list, 81 not selected, 14 not considered by rule |
| Signature athlete | **Amira Haddad**, 19, judo: requested $4,800, awarded $4,500 |
| Funders | 9 participating funders (`05` §2.1), Tallwater the principal one |
| Athlete funding requests | **Nadia Kovač**, 23, wheelchair racing: $5,200 in two line items; Oriel $2,000 + Marcus Halvorsen $1,200 (6 May); $1,400 covered from her own money; $600 still needed at 30 Jun. **Tiago Esteves**, 16, swimming (guardian Rosa Esteves; anonymised): $2,400; Oriel $1,500; $900 held for his pending Ostral application |
| Commercial sponsorship | Corvane Sportswear → **Jonah Reyes**, 22, sprinter: $6,000, 3 deliverables |
| Programme | **Play Every Day** (Lanternfield Community Sport, funded by Tallwater): $60,000 for 12 months; 108 of 120 sessions delivered this quarter; Greenpark behind |
| Demo clock | Mon 12 Apr 2027 · Thu 6 May 2027 · Wed 30 Jun 2027 |
| Currency | USD only (decision D4) |

## 4. Read order

1. `CLAUDE.md` (repository root) — rules and guard-rails.
2. This file.
3. `07-decisions-for-founder.md` — the founder's answers; then `09-p1-design-package.md`.
4. `02-product-definition.md` → `03-experience-and-screens.md` → `04-design-and-brand.md` →
   `05-fictional-world-and-data.md` → `06-technical-plan-and-phases.md`.
5. `01-product-strategy.md` and `08-research-and-competitors.md` for the reasons.
6. `90-founder-master-brief.md` — the founder's own words. Where it differs from `01`–`07`, those win; every
   difference is listed in `01` §11.
7. Brand references (read only, never edit; clone them read-only first): `pcherian89/Revivo_Webpage` (`CLAUDE.md`, the
   source files named in `04` §2, and the built Pathway prototype `public/pathway-demo.html`);
   `pcherian89/RevivoPathway` (`docs/03-design-brief.md`, `tools/tone/`).
8. `archive/` — the superseded v1 programme-monitoring concept. Reference only.

## 5. Where the work stands (P1 complete)

1. Decisions answered and recorded in `07`; every document updated (summary of changes: `09` §3).
2. The P1 package: `09` (index, expert review, open points), `02` (product definition), `03` (experience, screens,
   journeys), `05` (dataset and reconciliation), `10` (image plan), `06` (phases and acceptance criteria).
3. The clickable shell: `npm install && npm run dev` (or `npm run build` for one offline HTML file in `dist/`);
   previews in `docs/p1-previews/`.
4. **Next:** the founder approves the P1 package (or asks for changes). Then P2 starts (`06` §8).

## 6. Approval gates

| After | The founder approves | Then |
|---|---|---|
| **P1** Architecture and experience design | Object model, financial model, screens, navigation, names, image plan, and the answers to `07` | P2 starts |
| P2 Discovery and applications | Progress review only (non-blocking): Journey A to step 9 | P3 continues |
| **P3** Funding and progress | The financial model in use: all journeys end to end, invariants green | P4 starts |
| P4 Intelligence, reporting, polish | Progress review only (non-blocking): visual sign-off | P5 continues |
| **P5** QA and packaging | The finished prototype against the 29 acceptance criteria (`06` §9). **Nothing is published, linked from the website or shared publicly without this approval.** | Website work may be proposed in the website chat |

## 7. What not to do in this repository

Do not modify the Revivo website or Revivo Pathway. Do not deploy, buy, add paid APIs, add credentials or move real
money. Do not use real organisation names or real personal data. Do not commit or merge without the founder asking.
See `CLAUDE.md`.
