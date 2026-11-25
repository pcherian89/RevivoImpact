/**
 * The rules engine. Every action is a command: it is checked against the rules in docs/02 and, if allowed, changes
 * the world and writes one audit row. The event log is the list of commands; the world is always rebuilt by replaying
 * that list through the same commands ("through the same rules as clicks"), so guided steps and real clicks agree.
 */
import {
  AMIRA_PROFILE,
  BEHAVIOUR,
  sessionDate,
  seedSessions,
  type Agreement,
  type Application,
  type Athlete,
  type Fact,
  type FundingRequest,
  type Moment,
  type Offer,
  type Opportunity,
  type Progress,
  type ReviewDecision,
  type Session,
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
/** An existing-funding draft counts only once a second person approves it (docs/03 Journey D). */
export const counts = (g: Agreement) => g.status !== "awaiting-approval" && g.status !== "disputed";
export const BEHAVIOUR_OF = (w: World, fundId: string) => BEHAVIOUR[w.funds[fundId].type];
export const agreementsOf = (w: World, fundId: string) => Object.values(w.agreements).filter((a) => a.fundId === fundId && counts(a));
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

/**
 * One agreement's money, in the five states that never blur (docs/02 §6; words in docs/04 §6):
 * committed (agreed) → paid → received → spent (reported) → checked. Carried-in money is labelled apart and never checked.
 */
export function agreementTotals(w: World, agreementId: string) {
  const g = w.agreements[agreementId];
  const ex = Object.values(w.expenses).filter((e) => e.agreementId === agreementId);
  const paid = released(w, agreementId);
  const carriedPaid = sum(w.ledger.filter((l) => l.agreementId === agreementId && l.kind === "carried-in").map((l) => l.amount));
  const spent = sum(ex.map((e) => e.amount));
  const checked = sum(ex.filter((e) => e.status === "checked").map((e) => e.amount));
  const carriedSpent = sum(ex.filter((e) => e.status === "carried-in").map((e) => e.amount));
  const query = sum(ex.filter((e) => e.status === "query").map((e) => e.amount));
  const rec = received(w, agreementId);
  return { committed: g.amount, paid, carriedPaid, received: rec, toConfirm: Math.max(0, paid - carriedPaid - rec), spent, checked, carriedSpent, waiting: spent - checked - carriedSpent, query, notYetSpent: Math.max(0, paid - spent), stillToPay: g.amount - paid };
}

/** Programme status per site (docs/05 §6): ≥95% on track, 85–94% needs attention, <85% behind; alert after two missed in a row. */
export const LAST_SLOT: Record<Moment, number> = { apr12: 1, may06: 9, jun30: 19 };
export function siteStatus(w: World, programmeId: string, siteId: string) {
  const ss = Object.values(w.sessions).filter((x) => x.programmeId === programmeId && x.siteId === siteId).sort((a, b) => a.slot - b.slot);
  const delivered = ss.filter((x) => x.status === "delivered").length;
  const missed = ss.filter((x) => x.status === "missed");
  // Sessions not yet recorded (for example today's, before the coach records it) are neither run nor missed.
  const due = delivered + missed.length;
  const unrecorded = LAST_SLOT[w.moment] + 1 - ss.length;
  const share = due ? delivered / due : 1;
  const status = share >= 0.95 ? "On track" : share >= 0.85 ? "Needs attention" : "Behind";
  let run = 0;
  let alert = false;
  for (const x of ss) {
    run = x.status === "missed" ? run + 1 : 0;
    if (run >= 2) alert = true;
  }
  const plan = Object.values(w.recoveryPlans).filter((r) => r.programmeId === programmeId && r.siteId === siteId).pop();
  return { sessions: ss, unrecorded, delivered, missed: missed.length, weather: missed.filter((x) => x.reason === "weather").length, coach: missed.filter((x) => x.reason === "coach availability").length, due, status, alert, plan, checked: ss.filter((x) => x.status === "delivered" && x.checked).length, toCheck: ss.filter((x) => x.status === "delivered" && !x.checked).length };
}
export function programmeTotals(w: World, programmeId: string) {
  const p = w.programmes[programmeId];
  const sites = p.sites.map((s) => ({ site: s, ...siteStatus(w, programmeId, s.id) }));
  return { sites, delivered: sum(sites.map((s) => s.delivered)), missed: sum(sites.map((s) => s.missed)), weather: sum(sites.map((s) => s.weather)), coach: sum(sites.map((s) => s.coach)), checked: sum(sites.map((s) => s.checked)), toCheck: sum(sites.map((s) => s.toCheck)), due: sum(sites.map((s) => s.due)), planned: p.sessionsPerSite * p.sites.length, participants: sum(p.sites.map((s) => s.participants)) };
}

/** Claims check for reports (docs/02 §10): words that claim more than records show. Deterministic. */
const CLAIMS = ["improved confidence", "transformed", "changed lives", "changing lives", "life-changing", "life changing", "proven", "proves", "proved", "guaranteed", "impact on wellbeing", "caused", "because of the programme", "thanks to the programme", "as a result of the programme", "happier", "healthier", "anti-social", "crime", "100%", "every child", "all children", "all participants"]; // copy-check: allow (the words the claims check refuses)
export function claimsCheck(text: string, w?: World, agreementId?: string) {
  const t = text.toLowerCase();
  const esc = (c: string) => c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const out = CLAIMS.filter((c) => new RegExp(`(^|[^a-z])${esc(c)}([^a-z]|$)`).test(t));
  // Figures must match the records: "N of M sessions" and money amounts that the records do not contain.
  const p = w && agreementId ? Object.values(w.programmes).find((x) => x.agreementId === agreementId) : undefined;
  if (w && p) {
    const pt = programmeTotals(w, p.id);
    for (const m of t.matchAll(/(\d+) of (\d+) (?:planned )?sessions/g)) if (Number(m[1]) !== pt.delivered || Number(m[2]) !== pt.planned) out.push(`${m[1]} of ${m[2]} sessions (the records show ${pt.delivered} of ${pt.planned})`);
  }
  return out;
}

/** Simulated AI report draft (AI C): built only from the records, every figure from a selector. */
export function draftReportText(w: World, agreementId: string) {
  const g = w.agreements[agreementId];
  const p = Object.values(w.programmes).find((x) => x.agreementId === agreementId);
  const t = agreementTotals(w, agreementId);
  if (p) {
    const pt = programmeTotals(w, p.id);
    const behind = pt.sites.filter((s) => s.status !== "On track");
    return [
      `Sessions: ${pt.delivered} of ${pt.planned} planned sessions ran this quarter across ${p.sites.length} sites; ${pt.missed} could not run (${pt.weather} weather, ${pt.coach} coach availability).`,
      `Participants: ${pt.participants} registered.`,
      behind.length ? `Behind or needing attention: ${behind.map((s) => `${s.site.name} (${s.delivered} of ${s.due})`).join(", ")}.${behind.some((s) => s.plan?.status === "approved") ? " A recovery plan is in place for Greenpark." : ""}` : "Every site is on track.",
      `Money: ${fmt(t.paid)} paid; ${fmt(t.spent)} spent, of which ${fmt(t.checked)} checked by the funder and ${fmt(t.waiting)} waiting to be checked; ${fmt(t.notYetSpent)} not yet spent.`,
      "[What participants and coaches told you, in your own words. Say who answered and how.]",
    ].join("\n\n");
  }
  return `Money: ${fmt(t.paid)} paid; ${fmt(t.spent)} spent; ${fmt(t.checked)} checked. ${g.purpose ?? ""}`;
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
    if (!counts(a)) continue;
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
const SPORTS_LIST = ["Archery", "Athletics", "Badminton", "Boxing", "Canoeing", "Cycling", "Fencing", "Football", "Judo", "Rowing", "Swimming", "Table tennis", "Triathlon", "Wheelchair basketball", "Wheelchair racing"];
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

/** Programme staff with a given power (Admin/Approve run the programme; Verify checks a site; coaches record their own sites). */
const staffCan = (w: World, actor: string, orgId: string, ...perms: Person["perms"][number][]) => {
  const p = w.people[actor];
  return !!p && p.orgId === orgId && p.perms.some((x) => perms.includes(x));
};
const siteOf = (w: World, actor: string, siteId: string) => !w.people[actor]?.sites || w.people[actor].sites!.includes(siteId);

/** Money and updates move only on an agreement both sides have agreed (not a draft, not awaiting confirmation, not disputed). */
const live = (g: Agreement) => need(!g.status || g.status === "active", g.status === "awaiting-approval" ? "This funding waits for a second person at the funder to approve it." : g.status === "awaiting-recipient" ? "This funding waits for the organisation to confirm the figures." : "The figures on this funding are disputed. Agree them first.");
/** A paused or closed review stops further payments until a new review. */
const notStopped = (w: World, g: Agreement) => {
  const r = Object.values(w.reviews).filter((x) => x.agreementId === g.id).pop();
  need(!r || (r.decision !== "Pause" && r.decision !== "Close"), `The last review ${r?.decision === "Pause" ? "paused" : "closed"} this funding. Record a new review first.`);
};
/** Progress sharing paused by the athlete or guardian (docs/02 §7.1). */
export const progressPaused = (w: World, athleteId?: string) => !!athleteId && w.consents.some((z) => z.athleteId === athleteId && z.purpose === "progress" && z.value === false);

/** Who may add spending or send updates on an agreement: the recipient, a minor's guardian, a coach with the update power, or the receiving organisation. */
function mayUpdate(w: World, actor: string, g: Agreement) {
  if (g.recipientKind === "org") {
    const p = w.people[actor];
    return p?.orgId === g.recipientId && p.perms.some((x) => x === "Admin" || x === "Approve" || x === "Finance");
  }
  const ath = w.athletes[g.recipientId];
  if (!ath) return false;
  if (!ath.minor && actor === ath.id) return true;
  if (ath.guardianId === actor) return true;
  return w.authorisations.some((z) => z.athleteId === ath.id && z.coachId === actor && z.powers.includes("updates"));
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
    need(!c.w.athletes[a.personId] && (!c.w.people[a.personId] || c.w.people[a.personId].athleteId === a.personId), "This account already exists.");
    need(Number.isInteger(a.age), "Give your age in whole years.");
    need(SPORT_WORDS.some((x) => a.sport.toLowerCase().includes(x)) || SPORTS_LIST.includes(a.sport), "Revivo Impact is for sport. Choose your sport.");
    const base = a.personId === "amira" ? AMIRA_PROFILE() : null;
    c.w.athletes[a.personId] = base ?? { id: a.personId, name: a.name, age: a.age, minor: false, gender: a.gender, sport: a.sport, discipline: a.sport, level: "Not yet added", levelRank: 1, region: a.region, discoverable: false, currentSupport: [], tags: [a.sport.toLowerCase(), a.region], createdAt: c.at, facts: [] };
    if (!c.w.people[a.personId]) c.w.people[a.personId] = { id: a.personId, name: a.name, role: "athlete", title: `Athlete, ${a.age} · ${a.sport.toLowerCase()}`, athleteId: a.personId, perms: [], group: "Seeking funding", journeys: "", tasks: [], persona: true };
    audit(c, "Registered as an adult athlete (simulated email code)", a.name);
  },

  /** A club, academy, federation or programme operator registers itself (docs/02 §3.2); verification is simulated. */
  registerOrganisation(c: Ctx, a: { personId: string; name: string; orgId: string; orgName: string; type: string; sport: string; region: string }) {
    need(a.personId && !c.w.people[a.personId] && !c.w.orgs[a.orgId], "This account already exists.");
    need(a.name?.trim() && a.orgName?.trim().length > 2, "Add your name and the organisation's name.");
    need(SPORT_WORDS.some((x) => `${a.sport} ${a.type}`.toLowerCase().includes(x)), "Revivo Impact is for sport. Name the sport your organisation runs.");
    c.w.orgs[a.orgId] = { id: a.orgId, name: a.orgName.trim(), type: a.type, region: a.region, sport: a.sport, verified: false };
    c.w.people[a.personId] = { id: a.personId, name: a.name.trim(), role: "organisation", title: `${a.type} · ${a.orgName.trim()}`, orgId: a.orgId, perms: ["Admin", "Approve", "Finance"], group: "Seeking funding", journeys: "", tasks: [], persona: true };
    audit(c, "Registered an organisation; verification requested (simulated)", a.orgName.trim());
  },

  /** A parent or guardian registers and adds a young athlete they represent (docs/02 §7). */
  registerGuardian(c: Ctx, a: { personId: string; name: string; childId: string; childName: string; age: number; sport: string; region: string; gender: "woman" | "man" }) {
    need(a.personId && !c.w.people[a.personId] && !c.w.athletes[a.childId], "This account already exists.");
    need(a.name?.trim() && a.childName?.trim(), "Add your name and the athlete's name.");
    need(Number.isInteger(a.age) && a.age >= 8 && a.age < 18, "A guardian registers athletes aged 8 to 17. Athletes 18 or over register themselves.");
    need(SPORT_WORDS.some((x) => a.sport.toLowerCase().includes(x)) || SPORTS_LIST.includes(a.sport), "Revivo Impact is for sport. Choose the athlete's sport.");
    c.w.athletes[a.childId] = { id: a.childId, name: a.childName.trim(), age: a.age, minor: true, gender: a.gender, guardianId: a.personId, sport: a.sport, discipline: a.sport, level: "Not yet added", levelRank: 1, region: a.region, discoverable: false, currentSupport: [], tags: [a.sport.toLowerCase(), a.region], createdAt: c.at, facts: [] };
    c.w.people[a.personId] = { id: a.personId, name: a.name.trim(), role: "guardian", title: `Guardian of ${a.childName.trim().split(" ")[0]} (${a.age})`, perms: [], group: "Seeking funding", journeys: "", tasks: [], persona: true };
    audit(c, "Registered as a guardian and added a young athlete (never discoverable)", "Athlete under 18");
  },

  /** Build a profile one fact at a time: every fact starts self-reported, with the owner choosing who sees it. */
  addFact(c: Ctx, a: { athleteId: string; factId: string; label: string; value: string; kind: Fact["kind"]; visibility: Visibility }) {
    const ath = c.w.athletes[a.athleteId] ?? fail("That athlete does not exist.");
    need(c.actor === ath.id || ath.guardianId === c.actor, "Only the athlete or their guardian edits this profile.");
    need(!(ath.minor && a.visibility === "discoverable"), "Athletes under 18 are never discoverable.");
    need(!ath.facts.some((f) => f.id === a.factId), "That record already exists. Nothing was changed.");
    need(a.value?.trim().length > 1, "Add the detail.");
    ath.facts.push({ id: a.factId, label: a.label, value: a.value.trim(), kind: a.kind, state: "self", visibility: a.visibility });
    if (a.kind === "club") ath.club = a.value.trim();
    if (a.kind === "result" && ath.level === "Not yet added") ath.level = "Competing";
    audit(c, `Added to profile: ${a.label.toLowerCase()} (self-reported)`, ath.minor ? "Athlete under 18" : ath.name);
  },

  registerFunder(c: Ctx, a: { personId: string; name: string; orgName: string; type: "Company" | "Individual sponsor"; sports: string }) {
    const fid = `f-${a.personId}`;
    need(a.personId && !c.w.people[a.personId] && !c.w.funders[fid], "This account already exists.");
    c.w.funders[fid] = { id: fid, name: a.type === "Individual sponsor" ? a.name : a.orgName, type: a.type, sports: a.sports, regions: "Any region", typesLabel: ["Development grant"], typical: "Up to $2,000", accepts: "yes", acceptsNote: "Accepts direct requests (set up on joining)", acceptsMax: 2000, acceptsSupport: ["Equipment", "Travel", "Coaching"], objective: "New participating funder.", verified: false, relevant: ["any"] };
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
    need(app.status === "info" && app.info?.status === "open", "There is no open question on this application.");
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
    need(a.tier <= app.requested, `The award level cannot be more than the ${fmt(app.requested)} requested.`);
    need(fund.tiers ? fund.tiers.some((t) => t.amount === a.tier) : a.tier <= fund.max, `Choose one of the published award levels: ${fund.tiers?.map((t) => fmt(t.amount)).join(", ")}.`);
    const need2 = fund.policy === "Institutional" ? 2 : 1;
    need(app.scores.length >= need2, `This fund needs ${need2} reviewers' scores before shortlisting.`);
    app.status = "shortlisted";
    app.recommendedTier = a.tier;
    audit(c, `Shortlisted at the ${fmt(a.tier)} award level`, c.w.athletes[app.applicantId]?.name ?? a.appId);
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
    const heldAlready = Object.values(c.w.offers).filter((y) => y.fundId === fund.id && ["held", "safeguarding", "second-approval"].includes(y.status)).length;
    need(!fund.awards || offerable.length + t.count + heldAlready <= fund.awards, `This fund publishes at most ${fund.awards} awards.`);
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

  /** One applicant at a time (docs/02 §9): the same rules as sending all decisions, with a personal message. */
  decideApplication(c: Ctx, a: { appId: string; decision: "offer" | "waiting" | "notselected"; note: string }) {
    const x = c.w.applications[a.appId] ?? fail("That application does not exist.");
    const o = c.w.opps[x.oppId];
    const fund = c.w.funds[o.fundId];
    need(isApprover(c.w, c.actor, fund.funderId), "Only someone with Approve decides.");
    need(o.status !== "decided", "Decisions for this opportunity have already been sent.");
    need(!x.scores.some((s) => s.by === c.actor), "You scored this application. A different person must decide it.");
    need(["submitted", "info", "shortlisted"].includes(x.status), "This application already has a decision.");
    need(a.note?.trim().length > 10, "Write a short, respectful message to the applicant.");
    if (a.decision === "offer") {
      need(x.status === "shortlisted" && x.recommendedTier, "Only a shortlisted application with a recommended amount can be offered.");
      need(!x.pendingFact, "One fact still needs checking. Put it on the waiting list instead.");
      const t = fundTotals(c.w, fund.id);
      need(x.recommendedTier! <= t.available, `This would exceed the money available by ${fmt(x.recommendedTier! - t.available)}.`);
      need(!fund.awards || t.count + Object.values(c.w.offers).filter((y) => y.fundId === fund.id && y.status === "held").length < fund.awards, `This fund publishes at most ${fund.awards} awards.`);
      const oid = `of-${x.id}`;
      fresh(c.w.offers, oid);
      const req = x.linked ? c.w.requests[x.linked.requestId] : undefined;
      c.w.offers[oid] = { id: oid, fundId: fund.id, by: c.actor, recipientKind: "athlete", recipientId: x.applicantId, applicationId: x.id, requestId: req?.id, lineId: req ? req.lines[req.lines.length - 1].id : undefined, amount: x.recommendedTier!, reason: a.note.trim(), status: "held", at: c.at, light: x.light };
      x.status = "offered";
    } else x.status = a.decision;
    x.decisionNote = a.note.trim();
    audit(c, a.decision === "offer" ? `Offered ${fmt(x.recommendedTier!)} with a personal message` : a.decision === "waiting" ? "Placed on the waiting list, with a message" : "Not selected this time, with a message", c.w.athletes[x.applicantId]?.minor ? "Athlete under 18" : c.w.athletes[x.applicantId]?.name ?? o.title);
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
    } else {
      const org = c.w.orgs[a.ownerId] ?? fail("That organisation does not exist.");
      const p = c.w.people[c.actor];
      need(p?.orgId === org.id && p.perms.some((x) => x === "Admin" || x === "Approve"), "Only someone with Admin or Approve at the organisation publishes its requests.");
      region = org.region;
    }
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
    need(c.w.funders[p!.funderId!].verified, "Your organisation is waiting for verification (simulated). Interest opens once the platform has checked you.");
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
    need(funder.verified, "Your organisation is waiting for verification (simulated). You can explore now; offers open once the platform has checked you.");
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
    audit(c, "Safeguarding check passed; offer sent to the guardian", offerRecord(c.w, o));
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
    (o.deliverables ?? []).forEach((label, k) => {
      const did = `${a.agreementId}-d${k + 1}`;
      const n = /(\d+) meets?/.exec(label);
      c.w.deliverables[did] = { id: did, agreementId: a.agreementId, label, due: /by (.+)$/.exec(label)?.[1] ?? "During the agreement", target: n ? Number(n[1]) : 1, done: 0, pending: 0, status: "scheduled" };
    });
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
    need(p?.funderId === fund.funderId && p.perms.includes("Finance"), "Only someone with Finance at this funder records payments.");
    live(ag);
    notStopped(c.w, ag);
    if (fund.policy === "Institutional") {
      const o = c.w.offers[ag.offerId ?? ""];
      need(o?.by !== c.actor && o?.approvedBy !== c.actor && ag.approvedBy !== c.actor, "Under this fund's rules, the person who approved it cannot also record its payment. Ask your finance colleague.");
    }
    positive(a.amount, "A payment");
    need(!c.w.ledger.some((l) => l.id === a.entryId), "That record already exists. Nothing was changed.");
    need(!c.w.ledger.some((l) => l.agreementId === ag.id && l.ref === a.ref), `Payment ${a.ref} is already recorded.`);
    need(released(c.w, ag.id) + a.amount <= ag.amount, "You can't pay more than was committed.");
    c.w.ledger.push({ id: a.entryId, agreementId: ag.id, kind: "release", amount: a.amount, by: c.actor, at: c.at, ref: a.ref });
    audit(c, `Recorded a payment of ${fmt(a.amount)} (simulated)${fund.policy === "Simple" && c.w.offers[ag.offerId ?? ""]?.by === c.actor ? " · single-person approval" : ""}`, fund.name);
  },

  confirmReceipt(c: Ctx, a: { agreementId: string; entryId: string }) {
    const ag = c.w.agreements[a.agreementId];
    const ath = ag.recipientKind === "athlete" ? c.w.athletes[ag.recipientId] : null;
    need(ath ? (ath.minor ? ath.guardianId === c.actor : ath.id === c.actor) : staffCan(c.w, c.actor, ag.recipientId, "Admin", "Approve", "Finance"), "Only the person who received the money (or their guardian, or the organisation's finance lead) confirms it arrived.");
    need(!c.w.ledger.some((l) => l.id === a.entryId), "That record already exists. Nothing was changed.");
    live(ag);
    // One confirmation per recorded payment (I9); money carried in from before is never "received" here.
    const releases = c.w.ledger.filter((l) => l.agreementId === ag.id && l.kind === "release");
    let left = received(c.w, ag.id);
    const next = releases.find((l) => (left -= l.amount) < 0);
    need(next, "There is no payment to confirm yet.");
    const unconfirmed = -left;
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

  /* ================================================ P3: track and review */

  addExpense(c: Ctx, a: { expenseId: string; agreementId: string; what: string; amount: number; paidOn: string; receipt: boolean; category?: string }) {
    const g = c.w.agreements[a.agreementId] ?? fail("That funding agreement does not exist.");
    need(mayUpdate(c.w, c.actor, g), "Only the athlete, their guardian, an authorised coach or the organisation that received the money can add spending.");
    fresh(c.w.expenses, a.expenseId);
    positive(a.amount);
    need(a.what?.trim().length >= 3, "Say what the money was spent on.");
    sportingCheck(a.what);
    live(g);
    need(!Object.values(c.w.expenses).some((e) => e.agreementId === g.id && e.what.toLowerCase() === a.what.trim().toLowerCase() && e.amount === a.amount && e.paidOn === a.paidOn), "This expense is already recorded (same item, amount and date).");
    const t = agreementTotals(c.w, g.id);
    need(t.spent + a.amount <= t.paid, `Only ${fmt(t.paid - t.spent)} of the money paid is not yet accounted for. Spending can't be more than was paid.`);
    c.w.expenses[a.expenseId] = { id: a.expenseId, agreementId: g.id, what: a.what.trim(), amount: a.amount, paidOn: a.paidOn, receipt: a.receipt, category: a.category, by: c.actor, at: c.at, status: "reported" };
    audit(c, `Added spending ${fmt(a.amount)}: ${a.what.trim()}${a.receipt ? " (receipt uploaded)" : " (no receipt yet)"}`, c.w.funds[g.fundId].name);
  },

  addReceipt(c: Ctx, a: { expenseId: string }) {
    const e = c.w.expenses[a.expenseId] ?? fail("That expense does not exist.");
    need(mayUpdate(c.w, c.actor, c.w.agreements[e.agreementId]), "Only the person who received the money adds the receipt.");
    need(!e.receipt, "This expense already has a receipt.");
    e.receipt = true;
    if (e.status === "query") e.status = "reported";
    audit(c, "Uploaded a receipt (simulated)", e.what);
  },

  checkExpense(c: Ctx, a: { expenseId: string }) {
    const e = c.w.expenses[a.expenseId] ?? fail("That expense does not exist.");
    const g = c.w.agreements[e.agreementId];
    const fid = c.w.funds[g.fundId].funderId;
    need(memberOf(c.w, c.actor, fid, "Finance") || memberOf(c.w, c.actor, fid, "Verify"), "Only someone at the funder with Finance or Verify checks spending.");
    need(e.by !== c.actor, "You added this expense. Someone else must check it.");
    need(e.status === "reported" || e.status === "query", e.status === "checked" ? "This expense is already checked." : "Money carried in from before is shown as reported, never checked.");
    need(e.receipt, "There is no receipt yet. Ask for it instead of checking.");
    e.status = "checked";
    e.checkedBy = c.actor;
    audit(c, `Checked spending ${fmt(e.amount)} against its receipt`, e.what);
  },

  queryExpense(c: Ctx, a: { expenseId: string; reason: string }) {
    const e = c.w.expenses[a.expenseId] ?? fail("That expense does not exist.");
    const fid = c.w.funds[c.w.agreements[e.agreementId].fundId].funderId;
    need(memberOf(c.w, c.actor, fid, "Finance") || memberOf(c.w, c.actor, fid, "Verify"), "Only someone at the funder with Finance or Verify asks about spending.");
    need(e.status === "reported", "Only spending waiting to be checked can be asked about.");
    need(a.reason?.trim().length > 3, "Say what you need, for example “Please add the receipt”.");
    e.status = "query";
    e.query = a.reason.trim();
    audit(c, `Asked about spending: ${a.reason.trim()}`, e.what);
  },

  sendProgress(c: Ctx, a: { progressId: string; agreementId?: string; athleteId?: string; orgId?: string; kind: Progress["kind"]; text: string; proof: boolean; photo?: boolean }) {
    fresh(c.w.progress, a.progressId);
    need(a.text?.trim().length >= 3, "Say what happened, in a sentence.");
    need(a.athleteId || a.orgId, "Say who the update is about.");
    if (a.agreementId) {
      const g = c.w.agreements[a.agreementId] ?? fail("That funding agreement does not exist.");
      need(a.athleteId ? g.recipientKind === "athlete" && g.recipientId === a.athleteId : g.recipientKind === "org" && g.recipientId === a.orgId, "An update goes on the funding record of the athlete or organisation it is about.");
      live(g);
    }
    if (a.athleteId) {
      const ath = c.w.athletes[a.athleteId] ?? fail("That athlete does not exist.");
      const coach = c.w.authorisations.some((z) => z.athleteId === ath.id && z.coachId === c.actor && z.powers.includes("updates"));
      need(c.actor === ath.id || ath.guardianId === c.actor || coach, "Only the athlete, their guardian or a coach allowed to send updates can do this.");
      if (a.photo) need(c.w.consents.some((z) => z.athleteId === ath.id && z.purpose === "photos" && z.value), "Photos need consent first. The athlete (or guardian) can turn on “Photos and stories”.");
      need(!progressPaused(c.w, ath.id), `Progress sharing is paused for ${ath.name.split(" ")[0]}. ${ath.minor ? "The guardian" : "The athlete"} can turn it back on in Consent & safety.`);
      if (ath.minor) {
        // Funders see a minor's first name only: no surname or club in update text.
        const words = [...ath.name.split(" ").slice(1), ...(ath.club ? [ath.club] : [])].filter((x) => x.length > 2).map((x) => x.toLowerCase());
        need(!words.some((x) => a.text.toLowerCase().includes(x)), "Leave out the surname and club: funders see a young athlete's first name only.");
      }
    } else need(a.orgId && c.w.people[c.actor]?.orgId === a.orgId, "Only the organisation can send its update.");
    c.w.progress[a.progressId] = { id: a.progressId, agreementId: a.agreementId, athleteId: a.athleteId, orgId: a.orgId, kind: a.kind, text: a.text.trim(), proof: a.proof, photo: a.photo, by: c.actor, at: c.at };
    audit(c, `Sent a ${a.kind === "result" ? "result" : a.kind === "training" ? "training" : "progress"} update${a.photo ? " with a photo (consent on)" : ""}`, a.athleteId ? (c.w.athletes[a.athleteId].minor ? "Athlete under 18" : c.w.athletes[a.athleteId].name) : c.w.orgs[a.orgId!]?.name ?? "");
  },

  attestProgress(c: Ctx, a: { progressId: string }) {
    const pr = c.w.progress[a.progressId] ?? fail("That update does not exist.");
    const p = c.w.people[c.actor];
    const ath = pr.athleteId ? c.w.athletes[pr.athleteId] : undefined;
    need(p?.role === "coach" && ath && (p.orgId && c.w.orgs[p.orgId]?.name === ath.club), "Only the athlete's own coach can confirm training.");
    need(pr.by !== c.actor, "You sent this update. Someone else must confirm it.");
    pr.attestedBy = c.actor;
    audit(c, "Confirmed training attendance (coach)", ath!.name);
  },

  submitDeliverable(c: Ctx, a: { deliverableId: string; evidence: string }) {
    const d = c.w.deliverables[a.deliverableId] ?? fail("That deliverable does not exist.");
    const g = c.w.agreements[d.agreementId];
    need(c.actor === g.recipientId, "Only the sponsored athlete sends proof of a deliverable.");
    need(d.done + d.pending < d.target, "Everything for this deliverable has already been sent.");
    need(a.evidence?.trim().length > 3, "Say what the proof shows, for example “Kit worn at the Southern Open, photo attached”.");
    d.pending += 1;
    d.status = "in-progress";
    audit(c, `Sent proof: ${a.evidence.trim()}`, d.label);
  },

  acceptDeliverable(c: Ctx, a: { deliverableId: string }) {
    const d = c.w.deliverables[a.deliverableId] ?? fail("That deliverable does not exist.");
    const fid = c.w.funds[c.w.agreements[d.agreementId].fundId].funderId;
    need(memberOf(c.w, c.actor, fid, "Approve") || memberOf(c.w, c.actor, fid, "Review"), "Only the sponsor accepts deliverables.");
    need(d.pending > 0, "There is no proof waiting to be accepted.");
    d.pending -= 1;
    d.done += 1;
    d.status = d.done >= d.target ? "complete" : "in-progress";
    audit(c, `Accepted proof (${d.done} of ${d.target})`, d.label);
  },

  recordReview(c: Ctx, a: { reviewId: string; agreementId: string; decision: ReviewDecision["decision"]; conditions?: string }) {
    const g = c.w.agreements[a.agreementId] ?? fail("That funding agreement does not exist.");
    const fid = c.w.funds[g.fundId].funderId;
    need(memberOf(c.w, c.actor, fid, "Review") || memberOf(c.w, c.actor, fid, "Approve"), "Only someone at the funder with Review or Approve records a review.");
    fresh(c.w.reviews, a.reviewId);
    need(["Continue", "Continue with conditions", "Pause", "Close"].includes(a.decision), "Choose Continue, Continue with conditions, Pause or Close.");
    need(a.decision.startsWith("Continue") || memberOf(c.w, c.actor, fid, "Approve"), "Pausing or closing funding needs someone with Approve.");
    need(a.decision === "Continue" || a.conditions?.trim(), a.decision === "Continue with conditions" ? "Write the conditions." : "Give the reason.");
    c.w.reviews[a.reviewId] = { id: a.reviewId, agreementId: g.id, decision: a.decision, conditions: a.conditions?.trim(), by: c.actor, at: c.at };
    audit(c, `Review: ${a.decision}${a.conditions ? `: ${a.conditions.trim()}` : ""}`, c.w.funds[g.fundId].name);
  },

  recordSession(c: Ctx, a: { sessionId: string; programmeId: string; siteId: string; slot: number; status: "delivered" | "missed"; attendance?: number; reason?: Session["reason"]; note?: string }) {
    const p = c.w.programmes[a.programmeId] ?? fail("That programme does not exist.");
    const person = c.w.people[c.actor];
    need(person?.orgId === p.orgId, "Only the programme's own coaches and staff record sessions.");
    const site = p.sites.find((x) => x.id === a.siteId) ?? fail("That site is not part of this programme.");
    need(siteOf(c.w, c.actor, site.id), "You record sessions only at the sites you coach.");
    need(a.status === "delivered" || a.status === "missed", "Say whether the session ran.");
    if (a.status === "missed") need(["weather", "coach availability", "venue unavailable", "other"].includes(a.reason ?? ""), "Choose why it couldn't run.");
    need(Number.isInteger(a.slot) && a.slot >= 0 && a.slot <= LAST_SLOT[c.at], "You can record only sessions that have already happened.");
    need(!Object.values(c.w.sessions).some((x) => x.siteId === a.siteId && x.slot === a.slot && x.programmeId === p.id), "This session has already been recorded.");
    fresh(c.w.sessions, a.sessionId);
    if (a.status === "delivered") need(Number.isInteger(a.attendance) && a.attendance! > 0 && a.attendance! <= site.participants, `Enter how many came (1 to ${site.participants}).`);
    else need(a.reason, "Choose why it couldn't run.");
    c.w.sessions[a.sessionId] = { id: a.sessionId, programmeId: p.id, siteId: site.id, slot: a.slot, date: sessionDate(a.slot), status: a.status, attendance: a.status === "delivered" ? a.attendance : undefined, reason: a.status === "missed" ? a.reason : undefined, note: a.note?.trim() || undefined, by: c.actor, at: c.at, checked: false };
    audit(c, a.status === "delivered" ? `Recorded a session: ${a.attendance} came` : `Recorded a session that couldn't run (${a.reason})`, `${site.name} · ${sessionDate(a.slot)}`);
  },

  checkSession(c: Ctx, a: { sessionId: string }) {
    const x = c.w.sessions[a.sessionId] ?? fail("That session does not exist.");
    const p = c.w.programmes[x.programmeId];
    need(staffCan(c.w, c.actor, p.orgId, "Verify") && siteOf(c.w, c.actor, x.siteId), "Only the site's coordinator (with Verify) checks its sessions.");
    need(x.by !== c.actor, "You recorded this session. Someone else must check it.");
    need(x.status === "delivered" && !x.checked, "This session does not need checking.");
    x.checked = true;
    audit(c, "Checked a session against the register", `${p.sites.find((s) => s.id === x.siteId)!.name} · ${x.date}`);
  },

  assignAction(c: Ctx, a: { actionId: string; programmeId: string; siteId: string; text: string; assignedTo: string }) {
    const p = c.w.programmes[a.programmeId] ?? fail("That programme does not exist.");
    need(c.w.people[c.actor]?.orgId === p.orgId && c.w.people[c.actor].perms.some((x) => x === "Admin" || x === "Approve"), "Only the programme director assigns actions.");
    need(c.w.people[a.assignedTo]?.orgId === p.orgId, "Assign it to someone at your organisation.");
    fresh(c.w.actions, a.actionId);
    need(a.text?.trim().length > 3, "Say what needs doing.");
    c.w.actions[a.actionId] = { id: a.actionId, programmeId: p.id, siteId: a.siteId, text: a.text.trim(), assignedTo: a.assignedTo, by: c.actor, at: c.at, status: "open" };
    audit(c, `Assigned an action to ${c.w.people[a.assignedTo].name}: ${a.text.trim()}`, p.name);
  },

  submitRecoveryPlan(c: Ctx, a: { planId: string; programmeId: string; siteId: string; text: string }) {
    const p = c.w.programmes[a.programmeId] ?? fail("That programme does not exist.");
    need(staffCan(c.w, c.actor, p.orgId, "Admin", "Approve", "Verify"), "Only the programme director or the site coordinator writes a recovery plan.");
    need(p.sites.some((x) => x.id === a.siteId), "That site is not part of this programme.");
    fresh(c.w.recoveryPlans, a.planId);
    need(a.text?.trim().length > 10, "Say how the missed sessions will be made up.");
    c.w.recoveryPlans[a.planId] = { id: a.planId, programmeId: p.id, siteId: a.siteId, text: a.text.trim(), by: c.actor, at: c.at, status: "submitted" };
    Object.values(c.w.actions).filter((x) => x.programmeId === p.id && x.siteId === a.siteId && x.assignedTo === c.actor).forEach((x) => (x.status = "done"));
    audit(c, "Sent a recovery plan for approval", `${p.sites.find((s) => s.id === a.siteId)?.name}`);
  },

  decideRecoveryPlan(c: Ctx, a: { planId: string; approve: boolean; reason?: string }) {
    const r = c.w.recoveryPlans[a.planId] ?? fail("That plan does not exist.");
    const p = c.w.programmes[r.programmeId];
    need(c.w.people[c.actor]?.orgId === p.orgId && c.w.people[c.actor].perms.includes("Approve"), "Only someone with Approve at the organisation decides.");
    need(r.by !== c.actor, "You wrote this plan. Someone else must approve it.");
    need(r.status === "submitted", "This plan has already been decided.");
    need(a.approve || a.reason?.trim(), "Returning a plan needs a reason.");
    r.status = a.approve ? "approved" : "returned";
    r.decidedBy = c.actor;
    r.reason = a.reason?.trim();
    audit(c, a.approve ? "Approved a recovery plan (four-eyes)" : `Returned a recovery plan: ${a.reason}`, p.sites.find((s) => s.id === r.siteId)!.name);
  },

  draftReport(c: Ctx, a: { reportId: string; agreementId: string; period: string }) {
    const g = c.w.agreements[a.agreementId] ?? fail("That funding agreement does not exist.");
    need(g.recipientKind === "org" && staffCan(c.w, c.actor, g.recipientId, "Admin", "Approve"), "Only the organisation's director (Admin or Approve) writes its report.");
    live(g);
    fresh(c.w.reports, a.reportId);
    c.w.reports[a.reportId] = { id: a.reportId, agreementId: g.id, period: a.period, text: draftReportText(c.w, g.id), by: c.actor, at: c.at, status: "draft" };
    audit(c, "Drafted a report from the records (Simulated AI)", a.period);
  },

  submitReport(c: Ctx, a: { reportId: string; text: string }) {
    const r = c.w.reports[a.reportId] ?? fail("That report does not exist.");
    need(staffCan(c.w, c.actor, c.w.agreements[r.agreementId].recipientId, "Admin", "Approve"), "Only the organisation's director (Admin or Approve) sends its report.");
    need(r.status === "draft" || r.status === "returned", "This report has already been sent.");
    need(!a.text.includes("[What participants"), "Replace the gap marked in square brackets with your own words, or delete it.");
    const flags = claimsCheck(a.text, c.w, r.agreementId);
    need(!flags.length, `“${flags[0]}” claims more than your records show. Say what was measured instead, for example what participants said in the survey.`);
    r.text = a.text;
    r.status = "submitted";
    audit(c, "Sent a report to the funder (claims check passed)", r.period);
  },

  decideReport(c: Ctx, a: { reportId: string; accept: boolean; reason?: string }) {
    const r = c.w.reports[a.reportId] ?? fail("That report does not exist.");
    const fid = c.w.funds[c.w.agreements[r.agreementId].fundId].funderId;
    need(memberOf(c.w, c.actor, fid, "Review") || memberOf(c.w, c.actor, fid, "Approve"), "Only the funder accepts or returns a report.");
    need(r.status === "submitted", "This report is not waiting for a decision.");
    need(a.accept || a.reason?.trim(), "Returning a report needs a reason.");
    r.status = a.accept ? "accepted" : "returned";
    r.decidedBy = c.actor;
    r.reason = a.reason?.trim();
    audit(c, a.accept ? "Accepted a report" : `Returned a report: ${a.reason}`, r.period);
  },

  addExistingFunding(c: Ctx, a: { agreementId: string; fundId: string; orgId: string; amount: number; purpose: string; paid: number; spent: number; nextUpdate: string }) {
    const fund = c.w.funds[a.fundId] ?? fail("That fund does not exist.");
    need(memberOf(c.w, c.actor, fund.funderId, "Review") || memberOf(c.w, c.actor, fund.funderId, "Approve"), "Only someone at this funder with Review or Approve adds its existing funding.");
    need(c.w.orgs[a.orgId], "Choose a registered organisation (otherwise an invitation would be sent).");
    fresh(c.w.agreements, a.agreementId);
    positive(a.amount);
    need(Number.isInteger(a.paid) && a.paid >= 0 && a.paid <= a.amount, "Already paid must be between $0 and the agreed amount.");
    need(Number.isInteger(a.spent) && a.spent >= 0 && a.spent <= a.paid, "Already spent can't be more than already paid.");
    need(a.purpose?.trim().length > 3, "Say what the funding is for.");
    sportingCheck(a.purpose);
    need(a.amount <= fundTotals(c.w, fund.id).available, `This fund has ${fmt(fundTotals(c.w, fund.id).available)} available.`);
    c.w.agreements[a.agreementId] = { id: a.agreementId, fundId: fund.id, recipientKind: "org", recipientId: a.orgId, amount: a.amount, acceptedBy: a.orgId, acceptedAt: c.at, origin: "Existing agreement", status: "awaiting-approval", preparedBy: c.actor, purpose: a.purpose.trim(), nextUpdate: a.nextUpdate };
    c.w.carriedIn ??= {};
    c.w.carriedIn[a.agreementId] = { paid: a.paid, spent: a.spent };
    audit(c, `Prepared existing funding of ${fmt(a.amount)} (paid before: ${fmt(a.paid)}; spent before: ${fmt(a.spent)})`, c.w.orgs[a.orgId].name);
  },

  approveExistingFunding(c: Ctx, a: { agreementId: string }) {
    const g = c.w.agreements[a.agreementId] ?? fail("That funding agreement does not exist.");
    const fid = c.w.funds[g.fundId].funderId;
    need(isApprover(c.w, c.actor, fid), "Only someone with Approve at the funder approves the commitment.");
    need(g.status === "awaiting-approval", "This is not waiting for approval.");
    need(g.preparedBy !== c.actor, "You prepared this. A different person must approve it.");
    need(g.amount <= fundTotals(c.w, g.fundId).available, "The fund no longer has this much available.");
    g.status = "awaiting-recipient";
    g.approvedBy = c.actor;
    const ci = c.w.carriedIn?.[g.id] ?? { paid: 0, spent: 0 };
    if (ci.paid) c.w.ledger.push({ id: `${g.id}-ci`, agreementId: g.id, kind: "carried-in", amount: ci.paid, by: c.actor, at: c.at, ref: "Paid before joining Revivo Impact" });
    if (ci.spent) c.w.expenses[`${g.id}-ci`] = { id: `${g.id}-ci`, agreementId: g.id, what: "Spending reported before joining Revivo Impact", amount: ci.spent, paidOn: "Before 30 Jun", receipt: false, by: c.actor, at: c.at, status: "carried-in" };
    audit(c, `Approved the commitment of ${fmt(g.amount)} (four-eyes); carried-in figures wait for the recipient`, c.w.orgs[g.recipientId].name);
  },

  confirmExistingFunding(c: Ctx, a: { agreementId: string; agree: boolean; reason?: string }) {
    const g = c.w.agreements[a.agreementId] ?? fail("That funding agreement does not exist.");
    const p = c.w.people[c.actor];
    need(p?.orgId === g.recipientId && p.perms.some((x) => x === "Approve" || x === "Admin"), "Only someone with Approve or Admin at the receiving organisation confirms.");
    need(g.status === "awaiting-recipient", "This is not waiting for your confirmation.");
    need(a.agree || a.reason?.trim(), "Say which figure is wrong and why.");
    g.status = a.agree ? "active" : "disputed";
    g.disputeReason = a.reason?.trim();
    audit(c, a.agree ? "Confirmed the agreement and the figures carried in" : `Disputed the figures carried in: ${a.reason}`, c.w.funds[g.fundId].name);
  },

  saveOpportunity(c: Ctx, a: { oppId: string }) {
    need(c.w.opps[a.oppId], "That opportunity does not exist.");
    const list = (c.w.saved[c.actor] ??= []);
    const i = list.indexOf(a.oppId);
    if (i >= 0) list.splice(i, 1);
    else list.push(a.oppId);
    audit(c, i >= 0 ? "Removed a saved opportunity" : "Saved an opportunity for later", c.w.opps[a.oppId].title);
  },

  /* ---- seeded world activity between demo moments (actor "system") ---- */
  arrivals(c: Ctx, a: { to: Moment }) {
    seedArrivals(c.w, a.to);
    audit(c, a.to === "may06" ? "Applications, scores and decisions that happened between 12 Apr and 6 May" : "Acceptances, payments and decisions that happened between 6 May and 30 Jun", "Other activity in the fictional world");
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
    // Play Every Day: sessions up to Tue 4 May, plus Thu 6 May at the sites Sam does not cover (he records his in Journey C).
    if (w.programmes["play-every-day"]) seedSessions(w, 2, 9, (site, slot) => slot === 9 && (site === "greenpark" || site === "westbrook"));
    w.kitDeliveries.push({ at: "may06", items: 12 });
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
    // Play Every Day, weeks 6–10: sessions, checks (4 still to check at Westbrook and Northgate) and quarter spending.
    if (w.programmes["play-every-day"]) {
      seedSessions(w, 10, 19);
      for (const x of Object.values(w.sessions)) if (x.status === "delivered") x.checked = !((x.siteId === "westbrook" || x.siteId === "northgate") && x.slot >= 18);
      const spend: [string, string, number][] = [["Coaching", "Coaches' session fees (108 sessions × $60)", 6480], ["Equipment", "Balls, bibs and cones", 1200], ["Venue and transport", "Hall hire and minibus", 1068], ["Monitoring", "Participant survey and registers", 1020]];
      spend.forEach(([cat, what, amount], k) => (w.expenses[`ex-pe-${k + 1}`] = { id: `ex-pe-${k + 1}`, agreementId: "ag-pe1", what, amount, paidOn: "Apr–Jun", receipt: true, category: cat, by: "maya", at: "jun30", status: "checked", checkedBy: "priya" }));
    }
    w.kitDeliveries.push({ at: "jun30", items: 12 });
  }
}

/* ------------------------------------------------------- derived helpers */

export function linesSummary(lines: RequestLine[]) {
  return lines.map((l) => `${l.label} ${fmt(l.amount)}`).join(" + ");
}
export const agreementsFor = (w: World, kind: "athlete" | "org", rid: string): Agreement[] => Object.values(w.agreements).filter((a) => a.recipientKind === kind && a.recipientId === rid);
export const offersFor = (w: World, kind: "athlete" | "org", rid: string): Offer[] => Object.values(w.offers).filter((o) => o.recipientKind === kind && o.recipientId === rid);
export const typeOf = (w: World, fundId: string) => w.funds[fundId].type;
