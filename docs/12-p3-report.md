# 12 · P3 report: track and review, in plain words

25 Nov 2026 · branch `claude/festive-fermat-wzl8qa` · fictional data only; no real money, logins, email or SMS.
Prototype: `prototype/revivo-impact-p3.html` (one file, works offline). Add `?story=complete` to the address to open
it at 30 Jun with every journey step done. Screenshots: `docs/p3-previews/`. **Approval gate: the founder approves P3.**

## 1. What P3 delivers

The whole journey now works end to end: **Discover → Apply or Connect → Fund → Track → Review**, on one shared
record per funding agreement, for both sides.

**Athletes, guardians and coaches**
- **Send an update** in one short form: what it was for, how much, when you paid, and a photo of the receipt
  (simulated). It shows how much of the money paid is not yet accounted for.
- **Share progress:** a result, training or something else, with proof. Photos only appear if consent is on.
- **Send sponsorship proof** (commercial agreements): Jonah sends proof for 2 of 4 kit meets.
- **My Funding** shows each agreement with plain steps (Agreed, Paid, Received, Spent, Checked, Reviewed), a money bar
  in everyday words and the one next action: confirm money arrived, add the receipt asked for, add spending.
- **Guardians and coaches** see the athlete's name ("Paid to Tiago") rather than "you". A coach can send updates but
  never accept money, confirm a payment or change consent.

**Funders (foundations, companies, brands, individual sponsors)**
- **One funding record per agreement:**
  - the steps and the money in plain words;
  - "Record a payment" (amount pre-filled to the instalment; simulated);
  - check spending against receipts, ask for a missing receipt, or ask a question in your own words;
  - accept sponsorship proof;
  - record a review: Continue, Continue with conditions, Pause or Close. Pause and Close stop payments.
- **Funding screen** answers the funder's questions:
  - who we support, how much is committed, paid and checked;
  - what needs you, with each figure opening its records;
  - whether there is money left in each fund;
  - funded programmes and reports to read.
- **Existing funding** (Journey D). Someone with Review or Approve prepares it, with what was paid and spent before. A
  different person approves it, then the recipient confirms the figures or disputes them with a reason. Carried-in
  money is labelled apart and never counted as checked or received.
- **Scholarship decisions one applicant at a time.** Each decision carries a short, respectful, editable message, which
  the applicant sees. Sending all the remaining decisions asks for confirmation first.

**Sports organisations and programmes**
- **Programme page, "Is Play Every Day on track?":**
  - every site with one mark per session (ran, or couldn't run with the reason);
  - a plain status rule: on track 95% or more, behind under 85%;
  - a flag when a site misses two sessions in a row;
  - an action to a named person, then a recovery plan approved by someone else.
  - Funders see counts only, never children's details or session notes.
- **Today (coach, on a phone):** record a session in under a minute, or say why it couldn't run.
- **Reports:**
  - Simulated AI drafts the quarterly report only from the records;
  - a live claims check refuses unsupported claims ("improved confidence", "happier", "thanks to the programme") and
    figures that differ from the records;
  - the funder accepts it or returns it with a reason;
  - it prints or saves as a PDF.

**Across the platform**
- **"See where this comes from":** an underlined figure opens the records behind it, respecting who may see what. A
  figure without records is plain text and never pretends to link.
- **Ask Revivo** (Simulated AI, funders and programme directors) answers set questions from the records, for example
  "Why is Greenpark behind?", "How is the money being used?", "Summarise Amira's quarter". It refuses to rank people,
  decide funding or identify young participants.
- **Independent registration** (closing a P2 gap): a new adult athlete, a parent with a young athlete, or a club or
  programme registers with a simulated email code. Each builds their own profile, one fact at a time, choosing who sees
  each fact. Nobody is turned into Amira.

## 2. Completed end-to-end workflows

| Journey | Now complete |
|---|---|
| **A**, scholarship (13 steps) | Publish → join → profile → discover → apply → review → decide → accept → payment → receipt → **spending (4 items, one without a receipt) and progress, confirmed by the coach** → **spending checked, receipt asked for, review "Continue with conditions"** |
| **B**, two-way discovery and sponsorship (7) | … → **Nadia splits her wheels invoice ($2,000 from Oriel, $1,400 from her own money), travel $1,150; both sponsors check; Jonah's proof for 2 of 4 meets accepted; review "Continue"** |
| **C**, programmes (8) | Club funded by a stranger → **Maya saves programme funding → Sam records sessions → Greenpark flagged, action to Lena → recovery plan approved (four-eyes) → spending checked ($432 waits for a receipt) → report with the claims check → Daniel accepts and reviews** |
| **D**, existing funding (4) | **Daniel prepares → Ingrid approves → Farid confirms → the record joins the rest** |
| **E**, coach, guardian, safeguarding (6) | … → **Jonas sends Tiago's update with a photo (consent on); Rosa turns photos off and hides the request; the photo disappears from Oriel's view at once** |

Every 30 June figure in `docs/05` §9 is reproduced from the records:
- Development: $352,700 committed and $216,200 paid, including $12,000 carried in.
- Programme $145,000 / $29,000; commercial $14,000 / $7,000; in-kind 60 kits declared at $9,000, kept apart; 124 agreements.
- Amira: $1,930 spent, $1,720 checked, $210 waiting, $320 not yet spent, $2,250 still to pay.
- Play Every Day: 108 of 120 sessions, 12 missed (8 weather, 4 no coach), 104 checked, 460 participants. Spending $10,800, of which $10,368 checked and $1,200 not yet spent.

## 3. Test results

`npm run check` runs every check below. All pass on the final build.

| Check | Result |
|---|---|
| Unit tests: reconciliation at 12 Apr, 6 May, 30 Jun and with every step (9 new for P3); rules; 22 regression tests from the P2 and P3 reviews | **44 passed** |
| Browser journeys by real clicks: Journeys A–E, the P3 flows, registration, individual decisions, date changes, consent | **75 passed** |
| Guided steps run through "Show me" | **34 passed** (the other 4 steps only open a screen) |
| Every person × every screen at three dates and the full story: errors, empty pages, sideways scrolling | **364 pages, 0 problems** at 375, 768 and 1440 px (1024 px checked in P2) |
| Accessibility (axe) in Dark and Daylight, 28 screens | **0 serious or critical** |
| Plain-language check: the visible text of 213 screens against a jargon list (new in P3) | **passed** |
| Copy rules (banned and retired words) | **passed** |

**Money and safeguarding results.** An adversarial verifier confirmed every figure above. It also found 14 defects and
several smaller gaps, all fixed, each with a test:
- updates attached to someone else's record (a child's full name could reach an unrelated funder);
- withdrawn progress consent had no effect;
- money moved on existing funding before approval;
- disputed funding still counted;
- carried-in money could be "confirmed as received";
- the approver could record the payment;
- requests could be published in another organisation's name;
- unverified funders could send offers;
- decided applications could be reopened;
- the awards cap could be passed;
- reviews accepted any decision;
- duplicate expenses were accepted;
- a reviewer could register as an applicant;
- the claims check was too narrow.

Smaller gaps fixed: staff powers by role and site, and wider Ask Revivo refusals.

What holds:
- spending never exceeds what was paid;
- checking needs a receipt and a different person;
- four-eyes on existing funding, recovery plans and decisions;
- programme funders see counts only;
- no minor's full name on any funder screen;
- photo consent takes effect at once;
- coaches cannot accept, confirm or change consent;
- young athletes are never discoverable.

**Accessibility results.**
- Small text contrast measures 5.9:1 (Dark) and 6.3:1 (Daylight).
- Focus is never hidden behind the phone bars.
- After each screen change, focus moves to the heading; after a failed action, it moves to the error.
- One selected style for every choice (ink with a tick; lime never marks an answer).
- Tap areas are at least 44px for buttons and enlarged for figures and filter removal.
- Tabs wrap instead of scrolling out of sight.
- The phone header fits on one row.

## 4. The seven reviews and what changed

These were AI reviews by independent reviewers who were given goals but no navigation help. **They are not human
usability testing**, which is planned for P5.

| Review | Who | Main changes made |
|---|---|---|
| Functional | Browser journeys and role sweeps | P3 flows added to the browser checks; every role's new screens swept |
| Plain language | Me, then a check on the visible text of 213 screens | Money words, rule messages, menu labels (examples in §5) |
| Usability, people seeking funding | AI first-time user: athlete, parent, coach, programme coach | The date menu warns instead of a hidden pop-up; Join has an email and no answers pre-filled; guardians and coaches see the athlete's name; confirmations after every save; "Consent & safety" in the guardian menu; the update-due item clears once sent; "Something else" as a reason; the note sits above "It ran" |
| Usability, funders and organisations | AI first-time user: sponsor, finance, programme officer, director | Pending existing funding no longer counted; "Send decisions" asks for confirmation; the offer form warns above your limit; plain approval wording; ask a question about an expense; the review form starts empty and folds away |
| Workflow efficiency | Counts from both usability reviews | See §6 |
| Visual design and accessibility | AI designer and accessibility reviewer | §3 accessibility changes; less lime (start screen, filters, decisions); the funder list comes before the fund bars; empty funds on one line; "still available" visible at 3:1; one proof button, not three |
| Financial and safeguarding | AI adversarial verifier | §3 |

## 5. Wording: before and after (examples)

| Before | After |
|---|---|
| Released $2,250 | Paid $2,250 (athlete sees "Paid to you"; a guardian sees "Paid to Tiago") |
| Record release (simulated) | Record a payment |
| Spent · verified / Awaiting verification / Unspent / Still to come | Spent and checked / Spent, waiting to be checked / Paid, not yet spent / Still to pay |
| $3,200 pledged of $5,200 | $3,200 promised of $5,200 |
| Held for offers / Announced | Set aside for offers / Total fund |
| $200,000 announced | $200,000 in total |
| Eligibility | Do I qualify? |
| Recommend a tier | Recommend an award level |
| Discoverable · Shared on application · Private | Funders in Discover · Only funders I apply to · Only me |
| Accepts support asks | Accepts direct requests |
| Committed · all funds / Released · all funds | How much have we committed? / How much have we paid? |
| A panel decides; two people sign off | Two reviewers recommend; a different person approves; finance pays |
| Released cannot exceed what was committed (I2). | You can't pay more than was committed. |
| There is no recorded payment to confirm (I9). | There is no payment to confirm yet. |
| Release to the guardian (admin) | Check passed: send to the guardian |
| My Athletes (guardian menu, a consent page) | Consent & safety |
| Agreed, paid and still to come, in plain words. | What you've been given, what's still to come, and any update your funders need. |

## 6. Simpler workflows (actions counted)

| Task | Actions now | How it was simplified |
|---|---|---|
| Add spending (athlete) | Home → "Send an update" → 2 fields, date already filled, receipt photo → Add (5) | The agreement is chosen for you; one short form; nothing asks for categories or codes |
| Confirm money arrived | 1 tap on Home or on the record | The button carries the exact amount |
| Record a session (coach) | Count → "It ran" (2), or "Couldn't run" → reason (2) | Under a minute on a phone |
| Record a payment (finance) | Open from "Needs you" → Record payment (2) | The amount is pre-filled to the instalment |
| Check spending | "Needs you" → "Receipt matches: check" per line | No separate screen; a question if something is unclear |
| Quarterly report | Draft from records → add your own words → Send (3) | Drafted from the records; the claims check runs as you type |
| Existing funding | 2 choices and 4 figures → send; approve (1); confirm (1) | No new application |
| Individual decision | Choose → message pre-written and editable → Send (2) | Respectful wording ready, never automatic |
| Register (athlete) | Route → 7 fields → Continue → code shown → Create | Profile facts are added afterwards, one at a time |

## 7. Removed or reduced

- **"What changed" panel:** it appeared after every action outside the guided demonstration and covered content. It
  now shows only in guided mode.
- **"See source" links with nothing behind them:** they are now plain text. Real links open the records.
- **Payment buttons on the funder list:** the payment is now recorded on the record itself, in context.
- **On phones:**
  - the tall seven-step line on My Funding and the record is now a one-line summary, with "Show all steps";
  - the fictional-data banner scrolls away instead of sticking;
  - the header fits on one row;
  - the motion toggle moved to the date menu.
- **Two status chips on one request** merged into one. The lime "Recommended" badge and the lime borders on the start
  screen and filter chips are gone.
- **The browser confirmation pop-up** on date changes is now a warning inside the date menu.
- **Things that didn't exist or were wrong:** the "Save a search" promise (no such feature), the "6 athletes" coach
  title, Amira's pre-filled answers in Join, and "(Verify)" in fact labels.
- **The "Built in P3" placeholder steps** are gone: every journey step is real.

## 8. Remaining limitations

- **Not human-tested yet:** the AI reviews do not replace the P5 sessions with three first-time viewers.
- **Payment schedules:** instalments are shown as amounts (half now, half later), not as a schedule of due dates. A
  "payments due" list for finance belongs in P4.
- **Receipts and proof are simulated:** there is no file to open. The check is a person's confirmation that the
  receipt matches.
- **Ask Revivo and the claims check are fixed and rule-based:**
  - set answers and word lists, not real AI;
  - the claims check compares session figures with the records, but not money figures written in a report.
- **One programme in detail:** Play Every Day. The other programme grants and earlier rounds are summarised in one line
  each.
- **Existing funding:** the approver can approve but not return it with a reason; the recipient can dispute.
- **Seeded starting points:** on a fresh 6 May or 30 June, some roles have nothing to do until another person acts (as
  in the story). `?story=complete` shows the end state.
- **Results have no date field;** they take the demonstration date.
- **Images:** still labelled placeholders until you supply them.
- **Printed report:** the cover image comes in P4.

## 9. Image requirements

**No new images are needed.** The P3 screens are working screens, deliberately without photographs. The set stays at
19 images. Three placements change (`docs/10`, "P3 update"):
- im-08 moves off the Programme screen;
- im-14 moves off the sponsorship record;
- im-17 is used only for the printed report cover.

## 10. Estimate

P3 is complete with its reviews. The estimate for what remains stands: **P4: 3–5 build-days** (finance due-dates list,
Ask Revivo polish, printing and export, images, motion polish). **P5: 3 days** (human sessions, full QA, presenter
guide).
