# Revivo Impact — product strategy

Consolidated from the P0 expert review (Nov 2026): Panel A (market, competitors, commercial model, name), Panel B
(product, UX, architecture, finance, safeguarding, data, build plan) and Panel C (brand, website, design, imagery,
copy), reconciled by the lead product writer. These are analytical perspectives; no outside experts were consulted.
Evidence and sources are in `08-research-and-competitors.md`. Labels: **[V]** verified in a primary or official
source, **[J]** judgement.

**Revised in P1 (25 Nov 2026) after the founder's decisions (`07`).** The founder kept the institutional commercial
priority but made the product an **open, controlled, two-sided ecosystem** in scope: open registration and two-way
discovery are mandatory and fully demonstrated, not limited to a funder's network. Sections 1, 2, 3, 4, 8, 9, 10 and
11 are updated accordingly; earlier reasoning is kept where it still applies.

## 1. Positioning

**Revivo Impact is an open, controlled, two-sided sports funding and sponsorship platform.** Anyone seeking
legitimate sporting support (athletes, guardians, coaches, teams, clubs, academies, schools, federations, sports
charities, programme operators) can join free, build one reusable sporting profile and discover funding from many
participating organisations. Anyone wishing to provide sporting support (foundations, CSR teams, corporate sponsors,
sports brands, government sports bodies, federations, institutional funders and verified individual sponsors) can join,
discover credible athletes, teams and initiatives, publish scholarships and funding calls, select fairly, and follow
every funding relationship from commitment to release, spending, sporting progress and review.

It solves three connected problems: seekers struggle to find appropriate funding; funders struggle to identify
credible athletes and initiatives; funders struggle to understand how their money is used. **Discover → Apply or
Connect → Fund → Track → Review.**

- **Category descriptor** (eyebrow on Impact's own surfaces): "Sports Funding & Sponsorship Platform" (set in the
  `.label` style, which renders it in capitals), matching Pathway's "Talent Identification & Athlete Development
  Platform".
- **One-line explanation** for buyers: "Revivo Impact runs sports scholarships, grants and programme funding, from
  application to evidence."
- **Plain explanation** (the founder's): "If you need funding for sport, Revivo helps you find it. If you want to fund
  sport, Revivo helps you find credible opportunities and understand how your support is being used."
- **Sports only.** Not a general scholarship, education, grant-management, charitable-fundraising or crowdfunding
  platform (`02` §4.4).
- **Honesty line**: "Delivery and spending records show what was delivered and spent; they do not on their own prove
  social impact."
- **Fit with Revivo Sportech.** Revivo is "a global AI solutions-building company for the complete sports ecosystem"
  (website). Funding is a system every part of that ecosystem depends on. On the website Revivo Impact has one home,
  the capability "Funding, Grants & Programmes" in the area "Funding & Governance" (§9); its other uses (athlete
  support, sponsorship, programmes) are described on its own page. Like Pathway, it is shown as proof of what Revivo
  builds, never as a product catalogue.
- **Global, not regional.** No India- or Kerala-specific positioning. USD in the prototype; other currencies only as
  separately authored datasets (decision D4).

## 2. Users and buyers

| | Who | Pays? | What they need from Revivo Impact |
|---|---|---|---|
| **Buyer 1 (headline)** | Foundations and company CSR teams running athlete scholarships or grants | Yes (hypothesis) | Launch a round from a link, select fairly with a defensible record, follow each award to verified spend and progress, report to a board or CSR committee |
| **Buyer 2 (module two)** | The same funders, plus federation development departments and government sport bodies, funding programmes | Yes (hypothesis) | Follow programme delivery (sessions, attendance counts, missed sessions, recovery plans), spending and evidence; aggregates only |
| Buyer 3 (later) | Academies and federations managing many athletes' funding, nominations and verification | Possibly, advanced plan | Nominate, verify results, manage athletes' applications and awards |
| Buyer 4 (to validate) | Corporate sponsors and sports brands (partnership teams) | Possibly (hypothesis) | Discover adult athletes, teams and initiatives outside their network; structured offers; sponsorship agreements with up to three deliverables, kept apart from CSR money |
| Light | Verified individual sponsors (former athletes, business owners) | No (hypothesis) | Support adults, teams and clubs through structured offers |
| **Users, free** | Adult athletes, guardians, coaches, teams, clubs, schools, academies, programme operators, federations (also as nominators and verifiers) | Never for basic use | Join independently, discover funding and sponsors, apply once from a profile, publish requests, know where they stand, report simply, control consent |

Inside a funding organisation, the founder's supporting roles (reviewer, verification officer, approver, finance
officer, programme manager) are **permissions** on one account type: Review, Verify, Approve, Finance and Manage
programme (`02` §5). A platform administrator has one Audit & admin screen.

## 3. One open ecosystem, with an institutional commercial core

**The challenge [J], kept from P0.** Two business shapes meet here: institutional software (a funder runs rounds and
tracks money and progress: one buyer, one budget, a link that brings its own applicants) and a two-sided marketplace
(seekers and funders find each other: cold-start, liquidity, mixed buyers, safeguarding). Commercial sponsorship buys
exposure, whereas CSR and foundation money must show a development purpose.

**The founder's decision (D6, 25 Nov 2026).** Commercial launch priority and product functionality are different
decisions. The product is **one open, controlled ecosystem**; the first sales motion is institutional.

1. **Open by design.** Independent registration on both sides; two-way discovery across all participating
   organisations; opportunities can be public, restricted or invitation-only; athlete visibility is consent-based.
2. **Controlled.** Structured contact only (no free messaging), requests only to funders that accept them, limits
   against spam, verification of funders, minors never searchable (anonymised requests after an identifiability
   check), block and report on every contact (`02` §3, §7).
3. **One lifecycle.** Every route (application, nomination, request to a funder, expression of interest, offer,
   existing agreement) leads to one funding agreement with one ledger, the same tracking and the same review, named by
   its type in the interface (Scholarship award, Sponsorship agreement, Programme grant…).
4. **Institutional core sells first.** A foundation or company can buy Revivo Impact and launch a sports funding
   opportunity through a shareable link, which works before the wider network is large. Every such opportunity also
   appears in Discover, so each institutional customer adds supply that attracts athletes, and each athlete profile
   makes the platform more useful to the next funder.
5. **Commercial sponsorship kept apart.** Separate funding type, separate totals, separate chain; light (payments plus
   up to three deliverables); no inventory, valuation or activation analytics.
6. **Deferred:** public donations, crowdfunding and real payments. Verified individual sponsors are included lightly.

| Build fully (prototype) | Build lean | Deferred or "future" |
|---|---|---|
| Open registration (all five paths); two-way discovery; reusable profiles with per-fact visibility and verification; scholarship and grant rounds via share link and Discover; nominations; selection; agreements; releases and receipts; expenses; progress; review and renewal | Programme monitoring (Play Every Day); existing agreements; in-kind equipment; one commercial sponsorship with deliverables; one individual sponsor | Public donations, crowdfunding, real payments, tax receipts; sponsorship inventory, valuation, activation; externally sourced sponsorship intelligence; ambassador programmes |

**Simplification that keeps every function** (details in `02` and `03`): seven funding types with interface names and
four behaviours, with "existing agreement" as an origin; supporting roles become permissions; one Update form that
takes expenses, progress or deliverables together or separately; one Discover screen with tabs for both directions;
approvals live in "Needs me" on each Home; renewal is a review outcome; one Funding Line component with three chains;
23 screens from 9 templates.

## 4. Strongest commercial use case

**A foundation or company CSR team runs an athlete scholarship round end to end from a shareable link, then follows
each award to released funds, verified spend and sporting progress.**

Why this one [J]:

- **It fills itself.** The funder brings its own applicants through the link. No marketplace liquidity is needed.
- **It has a budget and an owner.** Foundations and CSR teams already run these rounds, often on forms and spreadsheets.
- **It shows Revivo's sport-specific value** at every step: eligibility by sport, age and level; results verified by
  clubs and federations; nominations; guardians for minors; sporting progress after the award.
- **It repeats.** Rounds are annual; awards need quarterly follow-up; renewal invites the next round.
- **It is the signature demo.** Journey A tells it in about 10 minutes (`03` §5).

Module two, programme funding and monitoring (the Play Every Day story), serves the same buyer and reuses the same
ledger and chain. **This is the first sales motion, not the product's boundary:** the prototype demonstrates the full
two-sided ecosystem around it (founder, D6).

## 5. Differentiation hypotheses (to validate, not claims)

Generic intake → review → award → report is parity, not a reason to buy; SmarterSelect, Good Grants and Foundant
already do it cheaply [V]. AI matching (Blackbaud Award Management already auto-matches students to scholarships [V]),
dashboards, payments and crowdfunding are **not** differentiators. Revivo must win on sport-specific value.

| # | Hypothesis | How the prototype demonstrates it |
|---|---|---|
| H1 | **"Apply once; verified by the people who know you."** A reusable athlete profile with field-level verification (a result confirmed by a federation document, age by an ID document, training attendance attested by a coach), each showing who verified it and when. Never one blanket "verified athlete" badge. | Amira's profile shows each field's own chip; Daniel verifies her national U21 bronze against a federation results document and her age against her ID; the reviewer sees "Verified by D. Osei · Tallwater · 6 May" per field. Her profile prefills a second application. |
| H2 | **Nomination-native.** Opportunities can be open, nomination-based or invitation-only, as real schemes work. | Ostral Swimming Federation has nominated three swimmers into the Emerging Athletes Scholarship; each nominee's guardian accepts the nomination and completes the application (seeded, visible in Explore). |
| H3 | **Money you can reconcile.** Announced → held for offers → committed → released → received → reported → verified, with outstanding and unspent amounts in words; partial funding; overfunding blocked; other funding declared; no double counting. | The budget meter in Selection; the funding bar on every award; Nadia's request part-funded by two funders, line by line, and Tiago's anonymised request with the cap blocking an over-offer and a hold for his pending application; the "Other funding" declaration on every application; every figure opens its source records. |
| H4 | **Funding follows sporting progress.** Post-award Updates (competitions entered, results with documents, coach-attested training, receipts) linked to the award, leading to a human review and renewal. Never health monitoring. | Amira's quarterly Update and the athlete chain: Need → Award → Released → Spent → Progress → Review. |
| H5 | **A defensible selection record (parity-plus).** Rules-based eligibility, a four-criterion rubric, conflict-of-interest declarations, four-eyes approval and an exportable selection record. Helps a foundation show an objective process or satisfy a CSR committee. Honest note: Submittable and Foundant already score and audit; Revivo's edge is sport-specific criteria and verifiers. | Selection & decisions screen; "Export selection record" (print in Daylight). |

## 6. Commercial model

**Principles.**

- Institutional annual subscription paid by the funder. Free for athletes, guardians and coaches (registration,
  nominations, applications, updates).
- **Where free ends for funders (hypothesis, P1):** free: a verified funder profile, discovering, answering support
  asks and a small number of direct offers a year; paid: running opportunities (rounds with selection), the portfolio
  and reports, programme monitoring, several users with permissions, and the selection record. Sponsors and brands:
  a partnerships plan (discovery, sponsorship agreements with deliverables) priced to test in interviews.
- **Growth loop:** at submission, and again after an unsuccessful decision, an applicant can opt in to "let other
  participating funders find my profile", so every institutional round also grows the discoverable pool.
- **No dependence on commission.** Commission needs payment rails and liquidity, and would mix Revivo's interests into
  award decisions.
- **Funder-sponsored seats:** the funder pays and its grantees (academies, programme operators) use the platform free,
  as Upshot's funder account does [V].
- **Paid "first round" set-up service**, because buyers of annual rounds want the first one configured for them.
- Paid plans for academies and federations that manage many athletes (later).
- No confirmed prices, customers, demand or revenue projections exist. Everything below is a hypothesis.

**Pricing hypotheses to test (not prices).** They sit against SmarterSelect (~$1,000–5,000/yr), Good Grants
(~€3,200–6,400/yr), Foundant (~$4,250–13,900/yr, third-party figures) and Upshot (from £1,100–1,200/yr plus
onboarding) [V / V-3p], and keep the v1 India hypotheses (₹0.6–15 lakh).

| Tier (hypothesis) | USD/yr | GBP/yr | INR/yr |
|---|---|---|---|
| Single programme: one round, up to 500 applicants, awards and tracking | 2,500–5,000 | 2,000–4,000 | ₹1.5–3 lakh |
| Funder: several rounds, programme monitoring, funder-sponsored seats | 8,000–20,000 | 6,000–15,000 | ₹5–12 lakh |
| Academy or federation: nominations, many athletes, their own funding | 1,000–4,000 | 800–3,000 | ₹0.6–2.5 lakh |
| Government or enterprise | Custom (tender) | | |
| First-round set-up (one-off) | 1,500–3,000 | 1,200–2,500 | ₹0.75–1.5 lakh |

**Risk:** at the single-programme tier Revivo is priced like SmarterSelect and must clearly beat it on sport-specific
value.

**Procurement routes [J].** Foundations buy directly after a board demonstration. CSR teams need vendor onboarding and
security questionnaires (in India, CSR administrative overheads are capped; to check). Governments buy by tender
(for example GeM in India, G-Cloud in the UK), so later. Federations buy from grant-funded development budgets, so
slowly.

**Legal and finance considerations (design considerations, never compliance claims).**

- **Revivo records commitments and payments; it never moves money.** Holding or moving funds would make Revivo a
  payments or charity intermediary (identity checks, licensing, tax receipts).
- **US private foundations** need IRS advance approval and an objective, non-discriminatory selection process for
  grants to individuals (s.4945(g)) [V]. The rules-based eligibility, rubric, conflict declarations and selection
  record support such a process; they do not make anyone compliant.
- **Contracts with minors.** Endorsement-type contracts with minors are generally voidable and some US states need
  parental consent or court approval [V]. Commercial sponsorship of under-18s therefore happens only through a guardian
  (and is never shown in public discovery); offers to minors always go to the guardian.
- **India CSR** normally flows through registered implementing agencies; sport training is a CSR activity under
  Schedule VII item (vii) [V]. Check agency rules before any India pilot. Never claim "CSR-eligible".
- Payment handling, donations, tax treatment, cross-border transfers and commercial agreements need jurisdiction-
  specific validation before any production use.

## 7. Stakeholders and opportunities

| Include now | Later | Out |
|---|---|---|
| Federations, national Olympic committee-type bodies and clubs as **nominators and verifiers** (free) | University sports scholarships (Blackbaud's ground) | Community crowdfunding and donations |
| In-kind equipment donors (as an award type) | Government athlete schemes (tender-heavy) | Brand-ambassador and name-image-likeness deals |
| Programme operators and CSR implementing agencies | International federation development grants | Fan investment |
| Co-funders on one award or Need (partial funding) | Alumni and club benefactors as individual funders | |

## 8. Name, category and tagline

**Name: "Revivo Impact" — keep (decision D18 confirms).** It pairs with "Revivo Pathway" (one abstract noun each,
the same lockup "revivo │ IMPACT"). "Impact" is the buyer's word: foundations and CSR teams report "impact". It does
not imply that Revivo holds or gives money. Always "Revivo Impact", never "Impact" alone.

- **Risk:** "Impact" is crowded (for example impact.com, a partnerships platform). **A trademark and domain check is
  required before any public use.** Because the word implies proven impact, the honesty line is kept wherever impact
  is implied, and the funder's navigation says "Reports", not "Impact & reports".
- **Rejected alternatives:** Revivo Fund or Grant or Pay (suggest Revivo is a funder or payment provider); Revivo
  Backing (in the UK, Ireland and Australia "backing" also means betting, which is bad near minors) and Revivo Boost
  (sound like consumer crowdfunding); Revivo Patron (old-fashioned, confusable with Patreon); Revivo Partner (reserved
  for a possible sponsorship product).

**Tagline: founder decision D1.**

- **Default (founder's preference, supported by the brand panel): "Connecting sport with opportunity."** It is warm,
  short and two-sided (funding opportunities for athletes, credible opportunities for funders), and its rhythm cannot
  be confused with the company tagline.
- **Expert alternative (market panel): "Fund sport. See it through."** The market panel's concern: the founder's line
  never mentions funding, "opportunity" is generic job-board language, and it promises a marketplace that will not
  have liquidity at launch. The alternative is short, sporty, honest, and works for both funder and athlete.
- **Runner-up (brand panel), if accountability should lead:** "Funding sport, followed through."
- **Supporting line (founder's decision, 25 Nov 2026): "Find funding. Support sporting talent. See how your support
  is used."** It covers scholarships, sponsorship agreements, programme grants and in-kind support. (P0 default was
  "…See how every award is used.") It replaces
  "Discover funding. Support sporting talent. Track the difference." because "Track the difference" implies measured,
  attributable impact, which records cannot show; "Discover funding" over-promises a marketplace. "Back sporting
  talent" was considered and rejected because "backing" can mean betting.
- **Placement.** Impact's tagline appears only on Impact's own surfaces: the prototype start screen and, later, the
  `/impact` page hero, set in ink with no lime words. It never appears on the Revivo homepage or in Revivo's social
  metadata, and never competes with "Pulse of Sport. Mind of the Game.". Never use the retired "AI built for the pulse
  of sport", v1's "Deliver sport. Demonstrate impact.", "Demonstrate impact" or "Proven impact". v1's "Deliver sport.
  Show the evidence." is superseded.

## 9. Website presentation (later, website chat only)

Nothing here changes the website. Website changes happen only in the website chat, after the P5 gate and the
founder's approval. The website is being restructured from 16 to 12 capabilities; Impact does not depend on either
structure.

- **D2 (decided):** a "Prototypes" menu, with each prototype listed under its capability (the website already does
  this for Revivo Pathway: capability name first, the prototype beneath, opening that capability's panel).
- **D3 (decided):** Revivo Impact's single home is the capability **"Funding, Grants & Programmes"** in the area
  **"Funding & Governance"** (id `funding-impact-reporting`), consistent with the website's "one product, one home"
  rule. Other uses (athlete support, sponsorship, programmes) are described on Revivo Impact's own page.
- Always "Revivo Impact", "prototype" and "fictional data"; never "launch", "available now" or "book a demo"; Impact's
  tagline only on Impact's own surfaces, never on the Revivo homepage.
- The P0 proposals for a `/prototypes` page and a capability rename are withdrawn.

## 10. Risks, validation plan and go/no-go

**Top risks (ranked) [J].**

1. Generic grant tools are "good enough" and cheaper.
2. **Cold start:** an open ecosystem with few participants looks empty (mitigated by the institutional-first sales
   motion, seeding each launch with a partner organisation's funders and athletes, and honest "participating on
   Revivo Impact" labelling).
3. Minors' safeguarding and commercial contact.
4. Payments, tax and jurisdiction (s.4945(g), CSR agency rules, charity public-benefit rules) where the buyer may need
   legal sign-off.
5. "Verified" badges create liability: use field-level, named-verifier wording only.
6. Few buyers per country and long CSR and government cycles.
7. Upshot or Views add intake and award features and squeeze module two.
8. The word "Impact" implies proof (mitigated by the honesty line, the claims check and "Reports" in the navigation).
9. Family drift: a visibly different product would weaken the Revivo brand (mitigated by `04` §2).

**Discovery: 12–14 interviews**, run alongside the build: 5 funders running athlete scholarships or grants
(foundations, CSR teams, athlete-support charities); 3 federation or national Olympic committee-type bodies that
nominate or distribute support; 2 programme operators or academies; **4 commercial sponsors or brand managers** (two-way
discovery is now in scope); **2 clubs** seeking funding; 2 athletes or guardians (16–18 interviews in total).

**Ask:** How did you run your last round, with what tools, how many applicants and how many staff hours? How do you
check achievements and age? Do you accept nominations? How do you record what was released versus spent, and does
anyone verify receipts? What do you report to your board or CSR committee (ask for the template)? Have you looked at
Submittable, Foundant, SmarterSelect or Good Grants, and why did you buy or not? Would you browse unsolicited athlete
requests (sponsors)? Who signs, from which budget, and at what price would you trial it? Book competitor demos
honestly as Revivo.

**Go/no-go for production work** (keeping the founder's earlier thresholds): at least 10 interviewed; at least 6
confirm the problem; at least 3 report templates collected; at least 2 competitor demos reviewed; at least 2 willing to
test; at least 1 open to a paid pilot. **Added:** at least 3 funders run an application-based athlete round of 50 or
more applicants a year on spreadsheets, forms or a generic tool; at least 2 name a sport-specific reason to choose
Revivo over a generic tool; at least 3 accept a price inside the hypothesis band.

**Commercial launch gate (revised, D6):** the product scope is two-sided regardless. Sponsor-side discovery is
*marketed and priced* as a lead offer only if at least 2 of the sponsors interviewed say they would fund unsolicited
verified requests **and** at least 1 commits to a pilot; otherwise the first launches lead with institutional rounds
and keep discovery as an included feature.

## 11. Changes from the founder's master brief

Each change keeps the brief's function unless stated. The founder can reverse any of them through `07`. **Rows 1, 3,
5, 6 and 17 are superseded by §11.1** (the founder's decisions of 25 Nov 2026).

| # | Brief said | Changed to | Reason |
|---|---|---|---|
| 1 | Four routes of equal standing; one platform connecting three problems | One product built around the **Award**; two entry points (seeker or funder) plus "Add existing funding"; all routes feed one lifecycle | Without one object and one ledger the brief becomes three products, each thinner than a specialist (decision D7) |
| 2 | Route C, funder-led discovery, as a separate route | Route C = Discover plus an Offer; no extra screens | Same function, fewer screens |
| 3 | Routes A–D presented as one market | Headline: Route A scholarship and grant rounds; module two: programme funding; Routes B and C included but commercially secondary, within a funder's network first | Route A fills itself through the link; B and C need marketplace liquidity Revivo does not have (decision D6) |
| 4 | Seven funding categories, including "Existing funding agreements" | Six category labels, four behaviours (athlete development, programme, in-kind, commercial); "existing agreement" is an **origin** any category can have | Removes duplicated screens; stops existing funding being confused with a type of funding (D7) |
| 5 | Funding providers include individual sponsors and donors | Individual donors, individual sponsors and crowdfunding deferred | Unknown adults contacting minors, donation tax, payment regulation; not the paying customer (D8) |
| 6 | Commercial sponsorship as a full category | Kept light: discover a Need, offer full or partial support, record an agreement with up to three deliverables, excluded from development and impact totals; inventory and activation belong to a possible future Revivo Partner | Avoids "CSR money with marketing strings" and a later collision with Revivo Partner (D11) |
| 7 | Supporting roles (reviewers, verification officers, approvers, finance officers, programme managers, administrators) | Permissions: Review, Verify, Approve, Finance, Manage programme, Record sessions, Admin; one Audit & admin screen | The brief itself asks not to create separate applications (D16) |
| 8 | "Restrict contact" for minors | Minors are never searchable as profiles; funders reach them only through a de-identified Need a guardian published or an application the guardian authorised; first name shared only after the guardian accepts or submits | The simplest enforceable form of the brief's safeguarding requirement (D9) |
| 9 | Separate expense and progress submissions | One quarterly **Update** form for expenses and progress | Recipients learn one form |
| 10 | Suggested navs of six items (athlete, funder) | At most five items per role; "My progress" merged into "Funding"; the funder's "Applications" lives inside "Opportunities"; "Impact & reports" becomes "Reports"; Consent and Audit open from the account menu and from every record | Ease of use is the founder's top priority; "Impact" in a label implies proven impact (D14) |
| 11 | "Do not force 13 screens; do not build 40–50" | 22 screens and 3 shared panels from 9 templates | The smallest set that covers journeys A–E (D14) |
| 12 | Main funder "Horizon Sports Foundation" | **Tallwater Sports Foundation**; v1's "Brightwater Fund" retired | Horizon Sports & Experiences is a real sponsorship agency in this market; Brightwater Fund is a real grantmaker (D5) |
| 13 | "Up to 50 awards; up to $5,000 per athlete" | Awards in published tiers ($3,500 / $4,500 / $5,000); 46 offered for $214,500; nomination route; "Other funding" declaration | Real programmes use tiers, nominations and no-double-funding declarations; not every award is the maximum |
| 14 | Supporting description "Discover funding. Support sporting talent. Track the difference." | "Find funding. Support sporting talent. See how every award is used." Tagline kept by default but put to the founder (D1) with an expert alternative | "Track the difference" implies measured impact; "Discover funding" promises a marketplace |
| 15 | "Configurable currencies" | USD only in the prototype until the founder approves GBP and INR as separately authored datasets; never a symbol swap | Keeps reconciliation simple and honest (D4) |
| 16 | "Warm natural lighting… avoid overly dark imagery" | Same photographic grade as the website and Pathway (p75 luminance ≈ 76, saturation ≈ 42%); warmth comes from golden-hour light, people and moments; faces keep detail | A brighter series would visibly break the family, the largest consistency risk (`04` §9) |
| 17 | Preferred future "Products" section on the website | Default: one "Prototypes" navigation item → `/prototypes` | Website rules: "Products are not a website category"; "our products" banned (D2) |
| 18 | (Not in brief) | Proposed website capability rename "Funding & Impact Reporting" → "Funding & Grant Management" | The current text is written for recipients and implies an impact claim (D3) |
| 19 | AI experiences A–C | Exactly three, each "Simulated AI"; v1's fourth (voice-note summary) cut; AI never ranks people by merit; matching order is a deterministic criteria-fit count | The brief asks for a small number; ranking people by AI would be a merit judgement (D12) |
| 20 | Programme four-eyes within one organisation (v1 had a separate evaluation lead) | Four-eyes runs across organisations where natural (the operator prepares, the funder accepts); v1's evaluation-lead persona cut | Fewer personas, same control |
| 21 | Competitor list included "Indenture" and "Foundant (Common Grant)" | "Indenture" not found (ask the founder for a URL; never cite it); no evidence Foundant owns Common Grant Application; Ticket2Final is a fan-ticket product, dropped | Accuracy (`08`) |
| 22 | Demo dates unspecified (v1: 2026 dates) | Demo year 2027 with three clock moments; v1's Greenpark misses moved to Tue 4 and Thu 6 May 2027 | Consistent weekdays for Tue/Thu sessions (D17) |
| 23 | "Guided and hands-on modes as in Pathway, improved" | Adds a journey bar, a "What changed" panel after each step and per-journey checkpoints, extending Pathway's "Load the story up to step N" | Makes connected state visible, the product's main argument (`03` §6) |
| 24 | "Understand what your money achieves" | "See how your support is used" | Records show use and progress, not achievement or impact |

### 11.1 Changes after the founder's decisions (25 Nov 2026)

| # | P0 said | Now | Reason |
|---|---|---|---|
| 25 | Routes B and C secondary, within a funder's network | Open, controlled two-sided ecosystem; full two-way discovery demonstrated | Founder D6 |
| 26 | Everything called an "Award" | One internal record (funding agreement); interface names by funding type | Founder D7 |
| 27 | Individual sponsors deferred | Verified individual sponsors included lightly; donations and crowdfunding deferred | Founder D8 |
| 28 | Minors reachable via a de-identified Need or an authorised application | Also via guardian-accepted nominations; anonymised card with a deterministic identifiability check; block and report | Founder D9 |
| 29 | Supporting line "…See how every award is used." | "…See how your support is used." | Founder D1 |
| 30 | Website `/prototypes` page; capability rename | Prototypes menu by capability; home "Funding, Grants & Programmes" | Founder D2, D3 |
| 31 | Funder navigation Overview · Discover · Opportunities · Portfolio · Reports | Overview · Discover · Opportunities · Applications · Funding (Reports a tab and an Overview button) | Founder's navigation suggestion; Reports kept easy to find |
| 32 | 22 screens | 23 (adds the Public profile for two-way discovery) | Founder D14 (target, not limit) |
| 33 | Tallwater-centred world | Nine funders across foundation, company, brand, government, federation and individual types | Founder D5 |
| 34 | (not explicit) | Sports-only boundary enforced by a deterministic check | Founder §2 |
