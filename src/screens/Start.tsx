import { ArrowRight, Footprints, HandCoins, LayoutGrid, Search, ShieldCheck, Sparkles, UsersRound } from "lucide-react";
import { useStore } from "../state/store";
import { ImpactLockup } from "../brand/RevivoLogo";
import { pulseSegment, SIGNAL } from "../brand/signal";
import { ThemeButtons } from "../components/Shell";
import { btn, Chip, ImageSlot, Label } from "../components/ui";
import type { Person } from "../domain/model";

function Pulse() {
  const y = 22;
  const d = `M 0 ${y} H ${180 - 34}` + pulseSegment(180, y, 0.9) + ` H 360`;
  return (
    <svg viewBox="0 0 360 44" className="h-11 w-full max-w-[22rem]" aria-hidden="true">
      <defs>
        <linearGradient id="pf" x1="0" x2="1">
          <stop offset="0" stopColor="var(--ri-signal)" stopOpacity="0" />
          <stop offset="0.35" stopColor="var(--ri-signal)" stopOpacity="0.7" />
          <stop offset="0.65" stopColor="var(--ri-signal)" stopOpacity="0.7" />
          <stop offset="1" stopColor="var(--ri-signal)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={d} fill="none" stroke="url(#pf)" strokeWidth={SIGNAL.width} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const STEPS = [
  { t: "Discover", d: "Athletes and organisations find funding and sponsors; funders find athletes, teams and initiatives." },
  { t: "Apply or connect", d: "One reusable profile for applications, nominations, structured requests and offers." },
  { t: "Fund", d: "People decide, a second person approves; commitments and payments are recorded separately." },
  { t: "Track", d: "Payments confirmed received, spending checked, sporting progress and deliverables recorded." },
  { t: "Review", d: "A person reviews each funding relationship: continue, add conditions, pause or renew." },
];

export function Start() {
  const { go, setGuide, loadStep, world } = useStore();
  const PERSONAS = Object.values(world.people).filter((p) => p.persona);
  const startGuide = () => {
    loadStep("A", 0);
    setGuide({ open: true, journey: "A", step: 0 });
    go("app/ingrid/overview");
  };
  return (
    <main id="main" className="container-site pb-20">
      <div className="flex items-center justify-between py-6">
        <ImpactLockup size="lg" />
        <ThemeButtons withMotion={false} />
      </div>

      <div className="grid gap-10 pt-4 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pt-8">
        <section aria-labelledby="hero">
          <p className="label text-muted">Sports Funding &amp; Sponsorship Platform</p>
          <div className="mt-3">
            <Pulse />
          </div>
          <h1 id="hero" className="text-hero mt-6 max-w-[12ch]">
            Connecting sport with opportunity.
          </h1>
          <p className="text-lead mt-5 max-w-[36rem] text-muted">
            Find funding. Support sporting talent. See how your support is used.
          </p>
          <p className="mt-4 max-w-[36rem] text-muted">
            If you need funding for sport, Revivo Impact helps you find it. If you want to fund sport, it helps you find
            credible athletes, teams and initiatives, and understand how your support is being used. People make every
            decision.
          </p>
          <ImageSlot file="im-01-landing.png" className="mt-8 hidden w-full max-w-[40rem] sm:block" caption="A coach and a team talk on a stadium track at sunset" />

        </section>

        <section aria-labelledby="choose">
          <p id="choose" className="label text-subtle">
            Choose how to explore
          </p>
          <div className="mt-4 rounded-[10px] border border-line-strong p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <Footprints className="size-7 text-signal" aria-hidden="true" />
              <span className="label text-subtle">Recommended</span>
            </div>
            <h2 className="text-subtitle mt-4">Guided journeys</h2>
            <p className="mt-2 text-muted">
              Follow Amira, 19, a judo athlete who has never heard of Tallwater Sports Foundation. She joins, discovers five
              opportunities from five organisations, applies, is selected, and reports how the money is used. Thirteen
              steps, about ten minutes.
            </p>
            <ul className="mt-4 space-y-2 text-small text-muted">
              <li className="flex gap-2">
                <UsersRound className="mt-0.5 size-4 shrink-0 text-subtle" aria-hidden="true" />A guide opens each person&rsquo;s real
                screen and explains every step.
              </li>
              <li className="flex gap-2">
                <Sparkles className="mt-0.5 size-4 shrink-0 text-subtle" aria-hidden="true" />
                Then: two-way discovery and sponsorship · programme funding · existing funding · coach, guardian and
                safeguarding.
              </li>
            </ul>
            <button type="button" onClick={startGuide} className={btn("primary", "mt-6 w-full sm:w-auto")}>
              Start the guided journey <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-5 rounded-[10px] border border-line-strong p-5 sm:p-6">
            <LayoutGrid className="size-7 text-muted" aria-hidden="true" />
            <h2 className="text-subtitle mt-4">Explore the platform</h2>
            <p className="mt-2 text-muted">Go straight to any side of sports funding.</p>
            <div className="relative mt-5 grid grid-cols-[18px_1fr] gap-x-4">
              {/* A short Funding Line joins the two sides (docs/04 §5.3) */}
              <span aria-hidden="true" className="relative row-span-2 flex flex-col items-center py-6">
                <span className="size-[10px] rounded-full border-[1.75px] border-ink bg-canvas" />
                <span className="w-[1.75px] flex-1 bg-track" />
                <span className="size-[10px] rounded-full bg-ink" />
              </span>
              <button type="button" onClick={() => go("roles")} className="group border-b border-line py-4 text-left">
                <span className="flex items-center gap-2 font-display text-xl font-bold group-hover:text-signal">
                  <HandCoins className="size-5 text-muted" aria-hidden="true" /> I fund sport <ArrowRight className="size-4" aria-hidden="true" />
                </span>
                <span className="mt-1 block text-small text-muted">
                  Foundations, companies, brands, government bodies, federations and individual sponsors. Find credible athletes, teams and initiatives.
                </span>
              </button>
              <button type="button" onClick={() => go("roles")} className="group py-4 text-left">
                <span className="flex items-center gap-2 font-display text-xl font-bold group-hover:text-signal">
                  <Search className="size-5 text-muted" aria-hidden="true" /> I&rsquo;m looking for funding <ArrowRight className="size-4" aria-hidden="true" />
                </span>
                <span className="mt-1 block text-small text-muted">Athletes, parents, coaches, clubs, academies and programmes. Free to join.</span>
              </button>
            </div>
            <button type="button" onClick={() => go("roles")} className={btn("secondary", "mt-5")}>
              Explore by role ({PERSONAS.length} people) <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          </div>
        </section>
      </div>

      <ImageSlot file="im-02-landing-phone.png" ratio="9/16" className="mx-auto mt-10 w-3/4 sm:hidden" />

      <section aria-labelledby="how" className="mt-16 border-t border-line pt-10">
        <Label>How it works</Label>
        <h2 id="how" className="text-title mt-2">
          Discover, connect, fund, track, review
        </h2>
        <ol className="relative mt-8 grid gap-6 md:grid-cols-5 md:gap-4">
          <span aria-hidden="true" className="absolute top-[7px] right-[10%] left-[10%] hidden h-[1.75px] bg-track md:block" />
          {STEPS.map((s, i) => (
            <li key={s.t} className="relative grid grid-cols-[20px_1fr] gap-3 md:block">
              <span
                aria-hidden="true"
                className={`relative mt-1 block size-[14px] rounded-full md:mx-auto md:mt-0 ${i === 0 ? "bg-signal" : "bg-passed"}`}
              />
              <div className="md:mt-4 md:text-center">
                <p className="font-display text-xl font-bold">
                  {i + 1}. {s.t}
                </p>
                <p className="mt-1 text-small text-muted">{s.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-14 grid gap-8 border-t border-line pt-10 md:grid-cols-2">
        <div>
          <Label>For people and organisations seeking funding</Label>
          <p className="mt-3 text-muted">
            Athletes, parents and guardians, coaches, teams, clubs, academies, schools, federations, sports charities and
            programme operators. One profile, many funders. Free basic participation.
          </p>
        </div>
        <div>
          <Label>For people and organisations providing funding</Label>
          <p className="mt-3 text-muted">
            Foundations, company CSR teams, sponsors, sports brands, government sports bodies, federations and verified
            individual sponsors. Find credible opportunities, select fairly and see how support is used.
          </p>
        </div>
      </section>

      <section className="mt-14 border-t border-line pt-8 text-small text-subtle">
        <p className="flex items-start gap-2">
          <ShieldCheck className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          Delivery and spending records show what was delivered and spent; they do not on their own prove social impact.
        </p>
        <details className="mt-4">
          <summary className="cursor-pointer font-medium text-muted">About this prototype</summary>
          <p className="mt-2 max-w-3xl">
            A clickable prototype on fictional data (P1 shell). Sign-in, identity and organisation checks, payments,
            safeguarding checks, notifications and AI are simulated; no real money moves; discovery shows only fictional
            participating organisations; no connection to Revivo Pathway; English and US dollars only; nothing is sent
            anywhere.
          </p>
          <p className="mt-2">
            <Chip kind="info">Built in P1: start, roles, 12 representative screens · the rest are labelled with their design</Chip>
          </p>
        </details>
      </section>
    </main>
  );
}

export function Roles() {
  const { go, world } = useStore();
  const PERSONAS: Person[] = Object.values(world.people).filter((p) => p.persona);
  const groups = ["Seeking funding", "Providing funding", "Delivering programmes", "Platform"] as const;
  return (
    <main id="main" className="container-site pb-20">
      <div className="flex items-center justify-between py-6">
        <a href="#/start" aria-label="Revivo Impact: back to the start screen">
          <ImpactLockup />
        </a>
        <ThemeButtons withMotion={false} />
      </div>
      <p className="label text-signal">Explore by role</p>
      <h1 className="text-title mt-2">Whose screen would you like to see?</h1>
      <p className="text-lead mt-3 max-w-2xl text-muted">
        Every person is fictional. Each one sees only what their role and the consent rules allow.
      </p>
      <div className="mt-6">
        <button type="button" onClick={() => go("join")} className={btn("secondary")}>
          Or join as someone new <ArrowRight className="size-4" aria-hidden="true" />
        </button>
      </div>
      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        {groups.map((g) => (
          <section key={g} aria-labelledby={`g-${g}`}>
            <h2 id={`g-${g}`} className="label border-b border-line pb-2 text-subtle">
              {g}
            </h2>
            <ul>
              {PERSONAS.filter((p) => p.group === g).map((p) => (
                <li key={p.id} className="border-b border-line">
                  <a href={`#/app/${p.id}`} className="group flex items-center justify-between gap-4 py-3.5">
                    <span className="min-w-0">
                      <span className="block font-medium text-ink group-hover:text-signal">{p.name}</span>
                      <span className="block text-small text-muted">
                        {p.title}{p.orgId ? ` · ${world.orgs[p.orgId]?.name}` : p.funderId && p.role !== "individual" ? ` · ${world.funders[p.funderId]?.name}` : ""}
                      </span>
                      <span className="block text-small text-subtle">Try: {p.tasks.join(" · ")}</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-2 text-small text-subtle">
                      <span className="hidden sm:inline">Journey {p.journeys}</span>
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
