# Revivo Impact: prototype design and scope brief (DRAFT)

From the prototype design board, 24 Nov 2026: product designer (field software), sport-for-development programme director, finance/grants officer, M&E specialist, multi-school coach, and Revivo's creative director. "Revivo Impact" is a working name. The website does not change; the strategy defers that.

**The test:** a funder or programme director understands it in 10 minutes, unaided. When in doubt, this brief chooses fewer screens, fewer people and one story.

## 1. Promise and home screen

**Promise:** *Revivo Impact connects what a sports programme promised, what was delivered, what was spent and what the evidence shows, so problems surface within weeks and every reported number traces back to its records.*

The programme home answers four questions, top to bottom:

1. **What is happening?** Sessions delivered this week.
2. **What is going wrong?** Which sites are behind, with the recorded reason.
3. **What needs me?** At most three items: approvals and open actions.
4. **Are we on track?** The Commitment-to-Evidence Chain.

Two taglines from the strategy must not be used. "Deliver sport. Demonstrate impact." contradicts the honesty line. "AI built for the pulse of sport" is retired on the website.

## 2. The 10-minute journey

Reuse Pathway's shell. Visitors choose "Guided journey" or "Explore by role", and every step offers **Show me** and **I'll do it**.

The **demo clock** has two moments only: **Week 5 (Tue 6 May)** and **Quarter end (Mon 30 Jun)**. Reset returns to Week 5.

There are **six fictional people**:

| Person | Role | Device |
|---|---|---|
| **Maya Torres** | Programme director, Horizon Sports Foundation. She is also the report approver (merged role) | laptop |
| **Sam Rivera** | Coach at Greenpark School and Westbrook Centre | phone |
| **Lena Novak** | Greenpark site coordinator | laptop/tablet |
| **Priya Nair** | Finance officer | laptop |
| **Dr Hannah Kim** | Evaluation lead. She prepares the report; Maya approves it, so four-eyes holds | laptop |
| **Daniel Osei** | Programme officer at Brightwater Fund, the funder | laptop/tablet |

An unnamed **parent** on a phone provides the consent moment.

The chain's light advances as the story does:

| # | Clock | Who | What happens | Chain |
|---|---|---|---|---|
| 1 | Wk 5 | Maya | **Commitments**: funding agreement → 120 sessions/quarter, 6 sites, 460 places, budget, three expected results. | Commitment |
| 2 | Wk 5 | Sam | Runs the Westbrook session on his phone: tap attendance, record a 20-second voice note, confirm the AI summary (AI #1), take consented photos, submit. Then marks Greenpark "Couldn't run: coach availability". | Delivery |
| 3 | Wk 5 | Maya | Rule-based **early warning**: "Greenpark has missed 2 sessions in a row". She asks *"Why is Greenpark behind?"* (AI #2) and assigns an action to Lena. | Exceptions |
| 4 | Wk 5 | Lena → Maya | Lena submits a recovery plan: relief coach Jo Adebayo from week 8, plus 4 make-up sessions in Q3. Maya approves (**four-eyes #1**). The guide moves to quarter end. | Exceptions: plan approved |
| 5 | Q end | Priya → Maya | Priya records an equipment purchase with its receipt. Maya approves (**four-eyes #2**). One transport claim lacks a receipt (amber), so spend is 96% documented. | Spend |
| 6 | Q end | Parent | On the phone consent page, the parent switches "Photos in reports" to No. Heartbeat: "Your choice is recorded". | — |
| 7 | Q end | Hannah | Evidence screen shows: "3 photos removed: consent withdrawn 18 Jun" (no name), 104 verified, 4 awaiting, and the survey with its limitations. | Evidence |
| 8 | Q end | Hannah | **Draft funder report** from verified records (AI #3). The rule-based **claims check** flags "the programme improved confidence"; she rewords it and submits. | Statement (draft) |
| 9 | Q end | Maya | **Reviews and approves** (**four-eyes #3**). Approval of her own work is blocked. Heartbeat. | Statement (reviewed) |
| 10 | Q end | Daniel | **Funder view**. He clicks **108**, then Greenpark, then its sessions, then one record. He clicks **96%**, then the expense lines. He records "Continue with conditions: Greenpark check at Q3 week 4". The audit trail shows every step. | Complete |

The finish screen reads "What you just saw: five links, three approvals, one consent change", with **Reset** and **Explore by role**.

## 3. Screens: 13 screens plus 2 shared panels

| # | Screen | Who · device | One job |
|---|---|---|---|
| 0 | Start | all · any | Choose the guided journey or a role (cinematic: im-01/02) |
| 1 | Programme home | Maya · laptop | Answer the four questions |
| 2 | Commitments | Maya · laptop | What was promised, by site, budget line and expected result |
| 3 | Coach: Today | Sam · phone | Today's sessions across his schools: "Start" or "Couldn't run" |
| 4 | Session register | Sam · phone | Attendance, voice note, consented photos, submit; under a minute |
| 5 | Site detail | Lena, Maya · laptop/tablet | Session strip, exceptions, actions, recovery plan |
| 6 | Approvals | Maya · laptop | One four-eyes queue: schedule, expense, report |
| 7 | Budget and spend | Priya · laptop | Budget lines against spend, documented share, add-expense sheet |
| 8 | Consent | parent · phone | A Yes/No choice for each purpose; change or withdraw |
| 9 | Evidence and outcomes | Hannah · laptop | Verification, survey, consented photos and quotes, limitations |
| 10 | Report builder | Hannah, Maya · laptop | Draft, claims check, submit; also the review mode |
| 11 | Funder view | Daniel · laptop/tablet | Chain, drill-downs, decision |
| 12 | Audit trail | Maya, Daniel · laptop | Who did what, when and why |
| P1 | Source records | managers, funder · panel | The drill-down from any number |
| P2 | Ask about this programme | Maya, Lena, Hannah · panel | AI #2 |

**Cut or folded in:**

- Portfolio: there is only one programme.
- Participant profile.
- Site comparison, exceptions and corrective actions: these go into Site detail.
- Financial review: goes into Approvals.
- Indicators: go into Evidence.

## 4. The signature: Commitment-to-Evidence Chain

**Drawing.** The chain is one straight signal track with five nodes:

**Commitment → Delivery → Spend → Exceptions → Statement**

It runs horizontally from 768px and vertically on phones. Use Pathway's rail geometry from `signal.ts`: 1.75px stroke, one 18px radius and `orthogonal()` connectors.

- **Passed nodes** are MID_LIME.
- **The current node** is lime with signal-core rings.
- **Future nodes** have a control-colour outline.
- **A light** (120px dash) runs from Commitment and **stops at the current node**. It plays on arrival and on each change.
- **Exceptions branch**: one right-angled branch drops from it to "Recovery plan approved".
- **Under each node**: a stat and one honest qualifier, set as text columns (not cards).

| Node | Stat | Qualifier |
|---|---|---|
| Commitment | 120 sessions · 6 sites · 460 places | From the funding agreement, approved 2 Apr |
| Delivery | **108 of 120** | Bar: 104 verified · 4 awaiting verification · 12 not delivered. "Delivered = recorded by coach; verified = checked by site coordinator." |
| Spend | **$10,800 of $12,000** (90%) | 96% documented (receipt or invoice attached) |
| Exceptions | **12 not delivered** | 8 weather · 4 coach availability · recovery plan approved |
| Statement | Reviewed | Prepared by H. Kim · approved by M. Torres · 30 Jun |

This line is always visible beneath the chain: **"Delivery records show activity, not impact. Outcomes need a proper evaluation."**

**Colours for states:**

- **Verified**: ink.
- **Awaiting**: steel, hatched.
- **Not delivered**: subtle outline plus the reason in words.
- **Amber**: only where a person must act, such as a missing receipt, or an exception with no reason or plan.
- **Lime**: never means "good".

**Session strip** (the second motif). Each site is drawn as a track of 20 ticks:

- delivered: filled;
- verified: filled with a dot;
- missed: a gap with a reason glyph and a word.

It is a timeline, not an ECG.

**Traceable numbers.** Every reported number is a button, marked with a dotted underline and a small arrow, with the accessible name "See source". It opens P1 with a breadcrumb:

- **Delivery**: Programme → Site (6 rows) → Sessions (date, status, recorded by, verified by, attendance count, reason) → Session record (time, device, coach summary, consented photos where the role allows).
- **Spend**: Budget line → Expense → Document.

The funder sees counts only. Where names would appear, a dashed placeholder reads "Participant details are not shared with funders".

## 5. AI: exactly three simulated moments

Each moment carries a steel chip: **"AI-assisted · simulated in this prototype"**. A person confirms, edits or discards the output.

Counts, percentages, statuses, alerts and the claims check are **rules**, labelled "Calculated" or "Rule". AI never produces a number and never approves anything.

1. **Voice note summary** (Sam). The output is a two-line summary with "Confirm / Edit". The original note stays attached.
2. **Ask about this programme** (P2). It offers four suggested questions and no free text. Every sentence links to its source.

   | Question | Answer |
   |---|---|
   | Why is Greenpark behind? | Cites the dated weather and coach-availability records and the open actions. Adds: "The records do not say why the clash happened; ask Lena." |
   | What should I discuss with Lena? | Three draft questions. |
   | Which sites need support? | Not specified yet. |
   | Did the programme improve confidence? | **Refuses**: "Records cannot show cause. 212 of 460 answered both surveys; this is self-reported change with no comparison group." |

3. **Draft funder report** (Hannah).
   - Uses verified records only.
   - Every figure is a linked chip.
   - Exclusions are listed.
   - A limitations paragraph is always included.
   - Quotes appear only where consent was given.

## 6. Fictional data

**Horizon Sports Foundation**, programme **"Play Every Day"**:

- 12 months; demo period Q2 (Apr–Jun);
- 460 participants;
- 12 coaches, 4 of whom work across two sites;
- 120 Tue/Thu sessions per quarter.

| Site | Delivered /20 | Participants | Not delivered | Status |
|---|---|---|---|---|
| Riverside School | 20 | 90 | — | On track |
| Hillview Academy | 18 | 80 | 2 weather | Needs attention |
| Eastfield Centre | 20 | 70 | — | On track |
| Greenpark School | 14 | 75 | 2 weather, 4 coach availability | Behind |
| Westbrook Centre | 17 | 70 | 3 weather | Needs attention · 2 awaiting verification |
| Northgate School | 19 | 75 | 1 weather | On track · 2 awaiting verification |
| **Total** | **108/120** | **460** | **12: 8 weather, 4 coach** | 104 verified, 4 awaiting |

**Rules:**

- **Status**: ≥95% on track; 85–94% needs attention; under 85% behind. Shown as an icon plus a word.
- **Alert**: two consecutive missed sessions at one site.

**Greenpark timeline:**

- Missed 1 May (weather) and 6 May (coach), which raises the alert.
- Recovery plan approved 7 May.
- Three more coach misses and one weather miss before the relief coach starts in week 8.
- Four make-up sessions in Q3.

**Survey:** self-reported; 212 completed both rounds. "I feel confident trying new activities" rose from 58% to 71% (no comparison group).

**Currency: recommendation.** The product is global and is linked from the global site, so it **defaults to USD**. A **Programme currency** switch in Demo controls offers USD, GBP and INR. Each option is its own set of round amounts for the same fictional programme. It is **not an exchange-rate conversion**, and the switch says so. All percentages and drill-downs are identical across the three. INR uses lakh grouping and matches the owner's figures, for Indian presentations.

| Quarter line | INR budget → spent | USD (÷20) | GBP (÷24) |
|---|---|---|---|
| Coaching (₹1,200 / $60 / £50 × 108 sessions) | 1,44,000 → 1,29,600 | 7,200 → 6,480 | 6,000 → 5,400 |
| Equipment (incl. demo purchase ₹12,000 / $600 / £500) | 36,000 → 36,000 | 1,800 → 1,800 | 1,500 → 1,500 |
| Venue and transport | 36,000 → 30,000 | 1,800 → 1,500 | 1,500 → 1,250 |
| Monitoring and evaluation | 24,000 → 20,400 | 1,200 → 1,020 | 1,000 → 850 |
| **Quarter** | **2,40,000 → 2,16,000** | **12,000 → 10,800** | **10,000 → 9,000** |
| Year budget · undocumented (4%) | 12,00,000 · 8,640 | 60,000 · 432 | 50,000 · 360 |

Coaching spend is calculated from delivered sessions, so the link between spend and delivery is visible.

## 7. Pathway reuse and what must differ

**Reuse:**

- **The shell**: "Viewing as … · Change" pill, fictional-data banner, account menu, guided journey, Show me / I'll do it, Explore by role, demo clock, Reset, Daylight theme, print.
- **The design system**: tokens, type, buttons, status chips (icon plus word), DomainPanel-style panels, heartbeat, loading light, photo grade.
- **Consent and approval**: the per-purpose consent component (equal Yes/No, nothing pre-selected, "Change or withdraw" always visible) and four-eyes (no self-approval, reason on return).
- **The audit table.**
- **The build**: one self-contained React + Tailwind HTML file, with seeded deterministic data.

**Make it distinct.** Pathway is *one child's journey*; Impact is *one programme's accountability*.

- The chain replaces the stage rail.
- Session strips and traceable numbers are new to Impact.
- Screens are more ledger-like: sources, dates, tables.
- The lockup reads "IMPACT".
- New photographs: multiple sites, weather, a funder visit.
- There are no child-level screens.

## 8. Exclusions and guard-rails

**Out of scope:** accounting, payroll and bank feeds; full grants management; fundraising CRM; portfolios; athlete performance tracking or links to Pathway; offline sync; real logins or messaging.

**Guard-rails:**

- **No claims of impact**: no impact proof, SROI, causal or "transformed lives" claims. The claims check enforces this.
- **Honest numbers**: every chart shows its sample size and limitations.
- **Funder access**: aggregates only. No children's names, no individual attendance, no unconsented photos.
- **No surveillance**: no face recognition, auto-tagging, biometrics or location tracking.
- **Children's photos**: never close up. Withdrawing consent removes them everywhere, immediately.
- **No blame**: absence reasons are categories ("coach availability"), never personal detail.
- **Fictional by design**: no customers, funders or endorsements are implied. "Prototype on fictional data" appears on every screen.

## 9. Images (the owner generates them; dark placeholders until then)

**Master block (paste once):**

> You are making a consistent series of photographic images for Revivo Impact, a calm, trustworthy tool that helps sports foundations run community sport programmes across many schools and centres. Style: cinematic documentary photography, golden hour or dusk, one warm low light source, deep shadows falling to near-black (#0A0A0B), muted natural colour, fine grain, quietly hopeful. Adults (coaches, staff) wear plain black sportswear with one thin lime-green trim line; children wear plain unbranded muted sportswear. Grassroots settings from anywhere in the world, no landmarks. Children are seen from behind, in profile or small in the frame, never in close-up; there are always several people present. Mixed genders, skin tones, body types; include a wheelchair participant where natural. Every person must be fully inside the frame. No text, letters, numbers, bibs, logos, flags or signage. No readable screens or paper. No holograms, overlays, data graphics, robots, glowing lines, neon, lens flares, blue or purple light. No trophies or medals. Size 1672×941 (16:9) unless I say otherwise. Reply "Ready".

1. **`im-01-gateway.png`**: A wide community sports ground at dusk seen from low and far away. Three small groups of children and coaches at cones sit in the left and right thirds and the far background. The upper middle is calm dark sky, the lower middle a dark empty field.
2. **`im-02-gateway-phone.png`** (941×1672, 9:16): The same ground and light, upright. Figures appear only in the top fifth and at the lower edges. The middle 40% is dark, quiet sky and field.
3. **`im-03-programme-home.png`**: An after-school session on a school field at golden hour. A coach holds a closed paper register while a mixed group plays a small-sided game between cones at mid-distance. The left 40% is darker.
4. **`im-04-coach-between-sites.png`**: Seen from behind, a coach carrying a kit bag and a mesh bag of balls walks along a tree-lined path from a school gate towards another sports ground, at golden hour.
5. **`im-05-court-session.png`**: A concrete court beside a school in late afternoon. Children, seen from the side and behind, play a passing drill while two coaches watch.
6. **`im-06-hall-session.png`**: A community centre hall at dusk, with rain on the high windows. A mixed group, including a wheelchair user, runs a bean-bag relay while a coach watches.
7. **`im-07-rained-off.png`**: No people. A waterlogged pitch at dusk in light rain. Stacked cones and a closed kit bag sit under a shelter.
8. **`im-08-funder-visit.png`**: Two adults in plain smart-casual clothes, seen from behind, stand on a touchline at golden hour watching a distant session of children and coaches.

**Placement:**

| Image | Where it goes |
|---|---|
| 01/02 | Start |
| 03 | Home hero |
| 04 | Coach Today band |
| 05/06 | Evidence library, labelled "Illustrative photograph" |
| 07 | Exceptions and empty states |
| 08 | Funder header |

No images go on working tables. Reject any image with lettering, cropped figures, close-up faces or a fake interface.

## 10. Definition of done

- [ ] **Journey**: the 10-step guided journey runs end to end in about 10 minutes, in both Show me and I'll do it. Reset restores Week 5.
- [ ] **Totals reconcile** with the seeded records: 108 = sum of the sites; 104 + 4; 8 + 4; spend lines; 96% documented. A unit test checks all three currencies.
- [ ] **Drill-down**: every reported number opens P1 down to record level. The funder never sees a name, an unconsented photo or individual attendance.
- [ ] **Chain**: horizontal and vertical; the light stops at the current node; built as an `<ol>` with `aria-current`; static under reduced motion.
- [ ] **AI**: exactly three moments, each with the simulated chip and a human confirm step. The refusal answer is included. AI produces no numbers.
- [ ] **Approvals**: three four-eyes approvals. Self-approval is blocked with an explanation, and a reason is required on return.
- [ ] **Consent**: withdrawing photo consent removes 3 photos from the evidence and the draft report, and the removal is audited.
- [ ] **Honesty**: the honesty line, the "self-reported" labels and the claims check are present. No impact, causal, SROI or "proven" claims appear.
- [ ] **Layout and accessibility**: 375 / 768 / 1024 / 1440 with no overflow; keyboard path through the journey; axe clean in Dark and Daylight.
- [ ] **Fictional data**: the banner is on every screen and photos are shown whole. Three outside viewers can explain the chain after one run and never ask "is this real?"
