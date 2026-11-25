# Revivo Impact — decisions for the founder

**Status (25 Nov 2026): answered.** The founder answered all 18 decisions on 25 Nov 2026 ("Final founder decisions &
P1 development instructions", plus a website note on D2 and D3). Each answer is recorded on its "Founder's answer"
line and every affected document has been updated. Where an answer differs from the recommended default, the answer
wins. The founder's direction that goes beyond the 18 decisions is summarised in §"Founder direction of 25 Nov 2026"
at the end of this file. Open points raised during P1 are in `09-p1-design-package.md` §7.

## Summary

| # | Decision | Recommended default | Founder's answer (25 Nov 2026) |
|---|---|---|---|
| D1 | Product tagline and supporting line | "Connecting sport with opportunity." + "Find funding. Support sporting talent. See how every award is used." | Approved; supporting line "…See how your support is used." |
| D2 | Website: "Products" section or "Prototypes" | One "Prototypes" navigation item → `/prototypes` | Decided: Prototypes menu, each prototype under its capability |
| D3 | Website capability rename | "Funding & Impact Reporting" → "Funding & Grant Management" (same id) | Replaced: home is "Funding, Grants & Programmes" (area "Funding & Governance") |
| D4 | Currencies in the prototype | USD only; GBP and INR only later, as separately authored datasets | Approved; multi-currency-ready model |
| D5 | Main fictional funder name | Tallwater Sports Foundation | Approved; plus many other participating organisations |
| D6 | Commercial focus | Headline: scholarship and grant rounds; module two: programme funding; Needs and funder discovery secondary, within a funder's network | Revised: open, controlled two-sided ecosystem; full two-way discovery shown |
| D7 | The unifying model | Everything centres on the Award; 6 category labels, 4 behaviours; "existing agreement" is an origin | Approved; type-specific names in the interface |
| D8 | Individual donors, individual sponsors, crowdfunding | Defer until after validation | Partly: verified individual sponsors included lightly |
| D9 | Minors in discovery | Never searchable; reachable only through a guardian's de-identified Need or an authorised application | Approved with clarification (anonymised needs, nominations, controls) |
| D10 | Age of a minor in the demo | Under 18 (per-country setting later) | Approved |
| D11 | Commercial sponsorship scope | Light: one seeded deal, payments plus up to 3 deliverables, excluded from development totals | Approved; one complete light adult example |
| D12 | AI experiences | Exactly three, all labelled "Simulated AI"; cut v1's voice-note summary | Approved |
| D13 | Receipt confirmation | Yes: recipients confirm each release ("Received") | Approved; duplicates and overfunding blocked |
| D14 | Screens and navigation | 22 screens + 3 panels; at most 5 navigation items per role | Approved as a target; 23 screens |
| D15 | Revivo Pathway import | Only in Explore (Inês) and on Profile; never in the guided Journey A | Approved |
| D16 | Platform administration | One Audit & admin screen; organisation verification simulated | Approved |
| D17 | Demo year and clock | 2027; three moments: Mon 12 Apr, Thu 6 May, Wed 30 Jun | Approved |
| D18 | Product name and descriptor | "Revivo Impact"; "Sports funding & sponsorship platform"; trademark and domain check before public use | Approved |

## D1 — Product tagline and supporting line

- **Option A (default; founder's preference, supported by the brand panel):** "Connecting sport with opportunity."
  Warm, short, two-sided, and its rhythm cannot be confused with "Pulse of Sport. Mind of the Game.".
- **Option B (market panel):** "Fund sport. See it through." The market panel's concern with A: it never mentions
  funding, "opportunity" is generic job-board language, and it promises a marketplace that will not have many
  participants at first. B is short, sporty, honest and works for funders and athletes.
- **Option C (brand panel runner-up, if accountability should lead):** "Funding sport, followed through."
- **Supporting line (default for any option):** "Find funding. Support sporting talent. See how every award is used."
  It replaces "Track the difference", which implies measured impact that records cannot show.
- Optional athlete-side line under any option: "One profile. Every application."
- Rules for any option: only on Impact's own surfaces (prototype start screen; later the `/impact` page), set in ink
  with no lime words; never on the Revivo homepage or Revivo's social metadata; never "AI built for the pulse of
  sport".
- **Affects:** README, `00`, `01` §8, `04` §2, the start screen copy.
- **Founder's answer:** **Approved (25 Nov 2026).** Tagline "Connecting sport with opportunity." Supporting description changed to **"Find funding. Support sporting talent. See how your support is used."** ("support", not "every award", so it covers scholarships, sponsorship agreements, programme grants and in-kind support). Company tagline stays "Pulse of Sport. Mind of the Game."; never the retired one.

## D2 — Website: "Products" section or "Prototypes"

- **Option A (default): one main-navigation item "Prototypes" → `/prototypes`,** listing Revivo Pathway and Revivo
  Impact, each marked "Prototype · fictional data". It replaces the current "Revivo Pathway" navigation item (which was
  your Nov 2026 decision; this revises it), so the navigation stays at three links.
- **Option B (your earlier preference): a "Products" section.** It conflicts with the website's rules ("Products are
  not a website category"; never describe capabilities as finished products; `check:copy` bans "our products") and
  reads as "buy these apps", which undercuts "we build what you need". Choosing B means rewriting the website's §1
  rule.
- **Option C:** two product names in the navigation. Turns products into a category by the back door and grows with
  every product.
- Either way: website changes happen only later, in the website chat, after the P5 gate. Nothing changes now.
- **Affects:** `01` §9; later the website's `CLAUDE.md` §1 and §5d, `site.ts`, `products.ts`, homepage proof line,
  footer.
- **Founder's answer:** **Decided (25 Nov 2026).** A "Prototypes" menu on the website, with each prototype listed under its capability (as the website now does for Revivo Pathway). No website change from this repository; the presentation of both products is reviewed once Revivo Impact is complete.

## D3 — Website capability rename

- **Option A (default):** rename "Funding & Impact Reporting" to **"Funding & Grant Management"**, keep the id
  `funding-impact-reporting`, and use the new copy in `01` §9, when Revivo Impact appears on the website. Reason: the
  current text describes a team reporting *to* funders, while Impact is mainly a funder's system; the new name is what
  administrators search for and avoids an impact claim.
- **Option B:** keep the current name and copy; link Impact to it unchanged.
- **Affects:** `01` §9; later the website's `explorer.ts` (website chat only).
- **Founder's answer:** **Replaced (25 Nov 2026).** Revivo Impact's single home on the website is the capability **"Funding, Grants & Programmes"** in the area **"Funding & Governance"** (the website's new 12-capability structure, which already uses this name; id `funding-impact-reporting`). The rename to "Funding & Grant Management" is withdrawn. Note: the founder's longer instructions of the same day said "defer; preference 'Sports Funding & Impact'"; the later website decision above supersedes that. No website change from this repository.

## D4 — Currencies in the prototype

- **Option A (default):** USD only through P5. GBP and INR may be added in P4 only if you want them for presentations,
  and only as separately authored datasets (amounts written for each currency, totals re-summed; the switch says
  "Amounts authored for each currency, not converted").
- **Option B:** USD, GBP and INR from P4 as authored datasets (adds about 1–2 days and doubles reconciliation tests).
- Never a symbol swap or an exchange-rate conversion.
- **Affects:** `05` §11, `06` §6 and §8.
- **Founder's answer:** **Approved.** USD for the fictional demonstration. The data model stores every amount with its currency so more currencies can be added later; totals are never combined across currencies (`02` §6.4); never a symbol swap.

## D5 — Main fictional funder name

- **Option A (default): Tallwater Sports Foundation.** "Horizon Sports Foundation" is too close to Horizon Sports &
  Experiences, a real sports sponsorship agency in this market. v1's "Brightwater Fund" is a real grantmaker and is
  retired.
- **Option B:** another invented name you prefer (it must pass a name check in P1).
- **Affects:** every document; `05` §7.
- **Founder's answer:** **Approved, extended.** Tallwater Sports Foundation is the principal funder but **not the only meaningful one**: the world now has several independently participating foundations, companies, brands, a government sports body, federations, clubs, academies and one verified individual sponsor (`05` §2). Names are checked before any public demonstration.

## D6 — Commercial focus

- **Option A (default):** the headline buyer and demo is a foundation or CSR team running an athlete scholarship or
  grant round end to end from a shareable link, then following each award. Programme funding and monitoring (Play
  Every Day) is module two. Athlete-published Needs and funder discovery with Offers are included (your journeys
  B–E need them) but positioned as secondary, within a funder's own network first; they grow into a marketplace only
  if interviews pass the marketplace gate (`01` §10).
- **Option B:** present all four routes as equal, including an open marketplace. Risk: it implies many participants
  Revivo does not have, and mixes CSR money with marketing.
- **Affects:** `01` §3–4, `00`, `03` (journey order).
- **Founder's answer:** **Approved with an important revision.** Revivo Impact is an **open, controlled, two-sided** sports funding ecosystem: anyone with a legitimate sporting purpose can register and discover across all participating organisations, not only within a funder's network. Commercial launch can prioritise institutional subscriptions, but the prototype must fully demonstrate two-way discovery (athlete → unfamiliar funder; company → unfamiliar athlete; athlete → relevant sponsor; organisation → programme funding; foundation → open scholarship). The "marketplace gate" in `01` §10 now governs commercial launch priorities only, not product scope.

## D7 — The unifying model

- **Option A (default):** every route creates an **Award**, and every Award runs the same lifecycle (ledger → updates
  and evidence → review or renewal). Your seven funding categories become six labels with four behaviours (athlete
  development, programme, in-kind, commercial); "existing funding agreement" becomes an origin that any category can
  have.
- **Option B:** separate workflows per route and category (more screens, harder to keep figures consistent).
- **Affects:** `02` §2–4.
- **Founder's answer:** **Approved with clarification.** One common underlying record (the **funding agreement**, internally) with shared financial, approval and reporting logic, but **user-facing names follow the funding type**: Scholarship award, Development grant, Sponsorship agreement, Programme grant, Equipment support, Competition funding (`02` §4).

## D8 — Individual donors, individual sponsors and crowdfunding

- **Option A (default):** defer until after validation. They carry the largest safeguarding and payment-regulation
  risk (unknown adults contacting minors; donation tax) and are not the paying customer.
- **Option B:** include individual sponsors only, as funders with verified organisation-style accounts (needs a
  safeguarding design in P1).
- **Affects:** `01` §3, `02` §12.
- **Founder's answer:** **Partly approved.** Public donations, public crowdfunding and real payments stay deferred. **Verified individual sponsors are included lightly** (one fictional example, Marcus Halvorsen), using the same offer and agreement workflow, with no public solicitation (`02` §5.6).

## D9 — Minors in discovery

- **Option A (default):** minors are never searchable as profiles. Funders reach them only through a de-identified
  Need a guardian published, or an application the guardian authorised. All offers and questions go to the guardian;
  the funder learns the minor's first name only after the guardian accepts or submits.
- **Option B:** allow guardian-approved minor profiles in Discover for verified funders. Not recommended.
- **Affects:** `02` §5 and §7, `03` journeys B and E.
- **Founder's answer:** **Approved with clarification.** No searchable, identifiable minor profiles; no unrestricted contact. Funders may discover **anonymised funding needs** (sport, broad age group, broad region, type of support) after an identifiability check; they may also receive applications and nominations authorised by a guardian. Disclosure is purpose-specific; programme funders see aggregates; consent withdrawal, reporting and blocking controls are provided (`02` §7).

## D10 — Age of a minor in the demo

- **Option A (default):** under 18, shown as a per-country setting for later.
- **Option B:** another age.
- **Affects:** `02` §5, `05`.
- **Founder's answer:** **Approved.** Under 18 in the prototype; production must follow each jurisdiction's rules.

## D11 — Commercial sponsorship scope

- **Option A (default):** light. One seeded deal (Corvane Sportswear sponsors an adult sprinter: $6,000, up to 3
  deliverables owed by the athlete), visible in Explore; commercial amounts reported separately and never counted in
  development, programme or impact totals. Sponsorship inventory, valuation and activation belong to a possible future
  "Revivo Partner".
- **Option B:** a fuller sponsorship journey (deliverable tracking, proof of exposure). Overlaps Revivo Partner and
  the website's Sponsorship Management capability.
- **Affects:** `01` §3, `02` §4, `05` §2.
- **Founder's answer:** **Approved with clarification.** Commercial sponsorship stays distinct from development, scholarship, CSR and programme funding. One complete but light example: Corvane Sportswear sponsors an adult sprinter (profile, objectives, amount, agreement, up to 3 deliverables, completion, review). No media valuation or sponsorship-intelligence features.

## D12 — AI experiences

- **Option A (default):** exactly three, each labelled "Simulated AI": A matching (with explanations; eligibility by
  rule), B application help (only from the applicant's records, with refusals), C funder intelligence and report
  drafting (every sentence traceable, with refusals). Cut v1's voice-note summary; coaches type a short note.
- **Option B:** keep the voice-note summary as a fourth experience.
- **Affects:** `02` §9, `03`, `06` §5.
- **Founder's answer:** **Approved.** Three simulated AI experiences (matching in both directions; application and funding-request help; funder insights and reporting). No opaque scoring, no invented facts, figures only from records; voice notes deferred.

## D13 — Receipt confirmation

- **Option A (default):** yes. After the funder records a release, the recipient confirms it arrived (one tap). This
  is what separates "pledged" from "received".
- **Option B:** no separate confirmation (simpler, but "released" could be mistaken for "received").
- **Affects:** `02` §6, `03` journeys A and B.
- **Founder's answer:** **Approved.** The recipient confirms receipt of each recorded release; this is not bank verification. Duplicate entries, overfunding and inconsistent totals are prevented by rule (`02` §6). All transactions are simulated.

## D14 — Screens and navigation

- **Option A (default):** 22 screens and 3 shared panels from 9 templates; at most five navigation items per role.
  Athlete: Home · Discover · Applications · Funding · Profile. Guardian or coach: Home · My athletes · Discover ·
  Applications · Funding. Funder: Overview · Discover · Opportunities · Portfolio · Reports. Organisation seeking
  funding: Home · Discover · Applications · Funding · People. "My progress" is merged into "Funding"; the funder's
  applications live inside each Opportunity; "Impact & reports" becomes "Reports".
- **Option B:** your original six-item navigations.
- **Affects:** `03` §2 and §4, `04`.
- **Founder's answer:** **Approved.** About 22 screens from nine layouts is a design target, not a limit; at most five main navigation items per role. P1 result: 23 screens and 3 panels (`03` §4), with the navigation labels refined in `03` §2.

## D15 — Revivo Pathway import

- **Option A (default):** an optional, simulated "Import verified records from Revivo Pathway" on Profile, shown in
  Explore (Inês) only; never in the guided Journey A, which must prove independence.
- **Option B:** also show it as an optional step in Journey E.
- **Affects:** `02` §11, `03` §5.
- **Founder's answer:** **Approved.** Revivo Impact is completely independent of Revivo Pathway. The simulated, consent-based import appears only in Explore and never in the guided journey.

## D16 — Platform administration

- **Option A (default):** one Audit & admin screen; organisation verification is shown as simulated.
- **Option B:** a fuller administration area (not needed for any journey).
- **Affects:** `03` §4.
- **Founder's answer:** **Approved.** One Audit & admin area (audit, organisation verification, safeguarding checks, reports of concern). Simulated verification is never presented as real.

## D17 — Demo year and clock

- **Option A (default):** 2027, with three clock moments: Mon 12 Apr (applications open), Thu 6 May (selection and
  delivery check), Wed 30 Jun (quarter end). v1's Greenpark misses move to Tue 4 and Thu 6 May 2027 so the weekdays
  stay correct.
- **Option B:** another year (all dates in `05` §10 would be recalculated).
- **Affects:** `03` §5, `05` §10.
- **Founder's answer:** **Approved.** 2027: Mon 12 Apr (applications open), Thu 6 May (selection), Wed 30 Jun (quarter-end review); every record is consistent with these dates (`05` §10).

## D18 — Product name and descriptor

- **Option A (default):** "Revivo Impact" (always with "Revivo"), with the descriptor "Sports funding & sponsorship
  platform". "Impact" is the buyer's word; the honesty line and the funder's "Reports" label stop it implying proof.
  A trademark and domain check is required before any public use (impact.com and others use the word).
- **Option B:** a different name (alternatives reviewed and rejected in `01` §8: Revivo Fund, Grant, Backing, Boost,
  Patron, Partner).
- **Affects:** every document.
- **Founder's answer:** **Approved.** "Revivo Impact — Sports Funding & Sponsorship Platform". Name, trademark and domain checks before public commercial use.

## Not decisions (fixed by the brief or by safety, listed so they are not reopened)

Fictional data only; no real money; humans decide (AI never decides, ranks by merit, releases money or claims
impact); four-eyes; purpose-based access; the honesty line; no changes to the Revivo website or Revivo Pathway from
this repository; no deployment, purchases, paid APIs or credentials without approval.

## Founder direction of 25 Nov 2026 (beyond the 18 decisions)

Recorded so later sessions apply it. Full text: the founder's message of 25 Nov 2026 (summarised here; where any
earlier document disagrees, this wins).

1. **Vision.** A standalone, independently accessible, two-sided Sports Funding & Sponsorship Platform solving three
   connected problems: seekers struggle to find funding; funders struggle to find credible athletes and initiatives;
   funders struggle to see how money is used. Central experience: **Discover → Apply or Connect → Fund → Track →
   Review.** Not a foundation-only tool, a scholarship portal or a reporting dashboard.
2. **Sports-only boundary.** Every profile, opportunity, request, agreement and programme must have a direct link to
   sport. No general academic scholarships, non-sport charity or generic fundraising. Education support is allowed only
   when tied to an athlete's sporting development or dual-career pathway (`02` §4.3).
3. **Open registration and two-way discovery are mandatory now**, not a future option. Nobody needs an invitation, an
   existing relationship or a Revivo Pathway account to join. Discovery works both ways; sponsors can find athletes
   outside their networks; seekers can send structured requests only to funders that accept them; no unrestricted
   contact or spam (`02` §3).
4. **Shared discovery environment plus private organisational workspaces** (`02` §3). Opportunities can be public,
   restricted or invitation-only. Athlete visibility is consent-based. The product never claims a comprehensive list of
   sponsors: it shows participating sponsors and verified opportunities only.
5. **Seven real-world use cases** must be immediately understandable (`03` §5): athlete seeking funding; coach managing
   athletes; foundation offering 50 scholarships; company looking for athletes; athlete requesting specific support;
   sports organisation seeking funding; existing funded athletes and programmes.
6. **Profiles** are reusable and sport-specific; visibility is controlled per field (discoverable / shared on
   application / private); verified facts are distinguished from self-reported ones; no blanket badge. Funder profiles
   state sporting interests, sports, regions, categories, open opportunities and whether they accept requests.
7. **Navigation** suggestions (refined in `03` §2): athlete Home · Discover · Applications · My Funding · Profile;
   coach or guardian Home · My Athletes · Discover · Applications · Funding & Updates; funder Overview · Discover ·
   Opportunities · Applications · Funding (Reports easy to find). Organisations may seek and provide funding at once.
8. **Accountability chains** kept: athlete (need → support → disbursement → receipt → expenditure → verification →
   progress → review), programme, and commercial (agreement → funding → deliverables → evidence → review). Outputs,
   sporting outcomes and independently evaluated impact are kept distinct.
9. **Commercial strategy.** Institutional subscriptions first; free basic participation for athletes, parents and
   coaches; no assumed commissions or validated prices; no payments in the prototype.
10. **Design.** Immediate Revivo family resemblance; black, white and electric lime; cinematic photography; avoid
    grey-heavy interfaces, excessively dark imagery, generic SaaS dashboards, unnecessary cards, unexplained charts.
    Reuse the design language, not every layout. A complete image asset plan with ChatGPT prompts (`10`).
11. **Prototype, not production.** A complete, interactive, end-to-end prototype on fictional data; no real
    authentication, databases, payment gateways, external integrations or backend services. Every important action
    changes the connected fictional state.
12. **Website.** The website is being restructured from 16 to 12 capabilities; the old 16-capability structure is not
    a requirement; nothing on the website is changed from here.
