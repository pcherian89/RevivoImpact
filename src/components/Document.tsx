/**
 * Fictional supporting documents (founder, P4): receipt and evidence previews built from the record they belong to,
 * so they always agree with it. Paper-white in both themes, stamped as fictional demonstration material. Nothing is
 * uploaded or stored; no real person, company or document is shown.
 */
import type { ReactNode } from "react";
import { fmt } from "../domain/engine";

export type DocSpec = {
  kind: "Receipt" | "Invoice" | "Result confirmation" | "Training confirmation" | "Activity evidence";
  issuer: string;
  issuerLine: string;
  number: string;
  date: string;
  to: string;
  lines: { label: string; amount?: number }[];
  note?: string;
  signedBy?: string;
};

/** A stable reference number from a record id (no randomness, so it never changes between visits). */
export const docNumber = (id: string, prefix: string) => `${prefix}-${String([...id].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 99991, 7)).padStart(5, "0")}`;

export function FictionalDocument({ d }: { d: DocSpec }) {
  const total = d.lines.reduce((a, l) => a + (l.amount ?? 0), 0);
  return (
    <figure className="relative overflow-hidden rounded-[6px] bg-[#fbfaf6] p-6 font-sans text-[#1b1b18] shadow-xl" aria-label={`${d.kind} (fictional demonstration document)`}>
      <p className="-mx-6 -mt-6 mb-4 bg-[#9a3f26] px-6 py-1 text-[11px] font-bold tracking-[0.18em] text-white uppercase">Fictional demonstration document</p>
      <div className="flex items-start justify-between gap-4 border-b border-[#d8d6cc] pb-3">
        <div>
          <p className="text-[15px] font-bold">{d.issuer}</p>
          <p className="text-[12px] text-[#5c5c57]">{d.issuerLine}</p>
        </div>
        <div className="text-right text-[12px]">
          <p className="font-bold tracking-wide uppercase">{d.kind}</p>
          <p className="text-[#5c5c57] tabular-nums">{d.number}</p>
          <p className="text-[#5c5c57]">{d.date}</p>
        </div>
      </div>
      <p className="mt-3 text-[12px] text-[#5c5c57]">
        {d.kind === "Receipt" || d.kind === "Invoice" ? "Received from" : "For"}: <span className="text-[#1b1b18]">{d.to}</span>
      </p>
      <table className="mt-3 w-full text-[13px]">
        <tbody>
          {d.lines.map((l, i) => (
            <tr key={i} className="border-b border-[#e6e4da]">
              <td className="py-1.5 pr-3">{l.label}</td>
              <td className="py-1.5 text-right tabular-nums">{l.amount !== undefined ? fmt(l.amount) : ""}</td>
            </tr>
          ))}
          {total > 0 && (
            <tr>
              <td className="pt-2 font-bold">Total paid</td>
              <td className="pt-2 text-right font-bold tabular-nums">{fmt(total)}</td>
            </tr>
          )}
        </tbody>
      </table>
      {d.note && <p className="mt-3 text-[12px] text-[#5c5c57]">{d.note}</p>}
      {d.signedBy && <p className="mt-4 font-[cursive] text-[16px] text-[#2a3a6a]">{d.signedBy}</p>}
      <figcaption className="mt-5 border-t border-dashed border-[#c9c6b8] pt-2 text-[11px] text-[#5c5c57]">
        Fictional demonstration document. The organisation, people and amounts are invented; nothing was uploaded.
      </figcaption>
    </figure>
  );
}

export function DocNote({ children }: { children: ReactNode }) {
  return <p className="mt-4 text-small text-subtle">{children}</p>;
}
