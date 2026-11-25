import { useEffect, useRef, useState, type ReactNode } from "react";
import { CircleAlert, CircleCheck } from "lucide-react";
import { useStore } from "../state/store";
import type { CommandName } from "../domain/engine";
import type { Application, Person, World } from "../domain/model";
import { btn, Chip, cn } from "../components/ui";

/** Run a rules-checked action as the person whose screen this is; keeps the rule's message to show inline. */
export function useAction(actor: string) {
  const { act } = useStore();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const run = (type: CommandName, args: Record<string, unknown>, success?: string) => {
    const e = act(actor, type, args);
    setError(e);
    setDone(e ? null : (success ?? null));
    return !e;
  };
  return { run, error, done, clear: () => (setError(null), setDone(null)), fail: (msg: string) => (setError(msg), setDone(null), false) };
}

export function Message({ error, done }: { error?: string | null; done?: string | null }) {
  const ref = useRef<HTMLParagraphElement>(null);
  // An error takes focus so keyboard and screen-reader users land on it (and it scrolls into view above the phone bar).
  useEffect(() => {
    if (error) ref.current?.focus();
  }, [error]);
  if (error)
    return (
      <p ref={ref} tabIndex={-1} role="alert" className="mt-3 flex gap-2 text-small text-amber outline-none">
        <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> {error}
      </p>
    );
  if (done)
    return (
      <p role="status" className="mt-3 flex gap-2 text-small text-ink">
        <CircleCheck className="mt-0.5 size-4 shrink-0 text-ok" aria-hidden="true" /> {done}
      </p>
    );
  return null;
}

/** An action button with its own rule message underneath. */
export function ActionButton({
  actor,
  type,
  args,
  children,
  variant = "primary",
  success,
  className,
  onDone,
}: {
  actor: string;
  type: CommandName;
  args: Record<string, unknown>;
  children: ReactNode;
  variant?: "primary" | "secondary";
  success?: string;
  className?: string;
  onDone?: () => void;
}) {
  const a = useAction(actor);
  return (
    <div className={className}>
      <button type="button" className={btn(variant)} onClick={() => a.run(type, args, success) && onDone?.()}>
        {children}
      </button>
      <Message error={a.error} done={a.done} />
    </div>
  );
}

/** Purpose-based display of an athlete for a viewer (docs/02 §8): minors stay anonymous to funders until accepted. */
export function athleteLabel(w: World, athleteId: string, viewer: Person) {
  const a = w.athletes[athleteId];
  if (!a) return w.orgs[athleteId]?.name ?? "Participating organisation";
  if (!a.minor) return a.name;
  if (viewer.role === "guardian" || viewer.role === "coach") return a.name;
  if (viewer.funderId) {
    const accepted = Object.values(w.agreements).some((g) => g.recipientId === athleteId && w.funds[g.fundId].funderId === viewer.funderId);
    if (accepted) return a.name.split(" ")[0];
    return `${a.sport} · ${a.age < 14 ? "under 14" : a.age < 16 ? "14–15" : "16–17"} (anonymised)`;
  }
  return "Athlete under 18 (anonymised)";
}

export function recipientName(w: World, kind: "athlete" | "org", id: string, viewer: Person) {
  if (kind === "org") return w.orgs[id]?.name ?? "Participating club";
  return athleteLabel(w, id, viewer);
}

const APP_STATUS: Record<Application["status"], { label: string; kind: "verified" | "awaiting" | "self" | "attention" | "info" | "neutral" | "current" }> = {
  draft: { label: "Draft", kind: "self" },
  submitted: { label: "Submitted · in review", kind: "awaiting" },
  info: { label: "More information needed", kind: "attention" },
  shortlisted: { label: "In review", kind: "awaiting" },
  offered: { label: "Offered", kind: "current" },
  accepted: { label: "Accepted", kind: "verified" },
  waiting: { label: "Waiting list", kind: "info" },
  notselected: { label: "Not selected this time", kind: "neutral" },
  noteligible: { label: "Not eligible (rule)", kind: "neutral" },
  incomplete: { label: "Incomplete at deadline", kind: "neutral" },
};
export function AppStatus({ s, funderView }: { s: Application["status"]; funderView?: boolean }) {
  const m = APP_STATUS[s];
  const label = funderView && s === "shortlisted" ? "Shortlisted" : m.label;
  return <Chip kind={m.kind}>{label}</Chip>;
}

/** Approval policies in plain words (docs/02 §5.7). */
export const policyText = (p: "Simple" | "Standard" | "Institutional") => (p === "Institutional" ? "Two reviewers recommend; a different person approves; finance pays" : p === "Standard" ? "One person recommends; a different person approves" : "One person decides");

export function Section({ title, children, aside, id }: { title: string; children: ReactNode; aside?: ReactNode; id?: string }) {
  const hid = id ?? title.toLowerCase().replace(/[^a-z]+/g, "-");
  return (
    <section aria-labelledby={hid} className="mt-10">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-2">
        <h2 id={hid} className="label text-subtle">
          {title}
        </h2>
        {aside}
      </div>
      {children}
    </section>
  );
}

export function Empty({ children, li }: { children: ReactNode; li?: boolean }) {
  const cls = "border-b border-line py-5 text-muted";
  return li ? <li className={cls}>{children}</li> : <p className={cls}>{children}</p>;
}

export function Row({ children, className }: { children: ReactNode; className?: string }) {
  return <li className={cn("flex flex-col gap-3 border-b border-line py-4 sm:flex-row sm:items-center sm:justify-between", className)}>{children}</li>;
}

export const Field = ({ label, hint, children, htmlFor }: { label: string; hint?: string; children: ReactNode; htmlFor: string }) => (
  <div className="mt-5">
    <label htmlFor={htmlFor} className="block font-medium">
      {label}
    </label>
    {hint && <p className="text-small text-subtle">{hint}</p>}
    <div className="mt-2">{children}</div>
  </div>
);
export const inputCls = "h-12 w-full rounded-[6px] border border-control bg-surface-2 px-3 text-ink";
