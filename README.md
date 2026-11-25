# Revivo Impact

**Sports funding & sponsorship platform — a Revivo Sportech prototype on fictional data (P1: design package and clickable shell).**

Revivo Impact is an open, controlled, two-sided sports funding and sponsorship platform. If you need funding for sport,
it helps you find it; if you want to fund sport, it helps you find credible opportunities and understand how your
support is used. Athletes, guardians, coaches, clubs and academies join free, build one reusable sporting profile and
discover funding and sponsors; foundations, companies, brands, government bodies, federations and verified individual
sponsors discover athletes, teams and initiatives, run scholarship rounds, make offers and follow every funding
relationship to verified spending, sporting progress and review. Revivo Impact records commitments and payments; it
never moves money.

| | |
|---|---|
| Company | Revivo Sportech — "Pulse of Sport. Mind of the Game." (company tagline, never used as Impact's) |
| Product tagline | "Connecting sport with opportunity." (founder decision D1) |
| Supporting line | "Find funding. Support sporting talent. See how your support is used." |
| Status | **P1 complete, awaiting the founder's approval (`docs/09-p1-design-package.md`).** Run the shell: `npm install`, then `npm run dev`; `npm run build` makes one offline HTML file in `dist/`. |
| Prototype form | One self-contained offline HTML file, like the Revivo Pathway prototype. Fictional data, simulated AI, no backend. |
| Relationship to Revivo Pathway | Fully independent. An optional, simulated "import from Revivo Pathway" exists on the profile only. |

Delivery and spending records show what was delivered and spent; they do not on their own prove social impact.

## Document map

| File | What it answers |
|---|---|
| `CLAUDE.md` | Rules for any session working in this repository. Read first. |
| `docs/00-START-HERE.md` | What Revivo Impact is in plain language, current status, read order, first P1 steps, approval gates. |
| `docs/01-product-strategy.md` | Positioning, buyers vs users, strongest use case, differentiation, commercial model, risks, validation, website presentation, and every change from the founder's brief. |
| `docs/02-product-definition.md` | Object model, shared discovery and private workspaces, registration, funding types and the sports boundary, roles and permissions, financial states and invariants, consent, minors and safety, access, AI, the chains, Pathway import, exclusions. |
| `docs/03-experience-and-screens.md` | Navigation per role, the 23 screens, journeys A–E step by step, guided and hands-on modes, microcopy and status labels. |
| `docs/04-design-and-brand.md` | Family consistency with the Revivo website and Revivo Pathway, the four permitted differences, Funding Line and funding bar, imagery rules, accessibility. |
| `docs/05-fictional-world-and-data.md` | Organisations, personas, funds, reconciled figures, seed sizes, names to verify, currency policy. |
| `docs/06-technical-plan-and-phases.md` | Architecture, repository layout, state and seed, offline build, testing, phases P1–P5, acceptance criteria mapped to tests. |
| `docs/07-decisions-for-founder.md` | The 18 decisions with the founder's answers (25 Nov 2026) and further direction. |
| `docs/09-p1-design-package.md` | The P1 package: index of the 20 deliverables, what changed and why, expert review, the shell, open points. |
| `docs/10-image-asset-plan.md` | Every image: filename, screen, ratio, subject, composition, light, setting, purpose and ChatGPT prompt. |
| `docs/08-research-and-competitors.md` | Competitor and programme research, legal notes, sources, verified facts vs judgement. |
| `docs/90-founder-master-brief.md` | The founder's original brief, verbatim. Where the docs above differ, they take precedence and say why. |
| `docs/archive/` | Superseded v1 documents (the narrower programme-monitoring concept), kept for reference. |
