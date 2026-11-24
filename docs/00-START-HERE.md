# Revivo Impact — start here

**Status (24 Nov 2026): P0, the independent product and strategy review, is complete. Nothing has been built.
The next session starts P1 by presenting `docs/07-decisions-for-founder.md` to the founder for approval.**

This file is for a new session with no prior context. Read it fully, then follow the read order in §4.

## 1. What Revivo Impact is, in one breath

Revivo Impact is a **sports funding & sponsorship platform**. A foundation or company publishes a scholarship or grant,
shares one link, receives applications from athletes (or their guardians and coaches), checks eligibility by rule,
reviews evidence, and approves awards. It then follows every award: what was committed, what was released, what was
spent and checked, and what sporting progress followed, until a person decides to continue, renew or close it. The same
lifecycle covers funded community programmes, athlete-published funding Needs, direct Offers from funders, and funding
that already existed before Revivo.

It is Revivo Sportech's second prototype after **Revivo Pathway** (talent identification). The two are fully
independent products that share one design family.

- **Tagline** (on Impact's own surfaces only; founder decision D1): "Connecting sport with opportunity."
- **Supporting line:** "Find funding. Support sporting talent. See how every award is used."
- **Honesty line** (where impact is implied): "Delivery and spending records show what was delivered and spent; they do
  not on their own prove social impact."

## 2. The founder's ten P0 questions, answered plainly

| # | Question | Answer |
|---|---|---|
| 1 | **What is Revivo Impact?** | Software that runs sports funding from the first application to the last receipt. One record, the **Award**, sits at the centre: every route to funding creates an Award, and every Award is followed the same way (ledger → updates and evidence → review). |
| 2 | **Who uses it?** | People seeking funding: adult athletes, guardians acting for under-18s, coaches (with limited powers a guardian grants), academies, clubs, federations, schools and programme operators. People providing funding: foundations, company CSR teams, federations' development departments, government sport bodies and, lightly, commercial sponsors. Inside funding organisations, reviewers, verifiers, approvers and finance staff are **permissions**, not separate apps. |
| 3 | **Who pays for it?** | The funder. The first buyer is a foundation or company CSR team that runs an athlete scholarship or grant round. Athletes, guardians and coaches never pay. Academies and federations may later pay for advanced management. All prices are hypotheses to test (`01` §6). |
| 4 | **How do athletes and funders find each other?** | Mainly through the funder's own link: the funder publishes an Opportunity and shares it; applicants arrive with no marketplace needed. Federations and clubs can also **nominate** athletes. Secondary, and initially within a funder's own network: an athlete (or a guardian) publishes a **Need**, and a funder finds it in Discover and sends an **Offer**. Minors are never searchable as people; funders see only a de-identified Need card. |
| 5 | **How is funding awarded and tracked?** | Rules check eligibility; a reviewer verifies evidence field by field and scores a short rubric; a *different* person approves; the recipient accepts the agreement. Finance records each release (simulated, never real money); the recipient confirms receipt; quarterly **Updates** add expenses with receipts and sporting progress; a reviewer verifies spend; a person records the review decision (continue, continue with conditions, pause the next release, close, invite to renew). Every figure opens its source records. |
| 6 | **How does it work without Revivo Pathway?** | Impact has its own registration, profiles, guardians and coaches, consent, verification records, audit and data. The signature journey starts with an athlete registering on Impact. Pathway appears only as an optional, simulated "import verified records" action on a profile, with consent, and can be removed. |
| 7 | **How is it different from existing platforms?** | Generic grant tools (Submittable, Foundant, SmarterSelect, Good Grants) already run intake and review; sport-for-development tools (Upshot, Views) already monitor delivery. Revivo Impact's hypotheses: field-level verification by the people who know the athlete; nomination-native rounds; guardian-proxied minors; money states that reconcile; and funding that follows sporting progress to a renewal decision. These are hypotheses to validate, not claims (`01` §5). |
| 8 | **What is the strongest commercial use case?** | A foundation or CSR team runs an athlete scholarship round end to end from a shareable link, then follows each award to released funds, verified spend and sporting progress. Programme funding and monitoring (Play Every Day at Greenpark) is the second module. |
| 9 | **What is the main demonstration journey?** | Journey A, "Find and secure a scholarship": 13 steps, about 10 minutes. Tallwater Sports Foundation publishes the Emerging Athletes Scholarship; Amira Haddad (19, judo) registers on Impact, is matched, applies with help, is verified, selected, accepts, receives instalment 1, reports expenses and progress, and Tallwater reviews. Journeys B–E are short and show Needs and Offers, programme monitoring, existing funding, and guardians and coaches (`03` §5). |
| 10 | **What is excluded to keep it simple?** | Individual donors, individual sponsors and crowdfunding; real payments, tax receipts and currency exchange; free messaging; e-signatures; multi-stage committee scoring and appeals; sponsorship inventory, valuation and activation (a possible future "Revivo Partner"); clawback workflows; translations, native apps, real logins; v1's voice-note AI. Full list: `02` §12. |

**The founder's review request (ten checks) is answered in:** vision and website fit, capability changes and website
presentation (`01` §9, decisions D2–D3); name and tagline (`01` §8, D1, D18); coherence (`01` §3); missed stakeholders
(`01` §7); simplification (`01` §3, `02` §12); independence from Pathway (`02` §11); commercial credibility and
differentiation (`01` §5–6); quality versus Pathway (`04`, `06` §9); presenting both products on the website (`01` §9).

## 3. Key facts to keep identical everywhere

| Item | Value (source of truth: `05`) |
|---|---|
| Main fictional funder | **Tallwater Sports Foundation** (replaces "Horizon Sports Foundation"; decision D5) |
| Main opportunity | **Emerging Athletes Scholarship**: $250,000 announced, up to 50 awards, tiers $3,500 / $4,500 / $5,000, ages 15–21, 9 sports, deadline Fri 30 Apr 2027 |
| Selection result | 143 applications → 46 offered ($214,500 = 27 × $5,000 + 13 × $4,500 + 6 × $3,500), 2 on the reserve list, 81 not selected, 14 not considered by rule |
| Signature athlete | **Amira Haddad**, 19, judo: requested $4,800, awarded $4,500 |
| Athlete Need | **Tiago Mendes**, 16, swimming (guardian Rosa Mendes): $2,400 competition travel; Oriel Freight Group pledges $1,500; $900 remaining |
| Programme | **Play Every Day** (Lanternfield Community Sport, funded by Tallwater): $60,000 for 12 months; 108 of 120 sessions delivered this quarter; Greenpark behind |
| Demo clock | Mon 12 Apr 2027 · Thu 6 May 2027 · Wed 30 Jun 2027 |
| Currency | USD only (decision D4) |

## 4. Read order

1. `CLAUDE.md` (repository root) — rules and guard-rails.
2. This file.
3. `07-decisions-for-founder.md` — what needs approval.
4. `02-product-definition.md` → `03-experience-and-screens.md` → `04-design-and-brand.md` →
   `05-fictional-world-and-data.md` → `06-technical-plan-and-phases.md`.
5. `01-product-strategy.md` and `08-research-and-competitors.md` for the reasons.
6. `90-founder-master-brief.md` — the founder's own words. Where it differs from `01`–`07`, those win; every
   difference is listed in `01` §11.
7. Brand references (read only, never edit): `/home/user/Revivo_Webpage/CLAUDE.md` and its source files named in
   `04` §2; `/home/user/revivopathway/docs/03-design-brief.md`; the built Pathway prototype
   `/home/user/Revivo_Webpage/public/pathway-demo.html`.
8. `archive/` — the superseded v1 programme-monitoring concept. Reference only.

## 5. The first P1 steps

1. **Present the decisions.** Show the founder `07-decisions-for-founder.md` in plain language: each decision, the
   recommended default and what changes if they choose otherwise. Ask for one reply: "approve all defaults" or a list
   of changes. Record the answers in `07` (a "Founder's answer" line under each decision) and update every affected
   document so they stay consistent.
2. **Create the work branch** (for example `p1-architecture`) and keep `main` untouched.
3. **Produce the P1 deliverables** (`06` §8): the object and ledger specification; the consent and access matrix;
   the information architecture and wireframes of the 22 screens at 375px and 1440px; scripted journeys A–E; the
   seed specification with reconciliation tables; name checks for the remaining fictional names; confirmation of the
   image asset plan; and a clickable shell copied from Pathway's (start screen, banner, role pill, demo clock, Reset,
   Daylight) that builds to one HTML file.
4. **Show the founder** the wireframed Journey A on phone, tablet and laptop screenshots, and the reconciliation
   tables.
5. **Stop at the P1 approval gate.** Do not start P2 until the founder approves the model, screens, names and
   decisions.

## 6. Approval gates

| After | The founder approves | Then |
|---|---|---|
| **P1** Architecture and experience design | Object model, financial model, screens, navigation, names, image plan, and the answers to `07` | P2 starts |
| P2 Discovery and applications | Progress review only (non-blocking): Journey A to step 9 | P3 continues |
| **P3** Funding and progress | The financial model in use: all journeys end to end, invariants green | P4 starts |
| P4 Intelligence, reporting, polish | Progress review only (non-blocking): visual sign-off | P5 continues |
| **P5** QA and packaging | The finished prototype against the 20 acceptance criteria. **Nothing is published, linked from the website or shared publicly without this approval.** | Website work may be proposed in the website chat |

## 7. What not to do in this repository

Do not modify the Revivo website or Revivo Pathway. Do not deploy, buy, add paid APIs, add credentials or move real
money. Do not use real organisation names or real personal data. Do not commit or merge without the founder asking.
See `CLAUDE.md`.
