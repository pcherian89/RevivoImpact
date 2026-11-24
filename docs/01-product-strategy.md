# Revivo Impact — product strategy

Consolidated from the P0 expert review (Nov 2026): Panel A (market, competitors, commercial model, name), Panel B
(product, UX, architecture, finance, safeguarding, data, build plan) and Panel C (brand, website, design, imagery,
copy), reconciled by the lead product writer. These are analytical perspectives; no outside experts were consulted.
Evidence and sources are in `08-research-and-competitors.md`. Labels: **[V]** verified in a primary or official
source, **[J]** judgement.

## 1. Positioning

**Revivo Impact is a sports funding & sponsorship platform for the organisations that fund sport.** It lets a funder
publish a scholarship, grant or programme call from a shareable link, select recipients by a fair and recorded
process, and follow every award from commitment to release, spending, sporting progress and review. Athletes,
guardians, coaches, clubs and programme operators use it free to find funding and apply from one reusable profile.

- **Category descriptor** (eyebrow on Impact's own surfaces): "Sports Funding & Sponsorship Platform" (set in the
  `.label` style, which renders it in capitals), matching Pathway's "Talent Identification & Athlete Development
  Platform".
- **One-line explanation** for buyers: "Revivo Impact runs sports scholarships, grants and programme funding, from
  application to evidence."
- **Plain explanation** (from the founder, kept): "If you need funding for sport, Revivo helps you find it. If you
  want to fund sport, Revivo helps you find credible opportunities and see how your support is used."
  ("understand what your money achieves" is softened to "see how your support is used": records show use, not
  achievement; see the honesty line below.)
- **Honesty line**: "Delivery and spending records show what was delivered and spent; they do not on their own prove
  social impact."
- **Fit with Revivo Sportech.** Revivo is "a global AI solutions-building company for the complete sports ecosystem"
  (website). Funding is a system every part of that ecosystem depends on. Revivo Impact demonstrates four of the
  website's sixteen capabilities across three of the four areas (§9), which shows a whole-ecosystem system rather than
  a coaching tool. Like Pathway, it is shown as proof of what Revivo builds, never as a product catalogue.
- **Global, not regional.** No India- or Kerala-specific positioning. USD in the prototype; other currencies only as
  separately authored datasets (decision D4).

## 2. Users and buyers

| | Who | Pays? | What they need from Revivo Impact |
|---|---|---|---|
| **Buyer 1 (headline)** | Foundations and company CSR teams running athlete scholarships or grants | Yes (hypothesis) | Launch a round from a link, select fairly with a defensible record, follow each award to verified spend and progress, report to a board or CSR committee |
| **Buyer 2 (module two)** | The same funders, plus federation development departments and government sport bodies, funding programmes | Yes (hypothesis) | Follow programme delivery (sessions, attendance counts, missed sessions, recovery plans), spending and evidence; aggregates only |
| Buyer 3 (later) | Academies and federations managing many athletes' funding, nominations and verification | Possibly, advanced plan | Nominate, verify results, manage athletes' applications and awards |
| Light | Commercial sponsors (brand partnership teams) | Not the target buyer | Discover a Need, offer support, record an agreement with up to three simple deliverables |
| **Users, free** | Adult athletes, guardians, coaches, clubs, schools, programme operators, federations as nominators and verifiers | Never | Find funding, apply once from a profile, know where they stand, report simply, control consent |

Inside a funding organisation, the founder's supporting roles (reviewer, verification officer, approver, finance
officer, programme manager) are **permissions** on one account type: Review, Verify, Approve, Finance and Manage
programme (`02` §5). A platform administrator has one Audit & admin screen.

## 3. One product, not two businesses

**The challenge [J].** The founder's brief joins two different businesses:

- Routes A and D (a funder runs scholarships, grants or programmes, then tracks money and progress) form a coherent
  **institutional software** business: one buyer, one budget, a link that brings its own applicants.
- Routes B and C (athletes post needs; funders browse athletes) form a **two-sided marketplace**: different buyers
  (marketing as well as CSR), different law, and a cold-start problem. It works only with many verified athletes *and*
  active funders in the same sport and place. Revivo has neither side yet. Commercial sponsorship buys exposure and
  deliverables, whereas CSR and foundation money must show a development or charitable purpose; mixing them in one
  feed invites "CSR money with marketing strings".

**How the prototype handles it.** One product, built around the **Award** (`02` §2):

1. **Two entry points, one lifecycle.** The seeker starts (publishes a Need, or applies to an Opportunity); or the
   funder starts (publishes an Opportunity, or finds a Need or eligible adult profile in Discover and sends an Offer).
   Every route ends in an Award, and every Award runs the same lifecycle: ledger → updates and evidence → review or
   renewal. "Add existing funding" creates an Award directly, which the recipient confirms.
2. **Commercial weight follows the institutional business.** Route A (scholarship and grant rounds) is the headline
   and the 10-minute signature journey. Programme funding and monitoring (Route D, Play Every Day) is module two.
3. **Routes B and C are included but secondary.** The founder's journeys B–E and acceptance criteria 6–7 require
   them, so the prototype shows them working. Commercially they are positioned **within a funder's own network or
   invited community** first (current awardees, partner academies, invited co-funders), not as an open public
   marketplace. They become a marketplace only if validation passes the marketplace gate (§10).
4. **Commercial sponsorship stays light.** A sponsor can discover a Need, offer full or partial support and record an
   agreement with up to three deliverables owed by the recipient. Commercial amounts are reported separately and never
   counted in development, programme or impact totals. Sponsorship inventory, valuation and activation belong to a
   possible future "Revivo Partner" (a strategic possibility, not a commitment).
5. **Deferred:** individual donors, individual sponsors and crowdfunding (safeguarding, payment-regulation and tax
   risk; not the paying customer).

| Headline (build fully) | Secondary (build lean) | Deferred or "future" |
|---|---|---|
| Route A: scholarship or grant round via shareable link, eligibility rules, nominations, review, award, agreement, release, expenses, progress, renewal | Route D: programme funding with Play Every Day monitoring (Journey C); existing agreements (Journey D) | An open public marketplace across all users |
| Guardian-proxied applications and coach preparation (Journey E) | Route B within a funder's network: a Need part-funded by one or more funders (Journey B) | Sponsorship deliverables beyond three, exposure tracking, inventory, activation |
| Money states and portfolio reconciliation | Route C: Discover plus Offer; in-kind equipment awards; one light commercial deal | Crowdfunding, donations, payments, tax receipts, ambassador programmes |

**Simplification that keeps every function** (details in `02` and `03`): seven funding categories become six labels
and four behaviours, with "existing agreement" as an origin; supporting roles become permissions; expenses and
progress share one Update form; one Discover screen with tabs; approvals live in "Needs me" on each Home; renewal is a
review outcome; one Commitment-to-Evidence Chain component for athletes and programmes; 22 screens from 9 templates.

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
ledger and chain.

## 5. Differentiation hypotheses (to validate, not claims)

Generic intake → review → award → report is parity, not a reason to buy; SmarterSelect, Good Grants and Foundant
already do it cheaply [V]. AI matching (Blackbaud Award Management already auto-matches students to scholarships [V]),
dashboards, payments and crowdfunding are **not** differentiators. Revivo must win on sport-specific value.

| # | Hypothesis | How the prototype demonstrates it |
|---|---|---|
| H1 | **"Apply once; verified by the people who know you."** A reusable athlete profile with field-level verification (a result confirmed by a federation document, age by an ID document, training attendance attested by a coach), each showing who verified it and when. Never one blanket "verified athlete" badge. | Amira's profile shows each field's own chip; Daniel verifies her national U21 bronze against a federation results document and her age against her ID; the reviewer sees "Verified by D. Osei · Tallwater · 6 May" per field. Her profile prefills a second application. |
| H2 | **Nomination-native.** Opportunities can be open, nomination-based or invitation-only, as real schemes work. | Ostral Swimming Federation has nominated three swimmers into the Emerging Athletes Scholarship; each nominee's guardian accepts the nomination and completes the application (seeded, visible in Explore). |
| H3 | **Money you can reconcile.** Announced → reserved → committed → released → reported → verified, with outstanding and unspent amounts in words; partial funding; overfunding blocked; other funding declared; no double counting. | The budget meter in Selection; the funding bar on every award; Tiago's Need part-funded by Oriel with the cap blocking an over-offer; the "Other funding" declaration on every application; every figure opens its source records. |
| H4 | **Funding follows sporting progress.** Post-award Updates (competitions entered, results with documents, coach-attested training, receipts) linked to the award, leading to a human review and renewal. Never health monitoring. | Amira's quarterly Update and the athlete chain: Need → Award → Released → Spent → Progress → Review. |
| H5 | **A defensible selection record (parity-plus).** Rules-based eligibility, a four-criterion rubric, conflict-of-interest declarations, four-eyes approval and an exportable selection record. Helps a foundation show an objective process or satisfy a CSR committee. Honest note: Submittable and Foundant already score and audit; Revivo's edge is sport-specific criteria and verifiers. | Selection & decisions screen; "Export selection record" (print in Daylight). |

## 6. Commercial model

**Principles.**

- Institutional annual subscription paid by the funder. Free for athletes, guardians and coaches (registration,
  nominations, applications, updates).
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
- **Supporting line (default): "Find funding. Support sporting talent. See how every award is used."** It replaces
  "Discover funding. Support sporting talent. Track the difference." because "Track the difference" implies measured,
  attributable impact, which records cannot show; "Discover funding" over-promises a marketplace. "Back sporting
  talent" was considered and rejected because "backing" can mean betting.
- **Placement.** Impact's tagline appears only on Impact's own surfaces: the prototype start screen and, later, the
  `/impact` page hero, set in ink with no lime words. It never appears on the Revivo homepage or in Revivo's social
  metadata, and never competes with "Pulse of Sport. Mind of the Game.". Never use the retired "AI built for the pulse
  of sport", v1's "Deliver sport. Demonstrate impact.", "Demonstrate impact" or "Proven impact". v1's "Deliver sport.
  Show the evidence." is superseded.

## 9. Website presentation (later, website chat only, founder approval needed)

Nothing here changes the website now. Website changes happen later in the website chat, after the P5 gate and the
founder's approval, with a matching update to the website's `CLAUDE.md`. Never modify the website from this
repository.

**Capability fit.**

| Website capability (area) | What Revivo Impact demonstrates | Link |
|---|---|---|
| Funding & Impact Reporting (Management & Reporting) — proposed rename, decision D3 | The core: calls, awards, commitments, releases, spending, evidence, reports | Primary (gets the "Prototype" chip) |
| Athlete Career & Welfare (Athletes & Performance) | Scholarship discovery, the reusable profile, applications | Related |
| Sponsorship Management (Growth & Engagement) | Athlete Needs, sponsor Offers, agreed deliverables | Related |
| Sports Programme Management (Management & Reporting) | Play Every Day: sessions, attendance counts, recovery plans | Related |
| Registration & Administration; Governance & Compliance | Shared mechanics only | Not linked |

**Decision D2: "Products" section or "Prototypes".** The founder prefers a "Products" section. The website's own rules
say "Products are not a website category", forbid describing capabilities as finished products, and `check:copy`
bans "our products"; a products section would also read as "buy these two apps", undercutting "we build what you
need". **Default: one main-navigation item "Prototypes" → `/prototypes`**, replacing the current "Revivo Pathway"
item (an owner decision recorded in the website's `CLAUDE.md` §5d, which D2 would revise), so the navigation stays at
three links. If a product later reaches a paid pilot, the label can be revisited, which would need an explicit
rewrite of the website's §1 rule.

**Proposed `/prototypes` copy.** Title "Prototypes — Revivo". Eyebrow "PROTOTYPES · FICTIONAL DATA". h1 "See Revivo
systems working." Lead: "Clickable prototypes built on fictional data. Each shows the kind of complete system Revivo
designs around a client's workflows, people and rules." Two list entries (not cards), each a 16:9 photo shown whole,
then copy, then a rule divider:

| | Revivo Pathway | Revivo Impact |
|---|---|---|
| Chip | Prototype · fictional data | Prototype · fictional data |
| Label | Talent identification & development | Funding, scholarships and sponsorship |
| One line | Run consent-based talent programmes, from a school's class list to a training place. | Publish funding, choose recipients and see how every award is used, from application to report. |
| Links | "About Revivo Pathway" → `/pathway` · "Try the prototype" → `/pathway/demo` | "About Revivo Impact" → `/impact` · "Try the prototype" → `/impact/demo` |
| Capabilities | Talent Identification & Development · Sports Programme Management · Governance & Compliance | Funding & Grant Management (or the current name if D3 is declined) · Athlete Career & Welfare · Sponsorship Management · Sports Programme Management |

Closing line: "Your organisation's system would be designed around your own workflows." then "Start a conversation".
Capability chips link to `/home#explore`, opening that capability.

**Elsewhere on the site (proposals).**

- `products.ts`: add `revivo-impact`, listing `funding-impact-reporting` first (the explorer chips only the first id);
  `showcase: false` until the founder approves; summary "A working prototype on fictional data: funding calls,
  applications, awards, spending and progress, end to end."
- Homepage proof line under the process: "See prototypes working." → `/prototypes`.
- Footer group "Prototypes": "Revivo Pathway", "Revivo Impact", "All prototypes". No Gateway entry.
- `/impact` page mirroring `/pathway`: eyebrow "Prototype · Sports funding & sponsorship"; five stages: "Publish: a
  foundation sets the award, criteria and deadline." · "Apply: athletes, guardians or coaches apply from one
  profile." · "Select: reviewers check evidence; a different person approves." · "Fund: commitments and releases are
  recorded separately." · "Follow through: expenses and progress are linked to each award." Safeguards: no AI
  decisions; a commitment is not a payment; minors are contacted only through guardians; no real money.
- Always "prototype" and "fictional data"; never "launch", "available now" or "book a demo".
- The website's `CLAUDE.md` §5d must be updated there to say `/prototypes` applies at two prototypes, not three.

**Decision D3: redefine one capability** (with Impact's website appearance, after approval). Keep the 4 × 4 structure
(`check:copy` enforces it). Rename "Funding & Impact Reporting" → **"Funding & Grant Management"**, keeping the id
`funding-impact-reporting` so links and analytics do not break. Reason: the current text describes a team reporting
*to* funders, whereas Impact is mainly a funder's system that recipients use free; the new name is what
administrators search for, covers both sides and avoids an impact claim. Proposed copy (within the website's copy
limits):

- short (11 words): "Run funding calls, select recipients, and track awards, spending and results."
- problem (25 words): "Funders struggle to find credible recipients, applicants struggle to find suitable funding, and
  once money is awarded, spending and results are tracked in separate spreadsheets."
- build (32 words): "A funding system to publish scholarships and grants, take applications with eligibility rules,
  review and approve awards, and record agreements, funds released, expenses and progress against each award.
  Reporting deadlines trigger reminders."
- AI: "Suggest suitable funding opportunities for an applicant, explaining each match." · "Summarise applications
  and flag missing documents for reviewers to check." · "Draft funder reports from recorded spending and progress,
  linked to sources."
- benefit (22 words): "Funders can see who applied, what was awarded and how it was used, and applicants know where
  they stand at every step."

No change to Athlete Career & Welfare or Sponsorship Management now. Later and optional, once athlete sponsorship is
validated with real sponsors: widen Sponsorship Management's short line to "Find sponsors, agree commitments, deliver
activations and report value."

## 10. Risks, validation plan and go/no-go

**Top risks (ranked) [J].**

1. Generic grant tools are "good enough" and cheaper.
2. Scope creep into a marketplace dilutes the 10-minute story and implies liquidity Revivo does not have.
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
nominate or distribute support; 2 programme operators or academies; 2 commercial sponsors or brand managers (to test
Routes B and C honestly); 2 athletes or guardians.

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

**Marketplace gate:** Routes B and C are promoted beyond "within a funder's network" only if at least 2 of the
sponsors interviewed say they would fund unsolicited verified requests **and** at least 1 commits to a pilot.
Otherwise they stay secondary.

## 11. Changes from the founder's master brief

Each change keeps the brief's function unless stated. The founder can reverse any of them through `07`.

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
