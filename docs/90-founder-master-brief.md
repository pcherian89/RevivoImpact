# Founder's master brief (verbatim, as provided by the owner, Nov 2026)

> This is the founder's original direction, kept word for word for reference. Where the expert review (P0) refined or
> challenged it, the decision documents `01`–`07` take precedence; each such change is listed in
> `01-product-strategy.md` → "Changes from the founder's master brief".

REVIVO IMPACT — MASTER PRODUCT STRATEGY & PROTOTYPE DEVELOPMENT BRIEF

## 1. Your role
Act as an integrated product development team for Revivo Sportech.
Apply the analytical perspectives of:

* International sports industry and sports technology specialists
* Sports funding, philanthropy and foundation specialists
* Corporate CSR and grant management professionals
* Commercial sponsorship and sports marketing specialists
* Athlete development specialists
* Sports federation, academy and club administrators
* Marketplace and SaaS product strategists
* UX researchers and product designers
* Creative directors and sports brand designers
* Software architects and frontend engineers
* AI and data specialists
* Financial accountability specialists
* Child safeguarding, privacy and security specialists
* Accessibility and quality assurance engineers
* Commercial sales and procurement specialists

These are analytical perspectives, not claims that external experts have been consulted.
Challenge assumptions, investigate competitors and identify weaknesses before implementation. Do not blindly agree with previous recommendations.

## 2. IMPORTANT — revised product direction
Previous strategy documents positioned Revivo Impact primarily as a Programme Delivery & Impact platform.
That direction has now been expanded following further founder discussions.
This master prompt supersedes conflicting decisions in the earlier documents, including:

* docs/00-START-HERE.md
* docs/01-strategy-decisions.md
* docs/02-prototype-brief.md

Read those files if available. Preserve useful research, design standards, programme monitoring workflows and evidence-tracking concepts, but revise the product definition to reflect this brief.
Do not build only the earlier Greenpark programme monitoring demonstration.
The new product must cover the complete sports funding lifecycle, including finding funding, applying, selecting beneficiaries, providing funding, managing expenditure and tracking results.

## 3. Company and product identity
Company: Revivo Sportech
Website: https://revivosportech.com
Current company tagline: Pulse of Sport. Mind of the Game.
Product name: Revivo Impact
Product category: Sports Funding & Sponsorship Platform
Preferred working product tagline: Connecting sport with opportunity.
Supporting description:
Discover funding. Support sporting talent. Track the difference.
Revivo Impact should be globally relevant and commercially credible.
Do not position it as a Kerala-specific or India-specific product.

## 4. Fundamental product objective
Revivo Impact solves three connected problems:

1. Athletes and sports organisations struggle to identify and secure suitable funding.
2. Sponsors, foundations and other funders struggle to identify credible sporting opportunities and beneficiaries.
3. Funders struggle to monitor how their financial support is used and what it achieves.

The product connects these three problems through one coherent platform.
It must be useful before, during and after funding is awarded.
The simplest product explanation is:
If you need funding for sport, Revivo helps you find it. If you want to fund sport, Revivo helps you find credible opportunities and understand what your money achieves.

## 5. Mandatory standalone product architecture
Revivo Impact is a completely standalone product.
It must have its own:

* Registration and onboarding
* Athlete profiles
* Coach and guardian relationships
* Organisation profiles
* Funder and sponsor profiles
* Verification processes
* Consent and privacy controls
* Funding opportunities
* Application and selection workflows
* Funding agreements
* Expenditure records
* Progress monitoring
* Reporting
* Permissions and audit records
* Administration

No user should need to use, purchase or understand Revivo Pathway to use Revivo Impact.
Pathway integration is optional and potentially valuable in the future.
An athlete may optionally import selected verified information from Pathway with appropriate consent and authorisation. This must not become a prerequisite.
The prototype must demonstrate at least one complete athlete journey starting with independent registration on Impact, without any Pathway involvement.
Do not connect to a real Pathway database.
Reuse appropriate visual patterns, components and design principles from Pathway, not its product dependencies or navigation structure.

## 6. Product participants
Funding seekers

* Individual athletes
* Parents and legal guardians
* Coaches
* Academies
* Sports clubs
* Sports federations
* Schools
* Community sports organisations
* Sports charities and programme operators

Funding providers

* Sports foundations
* Corporate CSR teams
* Corporate marketing and sponsorship teams
* Government agencies
* Philanthropic organisations
* Sports brands
* Individual sponsors
* Donors

Supporting roles

* Application reviewers
* Verification officers
* Funding approvers
* Finance officers
* Programme managers
* Platform administrators

Do not make these into unnecessary separate applications.
Create intuitive role-based experiences.
Organisations may act as funding providers, funding recipients or both, depending on their permissions.
Coaches and guardians must be able to manage multiple authorised athletes through one account.

## 7. Four core funding routes
The platform must support four connected routes.

### Route A — Open scholarships and funding opportunities
This is the primary demonstration journey.
A foundation publishes a scholarship programme offering funding to a defined number of athletes.
The opportunity includes:

* Funding amount
* Number of available awards
* Funding purpose
* Eligible sports
* Age and geographical criteria
* Sporting achievement requirements, where relevant
* Financial need requirements, where relevant
* Application deadline
* Required documents
* Selection process
* Reporting expectations

Athletes discover the opportunity, review eligibility and apply using their existing Revivo Impact profiles.
Parents and authorised coaches can submit applications on behalf of eligible athletes.
The funding organisation reviews applications, requests additional information, verifies documents, shortlists candidates and approves awards.
Selected athletes accept their funding agreements and enter the post-award monitoring process.
Unsuccessful athletes receive an appropriate decision and can continue discovering other funding opportunities.

### Route B — Athlete-led funding requests
Athletes or authorised representatives can publish specific funding requirements.
Examples:

* Competition travel
* Training fees
* Equipment
* Nutrition
* Coaching
* Sports medicine
* Accommodation
* Competition entry fees

Funding requests should explain what is needed, why it is needed, the amount required and the expected use of the support.
Sponsors can discover appropriate verified requests and offer full or partial support.
Prevent accidental overfunding and distinguish confirmed commitments from money actually received.

### Route C — Funder-led direct discovery
A funder may wish to identify athletes or sporting initiatives without running an open scholarship programme.
The funder can search appropriately visible profiles and funding requests using relevant criteria.
Examples:

* Sport
* Geography
* Age category
* Competition level
* Verified achievements
* Funding purpose
* Requested support

The funder can shortlist suitable opportunities and initiate a structured funding offer.
The recipient can accept, decline or request changes.
For minors, all contact and offers must be managed through authorised representatives and appropriate safeguarding controls.

### Route D — Programme funding and existing sponsorships
Sports organisations can publish or apply for funding for programmes and initiatives.
Examples:

* Grassroots sports programmes
* Community participation initiatives
* Academy development
* Equipment distribution
* Coach development
* Competition participation
* Facility improvement

Funding organisations can also register existing beneficiaries and agreements without requiring a new application.
Preserve the valuable programme management workflow from the earlier Revivo Impact brief, including session delivery, attendance, missed activities, recovery plans, expenditure and evidence.
This is an important product capability, but not the only product journey.

## 8. Different funding categories
Clearly distinguish:

* Scholarships
* Development grants
* Direct athlete financial support
* Programme grants
* Equipment or in-kind support
* Commercial sponsorship
* Existing funding agreements

Development funding and commercial sponsorship are not identical.
Development funding primarily supports sporting participation or development.
Commercial sponsorship may involve agreed promotional activities, endorsements, appearances or marketing deliverables.
The product should accommodate both without confusing charitable giving, CSR funding and commercial marketing expenditure.
Do not claim universal CSR eligibility or automatic regulatory compliance.
Actual payment handling, donations, tax treatment, cross-border transactions and commercial agreements will require separate jurisdiction-specific validation before production.
For this prototype, simulate commitments, agreements and payment records. Do not process real money.

## 9. Core product modules
Design the product around six understandable capabilities:

### 1. Profiles & Verification
Reusable profiles for athletes, organisations, sponsors and funders.
Include relevant sporting histories, achievements, affiliations, verified documents and funding needs.
Provide field-level verification status rather than implying that one verification badge proves everything.
Avoid unnecessary personal or sensitive information.

### 2. Discovery & Opportunities
Enable both sides to discover each other.
Athletes discover scholarships, funding calls and relevant sponsors.
Funders discover athletes, sports organisations, funding requests and sporting initiatives.
Include understandable filters, search, saved opportunities and explainable matching.
Support public, restricted and invitation-only opportunities.

### 3. Applications & Selection
Manage applications, nominations, eligibility checks, document verification, shortlisting, reviewer assessments, approval and decision communication.
Eligibility checks should use deterministic rules.
AI may help summarise information but must not automatically determine who deserves funding.

### 4. Funding Management
Manage funding requests, offers, awards, agreements, commitments, allocations, payment schedules and recorded disbursements.
Distinguish:

* Announced funding
* Approved commitments
* Funds released
* Expenditure reported
* Expenditure verified
* Outstanding commitments
* Unspent funds

Include full and partial funding.
Use clear financial definitions and prevent double counting.

### 5. Progress & Impact
Track sporting progress, programme activities, expenditure, evidence, milestones and agreed deliverables.
Retain the earlier Commitment-to-Evidence Chain but adapt it to the wider product.
For an athlete:
Funding need → Approved award → Funds released → Expenses → Sporting progress → Funding review.
For a programme:
Funding commitment → Activities delivered → Expenditure → Evidence → Outcomes → Review.
Every important figure should be traceable to its source records, subject to appropriate permissions.

### 6. Reporting & Renewal
Generate understandable reports for athletes, organisations and funders.
Support funding renewal, closure, further funding requests and corrective actions.
Distinguish participation, outputs, outcomes and independently evaluated impact.
Delivery and expenditure records do not by themselves prove social impact.
Do not repeat long disclaimers unnecessarily on every screen. Place clear explanations where relevant.

## 10. User experience architecture
Create different role-based home experiences while preserving a consistent product design.

Athlete experience — suggested navigation: Home · Discover funding · My applications · My funding · My progress · My profile.
An athlete without an existing sponsor must still find immediate value in the product.

Coach or guardian experience — suggested navigation: Home · My athletes · Discover funding · Applications · Funding & updates.
Allow straightforward switching between authorised athletes.

Funder experience — suggested navigation: Overview · Discover · Opportunities · Applications · My funding · Impact & reports.
A funder should easily understand: What funding is available? Who has applied? Who has received support? How much funding has been committed and released? How is the money being used? What needs attention? What progress has been made?

Sports organisation experience — allow organisations to seek funding, manage their athletes, report on funded initiatives and publish opportunities where authorised.

These navigation structures are provisional. Refine them through UX analysis, but preserve the underlying functions.
Do not create overwhelming sidebars or display irrelevant features to each role.
Every page should be understandable without lengthy explanation.

## 11. Commercial business model
The primary paying customers are: sports foundations; corporations and CSR departments; government sports organisations; federation development departments; institutional grantmakers; commercial sponsors.
The initial commercial proposition is institutional software that manages the entire funding lifecycle.
Athletes, parents and coaches should have free basic participation, registration, nominations and applications.
Consider paid institutional plans for academies and federations that need advanced management capabilities.
Do not make the product dependent on marketplace commissions or a huge pre-existing athlete database.
A foundation should be able to purchase Revivo Impact, launch its first scholarship and attract applications through a shareable opportunity link.
This provides an immediate use case even when the wider marketplace has few participants.
Do not invent confirmed subscription prices, customer demand or revenue projections.
Treat commercial assumptions as hypotheses requiring validation.

## 12. Competitor research and opportunity validation
Before building, independently review the following categories:
Sports monitoring and evaluation: Upshot; Substance Views.
Grant and scholarship management: Submittable; Foundant; other relevant grant management platforms.
Sports sponsorship marketplaces: OpenSponsorship; SponsorUnited; MAKEACHAMP; Indenture; other relevant international and regional competitors.
Also examine real sports scholarships, athlete grants and foundation funding programmes.
Investigate: primary customers; user workflows; applicant experiences; funder experiences; application and selection capabilities; financial management; sponsorship discovery; athlete development tracking; evidence and reporting; pricing, where publicly available; implementation requirements; strengths and weaknesses.
Use primary sources and actual product documentation where possible.
Do not claim features are missing simply because they are not mentioned on a landing page.
Do not assume Revivo has a unique product merely because it combines features.
Identify three to five credible differentiation hypotheses and explain how the prototype could demonstrate them.
Separate verified research from expert judgment.
The objective is focused product validation, not endless market research.

## 13. Artificial intelligence strategy
AI should reduce administrative effort and help users identify relevant opportunities.
Develop a small number of meaningful, clearly labelled AI experiences.

AI experience A — Funding matching. An athlete receives relevant funding opportunities based on verified profile information and published criteria. A funder can describe its objectives in natural language and receive a shortlist of potentially relevant opportunities. Explain why a match is suggested. Do not invent funding opportunities or guarantee eligibility. Use explicit eligibility rules for definitive eligibility checks.

AI experience B — Application assistance. Help athletes and organisations organise application information, identify missing documents and draft funding requests using their actual records. Never fabricate achievements, medical information, financial circumstances or recommendations.

AI experience C — Funder intelligence and reporting. Summarise application information, explain recorded progress, identify inconsistencies and draft reports using authorised source records. Every factual statement should be traceable.

Do not use AI to decide who deserves financial support, approve applications, release money or prove social impact.
All AI functionality in the prototype must be clearly identified as simulated unless genuinely implemented and authorised.
Do not integrate paid APIs without approval.

## 14. Fictional demonstration world
Create a coherent international fictional sporting ecosystem.
Use Horizon Sports Foundation as the main demonstration funder, unless the expert review identifies a stronger fictional name.
Use fictional athletes, coaches, academies, sponsors and sports organisations.
Include diverse, realistic sporting backgrounds.
The main funding opportunity should be an Emerging Athletes Scholarship supporting 50 athletes.
Illustrative funding model: total scholarship allocation $250,000; up to 50 awards; up to $5,000 per athlete; multiple eligible sports; clear eligibility and application criteria; realistic selection and funding conditions.
Actual awards may differ according to approved requirements.
Include additional fictional opportunities such as: Competition Travel Grant; Equipment Support Programme; Women's Sporting Development Fund; Community Sports Programme Grant.
Create a believable seed dataset with sufficient athletes, applications, verified records, funding needs, awards, expenses and progress updates to demonstrate realistic workflows.
The platform should not look empty.
However, do not create thousands of unnecessary individual records merely to make the prototype appear impressive.
All aggregate figures must reconcile with the underlying fictional data or be explicitly labelled as illustrative aggregate records.
Use international terminology and configurable currencies.
If currency switching is implemented, do not simply replace the currency symbol while retaining the same numerical amounts. Use either separate localised demo datasets or clearly identified illustrative conversion rates.

## 15. Mandatory demonstration journeys

### Journey A — Find and secure a scholarship
This is the main signature journey.

1. Horizon Sports Foundation creates and publishes a scholarship.
2. An athlete independently registers on Revivo Impact.
3. The athlete creates a sporting profile.
4. The athlete discovers relevant funding opportunities.
5. Revivo explains the eligibility criteria and potential match.
6. The athlete applies.
7. The funder reviews the applications.
8. A reviewer checks evidence and requests missing information.
9. An authorised approver selects the athlete.
10. The athlete accepts the award.
11. The funder records an initial disbursement.
12. The athlete submits expenses and progress updates.
13. The funder reviews the evidence and considers further support.

This journey must work without Pathway.

### Journey B — Discover and directly sponsor an athlete
A different athlete publishes a specific funding requirement.
A sponsor discovers that requirement, reviews the authorised profile, proposes support and records an agreement.
Demonstrate partial funding and appropriate privacy controls.

### Journey C — Fund and monitor a sports programme
Retain the earlier Play Every Day programme and Greenpark story.
Demonstrate: programme funding; delivery targets; attendance and session records; a missed-session warning; corrective action; recovery plan approval; expenditure with supporting evidence; outcome reporting.
This preserves the useful original programme monitoring concept within the wider product.

### Journey D — Bring existing funding onto Revivo
Demonstrate how an organisation can register an athlete or programme that already receives funding without forcing them through a new scholarship application.
Keep this journey short.

### Journey E — Coach and guardian experience
Demonstrate an authorised coach or guardian managing an athlete's profile, application or progress submission.
Show how consent and permissions operate independently of Pathway.

## 16. Prototype scope and simplicity
Build a coherent interactive browser prototype, not a collection of disconnected dashboard mockups.
Aim for a manageable set of reusable screen templates with role-specific views.
The previous proposal suggested 13 screens for the narrower programme product. Do not force the expanded funding platform into exactly 13 screens if that makes its workflows incomplete.
Equally, do not create 40 or 50 screens just to demonstrate every possible variation.
Propose the smallest complete information architecture after the expert review.
Prioritise the principal screens: product landing and role entry; registration and profile; funding discovery; opportunity details; athlete and organisation discovery; funding request; opportunity creation; application submission; application review and selection; funding agreement; funding portfolio; expense and evidence submission; athlete progress; programme delivery; reports and accountability; relevant settings and consent.
Reuse layouts and components where appropriate.
The main guided demonstration should be understandable in approximately 10 minutes.
Supporting journeys should be available through hands-on exploration.
Include a guided mode and a hands-on mode, as in Pathway, but improve their clarity wherever possible.

## 17. Visual identity and creative direction
The existing Revivo website is the brand reference.
Repository references, subject to access: pcherian89/Revivo_Webpage; pcherian89/RevivoPathway; RevivoPathway/docs/03-design-brief.md; Revivo_Webpage/public/pathway-demo.html.
Read these as reference material only. Do not modify these repositories.
Preserve the approved visual identity: black, white and electric lime; premium cinematic sports photography; confident typography; warm natural lighting; strong visual contrast; clear information hierarchy; subtle animations; excellent mobile, tablet and desktop experiences.
Include Dark and Daylight themes.
Avoid grey-heavy interfaces, excessive cards, unnecessarily complicated dashboards, fake holograms, generic SaaS templates and overly dark imagery.
The athlete experience should feel encouraging and accessible.
The funder experience should feel professional, transparent and credible.
Both should clearly belong to Revivo.
Use meaningful visual storytelling rather than decorative photographs on every administrative screen.
Produce an image asset plan after the screen architecture is confirmed.
For each required image, specify: filename; screen and placement; aspect ratio; subject; composition; lighting; sporting environment; detailed ChatGPT image-generation prompt.
Ensure images are distinctive, authentic and internationally representative.
Do not generate a final image count simply because the previous brief specified eight images.
Use sensible temporary placeholders until I provide the final assets.

## 18. Data, privacy, safeguarding and financial integrity
The prototype must use fictional data only.
Provide an independent consent and permissions model.
For minors: require appropriate guardian authorisation; protect personal identity and sensitive information; avoid unrestricted public profiles; restrict contact with sponsors; route relevant communication through authorised representatives; allow consent withdrawal for specific purposes; prevent unauthorised access to underlying records.
Funders who are evaluating authorised individual athlete applications may need access to selected identifiable information.
Funders who only monitor community programmes should normally see aggregate information unless further access is necessary and authorised.
Do not adopt a blanket rule that every funder can see all athlete information or that no funder can ever see an individual athlete.
Demonstrate appropriate purpose-based access.
Provide human review for verification, awards, expenditure and report approvals.
Ensure financial states remain consistent.
A commitment is not the same as a payment. Reported expenditure is not the same as verified expenditure.
Do not present fabricated bank connections, payment services, live AI, real identity verification or production security as operational features.
Make the prototype's limitations explicit.

## 19. Shared Revivo principles
Pathway and Impact may eventually share infrastructure such as: authentication; organisation management; role permissions; consent; audit logging; design tokens; notification services; document handling; AI infrastructure.
However, this is a future architecture decision.
Impact must remain independently usable and commercially licensable.
Do not require another Revivo product to supply its data, manage its users or perform its essential workflows.

## 20. Website placement and product positioning
Review the current Revivo website and its navigation.
My preferred future approach is a Products section that includes: Revivo Pathway; Revivo Impact; future products when sufficiently developed.
Each product should clearly indicate its current prototype status.
Evaluate whether this fits the website's existing design and information architecture.
Do not modify or deploy the main website.
Do not publish Impact before explicit approval.
Treat future products such as Register, Flow, Training and Partner as strategic possibilities, not approved development commitments.

## 21. Technical deliverables
Develop the prototype in the new private RevivoImpact repository.
Use a dedicated development branch.
The eventual prototype should include: complete interactive browser version; standalone offline HTML version where technically practical; responsive mobile, tablet and desktop layouts; guided and hands-on demonstrations; fictional seed data; working role switching; functional forms and interactions; consistent state updates across connected workflows; clear reset functionality; print or export demonstrations where useful; accessible navigation and controls; clear prototype limitations; comprehensive quality assurance documentation.
The offline version should not require the recipient to install software or additional packages merely to view the demonstration.
Do not introduce unnecessary backend services.
Do not purchase services, deploy publicly, configure payment systems, integrate paid APIs or introduce passwords without explicit permission.

## 22. Development phases
Follow a phased process similar to Pathway, adjusted to the needs of Impact.

P0 — Independent product and strategy review. Review all existing briefs. Identify conflicts between the original programme management concept and this revised funding platform. Review competitors, product positioning, commercial buyers, standalone architecture, essential user journeys and risks. Produce updated strategy and product decisions. Do not start application development during P0.

P1 — Product architecture and experience design. Develop: user roles and permissions; information architecture; screen inventory; connected journey maps; data relationships; financial status model; consent model; design direction; fictional world; image asset plan; prototype implementation plan. Show how the product remains simple despite having multiple funding routes.

P2 — Core funding discovery and applications. Build independent registration, profiles, discovery, funding opportunities, applications and selection. Demonstrate the scholarship workflow.

P3 — Funding and progress management. Build awards, agreements, commitments, disbursement records, expenses, athlete progress, direct sponsorship and programme monitoring.

P4 — Intelligence, reporting and demonstration. Implement simulated AI experiences, traceable reports, role-specific guided journeys and visual refinements.

P5 — Quality assurance and final packaging. Validate complete journeys, role permissions, fictional data consistency, financial calculations, responsive layouts, accessibility, offline behaviour and final demonstration quality. Produce the standalone deliverables and presenter guide.

At the end of each phase, explain what was completed, what remains, what was tested and any limitations.
Pause for approval at major product and architecture decision points, but do not ask unnecessary questions about minor implementation decisions.

## 23. Acceptance criteria
The prototype must demonstrate that:

1. An athlete can independently register without Pathway.
2. A foundation can independently publish a scholarship.
3. Athletes can discover and apply for funding.
4. Coaches and guardians can manage authorised athlete applications.
5. Funders can evaluate and select beneficiaries.
6. Athletes can create specific funding requests.
7. Sponsors can discover suitable opportunities and propose funding.
8. Existing funding relationships can be managed.
9. Programme operators can receive funding and report delivery.
10. Funding commitments, payments and expenditure are clearly differentiated.
11. Important reported figures reconcile with the underlying records.
12. Athlete progress and programme evidence connect to funding.
13. AI assistance is useful, explainable and appropriately limited.
14. Minors' privacy and consent are appropriately demonstrated.
15. Each role has an understandable interface.
16. The product is usable on mobile, tablet and desktop.
17. Pathway integration is optional rather than required.
18. Every major journey works end to end.
19. No real data, payments or unapproved external services are involved.
20. The product meets or exceeds the clarity, visual quality and completeness of Revivo Pathway.

## 24. Immediate task (as originally written)
Start with P0 only. Bring together the relevant expert perspectives and evaluate this revised product direction. Explain in straightforward language: what Revivo Impact is; who uses it; who purchases it; how athletes and funders find one another; how funding is awarded and tracked; how it works completely independently of Pathway; how it differs from existing platforms; what its strongest commercial use case is; what the main demonstration journey should be; what features should be excluded to preserve simplicity. Then produce a revised set of strategy and development documents, including the recommended screen architecture, phased build plan and any unresolved decisions requiring founder approval. Use evidence-based research where appropriate. Do not start coding yet.

The goal is not to build the most feature-heavy sports funding platform possible. The goal is to build the clearest, most credible and visually compelling demonstration of how Revivo can connect sporting talent and initiatives with funding, and help funders understand how their support is being used. Prioritise simplicity, genuine functionality, creative design and commercial credibility throughout.

## Founder's review request (accompanying the brief)
Independently review the revised master brief against the existing Revivo website, brand identity, capability structure, previous strategy decisions and the Revivo Pathway prototype. Verify: (1) alignment with Revivo's vision and website capabilities; (2) whether website capabilities need renaming, combining or redefining; (3) whether "Revivo Impact" and "Connecting sport with opportunity" are right; (4) whether scholarship, athlete sponsorship, programme funding and accountability form one coherent product; (5) missed stakeholders, use cases or commercial opportunities; (6) unnecessary complexity and how to simplify without losing functionality; (7) full independence from Pathway; (8) credibility of the commercial model and differentiation; (9) whether the prototype can meet or exceed Pathway's quality while staying simple; (10) how both products should eventually be presented on the website. Preserve valuable earlier research, workflows and design decisions. Consolidate everything into a complete, conflict-free set of Markdown documents in the RevivoImpact repository, sufficient for a new chat with no prior context. Do not build yet; do not modify the Revivo website or Revivo Pathway. Challenge the proposal wherever necessary.
