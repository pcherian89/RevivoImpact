import { useState } from "react";
import { ArrowRight, BadgeCheck, ChevronRight, CircleAlert, CircleCheck, FileText, Lock, Star, UsersRound, X } from "lucide-react";
import { useStore } from "../state/store";
import { fmt, REQUESTS, type Persona, type RequestRow } from "../data/world";
import { btn, Button, Chip, cn, FilterPill, HeroBand, Label, PageHead, Panel, SeeSource, SimulatedAI, Tabs } from "../components/ui";
import { FundBar, MiniLine, NeedBar } from "../components/money";

/* ---------- 3 · Funder Overview (Tallwater) ---------- */
export function FunderOverview({ persona }: { persona: Persona }) {
  const { moment } = useStore();
  const at = {
    apr12: { committed: 0, reserved: 0, apps: 1, needs: [{ t: "Daniel's draft is waiting for your approval", d: "Emerging Athletes Scholarship · you did not prepare it, so you can publish it", a: "Review and publish", to: "s9" }] },
    may06: { committed: 4500, reserved: 210000, apps: 143, needs: [{ t: "Decisions sent to all 143 applicants", d: "46 scholarship offers ($214,500) · 2 on the waiting list · 45 offers awaiting acceptance", a: "Follow the offers", to: "s12" }] },
    jun30: { committed: 211000, reserved: 3500, apps: 143, needs: [{ t: "Quarterly updates have arrived for review", d: "Spending and progress from scholarship holders · 1 offer still awaiting acceptance (extended to Thu 15 Jul)", a: "Review updates", to: "portfolio" }] },
  }[moment];
  return (
    <div className="pb-8">
      <HeroBand file="im-06-funder-visit.png" phone="after">
        <p className="label text-signal">Tallwater Sports Foundation · Overview</p>
        <h1 className="text-title mt-2">What needs you, {persona.name.split(" ")[0]}?</h1>
      </HeroBand>
      <ul className="mt-2 divide-y divide-line border-y border-line">
        {at.needs.map((n) => (
          <li key={n.t} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium">{n.t}</p>
              <p className="text-small text-subtle">{n.d}</p>
            </div>
            <a href={`#/app/${persona.id}/${n.to}`} className={btn("primary", "shrink-0")}>
              {n.a} <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
      <section aria-labelledby="fund" className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <Label>Emerging Athletes Scholarship 2027</Label>
            <h2 id="fund" className="text-subtitle mt-1">
              Where the scholarship money stands
            </h2>
          </div>
          <a href={`#/app/${persona.id}/s21`} className={btn("secondary")}>
            <FileText className="size-4" aria-hidden="true" /> Reports
          </a>
        </div>
        <p className="mt-1 text-small text-subtle">Committed means approved and accepted. Reserved means offered, awaiting acceptance.</p>
        <div className="mt-5">
          <FundBar announced={250000} committed={at.committed} reserved={at.reserved} />
        </div>
      </section>
      <section className="mt-10 grid gap-8 border-t border-line pt-8 md:grid-cols-3">
        <Answer
          q="Who applied"
          a={<SeeSource name="applications">{at.apps} applications</SeeSource>}
          d={moment === "apr12" ? "Opens today" : "61 found it in Discover · 79 via your link · 3 nominated"}
        />
        <Answer
          q="Who is funded"
          a={moment === "apr12" ? "Not yet" : moment === "may06" ? <SeeSource name="offers">46 offered</SeeSource> : <SeeSource name="scholarship awards">45 scholarship awards</SeeSource>}
          d={moment === "apr12" ? "Decisions on Thu 6 May" : moment === "may06" ? "1 accepted so far · acceptance window 14 days" : "27 × $5,000 · 13 × $4,500 · 5 × $3,500 accepted"}
        />
        <Answer
          q="How it's being used"
          a={moment === "jun30" ? <SeeSource name="released">$105,500 released</SeeSource> : moment === "may06" ? <SeeSource name="released">$2,250 released</SeeSource> : "Not yet"}
          d={moment === "apr12" ? "Instalment 1 is paid as each award is accepted" : moment === "may06" ? "Instalment 1 of the first accepted award · confirmed received" : "Instalment 1 (50%) of 45 awards · quarterly updates being verified"}
        />
      </section>
      <p className="mt-8 text-small text-subtle">Delivery and spending records show what was delivered and spent; they do not on their own prove social impact.</p>
    </div>
  );
}

function Answer({ q, a, d }: { q: string; a: React.ReactNode; d: string }) {
  return (
    <div>
      <Label>{q}</Label>
      <p className="text-stat mt-2">{a}</p>
      <p className="mt-1 text-small text-subtle">{d}</p>
    </div>
  );
}

/* ---------- 5 · Discover (funder) ---------- */
export function FunderDiscover({ persona }: { persona: Persona }) {
  const isLucy = persona.id === "lucy";
  const [tab, setTab] = useState<"athletes" | "requests" | "teams" | "shortlist">(isLucy ? "athletes" : "requests");
  const [chips, setChips] = useState(isLucy ? ["Athletics: sprint", "Adults only", "Open to commercial partners", "National level"] : ["Para athletics", "Equipment", "Any region", "Verified evidence"]);
  const [short, setShort] = useState<string[]>([]);
  // Deterministic criteria-fit count (docs/02 §9.4): how many of the brief's filters a row meets; never a person score.
  const fit = (tags: string[]) => chips.filter((c) => tags.includes(c));
  const requests = REQUESTS.filter((r) => (persona.role === "individual" ? !r.minor : true))
    .map((r) => ({ r, m: fit(r.tags) }))
    .sort((a, b) => b.m.length - a.m.length);
  const athletes = [
    { id: "jonah", n: "Jonah Reyes", s: "Sprint · 200m", lvl: "National finalist 2026", r: "Southern Region · 22", v: "3 verified · 2 self-reported", tag: "Open to commercial partners", tags: ["Athletics: sprint", "Adults only", "Open to commercial partners", "National level"] },
    { id: "nadia", n: "Nadia Kovač", s: "Wheelchair racing · T54", lvl: "Continental level", r: "Coastal Region · 23", v: "3 verified · 1 self-reported", tag: "Funding request open", tags: ["Para athletics", "Equipment", "Any region", "Verified evidence", "Adults only", "National level"] },
    { id: "elif", n: "Elif Demir", s: "Rowing · single scull", lvl: "National level", r: "Lakes Region · 24", v: "2 verified", tag: "Supported by 1 funder", tags: ["Adults only", "Equipment", "National level", "Verified evidence"] },
  ]
    .map((a) => ({ ...a, m: fit(a.tags) }))
    .sort((a, b) => b.m.length - a.m.length);
  const tabsDef = [
    { id: "athletes" as const, label: "Athletes", count: 48 },
    { id: "requests" as const, label: "Funding requests", count: requests.length },
    { id: "teams" as const, label: "Teams & initiatives", count: 3 },
    { id: "shortlist" as const, label: "Shortlist", count: short.length },
  ];
  return (
    <div className="pb-8">
      <PageHead eyebrow={`Discover · ${persona.org}`} title="Who could we support?" lead="Athletes who chose to be discoverable, funding requests, and teams and initiatives participating on Revivo Impact." />
      <div className="rounded-[10px] border border-line-strong p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label htmlFor="brief" className="label text-subtle">
            Describe what you want to support
          </label>
          <SimulatedAI />
        </div>
        <input
          id="brief"
          defaultValue={isLucy ? "adult sprinters competing nationally, open to a kit partnership" : "para athletes needing equipment, any region"}
          className="mt-2 h-12 w-full rounded-[6px] border border-control bg-surface-2 px-3 text-ink"
        />
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-small text-subtle">Filters from your brief (edit freely):</span>
          {chips.map((c) => (
            <span key={c} className="inline-flex min-h-8 items-center gap-1 rounded-full border border-signal/50 pr-1 pl-3 text-small">
              {c}
              <button type="button" aria-label={`Remove filter ${c}`} onClick={() => setChips(chips.filter((x) => x !== c))} className="rounded-full p-1 hover:bg-surface-2">
                <X className="size-3" aria-hidden="true" />
              </button>
            </span>
          ))}
        </div>
      </div>
      <div className="mt-6">
        <Tabs label="Discover" value={tab} onChange={setTab} tabs={tabsDef} />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <FilterPill on>Sport</FilterPill>
        <FilterPill>Support type</FilterPill>
        <FilterPill>Region</FilterPill>
        <FilterPill>Amount</FilterPill>
        <FilterPill on>Verified evidence</FilterPill>
      </div>
      <p className="mt-5 text-small text-subtle">
        Ordered by how many of your criteria match, then by date needed. Never by popularity, followers or any score of a
        person.
      </p>
      {tab === "requests" && (
        <ul className="mt-2 divide-y divide-line border-y border-line">
          {requests.map(({ r, m }) => (
            <RequestListRow key={r.id} r={r} m={m} of={chips.length} personaId={persona.id} short={short} setShort={setShort} />
          ))}
        </ul>
      )}
      {tab === "athletes" && (
        <ul className="mt-2 divide-y divide-line border-y border-line">
          {athletes.map((a) => (
            <li key={a.id} className="grid gap-2 py-4 md:grid-cols-[1.4fr_1.2fr_1fr_auto] md:items-center md:gap-6">
              <span>
                <span className="block font-display text-xl font-bold">{a.n}</span>
                <span className="text-small text-subtle">
                  {a.s} · {a.r}
                </span>
              </span>
              <span className="text-small">
                <span className="block">{a.lvl}</span>
                <span className="block text-subtle">{a.v}</span>
              </span>
              <span className="text-small text-muted">
                <Chip kind={a.tag.startsWith("Open") ? "info" : "neutral"}>{a.tag}</Chip>
                <FitLine m={a.m} of={chips.length} />
              </span>
              <ShortBtn id={a.id} short={short} setShort={setShort} />
            </li>
          ))}
          <li className="py-3 text-small text-subtle">
            <Lock className="mr-1 inline size-3.5" aria-hidden="true" /> Athletes under 18 are never shown as profiles.
          </li>
        </ul>
      )}
      {tab === "teams" && (
        <ul className="mt-2 divide-y divide-line border-y border-line">
          {requests
            .filter(({ r }) => r.owner === "organisation")
            .map(({ r, m }) => (
              <RequestListRow key={r.id} r={r} m={m} of={chips.length} personaId={persona.id} short={short} setShort={setShort} />
            ))}
          <li className="grid gap-1 py-4">
            <span className="font-display text-xl font-bold">Highland Cycling Club</span>
            <span className="text-small text-subtle">Youth club bikes · $5,000 · Highland Region · organisation verified</span>
          </li>
        </ul>
      )}
      {tab === "shortlist" && (
        <p className="mt-6 text-muted">
          {short.length === 0 ? "Nothing shortlisted yet. Use “Shortlist” on any row. Only your organisation sees this list." : `${short.length} saved. Only your organisation sees this list.`}
        </p>
      )}
    </div>
  );
}

function FitLine({ m, of }: { m: string[]; of: number }) {
  return (
    <span className="mt-1 block text-small text-subtle">
      {m.length === 0 ? "Matches none of your filters" : `Matches ${m.length} of ${of}: ${m.join(" · ").toLowerCase()}`}
    </span>
  );
}

function ShortBtn({ id, short, setShort }: { id: string; short: string[]; setShort: (s: string[]) => void }) {
  const on = short.includes(id);
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={() => setShort(on ? short.filter((x) => x !== id) : [...short, id])}
      aria-label={on ? "Remove from shortlist" : "Add to shortlist"}
      className={btn("secondary", "min-h-11 justify-self-start px-4 font-sans text-small font-medium tracking-normal")}
    >
      <Star className={cn("size-4", on && "fill-current")} aria-hidden="true" /> <span>{on ? "Shortlisted" : "Shortlist"}</span>
    </button>
  );
}

function RequestListRow({ r, m, of, personaId, short, setShort }: { r: RequestRow; m: string[]; of: number; personaId: string; short: string[]; setShort: (s: string[]) => void }) {
  return (
    <li className="grid gap-3 py-4 md:grid-cols-[1.4fr_1.4fr_1fr_auto] md:items-center md:gap-6">
      <a href={`#/app/${personaId}/request/${r.id}`} className="group block">
        <span className="flex items-center gap-2 font-display text-xl font-bold group-hover:text-signal">
          {r.minor && <Lock className="size-4 text-subtle" aria-label="Anonymised: under 18" />}
          {r.label}
          <ChevronRight className="size-4 text-subtle group-hover:text-ink" aria-hidden="true" />
        </span>
        <span className="text-small text-subtle">
          {r.sport} · {r.region}
          {r.owner === "organisation" && " · organisation"}
        </span>
      </a>
      <span className="text-small">
        <span className="block">{r.what}</span>
        <span className="mt-1 block max-w-[18rem]">
          <NeedBar requested={r.requested} pledged={r.pledged} received={r.pledged} compact />
        </span>
      </span>
      <span className="text-small">
        <span className="block text-muted">{r.verified}</span>
        <span className="block text-subtle">{r.needed}</span>
        <FitLine m={m} of={of} />
      </span>
      <ShortBtn id={r.id} short={short} setShort={setShort} />
    </li>
  );
}

/* ---------- 7 · Funding request (funder view) with the offer rules ---------- */
export function RequestPage({ id }: { persona: Persona; id: string }) {
  const r = REQUESTS.find((x) => x.id === id) ?? REQUESTS[0];
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(r.minor ? "2600" : "2500");
  const [sent, setSent] = useState<number | null>(null);
  const remaining = r.requested - r.pledged;
  const n = Number(amount.replace(/[^0-9]/g, "")) || 0;
  const LIMIT = 2000;
  const overNeed = n > remaining;
  const overLimit = !overNeed && n > LIMIT;
  // Minors' cards show category totals only, never a line breakdown (docs/02 §7.3).
  const breakdown = r.id === "nadia" ? [["Racing wheels", 3400], ["Continental Para Athletics Series travel", 1800]] : [[r.what, r.requested]];
  // Fund available is derived from Oriel's agreements, not typed in (docs/05 §2.1, §5.5): 6 seeded + Nadia's offer before Tiago's.
  const orielCommitted = 8400 + (r.id === "tiago" ? 2000 : 0);
  const fundAvailable = 20000 - orielCommitted;
  const pledged = r.pledged + (sent ?? 0);
  return (
    <div className="pb-8">
      <PageHead
        eyebrow={r.minor ? "Funding request · anonymised (under 18)" : "Funding request · Public"}
        title={r.minor ? r.label : `${r.label}: ${r.what.toLowerCase()}`}
        lead={r.minor ? `${r.what} · ${r.region}. Published by the athlete's guardian. Names, club, school and photos are never shown.` : `${r.sport} · ${r.region}. ${r.needed}.`}
      />
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.3fr_1fr] [&>*]:min-w-0">
        <section>
          <Label>How much is still missing</Label>
          <div className="mt-3">
            <NeedBar requested={r.requested} pledged={pledged} received={r.pledged} />
          </div>
          <h2 className="label mt-8 text-subtle">Breakdown</h2>
          <table className="mt-2 w-full text-table">
            <tbody>
              {breakdown.map(([k, v]) => (
                <tr key={k as string} className="h-11 border-b border-line">
                  <td>{k}</td>
                  <td className="text-right tabular-nums">{fmt(v as number)}</td>
                </tr>
              ))}
              <tr className="h-11 font-medium">
                <td>Requested</td>
                <td className="text-right tabular-nums">{fmt(r.requested)}</td>
              </tr>
            </tbody>
          </table>
          <h2 className="label mt-8 text-subtle">Sporting evidence</h2>
          <ul className="mt-2 space-y-2">
            {r.minor ? (
              <li>
                <Chip kind="verified">Qualification verified by the national swimming federation</Chip>
              </li>
            ) : (
              <>
                <li>
                  <Chip kind="verified">Classification T54 · verified by document · 2 Mar</Chip>
                </li>
                <li>
                  <Chip kind="verified">2nd, 800m T54, national championships 2026 · results list</Chip>
                </li>
                <li>
                  <Chip kind="verified">Coach reference · Saltmere Sports Academy</Chip>
                </li>
                <li>
                  <Chip kind="self">Season goals · self-reported</Chip>
                </li>
              </>
            )}
          </ul>
          {r.minor && (
            <p className="mt-6 flex gap-2 text-small text-subtle">
              <BadgeCheck className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> Checked for identifying details by the platform
              (simulated) · 6 May. 23 registered athletes share this sport, age group and region.
            </p>
          )}
        </section>
        <aside className="rounded-[10px] border border-line-strong p-5">
          <UsersRound className="size-6 text-signal" aria-hidden="true" />
          <h2 className="text-subtitle mt-3">Offer support</h2>
          <p className="mt-2 text-small text-muted">
            {r.minor
              ? "This offer goes to the athlete's guardian. The sponsor cannot contact the athlete directly. You will see the athlete's first name only if the guardian accepts."
              : "The athlete can accept, decline or ask for changes. You see contact details only through the agreement."}
          </p>
          {sent ? (
            <p role="status" className="mt-4 flex items-start gap-2 text-signal">
              <CircleCheck className="mt-0.5 size-5 shrink-0" aria-hidden="true" /> Offer of {fmt(sent)} sent to {r.minor ? "the guardian" : r.label.split(" ")[0]} (simulated). Reserved until accepted.
            </p>
          ) : (
            <Button className="mt-4 w-full" onClick={() => setOpen(true)} arrow>
              Offer support
            </Button>
          )}
          <button type="button" className={btn("secondary", "mt-3 w-full")}>
            Express interest
          </button>
          <p className="mt-4 text-small text-subtle">Oriel Athlete Support · your delegated limit {fmt(LIMIT)} · fund available {fmt(fundAvailable)}</p>
        </aside>
      </div>
      <Panel open={open} onClose={() => setOpen(false)} title="Offer support" eyebrow="Oriel Athlete Support · direct athlete support">
        <label htmlFor="amt" className="block font-medium">
          Amount (USD)
        </label>
        <p className="text-small text-subtle">Still needed: {fmt(remaining)}. Offers are capped at what is still needed.</p>
        <input
          id="amt"
          inputMode="numeric"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          aria-invalid={overNeed || overLimit}
          aria-describedby="amt-msg"
          className="mt-2 h-12 w-full max-w-[12rem] rounded-[6px] border border-control bg-surface-2 px-3 tabular-nums text-ink"
        />
        <div id="amt-msg" className="mt-3 min-h-12 text-small">
          {overNeed && (
            <p className="flex gap-2 text-amber">
              <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> This exceeds the {fmt(remaining)} still needed by {fmt(n - remaining)}. Enter {fmt(remaining)} or less.
            </p>
          )}
          {overLimit && (
            <p className="flex gap-2 text-amber">
              <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> Above your {fmt(LIMIT)} limit: a second person with Approve must approve this offer.
            </p>
          )}
        </div>
        <p className="mt-2 text-small text-muted">Purpose: {r.id === "nadia" ? "racing wheels" : "competition travel"} · one payment on acceptance · one update with receipts by Wed 30 Jun.</p>
        <label htmlFor="reason" className="mt-5 block font-medium">
          Reason, linked to the fund&rsquo;s published criteria
        </label>
        <textarea
          id="reason"
          rows={2}
          defaultValue={r.id === "nadia" ? "Equipment for a verified adult para athlete competing at continental level (criteria 1 and 3)." : "Competition travel to a verified national qualification, Coastal Region (criteria 2 and 3)."}
          className="mt-2 w-full rounded-[6px] border border-control bg-surface-2 p-3 text-ink"
        />
        <Button
          className="mt-6"
          disabled={overNeed || n <= 0}
          onClick={() => {
            if (overLimit) return;
            setSent(n);
            setOpen(false);
          }}
        >
          {overLimit ? "Send for second approval" : "Send offer"}
        </Button>
        <p className="mt-3 text-small text-subtle">These checks are rules, not AI: the cap (I4) and the delegated limit.</p>
      </Panel>
    </div>
  );
}

/* ---------- 16 · Funding (portfolio) ---------- */
export function Portfolio({ persona }: { persona: Persona }) {
  const { moment } = useStore();
  const [tab, setTab] = useState<"agreements" | "programmes" | "reports">("agreements");
  // The portfolio follows the demo clock (docs/05 §9): the scholarship has no agreements on 12 Apr, one on 6 May
  // (Amira's), 45 on 30 Jun; Journey D's existing agreement joins on 30 Jun.
  const eas =
    moment === "apr12"
      ? { n: 0, committed: 0, released: 0, stage: 0, stageLabel: "Open for applications", next: "Deadline Fri 30 Apr" }
      : moment === "may06"
        ? { n: 1, committed: 4500, released: 2250, stage: 2, stageLabel: "45 offers awaiting acceptance", next: "Acceptance by Thu 20 May" }
        : { n: 45, committed: 211000, released: 105500, stage: 3, stageLabel: "Spending reported, being verified", next: "Instalment 2 · Wed 1 Sep" };
  const allRows = [
    { fund: "Emerging Athletes Scholarship", type: "Scholarship award", ...eas, verified: null as number | null },
    { fund: "Community Sports Programme Grant", type: "Programme grant", n: 3, committed: 145000, released: 29000, verified: null as number | null, stage: 3, stageLabel: "Quarter 1 spending being verified", next: "Quarter 1 reports under review" },
    { fund: "Federation Development Grants", type: "Development grant", n: 1, committed: 24000, released: 12000, verified: 0 as number | null, stage: 2, stageLabel: "Carried in; first update due", next: "Ostral update · Thu 30 Sep", carried: true },
  ];
  const rows = allRows.filter((r) => !(r.carried && moment !== "jun30"));
  const dev = rows.filter((r) => r.type !== "Programme grant");
  const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
  return (
    <div className="pb-8">
      <PageHead
        eyebrow="Funding · Tallwater Sports Foundation"
        title="Where is our money?"
        lead="Every agreement across your funds. Development and programme money are totalled apart; every figure opens its records."
        actions={<a href={`#/app/${persona.id}/s15`} className={btn("primary")}>Add existing funding</a>}
      />
      <Tabs
        label="Funding"
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "agreements", label: "Agreements" },
          { id: "programmes", label: "Programmes" },
          { id: "reports", label: "Reports" },
        ]}
      />
      {tab === "agreements" ? (
        <div className="relative mt-4 overflow-x-auto">
          <table className="w-full min-w-[60rem] text-table">
            <thead>
              <tr className="label border-b border-line text-left text-subtle">
                <th className="sticky left-0 bg-canvas py-3 pr-4 font-bold">Fund</th>
                <th className="py-3 pr-4 font-bold">Type</th>
                <th className="py-3 pr-4 text-right font-bold">Agreements</th>
                <th className="py-3 pr-4 text-right font-bold">Committed</th>
                <th className="py-3 pr-4 text-right font-bold">Released</th>
                <th className="py-3 pr-4 text-right font-bold">Spent · verified</th>
                <th className="py-3 pr-4 font-bold">Where most stand</th>
                <th className="py-3 font-bold">Next</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.fund} className="h-14 border-b border-line">
                  <td className="sticky left-0 bg-canvas pr-4 font-medium">
                    {r.fund}
                    {r.carried && <span className="block text-small font-normal text-subtle">Existing agreement · carried in, not verified in Revivo Impact</span>}
                  </td>
                  <td className="pr-4">
                    <Chip kind="neutral">{r.type}</Chip>
                  </td>
                  <td className="pr-4 text-right">{r.n}</td>
                  <td className="pr-4 text-right">
                    <SeeSource name={`${r.fund} committed`}>{fmt(r.committed)}</SeeSource>
                  </td>
                  <td className="pr-4 text-right">
                    <SeeSource name={`${r.fund} released`}>{fmt(r.released)}</SeeSource>
                  </td>
                  <td className="pr-4 text-right">
                    {r.verified == null ? <span className="text-subtle">Being verified</span> : <SeeSource name={`${r.fund} verified`}>{fmt(r.verified)}</SeeSource>}
                  </td>
                  <td className="pr-4">
                    <MiniLine total={6} current={r.stage} label={r.stageLabel} />
                    <span className="block text-small text-subtle">{r.stageLabel}</span>
                  </td>
                  <td className="text-small text-muted">{r.next}</td>
                </tr>
              ))}
              <tr className="h-12 border-b border-line font-medium">
                <td className="sticky left-0 bg-canvas pr-4">Development total</td>
                <td />
                <td className="pr-4 text-right">{sum(dev.map((r) => r.n))}</td>
                <td className="pr-4 text-right">{fmt(sum(dev.map((r) => r.committed)))}</td>
                <td className="pr-4 text-right">{fmt(sum(dev.map((r) => r.released)))}</td>
                <td className="pr-4 text-right text-subtle">—</td>
                <td />
                <td className="text-small text-subtle">{moment === "jun30" ? "includes $12,000 carried in" : ""}</td>
              </tr>
              <tr className="h-12 font-medium">
                <td className="sticky left-0 bg-canvas pr-4">Programme total</td>
                <td />
                <td className="pr-4 text-right">3</td>
                <td className="pr-4 text-right">{fmt(145000)}</td>
                <td className="pr-4 text-right">{fmt(29000)}</td>
                <td className="pr-4 text-right text-subtle">—</td>
                <td />
                <td />
              </tr>
            </tbody>
          </table>
          <p className="mt-4 text-small text-subtle">
            Carried-in amounts came before the agreement joined Revivo Impact and are never counted as verified.
          </p>
          <a href={`#/app/amira/funding`} className="mt-4 inline-flex items-center gap-2 text-muted underline underline-offset-4 hover:text-ink">
            Example: Amira Haddad&rsquo;s scholarship award <ArrowRight className="size-4" aria-hidden="true" />
          </a>
        </div>
      ) : (
        <div className="mt-6 max-w-2xl text-muted">
          <p>
            {tab === "programmes"
              ? "Programmes (Play Every Day and two others) open their own chain: commitment, delivered sessions, spending, evidence, outcomes, review (screen 19, built in P3)."
              : "Reports draft only from verified records, pass a claims check, and label outputs, sporting outcomes and impact apart (screen 21, built in P3–P4)."}
          </p>
          <a href={`#/app/${persona.id}/${tab === "programmes" ? "s19" : "s21"}`} className={btn("secondary", "mt-4")}>
            See the design <ArrowRight className="size-4" aria-hidden="true" />
          </a>
        </div>
      )}
    </div>
  );
}
