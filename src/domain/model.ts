/**
 * Revivo Impact domain model and the fictional world it starts from (docs/02, docs/05).
 * Every named record and figure comes from docs/05; light records come from a seeded generator (mulberry32), so the
 * world is identical on every run. No total is stored anywhere: screens derive them (selectors.ts).
 */

export type Moment = "apr12" | "may06" | "jun30";
export const MOMENTS: { id: Moment; label: string; short: string; date: string; note: string }[] = [
  { id: "apr12", label: "Mon 12 Apr 2027", short: "12 Apr", date: "2027-04-12", note: "Applications open" },
  { id: "may06", label: "Thu 6 May 2027", short: "6 May", date: "2027-05-06", note: "Selection and direct support" },
  { id: "jun30", label: "Wed 30 Jun 2027", short: "30 Jun", date: "2027-06-30", note: "Quarter-end review" },
];
export const ORDER: Record<Moment, number> = { apr12: 0, may06: 1, jun30: 2 };
export const DATE: Record<Moment, string> = { apr12: "2027-04-12", may06: "2027-05-06", jun30: "2027-06-30" };

export type RoleKey = "athlete" | "guardian" | "coach" | "funder" | "sponsor" | "individual" | "organisation" | "programme-coach" | "admin";
export type Perm = "Admin" | "Review" | "Verify" | "Approve" | "Finance";

export type Person = {
  id: string;
  name: string;
  role: RoleKey;
  title: string;
  orgId?: string;
  funderId?: string;
  athleteId?: string;
  perms: Perm[];
  group: "Seeking funding" | "Providing funding" | "Delivering programmes" | "Platform";
  journeys: string;
  tasks: string[];
  enhancedCheck?: boolean;
  /** Programme sites a coach records sessions for */
  sites?: string[];
  persona: boolean;
};

export type FunderType = "Foundation" | "Company" | "Sports brand" | "Government body" | "Federation" | "Individual sponsor";
export type Funder = {
  id: string;
  name: string;
  type: FunderType;
  sports: string;
  regions: string;
  typesLabel: string[];
  typical: string;
  accepts: "yes" | "commercial" | "opportunities";
  acceptsNote: string;
  acceptsMax?: number;
  /** Open asks this funder will receive at once (docs/02 §3.3); 20 by default. */
  askCap?: number;
  /** What an ask must match (sport tags or "any"; support tags) before it can be sent */
  acceptsSupport?: string[];
  adultsOrOrgsOnly?: boolean;
  objective: string;
  verified: boolean;
  /** Tags a seeker profile can match ("judo", "Coastal Region", "women", "para"…), for Sponsors & funders */
  relevant: string[];
};

export type FundingType = "Scholarship award" | "Development grant" | "Competition funding" | "Programme grant" | "Equipment support" | "Sponsorship agreement";
export type Behaviour = "development" | "programme" | "inkind" | "commercial";
export const BEHAVIOUR: Record<FundingType, Behaviour> = {
  "Scholarship award": "development",
  "Development grant": "development",
  "Competition funding": "development",
  "Programme grant": "programme",
  "Equipment support": "inkind",
  "Sponsorship agreement": "commercial",
};
export type Policy = "Simple" | "Standard" | "Institutional";
export type Fund = {
  id: string;
  funderId: string;
  name: string;
  type: FundingType;
  announced: number;
  max: number;
  tiers?: { amount: number; criterion: string }[];
  awards?: number;
  delegatedLimit?: number;
  policy: Policy;
};

export type RuleKind = "age" | "sport" | "region" | "result" | "referee" | "statement" | "para" | "womensTeam" | "organisation" | "squad" | "swimming";
export type Rule = { id: string; label: string; kind: RuleKind };
export type OppStatus = "draft" | "awaiting" | "open" | "upcoming" | "closed" | "decided";
export type Opportunity = {
  id: string;
  fundId: string;
  title: string;
  sportsLabel: string;
  purpose: string;
  amountLabel: string;
  awardsLabel: string;
  rules: Rule[];
  status: OppStatus;
  draftedBy?: string;
  publishedBy?: string;
  opens: string;
  closes: string;
  decisions: string;
  visibility: "Public" | "Restricted" | "Invitation only";
  nominations: boolean;
  minScore?: number;
  forOrganisations?: boolean;
  image: string;
};

export type FactState = "verified" | "confirmed" | "attested" | "awaiting" | "self";
export type Visibility = "discoverable" | "application" | "private";
export type Fact = {
  id: string;
  label: string;
  value: string;
  kind: "result" | "age" | "classification" | "attendance" | "goal" | "support" | "club" | "coach";
  visibility: Visibility;
  state: FactState;
  by?: string;
  date?: string;
  confirmAsked?: string;
};
export type Commercial = { social: string[]; audience: string; partnerships: string[]; activities: string[] };
export type Athlete = {
  id: string;
  name: string;
  age: number;
  minor: boolean;
  gender: "woman" | "man";
  guardianId?: string;
  sport: string;
  discipline: string;
  level: string;
  levelRank: number; // 1 regional … 4 international (eligibility only; never shown as a score)
  region: string;
  club?: string;
  facts: Fact[];
  discoverable: boolean;
  openToCommercial?: boolean;
  commercial?: Commercial;
  currentSupport: { label: string; amount: number; declared: boolean }[];
  tags: string[];
  light?: boolean;
  para?: boolean;
  createdAt: Moment;
};

export type Org = { id: string; name: string; type: string; region: string; sport: string; verified: boolean; light?: boolean };

export type RequestLine = { id: string; label: string; amount: number; otherSources: number };
export type FundingRequest = {
  id: string;
  ownerKind: "athlete" | "org";
  ownerId: string;
  title: string;
  sport: string;
  region: string;
  minor: boolean;
  ageGroup?: string;
  lines: RequestLine[];
  visibility: "Public" | "Verified funders only" | "Invitation only";
  discoverable: boolean;
  status: "review" | "open" | "closed";
  neededBy: string;
  neededMonth: string;
  publishedBy: string;
  publishedAt: Moment;
  safeguarding?: string;
  verifiedLabel: string;
  tags: string[];
  noClub?: boolean;
  representedBy?: string;
};

export type AppStatus = "draft" | "submitted" | "info" | "shortlisted" | "offered" | "waiting" | "notselected" | "noteligible" | "incomplete" | "accepted";
export type Application = {
  id: string;
  oppId: string;
  applicantKind: "athlete" | "org";
  applicantId: string;
  preparedBy: string;
  submittedBy?: string;
  status: AppStatus;
  requested: number;
  recommendedTier?: number;
  /** The plain message sent with an individual decision */
  decisionNote?: string;
  scores: { by: string; total: number }[];
  info?: { status: "open" | "answered"; text: string; by: string };
  otherFunding: string;
  statement: string;
  aiDrafted?: boolean;
  shared: string[];
  nominatedBy?: string;
  linked?: { requestId: string; amount: number };
  submittedAt?: Moment;
  pendingFact?: boolean;
  light?: boolean;
};

export type Ask = { id: string; requestId: string; funderId: string; lineId: string; amount: number; by: string; status: "sent" | "offered" | "notnow" | "question"; at: Moment };
export type Interest = { id: string; funderId: string; by: string; athleteId: string; reason: string; status: "sent" | "shared" | "declined"; at: Moment };
export type OfferStatus = "second-approval" | "safeguarding" | "held" | "accepted" | "declined" | "withdrawn";
export type Offer = {
  id: string;
  fundId: string;
  by: string;
  recipientKind: "athlete" | "org";
  recipientId: string;
  requestId?: string;
  lineId?: string;
  applicationId?: string;
  amount: number;
  reason: string;
  status: OfferStatus;
  approvedBy?: string;
  at: Moment;
  deliverables?: string[];
  light?: boolean;
};
export type Agreement = {
  id: string;
  offerId?: string;
  fundId: string;
  recipientKind: "athlete" | "org";
  recipientId: string;
  amount: number;
  acceptedBy: string;
  acceptedAt: Moment;
  origin: "Application" | "Offer" | "Existing agreement";
  requestId?: string;
  lineId?: string;
  light?: boolean;
  /** Existing funding (Journey D): prepared → approved by a second person → confirmed by the recipient. */
  status?: "awaiting-approval" | "awaiting-recipient" | "active" | "disputed";
  preparedBy?: string;
  approvedBy?: string;
  purpose?: string;
  /** Plain-language schedule, e.g. "Next update due Thu 30 Sep" */
  nextUpdate?: string;
  /** In-kind (equipment) agreements: items, never cash */
  kits?: { items: number; declaredValue: number };
  disputeReason?: string;
};

/** What the money was spent on (docs/02 §6). Reported by the recipient; checked by a person at the funder. */
export type Expense = { id: string; agreementId: string; what: string; amount: number; paidOn: string; receipt: boolean; category?: string; by: string; at: Moment; status: "reported" | "checked" | "query" | "carried-in"; checkedBy?: string; query?: string };
/** Sporting progress: a result, training or a milestone, with or without proof. */
export type Progress = { id: string; agreementId?: string; athleteId?: string; orgId?: string; kind: "result" | "training" | "milestone"; text: string; proof: boolean; attestedBy?: string; photo?: boolean; by: string; at: Moment };
/** Commercial sponsorship deliverables: separate from money, never a cash bar. */
export type Deliverable = { id: string; agreementId: string; label: string; due: string; target: number; done: number; pending: number; status: "scheduled" | "in-progress" | "complete"; evidence?: { text: string; at: Moment; accepted: boolean }[] };
export type ReviewDecision = { id: string; agreementId: string; decision: "Continue" | "Continue with conditions" | "Pause" | "Close"; conditions?: string; by: string; at: Moment };
export type Site = { id: string; name: string; participants: number };
export type Programme = { id: string; name: string; orgId: string; agreementId: string; sport: string; purpose: string; sites: Site[]; sessionsPerSite: number; budget: { line: string; amount: number }[] };
export type Session = { id: string; programmeId: string; siteId: string; slot: number; date: string; status: "delivered" | "missed"; attendance?: number; reason?: "weather" | "coach availability" | "venue unavailable" | "other"; note?: string; by: string; at: Moment; checked: boolean };
export type RecoveryPlan = { id: string; programmeId: string; siteId: string; text: string; by: string; at: Moment; status: "submitted" | "approved" | "returned"; decidedBy?: string; reason?: string };
export type ActionItem = { id: string; programmeId: string; siteId: string; text: string; assignedTo: string; by: string; at: Moment; status: "open" | "done" };
export type Report = { id: string; agreementId: string; period: string; text: string; by: string; at: Moment; status: "draft" | "submitted" | "accepted" | "returned"; decidedBy?: string; reason?: string };
export type LedgerEntry = { id: string; agreementId: string; kind: "release" | "receipt" | "carried-in"; amount: number; by: string; at: Moment; ref: string };
export type Authorisation = { athleteId: string; coachId: string; powers: ("prepare" | "updates")[]; by: string };
export type Consent = { athleteId: string; purpose: "photos" | "progress" | "discoverable"; value: boolean; by: string };

export type AuditRow = { n: number; at: Moment; actor: string; onBehalf?: string; action: string; record: string };

export type World = {
  moment: Moment;
  people: Record<string, Person>;
  funders: Record<string, Funder>;
  orgs: Record<string, Org>;
  funds: Record<string, Fund>;
  opps: Record<string, Opportunity>;
  athletes: Record<string, Athlete>;
  requests: Record<string, FundingRequest>;
  applications: Record<string, Application>;
  asks: Record<string, Ask>;
  interests: Record<string, Interest>;
  offers: Record<string, Offer>;
  agreements: Record<string, Agreement>;
  ledger: LedgerEntry[];
  shortlists: Record<string, string[]>;
  authorisations: Authorisation[];
  consents: Consent[];
  blocks: { athleteId: string; funderId: string }[];
  concerns: { id: string; athleteId: string; funderId?: string; about: string; by: string; at: Moment; status: "open" | "reviewed" }[];
  expenses: Record<string, Expense>;
  progress: Record<string, Progress>;
  deliverables: Record<string, Deliverable>;
  reviews: Record<string, ReviewDecision>;
  programmes: Record<string, Programme>;
  sessions: Record<string, Session>;
  recoveryPlans: Record<string, RecoveryPlan>;
  actions: Record<string, ActionItem>;
  reports: Record<string, Report>;
  /** Opportunities a seeker saved for later */
  saved: Record<string, string[]>;
  /** In-kind kits delivered (count, never cash) */
  kitDeliveries: { at: Moment; items: number }[];
  /** Existing funding: figures entered before approval (become ledger entries on approval) */
  carriedIn?: Record<string, { paid: number; spent: number }>;
  audit: AuditRow[];
  seq: number;
};

/* ------------------------------------------------------------------ seed */

function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const P = (p: Omit<Person, "persona"> & { persona?: boolean }): Person => ({ persona: true, ...p });

const PEOPLE: Person[] = [
  P({ id: "amira", name: "Amira Haddad", role: "athlete", title: "Athlete, 19 · judo", athleteId: "amira", perms: [], group: "Seeking funding", journeys: "A", tasks: ["Check eligibility", "Apply with help", "Find sponsors that support judo"] }),
  P({ id: "nadia", name: "Nadia Kovač", role: "athlete", title: "Athlete, 23 · wheelchair racing", athleteId: "nadia", perms: [], group: "Seeking funding", journeys: "B", tasks: ["Publish a funding request", "Ask a sponsor for support", "Accept an offer"] }),
  P({ id: "jonah", name: "Jonah Reyes", role: "athlete", title: "Athlete, 22 · sprinter", athleteId: "jonah", perms: [], group: "Seeking funding", journeys: "B", tasks: ["See your commercial profile", "Accept a sponsorship agreement", "See it kept apart from development funding"] }),
  P({ id: "rosa", name: "Rosa Esteves", role: "guardian", title: "Guardian of Tiago (16) and Inês (13)", perms: [], group: "Seeking funding", journeys: "E", tasks: ["Switch athletes", "Publish an anonymised request", "Authorise a coach"] }),
  P({ id: "jonas", name: "Jonas Becker", role: "coach", title: "Head swim coach · Saltmere Sports Academy", orgId: "saltmere", perms: [], group: "Seeking funding", journeys: "E", tasks: ["Prepare an application (you cannot submit it)", "See only athletes who authorised you"] }),
  P({ id: "maya", name: "Maya Torres", role: "organisation", title: "Programme director", orgId: "lanternfield", perms: ["Admin", "Approve"], group: "Delivering programmes", journeys: "C", tasks: ["Find programme funding", "See what your organisation can apply for"] }),
  P({ id: "ewan", name: "Morag Linden", role: "organisation", title: "Club secretary · Admin", orgId: "highland", perms: ["Admin", "Approve", "Finance"], group: "Seeking funding", journeys: "C", tasks: ["See your request and the offer you received"], persona: true }),
  P({ id: "lena", name: "Lena Novak", role: "organisation", title: "Greenpark site coordinator · Lanternfield", orgId: "lanternfield", sites: ["greenpark"], perms: ["Verify"], group: "Delivering programmes", journeys: "C", tasks: ["Submit a recovery plan for Greenpark", "Check sessions at your site"] }),
  P({ id: "sam", name: "Sam Rivera", role: "programme-coach", title: "Coach · Greenpark and Westbrook", orgId: "lanternfield", sites: ["greenpark", "westbrook"], perms: [], group: "Delivering programmes", journeys: "C", tasks: ["Record today's session", "Mark a session that couldn't run"] }),
  P({ id: "ingrid", name: "Ingrid Solberg", role: "funder", title: "Director of Programmes · Approve", orgId: "tallwater", funderId: "tallwater", perms: ["Approve", "Admin"], group: "Providing funding", journeys: "A", tasks: ["Publish Daniel's draft", "Decide the scholarship offers", "Try to approve your own draft"] }),
  P({ id: "daniel", name: "Daniel Osei", role: "funder", title: "Programme officer · Review, Verify", orgId: "tallwater", funderId: "tallwater", perms: ["Review", "Verify"], group: "Providing funding", journeys: "A, C, D", tasks: ["Verify a fact against a document", "Request information", "Score and shortlist"] }),
  P({ id: "priya", name: "Priya Nair", role: "funder", title: "Finance officer · Finance", orgId: "tallwater", funderId: "tallwater", perms: ["Finance"], group: "Providing funding", journeys: "A, C", tasks: ["Record a release", "See that you cannot approve awards"] }),
  P({ id: "kenji", name: "Kenji Arakawa", role: "sponsor", title: "CSR manager · Approve, Review, Finance", orgId: "oriel", funderId: "oriel", perms: ["Approve", "Review", "Finance"], group: "Providing funding", journeys: "B, E", tasks: ["Search with a plain-language brief", "Meet the offer cap and your limit", "Answer a support ask"] }),
  P({ id: "lucy", name: "Lucy Adeyemi", role: "sponsor", title: "Partnerships · Approve, Review, Finance", orgId: "corvane", funderId: "corvane", perms: ["Approve", "Review", "Finance"], group: "Providing funding", journeys: "B", tasks: ["Find an adult sprinter open to partners", "Express interest, then offer a sponsorship agreement"] }),
  P({ id: "marcus", name: "Marcus Halvorsen", role: "individual", title: "Verified individual sponsor", funderId: "halvorsen", perms: ["Approve", "Review", "Finance"], group: "Providing funding", journeys: "B, C", tasks: ["Answer a support ask", "Fund a club you did not know", "Offer to a young athlete through her guardian"], enhancedCheck: true }),
  P({ id: "farid", name: "Farid Rahimi", role: "funder", title: "Development manager", orgId: "ostral", funderId: "ostral", perms: ["Admin", "Approve", "Finance", "Review"], group: "Providing funding", journeys: "D", tasks: ["See nominations you made", "See your Competition Travel Grant"] }),
  P({ id: "alex", name: "Alex Moreau", role: "admin", title: "Platform administrator", perms: ["Admin"], group: "Platform", journeys: "E", tasks: ["Review an offer to a minor", "Check an anonymised card", "Read the audit"] }),
  // Non-persona people (appear in records and the audit)
  P({ id: "reviewer2", name: "Second reviewer", role: "funder", title: "Reviewer · Tallwater", orgId: "tallwater", funderId: "tallwater", perms: ["Review"], group: "Providing funding", journeys: "", tasks: [], persona: false }),
  P({ id: "ardent-officer", name: "Results officer", role: "funder", title: "Ardent Judo Federation · Verify", orgId: "ardent", funderId: "ardent", perms: ["Verify"], group: "Providing funding", journeys: "", tasks: [], persona: false }),
  P({ id: "oriel-approver", name: "Second approver", role: "sponsor", title: "Oriel Freight Group · Approve", orgId: "oriel", funderId: "oriel", perms: ["Approve"], group: "Providing funding", journeys: "", tasks: [], persona: false }),
  P({ id: "keiko", name: "Keiko Mori", role: "coach", title: "Judo coach · Saltmere", orgId: "saltmere", perms: [], group: "Seeking funding", journeys: "", tasks: [], persona: false }),
  P({ id: "system", name: "Revivo Impact", role: "admin", title: "Seeded world", perms: [], group: "Platform", journeys: "", tasks: [], persona: false }),
];

const FUNDERS: Funder[] = [
  { id: "tallwater", name: "Tallwater Sports Foundation", type: "Foundation", sports: "Multi-sport", regions: "All regions", typesLabel: ["Scholarship award", "Programme grant", "Development grant"], typical: "$3,500–$60,000", accepts: "opportunities", acceptsNote: "Only through its published opportunities", objective: "Help emerging athletes and community programmes stay in sport.", verified: true, relevant: ["judo", "swimming", "athletics", "any", "Coastal Region"] },
  { id: "oriel", name: "Oriel Freight Group", type: "Company", sports: "Any sport", regions: "Any region", typesLabel: ["Development grant", "Equipment support"], typical: "Up to $2,000", accepts: "yes", acceptsNote: "Accepts direct requests: equipment and competition travel, any sport, any region, up to $2,000", acceptsMax: 2000, acceptsSupport: ["Equipment", "Travel"], objective: "Get athletes to competitions and clubs properly equipped.", verified: true, relevant: ["any"] },
  { id: "crsc", name: "Coastal Region Sports Council", type: "Government body", sports: "Multi-sport", regions: "Coastal Region", typesLabel: ["Competition funding"], typical: "$800–$1,500", accepts: "opportunities", acceptsNote: "Only through its published opportunities", objective: "Support Coastal Region athletes to compete nationally.", verified: true, relevant: ["Coastal Region"] },
  { id: "ardent", name: "Ardent Judo Federation", type: "Federation", sports: "Judo", regions: "National", typesLabel: ["Competition funding"], typical: "Up to $1,200", accepts: "opportunities", acceptsNote: "Only through its published opportunities; confirms judo results on athletes' profiles", objective: "Develop the national judo pathway.", verified: true, relevant: ["judo"] },
  { id: "halvorsen", name: "Marcus Halvorsen", type: "Individual sponsor", sports: "Rowing, cycling, para sport, athletics, badminton", regions: "Any region", typesLabel: ["Development grant"], typical: "Up to $2,500", accepts: "yes", acceptsNote: "Accepts direct requests: travel and equipment for adults, teams and clubs, up to $2,500; young athletes only through their guardian or club", acceptsMax: 2500, acceptsSupport: ["Equipment", "Travel", "Coaching"], objective: "A former rower supporting athletes and clubs who need a first push.", verified: true, relevant: ["any", "para", "rowing"] },
  { id: "fennick", name: "Fennick Nutrition", type: "Sports brand", sports: "Endurance and combat sports", regions: "Any region", typesLabel: ["Sponsorship agreement"], typical: "$2,000–$8,000", accepts: "commercial", acceptsNote: "Accepts commercial proposals from adult athletes", objective: "Partner with adult athletes who train seriously and share their preparation.", verified: true, relevant: ["judo", "boxing", "athletics", "cycling"] },
  { id: "verran", name: "Verran Sports Trust", type: "Foundation", sports: "Para sport, women's sport", regions: "All regions", typesLabel: ["Development grant"], typical: "Up to $2,500", accepts: "opportunities", acceptsNote: "Only through its published opportunities", objective: "Remove cost barriers for para and women athletes.", verified: true, relevant: ["women", "para"] },
  { id: "corvane", name: "Corvane Sportswear", type: "Sports brand", sports: "Athletics, women's football", regions: "Any region", typesLabel: ["Development grant", "Sponsorship agreement"], typical: "$3,000–$8,000", accepts: "commercial", acceptsNote: "Accepts commercial proposals from adult athletes and clubs", objective: "Grow women's sport and partner with adult athletes.", verified: true, relevant: ["athletics", "football"] },
  { id: "ostral", name: "Ostral Swimming Federation", type: "Federation", sports: "Swimming", regions: "National", typesLabel: ["Competition funding"], typical: "Up to $1,500", accepts: "opportunities", acceptsNote: "Only through its published opportunities", objective: "Get swimmers to the competitions their results earn.", verified: true, relevant: ["swimming"] },
];

const FUNDS: Fund[] = [
  { id: "eas", funderId: "tallwater", name: "Emerging Athletes Scholarship 2027", type: "Scholarship award", announced: 250000, max: 5000, awards: 50, policy: "Institutional", tiers: [ { amount: 5000, criterion: "International results or a national title" }, { amount: 4500, criterion: "A national medal" }, { amount: 3500, criterion: "A national final or a top-8 national ranking" } ] },
  { id: "cspg", funderId: "tallwater", name: "Community Sports Programme Grant 2027–28", type: "Programme grant", announced: 180000, max: 60000, policy: "Institutional" },
  { id: "fdg", funderId: "tallwater", name: "Federation Development Grants", type: "Development grant", announced: 60000, max: 24000, policy: "Institutional" },
  { id: "cspg2", funderId: "tallwater", name: "Community Sports Programme Grant · Round 2", type: "Programme grant", announced: 200000, max: 60000, policy: "Institutional" },
  { id: "fac", funderId: "tallwater", name: "Facilities Small Grants", type: "Programme grant", announced: 80000, max: 10000, policy: "Standard" },
  { id: "wsdf", funderId: "corvane", name: "Women's Sporting Development Fund", type: "Development grant", announced: 40000, max: 3500, policy: "Standard" },
  { id: "cap", funderId: "corvane", name: "Corvane Athlete Partnerships", type: "Sponsorship agreement", announced: 30000, max: 8000, policy: "Simple" },
  { id: "oas", funderId: "oriel", name: "Oriel Athlete Support", type: "Development grant", announced: 20000, max: 5000, delegatedLimit: 2000, policy: "Simple" },
  { id: "kit", funderId: "oriel", name: "Oriel Kit Scheme", type: "Equipment support", announced: 9000, max: 1500, policy: "Standard" },
  { id: "crsc-tb", funderId: "crsc", name: "Athlete Travel Bursary 2027", type: "Competition funding", announced: 36000, max: 1500, policy: "Standard" },
  { id: "verran-pe", funderId: "verran", name: "Para Athlete Equipment Grant", type: "Development grant", announced: 25000, max: 2500, policy: "Standard" },
  { id: "verran-ce", funderId: "verran", name: "Coach Education Bursary", type: "Development grant", announced: 15000, max: 1500, policy: "Standard" },
  { id: "ardent-hp", funderId: "ardent", name: "High Performance Camp Support", type: "Competition funding", announced: 12000, max: 1200, policy: "Standard" },
  { id: "ostral-ctg", funderId: "ostral", name: "Competition Travel Grant", type: "Competition funding", announced: 30000, max: 1500, policy: "Standard" },
  { id: "has", funderId: "halvorsen", name: "Halvorsen Athlete Support", type: "Development grant", announced: 10000, max: 2500, policy: "Simple" },
  { id: "fap", funderId: "fennick", name: "Fennick Athlete Partnerships", type: "Sponsorship agreement", announced: 15000, max: 8000, policy: "Simple" },
];

const R = (id: string, label: string, kind: RuleKind): Rule => ({ id, label, kind });
const OPPS: Opportunity[] = [
  { id: "eas", fundId: "eas", title: "Emerging Athletes Scholarship", sportsLabel: "9 sports incl. judo", purpose: "Coaching, training fees, competition entry and travel, and equipment for the season", amountLabel: "Up to $5,000", awardsLabel: "Up to 50 awards", rules: [R("age", "Aged 15–21 on 30 Apr 2027", "age"), R("sport", "One of 9 sports", "sport"), R("region", "Lives in an eligible region", "region"), R("result", "A national-level result in the last 18 months", "result"), R("referee", "A coach or club referee", "referee"), R("statement", "A statement of financial need", "statement")], status: "awaiting", draftedBy: "daniel", opens: "2027-04-12", closes: "2027-04-30", decisions: "Thu 6 May", visibility: "Public", nominations: true, minScore: 11, image: "im-05-discover-opportunities.png" },
  { id: "crsc-tb", fundId: "crsc-tb", title: "Athlete Travel Bursary 2027", sportsLabel: "Any sport", purpose: "Travel to national competitions", amountLabel: "$800–$1,500", awardsLabel: "About 24 bursaries", rules: [R("region", "Lives in Coastal Region", "region"), R("age", "Aged 16 or over", "age"), R("result", "A national-level entry this season", "result"), R("statement", "Travel budget", "statement")], status: "open", opens: "2027-04-01", closes: "2027-05-14", decisions: "Fri 28 May", visibility: "Public", nominations: false, image: "im-11-competition-travel.png" },
  { id: "ardent-hp", fundId: "ardent-hp", title: "High Performance Camp Support", sportsLabel: "Judo", purpose: "Training camp costs for U23 judoka", amountLabel: "Up to $1,200", awardsLabel: "10 places", rules: [R("sport", "Judo", "sport"), R("age", "Under 23", "age"), R("result", "A national-level result", "result"), R("squad", "On the national squad list", "squad")], status: "open", opens: "2027-04-05", closes: "2027-05-21", decisions: "Fri 4 Jun", visibility: "Public", nominations: false, image: "im-12-judo-camp.png" },
  { id: "wsdf", fundId: "wsdf", title: "Women's Sporting Development Fund", sportsLabel: "Women's team sports, coaching", purpose: "Development of women's teams and coaches", amountLabel: "$3,000–$3,500", awardsLabel: "About 12 grants", rules: [R("womensTeam", "Women's team sport or coaching", "womensTeam"), R("organisation", "A club, team or coach applies", "organisation")], status: "open", opens: "2027-03-15", closes: "2027-04-16", decisions: "Thu 6 May", visibility: "Public", nominations: false, image: "im-10-womens-football.png" },
  { id: "verran-pe", fundId: "verran-pe", title: "Para Athlete Equipment Grant", sportsLabel: "Para sport", purpose: "Equipment for para athletes", amountLabel: "Up to $2,500", awardsLabel: "About 10 grants", rules: [R("para", "A para athlete with a classification", "para"), R("statement", "Equipment quote", "statement")], status: "open", opens: "2027-04-01", closes: "2027-05-28", decisions: "Fri 11 Jun", visibility: "Public", nominations: false, image: "im-09-para-athlete.png" },
  { id: "ostral-ctg", fundId: "ostral-ctg", title: "Competition Travel Grant", sportsLabel: "Swimming", purpose: "Travel to qualifying swimming competitions", amountLabel: "Up to $1,500", awardsLabel: "About 20 grants", rules: [R("swimming", "Swimming", "swimming"), R("result", "A qualifying time", "result")], status: "open", opens: "2027-04-01", closes: "2027-05-31", decisions: "Fri 16 Jul", visibility: "Public", nominations: true, image: "im-11-competition-travel.png" },
  { id: "kit", fundId: "kit", title: "Oriel Kit Scheme", sportsLabel: "Grassroots clubs", purpose: "Kit for community clubs (in-kind)", amountLabel: "Up to 10 kits", awardsLabel: "60 kits", rules: [R("organisation", "A community club", "organisation")], status: "decided", opens: "2027-02-01", closes: "2027-03-01", decisions: "Mar 2027", visibility: "Public", nominations: false, forOrganisations: true, image: "im-13-equipment-handover.png" },
  { id: "cspg2", fundId: "cspg2", title: "Community Sports Programme Grant · Round 2", sportsLabel: "Community sport", purpose: "Grassroots programmes", amountLabel: "$200,000 in total", awardsLabel: "Programmes", rules: [R("organisation", "A programme operator", "organisation")], status: "upcoming", opens: "2027-09-06", closes: "2027-10-29", decisions: "Dec 2027", visibility: "Public", nominations: false, forOrganisations: true, image: "im-08-community-programme.png" },
  { id: "fac", fundId: "fac", title: "Facilities Small Grants", sportsLabel: "Community sport", purpose: "Small facility improvements", amountLabel: "Up to $10,000 each", awardsLabel: "$80,000 announced", rules: [R("organisation", "A club or community organisation", "organisation")], status: "upcoming", opens: "2027-08-02", closes: "2027-09-17", decisions: "Oct 2027", visibility: "Public", nominations: false, forOrganisations: true, image: "im-15-facilities.png" },
  { id: "verran-ce", fundId: "verran-ce", title: "Coach Education Bursary", sportsLabel: "Para and women's sport", purpose: "Coaching qualifications", amountLabel: "Up to $1,500", awardsLabel: "$15,000 announced", rules: [R("organisation", "Coaches", "organisation")], status: "upcoming", opens: "2027-07-01", closes: "2027-08-13", decisions: "Sep 2027", visibility: "Public", nominations: false, forOrganisations: true, image: "im-16-coach-education.png" },
];

const ORGS: Org[] = [
  { id: "tallwater", name: "Tallwater Sports Foundation", type: "Foundation", region: "International", sport: "Multi-sport", verified: true },
  { id: "oriel", name: "Oriel Freight Group", type: "Company", region: "Any", sport: "Any", verified: true },
  { id: "corvane", name: "Corvane Sportswear", type: "Sports brand", region: "Any", sport: "Athletics", verified: true },
  { id: "ostral", name: "Ostral Swimming Federation", type: "Federation", region: "National", sport: "Swimming", verified: true },
  { id: "ardent", name: "Ardent Judo Federation", type: "Federation", region: "National", sport: "Judo", verified: true },
  { id: "saltmere", name: "Saltmere Sports Academy", type: "Multi-sport academy", region: "Coastal Region", sport: "Multi-sport", verified: true },
  { id: "lanternfield", name: "Lanternfield Community Sport", type: "Programme operator", region: "Central Region", sport: "Community sport", verified: true },
  { id: "ashgrove", name: "Ashgrove Boxing Club", type: "Community club", region: "Northern Region", sport: "Boxing", verified: true },
  { id: "lakeside", name: "Lakeside Women's FC", type: "Adult women's football club", region: "Lakes Region", sport: "Football", verified: true },
  { id: "eastbrook", name: "Eastbrook Rowing Club", type: "Rowing club", region: "Lakes Region", sport: "Rowing", verified: true },
  { id: "highland", name: "Highland Cycling Club", type: "Cycling club", region: "Highland Region", sport: "Cycling", verified: true },
];

export const REGIONS = ["Coastal Region", "Northern Region", "Central Region", "Lakes Region", "Southern Region", "Highland Region"];
const EAS_SPORTS = ["Athletics", "Badminton", "Boxing", "Cycling", "Judo", "Rowing", "Swimming", "Table tennis", "Wheelchair basketball"];
const FIRST_W = ["Aisha", "Mei", "Sofia", "Zanele", "Priyanka", "Lena", "Yara", "Ines", "Hana", "Amara", "Freya", "Leila", "Nia", "Camila", "Tara", "Maren", "Ada", "Rhea", "Selin", "Noor", "Elena", "Kaya", "Ruth", "Ivy", "Dalia", "Mira", "Esme", "Lucia", "Yuki", "Farah"];
const FIRST_M = ["Tomas", "Kofi", "Arjun", "Mateo", "Ilyas", "Daniel", "Kai", "Omar", "Felix", "Jun", "Rafael", "Sami", "Theo", "Emeka", "Luca", "Ravi", "Anders", "Diego", "Hamza", "Niko", "Ade", "Jonas", "Malik", "Ezra", "Viktor", "Tariq", "Bruno", "Kenta", "Idris", "Oskar"];
const LAST = ["Okafor", "Lindgren", "Haddou", "Petrov", "Mensah", "Castillo", "Nakamura", "Rahman", "Fischer", "Adeleke", "Moreno", "Kowalski", "Osei-Bonsu", "Varga", "Sato", "Nilsen", "Delgado", "Achterberg", "Kamara", "Bianchi", "Duarte", "Haugen", "Ibrahim", "Laine", "Mwangi", "Novotny", "Quiroga", "Rasku", "Tembo", "Wiltshire", "Yilmaz", "Zielinski", "Abara", "Brennan", "Chua", "Dossou"];

/** Generated, deterministic evidence for light profiles: n verified facts, then one self-reported. */
function lightFacts(id: string, sport: string, level: string, n: number, visibility: Visibility): Fact[] {
  const all = [
    fact(`${id}-r1`, "Result", `${level}, National ${sport} Championships 2026`, "result", "verified", visibility, `${sport} national federation (results list)`, "8 Mar"),
    fact(`${id}-coach`, "Coach reference", "Club coach", "coach", "confirmed", visibility, "the club", "10 Mar"),
    fact(`${id}-r2`, "Result", `Regional ${sport} Open 2026`, "result", "verified", visibility, "Regional association", "2 Feb"),
  ];
  return [...all.slice(0, Math.max(0, Math.min(n, 3))), fact(`${id}-goal`, "Season goal", `Compete at national level in ${sport.toLowerCase()}`, "goal", "self", visibility)];
}

function fact(id: string, label: string, value: string, kind: Fact["kind"], state: FactState, visibility: Visibility = "discoverable", by?: string, date?: string): Fact {
  return { id, label, value, kind, state, visibility, by, date };
}

/** Amira's athlete record as she builds it in Journey A step 3 (she registers in step 2). */
export const AMIRA_PROFILE = (): Athlete => ({ id: "amira", name: "Amira Haddad", age: 19, minor: false, gender: "woman", sport: "Judo", discipline: "−63kg · U21", level: "National medallist", levelRank: 3, region: "Coastal Region", club: "Saltmere Sports Academy", discoverable: false, currentSupport: [{ label: "Saltmere travel bursary", amount: 300, declared: false }], tags: ["judo", "Coastal Region", "women", "Travel", "Coaching"], createdAt: "apr12", facts: [] });

/** The world on Mon 12 Apr 2027, 09:00, before any journey step. */
export function baseWorld(): World {
  const rnd = mulberry32(20270412);
  const pick = <T,>(xs: T[]) => xs[Math.floor(rnd() * xs.length)];
  const w: World = {
    moment: "apr12",
    people: Object.fromEntries(PEOPLE.map((p) => [p.id, structuredClone(p)])),
    funders: Object.fromEntries(FUNDERS.map((f) => [f.id, structuredClone(f)])),
    orgs: Object.fromEntries(ORGS.map((o) => [o.id, structuredClone(o)])),
    funds: Object.fromEntries(FUNDS.map((f) => [f.id, structuredClone(f)])),
    opps: Object.fromEntries(OPPS.map((o) => [o.id, structuredClone(o)])),
    athletes: {},
    requests: {},
    applications: {},
    asks: {},
    interests: {},
    offers: {},
    agreements: {},
    ledger: [],
    shortlists: {},
    authorisations: [],
    consents: [],
    blocks: [],
    concerns: [],
    expenses: {},
    progress: {},
    deliverables: {},
    reviews: {},
    programmes: {},
    sessions: {},
    recoveryPlans: {},
    actions: {},
    reports: {},
    saved: {},
    kitDeliveries: [],
    audit: [],
    seq: 0,
  };
  const A = (a: Athlete) => (w.athletes[a.id] = a);

  // Named athletes (docs/05 §5)
  A({ id: "nadia", name: "Nadia Kovač", age: 23, minor: false, gender: "woman", sport: "Wheelchair racing", discipline: "T54 · 800m, 1500m", level: "Continental level", levelRank: 3, region: "Coastal Region", club: "Saltmere para squad", discoverable: true, para: true, currentSupport: [], tags: ["Para athletics", "Adults only", "National level", "Verified evidence", "Equipment", "Travel", "para", "women", "Coastal Region"], createdAt: "apr12", facts: [
    fact("nadia-class", "Classification", "T54", "classification", "verified", "discoverable", "Classification panel (document)", "2 Mar"),
    fact("nadia-r1", "Result", "2nd, 800m T54, national championships 2026", "result", "verified", "discoverable", "Results list", "18 Sep 2026"),
    fact("nadia-r2", "Result", "5th, 1500m T54, Continental Para Athletics Series 2026", "result", "verified", "discoverable", "Results list", "4 Oct 2026"),
    fact("nadia-coach", "Coach reference", "Saltmere Sports Academy", "coach", "verified", "application", "Saltmere Sports Academy", "10 Mar"),
    fact("nadia-goal", "Season goal", "Qualify for the continental final", "goal", "self", "discoverable"),
  ] });
  A({ id: "jonah", name: "Jonah Reyes", age: 22, minor: false, gender: "man", sport: "Athletics", discipline: "Sprint · 200m", level: "National finalist 2026", levelRank: 3, region: "Southern Region", discoverable: true, openToCommercial: true, currentSupport: [], tags: ["Athletics: sprint", "Adults only", "Open to commercial partners", "National level", "Verified evidence", "athletics"], createdAt: "apr12",
    commercial: { social: ["@jonahreyes.runs (photo sharing)", "Jonah Reyes Running (video channel)"], audience: "About 8,400 followers across two accounts (self-reported)", partnerships: ["Local physiotherapy clinic, 2026 (kit and treatment)"], activities: ["Wear partner kit at meets", "One coaching clinic a season", "A content day a year"] },
    facts: [
      fact("jonah-r1", "Result", "National 200m finalist 2026 (6th)", "result", "verified", "discoverable", "Results list", "22 Aug 2026"),
      fact("jonah-pb", "Personal best", "200m 21.1", "result", "verified", "discoverable", "Results list", "22 Aug 2026"),
      fact("jonah-goal", "Season goal", "National 200m final and a continental entry", "goal", "self", "discoverable"),
      fact("jonah-club", "Club", "Southern Athletics Club", "club", "self", "discoverable"),
      fact("jonah-coach", "Coach", "Club sprint coach", "coach", "self", "application"),
    ] });
  A({ id: "elif", name: "Elif Demir", age: 24, minor: false, gender: "woman", sport: "Rowing", discipline: "Single scull", level: "National level", levelRank: 3, region: "Lakes Region", club: "Eastbrook Rowing Club", discoverable: true, currentSupport: [{ label: "Halvorsen Athlete Support", amount: 1000, declared: true }], tags: ["Adults only", "Equipment", "National level", "Verified evidence", "rowing", "women"], createdAt: "apr12", facts: [
    fact("elif-r1", "Result", "National single scull, 4th 2026", "result", "verified", "discoverable", "Results list", "12 Jul 2026"),
    fact("elif-r2", "Result", "Regional champion 2026", "result", "verified", "discoverable", "Results list", "6 Jun 2026"),
  ] });
  A({ id: "tiago", name: "Tiago Esteves", age: 16, minor: true, gender: "man", guardianId: "rosa", sport: "Swimming", discipline: "200m freestyle", level: "National qualifier", levelRank: 3, region: "Coastal Region", club: "Saltmere Sports Academy", discoverable: false, currentSupport: [], tags: ["Swimming", "Travel", "Coastal Region", "Verified evidence", "swimming"], createdAt: "apr12", facts: [
    fact("tiago-q", "Qualification", "Qualified for the Ostral National Age-Group Championships", "result", "verified", "application", "Ostral Swimming Federation (document)", "28 Mar"),
  ] });
  A({ id: "ines", name: "Inês Esteves", age: 13, minor: true, gender: "woman", guardianId: "rosa", sport: "Football", discipline: "Midfield", level: "Club", levelRank: 1, region: "Coastal Region", club: "Saltmere Sports Academy", discoverable: false, currentSupport: [], tags: ["football"], createdAt: "apr12", facts: [] });
  // Jonas's other authorised athletes (light)
  ["Kofi Mensah", "Lena Haugen", "Ilyas Rahman", "Mei Nakamura", "Freya Nilsen"].forEach((n, i) =>
    A({ id: `sw${i + 1}`, name: n, age: 15 + (i % 3), minor: true, gender: i % 2 ? "woman" : "man", sport: "Swimming", discipline: "Freestyle", level: "Regional", levelRank: 2, region: "Coastal Region", club: "Saltmere Sports Academy", discoverable: false, currentSupport: [], tags: ["swimming"], createdAt: "apr12", facts: [], light: true }),
  );
  w.authorisations.push(...["sw1", "sw2", "sw3", "sw4", "sw5"].map((id) => ({ athleteId: id, coachId: "jonas", powers: ["prepare", "updates"] as ("prepare" | "updates")[], by: "guardian" })));

  // Light athletes: 240 in total, cells for the identifiability check filled deliberately (docs/05 §8).
  let n = 0;
  const mk = (sport: string, minAge: number, maxAge: number, region: string | null, extra: Partial<Athlete> = {}) => {
    n++;
    const woman = rnd() < 0.5;
    const name = `${pick(woman ? FIRST_W : FIRST_M)} ${pick(LAST)}`;
    const age = minAge + Math.floor(rnd() * (maxAge - minAge + 1));
    const reg = region ?? pick(REGIONS);
    const rank = 1 + Math.floor(rnd() * 4);
    const levels = ["Regional", "National finalist", "National medallist", "International"];
    A({ id: `l${n}`, name, age, minor: age < 18, gender: woman ? "woman" : "man", sport, discipline: sport, level: levels[rank - 1], levelRank: rank, region: reg, discoverable: false, currentSupport: [], tags: [sport.toLowerCase(), reg], createdAt: "apr12", facts: [], light: true, ...extra });
  };
  for (let i = 0; i < 23; i++) mk("Swimming", 16, 17, "Coastal Region");
  for (let i = 0; i < 12; i++) mk("Cycling", 16, 17, "Northern Region");
  for (let i = 0; i < 11; i++) mk("Badminton", 14, 15, null);
  for (let i = 0; i < 60; i++) mk(pick(EAS_SPORTS), 14, 17, null);
  for (let i = 0; i < 57; i++) mk(pick(EAS_SPORTS), 18, 21, null);
  for (let i = 0; i < 59; i++) {
    const sp = pick(["Athletics", "Boxing", "Cycling", "Rowing", "Table tennis", "Judo", "Fencing", "Archery", "Triathlon", "Badminton"]);
    const need = ["Equipment", "Travel", "Coaching"][i % 3];
    mk(sp, 18, 31, null, { discoverable: true, tags: [sp.toLowerCase(), "Adults only", "Verified evidence", "National level", need] });
    const a = w.athletes[`l${n}`];
    a.tags.push(a.region);
    a.facts = lightFacts(a.id, sp, a.level, 2, "discoverable");
    a.facts.push(fact(`${a.id}-need`, "Support needed", need, "goal", "self"));
  }
  // → named + Jonas's athletes + light ≈ 240 profiles; 60+ adults discoverable (59 light + Nadia, Jonah, Elif)

  // Owners of the seeded funding requests (light, but fixed so sport, age and region always match the request)
  const own = (id: string, name: string, age: number, gender: "woman" | "man", sport: string, region: string, extra: Partial<Athlete> = {}) =>
    A({ id, name, age, minor: age < 18, gender, sport, discipline: sport, level: "National level", levelRank: 2, region, discoverable: age >= 18, currentSupport: [], tags: [sport.toLowerCase(), region], createdAt: "apr12", facts: [], light: true, ...extra });
  own("a-boxer", "Malik Tembo", 24, "man", "Boxing", "Northern Region");
  own("a-cyclist", "Cyclist (anonymised)", 16, "man", "Cycling", "Northern Region", { guardianId: "guardian-cyc" });
  own("a-canoe", "Ruth Laine", 27, "woman", "Canoeing", "Lakes Region");
  own("a-tt", "Jun Chua", 21, "man", "Table tennis", "Central Region");
  own("a-fencer", "Selin Yilmaz", 22, "woman", "Fencing", "Southern Region");
  own("a-archer", "Oskar Varga", 30, "man", "Archery", "Lakes Region");
  own("a-badminton", "Badminton player (anonymised)", 14, "woman", "Badminton", "Central Region", { guardianId: "guardian-bad" });
  own("a-tri", "Ade Kamara", 26, "man", "Triathlon", "Central Region");
  own("a-badm2", "Rhea Duarte", 20, "woman", "Badminton", "Central Region");

  // Funding requests published before 12 Apr (docs/05 §5.5, §8)
  const RQ = (r: Omit<FundingRequest, "status" | "publishedAt" | "discoverable"> & Partial<FundingRequest>) =>
    (w.requests[r.id] = { status: "open", publishedAt: "apr12", discoverable: true, ...r } as FundingRequest);
  RQ({ id: "rq-boxer", ownerKind: "athlete", ownerId: "a-boxer", title: "Competition travel", sport: "Boxing", region: "Northern Region", minor: false, lines: [{ id: "l1", label: "Competition travel", amount: 1800, otherSources: 0 }], visibility: "Public", neededBy: "Fri 21 May", neededMonth: "May", publishedBy: "a-boxer", verifiedLabel: "2 facts verified", tags: ["Boxing", "Travel", "Any region", "Verified evidence", "Adults only"] });
  RQ({ id: "rq-cyclist", ownerKind: "athlete", ownerId: "a-cyclist", title: "Bike repair and race entries", sport: "Cycling", region: "Northern Region", minor: true, ageGroup: "16–17", lines: [{ id: "l1", label: "Equipment and entries", amount: 2600, otherSources: 0 }], visibility: "Verified funders only", neededBy: "June", neededMonth: "June", publishedBy: "guardian", verifiedLabel: "Race results verified by a national federation", tags: ["Cycling", "Equipment", "Any region", "Verified evidence"], safeguarding: "Checked for identifying details · 8 Mar" });
  RQ({ id: "rq-canoe", ownerKind: "athlete", ownerId: "a-canoe", title: "Paddle and buoyancy aid", sport: "Canoeing", region: "Lakes Region", minor: false, lines: [{ id: "l1", label: "Equipment", amount: 1000, otherSources: 0 }], visibility: "Public", neededBy: "Mar", neededMonth: "March", publishedBy: "a-canoe", verifiedLabel: "1 fact verified", tags: ["Equipment", "Adults only"] });
  RQ({ id: "rq-tt", ownerKind: "athlete", ownerId: "a-tt", title: "Competition travel", sport: "Table tennis", region: "Central Region", minor: false, lines: [{ id: "l1", label: "Competition travel", amount: 2800, otherSources: 0 }], visibility: "Public", neededBy: "Mon 31 May", neededMonth: "May", publishedBy: "a-tt", verifiedLabel: "2 facts verified", tags: ["Travel", "Any region", "Verified evidence", "Adults only"] });
  RQ({ id: "rq-saltmere", ownerKind: "org", ownerId: "saltmere", title: "Two racing wheelchairs for the para club", sport: "Para athletics", region: "Coastal Region", minor: false, lines: [{ id: "l1", label: "Racing wheelchairs (2)", amount: 4800, otherSources: 0 }], visibility: "Public", neededBy: "Wed 1 Sep", neededMonth: "September", publishedBy: "saltmere", verifiedLabel: "Organisation verified", tags: ["Para athletics", "Equipment", "Any region", "Verified evidence", "Organisation"] });
  RQ({ id: "rq-lakeside", ownerKind: "org", ownerId: "lakeside", title: "Pitch hire and league travel", sport: "Football (women)", region: "Lakes Region", minor: false, lines: [{ id: "l1", label: "Pitch hire", amount: 2000, otherSources: 0 }, { id: "l2", label: "League travel", amount: 1600, otherSources: 0 }], visibility: "Public", neededBy: "Thu 1 Jul", neededMonth: "July", publishedBy: "lakeside", verifiedLabel: "Organisation verified", tags: ["Football", "Travel", "Any region", "Verified evidence", "Organisation"] });
  RQ({ id: "rq-highland", ownerKind: "org", ownerId: "highland", title: "Youth club bikes", sport: "Cycling", region: "Highland Region", minor: false, lines: [{ id: "l1", label: "Youth club bikes (8)", amount: 5000, otherSources: 0 }], visibility: "Public", neededBy: "Mon 2 Aug", neededMonth: "August", publishedBy: "ewan", verifiedLabel: "Organisation verified", tags: ["Cycling", "Equipment", "Any region", "Verified evidence", "Organisation"] });
  RQ({ id: "rq-eastbrook", ownerKind: "org", ownerId: "eastbrook", title: "Boat repair", sport: "Rowing", region: "Lakes Region", minor: false, lines: [{ id: "l1", label: "Boat repair", amount: 2500, otherSources: 0 }], visibility: "Public", neededBy: "Feb", neededMonth: "February", publishedBy: "eastbrook", verifiedLabel: "Organisation verified", tags: ["Equipment", "Organisation"] });
  RQ({ id: "rq-fencer", ownerKind: "athlete", ownerId: "a-fencer", title: "Competition travel", sport: "Fencing", region: "Southern Region", minor: false, lines: [{ id: "l1", label: "Competition travel", amount: 1400, otherSources: 0 }], visibility: "Public", neededBy: "Fri 18 Jun", neededMonth: "June", publishedBy: "a-fencer", verifiedLabel: "1 fact verified", tags: ["Travel", "Any region", "Adults only"] });
  RQ({ id: "rq-archer", ownerKind: "athlete", ownerId: "a-archer", title: "Bow and arrows", sport: "Archery", region: "Lakes Region", minor: false, lines: [{ id: "l1", label: "Equipment", amount: 2200, otherSources: 0 }], visibility: "Public", neededBy: "Thu 15 Jul", neededMonth: "July", publishedBy: "a-archer", verifiedLabel: "2 facts verified", tags: ["Equipment", "Any region", "Verified evidence", "Adults only"] });
  RQ({ id: "rq-badminton", ownerKind: "athlete", ownerId: "a-badminton", title: "Coaching block", sport: "Badminton", region: "Any region", minor: true, ageGroup: "14–15", lines: [{ id: "l1", label: "Coaching", amount: 750, otherSources: 0 }], visibility: "Verified funders only", neededBy: "July", neededMonth: "July", publishedBy: "guardian", verifiedLabel: "Regional ranking verified by a national federation", tags: ["Badminton", "Coaching", "Any region", "Verified evidence"], noClub: true, representedBy: "guardian", safeguarding: "Checked for identifying details · 2 Apr (region widened)" });
  RQ({ id: "rq-triathlete", ownerKind: "athlete", ownerId: "a-tri", title: "Race entries", sport: "Triathlon", region: "Central Region", minor: false, lines: [{ id: "l1", label: "Race entries", amount: 900, otherSources: 0 }], visibility: "Public", neededBy: "Fri 6 Aug", neededMonth: "August", publishedBy: "a-tri", verifiedLabel: "1 fact verified", tags: ["Travel", "Adults only"] });
  RQ({ id: "rq-badm-closed", ownerKind: "athlete", ownerId: "a-badm2", title: "Competition travel", sport: "Badminton", region: "Central Region", minor: false, lines: [{ id: "l1", label: "Travel", amount: 1500, otherSources: 0 }], visibility: "Public", neededBy: "Feb", neededMonth: "February", publishedBy: "a-badm2", verifiedLabel: "", tags: [], status: "closed" });
  RQ({ id: "rq-wbb-closed", ownerKind: "org", ownerId: "saltmere", title: "Wheelchair basketball team kit", sport: "Wheelchair basketball", region: "Coastal Region", minor: false, lines: [{ id: "l1", label: "Team kit", amount: 1200, otherSources: 0 }], visibility: "Public", neededBy: "Mar", neededMonth: "March", publishedBy: "saltmere", verifiedLabel: "", tags: [], status: "closed" });

  // Facts behind each seeded request's "verified" label, so the card and the request page always agree.
  for (const r of Object.values(w.requests)) {
    const a = r.ownerKind === "athlete" ? w.athletes[r.ownerId] : undefined;
    if (!a || a.facts.length) continue;
    const n = Number(/^(\d+)/.exec(r.verifiedLabel)?.[1] ?? 1);
    a.facts = lightFacts(a.id, a.sport, a.level, n, a.minor ? "application" : "discoverable");
    a.tags.push(r.region, ...r.tags.filter((t) => !a.tags.includes(t)));
  }

  // Agreements that existed before 12 Apr (docs/05 §9.4: development 11,900; commercial 8,000; programme 145,000)
  const AG = (id: string, fundId: string, kind: "athlete" | "org", rid: string, amount: number, requestId?: string, released = amount) => {
    w.agreements[id] = { id, fundId, recipientKind: kind, recipientId: rid, amount, acceptedBy: rid, acceptedAt: "apr12", origin: requestId ? "Offer" : "Application", requestId, lineId: requestId ? "l1" : undefined, light: true };
    if (released) w.ledger.push({ id: `${id}-r`, agreementId: id, kind: "release", amount: released, by: "system", at: "apr12", ref: `${id.toUpperCase()}-R1` }, { id: `${id}-c`, agreementId: id, kind: "receipt", amount: released, by: rid, at: "apr12", ref: `${id.toUpperCase()}-R1` });
  };
  AG("ag-o1", "oas", "athlete", "a-boxer", 1200, "rq-boxer");
  AG("ag-o2", "oas", "athlete", "a-cyclist", 1500, "rq-cyclist");
  AG("ag-o3", "oas", "athlete", "a-canoe", 1000, "rq-canoe");
  AG("ag-o4", "oas", "athlete", "a-tt", 2000, "rq-tt");
  AG("ag-o5", "oas", "athlete", "a-badm2", 1500, "rq-badm-closed");
  AG("ag-o6", "oas", "org", "saltmere", 1200, "rq-wbb-closed");
  AG("ag-h1", "has", "org", "eastbrook", 2500, "rq-eastbrook");
  AG("ag-h2", "has", "athlete", "elif", 1000);
  w.agreements["ag-h2"].origin = "Offer";
  AG("ag-lakeside", "cap", "org", "lakeside", 8000, undefined, 4000);
  AG("ag-pe1", "cspg", "org", "lanternfield", 60000, undefined, 12000);
  AG("ag-pe2", "cspg", "org", "saltmere", 45000, undefined, 9000);
  AG("ag-pe3", "cspg", "org", "ashgrove", 40000, undefined, 8000);
  for (const k of ["ag-lakeside", "ag-pe1", "ag-pe2", "ag-pe3"]) w.agreements[k].origin = "Application";

  // Play Every Day (docs/05 §6): Lanternfield's programme, funded by Tallwater's Community Sports Programme Grant.
  Object.assign(w.agreements["ag-pe1"], { light: false, purpose: "Play Every Day: free after-school multi-sport sessions at 6 sites", nextUpdate: "Quarterly report due Wed 30 Jun" });
  w.programmes["play-every-day"] = {
    id: "play-every-day",
    name: "Play Every Day",
    orgId: "lanternfield",
    agreementId: "ag-pe1",
    sport: "Community multi-sport",
    purpose: "Free after-school multi-sport sessions, Tuesdays and Thursdays",
    sessionsPerSite: 20,
    sites: [
      { id: "riverside", name: "Riverside School", participants: 90 },
      { id: "hillview", name: "Hillview Academy", participants: 80 },
      { id: "eastfield", name: "Eastfield Centre", participants: 70 },
      { id: "greenpark", name: "Greenpark School", participants: 75 },
      { id: "westbrook", name: "Westbrook Centre", participants: 70 },
      { id: "northgate", name: "Northgate School", participants: 75 },
    ],
    budget: [
      { line: "Coaching", amount: 7200 },
      { line: "Equipment", amount: 1800 },
      { line: "Venue and transport", amount: 1800 },
      { line: "Monitoring", amount: 1200 },
    ],
  };
  seedSessions(w, 0, 1);

  // Oriel Kit Scheme: 8 in-kind agreements, 60 kits declared at $9,000; never counted as cash (docs/05 §9.3).
  [10, 10, 8, 8, 6, 6, 6, 6].forEach((items, k) => {
    const id = `ag-kit-${k + 1}`;
    w.agreements[id] = { id, fundId: "kit", recipientKind: "org", recipientId: `kit-club-${k + 1}`, amount: items * 150, acceptedBy: "system", acceptedAt: "apr12", origin: "Application", light: true, kits: { items, declaredValue: items * 150 } };
  });
  w.kitDeliveries = [{ at: "apr12", items: 12 }];
  return w;
}

/* ------------------------------------------------------------ programme */

/** Session slot → date (Tuesdays and Thursdays from Tue 6 Apr 2027, 10 weeks). */
export function sessionDate(slot: number) {
  const d = new Date(Date.UTC(2027, 3, 6 + Math.floor(slot / 2) * 7 + (slot % 2) * 2));
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" }).replace(",", "");
}
/** Missed sessions per site and slot (docs/05 §6): 8 weather, 4 coach availability. */
export const MISSED: Record<string, Record<number, "weather" | "coach availability">> = {
  greenpark: { 8: "weather", 9: "coach availability", 10: "coach availability", 11: "weather", 12: "coach availability", 13: "coach availability" },
  hillview: { 8: "weather", 14: "weather" },
  westbrook: { 8: "weather", 11: "weather", 15: "weather" },
  northgate: { 8: "weather" },
};
/** Seed the sessions for slots [from, to] at every site, except those a journey step records itself. */
export function seedSessions(w: World, from: number, to: number, skip: (site: string, slot: number) => boolean = () => false) {
  const pe = w.programmes["play-every-day"];
  for (const site of pe.sites)
    for (let slot = from; slot <= to; slot++) {
      if (skip(site.id, slot)) continue;
      const reason = MISSED[site.id]?.[slot];
      const id = `ss-${site.id}-${slot}`;
      w.sessions[id] = { id, programmeId: pe.id, siteId: site.id, slot, date: sessionDate(slot), status: reason ? "missed" : "delivered", attendance: reason ? undefined : Math.round(site.participants * (0.7 + ((slot * 7 + site.name.length) % 20) / 100)), reason, by: "system", at: slot <= 1 ? "apr12" : slot <= 9 ? "may06" : "jun30", checked: !reason };
    }
}
