/**
 * Source records (panel P1): the records behind each figure, already filtered for the viewer (docs/02 §8).
 * A minor is never named to a funder before the guardian accepts; a programme funder sees counts, not children.
 */
import type { Moment, Person, World } from "../domain/model";
import { agreementTotals, fmt, fmtIso, sum } from "../domain/engine";
import type { Source } from "../components/ui";
import { recipientName } from "./common";

export const dayOf = (m: Moment) => ({ apr12: "12 Apr", may06: "6 May", jun30: "30 Jun" })[m];

export function agreementSources(w: World, id: string, viewer: Person) {
  const g = w.agreements[id];
  const t = agreementTotals(w, id);
  const ex = Object.values(w.expenses).filter((e) => e.agreementId === id);
  const who = recipientName(w, g.recipientKind, g.recipientId, viewer);
  const row = (e: (typeof ex)[number]) => ({ label: e.what, value: fmt(e.amount), note: `Paid ${e.paidOn} · ${e.receipt ? "receipt uploaded" : "no receipt yet"}${e.checkedBy ? ` · checked by ${w.people[e.checkedBy]?.name}` : ""}${e.query ? ` · asked: “${e.query}”` : ""}` });
  const src = (title: string, rows: Source["rows"], note?: string): Source => ({ title, rows, note });
  return {
    paid: src(
      `Paid to ${who}`,
      w.ledger.filter((l) => l.agreementId === id && l.kind !== "receipt").map((l) => ({ label: l.kind === "carried-in" ? "Paid before joining Revivo Impact (carried in)" : `Payment ${l.ref}`, value: fmt(l.amount), note: `${l.paidOn ? `Paid ${fmtIso(l.paidOn)}, recorded` : "Recorded"} ${dayOf(l.at)} by ${w.people[l.by]?.name ?? "the funder"} (simulated: no real money moves)` })),
      t.received >= t.paid ? "Arrival confirmed by the recipient." : `${fmt(t.paid - t.received)} not yet confirmed as received.`,
    ),
    checked: src("Spent and checked", ex.filter((e) => e.status === "checked").map(row)),
    waiting: src("Spent, waiting to be checked", ex.filter((e) => e.status === "reported" || e.status === "query").map(row)),
    carried: src("Spent before joining Revivo Impact", ex.filter((e) => e.status === "carried-in").map(row), "Figures from before joining are shown as reported. They are never counted as checked."),
    notYetSpent: src("Paid, not yet spent", [{ label: "Paid", value: fmt(t.paid) }, { label: "Minus spending recorded", value: `− ${fmt(t.spent)}` }], `${fmt(t.notYetSpent)} is paid but not yet accounted for.`),
    stillToPay: src("Still to pay", [{ label: "Committed", value: fmt(t.committed) }, { label: "Minus paid so far", value: `− ${fmt(t.paid)}` }], g.nextUpdate),
  };
}

export function fundSources(w: World, fundId: string, viewer: Person) {
  const ags = Object.values(w.agreements).filter((g) => g.fundId === fundId && g.status !== "awaiting-approval");
  const named = ags.filter((g) => !g.light);
  const light = ags.filter((g) => g.light);
  const held = Object.values(w.offers).filter((o) => o.fundId === fundId && ["held", "safeguarding", "second-approval"].includes(o.status));
  return {
    committed: {
      title: `Committed from ${w.funds[fundId].name}`,
      rows: [
        ...named.map((g) => ({ label: recipientName(w, g.recipientKind, g.recipientId, viewer), value: fmt(g.amount), note: g.origin === "Existing agreement" ? "Existing funding" : g.origin })),
        ...(light.length ? [{ label: `${light.length} earlier agreements (summarised)`, value: fmt(sum(light.map((g) => g.amount))) }] : []),
      ],
    } as Source,
    reserved: {
      title: "Set aside for offers not yet accepted",
      rows: [
        ...held.filter((o) => !o.light).map((o) => ({ label: recipientName(w, o.recipientKind, o.recipientId, viewer), value: fmt(o.amount), note: o.status === "held" ? "Waiting for an answer" : o.status === "safeguarding" ? "In the platform's safeguarding check" : "Waiting for a second approver" })),
        ...(held.some((o) => o.light) ? [{ label: `${held.filter((o) => o.light).length} earlier offers (summarised)`, value: fmt(sum(held.filter((o) => o.light).map((o) => o.amount))) }] : []),
      ],
    } as Source,
  };
}
