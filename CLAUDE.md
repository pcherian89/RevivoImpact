# CLAUDE.md — rules for working on Revivo Impact

Read this whole file before any change. It holds the decisions that must survive between sessions.

## 1. Read order

1. `docs/00-START-HERE.md` — what the product is, where the work stands, what to do next.
2. `docs/07-decisions-for-founder.md` — open decisions. Until the founder answers, the recommended defaults apply only
   if the founder approves the list; never re-decide them yourself.
3. `docs/02-product-definition.md` and `docs/03-experience-and-screens.md` — what to build.
4. `docs/04-design-and-brand.md` — how it must look. `docs/05-fictional-world-and-data.md` — the data.
5. `docs/06-technical-plan-and-phases.md` — how to build and test it, and the definition of done.
6. `docs/01-product-strategy.md` and `docs/08-research-and-competitors.md` — why. `docs/90-founder-master-brief.md` —
   the founder's original words. `docs/archive/` — superseded, reference only.

If two documents disagree, stop and tell the founder; do not pick one silently. Numbers and names live in `docs/05`;
every other file must match it.

## 2. What Revivo Impact is (one paragraph)

A sports funding & sponsorship platform. Its headline use: a foundation or CSR team runs an athlete scholarship or
grant round from a shareable link, selects fairly, then follows each award (committed, released, spent and verified,
sporting progress, review). Programme funding and monitoring (Play Every Day) is the second module. Athlete-published
Needs and funder discovery with Offers are included but secondary. Everything feeds one object, the **Award**, and one
ledger. Always write "Revivo Impact", never "Impact" alone.

## 3. Guard-rails (never change without the founder's written approval)

- **Fictional data only.** A banner on every screen: "Demonstration on fictional data. Every person, organisation,
  amount and record is invented, and no real money moves."
- **No real money, payments, bank links, identity checks, e-signatures, logins, email or SMS.** Releases are
  *recorded*, never processed. Say "simulated" wherever a real system would act.
- **Humans decide.** AI never decides eligibility, ranks people by merit, approves, releases money, verifies spend or
  claims impact. Eligibility, every number, every total, alerts, offer caps and the claims check are deterministic.
- **Exactly three AI experiences**, each labelled "Simulated AI" (matching; application help; funder intelligence and
  reporting). Every AI sentence links to its source record. Built-in refusals stay.
- **Four-eyes.** Nobody approves their own draft, recommendation, recovery plan, expense or report. Returning
  something needs a reason.
- **Money states never blur.** A commitment is not a payment; reported spend is not verified spend; in-kind and
  commercial amounts never enter development or programme cash totals. Invariants I1–I8 (`docs/02` §6) must hold.
- **Every figure on screen is calculated from records** and opens its sources ("See source").
- **Minors (under 18):** registered and represented by a guardian; never searchable as profiles; funders reach them
  only through a de-identified Need a guardian published or an application the guardian authorised; all offers,
  questions and confirmations go to the guardian; a coach can never accept offers, change consent or publish Needs
  for a minor.
- **Purpose-based access.** Funders see only what the purpose allows (`docs/02` §5). Programme-only funders see
  aggregates.
- **Honesty line**, where impact is implied (chains, reports, About): "Delivery and spending records show what was
  delivered and spent; they do not on their own prove social impact." Not on every screen.
- **Legal and finance notes are design considerations, never compliance claims.** No "compliant", "certified",
  "tax-deductible", "CSR-eligible" or "approved" claims.

## 4. Never do

- Never modify `Revivo_Webpage` or `RevivoPathway` (or any other repository) from here. Copy files in, with a
  source note.
- Never deploy, publish, buy services, add paid APIs, add passwords or credentials, or merge to `main` without the
  founder's explicit approval.
- Never use: "AI built for the pulse of sport" (retired), "Deliver sport. Demonstrate impact.", "Track the
  difference", "proven impact", "guaranteed", "life-changing", "transformed lives", "SROI", "launch", "available now",
  "book/request a demo", "our products", "verified athlete" as a blanket badge, "AI decides", "rejected" or "failed"
  to an applicant.
- Never use real organisation names. "Horizon Sports Foundation" and "Brightwater Fund" are retired (`docs/05` §7).
- Never position the product as India- or Kerala-specific. Currency is USD only until decision D4.
- Never present simulated AI, payments, verification or security as operational.
- Never add individual donors, individual sponsors, crowdfunding, free messaging, sponsorship inventory or activation
  (deferred; see `docs/02` §12).
- Never use the company tagline "Pulse of Sport. Mind of the Game." as Impact's tagline, and never place Impact's
  tagline on the Revivo website homepage.

## 5. Family consistency (top priority)

Someone who knows the Revivo website and Revivo Pathway must recognise Revivo Impact in one second and know what to do
in ten. Full rules: `docs/04` §2–3.

- Copy 1:1: colour tokens (dark default, Daylight one tap away, print in Daylight), lime only for signal, current
  state and the one primary action; Barlow Condensed 700 + Manrope 400/500 and the type utilities; buttons, chips,
  inputs, tables, error summary; signal geometry and motion; node grammar; logo lockup "revivo │ IMPACT"; the
  Pathway prototype shell; panels in the style of `DomainPanel`; the photo grade.
- Only four differences: the Funding Line motif; money vocabulary and the funding bar; two tones of one voice
  (warmer athlete side, ledger-like funder side); new image subjects in the same photographic style and grade. Do
  not brighten images. No new colours, fonts, icon sets, gradients or card grids.
- Ease of use: one question per screen; at most five navigation items per role; Home shows "what needs you" (at most
  three items) first; the next step is always visible; one primary button per view, worded as the outcome.

## 6. Working with the founder (not technical)

- Explain in plain language: what you did, what it means, what is next. No jargon without a one-line definition.
- Show screenshots at phone (375px), tablet (768/1024px) and laptop (1440px) for anything visual.
- Work on a dedicated branch (for example `p1-architecture`). Commit and push only when asked; never merge to `main`
  without approval.
- Ask before decisions that change the product, the brand or the money model; do not ask about minor implementation
  details.
- Pause at the approval gates after P1, P3 and P5 (`docs/06` §8). At the end of every phase report: completed,
  remaining, tested, limitations.
- Never ask for secrets in chat.

## 7. Engineering basics

- Stack and build: `docs/06` §1–4 (React + TypeScript + Vite + Tailwind CSS 4, one offline HTML file, deterministic
  seed, event log, `localStorage` behind try/catch, no backend). Confirm versions against Pathway's build in P1.
- Before every commit: lint, typecheck, unit tests (invariants, reconciliation, access matrix), Playwright journeys,
  copy lint, the single-file build. See `docs/06` §6.
- British English in all visible copy (organisation, programme, authorise). Tabular numbers everywhere.
- WCAG 2.2 AA; check 375 / 768 / 1024 / 1440 in Dark and Daylight; reduced motion keeps everything working.

## 8. Definition of done

`docs/06` §9 (phase exit criteria and the founder's 20 acceptance criteria mapped to tests) and the design checklist
in `docs/04` §12. Nothing is "done" until the founder has seen it on phone, tablet and laptop.
