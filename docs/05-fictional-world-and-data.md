# Revivo Impact — fictional world and data

**This file is the source of truth for every name and number.** Every other document must match it. All people,
organisations, places, competitions, amounts and records are invented. All amounts are USD (§11). Items marked
"P1" are fixed in the P1 seed specification and must respect the invariants in `02` §6.2.

## 1. Principles

- Coherent, international and diverse: several sports, genders, ages and backgrounds; para sport included.
- Never real organisations or real people; no real countries named in the prototype (§12).
- Enough records that nothing looks empty; not thousands of records for show.
- Every aggregate is computed from records by a seeded generator (fixed seed). No aggregate is typed in. If an
  illustrative aggregate is ever needed, it is labelled as such.

## 2. Organisations and funds

| Organisation | Role | Funds and awards |
|---|---|---|
| **Tallwater Sports Foundation** (international foundation; main funder) | Funder | **Emerging Athletes Scholarship** (Scholarship; §4). **Community Sports Programme Grant** (Programme grant; $180,000; 7 applications; 3 awards, one of them Play Every Day at $60,000; the other two awards and their amounts are P1, and must keep Available ≥ 0). **Federation Development Grants** (Development grant; created in Journey D with one existing agreement: Ostral Swimming Federation, regional coach development, $24,000). |
| **Corvane Sportswear** (sportswear company) | Funder | **Women's Sporting Development Fund** (Development grant; $40,000; 18 applications; 12 grants committed: 8 × $3,000 + 4 × $3,500 = $38,000; available $2,000). **Corvane Athlete Partnerships** (Commercial sponsorship; one deal: an adult sprinter, $6,000, 3 deliverables; name and deliverables P1). The same organisation deliberately runs both, to show the categories kept apart. |
| **Oriel Freight Group** (logistics company; CSR team) | Funder | **Equipment Support Programme** (Equipment or in-kind support; 60 kits, declared value $9,000 = $150 per kit; 15 applications). **Oriel Athlete Support** (Direct athlete support; $20,000; delegated offer limit $2,000; used for Offers on Needs, including Tiago's $1,500). |
| **Ostral Swimming Federation** | Funder and recipient | Funder: **Competition Travel Grant** (Development grant; $30,000; 24 applications, including Tiago's from Journey E). Nominator: 3 swimmers nominated into the Emerging Athletes Scholarship. Recipient: Tallwater's existing agreement ($24,000; Journey D). |
| **Saltmere Sports Academy** (multi-sport academy, Coastal Region) | Recipient | Home club of Amira (judo) and Tiago (swimming); coaches Jonas Becker and Keiko Mori; one application to the Community Sports Programme Grant (outcome P1). |
| **Lanternfield Community Sport** (programme operator) | Recipient | Operator of **Play Every Day** (§6), funded by Tallwater's Community Sports Programme Grant. |
| Play Every Day sites | Sites of Lanternfield's programme (not separate accounts) | Riverside School, Hillview Academy, Eastfield Centre, Greenpark School, Westbrook Centre, Northgate School |
| Light organisations (P1) | Various | The other programme-grant applicants, clubs, schools, and the federations whose documents verify results (for example a national judo federation's results list). |

## 3. Personas (13)

| Persona | Organisation · role (permissions) | Device | Journeys | "Try this" tasks in Explore |
|---|---|---|---|---|
| **Ingrid Solberg** | Tallwater · Director of Programmes (Approve, Admin) | laptop | A | Approve the scholarship decisions; export the selection record; try to approve your own draft (blocked) |
| **Daniel Osei** | Tallwater · Programme officer (Review, Verify) | laptop / tablet | A, C, D | Verify a result against a document; request information; add existing funding |
| **Priya Nair** | Tallwater · Finance officer (Finance) | laptop | A, C | Record a release; verify an expense; open a Fund total and follow it to the records |
| **Amira Haddad**, 19, judo | Independent adult athlete (Saltmere Sports Academy) | phone | A | Check eligibility; apply with help; submit an Update |
| **Rosa Mendes** | Guardian of **Tiago** (16, swimming) and **Inês** (13, football) | phone | B, E | Switch athletes; publish a Need; withdraw photo consent |
| **Jonas Becker** | Saltmere Sports Academy · head swim coach; authorised for 6 athletes | tablet | E | Prepare an application (you cannot submit it); submit an Update; see only the athletes you are authorised for |
| **Kenji Watanabe** | Oriel Freight Group · CSR manager (Approve, Finance; $2,000 delegated offer limit) | laptop | B | Search Needs with a plain-language brief; make an offer and meet the cap; look at in-kind equipment awards |
| **Lucy Adeyemi** | Corvane Sportswear · Partnerships (Approve) | laptop | Explore only | Try to approve a $3,000 Women's Fund grant (I1 blocks it); open the commercial deal's deliverables; see it excluded from development totals |
| **Maya Torres** | Lanternfield · Programme director (Manage programme, Approve, Admin) | laptop | C | Ask "Why is Greenpark behind?"; approve a recovery plan; draft a report through the claims check |
| **Lena Novak** | Lanternfield · Greenpark site coordinator (Manage programme for her site, Verify sessions) | tablet | C | Submit a recovery plan; verify sessions; read your site's session strip |
| **Sam Rivera** | Lanternfield · coach at Greenpark and Westbrook (Record sessions) | phone | C | Record a session; mark "Couldn't run"; see that you only see your own registers |
| **Farid Rahimi** | Ostral Swimming Federation · Development manager (Admin, Approve, Finance, Review) | laptop | D | Switch between seeking and providing funding; confirm existing funding; review Competition Travel Grant applications |
| **Alex Moreau** | Revivo platform administrator | laptop | Explore only | Verify an organisation (simulated); filter the audit; see that documents are not visible to you |

Non-persona people: **Keiko Mori** (judo coach at Saltmere; attests Amira's training and is her referee); **Jo
Adebayo** (relief coach at Greenpark from week 8); an unnamed reviewer colleague at Corvane (prepares the Women's Fund
recommendations Lucy approves). v1's evaluation lead (Dr Hannah Kim) is cut.

## 4. Main opportunity: Emerging Athletes Scholarship (Tallwater)

| Field | Value |
|---|---|
| Category · behaviour | Scholarship · Athlete development |
| Announced | $250,000 |
| Awards | Up to 50, in published tiers of $3,500, $4,500 and $5,000 (maximum $5,000) |
| Purpose | Coaching, training fees, competition entry and travel, and equipment for the season |
| Eligible sports (9; final list P1) | Athletics (including para athletics), badminton, boxing, cycling, judo, rowing, swimming, table tennis, wheelchair basketball |
| Eligibility (6 criteria) | 1 Aged 15–21 on 30 Apr 2027 · 2 One of the 9 sports · 3 Lives in an eligible region · 4 A result at national level or above in the last 18 months · 5 A coach or club referee · 6 A statement of financial need |
| Also required | "Other funding for the same costs" declaration; proof of age (ID document); results evidence; coach or club reference; budget with invoices or quotes |
| Access route | Open via the share link, plus nominations by federations and clubs (the nominee or their guardian accepts and completes) |
| Visibility | Public link |
| Published | Mon 12 Apr 2027 (Journey A step 1) |
| Deadline | Fri 30 Apr 2027 |
| Decisions | Thu 6 May 2027 |
| Selection | Rules → reviewer verification and rubric (4 criteria scored 1–4) with conflict declarations → shortlist → a different person approves → decisions sent together |
| Release schedule | Two instalments: 50% on acceptance; 50% on Wed 1 Sep 2027 after a satisfactory review |
| Reporting | Quarterly Update (expenses with receipts, sporting progress); review at each quarter end; 12-month term |
| Acceptance window | 14 days (extendable once with a reason) |

**Applications (143):** 46 offered · 2 reserve list · 81 not selected · 14 not considered by rule (9 not eligible, 5
incomplete at the deadline). 3 arrived by nomination (Ostral; all three are minors whose guardians accepted). 142 are
seeded; Amira's is created in Journey A.

**Offers (46, $214,500):** 27 × $5,000 + 13 × $4,500 + 6 × $3,500. By Wed 30 Jun 2027: 45 accepted ($211,000) and 1
still reserved ($3,500; a 17-year-old's guardian asked for more time, window extended to Thu 15 Jul 2027 with the
reason recorded).

## 5. The other worked records

**Amira Haddad** (19, judo, Saltmere Sports Academy, Coastal Region). Results: bronze, National U21 Judo Championships
2026 (verified by Daniel on 6 May against the federation results document); gold, Coastal Region Judo Open 2026.
Current support: Saltmere travel bursary $300 (declared after the information request). Requested $4,800; awarded
$4,500. Ledger at Wed 30 Jun 2027: committed $4,500; released $2,250 (6 May, receipt confirmed); reported $1,930
(coaching fees Apr–Jun $900, Continental U21 Open entry $180 and travel $640, competition judogi $210 without a
receipt); verified $1,720; awaiting $210; unspent $320; outstanding $2,250. Progress: 5th place at the Continental U21
Open (results document); 34 of 36 training sessions (attested by Keiko Mori). Review: "Continue with conditions:
instalment 2 on Wed 1 Sep once the judogi receipt is added."

**Tiago Mendes** (16, swimming, Saltmere; guardian Rosa Mendes). Need: competition travel to the National Age-Group
Championships in August 2027, $2,400 (flights $1,350, accommodation $650, entry $150, team kit levy $250); qualification
verified by an Ostral document; visibility "Verified funders only"; de-identified card "Swimmer · 16 · Coastal Region ·
qualification verified". Oriel offers $1,500 (an attempt at $2,600 is blocked by I4); Rosa accepts; released $1,500 and
receipt confirmed; remaining $900; any further offer capped at $900. Journey E: application to Ostral's Competition
Travel Grant for $900, prepared by Jonas, submitted by Rosa, other funding declared: Oriel $1,500 (decision pending).

**Inês Mendes** (13, football). Profile managed by Rosa; optional Revivo Pathway import shown in Explore.

**Ostral existing agreement** (Journey D, Wed 30 Jun 2027): Tallwater Federation Development Grants → Ostral Swimming
Federation, regional coach development, $24,000; carried in: released $12,000, reported $10,400; next Update due Thu 30
Sep 2027.

## 6. Programme: Play Every Day (v1 numbers, kept)

Funded by Tallwater's Community Sports Programme Grant; delivered by Lanternfield Community Sport. Programme grant
$60,000 for 12 months; tranche 1 of $12,000 released for the April–June quarter (the schedule of the remaining $48,000
is P1). 6 sites, 460 participants, 12 coaches (4 work across two sites). Target this quarter: 120 sessions (20 per
site, Tuesdays and Thursdays over 10 programme weeks starting the week of Mon 5 Apr 2027; exact calendar P1).

| Site | Delivered / 20 | Participants | Not delivered | Status |
|---|---|---|---|---|
| Riverside School | 20 | 90 | — | On track |
| Hillview Academy | 18 | 80 | 2 weather | Needs attention |
| Eastfield Centre | 20 | 70 | — | On track |
| Greenpark School | 14 | 75 | 2 weather, 4 coach availability | Behind |
| Westbrook Centre | 17 | 70 | 3 weather | Needs attention · 2 awaiting verification |
| Northgate School | 19 | 75 | 1 weather | On track · 2 awaiting verification |
| **Total** | **108 / 120** | **460** | **12: 8 weather, 4 coach availability** | 104 verified, 4 awaiting |

Status rule: ≥ 95% on track; 85–94% needs attention; < 85% behind. Alert: two consecutive missed sessions at one site.

**Greenpark timeline (2027):** weeks 1–4 delivered (8 sessions); Tue 4 May missed (weather) and Thu 6 May missed
(coach availability) → alert; recovery plan submitted by Lena and approved by Maya on Fri 7 May (relief coach Jo
Adebayo from week 8, plus 4 make-up sessions next quarter); weeks 6–7: 3 more coach-availability misses and 1 weather
miss; weeks 8–10 delivered (6 sessions). Total 14 delivered, 2 weather, 4 coach.

**Quarter spending (tranche 1, $12,000):**

| Budget line | Budget | Spent |
|---|---|---|
| Coaching ($60 × delivered sessions) | 7,200 | 6,480 (108 × $60) |
| Equipment (includes the $600 purchase in Journey C) | 1,800 | 1,800 |
| Venue and transport | 1,800 | 1,500 (includes the $432 transport claim without a receipt) |
| Monitoring and evaluation | 1,200 | 1,020 |
| **Total** | **12,000** | **10,800** |

Verified $10,368; awaiting $432; 96% documented; unspent $1,200.

**Evidence:** 104 verified sessions; consented photos (3 removed after consent was withdrawn on 18 Jun 2027; no name
shown). **Survey (self-reported):** 212 of 460 participants answered both rounds; "I feel confident trying new
activities" rose from 58% to 71%; no comparison group. Review: "Continue with conditions: Greenpark check in week 4 of
next quarter."

## 7. Names: retired, checked, to verify

| Name | Status |
|---|---|
| Horizon Sports Foundation | **Retired.** Horizon Sports & Experiences is a real, active sports sponsorship and marketing agency in this market. Replaced by Tallwater Sports Foundation (decision D5). |
| Brightwater Fund (v1 funder) | **Retired.** A real grantmaking foundation. |
| Tallwater, Corvane | No hits in web searches (24 Nov 2026). Final trademark-style check in P1. |
| Greenpark School | Exists (Tauranga, New Zealand); the name is generic. Kept as a site name, final check in P1. |
| Play Every Day | A generic phrase (used by Playworks). Kept as the programme name. |
| Oriel Freight Group, Ostral Swimming Federation, Saltmere Sports Academy, Lanternfield Community Sport | **To check in P1.** |
| Site names (Riverside, Hillview, Eastfield, Westbrook, Northgate) | Generic; check in P1 that none is a well-known sports organisation. |
| Persona names; Continental U21 Open; National Age-Group Championships | Check in P1 that none matches a prominent real person or event in sport funding. |
| "Revivo Impact" | Trademark and domain check before any public use (impact.com and others use "impact"). |

## 8. Seed sizes

| Records | Count |
|---|---|
| Athlete profiles | 160: 24 rich, 136 light; about 40% minors, managed by 52 guardian accounts |
| Principal organisations | 6 (§2), plus 6 Play Every Day sites and light organisations (P1) |
| Applications: Emerging Athletes Scholarship | **143** (46 offered, 2 reserve list, 81 not selected, 14 not considered by rule) |
| Applications: other funds | Competition Travel Grant 24 · Women's Sporting Development Fund 18 · Equipment Support Programme 15 · Community Sports Programme Grant 7 |
| **Applications in total** | **207** |
| Needs | 12: 5 partly funded, 2 fully pledged, 5 open with no pledge |
| Awards | About 82 (exact P1) |
| Expense lines | About 260 |
| Progress records in Updates | About 70 |
| Session records | 108 delivered this quarter (plus the 12 not delivered, with reasons) |
| Play Every Day participants | 460 pseudonymous records, visible only to the operator |

## 9. Reconciled figures (check list for tests)

| Figure | Value | Reconciles as |
|---|---|---|
| Emerging Athletes Scholarship offers | $214,500 | 27 × 5,000 + 13 × 4,500 + 6 × 3,500 |
| Committed (30 Jun) | $211,000 | 214,500 − 3,500 reserved |
| Available to award (30 Jun) | $35,500 | 250,000 − 211,000 − 3,500 |
| Released (30 Jun) | $105,500 | 50% of 211,000 |
| Outstanding (30 Jun) | $105,500 | 211,000 − 105,500 |
| EAS applications | 143 | 46 + 2 + 81 + 14; 14 = 9 + 5 |
| Amira reported | $1,930 | 900 + 180 + 640 + 210 |
| Amira verified / awaiting / unspent / outstanding | $1,720 / $210 / $320 / $2,250 | 900 + 180 + 640; 1,930 − 1,720; 2,250 − 1,930; 4,500 − 2,250 |
| Tiago requested / remaining | $2,400 / $900 | 1,350 + 650 + 150 + 250; 2,400 − 1,500 |
| Women's Fund committed / available | $38,000 / $2,000 | 8 × 3,000 + 4 × 3,500; 40,000 − 38,000 |
| Play Every Day delivered | 108 / 120 | 20 + 18 + 20 + 14 + 17 + 19 |
| Not delivered | 12 | 8 weather (2 + 2 + 3 + 1) + 4 coach |
| Verified sessions | 104 | 108 − 4 awaiting |
| Participants | 460 | 90 + 80 + 70 + 75 + 70 + 75 |
| Quarter spend | $10,800 | 6,480 + 1,800 + 1,500 + 1,020 |
| Programme verified / documented | $10,368 / 96% | 10,800 − 432; 10,368 ÷ 10,800 |
| Programme unspent | $1,200 | 12,000 − 10,800 |
| Ostral outstanding | $12,000 | 24,000 − 12,000 carried-in released |
| Applications in total | 207 | 143 + 24 + 18 + 15 + 7 |

## 10. Demo clock and calendar

Three moments: **Mon 12 Apr 2027** (applications open), **Thu 6 May 2027** (selection; delivery check), **Wed 30 Jun
2027** (quarter end). Moving the clock forward only reveals seeded records; it never invents state. The clock is an
injected date, never the device clock. Other fixed dates: deadline Fri 30 Apr; Greenpark misses Tue 4 and Thu 6 May;
recovery plan approved Fri 7 May; information-request due date Thu 13 May; offer acceptance by Thu 20 May; extended
offer Thu 15 Jul; photo consent withdrawn (programme) 18 Jun; instalment 2 Wed 1 Sep; Ostral Update due Thu 30 Sep.

## 11. Currency policy

- **USD only in the prototype** until the founder approves otherwise (decision D4).
- If GBP and INR are approved (P4 at the earliest), each is a **separately authored dataset**: the seed is
  parameterised by per-currency price tables (for example a session costs $60, £50 or ₹1,200; the scholarship is
  $250,000, £200,000 or ₹2 crore) and every total is re-summed from records. Never a symbol swap and never an
  exchange-rate conversion. The switch says "Amounts authored for each currency, not converted". INR uses lakh and
  crore grouping.
- One currency per Fund; no currency exchange inside the product.

## 12. Fictional geography

Regions use plain invented descriptors (Coastal Region, Northern Region, Central Region, Lakes Region, Southern
Region; final list P1). No real countries, cities or landmarks appear in the prototype. Competitions are fictional
(National U21 Judo Championships, Coastal Region Judo Open, Continental U21 Open, National Age-Group Championships).
