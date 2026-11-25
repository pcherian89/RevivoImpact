import { useState, type ReactNode } from "react";
import { CalendarDays, ChevronDown, ClipboardList, FileStack, Footprints, House, LayoutGrid, Map, Moon, RotateCcw, Search, Sun, UserRound, UsersRound, Pause, Wallet, X, type LucideIcon } from "lucide-react";
import { useStore } from "../state/store";
import { ImpactLockup } from "../brand/RevivoLogo";
import { MOMENTS, PERSONAS, type Persona } from "../data/world";
import { NAV, JOURNEYS } from "../data/structure";
import { btn, cn, Label } from "./ui";

/** Top prototype bar (Pathway's shell): label, guide, Explore by role, demo date with Reset. */
export function PrototypeBar() {
  const { moment, setMoment, go, setGuideOpen, guideOpen, reset } = useStore();
  const [open, setOpen] = useState(false);
  const m = MOMENTS.find((x) => x.id === moment)!;
  return (
    <div data-ri-print-hide className="sticky top-0 z-40 border-b border-line bg-canvas">
      <div className="flex min-h-12 items-center justify-between gap-2 px-3 sm:px-4">
        <a href="#/start" className="label shrink-0 text-signal">
          <span className="hidden sm:inline">Revivo Impact · </span>Prototype
        </a>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setGuideOpen(!guideOpen)}
            className={btn("secondary", "min-h-9 px-3 font-sans text-small font-medium tracking-normal")}
            aria-expanded={guideOpen}
            aria-label="Guided journeys"
          >
            <Footprints className="size-4" aria-hidden="true" />
            <span className="hidden whitespace-nowrap lg:inline">Guided journeys</span>
          </button>
          <button
            type="button"
            onClick={() => go("roles")}
            aria-label="Explore by role"
            className={btn("secondary", "min-h-9 px-3 font-sans text-small font-medium tracking-normal")}
          >
            <LayoutGrid className="size-4" aria-hidden="true" />
            <span className="hidden whitespace-nowrap lg:inline">Explore by role</span>
          </button>
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-haspopup="menu"
              className={btn("secondary", "min-h-9 px-3 font-sans text-small font-medium tracking-normal")}
            >
              <CalendarDays className="size-4" aria-hidden="true" />
              <span className="hidden whitespace-nowrap sm:inline">Demo date: {m.label.replace(" 2027", "")}</span>
              <span className="whitespace-nowrap sm:hidden">{m.short}</span>
              <ChevronDown className="size-3.5" aria-hidden="true" />
            </button>
            {open && (
              <div role="menu" className="absolute right-0 mt-2 w-72 rounded-[10px] border border-line-strong bg-surface p-2 shadow-xl">
                <Label className="px-2 pt-1 pb-2">Demonstration date</Label>
                {MOMENTS.map((x) => (
                  <button
                    key={x.id}
                    role="menuitemradio"
                    aria-checked={x.id === moment}
                    type="button"
                    onClick={() => {
                      setMoment(x.id);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex w-full flex-col items-start rounded-[6px] px-3 py-2 text-left hover:bg-surface-2",
                      x.id === moment && "bg-surface-2",
                    )}
                  >
                    <span className="font-medium">{x.label}</span>
                    <span className="text-small text-subtle">{x.note}</span>
                  </button>
                ))}
                <div className="mt-2 border-t border-line pt-2">
                  <MotionItem />
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setOpen(false);
                      reset();
                    }}
                    className="flex w-full items-center gap-2 rounded-[6px] px-3 py-2 text-left text-muted hover:bg-surface-2 hover:text-ink"
                  >
                    <RotateCcw className="size-4" aria-hidden="true" /> Reset the demonstration
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Banner />
    </div>
  );
}

export function Banner() {
  return (
    <p className="border-t border-line bg-raised px-4 py-1.5 text-center text-small text-muted">
      <span className="font-medium text-ink">Demonstration on fictional data.</span> Every person, organisation, amount and
      record is invented, and no real money moves.
    </p>
  );
}

export function ThemeButtons({ withMotion = true }: { withMotion?: boolean }) {
  const { theme, toggleTheme, reducedMotion, toggleMotion } = useStore();
  return (
    <div className="flex items-center gap-2">
      {withMotion && (
        <span className="hidden lg:block">
          <button
            type="button"
            onClick={toggleMotion}
            aria-pressed={reducedMotion}
            className={btn("secondary", "min-h-10 px-3 font-sans text-small font-medium tracking-normal")}
          >
            <Pause className="size-4" aria-hidden="true" />
            <span className="sr-only 2xl:not-sr-only">Reduce motion</span>
          </button>
        </span>
      )}
      <button
        type="button"
        onClick={toggleTheme}
        aria-pressed={theme === "daylight"}
        className={btn("secondary", "min-h-10 px-3 font-sans text-small font-medium tracking-normal")}
      >
        {theme === "dark" ? <Sun className="size-4" aria-hidden="true" /> : <Moon className="size-4" aria-hidden="true" />}
        <span className="hidden sm:inline">{theme === "dark" ? "Daylight" : "Dark"}</span>
        <span className="sr-only sm:hidden">{theme === "dark" ? "Daylight theme" : "Dark theme"}</span>
      </button>
    </div>
  );
}

/** App header for a role workspace: lockup, workspace, role pill, nav (≤ 5; bottom bar on phones). */
export function AppFrame({ persona, active, children }: { persona: Persona; active: string; children: ReactNode }) {
  const { go } = useStore();
  const nav = NAV[persona.role];
  // Detail screens light up the menu item they belong to.
  const parent: Record<string, string> = { opportunity: "discover", profile: persona.role === "athlete" ? "discover" : "fdiscover", request: "fdiscover", s11: "s12", s15: "s12" };
  const on = (screen: string) => active === screen || parent[active] === screen;
  return (
    <div className="min-h-[calc(100vh-5rem)] pb-24 md:pb-10">
      <header className="border-b border-line bg-canvas">
        <div className="container-site flex min-h-16 flex-wrap items-center justify-between gap-x-3 gap-y-2 py-2 xl:flex-nowrap">
          <div className="flex min-w-0 shrink-0 items-center gap-4">
            <a href="#/start" aria-label="Revivo Impact start screen">
              <ImpactLockup />
            </a>
            <span className="hidden truncate font-display text-lg font-bold 2xl:inline">{workspaceName(persona)}</span>
          </div>
          <nav aria-label="Main" className="hidden md:order-last md:block md:w-full xl:order-none xl:w-auto">
            <ul className="flex items-center gap-1">
              {nav.map((n) => (
                <li key={n.label}>
                  <a
                    href={`#/app/${persona.id}/${n.screen}`}
                    aria-current={on(n.screen) ? "page" : undefined}
                    className={cn(
                      "inline-flex min-h-11 items-center rounded-full px-3.5 font-display text-base font-bold tracking-[0.03em]",
                      on(n.screen) ? "bg-surface-2 text-ink" : "text-subtle hover:text-ink",
                    )}
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => go("roles")}
              className={btn("secondary", "min-h-10 max-w-[13rem] px-3 font-sans text-small font-medium tracking-normal sm:max-w-[18rem]")}
            >
              <UserRound className="size-4 shrink-0 text-signal" aria-hidden="true" />
              <span className="truncate">
                <span className="hidden sm:inline">Viewing as </span>
                {persona.name.split(" ")[0]} · Change
              </span>
            </button>
            <ThemeButtons />
          </div>
        </div>
      </header>
      <main id="main" className="container-site">
        {children}
      </main>
      {nav.length > 1 && (
        <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-raised md:hidden" data-ri-print-hide>
          <ul className="grid" style={{ gridTemplateColumns: `repeat(${nav.length}, minmax(0,1fr))` }}>
            {nav.map((n) => (
              <li key={n.label}>
                <a
                  href={`#/app/${persona.id}/${n.screen}`}
                  aria-current={on(n.screen) ? "page" : undefined}
                  className={cn(
                    "flex min-h-16 flex-col items-center justify-center gap-1 px-0.5 text-center font-display text-[0.8125rem] leading-tight font-bold tracking-[0.02em] break-words hyphens-auto",
                    on(n.screen) ? "text-ink" : "text-subtle",
                  )}
                >
                  <NavIcon label={n.label} active={on(n.screen)} />
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}

/** Guide panel: journeys A–E as a rail; each step says who acts, when, and opens that screen. */
export function GuidePanel() {
  const { guideOpen, setGuideOpen, go, setMoment } = useStore();
  const [j, setJ] = useState("A");
  if (!guideOpen) return null;
  const journey = JOURNEYS.find((x) => x.id === j)!;
  return (
    <aside
      aria-label="Guided journeys"
      className="fixed inset-x-0 bottom-0 z-40 max-h-[70vh] overflow-y-auto border-t border-line-strong bg-surface p-5 md:top-[4.9rem] md:right-0 md:bottom-0 md:left-auto md:max-h-none md:w-[400px] md:border-t-0 md:border-l"
      data-ri-print-hide
    >
      <div className="flex items-center justify-between">
        <p className="label text-signal">
          Guided journeys <Map className="ml-1 inline size-3.5" aria-hidden="true" />
        </p>
        <button type="button" onClick={() => setGuideOpen(false)} className={btn("quiet", "min-h-9")} aria-label="Close the guide">
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
      <div className="mt-3 flex gap-1.5" role="tablist" aria-label="Journeys">
        {JOURNEYS.map((x) => (
          <button
            key={x.id}
            role="tab"
            aria-selected={x.id === j}
            type="button"
            onClick={() => setJ(x.id)}
            className={cn(
              "min-h-10 flex-1 rounded-full border font-display text-base font-bold",
              x.id === j ? "border-signal text-ink" : "border-line-strong text-subtle hover:text-ink",
            )}
          >
            {x.id}
          </button>
        ))}
      </div>
      <h2 className="text-subtitle mt-4">{journey.name}</h2>
      <p className="text-small text-subtle">
        {journey.minutes} · {journey.steps.length} steps
      </p>
      <ol className="mt-4 border-l border-line-strong">
        {journey.steps.map((s, i) => (
          <li key={s.title} className="relative pb-4 pl-5">
            <span aria-hidden="true" className="absolute top-1.5 -left-[5px] size-[9px] rounded-full border border-control bg-surface" />
            <button
              type="button"
              className="text-left"
              onClick={() => {
                setMoment(s.when as never);
                go(s.to);
                if (window.innerWidth < 768) setGuideOpen(false);
              }}
            >
              <span className="label text-subtle">
                Step {i + 1} · {MOMENTS.find((m) => m.id === s.when)!.short}
              </span>
              <span className="mt-0.5 block font-medium text-ink hover:text-signal">{s.title}</span>
              <span className="block text-small text-subtle">{s.who}</span>
              <span className="block text-small text-muted">{s.what}</span>
            </button>
          </li>
        ))}
      </ol>
      <p className="mt-2 border-t border-line pt-3 text-small text-subtle">
        P1 shell: each step opens its screen. &ldquo;Show me&rdquo; and &ldquo;I&rsquo;ll do it&rdquo;, with the &ldquo;What changed&rdquo;
        panel, arrive in P2–P3.
      </p>
    </aside>
  );
}

export function personaById(id: string) {
  return PERSONAS.find((p) => p.id === id);
}

function MotionItem() {
  const { reducedMotion, toggleMotion } = useStore();
  return (
    <button
      type="button"
      role="menuitemcheckbox"
      aria-checked={reducedMotion}
      onClick={toggleMotion}
      className="flex w-full items-center gap-2 rounded-[6px] px-3 py-2 text-left text-muted hover:bg-surface-2 hover:text-ink"
    >
      <Pause className="size-4" aria-hidden="true" /> Reduce motion: {reducedMotion ? "on" : "off"}
    </button>
  );
}

function workspaceName(p: Persona) {
  if (p.role === "athlete") return "Athlete";
  if (p.role === "guardian") return "Guardian";
  if (p.role === "individual") return "Individual sponsor";
  return p.org.split(" · ")[0];
}

const ICONS: Record<string, LucideIcon> = {
  Home: House,
  Overview: House,
  Today: House,
  Discover: Search,
  Applications: ClipboardList,
  Opportunities: FileStack,
  "My Funding": Wallet,
  Funding: Wallet,
  "Funding & Updates": Wallet,
  Sessions: ClipboardList,
  Profile: UserRound,
  Organisation: UsersRound,
  "My Athletes": UsersRound,
};
function NavIcon({ label, active }: { label: string; active: boolean }) {
  const I = ICONS[label] ?? House;
  return <I aria-hidden="true" className={cn("size-5", active && "text-signal")} />;
}
