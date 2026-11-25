import type { RoleKey } from "./world";

/** Main navigation per role: at most five items (docs/03 §2). `screen` is the route segment. */
export type NavItem = { label: string; screen: string };
export const NAV: Record<RoleKey, NavItem[]> = {
  athlete: [
    { label: "Home", screen: "home" },
    { label: "Discover", screen: "discover" },
    { label: "Applications", screen: "s12" },
    { label: "My Funding", screen: "funding" },
    { label: "Profile", screen: "s4" },
  ],
  guardian: [
    { label: "Home", screen: "s3" },
    { label: "My Athletes", screen: "s22" },
    { label: "Discover", screen: "discover" },
    { label: "Applications", screen: "s12" },
    { label: "Funding & Updates", screen: "s16" },
  ],
  coach: [
    { label: "Home", screen: "s3" },
    { label: "My Athletes", screen: "s4" },
    { label: "Discover", screen: "discover" },
    { label: "Applications", screen: "s12" },
    { label: "Funding & Updates", screen: "s18" },
  ],
  funder: [
    { label: "Overview", screen: "overview" },
    { label: "Discover", screen: "fdiscover" },
    { label: "Opportunities", screen: "s9" },
    { label: "Applications", screen: "s12" },
    { label: "Funding", screen: "portfolio" },
  ],
  sponsor: [
    { label: "Overview", screen: "s3" },
    { label: "Discover", screen: "fdiscover" },
    { label: "Opportunities", screen: "s9" },
    { label: "Applications", screen: "s12" },
    { label: "Funding", screen: "s16" },
  ],
  individual: [
    { label: "Overview", screen: "s3" },
    { label: "Discover", screen: "fdiscover" },
    { label: "Asks & offers", screen: "s12" },
    { label: "Funding", screen: "s16" },
  ],
  organisation: [
    { label: "Home", screen: "s3" },
    { label: "Discover", screen: "discover" },
    { label: "Applications", screen: "s12" },
    { label: "Funding", screen: "s19" },
    { label: "Organisation", screen: "s4" },
  ],
  "programme-coach": [
    { label: "Today", screen: "s20" },
    { label: "Sessions", screen: "s19" },
  ],
  admin: [{ label: "Audit & admin", screen: "s23" }],
};

export const HOME_SCREEN: Record<RoleKey, string> = {
  athlete: "home",
  guardian: "s3",
  coach: "s3",
  funder: "overview",
  sponsor: "fdiscover",
  individual: "s3",
  organisation: "s3",
  "programme-coach": "s20",
  admin: "s23",
};

/** The 23 screens (docs/03 §4). `built` marks what the P1 shell shows as a representative design. */
export type ScreenDef = { n: number; name: string; question: string; template: string; contents: string; phase: string; built?: string };
export const SCREENS: ScreenDef[] = [
  { n: 1, name: "Start", question: "How would you like to explore?", template: "Cinematic", contents: "Lockup, tagline, guided journeys A–E, two doors into Explore.", phase: "P1", built: "start" },
  { n: 2, name: "Join", question: "Who are you registering as?", template: "T4 Stepper", contents: "Five open registration paths; simulated email code; consents start unset.", phase: "P2", built: "join" },
  { n: 3, name: "Home / Overview", question: "What needs me?", template: "T1 Home", contents: "Needs me (at most 3), next steps, Matched for you; funder Overview with the Fund bar and Reports.", phase: "P2", built: "home, overview" },
  { n: 4, name: "My profile", question: "What do funders see about me?", template: "T3 Record", contents: "Facts with verification chips and visibility per fact; Preview as a funder; funder profile editing.", phase: "P2" },
  { n: 5, name: "Discover", question: "Who could fund me? / Who could we support?", template: "T2 List", contents: "Seekers: opportunities and sponsors. Funders: athletes, requests, teams and initiatives, shortlist. Brief → chips.", phase: "P2", built: "discover, fdiscover" },
  { n: 6, name: "Opportunity", question: "Can I apply for this?", template: "T3 Record", contents: "Key facts, eligibility checklist against the profile, what you'll need, how decisions are made.", phase: "P2", built: "opportunity" },
  { n: 7, name: "Funding request", question: "What is needed, and how much is still missing?", template: "T3 Record", contents: "Breakdown, verified facts, need bar, Offer support (capped), Express interest; minors anonymised.", phase: "P2", built: "request" },
  { n: 8, name: "Public profile", question: "Who is this funder / athlete or team?", template: "T3 Record", contents: "What they support or need, verification, Accepts funding requests, one primary action.", phase: "P2", built: "profile" },
  { n: 9, name: "Create opportunity", question: "What are you offering, and to whom?", template: "T4 Stepper", contents: "Sport and purpose (sports-only check), tiers, eligibility rules, visibility, deadline, rubric; four-eyes publishing.", phase: "P2" },
  { n: 10, name: "Publish a funding request", question: "What do you need funding for?", template: "T4 Stepper", contents: "What, why, breakdown, evidence, visibility; anonymised-card preview and identifiability check for minors.", phase: "P2" },
  { n: 11, name: "Apply", question: "Is your application ready?", template: "T4 Stepper", contents: "Profile → Eligibility → Documents → Budget & other funding → Statement → Share & submit; AI B.", phase: "P2" },
  { n: 12, name: "Applications", question: "Where do my applications and requests stand? / Who has applied or asked?", template: "T2 List", contents: "Seeker statuses with next steps; funder pipeline, requests received, offers sent.", phase: "P2" },
  { n: 13, name: "Application review", question: "Does the evidence hold up?", template: "T6 Review", contents: "Per-fact verification, inconsistency flags, AI C summary; rubric and conflict declaration.", phase: "P2" },
  { n: 14, name: "Selection & decisions", question: "Who should we fund?", template: "T6 Review", contents: "Budget meter (I1), tier rule, decisions with reasons, selection record.", phase: "P2" },
  { n: 15, name: "Offer & agreement", question: "What am I agreeing to?", template: "T8 Document", contents: "Type-specific agreement, instalments, deliverables, what the funder will see; Accept · Decline · Request changes.", phase: "P3" },
  { n: 16, name: "Funding", question: "Where is our money? / What support do I have?", template: "T2 List", contents: "Portfolio with totals per funding type; Reports tab; Add existing funding. Seeker: support in plain words.", phase: "P3", built: "portfolio" },
  { n: 17, name: "Funding record", question: "How is this support being used?", template: "T5 Chain", contents: "The chain for its type, funding bar, ledger, updates, deliverables, review history.", phase: "P3", built: "funding" },
  { n: 18, name: "Send an update", question: "What happened this period?", template: "T4 Stepper", contents: "Expenses, sporting progress or deliverable evidence, together or separately.", phase: "P3" },
  { n: 19, name: "Programme", question: "Is the programme on track?", template: "T5 Chain", contents: "Programme chain, site session strips, alerts, recovery plan; funders see counts only.", phase: "P3" },
  { n: 20, name: "Session register", question: "Who came today?", template: "T4 Stepper", contents: "Attendance count, note, consented photos, Couldn't run with a reason.", phase: "P3" },
  { n: 21, name: "Reports", question: "What can we honestly report?", template: "T8 Document", contents: "AI C draft from verified records, claims check, exclusions; outputs, outcomes and impact labelled apart.", phase: "P3–P4" },
  { n: 22, name: "Consent & safety", question: "Who can see what, and how do I stay in control?", template: "T7 Consent", contents: "Purposes with equal Yes/No, discoverability, representatives, blocked funders, report a concern.", phase: "P2" },
  { n: 23, name: "Audit & admin", question: "Who did what, when and why?", template: "T9 Audit", contents: "Audit table; verification, safeguarding checks and reports of concern for the platform admin.", phase: "P3" },
];

/** Guided journeys (docs/03 §5). Each step names who acts and where; `to` opens that screen in the shell. */
export type Step = { title: string; who: string; when: string; to: string; what: string };
export type Journey = { id: string; name: string; minutes: string; steps: Step[] };
export const JOURNEYS: Journey[] = [
  {
    id: "A",
    name: "Find and secure a sports scholarship",
    minutes: "10-minute signature",
    steps: [
      { title: "Tallwater publishes the scholarship", who: "Ingrid Solberg · Tallwater", when: "apr12", to: "app/ingrid/s9", what: "Ingrid publishes Daniel's draft (four-eyes) and copies the share link." },
      { title: "Amira registers independently", who: "Amira Haddad · athlete", when: "apr12", to: "join", what: "No invitation and no Revivo Pathway: she joins as an adult athlete." },
      { title: "She builds one sporting profile", who: "Amira", when: "apr12", to: "app/amira/s4", what: "Results, coach, current support; she chooses what is discoverable." },
      { title: "She discovers opportunities from five organisations, and seven relevant sponsors", who: "Amira", when: "apr12", to: "app/amira/discover", what: "Eligibility by rule; two shown as not eligible, with reasons. Then the Sponsors & funders tab." },
      { title: "She finds Tallwater's scholarship", who: "Amira", when: "apr12", to: "app/amira/opportunity/eas", what: "4 criteria met, 1 for the panel to check, 1 to add. AI A explains the match." },
      { title: "Application help", who: "Amira", when: "apr12", to: "app/amira/s11", what: "AI B fills the form from her profile and flags a missing invoice." },
      { title: "She submits", who: "Amira", when: "apr12", to: "app/amira/s12", what: "Shares the ticked fields; requests $4,800." },
      { title: "Review and verification", who: "Daniel Osei · Tallwater", when: "may06", to: "app/daniel/s13", what: "Verifies her result and age against documents; requests the invoice; shortlists at $4,500." },
      { title: "Human selection", who: "Ingrid", when: "may06", to: "app/ingrid/s14", what: "46 offers, $214,500 reserved; budget meter; respectful decisions to all 143." },
      { title: "Amira accepts her scholarship award", who: "Amira", when: "may06", to: "app/amira/s15", what: "Reads what Tallwater will see; accepts. Committed $4,500." },
      { title: "Payment recorded, receipt confirmed", who: "Priya Nair → Amira", when: "may06", to: "app/amira/funding", what: "Instalment 1, $2,250 (simulated); Amira confirms she received it." },
      { title: "Spending and sporting progress", who: "Amira", when: "jun30", to: "app/amira/s18", what: "4 expenses (one missing a receipt); 5th place; 34 of 36 sessions attested." },
      { title: "Funder review and renewal", who: "Priya, Daniel", when: "jun30", to: "app/amira/funding", what: "$1,720 verified, $210 queried; Continue with conditions; invite to renew." },
    ],
  },
  {
    id: "B",
    name: "Two-way discovery, direct support and sponsorship",
    minutes: "7 steps",
    steps: [
      { title: "Nadia publishes a funding request", who: "Nadia Kovač · athlete", when: "may06", to: "app/nadia/s10", what: "Racing wheels and travel, $5,200; Public." },
      { title: "Nadia finds a sponsor that accepts requests", who: "Nadia", when: "may06", to: "app/nadia/profile/halvorsen", what: "Sponsors & funders tab → Marcus Halvorsen → ask for $1,200 towards travel." },
      { title: "Oriel discovers Nadia", who: "Kenji Arakawa · Oriel", when: "may06", to: "app/kenji/fdiscover", what: "A plain-language brief becomes editable filters; ordered by rule, never by popularity." },
      { title: "Two funders, partial funding", who: "Kenji, Marcus → Nadia", when: "may06", to: "app/kenji/request/nadia", what: "$2,000 (delegated limit) + $1,200; $2,000 still needed." },
      { title: "Payments confirmed", who: "Nadia", when: "may06", to: "app/nadia/s17", what: "Both releases recorded and confirmed received." },
      { title: "Corvane proposes a sponsorship agreement", who: "Lucy Adeyemi → Jonah Reyes", when: "may06", to: "app/lucy/fdiscover", what: "$6,000, three deliverables; kept apart from development totals." },
      { title: "Updates and deliverables", who: "Nadia, Jonah", when: "jun30", to: "app/jonah/s17", what: "Spending verified; 2 of 4 kit meets accepted." },
    ],
  },
  {
    id: "C",
    name: "Sports organisations: funding and programme monitoring",
    minutes: "8 steps",
    steps: [
      { title: "A club funded by a sponsor it did not know", who: "Marcus Halvorsen → Highland Cycling Club", when: "may06", to: "app/marcus/fdiscover", what: "Youth club bikes: $2,500 of $5,000 offered and received; no minors' details shared." },
      { title: "Lanternfield discovers programme funding", who: "Maya Torres", when: "may06", to: "app/maya/discover", what: "Saves Round 2 and Facilities Small Grants; opens Play Every Day." },
      { title: "A coach records sessions", who: "Sam Rivera", when: "may06", to: "app/sam/s20", what: "One delivered; Greenpark couldn't run." },
      { title: "An alert and a question", who: "Maya", when: "may06", to: "app/maya/s19", what: "Two missed in a row; AI C cites the reasons." },
      { title: "Recovery plan approved", who: "Lena → Maya", when: "may06", to: "app/maya/s19", what: "Four-eyes approval; the funder sees aggregates." },
      { title: "Expense verified across organisations", who: "Maya → Priya", when: "jun30", to: "app/maya/s18", what: "$600 verified; $432 claim awaits a receipt." },
      { title: "An honest report", who: "Maya", when: "jun30", to: "app/maya/s21", what: "The claims check flags “improved confidence”." },
      { title: "Funder drills down and reviews", who: "Daniel", when: "jun30", to: "app/daniel/s21", what: "108 → sites → sessions; report accepted." },
    ],
  },
  {
    id: "D",
    name: "Bring existing funding onto Revivo Impact",
    minutes: "4 steps",
    steps: [
      { title: "Add existing funding", who: "Daniel", when: "jun30", to: "app/daniel/portfolio", what: "Ostral, $24,000; no new application. Ingrid approves the commitment (four-eyes)." },
      { title: "Carried-in figures", who: "Daniel", when: "jun30", to: "app/daniel/s15", what: "Released $12,000, reported $10,400, labelled." },
      { title: "Recipient confirms", who: "Farid Rahimi · Ostral", when: "jun30", to: "app/farid/s15", what: "Confirms the agreement and opening figures." },
      { title: "In the portfolio", who: "Daniel", when: "jun30", to: "app/daniel/portfolio", what: "Same chain; next update Thu 30 Sep." },
    ],
  },
  {
    id: "E",
    name: "Coach, guardian and safeguarding",
    minutes: "6 steps",
    steps: [
      { title: "One account, two athletes", who: "Rosa Esteves · guardian", when: "may06", to: "app/rosa/s3", what: "Switches between Tiago (16) and Inês (13)." },
      { title: "A coach with limited powers", who: "Rosa → Jonas Becker", when: "may06", to: "app/rosa/s22", what: "Prepare applications and submit updates only." },
      { title: "An anonymised funding request", who: "Rosa", when: "may06", to: "app/rosa/s10", what: "Swimmer · 16–17 · Coastal Region; identifiability check passes." },
      { title: "An offer through the guardian", who: "Kenji → Rosa", when: "may06", to: "app/kenji/request/tiago", what: "$2,600 blocked by the cap; $1,500 goes to Rosa, not the athlete." },
      { title: "Coach prepares, guardian submits", who: "Jonas → Rosa", when: "may06", to: "app/jonas/s11", what: "Application for the $900 still needed." },
      { title: "Consent withdrawn, request hidden", who: "Rosa", when: "jun30", to: "app/rosa/s22", what: "Photo removed everywhere; card leaves Discover; agreement continues." },
    ],
  },
];
