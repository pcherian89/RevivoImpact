# Revivo Impact — technical plan and phases

How the prototype is built, tested and delivered. What it does: `02` and `03`. How it looks: `04`. Data: `05`.

**Revised in P1 (25 Nov 2026).** The founder confirmed: a complete, interactive, end-to-end **prototype**, not
production software; no real authentication, databases, payment gateways, external integrations or backend
services; exceptional visual quality, simplicity, realistic interactions and responsiveness, as with Revivo Pathway.
P1 status and the clickable shell: `09`.

## 1. Architecture in brief

- **A browser-only prototype.** No backend, no database server, no real sign-in, no network calls at run time.
- **One shared set of records.** Every screen reads one derived state; every action goes through the same domain rules
  (as in Pathway: "every screen reads one shared set of records, and every action goes through the same rules").
- **Event-sourced state.** Derived state = reduce(seed, events). The event log is also the audit trail.
- **Deterministic.** A seeded generator builds the fictional world; the demo clock is an injected date.
- **Two deliverables:** an interactive browser build, and **one standalone offline HTML file** that opens from
  `file://` with no installation (like `Revivo_Webpage/public/pathway-demo.html`), suitable for later hosting at
  `/impact/demo` if the founder approves.

## 2. Stack

| Concern | Choice | Notes |
|---|---|---|
| UI | React 19.3.1 + TypeScript 5.9 | Same React version as the built Pathway prototype (confirmed in P1). Pathway's repository holds documents only, so its bundler cannot be confirmed; Impact uses Vite. |
| Build | Vite 8 + `vite-plugin-singlefile` 2 (set up in P1) | One HTML file with scripts, styles, fonts and images inlined. Size target ≤ 6 MB (Pathway's file is about 3 MB). |
| Styling | Tailwind CSS 4.3.4 (same as Pathway) with the copied tokens (`04` §2.1) | `--ri-` custom properties; `data-ri-theme="dark" | "daylight"` on `<html>`, as Pathway's `data-rp-theme`. |
| Fonts | Barlow Condensed 700, Manrope 400/500, **embedded** as WOFF2 Latin subsets from `@fontsource` (SIL Open Font Licence) | Pathway's file links Google Fonts, so offline it falls back to system fonts. Impact embeds them (about 60 KB; confirmed in P1). |
| Images | WebP, inlined, toned per `04` §9 | Dark placeholders with filename and "Illustrative" until supplied. |
| Routing | Hash routing | Works from `file://`. |
| Motion | CSS transitions and keyframes; Web Animations only where needed | No animation libraries beyond what Pathway used; no canvas, WebGL or particles. |
| Tests | Vitest (unit, property-based with fast-check), Playwright (journeys, widths, themes, offline), axe-core | §6 |

No paid APIs, no external services, no analytics, no credentials.

## 3. Repository structure (suggested)

```
revivoimpact/
  README.md  CLAUDE.md  docs/
  package.json  vite.config.ts  tsconfig.json  index.html
  src/
    brand/        copied from the website and Pathway, each file with a "Copied from … @ commit" header:
                  tokens.css, type utilities, signal.ts, RevivoLogo, Panel (DomainPanel pattern), StatusChip,
                  Heartbeat (SignalGlyph), button classes, error summary, print stylesheet
    domain/       types.ts, ledger.ts (state derivation), invariants.ts (I1–I13), eligibility.ts, access.ts
                  (purpose-based access matrix), consent.ts, fourEyes.ts, claimsCheck.ts, monitoring.ts (alerts,
                  site status), money.ts (formatting, tabular)
    seed/         prng.ts (mulberry32), world.ts (names and funds from docs/05), generate.ts, priceTables.ts
    state/        events.ts (event types), reducer.ts, store.ts (localStorage + BroadcastChannel),
                  clock.ts (three moments), checkpoints.ts
    ai/           matching.ts, applicationHelp.ts, insight.ts: simulated, deterministic templates over records,
                  every sentence carrying its source ids; refusals
    guide/        journeys A–E as scripted steps (who, screen, action, expected result, "What changed")
    screens/      the 23 screens (docs/03 §4)
    components/   FundingLine, MiniFundingLine, FundingBar, NeedBar, DeliverablesStrip, DiscoverRow, BriefChips,
                  SourceButton, SourcePanel, AskRevivo, WhatChanged, SessionStrip, ConsentRow, RoleSwitcher,
                  AthleteSwitcher, ModeSwitch, DemoBar, GuidePanel
    domain/       (adds) discovery.ts (criteria-fit order, visibility), identifiability.ts, sportsBoundary.ts,
                  contactLimits.ts (requests, interest, blocks)
    content/      copy.ts (all visible strings, British English), images.ts (tone values)
  public/images/  placeholders, then final WebP
  tests/unit/  tests/e2e/
  tools/tone/     copied from Pathway (solve.py, measure.py)
  dist/revivo-impact-demo.html   (build output; committed only when the founder asks)
```

## 4. State, seed, clock and storage

- **Seed.** `generate(seed)` builds the world in `05` from a fixed seed with mulberry32. Named records (Amira, Tiago,
  Play Every Day…) are authored; light records are generated. Every record carries the demo date it appears.
- **Events.** Each event: id, demo time, actor, "on behalf of" (for representatives), type, payload, reason (when
  required). Examples: `OpportunityPublished`, `ApplicationSubmitted`, `FieldVerified`, `InfoRequested`,
  `AwardsApproved`, `OfferAccepted`, `ReleaseRecorded`, `ReceiptConfirmed`, `UpdateSubmitted`, `ExpenseVerified`,
  `ExpenseQueried`, `ReviewRecorded`, `NeedPublished`, `OfferSent`, `SessionRecorded`, `RecoveryPlanApproved`,
  `ReportAccepted`, `ConsentChanged`, `RepresentativeAuthorised`, `ExistingFundingAdded`, `PathwayImported`,
  `Registered`, `ProfileVisibilityChanged`, `RequestToFunderSent`, `RequestAnswered`, `InterestExpressed`,
  `ShortlistChanged`, `DeliverableEvidenceSubmitted`, `DeliverableAccepted`, `NeedHidden`, `SafeguardingChecked`,
  `FunderBlocked`, `ConcernReported`, `OrganisationVerified`, `NominationMade`.
- **Derivation.** Every figure is computed by `ledger.ts` from the seed and events at the current clock moment. No
  total is stored. Invariant checks run on every derivation in development builds and throw on breach.
- **Clock.** Three moments (`05` §10). Moving forward reveals seeded records only. If the viewer's own actions ("I'll
  do it" or Explore) have changed records that a later seeded record depends on, moving the clock offers "Load the
  story at this date" (the journey checkpoint) instead of mixing the two; the expected values for each moment are in
  `05` §9.4.
- **Identity and storage safety.** Every record id is deterministic (seed plus event number); the stored log carries
  the seed and schema version and is discarded with a notice if they do not match; two open tabs append events with
  ids, so the later write never overwrites the earlier one.
- **Checkpoints.** Each journey step has a deterministic snapshot built by replaying the scripted steps through the
  reducer ("through the same rules as clicks"), as Pathway's "Load the story up to step N" does. Journey E's
  checkpoint includes Journey B's outcome.
- **Storage.** `localStorage` key `revivo-impact:v1` holds the event log, theme and motion preference, always inside
  try/catch; the prototype works (from the seed) if storage is unavailable. Guide state lives in `sessionStorage`.
  `BroadcastChannel` keeps open tabs in sync. **Reset** clears the log and returns to Mon 12 Apr 2027.

## 5. Simulated AI (no model calls)

Each experience (`02` §9) is a deterministic function over permitted, consented records that returns sentences, each
with source record ids, plus the "Simulated AI" chip. Suggested questions for Ask Revivo are fixed; free text is
matched to the nearest suggested question or answered "I can answer these questions in this prototype: …". The
refusals in `02` §10 are tested. A short loading light (≤ 600ms) shows work without pretending to be live AI. No paid
API is ever integrated without the founder's approval.

## 6. Testing and QA

| Area | Tool | What must pass |
|---|---|---|
| Ledger invariants | Vitest + fast-check | I1–I13 hold for random sequences of valid events; blocked actions report the amount by which they would breach |
| Reconciliation | Vitest | Every figure in `05` §9 equals the sum of its records at each clock moment; every rendered aggregate equals its records (snapshot of computed values per screen); repeated for each currency dataset if D4 adds any |
| Access matrix | Vitest | Viewer × purpose × field matrix (`02` §8): minors never searchable; minor's first name hidden until the guardian accepts or submits; individual sponsors never see minors' cards; programme-only funders see counts only; coaches limited to granted powers; consent withdrawal and hiding remove data from Discover at once; blocked funders see nothing of the blocker |
| Discovery and contact | Vitest | Criteria-fit order is deterministic and never uses a person score; identifiability check (fewer than 10 → widen region → refuse); sports-only check; request and interest limits; only funders that accept requests can receive them; unverified funders cannot publish Public opportunities or see minors' cards |
| Rules | Vitest | Eligibility (each criterion and the overall result), tier rule, offer cap, delegated limit, four-eyes self-approval blocks, alerts, site status thresholds, claims check |
| AI | Vitest | Every AI sentence has at least one source id; refusals fire; AI never outputs a number that is not from a record |
| Journeys | Playwright | Journeys A–E end to end in both "Show me" and "I'll do it"; checkpoints; Reset; role switching; the "What changed" panel lists the expected records |
| Widths and themes | Playwright | 375, 768, 1024 and 1440px with no horizontal overflow, in Dark and Daylight; print preview in Daylight |
| Accessibility | axe-core in Playwright + keyboard scripts | No serious or critical axe issues in either theme; keyboard path through every journey; focus trap, Escape and focus return on panels; tabs with arrow keys |
| Reduced motion | Playwright | With `prefers-reduced-motion`, no light travel; everything still works |
| Offline | Playwright | The single HTML file opened from `file://` with the network blocked renders fully (fonts and images included) and runs Journey A |
| Copy lint | Script | Fails on banned words and names (`CLAUDE.md` §4), "Impact" without "Revivo" in product-name positions, American spellings on a short list, seeker-side jargon ("disbursement"), and a missing banner |
| Quality bar | AI reviewers (people optional) | P5 (founder's brief): independent AI reviewers act as first-time users for every role; optional human sessions follow the plan in `15` §9; a side-by-side review with the Pathway prototype finds no family drift |

### 6.1 The seven end-of-phase reviews (founder, 25 Nov 2026; permanent, every phase from P3)

Automated tests are necessary but do not show that the experience is intuitive. At the end of every phase:

1. **Functional:** every intended workflow works end to end (journeys, both guide modes, every role).
2. **Plain language:** every heading, button, label, notification, status, chart and instruction read and rewritten
   where confusing (`04` §1.1, money vocabulary `04` §6). Record before/after examples.
3. **Usability:** each role tried as an untrained first-time user, without guided mode. Use independent AI reviewers
   given only a goal ("find funding for your judo season"), not navigation instructions. Label them as AI reviews;
   they are not human usability testing (human sessions are optional; plan in `15` §9).
4. **Workflow efficiency:** count the actions for the key tasks (register, find funding, find a sponsor, apply,
   publish a request, find an athlete, make an offer, review, record a payment, confirm receipt, add an expense,
   record progress, check spending, produce a report); remove unnecessary steps, repeats and duplicate entry.
5. **Visual design:** premium Revivo quality and hierarchy on every screen, Dark and Daylight, all widths.
6. **Accessibility:** contrast, readability, keyboard, phone layouts, accessible controls (axe plus manual checks).
7. **Financial and safeguarding:** invariants, permissions, consent, verification and child safeguarding preserved.

Each review must lead to real changes; the phase report lists what changed.

Before every commit: lint, typecheck, unit tests, copy lint and the single-file build. Before every phase gate: the
full Playwright suite.

## 7. Explicit prototype limitations (shown in "About this prototype")

Fictional data only; sign-in, identity checks, payments, bank details, organisation and sponsor verification,
safeguarding checks, notifications and AI are simulated; no real money moves; discovery shows only the fictional
participating organisations (never a real sponsor list); no real Revivo Pathway connection; English only; USD only;
one browser's storage only (no sharing between devices); not a security, legal or compliance demonstration.

## 8. Phases

Effort is in focused build-days for one agent-assisted developer. **P0 is complete. P1 is complete and awaiting the
founder's approval (`09`).**

| Phase | Effort | Deliverables | Exit criteria | Gate |
|---|---|---|---|---|
| **P1 Architecture and experience design** (done, 25 Nov 2026) | — | Founder answers applied to every document; updated product definition, data model, financial rules, permissions and safeguarding (`02`); shared discovery and private workspace architecture; registration flows; navigation; 23-screen inventory; journeys A–E; multi-organisation dataset with reconciliation tables (`05`); image asset plan (`10`); name checks; token table confirmed against the Pathway build; a clickable shell with representative screens that builds to one HTML file; responsive previews at 375 / 768 / 1024 / 1440 | The founder can walk the shell and the previews | **Approval gate: the founder approves the package (`09`)** |
| **P2 Discovery, registration and applications** (built 25 Nov 2026; `11`) | 10–12 days (P1 estimate; reassessed below) | Lint, typecheck, unit and Playwright tooling first; domain core (event log, ledger, invariants, access, discovery order, identifiability, sports-only, contact limits, holds); screens 1–14, 22; Journey A steps 1–9 (AI C summary in step 8 a labelled placeholder); Journey B steps 1–3; Journey C step 1; Journey E steps 1–3; AI A (both directions) and AI B; four-eyes; nominations; federation confirmation | Those steps work in both guide modes; eligibility, access, discovery, contact and hold tests green | Progress review (non-blocking) |
| **P3 Funding, tracking and review** (built 25 Nov 2026; `12`) | 10–12 days | Screens 15–21, 23; Source records panel; the three chains; deliverables; "What changed" panel; Journeys A (10–13), B (4–7), C (2–8), D, E (4–6); checkpoints and the clock rule | All journeys end to end (AI C as labelled placeholders); I1–I13 and reconciliation tests green at all three moments | **Approval gate: the founder reviews the financial model in use** |
| **P4 Intelligence, reporting and polish** (built 25 Nov 2026; `13`) | 6–8 days | AI C (summaries, Ask Revivo, report drafting), images (placeholders until supplied), print and export, motion polish | Three outside viewers can explain the chain after one run of Journey A | Progress review (non-blocking): visual sign-off |
| **P5 QA and packaging** | 4–5 days | Full Playwright suite; axe; 4 widths × 2 themes; the offline file; presenter guide (10-minute script plus B–E notes); limitations page; QA report with evidence | All acceptance criteria (§9) checked with evidence | **Approval gate: the founder approves before anything is published, linked or shared** |

**Reassessed after P1 approval (25 Nov 2026): about 18–24 build-days** (P2 6–8, P3 6–8, P4 3–5, P5 3). The founder
confirmed this is a prototype: completeness of the experience, not of production infrastructure. So: one event log in
the browser instead of a database; simulated sign-in, verification and payments; deterministic simulated AI; Pathway's
proven patterns (one shared state, the guide with "Show me / I'll do it", checkpoints); tests focused on the rules
that matter (money, access, minors, discovery order) and on every role's journey. P2 and P3 are the critical path. At the end of every phase, report to the founder in
plain language: completed, remaining, tested (with screenshots at phone, tablet and laptop widths), limitations. Work
on the branch `claude/festive-fermat-wzl8qa` (founder's instruction); never merge to `main` without approval.

## 9. Definition of done: acceptance criteria

The founder's final acceptance requirements (25 Nov 2026, items 1–23) plus the original criteria they do not already
cover (24–29).

| # | Criterion | Shown in (journey · screens) | Evidence (tests) |
|---|---|---|---|
| 1 | Independent athlete registration | A2–A3 · 1, 2, 4 | Playwright A2; no invitation or Pathway route used |
| 2 | Independent funder and sponsor registration | Explore (Fennick, Halvorsen) · 2, 4 | Playwright: register a company and an individual sponsor; verification (simulated) before publishing |
| 3 | Coaches and guardians managing authorised athletes | E1–E5 · 3, 22, 11 | Playwright E; access tests (coach cannot submit or accept for a minor) |
| 4 | Sports organisations participating on either side | C1, D3 · mode switch | Playwright: Ostral switches modes; totals never mixed |
| 5 | Athletes discovering multiple funding organisations | A4 · 5 | Playwright: 5 opportunities from 5 organisations |
| 6 | Athletes discovering relevant sponsors | A4, B2 · 5, 8 | Playwright: Sponsors & funders tab; request only where accepted |
| 7 | Companies discovering appropriate athletes | B3, B6 · 5, 8 | Playwright; discovery-order test (no person score) |
| 8 | Companies discovering teams and sporting initiatives | Explore (Kenji, Lucy) · 5 Teams & initiatives | Playwright |
| 9 | Foundations publishing sports scholarships | A1 · 9, 6 | Playwright A1; four-eyes unit test; sports-only check |
| 10 | Athletes applying using reusable sporting profiles | A6–A7, E5 · 11 | Playwright; prefill test (no re-typing) |
| 11 | Athletes publishing legitimate sporting funding requests | B1, E3 · 10, 7 | Playwright; sports-only and identifiability tests |
| 12 | Funders managing applications and selections | A8–A9 · 12, 13, 14 | Playwright; tier rule and I1 tests; selection record export |
| 13 | Direct and partial sponsorship | B3–B5, E4 · 7, 15 | I4 cap and delegated-limit tests; need bar |
| 14 | Commercial sports sponsorship | B6–B7 · 15, 17 | Deliverables tests; I7 (commercial never in development totals) |
| 15 | Sports programme funding | C · 19, 20, 21 | Playwright C; alert and site-status tests |
| 16 | Management of existing funding relationships | D · 16, 15, 17 | Carried-in labelling and exclusion-from-verified tests |
| 17 | Transparent funding and expenditure tracking | A11–A13, B5, B7, C5 · 16, 17, funding bar | I2, I3, I9 tests; Source records drill-down; reconciliation suite (`05` §9) |
| 18 | Sporting progress monitoring | A12–A13, B7, E6 · 17, 18 | Playwright drill-down from chain figures to records |
| 19 | Meaningful AI assistance | A4–A6, A8, A13, B3, C3, C6 · Ask Revivo | AI source-id and refusal tests; "Simulated AI" chip on every output |
| 20 | Appropriate safeguarding | E3–E6, B (individual sponsor) · 5, 7, 22, 23 | Access-matrix tests; identifiability; block and report; photo withdrawal |
| 21 | Complete independence from Revivo Pathway | All · 4 (Explore import only) | Journey A passes with the import disabled; import then remove in Explore |
| 22 | Consistent Revivo visual identity | All | Design checklist (`04` §12); side-by-side review with the Pathway prototype |
| 23 | Excellent mobile, tablet and desktop experiences | All | Playwright at 375 / 768 / 1024 / 1440, Dark and Daylight; first-time-viewer sessions |
| 24 | Commitments, payments and expenditure clearly differentiated | Everywhere · status labels, bars | Visual check in both themes; copy lint |
| 25 | Important reported figures reconcile with the underlying records | Everywhere · Source records | Reconciliation suite |
| 26 | Each role has an understandable interface | All · navigation (`03` §2) | ≤ 5 navigation items per role (test); P5 first-time-user reviews (AI, `15` §2) |
| 27 | Every major journey works end to end | A–E | Playwright in both modes and from every checkpoint |
| 28 | No real data, payments or unapproved external services | All | Offline test with the network blocked; no fetch calls in the bundle; copy lint; banner on every screen |
| 29 | Meets or exceeds the clarity, visual quality and completeness of Revivo Pathway | All | Side-by-side review; three outside viewers never ask "is this real?" |

## 10. Later (not this prototype)

If the founder's go/no-go (`01` §10) is passed: real authentication, multi-tenancy, a database with row-level
security, payment and identity integrations through licensed partners, data-protection impact assessment, security
testing, and the shared Revivo infrastructure question (sign-in, organisations, consent, audit, design tokens with
Pathway). None of this is started without the founder's approval.
