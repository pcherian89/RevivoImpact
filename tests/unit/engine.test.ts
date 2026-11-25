import { describe, expect, it } from "vitest";
import { baseWorld } from "../../src/domain/model";
import { apply, fundTotals, platformTotals, requestTotals, RuleError, type Event } from "../../src/domain/engine";
import { checkpoint, JOURNEYS, stepEvents } from "../../src/domain/story";

const replay = (evs: Event[]) => {
  const w = baseWorld();
  for (const e of evs) apply(w, e);
  return w;
};
const at = (m: "apr12" | "may06" | "jun30") => replay(checkpoint(m));
const tryCmd = (w: ReturnType<typeof baseWorld>, e: Omit<Event, "n">) => {
  try {
    apply(w, { n: 0, ...e });
    return null;
  } catch (err) {
    if (err instanceof RuleError) return err.message;
    throw err;
  }
};

describe("reconciled figures (docs/05 §9.4)", () => {
  it("12 Apr: development 11,900 committed and released; commercial 8,000/4,000; programme 145,000/29,000", () => {
    const t = platformTotals(at("apr12"));
    expect(t.development).toEqual({ committed: 11900, released: 11900 });
    expect(t.commercial).toEqual({ committed: 8000, released: 4000 });
    expect(t.programme).toEqual({ committed: 145000, released: 29000 });
  });
  it("6 May, after every 6 May step: development 23,600 / 21,350; commercial 14,000 / 7,000", () => {
    const evs = checkpoint("jun30").filter((e) => !(e.type === "arrivals" && e.args.to === "jun30"));
    const w = replay(evs);
    const t = platformTotals(w);
    expect(t.development).toEqual({ committed: 23600, released: 21350 });
    expect(t.commercial).toEqual({ committed: 14000, released: 7000 });
    const eas = fundTotals(w, "eas");
    expect(eas.committed).toBe(4500);
    expect(eas.held).toBe(210000);
    expect(eas.available).toBe(35500);
  });
  it("30 Jun (P2: Journey D not yet built): EAS 211,000 committed, 3,500 held, 105,500 released", () => {
    const w = at("jun30");
    const eas = fundTotals(w, "eas");
    expect(eas).toMatchObject({ committed: 211000, held: 3500, available: 35500, released: 105500 });
    expect(fundTotals(w, "wsdf")).toMatchObject({ committed: 38000, released: 19000, available: 2000 });
    expect(fundTotals(w, "oas")).toMatchObject({ committed: 11900, released: 11900, available: 8100 });
    expect(fundTotals(w, "has")).toMatchObject({ committed: 7200, available: 2800 });
    expect(fundTotals(w, "crsc-tb").committed).toBe(30800);
    expect(fundTotals(w, "verran-pe").committed).toBe(19000);
    expect(fundTotals(w, "ardent-hp").committed).toBe(10800);
    // docs/05 §9.3 includes Journey D's 24,000 (P3): 352,700 − 24,000
    expect(platformTotals(w).development.committed).toBe(328700);
  });
  it("143 EAS applications with 46 offers, 2 waiting, 81 not selected, 14 not considered", () => {
    const w = at("jun30");
    const apps = Object.values(w.applications).filter((a) => a.oppId === "eas");
    expect(apps.length).toBe(143);
    const by = (s: string[]) => apps.filter((a) => s.includes(a.status)).length;
    expect(by(["offered", "accepted"])).toBe(46);
    expect(by(["waiting"])).toBe(2);
    expect(by(["notselected"])).toBe(81);
    expect(by(["noteligible", "incomplete"])).toBe(14);
  });
  it("Nadia: 5,200 requested, 3,200 pledged and received, 2,000 still needed; Tiago 0 open (900 held)", () => {
    const w = at("jun30");
    expect(requestTotals(w, "rq-nadia")).toMatchObject({ requested: 5200, pledged: 3200, received: 3200, remaining: 2000 });
    expect(requestTotals(w, "rq-tiago")).toMatchObject({ requested: 2400, pledged: 1500, heldApp: 900, remaining: 0 });
    expect(requestTotals(w, "rq-highland")).toMatchObject({ pledged: 2500, remaining: 2500 });
  });
});

describe("rules", () => {
  const may = () => replay(checkpoint("may06"));
  it("four-eyes: the drafter cannot publish", () => {
    const w = baseWorld();
    w.people.daniel.perms.push("Approve");
    expect(tryCmd(w, { at: "apr12", actor: "daniel", type: "publishOpportunity", args: { oppId: "eas" } })).toMatch(/different person/);
  });
  it("cap (I4): an offer above what is still needed is blocked", () => {
    const w = may();
    for (const e of stepEvents(JOURNEYS[4].steps[2])) apply(w, e);
    expect(tryCmd(w, { at: "may06", actor: "kenji", type: "makeOffer", args: { offerId: "x", fundId: "oas", recipientKind: "athlete", recipientId: "tiago", requestId: "rq-tiago", lineId: "l1", amount: 2600, reason: "Competition travel to a verified qualification." } })).toMatch(/exceeds the \$2,400 still needed by \$200/);
  });
  it("delegated limit: above $2,000 goes to a second approver", () => {
    const w = may();
    for (const e of stepEvents(JOURNEYS[1].steps[0])) apply(w, e);
    apply(w, { n: 0, at: "may06", actor: "kenji", type: "makeOffer", args: { offerId: "y", fundId: "oas", recipientKind: "athlete", recipientId: "nadia", requestId: "rq-nadia", lineId: "l1", amount: 2500, reason: "Equipment for a verified para athlete." } });
    expect(w.offers.y.status).toBe("second-approval");
  });
  it("a coach can prepare but not submit or accept for a minor", () => {
    const w = may();
    apply(w, { n: 0, at: "may06", actor: "rosa", type: "authoriseCoach", args: { athleteId: "tiago", coachId: "jonas" } });
    apply(w, { n: 0, at: "may06", actor: "jonas", type: "saveApplication", args: { appId: "t", oppId: "ostral-ctg", athleteId: "tiago", requested: 900, statement: "x", otherFunding: "y" } });
    expect(tryCmd(w, { at: "may06", actor: "jonas", type: "submitApplication", args: { appId: "t" } })).toMatch(/coach can prepare, not submit/);
  });
  it("individual sponsor offers to a minor go to safeguarding review; commercial offers to minors are blocked", () => {
    const w = may();
    apply(w, { n: 0, at: "may06", actor: "marcus", type: "makeOffer", args: { offerId: "z", fundId: "has", recipientKind: "athlete", recipientId: "a-badminton", requestId: "rq-badminton", lineId: "l1", amount: 750, reason: "Coaching for a young player without a club." } });
    expect(w.offers.z.status).toBe("safeguarding");
    expect(tryCmd(w, { at: "may06", actor: "a-badminton", type: "acceptOffer", args: { offerId: "z", agreementId: "q" } })).toMatch(/safeguarding review/);
    expect(tryCmd(w, { at: "may06", actor: "lucy", type: "makeOffer", args: { offerId: "c", fundId: "cap", recipientKind: "athlete", recipientId: "tiago", amount: 1000, reason: "Commercial partnership offer." } })).toMatch(/Commercial sponsorship of athletes under 18/);
  });
  it("Institutional policy: the approver cannot record the release; Simple policy allows it", () => {
    const w = replay(checkpoint("jun30"));
    const ag = Object.values(w.agreements).find((a) => a.fundId === "eas" && a.id !== "ag-amira")!;
    expect(tryCmd(w, { at: "jun30", actor: "ingrid", type: "recordRelease", args: { agreementId: ag.id, amount: 10, ref: "x", entryId: "e" } })).toMatch(/Finance|approved the offer/);
  });
  it("identifiability: swimming 16–17 Coastal Region has at least 10 athletes", () => {
    const w = may();
    const n = Object.values(w.athletes).filter((a) => a.minor && a.sport === "Swimming" && a.age >= 16 && a.region === "Coastal Region").length;
    expect(n).toBeGreaterThanOrEqual(10);
  });
});

/* Regressions found by the P2 rules, money and safeguarding verification (docs/11 §4). */
describe("verifier regressions", () => {
  const may = () => replay(checkpoint("may06"));
  const mayAll = () => replay(checkpoint("jun30").filter((e) => !(e.type === "arrivals" && e.args.to === "jun30")));
  const offer = (w: ReturnType<typeof baseWorld>, actor: string, args: Record<string, unknown>) => tryCmd(w, { at: "may06", actor, type: "makeOffer", args: { offerId: `t-${Math.random()}`, reason: "A reason linked to the published criteria.", ...args } });

  it("a reviewer at one funder cannot score, shortlist or query another funder's application", () => {
    const w = may();
    expect(tryCmd(w, { at: "may06", actor: "kenji", type: "scoreApplication", args: { appId: "app-amira", total: 13 } })).toMatch(/funder this application was sent to/);
    expect(tryCmd(w, { at: "may06", actor: "kenji", type: "shortlist", args: { appId: "app-amira", tier: 4500 } })).toMatch(/funder this application was sent to/);
    expect(tryCmd(w, { at: "may06", actor: "kenji", type: "requestInfo", args: { appId: "app-amira", text: "?" } })).toMatch(/funder this application was sent to/);
    w.people.v = { ...w.people.kenji, id: "v", perms: ["Verify"] };
    expect(tryCmd(w, { at: "may06", actor: "v", type: "verifyFact", args: { athleteId: "amira", factId: "am-age", method: "ID document" } })).toMatch(/application made to your organisation/);
  });
  it("a tier cannot exceed the amount requested; decisions cannot be sent or changed twice", () => {
    const w = may();
    expect(tryCmd(w, { at: "may06", actor: "daniel", type: "shortlist", args: { appId: "app-amira", tier: 5000 } })).toMatch(/cannot be more than the \$4,800 requested/);
    const j = replay(checkpoint("jun30"));
    expect(tryCmd(j, { at: "jun30", actor: "daniel", type: "shortlist", args: { appId: "app-amira", tier: 4500 } })).toMatch(/already been sent/);
    expect(tryCmd(j, { at: "jun30", actor: "ingrid", type: "sendDecisions", args: { oppId: "eas" } })).toMatch(/already been sent/);
  });
  it("an offer from a decision keeps the link to the funding request, so the hold is not freed (no double funding)", () => {
    const w = mayAll();
    w.people.second = { ...w.people.farid, id: "second", perms: ["Approve"] };
    apply(w, { n: 0, at: "may06", actor: "farid", type: "scoreApplication", args: { appId: "app-tiago", total: 13 } });
    expect(tryCmd(w, { at: "may06", actor: "farid", type: "shortlist", args: { appId: "app-tiago", tier: 1500 } })).toMatch(/cannot be more than/);
    apply(w, { n: 0, at: "may06", actor: "farid", type: "shortlist", args: { appId: "app-tiago", tier: 900 } });
    apply(w, { n: 0, at: "may06", actor: "second", type: "sendDecisions", args: { oppId: "ostral-ctg" } });
    expect(w.offers["of-app-tiago"].requestId).toBe("rq-tiago");
    expect(requestTotals(w, "rq-tiago").remaining).toBe(0);
  });
  it("only verified organisations reach minors; the recipient is always the request's owner", () => {
    const w = may();
    apply(w, { n: 0, at: "may06", actor: "new", type: "registerFunder", args: { personId: "new", name: "New Person", orgName: "New Co", type: "Company", sports: "Any" } });
    expect(offer(w, "new", { fundId: "f-new-fund", recipientKind: "athlete", recipientId: "a-cyclist", requestId: "rq-cyclist", lineId: "l1", amount: 500 })).toMatch(/Only verified organisations/);
    expect(offer(w, "lucy", { fundId: "cap", recipientKind: "athlete", recipientId: "nadia", requestId: "rq-cyclist", lineId: "l1", amount: 500 })).toMatch(/goes to the person or organisation that published it/);
    expect(offer(w, "marcus", { fundId: "has", recipientKind: "org", recipientId: "highland", requestId: "rq-cyclist", lineId: "l1", amount: 500 })).toMatch(/goes to the person or organisation/);
    expect(offer(w, "kenji", { fundId: "oas", recipientKind: "athlete", recipientId: "tiago", amount: 500 })).toMatch(/only through a guardian's anonymised request/);
    apply(w, { n: 0, at: "may06", actor: w.requests["rq-cyclist"].publishedBy === "guardian" ? w.athletes["a-cyclist"].guardianId! : w.requests["rq-cyclist"].publishedBy, type: "hideRequest", args: { requestId: "rq-cyclist" } });
    expect(offer(w, "kenji", { fundId: "oas", recipientKind: "athlete", recipientId: "a-cyclist", requestId: "rq-cyclist", lineId: "l1", amount: 500 })).toMatch(/no longer open/);
  });
  it("Standard and Institutional funds need a second person for every direct offer; the maker cannot approve it", () => {
    const w = may();
    const id = "std-offer";
    apply(w, { n: 0, at: "may06", actor: "lucy", type: "makeOffer", args: { offerId: id, fundId: "wsdf", recipientKind: "org", recipientId: "lakeside", requestId: "rq-lakeside", lineId: "l1", amount: 1000, reason: "Women's team development (published criteria)." } });
    expect(w.offers[id].status).toBe("second-approval");
    expect(tryCmd(w, { at: "may06", actor: "lucy", type: "approveOffer", args: { offerId: id } })).toMatch(/different person/);
    w.people.colleague = { ...w.people.lucy, id: "colleague" };
    apply(w, { n: 0, at: "may06", actor: "colleague", type: "approveOffer", args: { offerId: id } });
    expect(w.offers[id].status).toBe("held");
  });
  it("the delegated limit counts every offer to the same recipient (no splitting); a waiting offer can be withdrawn with a reason", () => {
    const w = may();
    apply(w, { n: 0, at: "may06", actor: "kenji", type: "makeOffer", args: { offerId: "s1", fundId: "oas", recipientKind: "athlete", recipientId: "jonah", amount: 2000, reason: "Equipment for a verified adult athlete." } });
    apply(w, { n: 0, at: "may06", actor: "kenji", type: "makeOffer", args: { offerId: "s2", fundId: "oas", recipientKind: "athlete", recipientId: "jonah", amount: 2000, reason: "Equipment for a verified adult athlete." } });
    expect(w.offers.s1.status).toBe("held");
    expect(w.offers.s2.status).toBe("second-approval");
    expect(tryCmd(w, { at: "may06", actor: "kenji", type: "withdrawOffer", args: { offerId: "s2", reason: "" } })).toMatch(/needs a reason/);
    apply(w, { n: 0, at: "may06", actor: "kenji", type: "withdrawOffer", args: { offerId: "s2", reason: "Split by mistake" } });
    expect(fundTotals(w, "oas").held).toBe(fundTotals(may(), "oas").held + 2000);
  });
  it("amounts must be whole and above zero; existing records are never replaced; unknown records give a plain message", () => {
    const w = mayAll();
    expect(tryCmd(w, { at: "may06", actor: "kenji", type: "recordRelease", args: { agreementId: "ag-oriel-nadia", amount: -2250, ref: "neg", entryId: "neg" } })).toMatch(/above zero/);
    expect(offer(w, "kenji", { fundId: "oas", recipientKind: "athlete", recipientId: "nadia", requestId: "rq-nadia", lineId: "l1", amount: -500 })).toMatch(/above zero/);
    expect(tryCmd(w, { at: "may06", actor: "nadia", type: "coverOtherSources", args: { requestId: "rq-nadia", lineId: "l2", amount: -5000 } })).toMatch(/zero or more/);
    expect(tryCmd(w, { at: "may06", actor: "nadia", type: "publishRequest", args: { requestId: "rq-tiago", ownerKind: "athlete", ownerId: "nadia", title: "x", sport: "Wheelchair racing", lines: [{ label: "x", amount: 100 }], visibility: "Public", neededBy: "June", neededMonth: "June", verifiedLabel: "", tags: [] } })).toMatch(/already exists/);
    const held = Object.values(w.offers).find((o) => o.status === "held" && o.recipientId === "jonah") ?? Object.values(w.offers).find((o) => o.status === "held" && !o.light);
    if (held) expect(tryCmd(w, { at: "may06", actor: held.recipientId, type: "acceptOffer", args: { offerId: held.id, agreementId: "ag-oriel-nadia" } })).toMatch(/already exists|guardian|accept/);
    expect(tryCmd(w, { at: "may06", actor: "nadia", type: "acceptOffer", args: { offerId: "nope", agreementId: "x" } })).toMatch(/does not exist/);
    expect(tryCmd(w, { at: "may06", actor: "ingrid", type: "publishOpportunity", args: { oppId: "nope" } })).toMatch(/does not exist/);
    expect(platformTotals(w).development.committed).toBe(23600);
  });
  it("contact limits: no re-ask after “not now”; 20 expressions of interest per funder per week", () => {
    const w = mayAll();
    w.asks.prior = { id: "prior", requestId: "rq-nadia", funderId: "halvorsen", lineId: "l2", amount: 300, by: "nadia", status: "notnow", at: "may06" };
    expect(tryCmd(w, { at: "may06", actor: "nadia", type: "sendAsk", args: { askId: "again", requestId: "rq-nadia", funderId: "halvorsen", lineId: "l2", amount: 300, support: "Travel" } })).toMatch(/not now/);
    const adults = Object.values(w.athletes).filter((a) => !a.minor && a.discoverable);
    for (let k = 0; k < 20; k++) w.interests[`i${k}`] = { id: `i${k}`, funderId: "oriel", by: "kenji", athleteId: `x${k}`, reason: "Fits our support.", status: "sent", at: "may06" };
    expect(tryCmd(w, { at: "may06", actor: "kenji", type: "expressInterest", args: { interestId: "i-over", athleteId: adults[0].id, reason: "We support athletes like you." } })).toMatch(/20 expressions of interest/);
  });
  it("blocking a funder lapses its open offers; anonymised cards refuse names, clubs and exact dates", () => {
    const w = may();
    apply(w, { n: 0, at: "may06", actor: "marcus", type: "makeOffer", args: { offerId: "z", fundId: "has", recipientKind: "athlete", recipientId: "a-badminton", requestId: "rq-badminton", lineId: "l1", amount: 750, reason: "Coaching for a young player without a club." } });
    apply(w, { n: 0, at: "may06", actor: w.athletes["a-badminton"].guardianId!, type: "blockFunder", args: { athleteId: "a-badminton", funderId: "halvorsen" } });
    expect(w.offers.z.status).toBe("withdrawn");
    const card = (title: string, month: string) => tryCmd(may(), { at: "may06", actor: "rosa", type: "publishRequest", args: { requestId: "rq-t2", ownerKind: "athlete", ownerId: "tiago", title, sport: "Swimming", lines: [{ label: "Travel", amount: 500 }], visibility: "Verified funders only", neededBy: month, neededMonth: month, verifiedLabel: "", tags: [] } });
    expect(card("Tiago Esteves at Saltmere", "August")).toMatch(/name or club/);
    expect(card("Competition travel", "Sat 14 Aug")).toMatch(/only the month/);
    expect(card("Competition travel", "August")).toBeNull();
  });
});
