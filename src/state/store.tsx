import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { baseWorld, type Moment, type World, ORDER } from "../domain/model";
import { apply, RuleError, type CommandName, type Event } from "../domain/engine";
import { checkpoint, JOURNEYS, stepEvents, type Step } from "../domain/story";

/**
 * One shared state (Pathway's pattern): an event log replayed through the rules engine. Every screen reads the same
 * world; every action goes through `act`, which checks the rules first. Storage keeps only the viewer's own events on
 * top of the story checkpoint, inside try/catch; the prototype works without storage.
 */
type Theme = "dark" | "daylight";
export type Changed = { action: string; record: string; actor: string }[];
type Guide = { open: boolean; journey: string; step: number };
type Store = {
  world: World;
  theme: Theme;
  toggleTheme: () => void;
  reducedMotion: boolean;
  toggleMotion: () => void;
  moment: Moment;
  setMoment: (m: Moment) => void;
  route: string[];
  go: (path: string) => void;
  act: (actor: string, type: CommandName, args: Record<string, unknown>) => string | null;
  changed: Changed | null;
  clearChanged: () => void;
  guide: Guide;
  setGuide: (g: Partial<Guide>) => void;
  showStep: (journey: string, step: number) => string | null;
  loadStep: (journey: string, step: number) => void;
  stepDone: (s: Step) => boolean;
  ownEvents: number;
  reset: () => void;
};

const KEY = "revivo-impact:v2";
const SCHEMA = "p2-1";
const Ctx = createContext<Store | null>(null);

function replay(events: Event[], moment: Moment): World {
  const w = baseWorld();
  for (const e of events) apply(w, e);
  w.moment = moment;
  return w;
}
const parse = () => (location.hash.replace(/^#\/?/, "") || "start").split("/").filter(Boolean);

type Saved = { schema: string; theme?: Theme; reducedMotion?: boolean; moment?: Moment; own?: Event[] };
function load(): Saved {
  let s: Saved = { schema: SCHEMA };
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? "{}");
    if (raw.schema === SCHEMA) s = raw;
  } catch {
    /* storage unavailable: start from the story */
  }
  const q = new URLSearchParams(location.search);
  const m = q.get("moment");
  if (m === "apr12" || m === "may06" || m === "jun30") {
    if (m !== s.moment) s.own = [];
    s.moment = m;
  }
  const t = q.get("theme");
  if (t === "dark" || t === "daylight") s.theme = t;
  if (q.get("motion") === "reduced") s.reducedMotion = true;
  return s;
}

/** All steps in canonical story order for one moment (A, B, C, E as in docs/03). */
const ordered = (m: Moment) => ["A", "B", "C", "D", "E"].flatMap((jid) => JOURNEYS.find((j) => j.id === jid)!.steps.map((s, i) => ({ s, jid, i })).filter((x) => x.s.when === m && !x.s.phase));

export function StoreProvider({ children }: { children: ReactNode }) {
  const saved = useRef(load()).current;
  const [theme, setTheme] = useState<Theme>(saved.theme ?? "dark");
  const [reducedMotion, setReduced] = useState(saved.reducedMotion ?? false);
  const [moment, setMomentState] = useState<Moment>(saved.moment ?? "apr12");
  const [own, setOwn] = useState<Event[]>(saved.own ?? []);
  const [world, setWorld] = useState<World>(() => {
    try {
      return replay([...checkpoint(saved.moment ?? "apr12"), ...(saved.own ?? [])], saved.moment ?? "apr12");
    } catch {
      return replay(checkpoint(saved.moment ?? "apr12"), saved.moment ?? "apr12");
    }
  });
  const [route, setRoute] = useState<string[]>(parse);
  // Latest world and events, so several actions in one click each build on the previous one.
  const worldRef = useRef(world);
  const ownRef = useRef(own);
  worldRef.current = world;
  ownRef.current = own;
  const [changed, setChanged] = useState<Changed | null>(null);
  const [guide, setGuideState] = useState<Guide>({ open: false, journey: "A", step: 0 });

  useEffect(() => {
    const on = () => {
      setRoute(parse());
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.riTheme = theme;
    document.documentElement.dataset.riMotion = reducedMotion ? "reduced" : "full";
    try {
      localStorage.setItem(KEY, JSON.stringify({ schema: SCHEMA, theme, reducedMotion, moment, own }));
    } catch {
      /* ignore */
    }
  }, [theme, reducedMotion, moment, own]);

  const go = useCallback((path: string) => {
    location.hash = "/" + path.replace(/^\//, "");
  }, []);

  /** Run one command as `actor`; returns null on success or the rule's plain-English message. */
  const act = useCallback(
    (actor: string, type: CommandName, args: Record<string, unknown>) => {
      const next = structuredClone(worldRef.current);
      const before = next.audit.length;
      const e: Event = { n: ownRef.current.length + 1, at: moment, actor, type, args };
      try {
        apply(next, e);
      } catch (err) {
        if (err instanceof RuleError) return err.message;
        throw err;
      }
      next.moment = moment;
      worldRef.current = next;
      ownRef.current = [...ownRef.current, e];
      setWorld(next);
      setOwn(ownRef.current);
      setChanged(next.audit.slice(before).map((r) => ({ action: r.action, record: r.record, actor: next.people[r.actor]?.name ?? r.actor })));
      return null;
    },
    [moment],
  );

  const loadAt = useCallback((m: Moment, extra: Event[]) => {
    const evs = [...checkpoint(m), ...extra];
    setWorld(replay(evs, m));
    setOwn(extra);
    setMomentState(m);
    setChanged(null);
  }, []);

  const setMoment = useCallback(
    (m: Moment) => {
      if (m === moment) return;
      if (own.length && !window.confirm("Moving the demonstration date loads the story at that date. Your own changes since the last date will be replaced. Continue?")) return;
      loadAt(m, []);
    },
    [moment, own.length, loadAt],
  );

  const stepDone = useCallback((s: Step) => (s.done ? s.done(world) : false), [world]);

  /** Load the story up to (not including) a step: the checkpoint of its date plus earlier steps of that date. */
  const loadStep = useCallback(
    (journey: string, step: number) => {
      const s = JOURNEYS.find((j) => j.id === journey)!.steps[step];
      const list = ordered(s.when);
      const idx = list.findIndex((x) => x.jid === journey && x.i === step);
      const before = (idx < 0 ? list.filter((x) => x.jid < journey || (x.jid === journey && x.i < step)) : list.slice(0, idx)).flatMap((x) => stepEvents(x.s));
      loadAt(s.when, before.map((e, k) => ({ ...e, n: k + 1 })));
      setGuideState((g) => ({ ...g, journey, step }));
    },
    [loadAt],
  );

  /** "Show me": run the step's commands through the rules, as the people who act in it. */
  const showStep = useCallback(
    (journey: string, step: number) => {
      const s = JOURNEYS.find((j) => j.id === journey)!.steps[step];
      if (ORDER[s.when] !== ORDER[moment]) return "Load this step first: it happens on another date.";
      const next = structuredClone(worldRef.current);
      const before = next.audit.length;
      const evs = stepEvents(s).map((e, k) => ({ ...e, n: ownRef.current.length + k + 1 }));
      try {
        for (const e of evs) apply(next, e);
      } catch (err) {
        if (err instanceof RuleError) return err.message;
        throw err;
      }
      next.moment = moment;
      worldRef.current = next;
      ownRef.current = [...ownRef.current, ...evs];
      setWorld(next);
      setOwn(ownRef.current);
      setChanged(next.audit.slice(before).map((r) => ({ action: r.action, record: r.record, actor: next.people[r.actor]?.name ?? r.actor })));
      return null;
    },
    [moment],
  );

  const reset = useCallback(() => {
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
    loadAt("apr12", []);
    setGuideState({ open: false, journey: "A", step: 0 });
    location.hash = "/start";
  }, [loadAt]);

  const value = useMemo<Store>(
    () => ({
      world,
      theme,
      toggleTheme: () => setTheme((t) => (t === "dark" ? "daylight" : "dark")),
      reducedMotion,
      toggleMotion: () => setReduced((v) => !v),
      moment,
      setMoment,
      route,
      go,
      act,
      changed,
      clearChanged: () => setChanged(null),
      guide,
      setGuide: (g) => setGuideState((x) => ({ ...x, ...g })),
      showStep,
      loadStep,
      stepDone,
      ownEvents: own.length,
      reset,
    }),
    [world, theme, reducedMotion, moment, setMoment, route, go, act, changed, guide, showStep, loadStep, stepDone, own.length, reset],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error("StoreProvider missing");
  return s;
}
