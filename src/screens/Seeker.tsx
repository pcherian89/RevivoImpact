import { useState } from "react";
import { ArrowRight, BadgeCheck, Building2, ChevronRight, CircleCheck, CircleHelp, CircleX, HandHeart, Landmark, Search, Shirt, UserRound, UsersRound } from "lucide-react";
import { useStore } from "../state/store";
import { AMIRA, amiraTotals, closedAt, FUNDERS, fmt, MOMENT_DATE, openAt, OPPORTUNITIES, upcomingAt, type Funder, type Moment, type Opportunity, type Persona } from "../data/world";
import { btn, Button, Chip, cn, FilterPill, HeroBand, ImageSlot, Label, PageHead, Panel, SimulatedAI, Tabs } from "../components/ui";
import { FundingBar, FundingLine } from "../components/money";

const funderOf = (id: string) => FUNDERS.find((f) => f.id === id)!;

function EligIcon({ kind }: { kind: Opportunity["forAmira"]["kind"] }) {
  if (kind === "eligible") return <CircleCheck className="size-4 shrink-0 text-signal" aria-hidden="true" />;
  if (kind === "check") return <CircleHelp className="size-4 shrink-0 text-steel" aria-hidden="true" />;
  return <CircleX className="size-4 shrink-0 text-subtle" aria-hidden="true" />;
}

/* ---------- 3 · Athlete Home ---------- */
export function AthleteHome({ persona }: { persona: Persona }) {
  const { moment } = useStore();
  const first = persona.name.split(" ")[0];
  const needs =
    moment === "apr12"
      ? [
          { t: "Finish your application to the Emerging Athletes Scholarship", d: "Statement of need still to add · closes Fri 30 Apr", a: "Continue application", to: `app/${persona.id}/opportunity/eas` },
          { t: "2 results are waiting for verification", d: "Funders see them as “awaiting verification” until a panel checks them", a: "See my profile", to: `app/${persona.id}/s4` },
        ]
      : moment === "may06"
        ? [{ t: "Tallwater has offered you a scholarship award of $4,500", d: "Read the agreement, then accept or ask a question by Thu 20 May", a: "Read the offer", to: `app/${persona.id}/s15` }]
        : [
            { t: "Add the receipt for your competition judogi ($210)", d: "Tallwater queried it on Wed 30 Jun · instalment 2 follows once it is added", a: "Add receipt", to: `app/${persona.id}/s18` },
            { t: "Your quarterly update was received", d: "3 expenses verified · 2 progress records", a: "See my funding", to: `app/${persona.id}/funding` },
          ];
  return (
    <div className="pb-8">
      <HeroBand file="im-03-athlete-home.png" phone="after">
        <p className="label text-signal">Athlete · judo · Coastal Region</p>
        <h1 className="text-title mt-2">Hello {first}. Here&rsquo;s what needs you.</h1>
      </HeroBand>
      <section aria-labelledby="needs" className="mt-2">
        <h2 id="needs" className="label text-subtle">
          Needs you · {needs.length}
        </h2>
        <ul className="mt-3 divide-y divide-line border-y border-line">
          {needs.map((n, i) => (
            <li key={n.t} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">{n.t}</p>
                <p className="text-small text-subtle">{n.d}</p>
              </div>
              <a href={`#/${n.to}`} className={btn(i === 0 ? "primary" : "secondary", "shrink-0")}>
                {n.a} <ArrowRight className="size-4" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </section>
      <ImageSlot file="im-03-athlete-home.png" className="hero-fade-phone mt-8 w-full md:hidden" />
      {moment !== "apr12" && (
        <section aria-labelledby="award" className="mt-10">
          <h2 id="award" className="label text-subtle">
            Scholarship award · Tallwater Sports Foundation
          </h2>
          <div className="mt-4">
            <FundingLine
              from="Tallwater Sports Foundation"
              to={persona.name}
              current={moment === "may06" ? 2 : 5}
              nodes={[
                { short: "Need", full: "Funding need", stat: fmt(4800) },
                { short: "Support", full: "Approved support", stat: fmt(4500) },
                { short: "Released", full: "Funds released and received", stat: moment === "may06" ? "Next: payment" : `${fmt(2250)} · received` },
                { short: "Spent", full: "Expenditure and verification", stat: moment === "may06" ? "—" : fmt(1930) },
                { short: "Progress", full: "Sporting progress", stat: moment === "may06" ? "—" : "2 records" },
                { short: "Review", full: "Funding review", stat: moment === "may06" ? "—" : "Continue with conditions" },
              ]}
            />
          </div>
        </section>
      )}
      <section aria-labelledby="matched" className="mt-10">
        <div className="flex items-end justify-between">
          <h2 id="matched" className="label flex flex-wrap items-center gap-2 text-subtle">
            Matched for you <SimulatedAI />
          </h2>
          <a href={`#/app/${persona.id}/discover`} className="text-small text-muted underline underline-offset-4 hover:text-ink">
            See all in Discover
          </a>
        </div>
        <MatchedStrip moment={moment} personaId={persona.id} />
      </section>
    </div>
  );
}

function MatchedStrip({ moment, personaId }: { moment: Moment; personaId: string }) {
  const held = moment === "apr12" ? [] : ["eas"];
  const list = openAt(moment).filter((o) => o.forAmira.kind !== "not" && !held.includes(o.id));
  if (list.length === 0)
    return (
      <p className="mt-3 border-y border-line py-4 text-muted">
        No open opportunities match your profile right now. Your saved search will tell you when one opens.
      </p>
    );
  return (
    <ul className="mt-3 divide-y divide-line border-y border-line">
      {list.slice(0, 3).map((o) => (
        <li key={o.id}>
          <a href={`#/app/${personaId}/opportunity/${o.id}`} className="group flex items-center justify-between gap-4 py-3">
            <span className="min-w-0">
              <span className="block truncate font-medium group-hover:text-signal">{o.title}</span>
              <span className="block text-small text-subtle">
                {funderOf(o.funder).name} · {o.amount} · closes {o.deadline}
              </span>
            </span>
            <span className="flex shrink-0 items-center gap-2 text-small text-muted">
              <EligIcon kind={o.forAmira.kind} />
              <span className="hidden sm:inline">{o.forAmira.met ? `${o.forAmira.met[0]} of ${o.forAmira.met[1]}` : ""}</span>
              <ChevronRight className="size-4" aria-hidden="true" />
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

const daysBetween = (a: string, b: string) => Math.round((Date.parse(b) - Date.parse(a)) / 86400000);

function OppRow({ o, personaId, moment }: { o: Opportunity; personaId: string; moment?: Moment }) {
  const soon = moment && o.status === "Open" && daysBetween(MOMENT_DATE[moment], o.closes) <= 7;
  const f = funderOf(o.funder);
  return (
    <li>
      <a href={`#/app/${personaId}/opportunity/${o.id}`} className="group grid gap-2 py-4 md:grid-cols-[1.6fr_1fr_0.8fr_1.4fr_auto] md:items-center md:gap-6">
        <span className="min-w-0">
          <span className="flex flex-wrap items-center gap-2 text-small text-subtle">
            {f.name}
            {f.verified && <BadgeCheck className="size-3.5 text-muted" aria-label="Verified organisation (simulated)" />}
            <span className="text-line-strong">·</span> {f.type}
          </span>
          <span className="mt-0.5 block font-display text-xl font-bold group-hover:text-signal">{o.title}</span>
          <span className="mt-1 inline-flex">
            <Chip kind="neutral">{o.type}</Chip>
          </span>
        </span>
        <span className="flex flex-wrap items-baseline gap-x-2 md:block">
          <span className="block font-medium tabular-nums">{o.amount}</span>
          <span className="block text-small text-subtle">{o.awards}</span>
        </span>
        <span className="text-small">
          <span className="text-subtle md:block">{o.status === "Upcoming" ? "Opens " : "Closes "}</span>
          <span className="font-medium">{o.deadline.replace("Opens ", "")}</span>
          {soon && <span className="ml-2 text-amber md:ml-0 md:block">Closing soon</span>}
        </span>
        <span className="flex items-start gap-2 text-small">
          <EligIcon kind={o.forAmira.kind} />
          <span>
            <span className={cn("block", o.forAmira.kind === "not" ? "text-subtle" : "text-ink")}>{o.forAmira.text}</span>
            {o.why && <span className="block text-subtle">{o.why}</span>}
          </span>
        </span>
        <ChevronRight className="hidden size-5 text-subtle group-hover:text-ink md:block" aria-hidden="true" />
      </a>
    </li>
  );
}

/* ---------- 5 · Discover (seeker) ---------- */
export function SeekerDiscover({ persona }: { persona: Persona }) {
  const { moment } = useStore();
  const [tab, setTab] = useState<"opps" | "sponsors">("opps");
  const [why, setWhy] = useState(false);
  const all = openAt(moment);
  const open = all.filter((o) => o.forAmira.kind !== "hidden");
  const hiddenCount = all.length - open.length;
  const upcoming = upcomingAt(moment);
  const closed = closedAt(moment);
  return (
    <div className="pb-8">
      <HeroBand file="im-05-discover-opportunities.png">
        <p className="label text-signal">Discover</p>
        <h1 className="text-title mt-2">Who could fund me?</h1>
        <p className="text-lead mt-3 text-muted">
          Funding opportunities and sponsors participating on Revivo Impact, checked against your profile by each funder&rsquo;s
          published rules.
        </p>
      </HeroBand>
      <Tabs
        label="Discover"
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "opps", label: "Funding opportunities", count: open.length },
          { id: "sponsors", label: "Sponsors & funders", count: FUNDERS.filter((f) => f.id !== "corvane" && f.id !== "ostral").length },
        ]}
      />
      <div className="mt-4 flex flex-wrap items-center gap-2" aria-label="Filters">
        <FilterPill on>Sport: judo</FilterPill>
        <FilterPill on>Region: Coastal</FilterPill>
        <FilterPill>Support type</FilterPill>
        {tab === "opps" ? <FilterPill>Deadline</FilterPill> : <FilterPill on>Accepts requests</FilterPill>}
        {tab === "opps" && <FilterPill>I&rsquo;m eligible</FilterPill>}
        <button type="button" onClick={() => setWhy(true)} className="ml-auto text-small text-muted underline underline-offset-4 hover:text-ink">
          Why these appear
        </button>
      </div>
      {tab === "opps" ? (
        <>
          <p className="mt-6 text-small text-subtle">
            {open.length} open now from {new Set(open.map((o) => o.funder)).size} organisations · ordered by how many of your
            criteria match, then by deadline
          </p>
          <ul className="mt-2 divide-y divide-line border-y border-line">
            {open.map((o) => (
              <OppRow key={o.id} o={o} personaId={persona.id} moment={moment} />
            ))}
            {hiddenCount > 0 && <li className="py-3 text-small text-subtle">{hiddenCount} more open {hiddenCount === 1 ? "opportunity doesn't" : "opportunities don't"} match your filters.</li>}
            {open.length === 0 && <li className="py-4 text-muted">No opportunities are open right now. Save a search and we&rsquo;ll tell you when one opens.</li>}
          </ul>
          <h2 className="label mt-10 text-subtle">Upcoming</h2>
          <ul className="mt-2 divide-y divide-line border-y border-line">
            {upcoming.map((o) => (
              <OppRow key={o.id} o={o} personaId={persona.id} />
            ))}
          </ul>
          {closed.length > 0 && (
            <p className="mt-6 text-small text-subtle">
              Closed since {MOMENTS_SHORT[moment]}: {closed.map((o) => o.title).join(" · ")}.
            </p>
          )}
        </>
      ) : (
        <>
          <p className="mt-6 text-small text-subtle">
            Participating funders whose sports or regions match yours. Revivo Impact shows participating organisations only;
            it is not a list of every sponsor.
          </p>
          <ul className="mt-2 divide-y divide-line border-y border-line">
            {FUNDERS.filter((f) => f.id !== "corvane" && f.id !== "ostral").map((f) => (
              <FunderRow key={f.id} f={f} personaId={persona.id} />
            ))}
          </ul>
        </>
      )}
      <p className="mt-6 text-small text-subtle">
        Eligibility is checked against each funder&rsquo;s published rules. Meeting them doesn&rsquo;t guarantee an award; a
        review panel decides.
      </p>
      <Panel open={why} onClose={() => setWhy(false)} title="Why these appear" eyebrow="Matching · Simulated AI">
        <SimulatedAI />
        <p className="mt-4 text-muted">
          Suggested because your sport (judo), your national U21 bronze (to be verified), your region (Coastal) and your
          purpose (coaching and competition costs) match these funders&rsquo; published criteria.
        </p>
        <ul className="mt-4 space-y-2 text-small">
          <li>· Eligibility results come from each funder&rsquo;s rules, not from AI.</li>
          <li>· Order: how many of your criteria match, then the deadline. Never popularity or any score of you.</li>
          <li>· Sources: your profile facts and each opportunity&rsquo;s published rules.</li>
        </ul>
        <p className="mt-6 text-small text-subtle">AI-assisted, simulated in this prototype. Check against sources.</p>
      </Panel>
    </div>
  );
}

const MOMENTS_SHORT: Record<Moment, string> = { apr12: "1 Apr", may06: "12 Apr", jun30: "12 Apr" };

const typeIcon: Record<Funder["type"], typeof Building2> = {
  Foundation: Landmark,
  Company: Building2,
  "Sports brand": Shirt,
  "Government body": Landmark,
  Federation: UsersRound,
  "Individual sponsor": UserRound,
};

function FunderRow({ f, personaId }: { f: Funder; personaId: string }) {
  const Icon = typeIcon[f.type];
  return (
    <li>
      <a href={`#/app/${personaId}/profile/${f.id}`} className="group grid gap-2 py-4 md:grid-cols-[1.5fr_1.2fr_1.3fr] md:items-center md:gap-6">
        <span className="flex items-start gap-3">
          <Icon className="mt-1 size-5 shrink-0 text-muted" aria-hidden="true" />
          <span>
            <span className="block font-display text-xl font-bold group-hover:text-signal">{f.name}</span>
            <span className="flex items-center gap-1.5 text-small text-subtle">
              {f.type} {f.verified && <BadgeCheck className="size-3.5 text-muted" aria-label="Verified (simulated)" />}
            </span>
          </span>
        </span>
        <span className="text-small">
          <span className="block text-muted">{f.sports}</span>
          <span className="block text-subtle">
            {f.regions} · {f.typical}
          </span>
        </span>
        <span>
          {f.accepts === "yes" ? (
            <Chip kind="verified">Accepts support asks</Chip>
          ) : f.accepts === "commercial" ? (
            <Chip kind="info">Commercial proposals only</Chip>
          ) : (
            <Chip kind="self">Only through opportunities</Chip>
          )}
        </span>
      </a>
    </li>
  );
}

/* ---------- 6 · Opportunity ---------- */
export function OpportunityPage({ persona, id }: { persona: Persona; id: string }) {
  const o = OPPORTUNITIES.find((x) => x.id === id) ?? OPPORTUNITIES[0];
  const f = funderOf(o.funder);
  const criteria = [
    { t: "Aged 15–21 on 30 Apr 2027", r: "met", d: "You are 19 (self-reported; the panel checks your ID)" },
    { t: "One of 9 sports", r: "met", d: "Judo" },
    { t: "Lives in an eligible region", r: "met", d: "Coastal Region" },
    { t: "A national-level result in the last 18 months", r: "check", d: "Bronze, National U21 Judo Championships 2026 · for the panel to check" },
    { t: "A coach or club referee", r: "met", d: "Keiko Mori, Saltmere Sports Academy" },
    { t: "A statement of financial need", r: "todo", d: "To add when you apply" },
  ];
  return (
    <div className="pb-8">
      <HeroBand file="im-05-discover-opportunities.png">
        <div>
          <p className="flex flex-wrap items-center gap-2 text-small text-muted">
            <a href={`#/app/${persona.id}/profile/${f.id}`} className="underline underline-offset-4 hover:text-ink">
              {f.name}
            </a>
            <BadgeCheck className="size-4 text-muted" aria-label="Verified organisation (simulated)" />
            <span>· {f.type}</span>
          </p>
          <h1 className="text-title mt-2">{o.title}</h1>
          <div className="mt-3 flex flex-wrap gap-2">
            <Chip kind="neutral">{o.type}</Chip>
            <Chip kind="current">Open · Public</Chip>
          </div>
        </div>
      </HeroBand>
      <dl className="mt-8 grid grid-cols-2 border-y border-line md:grid-cols-4">
        {[
          ["Funding", "Three levels: $3,500 · $4,500 · $5,000"],
          ["Awards", "Up to 50 · $250,000 announced"],
          ["Closes", "Fri 30 Apr 2027"],
          ["Sports", "9, including judo"],
        ].map(([k, v]) => (
          <div key={k} className="border-line px-0 py-4 pr-4 odd:border-r md:border-r md:px-4 md:first:pl-0 md:last:border-r-0">
            <dt className="label text-subtle">{k}</dt>
            <dd className="mt-1 font-medium">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-6 flex flex-col gap-4 rounded-[10px] border border-line-strong p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-xl font-bold">4 of 6 met · 1 for the panel to check · 1 to add</p>
          <p className="text-small text-muted">To add when you apply: a statement of need. You have asked Ardent Judo Federation to confirm your national result; the panel checks it.</p>
        </div>
        <a href={`#/app/${persona.id}/s11`} className={btn("primary", "shrink-0")}>
          Apply with my profile <ArrowRight className="size-4" aria-hidden="true" />
        </a>
      </div>
      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr] [&>*]:min-w-0">
        <section aria-labelledby="who">
          <h2 id="who" className="text-subtitle">
            Who can apply
          </h2>
          <p className="mt-1 text-small text-subtle">Checked against your profile by Tallwater&rsquo;s published rules. Your profile fills the form; you choose what Tallwater sees.</p>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {criteria.map((c) => (
              <li key={c.t} className="flex gap-3 py-3">
                {c.r === "met" ? (
                  <CircleCheck className="mt-0.5 size-5 shrink-0 text-signal" aria-label="Met" />
                ) : c.r === "check" ? (
                  <CircleHelp className="mt-0.5 size-5 shrink-0 text-steel" aria-label="For the panel to check" />
                ) : (
                  <CircleHelp className="mt-0.5 size-5 shrink-0 text-amber" aria-label="To add" />
                )}
                <span>
                  <span className="block font-medium">{c.t}</span>
                  <span className="block text-small text-subtle">{c.d}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-small text-subtle">
            Eligibility is checked against the funder&rsquo;s published rules. Meeting them doesn&rsquo;t guarantee an award; a
            review panel decides.
          </p>
        </section>
        <aside className="space-y-8">
          <section>
            <Label>What you&rsquo;ll need</Label>
            <ul className="mt-2 space-y-1 text-muted">
              <li>· Proof of age (ID document, seen only by verifiers)</li>
              <li>· Results evidence</li>
              <li>· Coach or club reference</li>
              <li>· Budget with invoices or quotes</li>
              <li>· Other funding for the same costs</li>
            </ul>
          </section>
          <section>
            <Label>How decisions are made</Label>
            <p className="mt-2 text-muted">
              A reviewer checks your evidence and scores four criteria. A different person approves. People decide; AI
              never does. Decisions by Thu 6 May.
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

/* ---------- 8 · Public profile (funder variant) ---------- */
export function FunderProfile({ persona, id }: { persona: Persona; id: string }) {
  const f = funderOf(id) ?? FUNDERS[1];
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const opps = OPPORTUNITIES.filter((o) => o.funder === f.id);
  const Icon = typeIcon[f.type];
  const isNadia = persona.id === "nadia";
  return (
    <div className="pb-8">
      <HeroBand file={f.type === "Individual sponsor" ? "im-19-individual-sponsor.png" : "im-06-funder-visit.png"}>
        <div>
          <p className="flex items-center gap-2 text-small text-muted">
            <Icon className="size-4" aria-hidden="true" /> {f.type} · participating on Revivo Impact
          </p>
          <h1 className="text-title mt-2">{f.name}</h1>
          <p className="text-lead mt-3 text-muted">{f.objective}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Chip kind="verified">Verified {f.type === "Individual sponsor" ? "individual" : "organisation"} · simulated check</Chip>
            {f.accepts === "yes" && <Chip kind="verified">Accepts support asks</Chip>}
          </div>
        </div>
      </HeroBand>
      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1.3fr_1fr] [&>*]:min-w-0">
        <section aria-labelledby="supports">
          <h2 id="supports" className="text-subtitle">
            What they support
          </h2>
          <dl className="mt-4 divide-y divide-line border-y border-line">
            {[
              ["Sports", f.sports],
              ["Regions", f.regions],
              ["Funding types", f.types.join(" · ")],
              ["Typical support", f.typical],
              ["Requests", f.acceptsNote],
            ].map(([k, v]) => (
              <div key={k} className="grid grid-cols-[9rem_1fr] gap-4 py-3">
                <dt className="text-subtle">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          {opps.length > 0 && (
            <>
              <h3 className="label mt-8 text-subtle">Open and upcoming opportunities</h3>
              <ul className="mt-2 divide-y divide-line border-y border-line">
                {opps.map((o) => (
                  <li key={o.id} className="py-3">
                    <a className="font-medium hover:text-signal" href={`#/app/${persona.id}/opportunity/${o.id}`}>
                      {o.title}
                    </a>
                    <p className="text-small text-subtle">
                      {o.amount} · {o.deadline}
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
              <p className="mt-2 text-small text-muted">
                Ask once, for part of one of your funding requests. {f.name.split(" ")[0]} sees only what you share and
                answers with an offer, a question or &ldquo;not now&rdquo;. No open messaging.
              </p>
              {sent ? (
                <p role="status" className="mt-4 flex items-center gap-2 text-signal">
                  <CircleCheck className="size-5" aria-hidden="true" /> Request sent (simulated)
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
              <p className="mt-2">{f.name} funds only through its published opportunities. Apply to one of those instead.</p>
            </div>
          )}
          <p className="mt-4 text-small text-subtle">Block this funder or report a concern from the menu on any contact.</p>
        </aside>
      </div>
      <Panel open={open} onClose={() => setOpen(false)} title={`Ask ${f.name} for support`} eyebrow="Support ask">
        <p className="text-muted">Linked to your funding request:</p>
        <p className="mt-1 font-medium">{isNadia ? "Racing wheels and competition travel · $5,200" : "You have no published funding request yet."}</p>
        {!isNadia && <p className="mt-1 text-small text-subtle">An ask always links to one of your funding requests. Publish one first from My Funding.</p>}
        <fieldset className="mt-5">
          <legend className="label text-subtle">What you ask for</legend>
          <p className="mt-2">{isNadia ? "Travel to the Continental Para Athletics Series · $1,200" : "Competition travel · $1,200"}</p>
        </fieldset>
        <fieldset className="mt-5">
          <legend className="label text-subtle">What {f.name.split(" ")[0]} will see</legend>
          <ul className="mt-2 space-y-1 text-small text-muted">
            <li>· Name, sport, classification and region</li>
            <li>· Verified results (3) and the request breakdown</li>
            <li>· Not your contact details</li>
          </ul>
        </fieldset>
        <p className="mt-5 text-small text-subtle">Checked against what this funder supports before it is sent · one open ask per funder · at most 5 open asks at a time.</p>
        <Button
          className="mt-6"
          onClick={() => {
            setSent(true);
            setOpen(false);
          }}
        >
          Send ask
        </Button>
      </Panel>
    </div>
  );
}

/* ---------- 17 · Funding record (athlete chain) ---------- */
export function FundingRecord({ persona }: { persona: Persona }) {
  const t = amiraTotals();
  const [src, setSrc] = useState<string | null>(null);
  return (
    <div className="pb-8">
      <PageHead
        eyebrow="My Funding · scholarship award"
        title="How is my scholarship being used?"
        lead={
          <>
            Emerging Athletes Scholarship from Tallwater Sports Foundation. <span className="text-ink">Next:</span> add the
            judogi receipt; instalment 2 on Wed 1 Sep.
          </>
        }
        actions={
          <a href={`#/app/${persona.id}/s18`} className={btn("primary")}>
            Add the judogi receipt <ArrowRight className="size-4" aria-hidden="true" />
          </a>
        }
      />
      <FundingLine
        from="Tallwater Sports Foundation"
        to={persona.name}
        current={5}
        onSource={(n) => setSrc(n.full)}
        nodes={[
          { short: "Need", full: "Funding need", stat: fmt(AMIRA.requested), note: "Requested" },
          { short: "Support", full: "Approved support", stat: fmt(AMIRA.committed), note: "Approved by I. Solberg · accepted 6 May" },
          { short: "Released", full: "Funds released and received", stat: `${fmt(AMIRA.released)} of ${fmt(AMIRA.committed)}`, note: "Received 6 May" },
          { short: "Spent", full: "Expenditure and verification", stat: `${fmt(t.reported)} reported`, note: `${fmt(t.verified)} verified · ${fmt(t.awaiting)} awaiting` },
          { short: "Progress", full: "Sporting progress", stat: "2 progress records", note: "5th, Continental U21 Invitational (verified) · 34 of 36 sessions (attested by coach)" },
          { short: "Review", full: "Funding review", stat: "Continue with conditions", note: "D. Osei · 30 Jun" },
        ]}
      />
      <section aria-labelledby="money" className="mt-10">
        <h2 id="money" className="label text-subtle">
          Where the money is
        </h2>
        <div className="mt-4">
          <AwardBar onSource={setSrc} />
        </div>
      </section>
      <section aria-labelledby="ledger" className="mt-10">
        <h2 id="ledger" className="label text-subtle">
          Spending you reported
        </h2>
        <ul className="mt-3 divide-y divide-line border-y border-line sm:hidden">
          {AMIRA.expenses.map((e) => (
            <li key={e.label} className="flex items-start justify-between gap-3 py-3">
              <span>
                <span className="block">{e.label}</span>
                <span className="block text-small text-subtle">{e.doc}</span>
                <span className="mt-1 block">{e.state === "verified" ? <Chip kind="verified">Spent · verified</Chip> : <Chip kind="attention">Receipt needed</Chip>}</span>
              </span>
              <span className="font-medium tabular-nums">{fmt(e.amount)}</span>
            </li>
          ))}
          <li className="flex justify-between py-3 font-medium">
            <span>Total you reported</span>
            <span className="tabular-nums">{fmt(t.reported)}</span>
          </li>
        </ul>
        <div className="relative mt-3 hidden overflow-x-auto sm:block">
          <table className="w-full min-w-[36rem] text-table">
            <thead>
              <tr className="label border-b border-line text-left text-subtle">
                <th className="py-3 pr-4 font-bold">Item</th>
                <th className="py-3 pr-4 font-bold">Document</th>
                <th className="py-3 pr-4 text-right font-bold">Amount</th>
                <th className="py-3 font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {AMIRA.expenses.map((e) => (
                <tr key={e.label} className="h-12 border-b border-line">
                  <td className="pr-4">{e.label}</td>
                  <td className="pr-4 text-muted">{e.doc}</td>
                  <td className="pr-4 text-right tabular-nums">{fmt(e.amount)}</td>
                  <td>{e.state === "verified" ? <Chip kind="verified">Spent · verified</Chip> : <Chip kind="attention">Receipt needed</Chip>}</td>
                </tr>
              ))}
              <tr className="h-12 font-medium">
                <td className="pr-4">Total you reported</td>
                <td />
                <td className="pr-4 text-right tabular-nums">{fmt(t.reported)}</td>
                <td className="text-small text-subtle">
                  {fmt(t.verified)} verified · {fmt(t.awaiting)} awaiting verification
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <Panel open={!!src} onClose={() => setSrc(null)} title="Where this number comes from" eyebrow="Source records">
        <p className="text-small text-subtle">
          Scholarship award · Amira Haddad › {src} › records
        </p>
        <ul className="mt-4 divide-y divide-line border-y border-line text-small">
          <li className="py-3">Release · instalment 1 · {fmt(2250)} · recorded by P. Nair, 6 May · ref TW-EAS-0412 (simulated) · received 6 May</li>
          {AMIRA.expenses.map((e) => (
            <li key={e.label} className="py-3">
              Expense · {e.label} · {fmt(e.amount)} · {e.doc} · {e.state === "verified" ? "verified by P. Nair, 30 Jun" : "queried by P. Nair, 30 Jun"}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-small text-subtle">Every total on this screen is summed from these entries; nothing is typed in.</p>
      </Panel>
    </div>
  );
}

function AwardBar({ onSource }: { onSource: (s: string) => void }) {
  const t = amiraTotals();
  return (
    <FundingBar
      committed={AMIRA.committed}
      released={AMIRA.released}
      reported={t.reported}
      verified={t.verified}
      receivedOn="6 May"
      onSource={onSource}
    />
  );
}

/* ---------- 2 · Join ---------- */
export function Join() {
  const { go } = useStore();
  const [pick, setPick] = useState<string | null>(null);
  const options = [
    { id: "athlete", t: "An athlete (18 or over)", d: "Build one sporting profile and find funding and sponsors." },
    { id: "guardian", t: "A parent or guardian", d: "Register a young athlete under 18. You stay in control of everything." },
    { id: "coach", t: "A coach", d: "Help athletes who authorise you. You can prepare, not decide." },
    { id: "organisation", t: "An organisation", d: "A club, academy, school, federation, charity, foundation, company or brand. Seek funding, provide it, or both." },
    { id: "individual", t: "An individual sponsor", d: "Support adults, teams and clubs personally, after a verification check." },
  ];
  return (
    <main id="main" className="container-site max-w-3xl pb-20">
      <p className="label pt-10 text-signal">Join Revivo Impact · step 1 of 5</p>
      <h1 className="text-title mt-2">Who are you registering as?</h1>
      <p className="mt-3 text-muted">Free for athletes, parents, coaches and clubs. No invitation needed, and no other Revivo account.</p>
      <fieldset className="mt-8">
        <legend className="sr-only">Who are you registering as?</legend>
        <div className="divide-y divide-line border-y border-line">
          {options.map((o) => (
            <label key={o.id} className="flex cursor-pointer items-start gap-4 py-4">
              <input
                type="radio"
                name="who"
                value={o.id}
                checked={pick === o.id}
                onChange={() => setPick(o.id)}
                className="mt-1 size-5 accent-[var(--ri-signal)]"
              />
              <span>
                <span className="block font-medium">{o.t}</span>
                <span className="block text-small text-subtle">{o.d}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <Button arrow disabled={!pick} onClick={() => go(pick === "athlete" ? "app/amira/s4" : "roles")}>
          Start my registration
        </Button>
        <span className="text-small text-subtle">Next: a simulated email code. Nothing is sent.</span>
      </div>
    </main>
  );
}
