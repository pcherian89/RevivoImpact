# CLAUDE.md — rules for working on Revivo Impact

Read this whole file before any change. It holds the decisions that must survive between sessions.

## 0. Permanent quality principles (founder, 25 Nov 2026; apply to every phase and refinement)

Solve complex sports funding problems in the simplest, most efficient way. The system carries the complexity; the user
does not. Not the most features, screens or charts: the clearest solution to the real problems. Full text:
`docs/02` §1.1 (product), `docs/04` §1.1 (design and wording), `docs/06` §6.1 (the seven end-of-phase reviews).

- **Every screen understandable at first sight.** Check each against the eight questions in `docs/04` §1.1 (purpose,
  no explanation needed, obvious primary action, next step, every item relevant, nothing removable, easy to scan,
  works on a phone). If it needs a presenter or tooltip to explain its purpose, redesign it. The product must work
  without the guide.
- **Everyday words everywhere** (headings, buttons, labels, statuses, charts, errors, form questions): no grant-admin,
  finance or software jargon; no invented terms; explain necessary terms in passing; language fit for each role. Use
  the plain money vocabulary in `docs/04` §6 ("Paid", not "Released"; "Record a payment", "Confirm money received",
  "Check spending"). The copy check (`tools/check-copy.mjs`) blocks known jargon, but it does not replace the
  plain-language review.
- **Efficient workflows:** fewest steps; reuse profile data; sensible defaults; no duplicate entry or repeated
  confirmations. Never pre-fill a declaration the user must genuinely confirm. Keep verification, consent, safeguarding
  and financial controls, but make them easy to use.
- **Complete, not bloated:** keep the whole journey and every approved funding route; every feature solves a real
  problem, improves efficiency, strengthens accountability or improves the experience, or it goes.
- **Role-appropriate:** athletes get the simplest, phone-first experience; coaches and guardians avoid organisational
  administration; funders get the money answers; approval policies stay configurable (Simple is not Institutional).
- **Charts answer a named question** with real numbers and units; no unexplained percentages, legends or colour
  codes; figures stay traceable to records. The Funding Line stays, with every stage named in plain words.
- **AI makes things easier**, never decorative; deterministic money, eligibility and approval rules; people decide.
- **Prototype only:** no production auth, payments, databases, identity checks, paid AI, backends or integrations.
- **At the end of every phase, run the seven reviews** (`docs/06` §6.1): functional, plain-language, usability
  (independent AI reviewers acting as untrained first-time users, clearly labelled as AI, not human testing),
  workflow efficiency, visual design, accessibility, financial and safeguarding. They must produce real changes.

**Current status (26 Nov 2026): P5 complete and the final clarity review done (`docs/15` §11–§13, matrices `docs/16`–`17`), waiting for the founder's approval gate.** Final build
`prototype/revivo-impact-final.html`; presenter guide `docs/14-presenter-guide.md`; QA report `docs/15-p5-qa-report.md`.
Human usability sessions are optional (founder's P5 brief); AI reviews are always labelled as AI, never as human testing.

## 1. Read order

1. `docs/00-START-HERE.md` — what the product is, where the work stands, what to do next.
2. `docs/07-decisions-for-founder.md` — the founder's answers (25 Nov 2026) and further direction. Never re-decide
   them yourself. Then `docs/09-p1-design-package.md` — the P1 package, what changed and the open points.
3. `docs/02-product-definition.md` and `docs/03-experience-and-screens.md` — what to build.
4. `docs/04-design-and-brand.md` — how it must look; `docs/10-image-asset-plan.md` — the images.
   `docs/05-fictional-world-and-data.md` — the data.
5. `docs/06-technical-plan-and-phases.md` — how to build and test it, and the definition of done.
6. `docs/01-product-strategy.md` and `docs/08-research-and-competitors.md` — why. `docs/90-founder-master-brief.md` —
   the founder's original words. `docs/archive/` — superseded, reference only.

If two documents disagree, stop and tell the founder; do not pick one silently. Numbers and names live in `docs/05`;
every other file must match it.

## 2. What Revivo Impact is (one paragraph)

An **open, controlled, two-sided sports funding & sponsorship platform** (founder decision D6, 25 Nov 2026). Anyone
seeking legitimate sporting support (athletes, guardians, coaches, teams, clubs, academies, federations, programme
operators) and anyone providing it (foundations, CSR teams, sponsors, sports brands, government sports bodies,
federations, verified individual sponsors) can register independently and discover each other in both directions.
Central experience: **Discover → Apply or Connect → Fund → Track → Review.** Every route leads to one internal record,
the **funding agreement**, with one ledger; the interface names it by type (Scholarship award, Development grant,
Sponsorship agreement, Programme grant, Equipment support, Competition funding). The first sales motion is
institutional (a foundation runs a scholarship round from a link), but the product scope is fully two-sided.
**Sports only.** Always write "Revivo Impact", never "Impact" alone. It is a prototype on fictional data, not
production software.

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
  commercial amounts never enter development or programme cash totals. Invariants I1–I13 (`docs/02` §6) must hold.
- **Every figure on screen is calculated from records** and opens its sources ("See source").
- **Minors (under 18):** registered and represented by a guardian; never searchable or identifiable as profiles;
  funders reach them only through an anonymised funding request a guardian published (after the identifiability
  check, `docs/02` §7.3), an application the guardian authorised, or a nomination the guardian accepted; all offers,
  questions and confirmations go to the guardian; individual sponsors reach minors only through an authorised
  representative, with an enhanced safeguarding check and a platform review of every offer (`docs/02` §5.6); no
  commercial sponsorship of minors; a coach can never accept offers, change consent or publish requests for a minor;
  block, report and consent withdrawal take effect at once.
- **Sports only.** Every profile, opportunity, request, agreement and programme names a sport and a sporting purpose
  (`docs/02` §4.4). No general academic scholarships, non-sport charity or generic fundraising.
- **Structured contact only.** No free messaging; support asks only to funders that accept them; limits against spam.
- **Approval policies** (`docs/02` §5.7): Simple, Standard or Institutional per Fund; never approving one's own
  draft; under Institutional the approver does not record the release. No double funding (line-item requests, holds
  for pending applications).
- **Purpose-based access.** Funders see only what the purpose allows (`docs/02` §8). Programme-only funders see
  aggregates. Discovery shows only what the owner marked discoverable, and never claims to list every sponsor.
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
- Never add public donations, individual donors, crowdfunding, free messaging, sponsorship inventory, valuation or
  activation (deferred; `docs/02` §13). Verified individual sponsors exist only as `docs/02` §5.6 describes.
- Never call every funding arrangement an "Award" in the interface; use the type names (`docs/02` §4.1).
- Never rank athletes by popularity, followers, appearance or any AI "potential" score; discovery order is the
  deterministic criteria-fit count.
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
- Work on the branch `claude/festive-fermat-wzl8qa` (founder's instruction, 25 Nov 2026). Never merge to `main`
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

`docs/06` §9 (phase exit criteria and the 29 acceptance criteria mapped to tests) and the design checklist
in `docs/04` §12. Nothing is "done" until the founder has seen it on phone, tablet and laptop.
