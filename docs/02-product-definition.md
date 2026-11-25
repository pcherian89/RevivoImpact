# Revivo Impact — product definition

What the product is made of and the rules it must obey. Screens and journeys are in `03`; figures and names in `05`
(the source of truth for every number). All amounts are USD in the demonstration (`07` D4).

**Revised in P1 (25 Nov 2026)** after the founder's decisions (`07`): open registration and two-way discovery,
a shared discovery environment with private workspaces, type-specific names for funding, verified individual
sponsors, a sports-only boundary and a clarified safeguarding model. Then strengthened after the P1 expert review
(`09` §6): line-item requests and holds (no double funding), release controls, federation confirmation of facts,
selection realism, tighter anonymised cards, and clearer terms. What changed and why: `09` §3 and §6.

## 1. Scope in one paragraph

Revivo Impact is an **open, controlled, two-sided sports funding and sponsorship platform**. Anyone with a legitimate
sporting purpose can register free and **discover** in both directions: athletes, guardians, coaches, clubs, academies,
federations and programme operators find funding opportunities and participating sponsors; foundations, companies,
brands, government sports bodies, federations and verified individual sponsors find athletes, teams and sporting
initiatives. People then **apply or connect** (applications, nominations, funding requests, expressions of interest,
offers), funders **fund** (a funding agreement with recorded, simulated releases), both sides **track** (spending,
sporting progress, programme delivery, sponsorship deliverables) and a person **reviews** (continue, conditions, pause,
close, renew). It is standalone: its own registration, profiles, representatives, consent, verification, audit and
administration. It records commitments and payments; it never moves money. In the prototype every person,
organisation, amount and record is fictional, AI is simulated, and payments, verification and sign-in are simulated.

**Central experience: Discover → Apply or Connect → Fund → Track → Review.**

### 1.1 Product philosophy (founder, 25 Nov 2026; permanent)

Revivo Impact solves complex sports funding and sponsorship problems in the simplest and most efficient way: ease of
use, complete and meaningful functionality, everyday language, efficient workflows, premium design, relevant AI help
and commercial credibility. The system handles complexity behind the scenes instead of passing it to the user. The aim
is not the most features, screens, charts or controls, but the platform that solves the real problems best and is
easiest to understand.

- **Complete, not bloated.** Keep the whole journey (Discover → Apply or Connect → Fund → Track → Review) and every
  approved route: open sports scholarships, athlete-led funding requests, funder-led discovery, direct and partial
  sponsorship, programme funding, existing funding relationships, lightweight commercial sponsorship. Every feature
  must solve a real user problem, improve efficiency, strengthen accountability or improve the experience.
- **Role-appropriate.** Athletes: where to find funding, who might sponsor me, do I qualify, how to apply, what is
  happening, how much support I have, what updates I owe; phone-first and simplest. Coaches and guardians: manage
  authorised athletes, find opportunities, help with applications, send updates; no organisational administration.
  Funders: who can we support, what we published, who applied, who we support, committed, paid, how the money is used,
  what progress, what needs attention. Organisations: requests, funded athletes, programmes, delivery and reporting,
  with approval processes that fit their size.
- **Efficient.** Fewest steps; reuse profile data; defaults and pre-filled information, except declarations that need
  the user's genuine confirmation; controls (verification, consent, safeguarding, money) kept but easy to use.
- **Sports-only and independent** of Revivo Pathway (§12); open registration and discovery across many independent
  funders.

**Sports only.** Every profile, opportunity, funding request, agreement and programme names a sport and a sporting
purpose (§4.4). General academic scholarships, non-sport charity and generic fundraising are out of scope.

## 2. Object model

```
                SHARED DISCOVERY                         PRIVATE WORKSPACES (one per organisation or person)
 Profiles ─────────────────────────────┐
 (athlete, organisation, funder)       │
 Opportunity (funding offered) ────────┼──▶ Application / Nomination ──┐
 Funding request (funding needed) ─────┼──▶ Support ask ───────────────┤
                                       └──▶ Expression of interest ────┼──▶ Offer ──▶ FUNDING AGREEMENT ──▶ Ledger ──▶ Updates & evidence ──▶ Review
                                                                       │            (one record; the        commit,    expenses, progress,    continue /
                         "Add existing funding" ───────────────────────┘             interface names it     release,   sessions, deliverables conditions /
                                                                                     by type, §4)           receipt,   documents              pause / close /
                                                                                                            report,                           renew
                                                                                                            verify
```

| Object | What it is | Key fields | Rules |
|---|---|---|---|
| **Profile: athlete** | One reusable sporting profile (§3.4) | Sport, discipline, competition category, achievements, competition history, performance records, affiliations, coach, recommendations, development goals, training needs, current support, documents; **visibility per field** (§3.4) | An adult owns it; a guardian owns a minor's. Each fact carries its own verification state. Prefills every application and request. |
| **Profile: organisation** | A club, academy, school, federation, charity, community organisation, programme operator, foundation, company, brand or government sports body | Type, sports, regions, verification state; **seeking side** (what it needs, programmes, teams); **providing side** (funder profile, §3.5) | An organisation can seek, provide, or both (§5.1). |
| **Profile: individual sponsor** | A verified adult who supports sport personally | Sporting interests, sports, regions, support types, typical range, accepts requests | Restricted reach (§5.6). |
| **Fund** | A funder's pot of money (or of in-kind items) | Funder, name, **one funding type** (§4), currency, announced amount (or items and declared value), period, tiers or maximum, delegated offer limit | Belongs to one funder. Totals are always summed from its agreements' ledgers, never stored. |
| **Opportunity** ("funding offered") | What a funder publishes for people to apply to | Fund, title, sport(s), sporting purpose, tiers or amount, number of awards, eligibility rules, required documents, access route (Open · Nomination · Invitation only), **visibility (Public · Restricted to named organisations · Invitation only)**, status (Upcoming · Open · Closed), deadline, selection process, reporting expectations, release schedule | Drafted by any funder member; published by a different person with Approve. Its page is also the share-link page. |
| **Funding request** ("funding needed"; internally *Need*) | What a seeker publishes: a specific sporting requirement | Owner (adult athlete, guardian for a minor, organisation), sport, purpose, **line items** (each with an amount), date needed, key facts with verification chips, **visibility (Public, adults and organisations only · Verified funders only · Invitation only)**, discoverable on/off; per line: pledged, covered from other sources, held for a pending application | A minor's request is shown only as an anonymised card after the identifiability check (§7.3). Requested, Pledged, Received, Covered from other sources, Held and Remaining are views of its line items and agreements (I6). An application linked to the request holds its amount until decided. |
| **Application** | A seeker applies to an Opportunity | Applicant, prepared by, submitted by, route (direct · nomination), fields shared, budget lines, requested amount, **other funding declared**, documents, statement, eligibility result, field verifications, rubric scores, conflict declarations, status | A coach can prepare; only an adult athlete, a guardian (for a minor) or an authorised organisation member submits. |
| **Nomination** | A federation, club, academy or coach puts an athlete forward to an Opportunity that accepts nominations | Nominator, athlete, reason, evidence | The athlete (or guardian, for a minor) accepts and completes it; it then becomes an Application. Nothing identifiable about a minor reaches the funder until the guardian accepts. |
| **Support ask** | A seeker asks one funder that accepts asks for support towards one of their funding requests | Funding request, the line items and amount asked for, funder, short template message, fields shared | Checked before sending against the funder's stated sports, regions, funding types and range; anti-spam limits (§3.3). The funder answers: Make an offer · Ask a question (template) · Not now. |
| **Expression of interest** | A funder signals interest in a funding request, an adult's profile or an organisation's initiative | Funder, target, template reason, optional question | Goes to the adult, the organisation, or the guardian for a minor. The seeker can share more (consent) or decline. Never free messaging. |
| **Offer** | A funder proposes support | Fund, line items, amount (capped at the request's remaining amount, or at the Fund's maximum per agreement when there is no request), funding type, purpose, **a written reason linked to the Fund's published criteria**, conditions, release schedule, reporting duty, deliverables (commercial only, at most 3), acceptance window | Goes to the adult, the organisation or the guardian. Accept · Decline · Request changes. An offer becomes a funding agreement only when accepted. |
| **Funding agreement** (internal name; the centre of the product) | The agreed support, whatever its route | Recipient, funder, Fund, **origin** (Application · Offer · Existing agreement), funding type and behaviour (§4), amount (or items and declared value), instalments, conditions, Update schedule, deliverables (commercial only), agreement version, accepted by and when, status | Every route ends here. The interface calls it by its type ("Scholarship award", "Sponsorship agreement", …), never "Award" generically. Accepting records name, date and agreement version (no e-signature). |
| **Ledger entry** | A money event on one agreement | Type (commitment, release, release reversed, receipt confirmed, receipt disputed, expense reported, expense verified, expense queried, expense rejected, carried-in released, carried-in reported, cancellation), amount and currency, date, by, reference, document | Belongs to exactly one agreement (I5). Append-only; corrections are new entries with a reason. Duplicates blocked (§6.3). |
| **Update** | A recipient's submission | Expense lines (amount, category, date, document, allocation), progress records (results with documents, coach-attested training, milestones), deliverable evidence (commercial), photos (only with consent), short note; for programmes, session totals, evidence and narrative | Expenses, progress and deliverables can be sent together **or separately**. |
| **Review** | A human decision on an agreement | Outcome (Continue · Continue with conditions · Pause next release · Close), optional "Invite to renew", reason, conditions, by, date | Always shows who decided and why. Renewal reopens the Apply form prefilled. |
| **Shortlist** | A funder's private list of profiles, requests and initiatives | Items, notes (private), who added | Lives in the funder's private workspace; never visible to the seeker. |

**Supporting records:** Person; Membership (permissions); Representative authorisation (guardian or adult athlete →
coach powers); Consent record (purpose, decision, by, when, withdrawn); Verification (fact, method, document, verifier,
date); Document; Programme (targets, sites); Session record; Deliverable; Exception and action; Recovery plan; Report;
Block; Report of concern; Audit event; Notification (simulated, in-app only).

## 3. Shared discovery and private workspaces

### 3.1 Two connected environments

| | **Shared discovery environment** | **Private workspaces** |
|---|---|---|
| Purpose | Find each other: funding opportunities, participating funders and sponsors, consenting athletes, organisations and initiatives, funding requests | Run the relationship: confidential applications, verification, evaluation, approvals, agreements, releases, expenses, progress, delivery, reports, permissions, audit |
| Who sees it | Every registered user, filtered by visibility rules and the viewer's role; public opportunities and funder profiles also through a share link without signing in | Only members of the owning organisation (or the person), plus the counterpart's purpose-limited view (§8) |
| Contents | Published Opportunities (Public; Restricted ones only to named organisations); funder profiles; adult athlete profiles that chose to be discoverable (discoverable fields only); organisation and initiative profiles; funding requests (adults and organisations in full, minors as anonymised cards) | Drafts, applications received, reviewer notes, rubric scores, shortlists, ledgers, updates, reports, internal permissions |
| Rule | Nothing personal is shown that the owner has not marked discoverable | Private workspaces never restrict discovery: any participating funder can be found by any seeker, and vice versa |

A person or organisation can hold several workspaces' roles (a federation seeks and provides funding). **Honesty in
discovery:** listings are labelled "Participating on Revivo Impact"; the product never claims a comprehensive list of
sponsors or funding. External sponsorship intelligence is a possible future feature and would be labelled as
externally sourced.

### 3.2 Registration and onboarding (open, free for seekers)

Nobody needs an invitation, an existing funding relationship or a Revivo Pathway account. Sign-in is simulated
(email code).

| Path | Steps (each one question per screen) | Result |
|---|---|---|
| **Adult athlete** (18+) | Who are you? → Your sport and level → What support are you looking for? → Your profile basics (prefilled later by documents) → Who can see your profile? (discoverable: Yes/No, equal buttons) | Profile with self-reported facts; "Matched for you" appears at once |
| **Parent or guardian** registering a minor | Who are you? → About the athlete (first name, date of birth, sport) → Your role (guardian declaration; simulated check) → Consent per purpose → Optionally add a coach | Guardian account managing the minor; no discoverable profile for the minor |
| **Coach** | Who are you? → Sport and organisation → Ask an athlete or guardian to authorise you (by invite code) | Coach account; sees only athletes who authorised them |
| **Organisation** | Organisation type → Sports and regions → "We want to: seek funding · provide funding · both" → Members and permissions → Verification request (simulated) | Organisation with one or two modes; unverified until checked |
| **Individual sponsor** | Who are you? → Sporting interests and budget range → Identity and safeguarding declaration (simulated) → Accept requests? | Verified individual sponsor after the (simulated) check |

**Verification states** (organisations and individual sponsors): Not yet verified · Verification requested · Verified
(simulated check by the platform). Only verified funders can publish Public opportunities, send offers or see
anonymised minor requests. Seekers can apply to any published opportunity once registered.

### 3.3 Contact and anti-spam controls

- **No free messaging anywhere.** Contact is structured: applications, nominations, requests to a funder, expressions
  of interest, offers and templated questions, each with an audit entry.
- **Support asks** only where the funder's profile accepts them, and only if the ask fits the funder's stated sports,
  regions, funding types and range (checked before sending). Limits: one open ask per funding request per funder; at
  most 5 open asks per seeker at a time; each funder sets a cap on open asks it will receive (20 by default); a funder
  that answers "Not now" cannot be asked again about the same request for 90 days.
- **Expressions of interest** count against a funder's weekly limit (20 in the prototype) and must state a template
  reason; minors' cards accept offers and templated questions only, routed to the guardian.
- **Block** (any seeker can block a funder: no further contact or visibility of their discoverable profile and
  requests; an existing agreement continues, but the blocked funder can send no new offers or questions and the
  platform administrator is told) and **Report a concern** (to the platform administrator, simulated safeguarding
  review) are on every contact.

### 3.4 The reusable athlete profile

Each fact has a **visibility** and a **verification state**.

| Visibility | Meaning |
|---|---|
| **Discoverable** | Shown in Discover to registered verified funders (adults only) |
| **Shared on application** | Shared only with a funder the athlete applies to or accepts an offer from, as ticked per application |
| **Private** | Never shared |

| Verification state | Chip |
|---|---|
| Verified | "Verified by [person] · [organisation] · [date]" with the method (document, federation results list) |
| Confirmed by a federation or club | "Confirmed by Ardent Judo Federation · 20 Apr": a Verify user at the athlete's federation, club or academy confirms the fact once, and every funder sees it, so the athlete is not checked again for each application |
| Attested by coach | "Attested by K. Mori (coach) · [date]": training attendance and similar facts; never shown as "Verified" |
| Awaiting verification | "Awaiting verification" |
| Self-reported | "Self-reported" |
| Imported (optional) | "Verified in Revivo Pathway · imported [date]" (Explore only, §11) |

**Commercial profile (adults only, optional).** An adult athlete open to commercial partners can add: social media
links (as text; no live integration), self-reported audience figures (always labelled "self-reported"), previous
brand partnerships, available promotional activities and the deliverables they would agree to. It is shown only to
sponsors in a commercial sponsorship context (Corvane, Fennick); it never affects eligibility, scholarship or
development funding decisions, or the order of any Discover list; there are no automated valuations or analytics.

There is no single "verified athlete" badge. A profile summary says, for example, "4 facts verified · 3 self-reported".
No unnecessary sensitive data: no medical details, no financial documents beyond a statement of need and budget
lines, no ID numbers (ID documents are viewable by Verify users only and never stored as numbers).

### 3.5 Funder and sponsor profiles (useful to seekers)

Organisation type · sporting interests and funding objectives · sports supported · regions · funding types · typical
support range · open and upcoming opportunities · eligibility in brief · **Accepts support asks: Yes (what, from whom,
up to how much) · Commercial proposals only (adult athletes and clubs) · Only through opportunities · Not at present** ·
verification state · "Participating since".
Seekers can filter funders by sport, region, funding type and "accepts requests".

## 4. Funding types, behaviours and the sports boundary

### 4.1 What the interface calls each agreement

One underlying record; the label follows the funding type (six types, as the founder's D7 lists). Four behaviours
decide what is tracked. Support that starts from a funding request takes the type of its Fund (for example Oriel
Athlete Support and Halvorsen Athlete Support are Development grants).

| Funding type (interface name) | Typical sporting purposes (§4.4) | Behaviour | What is tracked | Counts in |
|---|---|---|---|---|
| **Scholarship award** | Scholarship, athlete development, dual-career support | Athlete development | Cash ledger, expenses, sporting progress | Development totals |
| **Development grant** | Athlete development, talent development, coach education, academy fees, nutrition and welfare, sports medicine and rehabilitation | Athlete development | Cash ledger, expenses, sporting progress | Development totals |
| **Competition funding** | Competition participation and travel, training camps | Athlete development | Cash ledger, expenses, results | Development totals |
| **Programme grant** | Grassroots and community programmes, talent development programmes, infrastructure and facilities projects | Programme | Cash ledger, delivery targets (sessions or milestones), evidence, outcomes | Programme totals |
| **Equipment support** | Sports equipment, kit, facility items | In-kind (or cash if money is given for equipment, then Athlete development) | Items pledged and delivered, a declared value | Separate in-kind column only (I7) |
| **Sponsorship agreement** | Individual athlete sponsorship, team and club sponsorship, commercial sports sponsorship | Commercial | Payments plus up to 3 deliverables owed by the recipient | Reported separately; never in development, programme or impact totals (I7) |

"Existing funding agreement" is an **origin**, not a type: any type can arrive that way. The interface shows type and
origin as two chips.

### 4.2 Standard terms

- **Scholarship awards and development grants:** a clean-sport declaration, the funder's code of conduct, and what
  happens if the athlete stops competing (the funder reviews the next release; nothing is clawed back automatically).
  Progress updates offer "Unable to compete this period (reason not shared)", so injury or illness never needs medical
  details.
- **Sponsorship agreements:** term, payments, up to three deliverables, existing sponsors and category conflicts,
  excluded categories (for example alcohol or gambling), usage rights for images, and which payments depend on which
  deliverables being accepted.
- **Costs count only inside the agreement's cost period** (I13).

### 4.3 Commercial is kept apart

Development funding supports participation or development; commercial sponsorship buys agreed promotional activity.
The product never merges them: separate totals, separate chips, separate chain (§10), and Discover shows commercial
interest only on adult athletes' and organisations' profiles. It never claims CSR eligibility, tax treatment or
regulatory compliance.

### 4.4 The sports-only boundary (deterministic check)

Every Opportunity, funding request, organisation profile and programme must name **a sport** (from the sport list)
and **a sporting purpose** from this list: Sports scholarship · Athlete development · Individual athlete sponsorship
· Team and club sponsorship · Competition participation and travel · Coaching and training support · Sports equipment
· Training camps · Academy fees · Nutrition and athlete welfare · Sports medicine and rehabilitation · Grassroots and
community sports programmes · Talent development · Coach education and development · Sports infrastructure and
facilities · Commercial sports sponsorship · Dual-career education (sport-linked) · Other sporting initiative.

- **Dual-career education** is allowed only on an athlete's profile or for a named athlete, with the sport recorded; it
  is never a general academic scholarship.
- **Other sporting initiative** needs a written sporting rationale and a (simulated) platform check before it is
  published.
- **Sports medicine and rehabilitation** records providers and costs only; never diagnoses or medical details.
- The check blocks publication with a plain reason ("Revivo Impact is for sport. Add the sport and the sporting purpose
  this funding supports.").

## 5. Participants, roles and permissions

### 5.1 Account types

- **Person accounts:** adult athlete (18 or over); guardian (manages one or more minors); coach (manages athletes who
  authorised them); individual sponsor (verified). One account can manage several athletes through a switcher
  ("Managing: Tiago ▾").
- **Organisation accounts:** members hold permissions. An organisation can **seek**, **provide** or **both**; an
  organisation that does both switches mode ("Seeking funding · Providing funding"), never a merged menu. A federation
  can publish a scholarship and seek programme funding at the same time.
- **Minors** (under 18, `07` D10) have no login in the prototype. A guardian registers and represents them.
- **Platform administrator:** organisation and sponsor verification (simulated), safeguarding checks on minors'
  cards, reports of concern, audit.

### 5.2 Permissions on organisation members

| Permission | Allows |
|---|---|
| **Admin** | Members and permissions, organisation profile and consent, audit view for the organisation |
| **Review** | Assess applications, score the rubric, shortlist, request information, express interest, record routine review decisions (Continue, Continue with conditions), accept programme reports, record existing funding, nominate athletes |
| **Verify** | Verify profile facts, documents and expenses; verify session records (operator side) |
| **Approve** | Publish opportunities, approve decisions, send offers, approve a commitment (including existing funding and its carried-in figures), approve recovery plans, Pause next release, Close |
| **Finance** | Record releases, verify expenses, see full ledgers |
| **Manage programme** | Run a programme: targets, sites, actions, recovery plans, updates and reports |
| **Record sessions** | Record sessions and attendance counts for their own sessions only |

Any member may draft. Anyone may hold several permissions. How many people must be involved is set by the Fund's
**approval policy** (§5.7), so a small company or an individual sponsor is not forced through a foundation's process.
An individual sponsor holds Review, Approve and Finance over their own agreements; their releases are flagged
"single-person sponsor", and the recipient's receipt confirmation is the second check.

### 5.3 Who can do what

✓ = can · P = can prepare only · — = cannot. Rows marked * are subject to four-eyes (§5.4).

| Action | Adult athlete | Guardian (for a minor) | Coach (authorised) | Funder member / individual sponsor | Seeking organisation member | Platform admin |
|---|---|---|---|---|---|---|
| Register; edit own profile | ✓ | ✓ (minor's profile) | own coach profile | own funder profile | ✓ (Admin) | — |
| Choose what is discoverable | ✓ | — (minors are never discoverable) | — | own profile | ✓ (Admin) | — |
| Publish a funding request | ✓ | ✓ (anonymised card) | — | — | ✓ (Admin) | — |
| Send a support ask | ✓ | ✓ | P (adults who granted it) | — | ✓ | — |
| Confirm a fact on an athlete's profile | — | — | — | Verify (federation, club, academy of the athlete) | Verify (own athletes) | — |
| Prepare an application | ✓ | ✓ | P (if granted) | — | ✓ | — |
| Submit an application | ✓ | ✓ | — | — | ✓ (Admin or Manage programme) | — |
| Nominate an athlete (from own roster, or with a guardian's code; never by search) | — | — | ✓ (adults; minors need the guardian's acceptance) | Review (federations, clubs) | Review | — |
| Accept, decline or request changes to an offer | ✓ | ✓ | — | — | ✓ (Approve) | — |
| Confirm receipt of a release | ✓ | ✓ | — | — | ✓ (Finance or Admin) | — |
| Submit an Update | ✓ | ✓ | ✓ (if granted "Submit updates") | — | ✓ (Manage programme) | — |
| Change or withdraw consent; block a funder; report a concern | ✓ | ✓ | report only | report only | ✓ (Admin) | — |
| Import from Revivo Pathway (Explore only) | ✓ | ✓ | — | — | — | — |
| Shortlist; express interest | — | — | — | Review | — | — |
| Draft an Opportunity | — | — | — | ✓ | — | — |
| Publish an Opportunity* | — | — | — | Approve | — | — |
| Verify a fact, document or expense | — | — | attest training only | Verify or Finance | Verify (sessions) | — |
| Score, shortlist applicants, request information | — | — | — | Review | — | — |
| Approve decisions and send them* | — | — | — | Approve | — | — |
| Send an Offer (above the Fund's delegated limit needs a second Approve)* | — | — | — | Approve | — | — |
| Record a release | — | — | — | Finance | — | — |
| Mark a sponsorship deliverable accepted | — | — | — | Review or Approve | — | — |
| Record or verify a session | — | — | — | — | Record sessions / Verify | — |
| Approve a recovery plan* | — | — | — | — | Approve | — |
| Draft a report | — | — | — | — | Manage programme | — |
| Accept a report* | — | — | — | Review | — | — |
| Record a review decision (Continue / with conditions) | — | — | — | Review | — | — |
| Pause next release or Close* | — | — | — | Approve | — | — |
| Add existing funding (recipient confirms)* | — | — | — | Review prepares; Approve approves | — | — |
| Verify an organisation or sponsor (simulated); safeguarding check; handle reports of concern | — | — | — | — | — | ✓ |
| View the audit | own records | minor's records | own actions | own organisation (Admin, Approve) | own organisation | all (metadata) |

### 5.4 Fixed rules (every screen)

- **Four-eyes.** The person who prepared something cannot approve it: opportunity drafts, award recommendations,
  recovery plans, expenses (the submitter cannot verify their own) and reports. Self-approval is blocked with the
  reason ("You prepared this. A different person must approve it."). Returning something requires a reason.
  Cross-organisation four-eyes counts: the operator prepares a report, the funder accepts it.
- **Delegated offer limit.** A Fund can let one person with Approve send offers up to a set amount (Oriel Athlete
  Support: $2,000); larger offers need a second Approve.
- **Representatives.** A guardian (or an adult athlete) can grant a coach only two powers per athlete: *Prepare
  applications* and *Submit updates*. A coach can never submit an application for a minor, accept or decline offers,
  change consent or publish funding requests for a minor. Every representative action is audited "on behalf of".

### 5.5 Seekers and funders in one organisation

An organisation in both modes keeps two separate private workspaces: what it receives (its applications and
agreements as a recipient) and what it gives (its Funds, applicants and portfolio). Totals never mix the two.

### 5.6 Verified individual sponsors (light)

A verified adult (for example a former athlete or business owner) can publish a funder profile, accept support asks
and make structured offers to **adult athletes, teams, clubs and programmes**. They do not publish opportunities;
their navigation is Overview · Discover · Asks & offers · Funding.

**Young athletes (founder's refinement, 25 Nov 2026).** Individual sponsors never have unrestricted or direct access
to minors, but young athletes without a club are not excluded. An individual sponsor can support a minor only
**through an authorised representative**: the parent or legal guardian (an anonymised funding request they
published), or a club, academy, federation or recognised sports foundation acting for the athlete. To see minors'
anonymised cards at all, the sponsor must hold an **enhanced safeguarding check** (simulated; Marcus Halvorsen holds
one). Every offer from an individual sponsor to a minor first goes to a **platform safeguarding review** (simulated,
by the platform administrator) and only then to the guardian; all contact stays structured and goes to the
guardian; the sponsor learns the athlete's first name only after the guardian accepts and never receives photos of
the minor. Commercial sponsorship of under-18s stays outside the prototype. No public solicitation, donations or crowdfunding; payments are simulated. Production identity checks, safeguarding vetting, tax and cross-border rules need separate validation.

### 5.7 Approval policies (configurable per Fund)

One funding workflow, three levels of control. The Fund's owner chooses a policy when creating the Fund; the
interface shows it on every offer and agreement ("Approval: Institutional").

| Policy | Who must act | Typical use | Prototype Funds |
|---|---|---|---|
| **Simple** | One person with Approve can offer, accept a deliverable and record a release; an optional delegated limit sends larger offers to a second approver; the recipient's receipt confirmation is the second check | Individual sponsors, small companies, straightforward athlete support, commercial sponsorship | Oriel Athlete Support ($2,000 limit), Halvorsen Athlete Support, Corvane Athlete Partnerships, Fennick Athlete Partnerships |
| **Standard** | Publishing and award decisions need a second person (four-eyes); one reviewer per application; finance may be the approver | Company and federation funds, small grant rounds | Women's Sporting Development Fund, Ostral Competition Travel Grant, Coastal Region Athlete Travel Bursary, Ardent Camp Support, Verran grants, Oriel Kit Scheme |
| **Institutional** | Two reviewers per application (gap flags), a different approver, and finance separate from the approver (the approver never records the release); existing funding needs Approve | Large foundation rounds and programme grants | Tallwater: Emerging Athletes Scholarship, Community Sports Programme Grant, Federation Development Grants |

Direct offers follow the same policy: under Standard and Institutional every direct offer waits for a second person
with Approve at the funder before the recipient sees it; under Simple it goes straight to the recipient unless the
offers from that Fund to that recipient together pass the delegated limit (splitting an offer does not avoid it). An
offer not yet accepted can be withdrawn by the funder with a reason; a recipient can decline without giving one.

Under every policy: nobody approves their own draft or recommendation; every action is in the audit; caps, holds,
the sports-only check and invariants I1–I13 always apply.

## 6. Financial state model

### 6.1 Definitions

Per agreement, rolled up per Fund, per funder and per recipient. **All amounts are summed from ledger entries; no total
is stored.** Funder screens use the terms below, each with a one-line definition on tap. Seeker screens use plain
words.

| Term (funder) | Definition | Seeker wording |
|---|---|---|
| **Announced** | The amount a funder has publicly set aside for a Fund. Not a liability. | "Funding available" |
| **Held for offers** (internally *Reserved*) | Offers approved but not yet accepted. Acceptance window 14 days by default; Approve may extend once, with a reason. Expired or declined offers release their reservation. | "Offered to you" |
| **Committed** | Agreements approved by the funder *and* accepted by the recipient, net of cancellations. Includes amounts already released and carried-in commitments of existing agreements. | "Agreed" |
| **Available to award** (remaining available funds) | Announced − Held for offers − Committed. | — |
| **Released** | Disbursements *recorded* by the funder's Finance user (simulated, with a reference). | "Paid to you" |
| **Received** | Releases the recipient confirmed. A confirmation, not bank verification. | "You confirmed you received it" |
| **Outstanding commitment** | Committed − Released. | "Still to come" |
| **Expenditure reported** | Expense lines submitted against the agreement, excluding rejected lines. | "Spent (you told us)" |
| **Expenditure verified** | Reported lines whose document a Finance or Verify user has checked. | "Spent (checked)" |
| **Awaiting verification** | Reported − Verified (includes lines with a query). | "Being checked" |
| **Unspent, held by recipient** (of released) | Released − Reported, when positive. | "Not spent yet" |
| **Reimbursable** | Reported − Released, when positive (spending ahead of a release). Shown, never hidden. | "Spent before payment" |
| **Request: Requested** | The amount a funding request asks for. | "You asked for" |
| **Request: Pledged** | Sum of accepted offers on the request (each one an agreement). | "Promised" |
| **Request: Received** | Released *and* receipt confirmed, on those agreements. | "Received" |
| **Request: Covered from other sources** | Line amounts the owner marks as paid from elsewhere (own money, another source outside Revivo Impact). Not an agreement; never in any funder's totals. | "Paid another way" |
| **Request: Held** | Amounts of a linked application still waiting for a decision. | "Waiting for a decision" |
| **Request: Remaining** | Requested − Pledged − Covered from other sources − Held. The only amount new offers can fill. | "Still needed" |
| **In-kind** | Items and a *declared* value, in a separate column labelled "declared value, not cash". Never added to cash totals. | "Equipment promised / delivered" |
| **Carried in** | Released and reported amounts from before an existing agreement came onto Revivo Impact. Counted in Released (always shown split: recorded in Revivo Impact + carried in) and in the Fund's Committed; labelled "carried in, not verified in Revivo Impact" and excluded from Verified. | "Before Revivo Impact" |
| **Deliverables** (commercial) | Promotional obligations owed by the recipient: Scheduled · Evidence submitted · Accepted · Missed (reason). Not money. | "What you agreed to do" |

### 6.2 Invariants (unit-tested; property-based)

1. **I1** Per Fund: Available to award ≥ 0. An approval or offer that would break this is blocked, and the screen says
   by how much.
2. **I2** Per agreement: Released ≤ Committed.
3. **I3** Per agreement: Verified ≤ Reported ≤ Committed. Spending ahead of release is shown as "reimbursable".
4. **I4** Per funding request and per line item: Pledged + pending offers + Covered from other sources + Held ≤
   Requested. An offer is capped at the remaining amount when it is entered.
5. **I5** Every ledger entry belongs to exactly one agreement; every agreement to exactly one Fund. An expense line is
   one document whose allocations add up to its amount; each allocation goes to one agreement or to "Other sources
   (not an agreement)", which never enters any funder's totals.
6. **I6** Platform, funder and recipient totals sum agreements. They never add requests and agreements together; a
   request's Pledged amount is a *view* of its agreements.
7. **I7** Commercial and in-kind entries never enter development or programme cash totals, or reports of outcomes.
8. **I8** Every figure on screen is calculated from records and is a "See source" button.
9. **I9** Per agreement: Received ≤ Released; a receipt confirmation always refers to one recorded release.
10. **I10** Totals are grouped by currency and never add different currencies (§6.4).
11. **I11** Four-eyes on events: no approval, verification or acceptance event is by the person who prepared the record
    (§5.4); under the Institutional policy the person who approved an offer or commitment does not record its release
    (§5.7); single-person releases are flagged in the audit.
12. **I12** In-kind: items delivered ≤ items pledged, per agreement and per Fund.
13. **I13** An expense counts only if its date falls inside the agreement's cost period (for a scholarship, from
    acceptance to the end of the term); earlier costs are shown as "outside the cost period".

Also enforced by rule: an award amount must be one of the Opportunity's published tiers (or ≤ its maximum); a Fund
cannot exceed its published number of awards. When an entry breaks several rules, the screen shows them in this
order: the request cap (I4), the Fund's money (I1), then the delegated limit.

### 6.3 Preventing duplicates and double funding

- A release reference can be recorded once per agreement; a second identical release is blocked ("Already recorded on
  Thu 6 May by P. Nair").
- An expense with the same document, amount and date on the same agreement is blocked; on another agreement it is
  flagged for a person.
- One application per athlete per Fund; a duplicate is blocked with a link to the first.
- The "Other funding for the same costs" declaration is required on every application and request; undeclared current
  support found on the profile is flagged (by rule; explained by AI C).
- Offers on a funding request are capped (I4), line by line; a request becomes "Fully pledged" automatically and leaves
  Discover.
- An application linked to a funding request holds its amount, so the same money cannot be offered twice while a
  decision is pending; the hold is released if the application is not funded.
- A release can be reversed only by a new "release reversed" entry with a reason; a recipient can mark a release "not
  received", which flags it for both sides (never resolved automatically).

### 6.4 Currencies (architecture)

Every amount is stored as `{ currency, minor units }`; every Fund has one currency; every total is computed per
currency. Screens show one total per currency and never a combined figure. The demonstration dataset is USD only.
Adding a currency means authoring amounts for it, never converting.

### 6.5 Worked examples (state at Wed 30 Jun 2027 unless stated)

**Fund: Emerging Athletes Scholarship (Tallwater Sports Foundation).**

| Line | Amount |
|---|---|
| Announced | 250,000 |
| Committed: 45 accepted scholarship awards | 211,000 |
| Reserved: 1 offer awaiting acceptance ($3,500; window extended to Thu 15 Jul at the guardian's request) | 3,500 |
| **Available to award** | **35,500** (250,000 − 211,000 − 3,500) |
| Released: instalment 1, 50% of each accepted award | 105,500 |
| **Outstanding commitment** | **105,500** |

The 46 offers are 27 × $5,000 + 13 × $4,500 + 6 × $3,500 = $214,500: the 45 accepted ($211,000) plus the 1 held for an offer
($3,500).

**Scholarship award: Amira Haddad** (requested $4,800; awarded $4,500, the panel's tier).

| Entry | Amount | State |
|---|---|---|
| Committed (accepted Thu 6 May) | 4,500 | Outstanding 4,500 |
| Released: instalment 1 (6 May; receipt confirmed) | 2,250 | Outstanding 2,250 |
| Expense: coaching fees, May–Jun (invoice) | 900 | Verified |
| Expense: Continental U21 Invitational, entry (receipt) | 180 | Verified |
| Expense: Continental U21 Invitational, travel (receipt) | 640 | Verified |
| Expense: competition judogi (receipt missing) | 210 | Awaiting: query "Add receipt" |
| **Reported / Verified / Awaiting** | **1,930 / 1,720 / 210** | |
| **Unspent, held by Amira** | **320** (2,250 − 1,930) | |

**Funding request: Nadia Kovač, racing wheels and competition travel** (adult; Public; two line items).

| Line | Requested | Pledged (agreement) | Covered from other sources | Remaining at 6 May | Remaining at 30 Jun |
|---|---|---|---|---|---|
| Racing wheels | 3,400 | 2,000 (Oriel Athlete Support) | 1,400 (marked 30 Jun) | 1,400 | 0 |
| Continental Para Athletics Series travel | 1,800 | 1,200 (Marcus Halvorsen) | — | 600 | 600 |
| **Total** | **5,200** | **3,200** (both released 6 May; Nadia confirmed both) | **1,400** | **2,000** | **600** |

**Funding request: Tiago Esteves, competition travel** (minor; anonymised card; published by Rosa Esteves, his guardian).

| Item | Amount |
|---|---|
| Requested (flights 1,350 + accommodation 650 + entry 150 + team kit levy 250) | 2,400 |
| Pledged: Oriel Freight Group (Oriel Athlete Support) | 1,500 |
| Received (release recorded, Rosa confirmed) | 1,500 |
| Held for the pending Ostral application (prepared by Jonas, submitted by Rosa, 6 May) | 900 |
| Remaining open to offers | 0 (900 before the application) |

Further offers were capped at $900 until the Ostral application held it. Each pledge is counted once, as an agreement in the funder's portfolio; the
request view shows it as pledged, never a second time.

**Sponsorship agreement: Corvane Sportswear → Jonah Reyes** (adult sprinter; commercial). $6,000 for 12 months
(Thu 6 May 2027 – Fri 5 May 2028): $3,000 released on signing (6 May, received); $3,000 due Wed 1 Dec 2027 once
deliverables 1 and 2 are accepted. No category conflict (Jonah has no other kit sponsor); image usage rights for the
term. Deliverables: (1) wear
Corvane competition kit at 4 meets: 2 of 4 evidenced and accepted; (2) one coaching clinic at a community club by Thu
30 Sep 2027: scheduled; (3) one content day by Fri 31 Mar 2028: scheduled. Reported only in Corvane's commercial
column.

**Fund: Women's Sporting Development Fund (Corvane Sportswear)** — the I1 block in Explore. Announced $40,000;
committed 12 grants (8 × $3,000 + 4 × $3,500 = $38,000); available $2,000. Approving a further $3,000 grant is
blocked: "This would exceed the money available by $1,000."

**Programme grant: Play Every Day** (Tallwater Community Sports Programme Grant → Lanternfield Community Sport).
Committed $60,000 for 12 months; tranche 1 released $12,000. Quarter spend reported $10,800 (coaching $6,480 +
equipment $1,800 + venue and transport $1,500 + monitoring and evaluation $1,020); verified $10,368; awaiting $432 (a
transport claim without a receipt); 96% documented; unspent $1,200.

**Existing agreement: Ostral Swimming Federation** (Tallwater Federation Development Grants; Journey D). Committed
$24,000. Carried in: released $12,000, reported $10,400 (labelled "carried in, not verified in Revivo Impact";
Verified $0). Outstanding $12,000. Next Update due Thu 30 Sep 2027.

**Equipment support: Oriel Kit Scheme.** 60 kits, declared value $9,000 ($150 per kit); 36
delivered by 30 Jun. Shown only in the in-kind column with "declared value, not cash".

## 7. Consent, minors and safety

### 7.1 Consent purposes

Consent is per purpose with equal Yes and No buttons, nothing pre-selected, and "Change or withdraw" always visible
(Pathway's component). Refusal is respected, never nagged.

| Purpose | Who decides | Effect of withdrawal |
|---|---|---|
| **Discoverable profile** (adults and organisations) | Adult athlete; organisation Admin | Removed from Discover immediately; shortlists show "No longer discoverable"; existing applications and agreements are unaffected. |
| **Funding request visible in discovery** | Owner (guardian for a minor) | The request or anonymised card leaves Discover at once; offers already made stay valid until they expire. |
| **Share this application with [funder]** (per application, field list visible) | Adult athlete or guardian | Before a decision: withdraws the application, after a warning. After an award: falls back to the agreement's reporting fields. After an unsuccessful decision: the funder keeps only the reference, outcome and scores for its selection record. |
| **Progress reporting to my funders** | Adult athlete or guardian | The funder sees "Progress sharing paused by the athlete" (or "by the guardian"); the agreement is flagged for a *human* review; nothing is penalised automatically. |
| **Photos and stories** in updates, deliverables and reports | Adult athlete or guardian; participants' guardians for programmes | Photos are removed from every update, evidence view and draft report at once; the audit keeps a reference with no content. |
| **Import from Revivo Pathway** (per import) | Adult athlete or guardian | Removes the imported records; anything already submitted keeps a "source removed" note. |

### 7.2 Minors (under 18)

- A guardian registers the minor; there is no public or searchable profile, ever.
- Funders can reach a minor only through: (a) an **anonymised funding request** the guardian published (§7.3); (b) an
  application the guardian authorised and submitted; (c) a **nomination** by a federation, club, academy or authorised
  coach, which the guardian accepts before anything identifiable is shared. A nominator chooses only athletes on its
  own roster (members) or with a code the guardian gives; nomination is never a way to search for minors.
- Offers, templated questions and receipt confirmations go to the guardian: "This offer goes to the athlete's guardian.
  The sponsor cannot contact the athlete directly."
- A funder learns the minor's first name only after the guardian accepts an offer or submits an application; full name
  only on the agreement, visible to Approve and Finance users.
- Disclosure is purpose-specific: a funder evaluating an authorised application sees only the fields needed for that
  decision; a funder monitoring a community programme sees aggregates only.
- **No commercial sponsorship of minors in the prototype** (production: only through the guardian, subject to each
  jurisdiction's rules on contracts with minors).
- Individual sponsors see minors' anonymised requests only with an enhanced safeguarding check, and their offers to
  minors pass a platform safeguarding review before reaching the guardian (§5.6).
- Coaches act only within the powers a guardian granted (§5.4). Every view of a minor's record is audited.
- Guardians can **withdraw consent**, **hide a request from discovery**, **block a funder** and **report a concern**
  at any time; each takes effect at once.

### 7.3 The anonymised card and the identifiability check (deterministic)

An anonymised card shows only: sport · broad age group (Under 14 · 14–15 · 16–17) · broad region · type of support ·
one category total and what is still needed · the month needed · which facts are verified and by what kind of
organisation (not the facts or documents themselves). Never a name, photo, club, school, exact age, date of birth,
exact date, competition name, line breakdown or free text. "See source" on a card never opens a document.

Before publication the **identifiability check** counts registered athletes sharing the card's sport, age group and
region. If fewer than 10 share it, the region widens to "Any region"; if still fewer than 10, the card cannot be
published and the guardian is told why. The platform administrator's safeguarding check (simulated) is recorded on the
card ("Checked for identifying details · 6 May").

## 8. Purpose-based access (who sees what)

| Viewer | Sees |
|---|---|
| Anyone with a share link (not signed in) | Public opportunities and funder profiles only |
| Seeker browsing Discover | Published opportunities (Public, and Restricted ones naming their organisation); funder profiles; other organisations' public initiatives. Never other athletes. |
| Funder browsing Discover | **Adults:** discoverable fields only, if they chose to be discoverable; never contact details. **Organisations:** discoverable initiatives and requests. **Minors:** never a profile; only anonymised cards (verified organisation funders only). |
| Funder evaluating an application submitted to them | Only the fields the applicant (or guardian) ticked: typically name (a minor's first name only), age, sport, region, results, documents, budget, other funding declared and statement. ID documents visible to Verify users only. Never a minor's contact details. |
| Funder with an agreement | The shared fields, plus Updates while "Progress reporting" consent is on. |
| Programme-only funder | Aggregates and session counts. Never participant names, individual attendance or unconsented photos ("Participant details are not shared with funders"). |
| Operator staff | Their own participants; a coach sees the register for their own sessions only. |
| Platform administrator | Organisation and sponsor records, safeguarding checks, reports of concern, audit metadata; not athletes' documents. |

## 9. Lifecycles, statuses and rules

### 9.1 Statuses

| Record | Statuses |
|---|---|
| Opportunity | Draft → Awaiting approval → Published: Upcoming · Open → Closed (deadline passed) → Decisions sent → Completed |
| Application | Draft → Submitted → In review → More information needed → Shortlisted → Decided: **Offered** · **Waiting list** · **Not selected** · **Not eligible** (rule, with reason) · **Incomplete at deadline**; also **Withdrawn** |
| Nomination | Nominated → Accepted by athlete or guardian (becomes an application) · Declined |
| Funding request | Draft → (Safeguarding check, minors) → Open → Partly funded → Fully pledged → Closed; Hidden from discovery (owner's choice) |
| Support ask | Sent → Answered: Offer made · Question asked · Not now; Expired (30 days) |
| Expression of interest | Sent → Seeker shared more · Seeker declined · Expired |
| Offer | Offered (Reserved) → Accepted (Committed) · Changes requested · Declined · Expired · Withdrawn |
| Funding agreement | (Existing agreements only: Awaiting recipient confirmation →) Active → Update due → Under review → Active (Continue) · Active with conditions · Release paused · Closed |
| Expense line | Reported → Verified · Query (awaiting) · Rejected (with reason; excluded from Reported) |
| Deliverable | Scheduled → Evidence submitted → Accepted · Returned (reason) · Missed (reason) |
| Session | Scheduled → Delivered (recorded by coach) → Verified · Couldn't run (reason) |
| Recovery plan | Draft → Submitted → Approved · Returned (reason) |
| Report | Draft → Claims check → Submitted → Accepted · Returned (reason) |

Never "rejected" or "failed" in anything a seeker sees.

### 9.2 Eligibility (deterministic)

Rules are published with the Opportunity and evaluated against the profile and application. Result per criterion:
met, not met (with reason) or check needed (evidence outstanding). Overall: **Eligible**, **Not eligible** (with the
reason) or **Check needed**. Rule types: age range on a date; sport in a list; region in a list; result at or above a
level within a period; para classification present; document present; statement present; coach or club referee
present. Copy always adds: "Eligibility is checked against the funder's published rules. Meeting them doesn't
guarantee an award; a review panel decides."

**Inconsistency rules** (found by rule, explained in words by AI C): profile lists current support not declared under
"Other funding"; budget lines do not add up to the requested amount; a document's date of birth differs from the
profile; the same athlete applies twice to one Fund.

### 9.3 Selection

One rubric of 4 criteria scored 1–4 (16 points): sporting level and trajectory; financial need; clarity of the plan
for the money; coach or club support. **Two reviewers score each application** (from a panel of three); a gap of 2 or
more points on any criterion is flagged for a third look. Each reviewer declares conflicts of interest per
application. The **minimum score** to be offered is published (11 of 16 for the Emerging Athletes Scholarship).
**Tiers follow published criteria**, not discretion: $5,000 for international results or a national title; $4,500
for a national medal; $3,500 for a national final or a top-8 national ranking. A reviewer recommends; a different
person with Approve decides, watching the budget meter (I1) and the tier rule. Decisions are sent together. The
**waiting list** holds applicants who reached the minimum score but have one fact still to be verified; they are
offered an award if it is verified by the acceptance deadline and money remains. "Export selection record" produces a
printable record of the rules, scores, conflicts declared, decisions and who made them.

### 9.4 Discovery order (deterministic, never a merit ranking)

Lists are ordered by a **criteria-fit count** (how many of the viewer's stated criteria a row meets), then by deadline
or date needed, then alphabetically. Never by popularity, followers, appearance, sporting "potential" or any score of
a person. Each row says why it appears ("Matches: judo · Coastal Region · competition travel").

### 9.5 Monitoring rules (deterministic)

- Programme site status: ≥ 95% of scheduled sessions delivered = On track; 85–94% = Needs attention; < 85% = Behind.
  Shown as an icon plus a word.
- Alert: two consecutive missed sessions at one site.
- Reminders (simulated, in-app): Update due, missing receipt, offer expiring, deliverable due, report due.
- **Claims check** on reports: flags causal or impact wording ("improved", "transformed", "because of", "proves",
  "impact", a percentage without its sample size) and suggests neutral wording; a person rewords.

## 10. AI: exactly three simulated experiences

Every AI output carries the chip **"Simulated AI"** with the line "AI-assisted, simulated in this prototype. Check
against sources." A person confirms, edits or discards every output. AI only reads records the person is permitted and
consented to see.

| | AI A: Sports funding and opportunity matching | AI B: Application and funding-request help | AI C: Funder insights and reporting |
|---|---|---|---|
| **For** | Athletes, guardians, coaches, seeking organisations (opportunities **and** relevant sponsors); funders (athletes, funding requests, teams and initiatives) | Athletes, guardians, coaches, seeking organisations | Reviewers, funders, programme operators |
| **Does** | Seeker side: explains why an opportunity or a sponsor is suggested ("Matches your sport (judo), your national U21 bronze (to be verified) and your purpose (coaching and competition costs)"; "Oriel supports competition travel in Coastal Region and accepts requests"). Funder side: turns a plain-language brief into **visible, editable filter chips**. | Builds the document checklist by comparing requirements with the profile; drafts statements and funding requests **only** from records, each sentence linked to its source, gaps marked "[in your own words]"; flags missing documents. | Summarises an application or a request with sources; explains inconsistencies that rules found; "Ask Revivo" with suggested questions; summarises documented expenditure and progress; drafts reports from verified records, always listing exclusions and limitations. |
| **Order and results** | Lists and eligibility come from **rules**; order is the criteria-fit count (§9.4) | — | Every factual sentence is a linked chip to its record; every figure comes from the ledger |
| **Refuses** | Ranking people by merit, popularity, followers or appearance; "who deserves funding?"; inventing opportunities or sponsors; guaranteeing eligibility; searching records not consented as discoverable | "Make my situation sound worse", "add a result", any medical or financial invention: "I can only use information in your records." | "Did the scholarship improve performance?" → "Records can't show cause. 2 verified progress records this quarter, no comparison." "Did the programme improve confidence?" → "Records cannot show cause. 212 of 460 answered both surveys; this is self-reported change with no comparison group." |

**Guard-rails added in P1.** The brief-to-chips vocabulary is limited to the Discover filters (sport, support type,
region, amount, verified evidence, level, adults only); no appearance, ethnicity, "talent" or popularity chips. Ask
Revivo runs the refusal check first, then shows "Answering: [the suggested question it matched]". Application
summaries next to the rubric use a fixed, adjective-free template (facts, sources, gaps). A statement drafted with AI B
is marked "drafted with Simulated AI help, edited by the applicant" for the reviewer, and AI B helps with structure
and the applicant's own records only. The claims check allow-lists the product name, "Impact: not evaluated" and the
honesty line.

**Always deterministic:** eligibility, discovery order, every number and total, financial states and invariants,
alerts, offer caps, the identifiability check, the sports-only check, the claims check, access control, deadlines and
statuses. **Always human:** verification, awards, offers, releases, expense verification, deliverable acceptance,
recovery plans, report acceptance, review decisions. Voice-note summaries are deferred.

## 11. The accountability chains (the Funding Line)

One component, drawn as the **Funding Line** (`04` §5): funder at the left, recipient at the right, the light stopping
at the current node. Each figure is a "See source" button that opens the Source records panel and carries its level:
**Participation**, **Output**, **Outcome (self-reported)** or **Impact: not evaluated**.

| Chain | Nodes (short labels) | Used for |
|---|---|---|
| **Athlete** | Need → Support → Released → Spent → Progress → Review (accessible names: Funding need, Approved support, Funds released and received, Expenditure and verification, Sporting progress, Funding review) | Scholarship awards, development grants, competition funding |
| **Programme** | Commitment → Delivered → Spent → Evidence → Outcomes → Review | Programme grants, facilities projects (milestones instead of sessions) |
| **Sponsorship** | Agreement → Funding → Deliverables → Evidence → Review | Sponsorship agreements (commercial) |

Receipt is shown on the Released node ("$2,250 released · received 6 May"); verification on the Spent node.

**Athlete chain (Amira, at 30 Jun 2027):**

| Node | Figure | Drills down to |
|---|---|---|
| Need | $4,800 requested | Application |
| Support | $4,500 scholarship award, approved by I. Solberg, accepted 6 May | Decision record, agreement |
| Released | $2,250 of $4,500 · received 6 May | Release entry with receipt confirmation |
| Spent | $1,930 reported · $1,720 verified · $210 awaiting | Expense lines, then the document |
| Progress | 2 progress records (5th place, Continental U21 Invitational, verified by results document; 34 of 36 training sessions, attested by her coach) | Results document; coach attestation |
| Review | Continue with conditions | Decision with reason and author |

**Programme chain (Play Every Day, at 30 Jun 2027):**

| Node | Figure | Drills down to |
|---|---|---|
| Commitment | $60,000 · 120 sessions this quarter · 6 sites · 460 places | Agreement |
| Delivered | **108 of 120** (104 verified, 4 awaiting); branch: 12 not delivered (8 weather, 4 coach availability), recovery plan approved | Sites → sessions → session record (counts only for funders) |
| Spent | $10,800 of $12,000 released · $10,368 verified (96% documented) | Budget line → expense → document |
| Evidence | 104 verified sessions; consented photos (3 removed: consent withdrawn 18 Jun) | Evidence |
| Outcomes | Survey, self-reported: "I feel confident trying new activities" 58% → 71%, n = 212, no comparison group | Survey record |
| Review | Continue with conditions | Decision |

**Sponsorship chain (Jonah Reyes, at 30 Jun 2027):** Agreement $6,000 (accepted 6 May) → Funding $3,000 released ·
received → Deliverables 2 of 4 meets accepted; clinic and content day scheduled → Evidence 2 results documents and 2
consented photos → Review "Continue" (Lucy Adeyemi, 30 Jun).

Under every chain, the honesty line: "Delivery and spending records show what was delivered and spent; they do not on
their own prove social impact." **Outputs, sporting outcomes and independently evaluated impact are always labelled
apart**; the product never says funding caused a result.

## 12. Independence and the optional Revivo Pathway import

Revivo Impact has its own registration and onboarding, athlete, organisation and funder records, profiles,
verification, consent and permissions, discovery, applications, selection, agreements, expenditure records, progress
monitoring, reporting, administration and audit. No athlete, coach, organisation or funder needs a Revivo Pathway
account or subscription. Journey A starts with independent registration and never touches Pathway.

**Optional import** (one action on Profile, Explore only, never in the guided journeys): simulated sign-in to Pathway
(no real connection) → choose facts → guardian consent for a minor → facts arrive labelled "Verified in Revivo Pathway ·
imported [date]" and can be removed at any time. Shared infrastructure with Pathway is a future decision.

## 13. Exclusions

| Excluded | Why |
|---|---|
| Public donations, public crowdfunding campaigns, individual donors | Payment regulation, donation tax and safeguarding; not the paying customer (`07` D8). Verified individual sponsors are included lightly (§5.6). |
| Non-sport funding: general academic scholarships, non-sport charity, generic fundraising | Sports-only boundary (§4.4) |
| Free messaging between funders and seekers | Structured contact only (§3.3) |
| Real payments, bank feeds, payment gateways, tax receipts, cross-border transfers | Releases are recorded, not processed |
| E-signature and contract authoring | "Accept" records name, date and agreement version |
| Multi-stage scoring panels, weighted committee scoring, appeals | One rubric and one conflict declaration; the decision letter says who to contact |
| Sponsorship inventory, media valuation, activation analytics, sponsorship intelligence, live social media data | Commercial sponsorship gets payments, up to 3 deliverables and the optional self-reported commercial profile (§3.4) |
| Recovery of unspent or returned funds, clawback | Shown as "Unspent, held by recipient"; workflows deferred |
| Several currencies in the demonstration; exchange rates | The model supports currencies; the dataset is USD only (§6.4) |
| Translations, native apps, offline sync, real logins, email or SMS | In-app notifications are simulated; English only, structure kept |
| Supervised logins for minors | Minors appear only through their guardian's account |
| Platform administration beyond verification, safeguarding checks, concerns and audit | One Audit & admin area (`07` D16) |
| Accounting, CRM, independent impact evaluation, SROI | Not this product |
| A real Revivo Pathway connection | The import is simulated and optional |
| Voice-note AI and any fourth AI experience | Exactly three AI experiences (`07` D12) |
| Health monitoring, injury or medical data, face recognition, biometrics, location tracking, follower counts | Never. Progress is results, attendance and milestones only |
