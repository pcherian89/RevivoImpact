import type { Person, RoleKey, World } from "../domain/model";

/** Main navigation per role: at most five items (docs/03 §2). `screen` is the route segment. */
export type NavItem = { label: string; screen: string };
export const NAV: Record<RoleKey, NavItem[]> = {
  athlete: [
    { label: "Home", screen: "home" },
    { label: "Discover", screen: "discover" },
    { label: "Applications", screen: "applications" },
    { label: "My Funding", screen: "funding" },
    { label: "Profile", screen: "me" },
  ],
  guardian: [
    { label: "Home", screen: "home" },
    { label: "My Athletes", screen: "safety" },
    { label: "Discover", screen: "discover" },
    { label: "Applications", screen: "applications" },
    { label: "Funding & Updates", screen: "funding" },
  ],
  coach: [
    { label: "Home", screen: "home" },
    { label: "My Athletes", screen: "me" },
    { label: "Discover", screen: "discover" },
    { label: "Applications", screen: "applications" },
    { label: "Funding & Updates", screen: "funding" },
  ],
  funder: [
    { label: "Overview", screen: "overview" },
    { label: "Discover", screen: "fdiscover" },
    { label: "Opportunities", screen: "opps" },
    { label: "Applications", screen: "apps" },
    { label: "Funding", screen: "portfolio" },
  ],
  sponsor: [
    { label: "Overview", screen: "overview" },
    { label: "Discover", screen: "fdiscover" },
    { label: "Opportunities", screen: "opps" },
    { label: "Applications", screen: "apps" },
    { label: "Funding", screen: "portfolio" },
  ],
  individual: [
    { label: "Overview", screen: "overview" },
    { label: "Discover", screen: "fdiscover" },
    { label: "Asks & offers", screen: "apps" },
    { label: "Funding", screen: "portfolio" },
  ],
  organisation: [
    { label: "Home", screen: "home" },
    { label: "Discover", screen: "discover" },
    { label: "Applications", screen: "applications" },
    { label: "Funding", screen: "funding" },
    { label: "Organisation", screen: "me" },
  ],
  "programme-coach": [
    { label: "Today", screen: "today" },
    { label: "Programme", screen: "programme" },
  ],
  admin: [{ label: "Audit & admin", screen: "admin" }],
};

/** Navigation for one person: organisations that run a programme get "Programme" in place of "Organisation". */
export function navFor(p: Person, w: World): NavItem[] {
  if (p.role === "organisation" && Object.values(w.programmes).some((x) => x.orgId === p.orgId))
    return [
      { label: "Home", screen: "home" },
      { label: "Programme", screen: "programme" },
      { label: "Funding", screen: "funding" },
      { label: "Discover", screen: "discover" },
      { label: "Applications", screen: "applications" },
    ];
  return NAV[p.role];
}

export const HOME_SCREEN: Record<RoleKey, string> = {
  athlete: "home",
  guardian: "home",
  coach: "home",
  funder: "overview",
  sponsor: "overview",
  individual: "overview",
  organisation: "home",
  "programme-coach": "today",
  admin: "admin",
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

