# Revivo Impact — P1 design package (25 Nov 2026)

**Status: complete, waiting for the founder's approval.** No functional prototype work (P2) starts until the founder
approves this package or asks for changes. Written for a non-technical reader; technical detail lives in the linked
documents.

## 1. What P1 is, in plain words

P1 turns the founder's decisions into a complete blueprint and a first clickable "shell" of the product. The blueprint
says what every screen does, who can see what, how every number is calculated, which fictional people and
organisations exist, and which photos are needed. The shell lets you click through the start screen, the role list and
twelve representative screens on a phone, tablet or laptop. It is a design preview, not the working prototype: buttons
that would change records arrive in P2 and P3.

## 2. The 20 deliverables the founder asked for, and where each one is

| # | Deliverable | Where |
|---|---|---|
| 1 | Updated product definition | `02-product-definition.md` (rewritten) |
| 2 | Updated founder decisions | `07-decisions-for-founder.md` (answers recorded; "Founder direction" section) |
| 3 | Shared discovery and private workspace architecture | `02` §3.1 (two environments), §8 (who sees what) |
| 4 | User registration and onboarding flows | `02` §3.2 (five open paths); screen 2 "Join" in the shell |
| 5 | Athlete, coach, guardian, organisation and funder experiences | `03` §2, §5; personas `05` §3 |
| 6 | Role-based navigation | `03` §2 (at most five items per role); live in the shell |
| 7 | Screen inventory and reusable layouts | `03` §3 (nine layouts), §4 (23 screens + 3 panels) |
| 8 | Data model and relationships | `02` §2 (object model and diagram) |
| 9 | Financial status and consistency rules | `02` §6 (definitions, invariants I1–I13, line-item requests and holds, duplicate prevention, separation of duties, currencies) |
| 10 | Permissions, verification, privacy and safeguarding model | `02` §3.3–3.4, §5, §7, §8 |
| 11 | Five connected demonstration journeys | `03` §5 (A 13 steps, B 7, C 8, D 4, E 6) |
| 12 | Realistic multi-organisation fictional dataset | `05` (9 funders, 37 seeking organisations, 240 athlete profiles, 16 personas, 12 opportunities, 16 funding requests, 124 agreements; expected values at all three demo dates) |
| 13 | Discovery experience in both directions | `03` §7; shell screens "Discover" (Amira, Kenji, Lucy) |
| 14 | Sports funding and sponsorship workflows | `02` §2, §4, §9; `03` §5 journeys B and E |
| 15 | Image asset plan and generation prompts | `10-image-asset-plan.md` (19 images, master block, prompts) |
| 16 | Responsive design previews | `docs/p1-previews/` (phone 375, tablet 768 and 1024, laptop 1440; Dark and Daylight) |
| 17 | Clickable prototype shell | `src/` (run `npm install` then `npm run dev`; `npm run build` makes one offline HTML file) |
| 18 | Updated development phases | `06` §8 |
| 19 | Prototype acceptance criteria | `06` §9 (29 criteria mapped to journeys, screens and tests) |
| 20 | Significant unresolved risks and decisions | §7 below |

## 3. What changed from P0, and why

| Area | P0 said | P1 (after the founder's decisions) | Why |
|---|---|---|---|
| Product shape | Funder-led round as headline; athlete requests and funder discovery secondary, within a funder's network | **Open, controlled, two-sided ecosystem**; full two-way discovery demonstrated; institutional sales first | Founder D6: product scope and launch priority are different decisions |
| Registration | Mainly via a funder's share link | Five open registration paths; no invitation or Pathway account needed | Founder §3 |
| Architecture | One set of screens per role | **Shared discovery environment + private workspaces** | Founder §3D |
| Central record | "Award" everywhere | One internal record (funding agreement); interface names by type | Founder D7 |
| Individual sponsors | Deferred | Included lightly (Marcus Halvorsen); no access to minors | Founder D8 |
| Minors | De-identified Need or authorised application | Also guardian-accepted nominations; anonymised card with a deterministic **identifiability check**; block and report | Founder D9 |
| Sports boundary | Implicit | **Explicit sports-only check** on every listing and profile | Founder §2 |
| Profiles | Field-level verification | Plus **visibility per fact** (discoverable · shared on application · private) | Founder §6 |
| Funder profiles | Not a screen | **Public profile** screen with "Accepts funding requests" | Founder §3C, §6 |
| Navigation | Funder: Overview · Discover · Opportunities · Portfolio · Reports | Overview · Discover · Opportunities · Applications · **Funding** (Reports a tab and an Overview button) | Founder §7 |
| Screens | 22 | **23** (adds the Public profile) | Two-way discovery |
| Journeys | B: guardian's Need part-funded by Oriel | B: adult two-way discovery, two funders, commercial sponsorship; Tiago's anonymised request moves to E | Founder §11 |
| Fictional world | Tallwater-centred | 9 funders of six kinds; open, upcoming and closed opportunities | Founder D5, §14 |
| Supporting line | "…See how every award is used." | "…See how your support is used." | Founder D1 |
| Website | `/prototypes` page; capability rename | Prototypes menu by capability; home "Funding, Grants & Programmes" | Founder D2, D3 |
| Images | 14 | 19, each with a purpose; readability required | Founder §13 |
| Names | Tiago and Rosa Mendes, Kenji Watanabe, Continental U21 Open | **Esteves**, **Arakawa**, Continental U21 **Invitational** | P1 name check found real people and events |

Everything else from P0 is kept: money states and invariants, four-eyes, purpose-based access, three simulated AI
experiences, the Funding Line, the honesty line, the demo clock, the design family rules.

## 4. How the screens connect (the shell)

```
Start ─┬─ Guided journeys (A–E) ── each step opens the right person's screen at the right demo date
       └─ Explore ── Explore by role (16 people) ── a person's workspace (≤ 5 menu items)

Seeker (Amira):  Home ─ Discover ─┬─ Opportunity ── Apply ── Applications
                                  └─ Sponsors & funders ── Public profile ── Send a funding request
                 My Funding ── Funding record (chain · bar · spending) ── Source records

Funder (Kenji):  Discover (brief → chips) ─┬─ Funding request ── Offer support (rules: cap, delegated limit)
                                           ├─ Athletes ── Public profile ── Express interest
                                           └─ Shortlist
Funder (Ingrid): Overview (fund bar · Reports) ── Funding (portfolio) ── Funding record
```

**Built in the shell (representative; updated after the expert review):** Start, Join (step 1), Explore by role, athlete Home (changes with the demo
date), seeker Discover (opportunities and sponsors), Opportunity (eligibility checklist), Public profile (with the
support ask), funder Discover (brief, tabs, rule-based "matches 3 of 4" order that changes as you remove a filter,
shortlist, anonymised minors), Funding request (with working offer
rules: the cap and the $2,000 delegated limit), Funding record (Funding Line, funding bar, spending, Source records),
funder Overview (fund bar changes with the demo date) and Funding (portfolio). Every other screen opens a clear "Designed in P1 ·
built in P2/P3" page with its question, layout and contents. The prototype bar, fictional-data banner, demo date
(three moments), Reset, Daylight, reduced motion and the guide panel (all five journeys) work.

**Honest limits of the shell:** it changes no records; totals are taken from the reconciled dataset, not yet from a
ledger; image areas are placeholders; "Show me / I'll do it" and "What changed" arrive in P2–P3.

## 5. Previews

`docs/p1-previews/` holds screenshots at phone (375px), tablet (768px and 1024px) and laptop (1440px) widths, in Dark,
with a Daylight sample. An index is in `docs/p1-previews/README.md`.

## 6. Expert review (25 Nov 2026)

**Who reviewed.** Three independent AI review passes, each given the documents and screenshots but not my conclusions,
each combining several expert lenses: (1) sports funding and athlete sponsorship, two-sided marketplace and commercial
strategy; (2) creative direction, product and UX design, UX research, sports brand and accessibility; (3) software
architecture, grant-finance controls, responsible AI and child safeguarding. Two short research checks supported them
(two-sided sponsorship platforms, `08` §2.0; name checks, `05` §7). These are AI perspectives, not consultations with
outside people. The 12–18 real interviews in `01` §10 remain the real test.

**What they confirmed.** The money model, the minors model and the separation of commercial from development money
would stand up to an expert; every headline total and every 2027 weekday checked out; the shell reads as Revivo at
once and its working screens are restrained, not grey-heavy and not a dashboard.

**What changed because of the review** (all applied):

| Area | Finding | Change |
|---|---|---|
| Double funding | A request part-paid from the athlete's own money, or with a pending application for the same amount, could still attract offers | Requests and offers work **line by line**; "covered from other sources" and "held for a pending application" reduce what is still needed (`02` §6.1–6.3; Nadia now $600 still needed at 30 Jun, Tiago $0 open) |
| Release controls | One person could approve an offer and record its payment; a reviewer alone could create a commitment | **Separation of duties**: the approver never records the release; existing funding needs Approve; individual sponsors' releases flagged and confirmed by the recipient (I11) |
| Selection realism | A waiting list while money was left; tiers looked discretionary; one reviewer for 143 applications | Published **minimum score** (11/16); **tiers tied to criteria** (title / medal / final); **two reviewers per application** with gap flags; "waiting list" = one fact still to verify |
| Verification | "Verified by the people who know you" was not shown | **Federation confirmation** on the profile (Ardent confirms Amira's bronze once; every funder sees it); coach attestations labelled as such |
| Use case 6 | An organisation was not shown being funded by someone new | **Journey C step 1**: Highland Cycling Club funded by Marcus Halvorsen ($2,500) |
| Minors | Cards showed exact dates and line items; nomination could act as search; commercial deals with minors were allowed | Month only and one category total; "See source" never opens a document; nominators use their roster or a guardian's code; **no commercial sponsorship of minors** in the prototype |
| Terms | Four "requests"; "Reserved" next to "Reserve list"; "Direct athlete support" was an origin, not a type | "**Support ask**", "**Held for offers**", "**waiting list**"; **six funding types**, as D7 listed |
| Counts and dates | 14 opportunities claimed (12 exist); too few organisations and minors for the counts; an information request due after decisions | 12 opportunities; 30 light organisations; 240 profiles with every anonymised cell ≥ 10; request dates moved; expected values for all three moments (`05` §9.4) |
| Screens | Some screens contradicted the demo date; primary actions below the fold; faint Funding Line; developer notes on screen; bottom bar on tablets | Lists follow the clock; "Needs you" first on phones; primary near the top; Funding Line with endpoints; notes removed; header navigation from 768px; rows show why they appear and a chevron |
| Images | Wrong subject for Amira's Home; generator sizes; prompts inviting numbers; too much golden hour; casting left to defaults | Woman judoka; trim-once-to-16:9 rule; no numbers or bibs; five daylight scenes; casting in every prompt (`10`) |
| AI | Free text could answer a different question; the claims check would flag the product's own name | Refusal check first and "Answering: …"; chip vocabulary limited to filters; fixed summary template; allow-list (`02` §10) |

One review finding was a false alarm: `CLAUDE.md` had already been brought in line with D6–D9 under the founder's
instruction to update it; its remaining stale references (invariant count, criteria count, section numbers) are now
fixed.

## 7. Open points for the founder (none blocks approval)

Each has a recommendation; reply only if you want something different.

| # | Point | Recommendation |
|---|---|---|
| O1 | **Individual sponsors and minors.** Should a verified individual sponsor ever fund a named young athlete directly? | No, in the prototype: only through clubs and organisations (`02` §5.6). Revisit with a safeguarding adviser before production. |
| O2 | **Commercial sponsorship of under-18s.** Allowed through the guardian, or not at all? | Not at all in the prototype (simpler and safer); production would follow each country's law on contracts with minors. |
| O3 | **Audience or reach data for brands** (followers, media reach). Brands will ask for it; the guardrails ban follower counts. | Keep it out of the prototype; test in brand interviews whether athlete-reported audience figures (never used to order athletes) are needed. |
| O4 | **Image brightness.** You asked to avoid excessively dark images while keeping the family style. | Keep the family grade, five daylight scenes and readable subjects; if the first images still feel too dark, raise the athlete-side target slightly (`04` §9). |
| O5 | **Screen count.** 23 screens against a target of about 22. | Accept: the extra screen (Public profile) is what makes two-way discovery work. |
| O6 | **Prototype limits on contact** (5 open asks per athlete, 20 per funder, 90-day "not now", identifiability threshold of 10). | Accept as prototype defaults; production values need user research and a privacy specialist. |
| O7 | **Names still to check** before any public demonstration (Ardent Judo Federation, Highland Cycling Club, Kenji Arakawa, Elif Demir and others in `05` §7), plus the trademark and domain check for "Revivo Impact". | Run before P5. |
| O8 | **Effort.** Two-way discovery, line-item requests and the review fixes add work. | Plan 30–37 build-days (`06` §8) instead of 30–36. |

**Implementation risks to watch in P2–P3:** keeping the single offline file small once 19 images are added (target
under 6 MB); replaying the event log fast enough on phones (memoised derived state); keeping five journeys
consistent when a viewer acts freely and then moves the demo clock (the checkpoint rule, `06` §4); and the shell's
fixed figures being replaced by the real ledger in P3.
