import { ArrowRight, PencilRuler } from "lucide-react";
import { SCREENS } from "../data/structure";
import { btn, Chip, Label } from "../components/ui";
import type { Person as Persona } from "../domain/model";

/** Screens designed in P1 but built in P2–P3: shown honestly with their question, layout and contents (docs/03 §4). */
export function Planned({ n, persona }: { n: number; persona: Persona }) {
  const s = SCREENS.find((x) => x.n === n) ?? SCREENS[2];
  return (
    <div className="max-w-3xl pt-10 pb-10">
      <Chip kind="awaiting">Designed in P1 · built in {s.phase}</Chip>
      <p className="label mt-6 text-signal">
        Screen {s.n} · {s.name}
      </p>
      <h1 className="text-title mt-2">{s.question}</h1>
      <dl className="mt-8 divide-y divide-line border-y border-line">
        <div className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr]">
          <dt className="text-subtle">Layout</dt>
          <dd>{s.template}</dd>
        </div>
        <div className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr]">
          <dt className="text-subtle">What it shows</dt>
          <dd>{s.contents}</dd>
        </div>
        <div className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr]">
          <dt className="text-subtle">Viewing as</dt>
          <dd>
            {persona.name} · {persona.title}
          </dd>
        </div>
      </dl>
      <div className="mt-8 flex items-start gap-3 text-muted">
        <PencilRuler className="mt-1 size-5 shrink-0" aria-hidden="true" />
        <p>
          The full specification is in <span className="font-mono text-small">docs/03-experience-and-screens.md</span> §4 and
          the journeys in §5. In this P1 shell the representative screens are Start, Join, Explore by role, Home, Discover
          (both directions), Opportunity, Public profile, Funding request, Funding record, funder Overview and Funding.
        </p>
      </div>
      <div className="mt-8">
        <Label>Representative screens to try</Label>
        <div className="mt-3 flex flex-wrap gap-3">
          <a className={btn("secondary")} href="#/app/amira/discover">
            Amira · Discover <ArrowRight className="size-4" aria-hidden="true" />
          </a>
          <a className={btn("secondary")} href="#/app/kenji/fdiscover">
            Kenji · Discover <ArrowRight className="size-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
}
