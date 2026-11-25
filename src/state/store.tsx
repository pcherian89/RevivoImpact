import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Moment } from "../data/world";

/** Prototype shell state: theme, motion, demo clock, guide and the current route (hash routing works from file://). */
type Theme = "dark" | "daylight";
type Store = {
  theme: Theme;
  toggleTheme: () => void;
  reducedMotion: boolean;
  toggleMotion: () => void;
  moment: Moment;
  setMoment: (m: Moment) => void;
  route: string[];
  go: (path: string) => void;
  guideOpen: boolean;
  setGuideOpen: (v: boolean) => void;
  reset: () => void;
};

const KEY = "revivo-impact:v1";
const Ctx = createContext<Store | null>(null);

function load(): Partial<{ theme: Theme; reducedMotion: boolean; moment: Moment }> {
  let saved: Partial<{ theme: Theme; reducedMotion: boolean; moment: Moment }> = {};
  try {
    saved = JSON.parse(localStorage.getItem(KEY) ?? "{}");
  } catch {
    /* storage unavailable */
  }
  // Presenter links can fix the start state: ?moment=may06&theme=daylight&motion=reduced
  const q = new URLSearchParams(location.search);
  const m = q.get("moment");
  if (m === "apr12" || m === "may06" || m === "jun30") saved.moment = m;
  const t = q.get("theme");
  if (t === "dark" || t === "daylight") saved.theme = t;
  if (q.get("motion") === "reduced") saved.reducedMotion = true;
  return saved;
}
function save(v: object) {
  try {
    localStorage.setItem(KEY, JSON.stringify(v));
  } catch {
    /* storage unavailable: the prototype still works from the seed */
  }
}
const parse = () => (location.hash.replace(/^#\/?/, "") || "start").split("/").filter(Boolean);

export function StoreProvider({ children }: { children: ReactNode }) {
  const saved = load();
  const [theme, setTheme] = useState<Theme>(saved.theme ?? "dark");
  const [reducedMotion, setReduced] = useState<boolean>(saved.reducedMotion ?? false);
  const [moment, setMoment] = useState<Moment>(saved.moment ?? "apr12");
  const [route, setRoute] = useState<string[]>(parse);
  const [guideOpen, setGuideOpen] = useState(false);

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
    save({ theme, reducedMotion, moment });
  }, [theme, reducedMotion, moment]);

  const go = useCallback((path: string) => {
    location.hash = "/" + path.replace(/^\//, "");
  }, []);
  const reset = useCallback(() => {
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
    setMoment("apr12");
    setGuideOpen(false);
    location.hash = "/start";
  }, []);

  const value = useMemo<Store>(
    () => ({
      theme,
      toggleTheme: () => setTheme((t) => (t === "dark" ? "daylight" : "dark")),
      reducedMotion,
      toggleMotion: () => setReduced((v) => !v),
      moment,
      setMoment,
      route,
      go,
      guideOpen,
      setGuideOpen,
      reset,
    }),
    [theme, reducedMotion, moment, route, go, guideOpen, reset],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error("StoreProvider missing");
  return s;
}
