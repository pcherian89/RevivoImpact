import type { ReactNode } from "react";
import { cn, SeeSource } from "./ui";
import { fmt } from "../domain/engine";

export type LineNode = { short: string; full: string; stat?: ReactNode; note?: string };

/**
 * The Funding Line (docs/04 §5): one straight track from the funder (left endpoint) to the recipient (right
 * endpoint); passed nodes MID_LIME, the current node lime with three signal-core rings, future nodes outlined; the
 * light runs once from the funder and stops at the current node. Horizontal from 768px, vertical on phones.
 * An <ol> with aria-current; the drawing is aria-hidden.
 */
export function FundingLine({
  nodes,
  current,
  from,
  to,
  onSource,
}: {
  nodes: LineNode[];
  current: number;
  from: string;
  to: string;
  onSource?: (n: LineNode) => void;
}) {
  const n = nodes.length;
  // Track runs from the funder endpoint (0%) to the recipient endpoint (100%); nodes sit at the column centres.
  const nodeX = (i: number) => ((i + 0.5) / n) * 100;
  const lit = nodeX(current);
  return (
    <div>
      {/* Horizontal (≥ 768px) */}
      <div className="hidden md:block" aria-hidden="true">
        <div className="flex items-center justify-between text-small">
          <span className="label-data text-muted">{from}</span>
          <span className="label-data text-muted">{to}</span>
        </div>
        <div className="relative mt-2 h-10">
          <div className="absolute top-1/2 right-0 left-0 h-[1.75px] -translate-y-1/2 bg-line-strong" />
          <div className="ri-grow absolute top-1/2 left-0 h-[1.75px] -translate-y-1/2 bg-track" style={{ ["--pct" as string]: `${lit}%`, width: `${lit}%` }}>
            <div className="absolute top-0 right-0 h-full w-[120px] max-w-full bg-[linear-gradient(90deg,transparent,var(--ri-signal))]" />
          </div>
          <Endpoint className="left-0" />
          <Endpoint className="right-0" />
          {nodes.map((_, i) => (
            <div key={i} className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left: `${nodeX(i)}%` }}>
              <NodeDot state={i < current ? "passed" : i === current ? "current" : "future"} />
            </div>
          ))}
        </div>
      </div>
      <p className="label-data mb-3 text-muted md:hidden">From {from}</p>

      <ol className="grid gap-0 md:mt-1 md:grid-cols-[repeat(var(--n),minmax(0,1fr))] md:gap-3" style={{ ["--n" as string]: n }}>
        {nodes.map((node, i) => {
          const state = i < current ? "passed" : i === current ? "current" : "future";
          return (
            <li key={node.short} aria-current={state === "current" ? "step" : undefined} className="relative grid grid-cols-[28px_1fr] gap-3 pb-5 md:block md:pb-0 md:text-center">
              <div className="relative md:hidden" aria-hidden="true">
                {i < n - 1 && <span className={cn("absolute top-5 bottom-[-20px] left-1/2 w-[1.75px] -translate-x-1/2", i < current ? "bg-track" : "bg-line-strong")} />}
                <div className="relative flex h-10 items-start justify-center pt-0.5">
                  <NodeDot state={state} />
                </div>
              </div>
              <div>
                <p className={cn("label-data", state === "current" ? "text-signal" : "text-subtle")}>
                  <span className="sr-only">{node.full}: </span>
                  <span aria-hidden="true">{node.short}</span>
                  {state === "current" && <span className="sr-only"> (current step)</span>}
                </p>
                {node.stat && (
                  <p className={cn("mt-1 font-medium", state === "future" ? "text-subtle" : "text-ink")}>
                    {onSource ? (
                      <SeeSource name={node.full} onClick={() => onSource(node)}>
                        {node.stat}
                      </SeeSource>
                    ) : (
                      node.stat
                    )}
                  </p>
                )}
                {node.note && <p className="mt-0.5 text-small text-subtle">{node.note}</p>}
              </div>
            </li>
          );
        })}
      </ol>
      <p className="label-data mt-1 text-muted md:hidden">To {to}</p>
      <style>{`
        @keyframes ri-grow { from { width: 0; } to { width: var(--pct); } }
        .ri-grow { animation: ri-grow 1.4s cubic-bezier(0.25,1,0.5,1) 0.2s 1 both; }
        [data-ri-motion=reduced] .ri-grow { animation: none; }
        @media (prefers-reduced-motion: reduce) { .ri-grow { animation: none; } }
      `}</style>
    </div>
  );
}

function Endpoint({ className }: { className: string }) {
  return <span className={cn("absolute top-1/2 size-[10px] -translate-y-1/2 rounded-full border-[1.75px] border-ink bg-canvas", className)} />;
}

function NodeDot({ state }: { state: "passed" | "current" | "future" }) {
  if (state === "current")
    return (
      <svg width="40" height="40" viewBox="-20 -20 40 40" aria-hidden="true" className="shrink-0 overflow-visible">
        <circle r="20" fill="var(--ri-ink)" opacity="0.07" />
        <circle r="13.6" fill="var(--ri-ink)" opacity="0.07" />
        <circle r="7.2" fill="var(--ri-signal)" opacity="0.22" />
        <circle className="ri-ring" r="7" fill="none" stroke="var(--ri-signal)" strokeWidth="1.5" />
        <circle r="7" fill="var(--ri-signal)" />
      </svg>
    );
  return (
    <svg width="40" height="40" viewBox="-20 -20 40 40" aria-hidden="true" className="shrink-0">
      {state === "passed" ? <circle r="5" fill="var(--ri-passed)" /> : <circle r="5" fill="var(--ri-canvas)" stroke="var(--ri-control)" strokeWidth="1.5" />}
    </svg>
  );
}

/** Mini Funding Line for list rows (docs/04 §5.2): dots only, no light, with the next step as text. */
export function MiniLine({ total, current, label }: { total: number; current: number; label: string }) {
  return (
    <span className="inline-flex items-center gap-2" title={label}>
      <span aria-hidden="true" className="relative inline-flex items-center gap-[7px]">
        <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-line-strong" />
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={cn(
              "relative inline-block rounded-full",
              i < current ? "size-[7px] bg-passed" : i === current ? "size-[9px] bg-signal" : "size-[7px] border border-control bg-canvas",
            )}
          />
        ))}
      </span>
      <span className="sr-only">{label}</span>
    </span>
  );
}

/**
 * Agreement funding bar (docs/04 §6): length = Committed. Segments: spent · verified (solid ink) · awaiting
 * verification (steel hatch) · unspent (outline, surface-2) · still to come (control outline). Words and figures in
 * the legend carry the meaning; colour never does on its own.
 */
export function FundingBar({
  committed,
  released,
  reported,
  verified,
  receivedOn,
  onSource,
}: {
  committed: number;
  released: number;
  reported: number;
  verified: number;
  receivedOn?: string;
  onSource?: (what: string) => void;
}) {
  const seg = [
    { key: "verified", v: verified, label: "Spent · verified", cls: "bg-ink" },
    { key: "awaiting", v: reported - verified, label: "Awaiting verification", cls: "hatch border border-steel" },
    { key: "unspent", v: Math.max(0, released - reported), label: "Unspent", cls: "border border-ink bg-surface-2" },
    { key: "outstanding", v: committed - released, label: "Still to come", cls: "border border-dashed border-control" },
  ];
  const rel = (released / committed) * 100;
  return (
    <figure>
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <span className="label-data text-muted">
          Released {fmt(released)}
          {receivedOn && <span className="normal-case tracking-normal font-sans font-medium text-subtle"> · {receivedOn}</span>}
        </span>
        <span className="label-data text-subtle">Committed {fmt(committed)}</span>
      </div>
      <div className="relative" aria-hidden="true">
        <div className="flex h-5 w-full gap-[3px]">
          {seg.map((s) => (s.v > 0 ? <div key={s.key} className={cn("h-full rounded-[3px]", s.cls)} style={{ width: `${(s.v / committed) * 100}%` }} /> : null))}
        </div>
        <span className="absolute -top-1 bottom-[-4px] w-[1.75px] bg-ink" style={{ left: `calc(${rel}% - 1px)` }} />
      </div>
      <figcaption className="mt-3 grid grid-cols-2 gap-x-6 gap-y-3 text-small sm:grid-cols-4">
        {seg.map((s) => (
          <div key={s.key} className="flex items-start gap-2">
            <span aria-hidden="true" className={cn("mt-1 inline-block size-3 shrink-0 rounded-[2px]", s.cls)} />
            <span>
              <span className="block text-subtle">{s.label}</span>
              <SeeSource name={`${s.label} ${fmt(s.v)}`} onClick={() => onSource?.(s.label)}>
                <span className="font-medium text-ink">{fmt(s.v)}</span>
              </SeeSource>
            </span>
          </div>
        ))}
      </figcaption>
    </figure>
  );
}

/** Fund bar (length = Announced): committed solid · held for offers dashed · available empty. */
export function FundBar({ announced, committed, reserved }: { announced: number; committed: number; reserved: number }) {
  const available = announced - committed - reserved;
  const parts = [
    { label: "Committed", v: committed, cls: "bg-ink" },
    { label: "Offered, awaiting reply", v: reserved, cls: "border border-dashed border-ink bg-surface-2" },
    { label: "Still available", v: available, cls: "bg-line-strong" },
  ];
  return (
    <figure>
      <div className="flex h-3 w-full gap-[3px]" aria-hidden="true">
        {parts.map((p) => (p.v > 0 ? <div key={p.label} className={cn("h-full rounded-[3px]", p.cls)} style={{ width: `${(p.v / announced) * 100}%` }} /> : null))}
      </div>
      {committed + reserved === 0 && <p className="mt-2 text-small text-muted">Nothing committed or offered yet: all {fmt(announced)} is still available.</p>}
      <figcaption className="mt-3 flex flex-wrap gap-x-8 gap-y-3 text-small">
        <span>
          <span className="block text-subtle">Announced</span>
          <SeeSource name={`Announced ${fmt(announced)}`}>
            <span className="font-medium">{fmt(announced)}</span>
          </SeeSource>
        </span>
        {parts.map((p) => (
          <span key={p.label} className="flex items-start gap-2">
            <span aria-hidden="true" className={cn("mt-1 inline-block size-3 rounded-[2px]", p.cls)} />
            <span>
              <span className="block text-subtle">{p.label}</span>
              <SeeSource name={`${p.label} ${fmt(p.v)}`}>
                <span className="font-medium">{fmt(p.v)}</span>
              </SeeSource>
            </span>
          </span>
        ))}
      </figcaption>
    </figure>
  );
}

/** Need bar (length = Requested): received (ink) · pledged not received (outline) · other sources (hatch) · still needed (empty). */
export function NeedBar({
  requested,
  pledged,
  received,
  otherSources = 0,
  held = 0,
  compact,
}: {
  requested: number;
  pledged: number;
  received: number;
  otherSources?: number;
  held?: number;
  compact?: boolean;
}) {
  const remaining = requested - pledged - otherSources - held;
  return (
    <div>
      <div className={cn("flex w-full gap-[2px]", compact ? "h-2" : "h-4")} aria-hidden="true">
        {received > 0 && <div className="h-full rounded-[2px] bg-ink" style={{ width: `${(received / requested) * 100}%` }} />}
        {pledged - received > 0 && <div className="h-full rounded-[2px] border border-ink" style={{ width: `${((pledged - received) / requested) * 100}%` }} />}
        {otherSources > 0 && <div className="hatch h-full rounded-[2px] border border-steel" style={{ width: `${(otherSources / requested) * 100}%` }} />}
        {held > 0 && <div className="h-full rounded-[2px] border border-dashed border-ink" style={{ width: `${(held / requested) * 100}%` }} />}
        {remaining > 0 && <div className="h-full flex-1 rounded-[2px] bg-line-strong" />}
      </div>
      <p className="mt-1.5 text-small text-subtle">
        {pledged === 0 && otherSources === 0 && held === 0 ? (
          <>
            <span className="font-medium text-ink">{fmt(requested)}</span> still needed · nothing pledged yet
          </>
        ) : (
          <>
            <span className="font-medium text-ink">{fmt(pledged)}</span> pledged of {fmt(requested)}
            {held > 0 && <> · {fmt(held)} held for a pending application</>} ·{" "}
            <span className="font-medium text-ink">{fmt(Math.max(0, remaining))}</span> still needed
          </>
        )}
      </p>
    </div>
  );
}
