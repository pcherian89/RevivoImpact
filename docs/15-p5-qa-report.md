# 15 · P5 quality report: the finished prototype

**Status (26 Nov 2026): P5 complete, plus the final end-to-end clarity review (§11–§13). Ready for the founder's
approval gate (`06` §8).** The final build is
`prototype/revivo-impact-final.html`. The presenter guide is `14-presenter-guide.md`. Screenshots are in
`docs/p5-previews/`.

**How it was checked, honestly stated:**
- **Automated tests** ran on the final build. They all pass (§3).
- **Independent AI reviewers** acted as first-time users and as specialist reviewers. They are AI, not people.
- **No human testing has been done.** An optional plan for short sessions with real first-time users is in §9.

Everything runs on fictional data. No real money, logins, AI, storage or messages are involved.

## 1. What P5 completed

### 1.1 The P4 limitations, closed

| P4 limitation | What P5 did |
|---|---|
| A payment had no date or reference | Finance enters the **date paid** (today by default, never in the future, never before the agreement was accepted) and an optional **reference**. A blank reference is generated. Duplicate references are refused, whatever the capital letters. The date shows in the payment's sources. |
| Most of the 143 applications were rows with no content | **11 applications open in full** (Amira plus 10 representative ones across sports, ages and outcomes), each with a statement, documents and other funding. The other 132 are clearly labelled summaries with real scores and statuses. |
| The guide covered the page on tablets | Below 1024px the guide is a sheet at the bottom that **shrinks to one line** when a screen opens, sits above the phone menu, and leaves room so the page can always scroll clear of it. From 1024px it is a column beside the page. |
| The claims check had not been tested against wrong figures | Tested against wrong amounts, changed records, true sentences, inflated counts and overclaiming words (§4.3). It never says that a number found in the records proves the whole sentence. |

### 1.2 Improvements from the reviews (about 70 findings, from five independent AI reviewers)

**Money and decisions**
- Amounts accept **whole dollars only**. "12.50", "-5" or "abc" are refused with "Whole dollars only, for example 1200",
  never silently changed.
- **Nobody is turned down while their application is still being reviewed.** "Send decisions" waits until every
  application is scored, and says why.
- Selection lists shortlisted people first; its counts reconcile.
- Sponsor and funder totals keep **commercial money apart** on every screen.
- Recording many payments at once asks for the date and shows the total before "Yes, record them".
- The payment form only appears when a payment is due. Otherwise it says what the next payment waits for. The amount
  stays empty while the last review did not say "Continue".

**Recovering from mistakes** (new)
- Cancel an ask that has not been answered.
- Withdraw a funding request while nobody has offered on it.
- Remove spending added by mistake, until it is checked.
- A coach corrects a session's attendance, with a reason kept in the record.
- A guardian confirms before blocking a funder, and can unblock; a guardian can remove a coach's access.

**Safeguarding**
- A blocked funder is **never told** it was blocked: it sees the same "no longer in Discover" note as for any request
  that left Discover. The guardian is told the open offer lapsed.
- A commercial sponsor is told the real reason it cannot see a young athlete's request.
- Coaches see coach wording ("waiting for Tiago's guardian"), never guardian wording.

**Two-way discovery**
- Funders see **interest they sent** and get "Jonah shared more with you" in Needs you.
- Offers waiting for others are shown on the funder Overview, with the money set aside.
- The "National level" filter no longer counts regional athletes; fact counts agree between list and profile.
- Sponsor reasons are plain ("supports para sport (includes wheelchair racing)").
- Organisations see grants for organisations first, including the ones opening soon.

**Plain language and the guide**
- Jargon removed from the guide ("rubric", "tier", "Institutional policy", "cap", "identifiability", "carried in",
  "pledged", "line items").
- "Load the story to this step" became **"Move to 6 May and continue"** with "Earlier steps are filled in for you."
- Every journey ends with **What you just saw**, then **Start again** and **Back to the start page**.
- Build notes removed from working screens ("P1 shell", "Demo date … lists follow the date").
- An address that is not a screen shows a plain "This page isn't here" with the way home.

**Accessibility**
- Keyboard focus stays inside panels while they are open.
- Filters, chips and links have 44px touch targets; the phone top bar uses a labelled "Demo" menu.
- Tab counts are read as "Athletes, 70", not "Athletes70".

## 2. The seven quality reviews (`06` §6.1)

| Review | How | Result |
|---|---|---|
| **Functional** | Automated: unit tests of the rules and the reconciled figures; every journey clicked end to end; every guided step; every role's pages | All pass (§3) |
| **Plain language** | AI reviewer (language and guide) + the automated plain-language check over 213 screens | Jargon in the guide removed; check passes |
| **Usability (first-time users)** | Two AI reviewers acting as untrained first-time users across 13 roles: Amira, Nadia, Jonah, Rosa, Jonas, Morag, Maya, Sam, Ingrid, Daniel, Priya, Kenji, Lucy, Marcus, Alex | Findings fixed or listed in §7 |
| **Workflow efficiency** | Part of the two first-time-user reviews (steps, dead ends, repeated entry) | Dead ends and missing undo fixed |
| **Visual design** | AI reviewer (creative direction and product design), 12 screens × 4 widths × 2 themes, plus the photo audit (§5) | Fixed or listed in §7 |
| **Accessibility** | axe-core on every role's main screens in both themes + keyboard and panel tests | 0 serious or critical issues |
| **Financial and safeguarding** | AI reviewer (finance and safeguarding) + the invariant tests | Fixed; invariants hold |

All AI reviewers are labelled as AI in their reports. None of this counts as human testing.

## 3. Automated test results (final build)

| Check | Result |
|---|---|
| Type check | Passes |
| Unit tests (rules, invariants I1–I13, reconciliation, access, payments, claims check, recovering from mistakes) | **69 of 69 pass** |
| Copy check (banned words and retired phrases) | Passes |
| Single-file offline build | Passes (`dist/index.html`, about 3.9 MB with every photo inside) |
| Journeys A–E clicked end to end | **84 of 84 checks pass** |
| Every guided step through the guide | **35 of 35 pass** |
| Every role's pages at 1440px (no errors, no empty screens, no broken links) | **364 pages, 0 problems** |
| Accessibility (axe-core) | **0 serious or critical issues** |
| Plain-language check | **213 screens pass** |

A failing test would block reporting this milestone as tested. None failed in the final run.

## 4. Financial and safeguarding results

### 4.1 Money that must add up (all verified by tests and by the reviewer)
- Amira's $4,500 agrees everywhere: her funding page, the funder record, the fund bar, Funding, the funder report and
  Ask Revivo.
- The scholarship fund reconciles: $211,000 agreed + $3,500 set aside + $35,500 available = $250,000.
- The funder report reconciles by fund and by sport.
- A promise is never shown as paid; reported spending is never shown as checked; commercial and in-kind amounts never
  enter development or programme totals.

### 4.2 Controls that hold
- No double funding: a pending application holds its money; offers are capped at what is still needed.
- Four-eyes: nobody approves their own draft, recommendation, recovery plan, expense or report. Under the
  Institutional policy, the approver does not record the payment.
- Payments cannot run ahead of the schedule, its conditions, today's date, or the amount due.

### 4.3 The claims check
It flags: amounts that don't match the records (with the money word nearest the amount), "all sessions" or session
counts above what ran, participant counts above the register, and overclaiming words (improve, transform, boost,
increase, double, percent). A true sentence such as "We received $12,000 and spent $9,768, all checked" passes. When
nothing is found it says: "It can't tell whether every sentence is true, so read it through before you send."

### 4.4 Young athletes
- Never searchable or identifiable; funders see an anonymised card only after the identifiability check.
- Every offer, question and confirmation goes to the guardian. A coach can never accept, publish or change consent.
- No commercial sponsorship of under-18s.
- Block, report and consent withdrawal take effect at once.

## 5. Visual and image checks

- **Photographs:** 15 of the founder's photos plus two approved reuses, all clear, full colour, rounded corners, with
  no text over any photo (headers are two columns: words left, photo right). Checked automatically on 83 screens at
  375, 768, 1024 and 1440px: no text overlaps a photo, no photo is faded or see-through, no empty image slot.
- **No horizontal scrolling** at any of the four widths.
- **Headings:** consistent sizes at every width (one landing size, one screen size).
- **Dark and Daylight** both checked; printing uses Daylight.
- One small remaining note: the session marks on the programme chart use a 9px symbol inside a labelled chart with a
  text key; it carries no meaning on its own.

## 6. Responsive and offline checks

- One HTML file, about 3.9 MB, opens offline in any modern browser with every photo included.
- No broken links: every role's pages open (364 checked); unknown addresses show a plain not-found page.
- Phones (375px): bottom menu, guide as a one-line sheet, the "Demo" menu holds the guide, roles, date and reset.
- Tablets (768px, 1024px) and laptops (1440px): checked in the screenshots and the audit.
- Reduced motion keeps everything working.

## 7. Unresolved issues (known, minor)

| Issue | Why it remains |
|---|---|
| On a fresh 30 June there is no receipt waiting to be checked until spending is added (by the guide or a person) | The story adds spending as a guided step; seeding a second copy would break the reconciled figures |
| Content widths differ slightly between some screens on very wide screens | Cosmetic |
| 132 of 143 scholarship applications are summaries | Representative records cover every outcome; the rest keep real scores and statuses |
| A funding request can be withdrawn but not edited once published | Withdraw and publish again; editing is a production feature |
| Form errors appear one at a time under the button, not as a summary at each field | Each message names the field and the fix; a full error summary is a production feature |
| On Discover, the header photo pushes the first result below the fold on phones | Kept for family consistency with the website and Pathway; the list follows directly |

## 8. Future production recommendations (separate from the prototype)

These are **not** in the prototype and are not promised. They are what a real product would need:
1. Real accounts and sign-in, with organisation verification by people.
2. Identity and safeguarding checks by qualified providers; enhanced checks for individual sponsors.
3. A payment provider or bank integration for finance teams, with reconciliation.
4. Secure document upload and storage for receipts and evidence.
5. A real database with backups, access logs and data-retention rules.
6. Email and text notifications that never name a child.
7. A real AI service with the same limits, refusals and source links as the simulated one, evaluated before use.
8. Legal and data-protection review in each country of use (the prototype makes no compliance claims).
9. Human usability testing (§9) before any build decision.

## 9. Optional human usability testing plan

**Goal:** find out whether real first-time users understand each screen without help.

- **Who:** 5 to 8 people, none of whom have seen the prototype. Mix: 2 athletes or parents, 1 coach or club secretary,
  2 people from foundations or company community teams, 1 finance person.
- **How:** 30 minutes each, one at a time, on their own phone or laptop, opening the offline file. A facilitator
  watches and takes notes; nobody explains the screens.
- **Tasks (pick 3 to 4 per person, by role):**
  1. "Find a scholarship you could apply for, and tell me why you qualify."
  2. "Apply for it." (athlete) / "Prepare an application for your athlete." (coach)
  3. "A sponsor has offered support. Decide what to do." (guardian)
  4. "Find an athlete your company could support." (sponsor)
  5. "Record a payment that is due." (finance)
  6. "Is the programme you fund on track? Why or why not?" (foundation)
  7. "Change your mind: cancel the ask you just sent."
- **Measure:** completed without help (yes / with a hint / no), time taken, wrong turns, words they did not understand,
  and one sentence: "What is this product for?"
- **Afterwards:** list each problem with how many people met it; fix anything that two or more people met.
- **Safety:** fictional data only; no recordings of faces without consent; no children as participants.

## 10. Deliverables

| | File |
|---|---|
| A. Final prototype | `prototype/revivo-impact-final.html` (also in the project files, `impact-p5/`) |
| B. Presenter guide | `docs/14-presenter-guide.md` |
| C. This QA report | `docs/15-p5-qa-report.md` |
| D. Screenshots | `docs/p5-previews/`: every key screen at 375, 768 and 1440px in Dark, and 10 key screens at 375 and 1440px in Daylight (taken before the clarity review). Before and after the clarity review: `docs/clarity-previews/` |
| F. Clarity review matrices (internal) | `docs/16-clarity-review-screens.md` (102 screen rows) and `docs/17-clarity-review-journeys.md` (39 guided steps) |
| E. Updated documents | `README.md`, `CLAUDE.md`, `docs/00-START-HERE.md` |

## 11. Final end-to-end clarity review (26 Nov 2026)

**How it was done, honestly stated.** Seven independent **AI reviewers** (not people) opened the rendered prototype
with no documentation, as untrained first-time users and as specialists: UX research, UX writing, product design,
HCI, sports funding and scholarships, sponsorship, athlete, coach and organisation experience, foundation and
corporate funders, financial reporting, creative direction, accessibility, demonstration storytelling, software QA,
and child safeguarding and privacy. They covered every role, every main screen at three dates, and every step of
journeys A–E. After the changes, four more AI reviewers checked the changed build as first-time users. **No human
testing has been done.** The full matrices are internal documents (`16`, `17`) and are never shown in the prototype.

### 11.1 What changed, with before and after

| Area | Before | After |
|---|---|---|
| Who am I looking at? | "Viewing as Amira · Change" in the header; on phones just a name | A line under the menu on every screen and width: "Viewing as Ingrid Solberg · Funding approver · Tallwater Sports Foundation"; coaches and guardians also see "acting for Tiago (16)". Role titles are plain jobs taken from the records ("Finance officer", "Parent and guardian of Tiago (16) and Inês (13)") |
| Page headings | "What needs you, Ingrid?", "Hello Amira. Here's what needs you." | "Funding overview", "Your sports funding", "Tiago's sports funding", "Highland Cycling Club: funding"; sections "Needs your action (1)"; larger section headings |
| Task wording | "Daniel's draft is waiting for approval · you did not prepare it, so you can publish it" | "Approve and publish a new sports scholarship · Daniel Osei (programme officer) prepared it. Check it before it opens for applications." → "Review scholarship" |
| Money tasks | "12 payments due now" / "47 recommendations are ready for decision" | "12 payments are due · $19,000" → "Record the 12 payments"; "Decide the scholarship offers · 47 shortlisted · $250,000 budget" |
| Selection | "Budget meter"; a warning in amber; no button while reviews were open; "Not this time" on rows still in review | "How much is left to offer?" showing only real money; "Send decisions" shown disabled with the reason in plain text; rows still in review can't be turned down |
| Funding Line | Stage figures did not open their sources | Agreed, Paid, Spent and Checked open their records; the next step is shown correctly (spending until paid money is accounted for; agreed tasks for sponsorship) |
| Sponsorship | "How is the money for Jonah Reyes being used?"; "deliverables" | "Is Jonah Reyes delivering what we agreed?"; "agreed tasks" everywhere |
| Discover on a phone | The header photo pushed the first result below the fold | Results first, the same approved photo after them; sponsor reasons corrected; brands no longer hidden by a default filter |
| Guided journeys | Tabs "A B C D E"; "You are now: …"; "I'll do it" often not marked done; D2 dead end; "August 2027" refused | Tabs "A · Scholarship … E · Young athletes"; each step names whose screen it opens and who takes part; a step is done when its outcome exists however it was done; Show me lands on the screen that proves it; "Next: journey B" loads B's start; the phone has a guide button when the guide is closed |
| Mistakes and safety | One-tap withdraw; reset and date change without asking | Withdraw asks first and keeps "Withdrawn by you"; asks show "Cancelled (request withdrawn)"; reset and date changes ask first |

### 11.2 Safeguarding and control fixes found by the reviews

- A coach without the family's authorisation now gets a plain refusal before any application form opens (the rule
  engine already refused to save it).
- "Help me write this" never replaces what a guardian typed; each child gets a fresh request form.
- Young athletes are **never named in links or record ids** that funders open (Tiago's request, offer, application
  and agreement use a neutral reference). A unit test checks every id.
- A guardian reads a coach's draft in full (statement and what will be shared) before submitting it; there is no
  one-tap submit from the list.
- A request that could identify a child (too few athletes share the card) is explained before the form, with what
  to do instead; a name or club typed into the card is flagged as it is typed.
- The safeguarding reviewer can now **stop** an individual sponsor's offer to a minor, with a reason kept in the record.
- A company's committed total no longer lists donated kits in its source (in-kind stays apart from cash).
- A sponsor whose only agreement is commercial sees its sponsorship totals, labelled as kept apart.
- A submitted application opens read-only; a wrong email code at sign-up is refused.

## 12. Final verification (26 Nov 2026, changed build)

| Check | Result |
|---|---|
| Type check, copy check, single-file offline build (about 3.9 MB) | Pass |
| Unit tests (rules, invariants, reconciliation, access, safeguarding, new tests for withdrawn requests, coach authorisation, the month rule and child-free ids) | **73 of 73 pass** |
| Journeys clicked end to end (including the new date-change confirmation) | **85 of 85 pass** |
| Every guided step | **35 of 35 pass** |
| Every role's pages at 1440px | **364 pages, 0 problems** |
| Accessibility (axe-core, both themes) | **0 serious or critical issues** |
| Plain-language check | **213 screens pass** |
| Photo and layout audit at 375, 768, 1024 and 1440px | **88 screens, 0 issues** (no overlap, no faded photo, no horizontal scroll) |
| Reconciliation | $211,000 agreed + $3,500 set aside + $35,500 available = $250,000; Amira's $4,500 agrees everywhere |
| Final AI first-time-user review | 4 AI reviewers; 2 blockers and the main majors fixed (§11.2); the rest are listed in §13 |

The approved photographs are unchanged. All five journeys, both themes and offline use still work.

## 13. Remaining limitations after the clarity review

Accepted limitations from the brief still apply (11 detailed applications; simulated sign-in, verification,
payments, documents and AI; browser storage; a request is withdrawn and published again, not edited). Also known:

| Issue | Why it remains |
|---|---|
| After "Next step", the page still shows the previous person until Show me, I'll do it or See the screen is pressed | The step card now says "Opens the screen of …", so it no longer contradicts the page; switching automatically would move the page under a presenter |
| "What changed" is missing after some multi-person steps | Each step still says Done and Show me lands on the screen that proves it |
| "I'll do it" for steps where several people act needs Change person for each | The card says so; Show me does it in one go |
| Look-only steps are not marked done | They have nothing to record |
| Sending one decision at a time on a phone moves the row out of view | The decision appears in the list below; the bulk "Send decisions" is the main path |
| After one spending line the athlete lands on the funding record, not back in the update | The record shows what was added and what is still due |
| "Help me organise this" also suggests the other-funding line | The applicant can edit it before sending; the reviewer is told AI helped |
| Some fund-card figures (Total fund, Still available) don't open sources | The same figures open their sources on the fund's Funding page rows |
| An over-limit offer at Oriel waits for a second approver who is not a demo persona | Only reached by offering more than $2,000; the offer can be withdrawn |
| Dates in request lists use mixed formats ("September 2027", "Thu 15 Jul") | Cosmetic |
| On 30 June there is no receipt waiting to be checked until the guide adds spending | Seeding a second copy would break the reconciled figures; the funder's empty state now names the updates due that day |
