# Revivo Impact — experience and screens

How people move through the product. Objects and rules: `02`. Look and feel: `04`. Names and figures: `05`.

## 1. Ease-of-use principles (founder priority)

1. **One question per screen.** Each screen's title is the question it answers (§4). If a screen needs two titles,
   split it.
2. **At most five navigation items per role** (§2). A role sees only what it can do.
3. **Home shows "what needs you" first**: at most three items, each with one button that goes straight to the task.
4. **The next step is always visible.** Every application and award shows its Funding Line with the current node and
   one sentence, for example "Next: the panel decides by Thu 6 May."
5. **One primary button per view**, worded as the outcome ("Submit application", "Approve awards"), never "Continue".
6. **Progressive disclosure.** Definitions, sources and audit trails sit one tap away ("See source", "What does
   committed mean?"), never as long text on the screen.
7. **Forgiving forms.** Autosave with a "Saved" indicator; the profile prefills every application, so nothing is typed
   twice; missing items are listed before submission; errors show a summary plus an inline message.
8. **Plain words for seekers.** "Paid to you", not "disbursement". Funder screens may use the financial terms, each
   with a definition (`02` §6.1).
9. **Phone first for athletes and guardians** (tested at 375px); tablet for coaches and site coordinators; laptop
   first for funders (must still work at 1024px).
10. **Guided mode is the default entry.** The signature journey takes about ten minutes.

## 2. Navigation per role

| Role | Main navigation | Notes |
|---|---|---|
| Adult athlete | Home · Discover · Applications · Funding · Profile | "Funding" holds awards, payments, spending and progress (the founder's "My funding" and "My progress", merged). |
| Guardian or coach | Athlete switcher ("Managing: Tiago ▾") + Home · My athletes · Discover · Applications · Funding | "My athletes" holds each athlete's profile, consent and representatives. A coach sees only athletes and powers a guardian (or adult athlete) granted. |
| Funder | Overview · Discover · Opportunities · Portfolio · Reports | Each Opportunity opens its applications pipeline; a reviewer's "Needs me" item links straight to their queue. "Reports", not "Impact & reports". |
| Organisation seeking funding (academy, club, federation, programme operator) | Home · Discover · Applications · Funding · People | Programmes and their reports open from "Funding". "People" holds members, permissions and (for academies) athletes. |
| Organisation that both seeks and provides | A mode switch in the header: "Seeking funding · Providing funding" | Each mode shows its own five items, never a merged menu. |
| Programme coach (Record sessions only) | Today · Sessions | Phone-first. |
| Platform administrator | Audit & admin | One screen with tabs. |

**Always available outside the navigation:** the account menu (Consent & people, Audit, Daylight/Dark, Reduce motion,
Sign out) and, on every record, "Who can see this" and "History". The prototype bar adds the demo date, "Viewing as …
· Change", the guide and Reset.

## 3. Templates

| Template | Use |
|---|---|
| **Cinematic** | Start screen only (Pathway's start screen, 1:1) |
| **T1 Home** | "Needs me" list (at most 3), key figures, the relevant Funding Line |
| **T2 List with filters** | Table on desktop, list with dividers on phones; filter pills |
| **T3 Record detail** | The record plus a right panel (≈46vw) or a bottom sheet on phones |
| **T4 Stepper form** | Quiet steps with autosave, a missing-items list and an error summary |
| **T5 Chain view** | The Funding Line, the funding bar and dated evidence beneath |
| **T6 Two-column review** | Evidence left; fixed decision vocabulary and a required reason right |
| **T7 Consent** | One row per purpose, equal Yes/No, "Change or withdraw" always visible |
| **T8 Document** | Agreements and reports; print-first (prints in Daylight) |
| **T9 Audit table** | Time, person and role, action, record, reason; filters; export |

## 4. Screens: 22 screens and 3 shared panels

| # | Screen · question it answers | Template | Roles | Device | Contents |
|---|---|---|---|---|---|
| 1 | **Start** · "How would you like to explore?" | Cinematic | everyone | any | Lockup, eyebrow, pulse, tagline, supporting line, `im-01`; "Choose how to explore": **Guided journey** (recommended; Journey A "10-minute signature", then B–E) and **Explore the platform** (two equal doors "I'm looking for funding" / "I fund sport" joined by a short Funding Line, then the role list grouped Seeking funding / Providing funding / Delivering programmes); "About this prototype" (limitations) |
| 2 | **Register** · "Who are you registering?" | T4 | athletes, guardians, coaches, organisations | phone first | Person (adult athlete, guardian, coach) or organisation; guardian route for a minor; simulated email code; consents start unset |
| 3 | **Home / Overview** · "What needs me?" | T1 | all (role variants) | any | Needs me (≤3); seeker: applications and awards with their next steps; funder Overview: the Fund's funding bar and three plain answers "Who applied", "Who is funded", "How it's being used"; header band `im-11` (funder) or `im-03` (athlete) |
| 4 | **Profile & verification** · "What do funders see about me?" | T3 | athlete, guardian, coach (view), organisation | phone / laptop | Fields with field-level verification chips ("Verified by … · date", "Self-declared", "Awaiting verification"), documents, current support, discoverability, optional "Import verified records from Revivo Pathway" |
| 5 | **Discover** · "What can I apply for?" (seekers) / "Who needs support?" (funders) | T2 | all | any | Tabs: *Funding offered* · *Funding needed* · *Athletes & organisations* (funders; adults who chose to be discoverable only). Rows, not cards: funder, title, amount and awards ("Up to $5,000 · 50 awards"), deadline, eligibility line ("You meet 5 of 6 criteria"). "Why this is suggested" opens a panel (AI A). Funders can type a brief; AI A shows editable filter chips. Minors appear only as de-identified Need cards. |
| 6 | **Opportunity** · "Can I apply for this?" | T3 | all, and the public share link | any | Header band (image per Fund), key facts strip (amount, awards, deadline, sports), "Who can apply" checklist evaluated against the profile, "What you'll need", "How decisions are made" (people decide; named roles), "What you'll report". Primary: "Check if you're eligible" (signed out) or "Start application" |
| 7 | **Need** · "What is needed, and how much is still missing?" | T3 | seekers, funders | any | Breakdown, purpose, verified facts, funding bar (Requested · Pledged · Received · Remaining); primary for funders: "Offer support" (capped by I4); "Ask a question" (templated, to the representative) |
| 8 | **Create opportunity** · "What are you offering, and to whom?" | T4 | funder | laptop | Fund, purpose, tiers, number of awards, eligibility rules, documents, access route (Open · Nomination · Invitation only), visibility, deadline, rubric, reporting, release schedule; "Submit for approval"; publishing needs Approve by someone other than the drafter; copy share link |
| 9 | **Publish a need** · "What do you need funding for?" | T4 | adult athlete, guardian, organisation | phone | What, why, breakdown, date needed, evidence, visibility; for a minor, a preview of the de-identified card funders will see |
| 10 | **Apply** · "Is your application ready?" | T4 | athlete, guardian, coach (prepare), organisation | phone / laptop | Steps: Profile → Eligibility → Documents → Budget & other funding → Statement → Share & submit. AI B "Help me organise this" (Simulated AI). For a minor, the guardian authorises and submits; a coach's draft shows "Prepared by J. Becker · waiting for Rosa to submit" |
| 11 | **Applications** · seekers: "Where do my applications stand?" · funders: "Who has applied?" | T2 | all | any | Seeker: status list, each with its next step. Funder (inside an Opportunity): pipeline with eligibility results, filters (status, rule result, reviewer), counts |
| 12 | **Application review** · "Does the evidence hold up?" | T6 | Review, Verify | laptop | Left: shared fields with per-field "Verify" actions and documents; inconsistency flags; AI C summary with sources. Right: rubric (4 criteria, 1–4), conflict declaration, "Request information", "Shortlist" with a recommended tier and reason |
| 13 | **Selection & decisions** · "Who should we fund?" | T6 | Approve | laptop | Budget meter (Announced · Reserved · Committed · Available, I1), tier rule, shortlist with recommendations, approve / reserve list / not selected with reasons, "Send decisions", "Export selection record" |
| 14 | **Offer & agreement** · "What am I agreeing to?" | T8 | both sides | any | Terms, instalments, conditions, Update schedule, deliverables (commercial only), "What the funder will see if you accept"; Accept · Decline · Request changes; "existing agreement" mode for confirming carried-in figures |
| 15 | **Portfolio** (funder) / **Funding** (seeker) · "Where is our money?" / "What funding do I have?" | T2 | funder, seeker | laptop / phone | Funder ledger table per Fund and Award: recipient (or reference), route, category and origin chips, committed, released, reported, verified, next date; totals reconcile on screen; "Add existing funding". Seeker: awards across funders in plain words |
| 16 | **Award** · "How is this award being used?" | T5 | both sides | any | The athlete Funding Line, the funding bar, ledger, Updates, Review history; panels "Record release" (Finance), "Verify expense" (Finance or Verify), "Record review decision" (Review / Approve) |
| 17 | **Submit update** · "What happened this quarter?" | T4 | athlete, guardian, coach (if granted), organisation | phone | Expenses with documents and allocations; progress (results with documents, coach-attested training, milestones); photos only if consent is on; note |
| 18 | **Programme** · "Is the programme on track?" | T5 | operator; funder (aggregates) | laptop / tablet | The programme Funding Line, site session strips (20 ticks per site; gaps carry a reason word), alerts, actions, recovery plan; funders see counts only |
| 19 | **Session register** · "Who came today?" | T4 | coach | phone | Today's sessions; attendance count; short note; consented photos; "Couldn't run" with a reason; under a minute |
| 20 | **Reports** · "What can we honestly report?" | T8 | operator, funder | laptop | AI C draft from verified records, claims check, exclusions and limitations, submit / accept / return with reason, print or export |
| 21 | **Consent & people** · "Who can see what?" | T7 | athlete, guardian, organisation Admin | phone | Purposes (equal Yes/No), representatives and their powers, a "who can see what" preview per funder |
| 22 | **Audit & admin** · "Who did what, when and why?" | T9 | Admin, Approve, platform admin | laptop | Audit table; organisation-verification tab (simulated) for the platform admin |
| P1 | **Source records** · "Where does this number come from?" | panel | anyone permitted | any | Breadcrumb drill-down from any figure to the record (and document), respecting access |
| P2 | **Ask Revivo** | panel | funder, operator | any | AI C with suggested questions and the built-in refusals |
| P3 | **What changed** | panel | guided mode | any | The records changed by the last step, each linked ("Ledger: Committed +$4,500 · Audit: 1 entry") |

**Why 22.** Each of the founder's 16 principal screens is needed by at least one of journeys A–E; six more carry
trust (Award chain, Programme, Session register, Consent, Audit, Selection). Folding funder dashboards, an approvals
queue, separate expense and progress screens, renewal and admin into these saves about ten screens. Pathway shipped
about 20 workspaces for one journey; 22 for five journeys keeps the same density.

## 5. Journeys

Every guided step names who acts, the screen and the data that changes. The demo clock has three moments: **Mon 12
Apr 2027**, **Thu 6 May 2027** and **Wed 30 Jun 2027**.

### Journey A — Find and secure a scholarship (signature; 13 steps; about 10 minutes)

**Clock: Mon 12 Apr 2027**

| # | Who | Screen | What happens | Data changed |
|---|---|---|---|---|
| 1 | Ingrid Solberg (Tallwater, Approve) | 8 → 6 | Reviews Daniel's draft of the Emerging Athletes Scholarship and publishes it (four-eyes: she is not the drafter). Copies the share link. | Opportunity Draft → Published; Fund announced $250,000; audit |
| 2 | Amira Haddad (19, judo) | 6 (public) → 2 | Opens the link, taps "Check if you're eligible", registers as an adult with a simulated email code. No Pathway step. | Person, account, consents (all unset) |
| 3 | Amira | 4, 21 | Builds her profile: judo, Saltmere Sports Academy, two results (certificates uploaded, "Awaiting verification"), coach referee Keiko Mori, current support (Saltmere travel bursary, $300). Chooses Discoverable: Yes. | Profile fields with chips; consent recorded |
| 4 | Amira | 5 | "Matched for you": 3 opportunities; one shown as not eligible, with the reason. | — |
| 5 | Amira | 6 | **Rule:** eligibility checklist: "You meet 5 of 6 criteria. To add when you apply: statement of need. 1 result to be verified by the panel." **AI A** explains the match. | — |
| 6 | Amira | 10 | **AI B** fills the form from her records, flags the missing coaching-fee invoice, drafts the statement with gaps marked "[in your own words]". She notes "invoice to follow", declares other funding (none entered), ticks the fields to share and requests $4,800. | Application Submitted; share consent |

**Clock: Thu 6 May 2027** — 143 applications have arrived (142 seeded + Amira's), including 3 nominated by Ostral
Swimming Federation.

| # | Who | Screen | What happens | Data changed |
|---|---|---|---|---|
| 7 | Daniel Osei (Tallwater, Review + Verify) | 11 → 12 | Pipeline: 143 applications; 14 not considered by rule (9 not eligible, 5 incomplete at the deadline). **AI C** summarises Amira's application, every sentence linked to its source, and explains one rule-found inconsistency: her profile lists a $300 club travel bursary not declared under "Other funding". | — |
| 8 | Daniel ⇄ Amira | 12 | Verifies her national U21 bronze against a federation results document and her age against her ID. Requests information: the coaching-fee invoice and confirmation of other funding. Amira uploads the invoice and declares the $300 bursary. Daniel scores the rubric and shortlists her, recommending the $4,500 tier. | Two field verifications; info request opened and closed; declaration updated; shortlist |
| 9 | Ingrid | 13 | Budget meter (I1) updates as she approves. She tries to set Amira's award at her requested $4,800; the tier rule offers the published tiers and she keeps $4,500. She approves 46 offers ($214,500), places 2 on the reserve list and sends respectful decisions to all 143 applicants, each unsuccessful message linking to other open opportunities. | 46 offers: Reserved $214,500; Available $35,500; decisions; audit |
| 10 | Amira | 14 | Reads the terms (2 instalments; quarterly Update; conditions) and "What Tallwater will see". Accepts. Heartbeat. | Reserved → Committed $4,500 |
| 11 | Priya Nair (Tallwater, Finance) → Amira | 16 | Priya records the release of instalment 1, $2,250 (simulated reference). Amira confirms receipt. | Released $2,250; receipt confirmed |

**Clock: Wed 30 Jun 2027**

| # | Who | Screen | What happens | Data changed |
|---|---|---|---|---|
| 12 | Amira | 17 | Submits her Update: 4 expenses (one without a receipt) and progress (5th place at the Continental U21 Open with the results document; 34 of 36 training sessions attested by her coach). Photos: No. | Reported $1,930; 2 progress records |
| 13 | Priya, Daniel | 16 + P2 | Priya verifies 3 lines ($1,720) and queries the judogi ($210). Daniel reads the chain, asks Revivo "Summarise Amira's quarter", and records "Continue with conditions: instalment 2 on Wed 1 Sep once the judogi receipt is added". | Verified $1,720; query; Review decision; audit |

**Finish screen:** "What you just saw: 4 people, 2 four-eyes approvals, 1 eligibility check, 1 chain from need to
review", with links to journeys B–E.

### Journey B — Discover and directly support an athlete (5 steps; Thu 6 May 2027)

| # | Who | Screen | What happens | Data changed |
|---|---|---|---|---|
| 1 | Rosa Mendes (guardian) | 9 | Publishes Tiago's Need: $2,400 competition travel with a breakdown; visibility "Verified funders only"; qualification verified by an Ostral document. Sees the de-identified card preview. | Need Open |
| 2 | Kenji Watanabe (Oriel Freight Group, Approve + Finance) | 5 | Types "under-18 swimmers needing competition travel, coastal region". **AI A** shows the derived filters as editable chips; results are ordered by rule. Tiago appears only as a de-identified card. | — |
| 3 | Kenji | 7 | Offers $1,500 for travel from Oriel Athlete Support (within the $2,000 delegated limit). Tries $2,600 first: **I4** blocks it ("exceeds the $2,400 still needed"). The offer goes to Rosa; Kenji sees no name or contact details. | Offer: Reserved $1,500 |
| 4 | Rosa | 14 | Reviews the offer, including what Oriel will see if she accepts, and accepts. Oriel now sees Tiago's first name and results. Heartbeat. | Award Committed $1,500; Need Pledged $1,500 |
| 5 | Kenji → Rosa | 16 | Kenji records the $1,500 release; Rosa confirms receipt. The Need shows Pledged 1,500 · Received 1,500 · Remaining 900 and stays open. | Released $1,500; receipt confirmed |

### Journey C — Fund and monitor a sports programme (7 steps)

| # | Clock | Who | Screen | What happens | Data changed |
|---|---|---|---|---|---|
| 1 | Thu 6 May | Daniel | 15 → 18 | Opens Play Every Day: Programme grant $60,000 for 12 months; target 120 sessions this quarter, 6 sites, 460 places; tranche 1 of $12,000 released. | — |
| 2 | Thu 6 May | Sam Rivera (coach) | 19 | On his phone, records a Westbrook session (attendance count plus a short note), then marks Greenpark "Couldn't run: coach availability". | Session Delivered; session Couldn't run |
| 3 | Thu 6 May | Maya Torres (Lanternfield) | 18 + P2 | **Rule:** "Greenpark has missed 2 sessions in a row" (Tue 4 May, weather; Thu 6 May, coach availability). Maya asks Revivo "Why is Greenpark behind?" (**AI C**), reads the cited reasons, and assigns an action to Lena. | Alert; action |
| 4 | Thu 6 May → Fri 7 May | Lena Novak → Maya | 18 | Lena submits a recovery plan (relief coach Jo Adebayo from week 8, plus 4 make-up sessions next quarter). Maya approves it (four-eyes) on Fri 7 May. Daniel sees the exception and the plan as aggregates. | Recovery plan Approved; audit |
| 5 | Wed 30 Jun | Maya → Priya | 17, 16 | Maya records a $600 equipment expense with its receipt; Priya (Tallwater Finance) verifies it. A $432 transport claim without a receipt stays amber. | Expense verified; query |
| 6 | Wed 30 Jun | Maya | 20 | Drafts the quarterly report (**AI C**). The claims check flags "improved confidence"; she rewords it and submits. | Report Submitted |
| 7 | Wed 30 Jun | Daniel | 18, P1, 20 | Clicks 108 → sites → sessions → one record (counts only); clicks 96% → expense lines. Accepts the report and records "Continue with conditions: Greenpark check in week 4 of next quarter". | Report Accepted; Review decision |

### Journey D — Bring existing funding onto Revivo (4 steps; Wed 30 Jun 2027)

| # | Who | Screen | What happens | Data changed |
|---|---|---|---|---|
| 1 | Daniel | 15 | "Add existing funding": recipient Ostral Swimming Federation (already registered; otherwise an invitation is sent); new Fund "Federation Development Grants"; category Development grant (regional coach development); $24,000. | Fund; Award (awaiting recipient confirmation) |
| 2 | Daniel | 15 → 14 | Attaches the agreement (simulated), sets the Update schedule, enters carried-in figures: released $12,000, reported $10,400. | Carried-in entries |
| 3 | Farid Rahimi (Ostral) | 14 | Confirms the agreement and the opening figures (or disputes them with a reason). | Award Active |
| 4 | Daniel | 16 | The Award joins the Portfolio with its chain; carried-in figures carry their label; next Update due Thu 30 Sep. | — |

### Journey E — Coach and guardian (5 steps; starts from Journey B's outcome)

| # | Clock | Who | Screen | What happens | Data changed |
|---|---|---|---|---|---|
| 1 | Thu 6 May | Rosa | 3 | Switches between Tiago (16) and Inês (13) from one account. | — |
| 2 | Thu 6 May | Rosa | 21 | Authorises Jonas Becker (Saltmere head swim coach) for Tiago with *Prepare applications* and *Submit updates* only. | Representative authorisation |
| 3 | Thu 6 May | Jonas → Rosa | 10 | Jonas (who manages 6 athletes) prepares Tiago's application to Ostral's Competition Travel Grant for the $900 still needed; "Other funding" is prefilled with Oriel's $1,500. He cannot submit; Rosa authorises and submits. | Application Submitted (prepared by Jonas, submitted by Rosa) |
| 4 | Wed 30 Jun | Jonas | 17 | Submits Tiago's progress Update on the Oriel award, with a consented photo. | Update |
| 5 | Wed 30 Jun | Rosa | 21 | Turns off "Photos and stories" for Tiago. The photo disappears from Oriel's view ("Photo withdrawn by guardian"); the change is audited. | Consent withdrawn; photo removed everywhere |

**Optional in Explore:** Rosa imports Inês's verified records from Revivo Pathway (simulated) and removes them again.

## 6. Guided and hands-on modes

Pathway's shell is reused unchanged (Guided journey, Explore by role, "Show me" / "I'll do it", demo date, Reset,
"Load the story up to step N", Daylight). Improvements:

- **Journey bar.** Journeys A–E appear as a signal rail at the top of the guide; A is marked "10-minute signature".
  Each step card shows the clock moment, who acts ("You are now Priya, Finance at Tallwater") and the expected result.
- **"Show me" / "I'll do it" on every step**, as in Pathway. "Show me" performs the step through the same rules as a
  click; "I'll do it" highlights the control and waits.
- **What changed (P3).** After each step, a panel lists the records the step changed, each linked. This makes the
  connected state, the product's main argument, visible.
- **Checkpoints per journey.** "Start Journey C from the beginning" and Pathway's "Load the story up to step N" for
  every journey, each from its own deterministic snapshot (Journey E's includes Journey B's outcome). Global Reset
  stays.
- **Explore by role**, grouped Seeking funding / Providing funding / Delivering programmes. Each persona offers three
  "Try this" tasks (`05` §3).
- **Demo clock with three moments.** Moving forward only reveals seeded records; it never invents state.
- **Finish screens** summarise what was shown and link to the next journey.
- **About this prototype** lists the limitations: fictional data; simulated sign-in, payments, verification, AI and
  notifications; English only; USD only; no real Revivo Pathway connection.

## 7. Status labels and microcopy

**Voice.** Plain, encouraging and credible, in British English. The athlete side speaks to "you"; the funder side uses
neutral statements with sources and dates. AI is always labelled "Simulated AI". Banned words: see `CLAUDE.md` §4.

**Funding status labels** (each a chip with an icon and a word, with a one-line definition on hover and tap):

| Label | Definition |
|---|---|
| Announced | Funding published; nothing awarded yet |
| Reserved | Offered, waiting for the recipient to accept |
| Committed | Award approved and agreement accepted (includes anything already paid) |
| Released | Payment recorded by the funder (simulated) |
| Received | The recipient confirmed the payment arrived |
| Spent · reported | Expenses submitted by the recipient |
| Spent · verified | Expenses checked against receipts by a reviewer |
| Awaiting verification | Reported but not yet checked, or queried |
| Outstanding | Committed but not yet released |
| Unspent | Released but not yet reported as spent |
| Partly funded | Some of a Need's requested amount is pledged |
| Declared value, not cash | In-kind items |
| Carried in | Figures from before the award came onto Revivo; not verified in Revivo |

**Role entry doors (start screen).**
- "I'm looking for funding": "For athletes, parents, coaches, clubs and programmes. Free to join."
- "I fund sport": "For foundations, companies, government and sponsors. Publish funding and follow it through."

**Eligibility.**
- "You meet 5 of 6 criteria. To add when you apply: statement of need."
- Reassurance: "Eligibility is checked against the funder's published rules. Meeting them doesn't guarantee an award;
  a review panel decides."
- Matching: "Suggested because: your sport (judo), your national U21 bronze (to be verified) and your purpose
  (coaching and competition costs) match the criteria. Simulated AI."

**Decision and offer messages.**
- More information: "The panel needs one more document: an invoice for your coaching fees. Please also confirm any
  other funding for the same costs. Upload it by Thu 13 May to keep your application in review."
- Offered (adult): "You've been offered a scholarship of $4,500 from Tallwater Sports Foundation. Read the agreement,
  then accept or ask a question by Thu 20 May."
- Offered (minor, to the guardian): "[First name] has been offered a scholarship of $3,500 from Tallwater Sports
  Foundation. Only you, as guardian, can accept. Read the agreement together before deciding."
- Offer to a minor (funder side): "This offer goes to the athlete's guardian. The sponsor cannot contact the athlete
  directly."
- Next step: "Next: the panel decides by Thu 6 May."

## 8. Unsuccessful applicants and other sensitive moments

Never "rejected" or "failed". Every message says why in plain words, keeps the profile ready and offers a next step.

| Outcome | Message |
|---|---|
| Not selected | "Your application wasn't selected this time. 143 athletes applied and 46 scholarships were offered. The panel's feedback: strong results; the fund prioritised athletes with confirmed competition entries this season. Your profile stays ready. Three other opportunities are open now." Button: "See opportunities" |
| Reserve list | "You're on the reserve list. If an offered scholarship is declined, the panel may offer it to you. We'll tell you here." |
| Not eligible (rule) | "This opportunity is for athletes aged 15–21 on 30 Apr 2027, so the funder's rules don't allow this application. Two open opportunities match your profile." |
| Incomplete at deadline | "Your application wasn't complete by the deadline (Fri 30 Apr), so the panel couldn't consider it. Your draft is saved for next time." |
| Offer declined or expired (funder side) | "The offer was declined. The $3,500 reserved for it is available to award again." |
| Progress sharing paused | "Progress sharing paused by the athlete. A person will review this award; nothing changes automatically." |

Each unsuccessful message names who to contact for questions (the decision letter), since there is no appeals
workflow. After an unsuccessful decision, the funder keeps only the reference, outcome and scores for its selection
record (`02` §7.1).

## 9. Empty states and notifications

- Athlete, no matches: "No open opportunities match your profile yet. Add your sport and region, or save a search and
  we'll tell you when one opens." (`im-12`)
- Funder, no applications: "No applications yet. Share your opportunity link to invite applicants."
- Notifications are an in-app list only (simulated); no email or SMS. Children's names never appear in notification
  previews.
