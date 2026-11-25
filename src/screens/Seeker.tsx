import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, BadgeCheck, Receipt, Building2, ChevronRight, CircleCheck, CircleHelp, CircleX, HandHeart, Landmark, Lock, Megaphone, Search, Shirt, Sparkles, UserRound, UsersRound } from "lucide-react";
import { useStore } from "../state/store";
import { BEHAVIOUR, DATE, type Athlete, type Funder, type Opportunity, type Person, type World } from "../domain/model";
import { agreementsFor, agreementTotals, counts, nextInstalment, eligibility, type Criterion, programmeTotals, fmt, fundTotals, identifiability, offersFor, oppStatusAt,  requestTotals, stateLabel } from "../domain/engine";
import { btn, Button, Chip, cn, seg, FilterPill, HeroBand, Label, PageHead, Panel, SimulatedAI, Tabs } from "../components/ui";
import { FundingBar, NeedBar } from "../components/money";
import { ActionButton, AppStatus, Empty, Field, inputCls, Message, Row, Section, useAction } from "./common";
import { ThemeButtons, useManaging } from "../components/Shell";
import { ImpactLockup } from "../brand/RevivoLogo";
import { AgreementStages } from "./Track";
import { agreementSources } from "./sources";

const funderOf = (w: World, id: string) => w.funders[id];
const typeIcon: Record<Funder["type"], typeof Building2> = { Foundation: Landmark, Company: Building2, "Sports brand": Shirt, "Government body": Landmark, Federation: UsersRound, "Individual sponsor": UserRound };

/** The athlete this seeker screen is about: the adult athlete, or the athlete a guardian or coach manages. */
export function useSubject(persona: Person) {
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
    for (const g of agreementsFor(w, kind, rid).filter((g) => agreementTotals(w, g.id).toConfirm > 0 && (!g.status || g.status === "active")))
      needs.push({ t: `Confirm you received ${fmt(agreementTotals(w, g.id).toConfirm)}`, d: `${w.funds[g.fundId].name} recorded a payment (simulated)`, a: "Confirm receipt", to: "funding" });
    // P3: what the funder needs back (receipts asked for, spending to add, proof for a sponsor, figures to confirm)
    for (const g of agreementsFor(w, kind, rid).filter((g) => !g.light)) {
      const t = agreementTotals(w, g.id);
      const fname = funderOf(w, w.funds[g.fundId].funderId).name;
      if (g.status === "awaiting-recipient") needs.push({ t: `${fname} added funding that started before Revivo Impact`, d: "Check the figures carried in and confirm them, or say what is wrong.", a: "Check the figures", to: `agreement/${g.id}` });
      const q = Object.values(w.expenses).find((e) => e.agreementId === g.id && e.status === "query");
      if (q) needs.push({ t: `${fname} asked for a receipt`, d: `${q.what} · ${fmt(q.amount)}: “${q.query}”`, a: "Add the receipt", to: `agreement/${g.id}` });
      else if (BEHAVIOUR[w.funds[g.fundId].type] === "commercial") {
        const d = Object.values(w.deliverables).find((x) => x.agreementId === g.id && x.done + x.pending < x.target);
        if (d && persona.id === g.recipientId) needs.push({ t: "Send proof to your sponsor", d: `${d.label}: ${d.done} of ${d.target} done`, a: "Send proof", to: `update/${g.id}?proof` });
      } else if (t.paid > 0 && t.received >= t.paid && t.spent < t.paid && moment === "jun30" && g.recipientKind === "athlete" && !Object.values(w.expenses).some((e) => e.agreementId === g.id && e.at === "jun30") && !Object.values(w.progress).some((x) => x.agreementId === g.id && x.at === "jun30"))
        needs.push({ t: persona.role === "athlete" ? "Your quarterly update is due" : `${ath?.name.split(" ")[0]}'s quarterly update is due`, d: `${fmt(t.paid - t.spent)} of ${fname}'s payment is not yet accounted for. Add spending and share progress.`, a: "Send an update", to: `update/${g.id}` });
    }
    for (const app of Object.values(w.applications).filter((x) => x.applicantId === rid)) {
      if (app.status === "info" && app.info?.status === "open") needs.push({ t: "The panel needs one more document", d: app.info.text, a: "Answer", to: "applications" });
      if (app.status === "draft") needs.push({ t: `Finish your application to ${w.opps[app.oppId].title}`, d: app.preparedBy !== persona.id ? `Prepared by ${w.people[app.preparedBy]?.name}; waiting for you to submit` : "Saved as a draft", a: persona.role === "coach" ? "See the draft" : "Submit application", to: "applications" });
    }
    for (const it of Object.values(w.interests).filter((x) => x.athleteId === rid && x.status === "sent")) needs.push({ t: `${funderOf(w, it.funderId).name} is interested in your profile`, d: `"${it.reason}" Share more, or say no thanks. Saying no changes nothing.`, a: "Answer", to: "applications" });
  }
  // Programme operators: alerts, recovery plans, sessions to check, the quarterly report (docs/03 Journey C)
  for (const p of Object.values(w.programmes).filter((x) => org && x.orgId === org.id)) {
    const pt = programmeTotals(w, p.id);
    for (const st of pt.sites.filter((x) => x.alert)) {
      const act = Object.values(w.actions).find((x) => x.programmeId === p.id && x.siteId === st.site.id);
      if (st.plan?.status === "submitted" && st.plan.by !== persona.id && persona.perms.includes("Approve")) needs.push({ t: `Approve ${w.people[st.plan.by]?.name.split(" ")[0]}'s recovery plan for ${st.site.name}`, d: st.plan.text, a: "Read the plan", to: `programme/${p.id}` });
      else if (!st.plan && act?.assignedTo === persona.id) needs.push({ t: `Plan how ${st.site.name} catches up`, d: `${w.people[act.by]?.name} asked you. ${st.delivered} of ${st.due} sessions have run.`, a: "Write the plan", to: `programme/${p.id}` });
      else if (!st.plan && !act && persona.perms.includes("Approve")) needs.push({ t: `${st.site.name} couldn't run ${st.longestRun} sessions in a row`, d: `${st.weather} weather, ${st.coach} no coach available. Decide who plans the recovery.`, a: "See the site", to: `programme/${p.id}` });
    }
    const mySites = pt.sites.filter((x) => (persona.sites ?? []).includes(x.site.id) && x.toCheck > 0);
    if (persona.perms.includes("Verify") && mySites.length) needs.push({ t: `${mySites.reduce((a, x) => a + x.toCheck, 0)} sessions to check against the register`, d: mySites.map((x) => x.site.name).join(", "), a: "Check sessions", to: `programme/${p.id}` });
    const rep = Object.values(w.reports).filter((r) => r.agreementId === p.agreementId).pop();
    if (moment === "jun30" && persona.perms.includes("Approve") && (!rep || rep.status === "draft" || rep.status === "returned")) needs.push({ t: rep?.status === "returned" ? "Your report came back with a question" : "The quarterly report is due today", d: `${p.name} · drafted for you from your records (Simulated AI); you check it and add your own words`, a: rep ? "Open the report" : "Write the report", to: `report/${p.agreementId}` });
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
            <Empty>{Object.values(w.requests).some((r) => r.status === "open" && (r.ownerId === ath?.id || r.ownerId === persona.orgId)) ? "Nothing needs you right now. Your funding request is published; you can also ask a sponsor directly from Discover." : "Nothing needs you right now. Find funding below, or publish a request so funders can find you."}</Empty>
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
            <AgreementStages w={w} g={g} viewer={persona} compact />
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
    .map((o) => ({ o, st: oppStatusAt(w, o), e: isOrg ? { kind: forOrgs(o) ? ("eligible" as const) : ("not" as const), summary: forOrgs(o) ? "For organisations like yours" : "For individual athletes", criteria: [] } : eligibility(w, o, ath) }))
    .filter((x) => isOrg || !x.o.forOrganisations)
    .filter((x) => (isOrg ? true : ath ? x.o.sportsLabel.toLowerCase().includes(ath.sport.toLowerCase()) || !/^(Swimming|Judo)$/.test(x.o.sportsLabel) : true));
  const open = scored.filter((x) => x.st === "open" && (!eligibleOnly || x.e.kind !== "not")).sort((a, b) => rank(a.e.kind) - rank(b.e.kind) || a.o.closes.localeCompare(b.o.closes));
  const upcoming = scored.filter((x) => x.st === "upcoming");
  const funders = Object.values(w.funders).filter((f) => f.verified && (!ath || f.relevant.some((r) => r === "any" || ath.tags.map((t) => t.toLowerCase()).includes(r.toLowerCase()))) && (!acceptsOnly || f.accepts === "yes") && !(ath?.minor && f.accepts === "commercial"));
  return (
    <div className="pb-8">
      <HeroBand file="im-05-discover-opportunities.png">
        <p className="label text-signal">Discover</p>
        <h1 className="text-title mt-2">Who could fund {isOrg ? "us" : persona.role === "athlete" ? "me" : ath?.name.split(" ")[0] ?? "them"}?</h1>
        <p className="text-lead mt-3 text-muted">Scholarships, grants and sponsors on Revivo Impact. We check {isOrg ? "your organisation" : persona.role === "athlete" ? "your profile" : "the profile"} against each funder&rsquo;s own rules.</p>
      </HeroBand>
      <Tabs label="Discover" value={tab} onChange={setTab} tabs={[{ id: "opps", label: "Funding opportunities", count: open.length }, { id: "sponsors", label: "Sponsors & funders", count: funders.length }]} />
      <div className="mt-4 flex flex-wrap items-center gap-2" aria-label="Filters">
        {ath && (
          <span className="text-small text-subtle">
            Checked against {persona.role === "athlete" ? "your" : `${ath.name.split(" ")[0]}'s`} profile: {ath.sport.toLowerCase()} · {ath.region}
          </span>
        )}
        {tab === "opps" ? (
          <button type="button" aria-pressed={eligibleOnly} onClick={() => setEligibleOnly(!eligibleOnly)}>
            <FilterPill on={eligibleOnly}>Eligible only</FilterPill>
          </button>
        ) : (
          <button type="button" aria-pressed={acceptsOnly} onClick={() => setAcceptsOnly(!acceptsOnly)}>
            <FilterPill on={acceptsOnly}>Accepts direct requests</FilterPill>
          </button>
        )}
        <button type="button" onClick={() => setWhy(true)} className="ml-auto min-h-11 text-small text-muted underline underline-offset-4 hover:text-ink">
          Why these appear
        </button>
      </div>
      {tab === "opps" ? (
        <>
          <p className="mt-6 text-small text-subtle">
            {open.length} open on {fmtDate(DATE[moment])} from {new Set(open.map((x) => w.funds[x.o.fundId].funderId)).size} organisations · {open.some((x) => x.e.kind !== "not") ? "eligible first, then by deadline" : "none fits yet: each shows what it needs"}
          </p>
          <ul className="mt-2 border-t border-line">
            {open.map(({ o, e }) => (
              <OppRow key={o.id} w={w} o={o} summary={e.summary} kind={e.kind} personaId={persona.id} because={e.criteria.length ? whyFits(e.criteria) : undefined} />
            ))}
            {open.length === 0 && (
              <Empty li>
                {eligibleOnly && scored.some((x) => x.st === "open") ? "None of the open opportunities fit your profile right now. " : "No opportunities are open on this date. "}
                <a className="underline underline-offset-4" href={`#/app/${persona.id}/publish`}>Publish a funding request</a> so sponsors can find you, or ask a sponsor directly.
              </Empty>
            )}
          </ul>
          {upcoming.length > 0 && (
            <details className="mt-8">
              <summary className="min-h-11 cursor-pointer py-2 font-medium text-muted hover:text-ink">Show {upcoming.length} upcoming</summary>
              <ul className="mt-2 border-t border-line">
                {upcoming.map(({ o }) => (
                  <OppRow key={o.id} w={w} o={o} summary={forOrgs(o) ? "For organisations" : "Check when it opens"} kind="check" personaId={persona.id} />
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
              <FunderRow key={f.id} f={f} personaId={persona.id} why={sponsorWhy(f, ath)} />
            ))}
          </ul>
        </>
      )}
      <p className="mt-6 text-small text-subtle">Whether you qualify is checked against each funder&rsquo;s published rules. Qualifying doesn&rsquo;t guarantee an award: people decide.</p>
      <Panel open={why} onClose={() => setWhy(false)} title="Why these appear" eyebrow="Matching · Simulated AI">
        <SimulatedAI />
        <p className="mt-4 text-muted">
          {ath ? `Each row says why: the funder's published rules (sport, region, age, level) checked against ${persona.role === "athlete" ? "your" : `${ath.name.split(" ")[0]}'s`} profile, quoting the records it used, and what is still to do.` : "Suggested from your organisation's sport and region."}
        </p>
        <ul className="mt-4 space-y-2 text-small">
          <li>· Whether you qualify comes from each funder&rsquo;s rules, not from AI.</li>
          <li>· Order: eligible first, then the deadline. Never popularity or any score of a person.</li>
        </ul>
        <p className="mt-6 text-small text-subtle">AI-assisted, simulated in this prototype. Check against sources.</p>
      </Panel>
    </div>
  );
}
const rank = (k: string) => (k === "eligible" ? 0 : k === "check" ? 1 : 2);

/** Matching explanation (Simulated AI, from the records): which published rules the profile meets, and what is left. */
export function whyFits(criteria: Criterion[]) {
  const met = criteria.filter((c) => c.result === "met").map((c) => c.detail.replace(/ \(the panel checks your ID\)/, "").replace(/ · /, ", "));
  const todo = criteria.filter((c) => c.result === "todo" || c.result === "check").map((c) => (c.result === "check" ? `${c.label.toLowerCase()} (the panel checks)` : c.label.toLowerCase()));
  return [met.length ? `Fits because: ${met.slice(0, 3).join(" · ")}` : "", todo.length ? `Still to do: ${todo.join(", ")}` : ""].filter(Boolean).join(". ");
}

function OppRow({ w, o, summary, kind, personaId, because }: { w: World; o: Opportunity; summary: string; kind: "eligible" | "check" | "not"; personaId: string; because?: string }) {
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
          <span className={kind === "not" ? "text-subtle" : "text-ink"}>
            {summary}
            {because && kind !== "not" && <span className="mt-0.5 block text-subtle">{because}</span>}
          </span>
        </span>
        <span className="hidden items-center gap-1 text-small font-medium text-muted group-hover:text-ink lg:flex">
          {kind !== "not" && oppStatusAt(w, o) === "open" ? "Apply" : "View"} <ChevronRight className="size-4" aria-hidden="true" />
        </span>
      </a>
    </li>
  );
}

/** An opportunity is for organisations when it says so or its rules ask for a club, team or coach. */
const forOrgs = (o: Opportunity) => !!o.forOrganisations || o.rules.some((r) => r.kind === "organisation");

/** Why a sponsor is relevant: its published sports, regions and what it accepts, against the athlete's profile. */
function sponsorWhy(f: Funder, ath?: Athlete) {
  if (!ath) return undefined;
  // Only what the sponsor published: never a stronger fit than the records show.
  const sport = f.sports === "Any sport" ? "supports any sport" : f.sports.toLowerCase().includes(ath.sport.toLowerCase()) ? `supports ${ath.sport.toLowerCase()}` : `lists ${f.sports}, not ${ath.sport.toLowerCase()}`;
  const region = f.regions === "Any region" ? "any region" : f.regions.includes(ath.region) ? `includes ${ath.region}` : `${f.regions} only`;
  const asks = f.accepts === "yes" ? `accepts direct requests${f.acceptsMax ? ` up to ${fmt(f.acceptsMax)}` : ""}${f.acceptsSupport ? ` for ${f.acceptsSupport.join(", ").toLowerCase()}` : ""}` : f.accepts === "commercial" ? "proposes commercial sponsorship to adults" : "funds through its published opportunities";
  return `Why: ${sport} · ${region} · ${asks}`;
}

function FunderRow({ f, personaId, why }: { f: Funder; personaId: string; why?: string }) {
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
          {why && <span className="mt-0.5 block text-subtle">{why}</span>}
        </span>
        <span>{f.accepts === "yes" ? <Chip kind="verified">Accepts direct requests</Chip> : f.accepts === "commercial" ? <Chip kind="info">Commercial proposals only</Chip> : <Chip kind="self">Only through opportunities</Chip>}</span>
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
          ["Awards", `${o.awardsLabel} · ${fmt(fund.announced)} in total`],
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
        // On phones the next step stays in view above the bottom menu (docs/04: the next step is always visible).
        <div className="mt-6 flex flex-col gap-4 rounded-[10px] border border-line-strong bg-canvas p-5 max-md:sticky max-md:bottom-[4.5rem] max-md:z-20 max-md:gap-3 max-md:p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-xl font-bold">{ath ? e.summary : "Join to check your eligibility"}</p>
            <p className="text-small text-muted">{mine ? "You have already applied. Follow it in Applications." : e.kind === "not" ? "Funders set their own rules, so this one can't accept you. Others may fit, or publish a request so sponsors can find you." : "Your profile fills the form; you choose what the funder sees."}</p>
          </div>
          {mine ? (
            <a href={`#/app/${persona.id}/applications`} className={btn("secondary", "shrink-0")}>
              See my application
            </a>
          ) : e.kind !== "not" ? (
            <a href={ath ? `#/app/${persona.id}/apply/${o.id}` : "#/join"} className={btn("primary", "shrink-0")}>
              {ath ? "Apply with my profile" : "Join to apply"} <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          ) : (
            <a href={`#/app/${persona.id}/discover`} className={btn("secondary", "shrink-0")}>
              See other opportunities <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          )}
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
          <p className="mt-3 text-small text-subtle">Whether you qualify is checked against the funder&rsquo;s published rules. Qualifying doesn&rsquo;t guarantee an award: people decide.</p>
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
  // The kind of support follows from the line chosen; the amount follows the line (what is still needed, up to the funder's limit).
  const kindOf = (label: string) => (/travel|entry|entries|flight|transport|competition/i.test(label) ? "Travel" : /coach|training|camp/i.test(label) ? "Coaching" : "Equipment");
  const support = kindOf(line?.label ?? "");
  const pickLine = (id: string, rid = reqId) => {
    setLineId(id);
    const l = requestTotals(w, rid).lines.find((x) => x.id === id);
    setAmount(String(Math.min(l?.remaining ?? 0, f?.acceptsMax ?? 0) || ""));
  };
  if (!f) return <Empty>This funder does not exist.</Empty>;
  const opps = Object.values(w.opps).filter((o) => w.funds[o.fundId].funderId === f.id && o.status !== "awaiting" && o.status !== "draft");
  const Icon = typeIcon[f.type];
  const sent = Object.values(w.asks).find((a) => a.funderId === f.id && a.by === persona.id);
  return (
    <div className="pb-8">
      <HeroBand file={f.type === "Individual sponsor" ? "im-19-individual-sponsor.png" : f.type === "Sports brand" ? "im-14-sponsorship-sprinter.png" : "im-06-funder-visit.png"}>
        <p className="flex items-center gap-2 text-small text-muted">
          <Icon className="size-4" aria-hidden="true" /> {f.type} · participating on Revivo Impact
        </p>
        <h1 className="text-title mt-2">{f.name}</h1>
        <p className="text-lead mt-3 text-muted">{f.objective}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Chip kind="verified">{f.verified ? "Verified (simulated check)" : "Verification requested"}</Chip>
          {f.accepts === "yes" && <Chip kind="verified">Accepts direct requests</Chip>}
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
      <Panel open={open} onClose={() => setOpen(false)} title={`Ask ${f.name} for support`} eyebrow="Direct request">
        {req && totals && (
          <>
            <Field label="Funding request" htmlFor="ask-req">
              <select id="ask-req" className={inputCls} value={reqId} onChange={(e) => (setReqId(e.target.value), pickLine(w.requests[e.target.value].lines[0].id, e.target.value))}>
                {myRequests.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.title}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Which part" htmlFor="ask-line">
              <select id="ask-line" className={inputCls} value={lineId} onChange={(e) => pickLine(e.target.value)}>
                {totals.lines.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.label}: {fmt(l.remaining)} still needed
                  </option>
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
  const { world: w, go, setNotice } = useStore();
  const forParam = new URLSearchParams(location.hash.split("?")[1] ?? "").get("for");
  const managing = useManaging();
  const ath = persona.role === "athlete" ? w.athletes[persona.id] : w.athletes[forParam ?? managing ?? ""];
  const o = w.opps[oppId];
  const act = useAction(persona.id);
  const existing = ath && Object.values(w.applications).find((a) => a.oppId === oppId && a.applicantId === ath.id);
  const linkedReq = ath && Object.values(w.requests).find((r) => r.ownerId === ath.id && r.status === "open");
  const remaining = linkedReq ? requestTotals(w, linkedReq.id).remaining : 0;
  const fundMax = w.funds[w.opps[oppId]?.fundId ?? ""]?.max ?? 4800;
  const [requested, setRequested] = useState(existing?.requested ?? Math.min(fundMax, linkedReq ? remaining : 4800));
  const [statement, setStatement] = useState(existing?.statement ?? "");
  const [other, setOther] = useState(existing?.otherFunding ?? "");
  const [ai, setAi] = useState(false);
  const [docState, setDocState] = useState<Record<string, "added" | "follow">>({});
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
          <Label>2 · Do I qualify?</Label>
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
            {docs.map((d) => {
              const st = d.ok ? "ok" : docState[d.t];
              return (
                <li key={d.t} className="flex items-start gap-3 border-b border-line py-3">
                  {st === "ok" || st === "added" ? <CircleCheck className="mt-0.5 size-5 text-signal" aria-label="Ready" /> : st === "follow" ? <CircleHelp className="mt-0.5 size-5 text-muted" aria-label="To follow" /> : <CircleHelp className="mt-0.5 size-5 text-amber" aria-label="Missing" />}
                  <span className="flex-1">
                    {d.t}
                    {!st && <span className="block text-small text-amber">{d.note}</span>}
                    {st === "added" && <span className="block text-small text-subtle">Fictional copy added (simulated: no file is stored)</span>}
                    {st === "follow" && <span className="block text-small text-subtle">Marked “to follow”: the funder sees that it is coming</span>}
                    {!d.ok && (
                      <span className="mt-2 flex flex-wrap gap-2">
                        <button type="button" aria-pressed={st === "added"} className={seg(st === "added")} onClick={() => setDocState({ ...docState, [d.t]: "added" })}>
                          Add it now
                        </button>
                        <button type="button" aria-pressed={st === "follow"} className={seg(st === "follow")} onClick={() => setDocState({ ...docState, [d.t]: "follow" })}>
                          To follow
                        </button>
                      </span>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
          {ai && (
            <p className="mt-3 flex flex-wrap items-center gap-2 text-small text-subtle">
              <SimulatedAI /> Checklist and draft built only from {persona.role === "athlete" ? "your" : "the"} records. Gaps are marked; nothing is invented.
            </p>
          )}
        </li>
        <li>
          <Label>4 · Budget and other funding</Label>
          <Field label="Amount requested (USD)" hint={linkedReq ? `Linked to the funding request "${linkedReq.title}": ${fmt(remaining)} still needed; this amount is held while the funder decides` : "The panel awards one of the published levels"} htmlFor="req">
            <input id="req" inputMode="numeric" className={cn(inputCls, "max-w-[12rem]")} value={requested} onChange={(e) => setRequested(Number(e.target.value.replace(/\D/g, "")))} />
          </Field>
          <Field label="Other funding for the same costs" hint="Required, so nothing is funded twice. Type “None” if you have no other support." htmlFor="other">
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
                if (act.run("submitApplication", { appId }, "Application submitted.")) {
                  setNotice(`Application sent to ${w.funders[w.funds[o.fundId].funderId].name}. Decisions by ${o.decisions}.`);
                  go(`app/${persona.id}/applications`);
                }
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
  // An offer reaches the recipient only once the funder's approvals are complete; a withdrawn one before acceptance is not shown.
  const offers = rid ? offersFor(w, kind, rid).filter((o) => !o.light && o.status !== "second-approval" && o.status !== "withdrawn") : [];
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
                      {o.applicationId && w.applications[o.applicationId]?.requested !== o.amount ? ` · the published level for your results (you asked for ${fmt(w.applications[o.applicationId].requested)})` : ""}
                      {o.deliverables && ` · deliverables: ${o.deliverables.join("; ")}`}
                    </p>
                    <p className="text-small text-subtle">
                      {o.status === "accepted" ? `${fr.name.split(" ")[0]} now sees` : `If you accept, ${fr.name.split(" ")[0]} sees`} {isMinor ? "the athlete's first name, sport and results; never contact details or photos" : "your name, sport, results and updates you share"}.{isMinor && o.status !== "accepted" ? " This offer came to you as guardian; the funder cannot contact the athlete." : ""}
                    </p>
                  </div>
                  {o.status === "held" && canAnswer ? (
                    <div className="flex flex-wrap items-start gap-3">
                      <ActionButton actor={persona.id} type="acceptOffer" args={{ offerId: o.id, agreementId: `ag-${o.id}` }} success="Accepted. The money is now agreed.">
                        Accept {fund.type.toLowerCase()}
                      </ActionButton>
                      <ActionButton actor={persona.id} type="declineOffer" args={{ offerId: o.id }} variant="secondary" success="Declined. No reason is needed and nothing else changes.">
                        Decline
                      </ActionButton>
                    </div>
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
                    {a.decisionNote && <p className="mt-1 text-small">From {w.funders[w.funds[o.fundId].funderId].name}: &ldquo;{a.decisionNote}&rdquo;</p>}
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
      <PageHead eyebrow={isOrg ? "Funding" : "My Funding"} title={`What support ${persona.role === "athlete" ? "do I" : isOrg ? "do we" : `does ${ath?.name.split(" ")[0]}`} have?`} lead={persona.role === "athlete" || isOrg ? "What you've been given, what's still to come, and any update your funders need." : `What ${ath?.name.split(" ")[0] ?? "your athlete"} has been given, what's still to come, and any update the funders need.`} />
      {ags.length === 0 && reqs.length === 0 && <Empty>No support yet. Apply to opportunities or publish a funding request so funders can find {isOrg ? "you" : "you"}.</Empty>}
      {[...dev, ...com].map((g) => {
        const fund = w.funds[g.fundId];
        const t = agreementTotals(w, g.id);
        const commercial = fund.type === "Sponsorship agreement";
        const owe = t.toConfirm > 0 && persona.role !== "coach";
        const query = Object.values(w.expenses).some((e) => e.agreementId === g.id && e.status === "query");
        return (
          <Section key={g.id} title={`${fund.type} from ${funderOf(w, fund.funderId).name}${commercial ? " · commercial, kept apart" : ""}`}>
            {g.status === "awaiting-recipient" && <p className="mt-3 font-medium">Existing funding: please confirm the figures on the record.</p>}
            <div className="mt-4">
              <AgreementStages w={w} g={g} viewer={persona} compact />
            </div>
            <div className="mt-6">
              <FundingBar m={t} audience="recipient" who={persona.role === "guardian" || persona.role === "coach" ? ath?.name.split(" ")[0] : undefined} sources={agreementSources(w, g.id, persona)} />
            </div>
            {(() => {
              const nx = nextInstalment(w, g.id);
              return nx && t.paid > 0 ? (
                <p className="mt-4 text-small">
                  <span className="text-subtle">Next payment: </span>
                  <span className="font-medium">{fmt(nx.amount - nx.paid)}</span> {nx.status === "due" || nx.status === "part-paid" ? "due now" : `expected ${nx.dueLabel}`}
                  {nx.condition && !nx.conditionMet ? `, once ${nx.condition}` : ""}.
                </p>
              ) : null;
            })()}
            <div className="mt-5 flex flex-wrap items-start gap-3">
              {owe && (
                <ActionButton actor={persona.id} type="confirmReceipt" args={{ agreementId: g.id, entryId: `rc-${g.id}-${Date.now()}` }} success="Thank you. Arrival confirmed.">
                  Confirm I received {fmt(t.toConfirm)}
                </ActionButton>
              )}
              {!commercial && t.paid > t.spent && (
                <a className={btn(owe || query ? "secondary" : "primary")} href={`#/app/${persona.id}/update/${g.id}`}>
                  <Receipt className="size-4" aria-hidden="true" /> Add spending
                </a>
              )}
              {commercial && <a className={btn("secondary")} href={`#/app/${persona.id}/update/${g.id}?proof`}>Send proof</a>}
              <a className={btn(query ? "primary" : "quiet")} href={`#/app/${persona.id}/agreement/${g.id}`}>
                {query ? "Add the missing receipt" : "See everything"} <ArrowRight className="size-4" aria-hidden="true" />
              </a>
            </div>
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
                        {l.label}: {fmt(l.amount)} · {fmt(l.pledged)} promised{l.heldApp ? ` · ${fmt(l.heldApp)} waiting on an application` : ""} · {fmt(l.remaining)} still needed
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

/** Build a profile one fact at a time; every fact starts self-reported and the owner chooses who sees it. */
function AddFact({ persona, athleteId, minor, empty }: { persona: Person; athleteId: string; minor: boolean; empty: boolean }) {
  const [kind, setKind] = useState<"result" | "club" | "coach" | "goal">("result");
  const [value, setValue] = useState("");
  const [vis, setVis] = useState<"discoverable" | "application" | "private">(minor ? "application" : "discoverable");
  const act = useAction(persona.id);
  const LABEL = { result: "Result", club: "Club", coach: "Coach who can vouch for you", goal: "Season goal" } as const;
  return (
    <form
      className="mt-6 rounded-[10px] border border-line-strong p-5"
      onSubmit={(e) => {
        e.preventDefault();
        if (act.run("addFact", { athleteId, factId: `f-${Date.now()}`, label: LABEL[kind], value, kind, visibility: vis }, "Added. It shows as self-reported until someone confirms it.")) setValue("");
      }}
    >
      <p className="font-medium">{empty ? "Start your profile: add a result, your club or your coach" : "Add to the profile"}</p>
      <div className="mt-3 grid gap-3 md:grid-cols-[10rem_1fr_13rem]">
        <div>
          <label htmlFor="af-kind" className="block text-small text-subtle">
            What
          </label>
          <select id="af-kind" className={cn(inputCls, "mt-1")} value={kind} onChange={(e) => setKind(e.target.value as typeof kind)}>
            {(Object.keys(LABEL) as (keyof typeof LABEL)[]).map((k) => (
              <option key={k} value={k}>
                {LABEL[k]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="af-value" className="block text-small text-subtle">
            Details
          </label>
          <input id="af-value" className={cn(inputCls, "mt-1")} value={value} onChange={(e) => setValue(e.target.value)} placeholder={kind === "result" ? "For example: Silver, Regional Championships 2026" : kind === "club" ? "Your club or academy" : kind === "coach" ? "Name and club" : "What you are aiming for this season"} />
        </div>
        <div>
          <label htmlFor="af-vis" className="block text-small text-subtle">
            Who can see it?
          </label>
          <select id="af-vis" className={cn(inputCls, "mt-1")} value={vis} onChange={(e) => setVis(e.target.value as typeof vis)}>
            {!minor && <option value="discoverable">Funders in Discover</option>}
            <option value="application">Only funders I apply to</option>
            <option value="private">Only me</option>
          </select>
        </div>
      </div>
      <Button className="mt-4" type="submit" variant={empty ? "primary" : "secondary"}>
        Add
      </Button>
      <Message error={act.error} done={act.done} />
    </form>
  );
}

export function MyProfile({ persona }: { persona: Person }) {
  const { world: w } = useStore();
  const ath = useSubject(persona);
  const act = useAction(persona.id);
  if (persona.role === "organisation") {
    const org = w.orgs[persona.orgId!];
    return (
      <div className="pb-8">
        <PageHead eyebrow="Organisation" title={org.name} lead={`${org.type} · ${org.region} · ${org.sport}`} />
        {org.verified ? <Chip kind="verified">Organisation verified (simulated)</Chip> : <Chip kind="awaiting">Verification requested (simulated)</Chip>}
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
      <PageHead eyebrow={persona.role === "athlete" ? "Profile" : `My Athletes · ${ath.name}`} title={persona.role === "athlete" ? "What do funders see about me?" : `What do funders see about ${ath.name.split(" ")[0]}?`} lead={`${ath.sport}${ath.discipline !== ath.sport ? ` · ${ath.discipline}` : ""} · ${ath.region}${ath.club ? ` · ${ath.club}` : ""}. One profile for every application and request.`} />
      {ath.facts.length === 0 && own && persona.id === "amira" && (
        <ActionButton actor={persona.id} type="buildProfile" args={{ athleteId: ath.id }} success="Profile built. Choose what is discoverable.">
          Add my results, coach and support
        </ActionButton>
      )}
      {own && !(ath.facts.length === 0 && persona.id === "amira") && <AddFact persona={persona} athleteId={ath.id} minor={ath.minor} empty={ath.facts.length === 0} />}
      {!ath.minor && own && (
        <div className="mt-6 rounded-[10px] border border-line-strong p-5">
          <p className="font-medium">Can verified funders find {persona.role === "athlete" ? "you" : ath.name} in Discover?</p>
          <p className="text-small text-subtle">Only facts set to &ldquo;Funders in Discover&rdquo; are shown, never contact details. You can change this at any time.</p>
          <div className="mt-3 flex gap-3">
            {[true, false].map((v) => (
              <button key={String(v)} type="button" aria-pressed={ath.discoverable === v} onClick={() => act.run("setDiscoverable", { athleteId: ath.id, value: v })} className={seg(ath.discoverable === v)}>
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
                      {!ath.minor && <option value="discoverable">Funders in Discover</option>}
                      <option value="application">Only funders I apply to</option>
                      <option value="private">Only me</option>
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
          {Object.values(w.agreements).filter((g) => g.recipientId === ath.id && counts(g)).map((g) => (
            <Row key={g.id}>
              <span>{w.funds[g.fundId].type} · {w.funders[w.funds[g.fundId].funderId].name}</span>
              <span className="tabular-nums">{fmt(g.amount)} · on Revivo Impact</span>
            </Row>
          ))}
          {ath.currentSupport.length === 0 && !Object.values(w.agreements).some((g) => g.recipientId === ath.id && counts(g)) ? <Empty li>None declared.</Empty> : ath.currentSupport.map((s) => (
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
  const { world: w, go, setNotice } = useStore();
  const ath = useSubject(persona);
  const isOrg = persona.role === "organisation";
  const act = useAction(persona.id);
  // Tiago's story values only (Journey E); everyone else starts empty: amounts come from the family's own quotes.
  const story = ath?.id === "tiago";
  const [title, setTitle] = useState(story ? "Competition travel" : "");
  const [lines, setLines] = useState<{ label: string; amount: number }[]>(story ? [{ label: "Competition travel and entry", amount: 2400 }] : [{ label: "", amount: 0 }]);
  const [month, setMonth] = useState(story ? "August" : "");
  const [helped, setHelped] = useState(false);
  /** Request help (Simulated AI): words from the profile, never amounts or achievements it cannot see. */
  const help = () => {
    if (!ath && !isOrg) return;
    const need = ath?.facts.find((f) => f.label === "Support needed")?.value;
    const goal = ath?.facts.find((f) => f.kind === "goal")?.value;
    const sport = isOrg ? w.orgs[persona.orgId!].sport : ath!.sport;
    const items = need ? [need === "Travel" ? "Competition travel" : need === "Coaching" ? "Coaching sessions" : "Equipment"] : ["Competition travel", "Equipment"];
    setTitle(title || `${items.join(" and ")} for ${sport.toLowerCase()}${goal ? ` (${goal.toLowerCase()})` : ""}`);
    setLines(items.map((label) => ({ label, amount: 0 })));
    setHelped(true);
  };
  const preview = useMemo(() => {
    if (!ath?.minor) return null;
    const ageGroup = ath.age < 14 ? "Under 14" : ath.age < 16 ? "14–15" : "16–17";
    const chk = identifiability(w, ath.sport, ageGroup, ath.region);
    return { ageGroup, n: chk.count, region: chk.region, ok: chk.ok, widened: !!chk.widened };
  }, [ath, w]);
  if (persona.role === "coach") return <Empty>Only an adult athlete, a guardian or an organisation publishes funding requests. A coach cannot publish for a minor.</Empty>;
  const total = lines.reduce((a, l) => a + (l.amount || 0), 0);
  const ownerId = isOrg ? persona.orgId! : ath?.id;
  const nVerified = ath?.facts.filter((f) => f.state === "verified" || f.state === "confirmed").length ?? 0;
  const verifiedLabel = isOrg ? "Organisation verified" : nVerified ? `${nVerified} ${nVerified === 1 ? "fact" : "facts"} verified or confirmed` : "No facts verified yet";
  const sport = isOrg ? w.orgs[persona.orgId!].sport : ath?.sport ?? "";
  return (
    <div className="max-w-3xl pb-10">
      <PageHead eyebrow="Publish a funding request" title="What do you need funding for?" lead="Funders who support your sport can find it in Discover and offer full or part funding, line by line." />
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={help} className={btn("secondary", "min-h-10 px-4 font-sans text-small font-medium tracking-normal")}>
          <Sparkles className="size-4" aria-hidden="true" /> Help me write this
        </button>
        <SimulatedAI />
      </div>
      {helped && (
        <p role="status" className="mt-3 text-small text-muted">
          Suggested from {isOrg ? "your organisation's sport" : "the profile's sport, goals and support needed"}. Add each amount from your own quotes: Revivo never guesses costs or adds achievements.
          {ath && !ath.facts.some((f) => f.state === "verified" || f.state === "confirmed") ? " Tip: funders trust verified facts; ask your federation or club to confirm a result on your profile." : ""}
        </p>
      )}
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
      <Field label="Needed by (month)" hint="For example: September 2027" htmlFor="pr-month">
        <input id="pr-month" className={cn(inputCls, "max-w-[12rem]")} value={month} onChange={(e) => setMonth(e.target.value)} />
      </Field>
      {preview && ath && (
        <div className="mt-8 rounded-[10px] border border-line-strong p-5">
          <p className="label text-subtle">What funders will see (anonymised card)</p>
          <p className="mt-2 flex items-center gap-2 font-display text-xl font-bold">
            <Lock className="size-4 text-subtle" aria-hidden="true" /> {ath.sport === "Swimming" ? "Swimmer" : ath.sport} · {preview.ageGroup}
          </p>
          <p className="text-muted">
            {preview.region} · {title || "Support"} · {fmt(total)} · needed in {month} · {verifiedLabel.toLowerCase()}
          </p>
          <p className="mt-3 flex gap-2 text-small text-subtle">
            <CircleCheck className="mt-0.5 size-4 shrink-0 text-signal" aria-hidden="true" /> Identifiability check: {preview.ok ? preview.widened ? `${preview.n} registered athletes share this sport and age group across all regions (10 or more needed), so the card shows “Any region”.` : `${preview.n} registered athletes share this sport, age group and region (10 or more needed).` : `only ${preview.n} share this sport and age group, so this card could identify the athlete and cannot be published.`} No name, club, school, photo or exact date is ever shown. Offers come to you, never to {ath.name.split(" ")[0]}.
          </p>
        </div>
      )}
      <Button
        className="mt-8"
        arrow
        onClick={() => {
          if (!ownerId) return;
          const ok = act.run("publishRequest", { requestId: `rq-${ownerId}-${Date.now()}`, ownerKind: isOrg ? "org" : "athlete", ownerId, title, sport, lines: lines.filter((l) => l.label && l.amount), visibility: "Public", neededBy: month, neededMonth: month, verifiedLabel: verifiedLabel, tags: [] }, "Published. Funders can now find it.");
          if (ok) {
            setNotice(`Published: “${title}”, needed by ${month}. Sponsors and funders can now find it. Next: ask a sponsor who accepts direct requests (Discover → Sponsors & funders).`);
            go(`app/${persona.id}/funding`);
          }
        }}
      >
        Publish request
      </Button>
      <Message error={act.error} done={act.done} />
    </div>
  );
}

/* =================================================================== Join */

const SPORT_CHOICES = ["Archery", "Athletics", "Badminton", "Boxing", "Canoeing", "Cycling", "Fencing", "Football", "Judo", "Rowing", "Swimming", "Table tennis", "Triathlon", "Wheelchair basketball", "Wheelchair racing"];
const REGION_CHOICES = ["Coastal Region", "Northern Region", "Central Region", "Lakes Region", "Southern Region", "Highland Region"];

/** Join (screen 2): five independent routes; sign-in is simulated, so the "email code" is shown on screen. */
export function Join() {
  const { world: w, act, go, setNotice } = useStore();
  const [pick, setPick] = useState<string | null>(null);
  const [step, setStep] = useState<"details" | "code">("details");
  const [name, setName] = useState("");
  const [child, setChild] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [sport, setSport] = useState("");
  const [region, setRegion] = useState("");
  const [cat, setCat] = useState<"" | "woman" | "man">("");
  const [org, setOrg] = useState("");
  const [orgType, setOrgType] = useState("Club");
  const [err, setErr] = useState<string | null>(null);
  // Every missing answer at once, at the top, each linking to its field (the family error summary).
  const [errs, setErrs] = useState<[string, string][]>([]);
  const summaryRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (errs.length) summaryRef.current?.focus();
  }, [errs]);
  useEffect(() => {
    headRef.current?.focus();
  }, [step]);
  const amiraJoining = !w.athletes.amira;
  const options = [
    { id: "athlete", t: "An athlete aged 18 or over", d: "One sporting profile to find scholarships, grants and sponsors." },
    { id: "guardian", t: "A parent or guardian", d: "Register a young athlete under 18. You stay in control of everything." },
    { id: "organisation", t: "A club, academy, federation or programme", d: "Find funding for your teams and programmes and report on it." },
    { id: "company", t: "A company, foundation or brand", d: "Find athletes, teams and programmes to support; publish opportunities." },
    { id: "individual", t: "An individual sponsor", d: "Support adults, teams and clubs personally, after a verification check." },
    { id: "coach", t: "A coach", d: "Athletes or guardians add you from their account, with the powers they choose." },
  ];
  const problems = () => {
    const out: [string, string][] = [];
    if (!name.trim()) out.push(["Add your name.", "j-name"]);
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) out.push(["Add an email address (nothing is sent in this demonstration).", "j-email"]);
    if (pick === "guardian" && !child.trim()) out.push(["Add the athlete's name.", "j-child"]);
    if (pick === "athlete" && !(Number(age) >= 18)) out.push([Number(age) > 0 ? "Athletes under 18 are registered by a parent or guardian." : "Add your age.", "j-age"]);
    if (pick === "guardian" && !(Number(age) > 0)) out.push(["Add the athlete's age.", "j-age"]);
    if ((pick === "organisation" || pick === "company") && !org.trim()) out.push(["Add the organisation's name.", "j-org"]);
    if (pick !== "company" && pick !== "individual" && !sport) out.push(["Choose the sport.", "j-sport"]);
    if ((pick === "athlete" || pick === "guardian" || pick === "organisation") && !region) out.push(["Choose the region.", "j-region"]);
    if ((pick === "athlete" || pick === "guardian") && !cat) out.push(["Choose women's or men's events.", "j-cat"]);
    return out;
  };
  const create = () => {
    const pid = `u-${Date.now()}`;
    let e: string | null = null;
    let to = "";
    if (pick === "athlete") {
      const id = amiraJoining && name.trim() === "Amira Haddad" ? "amira" : pid;
      e = act(id, "register", { kind: "athlete", personId: id, name: name.trim(), age: Number(age), sport, region, gender: cat });
      to = `app/${id}/me`;
    } else if (pick === "guardian") {
      e = act(pid, "registerGuardian", { personId: pid, name: name.trim(), childId: `${pid}-a`, childName: child.trim(), age: Number(age), sport, region, gender: cat });
      to = `app/${pid}/home`;
    } else if (pick === "organisation") {
      e = act(pid, "registerOrganisation", { personId: pid, name: name.trim(), orgId: `${pid}-org`, orgName: org.trim(), type: orgType, sport, region });
      to = `app/${pid}/home`;
    } else {
      e = act(pid, "registerFunder", { personId: pid, name: name.trim(), orgName: org.trim() || name.trim(), type: pick === "individual" ? "Individual sponsor" : "Company", sports: sport });
      to = `app/${pid}/fdiscover`;
      if (!e) setNotice(`Welcome. ${pick === "individual" ? "Your identity and safeguarding check is" : "Your organisation is"} being checked (simulated). Until then you can browse and shortlist; offers open once the check is done. An example fund of $10,000 (up to $2,000 per offer) is set up so you can try it.${sport ? ` Results show ${sport.toLowerCase()} first.` : ""}`);
    }
    setErr(e);
    if (!e) go(to);
  };
  const sportField = (label: string) => (
    <Field label={label} htmlFor="j-sport">
      <select id="j-sport" className={inputCls} value={sport} onChange={(e) => setSport(e.target.value)}>
        <option value="">Choose…</option>
        {SPORT_CHOICES.map((x) => (
          <option key={x}>{x}</option>
        ))}
      </select>
    </Field>
  );
  const regionField = (
    <Field label="Region" htmlFor="j-region">
      <select id="j-region" className={inputCls} value={region} onChange={(e) => setRegion(e.target.value)}>
        <option value="">Choose…</option>
        {REGION_CHOICES.map((r) => (
          <option key={r}>{r}</option>
        ))}
      </select>
    </Field>
  );
  const catField = (who: string) => (
    <Field label={`${who === "you" ? "Do you" : "Do they"} compete in women's or men's events?`} htmlFor="j-cat" hint="Some funding is for women's sport.">
      <select id="j-cat" className={inputCls} value={cat} onChange={(e) => setCat(e.target.value as "woman" | "man")}>
        <option value="">Choose…</option>
        <option value="woman">Women's events</option>
        <option value="man">Men's events</option>
      </select>
    </Field>
  );
  if (step === "code")
    return (
      <main id="main" className="container-site max-w-xl pb-20">
        <p className="label pt-10 text-signal">Join Revivo Impact</p>
        <h1 ref={headRef} tabIndex={-1} className="text-title mt-2">Check your email</h1>
        <p className="mt-3 text-muted">We would send a 6-digit code to {email}. In this demonstration nothing is sent: your code is <span className="font-medium text-ink tabular-nums">482 913</span>.</p>
        <Field label="Code" htmlFor="j-code">
          <input id="j-code" inputMode="numeric" className={cn(inputCls, "max-w-[12rem] text-lg tracking-widest")} defaultValue="482913" />
        </Field>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button arrow onClick={create}>
            Create my account
          </Button>
          <button type="button" className={btn("quiet")} onClick={() => setStep("details")}>
            Back
          </button>
        </div>
        <Message error={err} />
      </main>
    );
  return (
    <main id="main" className="container-site max-w-3xl pb-20">
      <div className="flex items-center justify-between gap-3 border-b border-line py-3">
        <a href="#/start" aria-label="Revivo Impact start screen">
          <ImpactLockup />
        </a>
        <ThemeButtons withMotion={false} />
      </div>
      <p className="label pt-10 text-signal">Join Revivo Impact</p>
      <h1 ref={headRef} tabIndex={-1} className="text-title mt-2">Who are you registering as?</h1>
      <p className="mt-3 text-muted">Free for athletes, families, coaches and clubs. No invitation needed, and no other Revivo account.</p>
      {errs.length > 0 && (
        <div ref={summaryRef} tabIndex={-1} role="alert" className="mt-6 rounded-[10px] border-2 border-amber p-4">
          <p className="font-medium">{errs.length === 1 ? "One answer is missing" : `${errs.length} answers are missing`}</p>
          <ul className="mt-2 space-y-1 text-small">
            {errs.map(([m, id]) => (
              <li key={id + m}>
                <a href={`#${id}`} className="text-amber underline underline-offset-4" onClick={(e) => (e.preventDefault(), document.getElementById(id)?.focus())}>
                  {m}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      <fieldset className="mt-8">
        <legend className="sr-only">Who are you registering as?</legend>
        <div className="border-t border-line">
          {options.map((o) => (
            <label key={o.id} className="flex cursor-pointer items-start gap-4 border-b border-line py-4">
              <input type="radio" name="who" id={o.id === "athlete" ? "j-who" : undefined} value={o.id} checked={pick === o.id} onChange={() => (setPick(o.id), setErr(null), setErrs([]))} className="mt-1 size-5 shrink-0 appearance-none rounded-full border-2 border-control bg-canvas checked:border-[6px] checked:border-signal" />
              <span>
                <span className="block font-medium">{o.t}</span>
                <span className="block text-small text-subtle">{o.d}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      {pick === "coach" && (
        <p className="mt-6 text-muted">
          Coaches don&rsquo;t need to register first: an adult athlete or a guardian adds you from &ldquo;Consent &amp; safety&rdquo; and chooses what you may do (prepare applications, send updates). You never accept money or change consent for them.{" "}
          <a className="underline underline-offset-4" href="#/app/jonas/home">
            See a coach&rsquo;s view
          </a>
        </p>
      )}
      {pick && pick !== "coach" && (
        <div className="mt-4">
          <Field label="Your name" htmlFor="j-name">
            <input id="j-name" className={inputCls} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
          </Field>
          <Field label="Your email" htmlFor="j-email" hint="We send a code to check it's yours. In this demonstration nothing is sent.">
            <input id="j-email" type="email" className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </Field>
          {pick === "athlete" && (
            <div className="grid gap-x-4 sm:grid-cols-2">
              <Field label="Your age" htmlFor="j-age">
                <input id="j-age" inputMode="numeric" className={inputCls} value={age} onChange={(e) => setAge(e.target.value.replace(/\D/g, ""))} />
              </Field>
              {sportField("Your sport")}
              {regionField}
              {catField("you")}
            </div>
          )}
          {pick === "guardian" && (
            <div className="grid gap-x-4 sm:grid-cols-2">
              <Field label="The athlete's name" htmlFor="j-child">
                <input id="j-child" className={inputCls} value={child} onChange={(e) => setChild(e.target.value)} />
              </Field>
              <Field label="Their age" htmlFor="j-age">
                <input id="j-age" inputMode="numeric" className={inputCls} value={age} onChange={(e) => setAge(e.target.value.replace(/\D/g, ""))} />
              </Field>
              {sportField("Their sport")}
              {regionField}
              {catField("they")}
            </div>
          )}
          {(pick === "organisation" || pick === "company") && (
            <Field label="Organisation name" htmlFor="j-org">
              <input id="j-org" className={inputCls} value={org} onChange={(e) => setOrg(e.target.value)} />
            </Field>
          )}
          {pick === "organisation" && (
            <div className="grid gap-x-4 sm:grid-cols-3">
              <Field label="Type" htmlFor="j-type">
                <select id="j-type" className={inputCls} value={orgType} onChange={(e) => setOrgType(e.target.value)}>
                  {["Club", "Academy", "Federation", "Programme operator", "School sport programme"].map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </Field>
              {sportField("Main sport")}
              {regionField}
            </div>
          )}
          {(pick === "company" || pick === "individual") && sportField("Sport you most want to support")}
        </div>
      )}
      {pick !== "coach" && (
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button arrow onClick={() => {
            const ps: [string, string][] = pick ? problems() : [["Choose who you are registering as.", "j-who"]];
            setErrs(ps);
            setErr(null);
            if (!ps.length) setStep("code");
          }}>
            Continue
          </Button>
          {pick === "guardian" && <span className="text-small text-subtle">Young athletes are never shown as profiles. Everything goes through you.</span>}
        </div>
      )}
      <Message error={err} />
    </main>
  );
}

export { agreementsFor, fundTotals };
