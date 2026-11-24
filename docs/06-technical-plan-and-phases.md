# Revivo Impact — technical plan and phases

How the prototype is built, tested and delivered. What it does: `02` and `03`. How it looks: `04`. Data: `05`.

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
| UI | React 19 + TypeScript | The built Pathway prototype contains React 19.3.1 and Tailwind CSS v4.3.4 (verified in `pathway-demo.html`); its bundler cannot be identified from the output. Match these versions; if Pathway's source becomes available, confirm its build set-up in P1. |
| Build | Vite + `vite-plugin-singlefile` (Panel B's choice) | One HTML file with scripts, styles, fonts and images inlined. Size target ≤ 6 MB (Pathway's file is about 3 MB). |
| Styling | Tailwind CSS 4 with the copied tokens (`04` §2.1) | `--ri-` custom properties; `data-ri-theme="dark" | "daylight"` on `<html>`, as Pathway's `data-rp-theme`. |
| Fonts | Barlow Condensed 700, Manrope 400/500, **embedded** as WOFF2 subsets (SIL Open Font Licence) | Pathway's file links Google Fonts, so offline it falls back to system fonts. Impact embeds them so the offline file looks identical; confirm size in P1. |
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
    domain/       types.ts, ledger.ts (state derivation), invariants.ts (I1–I8), eligibility.ts, access.ts
                  (purpose-based access matrix), consent.ts, fourEyes.ts, claimsCheck.ts, monitoring.ts (alerts,
                  site status), money.ts (formatting, tabular)
    seed/         prng.ts (mulberry32), world.ts (names and funds from docs/05), generate.ts, priceTables.ts
    state/        events.ts (event types), reducer.ts, store.ts (localStorage + BroadcastChannel),
                  clock.ts (three moments), checkpoints.ts
    ai/           matching.ts, applicationHelp.ts, insight.ts: simulated, deterministic templates over records,
                  every sentence carrying its source ids; refusals
    guide/        journeys A–E as scripted steps (who, screen, action, expected result, "What changed")
    screens/      the 22 screens (docs/03 §4)
    components/   FundingLine, MiniFundingLine, FundingBar, SourceButton, SourcePanel, AskRevivo, WhatChanged,
                  SessionStrip, ConsentRow, RoleSwitcher, AthleteSwitcher, DemoBar
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
  `ReportAccepted`, `ConsentChanged`, `RepresentativeAuthorised`, `ExistingFundingAdded`, `PathwayImported`.
- **Derivation.** Every figure is computed by `ledger.ts` from the seed and events at the current clock moment. No
  total is stored. Invariant checks run on every derivation in development builds and throw on breach.
- **Clock.** Three moments (`05` §10). Moving forward reveals seeded records only.
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
refusals in `02` §9 are tested. A short loading light (≤ 600ms) shows work without pretending to be live AI. No paid
API is ever integrated without the founder's approval.

## 6. Testing and QA

| Area | Tool | What must pass |
|---|---|---|
| Ledger invariants | Vitest + fast-check | I1–I8 hold for random sequences of valid events; blocked actions report the amount by which they would breach |
| Reconciliation | Vitest | Every figure in `05` §9 equals the sum of its records at each clock moment; every rendered aggregate equals its records (snapshot of computed values per screen); repeated for each currency dataset if D4 adds any |
| Access matrix | Vitest | Viewer × purpose × field matrix (`02` §5.5): minors never searchable; minor's first name hidden until the guardian accepts or submits; programme-only funders see counts only; coaches limited to granted powers; consent withdrawal removes data everywhere |
| Rules | Vitest | Eligibility (each criterion and the overall result), tier rule, offer cap, delegated limit, four-eyes self-approval blocks, alerts, site status thresholds, claims check |
| AI | Vitest | Every AI sentence has at least one source id; refusals fire; AI never outputs a number that is not from a record |
| Journeys | Playwright | Journeys A–E end to end in both "Show me" and "I'll do it"; checkpoints; Reset; role switching; the "What changed" panel lists the expected records |
| Widths and themes | Playwright | 375, 768, 1024 and 1440px with no horizontal overflow, in Dark and Daylight; print preview in Daylight |
| Accessibility | axe-core in Playwright + keyboard scripts | No serious or critical axe issues in either theme; keyboard path through every journey; focus trap, Escape and focus return on panels; tabs with arrow keys |
| Reduced motion | Playwright | With `prefers-reduced-motion`, no light travel; everything still works |
| Offline | Playwright | The single HTML file opened from `file://` with the network blocked renders fully (fonts and images included) and runs Journey A |
| Copy lint | Script | Fails on banned words and names (`CLAUDE.md` §4), "Impact" without "Revivo" in product-name positions, American spellings on a short list, seeker-side jargon ("disbursement"), and a missing banner |
| Quality bar | People | P5: three first-time viewers complete "find and apply" and "approve an award" unaided; a side-by-side review with the Pathway prototype finds no family drift |

Before every commit: lint, typecheck, unit tests, copy lint and the single-file build. Before every phase gate: the
full Playwright suite.

## 7. Explicit prototype limitations (shown in "About this prototype")

Fictional data only; sign-in, identity checks, payments, bank details, organisation verification, notifications and
AI are simulated; no real money moves; no real Revivo Pathway connection; English only; USD only; one browser's
storage only (no sharing between devices); not a security, legal or compliance demonstration.

## 8. Phases

Effort is in focused build-days for one agent-assisted developer. **P0 is complete** (this documentation set).

| Phase | Effort | Deliverables | Exit criteria | Gate |
|---|---|---|---|---|
| **P1 Architecture and experience design** | 4–6 days | Founder answers to `07`, applied across all docs; object and ledger specification; consent and access matrix; information architecture and wireframes of the 22 screens at 375px and 1440px; scripted journeys A–E with data changes; seed specification with reconciliation tables (fixing every "P1" item in `05`); name checks; confirmed image asset plan; token table confirmed against the Pathway build; a clickable shell copied from Pathway's (start screen, banner, role pill, demo clock, Reset, Daylight) that builds to one HTML file | The founder can walk the wireframed Journey A on phone, tablet and laptop screenshots; invariants agreed | **Approval gate: the founder approves the model, screens, navigation, names, image plan and decisions** |
| **P2 Discovery and applications** | 8–10 days | Screens 1–13 and 21; Journey A steps 1–9; AI A and AI B (simulated); eligibility engine; four-eyes; nominations; Discover tabs | Journey A to step 9 in both modes (the AI C summary in step 7 is a labelled placeholder until P4); eligibility, consent and access tests green | Progress review (non-blocking) |
| **P3 Funding and progress** | 8–10 days | Screens 14–20 and 22 (Reports with a manually written draft and the rule-based claims check); the Source records panel; ledger; Journeys A (10–13), B, C, D and E; checkpoints | All journeys end to end, with AI C steps shown as labelled placeholders; I1–I8 and reconciliation tests green | **Approval gate: the founder reviews the financial model in use** |
| **P4 Intelligence, reporting and polish** | 6–8 days | AI C (application summary, Ask Revivo, report drafting), "What changed", finish screens, images (placeholders until supplied), currency datasets only if D4 approves them, print and export | Three outside viewers can explain the chain after one run of Journey A | Progress review (non-blocking): visual sign-off |
| **P5 QA and packaging** | 4–5 days | Full Playwright suite; axe; 4 widths × 2 themes; the offline file; presenter guide (10-minute script plus B–E notes); limitations page; QA report with evidence | All 20 acceptance criteria (§9) checked with evidence | **Approval gate: the founder approves before anything is published, linked or shared** |

Total about 30–40 build-days; P2 and P3 are the critical path. At the end of every phase, report to the founder in
plain language: what was completed, what remains, what was tested (with screenshots at phone, tablet and laptop
widths), and limitations. Work on a branch (for example `p1-architecture`); never merge to `main` without approval.

## 9. Definition of done: the founder's 20 acceptance criteria

| # | Criterion | Shown in (journey · screens) | Evidence (tests) |
|---|---|---|---|
| 1 | An athlete can independently register without Pathway | A2 · 6, 2 | Playwright A2; no Pathway route or import is used in Journey A |
| 2 | A foundation can independently publish a scholarship | A1 · 8, 6 | Playwright A1; four-eyes unit test (drafter cannot publish) |
| 3 | Athletes can discover and apply for funding | A4–A6 · 5, 6, 10 | Playwright; eligibility unit tests |
| 4 | Coaches and guardians can manage authorised athlete applications | E1–E3 · 3, 21, 10, 11 | Playwright E; access tests (coach cannot submit for a minor) |
| 5 | Funders can evaluate and select beneficiaries | A7–A9 · 11, 12, 13 | Playwright; tier rule and I1 tests; selection record export |
| 6 | Athletes can create specific funding requests | B1 · 9, 7 | Playwright B1 |
| 7 | Sponsors can discover suitable opportunities and propose funding | B2–B4 · 5, 7, 14 | Playwright B; I4 cap test; delegated limit test |
| 8 | Existing funding relationships can be managed | D1–D4 · 15, 14, 16 | Playwright D; carried-in labelling and exclusion-from-verified tests |
| 9 | Programme operators can receive funding and report delivery | C1–C7 · 18, 19, 20 | Playwright C; alert and site-status tests |
| 10 | Commitments, payments and expenditure are clearly differentiated | A10–A13, B5, C5 · 14, 16, funding bar, status labels | I2 and I3 tests; visual check of the funding bar in both themes |
| 11 | Important reported figures reconcile with the underlying records | Everywhere · Source records panel | Reconciliation suite (`05` §9) |
| 12 | Athlete progress and programme evidence connect to funding | A12–A13, C7 · 16, 18 | Playwright drill-down from chain figures to records |
| 13 | AI assistance is useful, explainable and appropriately limited | A5, A6, A7, A13, B2, C3, C6 · Ask Revivo | AI source-id and refusal tests; "Simulated AI" chip present on every output |
| 14 | Minors' privacy and consent are appropriately demonstrated | B1–B4, E2, E5 · 5, 7, 14, 21 | Access-matrix tests; Playwright E5 photo removal |
| 15 | Each role has an understandable interface | All · navigation (`03` §2) | ≤ 5 navigation items per role (test); P5 first-time-viewer sessions |
| 16 | The product is usable on mobile, tablet and desktop | All | Playwright at 375 / 768 / 1024 / 1440, Dark and Daylight |
| 17 | Pathway integration is optional rather than required | Explore (Inês) · 4 | Playwright: import, then remove; Journey A passes without it |
| 18 | Every major journey works end to end | A–E | Playwright in both modes and from every checkpoint |
| 19 | No real data, payments or unapproved external services | All | Offline test with the network blocked; no fetch calls in the bundle (static check); copy lint; banner on every screen |
| 20 | Meets or exceeds the clarity, visual quality and completeness of Revivo Pathway | All | Design checklist (`04` §12); side-by-side review with the Pathway prototype; three outside viewers never ask "is this real?" |

## 10. Later (not this prototype)

If the founder's go/no-go (`01` §10) is passed: real authentication, multi-tenancy, a database with row-level
security, payment and identity integrations through licensed partners, data-protection impact assessment, security
testing, and the shared Revivo infrastructure question (sign-in, organisations, consent, audit, design tokens with
Pathway). None of this is started without the founder's approval.
