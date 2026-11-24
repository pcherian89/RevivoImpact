# Revivo Impact — product definition

What the product is made of and the rules it must obey. Screens and journeys are in `03`; figures and names in `05`
(the source of truth for every number). All amounts are USD.

## 1. Scope in one paragraph

Revivo Impact manages sports funding from the first listing to the last review. Funders publish Opportunities;
seekers publish Needs; applications and offers become Awards; each Award has one ledger, regular Updates with
evidence, and human Reviews. It is standalone: its own registration, profiles, representatives, consent, verification,
audit and administration. It records commitments and payments; it never moves money. In the prototype every person,
organisation, amount and record is fictional, AI is simulated, and payments, verification and sign-in are simulated.

## 2. Object model

```
Fund ──▶ Listing ─────────────▶ Proposal ─────────────▶ AWARD ──▶ Ledger entries ──▶ Updates & evidence ──▶ Review
(pot)    Opportunity (offered)  Application (seeker)    (one        commit, release,    expenses, progress,     continue /
         Need (needed)          Offer (funder)          agreement)  report, verify      sessions, documents     conditions /
                                                                                                                pause / close
                                                     ▲
                    "Add existing funding" ──────────┘  (creates an Award directly; the recipient confirms)
```

| Object | What it is | Key fields | Rules |
|---|---|---|---|
| **Fund** | A funder's pot of money (or of in-kind items) | Funder organisation, name, **one category**, currency, announced amount (or items and declared value), period, award tiers or maximum, delegated offer limit | Belongs to one funder. Totals are always summed from its Awards' ledgers, never stored. |
| **Listing: Opportunity** ("funding offered") | What a funder publishes for people to apply to | Fund, title, purpose, tiers or amount, number of awards, eligibility rules, required documents, access route (Open · Nomination · Invitation only), visibility (Public link · Restricted to named organisations · Invitation only), deadline, selection process (rubric), reporting expectations, release schedule | Drafted by any funder member; published only by a person with Approve who is not the drafter. Its page is also the public share-link page. |
| **Listing: Need** ("funding needed") | What a seeker publishes | Owner (adult athlete, guardian for a minor, or organisation), what is needed, why, amount with a breakdown, expected use, date needed, key facts with verification chips, visibility (Verified funders only · Invitation only; adults may also choose Public) | A minor's Need is shown only as a de-identified card. Requested, Pledged, Received and Remaining are views of its Awards (I6). |
| **Proposal: Application** | A seeker asks for an Opportunity | Applicant, prepared by, submitted by, route (direct or nomination), fields shared (share consent), budget lines, requested amount, **other funding declared**, documents, statement, eligibility result, field verifications, rubric scores, conflict-of-interest declarations, status | A coach can prepare; only an adult athlete, a guardian (for a minor) or an authorised organisation member submits. |
| **Proposal: Offer** | A funder proposes support for a Need or an adult's discoverable profile | Fund, amount (capped at the Need's remaining amount), purpose, category, conditions, release schedule, reporting duty, deliverables (commercial only, at most 3), acceptance window | Goes to the adult athlete, or to the guardian for a minor. The recipient can accept, decline or request changes. |
| **Award** | The agreement — the centre of the product | Recipient, funder, Fund, **origin** (Application · Offer · Existing agreement), category, behaviour, amount (or items and declared value), instalments, conditions, Update schedule, deliverables (commercial only), agreement version, accepted by and when, status | Every route ends here. Accepting records name, date and agreement version (no e-signature). |
| **Ledger entry** | A money event on one Award | Type (commitment, release, receipt confirmed, expense reported, expense verified, expense queried, expense rejected, carried-in released, carried-in reported, cancellation), amount, date, by, reference, document | Belongs to exactly one Award (I5). Append-only; corrections are new entries with a reason. |
| **Update** | A periodic submission by the recipient | Period, expense lines (amount, category, date, document, allocation), progress records (results with documents, coach-attested training, milestones), photos (only with consent), short note; for programmes, session totals, evidence and a narrative | One form for both expenses and progress. |
| **Review** | A human decision on an Award | Outcome (Continue · Continue with conditions · Pause next release · Close), optional "Invite to renew", reason, conditions, by, date | Always shows who decided and why. Renewal re-opens the Apply form prefilled from the Award. |

**Supporting records:** Person; Athlete profile (each field with its own verification); Organisation; Membership
(permissions); Representative authorisation (guardian → coach powers); Consent record (purpose, decision, by, when,
withdrawn); Verification (field, method, document, verifier, date); Document; Programme (targets, sites); Session
record; Exception and action; Recovery plan; Report; Audit event; Notification (simulated, in-app only).

## 3. Funding routes mapped to the model

| Founder's route | Starts with | Becomes | Commercial weight |
|---|---|---|---|
| **A** Open scholarships and funding opportunities | Funder publishes an Opportunity; shares the link; federations or clubs may nominate | Applications → Awards | **Headline** |
| **B** Athlete-led funding requests | Seeker publishes a Need | Offers → Awards (one Need can have several funders) | Secondary; within a funder's network first |
| **C** Funder-led direct discovery | Funder finds a Need or an adult's discoverable profile in Discover | Offer → Award (Route C is Discover plus an Offer, not a separate workflow) | Secondary; within a funder's network first |
| **D** Programme funding | Funder publishes a programme call (an Opportunity) or an organisation applies | Application → Award with programme behaviour | **Module two** |
| **D** Existing sponsorships and agreements | Funder chooses "Add existing funding" | Award created directly with origin "Existing agreement"; the recipient confirms the agreement and opening figures, or disputes them with a reason | Shortcut |

## 4. Funding categories and behaviours

Six category labels map to four behaviours. "Existing funding agreement" is not a category: it is an **origin**, and
any category can arrive that way. The interface shows category and origin as two separate chips.

| Behaviour | Category labels | What is tracked | Counts in |
|---|---|---|---|
| **Athlete development** | Scholarship · Development grant · Direct athlete support | Cash ledger, expenses, sporting progress | Development totals |
| **Programme** | Programme grant | Cash ledger, delivery targets, sessions, evidence, outcomes | Programme totals |
| **In-kind** | Equipment or in-kind support | Items pledged and delivered, a *declared* value ("declared value, not cash") | A separate in-kind column only (I7) |
| **Commercial** | Commercial sponsorship | Payments, plus up to 3 deliverables owed *by the recipient* (for example an appearance) | Reported separately; never in development, programme or impact totals (I7) |

Development funding supports participation or development; commercial sponsorship buys agreed promotional activity.
The product never merges them, and never claims CSR eligibility, tax treatment or regulatory compliance.

## 5. Roles, permissions and purpose-based access

### 5.1 Account types

- **Person accounts:** an adult athlete (18 or over), a guardian, or a coach. One account can manage several athletes
  through a header switcher ("Managing: Tiago ▾").
- **Organisation accounts:** members hold permissions. An organisation can be a funder, a recipient, or both; an
  organisation that does both switches mode ("Seeking funding · Providing funding") rather than seeing a merged menu.
- **Minors** (under 18 in the demo, decision D10; a per-country setting later) have no login in the prototype. A
  guardian registers and represents them.
- **Platform administrator:** organisation verification (simulated) and audit.

### 5.2 Permissions on organisation members

| Permission | Allows |
|---|---|
| **Admin** | Members and permissions, organisation profile and consent, audit view for the organisation |
| **Review** | Assess applications, score the rubric, shortlist, request information, record routine review decisions (Continue, Continue with conditions), accept programme reports, record existing funding, nominate athletes (for nominating organisations) |
| **Verify** | Verify profile fields, documents and expenses; verify session records (operator side) |
| **Approve** | Publish opportunities, approve awards and decisions, send offers, approve recovery plans, Pause next release, Close |
| **Finance** | Record releases, verify expenses, see full ledgers |
| **Manage programme** | Run a programme: targets, sites, actions, recovery plans, updates and reports |
| **Record sessions** | Record sessions and attendance counts for their own sessions only |

Any member may draft. Anyone may hold several permissions.

### 5.3 Who can do what

✓ = can · P = can prepare only · — = cannot. Rows marked * are subject to four-eyes (§5.4).

| Action | Adult athlete | Guardian (for a minor) | Coach (authorised) | Funder member | Operator member | Platform admin |
|---|---|---|---|---|---|---|
| Register; edit own profile | ✓ | ✓ (minor's profile) | own coach profile | — | — | — |
| Publish a Need | ✓ | ✓ | — | — | ✓ (organisation Need, Admin) | — |
| Prepare an application | ✓ | ✓ | P (if granted) | — | ✓ | — |
| Submit an application | ✓ | ✓ | — | — | ✓ (Admin or Manage programme) | — |
| Accept, decline or request changes to an offer or award | ✓ | ✓ | — | — | ✓ (Approve) | — |
| Confirm receipt of a release | ✓ | ✓ | — | — | ✓ (Finance or Admin) | — |
| Submit an Update | ✓ | ✓ | ✓ (if granted "Submit updates") | — | ✓ (Manage programme) | — |
| Change or withdraw consent | ✓ | ✓ | — | — | ✓ (Admin, organisation data) | — |
| Import from Revivo Pathway | ✓ | ✓ | — | — | — | — |
| Draft an Opportunity | — | — | — | ✓ | — | — |
| Publish an Opportunity* | — | — | — | Approve | — | — |
| Verify a field, document or expense | — | — | attest training only | Verify or Finance | Verify (sessions) | — |
| Score, shortlist, request information | — | — | — | Review | — | — |
| Approve awards and send decisions* | — | — | — | Approve | — | — |
| Send an Offer (above the Fund's delegated limit needs a second Approve)* | — | — | — | Approve | — | — |
| Record a release | — | — | — | Finance | — | — |
| Record or verify a session | — | — | — | — | Record sessions / Verify | — |
| Approve a recovery plan* | — | — | — | — | Approve | — |
| Draft a report | — | — | — | — | Manage programme | — |
| Accept a report* | — | — | — | Review | — | — |
| Record a review decision (Continue / with conditions) | — | — | — | Review | — | — |
| Pause next release or Close* | — | — | — | Approve | — | — |
| Add existing funding (recipient confirms) | — | — | — | Review or Approve | — | — |
| Verify an organisation (simulated) | — | — | — | — | — | ✓ |
| View the audit | own records | minor's records | — | own organisation (Admin, Approve) | own organisation | all (metadata) |

### 5.4 Fixed rules (every screen)

- **Four-eyes.** The person who prepared something cannot approve it: opportunity drafts, award recommendations,
  recovery plans, expenses (the submitter cannot verify their own) and reports. Self-approval is blocked with the
  reason ("You prepared this. A different person must approve it."). Returning something requires a reason.
  Cross-organisation four-eyes counts: the operator prepares a report, the funder accepts it.
- **Delegated offer limit.** A Fund can let one person with Approve send offers up to a set amount (Oriel Athlete
  Support: $2,000); larger offers need a second Approve.
- **Representatives.** A guardian can grant a coach only two powers per athlete: *Prepare applications* and *Submit
  updates*. A coach can never submit an application for a minor, accept or decline offers, change consent or publish
  Needs for a minor. Every representative action is audited with "on behalf of".

### 5.5 Purpose-based access (who sees what)

| Viewer | Sees |
|---|---|
| Funder evaluating an application submitted to them | Only the fields the applicant (or guardian) ticked when sharing: typically name (a minor's first name only), age, sport, region, results, documents, budget, other funding declared and statement. ID documents are visible to Verify users only. Never a minor's contact details: contact is the guardian. |
| Funder with an Award | The shared fields, plus Updates (progress and expenses) while "Progress reporting" consent is on. A minor's full name appears on the agreement, visible to Approve and Finance users only. |
| Funder browsing Discover | **Adults:** a limited profile (name, sport, region, age band, verified results summary, purpose sought), only if they chose to be discoverable; no contact details. **Minors:** never as a profile; only a de-identified Need card, for example "Swimmer · 16 · Coastal Region · qualification verified". |
| Programme-only funder | Aggregates and session-level counts. Never participant names, individual attendance or unconsented photos. A dashed placeholder reads "Participant details are not shared with funders". |
| Operator staff | Their own participants. A coach sees the register for their own sessions only. |
| Platform administrator | Organisation records and audit metadata; not athletes' documents. |

Every view of a minor's record is audited.

## 6. Financial state model

### 6.1 Definitions

Per Award, rolled up per Fund, per funder and per recipient. **All amounts are summed from ledger entries; no total is
stored.** Funder screens use the terms below, each with a one-line definition on tap. Seeker screens use plain words.

| Term (funder) | Definition | Seeker wording |
|---|---|---|
| **Announced** | The amount a funder has publicly set aside for a Fund. Not a liability. | "Funding available" |
| **Reserved** | Offers approved but not yet accepted. An offer's acceptance window is 14 days by default; a person with Approve may extend it once, with a reason. Expired or declined offers release their reservation. | "Offered to you" |
| **Committed** | Awards approved by the funder *and* accepted by the recipient, net of cancellations. Includes amounts already released. | "Agreed" |
| **Available to award** | Announced − Reserved − Committed. | — |
| **Released** | Disbursements *recorded* by the funder's Finance user (simulated, with a reference). | "Paid to you" |
| **Receipt confirmed** | A flag the recipient sets on a release. | "You confirmed you received it" |
| **Outstanding commitment** | Committed − Released. | "Still to come" |
| **Expenditure reported** | Expense lines submitted against the Award, excluding rejected lines. | "Spent (you told us)" |
| **Expenditure verified** | Reported lines whose document a Finance or Verify user has checked. | "Spent (checked)" |
| **Awaiting verification** | Reported − Verified (includes lines with a query). | "Being checked" |
| **Unspent, held by recipient** | Released − Reported, when positive. | "Not spent yet" |
| **Reimbursable** | Reported − Released, when positive (spending ahead of a release). Shown, never hidden. | "Spent before payment" |
| **Need: Requested** | The amount the Need asks for. | "You asked for" |
| **Need: Pledged** | Sum of accepted Offers on the Need (each one an Award). | "Promised" |
| **Need: Received** | Released *and* receipt confirmed, on those Awards. | "Received" |
| **Need: Remaining** | Requested − Pledged. | "Still needed" |
| **In-kind** | Items and a *declared* value, in a separate column labelled "declared value, not cash". Never added to cash totals. | "Equipment promised / delivered" |
| **Carried in** | Released and reported amounts from before an existing Award came onto Revivo. Labelled "carried in, not verified in Revivo" and excluded from Verified. | "Before Revivo" |

### 6.2 Invariants (unit-tested; property-based)

1. **I1** Per Fund: Available to award ≥ 0. An approval or offer that would break this is blocked, and the screen says
   by how much.
2. **I2** Per Award: Released ≤ Committed.
3. **I3** Per Award: Verified ≤ Reported ≤ Committed. Spending ahead of release is shown as "reimbursable".
4. **I4** Per Need: Pledged + pending offers ≤ Requested. An offer is capped at the remaining amount when it is entered.
5. **I5** Every ledger entry and expense line belongs to exactly one Award; every Award to exactly one Fund. Splitting an
   expense needs explicit allocations that add up to the expense amount.
6. **I6** Platform, funder and recipient totals sum Awards. They never add Needs and Awards together; a Need's Pledged
   amount is a *view* of its Awards.
7. **I7** Commercial and in-kind entries never enter development or programme cash totals, or reports of outcomes.
8. **I8** Every figure on screen is calculated from records and is a "See source" button.

Also enforced by rule: an award amount must be one of the Opportunity's published tiers (or ≤ its maximum); a Fund
cannot exceed its published number of awards.

### 6.3 Worked examples (state at Wed 30 Jun 2027 unless stated)

**Fund: Emerging Athletes Scholarship (Tallwater Sports Foundation).**

| Line | Amount |
|---|---|
| Announced | 250,000 |
| Committed: 45 accepted awards | 211,000 |
| Reserved: 1 offer awaiting acceptance ($3,500; window extended to Thu 15 Jul at the guardian's request) | 3,500 |
| **Available to award** | **35,500** (250,000 − 211,000 − 3,500) |
| Released: instalment 1, 50% of each accepted award | 105,500 |
| **Outstanding commitment** | **105,500** |

The 46 offered awards are 27 × $5,000 + 13 × $4,500 + 6 × $3,500 = $214,500: the 45 accepted ($211,000) plus the 1
reserved ($3,500). Tallwater keeps $35,500 unawarded for in-year decisions.

**Award: Amira Haddad** (requested $4,800; awarded $4,500, the panel's tier).

| Entry | Amount | State |
|---|---|---|
| Committed (accepted Thu 6 May) | 4,500 | Outstanding 4,500 |
| Released: instalment 1 (6 May; receipt confirmed) | 2,250 | Outstanding 2,250 |
| Expense: coaching fees, Apr–Jun (invoice) | 900 | Verified |
| Expense: Continental U21 Open, entry (receipt) | 180 | Verified |
| Expense: Continental U21 Open, travel (receipt) | 640 | Verified |
| Expense: competition judogi (receipt missing) | 210 | Awaiting: query "Add receipt" |
| **Reported / Verified / Awaiting** | **1,930 / 1,720 / 210** | |
| **Unspent, held by Amira** | **320** (2,250 − 1,930) | |

**Need: Tiago Mendes, competition travel** (published by Rosa Mendes, his guardian).

| Item | Amount |
|---|---|
| Requested (flights 1,350 + accommodation 650 + entry 150 + team kit levy 250) | 2,400 |
| Pledged: Oriel Freight Group (Oriel Athlete Support fund), direct athlete support | 1,500 |
| Received (release recorded, Rosa confirmed) | 1,500 |
| Remaining | 900 |

Any further offer is capped at $900 (an offer of $1,200 becomes $900). Oriel's $1,500 is counted once, as an Award in
Oriel's portfolio; the Need view shows it as pledged, never a second time.

**Fund: Women's Sporting Development Fund (Corvane Sportswear)** — the I1 block in Explore. Announced $40,000;
committed 12 grants (8 × $3,000 + 4 × $3,500 = $38,000); available $2,000. Approving a further $3,000 grant is
blocked: "This would exceed the money available by $1,000."

**Programme: Play Every Day** (Tallwater Community Sports Programme Grant → Lanternfield Community Sport). Committed
$60,000 for 12 months; tranche 1 released $12,000. Quarter spend reported $10,800 (coaching $6,480 + equipment
$1,800 + venue and transport $1,500 + monitoring and evaluation $1,020); verified $10,368; awaiting $432 (a transport
claim without a receipt); 96% documented; unspent $1,200.

**Existing agreement: Ostral Swimming Federation** (Tallwater Federation Development Grants; Journey D). Committed
$24,000. Carried in: released $12,000, reported $10,400 (both labelled "carried in, not verified in Revivo"; Verified
$0). Outstanding $12,000. Next Update due Thu 30 Sep 2027.

**In-kind: Equipment Support Programme (Oriel).** 60 kits, declared value $9,000 ($150 per kit). Shown only in the
in-kind column with "declared value, not cash".

## 7. Consent and minors

### 7.1 Consent purposes

Consent is per purpose with equal Yes and No buttons, nothing pre-selected, and "Change or withdraw" always visible
(Pathway's component). Refusal is respected, never nagged.

| Purpose | Who decides | Effect of withdrawal |
|---|---|---|
| **Discoverable profile** (adults only) | Adult athlete | Removed from Discover immediately; existing applications and awards are unaffected. |
| **Share this application with [funder]** (per application, with the field list visible) | Adult athlete or guardian | Before a decision: withdraws the application, after a warning. After an award: falls back to the award's reporting fields. After an unsuccessful decision: the funder keeps only the reference, outcome and scores for its selection record. |
| **Progress reporting to my funders** | Adult athlete or guardian | The funder sees "Progress sharing paused by the athlete" (or "by the guardian"); the award is flagged for a *human* review; nothing is penalised automatically. |
| **Photos and stories** in updates and reports | Adult athlete or guardian; participants' guardians for programmes | Photos are removed from every update, evidence view and draft report at once; the audit keeps a reference with no content. |
| **Import from Revivo Pathway** (per import) | Adult athlete or guardian | Removes the imported records; anything already submitted keeps a "source removed" note. |

### 7.2 Minors

- A guardian registers the minor; there is no public profile and no profile search.
- A guardian may publish a Need for the minor; funders see only the de-identified card.
- Offers, questions ("Ask a question" uses templates and goes only to the guardian) and receipt confirmations all go
  to the guardian: "This offer goes to the athlete's guardian. The sponsor cannot contact the athlete directly."
- The funder learns the minor's first name only after the guardian accepts an offer or submits an application.
- Commercial sponsorship of a minor happens only through the guardian and is never shown in Discover.
- Coaches act only within the powers a guardian granted (§5.4).
- No free messaging anywhere; structured offers and templated questions only.

## 8. Lifecycles, statuses and rules

### 8.1 Statuses

| Record | Statuses |
|---|---|
| Opportunity | Draft → Awaiting approval → Published (open) → Closed (deadline passed) → Decisions sent → Completed |
| Application | Draft → Submitted → In review → More information needed → Shortlisted → Decided: **Offered** · **Reserve list** · **Not selected** · **Not eligible** (rule, with reason) · **Incomplete at deadline**; also **Withdrawn** |
| Nomination | Nominated → Accepted by athlete or guardian (becomes an application) · Declined |
| Need | Draft → Open → Partly funded → Fully pledged → Closed |
| Offer (and award before acceptance) | Offered (Reserved) → Accepted (Committed) · Changes requested · Declined · Expired · Withdrawn |
| Award | Active → Update due → Under review → Active (Continue) · Active with conditions · Release paused · Closed |
| Expense line | Reported → Verified · Query (awaiting) · Rejected (with reason; excluded from Reported) |
| Session | Scheduled → Delivered (recorded by coach) → Verified (checked by site coordinator) · Couldn't run (reason) |
| Recovery plan | Draft → Submitted → Approved · Returned (reason) |
| Report | Draft → Claims check → Submitted → Accepted · Returned (reason) |

Never "rejected" or "failed" in anything an applicant sees.

### 8.2 Eligibility (deterministic)

Rules are published with the Opportunity and evaluated against the profile and application. Result per criterion:
met, not met (with reason) or check needed (evidence outstanding). Overall: **Eligible**, **Not eligible** (with the
reason) or **Check needed**. Rule types: age range on a date; sport in a list; region in a list; result at or above a
level within a period; document present; statement present; coach or club referee present. The "Other funding"
declaration is required on every application and feeds a no-double-funding check. Copy always adds: "Eligibility is
checked against the funder's published rules. Meeting them doesn't guarantee an award; a review panel decides."

**Inconsistency rules** (found by rule, explained in words by AI C): profile lists current support not declared under
"Other funding"; budget lines do not add up to the requested amount; a document's date of birth differs from the
profile; the same athlete applies twice to one Fund.

### 8.3 Selection

One rubric of 4 criteria scored 1–4: sporting level and trajectory; financial need; clarity of the plan for the
money; coach or club support. Each reviewer declares conflicts of interest per application. A reviewer recommends; a
different person with Approve decides, watching the budget meter (I1) and the tier rule. Decisions are sent together;
reserve-list applicants are told they may be offered an award if one is declined. "Export selection record" produces a
printable record of the rules, scores, conflicts declared, decisions and who made them.

### 8.4 Monitoring rules (deterministic)

- Programme site status: ≥ 95% of scheduled sessions delivered = On track; 85–94% = Needs attention; < 85% = Behind.
  Shown as an icon plus a word.
- Alert: two consecutive missed sessions at one site.
- Reminders (simulated, in-app): Update due, missing receipt, offer expiring, report due.
- **Claims check** on reports: flags causal or impact wording ("improved", "transformed", "because of", "proves",
  "impact", a percentage without its sample size) and suggests neutral wording; a person rewords.

## 9. AI: exactly three simulated experiences

Every AI output carries the chip **"Simulated AI"** with the line "AI-assisted, simulated in this prototype. Check
against sources." A person confirms, edits or discards every output. AI only reads records the person is permitted and
consented to see.

| | AI A: Matching | AI B: Application help | AI C: Funder intelligence and reporting |
|---|---|---|---|
| **For** | Athletes, guardians (opportunities); funders (Needs and adult profiles) | Applicants and organisations | Reviewers, funders, programme operators |
| **Does** | Athlete side: explains why an opportunity is suggested ("Matches your sport (judo), your national U21 bronze (to be verified) and your stated purpose (coaching and competition costs)"). Funder side: turns a plain-language brief into **visible, editable filter chips**. | Builds the document checklist by comparing the Opportunity's requirements with the profile; drafts the statement **only** from records, each sentence linked to its source, gaps marked "[in your own words]". | Summarises an application for a reviewer with sources; explains inconsistencies that rules found; "Ask Revivo" with suggested questions; drafts reports from verified records, always listing exclusions and limitations. |
| **Order and results** | The list and every eligibility result come from **rules**; order is a deterministic criteria-fit count, then the deadline | — | Every factual sentence is a linked chip to its record |
| **Refuses** | Ranking people by merit; inventing opportunities; guaranteeing eligibility; searching records not consented as discoverable | "Make my financial situation sound worse", "add a result", any medical or financial invention: "I can only use information in your records." | "Did the scholarship improve performance?" → "Records can't show cause. 2 verified progress records this quarter, no comparison." "Did the programme improve confidence?" → "Records cannot show cause. 212 of 460 answered both surveys; this is self-reported change with no comparison group." |

**Always deterministic:** eligibility, every number and total, financial states and invariants, alerts, offer caps,
the claims check, access control, deadlines and statuses.
**Always human:** verification, awards, releases, expense verification, recovery plans, report acceptance, review
decisions.
v1's voice-note summary is cut; coaches type a short note.

## 10. The Commitment-to-Evidence Chain

One component with six nodes, drawn as the **Funding Line** (`04` §5): the funder at the left, the recipient at the
right, the light stopping at the current node. Each figure is a "See source" button that opens the Source records
panel. Each figure carries its level: **Participation**, **Output**, **Outcome (self-reported)** or **Impact: not
evaluated**.

**Athlete chain (Amira, at 30 Jun 2027):** Funding need → Approved award → Funds released → Expenses → Sporting
progress → Funding review.

| Node (label) | Figure | Drills down to |
|---|---|---|
| Need | $4,800 requested | Application |
| Award | $4,500, approved by I. Solberg, accepted 6 May | Decision record, agreement |
| Released | $2,250 of $4,500 | Release entry with receipt confirmation |
| Spent | $1,930 reported · $1,720 verified · $210 awaiting | Expense lines, then the document |
| Progress | 2 verified records (5th place, Continental U21 Open; 34 of 36 training sessions attested by her coach) | Results document; coach attestation |
| Review | Continue with conditions | Decision with reason and author |

**Programme chain (Play Every Day, at 30 Jun 2027):** Funding commitment → Activities delivered → Expenditure →
Evidence → Outcomes → Review.

| Node (label) | Figure | Drills down to |
|---|---|---|
| Commitment | $60,000 · 120 sessions this quarter · 6 sites · 460 places | Agreement |
| Delivered | **108 of 120** (104 verified, 4 awaiting); branch: 12 not delivered (8 weather, 4 coach availability), recovery plan approved | Sites → sessions → session record (counts only for funders) |
| Spent | $10,800 of $12,000 released · $10,368 verified (96% documented) | Budget line → expense → document |
| Evidence | 104 verified sessions; consented photos (3 removed: consent withdrawn 18 Jun) | Evidence |
| Outcomes | Survey, self-reported: "I feel confident trying new activities" 58% → 71%, n = 212, no comparison group | Survey record |
| Review | Continue with conditions | Decision |

Under every chain, the short honesty line: "Records show activity and spending, not proof of impact." Reports and the
About page carry the full line.

## 11. Independence and the optional Revivo Pathway import

Revivo Impact has its own registration, profiles, representatives, consent ledger, verification records and audit (an
append-only event log). No user needs to use, buy or understand Revivo Pathway. Journey A starts with independent
registration and never touches Pathway.

**Optional import** (one action on Profile: "Import verified records from Revivo Pathway"):

1. Simulated sign-in to Pathway (no real connection, no real Pathway database).
2. Choose fields from a list.
3. Guardian consent for a minor.
4. Records arrive labelled "Verified in Revivo Pathway · imported [date]" and can be removed at any time.

Shown only in Explore (Inês's profile) and on Profile; never in the guided Journey A (decision D15). Shared
infrastructure with Pathway (sign-in, organisations, consent, audit, design tokens) is a future architecture decision,
not part of this prototype.

## 12. Exclusions

| Excluded | Why |
|---|---|
| Individual donors, individual sponsors, crowdfunding | Biggest safeguarding and payment-regulation risk; not the paying customer. Deferred until after validation (D8). |
| Free messaging between funders and athletes | Structured offers and a templated "Ask a question" to the representative only. |
| Real payments, bank feeds, payment schedules beyond simple instalments, tax receipts, cross-border transfers | Releases are recorded, not processed. |
| E-signature and contract authoring | "Accept" records name, date and agreement version. |
| Multi-stage scoring panels, weighted committee scoring, appeals | One rubric and one conflict declaration; the decision letter says who to contact. |
| Sponsorship rights inventories, valuation, activation analytics | Commercial sponsorship gets payments plus up to 3 deliverables (possible future Revivo Partner). |
| Recovery of unspent or returned funds, clawback | Shown as "Unspent, held by recipient"; workflows deferred. |
| Several currencies inside one Fund; exchange rates | One currency per dataset; USD only (D4). |
| Translations, native apps, offline sync, real logins, email or SMS | In-app notifications are simulated; the language structure is kept, English only. |
| Supervised logins for minors | Minors appear only through their guardian's account. |
| Platform administration beyond organisation verification and audit | One Audit & admin screen (D16). |
| Accounting, CRM, independent impact evaluation, SROI | Not this product. |
| A real Revivo Pathway connection | The import is simulated and optional. |
| v1's voice-note AI | Exactly three AI experiences (D12). |
| Health monitoring, injury or medical data, face recognition, biometrics, location tracking | Never. Progress is results, attendance and milestones only. |
