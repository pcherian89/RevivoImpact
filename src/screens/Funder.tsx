import { useState } from "react";
import { ArrowRight, ChevronRight, CircleCheck, CircleHelp, FileText, HandHeart, Lock, Megaphone, Search, Star, UsersRound, X } from "lucide-react";
import { useStore } from "../state/store";
import { BEHAVIOUR, REGIONS, type Fund, type Person, type World } from "../domain/model";
import { fit, fmt, fundTotals, mayReachMinors, oppStatusAt, platformTotals, released, requestTotals, stateLabel, sum } from "../domain/engine";
import { btn, Button, Chip, cn, FilterPill, HeroBand, Label, PageHead, Panel, SeeSource, SimulatedAI, Tabs } from "../components/ui";
import { FundBar, MiniLine, NeedBar } from "../components/money";
import { ActionButton, AppStatus, athleteLabel, Empty, Field, inputCls, Message, policyText, recipientName, Row, Section, useAction } from "./common";
import { fmtDate } from "./Seeker";

export const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;
const fundsOf = (w: World, funderId: string) => Object.values(w.funds).filter((f) => f.funderId === funderId);

/* ================================================================= Overview */

export function FunderOverview({ persona }: { persona: Person }) {
  const { world: w } = useStore();
  const fid = persona.funderId!;
  const f = w.funders[fid];
  const funds = fundsOf(w, fid);
  const needs: { t: string; d: string; a: string; to: string }[] = [];
  for (const o of Object.values(w.opps).filter((o) => w.funds[o.fundId].funderId === fid && o.status === "awaiting"))
    needs.push(o.draftedBy === persona.id ? { t: `Your draft "${o.title}" waits for a colleague's approval`, d: "You prepared it, so a different person must publish it.", a: "See opportunities", to: "opps" } : { t: `${w.people[o.draftedBy!]?.name ?? "A colleague"}'s draft is waiting for approval`, d: `${o.title} · you did not prepare it, so you can publish it`, a: "Review and publish", to: "opps" });
  const waiting = Object.values(w.offers).filter((o) => w.funds[o.fundId].funderId === fid && o.status === "second-approval");
  const forMe = waiting.filter((o) => o.by !== persona.id);
  if (forMe.length && persona.perms.includes("Approve")) needs.push({ t: `${forMe.length} offer${forMe.length > 1 ? "s" : ""} waiting for your second approval`, d: "A colleague made them; this fund needs two people.", a: "Give second approval", to: "apps" });
  else if (waiting.length && persona.perms.includes("Approve")) needs.push({ t: `${waiting.length} of your offers ${waiting.length > 1 ? "are" : "is"} waiting for a second approver`, d: "Nothing reaches the recipient until a colleague with Approve agrees. You can withdraw it.", a: "See offers", to: "apps" });
  const asks = Object.values(w.asks).filter((a) => a.funderId === fid && a.status === "sent");
  if (asks.length) needs.push({ t: `${asks.length} support ${asks.length === 1 ? "ask" : "asks"} to answer`, d: "Answer with an offer, a question or “not now”.", a: "Answer asks", to: "apps" });
  const shortlisted = Object.values(w.applications).filter((a) => w.funds[w.opps[a.oppId].fundId].funderId === fid && a.status === "shortlisted");
  if (shortlisted.length && persona.perms.includes("Approve")) needs.push({ t: `${shortlisted.length} recommendations are ready for decision`, d: "See the budget and award levels before you decide.", a: "Decide offers", to: `selection/${shortlisted[0].oppId}` });
  const toReview = Object.values(w.applications).filter((a) => w.funds[w.opps[a.oppId].fundId].funderId === fid && a.status === "submitted" && a.scores.length < 2 && !a.scores.some((s) => s.by === persona.id) && !a.light);
  if (toReview.length && persona.perms.includes("Review")) needs.push({ t: `${toReview.length} application${toReview.length > 1 ? "s" : ""} to review`, d: toReview.map((a) => athleteLabel(w, a.applicantId, persona)).join(", "), a: "Review", to: `review/${toReview[0].id}` });
  const toRelease = Object.values(w.agreements).filter((g) => w.funds[g.fundId].funderId === fid && !g.light && released(w, g.id) === 0 && BEHAVIOUR[w.funds[g.fundId].type] !== "inkind");
  if (toRelease.length && persona.perms.includes("Finance")) needs.push({ t: `${toRelease.length} payment${toRelease.length > 1 ? "s" : ""} to record`, d: "Recorded, never processed (simulated).", a: "Record payments", to: "portfolio" });
  const main = funds.find((x) => x.id === "eas") ?? funds[0];
  const isFoundation = f.type === "Foundation";
  const quick = [
    { t: "Discover athletes", to: "fdiscover?athletes", icon: Search },
    { t: "Discover funding requests and teams", to: "fdiscover?requests", icon: HandHeart },
    ...(f.type === "Individual sponsor" ? [] : [{ t: "Publish a sports funding opportunity", to: "opps", icon: Megaphone }]),
    { t: "Manage funding and track progress", to: "portfolio", icon: FileText },
  ];
  const pt = funderTotals(w, fid);
  return (
    <div className="pb-8">
      <HeroBand file={f.type === "Individual sponsor" ? "im-19-individual-sponsor.png" : "im-06-funder-visit.png"} phone="after">
        <p className="label text-signal">{f.name} · Overview</p>
        <h1 className="text-title mt-2">What needs you, {persona.name.split(" ")[0]}?</h1>
      </HeroBand>
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
        <Answer q={isFoundation ? "Who applied" : "Who you support"} a={isFoundation ? plural(Object.values(w.applications).filter((a) => w.funds[w.opps[a.oppId].fundId].funderId === fid && a.status !== "draft").length, "application") : plural(pt.count, "agreement")} d={isFoundation ? "Through Discover, your share link and nominations" : "Athletes, teams and clubs"} />
        <Answer q="Committed · all funds" a={fmt(pt.devCommitted + pt.progCommitted)} d={pt.comCommitted ? `Plus ${fmt(pt.comCommitted)} commercial, kept apart` : "Development and programme funding"} />
        <Answer q="Released · all funds" a={fmt(pt.released)} d="Recorded payments (simulated); recipients confirm receipt" />
      </section>
      <p className="mt-8 text-small text-subtle">Delivery and spending records show what was delivered and spent; they do not on their own prove social impact.</p>
    </div>
  );
}

function funderTotals(w: World, fid: string) {
  const ags = Object.values(w.agreements).filter((g) => w.funds[g.fundId].funderId === fid);
  const by = (b: string) => sum(ags.filter((g) => BEHAVIOUR[w.funds[g.fundId].type] === b).map((g) => g.amount));
  return { count: ags.length, devCommitted: by("development"), progCommitted: by("programme"), comCommitted: by("commercial"), released: sum(ags.filter((g) => BEHAVIOUR[w.funds[g.fundId].type] !== "commercial").map((g) => released(w, g.id))) };
}

function Answer({ q, a, d }: { q: string; a: string; d: string }) {
  return (
    <div>
      <Label>{q}</Label>
      <p className="text-stat mt-2">
        <SeeSource name={q}>{a}</SeeSource>
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
  const brief = BRIEFS[persona.id] ?? { text: "", chips: ["Any region", "Verified evidence"] };
  const [tab, setTab] = useState<"athletes" | "requests" | "teams" | "shortlist">(location.hash.includes("requests") ? "requests" : location.hash.includes("athletes") ? "athletes" : commercial ? "athletes" : persona.id === "marcus" ? "teams" : "requests");
  const [chips, setChips] = useState(brief.chips);
  const [briefText, setBriefText] = useState(brief.text);
  const act = useAction(persona.id);
  const short = w.shortlists[fid] ?? [];
  const reqs = Object.values(w.requests)
    .filter((r) => r.status === "open" && r.discoverable && requestTotals(w, r.id).remaining > 0)
    .filter((r) => !r.minor || mayReachMinors(w, persona.id))
    .filter((r) => !(r.ownerKind === "athlete" && w.blocks.some((b) => b.athleteId === r.ownerId && b.funderId === fid)));
  const rows = reqs.map((r) => ({ r, m: fit(chips, r.tags) })).sort((a, b) => b.m.length - a.m.length || a.r.neededMonth.localeCompare(b.r.neededMonth));
  const athletes = Object.values(w.athletes)
    .filter((a) => !a.minor && a.discoverable)
    .map((a) => ({ a, m: fit(chips, a.tags) }))
    .sort((x, y) => y.m.length - x.m.length || x.a.name.localeCompare(y.a.name))
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
          <input id="brief" value={briefText} onChange={(e) => setBriefText(e.target.value)} placeholder="For example: judo athletes in Coastal Region needing travel" className={cn(inputCls, "flex-1")} />
          <button type="submit" className={btn("secondary", "shrink-0")}>
            Turn into filters
          </button>
        </form>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-small text-subtle">Filters from your brief (edit freely):</span>
          {chips.map((c) => (
            <span key={c} className="inline-flex min-h-9 items-center gap-1 rounded-full border border-signal/50 pr-1 pl-3 text-small">
              {c}
              <button type="button" aria-label={`Remove filter ${c}`} onClick={() => setChips(chips.filter((x) => x !== c))} className="rounded-full p-1.5 hover:bg-surface-2">
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
      {tab === "requests" && <ul className="mt-2 border-t border-line">{athleteRows.map(({ r, m }) => <RequestRow key={r.id} w={w} r={r} m={m} of={chips.length} persona={persona} short={short.includes(r.id)} toggle={canShort ? toggle : undefined} />)}</ul>}
      {tab === "teams" && <ul className="mt-2 border-t border-line">{teamRows.map(({ r, m }) => <RequestRow key={r.id} w={w} r={r} m={m} of={chips.length} persona={persona} short={short.includes(r.id)} toggle={canShort ? toggle : undefined} />)}</ul>}
      {tab === "athletes" && (
        <ul className="mt-2 border-t border-line">
          {athletes.map(({ a, m }) => (
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
                <span className="block text-subtle">{a.facts.filter((x) => x.state === "verified" || x.state === "confirmed").length} verified · {a.facts.filter((x) => x.state === "self").length} self-reported</span>
              </span>
              <span className="text-small">
                {a.openToCommercial && <Chip kind="info">Open to commercial partners</Chip>}
                <span className="mt-1 block text-subtle">{m.length ? `Matches ${m.length} of ${chips.length}: ${m.join(" · ").toLowerCase()}` : "Matches none of your filters"}</span>
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

function RequestRow({ w, r, m, of, persona, short, toggle }: { w: World; r: World["requests"][string]; m: string[]; of: number; persona: Person; short: boolean; toggle?: (id: string) => void }) {
  const t = requestTotals(w, r.id);
  const label = r.ownerKind === "org" ? w.orgs[r.ownerId].name : r.minor ? `${r.sport === "Swimming" ? "Swimmer" : r.sport} · ${r.ageGroup}` : w.athletes[r.ownerId].name;
  return (
    <li className="grid gap-3 border-b border-line py-4 md:grid-cols-[1.4fr_1.4fr_1fr_auto] md:items-center md:gap-6">
      <a href={`#/app/${persona.id}/request/${r.id}`} className="group block">
        <span className="flex flex-wrap items-center gap-2 font-display text-xl font-bold group-hover:text-signal">
          {r.minor && <Lock className="size-4 text-subtle" aria-label="Shown without names: under 18" />}
          {label}
          <ChevronRight className="size-4 text-subtle" aria-hidden="true" />
          {m.length > 0 && <span className="rounded-full border border-line-strong px-2 py-0.5 font-sans text-small font-medium text-muted">Matches {m.length} of {of}</span>}
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
        <span className="mt-1 block text-subtle">{m.length ? `Why: ${m.join(" · ").toLowerCase()}` : "Matches none of your filters"}</span>
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
  const [reason, setReason] = useState("");
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
          <p className="mt-2 text-small text-muted">{r.minor ? "This offer goes to the athlete's guardian. You cannot contact the athlete directly; you see the first name only if the guardian accepts." : "The recipient can accept or decline. Contact details come only through an accepted agreement."}</p>
          {mine.map((o) => (
            <p key={o.id} role="status" className="mt-4 flex gap-2 text-signal">
              <CircleCheck className="mt-0.5 size-5 shrink-0" aria-hidden="true" /> {fmt(o.amount)} offered · {o.status === "held" ? "waiting for acceptance" : o.status === "accepted" ? "accepted" : o.status === "safeguarding" ? "in platform safeguarding review" : o.status === "second-approval" ? "waiting for a second approver at your organisation" : o.status === "withdrawn" ? "withdrawn" : "declined"}
            </p>
          ))}
          {funds.length === 0 || t.remaining === 0 ? (
            <p className="mt-4 text-small text-subtle">{t.remaining === 0 ? "Nothing is still needed: fully pledged, or held for offers and applications in progress." : "Your organisation has no development fund for direct offers."}</p>
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
        </Field>
        <Field label="Reason, linked to the fund's published criteria" htmlFor="of-reason" hint="Required: it becomes part of the selection record.">
          <textarea id="of-reason" rows={2} value={reason} onChange={(e) => setReason(e.target.value)} placeholder={r.minor ? "Competition travel to a verified national qualification." : "Equipment for a verified adult athlete competing nationally."} className="w-full rounded-[6px] border border-control bg-surface-2 p-3 text-ink" />
        </Field>
        <Button className="mt-6" onClick={() => act.run("makeOffer", { offerId: `of-${fid}-${Date.now()}`, fundId, recipientKind: r.ownerKind, recipientId: r.ownerId, requestId: id, lineId, amount: Number(amount.replace(/\D/g, "")), reason: reason || (r.minor ? "Competition travel to a verified national qualification." : "Equipment for a verified adult athlete competing nationally.") }, "Offer sent (simulated).") && setOpen(false)}>
          Send offer
        </Button>
        <Message error={act.error} />
        <p className="mt-3 text-small text-subtle">These checks are rules, not AI: the cap, the fund&rsquo;s money, your delegated limit and, for young athletes, safeguarding.</p>
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
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Chip kind={o.status === "awaiting" ? "awaiting" : oppStatusAt(w, o) === "open" ? "current" : "self"}>{o.status === "awaiting" ? "Awaiting approval" : oppStatusAt(w, o)}</Chip>
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
            <Button className="mt-6" onClick={() => act.run("createOpportunity", { fundId, title, sport, purpose, amountLabel: `Up to ${fmt(w.funds[fundId].max)}`, closes }, "Drafted. A different person with Approve publishes it (four-eyes).")}>
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
          <p className="mt-4 text-small text-subtle">{apps.filter((a) => a.nominatedBy).length} by nomination · eligibility checked by rule · {w.funds[w.opps[oppId]?.fundId]?.policy === "Institutional" ? "two reviewers" : "one reviewer"} per application under this fund&rsquo;s policy</p>
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
                {!a.light && <a className="mt-2 inline-flex min-h-11 items-center underline underline-offset-4" href={`#/app/${persona.id}/review/${a.id}`}>Open the application</a>}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-small text-subtle">Athletes under 18 appear by first name only once their guardian has accepted, otherwise without names.</p>
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
                    <td>{!a.light && <a className="underline underline-offset-4" href={`#/app/${persona.id}/review/${a.id}`}>Open</a>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {shown.length > 40 && <p className="mt-2 text-small text-subtle">Showing 40 of {shown.length}.</p>}
          </div>
        </>
      )}
      <Section title={`Support asks received · ${asks.filter((a) => a.status === "sent").length} open`}>
        {asks.length === 0 ? <Empty>No asks yet. Seekers can ask you because your profile accepts support asks.</Empty> : (
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
                  <Chip kind={o.status === "accepted" ? "verified" : o.status === "held" ? "awaiting" : o.status === "second-approval" ? "attention" : "info"}>{o.status === "held" ? "Awaiting acceptance" : o.status === "accepted" ? "Accepted" : o.status === "safeguarding" ? "Platform safeguarding review" : o.status === "second-approval" ? `Needs a second approver · ${w.funds[o.fundId].policy}` : o.status === "withdrawn" ? "Withdrawn" : "Declined"}</Chip>
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
  const [score, setScore] = useState(13);
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
              <li>· Budget: {fmt(a.requested)} requested; tiers {fund.tiers?.map((t) => fmt(t.amount)).join(" / ")}.</li>
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
          <p className="mt-3 text-small text-subtle">{a.info ? `Information request: "${a.info.text}" · ${a.info.status === "answered" ? "answered" : "waiting for the applicant"}` : ""}</p>
        </section>
        <aside className="rounded-[10px] border border-line-strong p-5">
          <Label>How applications are scored</Label>
          <p className="mt-2 text-small text-muted">Sporting level and trajectory · financial need · clarity of the plan for the money · coach or club support.</p>
          <p className="mt-3 text-small">Scores so far: {a.scores.map((s) => `${s.total} (${w.people[s.by]?.name})`).join(" · ") || "none"}</p>
          {canReview && !scoredByMe && ["submitted", "info"].includes(a.status) && (
            <>
              <Field label="Your total (of 16)" htmlFor="score">
                <input id="score" type="number" min={4} max={16} className={cn(inputCls, "max-w-[8rem]")} value={score} onChange={(e) => setScore(Number(e.target.value))} />
              </Field>
              <label className="mt-3 flex gap-2 text-small">
                <input type="checkbox" checked={noConflict} onChange={(e) => setNoConflict(e.target.checked)} className="mt-1 accent-[var(--ri-signal)]" /> I have no conflict of interest with this applicant
              </label>
              <Button className="mt-4" variant="secondary" onClick={() => act.run("scoreApplication", { appId: id, total: score, noConflict }, "Score recorded.")}>
                Record my score
              </Button>
            </>
          )}
          {canReview && ["submitted", "info"].includes(a.status) && tiers.length > 0 && (
            <div className="mt-6 border-t border-line pt-4">
              <p className="font-medium">Recommend a tier</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {tiers.map((t) => (
                  <ActionButton key={t.amount} actor={persona.id} type="shortlist" args={{ appId: id, tier: t.amount }} variant={t.amount === 4500 ? "primary" : "secondary"} success="Shortlisted.">
                    {fmt(t.amount)}
                  </ActionButton>
                ))}
              </div>
              <p className="mt-2 text-small text-subtle">{tiers.map((t) => `${fmt(t.amount)}: ${t.criterion.toLowerCase()}`).join(" · ")}{tiers.length < (fund.tiers?.length ?? 0) ? ` · Higher tiers are above the ${fmt(a.requested)} requested.` : ""}</p>
            </div>
          )}
          {a.status === "shortlisted" && <p className="mt-4 flex gap-2 text-signal"><CircleCheck className="size-5" aria-hidden="true" /> Shortlisted at {fmt(a.recommendedTier!)}. A different person with Approve decides.</p>}
          {["offered", "accepted", "waiting", "notselected"].includes(a.status) && <p className="mt-4 flex items-center gap-2 text-small">Decision sent: <AppStatus s={a.status} funderView /></p>}
          {!canReview && <p className="mt-4 flex gap-2 text-small text-subtle"><CircleHelp className="mt-0.5 size-4" aria-hidden="true" /> Your permissions do not include Review.</p>}
          <Message error={act.error} done={act.done} />
        </aside>
      </div>
    </div>
  );
}

/* ================================================================ Selection */

export function SelectionPage({ persona, id }: { persona: Person; id: string }) {
  const { world: w } = useStore();
  const o = w.opps[id];
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
      <Section title={`Recommendations · ${short.length}`}>
        <ul>
          {short.filter((a) => !a.light).map((a) => (
            <Row key={a.id}>
              <span>
                {athleteLabel(w, a.applicantId, persona)} · requested {fmt(a.requested)} · scores {a.scores.map((s) => s.total).join(" and ")}
              </span>
              <span className="text-small">Recommended tier {fmt(a.recommendedTier!)} (published tier; not the {fmt(a.requested)} requested)</span>
            </Row>
          ))}
          <Row>
            <span className="text-muted">{short.some((a) => !a.light) ? "+ " : ""}{plural(short.filter((a) => a.light).length, short.some((a) => !a.light) ? "more recommendation" : "recommendation")} from the two reviewers (summarised)</span>
            <span className="text-small text-subtle">{short.filter((a) => a.pendingFact).length} with one fact still to verify → waiting list</span>
          </Row>
        </ul>
      </Section>
      <div className="mt-8">
        {o.status === "decided" ? (
          <p className="flex gap-2 text-signal"><CircleCheck className="size-5" aria-hidden="true" /> Decisions sent to all {apps.length} applicants. Every unsuccessful message links to other open opportunities.</p>
        ) : (
          <>
            <Button onClick={() => act.run("sendDecisions", { oppId: id }, "Decisions sent.")} arrow>
              Send decisions
            </Button>
            <p className="mt-2 text-small text-subtle">Decisions go to every applicant together. Nobody who scored an application can approve it.</p>
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
  const [tab, setTab] = useState<"agreements" | "reports">("agreements");
  const own = Object.values(w.agreements).filter((g) => w.funds[g.fundId].funderId === fid && !g.light);
  // Agreements from before the demonstration dates are summarised per fund, so the list and the table always agree.
  const earlier = funds
    .map((f) => {
      const gs = Object.values(w.agreements).filter((g) => g.fundId === f.id && g.light);
      return { fund: f, n: gs.length, committed: sum(gs.map((g) => g.amount)), released: sum(gs.map((g) => released(w, g.id))) };
    })
    .filter((e) => e.n > 0);
  const pt = platformTotals(w);
  void pt;
  return (
    <div className="pb-8">
      <PageHead eyebrow={`Funding · ${w.funders[fid].name}`} title="Where is our money?" lead="Every fund, totalled by type: development, programme, in-kind and commercial never mix. Every figure comes from the records." />
      <Tabs label="Funding" value={tab} onChange={setTab} tabs={[{ id: "agreements", label: "Agreements" }, { id: "reports", label: "Reports" }]} />
      {tab === "agreements" ? (
        <>
          <ul className="mt-4 border-t border-line md:hidden">
            {funds.map((f) => {
              const t = fundTotals(w, f.id);
              return (
                <li key={f.id} className="border-b border-line py-4">
                  <p className="font-medium">{f.name}</p>
                  <p className="text-small text-subtle">{f.type} · {policyText(f.policy).toLowerCase()} · {plural(t.count, "agreement")}</p>
                  <div className="mt-3"><FundBar announced={t.announced} committed={t.committed} reserved={t.held} /></div>
                  <p className="mt-2 text-small text-muted">Released {fmt(t.released)}</p>
                </li>
              );
            })}
          </ul>
          <div className="relative mt-4 hidden overflow-x-auto md:block">
            <table className="w-full min-w-[52rem] text-table">
              <thead>
                <tr className="label-data border-b border-line text-left text-subtle">
                  <th className="sticky left-0 bg-canvas py-3 pr-4">Fund</th>
                  <th className="py-3 pr-4">Type · approval</th>
                  <th className="py-3 pr-4 text-right">Agreements</th>
                  <th className="py-3 pr-4 text-right">Committed</th>
                  <th className="py-3 pr-4 text-right">Held for offers</th>
                  <th className="py-3 pr-4 text-right">Released</th>
                  <th className="py-3 text-right">Available</th>
                </tr>
              </thead>
              <tbody>
                {funds.map((f) => {
                  const t = fundTotals(w, f.id);
                  return (
                    <tr key={f.id} className="h-14 border-b border-line">
                      <td className="sticky left-0 bg-canvas pr-4 font-medium">{f.name}</td>
                      <td className="pr-4">
                        <Chip kind="neutral">{f.type}</Chip> <span className="block text-small text-subtle">{policyText(f.policy)}</span>
                      </td>
                      <td className="pr-4 text-right">{t.count}</td>
                      <td className="pr-4 text-right"><SeeSource name={`${f.name} committed`}>{fmt(t.committed)}</SeeSource></td>
                      <td className="pr-4 text-right">{fmt(t.held)}</td>
                      <td className="pr-4 text-right"><SeeSource name={`${f.name} released`}>{fmt(t.released)}</SeeSource></td>
                      <td className="text-right">{fmt(t.available)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <Section title="Agreements to follow">
            {own.length === 0 && earlier.length === 0 ? <Empty>No agreements yet.</Empty> : (
              <ul>
                {earlier.map((e) => (
                  <Row key={e.fund.id}>
                    <div>
                      <p className="font-medium">{plural(e.n, w.funds[e.fund.id].type.toLowerCase())} · {e.fund.name}</p>
                      <p className="mt-1 text-small text-subtle">Earlier agreements, shown as one line · {fmt(e.committed)} committed · {fmt(e.released)} released</p>
                    </div>
                    <SeeSource name={`${e.fund.name} earlier agreements`}>{fmt(e.committed)}</SeeSource>
                  </Row>
                ))}
                {own.map((g) => {
                  const rel = released(w, g.id);
                  return (
                    <Row key={g.id}>
                      <div>
                        <p className="font-medium">
                          {recipientName(w, g.recipientKind, g.recipientId, persona)} · {w.funds[g.fundId].type} · {fmt(g.amount)}
                        </p>
                        <p className="mt-1 flex items-center gap-2 text-small text-subtle">
                          <MiniLine total={6} current={rel ? 2 : 1} label={rel ? "Released" : "Committed"} /> {rel ? `${fmt(rel)} released` : "Committed · payment to record"} · {g.origin}
                        </p>
                      </div>
                      {rel === 0 && persona.perms.includes("Finance") && (
                        <ActionButton actor={persona.id} type="recordRelease" args={{ agreementId: g.id, amount: w.funds[g.fundId].type === "Scholarship award" || w.funds[g.fundId].type === "Sponsorship agreement" ? g.amount / 2 : g.amount, ref: `REL-${g.id}`, entryId: `le-${g.id}-${Date.now()}` }} success="Release recorded (simulated). The recipient confirms receipt.">
                          Record release (simulated)
                        </ActionButton>
                      )}
                    </Row>
                  );
                })}
              </ul>
            )}
          </Section>
          <p className="mt-6 text-small text-subtle">Spending updates, verification, deliverables and reviews start on 30 Jun. In-kind items and commercial agreements are reported apart and never added to development totals.</p>
        </>
      ) : (
        <div className="mt-6 max-w-2xl text-muted">
          <p>Reports are drafted only from verified records, pass a claims check, and keep outputs, sporting outcomes and impact apart. Report drafting arrives in the next build.</p>
          <p className="mt-3 text-small text-subtle">Delivery and spending records show what was delivered and spent; they do not on their own prove social impact.</p>
        </div>
      )}
    </div>
  );
}
