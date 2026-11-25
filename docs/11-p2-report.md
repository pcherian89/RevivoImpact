# 11 · P2 report: a working two-sided prototype

25 Nov 2026 · branch `claude/festive-fermat-wzl8qa` · fictional data only, no real money, logins, email or SMS.

## 1. What P2 delivers

The P1 shell is now a working prototype on one offline HTML file (`prototype/revivo-impact-p2.html`; or
`npm run build` → `dist/index.html`). Every action goes through one rules engine (`src/domain/engine.ts`), writes one
audit row, and every figure is calculated from the records. Three demonstration dates (12 Apr, 6 May, 30 Jun) load the
story; "Guided journeys" shows each step ("Show me") or lets the viewer do it ("I'll do it"), through the same rules.

**Seeking support (athletes, guardians, coaches, clubs and programmes)**

- Join independently as an adult athlete; build one sporting profile; choose what is discoverable.
- Discover opportunities from five independent funders and seven relevant sponsors, with eligibility checked by
  published rules ("4 of 6 met · 1 for the panel to check · 1 to add"), and see which sponsors accept support asks.
- Apply with the profile (Simulated AI helps organise the statement; the applicant must write it in their own words);
  declare other funding; answer an information request.
- Publish a funding request with line items; ask a sponsor that accepts asks; receive offers line by line; accept or
  decline; confirm receipt.
- Guardians publish anonymised cards for under-18s (identifiability check; names, club and exact dates refused),
  receive every offer, control consent, hide requests, block a funder and report a concern. A coach can prepare but
  never submit, accept, publish or change consent.
- Adults may add an optional commercial profile, used only for commercial sponsorship.

**Providing support (foundations, companies, brands, federations, individual sponsors)**

- Discover athletes, funding requests and teams from organisations they have never met. A plain-language brief
  becomes editable filters (Simulated AI, a fixed word list); results are ordered only by how many filters match.
- Publish opportunities with four-eyes approval; review with a rubric, verification and a conflict-of-interest
  confirmation; shortlist at published tiers; send decisions to every applicant with a budget meter.
- Make direct offers within caps, fund balances and the Fund's approval policy (Simple, Standard, Institutional);
  give or withhold the second approval; withdraw with a reason; record releases (simulated) under the finance rule.
- Individual sponsors reach under-18s only with an enhanced safeguarding check, only through a guardian, and only
  after the platform's safeguarding review.

**Platform administration (simulated):** safeguarding reviews, reported concerns, funder verification and the audit.

## 2. Two-way discovery across independent organisations: confirmed

Both directions work between organisations that have no prior relationship, on the same records:

| Direction | What happens (checked by real clicks) |
|---|---|
| Athlete → funders | Amira, with no club introduction, finds five open opportunities from five organisations and seven sponsors; applies to Tallwater and is awarded $4,500. |
| Athlete → sponsor | Nadia publishes a request; asks Halvorsen (an individual sponsor) through the structured ask. |
| Company → athlete | Kenji (Oriel Freight Group) types a brief, finds Nadia first (4 of 4 filters, by rule) and offers $2,000; Nadia accepts both offers: $3,200 pledged, $2,000 still needed, on both sides. |
| Brand → adult athlete | Lucy (Corvane) finds Jonah through his commercial profile; interest, consent, a $6,000 sponsorship agreement kept apart from development money. |
| Individual → club | Marcus funds Highland Cycling Club's youth bikes; no minors' details shared. |
| Funder → young athlete | Kenji and Marcus see only anonymised cards; offers go to the guardian; Marcus's offer passes platform safeguarding review first. |

The funder side is a peer of the athlete side (Discover is the second item in every funder's menu, with athletes,
requests and teams), not a foundation portal with discovery added.

## 3. Tested workflows

`npm run check` runs everything below; all green on the final build.

| Check | Result |
|---|---|
| Unit tests: reconciled figures at all three dates, rules, and 13 regression tests from the reviews | 26 passed |
| Browser journeys with real clicks (Journeys A, B, C step 1, E; safeguarding; privacy; review fixes) | 50 passed |
| Guided steps run through "Show me" | 30 passed |
| Every persona × every menu item × three dates, checked for errors and sideways scroll | 213 pages at 375, 768, 1024 and 1440 px: 0 problems |
| Accessibility (axe) in Dark and Daylight | 0 serious or critical |
| Copy rules (banned and retired words) | passed |

Reconciled figures (`docs/05` §9.4) hold: development 11,900 (12 Apr), 23,600 committed / 21,350 released (6 May),
328,700 committed at 30 Jun without Journey D (P3); Emerging Athletes Scholarship 211,000 committed, 3,500 held,
105,500 released; 143 applications.

## 4. End-to-end review: what it found and what changed

Three independent reviews ran on the built prototype: design and accessibility, a rules, money and safeguarding
verifier, and a hands-on tester using every role.

**Fixed (rules and safeguarding):** reviewers could score another funder's applications; application pages were
visible to anyone with the link (a minor's competition details included); a minor's full name appeared on a funder's
Overview; unverified new companies could see and fund minors' cards; direct offers ignored Standard and Institutional
policies; offers were not tied to the request owner; a decision on a linked application freed its hold (double
funding); decisions could be re-sent (a second award); negative amounts, overwritten records and unknown records were
accepted or crashed; the 90-day "not now", the 20-a-week interest limit and the funder ask cap were missing; offers
above the delegated limit had no way forward (now: second approval or withdraw, shown on Overview); split offers
avoided the limit; blocked funders' open offers stayed open; free text on an anonymised card could name the athlete.

**Fixed (use and clarity):** empty or non-sporting requests and opportunities were accepted (now a sports-only check);
applications could be submitted blank or above the fund's maximum; the funder brief did nothing (now turns into
filters; every sport and region can be filtered); Funding said "No agreements yet" beside a table of agreements;
Lucy's figures contradicted each other; offers could not be declined; the conflict box was pre-ticked and ignored;
"Report a concern" had no button; guide steps A2–A3 opened placeholders; generated profiles showed "2 verified" with
no facts behind it; screens kept the previous person's form; a sponsor's offer ignored the ask it answered; on phones
the apply step and offer panel were below the fold; wording (raw dates, plurals, region capitals, "held for a pending
application").

**Earlier, from the design review:** stacked phone tables, honest empty states, shorter hero band, calmer chips, the
honesty line once per page, plain approval wording, and a privacy fix ("What changed" closes when the viewer changes
person).

## 5. Remaining limitations and open issues

- **P3, as planned:** spending updates and verification, deliverable evidence, programme sessions and alerts,
  reports and review, existing funding (Journey D), Ask Revivo and full funder intelligence (AI C). The 30 Jun totals
  exclude Journey D's $24,000. Tiago's Ostral application stays in review until Journey D (Ostral has one person who
  both reviews and approves, so four-eyes cannot complete in this dataset).
- **Summarised records:** rounds decided before a demonstration date (44 scholarship awards, the Women's Fund's 12
  offers, the other funds' awards) appear as one line per fund, reconciled, not as individual records.
- **Join:** the adult-athlete route always becomes Amira; clubs and programme operators do not yet have a join route;
  the email code is described, not shown.
- **Selection** is one "Send decisions" action with a summary; editing decisions one applicant at a time is not built.
- **Sports-only check** is a fixed word list: it refuses plainly non-sporting costs but is not a full review; the
  real product would add a person's review.
- **Contact limits** use the demonstration dates: one date counts as a week; "90 days" covers the whole demonstration.
- **Tallwater's direct offers** from Institutional funds wait for a second approver; Ingrid is Tallwater's only
  approver in the dataset, so such an offer waits (by design) and can be withdrawn.
- **Phone:** long forms (Apply) keep Submit at the end of the form; the bars at the top take about 190 px.
- **Images** are labelled placeholders until the founder supplies them (`10`).
- Not reproduced from the tester's notes: a lowercased federation name in an AI summary (checked on every page where
  it could appear).

## 6. Estimate

No change to the reassessed estimate for the remaining phases: P3 6–8, P4 3–5,
P5 3 build-days (`06` §8). The next approval gate is after P3.
