import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { CalendarCheck, CalendarDays, CheckCircle2, ChevronDown, ChevronUp, CircleDot, ClipboardList, FileStack, Footprints, Hand, House, LayoutGrid, Map, Moon, Pause, RotateCcw, Search, Sparkles, ShieldCheck, Sun, UserRound, UsersRound, Wallet, Wand2, X, type LucideIcon } from "lucide-react";
import { useStore } from "../state/store";
import { ImpactLockup } from "../brand/RevivoLogo";
import { MOMENTS, type Person } from "../domain/model";
import { JOURNEYS } from "../domain/story";
import { identityOf, navFor } from "../data/structure";
import { btn, cn, Label } from "./ui";

/* ------------------------------------------------ prototype bar & banner */

export function PrototypeBar() {
  const { moment, setMoment, go, guide, setGuide, reset, ownEvents } = useStore();
  const [open, setOpen] = useState(false);
  const [sure, setSure] = useState(false);
  const [pending, setPending] = useState<(typeof MOMENTS)[number]["id"] | null>(null);
  const m = MOMENTS.find((x) => x.id === moment)!;
  const pill = "min-h-9 px-3 font-sans text-small font-medium tracking-normal";
  return (
    <div data-ri-print-hide className="sticky top-0 z-40 border-b border-line bg-canvas">
      <div className="flex min-h-12 items-center justify-between gap-2 px-3 sm:px-4">
        <a href="#/start" className="label inline-flex min-h-11 shrink-0 items-center text-signal">
          <span className="ri-guide-hide hidden sm:inline">Revivo Impact · </span>Prototype
        </a>
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Phones: one "Demo" menu holds the guide, roles, date and reset; wider screens show each button. */}
          <span className="hidden sm:contents">
          <button type="button" onClick={() => setGuide({ open: !guide.open })} className={btn("secondary", pill)} aria-expanded={guide.open} aria-label="Guided journeys">
            <Footprints className="size-4" aria-hidden="true" />
            <span className="hidden whitespace-nowrap sm:inline lg:hidden">Guide</span>
            <span className="ri-guide-hide hidden whitespace-nowrap lg:inline">{guide.open ? `Journey ${guide.journey} · step ${guide.step + 1}` : "Guided journeys"}</span>
            <span className="ri-guide-show hidden whitespace-nowrap">{`${guide.journey} · step ${guide.step + 1}`}</span>
          </button>
          <button type="button" onClick={() => go("roles")} aria-label="Explore by role" className={btn("secondary", pill)}>
            <LayoutGrid className="size-4" aria-hidden="true" />
            <span className="hidden whitespace-nowrap sm:inline lg:hidden">Roles</span>
            <span className="ri-guide-hide hidden whitespace-nowrap lg:inline">Explore by role</span>
            <span className="ri-guide-show hidden whitespace-nowrap">Roles</span>
          </button>
          </span>
          {!guide.open && (
            <button type="button" onClick={() => setGuide({ open: true })} aria-label="Guided journeys" className={btn("secondary", cn(pill, "px-2.5 sm:hidden"))}>
              <Footprints className="size-4" aria-hidden="true" />
            </button>
          )}
          <div className="relative">
            <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-haspopup="menu" className={btn("secondary", pill)}>
              <CalendarDays className="size-4" aria-hidden="true" />
              <span className="hidden whitespace-nowrap sm:inline">Demo date: {m.label.replace(" 2027", "")}</span>
              <span className="whitespace-nowrap sm:hidden">Demo · {m.short}</span>
              <ChevronDown className="size-3.5" aria-hidden="true" />
            </button>
            {open && (
              <div role="menu" className="absolute right-0 mt-2 w-72 rounded-[10px] border border-line-strong bg-surface p-2 shadow-xl">
                <div className="mb-2 border-b border-line pb-2 sm:hidden">
                  <button type="button" role="menuitem" onClick={() => (setOpen(false), setGuide({ open: true }))} className="flex w-full items-center gap-2 rounded-[6px] px-3 py-2 text-left hover:bg-surface-2">
                    <Footprints className="size-4" aria-hidden="true" /> Guided journeys
                  </button>
                  <button type="button" role="menuitem" onClick={() => (setOpen(false), go("roles"))} className="flex w-full items-center gap-2 rounded-[6px] px-3 py-2 text-left hover:bg-surface-2">
                    <LayoutGrid className="size-4" aria-hidden="true" /> Explore by role
                  </button>
                </div>
                <Label className="px-2 pt-1 pb-2">Demonstration date</Label>
                {ownEvents > 0 && !pending && <p className="px-2 pb-2 text-small text-muted">Choosing another date loads the story at that date and replaces what you have changed. It asks first.</p>}
                {pending && (
                  <div className="mx-1 mb-2 rounded-[8px] border border-line-strong p-3">
                    <p className="text-small">Move to {MOMENTS.find((x) => x.id === pending)!.label}? What you have changed in this demonstration will be replaced by the story at that date.</p>
                    <div className="mt-2 flex gap-2">
                      <button type="button" role="menuitem" onClick={() => (setMoment(pending), setPending(null), setOpen(false))} className={btn("primary", "min-h-10 px-4")}>Yes, move</button>
                      <button type="button" role="menuitem" onClick={() => setPending(null)} className={btn("quiet", "min-h-10 px-4")}>Stay here</button>
                    </div>
                  </div>
                )}
                {MOMENTS.map((x) => (
                  <button key={x.id} role="menuitemradio" aria-checked={x.id === moment} type="button" onClick={() => (x.id === moment ? setOpen(false) : ownEvents > 0 ? setPending(x.id) : (setMoment(x.id), setOpen(false)))} className={cn("flex w-full flex-col items-start rounded-[6px] px-3 py-2 text-left hover:bg-surface-2", x.id === moment && "bg-surface-2")}>
                    <span className="font-medium">{x.label}</span>
                    <span className="text-small text-subtle">{x.note}</span>
                  </button>
                ))}
                <div className="mt-2 border-t border-line pt-2">
                  <MotionItem />
                  {sure ? (
                    <div className="px-3 py-2">
                      <p className="text-small">Clear everything done in this demonstration and go back to the start?</p>
                      <div className="mt-2 flex gap-2">
                        <button type="button" role="menuitem" onClick={() => (setOpen(false), setSure(false), reset())} className={btn("primary", "min-h-10 px-4")}>Yes, reset</button>
                        <button type="button" role="menuitem" onClick={() => setSure(false)} className={btn("quiet", "min-h-10 px-4")}>Keep it</button>
                      </div>
                    </div>
                  ) : (
                    <button type="button" role="menuitem" onClick={() => setSure(true)} className="flex w-full items-center gap-2 rounded-[6px] px-3 py-2 text-left text-muted hover:bg-surface-2 hover:text-ink">
                      <RotateCcw className="size-4" aria-hidden="true" /> Reset the demonstration
                    </button>
                  )}
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
        <span className="ri-guide-hide hidden sm:inline">{theme === "dark" ? "Daylight" : "Dark"}</span>
      </button>
    </div>
  );
}

/* ------------------------------------------------------------ app frame */

const ManagingCtx = createContext<string | undefined>(undefined);
/** The athlete a guardian or coach is currently managing ("Managing: Tiago ▾"). */
export const useManaging = () => useContext(ManagingCtx);

const SHORT: Record<string, string> = { "Consent & safety": "Safety", "Funding & Updates": "Funding", "Audit & admin": "Admin", "My Athletes": "Athletes" };
const ICONS: Record<string, LucideIcon> = { Home: House, Overview: House, Today: House, Discover: Search, Applications: ClipboardList, "Asks & offers": ClipboardList, Opportunities: FileStack, "My Funding": Wallet, Funding: Wallet, "Funding & Updates": Wallet, Sessions: ClipboardList, Profile: UserRound, Organisation: UsersRound, "My Athletes": UsersRound, "Consent & safety": ShieldCheck, "Audit & admin": ShieldCheck, Programme: CalendarCheck };

export function AppFrame({ persona, active, children }: { persona: Person; active: string; children: ReactNode }) {
  const { go, world, route } = useStore();
  const nav = navFor(persona, world);
  const managed = persona.role === "guardian" ? Object.values(world.athletes).filter((a) => a.guardianId === persona.id) : persona.role === "coach" ? world.authorisations.filter((z) => z.coachId === persona.id).map((z) => world.athletes[z.athleteId]) : [];
  const key = `revivo-impact:managing:${persona.id}`;
  const [managing, setManagingState] = useState<string | undefined>(() => {
    try {
      const saved = sessionStorage.getItem(key);
      if (saved && managed.some((a) => a.id === saved)) return saved;
    } catch {
      /* ignore */
    }
    return managed[0]?.id;
  });
  const setManaging = (id: string) => {
    setManagingState(id);
    try {
      sessionStorage.setItem(key, id);
    } catch {
      /* ignore */
    }
  };
  // A link that names the athlete (an application opened "for" one of them) switches to that athlete everywhere.
  useEffect(() => {
    const f = new URLSearchParams(location.hash.split("?")[1] ?? "").get("for");
    if (f && f !== managing && managed.some((a) => a.id === f)) setManaging(f);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route]);
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
          <div className="container-site flex min-h-16 flex-wrap items-center justify-between gap-x-2 gap-y-2 py-2 sm:gap-x-3 xl:flex-nowrap">
            <div className="flex min-w-0 shrink-0 items-center gap-4">
              <a href="#/start" aria-label="Revivo Impact start screen" className="inline-flex min-h-11 items-center">
                <ImpactLockup />
              </a>
              <span className="hidden truncate font-display text-lg font-bold 2xl:inline">{workspace}</span>
            </div>
            <nav aria-label="Main" className="hidden md:order-last md:block md:w-full xl:order-none xl:w-auto">
              <ul className="flex flex-wrap items-center gap-1">
                {nav.map((n) => (
                  <li key={n.label}>
                    <a href={`#/app/${persona.id}/${n.screen}`} aria-current={on(n.screen) ? "page" : undefined} className={cn("inline-flex min-h-11 items-center rounded-full px-3.5 font-display text-base font-bold tracking-[0.03em] whitespace-nowrap", on(n.screen) ? "bg-surface-2 text-ink" : "text-subtle hover:text-ink")}>
                      {SHORT[n.label] ? (
                        <>
                          <span className="ri-guide-hide">{n.label}</span>
                          <span className="ri-guide-show hidden">{SHORT[n.label]}</span>
                        </>
                      ) : (
                        n.label
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="flex items-center gap-2">
              {managed.length > 0 && (
                <label className="flex items-center gap-2 text-small">
                  <span className="hidden text-subtle sm:inline">Athlete:</span>
                  <select aria-label="Athlete you are acting for" value={managing} onChange={(e) => setManaging(e.target.value)} className="h-10 max-w-[9rem] rounded-full border border-line-strong bg-raised px-3 font-medium text-ink">
                    {managed.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name.split(" ")[0]}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              <ThemeButtons withMotion={false} />
            </div>
          </div>
        </header>
        {/* Who you are looking at, on every screen: name, role and the organisation they act for. */}
        {(() => {
          const id = identityOf(persona, world);
          const athlete = managed.find((a) => a.id === managing);
          return (
            <div className="border-b border-line bg-raised">
              <div className="container-site flex min-h-11 flex-wrap items-center gap-x-3 gap-y-1 py-2 text-small">
                <UserRound className="size-4 shrink-0 text-signal" aria-hidden="true" />
                <p className="min-w-0 flex-1">
                  <span className="text-subtle">Viewing as </span>
                  <span className="font-medium text-ink">{id.name}</span>
                  <span className="text-muted">
                    {" "}· {id.role}
                    {id.org ? ` · ${id.org}` : ""}
                    {athlete && (persona.role === "coach" || persona.role === "guardian") ? ` · acting for ${athlete.name.split(" ")[0]}${athlete.minor ? ` (${athlete.age})` : ""}` : ""}
                  </span>
                </p>
                <button type="button" onClick={() => go("roles")} className="inline-flex min-h-11 items-center text-subtle underline underline-offset-4 hover:text-ink">
                  Change person
                </button>
              </div>
            </div>
          );
        })()}
        <Notice />
        <main id="main" className="container-site">
          {children}
        </main>
        {nav.length > 1 && (
          <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-raised md:hidden" data-ri-print-hide data-ri-bottom-nav>
            <ul className="grid" style={{ gridTemplateColumns: `repeat(${nav.length}, minmax(0,1fr))` }}>
              {nav.map((n) => {
                const I = ICONS[n.label] ?? House;
                return (
                  <li key={n.label}>
                    <a href={`#/app/${persona.id}/${n.screen}`} aria-current={on(n.screen) ? "page" : undefined} className={cn("flex min-h-16 flex-col items-center justify-center gap-1 px-0.5 text-center font-display text-[0.8125rem] leading-tight font-bold tracking-[0.02em] break-words hyphens-auto", on(n.screen) ? "text-ink" : "text-subtle")}>
                      <I aria-hidden="true" className={cn("size-5", on(n.screen) && "text-signal")} />
                      {/* Phones: a short label that fits one line; the full name stays for screen readers. */}
                      {SHORT[n.label] ? (
                        <>
                          <span aria-hidden="true">{SHORT[n.label]}</span>
                          <span className="sr-only">{n.label}</span>
                        </>
                      ) : (
                        n.label
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}
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

/** "What changed": the records the last action changed (docs/03 §6), shown inside the guide so nothing covers it. */
function WhatChanged() {
  const { changed } = useStore();
  if (!changed || changed.length === 0) return null;
  return (
    <div role="status" className="mt-3 rounded-[10px] border border-line p-3">
      <p className="label text-signal">What changed</p>
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
  const { guide, setGuide, go, showStep, loadStep, stepDone, moment, reset, world } = useStore();
  const [err, setErr] = useState<string | null>(null);
  // Below 1024px the guide is a sheet at the bottom. Opening a screen shrinks it to one line, so the screen is never
  // covered; "Show the step" brings it back. From 1024px it is a column beside the page, which narrows instead.
  const [mini, setMini] = useState(false);
  const sheet = useRef<HTMLElement>(null);
  useEffect(() => {
    setMini(false);
  }, [guide.step, guide.journey]);
  useEffect(() => {
    document.documentElement.classList.toggle("ri-guide-open", guide.open);
    return () => document.documentElement.classList.remove("ri-guide-open");
  }, [guide.open]);
  // The page keeps room at the bottom for the sheet, so its last lines can always be scrolled into view.
  useEffect(() => {
    const el = sheet.current;
    const root = document.documentElement;
    if (!el) return;
    // On phones the sheet sits just above the bottom menu, so the menu stays usable.
    const set = () => {
      const nav = document.querySelector("[data-ri-bottom-nav]")?.getBoundingClientRect().height ?? 0;
      el.style.bottom = window.innerWidth < 1024 ? `${nav}px` : "";
      root.style.setProperty("--ri-guide-h", `${el.offsetHeight}px`);
    };
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => {
      ro.disconnect();
      root.style.removeProperty("--ri-guide-h");
    };
  });
  if (!guide.open) return null;
  const journey = JOURNEYS.find((x) => x.id === guide.journey)!;
  const s = journey.steps[guide.step];
  const atDate = MOMENTS.find((m) => m.id === s.when)!;
  const sameDate = s.when === moment;
  const done = stepDone(s);
  // Earlier steps of the same date that have not happened yet: load the story so this step makes sense.
  const prevPending = journey.steps.slice(0, guide.step).some((x) => x.when === s.when && x.cmds.length > 0 && !x.phase && !stepDone(x));
  const skipped = journey.steps.slice(0, guide.step).some((x) => x.cmds.length > 0 && !x.phase && !stepDone(x));
  // A step whose screen is a public page (Join) opens it directly; every other step opens as its person.
  // A public page (Join) that has just been done shows the person's new Home instead of an empty form.
  const open = (after = false) => {
    go(s.to.startsWith("/") ? (after || done ? `app/${s.as}/home` : s.to.slice(1)) : `app/${s.as}/${(after || done) && s.after ? s.after : s.to}`);
    if (window.innerWidth < 1024) setMini(true);
  };
  const next = () => {
    setErr(null);
    if (guide.step < journey.steps.length - 1) setGuide({ step: guide.step + 1 });
  };
  if (mini)
    return (
      <aside ref={sheet} aria-label="Guided journeys" className="fixed inset-x-0 bottom-0 z-40 border-t border-line-strong bg-surface px-4 py-3 shadow-2xl lg:inset-x-auto lg:top-0 lg:right-0 lg:w-[380px] lg:border-t-0 lg:border-l lg:shadow-none" data-ri-print-hide>
        <div className="flex items-center gap-3">
          <p className="min-w-0 flex-1 text-small">
            <span className="label block text-signal">
              {journey.id} · step {guide.step + 1}/{journey.steps.length}{done ? " · done" : ""}
            </span>
            <span className="line-clamp-2 block font-medium">{s.title}</span>
          </p>
          <button type="button" className={btn("secondary", "shrink-0")} onClick={() => setMini(false)} aria-label="Show the step's details">
            <ChevronUp className="size-4" aria-hidden="true" /> Details
          </button>
          {guide.step < journey.steps.length - 1 && (
            <button type="button" className={btn("primary", "shrink-0")} onClick={next}>
              Next
            </button>
          )}
        </div>
      </aside>
    );
  return (
    <aside ref={sheet} aria-label="Guided journeys" className="fixed inset-x-0 bottom-0 z-40 max-h-[50vh] overflow-y-auto border-t border-line-strong bg-surface p-5 shadow-2xl lg:top-0 lg:right-0 lg:left-auto lg:max-h-none lg:w-[380px] lg:border-t-0 lg:border-l lg:shadow-none" data-ri-print-hide>
      <div className="flex items-center justify-between">
        <p className="label text-signal">
          Guided journeys <Map className="ml-1 inline size-3.5" aria-hidden="true" />
        </p>
        <span className="flex gap-1">
          <button type="button" onClick={() => setMini(true)} className={btn("quiet", "min-h-11 lg:hidden")} aria-label="Make the guide smaller">
            <ChevronDown className="size-4" aria-hidden="true" />
          </button>
          <button type="button" onClick={() => setGuide({ open: false })} className={btn("quiet", "min-h-11")} aria-label="Close the guide">
            <X className="size-4" aria-hidden="true" />
          </button>
        </span>
      </div>
      <div className="mt-3 flex gap-1" role="tablist" aria-label="Journeys">
        {JOURNEYS.map((x) => (
          <button key={x.id} role="tab" aria-selected={x.id === guide.journey} type="button" onClick={() => (setErr(null), setGuide({ journey: x.id, step: 0 }))} className={cn("min-h-11 flex-1 rounded-[8px] border px-1 py-1 leading-tight", x.id === guide.journey ? "border-signal text-ink" : "border-line-strong text-subtle hover:text-ink")}>
            <span className="block font-display text-base font-bold">{x.id}</span>
            <span className="block text-[11px]">{x.short}</span>
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

      {guide.step === 0 && <p className="mt-4 hidden text-small text-muted md:block">{journey.intro}</p>}
      <div className="mt-5 rounded-[10px] border border-line-strong p-4">
        <p className="label text-subtle">
          {atDate.label} {s.phase && "· coming in the next build"}
        </p>
        <h3 className="mt-1 font-display text-xl font-bold">{s.title}</h3>
        {(() => { const p = world.people[s.as]; const id = p ? identityOf(p, world) : null; return (
          <p className="mt-2 flex gap-2 text-small">
            <UserRound className="mt-0.5 size-4 shrink-0 text-subtle" aria-hidden="true" />
            <span><span className="text-subtle">{done ? "Shown on the screen of " : "Opens the screen of "}</span><span className="font-medium">{id ? id.name : s.who}</span>{id && <span className="text-muted"> · {id.role}{id.org ? ` · ${id.org}` : ""}</span>}
            {/→|\bthen\b/.test(s.who) ? <span className="block text-subtle">People in this step: {s.who}.{!done && s.cmds.length ? " To do it yourself, use Change person for each of them in turn." : ""}</span> : null}</span>
          </p>); })()}
        <p className="mt-3">{s.what}</p>
        {s.ai && (
          <p className="mt-3 flex gap-2 text-small text-muted">
            <Sparkles className="mt-0.5 size-4 shrink-0 text-steel" aria-hidden="true" />
            <span>
              <span className="font-medium text-ink">Where Simulated AI helps: </span>
              {s.ai}
            </span>
          </p>
        )}
        {done && (
          <p className="mt-3 flex items-center gap-2 text-small text-signal">
            <CheckCircle2 className="size-4" aria-hidden="true" /> Done.
          </p>
        )}
        {done && <WhatChanged />}
        <div className="mt-4 flex flex-wrap gap-2">
          {!done && (!sameDate || prevPending) ? (
            <span className="block w-full">
              <button type="button" className={btn("primary")} onClick={() => (loadStep(journey.id, guide.step), open(), setErr(null))}>
                {sameDate ? "Fill in the earlier steps and continue" : `Move to ${atDate.short} and continue`}
              </button>
              {skipped && <span className="mt-2 block text-small text-subtle">Earlier steps you have not done are filled in for you.</span>}
            </span>
          ) : s.cmds.length && !done && !s.phase ? (
            <>
              <button
                type="button"
                className={btn("primary")}
                onClick={() => {
                  const e = showStep(journey.id, guide.step);
                  setErr(e);
                  if (!e) open(true);
                }}
              >
                <Wand2 className="size-4" aria-hidden="true" /> Show me
              </button>
              <button type="button" className={btn("secondary")} onClick={() => open()}>
                <Hand className="size-4" aria-hidden="true" /> I&rsquo;ll do it
              </button>
            </>
          ) : (
            <>
              {/* A "look" step has nothing to do, so "Show me" simply opens the screen as that person. */}
              <button type="button" className={btn(!s.cmds.length && !done ? "primary" : "secondary")} onClick={() => open()} data-look="">
                {s.cmds.length ? (
                  <>
                    <CircleDot className="size-4" aria-hidden="true" /> See the screen
                  </>
                ) : (
                  <>
                    <Wand2 className="size-4" aria-hidden="true" /> Show me
                  </>
                )}
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
        {guide.step === 0 && <p className="mt-3 text-small text-subtle">&ldquo;Show me&rdquo;: we do this step for you, using the same rules as a click. &ldquo;I&rsquo;ll do it&rdquo;: you click through it yourself.</p>}
      </div>
      {/* On phones the step comes first, so the sheet shows what to do without scrolling. */}
      {guide.step === 0 && <p className="mt-4 text-small text-muted md:hidden">{journey.intro}</p>}

      {guide.step === journey.steps.length - 1 && (done || !s.cmds.length) && (
        <div className="mt-5 border-l-2 border-signal pl-4">
          <p className="label text-signal">What you just saw</p>
          <ul className="mt-2 space-y-1.5 text-small">
            {journey.outro.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
          {journey.id !== "E" && (
            <button type="button" className={btn("primary")} onClick={() => { const nid = JOURNEYS[JOURNEYS.findIndex((j) => j.id === journey.id) + 1].id; loadStep(nid, 0); setGuide({ journey: nid, step: 0 }); }}>
              Next: journey {JOURNEYS[JOURNEYS.findIndex((j) => j.id === journey.id) + 1].id}
            </button>
          )}
            <button type="button" className={btn(journey.id === "E" ? "primary" : "secondary")} onClick={() => (reset(), setGuide({ open: true, journey: "A", step: 0 }))}>
              Start again
            </button>
            <button type="button" className={btn("quiet")} onClick={() => (setGuide({ open: false }), go("start"))}>
              Back to the start page
            </button>
          </div>
          <p className="mt-2 text-small text-subtle">&ldquo;Start again&rdquo; clears everything done in this demonstration.</p>
        </div>
      )}

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
