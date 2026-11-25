import { createContext, useContext, useState, useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { PHOTOS } from "../content/images";
import {
  ArrowRight,
  CircleAlert,
  CircleCheck,
  CircleDashed,
  CircleDot,
  Clock3,
  Info,
  ShieldCheck,
  Sparkles,
  Tag,
  X,
} from "lucide-react";

export const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

/**
 * Money typed by a person: whole dollars only ("1200", "1,200" or "$1,200"). Anything else (decimals, minus signs,
 * letters) is NaN, which the rules refuse with a plain message. Nothing is silently changed (P5 review).
 */
export const toDollars = (s: string) => {
  const t = s.trim().replace(/^\$/, "").replace(/,(?=\d{3}(?:\D|$))/g, "");
  return /^\d+$/.test(t) ? Number(t) : NaN;
};
/** Shown under a money field while what is typed is not whole dollars. */
export function MoneyHint({ value }: { value: string }) {
  if (!value.trim() || !Number.isNaN(toDollars(value))) return null;
  return <p className="mt-1 text-small text-amber">Whole dollars only, for example 1200. No cents or minus signs.</p>;
}

/** One selected state for every choice (consent, decisions, update types): ink fill with a tick; never lime for an answer. */
export const seg = (on: boolean) => cn("inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full border px-4 text-small disabled:opacity-50", on ? "border-ink bg-ink font-medium text-canvas before:content-['✓']" : "border-line-strong text-ink hover:border-ink");

/** Buttons: website buttonClasses() (docs/04 §2). One primary per view. */
export function btn(variant: "primary" | "secondary" | "quiet" = "primary", extra?: string) {
  return cn(
    "group inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 font-display text-base font-bold tracking-[0.03em] transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50",
    variant === "primary" &&
      "bg-lime text-on-lime hover:bg-ink hover:text-canvas [[data-ri-theme=daylight]_&]:border [[data-ri-theme=daylight]_&]:border-signal",
    variant === "secondary" && "border border-line-strong bg-raised/60 text-ink hover:border-signal hover:text-signal",
    variant === "quiet" && "px-3 text-muted hover:text-ink",
    extra,
  );
}

export function Button({
  children,
  variant = "primary",
  onClick,
  arrow,
  className,
  disabled,
  type = "button",
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "quiet";
  onClick?: () => void;
  arrow?: boolean;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <button type={type} className={btn(variant, className)} onClick={onClick} disabled={disabled}>
      <span>{children}</span>
      {arrow && (
        <ArrowRight
          aria-hidden="true"
          className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
        />
      )}
    </button>
  );
}

type ChipKind = "verified" | "awaiting" | "self" | "attention" | "info" | "neutral" | "shield" | "current" | "ai";
const chipMap: Record<ChipKind, { icon: typeof CircleCheck; cls: string }> = {
  verified: { icon: CircleCheck, cls: "text-ink border-line-strong [&>svg]:text-ok" },
  current: { icon: CircleDot, cls: "text-signal border-signal/40" },
  awaiting: { icon: Clock3, cls: "text-steel border-steel/40" },
  self: { icon: CircleDashed, cls: "text-subtle border-line-strong" },
  attention: { icon: CircleAlert, cls: "text-amber border-amber/40" },
  info: { icon: Info, cls: "text-info border-info/40" },
  neutral: { icon: Tag, cls: "text-muted border-line-strong" },
  shield: { icon: ShieldCheck, cls: "text-muted border-line-strong" },
  ai: { icon: Sparkles, cls: "text-steel border-steel/40" },
};

/** Status chip: icon plus word on a 28px pill; never colour alone (docs/04 §2). */
export function Chip({ kind = "neutral", children, className }: { kind?: ChipKind; children: ReactNode; className?: string }) {
  const { icon: Icon, cls } = chipMap[kind];
  return (
    <span
      className={cn(
        "inline-flex min-h-7 max-w-full items-center gap-1.5 rounded-[14px] border px-2.5 py-1 text-small leading-snug",
        cls,
        className,
      )}
    >
      <Icon aria-hidden="true" className="size-3.5 shrink-0" />
      <span>{children}</span>
    </span>
  );
}

export function SimulatedAI() {
  return <Chip kind="ai">Simulated AI</Chip>;
}

export function Label({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("label text-subtle", className)}>{children}</p>;
}

/** Every figure is a "See source" button (invariant I8). */
/** The records behind a figure (P1 "Source records" panel). Rows are already filtered for the viewer's access. */
export type Source = { title: string; rows: { label: string; value: string; note?: string }[]; note?: string };
const SourceCtx = createContext<(s: Source) => void>(() => {});
export function SourceProvider({ children }: { children: ReactNode }) {
  const [src, setSrc] = useState<Source | null>(null);
  return (
    <SourceCtx.Provider value={setSrc}>
      {children}
      <Panel open={!!src} onClose={() => setSrc(null)} eyebrow="Where this number comes from" title={src?.title ?? ""}>
        {src && (
          <>
            {src.rows.length === 0 ? (
              <p className="text-muted">No records yet.</p>
            ) : (
              <ul className="border-t border-line">
                {src.rows.map((r, i) => (
                  <li key={i} className="flex items-start justify-between gap-4 border-b border-line py-3">
                    <span>
                      <span className="block">{r.label}</span>
                      {r.note && <span className="block text-small text-subtle">{r.note}</span>}
                    </span>
                    <span className="shrink-0 font-medium tabular-nums">{r.value}</span>
                  </li>
                ))}
              </ul>
            )}
            {src.note && <p className="mt-4 text-small text-subtle">{src.note}</p>}
          </>
        )}
      </Panel>
    </SourceCtx.Provider>
  );
}

/** A figure that opens its records. Without records to show it is plain text: it never pretends to link. */
export function SeeSource({ children, name, onClick, source }: { children: ReactNode; name: string; onClick?: () => void; source?: Source }) {
  const open = useContext(SourceCtx);
  if (!onClick && !source) return <span className="tabular-nums">{children}</span>;
  return (
    <button type="button" onClick={() => (source ? open(source) : onClick?.())} title={`See where this comes from: ${name}`} className="-mx-1.5 -my-2.5 inline-block px-1.5 py-2.5 tabular-nums underline decoration-dotted decoration-1 underline-offset-4 hover:text-signal">
      {children}
      <span className="sr-only"> (see where this comes from: {name})</span>
    </button>
  );
}

/** DomainPanel pattern: ≈46vw right panel, bottom sheet on phones, Escape and focus return. */
export function Panel({
  open,
  onClose,
  title,
  eyebrow,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  eyebrow?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const opener = useRef<Element | null>(null);
  useEffect(() => {
    if (!open) return;
    opener.current = document.activeElement;
    ref.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      (opener.current as HTMLElement | null)?.focus?.();
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50" role="presentation">
      <div className="absolute inset-0 bg-canvas/70" onClick={onClose} aria-hidden="true" />
      <div
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="absolute inset-x-0 bottom-0 max-h-[86vh] overflow-y-auto rounded-t-[14px] border border-line-strong bg-surface p-5 outline-none md:inset-y-0 md:right-0 md:left-auto md:max-h-none md:w-[46vw] md:max-w-[640px] md:min-w-[420px] md:rounded-none md:border-y-0 md:border-r-0 md:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            {eyebrow && <Label>{eyebrow}</Label>}
            <h2 className="text-subtitle mt-1">{title}</h2>
          </div>
          <button type="button" onClick={onClose} className={btn("secondary", "px-3")} aria-label="Close panel">
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}

/** Dark placeholder in the image's own shape until the founder supplies it (docs/10). */
export function ImageSlot({
  file,
  ratio = "16/9",
  className,
  caption,
}: {
  file: string;
  ratio?: "16/9" | "9/16";
  className?: string;
  caption?: string;
}) {
  const photo = PHOTOS[file];
  if (photo) {
    // The photograph, shown whole in its own shape (never cropped) with the family grade and its own tone (docs/04 §9).
    // Decorative: the words beside it carry the meaning, as on the website and in Revivo Pathway.
    return (
      <figure
        className={cn("photo-frame relative overflow-hidden rounded-xl", className)}
        style={{ aspectRatio: `${photo.w}/${photo.h}` }}
        aria-hidden="true"
        data-image={file}
      >
        <img
          src={photo.src}
          alt=""
          width={photo.w}
          height={photo.h}
          decoding="async"
          className="photo absolute inset-0 h-full w-full object-contain"
          style={photo.tone ? ({ "--tone": photo.tone } as CSSProperties) : undefined}
        />
      </figure>
    );
  }
  return (
    <figure
      className={cn("photo-frame relative overflow-hidden rounded-xl bg-surface-2", className)}
      style={{ aspectRatio: ratio }}
      aria-label={`Photograph to come${caption ? `: ${caption}` : ""}`}
      data-image={file}
    >
      <div className="absolute inset-0 bg-[radial-gradient(90%_80%_at_70%_40%,var(--ri-line-strong),transparent_70%)] opacity-70" />
      {/* The file name stays in data-image for the image plan (docs/10); people see only that a photograph is coming. */}
      <figcaption className="absolute inset-x-0 top-0 flex flex-col gap-0.5 p-4 text-small text-subtle">
        <span className="label">Photograph to come</span>
        {caption && <span>{caption}</span>}
      </figcaption>
    </figure>
  );
}

/**
 * Page header: the title, a plain sentence on what the page is for and the main actions on the left; the photograph
 * on the right, shown whole, clear and beside the words (never under them). Phones show the photo above the title,
 * or not at all here (Home screens place it below "Needs you" themselves).
 * Founder direction (25 Nov 2026): photos must look clear, never faded or see-through, and no text may sit on a photo.
 */
export function HeroBand({
  file,
  children,
  caption,
  phone = "before",
  className,
}: {
  file: string;
  children: ReactNode;
  caption?: string;
  /** Phones: the image above the title (default) or not at all (Home screens place it below "Needs you" themselves). */
  phone?: "before" | "none";
  /** Home screens pass the width of their sections, so the photo's right edge lines up with the content below. */
  className?: string;
}) {
  return (
    <section className={cn("border-b border-line md:mb-2", className)}>
      {phone === "before" && <PhonePhoto file={file} caption={caption} className="mt-4" />}
      <div className="grid items-center gap-x-8 py-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:py-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-x-12">
        <div className="min-w-0">{children}</div>
        <ImageSlot file={file} caption={caption} className="hidden w-full md:block" />
      </div>
    </section>
  );
}

/** Phones only: a header photo shown whole and full width (tablet and laptop show it in the HeroBand). */
export function PhonePhoto({ file, caption, className }: { file: string; caption?: string; className?: string }) {
  return <ImageSlot file={file} caption={caption} className={cn("w-full md:hidden", className)} />;
}

export function PageHead({
  eyebrow,
  title,
  lead,
  actions,
}: {
  eyebrow?: string;
  title: string;
  lead?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-4 pt-6 pb-6 md:flex-row md:items-end md:justify-between md:pt-10">
      <div className="max-w-3xl">
        {eyebrow && <p className="label text-signal">{eyebrow}</p>}
        <h1 className="text-title mt-2">{title}</h1>
        {lead && <p className="text-lead mt-3 text-muted">{lead}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
    </header>
  );
}

export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
  label,
}: {
  tabs: { id: T; label: string; count?: number }[];
  value: T;
  onChange: (t: T) => void;
  label: string;
}) {
  return (
    <div role="tablist" aria-label={label} className="flex flex-wrap gap-x-1 border-b border-line">
      {tabs.map((t) => {
        const on = t.id === value;
        return (
          <button
            key={t.id}
            role="tab"
            aria-selected={on}
            type="button"
            onClick={() => onChange(t.id)}
            onKeyDown={(e) => {
              const i = tabs.findIndex((x) => x.id === value);
              if (e.key === "ArrowRight") onChange(tabs[(i + 1) % tabs.length].id);
              if (e.key === "ArrowLeft") onChange(tabs[(i - 1 + tabs.length) % tabs.length].id);
            }}
            tabIndex={on ? 0 : -1}
            className={cn(
              "-mb-px min-h-11 shrink-0 border-b-2 px-3 font-display text-base font-bold tracking-[0.03em] whitespace-nowrap transition-colors",
              on ? "border-signal text-ink" : "border-transparent text-subtle hover:text-ink",
            )}
          >
            {t.label}
            {t.count != null && <span className="ml-1.5 font-sans text-small font-medium text-subtle">{t.count}</span>}
          </button>
        );
      })}
    </div>
  );
}

export function FilterPill({ children, on }: { children: ReactNode; on?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex min-h-9 items-center rounded-full border px-3.5 text-small whitespace-nowrap",
        on ? "border-ink/70 bg-surface-2 text-ink" : "border-line-strong text-muted",
      )}
    >
      {children}
    </span>
  );
}
