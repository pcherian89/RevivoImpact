# Revivo Impact — experience and screens

How people move through the product. Objects and rules: `02`. Look and feel: `04`. Names and figures: `05`.

**Revised in P1 (25 Nov 2026):** open registration, two-way discovery, refined navigation, 23 screens, journeys A–E
rebuilt around the founder's seven use cases (§5). What changed and why: `09` §3.

## 1. Ease-of-use principles (founder priority)

1. **One question per screen.** Each screen's title is the question it answers (§4). If a screen needs two titles,
   split it.
2. **At most five main navigation items per role** (§2). A role sees only what it can do.
3. **Home shows "what needs you" first**: at most three items, each with one button that goes straight to the task.
4. **The next step is always visible.** Every application, request and agreement shows its Funding Line with the
   current node and one sentence, for example "Next: the panel decides by Thu 6 May."
5. **One primary button per view**, worded as the outcome ("Submit application", "Send offer"), never "Continue".
6. **Progressive disclosure.** Definitions, sources and audit trails sit one tap away ("See source", "What does
   committed mean?"), never as long text on the screen.
7. **Forgiving forms.** Autosave with a "Saved" indicator; the profile prefills every application and request, so
   nothing is typed twice; missing items are listed before submission; errors show a summary plus an inline message.
8. **Plain words for seekers.** "Paid to you", not "disbursement"; "Funding request", not "Need". Funder screens may
   use financial terms, each with a definition (`02` §6.1).
9. **Phone first for athletes and guardians** (tested at 375px); tablet for coaches and site coordinators; laptop
   first for funders (must still work at 1024px).
10. **Guided mode is the default entry.** The signature journey takes about ten minutes; the other journeys and free
    exploration are one tap away.

## 2. Navigation per role (refined from the founder's suggestions)

| Role | Main navigation (≤ 5) | What lives where |
|---|---|---|
| Adult athlete | **Home · Discover · Applications · My Funding · Profile** | Discover switches between *Funding opportunities* and *Sponsors & funders*. Applications holds applications, nominations, requests sent to funders and offers received. My Funding holds agreements, payments, spending, progress, deliverables and the athlete's own funding requests. Profile holds the sporting profile, visibility and consent. |
| Guardian or coach | Athlete switcher ("Managing: Tiago ▾") + **Home · My Athletes · Discover · Applications · Funding & Updates** | My Athletes holds each athlete's profile, consent, representatives and (guardians) safety controls. A coach sees only athletes and powers granted. |
| Funder or sponsor (organisation) | **Overview · Discover · Opportunities · Applications · Funding** | Discover: *Athletes · Funding requests · Teams & initiatives · Shortlist*. Applications: applications by opportunity, support asks received, offers sent. Funding: portfolio, agreements, programmes and **Reports** (a tab, plus a "Reports" button on Overview). |
| Individual sponsor | **Overview · Discover · Asks & offers · Funding** | No opportunities to publish; no minors' cards (`02` §5.6). |
| Organisation seeking funding (club, academy, school, federation, charity, operator) | **Home · Discover · Applications · Funding · Organisation** | Funding holds agreements and programmes (with their reports). Organisation holds profile, people, permissions and, for academies and clubs, athletes. |
| Organisation that seeks and provides | Mode switch in the header: "Seeking funding · Providing funding" | Each mode shows its own five items, never a merged menu. |
| Programme coach (Record sessions only) | **Today · Sessions** | Phone-first. |
| Platform administrator | **Audit & admin** | One area with tabs: Audit · Verification · Safeguarding checks · Reports of concern. |

**Always available outside the navigation:** the account menu (Consent & safety, Audit, Daylight/Dark, Reduce motion,
Sign out) and, on every record, "Who can see this" and "History". The prototype bar adds the demo date, "Viewing as …
· Change", the guide and Reset. Phones show the five items as a bottom bar; tablets and laptops in the header.

## 3. Templates (nine reusable layouts)

| Template | Use |
|---|---|
| **Cinematic** | Start screen only (Pathway's start-screen composition) |
| **T1 Home** | "Needs me" list (at most 3), key figures, the relevant Funding Line, a short "Matched for you" strip |
| **T2 List with filters** | Rows (not cards) on every width; tabs; at most five filter pills; table columns from 1024px |
| **T3 Record detail** | The record plus a right panel (≈46vw) or a bottom sheet on phones; also public profiles |
| **T4 Stepper form** | Quiet steps with autosave, a missing-items list and an error summary |
| **T5 Chain view** | The Funding Line, the funding bar and dated evidence beneath |
| **T6 Two-column review** | Evidence left; fixed decision vocabulary and a required reason right |
| **T7 Consent** | One row per purpose, equal Yes/No, "Change or withdraw" always visible |
| **T8 Document** | Agreements and reports; print-first (prints in Daylight) |
| **T9 Audit table** | Time, person and role, action, record, reason; filters; export |

## 4. Screens: 23 screens and 3 shared panels

| # | Screen · question it answers | Template | Roles | Device | Contents |
|---|---|---|---|---|---|
| 1 | **Start** · "How would you like to explore?" | Cinematic | everyone | any | Lockup, eyebrow, pulse, tagline, supporting line, `im-01`; "Choose how to explore": **Guided journeys** (A "10-minute signature", then B–E) and **Explore the platform** (two equal doors "I'm looking for funding" / "I fund sport" joined by a short Funding Line, then roles grouped Seeking funding · Providing funding · Delivering programmes · Platform); "About this prototype" |
| 2 | **Join** · "Who are you registering as?" | T4 | anyone | phone first | The five open registration paths (`02` §3.2): adult athlete, parent or guardian, coach, organisation (seek / provide / both), individual sponsor. Simulated email code; consents start unset; discoverability chosen with equal Yes/No |
| 3 | **Home / Overview** · "What needs me?" | T1 | all (role variants) | any | Needs me (≤3); seeker: applications, requests and agreements with next steps, "Matched for you" (3 rows); funder Overview: the Fund bar, three plain answers "Who applied", "Who is funded", "How it's being used", and a **Reports** button |
| 4 | **My profile** · "What do funders see about me?" | T3 | athlete, guardian, coach (view), organisation, funder | phone / laptop | Facts with verification chips and **visibility per fact** (Discoverable · Shared on application · Private), "Preview as a funder", "Ask my federation to confirm", documents, current support, discoverability; optional **commercial profile** for adults; funders edit their funder profile here ("Accepts support asks") |
| 5 | **Discover** · seekers: "Who could fund me?" · funders: "Who could we support?" | T2 | all | any | Seekers: *Funding opportunities* (funder, title, type, amount and awards, deadline, eligibility line "4 of 6 met · 1 to check · 1 to add") · *Sponsors & funders* (type, sports, regions, typical support, "Accepts support asks"). Funders: *Athletes* (discoverable adults) · *Funding requests* (adults, organisations; minors as anonymised cards) · *Teams & initiatives* · *Shortlist*. Plain-language brief → editable filter chips (AI A). "Why this appears" on every row. "Participating on Revivo Impact" label |
| 6 | **Opportunity** · "Can I apply for this?" | T3 | all, and the public share link | any | Header band, key facts strip (amount, awards, deadline, sports), "Who can apply" checklist evaluated against the profile, "What you'll need", "How decisions are made" (people decide), "What you'll report". Primary: "Check if you're eligible" (signed out) or "Apply with my profile" |
| 7 | **Funding request** · "What is needed, and how much is still missing?" | T3 | seekers, funders | any | Breakdown, purpose, verified facts, need bar (Requested · Pledged · Received · Remaining); funders: "Offer support" (capped by I4), "Express interest", "Save to shortlist"; minors: anonymised card only, all contact to the guardian |
| 8 | **Public profile** · seekers: "Who is this funder, and what do they support?" · funders: "Who is this athlete or team?" | T3 | all | any | Funder variant: objectives, sports, regions, types, typical range, open opportunities, "Accepts funding requests", verification; primary "Ask for support" (if the funder accepts asks). Athlete or organisation variant (discoverable fields only): sport, level, verified facts, current requests; primary "Express interest" |
| 9 | **Create opportunity** · "What are you offering, and to whom?" | T4 | funder | laptop | Fund, sport and purpose (sports-only check), tiers, awards, eligibility rules, documents, access route, visibility (Public · Restricted · Invitation only), deadline, rubric, reporting, release schedule; "Submit for approval"; a different Approve publishes; copy share link |
| 10 | **Publish a funding request** · "What do you need funding for?" | T4 | adult athlete, guardian, organisation | phone | What, sport and purpose, why, breakdown, date needed, evidence, visibility; for a minor, the anonymised-card preview and the identifiability check result |
| 11 | **Apply** · "Is your application ready?" | T4 | athlete, guardian, coach (prepare), organisation | phone / laptop | Profile → Eligibility → Documents → Budget & other funding → Statement → Share & submit. AI B "Help me organise this". For a minor, the guardian authorises and submits; a coach's draft shows "Prepared by J. Becker · waiting for Rosa to submit". Also used for nominations and renewals |
| 12 | **Applications** · seekers: "Where do my applications and requests stand?" · funders: "Who has applied or asked?" | T2 | all | any | Seeker: applications, nominations, requests sent, offers received, each with its next step. Funder: pipeline per opportunity (eligibility results, two reviewers' scores, filters, counts), support asks received (Make an offer · Ask a question · Not now), offers sent |
| 13 | **Application review** · "Does the evidence hold up?" | T6 | Review, Verify | laptop | Left: shared fields with per-fact "Verify" actions and documents; inconsistency flags; AI C summary with sources. Right: rubric, conflict declaration, "Request information", "Shortlist" with a recommended tier and reason |
| 14 | **Selection & decisions** · "Who should we fund?" | T6 | Approve | laptop | Budget meter (Announced · Held for offers · Committed · Available, I1), tier rule, two reviewers' scores, shortlist with recommendations, offer / waiting list / not selected with reasons, "Send decisions", "Export selection record" |
| 15 | **Offer & agreement** · "What am I agreeing to?" | T8 | both sides | any | Type-specific title ("Scholarship award", "Sponsorship agreement"…), terms, instalments, conditions, Update schedule, deliverables (commercial), "What the funder will see if you accept"; Accept · Decline · Request changes; "existing agreement" mode for confirming carried-in figures; composing an offer (funder side) with caps |
| 16 | **Funding** (funder: portfolio · seeker: My Funding) · "Where is our money?" / "What support do I have?" | T2 | funder, seeker | laptop / phone | Funder: agreements per Fund with type and origin chips, committed, released, received, reported, verified, next date; totals per type (development, programme, in-kind, commercial apart); tabs Agreements · Programmes · **Reports**; "Add existing funding". Seeker: support across funders in plain words, plus own funding requests |
| 17 | **Funding record** · "How is this support being used?" | T5 | both sides | any | The chain for its type (athlete, programme or sponsorship), the funding bar, ledger, Updates, deliverables, Review history; panels "Record release" (Finance), "Confirm received" (recipient), "Verify expense", "Accept deliverable", "Record review decision" |
| 18 | **Send an update** · "What happened this period?" | T4 | athlete, guardian, coach (if granted), organisation | phone | Choose: expenses · sporting progress · deliverable evidence (one or several); documents and allocations; photos only if consent is on; note |
| 19 | **Programme** · "Is the programme on track?" | T5 | operator; funder (aggregates) | laptop / tablet | Programme chain, site session strips (20 ticks per site; gaps carry a reason word), alerts, actions, recovery plan; funders see counts only |
| 20 | **Session register** · "Who came today?" | T4 | coach | phone | Today's sessions; attendance count; note; consented photos; "Couldn't run" with a reason; under a minute |
| 21 | **Reports** · "What can we honestly report?" | T8 | operator, funder | laptop | AI C draft from verified records, claims check, exclusions and limitations, outputs / outcomes / impact labelled apart; submit / accept / return with reason; print or export. Reached from Funding → Reports and Overview |
| 22 | **Consent & safety** · "Who can see what, and how do I stay in control?" | T7 | athlete, guardian, organisation Admin | phone | Purposes (equal Yes/No), discoverability, representatives and their powers, a "who can see what" preview per funder, blocked funders, "Report a concern" |
| 23 | **Audit & admin** · "Who did what, when and why?" | T9 | Admin, Approve, platform admin | laptop | Audit table; tabs for the platform admin: Verification (simulated), Safeguarding checks (anonymised cards), Reports of concern |
| P1 | **Source records** · "Where does this number come from?" | panel | anyone permitted | any | Breadcrumb drill-down from any figure to the record (and document), respecting access |
| P2 | **Ask Revivo** | panel | funder, operator | any | AI C with suggested questions and the built-in refusals |
| P3 | **What changed** | panel | guided mode | any | The records changed by the last step, each linked ("Ledger: Committed +$4,500 · Audit: 1 entry") |

**Why 23 (the founder's target was about 22).** Two-way discovery needs one new screen, the **Public profile** (8),
because seekers must be able to judge a funder before sending a request, and funders an athlete before expressing
interest. Everything else fits the existing nine layouts: the shortlist is a Discover tab; requests to funders and
expressions of interest are panels from screens 7 and 8; requests received live in Applications; Reports stays a
screen but is reached from Funding and Overview; registration and onboarding share one stepper.

## 5. The seven use cases and the five journeys

| Founder's use case | Where it is demonstrated |
|---|---|
| 1 Athlete looking for funding | **Journey A** (Amira): registers, discovers 5 opportunities from 5 organisations, applies, follows to review |
| 2 Coach managing athletes | **Journey E** (Jonas's Home: 6 athletes, each with matched opportunities and deadlines; he prepares an application); nomination by a federation in Explore |
| 3 Foundation offering 50 scholarships | **Journey A** (Tallwater publishes, reviews 143 applications, selects 46, tracks) |
| 4 Company looking for athletes to sponsor | **Journey B** (Oriel finds Nadia; Corvane finds Jonah for a sponsorship agreement) |
| 5 Athlete requesting specific support | **Journey B** (Nadia's request, part-funded by two funders); **Journey E** (Tiago's anonymised request) |
| 6 Sports organisation seeking funding | **Journey C** step 1 (Highland Cycling Club funded by a sponsor it did not know) and step 2 (Lanternfield discovers programme funding); Explore: Saltmere and Lakeside Women's FC requests |
| 7 Existing funded athletes and programmes | **Journey D** (Ostral) |

Every guided step names who acts, the screen and the data that changes. The demo clock has three moments: **Mon 12
Apr 2027**, **Thu 6 May 2027** and **Wed 30 Jun 2027**.

### Journey A — Find and secure a sports scholarship (signature; 13 steps; about 10 minutes)

Amira has never heard of Tallwater. She finds it on Revivo Impact. No Revivo Pathway step anywhere.

**Clock: Mon 12 Apr 2027**

| # | Who | Screen | What happens | Data changed |
|---|---|---|---|---|
| 1 | Ingrid Solberg (Tallwater, Approve) | 9 → 6 | Opening: reviews Daniel's draft of the Emerging Athletes Scholarship and publishes it, Public (four-eyes: she is not the drafter). Copies the share link for Tallwater's channels. | Opportunity Published; Fund announced $250,000; audit |
| 2 | Amira Haddad (19, judo) | 1 → 2 | **Independent registration:** "I'm looking for funding" → Join as an adult athlete; simulated email code. | Person, account, consents (unset) |
| 3 | Amira | 2 → 4 | **Sporting profile:** judo, −63kg, U21; Saltmere Sports Academy; two results (certificates uploaded, "Awaiting verification"); coach referee Keiko Mori; current support (Saltmere travel bursary, $300); goals; chooses which facts are discoverable; taps "Ask Ardent Judo Federation to confirm" on her national bronze. | Facts with visibility and chips; confirmation request; consent recorded |
| 4 | Amira | 5 | **Discovers multiple opportunities:** Discover shows 5 open opportunities from 5 different organisations (Tallwater, Coastal Region Sports Council, Ardent Judo Federation, Corvane, Verran); two are shown not eligible, with reasons. Switches to *Sponsors & funders* and sees 7 participating funders relevant to her sport, region or as a woman athlete. | — |
| 5 | Amira | 6 | **Finds Tallwater's scholarship:** opens it. **Rule:** "4 of 6 met · 1 for the panel to check · 1 to add: a statement of need." **AI A** explains the match. | — |
| 6 | Amira | 11 | **Application help:** **AI B** fills the form from her profile, flags the missing coaching-fee invoice, drafts the statement with gaps marked "[in your own words]". | Draft (autosaved) |
| 7 | Amira | 11 → 12 | **Submits:** notes "invoice to follow", declares other funding (none entered), ticks the fields to share, requests $4,800. | Application Submitted; share consent |

**Clock: Thu 6 May 2027** — 143 applications have arrived (142 seeded + Amira's), including 3 nominated by Ostral.

| # | Who | Screen | What happens | Data changed |
|---|---|---|---|---|
| 8 | Daniel Osei (Tallwater, Review + Verify) | 12 → 13 | **Review and verification:** 14 not considered by rule. **AI C** summarises Amira's application with sources (fixed template) and explains one rule-found inconsistency (the $300 bursary not declared). Her national bronze arrives already confirmed by Ardent Judo Federation (Tue 20 Apr), so Daniel only verifies her age against her ID. His information request (Mon 3 May: the coaching invoice and the declaration) was answered on Tue 4 May. He and a second reviewer score the rubric (13 and 12 of 16; no gap flag); he shortlists her at the $4,500 tier (national medal). | One verification; info request closed; declaration; two scores; shortlist |
| 9 | Ingrid | 14 | **Human selection:** the budget meter (I1) updates as she approves; the tier rule sets Amira's award at the published $4,500 (national medal), not the $4,800 requested. 46 applications reached the minimum score of 11 with every fact verified; she offers all 46 ($214,500), places 2 on the waiting list (minimum score reached, one fact still to verify) and sends respectful decisions to all 143, each unsuccessful message linking to other open opportunities and offering "let other funders find my profile". | 46 offers: Held $214,500; Available $35,500; audit |
| 10 | Amira | 15 | **Accepts:** reads the scholarship award (2 instalments; quarterly Update; conditions) and "What Tallwater will see". Accepts. Heartbeat. | Held → Committed $4,500 |
| 11 | Priya Nair (Tallwater, Finance) → Amira | 17 | **Disbursement and receipt:** Priya records instalment 1, $2,250 (simulated reference); Amira confirms receipt. | Released $2,250; Received $2,250 |

**Clock: Wed 30 Jun 2027**

| # | Who | Screen | What happens | Data changed |
|---|---|---|---|---|
| 12 | Amira | 18 | **Expenditure and progress:** 4 expenses (one without a receipt) and progress (5th place at the Continental U21 Invitational with the results document; 34 of 36 training sessions attested by her coach). Photos: No. | Reported $1,930; 2 progress records |
| 13 | Priya, Daniel | 17 + P2 | **Funder review and renewal:** Priya verifies 3 lines ($1,720) and queries the judogi ($210). Daniel reads the chain, asks Revivo "Summarise Amira's quarter", and records "Continue with conditions: instalment 2 on Wed 1 Sep once the judogi receipt is added; invite to renew in March". | Verified $1,720; query; Review decision |

**Finish screen:** "What you just saw: an athlete who found an unfamiliar funder, 4 people, 2 four-eyes approvals, 1
eligibility check, 1 chain from need to review", with links to journeys B–E.

### Journey B — Two-way discovery, direct support and commercial sponsorship (7 steps)

| # | Clock | Who | Screen | What happens | Data changed |
|---|---|---|---|---|---|
| 1 | Thu 6 May | Nadia Kovač (23, wheelchair racing, adult) | 10 | Publishes a funding request with two line items: racing wheels $3,400 + Continental Para Athletics Series travel $1,800 = $5,200; Public; classification and two results verified. | Request Open |
| 2 | Thu 6 May | Nadia | 5 → 8 | **Athlete discovers sponsors:** *Sponsors & funders* filtered to para athletics; opens Marcus Halvorsen's profile (verified individual sponsor; accepts asks for travel and equipment up to $2,500); asks for $1,200 towards the travel line. The ask is checked against his stated criteria before it is sent. | Support ask Sent |
| 3 | Thu 6 May | Kenji Arakawa (Oriel Freight Group, Approve + Review) | 5 → 8 → 7 | **Company discovers an athlete it has never met:** types "para athletes needing equipment, any region"; **AI A** shows editable chips; Nadia's request appears first (matches 4 of 4, ordered by rule). He reviews her verified facts, shortlists, and offers support for the wheels line. Tries $2,500: "Above your $2,000 limit: a second person with Approve must approve." Sends $2,000 with a written reason linked to the Fund's criteria. | Offer: Held $2,000 |
| 4 | Thu 6 May | Marcus Halvorsen → Nadia | 12 → 15 | Marcus answers her ask with an offer of $1,200 for travel. Nadia accepts both offers. Heartbeat. | Committed 2,000 + 1,200; Request Pledged $3,200 · Remaining $2,000 (Partly funded) |
| 5 | Thu 6 May | Kenji, Marcus → Nadia | 17 | Both releases recorded (both Funds use the Simple approval policy; Marcus's is flagged "single-person sponsor"); Nadia confirms both. The request stays open in Discover. | Released and Received $3,200 |
| 6 | Thu 6 May | Lucy Adeyemi (Corvane, Partnerships) → Jonah Reyes (22, sprinter) | 5 → 8 → 15 | **Commercial sponsorship:** Lucy searches adult sprinters open to commercial partners and **expresses interest** in Jonah ("We support adult sprinters competing nationally"); Jonah shares his season plan. She proposes a sponsorship agreement: $6,000 for 12 months, 3 deliverables, no category conflict, image usage for the term, second payment after deliverables 1–2. Jonah accepts; Lucy records $3,000 (Simple policy); Jonah confirms. | Sponsorship agreement Committed $6,000 (commercial column only) |
| 7 | Wed 30 Jun | Nadia, Jonah → Kenji, Lucy | 18 → 17 | Nadia sends an update: the wheels invoice ($3,400: $2,000 allocated to Oriel, $1,400 marked "covered from other sources") and 3rd place, 800m T54 (results document); Oriel's reviewer verifies. Her request now shows $600 still needed (travel). Jonah submits evidence for 2 of 4 kit meets; Lucy accepts them and records "Continue". Corvane's Overview shows development and commercial totals apart. | Verified $2,000; other sources $1,400; 1 progress record; 2 deliverables accepted |

### Journey C — Sports organisations: funding and programme monitoring (8 steps)

| # | Clock | Who | Screen | What happens | Data changed |
|---|---|---|---|---|---|
| 1 | Thu 6 May | Marcus Halvorsen → Highland Cycling Club | 5 → 7 → 15 | **An organisation funded by a sponsor it did not know:** Highland Cycling Club (Highland Region) had published a request for youth club bikes ($5,000). Marcus finds it under *Teams & initiatives* (clubs may receive his support even when the riders are young; he sees no minors' details) and offers $2,500 with a reason. The club's Admin accepts; Marcus's release is recorded; the club confirms receipt. | Committed and Received $2,500; Request Partly funded ($2,500 still needed) |
| 2 | Thu 6 May | Maya Torres (Lanternfield) | 5 → 16 → 19 | **Organisation discovers programme funding:** in Discover (seeking mode) Maya sees programme funding that matches (Tallwater's Community Sports Programme Grant Round 2 opening in September, Facilities Small Grants in August) and saves both; then opens Play Every Day, funded last cycle: $60,000 for 12 months, 120 sessions this quarter, 6 sites, 460 places, tranche 1 $12,000. | Saved searches |
| 3 | Thu 6 May | Sam Rivera (coach) | 20 | On his phone, records a Westbrook session (attendance count plus a note), then marks Greenpark "Couldn't run: coach availability". | Session Delivered; session Couldn't run |
| 4 | Thu 6 May | Maya | 19 + P2 | **Rule:** "Greenpark has missed 2 sessions in a row" (Tue 4 May, weather; Thu 6 May, coach availability). Maya asks Revivo "Why is Greenpark behind?" (**AI C**, "Answering: Why is a site behind?"), reads the cited reasons, assigns an action to Lena. | Alert; action |
| 5 | Thu 6 May → Fri 7 May | Lena Novak → Maya | 19 | Lena submits a recovery plan (relief coach Jo Adebayo from week 8, plus 4 make-up sessions next quarter). Maya approves it (four-eyes) on Fri 7 May. Daniel (Tallwater) sees the exception and the plan as aggregates. | Recovery plan Approved |
| 6 | Wed 30 Jun | Maya → Priya | 18, 17 | Maya records a $600 equipment expense with its receipt; Priya verifies it. A $432 transport claim without a receipt stays amber. | Expense verified; query |
| 7 | Wed 30 Jun | Maya | 21 | Drafts the quarterly report (**AI C**). The claims check flags "improved confidence"; she rewords it and submits. | Report Submitted |
| 8 | Wed 30 Jun | Daniel | 19, P1, 21 | Clicks 108 → sites → sessions → one record (counts only); clicks 96% → expense lines. Accepts the report and records "Continue with conditions: Greenpark check in week 4 of next quarter". | Report Accepted; Review |

### Journey D — Bring existing funding onto Revivo Impact (4 steps; Wed 30 Jun 2027)

| # | Who | Screen | What happens | Data changed |
|---|---|---|---|---|
| 1 | Daniel | 16 | "Add existing funding": recipient Ostral Swimming Federation (registered; otherwise an invitation is sent); Fund "Federation Development Grants"; type Development grant (regional coach development); $24,000. No new application is needed. | Draft agreement |
| 2 | Daniel → Ingrid | 16 → 15 | Daniel attaches the agreement (simulated), sets the Update schedule and enters carried-in figures: released $12,000, reported $10,400. Ingrid approves the commitment (four-eyes: Daniel prepared it). | Commitment approved; carried-in entries (awaiting recipient confirmation) |
| 3 | Farid Rahimi (Ostral) | 15 | Confirms the agreement and the opening figures (or disputes them with a reason). | Agreement Active |
| 4 | Daniel | 17 | The agreement joins the portfolio with its chain; carried-in figures carry their label; next Update due Thu 30 Sep. | — |

### Journey E — Coach, guardian and safeguarding (6 steps)

| # | Clock | Who | Screen | What happens | Data changed |
|---|---|---|---|---|---|
| 1 | Thu 6 May | Rosa Esteves (guardian) | 3 | Switches between Tiago (16, swimming) and Inês (13, football) from one account. | — |
| 2 | Thu 6 May | Rosa → Jonas Becker (coach) | 22 → 3 | Authorises Jonas (Saltmere head swim coach) for Tiago with *Prepare applications* and *Submit updates* only. Jonas's Home lists his 6 authorised athletes, each with matched opportunities, deadlines and what he may do for them. | Representative authorisation |
| 3 | Thu 6 May | Rosa | 10 | Publishes Tiago's funding request ($2,400 competition travel). Preview of the **anonymised card**: "Swimmer · 16–17 · Coastal Region · competition travel · needed in August · qualification verified by a national federation". Identifiability check passes; platform safeguarding check recorded. | Request Open (anonymised) |
| 4 | Thu 6 May | Kenji → Rosa | 5 → 7 → 15 → 17 | Kenji sees only the anonymised card, tries $2,600 (**I4** blocks: "exceeds the $2,400 still needed"), offers $1,500 with a reason; the offer goes to Rosa ("The sponsor cannot contact the athlete directly"). Rosa accepts; Oriel now sees Tiago's first name and results; Kenji records the release (Simple policy); Rosa confirms. | Committed and Received $1,500; Remaining $900 |
| 5 | Thu 6 May | Jonas → Rosa | 11 | Jonas prepares Tiago's application to Ostral's Competition Travel Grant for the $900 still needed; "Other funding" prefilled with Oriel's $1,500. He cannot submit; Rosa submits. The application **holds** the $900, so no funder can offer the same money while Ostral decides. | Application Submitted (prepared by Jonas, submitted by Rosa); $900 held |
| 6 | Wed 30 Jun | Jonas → Rosa | 18 → 22 | Jonas submits Tiago's progress update with a consented photo. Rosa then turns off "Photos and stories" and hides the request from discovery: the photo disappears from Oriel's view ("Photo withdrawn by guardian"), the card leaves Discover, and the existing agreement continues. | Consent withdrawn; request hidden; audit |

**Optional in Explore:** Marcus Halvorsen (enhanced safeguarding check) offers $750 to an anonymised badminton player
aged 14–15 with no club; the offer waits for the platform's safeguarding review (Alex Moreau) and then reaches her
guardian. Rosa imports Inês's verified records from Revivo Pathway (simulated) and removes them again.

## 6. Guided and hands-on modes

Pathway's shell is reused (Guided journey, Explore by role, "Show me" / "I'll do it", demo date, Reset, "Load the
story up to step N", Daylight). Improvements:

- **Journey bar.** Journeys A–E appear as a signal rail at the top of the guide; A is marked "10-minute signature".
  Each step card shows the clock moment, who acts ("You are now Priya, Finance at Tallwater") and the expected result.
- **"Show me" / "I'll do it" on every step.** "Show me" performs the step through the same rules as a click; "I'll do
  it" highlights the control and waits.
- **What changed (P3)** after each step lists the records the step changed, each linked: the connected state is the
  product's main argument.
- **Checkpoints per journey** from deterministic snapshots; global Reset.
- **Explore by role**, grouped Seeking funding · Providing funding · Delivering programmes · Platform. Each persona
  offers three "Try this" tasks (`05` §3).
- **Demo clock with three moments.** Moving forward only reveals seeded records; it never invents state.
- **About this prototype** lists the limitations (`06` §7).

## 7. Discovery in both directions (design detail)

**Seeker questions the screen must answer at a glance:** What is open now? What kind of support? Who offers it? Am I
eligible? When is the deadline? What documents? Can I apply with my profile? Which sponsors are relevant? Do they
accept direct requests?

**Funder questions:** Who is seeking support? What fits our objectives? How much is needed? What sporting evidence is
there, and is it verified? Is it partly or fully funded? Can we shortlist or make an offer?

| Element | Seeker Discover | Funder Discover |
|---|---|---|
| Tabs | Funding opportunities · Sponsors & funders | Athletes · Funding requests · Teams & initiatives · Shortlist |
| Row content | Funder name and type, verification chip, title, funding type chip, amount ("Up to $5,000 · 50 awards"), deadline, eligibility line with an icon ("4 of 6 met · 1 to check · 1 to add", "Not eligible: para athletes only"), "Apply with my profile" when ready | Name (adults) or anonymised label (minors), sport and discipline, level, region, age group, verified-facts count ("4 verified · 2 self-reported"), what is needed and the mini need bar, date needed |
| Sponsors row | Type (Foundation · Company · Brand · Government · Federation · Individual), sports, regions, funding types, typical support, **Accepts support asks: Yes · Commercial proposals only · Only through opportunities · Not at present**, open opportunities count | — |
| Filters (≤ 5 pills) | Sport · Support type · Region · Deadline · "I'm eligible" | Sport · Support type · Region · Amount · "Verified evidence" |
| Brief | — | Plain-language brief → editable chips (AI A) |
| Order | Criteria-fit count, then deadline (`02` §9.4) | Criteria-fit count, then date needed |
| Row actions | Open · Save · Apply / Ask for support | Open · Save to shortlist · Express interest · Offer support |
| Never | Ranking of funders by "generosity"; unverified funders above verified ones without a label | Popularity, follower counts, photos of minors, "potential" scores, sorting athletes by any score |

Empty states: seeker "No open opportunities match your profile yet. Add your sport and region, or save a search and
we'll tell you when one opens."; funder "No funding requests match these filters. Try a wider region or another
support type."

## 8. Status labels and microcopy

**Voice.** Plain, encouraging and credible, in British English. The athlete side speaks to "you"; the funder side uses
neutral statements with sources and dates. AI is always labelled "Simulated AI". Banned words: `CLAUDE.md` §4.

**Funding status labels** (each a chip with an icon and a word, with a one-line definition on hover and tap):
Announced · Held for offers · Committed · Released · Received · Spent · reported · Spent · verified · Awaiting verification ·
Outstanding · Unspent · Partly funded · Fully pledged · Declared value, not cash · Carried in · Deliverable scheduled ·
Deliverable accepted (definitions in `02` §6.1).

**Role entry doors (start screen).**
- "I'm looking for funding": "For athletes, parents, coaches, clubs, academies and programmes. Free to join."
- "I fund sport": "For foundations, companies, brands, government bodies, federations and individual sponsors. Find
  credible opportunities and follow your support through."

**Eligibility.** "4 of 6 met · 1 for the panel to check · 1 to add: a statement of need." · "Eligibility is checked
against the funder's published rules. Meeting them doesn't guarantee an award; a review panel decides." · "Suggested
because: your sport (judo), your national U21 bronze (to be verified) and your purpose (coaching and competition
costs) match the criteria. Simulated AI."

**Contact.**
- Support ask: "Oriel accepts asks for equipment and competition travel up to $2,000. Your ask links to your funding
  request; Oriel sees only what you share."
- Offer to a minor (funder side): "This offer goes to the athlete's guardian. The sponsor cannot contact the athlete
  directly."
- Expression of interest (seeker side): "Corvane Sportswear is interested in your profile: 'We support adult sprinters
  competing nationally.' Share more, or say no thanks. Saying no changes nothing."

**Decision and offer messages.**
- More information: "The panel needs one more document: an invoice for your coaching fees. Please also confirm any
  other funding for the same costs. Upload it by Wed 5 May to keep your application in review."
- Offered (adult): "You've been offered a scholarship award of $4,500 from Tallwater Sports Foundation. Read the
  agreement, then accept or ask a question by Thu 20 May."
- Offered (minor, to the guardian): "[First name] has been offered a scholarship award of $3,500 from Tallwater Sports
  Foundation. Only you, as guardian, can accept."

## 9. Unsuccessful applicants and other sensitive moments

Never "rejected" or "failed". Every message says why in plain words, keeps the profile ready and offers a next step.

| Outcome | Message |
|---|---|
| Not selected | "Your application wasn't selected this time. 143 athletes applied and 46 scholarships were offered. The panel's feedback: strong results; the fund prioritised athletes with confirmed competition entries this season. Your profile stays ready. Four other opportunities are open now." Button: "See opportunities" |
| Waiting list | "You're on the waiting list. Your score reached the panel's minimum; one fact is still being verified. If it is verified by Thu 20 May, the panel may offer you a scholarship. We'll tell you here." |
| Not eligible (rule) | "This opportunity is for athletes aged 15–21 on 30 Apr 2027, so the funder's rules don't allow this application. Two open opportunities match your profile." |
| Incomplete at deadline | "Your application wasn't complete by the deadline (Fri 30 Apr), so the panel couldn't consider it. Your draft is saved for next time." |
| Ask answered "Not now" | "Oriel can't support this request at the moment. Your request stays visible to other funders." |
| Offer declined or expired (funder side) | "The offer was declined. The $3,500 held for it is available to award again." |
| Progress sharing paused | "Progress sharing paused by the athlete. A person will review this agreement; nothing changes automatically." |

## 10. Notifications

In-app list only (simulated); no email or SMS. Minors' names never appear in notification previews. Each notification
opens the record and its next step.
