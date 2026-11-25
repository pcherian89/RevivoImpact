/**
 * The five journeys as scripted steps (docs/03 §5). Each step names who acts, where, and the commands it runs; the
 * guide's "Show me" runs exactly these commands, so a guided step and a real click obey the same rules.
 * Checkpoints: the world at each demo date = the base world + every earlier step + the seeded world's activity.
 */
import type { Moment, World } from "./model";
import type { CommandName, Event } from "./engine";

type Cmd = { actor: string; type: CommandName; args: Record<string, unknown> };
export type Step = {
  title: string;
  who: string;
  when: Moment;
  /** Persona whose screen the step opens, and the route */
  as: string;
  to: string;
  what: string;
  cmds: Cmd[];
  /** True once the step's outcome exists in the world (for "I'll do it") */
  done?: (w: World) => boolean;
  phase?: "P3";
};
export type Journey = { id: string; name: string; minutes: string; steps: Step[] };

const C = (actor: string, type: CommandName, args: Record<string, unknown>): Cmd => ({ actor, type, args });

export const JOURNEYS: Journey[] = [
  {
    id: "A",
    name: "Find and secure a sports scholarship",
    minutes: "10-minute signature",
    steps: [
      { title: "Tallwater publishes the scholarship", who: "Ingrid Solberg · Tallwater (Approve)", when: "apr12", as: "ingrid", to: "overview", what: "Daniel drafted it; Ingrid publishes it (four-eyes) and copies the share link. It appears in Discover for everyone.", cmds: [C("ingrid", "publishOpportunity", { oppId: "eas" })], done: (w) => w.opps.eas.status !== "awaiting" },
      { title: "Amira joins independently", who: "Amira Haddad · athlete, 19", when: "apr12", as: "amira", to: "join", what: "No invitation and no Revivo Pathway account: she joins as an adult athlete (simulated email code).", cmds: [C("amira", "register", { kind: "athlete", personId: "amira", name: "Amira Haddad", age: 19, sport: "Judo", region: "Coastal Region", gender: "woman" })], done: (w) => !!w.athletes.amira },
      { title: "She builds one sporting profile", who: "Amira", when: "apr12", as: "amira", to: "s4", what: "Results, coach, current support; she chooses what is discoverable and asks Ardent Judo Federation to confirm her national bronze.", cmds: [C("amira", "buildProfile", { athleteId: "amira" }), C("amira", "askConfirmation", { athleteId: "amira", factId: "am-r1", orgName: "Ardent Judo Federation" })], done: (w) => (w.athletes.amira?.facts.length ?? 0) > 0 },
      { title: "She discovers funders she has never heard of", who: "Amira", when: "apr12", as: "amira", to: "discover", what: "Five open opportunities from five organisations, two shown as not eligible with reasons; then seven relevant sponsors, and which accept support asks.", cmds: [] },
      { title: "She finds Tallwater's scholarship", who: "Amira", when: "apr12", as: "amira", to: "opportunity/eas", what: "The rules show 4 met, 1 for the panel to check, 1 to add. Simulated AI explains the match.", cmds: [] },
      { title: "Application help", who: "Amira", when: "apr12", as: "amira", to: "apply/eas", what: "Her profile fills the form; Simulated AI flags the missing invoice and drafts the statement only from her records.", cmds: [C("amira", "saveApplication", { appId: "app-amira", oppId: "eas", athleteId: "amira", requested: 4800, statement: "I compete in judo at national U21 level (bronze, 2026) and train at Saltmere Sports Academy. [In your own words: why the funding matters to you.] I am asking for coaching fees and competition travel for the season.", otherFunding: "None entered", aiDrafted: true })], done: (w) => !!w.applications["app-amira"] },
      { title: "She submits", who: "Amira", when: "apr12", as: "amira", to: "applications", what: "She ticks the fields Tallwater may see and requests $4,800.", cmds: [C("amira", "submitApplication", { appId: "app-amira" })], done: (w) => w.applications["app-amira"]?.status !== "draft" && !!w.applications["app-amira"] },
      { title: "Review and verification", who: "Daniel Osei · Tallwater (Review, Verify)", when: "may06", as: "daniel", to: "review/app-amira", what: "Her bronze arrives already confirmed by her federation; Daniel verifies her age against her ID, scores the rubric (a second reviewer already did) and shortlists her at the $4,500 tier (national medal).", cmds: [C("daniel", "verifyFact", { athleteId: "amira", factId: "am-age", method: "ID document" }), C("daniel", "scoreApplication", { appId: "app-amira", total: 13 }), C("daniel", "shortlist", { appId: "app-amira", tier: 4500 })], done: (w) => ["shortlisted", "offered", "accepted"].includes(w.applications["app-amira"]?.status ?? "") },
      { title: "Human selection", who: "Ingrid Solberg", when: "may06", as: "ingrid", to: "selection/eas", what: "The budget meter follows every decision; 46 offers ($214,500), 2 on the waiting list, respectful decisions to all 143.", cmds: [C("ingrid", "sendDecisions", { oppId: "eas" })], done: (w) => w.opps.eas.status === "decided" },
      { title: "Amira accepts her scholarship award", who: "Amira", when: "may06", as: "amira", to: "applications", what: "She reads what Tallwater will see and accepts. $4,500 committed.", cmds: [C("amira", "acceptOffer", { offerId: "of-app-amira", agreementId: "ag-amira" })], done: (w) => !!w.agreements["ag-amira"] },
      { title: "Payment recorded, receipt confirmed", who: "Priya Nair (Finance) → Amira", when: "may06", as: "amira", to: "funding", what: "Institutional policy: Priya, not the approver, records instalment 1 ($2,250, simulated); Amira confirms she received it.", cmds: [C("priya", "recordRelease", { agreementId: "ag-amira", amount: 2250, ref: "TW-EAS-0412", entryId: "le-amira-r1" }), C("amira", "confirmReceipt", { agreementId: "ag-amira", entryId: "le-amira-c1" })], done: (w) => w.ledger.some((l) => l.id === "le-amira-c1") },
      { title: "Spending and sporting progress", who: "Amira", when: "jun30", as: "amira", to: "funding", what: "Four expenses (one missing a receipt) and two progress records. Built in P3.", cmds: [], phase: "P3" },
      { title: "Funder review and renewal", who: "Priya, Daniel", when: "jun30", as: "daniel", to: "s17", what: "Verify spending, query the judogi receipt, record “Continue with conditions”. Built in P3.", cmds: [], phase: "P3" },
    ],
  },
  {
    id: "B",
    name: "Two-way discovery, direct support and sponsorship",
    minutes: "7 steps",
    steps: [
      { title: "Nadia publishes a funding request", who: "Nadia Kovač · athlete, 23", when: "may06", as: "nadia", to: "publish", what: "Two line items: racing wheels $3,400 and competition travel $1,800. Public.", cmds: [C("nadia", "publishRequest", { requestId: "rq-nadia", ownerKind: "athlete", ownerId: "nadia", title: "Racing wheels and competition travel", sport: "Wheelchair racing", lines: [{ label: "Racing wheels", amount: 3400 }, { label: "Continental Para Athletics Series travel", amount: 1800 }], visibility: "Public", neededBy: "Fri 4 Jun", neededMonth: "June", verifiedLabel: "3 facts verified · 1 self-reported", tags: ["Para athletics", "Equipment", "Travel", "Any region", "Verified evidence", "Adults only"] })], done: (w) => !!w.requests["rq-nadia"] },
      { title: "Nadia finds a sponsor that accepts asks", who: "Nadia", when: "may06", as: "nadia", to: "profile/halvorsen", what: "Sponsors & funders → Marcus Halvorsen (accepts asks up to $2,500) → asks for $1,200 towards travel, checked against what he supports.", cmds: [C("nadia", "sendAsk", { askId: "ask-nadia-1", requestId: "rq-nadia", funderId: "halvorsen", lineId: "l2", amount: 1200, support: "Travel" })], done: (w) => !!w.asks["ask-nadia-1"] },
      { title: "A company discovers an athlete it has never met", who: "Kenji Arakawa · Oriel (Simple policy)", when: "may06", as: "kenji", to: "fdiscover", what: "A plain-language brief becomes editable filters; Nadia's request matches 4 of 4 (by rule, never popularity). He shortlists and offers $2,000 for the wheels; $2,500 would need a second approver.", cmds: [C("kenji", "toggleShortlist", { targetId: "rq-nadia" }), C("kenji", "makeOffer", { offerId: "of-oriel-nadia", fundId: "oas", recipientKind: "athlete", recipientId: "nadia", requestId: "rq-nadia", lineId: "l1", amount: 2000, reason: "Equipment for a verified adult para athlete competing at continental level." })], done: (w) => !!w.offers["of-oriel-nadia"] },
      { title: "Two funders, partial funding", who: "Marcus → Nadia", when: "may06", as: "nadia", to: "applications", what: "Marcus answers her ask with $1,200 for travel. Nadia accepts both offers: $3,200 pledged, $2,000 still needed.", cmds: [C("marcus", "makeOffer", { offerId: "of-hal-nadia", fundId: "has", recipientKind: "athlete", recipientId: "nadia", requestId: "rq-nadia", lineId: "l2", amount: 1200, reason: "Travel for a verified adult para athlete; within my stated support." }), C("nadia", "acceptOffer", { offerId: "of-oriel-nadia", agreementId: "ag-oriel-nadia" }), C("nadia", "acceptOffer", { offerId: "of-hal-nadia", agreementId: "ag-hal-nadia" })], done: (w) => !!w.agreements["ag-hal-nadia"] && !!w.agreements["ag-oriel-nadia"] },
      { title: "Payments recorded and confirmed", who: "Kenji, Marcus → Nadia", when: "may06", as: "nadia", to: "funding", what: "Simple policy: each sponsor records their own payment (flagged in the audit); Nadia confirms both.", cmds: [C("kenji", "recordRelease", { agreementId: "ag-oriel-nadia", amount: 2000, ref: "OR-0506-1", entryId: "le-on-r" }), C("marcus", "recordRelease", { agreementId: "ag-hal-nadia", amount: 1200, ref: "MH-0506-1", entryId: "le-hn-r" }), C("nadia", "confirmReceipt", { agreementId: "ag-oriel-nadia", entryId: "le-on-c" }), C("nadia", "confirmReceipt", { agreementId: "ag-hal-nadia", entryId: "le-hn-c" })], done: (w) => w.ledger.some((l) => l.id === "le-hn-c") },
      { title: "A brand proposes a sponsorship agreement", who: "Lucy Adeyemi · Corvane → Jonah Reyes", when: "may06", as: "lucy", to: "fdiscover", what: "Lucy finds an adult sprinter open to partners, expresses interest, Jonah shares more, she offers $6,000 with 3 deliverables. Kept apart from development money.", cmds: [C("lucy", "expressInterest", { interestId: "int-jonah", athleteId: "jonah", reason: "We support adult sprinters competing nationally." }), C("jonah", "respondInterest", { interestId: "int-jonah", share: true }), C("lucy", "makeOffer", { offerId: "of-cv-jonah", fundId: "cap", recipientKind: "athlete", recipientId: "jonah", amount: 6000, reason: "Adult national-level sprinter whose season plan fits our athletics partnerships.", deliverables: ["Wear Corvane kit at 4 meets", "One coaching clinic at a community club by Thu 30 Sep", "One content day by Fri 31 Mar 2028"] }), C("jonah", "acceptOffer", { offerId: "of-cv-jonah", agreementId: "ag-cv-jonah" }), C("lucy", "recordRelease", { agreementId: "ag-cv-jonah", amount: 3000, ref: "CV-0506-J", entryId: "le-cj-r" }), C("jonah", "confirmReceipt", { agreementId: "ag-cv-jonah", entryId: "le-cj-c" })], done: (w) => !!w.agreements["ag-cv-jonah"] },
      { title: "Updates and deliverables", who: "Nadia, Jonah", when: "jun30", as: "nadia", to: "funding", what: "Spending verified, other sources recorded, deliverables accepted. Built in P3.", cmds: [], phase: "P3" },
    ],
  },
  {
    id: "C",
    name: "Sports organisations: funding and programme monitoring",
    minutes: "8 steps",
    steps: [
      { title: "A club funded by a sponsor it did not know", who: "Marcus Halvorsen → Highland Cycling Club", when: "may06", as: "marcus", to: "fdiscover", what: "Teams & initiatives: youth club bikes. Marcus offers $2,500; the club accepts; payment recorded and confirmed. No minors' details shared.", cmds: [C("marcus", "makeOffer", { offerId: "of-hal-highland", fundId: "has", recipientKind: "org", recipientId: "highland", requestId: "rq-highland", lineId: "l1", amount: 2500, reason: "Youth equipment for a verified community club; within my stated support." }), C("ewan", "acceptOffer", { offerId: "of-hal-highland", agreementId: "ag-hal-highland" }), C("marcus", "recordRelease", { agreementId: "ag-hal-highland", amount: 2500, ref: "MH-0506-2", entryId: "le-hh-r" }), C("ewan", "confirmReceipt", { agreementId: "ag-hal-highland", entryId: "le-hh-c" })], done: (w) => !!w.agreements["ag-hal-highland"] },
      { title: "Lanternfield discovers programme funding", who: "Maya Torres · Lanternfield", when: "may06", as: "maya", to: "discover", what: "Programme funding that matches, upcoming and open; then Play Every Day.", cmds: [] },
      { title: "Sessions, alerts and recovery", who: "Sam, Maya, Lena", when: "may06", as: "maya", to: "s19", what: "Built in P3.", cmds: [], phase: "P3" },
      { title: "Expenses, report and review", who: "Maya, Priya, Daniel", when: "jun30", as: "daniel", to: "s21", what: "Built in P3.", cmds: [], phase: "P3" },
    ],
  },
  {
    id: "D",
    name: "Bring existing funding onto Revivo Impact",
    minutes: "4 steps",
    steps: [{ title: "Add existing funding (Ostral, $24,000)", who: "Daniel → Ingrid → Farid", when: "jun30", as: "daniel", to: "portfolio", what: "Built in P3.", cmds: [], phase: "P3" }],
  },
  {
    id: "E",
    name: "Coach, guardian and safeguarding",
    minutes: "6 steps",
    steps: [
      { title: "One account, two athletes", who: "Rosa Esteves · guardian", when: "may06", as: "rosa", to: "home", what: "She switches between Tiago (16) and Inês (13).", cmds: [] },
      { title: "A coach with limited powers", who: "Rosa → Jonas Becker", when: "may06", as: "rosa", to: "safety", what: "Prepare applications and submit updates only. Jonas can never accept offers, publish requests or change consent.", cmds: [C("rosa", "authoriseCoach", { athleteId: "tiago", coachId: "jonas" })], done: (w) => w.authorisations.some((a) => a.athleteId === "tiago" && a.coachId === "jonas") },
      { title: "An anonymised funding request", who: "Rosa", when: "may06", as: "rosa", to: "publish", what: "Funders will see only: swimmer, 16–17, Coastal Region, competition travel, needed in August. The identifiability check passes (29 share that card).", cmds: [C("rosa", "publishRequest", { requestId: "rq-tiago", ownerKind: "athlete", ownerId: "tiago", title: "Competition travel", sport: "Swimming", lines: [{ label: "Competition travel and entry", amount: 2400 }], visibility: "Verified funders only", neededBy: "August", neededMonth: "August", verifiedLabel: "Qualification verified by a national federation", tags: ["Swimming", "Travel", "Coastal Region", "Verified evidence"] })], done: (w) => !!w.requests["rq-tiago"] },
      { title: "An offer that goes to the guardian", who: "Kenji → Rosa", when: "may06", as: "kenji", to: "request/rq-tiago", what: "Kenji sees only the card; $2,600 is blocked by the cap; $1,500 goes to Rosa, never to the athlete. She accepts; payment recorded and confirmed.", cmds: [C("kenji", "makeOffer", { offerId: "of-oriel-tiago", fundId: "oas", recipientKind: "athlete", recipientId: "tiago", requestId: "rq-tiago", lineId: "l1", amount: 1500, reason: "Competition travel to a verified national qualification." }), C("rosa", "acceptOffer", { offerId: "of-oriel-tiago", agreementId: "ag-oriel-tiago" }), C("kenji", "recordRelease", { agreementId: "ag-oriel-tiago", amount: 1500, ref: "OR-0506-2", entryId: "le-ot-r" }), C("rosa", "confirmReceipt", { agreementId: "ag-oriel-tiago", entryId: "le-ot-c" })], done: (w) => !!w.agreements["ag-oriel-tiago"] },
      { title: "Coach prepares, guardian submits", who: "Jonas → Rosa", when: "may06", as: "jonas", to: "apply/ostral-ctg", what: "Jonas prepares Tiago's application for the $900 still needed; he cannot submit. Rosa submits; the $900 is held so nobody can offer it twice.", cmds: [C("jonas", "saveApplication", { appId: "app-tiago", oppId: "ostral-ctg", athleteId: "tiago", requested: 900, statement: "Travel and entry for the Ostral National Age-Group Championships (qualification verified).", otherFunding: "Oriel Freight Group $1,500 for the same trip", linkedRequestId: "rq-tiago" }), C("rosa", "submitApplication", { appId: "app-tiago" })], done: (w) => !!w.applications["app-tiago"] && w.applications["app-tiago"].status !== "draft" },
      { title: "Consent withdrawn, request hidden", who: "Rosa", when: "jun30", as: "rosa", to: "safety", what: "Photos withdrawn and the card leaves Discover; the agreement continues.", cmds: [C("rosa", "setConsent", { athleteId: "tiago", purpose: "photos", value: false }), C("rosa", "hideRequest", { requestId: "rq-tiago" })], done: (w) => w.requests["rq-tiago"]?.discoverable === false },
    ],
  },
];

let n = 0;
const ev = (at: Moment, c: Cmd): Event => ({ n: ++n, at, actor: c.actor, type: c.type, args: c.args });

/** Events that make up the story up to (not including) the steps of `m`. */
export function checkpoint(m: Moment): Event[] {
  n = 0;
  const out: Event[] = [];
  if (m === "apr12") return out;
  const stepsAt = (when: Moment) => JOURNEYS.flatMap((j) => j.steps.filter((s) => s.when === when && !s.phase));
  for (const s of stepsAt("apr12")) for (const c of s.cmds) out.push(ev("apr12", c));
  out.push(ev("may06", { actor: "system", type: "arrivals", args: { to: "may06" } }));
  if (m === "may06") return out;
  // Journey E's guardian steps follow Journey B's outcome (Oriel's fund balance), as in docs/03.
  for (const id of ["A", "B", "C", "E"]) {
    const j = JOURNEYS.find((x) => x.id === id)!;
    for (const s of j.steps.filter((x) => x.when === "may06" && !x.phase)) for (const c of s.cmds) out.push(ev("may06", c));
  }
  out.push(ev("jun30", { actor: "system", type: "arrivals", args: { to: "jun30" } }));
  return out;
}

export const stepEvents = (s: Step): Event[] => s.cmds.map((c) => ({ n: 0, at: s.when, actor: c.actor, type: c.type, args: c.args }));
