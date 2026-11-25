/**
 * Fictional world for the P1 shell. Every value comes from docs/05 (the source of truth).
 * In P2 this becomes the seeded generator plus the event-sourced ledger; here totals are still derived from the
 * listed records by small functions, never typed in (docs/06 §4).
 */

export type Moment = "apr12" | "may06" | "jun30";
export const MOMENT_DATE: Record<Moment, string> = { apr12: "2027-04-12", may06: "2027-05-06", jun30: "2027-06-30" };
/** Opportunities open at a demo moment (open on that day), and those still to open. */
export const openAt = (m: Moment) => OPPORTUNITIES.filter((o) => o.status === "Open" && o.closes >= MOMENT_DATE[m]);
export const upcomingAt = (m: Moment) => OPPORTUNITIES.filter((o) => o.status === "Upcoming" && o.closes > MOMENT_DATE[m]);
export const closedAt = (m: Moment) => OPPORTUNITIES.filter((o) => o.status === "Open" && o.closes < MOMENT_DATE[m]);

export const MOMENTS: { id: Moment; label: string; short: string; note: string }[] = [
  { id: "apr12", label: "Mon 12 Apr 2027", short: "12 Apr", note: "Applications open" },
  { id: "may06", label: "Thu 6 May 2027", short: "6 May", note: "Selection and direct support" },
  { id: "jun30", label: "Wed 30 Jun 2027", short: "30 Jun", note: "Quarter-end review" },
];

export type RoleKey =
  | "athlete"
  | "guardian"
  | "coach"
  | "funder"
  | "sponsor"
  | "individual"
  | "organisation"
  | "programme-coach"
  | "admin";

export type Persona = {
  id: string;
  name: string;
  role: RoleKey;
  title: string;
  org: string;
  group: "Seeking funding" | "Providing funding" | "Delivering programmes" | "Platform";
  journeys: string;
  tasks: string[];
};

export const PERSONAS: Persona[] = [
  { id: "amira", name: "Amira Haddad", role: "athlete", title: "Athlete, 19 · judo", org: "Independent · Saltmere Sports Academy", group: "Seeking funding", journeys: "A", tasks: ["Check eligibility", "Apply with help", "Find sponsors that support judo"] },
  { id: "nadia", name: "Nadia Kovač", role: "athlete", title: "Athlete, 23 · wheelchair racing", org: "Independent · Saltmere para squad", group: "Seeking funding", journeys: "B", tasks: ["Publish a funding request", "Ask a sponsor for support", "Confirm a payment"] },
  { id: "jonah", name: "Jonah Reyes", role: "athlete", title: "Athlete, 22 · sprinter", org: "Independent · open to commercial partners", group: "Seeking funding", journeys: "B", tasks: ["Accept a sponsorship agreement", "Submit deliverable evidence", "See it kept apart from development funding"] },
  { id: "rosa", name: "Rosa Esteves", role: "guardian", title: "Guardian of Tiago (16) and Inês (13)", org: "Parent", group: "Seeking funding", journeys: "E", tasks: ["Switch athletes", "Publish an anonymised request", "Withdraw photo consent"] },
  { id: "jonas", name: "Jonas Becker", role: "coach", title: "Head swim coach · 6 athletes", org: "Saltmere Sports Academy", group: "Seeking funding", journeys: "E", tasks: ["Prepare an application (you cannot submit it)", "Submit an update", "Nominate an adult athlete"] },
  { id: "maya", name: "Maya Torres", role: "organisation", title: "Programme director", org: "Lanternfield Community Sport", group: "Delivering programmes", journeys: "C", tasks: ["Find programme funding", "Ask why Greenpark is behind", "Draft a report through the claims check"] },
  { id: "sam", name: "Sam Rivera", role: "programme-coach", title: "Coach · Greenpark and Westbrook", org: "Lanternfield Community Sport", group: "Delivering programmes", journeys: "C", tasks: ["Record a session", "Mark “Couldn't run”"] },
  { id: "ingrid", name: "Ingrid Solberg", role: "funder", title: "Director of Programmes · Approve", org: "Tallwater Sports Foundation", group: "Providing funding", journeys: "A", tasks: ["Approve the scholarship decisions", "Export the selection record", "Try to approve your own draft"] },
  { id: "daniel", name: "Daniel Osei", role: "funder", title: "Programme officer · Review, Verify", org: "Tallwater Sports Foundation", group: "Providing funding", journeys: "A, C, D", tasks: ["Verify a result against a document", "Request information", "Add existing funding"] },
  { id: "priya", name: "Priya Nair", role: "funder", title: "Finance officer · Finance", org: "Tallwater Sports Foundation", group: "Providing funding", journeys: "A, C", tasks: ["Record a release", "Verify an expense", "Follow a Fund total to its records"] },
  { id: "kenji", name: "Kenji Arakawa", role: "sponsor", title: "CSR manager · Approve, Review", org: "Oriel Freight Group", group: "Providing funding", journeys: "B, E", tasks: ["Search with a plain-language brief", "Meet the offer cap", "Look at in-kind equipment"] },
  { id: "lucy", name: "Lucy Adeyemi", role: "sponsor", title: "Partnerships · Approve, Review", org: "Corvane Sportswear", group: "Providing funding", journeys: "B", tasks: ["Try a grant over budget (blocked)", "Accept a deliverable", "See commercial totals apart"] },
  { id: "marcus", name: "Marcus Halvorsen", role: "individual", title: "Verified individual sponsor", org: "Halvorsen Athlete Support", group: "Providing funding", journeys: "B", tasks: ["Answer a funding request", "See that minors' requests are not shown to you"] },
  { id: "farid", name: "Farid Rahimi", role: "funder", title: "Development manager", org: "Ostral Swimming Federation", group: "Providing funding", journeys: "D", tasks: ["Switch between seeking and providing", "Confirm existing funding", "Nominate swimmers"] },
  { id: "alex", name: "Alex Moreau", role: "admin", title: "Platform administrator", org: "Revivo Impact", group: "Platform", journeys: "E", tasks: ["Verify an organisation (simulated)", "Run a safeguarding check", "Handle a report of concern"] },
];

export type FunderType = "Foundation" | "Company" | "Sports brand" | "Government body" | "Federation" | "Individual sponsor";

export type Funder = {
  id: string;
  name: string;
  type: FunderType;
  sports: string;
  regions: string;
  types: string[];
  typical: string;
  accepts: "yes" | "opportunities" | "commercial";
  acceptsNote: string;
  objective: string;
  verified: boolean;
};

export const FUNDERS: Funder[] = [
  { id: "tallwater", name: "Tallwater Sports Foundation", type: "Foundation", sports: "Multi-sport", regions: "All regions", types: ["Scholarship award", "Programme grant", "Development grant"], typical: "$3,500–$60,000", accepts: "opportunities", acceptsNote: "Only through opportunities", objective: "Help emerging athletes and community programmes stay in sport.", verified: true },
  { id: "oriel", name: "Oriel Freight Group", type: "Company", sports: "Any sport", regions: "Any region", types: ["Development grant", "Equipment support"], typical: "Up to $2,000", accepts: "yes", acceptsNote: "Accepts requests: equipment and competition travel, up to $2,000", objective: "Get athletes to competitions and clubs properly equipped.", verified: true },
  { id: "crsc", name: "Coastal Region Sports Council", type: "Government body", sports: "Multi-sport", regions: "Coastal Region", types: ["Competition funding"], typical: "$800–$1,500", accepts: "opportunities", acceptsNote: "Only through opportunities", objective: "Support Coastal Region athletes to compete nationally.", verified: true },
  { id: "ardent", name: "Ardent Judo Federation", type: "Federation", sports: "Judo", regions: "National", types: ["Competition funding"], typical: "Up to $1,200", accepts: "opportunities", acceptsNote: "Only through opportunities", objective: "Develop the national judo pathway; verifies judo results.", verified: true },
  { id: "halvorsen", name: "Marcus Halvorsen", type: "Individual sponsor", sports: "Rowing, para sport, athletics", regions: "Any region", types: ["Development grant"], typical: "Up to $2,500", accepts: "yes", acceptsNote: "Accepts requests: travel and equipment for adults, teams and clubs, up to $2,500", objective: "A former rower supporting adults and clubs who need a first push.", verified: true },
  { id: "fennick", name: "Fennick Nutrition", type: "Sports brand", sports: "Endurance and combat sports", regions: "Any region", types: ["Sponsorship agreement"], typical: "$2,000–$8,000", accepts: "commercial", acceptsNote: "Accepts commercial proposals from adult athletes", objective: "Partner with adult athletes who train seriously and share their preparation.", verified: true },
  { id: "corvane", name: "Corvane Sportswear", type: "Sports brand", sports: "Athletics, women's football", regions: "Any region", types: ["Development grant", "Sponsorship agreement"], typical: "$3,000–$8,000", accepts: "commercial", acceptsNote: "Accepts commercial proposals from adult athletes and clubs", objective: "Grow women's sport and partner with adult athletes.", verified: true },
  { id: "ostral", name: "Ostral Swimming Federation", type: "Federation", sports: "Swimming", regions: "National", types: ["Competition funding"], typical: "Up to $1,500", accepts: "opportunities", acceptsNote: "Only through opportunities", objective: "Get swimmers to the competitions their results earn.", verified: true },
  { id: "verran", name: "Verran Sports Trust", type: "Foundation", sports: "Para sport, women's sport", regions: "All regions", types: ["Development grant"], typical: "Up to $2,500", accepts: "opportunities", acceptsNote: "Only through opportunities", objective: "Remove cost barriers for para and women athletes.", verified: true },
];

export type Opportunity = {
  id: string;
  funder: string;
  title: string;
  type: string;
  amount: string;
  awards: string;
  status: "Open" | "Upcoming" | "Closed";
  deadline: string;
  /** Last day open (or opening day for upcoming), as yyyy-mm-dd, so lists follow the demo clock. */
  closes: string;
  sports: string;
  /** Eligibility for Amira, evaluated by the published rules (docs/05 §5.1) */
  forAmira: { kind: "eligible" | "check" | "not" | "hidden"; text: string; met?: [number, number] };
  why: string;
};

export const OPPORTUNITIES: Opportunity[] = [
  { id: "eas", funder: "tallwater", title: "Emerging Athletes Scholarship", type: "Scholarship award", amount: "Up to $5,000", awards: "50 awards", status: "Open", deadline: "Fri 30 Apr", closes: "2027-04-30", sports: "9 sports incl. judo", forAmira: { kind: "check", text: "4 met · 1 for the panel to check · 1 to add when you apply", met: [4, 6] }, why: "Matches: judo · age 15–21 · national U21 result · coaching and competition costs" },
  { id: "crsc-travel", funder: "crsc", title: "Athlete Travel Bursary 2027", type: "Competition funding", amount: "$800–$1,500", awards: "About 24 bursaries", status: "Open", deadline: "Fri 14 May", closes: "2027-05-14", sports: "Any sport", forAmira: { kind: "eligible", text: "You meet 4 of 4 criteria", met: [4, 4] }, why: "Matches: Coastal Region · competition travel" },
  { id: "ardent-camp", funder: "ardent", title: "High Performance Camp Support", type: "Competition funding", amount: "Up to $1,200", awards: "10 places", status: "Open", deadline: "Fri 21 May", closes: "2027-05-21", sports: "Judo", forAmira: { kind: "check", text: "3 met · 1 to check: national squad list", met: [3, 4] }, why: "Matches: judo · U23 · training camps" },
  { id: "corvane-wsdf", funder: "corvane", title: "Women's Sporting Development Fund", type: "Development grant", amount: "$3,000–$3,500", awards: "About 12 grants", status: "Open", deadline: "Fri 16 Apr", closes: "2027-04-16", sports: "Women's team sports, coaching", forAmira: { kind: "not", text: "Not eligible: women's team sports and coaching only" }, why: "Matches: women athletes" },
  { id: "verran-para", funder: "verran", title: "Para Athlete Equipment Grant", type: "Development grant", amount: "Up to $2,500", awards: "About 10 grants", status: "Open", deadline: "Fri 28 May", closes: "2027-05-28", sports: "Para sport", forAmira: { kind: "not", text: "Not eligible: para athletes only" }, why: "Matches: equipment · Coastal Region" },
  { id: "ostral-ctg", funder: "ostral", title: "Competition Travel Grant", type: "Competition funding", amount: "Up to $1,500", awards: "About 20 grants", status: "Open", deadline: "Mon 31 May", closes: "2027-05-31", sports: "Swimming", forAmira: { kind: "hidden", text: "Not in your sport" }, why: "" },
  { id: "tallwater-fac", funder: "tallwater", title: "Facilities Small Grants", type: "Programme grant", amount: "$80,000 announced", awards: "Up to $10,000 each", status: "Upcoming", deadline: "Opens Mon 2 Aug", closes: "2027-08-02", sports: "Community sport", forAmira: { kind: "not", text: "For organisations" }, why: "" },
  { id: "tallwater-r2", funder: "tallwater", title: "Community Sports Programme Grant · Round 2", type: "Programme grant", amount: "$200,000 announced", awards: "Programmes", status: "Upcoming", deadline: "Opens Mon 6 Sep", closes: "2027-09-06", sports: "Community sport", forAmira: { kind: "not", text: "For organisations" }, why: "" },
  { id: "verran-coach", funder: "verran", title: "Coach Education Bursary", type: "Development grant", amount: "$15,000 announced", awards: "Coaches", status: "Upcoming", deadline: "Opens Thu 1 Jul", closes: "2027-07-01", sports: "Para and women's sport", forAmira: { kind: "not", text: "For coaches" }, why: "" },
];

/** Amira's scholarship award ledger at Wed 30 Jun 2027 (docs/02 §6.5). */
export const AMIRA = {
  requested: 4800,
  committed: 4500,
  released: 2250,
  receivedOn: "6 May",
  expenses: [
    { label: "Coaching fees, May–Jun", doc: "Invoice", amount: 900, state: "verified" as const },
    { label: "Continental U21 Invitational · entry", doc: "Receipt", amount: 180, state: "verified" as const },
    { label: "Continental U21 Invitational · travel", doc: "Receipt", amount: 640, state: "verified" as const },
    { label: "Competition judogi", doc: "Receipt missing", amount: 210, state: "query" as const },
  ],
};
export const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
export function amiraTotals() {
  const reported = sum(AMIRA.expenses.map((e) => e.amount));
  const verified = sum(AMIRA.expenses.filter((e) => e.state === "verified").map((e) => e.amount));
  return {
    reported,
    verified,
    awaiting: reported - verified,
    unspent: AMIRA.released - reported,
    outstanding: AMIRA.committed - AMIRA.released,
  };
}

/** Funding requests visible to a verified organisation funder at Thu 6 May (docs/05 §5, §8). */
export type RequestRow = {
  id: string;
  label: string;
  minor: boolean;
  sport: string;
  region: string;
  ageGroup?: string;
  what: string;
  requested: number;
  pledged: number;
  verified: string;
  needed: string;
  why: string;
  owner: "athlete" | "organisation";
  /** Facts used by the deterministic criteria-fit count (docs/02 §9.4) */
  tags: string[];
};
export const REQUESTS: RequestRow[] = [
  { id: "nadia", label: "Nadia Kovač", minor: false, sport: "Wheelchair racing (T54)", region: "Coastal Region", ageGroup: "23", what: "Racing wheels and competition travel", requested: 5200, pledged: 0, verified: "3 verified · 1 self-reported", needed: "Needed by Fri 4 Jun", why: "Matches: para athletics · equipment · any region", owner: "athlete", tags: ["Para athletics", "Equipment", "Any region", "Verified evidence", "Adults only", "Travel"] },
  { id: "tiago", label: "Swimmer · 16–17", minor: true, sport: "Swimming", region: "Coastal Region", what: "Competition travel", requested: 2400, pledged: 0, verified: "Qualification verified", needed: "Needed by August", why: "Matches: competition travel · Coastal Region", owner: "athlete" , tags: ["Swimming", "Travel", "Coastal Region", "Verified evidence"] },
  { id: "saltmere", label: "Saltmere Sports Academy", minor: false, sport: "Para athletics", region: "Coastal Region", what: "Two racing wheelchairs for the para club", requested: 4800, pledged: 0, verified: "Organisation verified", needed: "Needed by Wed 1 Sep", why: "Matches: para sport · equipment", owner: "organisation" , tags: ["Para athletics", "Equipment", "Any region", "Verified evidence", "Organisation"] },
  { id: "boxer", label: "Adult boxer", minor: false, sport: "Boxing", region: "Northern Region", ageGroup: "24", what: "Competition travel", requested: 1800, pledged: 1200, verified: "2 verified", needed: "Needed by Fri 21 May", why: "Matches: competition travel", owner: "athlete" , tags: ["Boxing", "Travel", "Any region", "Verified evidence", "Adults only"] },
  { id: "cyclist", label: "Cyclist · 16–17", minor: true, sport: "Cycling", region: "Northern Region", what: "Bike repair and race entries", requested: 2600, pledged: 1500, verified: "Race results verified", needed: "Needed by June", why: "Matches: equipment · competition", owner: "athlete" , tags: ["Cycling", "Equipment", "Any region", "Verified evidence"] },
  { id: "lakeside", label: "Lakeside Women's FC", minor: false, sport: "Football (women)", region: "Lakes Region", what: "Pitch hire and league travel", requested: 3600, pledged: 0, verified: "Organisation verified", needed: "Needed by Thu 1 Jul", why: "Matches: team sport · travel", owner: "organisation" , tags: ["Football", "Travel", "Any region", "Verified evidence", "Organisation"] },
];

export const fmt = (n: number) => "$" + n.toLocaleString("en-GB");
