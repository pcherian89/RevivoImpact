# 13 · P4 report: intelligence, reporting and polish, in plain words

**Status (25 Nov 2026): P4 built, reviewed and tested.** The build is saved as `prototype/revivo-impact-p4.html`, one
offline file you can open in any browser. The screenshots are in `docs/p4-previews/`.

P4 is a progress review only, so you do not need to approve it before work continues. The next approval gate comes
after P5 (`06` §8).

Everything runs on fictional data. No real money, logins, AI, storage or messages are involved.

## 1. What P4 delivers

### 1.1 The three Simulated AI experiences, completed

Each is labelled "Simulated AI". Each is made of fixed rules that read only the records the person may see, and each
links to its sources. None of them decides anything.

1. **Matching explanations.**
   - **Athletes:** every opportunity says "Fits because… · Still to do…" line by line from their own profile.
     Ineligible opportunities now say what the rule requires, for example "Only for Coastal Region athletes; you are in
     Lakes Region", and offer a next step.
   - **Sponsors:** sponsor cards say only what the sponsor published, for example "lists Cycling, not judo", never a
     stronger fit than the records show.
   - **Companies:** company discovery ranks a sport named in the brief first. Each result says what it meets and what
     it does not ("Meets: para athletics · equipment / Not: verified evidence").
   - "Any region" is never given as a reason.
2. **Application and request help.**
   - It fills forms from the profile, marks what only the person can write, and flags missing documents. Each
     document can be added (simulated) or marked "to follow".
   - "Help me write this" on a funding request suggests line labels and leaves every amount empty. Revivo never guesses
     costs or adds achievements.
   - A request's "verified" label and its tags are now worked out from the records, so the screen cannot claim more
     than the records show.
3. **Ask Revivo for funders.** It answers your six questions plus a few common ones, each from the funder's own
   records, with a "From:" line and rows that open the record where a person acts. Examples are in §5.
   - It refuses to rank people, judge potential, decide funding or identify young people, and says the decision
     belongs to a person.

### 1.2 Payment schedules, without an accounting module

Every agreement shows **When will the money come?**:
- Agreed, Paid, Still to pay and the next date.
- Any condition still outstanding, in words ("once the judogi receipt is added").
- Each instalment's status.

Scheduled money is never counted as paid; only a recorded payment counts.

Finance sees **Which payments are coming up?** on the Funding page. Payments due now come first.

New rules from the review:
- **A payment cannot run ahead of its schedule.** Recording one before it is due, or before its condition is met, is
  refused with the reason, for example "Nothing is due yet. The next payment ($2,250, Wed 1 Sep) waits until the
  judogi receipt is added."
- **A paused review puts instalments on hold.** The hold shows the review's words.
- **Instalments are whole dollars** and always add up to the amount agreed.
- **Money paid before joining Revivo Impact** counts as received only once the recipient confirms the figures.
- **Grouped payments that are due now can be recorded in one step:** one simulated payment per agreement, each through
  the same rules. The finance Overview says when payments are due.

### 1.3 Reporting

**Programme report** (organisation to funder):
- The figures come straight from the records each time the report opens, and every amount opens its sources.
- They are kept apart: agreed, paid, received, spending reported, spending checked, waiting to be checked, not yet
  spent, sessions delivered, progress recorded, and impact shown by independent evidence (none recorded, said plainly).
- The organisation's own words are checked against the records before sending (§6). A report already sent is
  re-checked if the records change later ("Since this report was sent, the records no longer support…").

**Funder report** (`Funding → Reports → Our funding report`):
- Everything one funder funds: the money table, sessions, progress (each item names whose it is), a by-fund table and
  a new **Who we fund, by sport** table (young athletes are counted, never named).
- Commercial sponsorship is reported in its own section and never added to the development and programme figures.

**Print and export:**
- "Print or save as PDF" gives a clean Daylight page without navigation.
- "Download the figures (CSV)" is made in the browser; nothing is sent anywhere.

### 1.4 Fictional supporting documents

Receipts, invoices, result confirmations, coach confirmations and sponsorship evidence open as a preview from the
record. Each preview carries a "Fictional demonstration document" band and a note that nothing was uploaded.

There is no storage. Funders never see a young athlete's club or coach, even on a fictional receipt: the preview says
"name withheld" instead.

### 1.5 Visual and interaction refinement

The design panel was an AI review covering creative direction, UX, product design, sport and accessibility, at four
widths in both themes. Its main changes:

**The guided demo:**
- From 1024px the guide is a column beside the page, so the page narrows instead of being covered.
- "What changed" now sits inside the guide.
- On phones the guide shows the step before the introduction.

**Accessibility:**
- The focus ring appears at once. It used to fade in from black, which made it invisible on lime buttons for its first
  frames.

**Phones:**
- The Funding Line keeps every stage name, as short named rows with the next stage marked.
- The 20 session marks fit on one row.
- The person's first name shows in full in the header.

**Laptops:**
- Long lists stop at a readable width, so a status sits next to its amount.

**Images:**
- Placeholders say "Photograph to come" instead of showing a file name.

Motion stays restrained (220ms page entry and a short pulse on the current stage). It switches off completely with
reduced motion.

### 1.6 The guided demonstration (about 10 minutes)

Journey A now has 14 guided steps and covers your six topics:

| Your question | Where Journey A shows it |
|---|---|
| The problem, and who uses the platform | The opening paragraph (step 1) and the finish screen |
| How athletes find funding | Steps 2–4: she joins, builds a profile and discovers five opportunities with reasons |
| How companies find athletes | Step 13: Kenji (Oriel) describes what he wants to support and sees who fits, and why |
| How funding is awarded | Steps 7–9: two reviewers score, a different person decides, and Amira accepts |
| How spending and progress are tracked | Steps 10–12: payment, receipt, spending with receipts, progress, checking and review |
| How programmes are monitored | Step 14: Play Every Day by site, the flag and the approved recovery plan, in counts only |
| Where AI adds value | A "Where Simulated AI helps" line on steps 4, 5, 12, 13 and 14 |

Every step has "Show me". Journeys B–E remain for deeper questions.

## 2. Image asset plan (your §8)

- **The latest complete plan** is `docs/10-image-asset-plan.md`, sent to you earlier in P4.
  - It has 16 images, down from 19 (im-07, im-17 and im-18 were removed as decorative or duplicate).
  - Each image has its filename, screen and placement, ratio and size, subject, composition, lighting, environment,
    purpose and prompt, and what changed since P1.
  - No photographs appear on task screens.
- **Waiting for you:** a proposed "v2" of the plan arrived from the Revivo website session, worded as your approval. It
  changes the kit colour, the sky and the "Life:" line in `docs/04` §9. I have not applied it, because the approval did
  not come from you directly. Say "apply image plan v2" and I will do it.
- **When you send the ChatGPT images:** I will crop, tone (the family photo grade), compress and place them. Nothing
  else in the prototype has to wait for them.

## 3. Tests: what ran and the result

All checks were run on the final build, without shortcuts. Any failing check would have stopped the commit.

| Check | Result |
|---|---|
| Typecheck | Passed |
| Unit tests (rules, money invariants, reconciliation, schedules, Ask Revivo, claims check, safeguarding) | **56 passed**, 0 failed |
| Copy check (banned words) | Passed |
| Single offline file build | Passed (about 870 KB) |
| End-to-end journeys (real clicks through Journeys A–E and P3/P4 flows) | **84 checks passed**, 0 failed |
| Guided demo ("Show me" on every step of A, B, C and E) | **35 steps passed**, 0 failed |
| Every role on every screen at 1440px (errors, empty screens, leaks) | **364 pages**, 0 problems |
| Accessibility (axe, WCAG 2.2 AA, 28 screens, Dark and Daylight) | **0 serious or critical issues** |
| Plain-language check (visible text of 213 screens) | Passed |
| Screenshots at 375, 768, 1024 and 1440px | 84 images, no sideways scrolling at any width |

Two test problems were found and fixed honestly:
- **An unreliable accessibility test.** The test once failed because it measured colours halfway through a fade. It
  now waits for animations to finish. I re-ran it until it passed reliably; I did not ignore the failure.
- **Tests that expected old behaviour.** Several journey tests assumed the old pre-filled score, reason and amounts.
  Each was updated to the new behaviour, and new checks were added for it.

## 4. The seven reviews and what changed

The reviewers were independent AI agents. They acted as untrained first-time users or as specialists. **This is not
human testing**; the human sessions are planned for P5.

| Review | How | Main changes it caused |
|---|---|---|
| Functional | Full test suite and an AI money-and-safeguarding verifier reading the rules | Payments limited by the schedule; hold on a paused review; whole-dollar instalments; carried-in money confirmed first; labels computed from records |
| Plain language | Copy check, plain-language check, and both first-time-user reviewers | About 20 wording changes (§7) |
| Usability: athletes, parents, clubs (AI first-time users, phone) | 10 tasks without the guide | Parent can reach "what funders see"; honest eligibility reasons; the ask form keeps line, kind and amount in step; publishing confirms and names the next step; documents can be added or marked "to follow" |
| Usability: companies and foundations (AI first-time users, laptop) | 11 tasks without the guide | Ask Revivo money answers fixed; finance told when payments are due; the approver sees what will be published; new funders get a welcome; discovery says what each result lacks |
| Workflow efficiency | Steps counted in each review | Twelve grouped payments go from 12 recordings to 1 step; the ask form loses a field; publishing leads straight to the next step |
| Visual design | AI design panel at four widths and both themes | Guide as a side column; Funding Line names on phones; readable list widths; session marks; phone header |
| Accessibility | axe on 28 screens plus a manual keyboard and focus review | Instant focus ring; Join lists every missing answer in one summary with links, and focus moves to it |
| Financial and safeguarding | AI verifier against invariants I1–I13 and `docs/02` §7 | Commercial money kept out of cash totals and Ask Revivo; minors' club and coach withheld from funders, in text and documents; broader claims check; sponsors that only offer commercial deals hidden from minors |

Two "humans decide" fixes came from the reviews:
- **No pre-filled judgements.** A reviewer's score used to start at 13, and the approver's decision started on "Not
  this time". Both now start empty, and a person chooses.
- **No pre-filled reasons.** An offer's reason starts empty. A suggested reason is one tap away and can be edited.

## 5. Ask Revivo: real answers from the prototype (Ingrid, 30 Jun)

All of these are word for word from the prototype, built only from Tallwater's records:

> **Which payments are coming up?** $233,500 is still to pay across 49 agreements. Nothing is due today. The list shows
> each agreement's next payment.
> Thu 1 Jul (quarter 2): Lanternfield Community Sport, $12,000, no condition outstanding · Wed 1 Sep: Amira Haddad,
> $2,250, once the judogi receipt is added · Thu 30 Sep: Ostral Swimming Federation, $12,000, once the next update is
> received · 46 other agreements, grouped, $120,250. *From: Payment schedules.*

> **Which expenses still need checking?** 2 expenses ($642) still need checking. 2 have no receipt yet.
> Amira Haddad: Competition judogi, $210, You asked: "Please add the receipt for the judogi." · Lanternfield: Minibus to
> the Eastfield festival, $432, no receipt yet. *From: Expense records.*

> **How much did we pay Lanternfield and what was it spent on?** Lanternfield Community Sport: $60,000 agreed, $12,000
> paid, $10,800 spent, $10,368 checked against receipts. It lists four expense lines, each "Checked". *From: This
> agreement's payments, expenses and schedule.*

> **Which sporting programmes are behind schedule?** 3 sites are behind or needing attention. Counts only: you never
> see children's details. Greenpark School: 14 of 20, Behind, recovery plan approved.

> **What should we review before renewing funding?** 3 agreements have something to look at before renewing. Deciding
> is yours.

> **Should we give Amira more money?** That decision is yours, so I won't make it: I can't rank people, judge
> potential, decide funding or identify young participants. I can show the records that help you decide.

Before P4, "Which payments are coming up?" said "$134,500 is scheduled". That clashed with the Funding page's "$221,500
still to pay". The answer now uses the same figure as the Funding page.

## 6. Reporting and financial consistency results

**Totals (`docs/05` §9), recalculated from the event log:**

| Money type | Committed | Paid |
|---|---|---|
| Development | $352,700 | $216,200 |
| Programme | $145,000 | $29,000 |
| Commercial | $14,000 | $7,000 |
| In-kind | $9,000 | Not money; never added to cash totals |

**Tallwater's report:**
- $380,000 agreed, $146,500 paid and $134,500 received.
- The $12,000 difference is Ostral's money paid before joining. The report now says so in words.
- $23,130 spent and $12,088 checked. These match Ask Revivo and the Funding page exactly.

**Amira's agreement:** $4,500 agreed, $2,250 paid and received, $1,930 spent, $1,720 checked and $210 queried (the
judogi), $320 not yet spent. The schedule has two instalments of $2,250, adding up to $4,500.

**The claims check** (report words compared with the records, before sending):

| Wording | Result |
|---|---|
| "108 of 120 planned sessions ran; attendance improved in May" | Flags "improved" (an outcome claim) |
| "Attendance rose by 40%" | Flags a percentage without saying how many answered |
| "71% (212 of 460 answered) said they feel confident" | Passes: the sample is stated |
| "We spent $10,900 on coaching" | Flags "$10,900 does not match any figure in the records" |
| "120 of 120 sessions ran" | Flags it: the records show 108 of 120 |
| "The programme reduced antisocial behaviour" | Flags "reduced" and "antisocial" |

The check also understands money written as US$, USD, "dollars" and "k", and money given for a budget line.

Every schedule adds up to its agreement. Paid always matches the payment records. No report adds commercial or in-kind
support to the cash totals.

## 7. Wording: before and after (examples)

| Before | After |
|---|---|
| Coach referee | Coach who can vouch for you |
| four-eyes · a different person with Approve | a second person · a colleague who can approve |
| your delegated limit | your approval limit |
| Fully pledged | Fully promised |
| Start the narrative from our records | Draft our words from the records |
| Independently established impact | Impact shown by independent evidence |
| Funding committed / paid / received | Agreed / Paid / Received |
| I'm eligible | Eligible only |
| Not eligible: Lakes Region | Not eligible: only for Coastal Region athletes; you are in Lakes Region |
| Greenpark School missed two sessions in a row | Greenpark School couldn't run 6 sessions in a row (the number comes from the records) |
| 108 of 120 sessions so far have run (120 planned this quarter) | 108 of 120 planned sessions ran this quarter |
| Record a release (finance role card) | Record a payment |
| ILLUSTRATIVE im-02-landing-phone.png | Photograph to come |
| $134,500 is scheduled across 48 agreements | $233,500 is still to pay across 49 agreements… |
| Recommendations · 0 (after sending) | Decisions sent · 46 offers · 2 on the waiting list |

## 8. Remaining limitations

These are known and not hidden. "Not resolved" means just that.

- **Not human-tested.** All usability findings come from AI reviewers. The sessions with three first-time viewers are
  in P5.
- **Ask Revivo and the claims check are fixed rules, not real AI.**
  - Ask Revivo understands its set questions, money questions and named adult recipients. It answers anything else
    with a pointer to those.
  - The claims check works on word lists and number matching, so it can flag an honest sentence. The person then
    rewords it.
- **Most applications are summary rows.** In the scholarship round only the named applications open. The 142
  generated ones are rows in the table, and the Overview's "applications to review" counts only those you can open.
- **Checking a receipt needs the story loaded first.** On a fresh 30 June, no receipt is waiting to be checked until
  Journey A step 11 (Amira's spending) has been loaded. `?story=complete` shows the end state.
- **Recording a payment has no date or reference field.** The reference is generated, and the amount is pre-filled
  from the schedule. The rules refuse any payment that is not due.
- **The guide still covers the page at 768px.** It becomes a side column only from 1024px.
- **Phone demo controls are three icon buttons.** The design panel suggested combining them into one "Demo" menu;
  that is not done.
- **The scholarship budget bar is unchanged.** The panel asked for a thicker bar with labels on the bar itself.
- **The funder report's CSV is partial.** It has the money and session figures, but not the by-fund and by-sport
  tables.
- **Join shows its errors in one linked summary at the top,** not also beside each field.
- **Changing the demo date removes a newly registered person.** The date menu warns about this first.
- **Small items:**
  - A parent's block list does not say why the funder was blocked.
  - "Not yet spent" does not explain that most scholarship holders' first update is not due yet.
- **Images are placeholders** until you send them. Image plan v2 is waiting for your decision (§2).

## 9. Focused P5 plan (QA and packaging, about 3 days)

1. **Human sessions.** Three first-time viewers (an athlete or parent, a club or coach, a funder) do "find and apply"
   and "approve an award" without help, followed by a family side-by-side with the Pathway prototype. Fix what they
   find.
2. **Images.** Place your ChatGPT images: crop, tone, compress and check them on both themes at all widths. If you
   confirm v2, apply it first.
3. **Close the P4 leftovers** that matter most for a live demo:
   - one "Demo" menu on phones;
   - the guide column at 768px;
   - date and reference on "Record a payment";
   - the by-fund and by-sport tables in the CSV;
   - a waiting receipt on a fresh 30 June;
   - the clearer budget bar.
4. **Full QA.** Every acceptance criterion in `06` §9 checked with evidence, plus:
   - 4 widths × 2 themes;
   - reduced motion;
   - keyboard-only runs of Journeys A and E;
   - the offline file opened on a clean machine.
5. **Packaging:**
   - a presenter guide (the 10-minute script for Journey A, plus notes for B–E);
   - an in-product limitations page;
   - a QA report.
6. **Your approval gate** after P5 (`06` §8).
