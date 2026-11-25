import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { CalendarCheck, CalendarDays, CheckCircle2, ChevronDown, CircleDot, ClipboardList, FileStack, Footprints, Hand, House, LayoutGrid, Map, Moon, Pause, RotateCcw, Search, ShieldCheck, Sun, UserRound, UsersRound, Wallet, Wand2, X, type LucideIcon } from "lucide-react";
import { useStore } from "../state/store";
import { ImpactLockup } from "../brand/RevivoLogo";
import { MOMENTS, type Person } from "../domain/model";
import { JOURNEYS } from "../domain/story";
import { navFor } from "../data/structure";
import { btn, cn, Label } from "./ui";

/* ------------------------------------------------ prototype bar & banner */

export function PrototypeBar() {
  const { moment, setMoment, go, guide, setGuide, reset, ownEvents } = useStore();
  const [open, setOpen] = useState(false);
  const m = MOMENTS.find((x) => x.id === moment)!;
  const pill = "min-h-9 px-3 font-sans text-small font-medium tracking-normal";
  return (
    <div data-ri-print-hide className="sticky top-0 z-40 border-b border-line bg-canvas">
      <div className="flex min-h-12 items-center justify-between gap-2 px-3 sm:px-4">
        <a href="#/start" className="label shrink-0 text-signal">
          <span className="hidden sm:inline">Revivo Impact · </span>Prototype
        </a>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button type="button" onClick={() => setGuide({ open: !guide.open })} className={btn("secondary", pill)} aria-expanded={guide.open} aria-label="Guided journeys">
            <Footprints className="size-4" aria-hidden="true" />
            <span className="hidden whitespace-nowrap lg:inline">{guide.open ? `Journey ${guide.journey} · step ${guide.step + 1}` : "Guided journeys"}</span>
          </button>
          <button type="button" onClick={() => go("roles")} aria-label="Explore by role" className={btn("secondary", pill)}>
            <LayoutGrid className="size-4" aria-hidden="true" />
            <span className="hidden whitespace-nowrap lg:inline">Explore by role</span>
          </button>
          <div className="relative">
            <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-haspopup="menu" className={btn("secondary", pill)}>
              <CalendarDays className="size-4" aria-hidden="true" />
              <span className="hidden whitespace-nowrap sm:inline">Demo date: {m.label.replace(" 2027", "")}</span>
              <span className="whitespace-nowrap sm:hidden">{m.short}</span>
              <ChevronDown className="size-3.5" aria-hidden="true" />
            </button>
            {open && (
              <div role="menu" className="absolute right-0 mt-2 w-72 rounded-[10px] border border-line-strong bg-surface p-2 shadow-xl">
                <Label className="px-2 pt-1 pb-2">Demonstration date</Label>
                {ownEvents > 0 && <p className="px-2 pb-2 text-small text-amber">Choosing another date loads the story at that date and replaces what you have changed.</p>}
                {MOMENTS.map((x) => (
                  <button key={x.id} role="menuitemradio" aria-checked={x.id === moment} type="button" onClick={() => (setMoment(x.id), setOpen(false))} className={cn("flex w-full flex-col items-start rounded-[6px] px-3 py-2 text-left hover:bg-surface-2", x.id === moment && "bg-surface-2")}>
                    <span className="font-medium">{x.label}</span>
                    <span className="text-small text-subtle">{x.note}</span>
                  </button>
                ))}
                <div className="mt-2 border-t border-line pt-2">
                  <MotionItem />
                  <button type="button" role="menuitem" onClick={() => (setOpen(false), reset())} className="flex w-full items-center gap-2 rounded-[6px] px-3 py-2 text-left text-muted hover:bg-surface-2 hover:text-ink">
                    <RotateCcw className="size-4" aria-hidden="true" /> Reset the demonstration
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Banner() {
  return (
    <p data-ri-banner className="border-b border-line bg-raised px-4 py-1.5 text-center text-[12px] leading-snug text-muted sm:text-small">
      <span className="font-medium text-ink">Demonstration on fictional data.</span> Every person, organisation, amount and record is invented, and no real money moves.
    </p>
  );
}

function MotionItem() {
  const { reducedMotion, toggleMotion } = useStore();
  return (
    <button type="button" role="menuitemcheckbox" aria-checked={reducedMotion} onClick={toggleMotion} className="flex w-full items-center gap-2 rounded-[6px] px-3 py-2 text-left text-muted hover:bg-surface-2 hover:text-ink">
      <Pause className="size-4" aria-hidden="true" /> Reduce motion: {reducedMotion ? "on" : "off"}
    </button>
  );
}

export function ThemeButtons({ withMotion = true }: { withMotion?: boolean }) {
  const { theme, toggleTheme, reducedMotion, toggleMotion } = useStore();
  return (
    <div className="flex items-center gap-2">
      {withMotion && (
        <span className="hidden lg:block">
          <button type="button" onClick={toggleMotion} aria-pressed={reducedMotion} aria-label="Reduce motion" className={btn("secondary", "min-h-10 px-3 font-sans text-small font-medium tracking-normal")}>
            <Pause className="size-4" aria-hidden="true" />
            <span className="sr-only 2xl:not-sr-only">Reduce motion</span>
          </button>
        </span>
      )}
      <button type="button" onClick={toggleTheme} aria-pressed={theme === "daylight"} aria-label={theme === "dark" ? "Daylight theme" : "Dark theme"} className={btn("secondary", "min-h-10 px-3 font-sans text-small font-medium tracking-normal")}>
        {theme === "dark" ? <Sun className="size-4" aria-hidden="true" /> : <Moon className="size-4" aria-hidden="true" />}
        <span className="hidden sm:inline">{theme === "dark" ? "Daylight" : "Dark"}</span>
      </button>
    </div>
  );
}

/* ------------------------------------------------------------ app frame */

const ManagingCtx = createContext<string | undefined>(undefined);
/** The athlete a guardian or coach is currently managing ("Managing: Tiago ▾"). */
export const useManaging = () => useContext(ManagingCtx);

const ICONS: Record<string, LucideIcon> = { Home: House, Overview: House, Today: House, Discover: Search, Applications: ClipboardList, "Asks & offers": ClipboardList, Opportunities: FileStack, "My Funding": Wallet, Funding: Wallet, "Funding & Updates": Wallet, Sessions: ClipboardList, Profile: UserRound, Organisation: UsersRound, "My Athletes": UsersRound, "Consent & safety": ShieldCheck, "Audit & admin": ShieldCheck, Programme: CalendarCheck };

export function AppFrame({ persona, active, children }: { persona: Person; active: string; children: ReactNode }) {
  const { go, world } = useStore();
  const nav = navFor(persona, world);
  const managed = persona.role === "guardian" ? Object.values(world.athletes).filter((a) => a.guardianId === persona.id) : persona.role === "coach" ? world.authorisations.filter((z) => z.coachId === persona.id).map((z) => world.athletes[z.athleteId]) : [];
  const [managing, setManaging] = useState<string | undefined>(managed[0]?.id);
  useEffect(() => {
    if (managed.length && !managed.some((a) => a.id === managing)) setManaging(managed[0].id);
  }, [managed, managing]);
  const parent: Record<string, string> = { opportunity: "discover", profile: "discover", apply: "applications", publish: "funding", request: "fdiscover", athlete: "fdiscover", review: "apps", selection: "apps", agreement: persona.funderId ? "portfolio" : "funding", update: "funding", report: persona.funderId ? "portfolio" : "funding" };
  const on = (screen: string) => active === screen || parent[active] === screen;
  const workspace = persona.role === "athlete" ? "Athlete" : persona.role === "guardian" ? "Guardian" : persona.role === "individual" ? "Individual sponsor" : persona.role === "admin" ? "Platform" : (world.orgs[persona.orgId ?? ""]?.name ?? world.funders[persona.funderId ?? ""]?.name ?? "");
  return (
    <ManagingCtx.Provider value={managing}>
      <div className="min-h-[calc(100vh-5rem)] pb-24 md:pb-10">
        <header className="border-b border-line bg-canvas">
          <div className="container-site flex min-h-16 flex-wrap items-center justify-between gap-x-3 gap-y-2 py-2 xl:flex-nowrap">
            <div className="flex min-w-0 shrink-0 items-center gap-4">
              <a href="#/start" aria-label="Revivo Impact start screen">
                <ImpactLockup />
              </a>
              <span className="hidden truncate font-display text-lg font-bold 2xl:inline">{workspace}</span>
            </div>
            <nav aria-label="Main" className="hidden md:order-last md:block md:w-full xl:order-none xl:w-auto">
              <ul className="flex items-center gap-1">
                {nav.map((n) => (
                  <li key={n.label}>
                    <a href={`#/app/${persona.id}/${n.screen}`} aria-current={on(n.screen) ? "page" : undefined} className={cn("inline-flex min-h-11 items-center rounded-full px-3.5 font-display text-base font-bold tracking-[0.03em]", on(n.screen) ? "bg-surface-2 text-ink" : "text-subtle hover:text-ink")}>
                      {n.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="flex items-center gap-2">
              {managed.length > 0 && (
                <label className="flex items-center gap-2 text-small">
                  <span className="hidden text-subtle sm:inline">Managing</span>
                  <select aria-label="Athlete you are managing" value={managing} onChange={(e) => setManaging(e.target.value)} className="h-10 max-w-[9rem] rounded-full border border-line-strong bg-raised px-3 font-medium text-ink">
                    {managed.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name.split(" ")[0]}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              <button type="button" onClick={() => go("roles")} className={btn("secondary", "min-h-10 max-w-[13rem] px-3 font-sans text-small font-medium tracking-normal sm:max-w-[18rem]")}>
                <UserRound className="size-4 shrink-0 text-signal" aria-hidden="true" />
                <span className="truncate">
                  <span className="hidden sm:inline">Viewing as </span>
                  {persona.name.split(" ")[0]}
                  <span className="hidden sm:inline"> · Change</span>
                  <span className="sr-only sm:hidden"> (change person)</span>
                </span>
              </button>
              <ThemeButtons withMotion={false} />
            </div>
          </div>
        </header>
        <Notice />
        <main id="main" className="container-site">
          {children}
        </main>
        {nav.length > 1 && (
          <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-raised md:hidden" data-ri-print-hide>
            <ul className="grid" style={{ gridTemplateColumns: `repeat(${nav.length}, minmax(0,1fr))` }}>
              {nav.map((n) => {
                const I = ICONS[n.label] ?? House;
                return (
                  <li key={n.label}>
                    <a href={`#/app/${persona.id}/${n.screen}`} aria-current={on(n.screen) ? "page" : undefined} className={cn("flex min-h-16 flex-col items-center justify-center gap-1 px-0.5 text-center font-display text-[0.8125rem] leading-tight font-bold tracking-[0.02em] break-words hyphens-auto", on(n.screen) ? "text-ink" : "text-subtle")}>
                      <I aria-hidden="true" className={cn("size-5", on(n.screen) && "text-signal")} />
                      {n.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}
        <WhatChanged />
      </div>
    </ManagingCtx.Provider>
  );
}

/** A short confirmation after an action that moves you to another screen (for example "Spending added"). */
function Notice() {
  const { notice } = useStore();
  if (!notice) return null;
  return (
    <div role="status" className="container-site mt-4">
      <p className="flex items-center gap-2 border-l-2 border-signal py-1 pl-3 font-medium">
        <CheckCircle2 className="size-4 shrink-0 text-ok" aria-hidden="true" /> {notice}
      </p>
    </div>
  );
}

/** "What changed": the records the last action changed (docs/03 §6). */
function WhatChanged() {
  const { changed, clearChanged, guide } = useStore();
  // Guided mode only (docs/03 P3 panel): in normal use each action's own message confirms it, and nothing covers the page.
  if (!guide.open || !changed || changed.length === 0) return null;
  return (
    <div role="status" className="fixed right-3 bottom-20 z-40 w-[min(26rem,calc(100vw-1.5rem))] rounded-[10px] border border-line-strong bg-surface p-4 shadow-2xl md:right-6 md:bottom-6" data-ri-print-hide>
      <div className="flex items-start justify-between gap-3">
        <p className="label text-signal">What changed</p>
        <button type="button" onClick={clearChanged} aria-label="Close what changed" className="rounded-full p-1 text-subtle hover:text-ink">
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
      <ul className="mt-2 space-y-1.5 text-small">
        {changed.slice(-6).map((c, i) => (
          <li key={i} className="flex gap-2">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-signal" aria-hidden="true" />
            <span>
              <span className="text-ink">{c.action}</span> <span className="text-subtle">· {c.record} · {c.actor}</span>
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-small text-subtle">Every screen reads the same records, so the other side sees this change too.</p>
    </div>
  );
}

/* ------------------------------------------------------------ guide panel */

export function GuidePanel() {
  const { guide, setGuide, go, showStep, loadStep, stepDone, moment } = useStore();
  const [err, setErr] = useState<string | null>(null);
  if (!guide.open) return null;
  const journey = JOURNEYS.find((x) => x.id === guide.journey)!;
  const s = journey.steps[guide.step];
  const atDate = MOMENTS.find((m) => m.id === s.when)!;
  const sameDate = s.when === moment;
  const done = stepDone(s);
  // Earlier steps of the same date that have not happened yet: load the story so this step makes sense.
  const prevPending = journey.steps.slice(0, guide.step).some((x) => x.when === s.when && x.cmds.length > 0 && !x.phase && !stepDone(x));
  // A step whose screen is a public page (Join) opens it directly; every other step opens as its person.
  const open = () => go(s.to.startsWith("/") ? s.to.slice(1) : `app/${s.as}/${s.to}`);
  const next = () => {
    setErr(null);
    if (guide.step < journey.steps.length - 1) setGuide({ step: guide.step + 1 });
  };
  return (
    <aside aria-label="Guided journeys" className="fixed inset-x-0 bottom-0 z-40 max-h-[72vh] overflow-y-auto border-t border-line-strong bg-surface p-5 md:top-[4.9rem] md:right-0 md:bottom-0 md:left-auto md:max-h-none md:w-[400px] md:border-t-0 md:border-l" data-ri-print-hide>
      <div className="flex items-center justify-between">
        <p className="label text-signal">
          Guided journeys <Map className="ml-1 inline size-3.5" aria-hidden="true" />
        </p>
        <button type="button" onClick={() => setGuide({ open: false })} className={btn("quiet", "min-h-9")} aria-label="Close the guide">
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
      <div className="mt-3 flex gap-1.5" role="tablist" aria-label="Journeys">
        {JOURNEYS.map((x) => (
          <button key={x.id} role="tab" aria-selected={x.id === guide.journey} type="button" onClick={() => (setErr(null), setGuide({ journey: x.id, step: 0 }))} className={cn("min-h-10 flex-1 rounded-full border font-display text-base font-bold", x.id === guide.journey ? "border-signal text-ink" : "border-line-strong text-subtle hover:text-ink")}>
            {x.id}
          </button>
        ))}
      </div>
      <h2 className="text-subtitle mt-4">{journey.name}</h2>
      <p className="text-small text-subtle">
        {journey.minutes} · step {guide.step + 1} of {journey.steps.length}
      </p>
      <div className="mt-2 flex gap-1" aria-hidden="true">
        {journey.steps.map((_, i) => (
          <span key={i} className={cn("h-1.5 flex-1 rounded-full", i < guide.step ? "bg-passed" : i === guide.step ? "bg-signal" : "bg-line-strong")} />
        ))}
      </div>

      <div className="mt-5 rounded-[10px] border border-line-strong p-4">
        <p className="label text-subtle">
          {atDate.label} {s.phase && "· coming in the next build"}
        </p>
        <h3 className="mt-1 font-display text-xl font-bold">{s.title}</h3>
        <p className="mt-1 text-small text-muted">You are now: {s.who}</p>
        <p className="mt-3">{s.what}</p>
        {done && (
          <p className="mt-3 flex items-center gap-2 text-small text-signal">
            <CheckCircle2 className="size-4" aria-hidden="true" /> Done. See &ldquo;What changed&rdquo;.
          </p>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          {!done && (!sameDate || prevPending) ? (
            <button type="button" className={btn("primary")} onClick={() => (loadStep(journey.id, guide.step), open(), setErr(null))}>
              Load the story to this step
            </button>
          ) : s.cmds.length && !done && !s.phase ? (
            <>
              <button
                type="button"
                className={btn("primary")}
                onClick={() => {
                  const e = showStep(journey.id, guide.step);
                  setErr(e);
                  if (!e) open();
                }}
              >
                <Wand2 className="size-4" aria-hidden="true" /> Show me
              </button>
              <button type="button" className={btn("secondary")} onClick={open}>
                <Hand className="size-4" aria-hidden="true" /> I&rsquo;ll do it
              </button>
            </>
          ) : (
            <>
              <button type="button" className={btn(done || !s.cmds.length ? "secondary" : "primary")} onClick={open}>
                <CircleDot className="size-4" aria-hidden="true" /> Open this screen
              </button>
              {guide.step < journey.steps.length - 1 && (
                <button type="button" className={btn("primary")} onClick={next}>
                  Next step
                </button>
              )}
            </>
          )}
        </div>
        {err && <p role="alert" className="mt-3 text-small text-amber">{err}</p>}
        <p className="mt-3 text-small text-subtle">&ldquo;Show me&rdquo; acts through the same rules as a click. &ldquo;I&rsquo;ll do it&rdquo; opens the screen; the step is marked done when the record exists.</p>
      </div>

      <ol className="mt-5 border-l border-line-strong">
        {journey.steps.map((x, i) => (
          <li key={x.title} className="relative pb-3 pl-5">
            <span aria-hidden="true" className={cn("absolute top-1.5 -left-[5px] size-[9px] rounded-full border", stepDone(x) ? "border-passed bg-passed" : i === guide.step ? "border-signal bg-signal" : "border-control bg-surface")} />
            <button type="button" className="text-left" onClick={() => (setErr(null), setGuide({ step: i }))}>
              <span className="label text-subtle">
                Step {i + 1} · {MOMENTS.find((m) => m.id === x.when)!.short}
                {x.phase ? " · next build" : ""}
              </span>
              <span className={cn("mt-0.5 block font-medium hover:text-signal", i === guide.step ? "text-ink" : "text-muted")}>{x.title}</span>
            </button>
          </li>
        ))}
      </ol>
    </aside>
  );
}
