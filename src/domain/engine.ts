/**
 * The rules engine. Every action is a command: it is checked against the rules in docs/02 and, if allowed, changes
 * the world and writes one audit row. The event log is the list of commands; the world is always rebuilt by replaying
 * that list through the same commands ("through the same rules as clicks"), so guided steps and real clicks agree.
 */
import {
  AMIRA_PROFILE,
  BEHAVIOUR,
  type Agreement,
  type Application,
  type Athlete,
  type Fact,
  type FundingRequest,
  type Moment,
  type Offer,
  type Opportunity,
  type Person,
  type RequestLine,
  type Visibility,
  type World,
} from "./model";

export class RuleError extends Error {}
const fail = (msg: string): never => {
  throw new RuleError(msg);
};
export const fmt = (n: number) => "$" + Math.round(n).toLocaleString("en-GB");

export type Event = { n: number; at: Moment; actor: string; type: CommandName; args: Record<string, unknown> };

/* ------------------------------------------------------------- selectors */

export const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
export const person = (w: World, id: string) => w.people[id] as Person | undefined;
export const agreementsOf = (w: World, fundId: string) => Object.values(w.agreements).filter((a) => a.fundId === fundId);
export const released = (w: World, agreementId: string) => sum(w.ledger.filter((l) => l.agreementId === agreementId && (l.kind === "release" || l.kind === "carried-in")).map((l) => l.amount));
export const received = (w: World, agreementId: string) => sum(w.ledger.filter((l) => l.agreementId === agreementId && l.kind === "receipt").map((l) => l.amount));

/** Fund totals, summed from agreements, offers and ledger entries (I1, I6). Never stored. */
export function fundTotals(w: World, fundId: string) {
  const f = w.funds[fundId];
  const ags = agreementsOf(w, fundId);
  const committed = sum(ags.map((a) => a.amount));
  const held = sum(Object.values(w.offers).filter((o) => o.fundId === fundId && (o.status === "held" || o.status === "safeguarding" || o.status === "second-approval")).map((o) => o.amount));
  const rel = sum(ags.map((a) => released(w, a.id)));
  const rec = sum(ags.map((a) => received(w, a.id)));
  return { announced: f.announced, committed, held, available: f.announced - committed - held, released: rel, received: rec, outstanding: committed - rel, count: ags.length };
}

/** Per line: pledged (agreements), offered (held offers), held for pending applications, other sources, remaining (I4). */
export function requestTotals(w: World, requestId: string) {
  const r = w.requests[requestId];
  const ags = Object.values(w.agreements).filter((a) => a.requestId === requestId);
  const offers = Object.values(w.offers).filter((o) => o.requestId === requestId && ["held", "safeguarding", "second-approval"].includes(o.status));
  const apps = Object.values(w.applications).filter((a) => a.linked?.requestId === requestId && ["submitted", "info", "shortlisted"].includes(a.status));
  const lines = r.lines.map((l) => {
    const pledged = sum(ags.filter((a) => (a.lineId ?? r.lines[0].id) === l.id).map((a) => a.amount));
    const offered = sum(offers.filter((o) => (o.lineId ?? r.lines[0].id) === l.id).map((o) => o.amount));
    const heldApp = l.id === r.lines[r.lines.length - 1].id ? sum(apps.map((a) => a.linked!.amount)) : 0;
    const remaining = Math.max(0, l.amount - pledged - offered - heldApp - l.otherSources);
    return { ...l, pledged, offered, heldApp, remaining };
  });
  const requested = sum(r.lines.map((l) => l.amount));
  const pledged = sum(lines.map((l) => l.pledged));
  const rec = sum(ags.map((a) => received(w, a.id)));
  const offered = sum(lines.map((l) => l.offered));
  const heldApp = sum(lines.map((l) => l.heldApp));
  const other = sum(lines.map((l) => l.otherSources));
  const remaining = sum(lines.map((l) => l.remaining));
  const status = r.status === "closed" ? "Closed" : remaining === 0 && pledged + other >= requested ? "Fully pledged" : pledged > 0 ? "Partly funded" : "Open";
  return { requested, pledged, received: rec, offered, heldApp, other, remaining, lines, status };
}

/** Platform totals by behaviour; commercial and in-kind never mixed into development or programme (I7). */
export function platformTotals(w: World) {
  const by = { development: { committed: 0, released: 0 }, programme: { committed: 0, released: 0 }, commercial: { committed: 0, released: 0 }, inkind: { committed: 0, released: 0 } };
  for (const a of Object.values(w.agreements)) {
    const b = BEHAVIOUR[w.funds[a.fundId].type];
    by[b].committed += a.amount;
    by[b].released += released(w, a.id);
  }
  return by;
}

export function isApprover(w: World, actor: string, funderId: string) {
  const p = w.people[actor];
  return !!p && p.funderId === funderId && p.perms.includes("Approve");
}

/* ------------------------------------------------------------ eligibility */

export type Criterion = { label: string; result: "met" | "check" | "todo" | "not"; detail: string };
export function eligibility(_w: World, opp: Opportunity, a: Athlete | undefined): { criteria: Criterion[]; summary: string; kind: "eligible" | "check" | "not" } {
  if (!a) return { criteria: [], summary: "Join to check your eligibility", kind: "check" };
  const out: Criterion[] = [];
  const hasResult = a.facts.find((f) => f.kind === "result");
  for (const r of opp.rules) {
    let c: Criterion;
    switch (r.kind) {
      case "age": {
        const ok = opp.id === "eas" ? a.age >= 15 && a.age <= 21 : opp.id === "ardent-hp" ? a.age < 23 : a.age >= 16;
        c = { label: r.label, result: ok ? "met" : "not", detail: ok ? `You are ${a.age} (the panel checks your ID)` : `You are ${a.age}` };
        break;
      }
      case "sport": {
        const ok = opp.id === "ardent-hp" ? a.sport === "Judo" : ["Athletics", "Badminton", "Boxing", "Cycling", "Judo", "Rowing", "Swimming", "Table tennis", "Wheelchair basketball", "Wheelchair racing"].includes(a.sport);
        c = { label: r.label, result: ok ? "met" : "not", detail: a.sport };
        break;
      }
      case "swimming":
        c = { label: r.label, result: a.sport === "Swimming" ? "met" : "not", detail: a.sport };
        break;
      case "region": {
        const ok = opp.id === "crsc-tb" ? a.region === "Coastal Region" : true;
        c = { label: r.label, result: ok ? "met" : "not", detail: a.region };
        break;
      }
      case "result": {
        const v = hasResult && (hasResult.state === "verified" || hasResult.state === "confirmed");
        c = hasResult ? { label: r.label, result: v ? "met" : "check", detail: `${hasResult.value} · ${v ? stateLabel(hasResult) : "for the panel to check"}` } : { label: r.label, result: "todo", detail: "Add a result to your profile" };
        break;
      }
      case "referee": {
        const coach = a.facts.find((f) => f.kind === "coach");
        c = { label: r.label, result: coach ? "met" : "todo", detail: coach ? coach.value : "Add a coach or club referee" };
        break;
      }
      case "statement":
        c = { label: r.label, result: "todo", detail: "To add when you apply" };
        break;
      case "para":
        c = { label: r.label, result: a.para ? "met" : "not", detail: a.para ? "Classification on your profile" : "For para athletes only" };
        break;
      case "squad":
        c = { label: r.label, result: "check", detail: "The federation checks its squad list" };
        break;
      case "womensTeam":
        c = { label: r.label, result: "not", detail: "For women's team sports and coaching" };
        break;
      case "organisation":
        c = { label: r.label, result: "not", detail: "For organisations" };
        break;
    }
    out.push(c);
  }
  const met = out.filter((c) => c.result === "met").length;
  const check = out.filter((c) => c.result === "check").length;
  const todo = out.filter((c) => c.result === "todo").length;
  const not = out.filter((c) => c.result === "not");
  if (not.length) return { criteria: out, summary: `Not eligible: ${/^(You|For) /.test(not[0].detail) ? not[0].detail.charAt(0).toLowerCase() + not[0].detail.slice(1) : not[0].detail}`, kind: "not" };
  const parts = [`${met} of ${out.length} met`];
  if (check) parts.push(`${check} for the panel to check`);
  if (todo) parts.push(`${todo} to add`);
  return { criteria: out, summary: parts.join(" · "), kind: check || todo ? "check" : "eligible" };
}

export function stateLabel(f: Fact) {
  switch (f.state) {
    case "verified":
      return `Verified${f.by ? ` by ${f.by}` : ""}${f.date ? ` · ${f.date}` : ""}`;
    case "confirmed":
      return `Confirmed by ${f.by}${f.date ? ` · ${f.date}` : ""}`;
    case "attested":
      return `Attested by ${f.by} (coach)`;
    case "awaiting":
      return f.confirmAsked ? `Confirmation asked of ${f.confirmAsked}` : "Awaiting verification";
    default:
      return "Self-reported";
  }
}

/** Opportunity status at the demo moment (an opportunity opens and closes with the clock). */
export function oppStatusAt(w: World, o: Opportunity): Opportunity["status"] {
  const d = { apr12: "2027-04-12", may06: "2027-05-06", jun30: "2027-06-30" }[w.moment];
  if (o.status === "draft" || o.status === "awaiting") return o.status;
  if (o.status === "decided") return "decided";
  if (d < o.opens) return "upcoming";
  if (d > o.closes) return "closed";
  return "open";
}

/** Deterministic criteria-fit count (docs/02 §9.4): never a score of a person. */
export const fit = (chips: string[], tags: string[]) => chips.filter((c) => tags.map((t) => t.toLowerCase()).includes(c.toLowerCase()));

/** Identifiability check for an anonymised card (docs/02 §7.3). */
export function identifiability(w: World, sport: string, ageGroup: string, region: string) {
  const [lo, hi] = ageGroup === "Under 14" ? [0, 13] : ageGroup === "14–15" ? [14, 15] : [16, 17];
  const same = (reg: string | null) => Object.values(w.athletes).filter((a) => a.minor && a.sport === sport && a.age >= lo && a.age <= hi && (reg === null || a.region === reg)).length;
  const inRegion = same(region);
  if (inRegion >= 10) return { ok: true, region, count: inRegion };
  const anyRegion = same(null);
  if (anyRegion >= 10) return { ok: true, region: "Any region", count: anyRegion, widened: true };
  return { ok: false, region, count: anyRegion };
}

/* -------------------------------------------------------------- commands */

type Ctx = { w: World; actor: string; at: Moment };
const id = (w: World, prefix: string) => `${prefix}-${++w.seq}`;
const audit = (c: Ctx, action: string, record: string, onBehalf?: string) =>
  c.w.audit.push({ n: c.w.audit.length + 1, at: c.at, actor: c.actor, onBehalf, action, record });
const need = (cond: unknown, msg: string) => {
  if (!cond) fail(msg);
};
/** Money is whole, positive dollars (I1–I4 assume it). */
const positive = (n: unknown, what = "The amount") => need(typeof n === "number" && Number.isInteger(n) && n > 0, `${what} must be a whole number of dollars above zero.`);
/** A new record never replaces an existing one. */
const fresh = (map: Record<string, unknown>, rid: string) => need(rid && !map[rid], "That record already exists. Nothing was changed.");
/** Sports only (docs/02 §4.4): a fixed word list catches costs that are plainly not sporting. Deterministic, never AI. */
const NOT_SPORT = ["holiday", "vacation", "beach", "rent", "mortgage", "tuition", "school fees", "university", "college fees", "wedding", "painting", "paint ", "art ", "art scholarship", "music", "piano", "groceries", "phone", "laptop", "car loan", "debt", "medical bills", "general expenses", "donation", "crowdfund"];
const SPORT_WORDS = ["sport", "athlet", "archery", "badminton", "boxing", "canoe", "cycling", "fencing", "football", "judo", "rowing", "swim", "table tennis", "triathlon", "wheelchair", "para", "netball", "basketball", "hockey", "rugby", "tennis", "gymnast", "running", "sprint"];
export function sportingCheck(...texts: string[]) {
  const t = ` ${texts.join(" ").toLowerCase()} `;
  const hit = NOT_SPORT.find((x) => t.includes(x));
  need(!hit, `Revivo Impact funds sport only. “${hit?.trim()}” is not a sporting cost: describe the sporting purpose, for example competition travel, coaching or equipment.`);
}
/** Purpose-based access: a person acts only for their own funder. */
const memberOf = (w: World, actor: string, funderId: string, perm?: Person["perms"][number]) => {
  const p = w.people[actor];
  return !!p && p.funderId === funderId && (!perm || p.perms.includes(perm));
};
const funderOfApp = (w: World, app: Application) => w.funds[w.opps[app.oppId].fundId].funderId;
/** Offers to under-18s go only to verified organisations, or to individual sponsors with the enhanced check (docs/02 §5.6, §8). */
export function mayReachMinors(w: World, personId: string) {
  const p = w.people[personId];
  const f = p?.funderId ? w.funders[p.funderId] : undefined;
  if (!f || !f.verified || f.accepts === "commercial") return false;
  return f.type === "Individual sponsor" ? !!p!.enhancedCheck : true;
}

function canActForAthlete(w: World, actor: string, athleteId: string, power: "submit" | "prepare") {
  const a = w.athletes[athleteId];
  if (!a) return false;
  if (!a.minor && actor === athleteId) return true;
  if (a.minor && a.guardianId === actor) return true;
  if (power === "prepare") return w.authorisations.some((z) => z.athleteId === athleteId && z.coachId === actor && z.powers.includes("prepare"));
  return false;
}

function markAskOffered(w: World, o: Offer) {
  const fid = w.funds[o.fundId].funderId;
  const ask = Object.values(w.asks).find((x) => x.requestId === o.requestId && x.funderId === fid && x.status === "sent");
  if (ask) ask.status = "offered";
}
/** The audit names a request by its title and an adult by name; a minor never by name. */
function offerRecord(w: World, o: Offer) {
  if (o.requestId) return w.requests[o.requestId]?.title ?? o.requestId;
  const ath = o.recipientKind === "athlete" ? w.athletes[o.recipientId] : undefined;
  return ath ? (ath.minor ? "Athlete under 18 (anonymised)" : ath.name) : w.orgs[o.recipientId]?.name ?? o.recipientId;
}

export const commands = {
  publishOpportunity(c: Ctx, a: { oppId: string }) {
    const o = c.w.opps[a.oppId];
    const f = c.w.funds[o.fundId];
    need(isApprover(c.w, c.actor, f.funderId), "Only someone with Approve at this funder can publish.");
    need(o.draftedBy !== c.actor, "You prepared this. A different person must approve it.");
    need(o.status === "awaiting" || o.status === "draft", "This opportunity is already published.");
    o.status = "open";
    o.publishedBy = c.actor;
    audit(c, "Published opportunity (four-eyes)", o.title);
  },

  createOpportunity(c: Ctx, a: { fundId: string; title: string; sport: string; purpose: string; amountLabel: string; closes: string; oppId?: string }) {
    const f = c.w.funds[a.fundId];
    need(c.w.people[c.actor]?.funderId === f.funderId, "Only members of this funder can draft its opportunities.");
    need(a.title?.trim().length >= 3, "Give the opportunity a title.");
    need(a.sport?.trim() && a.purpose?.trim(), "Revivo Impact is for sport. Add the sport and the sporting purpose this funding supports.");
    need(SPORT_WORDS.some((x) => a.sport.toLowerCase().includes(x)), `“${a.sport}” is not a sport on Revivo Impact. Name the sport or sports, for example judo, or “any sport”.`);
    sportingCheck(a.title, a.sport, a.purpose);
    const oid = a.oppId ?? id(c.w, "opp");
    fresh(c.w.opps, oid);
    c.w.opps[oid] = { id: oid, fundId: a.fundId, title: a.title, sportsLabel: a.sport, purpose: a.purpose, amountLabel: a.amountLabel, awardsLabel: "", rules: [], status: "awaiting", draftedBy: c.actor, opens: "2027-04-01", closes: a.closes, decisions: "", visibility: "Public", nominations: false, image: "im-05-discover-opportunities.png" };
    audit(c, "Drafted opportunity and sent for approval", a.title);
  },

  register(c: Ctx, a: { kind: "athlete"; personId: string; name: string; age: number; sport: string; region: string; gender: "woman" | "man" }) {
    need(a.age >= 18, "Athletes under 18 are registered by a parent or guardian.");
    need(!c.w.athletes[a.personId], "This account already exists.");
    const base = a.personId === "amira" ? AMIRA_PROFILE() : null;
    c.w.athletes[a.personId] = base ?? { id: a.personId, name: a.name, age: a.age, minor: false, gender: a.gender, sport: a.sport, discipline: a.sport, level: "Not yet added", levelRank: 1, region: a.region, discoverable: false, currentSupport: [], tags: [a.sport.toLowerCase(), a.region], createdAt: c.at, facts: [] };
    if (!c.w.people[a.personId]) c.w.people[a.personId] = { id: a.personId, name: a.name, role: "athlete", title: `Athlete, ${a.age} · ${a.sport.toLowerCase()}`, athleteId: a.personId, perms: [], group: "Seeking funding", journeys: "", tasks: [], persona: true };
    audit(c, "Registered as an adult athlete (simulated email code)", a.name);
  },

  registerFunder(c: Ctx, a: { personId: string; name: string; orgName: string; type: "Company" | "Individual sponsor"; sports: string }) {
    const fid = `f-${a.personId}`;
    need(a.personId && !c.w.people[a.personId] && !c.w.funders[fid], "This account already exists.");
    c.w.funders[fid] = { id: fid, name: a.type === "Individual sponsor" ? a.name : a.orgName, type: a.type, sports: a.sports, regions: "Any region", typesLabel: ["Development grant"], typical: "Up to $2,000", accepts: "yes", acceptsNote: "Accepts support asks (set up on joining)", acceptsMax: 2000, acceptsSupport: ["Equipment", "Travel", "Coaching"], objective: "New participating funder.", verified: false, relevant: ["any"] };
    c.w.funds[`${fid}-fund`] = { id: `${fid}-fund`, funderId: fid, name: `${a.type === "Individual sponsor" ? a.name : a.orgName} support`, type: "Development grant", announced: 10000, max: 2000, policy: "Simple" };
    c.w.people[a.personId] = { id: a.personId, name: a.name, role: a.type === "Individual sponsor" ? "individual" : "sponsor", title: a.type === "Individual sponsor" ? "Individual sponsor (verification requested)" : `Sponsor · ${a.orgName}`, funderId: fid, perms: ["Approve", "Review", "Finance"], group: "Providing funding", journeys: "", tasks: [], persona: true };
    audit(c, `Registered as ${a.type === "Individual sponsor" ? "an individual sponsor" : "a company"}; verification requested (simulated)`, a.name);
  },

  verifyOrganisation(c: Ctx, a: { funderId: string }) {
    need(c.w.people[c.actor]?.role === "admin", "Only the platform administrator verifies organisations (simulated).");
    c.w.funders[a.funderId].verified = true;
    audit(c, "Verified participating funder (simulated check)", c.w.funders[a.funderId].name);
  },

  buildProfile(c: Ctx, a: { athleteId: string }) {
    const ath = c.w.athletes[a.athleteId];
    need(c.actor === a.athleteId || ath.guardianId === c.actor, "Only the athlete or their guardian edits this profile.");
    ath.facts = [
      { id: "am-r1", label: "Result", value: "Bronze, National U21 Judo Championships 2026", kind: "result", state: "awaiting", visibility: "discoverable" },
      { id: "am-r2", label: "Result", value: "Gold, Coastal Region Judo Open 2026", kind: "result", state: "self", visibility: "discoverable" },
      { id: "am-age", label: "Date of birth", value: "Age 19 (ID document seen only by verifiers)", kind: "age", state: "awaiting", visibility: "application" },
      { id: "am-coach", label: "Coach referee", value: "Keiko Mori, Saltmere Sports Academy", kind: "coach", state: "self", visibility: "application" },
      { id: "am-club", label: "Club", value: "Saltmere Sports Academy", kind: "club", state: "self", visibility: "discoverable" },
      { id: "am-goal", label: "Season goal", value: "Medal at the Continental U21 Invitational", kind: "goal", state: "self", visibility: "discoverable" },
      { id: "am-support", label: "Current support", value: "Saltmere travel bursary, $300", kind: "support", state: "self", visibility: "private" },
    ];
    ath.discoverable = true;
    audit(c, "Built sporting profile; chose what is discoverable", ath.name);
  },

  setVisibility(c: Ctx, a: { athleteId: string; factId: string; visibility: Visibility }) {
    const ath = c.w.athletes[a.athleteId];
    need(c.actor === a.athleteId || ath.guardianId === c.actor, "Only the athlete or their guardian changes visibility.");
    need(!(ath.minor && a.visibility === "discoverable"), "Athletes under 18 are never discoverable.");
    ath.facts.find((f) => f.id === a.factId)!.visibility = a.visibility;
    audit(c, `Set fact visibility to ${a.visibility}`, ath.name);
  },

  setDiscoverable(c: Ctx, a: { athleteId: string; value: boolean }) {
    const ath = c.w.athletes[a.athleteId];
    need(c.actor === a.athleteId && !ath.minor, "Only an adult athlete chooses to be discoverable. Athletes under 18 are never discoverable.");
    ath.discoverable = a.value;
    audit(c, a.value ? "Became discoverable" : "Left Discover (consent withdrawn)", ath.name);
  },

  askConfirmation(c: Ctx, a: { athleteId: string; factId: string; orgName: string }) {
    const f = c.w.athletes[a.athleteId].facts.find((x) => x.id === a.factId)!;
    need(c.actor === a.athleteId || c.w.athletes[a.athleteId].guardianId === c.actor, "Only the athlete or guardian asks for confirmation.");
    f.confirmAsked = a.orgName;
    f.state = "awaiting";
    audit(c, `Asked ${a.orgName} to confirm a result`, c.w.athletes[a.athleteId].name);
  },

  confirmFact(c: Ctx, a: { athleteId: string; factId: string; orgName: string; date: string }) {
    const p = c.w.people[c.actor];
    const own = p?.funderId ? c.w.funders[p.funderId]?.name : p?.orgId ? c.w.orgs[p.orgId]?.name : undefined;
    need(p?.perms.includes("Verify") && own, "Only a Verify user at the athlete's federation, club or academy can confirm.");
    const f = c.w.athletes[a.athleteId].facts.find((x) => x.id === a.factId)!;
    need(f.confirmAsked === own, `The athlete asked ${f.confirmAsked ?? "no organisation"} to confirm this, not ${own}.`);
    f.state = "confirmed";
    f.by = own;
    f.date = a.date;
    audit(c, "Confirmed a result on the athlete's profile", c.w.athletes[a.athleteId].name);
  },

  verifyFact(c: Ctx, a: { athleteId: string; factId: string; method: string }) {
    const p = c.w.people[c.actor];
    need(p?.perms.includes("Verify"), "Only someone with Verify can verify a fact.");
    need(Object.values(c.w.applications).some((x) => x.applicantId === a.athleteId && x.status !== "draft" && funderOfApp(c.w, x) === p!.funderId), "You can verify facts only on an application made to your organisation.");
    const f = c.w.athletes[a.athleteId].facts.find((x) => x.id === a.factId)!;
    f.state = "verified";
    f.by = `${p!.name.split(" ")[0].charAt(0)}. ${p!.name.split(" ").slice(-1)[0]} (${a.method})`;
    f.date = c.at === "may06" ? "6 May" : c.at === "jun30" ? "30 Jun" : "12 Apr";
    audit(c, `Verified ${f.label.toLowerCase()} against ${a.method}`, c.w.athletes[a.athleteId].name);
  },

  saveApplication(c: Ctx, a: { appId: string; oppId: string; athleteId: string; requested: number; statement: string; otherFunding: string; aiDrafted?: boolean; linkedRequestId?: string }) {
    need(canActForAthlete(c.w, c.actor, a.athleteId, "prepare"), "You are not authorised to prepare applications for this athlete.");
    const prior = c.w.applications[a.appId];
    need(!prior || (prior.applicantId === a.athleteId && prior.oppId === a.oppId && prior.status === "draft"), "That application already exists and is no longer a draft.");
    positive(a.requested, "The amount requested");
    const maxFund = c.w.funds[c.w.opps[a.oppId].fundId];
    need(a.requested <= maxFund.max, `This opportunity funds up to ${fmt(maxFund.max)}. Ask for that or less.`);
    const existing = Object.values(c.w.applications).find((x) => x.oppId === a.oppId && x.applicantId === a.athleteId && x.id !== a.appId);
    need(!existing, "This athlete has already applied to this fund.");
    need(oppStatusAt(c.w, c.w.opps[a.oppId]) === "open", "This opportunity is not open.");
    c.w.applications[a.appId] = { id: a.appId, oppId: a.oppId, applicantKind: "athlete", applicantId: a.athleteId, preparedBy: c.actor, status: "draft", requested: a.requested, scores: [], otherFunding: a.otherFunding, statement: a.statement, aiDrafted: a.aiDrafted, shared: ["Name", "Age", "Sport", "Region", "Results", "Documents", "Budget", "Other funding", "Statement"], linked: a.linkedRequestId ? { requestId: a.linkedRequestId, amount: a.requested } : undefined };
    audit(c, "Prepared an application", c.w.opps[a.oppId].title, c.actor !== a.athleteId ? c.w.athletes[a.athleteId].name : undefined);
  },

  submitApplication(c: Ctx, a: { appId: string }) {
    const app = c.w.applications[a.appId];
    need(canActForAthlete(c.w, c.actor, app.applicantId, "submit"), "Only the adult athlete or a guardian can submit. A coach can prepare, not submit.");
    need(app.status === "draft", "This application has already been submitted.");
    need(app.statement.trim().length >= 40 && !app.statement.includes("(statement to add)") && !app.statement.includes("[In your own words"), "Add your statement in your own words (at least a few sentences) before submitting.");
    need(app.otherFunding.trim() && app.otherFunding !== "Not declared", "Declare other funding for the same costs, or write “None”.");
    if (app.linked) {
      const t = requestTotals(c.w, app.linked.requestId);
      need(app.linked.amount <= t.remaining, `This would ask for more than the ${fmt(t.remaining)} still needed.`);
    }
    app.status = "submitted";
    app.submittedBy = c.actor;
    app.submittedAt = c.at;
    audit(c, "Submitted an application (fields shared with consent)", c.w.opps[app.oppId].title, app.preparedBy !== c.actor ? `prepared by ${c.w.people[app.preparedBy]?.name}` : undefined);
  },

  requestInfo(c: Ctx, a: { appId: string; text: string }) {
    const app0 = c.w.applications[a.appId];
    need(memberOf(c.w, c.actor, funderOfApp(c.w, app0), "Review"), "Only a reviewer at the funder this application was sent to can request information.");
    need(app0.status === "submitted", "Information can be requested only while an application is in review.");
    c.w.applications[a.appId].info = { status: "open", text: a.text, by: c.actor };
    c.w.applications[a.appId].status = "info";
    audit(c, "Requested information", c.w.athletes[c.w.applications[a.appId].applicantId]?.name ?? a.appId);
  },

  answerInfo(c: Ctx, a: { appId: string; otherFunding: string }) {
    const app = c.w.applications[a.appId];
    need(canActForAthlete(c.w, c.actor, app.applicantId, "submit"), "Only the applicant (or guardian) answers.");
    app.info = { ...app.info!, status: "answered" };
    app.otherFunding = a.otherFunding;
    app.status = "submitted";
    const ath = c.w.athletes[app.applicantId];
    ath.currentSupport.forEach((s) => (s.declared = true));
    audit(c, "Supplied the invoice and declared other funding", ath.name);
  },

  scoreApplication(c: Ctx, a: { appId: string; total: number; noConflict?: boolean }) {
    need(a.noConflict !== false, "Confirm you have no conflict of interest with this applicant before scoring.");
    const app = c.w.applications[a.appId];
    need(memberOf(c.w, c.actor, funderOfApp(c.w, app), "Review"), "Only a reviewer at the funder this application was sent to can score it.");
    need(["submitted", "info"].includes(app.status), "This application is no longer being scored.");
    need(Number.isInteger(a.total) && a.total >= 4 && a.total <= 16, "A rubric total is between 4 and 16.");
    need(!app.scores.some((s) => s.by === c.actor), "You have already scored this application.");
    app.scores.push({ by: c.actor, total: a.total });
    audit(c, `Scored the rubric (${a.total} of 16)`, c.w.athletes[app.applicantId]?.name ?? a.appId);
  },

  shortlist(c: Ctx, a: { appId: string; tier: number }) {
    const app = c.w.applications[a.appId];
    need(memberOf(c.w, c.actor, funderOfApp(c.w, app), "Review"), "Only a reviewer at the funder this application was sent to can shortlist it.");
    need(["submitted", "info", "shortlisted"].includes(app.status) && c.w.opps[app.oppId].status !== "decided", "Decisions on this application have already been sent.");
    const fund = c.w.funds[c.w.opps[app.oppId].fundId];
    need(a.tier <= app.requested, `The tier cannot be more than the ${fmt(app.requested)} requested.`);
    need(fund.tiers ? fund.tiers.some((t) => t.amount === a.tier) : a.tier <= fund.max, `Choose one of the published tiers: ${fund.tiers?.map((t) => fmt(t.amount)).join(", ")}.`);
    const need2 = fund.policy === "Institutional" ? 2 : 1;
    need(app.scores.length >= need2, `This fund needs ${need2} reviewers' scores before shortlisting.`);
    app.status = "shortlisted";
    app.recommendedTier = a.tier;
    audit(c, `Shortlisted with recommended tier ${fmt(a.tier)}`, c.w.athletes[app.applicantId]?.name ?? a.appId);
  },

  sendDecisions(c: Ctx, a: { oppId: string }) {
    const o = c.w.opps[a.oppId];
    const fund = c.w.funds[o.fundId];
    need(isApprover(c.w, c.actor, fund.funderId), "Only someone with Approve can send decisions.");
    need(o.status !== "decided", "Decisions for this opportunity have already been sent.");
    const apps = Object.values(c.w.applications).filter((x) => x.oppId === a.oppId);
    const shortlisted = apps.filter((x) => x.status === "shortlisted");
    need(!shortlisted.some((x) => x.scores.some((s) => s.by === c.actor)), "You scored some of these applications. A different person must approve them.");
    const offerable = shortlisted.filter((x) => !x.pendingFact);
    const total = sum(offerable.map((x) => x.recommendedTier!));
    const t = fundTotals(c.w, fund.id);
    need(total <= t.available, `This would exceed the money available by ${fmt(total - t.available)}.`);
    need(!fund.awards || offerable.length + t.count <= fund.awards, `This fund publishes at most ${fund.awards} awards.`);
    for (const x of offerable) {
      const oid = `of-${x.id}`;
      fresh(c.w.offers, oid);
      // An offer on an application linked to a funding request keeps the link, so the hold becomes the offer (no double funding).
      const req = x.linked ? c.w.requests[x.linked.requestId] : undefined;
      c.w.offers[oid] = { id: oid, fundId: fund.id, by: c.actor, recipientKind: "athlete", recipientId: x.applicantId, applicationId: x.id, requestId: req?.id, lineId: req ? req.lines[req.lines.length - 1].id : undefined, amount: x.recommendedTier!, reason: "Reached the minimum score with every fact verified; tier by published criteria.", status: "held", at: c.at, light: x.light };
      x.status = "offered";
    }
    for (const x of shortlisted.filter((y) => y.pendingFact)) x.status = "waiting";
    for (const x of apps.filter((y) => ["submitted", "info"].includes(y.status))) x.status = "notselected";
    o.status = "decided";
    audit(c, `Sent decisions to all ${apps.length} applicants: ${offerable.length} offers (${fmt(total)})`, o.title);
  },

  publishRequest(c: Ctx, a: { requestId: string; ownerKind: "athlete" | "org"; ownerId: string; title: string; sport: string; lines: { label: string; amount: number }[]; visibility: FundingRequest["visibility"]; neededBy: string; neededMonth: string; verifiedLabel: string; tags: string[] }) {
    need(a.sport, "Revivo Impact is for sport. Add the sport and the sporting purpose this funding supports.");
    fresh(c.w.requests, a.requestId);
    need(a.title?.trim().length >= 3, "Say what the funding is for.");
    need(a.lines.length > 0, "Add at least one item with an amount.");
    sportingCheck(a.title, ...a.lines.map((l) => l.label));
    a.lines.forEach((l) => positive(l.amount, `“${l.label}”`));
    let minor = false;
    let ageGroup: string | undefined;
    let region = "";
    if (a.ownerKind === "athlete") {
      const ath = c.w.athletes[a.ownerId];
      need(ath.minor ? ath.guardianId === c.actor : c.actor === a.ownerId, ath.minor ? "Only the guardian publishes a request for an athlete under 18." : "Only the athlete publishes their request.");
      minor = ath.minor;
      region = ath.region;
      if (minor) {
        ageGroup = ath.age < 14 ? "Under 14" : ath.age < 16 ? "14–15" : "16–17";
        const chk = identifiability(c.w, ath.sport, ageGroup, ath.region);
        need(chk.ok, "This card could identify the athlete (fewer than 10 share its sport, age group and region), so it cannot be published.");
        need(a.sport === ath.sport, "The card must show the athlete's own sport.");
        // Controlled disclosure: no names, club or exact dates on an anonymised card.
        const words = [...ath.name.split(" "), ...(ath.club ? [ath.club] : [])].filter((x) => x.length > 2).map((x) => x.toLowerCase());
        const text = `${a.title} ${a.lines.map((l) => l.label).join(" ")} ${a.neededMonth}`.toLowerCase();
        need(!words.some((x) => text.includes(x)), "Remove the athlete's name or club: cards for athletes under 18 never show them.");
        need(/^(january|february|march|april|may|june|july|august|september|october|november|december)$/i.test(a.neededMonth.trim()), "For athletes under 18, give only the month the money is needed, not an exact date.");
        region = chk.region;
      }
    } else region = c.w.orgs[a.ownerId].region;
    c.w.requests[a.requestId] = { id: a.requestId, ownerKind: a.ownerKind, ownerId: a.ownerId, title: a.title, sport: a.sport, region, minor, ageGroup, lines: a.lines.map((l, i) => ({ id: `l${i + 1}`, label: l.label, amount: l.amount, otherSources: 0 })), visibility: minor ? "Verified funders only" : a.visibility, discoverable: true, status: "open", neededBy: a.neededBy, neededMonth: a.neededMonth, publishedBy: c.actor, publishedAt: c.at, verifiedLabel: a.verifiedLabel, tags: a.tags, safeguarding: minor ? "Checked for identifying details (simulated) · 6 May" : undefined };
    audit(c, minor ? "Published an anonymised funding request (identifiability check passed)" : "Published a funding request", a.title);
  },

  hideRequest(c: Ctx, a: { requestId: string }) {
    const r = c.w.requests[a.requestId];
    const ath = r.ownerKind === "athlete" ? c.w.athletes[r.ownerId] : null;
    need(c.actor === r.publishedBy || ath?.guardianId === c.actor, "Only the owner (or guardian) hides a request.");
    r.discoverable = false;
    audit(c, "Hid a funding request from discovery", r.title);
  },

  coverOtherSources(c: Ctx, a: { requestId: string; lineId: string; amount: number }) {
    const r = c.w.requests[a.requestId];
    need(c.actor === r.publishedBy, "Only the owner records other sources.");
    need(Number.isInteger(a.amount) && a.amount >= 0, "The amount must be a whole number of dollars, zero or more.");
    const line = r.lines.find((l) => l.id === a.lineId) ?? fail("That item is not on this request.");
    const t = requestTotals(c.w, a.requestId).lines.find((l) => l.id === a.lineId)!;
    need(a.amount <= t.remaining + line.otherSources, `Only ${fmt(t.remaining)} of this line is still needed.`);
    line.otherSources = a.amount;
    audit(c, `Marked ${fmt(a.amount)} as covered from other sources`, r.title);
  },

  sendAsk(c: Ctx, a: { askId: string; requestId: string; funderId: string; lineId: string; amount: number; support: string }) {
    const f = c.w.funders[a.funderId];
    const r = c.w.requests[a.requestId];
    need(c.actor === r.publishedBy || (r.ownerKind === "athlete" && c.w.athletes[r.ownerId].guardianId === c.actor), "Only the request's owner can ask a funder.");
    need(f.accepts === "yes", `${f.name} funds only through its published opportunities.`);
    need(a.amount <= (f.acceptsMax ?? Infinity), `${f.name} accepts asks up to ${fmt(f.acceptsMax!)}.`);
    need(!f.acceptsSupport || f.acceptsSupport.includes(a.support), `${f.name} does not support ${a.support.toLowerCase()}.`);
    fresh(c.w.asks, a.askId);
    positive(a.amount);
    need(r.status === "open", "This request is closed.");
    const line = requestTotals(c.w, a.requestId).lines.find((l) => l.id === a.lineId) ?? fail("That item is not on this request.");
    need(a.amount <= line.remaining, `Only ${fmt(line.remaining)} of this line is still needed.`);
    const asks = Object.values(c.w.asks);
    need(!asks.some((x) => x.requestId === a.requestId && x.funderId === a.funderId && x.status === "sent"), "You already have an open ask with this funder for this request.");
    // docs/02 §3.3: after "Not now", the same funder cannot be asked about the same request for 90 days (the whole demonstration).
    need(!asks.some((x) => x.requestId === a.requestId && x.funderId === a.funderId && x.status === "notnow"), `${f.name} answered “not now” on this request. You can ask again after 90 days.`);
    need(asks.filter((x) => x.by === c.actor && x.status === "sent").length < 5, "You have 5 open asks. Wait for an answer before asking another funder.");
    need(asks.filter((x) => x.funderId === a.funderId && x.status === "sent").length < (f.askCap ?? 20), `${f.name} has as many open asks as it accepts right now. Try again later.`);
    c.w.asks[a.askId] = { id: a.askId, requestId: a.requestId, funderId: a.funderId, lineId: a.lineId, amount: a.amount, by: c.actor, status: "sent", at: c.at };
    audit(c, `Asked ${f.name} for ${fmt(a.amount)}`, r.title);
  },

  answerAsk(c: Ctx, a: { askId: string; answer: "notnow" | "question" }) {
    const ask = c.w.asks[a.askId];
    need(c.w.people[c.actor]?.funderId === ask.funderId, "Only the funder answers its asks.");
    need(ask.status === "sent", "This ask has already been answered.");
    ask.status = a.answer;
    audit(c, a.answer === "notnow" ? "Answered an ask: not now" : "Asked a templated question", c.w.requests[ask.requestId].title);
  },

  toggleShortlist(c: Ctx, a: { targetId: string }) {
    const fid = c.w.people[c.actor]?.funderId;
    need(fid && c.w.people[c.actor].perms.includes("Review"), "Only funder members with Review keep a shortlist.");
    const s = (c.w.shortlists[fid!] ??= []);
    const i = s.indexOf(a.targetId);
    if (i >= 0) s.splice(i, 1);
    else s.push(a.targetId);
    audit(c, i >= 0 ? "Removed from shortlist (private)" : "Added to shortlist (private)", a.targetId);
  },

  expressInterest(c: Ctx, a: { interestId: string; athleteId: string; reason: string }) {
    const p = c.w.people[c.actor];
    const ath = c.w.athletes[a.athleteId];
    need(p?.funderId, "Only funders express interest.");
    need(!ath.minor, "Interest in athletes under 18 goes only through a guardian's anonymised request.");
    need(ath.discoverable, "This athlete is not discoverable.");
    need(!c.w.blocks.some((b) => b.athleteId === a.athleteId && b.funderId === p!.funderId), "This athlete has blocked contact from your organisation.");
    fresh(c.w.interests, a.interestId);
    need(a.reason.trim().length > 10, "Choose or write the reason, linked to what you support.");
    need(!Object.values(c.w.interests).some((x) => x.funderId === p!.funderId && x.athleteId === a.athleteId && x.status === "sent"), "Your interest is already waiting for this athlete's answer.");
    // docs/02 §3.3: 20 expressions of interest per funder per week (one demonstration date counts as one week).
    need(Object.values(c.w.interests).filter((x) => x.funderId === p!.funderId && x.at === c.at).length < 20, "Your organisation has sent 20 expressions of interest this week, the limit. Try again next week.");
    c.w.interests[a.interestId] = { id: a.interestId, funderId: p!.funderId!, by: c.actor, athleteId: a.athleteId, reason: a.reason, status: "sent", at: c.at };
    audit(c, "Expressed interest (templated)", ath.name);
  },

  respondInterest(c: Ctx, a: { interestId: string; share: boolean }) {
    const it = c.w.interests[a.interestId];
    need(c.actor === it.athleteId, "Only the athlete answers.");
    need(it.status === "sent", "You have already answered.");
    it.status = a.share ? "shared" : "declined";
    audit(c, a.share ? "Shared more with an interested sponsor" : "Declined an expression of interest", c.w.funders[it.funderId].name);
  },

  makeOffer(c: Ctx, a: { offerId: string; fundId: string; recipientKind: "athlete" | "org"; recipientId: string; requestId?: string; lineId?: string; amount: number; reason: string; deliverables?: string[] }) {
    const fund = c.w.funds[a.fundId];
    const funder = c.w.funders[fund.funderId];
    need(isApprover(c.w, c.actor, fund.funderId), "Only someone with Approve at this funder can make offers.");
    fresh(c.w.offers, a.offerId);
    positive(a.amount);
    need(a.reason.trim().length > 10, "Give a reason linked to the fund's published criteria.");
    need(!(a.recipientKind === "athlete" && c.w.athletes[a.recipientId]?.minor && BEHAVIOUR[fund.type] === "commercial"), "Commercial sponsorship of athletes under 18 is outside this prototype.");
    // The recipient is always the owner of the request; an offer without a request goes only to a discoverable adult or an organisation.
    const r = a.requestId ? c.w.requests[a.requestId] ?? fail("That funding request does not exist.") : undefined;
    if (r) {
      need(r.ownerKind === a.recipientKind && r.ownerId === a.recipientId, "An offer on a funding request goes to the person or organisation that published it.");
      need(r.status === "open" && r.discoverable, "This funding request is no longer open to offers.");
      need(r.lines.some((l) => l.id === (a.lineId ?? r.lines[0].id)), "That item is not on this request.");
    } else if (a.recipientKind === "athlete") {
      const ath = c.w.athletes[a.recipientId] ?? fail("That athlete does not exist.");
      need(!ath.minor, "Funders reach athletes under 18 only through a guardian's anonymised request or an application.");
      need(ath.discoverable, "This athlete is not discoverable.");
    } else need(c.w.orgs[a.recipientId], "That organisation does not exist.");
    const recipientMinor = a.recipientKind === "athlete" && c.w.athletes[a.recipientId].minor;
    if (recipientMinor) {
      need(!(funder.type === "Individual sponsor" && !c.w.people[c.actor]?.enhancedCheck), "Individual sponsors need an enhanced safeguarding check to support athletes under 18.");
      need(mayReachMinors(c.w, c.actor), "Only verified organisations, and individual sponsors with an enhanced safeguarding check, can offer to athletes under 18.");
    }
    if (a.recipientKind === "athlete") need(!c.w.blocks.some((b) => b.athleteId === a.recipientId && b.funderId === fund.funderId), "This athlete has blocked contact from your organisation.");
    if (r) {
      const line = requestTotals(c.w, r.id).lines.find((l) => l.id === (a.lineId ?? r.lines[0].id))!;
      need(a.amount <= line.remaining, `This exceeds the ${fmt(line.remaining)} still needed by ${fmt(a.amount - line.remaining)}. Offers are capped at what is still needed.`);
    }
    need(a.amount <= fund.max, `This fund's maximum per agreement is ${fmt(fund.max)}.`);
    const t = fundTotals(c.w, a.fundId);
    need(a.amount <= t.available, `This would exceed the money available by ${fmt(a.amount - t.available)}.`);
    // Approval policy (docs/02 §5.7). Standard and Institutional: a second person approves every offer.
    // Simple: one person, unless offers from this fund to this recipient pass the delegated limit (no splitting).
    const toSame = sum(Object.values(c.w.offers).filter((o) => o.fundId === a.fundId && o.recipientId === a.recipientId && !["declined", "withdrawn"].includes(o.status)).map((o) => o.amount));
    const second = fund.policy !== "Simple" || (!!fund.delegatedLimit && toSame + a.amount > fund.delegatedLimit);
    const status: Offer["status"] = second ? "second-approval" : recipientMinor && funder.type === "Individual sponsor" ? "safeguarding" : "held";
    c.w.offers[a.offerId] = { id: a.offerId, fundId: a.fundId, by: c.actor, recipientKind: a.recipientKind, recipientId: a.recipientId, requestId: a.requestId, lineId: a.lineId ?? (r ? r.lines[0].id : undefined), amount: a.amount, reason: a.reason, status, at: c.at, deliverables: a.deliverables };
    if (status !== "second-approval") markAskOffered(c.w, c.w.offers[a.offerId]);
    const why = fund.policy !== "Simple" ? `this fund's ${fund.policy} policy` : "above the delegated limit";
    audit(c, status === "second-approval" ? `Offer of ${fmt(a.amount)} sent for second approval (${why})` : status === "safeguarding" ? `Offer of ${fmt(a.amount)} sent to platform safeguarding review` : `Offered ${fmt(a.amount)}`, offerRecord(c.w, c.w.offers[a.offerId]));
  },

  approveOffer(c: Ctx, a: { offerId: string }) {
    const o = c.w.offers[a.offerId] ?? fail("That offer does not exist.");
    const fund = c.w.funds[o.fundId];
    need(isApprover(c.w, c.actor, fund.funderId), "Only someone with Approve at this funder can give the second approval.");
    need(o.status === "second-approval", "This offer is not waiting for a second approval.");
    need(o.by !== c.actor, "You made this offer. A different person with Approve must give the second approval.");
    const minor = o.recipientKind === "athlete" && c.w.athletes[o.recipientId]?.minor;
    o.status = minor && c.w.funders[fund.funderId].type === "Individual sponsor" ? "safeguarding" : "held";
    o.approvedBy = c.actor;
    markAskOffered(c.w, o);
    audit(c, `Gave the second approval; offer of ${fmt(o.amount)} sent`, offerRecord(c.w, o));
  },

  withdrawOffer(c: Ctx, a: { offerId: string; reason: string }) {
    const o = c.w.offers[a.offerId] ?? fail("That offer does not exist.");
    need(isApprover(c.w, c.actor, c.w.funds[o.fundId].funderId), "Only someone with Approve at this funder can withdraw its offer.");
    need(["second-approval", "held", "safeguarding"].includes(o.status), "Only an offer that has not been accepted can be withdrawn.");
    need(!o.applicationId, "Decisions on applications are final once sent.");
    need(a.reason?.trim().length > 3, "Returning or withdrawing something needs a reason.");
    o.status = "withdrawn";
    audit(c, `Withdrew an offer of ${fmt(o.amount)}: ${a.reason}`, offerRecord(c.w, o));
  },

  clearSafeguarding(c: Ctx, a: { offerId: string }) {
    need(c.w.people[c.actor]?.role === "admin", "Only the platform administrator completes a safeguarding review (simulated).");
    const o = c.w.offers[a.offerId] ?? fail("That offer does not exist.");
    need(o.status === "safeguarding", "This offer is not waiting for a safeguarding review.");
    o.status = "held";
    audit(c, "Safeguarding review passed; offer released to the guardian", offerRecord(c.w, o));
  },

  acceptOffer(c: Ctx, a: { offerId: string; agreementId: string }) {
    const o = c.w.offers[a.offerId] ?? fail("That offer does not exist.");
    fresh(c.w.agreements, a.agreementId);
    need(o.status === "held", o.status === "safeguarding" ? "This offer is still in safeguarding review." : "This offer is not open.");
    if (o.recipientKind === "athlete") {
      const ath = c.w.athletes[o.recipientId];
      need(ath.minor ? ath.guardianId === c.actor : c.actor === ath.id, ath.minor ? "Only the guardian can accept for an athlete under 18. A coach cannot." : "Only the athlete can accept.");
    } else need(c.w.people[c.actor]?.orgId === o.recipientId && c.w.people[c.actor].perms.includes("Approve"), "Only someone with Approve at the organisation accepts.");
    o.status = "accepted";
    const fund = c.w.funds[o.fundId];
    c.w.agreements[a.agreementId] = { id: a.agreementId, offerId: o.id, fundId: o.fundId, recipientKind: o.recipientKind, recipientId: o.recipientId, amount: o.amount, acceptedBy: c.actor, acceptedAt: c.at, origin: o.applicationId ? "Application" : "Offer", requestId: o.requestId, lineId: o.lineId, light: o.light };
    if (o.applicationId) c.w.applications[o.applicationId].status = "accepted";
    audit(c, `Accepted a ${fund.type.toLowerCase()} of ${fmt(o.amount)}`, fund.name);
  },

  declineOffer(c: Ctx, a: { offerId: string }) {
    const o = c.w.offers[a.offerId] ?? fail("That offer does not exist.");
    need(o.status === "held", "Only an offer waiting for an answer can be declined.");
    if (o.recipientKind === "athlete") {
      const ath = c.w.athletes[o.recipientId];
      need(ath.minor ? ath.guardianId === c.actor : c.actor === ath.id, ath.minor ? "Only the guardian answers for an athlete under 18." : "Only the athlete answers.");
    } else need(c.w.people[c.actor]?.orgId === o.recipientId && c.w.people[c.actor].perms.includes("Approve"), "Only someone with Approve at the organisation answers.");
    o.status = "declined";
    if (o.applicationId) c.w.applications[o.applicationId].status = "notselected";
    audit(c, `Declined an offer of ${fmt(o.amount)} (no reason needed; nothing else changes)`, c.w.funds[o.fundId].name);
  },

  reportConcern(c: Ctx, a: { concernId: string; athleteId: string; funderId?: string; about: string }) {
    const ath = c.w.athletes[a.athleteId];
    need(ath && (ath.minor ? ath.guardianId === c.actor : ath.id === c.actor), "Only the athlete (or guardian) reports a concern here.");
    fresh(Object.fromEntries(c.w.concerns.map((x) => [x.id, x])), a.concernId);
    c.w.concerns.push({ id: a.concernId, athleteId: a.athleteId, funderId: a.funderId, about: a.about, by: c.actor, at: c.at, status: "open" });
    audit(c, "Reported a concern to the platform safeguarding team (simulated)", a.funderId ? c.w.funders[a.funderId]?.name ?? "A funder" : "Platform");
  },

  recordRelease(c: Ctx, a: { agreementId: string; amount: number; ref: string; entryId: string }) {
    const ag = c.w.agreements[a.agreementId];
    const fund = c.w.funds[ag.fundId];
    const p = c.w.people[c.actor];
    need(p?.funderId === fund.funderId && p.perms.includes("Finance"), "Only someone with Finance at this funder records releases.");
    if (fund.policy === "Institutional") need(c.w.offers[ag.offerId ?? ""]?.by !== c.actor, "Under this fund's Institutional policy, the person who approved the offer cannot record its release.");
    positive(a.amount, "A release");
    need(!c.w.ledger.some((l) => l.id === a.entryId), "That record already exists. Nothing was changed.");
    need(!c.w.ledger.some((l) => l.agreementId === ag.id && l.ref === a.ref), `Release ${a.ref} is already recorded.`);
    need(released(c.w, ag.id) + a.amount <= ag.amount, "Released cannot exceed what was committed (I2).");
    c.w.ledger.push({ id: a.entryId, agreementId: ag.id, kind: "release", amount: a.amount, by: c.actor, at: c.at, ref: a.ref });
    audit(c, `Recorded release ${fmt(a.amount)} (simulated)${fund.policy === "Simple" && c.w.offers[ag.offerId ?? ""]?.by === c.actor ? " · single-person approval" : ""}`, fund.name);
  },

  confirmReceipt(c: Ctx, a: { agreementId: string; entryId: string }) {
    const ag = c.w.agreements[a.agreementId];
    const ath = ag.recipientKind === "athlete" ? c.w.athletes[ag.recipientId] : null;
    need(ath ? (ath.minor ? ath.guardianId === c.actor : ath.id === c.actor) : c.w.people[c.actor]?.orgId === ag.recipientId, "Only the recipient (or guardian) confirms receipt.");
    need(!c.w.ledger.some((l) => l.id === a.entryId), "That record already exists. Nothing was changed.");
    const unconfirmed = released(c.w, ag.id) - received(c.w, ag.id);
    need(unconfirmed > 0, "There is no recorded payment to confirm (I9).");
    c.w.ledger.push({ id: a.entryId, agreementId: ag.id, kind: "receipt", amount: unconfirmed, by: c.actor, at: c.at, ref: "receipt" });
    audit(c, `Confirmed receipt of ${fmt(unconfirmed)}`, c.w.funds[ag.fundId].name);
  },

  authoriseCoach(c: Ctx, a: { athleteId: string; coachId: string }) {
    const ath = c.w.athletes[a.athleteId];
    need(ath.minor ? ath.guardianId === c.actor : c.actor === a.athleteId, "Only the guardian (or adult athlete) authorises a coach.");
    need(c.w.people[a.coachId]?.role === "coach", "Only a coach can be authorised.");
    c.w.authorisations = c.w.authorisations.filter((z) => !(z.athleteId === a.athleteId && z.coachId === a.coachId));
    c.w.authorisations.push({ athleteId: a.athleteId, coachId: a.coachId, powers: ["prepare", "updates"], by: c.actor });
    audit(c, "Authorised a coach: prepare applications and submit updates only", c.w.athletes[a.athleteId].name);
  },

  setConsent(c: Ctx, a: { athleteId: string; purpose: "photos" | "progress"; value: boolean }) {
    const ath = c.w.athletes[a.athleteId];
    need(ath.minor ? ath.guardianId === c.actor : ath.id === c.actor, "Only the athlete (or guardian) changes consent.");
    c.w.consents = c.w.consents.filter((z) => !(z.athleteId === a.athleteId && z.purpose === a.purpose));
    c.w.consents.push({ athleteId: a.athleteId, purpose: a.purpose, value: a.value, by: c.actor });
    audit(c, `${a.value ? "Gave" : "Withdrew"} consent: ${a.purpose === "photos" ? "photos and stories" : "progress reporting"}`, ath.name);
  },

  blockFunder(c: Ctx, a: { athleteId: string; funderId: string }) {
    const ath = c.w.athletes[a.athleteId];
    need(ath.minor ? ath.guardianId === c.actor : ath.id === c.actor, "Only the athlete (or guardian) blocks a funder.");
    need(c.w.funders[a.funderId], "That funder does not exist.");
    need(!c.w.blocks.some((b) => b.athleteId === a.athleteId && b.funderId === a.funderId), "This funder is already blocked.");
    c.w.blocks.push({ athleteId: a.athleteId, funderId: a.funderId });
    // docs/02 §3.3: a blocked funder can send no new offers; offers not yet accepted lapse. Agreements continue.
    const lapsed = Object.values(c.w.offers).filter((o) => o.recipientId === a.athleteId && c.w.funds[o.fundId].funderId === a.funderId && ["second-approval", "safeguarding", "held"].includes(o.status));
    lapsed.forEach((o) => (o.status = "withdrawn"));
    audit(c, `Blocked a funder (existing agreements continue${lapsed.length ? `; ${lapsed.length} open offer${lapsed.length > 1 ? "s" : ""} lapsed` : ""}; administrator told)`, c.w.funders[a.funderId].name);
  },

  /* ---- seeded world activity between demo moments (actor "system") ---- */
  arrivals(c: Ctx, a: { to: Moment }) {
    seedArrivals(c.w, a.to);
    audit(c, a.to === "may06" ? "Applications, scores and decisions that happened between 12 Apr and 6 May" : "Acceptances, payments and decisions that happened between 6 May and 30 Jun", "Seeded world");
  },
} satisfies Record<string, (c: Ctx, a: never) => void>;

export type CommandName = keyof typeof commands;

/** Apply one event; throws RuleError if a rule blocks it. */
export function apply(w: World, e: Event) {
  const fn = commands[e.type] as ((c: Ctx, a: unknown) => void) | undefined;
  if (!fn) fail("That action does not exist.");
  w.moment = e.at;
  try {
    fn!({ w, actor: e.actor, at: e.at }, e.args);
  } catch (err) {
    // A command given a record that does not exist reads a missing field; say so plainly instead of crashing.
    if (err instanceof TypeError) fail("That record does not exist in this demonstration. Nothing was changed.");
    throw err;
  }
}

/* ------------------------------------------------------- seeded arrivals */

import { REGIONS } from "./model";
function seedArrivals(w: World, to: Moment) {
  if (to === "may06") {
    // Ardent Judo Federation confirmed Amira's bronze on Tue 20 Apr (she asked on 12 Apr)
    const am = w.athletes.amira;
    const f = am?.facts.find((x) => x.id === "am-r1");
    if (f && f.confirmAsked) Object.assign(f, { state: "confirmed", by: "Ardent Judo Federation", date: "20 Apr" });
    // Daniel's information request (Mon 3 May) and Amira's answer (Tue 4 May) are seeded on her application
    const amApp = Object.values(w.applications).find((x) => x.applicantId === "amira" && x.oppId === "eas");
    if (amApp && amApp.status === "submitted") {
      amApp.info = { status: "answered", text: "Please upload your coaching-fee invoice and confirm any other funding for the same costs.", by: "daniel" };
      amApp.otherFunding = "Saltmere travel bursary, $300";
      am.currentSupport.forEach((s) => (s.declared = true));
      amApp.scores.push({ by: "reviewer2", total: 12 });
    }
    // 142 seeded EAS applications (docs/05 §4): 45 offerable, 2 waiting, 81 below the minimum score, 9 not eligible, 5 incomplete
    const pool = Object.values(w.athletes).filter((a) => a.light && a.age >= 15 && a.age <= 21 && !a.id.startsWith("a-") && !a.id.startsWith("sw"));
    const tiers = [...Array(27).fill(5000), ...Array(12).fill(4500), ...Array(6).fill(3500)];
    let i = 0;
    const mk = (status: Application["status"], extra: Partial<Application> = {}) => {
      const ath = pool[i % pool.length];
      i++;
      const id = `eas-${i}`;
      w.applications[id] = { id, oppId: "eas", applicantKind: "athlete", applicantId: ath.id, preparedBy: ath.id, submittedBy: ath.minor ? "guardian" : ath.id, status, requested: 5000, scores: [], otherFunding: "None", statement: "", shared: [], submittedAt: "apr12", light: true, ...extra };
      return w.applications[id];
    };
    tiers.forEach((t, k) => mk("shortlisted", { recommendedTier: t, requested: t, scores: [{ by: "daniel", total: 12 + (k % 4) }, { by: "reviewer2", total: 11 + (k % 5) }], nominatedBy: k < 3 ? "Ostral Swimming Federation" : undefined }));
    mk("shortlisted", { recommendedTier: 3500, scores: [{ by: "daniel", total: 11 }, { by: "reviewer2", total: 12 }], pendingFact: true });
    mk("shortlisted", { recommendedTier: 3500, scores: [{ by: "daniel", total: 12 }, { by: "reviewer2", total: 11 }], pendingFact: true });
    for (let k = 0; k < 81; k++) mk("submitted", { scores: [{ by: "daniel", total: 6 + (k % 5) }, { by: "reviewer2", total: 5 + (k % 6) }] });
    for (let k = 0; k < 9; k++) mk("noteligible");
    for (let k = 0; k < 5; k++) mk("incomplete");
    // Women's Sporting Development Fund: 12 offers held on 6 May (8 × 3,000 + 4 × 3,500)
    [...Array(8).fill(3000), ...Array(4).fill(3500)].forEach((amt, k) => {
      const oid = `of-wsdf-${k + 1}`;
      w.offers[oid] = { id: oid, fundId: "wsdf", by: "lucy", recipientKind: "org", recipientId: `lt-${k + 1}`, amount: amt, reason: "Women's team development (published criteria).", status: "held", at: "may06", light: true };
    });
    void REGIONS;
  }
  if (to === "jun30") {
    // 44 seeded EAS offers accepted; 1 (a 17-year-old's) still held, window extended to Thu 15 Jul; instalment 1 (50%) released and received
    const easOffers = Object.values(w.offers).filter((o) => o.fundId === "eas" && o.status === "held" && o.light);
    const keep = easOffers.find((o) => o.amount === 3500);
    for (const o of easOffers) {
      if (o === keep) continue;
      o.status = "accepted";
      const agId = `ag-${o.id}`;
      w.agreements[agId] = { id: agId, offerId: o.id, fundId: "eas", recipientKind: "athlete", recipientId: o.recipientId, amount: o.amount, acceptedBy: o.recipientId, acceptedAt: "may06", origin: "Application", light: true };
      if (o.applicationId) w.applications[o.applicationId].status = "accepted";
      w.ledger.push({ id: `${agId}-r1`, agreementId: agId, kind: "release", amount: o.amount / 2, by: "priya", at: "may06", ref: `TW-EAS-${o.id}` }, { id: `${agId}-c1`, agreementId: agId, kind: "receipt", amount: o.amount / 2, by: o.recipientId, at: "may06", ref: "receipt" });
    }
    // Women's Fund offers accepted by Thu 20 May; 50% released
    for (const o of Object.values(w.offers).filter((x) => x.fundId === "wsdf" && x.status === "held")) {
      o.status = "accepted";
      const agId = `ag-${o.id}`;
      w.agreements[agId] = { id: agId, offerId: o.id, fundId: "wsdf", recipientKind: "org", recipientId: o.recipientId, amount: o.amount, acceptedBy: o.recipientId, acceptedAt: "may06", origin: "Application", light: true };
      w.ledger.push({ id: `${agId}-r1`, agreementId: agId, kind: "release", amount: o.amount / 2, by: "system", at: "jun30", ref: `CV-${o.id}` });
    }
    // Other funds decided between 6 May and 30 Jun (docs/05 §2.1)
    const light = (fund: string, amounts: number[], kind: "athlete" | "org") =>
      amounts.forEach((amt, k) => {
        const agId = `ag-${fund}-${k + 1}`;
        w.agreements[agId] = { id: agId, fundId: fund, recipientKind: kind, recipientId: `lt-${fund}-${k + 1}`, amount: amt, acceptedBy: "system", acceptedAt: "jun30", origin: "Application", light: true };
        w.ledger.push({ id: `${agId}-r`, agreementId: agId, kind: "release", amount: amt, by: "system", at: "jun30", ref: `${fund}-${k + 1}` });
      });
    light("crsc-tb", [...Array(12).fill(1500), ...Array(8).fill(1200), ...Array(4).fill(800)], "athlete");
    light("verran-pe", [...Array(6).fill(2500), ...Array(2).fill(2000)], "athlete");
    light("ardent-hp", Array(9).fill(1200), "athlete");
  }
}

/* ------------------------------------------------------- derived helpers */

export function linesSummary(lines: RequestLine[]) {
  return lines.map((l) => `${l.label} ${fmt(l.amount)}`).join(" + ");
}
export const agreementsFor = (w: World, kind: "athlete" | "org", rid: string): Agreement[] => Object.values(w.agreements).filter((a) => a.recipientKind === kind && a.recipientId === rid);
export const offersFor = (w: World, kind: "athlete" | "org", rid: string): Offer[] => Object.values(w.offers).filter((o) => o.recipientKind === kind && o.recipientId === rid);
export const typeOf = (w: World, fundId: string) => w.funds[fundId].type;
