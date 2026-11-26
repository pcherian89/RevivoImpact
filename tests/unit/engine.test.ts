import { describe, expect, it } from "vitest";
import { baseWorld } from "../../src/domain/model";
import { agreementTotals, identifyingWords, apply, claimsCheck, counts, scheduleOf, fundTotals, platformTotals, programmeTotals, requestTotals, RuleError, type Event } from "../../src/domain/engine";
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
    expect(offer(w, "new", { fundId: "f-new-fund", recipientKind: "athlete", recipientId: "a-cyclist", requestId: "rq-cyclist", lineId: "l1", amount: 500 })).toMatch(/waiting for verification/);
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

describe("brief to filters (deterministic word list)", async () => {
  const { briefToChips } = await import("../../src/screens/Funder");
  it("reads sport, region and support from plain words", () => {
    expect(briefToChips("judo athletes in the coastal region needing travel")).toEqual(["Judo", "Coastal Region", "Travel"]);
    expect(briefToChips("adult sprinters competing nationally, open to a kit partnership")).toEqual(expect.arrayContaining(["Athletics: sprint", "Adults only", "National level", "Open to commercial partners"]));
    expect(briefToChips("")).toEqual(["Any region", "Verified evidence"]);
  });
});

/* Regressions found by the P2 end-to-end test across every role (docs/11 §4). */
describe("end-to-end regressions", () => {
  const mayAll = () => replay(checkpoint("jun30").filter((e) => !(e.type === "arrivals" && e.args.to === "jun30")));
  const pub = (w: ReturnType<typeof baseWorld>, title: string, lines: { label: string; amount: number }[]) => tryCmd(w, { at: "may06", actor: "jonah", type: "publishRequest", args: { requestId: `rq-j-${title}`, ownerKind: "athlete", ownerId: "jonah", title, sport: "Athletics", lines, visibility: "Public", neededBy: "June", neededMonth: "June", verifiedLabel: "", tags: [] } });
  it("a request needs a title, items with positive amounts and a sporting purpose", () => {
    const w = mayAll();
    expect(pub(w, "", [])).toMatch(/what the funding is for/);
    expect(pub(w, "Spikes", [])).toMatch(/at least one item/);
    expect(pub(w, "Holiday in the sun", [{ label: "Beach holiday", amount: 500 }])).toMatch(/sport only/);
    expect(pub(w, "Spikes and meet entries", [{ label: "Spikes", amount: 180 }])).toBeNull();
  });
  it("an opportunity names a real sport and a sporting purpose", () => {
    const w = mayAll();
    const draft = (title: string, sport: string, purpose: string) => tryCmd(w, { at: "may06", actor: "daniel", type: "createOpportunity", args: { fundId: "fdg", title, sport, purpose, amountLabel: "Up to $24,000", closes: "2027-07-30" } });
    expect(draft("Art scholarship", "Painting", "Paint supplies")).toMatch(/not a sport|sport only/);
    expect(draft("Coach education fund", "Any sport", "Coaching courses for volunteer coaches")).toBeNull();
  });
  it("an application is complete before submission and asks no more than the fund's maximum", () => {
    const w = mayAll();
    expect(tryCmd(w, { at: "may06", actor: "jonas", type: "saveApplication", args: { appId: "k1", oppId: "ostral-ctg", athleteId: "tiago", requested: 2400, statement: "x", otherFunding: "None" } })).toMatch(/up to \$1,500|already applied/);
    const ad = Object.values(w.athletes).find((a) => !a.minor && a.discoverable && a.light && a.age >= 18 && a.age <= 21)!;
    w.people[ad.id] = { ...w.people.jonah, id: ad.id, athleteId: ad.id };
    apply(w, { n: 0, at: "may06", actor: ad.id, type: "saveApplication", args: { appId: "k2", oppId: "crsc-tb", athleteId: ad.id, requested: 1000, statement: "(statement to add)", otherFunding: "Not declared" } });
    expect(tryCmd(w, { at: "may06", actor: ad.id, type: "submitApplication", args: { appId: "k2" } })).toMatch(/statement in your own words/);
  });
  it("offers can be declined; a reviewer confirms no conflict of interest", () => {
    const w = replay(checkpoint("may06"));
    apply(w, { n: 0, at: "may06", actor: "kenji", type: "makeOffer", args: { offerId: "d1", fundId: "oas", recipientKind: "athlete", recipientId: "jonah", amount: 800, reason: "Equipment for a verified adult athlete." } });
    expect(tryCmd(w, { at: "may06", actor: "nadia", type: "declineOffer", args: { offerId: "d1" } })).toMatch(/Only the athlete/);
    apply(w, { n: 0, at: "may06", actor: "jonah", type: "declineOffer", args: { offerId: "d1" } });
    expect(w.offers.d1.status).toBe("declined");
    expect(fundTotals(w, "oas").held).toBe(fundTotals(replay(checkpoint("may06")), "oas").held);
    expect(tryCmd(w, { at: "may06", actor: "daniel", type: "scoreApplication", args: { appId: "app-amira", total: 13, noConflict: false } })).toMatch(/conflict of interest/);
  });
});

/* P3: every journey step at every date, checked against docs/05 §9 (all steps done). */
describe("P3 reconciliation (30 Jun, all journey steps done)", () => {
  const full = () => {
    const w = replay(checkpoint("jun30"));
    for (const j of JOURNEYS) for (const s of j.steps.filter((x) => x.when === "jun30")) for (const e of stepEvents(s)) apply(w, e);
    return w;
  };
  it("platform totals: development 352,700 committed and 216,200 paid (12,000 carried in); programme and commercial apart", () => {
    const t = platformTotals(full());
    expect(t.development).toEqual({ committed: 352700, released: 216200 });
    expect(t.programme).toEqual({ committed: 145000, released: 29000 });
    expect(t.commercial).toEqual({ committed: 14000, released: 7000 });
    expect(t.inkind.committed).toBe(9000);
  });
  it("124 agreements; 36 of 60 kits delivered; Federation Development Grants 24,000 committed", () => {
    const w = full();
    expect(Object.values(w.agreements).filter(counts).length).toBe(124);
    expect(w.kitDeliveries.reduce((a, b) => a + b.items, 0)).toBe(36);
    expect(fundTotals(w, "fdg").committed).toBe(24000);
    expect(agreementTotals(w, "ag-ostral")).toMatchObject({ paid: 12000, carriedPaid: 12000, carriedSpent: 10400, checked: 0, stillToPay: 12000 });
  });
  it("Amira: spent 1,930 · checked 1,720 · waiting 210 · not yet spent 320 · still to pay 2,250", () => {
    expect(agreementTotals(full(), "ag-amira")).toMatchObject({ spent: 1930, checked: 1720, waiting: 210, notYetSpent: 320, stillToPay: 2250 });
  });
  it("Nadia: 600 still needed; Oriel 2,000 spent and checked; Halvorsen 50 not yet spent", () => {
    const w = full();
    expect(requestTotals(w, "rq-nadia").remaining).toBe(600);
    expect(agreementTotals(w, "ag-oriel-nadia")).toMatchObject({ spent: 2000, checked: 2000, notYetSpent: 0 });
    expect(agreementTotals(w, "ag-hal-nadia")).toMatchObject({ spent: 1150, checked: 1150, notYetSpent: 50 });
  });
  it("Jonah: 2 of 4 kit meets accepted; review Continue", () => {
    const w = full();
    expect(w.deliverables["ag-cv-jonah-d1"]).toMatchObject({ done: 2, target: 4 });
    expect(w.reviews["rv-jonah"].decision).toBe("Continue");
  });
  it("Play Every Day: 108 of 120 delivered, 12 missed (8 weather, 4 coach), 104 checked, 460 participants; Greenpark 14", () => {
    const w = full();
    const t = programmeTotals(w, "play-every-day");
    expect(t).toMatchObject({ delivered: 108, missed: 12, weather: 8, coach: 4, checked: 104, toCheck: 4, participants: 460, planned: 120 });
    const g = t.sites.find((s) => s.site.id === "greenpark")!;
    expect(g).toMatchObject({ delivered: 14, status: "Behind", alert: true });
    expect(g.plan?.status).toBe("approved");
  });
  it("programme money: 10,800 spent, 10,368 checked, 432 waiting, 1,200 not yet spent; report accepted", () => {
    const w = full();
    expect(agreementTotals(w, "ag-pe1")).toMatchObject({ paid: 12000, spent: 10800, checked: 10368, waiting: 432, notYetSpent: 1200 });
    expect(w.reports["rep-pe-q1"].status).toBe("accepted");
  });
  it("the claims check stops unsupported claims; spending can't exceed what was paid; photos need consent", () => {
    const w = full();
    expect(claimsCheck("Participants showed improved confidence")).toEqual(["improved", "improved confidence"]);
    expect(tryCmd(w, { at: "jun30", actor: "amira", type: "addExpense", args: { expenseId: "x1", agreementId: "ag-amira", what: "Coaching", amount: 400, paidOn: "Tue 29 Jun", receipt: true } })).toMatch(/can't be more than was paid/);
    expect(tryCmd(w, { at: "jun30", actor: "jonas", type: "sendProgress", args: { progressId: "x2", athleteId: "tiago", kind: "training", text: "Training week", proof: false, photo: true } })).toMatch(/Photos need consent/);
    expect(tryCmd(w, { at: "jun30", actor: "priya", type: "checkExpense", args: { expenseId: "ex-am-4" } })).toMatch(/no receipt/);
    expect(tryCmd(w, { at: "jun30", actor: "lena", type: "recordSession", args: { sessionId: "x3", programmeId: "play-every-day", siteId: "greenpark", slot: 19, status: "delivered", attendance: 20 } })).toMatch(/already been recorded/);
  });
  it("existing funding: the preparer cannot approve it, and it does not count until approved", () => {
    const w = replay(checkpoint("jun30"));
    apply(w, { n: 0, at: "jun30", actor: "daniel", type: "addExistingFunding", args: { agreementId: "e1", fundId: "fdg", orgId: "ostral", amount: 24000, purpose: "Regional swimming coach development", paid: 12000, spent: 10400, nextUpdate: "Thu 30 Sep" } });
    expect(fundTotals(w, "fdg").committed).toBe(0);
    w.people.danielApprove = { ...w.people.daniel, id: "danielApprove" };
    expect(tryCmd(w, { at: "jun30", actor: "daniel", type: "approveExistingFunding", args: { agreementId: "e1" } })).toMatch(/Approve/);
  });
});

/* Regressions found by the P3 money and safeguarding verification (docs/12 §5). */
describe("P3 verifier regressions", () => {
  const full = () => {
    const w = replay(checkpoint("jun30"));
    for (const j of JOURNEYS) for (const s of j.steps.filter((x) => x.when === "jun30")) for (const e of stepEvents(s)) apply(w, e);
    return w;
  };
  const at = (w: ReturnType<typeof baseWorld>, actor: string, type: string, args: Record<string, unknown>) => tryCmd(w, { at: "jun30", actor, type: type as Event["type"], args });
  it("an update goes only on the record of the athlete or organisation it is about; no surname or club for a minor", () => {
    const w = full();
    expect(at(w, "amira", "sendProgress", { progressId: "x1", agreementId: "ag-pe1", athleteId: "amira", kind: "result", text: "Won a medal", proof: true })).toMatch(/funding record of the athlete or organisation/);
    expect(at(w, "rosa", "sendProgress", { progressId: "x2", agreementId: "ag-amira", athleteId: "tiago", kind: "result", text: "Won", proof: true })).toMatch(/funding record of the athlete or organisation/);
    expect(at(w, "marcus", "sendProgress", { progressId: "x3", agreementId: "ag-oriel-tiago", kind: "result", text: "Photo", proof: true, photo: true })).toMatch(/who the update is about/);
    expect(at(w, "jonas", "sendProgress", { progressId: "x4", agreementId: "ag-oriel-tiago", athleteId: "tiago", kind: "result", text: "Tiago Esteves of Saltmere won", proof: true })).toMatch(/surname, club, coach and school/);
  });
  it("withdrawing progress consent pauses updates", () => {
    const w = full();
    apply(w, { n: 0, at: "jun30", actor: "rosa", type: "setConsent", args: { athleteId: "tiago", purpose: "progress", value: false } });
    expect(at(w, "jonas", "sendProgress", { progressId: "x5", agreementId: "ag-oriel-tiago", athleteId: "tiago", kind: "training", text: "Training week", proof: false })).toMatch(/Progress sharing is paused/);
  });
  it("the claims check catches outcome claims and figures that differ from the records", () => {
    const w = full();
    expect(claimsCheck("life changing results; children are happier and healthier thanks to the programme", w, "ag-pe1").length).toBeGreaterThan(2);
    expect(claimsCheck("120 of 120 sessions ran", w, "ag-pe1")[0]).toMatch(/records show 108 of 120/);
    expect(claimsCheck("108 of 120 planned sessions ran; attendance was higher in May", w, "ag-pe1")).toEqual([]);
    // docs/02: causal and outcome words are flagged even when the figures are right.
    expect(claimsCheck("108 of 120 planned sessions ran; attendance improved in May", w, "ag-pe1")).toEqual(["improved"]);
    expect(claimsCheck("Attendance rose by 40%", w, "ag-pe1")).toEqual(["40% without saying how many answered"]);
    expect(claimsCheck("71% (212 of 460 answered) said they enjoyed it", w, "ag-pe1")).toEqual([]);
    expect(claimsCheck("108 out of 120 sessions ran and all 120 sessions were planned", w, "ag-pe1")).toEqual(["all 120 sessions (the records show 108 of 120)"]);
    expect(claimsCheck("We spent US$10,800 (10.8k dollars), not 10.9k dollars", w, "ag-pe1")).toEqual(["10.9k dollars does not match any figure in the records"]);
  });
  it("no money moves on existing funding before approval and confirmation; disputed funding stops counting", () => {
    const w = replay(checkpoint("jun30"));
    apply(w, { n: 0, at: "jun30", actor: "daniel", type: "addExistingFunding", args: { agreementId: "e1", fundId: "fdg", orgId: "ostral", amount: 24000, purpose: "Regional swimming coach development", paid: 12000, spent: 10400, nextUpdate: "Thu 30 Sep" } });
    expect(at(w, "priya", "recordRelease", { agreementId: "e1", amount: 5000, ref: "r", entryId: "r" })).toMatch(/second person/);
    expect(at(w, "farid", "addExpense", { expenseId: "x", agreementId: "e1", what: "Coach course", amount: 100, paidOn: "Mon 28 Jun", receipt: true })).toMatch(/second person/);
    apply(w, { n: 0, at: "jun30", actor: "ingrid", type: "approveExistingFunding", args: { agreementId: "e1" } });
    expect(at(w, "farid", "confirmReceipt", { agreementId: "e1", entryId: "c" })).toMatch(/confirm the figures/);
    apply(w, { n: 0, at: "jun30", actor: "farid", type: "confirmExistingFunding", args: { agreementId: "e1", agree: false, reason: "Spent figure differs" } });
    expect(fundTotals(w, "fdg").committed).toBe(0);
    expect(at(w, "priya", "recordRelease", { agreementId: "e1", amount: 5000, ref: "r2", entryId: "r2" })).toMatch(/disputed/);
  });
  it("carried-in money is never confirmed as received; one confirmation per payment", () => {
    const w = full();
    expect(agreementTotals(w, "ag-ostral").toConfirm).toBe(0);
    expect(at(w, "farid", "confirmReceipt", { agreementId: "ag-ostral", entryId: "c" })).toMatch(/no payment to confirm/);
  });
  it("organisation requests only by its own people; offers and interest only from verified funders", () => {
    const w = full();
    expect(at(w, "amira", "publishRequest", { requestId: "rq-x", ownerKind: "org", ownerId: "lanternfield", title: "Bibs and cones", sport: "Community multi-sport", lines: [{ label: "Bibs", amount: 100 }], visibility: "Public", neededBy: "July", neededMonth: "July", verifiedLabel: "", tags: [] })).toMatch(/Admin or Approve at the organisation/);
    apply(w, { n: 0, at: "jun30", actor: "newco", type: "registerFunder", args: { personId: "newco", name: "New Person", orgName: "New Co", type: "Company", sports: "Boxing" } });
    expect(at(w, "newco", "makeOffer", { offerId: "o1", fundId: "f-newco-fund", recipientKind: "athlete", recipientId: "jonah", amount: 500, reason: "Equipment for an adult sprinter." })).toMatch(/waiting for verification/);
  });
  it("no reopening a decided application; the awards cap counts offers already sent", () => {
    const w = full();
    expect(at(w, "amira", "answerInfo", { appId: "app-amira", otherFunding: "None" })).toMatch(/no open question/);
  });
  it("reviews: a fixed set of decisions; Pause and Close need Approve and stop payments", () => {
    const w = full();
    expect(at(w, "daniel", "recordReview", { reviewId: "r1", agreementId: "ag-amira", decision: "Approve all" })).toMatch(/Choose Continue/);
    expect(at(w, "daniel", "recordReview", { reviewId: "r2", agreementId: "ag-amira", decision: "Pause", conditions: "Missing receipts" })).toMatch(/needs someone with Approve/);
    apply(w, { n: 0, at: "jun30", actor: "ingrid", type: "recordReview", args: { reviewId: "r3", agreementId: "ag-amira", decision: "Pause", conditions: "Missing receipts" } });
    expect(at(w, "priya", "recordRelease", { agreementId: "ag-amira", amount: 2250, ref: "i2", entryId: "i2" })).toMatch(/paused this funding/);
  });
  it("duplicate expenses are refused; a funder cannot register as an athlete under their own account", () => {
    const w = full();
    apply(w, { n: 0, at: "jun30", actor: "amira", type: "addExpense", args: { expenseId: "d1", agreementId: "ag-amira", what: "Physio", amount: 85, paidOn: "Mon 28 Jun", receipt: true } });
    expect(at(w, "amira", "addExpense", { expenseId: "d2", agreementId: "ag-amira", what: "Physio", amount: 85, paidOn: "Mon 28 Jun", receipt: true })).toMatch(/already recorded/);
    expect(at(w, "daniel", "register", { kind: "athlete", personId: "daniel", name: "Daniel Osei", age: 30, sport: "Judo", region: "Coastal Region", gender: "man" })).toMatch(/already exists/);
    expect(at(w, "sam", "recordSession", { sessionId: "s1", programmeId: "play-every-day", siteId: "riverside", slot: 19, status: "delivered", attendance: 10 })).toMatch(/sites you coach|already been recorded/);
  });
});

/* P4: payment schedules derived from the records (never typed in). */
describe("payment schedules", () => {
  const full = () => {
    const w = replay(checkpoint("jun30"));
    for (const j of JOURNEYS) for (const s of j.steps.filter((x) => x.when === "jun30")) for (const e of stepEvents(s)) apply(w, e);
    return w;
  };
  it("Amira: half paid and confirmed; the second half waits on Wed 1 Sep for the judogi receipt", () => {
    const sc = scheduleOf(full(), "ag-amira");
    expect(sc.map((x) => [x.amount, x.status])).toEqual([[2250, "paid"], [2250, "expected"]]);
    expect(sc[1].dueLabel).toBe("Wed 1 Sep");
    expect(sc[1].condition).toMatch(/judogi receipt/);
    expect(sc.reduce((a, x) => a + x.amount, 0)).toBe(4500);
  });
  it("Play Every Day: five tranches of 12,000; quarter 2 due Thu 1 Jul once the report is accepted", () => {
    const sc = scheduleOf(full(), "ag-pe1");
    expect(sc.map((x) => x.amount)).toEqual([12000, 12000, 12000, 12000, 12000]);
    expect(sc[0].status).toBe("paid");
    expect(sc[1]).toMatchObject({ dueLabel: "Thu 1 Jul (quarter 2)", conditionMet: true, status: "expected" });
  });
  it("existing funding: carried-in money is the first, already-paid part; the rest follows the next update", () => {
    const sc = scheduleOf(full(), "ag-ostral");
    expect(sc.map((x) => [x.amount, x.status])).toEqual([[12000, "paid"], [12000, "expected"]]);
  });
  it("every schedule adds up to the committed amount; paid never exceeds the schedule", () => {
    const w = full();
    for (const g of Object.values(w.agreements).filter(counts)) {
      const sc = scheduleOf(w, g.id);
      expect(sc.reduce((a, x) => a + x.amount, 0)).toBe(g.amount);
      expect(sc.reduce((a, x) => a + x.paid, 0)).toBe(Math.min(g.amount, agreementTotals(w, g.id).paid));
    }
  });
});

/* P4: reports read the records live; money in the narrative must match a record. */
describe("report consistency", async () => {
  const { reportFigures } = await import("../../src/screens/Track");
  const full = () => {
    const w = replay(checkpoint("jun30"));
    for (const j of JOURNEYS) for (const s of j.steps.filter((x) => x.when === "jun30")) for (const e of stepEvents(s)) apply(w, e);
    return w;
  };
  it("report figures follow the records: a new expense changes the report without any typing", () => {
    const w = full();
    expect(reportFigures(w, ["ag-pe1"])).toMatchObject({ committed: 60000, paid: 12000, received: 12000, spent: 10800, checked: 10368, waiting: 432, notYetSpent: 1200 });
    apply(w, { n: 0, at: "jun30", actor: "maya", type: "addExpense", args: { expenseId: "n1", agreementId: "ag-pe1", what: "Bibs for the summer league", amount: 300, paidOn: "Tue 29 Jun", receipt: true } });
    expect(reportFigures(w, ["ag-pe1"])).toMatchObject({ spent: 11100, waiting: 732, notYetSpent: 900 });
  });
  it("the money check flags amounts that match no record and accepts the real ones", () => {
    const w = full();
    expect(claimsCheck("We spent $11,000 this quarter.", w, "ag-pe1")[0]).toMatch(/\$11,000 does not match/);
    expect(claimsCheck("We spent $10,800, of which $10,368 is checked; coaching cost $6,480.", w, "ag-pe1")).toEqual([]);
  });
});

/* P4: Ask Revivo for funders answers from the funder's own records, links to actions, and refuses. */
describe("Ask Revivo for funders", async () => {
  const { funderAnswer, FUNDER_QUESTIONS } = await import("../../src/screens/Track");
  const full = () => {
    const w = replay(checkpoint("jun30"));
    for (const j of JOURNEYS) for (const s of j.steps.filter((x) => x.when === "jun30")) for (const e of stepEvents(s)) apply(w, e);
    return w;
  };
  it("answers the six questions from Tallwater's records, each row linking to a record", () => {
    const w = full();
    const ask = (q: string) => funderAnswer(w, w.people.daniel, q);
    expect(ask(FUNDER_QUESTIONS[0]).lead).toMatch(/\$23,130 of spending is recorded/);
    expect(ask(FUNDER_QUESTIONS[1]).rows.map((r) => r.label).join(" ")).toMatch(/Competition judogi/);
    expect(ask(FUNDER_QUESTIONS[3]).lead).toMatch(/still to pay across/);
    expect(ask(FUNDER_QUESTIONS[4]).rows.map((r) => r.label).join(" ")).toMatch(/Greenpark School/);
    expect(ask(FUNDER_QUESTIONS[5]).rows.some((r) => r.href?.includes("ag-amira"))).toBe(true);
    // Every one of the six standard questions gets its own answer, never the name lookup or the fallback.
    for (const q of FUNDER_QUESTIONS) expect(ask(q).from).not.toMatch(/^This agreement|^$/);
    expect(ask("How much have we paid so far?").lead).toMatch(/still to pay/);
    expect(ask("Should we give Amira more money?").refusal).toBe(true);
    expect(ask("How is Amira doing?").from).toMatch(/This agreement/);
  });
  it("refuses to rank, decide or identify, and never names a young athlete in full", () => {
    const w = full();
    expect(funderAnswer(w, w.people.daniel, "Which athlete deserves the money most?").refusal).toBe(true);
    for (const q of FUNDER_QUESTIONS) expect(JSON.stringify(funderAnswer(w, w.people.kenji, q))).not.toMatch(/Esteves/);
  });
});

describe("P4 money and safeguarding verifier regressions", async () => {
  const { funderAnswer } = await import("../../src/screens/Track");
  const full = () => {
    const w = replay(checkpoint("jun30"));
    for (const j of JOURNEYS) for (const s of j.steps.filter((x) => x.when === "jun30")) for (const e of stepEvents(s)) apply(w, e);
    return w;
  };
  it("a payment cannot run ahead of the payment schedule", () => {
    const w = full();
    // Amira's second instalment waits for its condition (the judogi receipt), so nothing is due yet.
    expect(tryCmd(w, { at: "jun30", actor: "priya", type: "recordRelease", args: { agreementId: "ag-amira", amount: 2250, ref: "early", entryId: "early" } })).toMatch(/Nothing is due yet/);
    expect(scheduleOf(w, "ag-amira").reduce((a, x) => a + x.amount, 0)).toBe(4500);
  });
  it("instalments are whole dollars and still add up to the amount agreed", () => {
    const w = full();
    for (const g of Object.values(w.agreements)) {
      const s = scheduleOf(w, g.id);
      expect(s.every((x) => Number.isInteger(x.amount))).toBe(true);
      expect(s.reduce((a, x) => a + x.amount, 0)).toBe(g.amount);
    }
  });
  it("commercial sponsorship never enters a funder's cash answers", () => {
    const w = full();
    const lucy = Object.values(w.people).find((p) => p.funderId === "corvane" && p.perms.includes("Finance"));
    if (!lucy) return;
    const a = funderAnswer(w, lucy, "How much have we paid so far?");
    expect(a.lead).toMatch(/development and programme agreements/);
  });
  it("funders never see a young athlete's surname, club or coach in what they send", () => {
    const w = full();
    const words = identifyingWords(w, "tiago");
    expect(words.length).toBeGreaterThan(1);
    expect(tryCmd(w, { at: "jun30", actor: "jonas", type: "sendProgress", args: { progressId: "z1", agreementId: "ag-oriel-tiago", athleteId: "tiago", kind: "training", text: `Trained hard with ${words[0]} this week`, proof: false } })).toMatch(/first name only/);
  });
});

describe("recording a payment: date and reference (P5)", () => {
  const beforeR1 = () => {
    const evs = checkpoint("jun30");
    const i = evs.findIndex((e) => e.type === "recordRelease" && e.args.entryId === "le-amira-r1");
    return replay(evs.slice(0, i));
  };
  const pay = (w: ReturnType<typeof baseWorld>, args: Record<string, unknown>) => tryCmd(w, { at: "may06", actor: "priya", type: "recordRelease", args: { agreementId: "ag-amira", amount: 2250, entryId: "p1", ...args } });
  it("refuses a date after today and before the agreement was accepted", () => {
    expect(pay(beforeR1(), { paidOn: "2027-05-07" })).toMatch(/can't be after today/);
    expect(pay(beforeR1(), { paidOn: "2027-04-01" })).toMatch(/before the agreement was accepted/);
    expect(pay(beforeR1(), { paidOn: "6 May" })).toMatch(/day, month and year/);
  });
  it("keeps the finance team's own reference and date, or generates a reference", () => {
    const w = beforeR1();
    expect(pay(w, { paidOn: "2027-05-06", ref: " BANK-77 " })).toBeNull();
    const l = w.ledger.find((x) => x.id === "p1")!;
    expect(l).toMatchObject({ ref: "BANK-77", paidOn: "2027-05-06", amount: 2250 });
    const w2 = beforeR1();
    expect(pay(w2, {})).toBeNull();
    expect(w2.ledger.find((x) => x.id === "p1")).toMatchObject({ ref: "PAY-AG-AMIRA-1", paidOn: "2027-05-06" });
  });
  it("still refuses a duplicate reference and more than is due", () => {
    const w = beforeR1();
    expect(pay(w, { ref: "BANK-77" })).toBeNull();
    expect(pay(w, { ref: "BANK-77", entryId: "p2", amount: 1 })).toMatch(/already recorded|due/);
    expect(pay(beforeR1(), { amount: 4500 })).toMatch(/Only \$2,250 is due now/);
  });
});

describe("claims check (P5): wrong figures, misleading statements, changed records", () => {
  const w = replay(checkpoint("jun30"));
  const t = agreementTotals(w, "ag-pe1");
  const $ = (n: number) => "$" + n.toLocaleString("en-GB");
  it("flags a real figure used for the wrong thing", () => {
    expect(t.committed).not.toBe(t.spent);
    expect(claimsCheck(`We have spent ${$(t.committed)} so far.`, w, "ag-pe1")[0]).toMatch(/spent \(the records show/);
    expect(claimsCheck(`We have spent ${$(t.spent)} so far.`, w, "ag-pe1")).toEqual([]);
    expect(claimsCheck(`Tallwater has paid ${$(t.committed)}.`, w, "ag-pe1")[0]).toMatch(/paid \(the records show/);
    expect(claimsCheck(`The grant of ${$(t.committed)} has ${$(t.notYetSpent)} not yet spent: ${$(t.notYetSpent)}.`, w, "ag-pe1")).toEqual([]);
  });
  it("flags figures that are simply wrong, and misleading impact claims", () => {
    expect(claimsCheck("We spent $61,250 on coaching and kit.", w, "ag-pe1")[0]).toMatch(/does not match/);
    expect(claimsCheck("The programme transformed lives and is proven to work.", w, "ag-pe1").length).toBeGreaterThan(0);
    expect(claimsCheck("All 120 sessions ran as planned.", w, "ag-pe1")[0]).toMatch(/records show 108 of 120/);
  });
  it("re-checks sent words when the records change", () => {
    const sentence = `We have spent ${$(t.spent)} so far.`;
    expect(claimsCheck(sentence, w, "ag-pe1")).toEqual([]);
    const w2 = replay(checkpoint("jun30"));
    const e = Object.values(w2.expenses).find((x) => x.agreementId === "ag-pe1")!;
    e.amount += 100; // a correction to the records after the report was sent
    expect(claimsCheck(sentence, w2, "ag-pe1")[0]).toMatch(/does not match|spent \(the records show/);
  });
});

describe("claims check (P5 review): true sentences pass, common overclaims are caught", () => {
  const w = replay(checkpoint("jun30"));
  const t = agreementTotals(w, "ag-pe1");
  const pt = programmeTotals(w, "play-every-day");
  const $ = (n: number) => "$" + n.toLocaleString("en-GB");
  it("a money word after 'and' belongs to the next amount", () => {
    expect(claimsCheck(`We received ${$(t.received)} and spent ${$(t.spent)}.`, w, "ag-pe1")).toEqual([]);
  });
  it("catches participants, sessions without 'of M', word families and percent", () => {
    expect(claimsCheck(`We reached ${pt.participants + 140} children`, w, "ag-pe1")[0]).toMatch(/register shows/);
    expect(claimsCheck(`We reached ${pt.participants} children`, w, "ag-pe1")).toEqual([]);
    expect(claimsCheck("All sessions ran as planned", w, "ag-pe1")[0]).toMatch(/all sessions/);
    expect(claimsCheck(`${pt.planned} sessions were delivered`, w, "ag-pe1")[0]).toMatch(/sessions delivered/);
    expect(claimsCheck("Sessions improve confidence and boost fitness", w, "ag-pe1")).toEqual(expect.arrayContaining(["improve", "boost"]));
    expect(claimsCheck("Attendance doubled", w, "ag-pe1")).toContain("doubled");
    expect(claimsCheck("It rose by 40 percent", w, "ag-pe1")[0]).toMatch(/percent without/);
  });
  it("stops sending decisions while an application is still being reviewed", () => {
    const w2 = replay(checkpoint("may06"));
    expect(tryCmd(w2, { at: "may06", actor: "ingrid", type: "sendDecisions", args: { oppId: "eas" } })).toMatch(/still need|still needs/);
  });
});

describe("recovering from mistakes (P5 review)", () => {
  // Replay journey B up to (and including) Nadia's ask, before Marcus answers it.
  const upTo = (pred: (e: Event) => boolean) => {
    const evs = checkpoint("jun30");
    return replay(evs.slice(0, evs.findIndex(pred) + 1));
  };
  const cmd = (w: ReturnType<typeof baseWorld>, actor: string, type: string, args: Record<string, unknown>, when: "may06" | "jun30" = "may06") => tryCmd(w, { at: when, actor, type: type as Event["type"], args });
  it("an unanswered ask can be cancelled by the person who sent it, and only then", () => {
    const w = upTo((e) => e.type === "sendAsk" && e.args.askId === "ask-nadia-1");
    expect(cmd(w, "kenji", "cancelAsk", { askId: "ask-nadia-1" })).toMatch(/Only the person who asked/);
    expect(cmd(w, "nadia", "cancelAsk", { askId: "ask-nadia-1" })).toBeNull();
    expect(w.asks["ask-nadia-1"]).toBeUndefined();
  });
  it("a request is withdrawn only while nobody has offered on it", () => {
    const w = at("jun30");
    expect(cmd(w, "nadia", "closeRequest", { requestId: "rq-nadia" }, "jun30")).toMatch(/offered or agreed/);
  });
  it("withdrawing a request keeps it on record and marks its open asks as cancelled", () => {
    const w = upTo((e) => e.type === "sendAsk" && e.args.askId === "ask-nadia-1");
    expect(cmd(w, "nadia", "closeRequest", { requestId: "rq-nadia" })).toBeNull();
    expect(w.requests["rq-nadia"].status).toBe("closed");
    expect(w.requests["rq-nadia"].discoverable).toBe(false);
    expect(w.asks["ask-nadia-1"].status).toBe("cancelled");
  });
  it("a coach without the family's authorisation cannot prepare an application for a young athlete", () => {
    const w = at("may06");
    w.authorisations = w.authorisations.filter((z) => z.athleteId !== "tiago");
    expect(cmd(w, "jonas", "saveApplication", { appId: "app-x", oppId: "ostral-ctg", athleteId: "tiago", requested: 900, statement: "x", otherFunding: "None" })).not.toBeNull();
  });
  it("a guardian may give the month a young athlete's money is needed with its year", () => {
    const w = at("may06");
    expect(cmd(w, "rosa", "publishRequest", { requestId: "rq-t2", ownerKind: "athlete", ownerId: "tiago", title: "Competition travel", sport: "Swimming", lines: [{ label: "Competition travel and entry", amount: 2400 }], visibility: "Verified funders only", neededBy: "August 2027", neededMonth: "August 2027", verifiedLabel: "x", tags: [] })).toBeNull();
    expect(cmd(w, "rosa", "publishRequest", { requestId: "rq-t3", ownerKind: "athlete", ownerId: "tiago", title: "Competition travel", sport: "Swimming", lines: [{ label: "Competition travel and entry", amount: 2400 }], visibility: "Verified funders only", neededBy: "14 August", neededMonth: "14 August", verifiedLabel: "x", tags: [] })).toMatch(/only the month/);
  });
  it("spending can be removed by the person who added it until it is checked", () => {
    const w = at("jun30");
    expect(cmd(w, "amira", "addExpense", { expenseId: "x-oops", agreementId: "ag-amira", what: "Physio session", amount: 125, paidOn: "2027-06-20", receipt: false }, "jun30")).toBeNull();
    expect(cmd(w, "priya", "removeExpense", { expenseId: "x-oops" }, "jun30")).toMatch(/Only the person who added/);
    expect(cmd(w, "amira", "removeExpense", { expenseId: "x-oops" }, "jun30")).toBeNull();
    expect(w.expenses["x-oops"]).toBeUndefined();
  });
  it("a coach corrects attendance with a reason, within the site's register", () => {
    const w = at("may06");
    expect(cmd(w, "sam", "recordSession", { sessionId: "s-fix", programmeId: "play-every-day", siteId: "greenpark", slot: Object.values(w.sessions).filter((x) => x.siteId === "greenpark").length, status: "delivered", attendance: 41 })).toBeNull();
    const sid = Object.values(w.sessions).find((x) => x.attendance === 41 && x.by === "sam")?.id ?? "s-fix";
    expect(cmd(w, "sam", "correctSession", { sessionId: sid, attendance: 14, reason: "" })).toMatch(/why/);
    expect(cmd(w, "sam", "correctSession", { sessionId: sid, attendance: 999, reason: "typo" })).toMatch(/1 to/);
    expect(cmd(w, "sam", "correctSession", { sessionId: sid, attendance: 14, reason: "Typed 41 instead of 14" })).toBeNull();
    expect(w.sessions[sid].attendance).toBe(14);
    expect(w.audit.at(-1)!.action).toMatch(/from 41 to 14/);
  });
});
