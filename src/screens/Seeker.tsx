import { useMemo, useState } from "react";
import { ArrowRight, BadgeCheck, Building2, ChevronRight, CircleCheck, CircleHelp, CircleX, HandHeart, Landmark, Lock, Megaphone, Search, Shirt, Sparkles, UserRound, UsersRound } from "lucide-react";
import { useStore } from "../state/store";
import { DATE, type Athlete, type Funder, type Opportunity, type Person, type World } from "../domain/model";
import { agreementsFor, eligibility, fmt, fundTotals, offersFor, oppStatusAt, received, released, requestTotals, stateLabel } from "../domain/engine";
import { btn, Button, Chip, cn, FilterPill, HeroBand, Label, PageHead, Panel, SimulatedAI, Tabs } from "../components/ui";
import { FundingBar, FundingLine, NeedBar } from "../components/money";
import { ActionButton, AppStatus, Empty, Field, inputCls, Message, Row, Section, useAction } from "./common";
import { useManaging } from "../components/Shell";

const funderOf = (w: World, id: string) => w.funders[id];
const typeIcon: Record<Funder["type"], typeof Building2> = { Foundation: Landmark, Company: Building2, "Sports brand": Shirt, "Government body": Landmark, Federation: UsersRound, "Individual sponsor": UserRound };

/** The athlete this seeker screen is about: the adult athlete, or the athlete a guardian or coach manages. */
function useSubject(persona: Person) {
  const { world } = useStore();
  const managing = useManaging();
  if (persona.role === "athlete") return world.athletes[persona.id];
  if (persona.role === "guardian" || persona.role === "coach") return world.athletes[managing ?? ""];
  return undefined;
}

function EligIcon({ kind }: { kind: "eligible" | "check" | "not" }) {
  if (kind === "eligible") return <CircleCheck className="size-4 shrink-0 text-signal" aria-hidden="true" />;
  if (kind === "check") return <CircleHelp className="size-4 shrink-0 text-steel" aria-hidden="true" />;
  return <CircleX className="size-4 shrink-0 text-subtle" aria-hidden="true" />;
}

/* ===================================================================== Home */

export function SeekerHome({ persona }: { persona: Person }) {
  const { world: w, moment } = useStore();
  const ath = useSubject(persona);
  const org = persona.role === "organisation" ? w.orgs[persona.orgId!] : undefined;
  const first = persona.name.split(" ")[0];
  const needs: { t: string; d: string; a: string; to: string }[] = [];
  const kind = org ? "org" : "athlete";
  const rid = org ? org.id : ath?.id;

  if (persona.role === "athlete" && !ath)
    return (
      <div className="max-w-2xl py-12">
        <p className="label text-signal">Not joined yet</p>
        <h1 className="text-title mt-2">{first} hasn&rsquo;t joined Revivo Impact yet.</h1>
        <p className="mt-3 text-muted">In Journey A she registers independently, with no invitation and no other Revivo account.</p>
        <a href="#/join" className={btn("primary", "mt-6")}>
          Join as {first} <ArrowRight className="size-4" aria-hidden="true" />
        </a>
      </div>
    );

  if (rid) {
    for (const o of offersFor(w, kind, rid).filter((o) => o.status === "held"))
      needs.push({ t: `${funderOf(w, w.funds[o.fundId].funderId).name} offered ${fmt(o.amount)}`, d: `${w.funds[o.fundId].type} · ${ath?.minor ? "only you, as guardian, can accept" : "read what they will see, then accept or decline"}`, a: "Read the offer", to: "applications" });
    for (const g of agreementsFor(w, kind, rid).filter((g) => released(w, g.id) > received(w, g.id)))
      needs.push({ t: `Confirm you received ${fmt(released(w, g.id) - received(w, g.id))}`, d: `${w.funds[g.fundId].name} recorded a payment (simulated)`, a: "Confirm receipt", to: "funding" });
    for (const app of Object.values(w.applications).filter((x) => x.applicantId === rid)) {
      if (app.status === "info" && app.info?.status === "open") needs.push({ t: "The panel needs one more document", d: app.info.text, a: "Answer", to: "applications" });
      if (app.status === "draft") needs.push({ t: `Finish your application to ${w.opps[app.oppId].title}`, d: app.preparedBy !== persona.id ? `Prepared by ${w.people[app.preparedBy]?.name}; waiting for you to submit` : "Saved as a draft", a: persona.role === "coach" ? "See the draft" : "Submit application", to: "applications" });
    }
    for (const it of Object.values(w.interests).filter((x) => x.athleteId === rid && x.status === "sent")) needs.push({ t: `${funderOf(w, it.funderId).name} is interested in your profile`, d: `"${it.reason}" Share more, or say no thanks. Saying no changes nothing.`, a: "Answer", to: "applications" });
  }
  const shown = needs.slice(0, 3);
  const quick = org
    ? [
        { t: "Find programme and club funding", to: "discover", icon: Search },
        { t: "Publish a funding request", to: "publish", icon: Megaphone },
        { t: "See offers and applications", to: "applications", icon: HandHeart },
      ]
    : [
        { t: "Find scholarships and grants", to: "discover", icon: Search },
        { t: "Find sponsors who accept asks", to: "discover?sponsors", icon: HandHeart },
        ...(persona.role === "coach" ? [] : [{ t: "Publish a funding request", to: "publish", icon: Megaphone }]),
        { t: persona.role === "coach" ? "See applications you prepared" : "See your applications", to: "applications", icon: CircleCheck },
      ];
  const agreements = rid ? agreementsFor(w, kind, rid) : [];

  return (
    <div className="pb-8">
      <HeroBand file={persona.role === "guardian" ? "im-04-guardian-offer.png" : org ? "im-08-community-programme.png" : "im-03-athlete-home.png"} phone="after">
        <p className="label text-signal">{org ? `${org.type} · ${org.region}` : ath ? `${persona.role === "athlete" ? "Athlete" : persona.role === "guardian" ? "Guardian" : "Coach"} · ${ath.sport.toLowerCase()} · ${ath.region}` : "Guardian"}</p>
        <h1 className="text-title mt-2">
          {persona.role === "athlete" ? `Hello ${first}. Here’s what needs you.` : persona.role === "guardian" ? `What needs you for ${ath?.name.split(" ")[0] ?? ""}, ${first}?` : persona.role === "coach" ? `Your athletes, ${first}` : `${org?.name}: what needs you?`}
        </h1>
      </HeroBand>

      {persona.role === "coach" ? (
        <CoachAthletes persona={persona} />
      ) : (
        <Section title={`Needs you · ${shown.length}`}>
          {shown.length === 0 ? (
            <Empty>Nothing needs you right now. Find funding below, or publish a request so funders can find you.</Empty>
          ) : (
            <ul>
              {shown.map((n, i) => (
                <Row key={n.t + i}>
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
      )}

      <Section title="Find funding your way">
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

      {agreements.filter((g) => !g.light).slice(0, 1).map((g) => (
        <Section key={g.id} title={`${w.funds[g.fundId].type} · ${funderOf(w, w.funds[g.fundId].funderId).name}`}>
          <div className="mt-4">
            <AgreementLine w={w} id={g.id} to={org?.name ?? ath?.name ?? ""} />
          </div>
        </Section>
      ))}

      {ath && persona.role !== "coach" && (
        <Section title="Matched for you" aside={<SimulatedAI />}>
          <MatchedStrip w={w} ath={ath} personaId={persona.id} />
        </Section>
      )}
      <p className="mt-8 text-small text-subtle">{agreements.length ? "Delivery and spending records show what was delivered and spent; they do not on their own prove social impact. " : ""}Demo date: {fmtDate(DATE[moment])} 2027; lists follow the date in the top bar.</p>
    </div>
  );
}

function CoachAthletes({ persona }: { persona: Person }) {
  const { world: w } = useStore();
  const auth = w.authorisations.filter((a) => a.coachId === persona.id);
  return (
    <Section title={`Athletes who authorised you · ${auth.length}`}>
      <p className="mt-3 text-small text-muted">For each athlete you may prepare applications and submit updates. You can never submit for an athlete under 18, accept offers, publish requests or change consent.</p>
      <ul>
        {auth.map((z) => {
          const a = w.athletes[z.athleteId];
          const matched = Object.values(w.opps).filter((o) => oppStatusAt(w, o) === "open" && eligibility(w, o, a).kind !== "not");
          return (
            <Row key={z.athleteId}>
              <div>
                <p className="font-medium">
                  {a.name} <span className="text-small text-subtle">· {a.sport} · {a.age}</span>
                </p>
                <p className="text-small text-subtle">
                  {matched.length ? `${matched.length} open: ${matched.map((o) => `${o.title} (closes ${o.closes.slice(8)} ${new Date(o.closes).toLocaleString("en-GB", { month: "short" })})`).join(" · ")}` : "no open opportunities match"}
                </p>
              </div>
              {matched[0] && (
                <a href={`#/app/${persona.id}/apply/${matched[0].id}?for=${a.id}`} className={btn("secondary", "shrink-0")}>
                  Prepare an application
                </a>
              )}
            </Row>
          );
        })}
      </ul>
    </Section>
  );
}

function MatchedStrip({ w, ath, personaId }: { w: World; ath: Athlete; personaId: string }) {
  const held = new Set(Object.values(w.applications).filter((a) => a.applicantId === ath.id).map((a) => a.oppId));
  const list = Object.values(w.opps).filter((o) => oppStatusAt(w, o) === "open" && !held.has(o.id) && !o.forOrganisations && eligibility(w, o, ath).kind !== "not");
  if (list.length === 0) return <Empty>No open opportunities match your profile right now. Your saved search will tell you when one opens.</Empty>;
  return (
    <ul>
      {list.slice(0, 3).map((o) => {
        const e = eligibility(w, o, ath);
        return (
          <li key={o.id} className="border-b border-line">
            <a href={`#/app/${personaId}/opportunity/${o.id}`} className="group flex items-center justify-between gap-4 py-3">
              <span className="min-w-0">
                <span className="block truncate font-medium group-hover:text-signal">{o.title}</span>
                <span className="block text-small text-subtle">
                  {funderOf(w, w.funds[o.fundId].funderId).name} · {o.amountLabel} · closes {fmtDate(o.closes)}
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-2 text-small text-muted">
                <EligIcon kind={e.kind} />
                <ChevronRight className="size-4" aria-hidden="true" />
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export const fmtDate = (iso: string) => new Date(iso + "T12:00:00").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });

/* ================================================================= Discover */

export function SeekerDiscover({ persona }: { persona: Person }) {
  const { world: w, moment } = useStore();
  const ath = useSubject(persona);
  const isOrg = persona.role === "organisation";
  const [tab, setTab] = useState<"opps" | "sponsors">(location.hash.includes("sponsors") ? "sponsors" : "opps");
  const [eligibleOnly, setEligibleOnly] = useState(false);
  const [acceptsOnly, setAcceptsOnly] = useState(false);
  const [why, setWhy] = useState(false);
  const opps = Object.values(w.opps).filter((o) => o.status !== "draft" && o.status !== "awaiting");
  const scored = opps
    .map((o) => ({ o, st: oppStatusAt(w, o), e: isOrg ? { kind: o.forOrganisations ? ("eligible" as const) : ("not" as const), summary: o.forOrganisations ? "For organisations like yours" : "For individual athletes", criteria: [] } : eligibility(w, o, ath) }))
    .filter((x) => (isOrg ? true : ath ? x.o.sportsLabel.toLowerCase().includes(ath.sport.toLowerCase()) || !/^(Swimming|Judo)$/.test(x.o.sportsLabel) : true));
  const open = scored.filter((x) => x.st === "open" && (!eligibleOnly || x.e.kind !== "not")).sort((a, b) => rank(a.e.kind) - rank(b.e.kind) || a.o.closes.localeCompare(b.o.closes));
  const upcoming = scored.filter((x) => x.st === "upcoming");
  const funders = Object.values(w.funders).filter((f) => f.verified && (!ath || f.relevant.some((r) => r === "any" || ath.tags.map((t) => t.toLowerCase()).includes(r.toLowerCase()))) && (!acceptsOnly || f.accepts === "yes"));
  return (
    <div className="pb-8">
      <HeroBand file="im-05-discover-opportunities.png">
        <p className="label text-signal">Discover</p>
        <h1 className="text-title mt-2">Who could fund {isOrg ? "us" : persona.role === "athlete" ? "me" : ath?.name.split(" ")[0] ?? "them"}?</h1>
        <p className="text-lead mt-3 text-muted">Scholarships, grants and sponsors on Revivo Impact. We check {isOrg ? "your organisation" : persona.role === "athlete" ? "your profile" : "the profile"} against each funder&rsquo;s own rules.</p>
      </HeroBand>
      <Tabs label="Discover" value={tab} onChange={setTab} tabs={[{ id: "opps", label: "Funding opportunities", count: open.length }, { id: "sponsors", label: "Sponsors & funders", count: funders.length }]} />
      <div className="mt-4 flex flex-wrap items-center gap-2" aria-label="Filters">
        {ath && <FilterPill on>Sport: {ath.sport.toLowerCase()}</FilterPill>}
        {ath && <FilterPill on>Region: {ath.region.replace(" Region", "")}</FilterPill>}
        {tab === "opps" ? (
          <button type="button" aria-pressed={eligibleOnly} onClick={() => setEligibleOnly(!eligibleOnly)}>
            <FilterPill on={eligibleOnly}>I&rsquo;m eligible</FilterPill>
          </button>
        ) : (
          <button type="button" aria-pressed={acceptsOnly} onClick={() => setAcceptsOnly(!acceptsOnly)}>
            <FilterPill on={acceptsOnly}>Accepts support asks</FilterPill>
          </button>
        )}
        <button type="button" onClick={() => setWhy(true)} className="ml-auto min-h-11 text-small text-muted underline underline-offset-4 hover:text-ink">
          Why these appear
        </button>
      </div>
      {tab === "opps" ? (
        <>
          <p className="mt-6 text-small text-subtle">
            {open.length} open on {fmtDate(DATE[moment])} from {new Set(open.map((x) => w.funds[x.o.fundId].funderId)).size} organisations · eligible first, then by deadline
          </p>
          <ul className="mt-2 border-t border-line">
            {open.map(({ o, e }) => (
              <OppRow key={o.id} w={w} o={o} summary={e.summary} kind={e.kind} personaId={persona.id} />
            ))}
            {open.length === 0 && <Empty li>No opportunities are open on this date. Save a search and we&rsquo;ll tell you when one opens.</Empty>}
          </ul>
          {upcoming.length > 0 && (
            <details className="mt-8">
              <summary className="min-h-11 cursor-pointer py-2 font-medium text-muted hover:text-ink">Show {upcoming.length} upcoming</summary>
              <ul className="mt-2 border-t border-line">
                {upcoming.map(({ o }) => (
                  <OppRow key={o.id} w={w} o={o} summary={o.forOrganisations ? "For organisations" : "Check when it opens"} kind="check" personaId={persona.id} />
                ))}
              </ul>
            </details>
          )}
        </>
      ) : (
        <>
          <p className="mt-6 text-small text-subtle">Participating funders relevant to {isOrg ? "you" : "this profile"}. Revivo Impact shows participating organisations only; it is not a list of every sponsor.</p>
          <ul className="mt-2 border-t border-line">
            {funders.map((f) => (
              <FunderRow key={f.id} f={f} personaId={persona.id} />
            ))}
          </ul>
        </>
      )}
      <p className="mt-6 text-small text-subtle">Eligibility is checked against each funder&rsquo;s published rules. Meeting them doesn&rsquo;t guarantee an award; a review panel decides.</p>
      <Panel open={why} onClose={() => setWhy(false)} title="Why these appear" eyebrow="Matching · Simulated AI">
        <SimulatedAI />
        <p className="mt-4 text-muted">
          {ath ? `Suggested because the sport (${ath.sport.toLowerCase()}), region (${ath.region}) and level on the profile match these funders' published criteria.` : "Suggested from your organisation's sport and region."}
        </p>
        <ul className="mt-4 space-y-2 text-small">
          <li>· Eligibility comes from each funder&rsquo;s rules, not from AI.</li>
          <li>· Order: eligible first, then the deadline. Never popularity or any score of a person.</li>
        </ul>
        <p className="mt-6 text-small text-subtle">AI-assisted, simulated in this prototype. Check against sources.</p>
      </Panel>
    </div>
  );
}
const rank = (k: string) => (k === "eligible" ? 0 : k === "check" ? 1 : 2);

function OppRow({ w, o, summary, kind, personaId }: { w: World; o: Opportunity; summary: string; kind: "eligible" | "check" | "not"; personaId: string }) {
  const f = funderOf(w, w.funds[o.fundId].funderId);
  const days = (Date.parse(o.closes) - Date.parse(DATE[w.moment])) / 86400000;
  return (
    <li className="border-b border-line">
      <a href={`#/app/${personaId}/opportunity/${o.id}`} className="group grid gap-2 py-4 lg:grid-cols-[1.6fr_1fr_0.8fr_1.4fr_auto] lg:items-center lg:gap-6">
        <span className="min-w-0">
          <span className="flex flex-wrap items-center gap-2 text-small text-subtle">
            {f.name} {f.verified && <BadgeCheck className="size-3.5 text-muted" aria-label="Verified organisation (simulated)" />} · {f.type}
          </span>
          <span className="mt-0.5 block font-display text-xl font-bold group-hover:text-signal">{o.title}</span>
          <span className="mt-1 inline-flex">
            <Chip kind="neutral">{w.funds[o.fundId].type}</Chip>
          </span>
        </span>
        <span className="flex flex-wrap items-baseline gap-x-2 lg:block">
          <span className="block font-medium tabular-nums">{o.amountLabel}</span>
          <span className="block text-small text-subtle">{o.awardsLabel}</span>
        </span>
        <span className="text-small">
          <span className="text-subtle lg:block">{oppStatusAt(w, o) === "upcoming" ? "Opens " : "Closes "}</span>
          <span className="font-medium">{fmtDate(oppStatusAt(w, o) === "upcoming" ? o.opens : o.closes)}</span>
          {oppStatusAt(w, o) === "open" && days >= 0 && <span className={cn("ml-2 lg:ml-0 lg:block", days <= 7 ? "text-amber" : "text-subtle")}>{days === 0 ? "Closes today" : `${days} day${days === 1 ? "" : "s"} left`}</span>}
        </span>
        <span className="flex items-start gap-2 text-small">
          <EligIcon kind={kind} />
          <span className={kind === "not" ? "text-subtle" : "text-ink"}>{summary}</span>
        </span>
        <span className="hidden items-center gap-1 text-small font-medium text-muted group-hover:text-ink lg:flex">
          {kind !== "not" && oppStatusAt(w, o) === "open" ? "Apply" : "View"} <ChevronRight className="size-4" aria-hidden="true" />
        </span>
      </a>
    </li>
  );
}

function FunderRow({ f, personaId }: { f: Funder; personaId: string }) {
  const Icon = typeIcon[f.type];
  return (
    <li className="border-b border-line">
      <a href={`#/app/${personaId}/profile/${f.id}`} className="group grid gap-2 py-4 lg:grid-cols-[1.5fr_1.2fr_1.3fr_auto] lg:items-center lg:gap-6">
        <span className="flex items-start gap-3">
          <Icon className="mt-1 size-5 shrink-0 text-muted" aria-hidden="true" />
          <span>
            <span className="block font-display text-xl font-bold group-hover:text-signal">{f.name}</span>
            <span className="flex items-center gap-1.5 text-small text-subtle">
              {f.type} <BadgeCheck className="size-3.5 text-muted" aria-label="Verified (simulated)" />
            </span>
          </span>
        </span>
        <span className="text-small">
          <span className="block text-muted">{f.sports}</span>
          <span className="block text-subtle">
            {f.regions} · {f.typical}
          </span>
        </span>
        <span>{f.accepts === "yes" ? <Chip kind="verified">Accepts support asks</Chip> : f.accepts === "commercial" ? <Chip kind="info">Commercial proposals only</Chip> : <Chip kind="self">Only through opportunities</Chip>}</span>
        <ChevronRight className="hidden size-5 text-subtle lg:block" aria-hidden="true" />
      </a>
    </li>
  );
}

/* ============================================================== Opportunity */

export function OpportunityPage({ persona, id }: { persona: Person; id: string }) {
  const { world: w } = useStore();
  const o = w.opps[id];
  const ath = useSubject(persona);
  if (!o) return <Empty>This opportunity does not exist.</Empty>;
  const f = funderOf(w, w.funds[o.fundId].funderId);
  const fund = w.funds[o.fundId];
  const st = oppStatusAt(w, o);
  const e = eligibility(w, o, ath);
  const mine = ath && Object.values(w.applications).find((a) => a.oppId === id && a.applicantId === ath.id);
  const canApply = st === "open" && !o.forOrganisations && persona.role !== "organisation";
  return (
    <div className="pb-8">
      <HeroBand file={o.image}>
        <p className="flex flex-wrap items-center gap-2 text-small text-muted">
          <a href={`#/app/${persona.id}/profile/${f.id}`} className="underline underline-offset-4 hover:text-ink">
            {f.name}
          </a>
          <BadgeCheck className="size-4 text-muted" aria-label="Verified organisation (simulated)" /> · {f.type}
        </p>
        <h1 className="text-title mt-2">{o.title}</h1>
        <div className="mt-3 flex flex-wrap gap-2">
          <Chip kind="neutral">{fund.type}</Chip>
          <Chip kind={st === "open" ? "current" : "self"}>{st === "open" ? `Open · ${o.visibility}` : st === "upcoming" ? "Upcoming" : st === "decided" ? "Decisions sent" : "Closed"}</Chip>

        </div>
      </HeroBand>
      <dl className="grid grid-cols-2 border-y border-line md:grid-cols-4">
        {[
          ["Funding", fund.tiers ? `Three levels: ${fund.tiers.map((t) => fmt(t.amount)).join(" · ")}` : o.amountLabel],
          ["Awards", `${o.awardsLabel} · ${fmt(fund.announced)} announced`],
          [st === "upcoming" ? "Opens" : "Closes", fmtDate(st === "upcoming" ? o.opens : o.closes)],
          ["Sports", o.sportsLabel],
        ].map(([k, v]) => (
          <div key={k} className="border-line py-4 pr-4 odd:border-r md:border-r md:px-4 md:first:pl-0 md:last:border-r-0">
            <dt className="label-data text-subtle">{k}</dt>
            <dd className="mt-1 font-medium">{v}</dd>
          </div>
        ))}
      </dl>
      {!canApply && st !== "upcoming" && !o.forOrganisations && persona.role !== "organisation" && (
        <div className="mt-6 flex flex-col gap-4 rounded-[10px] border border-line-strong p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-medium">{mine ? "You applied to this opportunity." : "This opportunity has closed."} {mine ? "" : "Others are open now."}</p>
          <a href={`#/app/${persona.id}/${mine ? "applications" : "discover"}`} className={btn("secondary", "shrink-0")}>
            {mine ? "See my application" : "See open opportunities"} <ArrowRight className="size-4" aria-hidden="true" />
          </a>
        </div>
      )}
      {canApply && (
        <div className="mt-6 flex flex-col gap-4 rounded-[10px] border border-line-strong p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-xl font-bold">{ath ? e.summary : "Join to check your eligibility"}</p>
            <p className="text-small text-muted">{mine ? "You have already applied. Follow it in Applications." : "Your profile fills the form; you choose what the funder sees."}</p>
          </div>
          {mine ? (
            <a href={`#/app/${persona.id}/applications`} className={btn("secondary", "shrink-0")}>
              See my application
            </a>
          ) : e.kind !== "not" ? (
            <a href={ath ? `#/app/${persona.id}/apply/${o.id}` : "#/join"} className={btn("primary", "shrink-0")}>
              {ath ? "Apply with my profile" : "Join to apply"} <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          ) : null}
        </div>
      )}
      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr] [&>*]:min-w-0">
        <section aria-labelledby="who">
          <h2 id="who" className="text-subtitle">
            Who can apply
          </h2>
          <p className="mt-1 text-small text-subtle">{ath ? `Checked against ${persona.role === "athlete" ? "your" : `${ath.name.split(" ")[0]}'s`} profile by ${f.name}'s published rules.` : "Published rules."}</p>
          <ul className="mt-4 border-t border-line">
            {(ath ? e.criteria : o.rules.map((r) => ({ label: r.label, result: "check" as const, detail: "" }))).map((c) => (
              <li key={c.label} className="flex gap-3 border-b border-line py-3">
                {c.result === "met" ? <CircleCheck className="mt-0.5 size-5 shrink-0 text-signal" aria-label="Met" /> : c.result === "not" ? <CircleX className="mt-0.5 size-5 shrink-0 text-subtle" aria-label="Not met" /> : <CircleHelp className={cn("mt-0.5 size-5 shrink-0", c.result === "todo" ? "text-amber" : "text-steel")} aria-label={c.result === "todo" ? "To add" : "For the panel to check"} />}
                <span>
                  <span className="block font-medium">{c.label}</span>
                  {c.detail && <span className="block text-small text-subtle">{c.detail}</span>}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-small text-subtle">Eligibility is checked against the funder&rsquo;s published rules. Meeting them doesn&rsquo;t guarantee an award; a review panel decides.</p>
        </section>
        <aside className="space-y-8">
          <section>
            <Label>What it pays for</Label>
            <p className="mt-2 text-muted">{o.purpose}.</p>
          </section>
          {fund.tiers && (
            <section>
              <Label>How the amount is set</Label>
              <ul className="mt-2 space-y-1 text-muted">
                {fund.tiers.map((t) => (
                  <li key={t.amount}>
                    · {fmt(t.amount)}: {t.criterion.toLowerCase()}
                  </li>
                ))}
              </ul>
            </section>
          )}
          <section>
            <Label>How decisions are made</Label>
            <p className="mt-2 text-muted">
              {fund.policy === "Institutional" ? "Two reviewers score each application against four criteria; a different person signs off. " : "A reviewer checks the evidence; a different person signs off. "}
              People decide; AI never does. Decisions by {o.decisions}.
            </p>
          </section>
          <section>
            <Label>What you&rsquo;ll report</Label>
            <p className="mt-2 text-muted">A short update each quarter: what you spent (with receipts) and your sporting progress.</p>
          </section>
        </aside>
      </div>
    </div>
  );
}

/* =========================================================== Public profile */

export function FunderProfile({ persona, id }: { persona: Person; id: string }) {
  const { world: w } = useStore();
  const f = w.funders[id];
  const [open, setOpen] = useState(false);
  const act = useAction(persona.id);
  const ath = useSubject(persona);
  const myRequests = Object.values(w.requests).filter((r) => r.status === "open" && (r.publishedBy === persona.id || (ath && r.ownerId === ath.id) || (persona.orgId && r.ownerId === persona.orgId)));
  const [reqId, setReqId] = useState(myRequests[0]?.id ?? "");
  const req = w.requests[reqId];
  const totals = req ? requestTotals(w, reqId) : null;
  const [lineId, setLineId] = useState(req?.lines[req.lines.length - 1]?.id ?? "l1");
  const line = totals?.lines.find((l) => l.id === lineId);
  const [amount, setAmount] = useState(String(Math.min(line?.remaining ?? 0, f?.acceptsMax ?? 0) || ""));
  const [support, setSupport] = useState(f?.acceptsSupport?.[1] ?? f?.acceptsSupport?.[0] ?? "Travel");
  if (!f) return <Empty>This funder does not exist.</Empty>;
  const opps = Object.values(w.opps).filter((o) => w.funds[o.fundId].funderId === f.id && o.status !== "awaiting" && o.status !== "draft");
  const Icon = typeIcon[f.type];
  const sent = Object.values(w.asks).find((a) => a.funderId === f.id && a.by === persona.id);
  return (
    <div className="pb-8">
      <HeroBand file={f.type === "Individual sponsor" ? "im-19-individual-sponsor.png" : "im-06-funder-visit.png"}>
        <p className="flex items-center gap-2 text-small text-muted">
          <Icon className="size-4" aria-hidden="true" /> {f.type} · participating on Revivo Impact
        </p>
        <h1 className="text-title mt-2">{f.name}</h1>
        <p className="text-lead mt-3 text-muted">{f.objective}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Chip kind="verified">{f.verified ? "Verified (simulated check)" : "Verification requested"}</Chip>
          {f.accepts === "yes" && <Chip kind="verified">Accepts support asks</Chip>}
        </div>
      </HeroBand>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.3fr_1fr] [&>*]:min-w-0">
        <section>
          <h2 className="text-subtitle">What they support</h2>
          <dl className="mt-4 border-t border-line">
            {[
              ["Sports", f.sports],
              ["Regions", f.regions],
              ["Funding types", f.typesLabel.join(" · ")],
              ["Typical support", f.typical],
              ["Asks", f.acceptsNote],
            ].map(([k, v]) => (
              <div key={k} className="grid grid-cols-[8rem_1fr] gap-4 border-b border-line py-3">
                <dt className="text-subtle">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          {opps.length > 0 && (
            <>
              <h3 className="label mt-8 text-subtle">Opportunities</h3>
              <ul className="mt-2 border-t border-line">
                {opps.map((o) => (
                  <li key={o.id} className="border-b border-line py-3">
                    <a className="font-medium hover:text-signal" href={`#/app/${persona.id}/opportunity/${o.id}`}>
                      {o.title}
                    </a>
                    <p className="text-small text-subtle">
                      {o.amountLabel} · {oppStatusAt(w, o)}
                    </p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
        <aside>
          {f.accepts === "yes" ? (
            <div className="rounded-[10px] border border-line-strong p-5">
              <HandHeart className="size-6 text-signal" aria-hidden="true" />
              <h2 className="text-subtitle mt-3">Ask {f.name.split(" ")[0]} for support</h2>
              <p className="mt-2 text-small text-muted">Ask once, for part of one of your funding requests. {f.name.split(" ")[0]} sees only what you share and answers with an offer, a question or &ldquo;not now&rdquo;. No open messaging.</p>
              {sent ? (
                <>
                <p role="status" className="mt-4 flex gap-2 text-ink">
                  <CircleCheck className="mt-0.5 size-5 shrink-0" aria-hidden="true" /> You asked for {fmt(sent.amount)} · {sent.status === "sent" ? "waiting for an answer" : sent.status === "offered" ? "an offer arrived" : sent.status === "notnow" ? "not now" : "a question arrived"}
                </p>
                {sent.status === "offered" && (
                  <a href={`#/app/${persona.id}/applications`} className={btn("primary", "mt-4 w-full")}>
                    See {f.name.split(" ")[0]}&rsquo;s offer <ArrowRight className="size-4" aria-hidden="true" />
                  </a>
                )}
                </>
              ) : myRequests.length === 0 ? (
                <p className="mt-4 text-small text-subtle">
                  An ask links to one of your funding requests.{" "}
                  <a className="underline" href={`#/app/${persona.id}/publish`}>
                    Publish a funding request first.
                  </a>
                </p>
              ) : (
                <Button className="mt-4 w-full" onClick={() => setOpen(true)} arrow>
                  Ask for support
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-[10px] border border-line p-5 text-muted">
              <Search className="size-5" aria-hidden="true" />
              <p className="mt-2">{f.name} funds {f.accepts === "commercial" ? "adult athletes through commercial sponsorship agreements; it contacts athletes whose commercial profile fits." : "only through its published opportunities. Apply to one of those instead."}</p>
            </div>
          )}
          <p className="mt-4 text-small text-subtle">Block this funder or report a concern from Consent &amp; safety at any time.</p>
        </aside>
      </div>
      <Panel open={open} onClose={() => setOpen(false)} title={`Ask ${f.name} for support`} eyebrow="Support ask">
        {req && totals && (
          <>
            <Field label="Funding request" htmlFor="ask-req">
              <select id="ask-req" className={inputCls} value={reqId} onChange={(e) => setReqId(e.target.value)}>
                {myRequests.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.title}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Which part" htmlFor="ask-line">
              <select id="ask-line" className={inputCls} value={lineId} onChange={(e) => setLineId(e.target.value)}>
                {totals.lines.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.label}: {fmt(l.remaining)} still needed
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Kind of support" htmlFor="ask-support">
              <select id="ask-support" className={inputCls} value={support} onChange={(e) => setSupport(e.target.value)}>
                {["Equipment", "Travel", "Coaching"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>
            <Field label="Amount (USD)" hint={`Up to ${fmt(f.acceptsMax ?? 0)} with this funder`} htmlFor="ask-amt">
              <input id="ask-amt" inputMode="numeric" className={cn(inputCls, "max-w-[12rem]")} value={amount} onChange={(e) => setAmount(e.target.value)} />
            </Field>
            <p className="mt-5 text-small text-subtle">{f.name.split(" ")[0]} will see: name, sport and region, verified facts and the request. Not your contact details.</p>
            <Button className="mt-6" onClick={() => act.run("sendAsk", { askId: `ask-${Date.now()}`, requestId: reqId, funderId: f.id, lineId, amount: Number(amount.replace(/\D/g, "")), support }, "Ask sent (simulated).") && setOpen(false)}>
              Send ask
            </Button>
            <Message error={act.error} />
          </>
        )}
      </Panel>
    </div>
  );
}

/* ==================================================================== Apply */

export function Apply({ persona, oppId }: { persona: Person; oppId: string }) {
  const { world: w, go } = useStore();
  const forParam = new URLSearchParams(location.hash.split("?")[1] ?? "").get("for");
  const managing = useManaging();
  const ath = persona.role === "athlete" ? w.athletes[persona.id] : w.athletes[forParam ?? managing ?? ""];
  const o = w.opps[oppId];
  const act = useAction(persona.id);
  const existing = ath && Object.values(w.applications).find((a) => a.oppId === oppId && a.applicantId === ath.id);
  const linkedReq = ath && Object.values(w.requests).find((r) => r.ownerId === ath.id && r.status === "open");
  const remaining = linkedReq ? requestTotals(w, linkedReq.id).remaining : 0;
  const [requested, setRequested] = useState(existing?.requested ?? (linkedReq ? remaining : 4800));
  const [statement, setStatement] = useState(existing?.statement ?? "");
  const [other, setOther] = useState(existing?.otherFunding ?? "");
  const [ai, setAi] = useState(false);
  if (!o || !ath) return <Empty>Choose an athlete and an open opportunity first.</Empty>;
  const e = eligibility(w, o, ath);
  const isCoach = persona.role === "coach";
  const docs = [
    { t: "Proof of age (ID document)", ok: true },
    { t: "Results evidence", ok: ath.facts.some((f) => f.kind === "result") },
    { t: "Coach or club reference", ok: ath.facts.some((f) => f.kind === "coach") || isCoach },
    { t: "Budget with invoices or quotes", ok: false, note: "Coaching-fee invoice missing: add it now or note “to follow”" },
  ];
  const draftWithAI = () => {
    setAi(true);
    const res = ath.facts.find((f) => f.kind === "result");
    setStatement(`I compete in ${ath.sport.toLowerCase()} at ${ath.level.toLowerCase()} level${res ? ` (${res.value})` : ""} and train at ${ath.club ?? "my club"}. [In your own words: why this funding matters to you.] I am asking for ${o.purpose.toLowerCase()}.`);
    if (!other) setOther(ath.currentSupport.length ? ath.currentSupport.map((s) => `${s.label}, ${fmt(s.amount)}`).join("; ") : "None");
  };
  const appId = existing?.id ?? `app-${ath.id}-${oppId}`;
  return (
    <div className="max-w-3xl pb-10">
      <PageHead eyebrow={`Apply · ${o.title}`} title="Is your application ready?" lead={isCoach ? `You are preparing this for ${ath.name}. ${ath.minor ? "Their guardian submits it." : "They submit it."}` : "Your profile fills most of it. Nothing is sent until you submit."} />
      <ol className="space-y-8">
        <li>
          <Label>1 · From your profile</Label>
          <p className="mt-2 text-muted">
            {ath.name} · {ath.age} · {ath.sport} ({ath.discipline}) · {ath.region} · {ath.club ?? "no club"}
          </p>
          <p className="mt-1 text-small text-subtle">{ath.facts.filter((f) => f.state === "verified" || f.state === "confirmed").length} facts verified or confirmed · {ath.facts.filter((f) => f.state === "self" || f.state === "awaiting").length} self-reported or awaiting</p>
        </li>
        <li>
          <Label>2 · Eligibility</Label>
          <p className="mt-2 font-medium">{e.summary}</p>
        </li>
        <li>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Label>3 · Documents</Label>
            <button type="button" onClick={draftWithAI} className={btn("secondary", "min-h-10 px-4 font-sans text-small font-medium tracking-normal")}>
              <Sparkles className="size-4" aria-hidden="true" /> Help me organise this
            </button>
          </div>
          <ul className="mt-2 border-t border-line">
            {docs.map((d) => (
              <li key={d.t} className="flex items-start gap-3 border-b border-line py-3">
                {d.ok ? <CircleCheck className="mt-0.5 size-5 text-signal" aria-label="Ready" /> : <CircleHelp className="mt-0.5 size-5 text-amber" aria-label="Missing" />}
                <span>
                  {d.t}
                  {!d.ok && <span className="block text-small text-amber">{d.note}</span>}
                </span>
              </li>
            ))}
          </ul>
          {ai && (
            <p className="mt-3 flex flex-wrap items-center gap-2 text-small text-subtle">
              <SimulatedAI /> Checklist and draft built only from {persona.role === "athlete" ? "your" : "the"} records. Gaps are marked; nothing is invented.
            </p>
          )}
        </li>
        <li>
          <Label>4 · Budget and other funding</Label>
          <Field label="Amount requested (USD)" hint={linkedReq ? `Linked to the funding request "${linkedReq.title}": ${fmt(remaining)} still needed; this amount is held while the funder decides` : "The panel awards one of the published tiers"} htmlFor="req">
            <input id="req" inputMode="numeric" className={cn(inputCls, "max-w-[12rem]")} value={requested} onChange={(e) => setRequested(Number(e.target.value.replace(/\D/g, "")))} />
          </Field>
          <Field label="Other funding for the same costs" hint="Required. Declare current support so nothing is funded twice." htmlFor="other">
            <input id="other" className={inputCls} value={other} onChange={(e) => setOther(e.target.value)} placeholder="For example: club travel bursary, $300" />
          </Field>
        </li>
        <li>
          <Label>5 · Statement</Label>
          <textarea aria-label="Statement" rows={5} className="mt-2 w-full rounded-[6px] border border-control bg-surface-2 p-3 text-ink" value={statement} onChange={(e) => setStatement(e.target.value)} placeholder="Why this funding matters, in your own words." />
          {ai && <p className="text-small text-subtle">The reviewer will see: drafted with Simulated AI help, edited by the applicant.</p>}
        </li>
        <li>
          <Label>6 · Share and submit</Label>
          <p className="mt-2 text-small text-muted">{w.funders[w.funds[o.fundId].funderId].name} will see: name{ath.minor ? " (first name only)" : ""}, age, sport, region, results, documents, budget, other funding and your statement. ID documents are seen only by its verifiers.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            {isCoach || (ath.minor && persona.role === "guardian" && existing?.status === "draft") ? null : null}
            <Button
              onClick={() => {
                const ok = act.run("saveApplication", { appId, oppId, athleteId: ath.id, requested, statement: statement || "(statement to add)", otherFunding: other || "Not declared", aiDrafted: ai, linkedRequestId: linkedReq?.id });
                if (!ok) return;
                if (isCoach) {
                  go(`app/${persona.id}/applications`);
                  return;
                }
                if (act.run("submitApplication", { appId }, "Application submitted.")) go(`app/${persona.id}/applications`);
              }}
              arrow
            >
              {isCoach ? `Save for ${ath.minor ? "the guardian" : ath.name.split(" ")[0]} to submit` : "Submit application"}
            </Button>
          </div>
          <Message error={act.error} done={act.done} />
        </li>
      </ol>
    </div>
  );
}

/* ============================================================= Applications */

export function SeekerApplications({ persona }: { persona: Person }) {
  const { world: w } = useStore();
  const ath = useSubject(persona);
  const isOrg = persona.role === "organisation";
  const kind = isOrg ? "org" : "athlete";
  const rid = isOrg ? persona.orgId! : ath?.id;
  const apps = Object.values(w.applications).filter((a) => a.applicantId === rid);
  const offers = rid ? offersFor(w, kind, rid).filter((o) => !o.light) : [];
  const asks = Object.values(w.asks).filter((a) => w.requests[a.requestId]?.ownerId === rid);
  const interests = Object.values(w.interests).filter((x) => x.athleteId === rid);
  return (
    <div className="pb-8">
      <PageHead eyebrow="Applications" title={`Where do ${persona.role === "athlete" ? "my" : isOrg ? "our" : `${ath?.name.split(" ")[0]}'s`} applications and offers stand?`} />
      <Section title={`Offers · ${offers.filter((o) => o.status === "held").length} to answer`}>
        {offers.length === 0 ? <Empty>No offers yet. Funders can make offers on your published requests or after an application.</Empty> : (
          <ul>
            {offers.map((o) => {
              const fund = w.funds[o.fundId];
              const fr = funderOf(w, fund.funderId);
              const isMinor = ath?.minor;
              const canAnswer = isOrg ? persona.perms.includes("Approve") : isMinor ? persona.role === "guardian" : persona.role === "athlete";
              return (
                <Row key={o.id}>
                  <div className="min-w-0">
                    <p className="font-medium">
                      {fr.name} · {fund.type} · {fmt(o.amount)}
                    </p>
                    <p className="text-small text-subtle">
                      {o.requestId ? `For "${w.requests[o.requestId].title}"` : fund.name}
                      {o.deliverables && ` · deliverables: ${o.deliverables.join("; ")}`}
                    </p>
                    <p className="text-small text-subtle">
                      {o.status === "accepted" ? `${fr.name.split(" ")[0]} now sees` : `If you accept, ${fr.name.split(" ")[0]} sees`} {isMinor ? "the athlete's first name, sport and results; never contact details or photos" : "your name, sport, results and updates you share"}.{isMinor && o.status !== "accepted" ? " This offer came to you as guardian; the funder cannot contact the athlete." : ""}
                    </p>
                  </div>
                  {o.status === "held" && canAnswer ? (
                    <ActionButton actor={persona.id} type="acceptOffer" args={{ offerId: o.id, agreementId: `ag-${o.id}` }} success="Accepted. Committed.">
                      Accept {fund.type.toLowerCase()}
                    </ActionButton>
                  ) : (
                    <Chip kind={o.status === "accepted" ? "verified" : o.status === "safeguarding" ? "awaiting" : "self"}>{o.status === "accepted" ? "Accepted" : o.status === "safeguarding" ? "In safeguarding review" : o.status === "held" ? "Waiting for the guardian" : o.status === "second-approval" ? "Awaiting the funder's second approver" : "Declined"}</Chip>
                  )}
                </Row>
              );
            })}
          </ul>
        )}
      </Section>
      <Section title="Applications">
        {apps.length === 0 ? <Empty>No applications yet. Discover opportunities and apply with your profile.</Empty> : (
          <ul>
            {apps.map((a) => {
              const o = w.opps[a.oppId];
              const canSubmit = a.status === "draft" && (persona.role === "guardian" || persona.role === "athlete");
              return (
                <Row key={a.id}>
                  <div>
                    <p className="font-medium">
                      {o.title} · {fmt(a.requested)}
                    </p>
                    <p className="text-small text-subtle">
                      {a.status === "draft" && a.preparedBy !== persona.id ? `Prepared by ${w.people[a.preparedBy]?.name} · waiting for you to submit` : a.status === "submitted" ? `Next: decisions by ${o.decisions}` : a.status === "offered" ? "An offer is waiting above" : a.status === "notselected" ? "Your profile stays ready; other opportunities are open." : a.status === "waiting" ? "Your score reached the minimum; one fact is still being verified." : ""}
                      {a.info?.status === "open" && ` · The panel asks: ${a.info.text}`}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <AppStatus s={a.status} />
                    {canSubmit && <ActionButton actor={persona.id} type="submitApplication" args={{ appId: a.id }} success="Submitted.">Submit application</ActionButton>}
                    {a.info?.status === "open" && <ActionButton actor={persona.id} type="answerInfo" args={{ appId: a.id, otherFunding: ath?.currentSupport.map((s) => `${s.label}, ${fmt(s.amount)}`).join("; ") || "None" }} success="Answered.">Upload invoice and declare</ActionButton>}
                  </div>
                </Row>
              );
            })}
          </ul>
        )}
      </Section>
      {(asks.length > 0 || interests.length > 0) && (
        <Section title="Asks and interest">
          <ul>
            {asks.map((a) => (
              <Row key={a.id}>
                <p>
                  You asked <span className="font-medium">{funderOf(w, a.funderId).name}</span> for {fmt(a.amount)} · {w.requests[a.requestId].title}
                </p>
                <Chip kind={a.status === "offered" ? "verified" : a.status === "notnow" ? "self" : "awaiting"}>{a.status === "offered" ? "Offer made" : a.status === "notnow" ? "Not now" : a.status === "question" ? "Question asked" : "Waiting for an answer"}</Chip>
              </Row>
            ))}
            {interests.map((x) => (
              <Row key={x.id}>
                <div>
                  <p className="font-medium">{funderOf(w, x.funderId).name} is interested</p>
                  <p className="text-small text-subtle">&ldquo;{x.reason}&rdquo; Saying no changes nothing.</p>
                </div>
                {x.status === "sent" && persona.role === "athlete" ? (
                  <div className="flex gap-3">
                    <ActionButton actor={persona.id} type="respondInterest" args={{ interestId: x.id, share: true }} success="Shared.">Share my season plan</ActionButton>
                    <ActionButton actor={persona.id} type="respondInterest" args={{ interestId: x.id, share: false }} variant="secondary">No thanks</ActionButton>
                  </div>
                ) : (
                  <Chip kind="self">{x.status === "shared" ? "You shared more" : x.status === "declined" ? "You declined" : "Sent"}</Chip>
                )}
              </Row>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
}

/* =============================================================== My Funding */

function AgreementLine({ w, id, to }: { w: World; id: string; to: string }) {
  const g = w.agreements[id];
  const fund = w.funds[g.fundId];
  const rel = released(w, id);
  const rec = received(w, id);
  const commercial = fund.type === "Sponsorship agreement";
  const nodes = commercial
    ? [
        { short: "Agreement", full: "Sponsorship agreement", stat: fmt(g.amount) },
        { short: "Funding", full: "Payments", stat: rel ? `${fmt(rel)}${rec >= rel ? " · received" : ""}` : "—" },
        { short: "Deliverables", full: "Agreed deliverables", stat: `${w.offers[g.offerId ?? ""]?.deliverables?.length ?? 3} agreed`, note: "Evidence starts 30 Jun" },
        { short: "Evidence", full: "Evidence", stat: "—" },
        { short: "Review", full: "Review", stat: "—" },
      ]
    : [
        { short: "Need", full: "Funding need", stat: g.requestId ? fmt(requestTotals(w, g.requestId).requested) : w.applications[w.offers[g.offerId ?? ""]?.applicationId ?? ""] ? fmt(w.applications[w.offers[g.offerId!]!.applicationId!].requested) : "—" },
        { short: "Support", full: "Approved support", stat: fmt(g.amount), note: `Accepted ${g.acceptedAt === "may06" ? "6 May" : g.acceptedAt}` },
        { short: "Released", full: "Funds released and received", stat: rel ? `${fmt(rel)} of ${fmt(g.amount)}` : "Next: payment", note: rel ? (rec >= rel ? "Received" : "Confirm receipt") : undefined },
        { short: "Spent", full: "Expenditure and verification", stat: "—", note: "Spending updates start 30 Jun" },
        { short: "Progress", full: "Sporting progress", stat: "—" },
        { short: "Review", full: "Funding review", stat: "—" },
      ];
  return <FundingLine from={funderOf(w, fund.funderId).name} to={to} current={rel ? (commercial ? 1 : 2) : 1} nodes={nodes} />;
}

export function MyFunding({ persona }: { persona: Person }) {
  const { world: w } = useStore();
  const ath = useSubject(persona);
  const isOrg = persona.role === "organisation";
  const kind = isOrg ? "org" : "athlete";
  const rid = isOrg ? persona.orgId! : ath?.id;
  const ags = rid ? agreementsFor(w, kind, rid) : [];
  const reqs = Object.values(w.requests).filter((r) => r.ownerId === rid && r.status !== "closed");
  const dev = ags.filter((g) => w.funds[g.fundId].type !== "Sponsorship agreement");
  const com = ags.filter((g) => w.funds[g.fundId].type === "Sponsorship agreement");
  return (
    <div className="pb-8">
      <PageHead eyebrow={isOrg ? "Funding" : "My Funding"} title={`What support ${persona.role === "athlete" ? "do I" : isOrg ? "do we" : `does ${ath?.name.split(" ")[0]}`} have?`} lead="Agreed, paid and still to come, in plain words. Every figure comes from the records." />
      {ags.length === 0 && reqs.length === 0 && <Empty>No support yet. Apply to opportunities or publish a funding request so funders can find {isOrg ? "you" : "you"}.</Empty>}
      {[...dev, ...com].map((g) => {
        const fund = w.funds[g.fundId];
        const rel = released(w, g.id);
        const rec = received(w, g.id);
        return (
          <Section key={g.id} title={`${fund.type} · ${funderOf(w, fund.funderId).name}${fund.type === "Sponsorship agreement" ? " · commercial (kept apart from development funding)" : ""}`}>
            <div className="mt-4">
              <AgreementLine w={w} id={g.id} to={isOrg ? w.orgs[rid!].name : ath!.name} />
            </div>
            <div className="mt-6">
              <FundingBar committed={g.amount} released={rel} reported={0} verified={0} receivedOn={rec >= rel && rel ? "receipt confirmed" : rel ? "receipt not yet confirmed" : undefined} />
            </div>
            {rel > rec && (persona.role !== "coach") && (
              <ActionButton className="mt-5" actor={persona.id} type="confirmReceipt" args={{ agreementId: g.id, entryId: `rc-${g.id}-${Date.now()}` }} success="Receipt confirmed. This is your confirmation, not a bank check.">
                Confirm I received {fmt(rel - rec)}
              </ActionButton>
            )}
          </Section>
        );
      })}
      {reqs.length > 0 && (
        <Section title="Funding requests">
          <ul>
            {reqs.map((r) => {
              const t = requestTotals(w, r.id);
              return (
                <li key={r.id} className="border-b border-line py-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium">{r.title}</p>
                    <span className="flex gap-2">
                      <Chip kind={t.status === "Partly funded" ? "current" : "self"}>{t.status}</Chip>
                      {!r.discoverable && <Chip kind="self">Hidden from discovery</Chip>}
                      {r.minor && <Chip kind="neutral">Anonymised card</Chip>}
                    </span>
                  </div>
                  <div className="mt-3 max-w-xl">
                    <NeedBar requested={t.requested} pledged={t.pledged} received={t.received} otherSources={t.other} held={t.heldApp} />
                  </div>
                  <ul className="mt-3 space-y-1 text-small text-muted">
                    {t.lines.map((l) => (
                      <li key={l.id}>
                        {l.label}: {fmt(l.amount)} · {fmt(l.pledged)} pledged{l.heldApp ? ` · ${fmt(l.heldApp)} held for an application` : ""} · {fmt(l.remaining)} still needed
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>
        </Section>
      )}
      <p className="mt-8 text-small text-subtle">Delivery and spending records show what was delivered and spent; they do not on their own prove social impact.</p>
    </div>
  );
}

/* ================================================================ Profile */

export function MyProfile({ persona }: { persona: Person }) {
  const { world: w } = useStore();
  const ath = useSubject(persona);
  const act = useAction(persona.id);
  if (persona.role === "organisation") {
    const org = w.orgs[persona.orgId!];
    return (
      <div className="pb-8">
        <PageHead eyebrow="Organisation" title={org.name} lead={`${org.type} · ${org.region} · ${org.sport}`} />
        <Chip kind="verified">Organisation verified (simulated)</Chip>
        <Section title="People and permissions">
          <ul>
            {Object.values(w.people).filter((p) => p.orgId === org.id).map((p) => (
              <Row key={p.id}>
                <span>{p.name}</span>
                <span className="text-small text-subtle">{p.perms.join(", ") || "Member"}</span>
              </Row>
            ))}
          </ul>
        </Section>
      </div>
    );
  }
  if (!ath) return <Empty>Join first to build a sporting profile.</Empty>;
  const own = persona.role === "athlete" || persona.role === "guardian";
  return (
    <div className="pb-8">
      <PageHead eyebrow={persona.role === "athlete" ? "Profile" : `My Athletes · ${ath.name}`} title="What do funders see about me?" lead={`${ath.sport} · ${ath.discipline} · ${ath.region}${ath.club ? ` · ${ath.club}` : ""}. One profile for every application and request.`} />
      {ath.facts.length === 0 && own && persona.id === "amira" && (
        <ActionButton actor={persona.id} type="buildProfile" args={{ athleteId: ath.id }} success="Profile built. Choose what is discoverable.">
          Add my results, coach and support
        </ActionButton>
      )}
      {!ath.minor && own && (
        <div className="mt-6 rounded-[10px] border border-line-strong p-5">
          <p className="font-medium">Can verified funders find {persona.role === "athlete" ? "you" : ath.name} in Discover?</p>
          <p className="text-small text-subtle">Only facts marked &ldquo;Discoverable&rdquo; are shown, never contact details. You can change this at any time.</p>
          <div className="mt-3 flex gap-3">
            {[true, false].map((v) => (
              <button key={String(v)} type="button" aria-pressed={ath.discoverable === v} onClick={() => act.run("setDiscoverable", { athleteId: ath.id, value: v })} className={cn("min-h-11 min-w-24 rounded-full border px-5 font-display font-bold", ath.discoverable === v ? (v ? "border-lime bg-lime text-on-lime" : "border-ink bg-ink text-canvas") : "border-control text-ink")}>
                {v ? "Yes" : "No"}
              </button>
            ))}
          </div>
        </div>
      )}
      {ath.minor && <p className="mt-6 flex gap-2 text-muted"><Lock className="mt-1 size-4 shrink-0" aria-hidden="true" /> Athletes under 18 are never discoverable as profiles. Funders see only an anonymised request the guardian publishes.</p>}
      <Section title={`Sporting facts · ${ath.facts.filter((f) => f.state === "verified" || f.state === "confirmed").length} verified or confirmed · ${ath.facts.filter((f) => f.state === "self" || f.state === "awaiting" || f.state === "attested").length} other`}>
        {ath.facts.length === 0 ? <Empty>No facts yet.</Empty> : (
          <ul>
            {ath.facts.map((f) => (
              <li key={f.id} className="grid gap-3 border-b border-line py-4 md:grid-cols-[1.6fr_1fr_auto] md:items-center">
                <div>
                  <p className="text-small text-subtle">{f.label}</p>
                  <p className="font-medium">{f.value}</p>
                  <p className="mt-1">
                    <Chip kind={f.state === "verified" || f.state === "confirmed" ? "verified" : f.state === "awaiting" ? "awaiting" : "self"}>{stateLabel(f)}</Chip>
                  </p>
                </div>
                {own ? (
                  <label className="text-small">
                    <span className="sr-only">Who can see {f.label}</span>
                    <select className={cn(inputCls, "h-11")} value={f.visibility} onChange={(e) => act.run("setVisibility", { athleteId: ath.id, factId: f.id, visibility: e.target.value })}>
                      {!ath.minor && <option value="discoverable">Discoverable</option>}
                      <option value="application">Shared on application</option>
                      <option value="private">Private</option>
                    </select>
                  </label>
                ) : (
                  <span className="text-small text-subtle">{f.visibility}</span>
                )}
                {own && f.kind === "result" && f.state !== "confirmed" && f.state !== "verified" && !f.confirmAsked && (
                  <button type="button" className={btn("secondary", "min-h-10 px-4 font-sans text-small font-medium tracking-normal")} onClick={() => act.run("askConfirmation", { athleteId: ath.id, factId: f.id, orgName: ath.sport === "Judo" ? "Ardent Judo Federation" : "your federation" }, "Confirmation requested.")}>
                    Ask my federation to confirm
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
        <Message error={act.error} done={act.done} />
      </Section>
      {ath.commercial && (
        <Section title="Commercial profile (only for commercial sponsors)">
          <p className="mt-3 text-small text-subtle">Shown only to brands in a sponsorship context. Never used for scholarships, grants or the order of any list. Audience figures are self-reported; there is no live connection to social media.</p>
          <dl className="mt-3 border-t border-line">
            {[
              ["Social media (links)", ath.commercial.social.join(" · ")],
              ["Audience (self-reported)", ath.commercial.audience],
              ["Previous partnerships", ath.commercial.partnerships.join(" · ")],
              ["Promotional activities", ath.commercial.activities.join(" · ")],
            ].map(([k, v]) => (
              <div key={k} className="grid gap-1 border-b border-line py-3 sm:grid-cols-[13rem_1fr]">
                <dt className="text-subtle">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </Section>
      )}
      <Section title="Current support">
        <ul>
          {ath.currentSupport.length === 0 ? <Empty li>None declared.</Empty> : ath.currentSupport.map((s) => (
            <Row key={s.label}>
              <span>{s.label}</span>
              <span className="tabular-nums">{fmt(s.amount)} · {s.declared ? "declared on applications" : "not yet declared"}</span>
            </Row>
          ))}
        </ul>
      </Section>
    </div>
  );
}

/* ================================================================ Publish */

export function Publish({ persona }: { persona: Person }) {
  const { world: w, go } = useStore();
  const ath = useSubject(persona);
  const isOrg = persona.role === "organisation";
  const act = useAction(persona.id);
  const [title, setTitle] = useState(ath?.minor ? "Competition travel" : "");
  const [lines, setLines] = useState<{ label: string; amount: number }[]>(ath?.minor ? [{ label: "Competition travel and entry", amount: 2400 }] : [{ label: "", amount: 0 }]);
  const [month, setMonth] = useState("August");
  const preview = useMemo(() => {
    if (!ath?.minor) return null;
    const ageGroup = ath.age < 14 ? "Under 14" : ath.age < 16 ? "14–15" : "16–17";
    const n = Object.values(w.athletes).filter((a) => a.minor && a.sport === ath.sport && a.age >= (ageGroup === "14–15" ? 14 : 16) && a.age <= (ageGroup === "14–15" ? 15 : 17) && a.region === ath.region).length;
    return { ageGroup, n };
  }, [ath, w]);
  if (persona.role === "coach") return <Empty>Only an adult athlete, a guardian or an organisation publishes funding requests. A coach cannot publish for a minor.</Empty>;
  const total = lines.reduce((a, l) => a + (l.amount || 0), 0);
  const ownerId = isOrg ? persona.orgId! : ath?.id;
  const sport = isOrg ? w.orgs[persona.orgId!].sport : ath?.sport ?? "";
  return (
    <div className="max-w-3xl pb-10">
      <PageHead eyebrow="Publish a funding request" title="What do you need funding for?" lead="Funders who support your sport can find it in Discover and offer full or part funding, line by line." />
      <Field label="What it is for" htmlFor="pr-title">
        <input id="pr-title" className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="For example: racing wheels and competition travel" />
      </Field>
      <fieldset className="mt-6">
        <legend className="font-medium">Breakdown</legend>
        <p className="text-small text-subtle">Funders can offer for one line; nothing can be funded twice.</p>
        {lines.map((l, i) => (
          <div key={i} className="mt-3 grid grid-cols-[1fr_9rem] gap-3">
            <input aria-label={`Line ${i + 1} description`} className={inputCls} value={l.label} onChange={(e) => setLines(lines.map((x, k) => (k === i ? { ...x, label: e.target.value } : x)))} placeholder="Item" />
            <input aria-label={`Line ${i + 1} amount`} inputMode="numeric" className={inputCls} value={l.amount || ""} onChange={(e) => setLines(lines.map((x, k) => (k === i ? { ...x, amount: Number(e.target.value.replace(/\D/g, "")) } : x)))} placeholder="$" />
          </div>
        ))}
        <button type="button" className="mt-3 min-h-11 text-small text-muted underline" onClick={() => setLines([...lines, { label: "", amount: 0 }])}>
          Add a line
        </button>
        <p className="mt-2 font-medium">Total {fmt(total)}</p>
      </fieldset>
      <Field label="Needed by (month)" htmlFor="pr-month">
        <input id="pr-month" className={cn(inputCls, "max-w-[12rem]")} value={month} onChange={(e) => setMonth(e.target.value)} />
      </Field>
      {preview && ath && (
        <div className="mt-8 rounded-[10px] border border-line-strong p-5">
          <p className="label text-subtle">What funders will see (anonymised card)</p>
          <p className="mt-2 flex items-center gap-2 font-display text-xl font-bold">
            <Lock className="size-4 text-subtle" aria-hidden="true" /> {ath.sport === "Swimming" ? "Swimmer" : ath.sport} · {preview.ageGroup}
          </p>
          <p className="text-muted">
            {ath.region} · {title || "Support"} · {fmt(total)} · needed in {month} · qualification verified by a national federation
          </p>
          <p className="mt-3 flex gap-2 text-small text-subtle">
            <CircleCheck className="mt-0.5 size-4 shrink-0 text-signal" aria-hidden="true" /> Identifiability check: {preview.n} registered athletes share this sport, age group and region (10 or more needed). No name, club, school, photo or exact date is ever shown. Offers come to you, never to {ath.name.split(" ")[0]}.
          </p>
        </div>
      )}
      <Button
        className="mt-8"
        arrow
        onClick={() => {
          if (!ownerId) return;
          const ok = act.run("publishRequest", { requestId: `rq-${ownerId}-${Date.now()}`, ownerKind: isOrg ? "org" : "athlete", ownerId, title, sport, lines: lines.filter((l) => l.label && l.amount), visibility: "Public", neededBy: month, neededMonth: month, verifiedLabel: `${ath?.facts.filter((f) => f.state === "verified").length ?? 0} facts verified`, tags: [sport, ...(ath?.para ? ["Para athletics"] : []), "Equipment", "Travel", "Any region", "Verified evidence", ath && !ath.minor ? "Adults only" : "Organisation"] }, "Published. Funders can now find it.");
          if (ok) go(`app/${persona.id}/funding`);
        }}
      >
        Publish request
      </Button>
      <Message error={act.error} done={act.done} />
    </div>
  );
}

/* =================================================================== Join */

export function Join() {
  const { world: w, act, go } = useStore();
  const [pick, setPick] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [age, setAge] = useState("19");
  const [sport, setSport] = useState("Judo");
  const [region, setRegion] = useState("Coastal Region");
  const [org, setOrg] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const amiraJoining = !w.athletes.amira;
  const options = [
    { id: "athlete", t: "An athlete (18 or over)", d: "Build one sporting profile and find scholarships, grants and sponsors." },
    { id: "guardian", t: "A parent or guardian", d: "Register a young athlete under 18. You stay in control of everything." },
    { id: "coach", t: "A coach", d: "Help athletes who authorise you. You can prepare, not decide." },
    { id: "company", t: "A company, foundation or brand", d: "Find athletes, teams and initiatives; publish opportunities; make offers." },
    { id: "individual", t: "An individual sponsor", d: "Support adults, teams and clubs personally, after a verification check." },
  ];
  const submit = () => {
    if (pick === "athlete") {
      const pid = amiraJoining && (!name || name === "Amira Haddad") ? "amira" : `u-${Date.now()}`;
      const e = act(pid, "register", { kind: "athlete", personId: pid, name: name || "Amira Haddad", age: Number(age), sport, region, gender: "woman" });
      setErr(e);
      if (!e) go(`app/${pid}/me`);
    } else if (pick === "company" || pick === "individual") {
      const pid = `u-${Date.now()}`;
      const e = act(pid, "registerFunder", { personId: pid, name: name || "New sponsor", orgName: org || "New company", type: pick === "individual" ? "Individual sponsor" : "Company", sports: sport });
      setErr(e);
      if (!e) go(`app/${pid}/fdiscover`);
    } else go("roles");
  };
  return (
    <main id="main" className="container-site max-w-3xl pb-20">
      <p className="label pt-10 text-signal">Join Revivo Impact</p>
      <h1 className="text-title mt-2">Who are you registering as?</h1>
      <p className="mt-3 text-muted">Free for athletes, parents, coaches and clubs. No invitation needed, and no other Revivo account. Sign-in is simulated: nothing is sent.</p>
      <fieldset className="mt-8">
        <legend className="sr-only">Who are you registering as?</legend>
        <div className="border-t border-line">
          {options.map((o) => (
            <label key={o.id} className="flex cursor-pointer items-start gap-4 border-b border-line py-4">
              <input type="radio" name="who" value={o.id} checked={pick === o.id} onChange={() => setPick(o.id)} className="mt-1 size-5 shrink-0 appearance-none rounded-full border-2 border-control bg-canvas checked:border-[6px] checked:border-signal" />
              <span>
                <span className="block font-medium">{o.t}</span>
                <span className="block text-small text-subtle">{o.d}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      {(pick === "athlete" || pick === "company" || pick === "individual") && (
        <div className="mt-4">
          <Field label="Your name" htmlFor="j-name" hint={pick === "athlete" && amiraJoining ? "Leave empty to join as Amira Haddad (Journey A)" : undefined}>
            <input id="j-name" className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder={pick === "athlete" && amiraJoining ? "Amira Haddad" : "Your name"} />
          </Field>
          {pick === "company" && (
            <Field label="Organisation" htmlFor="j-org">
              <input id="j-org" className={inputCls} value={org} onChange={(e) => setOrg(e.target.value)} />
            </Field>
          )}
          {pick === "athlete" && (
            <div className="grid gap-x-4 sm:grid-cols-3">
              <Field label="Age" htmlFor="j-age">
                <input id="j-age" inputMode="numeric" className={inputCls} value={age} onChange={(e) => setAge(e.target.value)} />
              </Field>
              <Field label="Sport" htmlFor="j-sport">
                <input id="j-sport" className={inputCls} value={sport} onChange={(e) => setSport(e.target.value)} />
              </Field>
              <Field label="Region" htmlFor="j-region">
                <select id="j-region" className={inputCls} value={region} onChange={(e) => setRegion(e.target.value)}>
                  {["Coastal Region", "Northern Region", "Central Region", "Lakes Region", "Southern Region", "Highland Region"].map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </Field>
            </div>
          )}
        </div>
      )}
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <Button arrow onClick={() => (pick ? submit() : setErr("Choose who you are registering as."))}>
          {pick === "guardian" || pick === "coach" ? "See the guardian and coach examples" : "Create my account"}
        </Button>
        <span className="text-small text-subtle">Then a simulated email code. Nothing is sent.</span>
      </div>
      <Message error={err} />
    </main>
  );
}

export { agreementsFor, fundTotals };
