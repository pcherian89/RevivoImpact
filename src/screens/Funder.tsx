import { useState } from "react";
import { ArrowRight, ChevronRight, MessageCircleQuestion, CircleCheck, CircleHelp, FileText, HandHeart, Lock, Megaphone, Search, Star, UsersRound, X } from "lucide-react";
import { useStore } from "../state/store";
import { BEHAVIOUR, REGIONS, type Fund, type Person, type World } from "../domain/model";
import { agreementTotals, counts, fit, fmt, scheduleOf, fundTotals, mayReachMinors, programmeTotals, oppStatusAt, released, requestTotals, stateLabel, sum } from "../domain/engine";
import { btn, Button, Chip, cn, seg, FilterPill, HeroBand, Label, PageHead, Panel, PhonePhoto, SeeSource, SimulatedAI, Tabs, type Source } from "../components/ui";
import { FundBar, NeedBar } from "../components/money";
import { fundSources } from "./sources";
import { FunderAskRevivo } from "./Track";
import { ActionButton, AppStatus, athleteLabel, Empty, Field, inputCls, Message, policyText, recipientName, Row, Section, useAction } from "./common";
import { fmtDate } from "./Seeker";

export const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;
const fundsOf = (w: World, funderId: string) => Object.values(w.funds).filter((f) => f.funderId === funderId);

/* ================================================================= Overview */

export function FunderOverview({ persona }: { persona: Person }) {
  const { world: w } = useStore();
  const [ask, setAsk] = useState(false);
  const fid = persona.funderId!;
  const f = w.funders[fid];
  const funds = fundsOf(w, fid);
  const needs: { t: string; d: string; a: string; to: string }[] = [];
  for (const o of Object.values(w.opps).filter((o) => w.funds[o.fundId].funderId === fid && o.status === "awaiting"))
    if (o.draftedBy === persona.id || persona.perms.includes("Approve")) needs.push(o.draftedBy === persona.id ? { t: `Your draft "${o.title}" waits for a colleague's approval`, d: "You prepared it, so a different person must publish it.", a: "See opportunities", to: "opps" } : { t: `${w.people[o.draftedBy!]?.name ?? "A colleague"}'s draft is waiting for approval`, d: `${o.title} · you did not prepare it, so you can publish it`, a: "Review and publish", to: "opps" });
  const waiting = Object.values(w.offers).filter((o) => w.funds[o.fundId].funderId === fid && o.status === "second-approval");
  const forMe = waiting.filter((o) => o.by !== persona.id);
  if (forMe.length && persona.perms.includes("Approve")) needs.push({ t: `${forMe.length} offer${forMe.length > 1 ? "s" : ""} waiting for your second approval`, d: "A colleague made them; this fund needs two people.", a: "Give second approval", to: "apps" });
  else if (waiting.length && persona.perms.includes("Approve")) needs.push({ t: `${waiting.length} of your offers ${waiting.length > 1 ? "are" : "is"} waiting for a second approver`, d: "Nothing is sent until a colleague with Approve agrees. You can withdraw it.", a: "See offers", to: "apps" });
  // P3: money and reports that need a person at this funder
  const mineAg = Object.values(w.agreements).filter((g) => w.funds[g.fundId].funderId === fid);
  for (const g of mineAg.filter((g) => g.status === "awaiting-approval" && g.preparedBy !== persona.id && persona.perms.includes("Approve"))) needs.push({ t: `Approve existing funding for ${recipientName(w, g.recipientKind, g.recipientId, persona)}`, d: `${fmt(g.amount)} · prepared by ${w.people[g.preparedBy ?? ""]?.name}; a second person must approve it`, a: "Review and approve", to: `agreement/${g.id}` });
  for (const g of Object.values(w.agreements).filter((g) => g.status === "awaiting-recipient" && g.recipientId === persona.orgId)) needs.push({ t: `${w.funders[w.funds[g.fundId].funderId].name} added funding you already receive`, d: `${fmt(g.amount)} · check the figures carried in and confirm them`, a: "Check the figures", to: `agreement/${g.id}` });
  const checkable = Object.values(w.expenses).filter((e) => e.status === "reported" && e.receipt && mineAg.some((g) => g.id === e.agreementId) && e.by !== persona.id);
  if (checkable.length && (persona.perms.includes("Finance") || persona.perms.includes("Review"))) needs.push({ t: `${plural(checkable.length, "expense")} to check`, d: `${fmt(sum(checkable.map((e) => e.amount)))} with receipts, from ${[...new Set(checkable.map((e) => recipientName(w, w.agreements[e.agreementId].recipientKind, w.agreements[e.agreementId].recipientId, persona)))].join(", ")}`, a: "Check spending", to: `agreement/${checkable[0].agreementId}` });
  const toRead = Object.values(w.reports).filter((r) => r.status === "submitted" && mineAg.some((g) => g.id === r.agreementId));
  if (toRead.length && (persona.perms.includes("Review") || persona.perms.includes("Approve"))) needs.push({ t: "A report to read", d: toRead[0].period, a: "Read the report", to: `report/${toRead[0].agreementId}` });
  const proofs = Object.values(w.deliverables).filter((d) => d.pending > 0 && mineAg.some((g) => g.id === d.agreementId));
  if (proofs.length) needs.push({ t: "Sponsorship proof to accept", d: proofs.map((d) => d.label).join(", "), a: "Open", to: `agreement/${proofs[0].agreementId}` });
  const asks = Object.values(w.asks).filter((a) => a.funderId === fid && a.status === "sent");
  if (asks.length) needs.push({ t: `${asks.length} support ${asks.length === 1 ? "ask" : "asks"} to answer`, d: "Answer with an offer, a question or “not now”.", a: "Answer asks", to: "apps" });
  const shortlisted = Object.values(w.applications).filter((a) => w.funds[w.opps[a.oppId].fundId].funderId === fid && a.status === "shortlisted");
  if (shortlisted.length && persona.perms.includes("Approve")) needs.push({ t: `${shortlisted.length} recommendations are ready for decision`, d: "See the budget and award levels before you decide.", a: "Decide offers", to: `selection/${shortlisted[0].oppId}` });
  const toReview = Object.values(w.applications).filter((a) => w.funds[w.opps[a.oppId].fundId].funderId === fid && a.status === "submitted" && a.scores.length < 2 && !a.scores.some((s) => s.by === persona.id) && !a.light);
  if (toReview.length && persona.perms.includes("Review")) needs.push({ t: `${toReview.length} application${toReview.length > 1 ? "s" : ""} to review`, d: toReview.map((a) => athleteLabel(w, a.applicantId, persona)).join(", "), a: "Review", to: `review/${toReview[0].id}` });
  const dueAll = Object.values(w.agreements).filter((g) => w.funds[g.fundId].funderId === fid && counts(g) && BEHAVIOUR[w.funds[g.fundId].type] !== "inkind" && agreementTotals(w, g.id).paid > 0 && scheduleOf(w, g.id).some((x) => x.status === "due" || x.status === "part-paid"));
  const dueNow = dueAll.filter((g) => !g.light);
  const dueGrouped = dueAll.length - dueNow.length;
  if (dueAll.length && persona.perms.includes("Finance")) needs.push({ t: `${plural(dueAll.length, "payment")} due now`, d: [...dueNow.map((g) => recipientName(w, g.recipientKind, g.recipientId, persona)), ...(dueGrouped ? [`${dueGrouped} other ${dueGrouped === 1 ? "agreement" : "agreements"}`] : [])].join(", "), a: "Record payments", to: dueNow.length === 1 && !dueGrouped ? `agreement/${dueNow[0].id}` : "portfolio" });
  const toRelease = Object.values(w.agreements).filter((g) => w.funds[g.fundId].funderId === fid && !g.light && released(w, g.id) === 0 && BEHAVIOUR[w.funds[g.fundId].type] !== "inkind");
  if (toRelease.length && persona.perms.includes("Finance")) needs.push({ t: toRelease.length > 1 ? `${toRelease.length} first payments to record` : `First payment to record for ${recipientName(w, toRelease[0].recipientKind, toRelease[0].recipientId, persona)}`, d: "Your finance team pays; you record it here (simulated: no money moves).", a: "Record a payment", to: `agreement/${toRelease[0].id}` });
  const main = funds.find((x) => x.id === "eas") ?? funds[0];
  const isFoundation = f.type === "Foundation";
  const quick = [
    { t: "Discover athletes", to: "fdiscover?athletes", icon: Search },
    { t: "Discover funding requests and teams", to: "fdiscover?requests", icon: HandHeart },
    ...(f.type === "Individual sponsor" ? [] : [{ t: "Publish a sports funding opportunity", to: "opps", icon: Megaphone }]),
    { t: "Manage funding and track progress", to: "portfolio", icon: FileText },
  ];
  const pt = funderTotals(w, fid);
  // Each overview figure opens its records, fund by fund (commercial money is never in these totals).
  const ovSource = (k: "committed" | "paid"): Source => ({
    title: k === "committed" ? "Committed, by fund (development and programme)" : "Paid, by fund (simulated payments)",
    rows: Object.values(w.funds)
      .filter((fd) => fd.funderId === fid && BEHAVIOUR[fd.type] !== "commercial")
      .map((fd) => {
        const gs = Object.values(w.agreements).filter((g) => g.fundId === fd.id && counts(g));
        return { label: fd.name, value: fmt(sum(gs.map((g) => (k === "committed" ? g.amount : released(w, g.id))))) };
      })
      .filter((r) => r.value !== "$0"),
  });
  // An individual sponsor is one person: "you", never "we".
  const solo = f.type === "Individual sponsor";
  const overviewPhoto = f.type === "Individual sponsor" ? "im-19-individual-sponsor.png" : "im-06-funder-visit.png";
  return (
    <div className="pb-8">
      <HeroBand file={overviewPhoto} phone="none" className="max-w-[64rem]">
        <p className="label text-signal">{f.name} · Overview</p>
        <h1 className="text-title mt-2">What needs you, {persona.name.split(" ")[0]}?</h1>
        <p className="text-lead mt-3 max-w-[36rem] text-muted">
          Your funding at a glance: decisions waiting for you, money promised and paid, and how athletes and programmes are using it.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button type="button" className={btn("secondary")} onClick={() => setAsk(true)}>
            <MessageCircleQuestion className="size-4" aria-hidden="true" /> Ask Revivo about {solo ? "your" : "our"} funding
          </button>
          <SimulatedAI />
        </div>
      </HeroBand>
      <FunderAskRevivo open={ask} onClose={() => setAsk(false)} persona={persona} />
      <Section title={`Needs you · ${Math.min(needs.length, 3)}`}>
        {needs.length === 0 ? <Empty>Nothing needs you right now. Discover athletes and requests, or follow your funding.</Empty> : (
          <ul>
            {needs.slice(0, 3).map((n, i) => (
              <Row key={n.t}>
                <div>
                  <p className="font-medium">{n.t}</p>
                  <p className="text-small text-subtle">{n.d}</p>
                </div>
                <a href={`#/app/${persona.id}/${n.to}`} className={btn(i === 0 ? "primary" : "secondary", "shrink-0")}>
                  {n.a} <ArrowRight className="size-4" aria-hidden="true" />
                </a>
              </Row>
            ))}
          </ul>
        )}
      </Section>
      {/* Phones: the photo comes after "Needs you", so the most important task stays at the top. */}
      <PhonePhoto file={overviewPhoto} className="mt-8" />
      <Section title="Find and fund sport">
        <ul className="grid gap-x-8 sm:grid-cols-2">
          {quick.map((q) => (
            <li key={q.t} className="border-b border-line">
              <a href={`#/app/${persona.id}/${q.to}`} className="group flex min-h-14 items-center gap-3 py-3">
                <q.icon className="size-5 shrink-0 text-muted group-hover:text-signal" aria-hidden="true" />
                <span className="flex-1 font-medium group-hover:text-signal">{q.t}</span>
                <ChevronRight className="size-4 text-subtle" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </Section>
      {isFoundation && main && (
        <Section title={main.name}>
          <p className="mt-3 text-small text-subtle">This scholarship round only. Your other funding is in the totals below.</p>
          <div className="mt-4">
            {(() => {
              const t = fundTotals(w, main.id);
              return <FundBar announced={t.announced} committed={t.committed} reserved={t.held} />;
            })()}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <p className="text-small text-subtle">Committed means approved and accepted.</p>
            <a href={`#/app/${persona.id}/portfolio`} className={btn("secondary", "min-h-10")}>
              <FileText className="size-4" aria-hidden="true" /> Reports
            </a>
          </div>
        </Section>
      )}
      <section className="mt-10 grid gap-8 border-t border-line pt-8 md:grid-cols-3">
        <h2 className="label -mb-4 text-subtle md:col-span-3">{solo ? "All your funding" : "All your funding, every fund together"}</h2>
        <Answer q={isFoundation ? "Who has applied?" : solo ? "Who are you supporting?" : "Who are we supporting?"} a={isFoundation ? plural(Object.values(w.applications).filter((a) => w.funds[w.opps[a.oppId].fundId].funderId === fid && a.status !== "draft").length, "application") : plural(pt.count, "agreement")} d={isFoundation ? "Through Discover, your share link and nominations" : "Athletes, teams and clubs"} />
        <Answer q={solo ? "How much have you committed?" : "How much have we committed?"} a={fmt(pt.devCommitted + pt.progCommitted)} d={pt.comCommitted ? `Plus ${fmt(pt.comCommitted)} commercial, kept apart` : "Development and programme funding"} source={ovSource("committed")} />
        <Answer q={solo ? "How much have you paid?" : "How much have we paid?"} a={fmt(pt.released)} d={`Payments recorded (simulated); the people ${solo ? "you" : "we"} fund confirm they arrived`} source={ovSource("paid")} />
      </section>
      <p className="mt-8 text-small text-subtle">Delivery and spending records show what was delivered and spent; they do not on their own prove social impact.</p>
    </div>
  );
}

function funderTotals(w: World, fid: string) {
  const ags = Object.values(w.agreements).filter((g) => w.funds[g.fundId].funderId === fid && counts(g));
  const by = (b: string) => sum(ags.filter((g) => BEHAVIOUR[w.funds[g.fundId].type] === b).map((g) => g.amount));
  return { count: ags.length, devCommitted: by("development"), progCommitted: by("programme"), comCommitted: by("commercial"), released: sum(ags.filter((g) => BEHAVIOUR[w.funds[g.fundId].type] !== "commercial").map((g) => released(w, g.id))) };
}

function Answer({ q, a, d, source }: { q: string; a: string; d: string; source?: Source }) {
  return (
    <div>
      <Label>{q}</Label>
      <p className="text-stat mt-2">
        <SeeSource name={q} source={source}>{a}</SeeSource>
      </p>
      <p className="mt-1 text-small text-subtle">{d}</p>
    </div>
  );
}

/* ================================================================= Discover */

const BRIEFS: Record<string, { text: string; chips: string[] }> = {
  kenji: { text: "para athletes needing equipment, any region", chips: ["Para athletics", "Equipment", "Any region", "Verified evidence"] },
  lucy: { text: "adult sprinters competing nationally, open to a kit partnership", chips: ["Athletics: sprint", "Adults only", "Open to commercial partners", "National level"] },
  marcus: { text: "clubs and athletes needing equipment or travel", chips: ["Equipment", "Organisation", "Any region", "Verified evidence"] },
};
const SPORTS = ["Archery", "Athletics", "Athletics: sprint", "Badminton", "Boxing", "Canoeing", "Cycling", "Fencing", "Football", "Judo", "Rowing", "Swimming", "Table tennis", "Triathlon", "Wheelchair basketball", "Wheelchair racing"];
const VOCAB = ["Para athletics", "Equipment", "Travel", "Coaching", "Any region", ...REGIONS, "Verified evidence", "Adults only", "National level", "Organisation", "Open to commercial partners", ...SPORTS];

/**
 * Brief → filters (the matching experience, Simulated AI). A fixed word list turns the brief into editable filters;
 * nothing is inferred about any person and the order of results stays the deterministic match count (docs/02 §9.4).
 */
export function briefToChips(text: string): string[] {
  const t = ` ${text.toLowerCase()} `;
  const has = (...ws: string[]) => ws.some((x) => t.includes(x));
  const out: string[] = [];
  const add = (c: string) => !out.includes(c) && out.push(c);
  const sportWords: [string, string[]][] = [
    ["Athletics: sprint", ["sprint"]], ["Athletics", ["athletics", "runner", "track and field"]], ["Archery", ["archer"]], ["Badminton", ["badminton"]], ["Boxing", ["box"]], ["Canoeing", ["canoe", "kayak", "paddl"]],
    ["Cycling", ["cycl", "bike", "bmx"]], ["Fencing", ["fenc"]], ["Football", ["football", "soccer"]], ["Judo", ["judo"]], ["Rowing", ["rowing", "rower", "scull"]], ["Swimming", ["swim"]],
    ["Table tennis", ["table tennis", "ping pong"]], ["Triathlon", ["triath"]], ["Wheelchair basketball", ["wheelchair basketball"]], ["Wheelchair racing", ["wheelchair rac", "racing wheelchair"]],
  ];
  for (const [chip, ws] of sportWords) if (has(...ws)) add(chip);
  if (has("para ", "paralymp", "wheelchair", "disab")) add("Para athletics");
  for (const r of REGIONS) if (has(r.split(" ")[0].toLowerCase())) add(r);
  if (has("any region", "anywhere", "any area", "nationwide")) add("Any region");
  if (has("equipment", "kit ", "gear", "wheels", "bike", "bow", "boat")) add("Equipment");
  if (has("travel", "transport", "flight", "trip")) add("Travel");
  if (has("coach", "training", "camp")) add("Coaching");
  if (has("adult", "over 18", "senior")) add("Adults only");
  if (has("national", "international", "elite", "competing")) add("National level");
  if (has("club", "team", "academy", "organisation", "organization", "community")) add("Organisation");
  if (has("commercial", "partner", "sponsorship", "brand", "ambassador")) add("Open to commercial partners");
  if (has("verified", "evidence", "proven results")) add("Verified evidence");
  return out.length ? out : ["Any region", "Verified evidence"];
}

export function FunderDiscover({ persona }: { persona: Person }) {
  const { world: w } = useStore();
  const fid = persona.funderId!;
  const f = w.funders[fid];
  const isIndividual = f.type === "Individual sponsor";
  const commercial = f.accepts === "commercial";
  // A new funder starts from the sport it chose when joining, so the first results already mean something.
  const brief = BRIEFS[persona.id] ?? { text: "", chips: f.sports && f.sports !== "Any sport" && SPORT_CHIPS.includes(f.sports) ? [f.sports, "Verified evidence"] : ["Any region", "Verified evidence"] };
  const [tab, setTab] = useState<"athletes" | "requests" | "teams" | "shortlist">(location.hash.includes("requests") ? "requests" : location.hash.includes("athletes") ? "athletes" : commercial ? "athletes" : persona.id === "marcus" ? "teams" : "requests");
  const [chips, setChips] = useState(brief.chips);
  const [briefText, setBriefText] = useState(brief.text);
  const act = useAction(persona.id);
  const short = w.shortlists[fid] ?? [];
  const reqs = Object.values(w.requests)
    .filter((r) => r.status === "open" && r.discoverable && requestTotals(w, r.id).remaining > 0)
    .filter((r) => !r.minor || mayReachMinors(w, persona.id))
    .filter((r) => !(r.ownerKind === "athlete" && w.blocks.some((b) => b.athleteId === r.ownerId && b.funderId === fid)));
  // "Any region" sets no limit, so it is never a reason; a sport named in the brief counts first.
  const real = chips.filter((c) => c !== "Any region");
  const sportChips = real.filter((c) => SPORT_CHIPS.includes(c));
  const score = (tags: string[]) => {
    const m = fit(real, tags);
    return { m, miss: real.filter((c) => !m.includes(c)), sport: sportChips.length ? Number(m.some((c) => sportChips.includes(c))) : 0 };
  };
  const rows = reqs.map((r) => ({ r, ...score([...r.tags, r.sport, r.region]) })).sort((a, b) => b.sport - a.sport || b.m.length - a.m.length || a.r.neededMonth.localeCompare(b.r.neededMonth));
  const athletes = Object.values(w.athletes)
    .filter((a) => !a.minor && a.discoverable)
    .map((a) => ({ a, ...score([...a.tags, a.sport, a.region]) }))
    .sort((x, y) => y.sport - x.sport || y.m.length - x.m.length || x.a.name.localeCompare(y.a.name))
    .slice(0, 12);
  const athleteCount = Object.values(w.athletes).filter((a) => !a.minor && a.discoverable).length;
  const athleteRows = rows.filter((x) => x.r.ownerKind === "athlete");
  const teamRows = rows.filter((x) => x.r.ownerKind === "org");
  const canShort = persona.perms.includes("Review");
  const toggle = (id: string) => act.run("toggleShortlist", { targetId: id });
  return (
    <div className="pb-8">
      <PageHead eyebrow={`Discover · ${f.name}`} title="Who could we support?" lead="Athletes who chose to be discoverable, funding requests, and teams and initiatives participating on Revivo Impact, from any organisation or none." />
      <div className="rounded-[10px] border border-line-strong p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label htmlFor="brief" className="label text-subtle">
            Describe what you want to support
          </label>
          <SimulatedAI />
        </div>
        <form
          className="mt-2 flex flex-col gap-2 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            setChips(briefToChips(briefText));
          }}
        >
          <input id="brief" value={briefText} onChange={(e) => setBriefText(e.target.value)} placeholder="For example: judo athletes in Coastal Region needing travel" className={cn(inputCls, "sm:flex-1")} />
          <button type="submit" className={btn("secondary", "shrink-0")}>
            Turn into filters
          </button>
        </form>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-small text-subtle">Filters from your brief (edit freely):</span>
          {chips.map((c) => (
            <span key={c} className="inline-flex min-h-9 items-center gap-1 rounded-full border border-line-strong pr-1 pl-3 text-small">
              {c}
              <button type="button" aria-label={`Remove filter ${c}`} onClick={() => setChips(chips.filter((x) => x !== c))} className="inline-flex size-8 items-center justify-center rounded-full hover:bg-surface-2">
                <X className="size-3" aria-hidden="true" />
              </button>
            </span>
          ))}
          <label className="sr-only" htmlFor="add-chip">
            Add a filter
          </label>
          <select id="add-chip" className="h-9 rounded-full border border-line-strong bg-canvas px-3 text-small" value="" onChange={(e) => e.target.value && setChips([...chips, e.target.value])}>
            <option value="">Add a filter…</option>
            {VOCAB.filter((v) => !chips.includes(v)).map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </div>
        <p className="mt-2 text-small text-subtle">Filters are limited to sport, support, region, level and evidence: never appearance, popularity or a &ldquo;talent&rdquo; score.</p>
      </div>
      <div className="mt-6">
        <Tabs label="Discover" value={tab} onChange={setTab} tabs={[{ id: "athletes", label: "Athletes", count: athleteCount }, { id: "requests", label: "Funding requests", count: athleteRows.length }, { id: "teams", label: "Teams & initiatives", count: teamRows.length }, { id: "shortlist", label: "Shortlist", count: short.length }]} />
      </div>
      <p className="mt-5 text-small text-subtle">Ordered by how many of your filters match, then by date needed. Never by popularity, followers or any score of a person.{isIndividual && persona.enhancedCheck ? " You hold an enhanced safeguarding check (simulated), so anonymised requests for young athletes appear; your offers to them are reviewed by the platform first." : ""}</p>
      <Message error={act.error} />
      {real.length > 1 && (tab === "requests" || tab === "teams" || tab === "athletes") && !(tab === "athletes" ? athletes : tab === "teams" ? teamRows : athleteRows).some((x) => x.miss.length === 0) && (
        <p className="mt-2 text-small text-muted">Nothing matches all {real.length} filters; the closest come first, each showing what it lacks.</p>
      )}
      {tab === "requests" && <ul className="mt-2 border-t border-line">{athleteRows.map(({ r, m, miss }) => <RequestRow key={r.id} w={w} r={r} m={m} miss={miss} persona={persona} short={short.includes(r.id)} toggle={canShort ? toggle : undefined} />)}</ul>}
      {tab === "teams" && <ul className="mt-2 border-t border-line">{teamRows.map(({ r, m, miss }) => <RequestRow key={r.id} w={w} r={r} m={m} miss={miss} persona={persona} short={short.includes(r.id)} toggle={canShort ? toggle : undefined} />)}</ul>}
      {tab === "athletes" && (
        <ul className="mt-2 border-t border-line">
          {athletes.map(({ a, m, miss }) => (
            <li key={a.id} className="grid gap-3 border-b border-line py-4 md:grid-cols-[1.4fr_1.2fr_1.2fr_auto] md:items-center md:gap-6">
              <a href={`#/app/${persona.id}/athlete/${a.id}`} className="group">
                <span className="flex items-center gap-2 font-display text-xl font-bold group-hover:text-signal">
                  {a.name} <ChevronRight className="size-4 text-subtle" aria-hidden="true" />
                </span>
                <span className="text-small text-subtle">
                  {a.sport} · {a.discipline !== a.sport ? `${a.discipline} · ` : ""}
                  {a.region} · {a.age}
                </span>
              </a>
              <span className="text-small">
                <span className="block">{a.level}</span>
                <span className="block text-subtle">{a.facts.filter((x) => x.state === "verified" || x.state === "confirmed").length} verified or confirmed · {a.facts.filter((x) => x.state === "self").length} self-reported</span>
              </span>
              <span className="text-small">
                {a.openToCommercial && <Chip kind="info">Open to commercial partners</Chip>}
                <MatchLine m={m} miss={miss} />
              </span>
              {canShort ? <ShortBtn on={short.includes(a.id)} onClick={() => toggle(a.id)} /> : <span />}
            </li>
          ))}
          <li className="py-3 text-small text-subtle">
            <Lock className="mr-1 inline size-3.5" aria-hidden="true" /> Showing 12 of {athleteCount} discoverable adults. Athletes under 18 are never shown as profiles.
          </li>
        </ul>
      )}
      {tab === "shortlist" && (
        <ul className="mt-2 border-t border-line">
          {short.length === 0 ? <Empty li>Nothing shortlisted yet. Only your organisation sees this list.</Empty> : short.map((id) => {
            const r = w.requests[id];
            const a = w.athletes[id];
            return (
              <Row key={id}>
                <a className="font-medium hover:text-signal" href={`#/app/${persona.id}/${r ? `request/${id}` : `athlete/${id}`}`}>
                  {r ? `${r.ownerKind === "org" ? w.orgs[r.ownerId].name : athleteLabel(w, r.ownerId, persona)} · ${r.title}` : a?.name}
                </a>
                {canShort && <ShortBtn on onClick={() => toggle(id)} />}
              </Row>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function ShortBtn({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button type="button" aria-pressed={on} onClick={onClick} className={btn("secondary", cn("min-h-11 justify-self-start px-4 font-sans text-small font-medium tracking-normal", on && "border-ink bg-surface-2"))}>
      <Star className={cn("size-4", on && "fill-current text-ok")} aria-hidden="true" /> <span>{on ? "Shortlisted" : "Shortlist"}</span>
    </button>
  );
}

/** Sport chips the brief can produce: a named sport is the first thing a funder means. */
const SPORT_CHIPS = ["Athletics: sprint", "Athletics", "Archery", "Badminton", "Boxing", "Canoeing", "Cycling", "Fencing", "Football", "Judo", "Rowing", "Swimming", "Table tennis", "Triathlon", "Wheelchair basketball", "Wheelchair racing", "Para athletics"];

/** Why a row appears: the filters it meets, and the ones it does not ("Not: …"), never a score of a person. */
function MatchLine({ m, miss }: { m: string[]; miss: string[] }) {
  if (!m.length && !miss.length) return <span className="mt-1 block text-subtle">No filters set: every participating request is shown</span>;
  return (
    <span className="mt-1 block text-subtle">
      {m.length ? `Meets: ${m.join(" · ").toLowerCase()}` : "Meets none of your filters"}
      {miss.length > 0 && m.length > 0 && <span className="block">Not: {miss.join(" · ").toLowerCase()}</span>}
    </span>
  );
}

function RequestRow({ w, r, m, miss, persona, short, toggle }: { w: World; r: World["requests"][string]; m: string[]; miss: string[]; persona: Person; short: boolean; toggle?: (id: string) => void }) {
  const t = requestTotals(w, r.id);
  const label = r.ownerKind === "org" ? w.orgs[r.ownerId].name : r.minor ? `${r.sport === "Swimming" ? "Swimmer" : r.sport} · ${r.ageGroup}` : w.athletes[r.ownerId].name;
  return (
    <li className="grid gap-3 border-b border-line py-4 md:grid-cols-[1.4fr_1.4fr_1fr_auto] md:items-center md:gap-6">
      <a href={`#/app/${persona.id}/request/${r.id}`} className="group block">
        <span className="flex flex-wrap items-center gap-2 font-display text-xl font-bold group-hover:text-signal">
          {r.minor && <Lock className="size-4 text-subtle" aria-label="Shown without names: under 18" />}
          {label}
          <ChevronRight className="size-4 text-subtle" aria-hidden="true" />
          {m.length > 0 && <span className="rounded-full border border-line-strong px-2 py-0.5 font-sans text-small font-medium text-muted">Matches {m.length} of {m.length + miss.length}</span>}
        </span>
        <span className="text-small text-subtle">
          {r.sport} · {r.region}
          {r.ownerKind === "org" ? " · organisation" : ""}
          {r.noClub ? " · no club, represented by guardian" : ""}
        </span>
      </a>
      <span className="text-small">
        <span className="block">{r.title}</span>
        <span className="mt-1 block max-w-[18rem]">
          <NeedBar requested={t.requested} pledged={t.pledged} received={t.received} otherSources={t.other} held={t.heldApp + t.offered} compact />
        </span>
      </span>
      <span className="text-small text-muted">
        {r.verifiedLabel} · needed by {r.minor ? r.neededMonth : r.neededBy}
        <MatchLine m={m} miss={miss} />
      </span>
      {toggle ? <ShortBtn on={short} onClick={() => toggle(r.id)} /> : <span />}
    </li>
  );
}

/* ======================================================== Funding request */

export function RequestPage({ persona, id }: { persona: Person; id: string }) {
  const { world: w } = useStore();
  const r = w.requests[id];
  const fid = persona.funderId!;
  const funds = fundsOf(w, fid).filter((f) => BEHAVIOUR[f.type] === "development" && f.id !== "eas");
  const [open, setOpen] = useState(false);
  const t = r ? requestTotals(w, id) : null;
  // An offer answering a support ask starts from what was asked: that line and that amount.
  const ask = r ? Object.values(w.asks).find((x) => x.requestId === r.id && x.funderId === fid && x.status === "sent") : undefined;
  const [lineId, setLineId] = useState(ask?.lineId ?? r?.lines[0].id ?? "l1");
  const line = t?.lines.find((l) => l.id === lineId);
  const [amount, setAmount] = useState(String(ask ? ask.amount : r?.minor ? 2600 : Math.min(line?.remaining ?? 0, 2500)));
  const [fundId, setFundId] = useState(funds[0]?.id ?? "");
  // A suggested reason the funder reads and edits (it becomes part of the record), never an empty field.
  // The reason is the funder's own words; a suggestion is one tap away, never pre-filled into the record.
  const [reason, setReason] = useState("");
  const suggested = r?.minor ? "Competition travel to a verified national qualification." : `${r?.lines[0]?.label ?? "Support"} for a verified ${r?.ownerKind === "org" ? "club" : "athlete"}, within our published criteria.`;
  const act = useAction(persona.id);
  if (!r || !t) return <Empty>This request is not available.</Empty>;
  const mineAny = Object.values(w.offers).some((o) => o.requestId === id && w.funds[o.fundId].funderId === fid);
  if (r.minor && !mayReachMinors(w, persona.id) && !mineAny) return <Empty>Requests for athletes under 18 are shown only to verified organisations and to individual sponsors with an enhanced safeguarding check.</Empty>;
  if ((!r.discoverable || (r.ownerKind === "athlete" && w.blocks.some((b) => b.athleteId === r.ownerId && b.funderId === fid))) && !mineAny) return <Empty>This request is no longer in Discover.</Empty>;
  const fund = w.funds[fundId] as Fund | undefined;
  const label = r.ownerKind === "org" ? w.orgs[r.ownerId].name : r.minor ? `${r.sport === "Swimming" ? "Swimmer" : r.sport} · ${r.ageGroup}` : w.athletes[r.ownerId].name;
  const ftot = fund ? fundTotals(w, fund.id) : null;
  const mine = Object.values(w.offers).filter((o) => o.requestId === id && w.funds[o.fundId].funderId === fid);
  return (
    <div className="pb-8">
      <PageHead eyebrow={r.minor ? "Funding request · anonymised (under 18)" : `Funding request · ${r.visibility}`} title={r.minor ? label : `${label}: ${r.title.toLowerCase()}`} lead={r.minor ? `${r.title} · ${r.region} · needed in ${r.neededMonth}. Published by the athlete's ${r.noClub ? "guardian (no club)" : "guardian"}. Names, club, school, exact dates and photos are never shown.` : `${r.sport} · ${r.region} · needed by ${r.neededBy}.`} />
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.3fr_1fr] [&>*]:min-w-0">
        <section>
          <Label>How much is still missing</Label>
          <div className="mt-3">
            <NeedBar requested={t.requested} pledged={t.pledged} received={t.received} otherSources={t.other} held={t.heldApp + t.offered} />
          </div>
          {!r.minor && (
            <>
              <h2 className="label mt-8 text-subtle">Breakdown</h2>
              <table className="mt-2 w-full text-table">
                <tbody>
                  {t.lines.map((l) => (
                    <tr key={l.id} className="h-11 border-b border-line">
                      <td>{l.label}</td>
                      <td className="text-right tabular-nums">{fmt(l.amount)}</td>
                      <td className="pl-4 text-right text-small text-subtle">{fmt(l.remaining)} still needed</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
          <h2 className="label mt-8 text-subtle">Sporting evidence</h2>
          <ul className="mt-2 space-y-2">
            {r.minor || r.ownerKind === "org" ? (
              <li>
                <Chip kind="verified">{r.verifiedLabel}</Chip>
              </li>
            ) : (
              w.athletes[r.ownerId].facts.filter((f) => f.visibility === "discoverable").map((f) => (
                <li key={f.id}>
                  <Chip kind={f.state === "verified" || f.state === "confirmed" ? "verified" : "self"}>{`${f.value} · ${stateLabel(f)}`}</Chip>
                </li>
              ))
            )}
          </ul>
          {r.safeguarding && (
            <p className="mt-6 flex gap-2 text-small text-subtle">
              <Lock className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> {r.safeguarding}. &ldquo;See source&rdquo; on this card never opens documents.
            </p>
          )}
        </section>
        <aside className="rounded-[10px] border border-line-strong p-5 max-lg:order-first">
          <UsersRound className="size-6 text-signal" aria-hidden="true" />
          <h2 className="text-subtitle mt-3">Offer support</h2>
          <p className="mt-2 text-small text-muted">{r.minor ? "This offer goes to the athlete's guardian. You cannot contact the athlete directly; you see the first name only if the guardian accepts." : "They can accept or decline. Contact details are shared only once they accept."}</p>
          {mine.map((o) => (
            <p key={o.id} role="status" className="mt-4 flex gap-2 text-signal">
              <CircleCheck className="mt-0.5 size-5 shrink-0" aria-hidden="true" /> {fmt(o.amount)} offered · {o.status === "held" ? "waiting for acceptance" : o.status === "accepted" ? "accepted" : o.status === "safeguarding" ? "in platform safeguarding review" : o.status === "second-approval" ? "waiting for a second approver at your organisation" : o.status === "withdrawn" ? "withdrawn" : "declined"}
            </p>
          ))}
          {funds.length === 0 || t.remaining === 0 ? (
            <p className="mt-4 text-small text-subtle">{t.remaining === 0 ? "Nothing is still needed: fully promised, or held for offers and applications in progress." : "Your organisation has no development fund for direct offers."}</p>
          ) : (
            <Button className="mt-4 w-full" onClick={() => setOpen(true)} arrow>
              Offer support
            </Button>
          )}
          {fund && ftot && (
            <p className="mt-4 text-small text-subtle">
              {fund.name} · {policyText(fund.policy).toLowerCase()}
              {fund.delegatedLimit ? ` · your limit ${fmt(fund.delegatedLimit)}` : ""} · available {fmt(ftot.available)}
            </p>
          )}
        </aside>
      </div>
      <Panel open={open} onClose={() => setOpen(false)} title="Offer support" eyebrow={fund ? `${fund.name} · ${fund.type}` : "Offer"}>
        {funds.length > 1 && (
          <Field label="From which fund" htmlFor="of-fund">
            <select id="of-fund" className={inputCls} value={fundId} onChange={(e) => setFundId(e.target.value)}>
              {funds.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.name}
                </option>
              ))}
            </select>
          </Field>
        )}
        {t.lines.length > 1 && (
          <Field label="For which line" htmlFor="of-line">
            <select id="of-line" className={inputCls} value={lineId} onChange={(e) => setLineId(e.target.value)}>
              {t.lines.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.label}: {fmt(l.remaining)} still needed
                </option>
              ))}
            </select>
          </Field>
        )}
        <Field label="Amount (USD)" hint={`Still needed on this line: ${fmt(line?.remaining ?? 0)}. Offers are capped at what is still needed.`} htmlFor="of-amt">
          <input id="of-amt" inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} className={cn(inputCls, "max-w-[12rem]")} />
          {fund?.delegatedLimit && Number(amount.replace(/\D/g, "")) > fund.delegatedLimit && <p className="mt-2 text-small text-amber">Above your {fmt(fund.delegatedLimit)} limit: a colleague with Approve must agree before it is sent.</p>}
          {fund && fund.policy !== "Simple" && <p className="mt-2 text-small text-subtle">This fund needs a second person with Approve to agree before any offer is sent.</p>}
        </Field>
        <Field label="Reason, linked to the fund's published criteria" htmlFor="of-reason" hint="Required: it becomes part of the selection record.">
          <textarea id="of-reason" rows={2} value={reason} onChange={(e) => setReason(e.target.value)} placeholder={r.minor ? "Competition travel to a verified national qualification." : "Equipment for a verified adult athlete competing nationally."} className="w-full rounded-[6px] border border-control bg-surface-2 p-3 text-ink" />
          {!reason && (
            <button type="button" className="mt-1 inline-flex min-h-9 items-center text-small underline underline-offset-4 hover:text-signal" onClick={() => setReason(suggested)}>
              Use a suggested reason, then edit it
            </button>
          )}
        </Field>
        <Button className="mt-6" onClick={() => act.run("makeOffer", { offerId: `of-${fid}-${Date.now()}`, fundId, recipientKind: r.ownerKind, recipientId: r.ownerId, requestId: id, lineId, amount: Number(amount.replace(/\D/g, "")), reason }, "Offer sent (simulated).") && setOpen(false)}>
          Send offer
        </Button>
        <Message error={act.error} />
        <p className="mt-3 text-small text-subtle">These checks are rules, not AI: the cap, the fund&rsquo;s money, your approval limit and, for young athletes, safeguarding.</p>
      </Panel>
    </div>
  );
}

/* ================================================ Athlete (funder's view) */

export function AthleteForFunder({ persona, id }: { persona: Person; id: string }) {
  const { world: w } = useStore();
  const a = w.athletes[id];
  const fid = persona.funderId!;
  const f = w.funders[fid];
  const commercial = f.accepts === "commercial";
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("6000");
  const act = useAction(persona.id);
  if (!a || a.minor || !a.discoverable) return <Empty>This profile is not discoverable.</Empty>;
  const interest = Object.values(w.interests).find((x) => x.athleteId === id && x.funderId === fid);
  const req = Object.values(w.requests).find((r) => r.ownerId === id && r.status === "open" && r.discoverable);
  const comFund = Object.values(w.funds).find((x) => x.funderId === fid && x.type === "Sponsorship agreement");
  const offer = Object.values(w.offers).find((o) => o.recipientId === id && w.funds[o.fundId].funderId === fid);
  return (
    <div className="pb-8">
      <PageHead eyebrow="Athlete · open to sponsors" title={a.name} lead={`${a.sport} · ${a.discipline} · ${a.region} · ${a.age}. Only the facts ${a.name.split(" ")[0]} chose to make discoverable; never contact details.`} />
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.3fr_1fr] [&>*]:min-w-0">
        <section>
          <Label>Sporting facts</Label>
          <ul className="mt-2 border-t border-line">
            {a.facts.filter((x) => x.visibility === "discoverable").map((x) => (
              <li key={x.id} className="border-b border-line py-3">
                <p className="font-medium">{x.value}</p>
                <Chip kind={x.state === "verified" || x.state === "confirmed" ? "verified" : "self"}>{stateLabel(x)}</Chip>
              </li>
            ))}
            {a.facts.filter((x) => x.visibility === "discoverable").length === 0 && <Empty li>Level: {a.level}. Verified facts are shared on application.</Empty>}
          </ul>
          {commercial && a.commercial && (
            <>
              <h2 className="label mt-8 text-subtle">Commercial profile (self-reported; for sponsorship only)</h2>
              <dl className="mt-2 border-t border-line text-small">
                {[
                  ["Social media", a.commercial.social.join(" · ")],
                  ["Audience", a.commercial.audience],
                  ["Previous partnerships", a.commercial.partnerships.join(" · ")],
                  ["Promotional activities", a.commercial.activities.join(" · ")],
                ].map(([k, v]) => (
                  <div key={k} className="grid gap-1 border-b border-line py-3 sm:grid-cols-[11rem_1fr]">
                    <dt className="text-subtle">{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-2 text-small text-subtle">Not verified, not analysed, and never used for development or scholarship funding.</p>
            </>
          )}
        </section>
        <aside className="rounded-[10px] border border-line-strong p-5">
          <HandHeart className="size-6 text-signal" aria-hidden="true" />
          <h2 className="text-subtitle mt-3">{commercial ? "Propose a partnership" : "Support this athlete"}</h2>
          {!interest ? (
            <ActionButton className="mt-4" actor={persona.id} type="expressInterest" args={{ interestId: `int-${fid}-${id}`, athleteId: id, reason: commercial ? "We support adult athletes competing nationally." : "We support athletes in your sport and region." }} success="Interest sent. The athlete can share more or say no thanks.">
              Express interest
            </ActionButton>
          ) : (
            <p className="mt-3 text-small text-muted">Interest sent · {interest.status === "shared" ? `${a.name.split(" ")[0]} shared more` : interest.status === "declined" ? "declined" : "waiting for an answer"}</p>
          )}
          {commercial && comFund && interest?.status === "shared" && !offer && (
            <Button className="mt-4 w-full" onClick={() => setOpen(true)} arrow>
              Propose a sponsorship agreement
            </Button>
          )}
          {offer && <p className="mt-4 flex gap-2 text-signal"><CircleCheck className="size-5" aria-hidden="true" /> {fmt(offer.amount)} {w.funds[offer.fundId].type.toLowerCase()} · {offer.status === "accepted" ? "accepted" : "waiting for acceptance"}</p>}
          {!commercial && req && (
            <a href={`#/app/${persona.id}/request/${req.id}`} className={btn("secondary", "mt-4 w-full")}>
              See the funding request
            </a>
          )}
        </aside>
      </div>
      <Panel open={open} onClose={() => setOpen(false)} title="Sponsorship agreement" eyebrow={`${comFund?.name} · commercial`}>
        <Field label="Amount for 12 months (USD)" htmlFor="sp-amt">
          <input id="sp-amt" inputMode="numeric" className={cn(inputCls, "max-w-[12rem]")} value={amount} onChange={(e) => setAmount(e.target.value)} />
        </Field>
        <p className="mt-4 font-medium">Deliverables (up to 3)</p>
        <ul className="mt-1 space-y-1 text-small text-muted">
          <li>· Wear partner kit at 4 meets</li>
          <li>· One coaching clinic at a community club by Thu 30 Sep</li>
          <li>· One content day by Fri 31 Mar 2028</li>
        </ul>
        <p className="mt-3 text-small text-subtle">Payments: half on signing, half after deliverables 1 and 2 are accepted. Reported only in commercial totals.</p>
        <Button className="mt-6" onClick={() => comFund && act.run("makeOffer", { offerId: `of-${fid}-${id}`, fundId: comFund.id, recipientKind: "athlete", recipientId: id, amount: Number(amount.replace(/\D/g, "")), reason: "Adult national-level athlete whose season plan fits our partnerships.", deliverables: ["Wear partner kit at 4 meets", "One coaching clinic by Thu 30 Sep", "One content day by Fri 31 Mar 2028"] }, "Proposal sent.") && setOpen(false)}>
          Send proposal
        </Button>
        <Message error={act.error} />
      </Panel>
    </div>
  );
}

/* ============================================================ Opportunities */

export function FunderOpportunities({ persona }: { persona: Person }) {
  const { world: w } = useStore();
  const fid = persona.funderId!;
  const funds = fundsOf(w, fid).filter((f) => BEHAVIOUR[f.type] !== "commercial");
  const opps = Object.values(w.opps).filter((o) => w.funds[o.fundId].funderId === fid);
  const [title, setTitle] = useState("");
  const [sport, setSport] = useState("");
  const [purpose, setPurpose] = useState("");
  const [closes, setCloses] = useState("2027-07-30");
  const [fundId, setFundId] = useState(funds[0]?.id ?? "");
  const act = useAction(persona.id);
  return (
    <div className="pb-8">
      <PageHead eyebrow="Opportunities" title="What are we offering, and to whom?" lead="Each opportunity appears in Discover for every athlete and organisation it suits, and has its own share link." />
      <Section title="Our opportunities">
        <ul>
          {opps.map((o) => (
            <Row key={o.id}>
              <div>
                <p className="font-medium">{o.title}</p>
                <p className="text-small text-subtle">
                  {w.funds[o.fundId].type} · {o.amountLabel} · {o.status === "awaiting" ? `drafted by ${w.people[o.draftedBy!]?.name}` : `closes ${fmtDate(o.closes)}`} · {policyText(w.funds[o.fundId].policy).toLowerCase()}
                </p>
                {o.status === "awaiting" ? (
                  <details className="mt-2 text-small" open={persona.perms.includes("Approve") && o.draftedBy !== persona.id}>
                    <summary className="inline-flex min-h-9 cursor-pointer items-center underline underline-offset-4">What will be published</summary>
                    <dl className="mt-2 grid grid-cols-[8rem_1fr] gap-x-3 gap-y-1">
                      <dt className="text-subtle">Purpose</dt>
                      <dd>{o.purpose}</dd>
                      <dt className="text-subtle">Sports</dt>
                      <dd>{o.sportsLabel}</dd>
                      <dt className="text-subtle">Amount</dt>
                      <dd>
                        {o.amountLabel}
                        {o.awardsLabel ? ` · ${o.awardsLabel}` : ""}
                      </dd>
                      <dt className="text-subtle">Who can apply</dt>
                      <dd>{o.rules.length ? o.rules.map((r) => r.label).join("; ") : "Set by the fund's rules"}</dd>
                      <dt className="text-subtle">Dates</dt>
                      <dd>
                        Opens {fmtDate(o.opens)} · closes {fmtDate(o.closes)}
                        {o.decisions ? ` · decisions ${o.decisions}` : ""}
                      </dd>
                    </dl>
                  </details>
                ) : (
                  <p className="text-small text-subtle">Share link (simulated): revivo-impact.example/o/{o.id}</p>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Chip kind={o.status === "awaiting" ? "awaiting" : oppStatusAt(w, o) === "open" ? "current" : "self"}>{o.status === "awaiting" ? "Awaiting approval" : oppStatusAt(w, o).replace(/^./, (c) => c.toUpperCase())}</Chip>
                {o.status === "awaiting" && persona.perms.includes("Approve") && <ActionButton actor={persona.id} type="publishOpportunity" args={{ oppId: o.id }} success="Published. It now appears in Discover.">Publish</ActionButton>}
                {o.status !== "awaiting" && <a className={btn("secondary", "min-h-10")} href={`#/app/${persona.id}/apps?opp=${o.id}`}>Applications</a>}
              </div>
            </Row>
          ))}
          {opps.length === 0 && <Empty li>No opportunities yet. Draft one below.</Empty>}
        </ul>
      </Section>
      {funds.length > 0 && (
        <Section title="Draft a new opportunity">
          <div className="max-w-2xl">
            <Field label="Fund" htmlFor="co-fund">
              <select id="co-fund" className={inputCls} value={fundId} onChange={(e) => setFundId(e.target.value)}>
                {funds.map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.name} ({policyText(x.policy).toLowerCase()})
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Title" htmlFor="co-title">
              <input id="co-title" className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="For example: Para Athlete Travel Fund" />
            </Field>
            <Field label="Sport(s)" hint="Required: Revivo Impact is for sport" htmlFor="co-sport">
              <input id="co-sport" className={inputCls} value={sport} onChange={(e) => setSport(e.target.value)} />
            </Field>
            <Field label="Sporting purpose" hint="Required: for example competition travel, coaching, equipment" htmlFor="co-purpose">
              <input id="co-purpose" className={inputCls} value={purpose} onChange={(e) => setPurpose(e.target.value)} />
            </Field>
            <Field label="Applications close" htmlFor="co-closes">
              <select id="co-closes" className={cn(inputCls, "max-w-xs")} value={closes} onChange={(e) => setCloses(e.target.value)}>
                {["2027-06-30", "2027-07-30", "2027-08-31", "2027-09-30"].map((d) => (
                  <option key={d} value={d}>
                    {fmtDate(d)}
                  </option>
                ))}
              </select>
            </Field>
            {w.funds[fundId] && <p className="mt-3 text-small text-subtle">From this fund: {w.funds[fundId].type.toLowerCase()}, up to {fmt(w.funds[fundId].max)} each, {policyText(w.funds[fundId].policy).toLowerCase()}. The type and maximum come from the fund.</p>}
            <Button className="mt-6" onClick={() => act.run("createOpportunity", { fundId, title, sport, purpose, amountLabel: `Up to ${fmt(w.funds[fundId].max)}`, closes }, "Drafted. A colleague who can approve publishes it.")}>
              Submit for approval
            </Button>
            <Message error={act.error} done={act.done} />
          </div>
        </Section>
      )}
    </div>
  );
}

/* ============================================================= Applications */

export function FunderApplications({ persona }: { persona: Person }) {
  const { world: w } = useStore();
  const fid = persona.funderId!;
  const q = new URLSearchParams(location.hash.split("?")[1] ?? "");
  const opps = Object.values(w.opps).filter((o) => w.funds[o.fundId].funderId === fid && o.status !== "awaiting");
  const [oppId, setOppId] = useState(q.get("opp") ?? opps[0]?.id ?? "");
  const [filter, setFilter] = useState<string>("all");
  const apps = Object.values(w.applications).filter((a) => a.oppId === oppId);
  const asks = Object.values(w.asks).filter((a) => a.funderId === fid);
  const offers = Object.values(w.offers).filter((o) => w.funds[o.fundId].funderId === fid && !o.light);
  const counts = (s: string[]) => apps.filter((a) => s.includes(a.status)).length;
  const shown = apps.filter((a) => filter === "all" || a.status === filter).sort((a, b) => Number(!!a.light) - Number(!!b.light));
  const isIndividual = w.funders[fid].type === "Individual sponsor";
  return (
    <div className="pb-8">
      <PageHead eyebrow={isIndividual ? "Asks & offers" : "Applications"} title={isIndividual ? "Who has asked, and what have I offered?" : "Who has applied or asked?"} />
      {!isIndividual && opps.length > 0 && (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <label htmlFor="pick-opp" className="text-small text-subtle">
              Opportunity
            </label>
            <select id="pick-opp" className={cn(inputCls, "h-11 max-w-md")} value={oppId} onChange={(e) => setOppId(e.target.value)}>
              {opps.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.title}
                </option>
              ))}
            </select>
            {apps.some((a) => a.status === "shortlisted") && persona.perms.includes("Approve") && (
              <a href={`#/app/${persona.id}/selection/${oppId}`} className={btn("primary")}>
                Decide offers <ArrowRight className="size-4" aria-hidden="true" />
              </a>
            )}
          </div>
          <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter by status">
            {[
              ["all", `All ${apps.length}`],
              ["submitted", `In review ${counts(["submitted", "info"])}`],
              ["shortlisted", `Shortlisted ${counts(["shortlisted"])}`],
              ["offered", `Offered ${counts(["offered", "accepted"])}`],
              ["noteligible", `Not eligible ${counts(["noteligible"])}`],
            ].map(([k, l]) => (
              <button key={k} type="button" aria-pressed={filter === k} onClick={() => setFilter(k)}>
                <FilterPill on={filter === k}>{l}</FilterPill>
              </button>
            ))}
          </div>
          <p className="mt-4 text-small text-subtle">{apps.filter((a) => a.nominatedBy).length} nominated · who qualifies is checked against the published rules · {w.funds[w.opps[oppId]?.fundId]?.policy === "Institutional" ? "two reviewers" : "one reviewer"} per application under this fund&rsquo;s rules</p>
          {(() => {
            const fundId = w.opps[oppId]?.fundId;
            const lightOffers = Object.values(w.offers).filter((o) => o.fundId === fundId && o.light && !o.applicationId);
            if (!lightOffers.length) return null;
            const open = lightOffers.filter((o) => o.status === "held");
            return (
              <p className="mt-2 text-small text-muted">
                This round was decided before this demonstration date: {plural(lightOffers.length, "offer")} ({fmt(sum(lightOffers.map((o) => o.amount)))}){open.length ? `, ${open.length} still awaiting acceptance` : ", all accepted"}. Its applications are summarised, not listed.
              </p>
            );
          })()}
          <ul className="mt-3 border-t border-line md:hidden">
            {shown.slice(0, 40).map((a) => (
              <li key={a.id} className="border-b border-line py-3">
                <div className="flex items-start justify-between gap-3">
                  <span>
                    <span className="block font-medium">{recipientName(w, a.applicantKind, a.applicantId, persona)}</span>
                    <span className="block text-small text-subtle">{fmt(a.requested)} requested · scores {a.scores.map((s) => s.total).join(" · ") || "—"}</span>
                  </span>
                  <AppStatus s={a.status} funderView />
                </div>
                {a.light ? <p className="mt-1 text-small text-subtle">Summary only in this demonstration</p> : <a className="mt-2 inline-flex min-h-11 items-center underline underline-offset-4" href={`#/app/${persona.id}/review/${a.id}`}>Open the application</a>}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-small text-subtle">Athletes under 18 appear by first name only once their guardian has accepted, otherwise without names. {apps.some((a) => a.light) ? `In this demonstration, ${apps.filter((a) => !a.light).length} applications open in full, one or more at every stage; the other ${apps.filter((a) => a.light).length} are summary rows with real scores and statuses.` : ""}</p>
          <div className="relative mt-3 hidden overflow-x-auto md:block">
            <table className="w-full min-w-[44rem] text-table">
              <thead>
                <tr className="label-data border-b border-line text-left text-subtle">
                  <th className="py-3 pr-4">Applicant</th>
                  <th className="py-3 pr-4">Requested</th>
                  <th className="py-3 pr-4">Scores</th>
                  <th className="py-3 pr-4">Status</th>
                  <th className="py-3" />
                </tr>
              </thead>
              <tbody>
                {shown.slice(0, 40).map((a) => (
                  <tr key={a.id} className="h-12 border-b border-line">
                    <td className="pr-4">
                      {recipientName(w, a.applicantKind, a.applicantId, persona)}
                      {a.nominatedBy && <span className="block text-small text-subtle">Nominated by {a.nominatedBy}</span>}
                    </td>
                    <td className="pr-4 tabular-nums">{fmt(a.requested)}</td>
                    <td className="pr-4 tabular-nums">{a.scores.map((s) => s.total).join(" · ") || "—"}</td>
                    <td className="pr-4">
                      <AppStatus s={a.status} funderView />
                    </td>
                    <td>{a.light ? <span className="text-small text-subtle">Summary only</span> : <a className="underline underline-offset-4" href={`#/app/${persona.id}/review/${a.id}`}>Open</a>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {shown.length > 40 && <p className="mt-2 text-small text-subtle">Showing 40 of {shown.length}.</p>}
          </div>
        </>
      )}
      <Section title={`Direct requests received · ${asks.filter((a) => a.status === "sent").length} open`}>
        {asks.length === 0 ? <Empty>No requests yet. Athletes and clubs can ask you directly because your profile accepts direct requests.</Empty> : (
          <ul>
            {asks.map((a) => {
              const r = w.requests[a.requestId];
              return (
                <Row key={a.id}>
                  <div>
                    <p className="font-medium">
                      {r.ownerKind === "org" ? w.orgs[r.ownerId].name : athleteLabel(w, r.ownerId, persona)} asks for {fmt(a.amount)}
                    </p>
                    <p className="text-small text-subtle">{r.title} · {r.lines.find((l) => l.id === a.lineId)?.label}</p>
                  </div>
                  {a.status === "sent" ? (
                    <div className="flex flex-wrap gap-3">
                      <a className={btn("primary")} href={`#/app/${persona.id}/request/${r.id}`}>Make an offer</a>
                      <ActionButton actor={persona.id} type="answerAsk" args={{ askId: a.id, answer: "notnow" }} variant="secondary">Not now</ActionButton>
                    </div>
                  ) : (
                    <Chip kind="self">{a.status === "offered" ? "Offer made" : a.status === "notnow" ? "Not now" : "Question asked"}</Chip>
                  )}
                </Row>
              );
            })}
          </ul>
        )}
      </Section>
      <Section title="Offers sent">
        {offers.length === 0 ? <Empty>No direct offers yet.</Empty> : (
          <ul>
            {offers.map((o) => (
              <Row key={o.id}>
                <p>
                  {fmt(o.amount)} to <span className="font-medium">{recipientName(w, o.recipientKind, o.recipientId, persona)}</span> · {w.funds[o.fundId].name}
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <Chip kind={o.status === "accepted" ? "verified" : o.status === "held" ? "awaiting" : o.status === "second-approval" ? "attention" : "info"}>{o.status === "held" ? "Awaiting acceptance" : o.status === "accepted" ? "Accepted" : o.status === "safeguarding" ? "Platform safeguarding review" : o.status === "second-approval" ? "Needs a second approver" : o.status === "withdrawn" ? "Withdrawn" : "Declined"}</Chip>
                  {o.status === "second-approval" && persona.perms.includes("Approve") && o.by !== persona.id && (
                    <ActionButton actor={persona.id} type="approveOffer" args={{ offerId: o.id }} success="Second approval given. The offer has been sent.">
                      Give second approval
                    </ActionButton>
                  )}
                  {["second-approval", "held", "safeguarding"].includes(o.status) && !o.applicationId && persona.perms.includes("Approve") && (
                    <ActionButton actor={persona.id} type="withdrawOffer" args={{ offerId: o.id, reason: o.status === "second-approval" ? "Withdrawn before second approval" : "Withdrawn by the funder before acceptance" }} variant="secondary" success="Withdrawn. The money is available again.">
                      Withdraw
                    </ActionButton>
                  )}
                </div>
              </Row>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}

/* ======================================================== Application review */

export function ReviewPage({ persona, id }: { persona: Person; id: string }) {
  const { world: w } = useStore();
  const a = w.applications[id];
  const act = useAction(persona.id);
  // The reviewer's own judgement: the score starts empty, never suggested by the system.
  const [score, setScore] = useState("");
  const [noConflict, setNoConflict] = useState(false);
  if (!a) return <Empty>This application does not exist yet.</Empty>;
  const ath = w.athletes[a.applicantId];
  const o = w.opps[a.oppId];
  const fund = w.funds[o.fundId];
  // Purpose-based access (docs/02 §8): an application is shared only with the funder it was sent to.
  if (persona.funderId !== fund.funderId || a.status === "draft") return <Empty>This application is shared only with the funder it was sent to.</Empty>;
  const tiers = fund.tiers?.filter((t) => t.amount <= a.requested) ?? [];
  const undeclared = ath?.currentSupport.filter((s) => !s.declared) ?? [];
  const canReview = persona.perms.includes("Review");
  const scoredByMe = a.scores.some((s) => s.by === persona.id);
  return (
    <div className="pb-8">
      <PageHead eyebrow={`Application review · ${o.title}`} title="Does the evidence hold up?" lead={`${athleteLabel(w, a.applicantId, persona)} · requested ${fmt(a.requested)} · ${a.otherFunding ? `other funding: ${a.otherFunding}` : ""}`} />
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr] [&>*]:min-w-0">
        <section>
          <div className="rounded-[10px] border border-line-strong p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Label>Summary</Label>
              <SimulatedAI />
            </div>
            <ul className="mt-2 space-y-1 text-small text-muted">
              <li>· Sport and level: {ath?.sport}, {ath?.level.toLowerCase()} (profile).</li>
              <li>· Results: {ath?.facts.filter((f) => f.kind === "result").map((f) => `${f.value} (${stateLabel(f)})`).join("; ") || "none on profile"}.</li>
              <li>· Budget: {fmt(a.requested)} requested; award levels {fund.tiers?.map((t) => fmt(t.amount)).join(" / ")}.</li>
              <li>· Statement: {a.aiDrafted ? "drafted with Simulated AI help, edited by the applicant" : "written by the applicant"}.</li>
              {undeclared.length > 0 && <li className="text-amber">· Rule found: current support on the profile ({undeclared.map((s) => `${s.label}, ${fmt(s.amount)}`).join("; ")}) is not declared under &ldquo;Other funding&rdquo;.</li>}
            </ul>
            <p className="mt-2 text-small text-subtle">AI-assisted, simulated. Check against sources.</p>
          </div>
          <h2 className="label mt-8 text-subtle">What {ath?.minor ? "the applicant" : ath?.name.split(" ")[0]} shared</h2>
          <ul className="mt-2 border-t border-line">
            {ath?.facts.filter((f) => f.visibility !== "private").map((f) => (
              <li key={f.id} className="flex flex-col gap-2 border-b border-line py-3 sm:flex-row sm:items-center sm:justify-between">
                <span>
                  <span className="block text-small text-subtle">{f.label}</span>
                  <span className="font-medium">{f.value}</span>
                  <span className="mt-1 block">
                    <Chip kind={f.state === "verified" || f.state === "confirmed" ? "verified" : f.state === "awaiting" ? "awaiting" : "self"}>{stateLabel(f)}</Chip>
                  </span>
                </span>
                {persona.perms.includes("Verify") && (f.state === "awaiting" || f.state === "self") && (f.kind === "age" || f.kind === "result") && (
                  <ActionButton actor={persona.id} type="verifyFact" args={{ athleteId: ath.id, factId: f.id, method: f.kind === "age" ? "ID document" : "federation results list" }} variant="secondary" success="Verified.">
                    Verify against {f.kind === "age" ? "ID document" : "results list"}
                  </ActionButton>
                )}
              </li>
            ))}
          </ul>
          <h2 className="label mt-8 text-subtle">Their statement</h2>
          {a.statement ? <p className="mt-2 max-w-[40rem] border-l-2 border-line-strong pl-4 text-muted">{a.statement}</p> : <p className="mt-2 text-small text-muted">{a.status === "incomplete" ? "Not written yet. This application is incomplete, so it is not scored until the applicant finishes it." : "No statement."}</p>}
          {a.status === "noteligible" && <p className="mt-3 text-small text-amber">Not considered: the published rules show this application does not qualify, so no one scores it. The applicant was told which rule it missed.</p>}
          <p className="mt-3 text-small text-subtle">{a.info ? `Information request: "${a.info.text}" · ${a.info.status === "answered" ? "answered" : "waiting for the applicant"}` : ""}</p>
        </section>
        <aside className="rounded-[10px] border border-line-strong p-5">
          <Label>How applications are scored</Label>
          <p className="mt-2 text-small text-muted">Sporting level and trajectory · financial need · clarity of the plan for the money · coach or club support.</p>
          <p className="mt-3 text-small">Scores so far: {a.scores.map((s) => `${s.total} (${w.people[s.by]?.name})`).join(" · ") || "none"}</p>
          {canReview && !scoredByMe && ["submitted", "info"].includes(a.status) && (
            <>
              <Field label="Your total (of 16)" htmlFor="score">
                <input id="score" type="number" min={4} max={16} className={cn(inputCls, "max-w-[8rem]")} value={score} onChange={(e) => setScore(e.target.value)} />
              </Field>
              <label className="mt-3 flex gap-2 text-small">
                <input type="checkbox" checked={noConflict} onChange={(e) => setNoConflict(e.target.checked)} className="mt-1 accent-[var(--ri-signal)]" /> I have no conflict of interest with this applicant
              </label>
              <Button className="mt-4" variant="secondary" onClick={() => (score === "" ? act.fail("Add your total, from 4 to 16.") : act.run("scoreApplication", { appId: id, total: Number(score), noConflict }, "Score recorded."))}>
                Record my score
              </Button>
            </>
          )}
          {canReview && ["submitted", "info"].includes(a.status) && tiers.length > 0 && (
            <div className="mt-6 border-t border-line pt-4">
              <p className="font-medium">Recommend an award level</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {tiers.map((t) => (
                  <ActionButton key={t.amount} actor={persona.id} type="shortlist" args={{ appId: id, tier: t.amount }} variant={t.amount === 4500 ? "primary" : "secondary"} success="Shortlisted.">
                    {fmt(t.amount)}
                  </ActionButton>
                ))}
              </div>
              <p className="mt-2 text-small text-subtle">{tiers.map((t) => `${fmt(t.amount)}: ${t.criterion.toLowerCase()}`).join(" · ")}{tiers.length < (fund.tiers?.length ?? 0) ? ` · Higher levels are above the ${fmt(a.requested)} requested.` : ""}</p>
            </div>
          )}
          {a.status === "shortlisted" && <p className="mt-4 flex gap-2 text-signal"><CircleCheck className="size-5" aria-hidden="true" /> Shortlisted at {fmt(a.recommendedTier!)}. A colleague who can approve decides.</p>}
          {["offered", "accepted", "waiting", "notselected"].includes(a.status) && <p className="mt-4 flex items-center gap-2 text-small">Decision sent: <AppStatus s={a.status} funderView /></p>}
          {!canReview && <p className="mt-4 flex gap-2 text-small text-subtle"><CircleHelp className="mt-0.5 size-4" aria-hidden="true" /> Your permissions do not include Review.</p>}
          <Message error={act.error} done={act.done} />
        </aside>
      </div>
    </div>
  );
}

/* ================================================================ Selection */

/** One applicant at a time: the decision, and a short respectful message the approver can edit. */
function DecideOne({ persona, appId }: { persona: Person; appId: string }) {
  const { world: w } = useStore();
  const a = w.applications[appId];
  const funder = w.funders[w.funds[w.opps[a.oppId].fundId].funderId].name;
  const can = a.status === "shortlisted" && !a.pendingFact;
  const notes = {
    offer: `We are pleased to offer you ${fmt(a.recommendedTier ?? 0)}, the published level for your results. Read what ${funder} will see, then accept or decline.`,
    waiting: "You reached the minimum score, but one fact still needs checking. We have put you on the waiting list and will tell you as soon as it is checked.",
    notselected: "Thank you for applying. We could not offer funding this time. Other open opportunities that may suit you are listed in Discover.",
  } as const;
  // Nothing is chosen for the approver: a person decides, then the message is written for that decision.
  const [d, setD] = useState<keyof typeof notes | null>(null);
  const [note, setNote] = useState<string>("");
  const act = useAction(persona.id);
  return (
    <div className="mt-3">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Decision">
        {(["offer", "waiting", "notselected"] as const).filter((k) => k !== "offer" || can).map((k) => (
          <button key={k} type="button" aria-pressed={d === k} onClick={() => (setD(k), setNote(notes[k]))} className={seg(d === k)}>
            {k === "offer" ? `Offer ${fmt(a.recommendedTier ?? 0)}` : k === "waiting" ? "Waiting list" : "Not this time"}
          </button>
        ))}
      </div>
      {!can && !a.pendingFact && <p className="mt-2 text-small text-subtle">An offer becomes possible once the reviewers shortlist this application.</p>}
      {d && (
        <>
          <label htmlFor={`note-${appId}`} className="mt-3 block text-small text-subtle">
            Message to the applicant
          </label>
          <textarea id={`note-${appId}`} rows={4} className="mt-1 w-full rounded-[6px] border border-control bg-surface-2 p-3 text-ink" value={note} onChange={(e) => setNote(e.target.value)} />
          <Button className="mt-2" variant="secondary" onClick={() => act.run("decideApplication", { appId, decision: d, note }, "Decision sent.")}>
            Send this decision
          </Button>
        </>
      )}
      <Message error={act.error} done={act.done} />
    </div>
  );
}

export function SelectionPage({ persona, id }: { persona: Person; id: string }) {
  const { world: w } = useStore();
  const o = w.opps[id];
  const [confirming, setConfirming] = useState(false);
  const act = useAction(persona.id);
  if (!o) return <Empty>Not found.</Empty>;
  const fund = w.funds[o.fundId];
  const apps = Object.values(w.applications).filter((a) => a.oppId === id);
  const short = apps.filter((a) => a.status === "shortlisted");
  const offerable = short.filter((a) => !a.pendingFact);
  const t = fundTotals(w, fund.id);
  const proposed = sum(offerable.map((a) => a.recommendedTier!));
  const byTier = (fund.tiers ?? []).map((tier) => ({ tier: tier.amount, n: offerable.filter((a) => a.recommendedTier === tier.amount).length }));
  return (
    <div className="pb-8">
      <PageHead eyebrow={`Selection & decisions · ${o.title}`} title="Who should we fund?" lead={`${apps.length} applications · minimum score ${o.minScore ?? "—"} of 16 · ${policyText(fund.policy).toLowerCase()}`} />
      <Section title="Budget meter">
        <div className="mt-4">
          <FundBar announced={t.announced} committed={t.committed} reserved={t.held + (o.status === "decided" ? 0 : proposed)} />
        </div>
        {o.status !== "decided" && <p className="mt-3 text-small text-muted">If you send these decisions: {offerable.length} offers ({byTier.map((b) => `${b.n} × ${fmt(b.tier)}`).join(" + ")} = {fmt(proposed)}) held until accepted; {fmt(t.available - proposed)} stays available.</p>}
      </Section>
      <Section title={o.status === "decided" ? `Decisions sent · ${apps.filter((a) => a.status === "offered" || a.status === "accepted").length} offers · ${apps.filter((a) => a.status === "waiting").length} on the waiting list` : `Still to decide · ${short.length} shortlisted`}>
        <ul>
          {apps.filter((a) => !a.light && ["shortlisted", "submitted", "info", "offered", "waiting", "notselected"].includes(a.status)).map((a) => (
            <li key={a.id} className="border-b border-line py-4">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <span>
                  <span className="font-medium">{athleteLabel(w, a.applicantId, persona)}</span> · requested {fmt(a.requested)} · reviewers' scores {a.scores.map((s) => `${s.total} of 16`).join(" and ") || "none yet"}
                </span>
                <span className="text-small">{a.recommendedTier ? `Recommended: ${fmt(a.recommendedTier)} (the published level, not the amount requested)` : "Not shortlisted"}</span>
              </div>
              {o.status !== "decided" && ["shortlisted", "submitted", "info"].includes(a.status) && persona.perms.includes("Approve") ? <DecideOne persona={persona} appId={a.id} /> : ["offered", "waiting", "notselected", "accepted"].includes(a.status) && <p className="mt-2 text-small text-subtle">Decision sent: <AppStatus s={a.status} funderView />{a.decisionNote ? ` · “${a.decisionNote}”` : ""}</p>}
            </li>
          ))}
          <Row>
            <span className="text-muted">{short.some((a) => !a.light) ? "+ " : ""}{plural(short.filter((a) => a.light).length, short.some((a) => !a.light) ? "more recommendation" : "recommendation")} from the two reviewers (summarised)</span>
            <span className="text-small text-subtle">{short.filter((a) => a.pendingFact).length} with one fact still to verify → waiting list</span>
          </Row>
        </ul>
      </Section>
      <div className="mt-8">
        {o.status === "decided" ? (
          <p className="flex gap-2"><CircleCheck className="size-5 shrink-0 text-signal" aria-hidden="true" /> Decisions sent to all {apps.length} applicants. Every unsuccessful message links to other open opportunities.</p>
        ) : (
          <>
            {!confirming ? (
              <Button onClick={() => setConfirming(true)} arrow>
                Send decisions
              </Button>
            ) : (
              <div className="rounded-[10px] border border-line-strong p-4">
                <p className="font-medium">
                  Send {offerable.length} offers, {short.filter((a) => a.pendingFact).length} waiting-list places and a respectful message to the other {apps.filter((a) => ["submitted", "info"].includes(a.status)).length} applicants?
                </p>
                <p className="mt-1 text-small text-subtle">This can&rsquo;t be undone. Offers are held until each person accepts.</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  <Button onClick={() => act.run("sendDecisions", { oppId: id }, "Decisions sent.") && setConfirming(false)}>Yes, send them</Button>
                  <button type="button" className={btn("secondary")} onClick={() => setConfirming(false)}>
                    Not yet
                  </button>
                </div>
              </div>
            )}
            <p className="mt-2 text-small text-subtle">Sends the decisions you haven&rsquo;t sent one by one: offers to every recommendation, the waiting list, and a respectful message to everyone else. Nobody who scored an application can approve it.</p>
          </>
        )}
        <Message error={act.error} done={act.done} />
      </div>
    </div>
  );
}

/* ================================================================= Funding */

export function Portfolio({ persona }: { persona: Person }) {
  const { world: w } = useStore();
  const fid = persona.funderId!;
  const funds = fundsOf(w, fid);
  const [tab, setTab] = useState<"agreements" | "programmes" | "reports">(location.hash.includes("reports") ? "reports" : "agreements");
  const [adding, setAdding] = useState(false);
  const mine = Object.values(w.agreements).filter((g) => w.funds[g.fundId].funderId === fid);
  const own = mine.filter((g) => !g.light);
  const earlier = funds
    .map((f) => {
      const gs = mine.filter((g) => g.fundId === f.id && g.light);
      return { fund: f, n: gs.length, committed: sum(gs.map((g) => g.amount)), released: sum(gs.map((g) => released(w, g.id))) };
    })
    .filter((e) => e.n > 0);
  const cash = mine.filter((g) => counts(g) && BEHAVIOUR[w.funds[g.fundId].type] !== "inkind");
  const money = cash.map((g) => agreementTotals(w, g.id));
  const kits = mine.filter((g) => g.kits);
  const delivered = w.kitDeliveries.reduce((a, d) => a + d.items, 0);
  const toCheck = Object.values(w.expenses).filter((e) => mine.some((g) => g.id === e.agreementId) && e.status === "reported" && e.receipt);
  const reports = Object.values(w.reports).filter((r) => mine.some((g) => g.id === r.agreementId) && r.status !== "draft");
  const programmes = Object.values(w.programmes).filter((p) => mine.some((g) => g.id === p.agreementId));
  const byFund = (k: "committed" | "paid" | "checked") => ({ title: k === "committed" ? "Committed, by fund" : k === "paid" ? "Paid, by fund" : "Spending checked, by fund", rows: funds.filter((f) => BEHAVIOUR[f.type] !== "inkind").map((f) => ({ label: f.name, value: fmt(sum(cash.filter((g) => g.fundId === f.id).map((g) => agreementTotals(w, g.id)[k]))) })).filter((r) => r.value !== "$0") });
  const solo = w.funders[fid].type === "Individual sponsor";
  const answers = [
    { q: solo ? "How much have you committed?" : "How much have we committed?", a: fmt(sum(money.map((m) => m.committed))), d: "Accepted by both sides", src: byFund("committed") },
    { q: solo ? "How much have you paid?" : "How much have we paid?", a: fmt(sum(money.map((m) => m.paid))), d: `${fmt(sum(money.map((m) => m.stillToPay)))} still to pay`, src: byFund("paid") },
    { q: "How much spending is checked?", a: fmt(sum(money.map((m) => m.checked))), d: `${fmt(sum(money.map((m) => m.waiting)))} waiting to be checked`, src: byFund("checked") },
  ];
  return (
    <div className="pb-8">
      <PageHead eyebrow={`Funding · ${w.funders[fid].name}`} title="Who are we supporting, and how is the money used?" lead="Athlete funding, programme funding, sponsorship and donated equipment are counted apart. Every figure comes from the records." />
      <section className="grid gap-6 border-b border-line pb-6 sm:grid-cols-3">
        {answers.map((x) => (
          <div key={x.q}>
            <p className="text-small text-subtle">{x.q}</p>
            <p className="text-stat mt-1 tabular-nums">
              <SeeSource name={x.q} source={x.src}>{x.a}</SeeSource>
            </p>
            <p className="mt-2 text-small text-muted">{x.d}</p>
          </div>
        ))}
      </section>
      {(toCheck.length > 0 || reports.some((r) => r.status === "submitted") || own.some((g) => g.status === "awaiting-approval")) && (
        <Section title="Needs you">
          <ul>
            {own.filter((g) => g.status === "awaiting-approval").map((g) => (
              <Row key={g.id}>
                <span>Existing funding for {recipientName(w, g.recipientKind, g.recipientId, persona)} ({fmt(g.amount)}) waits for a second person to approve it</span>
                <a className={btn("primary", "min-h-10")} href={`#/app/${persona.id}/agreement/${g.id}`}>Open</a>
              </Row>
            ))}
            {toCheck.length > 0 && (
              <Row>
                <span>
                  {plural(toCheck.length, "expense")} with receipts to check ({fmt(sum(toCheck.map((e) => e.amount)))})
                </span>
                <a className={btn("secondary", "min-h-10")} href={`#/app/${persona.id}/agreement/${toCheck[0].agreementId}`}>
                  Check spending
                </a>
              </Row>
            )}
            {reports.filter((r) => r.status === "submitted").map((r) => (
              <Row key={r.id}>
                <span>Report to read: {r.period}</span>
                <a className={btn("secondary", "min-h-10")} href={`#/app/${persona.id}/report/${r.agreementId}`}>Read the report</a>
              </Row>
            ))}
          </ul>
        </Section>
      )}
      <div className="mt-8">
        <Tabs label="Funding" value={tab} onChange={setTab} tabs={[{ id: "agreements", label: "Who we support", count: mine.filter(counts).length }, ...(programmes.length ? [{ id: "programmes" as const, label: "Programmes", count: programmes.length }] : []), { id: "reports", label: "Reports", count: reports.length }]} />
      </div>
      {tab === "agreements" && (
        <>
          <UpcomingPayments persona={persona} cash={cash} />
          <Section title="Who we support" aside={<button type="button" className={btn("secondary", "min-h-10")} onClick={() => setAdding(true)}>Add existing funding</button>}>
            <ul>
              {own.map((g) => {
                const t = agreementTotals(w, g.id);
                return (
                  <Row key={g.id}>
                    <div>
                      <a className="font-medium hover:text-signal" href={`#/app/${persona.id}/agreement/${g.id}`}>
                        {recipientName(w, g.recipientKind, g.recipientId, persona)} · {w.funds[g.fundId].type} · {fmt(g.amount)}
                      </a>
                      <p className="mt-1 text-small text-subtle">
                        {g.status === "awaiting-approval" ? "Waiting for a second approver" : g.status === "awaiting-recipient" ? "Waiting for them to confirm the figures" : `${fmt(t.paid)} paid · ${fmt(t.spent)} spent · ${fmt(t.checked)} checked`}
                        {g.origin === "Existing agreement" ? " · existing funding" : ""}
                      </p>
                    </div>
                    <a className={btn("quiet", "min-h-10 shrink-0")} href={`#/app/${persona.id}/agreement/${g.id}`}>
                      Open <ArrowRight className="size-4" aria-hidden="true" />
                    </a>
                  </Row>
                );
              })}
              {earlier.filter((e) => !kits.some((k) => k.fundId === e.fund.id)).map((e) => (
                <Row key={e.fund.id}>
                  <div>
                    <p className="font-medium">
                      {plural(e.n, w.funds[e.fund.id].type.toLowerCase())} · {e.fund.name}
                    </p>
                    <p className="mt-1 text-small text-subtle">
                      Earlier agreements, shown as one line · {fmt(e.committed)} committed · {fmt(e.released)} paid
                    </p>
                  </div>
                </Row>
              ))}
              {own.length === 0 && earlier.length === 0 && <Empty li>No agreements yet.</Empty>}
            </ul>
          </Section>
          <Section title="Is there money left in each fund?">
            <ul>
              {funds.map((f) => {
                const t = fundTotals(w, f.id);
                return (
                  <li key={f.id} className="border-b border-line py-5">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="font-medium">{f.name}</p>
                      <p className="text-small text-subtle">
                        {f.type} · {policyText(f.policy).toLowerCase()} · {plural(t.count, "agreement")}
                      </p>
                    </div>
                    {t.committed + t.held === 0 && BEHAVIOUR[f.type] !== "inkind" ? (
                      <p className="mt-1 text-small text-muted">{fmt(t.announced)} available · nothing committed yet</p>
                    ) : BEHAVIOUR[f.type] === "inkind" ? (
                      <p className="mt-2 text-small">
                        {kits.reduce((a, g) => a + g.kits!.items, 0)} kits declared at {fmt(t.committed)} (not cash, never added to money totals) · {delivered} delivered
                      </p>
                    ) : (
                      <div className="mt-3">
                        <FundBar announced={t.announced} committed={t.committed} reserved={t.held} sources={fundSources(w, f.id, persona)} />
                        <p className="mt-2 text-small text-muted">Paid so far {fmt(t.released)}</p>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </Section>
        </>
      )}
      {tab === "programmes" && (
        <Section title="Are funded programmes on track?">
          <ul>
            {programmes.map((p) => {
              const t = programmeTotals(w, p.id);
              const behind = t.sites.filter((s) => s.status !== "On track");
              return (
                <Row key={p.id}>
                  <div>
                    <p className="font-medium">
                      {p.name} · {w.orgs[p.orgId].name}
                    </p>
                    <p className="mt-1 text-small text-subtle">
                      {t.delivered} of {t.due} sessions so far · {behind.length ? `${behind.map((s) => s.site.name).join(", ")} behind or needing attention` : "every site on track"}
                    </p>
                  </div>
                  <a className={btn("secondary", "min-h-10 shrink-0")} href={`#/app/${persona.id}/programme/${p.id}`}>
                    See sites <ArrowRight className="size-4" aria-hidden="true" />
                  </a>
                </Row>
              );
            })}
          </ul>
        </Section>
      )}
      {tab === "reports" && (
        <>
        <Section title="Our funding report">
          <ul>
            <Row>
              <span>Everything we fund: money committed, paid, received and checked; activities delivered; progress recorded. Calculated from the records each time it opens.</span>
              <a className={btn("primary", "min-h-10 shrink-0")} href={`#/app/${persona.id}/freport`}>
                <FileText className="size-4" aria-hidden="true" /> Open the report
              </a>
            </Row>
          </ul>
        </Section>
        <Section title="Reports from the people we fund">
          {reports.length === 0 ? <Empty>No reports yet. Organisations send them from their funding record; you read, accept or return them here.</Empty> : (
            <ul>
              {reports.map((r) => (
                <Row key={r.id}>
                  <span>
                    {r.period} · {recipientName(w, "org", w.agreements[r.agreementId].recipientId, persona)}
                  </span>
                  <span className="flex items-center gap-3">
                    <Chip kind={r.status === "accepted" ? "verified" : r.status === "submitted" ? "awaiting" : "attention"}>{r.status === "accepted" ? "Accepted" : r.status === "submitted" ? "To read" : "Returned"}</Chip>
                    <a className={btn("secondary", "min-h-10")} href={`#/app/${persona.id}/report/${r.agreementId}`}>Open</a>
                  </span>
                </Row>
              ))}
            </ul>
          )}
        </Section>
        </>
      )}
      <AddExisting persona={persona} open={adding} onClose={() => setAdding(false)} />
      <p className="mt-8 text-small text-subtle">Delivery and spending records show what was delivered and spent; they do not on their own prove social impact.</p>
    </div>
  );
}

/** "Which payments are coming up?": the next unpaid part of every agreement, by date; earlier rounds grouped. */
function UpcomingPayments({ persona, cash }: { persona: Person; cash: World["agreements"][string][] }) {
  const { world: w } = useStore();
  type Row = { key: string; dueISO: string; when: string; who: string; amount: number; note: string; href?: string; due: boolean; ids: string[] };
  const act = useAction(persona.id);
  const canPay = persona.perms.includes("Finance");
  // A grouped line of payments due now is recorded in one step: one recorded payment per agreement, each through the same rules.
  const payAll = (ids: string[]) => {
    const due = ids.map((id) => ({ id, x: scheduleOf(w, id).find((i) => i.status === "due" || i.status === "part-paid") })).filter((d) => d.x);
    due.every((d, k) => act.run("recordRelease", { agreementId: d.id, amount: d.x!.amount - d.x!.paid, ref: `PAY-${d.id.toUpperCase()}-${d.x!.n}`, entryId: `le-${d.id}-${Date.now()}-${k}` }, k === due.length - 1 ? `${due.length} payments recorded (simulated). Each recipient confirms when the money arrives.` : undefined));
  };
  const rows = new Map<string, Row>();
  for (const g of cash) {
    for (const x of scheduleOf(w, g.id).filter((i) => i.status !== "paid")) {
      const left = x.amount - x.paid;
      const due = x.status === "due" || x.status === "part-paid";
      const note = x.status === "on-hold" ? `On hold until ${x.condition}` : x.condition && !x.conditionMet ? `Once ${x.condition}` : x.condition ? `Condition met: ${x.condition}` : due ? "Ready to pay" : "No condition";
      if (g.light) {
        const key = `${g.fundId}|${x.dueLabel}|${due}`;
        const r = rows.get(key);
        if (r) {
          r.amount += left;
          r.ids.push(g.id);
          r.who = r.who.replace(/^\d+/, (n) => String(Number(n) + 1));
        } else rows.set(key, { key, dueISO: x.dueISO, when: due ? "Due now" : x.dueLabel, who: `1 earlier ${w.funds[g.fundId].type.toLowerCase()} · ${w.funds[g.fundId].name}`, amount: left, note, due, ids: [g.id] });
      } else rows.set(`${g.id}|${x.n}`, { key: `${g.id}|${x.n}`, dueISO: x.dueISO, when: due ? "Due now" : x.dueLabel, who: `${recipientName(w, g.recipientKind, g.recipientId, persona)} · ${w.funds[g.fundId].type.toLowerCase()}`, amount: left, note, href: `#/app/${persona.id}/agreement/${g.id}`, due, ids: [g.id] });
    }
  }
  const list = [...rows.values()].map((r) => ({ ...r, who: r.who.replace(/^(\d+) earlier ([a-z ]+?) ·/, (_, n, t) => (n === "1" ? `1 earlier ${t} ·` : `${n} earlier ${t}s ·`)) })).sort((a, b) => Number(b.due) - Number(a.due) || a.dueISO.localeCompare(b.dueISO));
  if (!list.length) return null;
  return (
    <Section title="Which payments are coming up?">
      <ul>
        {list.slice(0, 8).map((r) => (
          <li key={r.key} className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 border-b border-line py-3 sm:grid-cols-[11rem_1fr_8rem]">
            <span className={cn("font-medium", r.due && "text-signal")}>{r.when}</span>
            <span className="col-start-1 row-start-2 sm:col-start-2 sm:row-start-1">
              {r.href ? <a className="hover:text-signal" href={r.href}>{r.who}</a> : r.who}
              <span className="block text-small text-subtle">{r.note}</span>
              {!r.href && r.due && canPay && (
                <button type="button" className={btn("secondary", "mt-2 min-h-10 px-4 font-sans text-small font-medium tracking-normal")} onClick={() => payAll(r.ids)}>
                  Record these {r.ids.length} payments
                </button>
              )}
            </span>
            <span className="row-span-2 text-right font-medium tabular-nums sm:row-span-1">{fmt(r.amount)}</span>
          </li>
        ))}
      </ul>
      <Message error={act.error} done={act.done} />
      <p className="mt-2 text-small text-subtle">Planned payments from each agreement&rsquo;s schedule. Only a recorded payment counts as paid (simulated).</p>
    </Section>
  );
}

function AddExisting({ persona, open, onClose }: { persona: Person; open: boolean; onClose: () => void }) {
  const { world: w, go } = useStore();
  const fid = persona.funderId!;
  const funds = fundsOf(w, fid).filter((f) => BEHAVIOUR[f.type] !== "inkind");
  const [org, setOrg] = useState("ostral");
  const [fundId, setFundId] = useState(funds.find((f) => f.id === "fdg")?.id ?? funds[0]?.id ?? "");
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [paid, setPaid] = useState("");
  const [spent, setSpent] = useState("");
  const act = useAction(persona.id);
  return (
    <Panel open={open} onClose={onClose} eyebrow="Add existing funding" title="Funding that started before Revivo Impact">
      <p className="text-small text-muted">No new application is needed. A second person with Approve confirms it, then the organisation checks the figures.</p>
      <Field label="Who receives it?" htmlFor="ex-org">
        <select id="ex-org" className={inputCls} value={org} onChange={(e) => setOrg(e.target.value)}>
          {Object.values(w.orgs).filter((o) => !o.light && o.id !== fid && !w.funders[o.id]?.type?.match(/Company|Sports brand|Foundation/)).map((o) => (
            <option key={o.id} value={o.id}>
              {o.name}
            </option>
          ))}
        </select>
      </Field>
      <Field label="From which fund?" htmlFor="ex-fund">
        <select id="ex-fund" className={inputCls} value={fundId} onChange={(e) => setFundId(e.target.value)}>
          {funds.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name} ({fmt(fundTotals(w, f.id).available)} available)
            </option>
          ))}
        </select>
      </Field>
      <Field label="What is it for?" htmlFor="ex-purpose">
        <input id="ex-purpose" className={inputCls} value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="For example: regional swimming coach development" />
      </Field>
      <div className="grid gap-x-4 sm:grid-cols-3">
        <Field label="Amount agreed" htmlFor="ex-amt">
          <input id="ex-amt" inputMode="numeric" className={inputCls} value={amount} onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))} />
        </Field>
        <Field label="Already paid" htmlFor="ex-paid">
          <input id="ex-paid" inputMode="numeric" className={inputCls} value={paid} onChange={(e) => setPaid(e.target.value.replace(/\D/g, ""))} />
        </Field>
        <Field label="Already spent" htmlFor="ex-spent">
          <input id="ex-spent" inputMode="numeric" className={inputCls} value={spent} onChange={(e) => setSpent(e.target.value.replace(/\D/g, ""))} />
        </Field>
      </div>
      <Button
        className="mt-6"
        onClick={() => {
          const id = `ag-ex-${org}-${Date.now()}`;
          if (act.run("addExistingFunding", { agreementId: id, fundId, orgId: org, amount: Number(amount), purpose, paid: Number(paid || 0), spent: Number(spent || 0), nextUpdate: "Next update due Thu 30 Sep" }, "Added. A second person with Approve now confirms it.")) {
            onClose();
            go(`app/${persona.id}/agreement/${id}`);
          }
        }}
      >
        Add and send for approval
      </Button>
      <Message error={act.error} done={act.done} />
    </Panel>
  );
}
