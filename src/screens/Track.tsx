/**
 * Track and review (P3): the funding record, sending an update, the programme, today's sessions, reports and Ask
 * Revivo. Plain words (docs/04 §1.1 and §6); every figure from the records; people decide.
 */
import { useState } from "react";
import {
  ArrowRight,
  Camera,
  CircleAlert,
  CircleCheck,
  FileText,
  MessageCircleQuestion,
  Printer,
  Receipt,
  Sparkles,
} from "lucide-react";
import { useStore } from "../state/store";
import {
  DATE,
  sessionDate,
  type Agreement,
  type Person,
  type World,
} from "../domain/model";
import {
  agreementTotals,
  counts,
  progressPaused,
  scheduleOf,
  nextInstalment,
  BEHAVIOUR_OF,
  claimsCheck,
  fmt,
  LAST_SLOT,
  programmeTotals,
  siteStatus,
} from "../domain/engine";
import {
  btn,
  Button,
  Chip,
  cn,
  Label,
  PageHead,
  Panel,
  SeeSource,
  SimulatedAI,
  toDollars,
  MoneyHint,
  type Source,
} from "../components/ui";
import { FundingBar, FundingLine } from "../components/money";
import { docNumber, FictionalDocument, type DocSpec } from "../components/Document";
import {
  ActionButton,
  athleteLabel,
  Empty,
  Field,
  inputCls,
  Message,
  recipientName,
  Row,
  Section,
  useAction,
} from "./common";
import { agreementSources, dayOf } from "./sources";

const HONESTY =
  "Delivery and spending records show what was delivered and spent; they do not on their own prove social impact.";

/* ------------------------------------------------------------- access */

/** Who may open a funding record: the funder's people, or the recipient side (athlete, guardian, authorised coach, organisation). */
export function sideOf(
  w: World,
  p: Person,
  g: Agreement,
): "funder" | "recipient" | null {
  if (p.funderId && p.funderId === w.funds[g.fundId].funderId) return "funder";
  if (g.recipientKind === "org")
    return p.orgId === g.recipientId ? "recipient" : null;
  const a = w.athletes[g.recipientId];
  if (!a) return null;
  if ((!a.minor && p.id === a.id) || a.guardianId === p.id) return "recipient";
  if (w.authorisations.some((z) => z.athleteId === a.id && z.coachId === p.id))
    return "recipient";
  return null;
}
const canAct = (w: World, p: Person, g: Agreement) => {
  if (g.recipientKind === "org")
    return (
      p.orgId === g.recipientId &&
      p.perms.some((x) => x === "Admin" || x === "Approve" || x === "Finance")
    );
  const a = w.athletes[g.recipientId];
  return (
    !!a &&
    ((!a.minor && p.id === a.id) ||
      a.guardianId === p.id ||
      w.authorisations.some(
        (z) =>
          z.athleteId === a.id &&
          z.coachId === p.id &&
          z.powers.includes("updates"),
      ))
  );
};

/* ------------------------------------------------------- the stages */

/** The Funding Line for one agreement, each stage in everyday words. */
export function AgreementStages({
  w,
  g,
  viewer,
  compact,
}: {
  w: World;
  g: Agreement;
  viewer: Person;
  compact?: boolean;
}) {
  const t = agreementTotals(w, g.id);
  const fund = w.funds[g.fundId];
  const commercial = BEHAVIOUR_OF(w, g.fundId) === "commercial";
  const programme = Object.values(w.programmes).find(
    (p) => p.agreementId === g.id,
  );
  const review = Object.values(w.reviews)
    .filter((r) => r.agreementId === g.id)
    .pop();
  const dels = Object.values(w.deliverables).filter(
    (d) => d.agreementId === g.id,
  );
  const progress = Object.values(w.progress).filter(
    (p) => p.agreementId === g.id,
  );
  const me = sideOf(w, viewer, g) === "recipient";
  const nodes = commercial
    ? [
        { short: "Agreed", full: "Sponsorship agreed", stat: fmt(g.amount) },
        { short: "Paid", full: "Paid", stat: t.paid ? fmt(t.paid) : "Not yet" },
        {
          short: "Deliverables",
          full: "Deliverables done",
          stat: dels.length
            ? `${dels.reduce((a, d) => a + d.done, 0)} of ${dels.reduce((a, d) => a + d.target, 0)}`
            : "—",
        },
        {
          short: "Reviewed",
          full: "Sponsor's review",
          stat: review?.decision ?? "Not yet",
        },
      ]
    : [
        {
          short: "Agreed",
          full: me ? "Agreed" : "Committed",
          stat: fmt(g.amount),
        },
        {
          short: "Paid",
          full: me ? "Paid to you" : "Paid",
          stat: t.paid ? fmt(t.paid) : "Not yet",
        },
        {
          short: "Received",
          full: "Arrival confirmed",
          stat: t.paid ? (t.received >= t.paid ? "Confirmed" : "Not yet") : "—",
        },
        {
          short: "Spent",
          full: "Spending recorded",
          stat: t.spent ? fmt(t.spent) : "Not yet",
        },
        {
          short: "Checked",
          full: "Spending checked by the funder",
          stat: t.checked ? fmt(t.checked) : "Not yet",
        },
        ...(programme
          ? [
              {
                short: "Report",
                full: "Report",
                stat:
                  Object.values(w.reports).find((r) => r.agreementId === g.id)
                    ?.status === "accepted"
                    ? "Accepted"
                    : Object.values(w.reports).some(
                          (r) =>
                            r.agreementId === g.id && r.status === "submitted",
                        )
                      ? "Sent"
                      : "Not yet",
              },
            ]
          : [
              {
                short: "Progress",
                full: "Sporting progress",
                stat: progress.length
                  ? `${progress.length} update${progress.length > 1 ? "s" : ""}`
                  : "Not yet",
              },
            ]),
        {
          short: "Reviewed",
          full: "Funder's review",
          stat: review?.decision ?? "Not yet",
        },
      ];
  const current = Math.max(
    0,
    nodes.findIndex((n) => n.stat === "Not yet" || n.stat === "—"),
  );
  const allDone = nodes.every((n) => n.stat !== "Not yet" && n.stat !== "—");
  const cur = allDone ? nodes.length - 1 : current;
  const line = (
    <FundingLine
      from={w.funders[fund.funderId].name}
      to={recipientName(w, g.recipientKind, g.recipientId, viewer)}
      current={cur}
      nodes={nodes}
    />
  );
  if (!compact) return line;
  // On phones every stage keeps its plain name: one short row each, the next stage marked in lime.
  return (
    <>
      <div className="md:hidden">
        <p className="text-small text-subtle">
          {w.funders[fund.funderId].name} → {recipientName(w, g.recipientKind, g.recipientId, viewer)}
        </p>
        <ol className="mt-2 border-t border-line" aria-label="Funding Line">
          {nodes.map((n, i) => {
            const isNext = i === cur && !allDone;
            return (
              <li key={n.short} className="flex items-center justify-between gap-3 border-b border-line py-2 text-small" aria-current={isNext ? "step" : undefined}>
                <span className="flex items-center gap-2.5">
                  <span aria-hidden="true" className={cn("size-2.5 shrink-0 rounded-full", isNext ? "bg-signal" : i < cur || allDone ? "bg-ink" : "border border-line-strong")} />
                  <span className={cn(isNext ? "font-medium text-ink" : i < cur || allDone ? "text-ink" : "text-muted")}>{n.full}</span>
                  {isNext && <span className="text-signal">· next</span>}
                </span>
                <span className="text-right tabular-nums text-subtle">{n.stat}</span>
              </li>
            );
          })}
        </ol>
      </div>
      <div className="hidden md:block">{line}</div>
    </>
  );
}

/* ------------------------------------------- fictional supporting documents */

/** A funder never sees a young athlete's club or coach, not even on a fictional receipt (docs/02 §7.3). */
const shielded = (w: World, athleteId: string | undefined, viewer: Person) => !!athleteId && !!w.athletes[athleteId]?.minor && !!viewer.funderId;

const ISSUER = (what: string, w: World, g: Agreement, viewer: Person) => {
  const t = what.toLowerCase();
  const club = g.recipientKind === "athlete" && !shielded(w, g.recipientId, viewer) ? w.athletes[g.recipientId]?.club : undefined;
  if (/coach|fee|training|session/.test(t)) return { issuer: club ?? "Halden Coaching Collective", line: "Coaching and training services", kind: "Invoice" as const };
  if (/travel|minibus|flight|train|bus|hotel/.test(t)) return { issuer: "Coastline Coach Travel", line: "Team and athlete travel", kind: "Receipt" as const };
  if (/entry|invitational|championship|series|race/.test(t)) return { issuer: "Competition Entries Office", line: "Event entries and accreditation", kind: "Receipt" as const };
  if (/survey|register|monitoring/.test(t)) return { issuer: "Fieldnote Research Services", line: "Surveys and registers", kind: "Invoice" as const };
  if (/hall|venue/.test(t)) return { issuer: "Westside Community Halls", line: "Hall hire", kind: "Invoice" as const };
  return { issuer: "Northline Sports Supplies", line: "Sports equipment and kit", kind: "Receipt" as const };
};

export function docForExpense(w: World, e: World["expenses"][string], viewer: Person): DocSpec {
  const g = w.agreements[e.agreementId];
  const i = ISSUER(e.what, w, g, viewer);
  return { kind: i.kind, issuer: i.issuer, issuerLine: i.line, number: docNumber(e.id, i.kind === "Invoice" ? "INV" : "RCT"), date: `${e.paidOn} 2027`, to: recipientName(w, g.recipientKind, g.recipientId, viewer), lines: [{ label: e.what, amount: e.amount }], note: "Paid in full (simulated)." };
}

export function docForProgress(w: World, p: World["progress"][string], viewer: Person): DocSpec {
  const a = p.athleteId ? w.athletes[p.athleteId] : undefined;
  const who = p.athleteId ? athleteLabel(w, p.athleteId, viewer) : w.orgs[p.orgId ?? ""]?.name ?? "";
  const hide = shielded(w, p.athleteId, viewer);
  const coach = p.attestedBy ? (hide ? "The athlete's coach (name withheld)" : w.people[p.attestedBy]?.name) : undefined;
  if (p.attestedBy && !p.proof)
    return { kind: "Training confirmation", issuer: hide ? "The athlete's club (name withheld)" : a?.club ?? "The athlete's club", issuerLine: "Coach's confirmation", number: docNumber(p.id, "TRN"), date: `${dayOf(p.at)} 2027`, to: who, lines: [{ label: p.text }], note: "I confirm this training record matches my session register.", signedBy: coach };
  const fed = a?.sport === "Judo" ? "Ardent Judo Federation" : `${a?.sport ?? "National"} federation results service`;
  return { kind: "Result confirmation", issuer: fed, issuerLine: "Official results list (fictional)", number: docNumber(p.id, "RES"), date: `${dayOf(p.at)} 2027`, to: who, lines: [{ label: p.text }], note: p.attestedBy ? `Also confirmed by ${hide ? "the athlete's coach" : `${coach} (coach)`}.` : "Entry matches the published results list.", signedBy: coach };
}

export function docForEvidence(w: World, d: World["deliverables"][string], i: number, viewer: Person): DocSpec {
  const g = w.agreements[d.agreementId];
  const ev = d.evidence![i];
  return { kind: "Activity evidence", issuer: recipientName(w, g.recipientKind, g.recipientId, viewer), issuerLine: `For ${w.funders[w.funds[g.fundId].funderId].name}`, number: docNumber(`${d.id}-${i}`, "ACT"), date: `${dayOf(ev.at)} 2027`, to: d.label, lines: [{ label: ev.text }, { label: "Photo: illustrative placeholder (no real image)" }], note: ev.accepted ? "Accepted by the sponsor." : "Waiting for the sponsor to accept." };
}

/* ------------------------------------------------- the funding record */

export function AgreementPage({
  persona,
  id,
}: {
  persona: Person;
  id: string;
}) {
  const { world: w } = useStore();
  const g = w.agreements[id];
  const [ask, setAsk] = useState(false);
  const [doc, setDoc] = useState<DocSpec | null>(null);
  const [docExpense, setDocExpense] = useState<string | null>(null);
  if (!g) return <Empty>This funding record does not exist.</Empty>;
  const side = sideOf(w, persona, g);
  if (!side)
    return (
      <Empty>
        This funding record is shared only with the funder and the person or
        organisation it supports.
      </Empty>
    );
  const fund = w.funds[g.fundId];
  const funder = w.funders[fund.funderId];
  const t = agreementTotals(w, id);
  const who = recipientName(w, g.recipientKind, g.recipientId, persona);
  const commercial = BEHAVIOUR_OF(w, g.fundId) === "commercial";
  const ex = Object.values(w.expenses).filter((e) => e.agreementId === id);
  const progress = Object.values(w.progress).filter(
    (p) => p.agreementId === id,
  );
  const reviews = Object.values(w.reviews).filter((r) => r.agreementId === id);
  const programme = Object.values(w.programmes).find(
    (p) => p.agreementId === id,
  );
  const report = Object.values(w.reports)
    .filter((r) => r.agreementId === id)
    .pop();
  const src = agreementSources(w, id, persona);
  const me = side === "recipient";
  const isFinance = side === "funder" && persona.perms.includes("Finance");
  const isReviewer =
    side === "funder" &&
    (persona.perms.includes("Review") || persona.perms.includes("Approve"));
  const minor =
    g.recipientKind === "athlete" && w.athletes[g.recipientId]?.minor;
  const photosOn =
    g.recipientKind === "athlete" &&
    w.consents.some(
      (z) => z.athleteId === g.recipientId && z.purpose === "photos" && z.value,
    );
  return (
    <div className="pb-10">
      <PageHead
        eyebrow={`${fund.type} · ${funder.name}${commercial ? " · commercial, kept apart from development money" : ""}`}
        title={
          me
            ? commercial
              ? "How is my sponsorship going?"
              : "How is this funding being used?"
            : `How is the money for ${who} being used?`
        }
        lead={`${fmt(g.amount)} ${me ? "agreed with" : "committed to"} ${me ? funder.name : who}${g.purpose ? ` · ${g.purpose}` : ""}${g.nextUpdate ? ` · ${g.nextUpdate}` : ""}`}
      />
      <ExistingFundingBanner persona={persona} g={g} />
      <div className="mt-2">
        <AgreementStages w={w} g={g} viewer={persona} compact />
      </div>
      <NextForRecord persona={persona} g={g} side={side} />

      <Section title={commercial ? "Payments" : "Where the money is"}>
        <div className="mt-4">
          <FundingBar
            m={t}
            audience={me ? "recipient" : "funder"}
            who={me && g.recipientKind === "athlete" && persona.id !== g.recipientId ? w.athletes[g.recipientId]?.name.split(" ")[0] : undefined}
            sources={src}
          />
        </div>
        {t.carriedPaid > 0 && (
          <p className="mt-3 text-small text-subtle">
            {fmt(t.carriedPaid)} was paid before this agreement joined Revivo
            Impact (carried in). It is shown apart and never counted as checked.
          </p>
        )}
        {isFinance &&
          t.stillToPay > 0 &&
          g.status !== "awaiting-approval" &&
          g.status !== "awaiting-recipient" && (
            <RecordPayment persona={persona} g={g} />
          )}
        {me &&
          t.toConfirm > 0 &&
          canAct(w, persona, g) &&
          persona.role !== "coach" && (
            <ActionButton
              className="mt-5"
              actor={persona.id}
              type="confirmReceipt"
              args={{ agreementId: id, entryId: `rc-${id}-${Date.now()}` }}
              success="Thank you. Arrival confirmed (your confirmation, not a bank check)."
            >
              Confirm I received {fmt(t.toConfirm)}
            </ActionButton>
          )}
      </Section>

      <PaymentSchedule g={g} me={me} />

      {!commercial && (
        <Section
          title="What the money was spent on"
          aside={
            me && canAct(w, persona, g) && t.paid > t.spent ? (
              <a
                className={btn("secondary", "min-h-10")}
                href={`#/app/${persona.id}/update/${id}`}
              >
                <Receipt className="size-4" aria-hidden="true" /> Add spending
              </a>
            ) : undefined
          }
        >
          {ex.length === 0 ? (
            <Empty>
              {me
                ? "Nothing recorded yet. Add what you spend as you go: it takes under a minute."
                : "Nothing recorded yet."}
            </Empty>
          ) : (
            <ul>
              {ex.map((e) => (
                <Row key={e.id}>
                  <div>
                    <p className="font-medium">
                      {e.what} ·{" "}
                      <span className="tabular-nums">{fmt(e.amount)}</span>
                    </p>
                    <p className="text-small text-subtle">
                      Paid {e.paidOn} ·{" "}
                      {e.receipt ? "receipt added" : "no receipt yet"}
                      {e.query && e.status === "query"
                        ? ` · ${funder.name} asked: “${e.query}”`
                        : ""}
                    </p>
                    {e.receipt && e.status !== "carried-in" && (
                      <button type="button" className="mt-1 inline-flex min-h-9 items-center text-small underline underline-offset-4 hover:text-signal" onClick={() => (setDoc(docForExpense(w, e, persona)), setDocExpense(e.id))}>
                        View the receipt
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Chip
                      kind={
                        e.status === "checked"
                          ? "verified"
                          : e.status === "query"
                            ? "attention"
                            : e.status === "carried-in"
                              ? "neutral"
                              : "awaiting"
                      }
                    >
                      {e.status === "checked"
                        ? "Checked"
                        : e.status === "query"
                          ? "Receipt needed"
                          : e.status === "carried-in"
                            ? "Carried in"
                            : "Waiting to be checked"}
                    </Chip>
                    {side === "funder" &&
                      (persona.perms.includes("Finance") ||
                        persona.perms.includes("Verify")) &&
                      (e.status === "reported" || e.status === "query") &&
                      e.receipt && (
                        <>
                          <ActionButton
                            actor={persona.id}
                            type="checkExpense"
                            args={{ expenseId: e.id }}
                            variant="secondary"
                            success="Checked against the receipt."
                          >
                            Receipt matches: check
                          </ActionButton>
                          {e.status === "reported" && <AskAbout persona={persona} expenseId={e.id} />}
                        </>
                      )}
                    {side === "funder" &&
                      (persona.perms.includes("Finance") ||
                        persona.perms.includes("Verify")) &&
                      e.status === "reported" &&
                      !e.receipt && (
                        <ActionButton
                          actor={persona.id}
                          type="queryExpense"
                          args={{
                            expenseId: e.id,
                            reason: "Please add the receipt.",
                          }}
                          variant="secondary"
                          success="Asked for the receipt."
                        >
                          Ask for the receipt
                        </ActionButton>
                      )}
                    {me &&
                      canAct(w, persona, g) &&
                      !e.receipt &&
                      e.status !== "carried-in" && (
                        <ActionButton
                          actor={persona.id}
                          type="addReceipt"
                          args={{ expenseId: e.id }}
                          variant="secondary"
                          success="Receipt added (simulated)."
                        >
                          Add the receipt
                        </ActionButton>
                      )}
                  </div>
                </Row>
              ))}
            </ul>
          )}
        </Section>
      )}

      {programme && (
        <Section title="The programme">
          <ul>
            <Row>
              <span>
                {programme.name}: {programmeTotals(w, programme.id).delivered}{" "}
                sessions run so far across {programme.sites.length} sites
              </span>
              <a
                className={btn("secondary", "min-h-10")}
                href={`#/app/${persona.id}/programme/${programme.id}`}
              >
                Is it on track?{" "}
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>
            </Row>
            <Row>
              <span>
                {report
                  ? `Report for ${report.period}: ${report.status === "accepted" ? "accepted" : report.status === "submitted" ? "sent, waiting for the funder" : report.status === "returned" ? "returned with a question" : "draft"}`
                  : "No report yet for this quarter."}
              </span>
              <a
                className={btn(
                  report?.status === "submitted" && isReviewer
                    ? "primary"
                    : "secondary",
                  "min-h-10",
                )}
                href={`#/app/${persona.id}/report/${id}`}
              >
                <FileText className="size-4" aria-hidden="true" />{" "}
                {me
                  ? report
                    ? "Open the report"
                    : "Write the report"
                  : "Read the report"}
              </a>
            </Row>
          </ul>
        </Section>
      )}

      {!commercial && !programme && (
        <Section
          title="Sporting progress"
          aside={
            me && canAct(w, persona, g) ? (
              <a
                className={btn("secondary", "min-h-10")}
                href={`#/app/${persona.id}/update/${id}?progress`}
              >
                Share progress
              </a>
            ) : undefined
          }
        >
          {side === "funder" && g.recipientKind === "athlete" && progressPaused(w, g.recipientId) ? (
            <Empty>Progress sharing is paused by the {minor ? "guardian" : "athlete"}. Earlier updates are hidden until it is turned back on; a person at your organisation can follow up. Nothing is penalised automatically.</Empty>
          ) : progress.length === 0 ? (
            <Empty>No updates yet.</Empty>
          ) : (
            <ul>
              {progress.map((p) => (
                <Row key={p.id}>
                  <div>
                    <p className="font-medium">{p.text}</p>
                    <p className="text-small text-subtle">
                      {p.kind === "result"
                        ? "Result"
                        : p.kind === "training"
                          ? "Training"
                          : "Milestone"}{" "}
                      · {dayOf(p.at)} ·{" "}
                      {p.proof ? "proof attached" : "no proof attached"}
                      {p.attestedBy
                        ? ` · confirmed by ${minor && !me ? "the athlete's coach" : `${w.people[p.attestedBy]?.name} (coach)`}`
                        : ""}
                      {p.by !== g.recipientId && w.people[p.by]
                        ? ` · sent by ${minor && !me ? "the athlete's coach" : w.people[p.by].name}`
                        : ""}
                    </p>
                    {(p.proof || p.attestedBy) && (
                      <button type="button" className="mt-1 inline-flex min-h-9 items-center text-small underline underline-offset-4 hover:text-signal" onClick={() => setDoc(docForProgress(w, p, persona))}>
                        View the {p.attestedBy && !p.proof ? "coach's confirmation" : "proof"}
                      </button>
                    )}
                  </div>
                  {p.photo &&
                    (photosOn ? (
                      <Chip kind="neutral">
                        <Camera className="size-3.5" aria-hidden="true" /> Photo
                        (consent on)
                      </Chip>
                    ) : (
                      <Chip kind="self">
                        Photo withdrawn by {minor ? "guardian" : "athlete"}
                      </Chip>
                    ))}
                </Row>
              ))}
            </ul>
          )}
        </Section>
      )}

      {commercial && <Deliverables persona={persona} g={g} side={side} />}

      <Section title="Reviews">
        {reviews.length === 0 ? (
          <Empty>
            No review yet.{" "}
            {side === "funder"
              ? "Review once spending and progress are in."
              : "The funder reviews once spending and progress are in."}
          </Empty>
        ) : (
          <ul>
            {reviews.map((r) => (
              <Row key={r.id}>
                <span>
                  <span className="font-medium">{r.decision}</span>
                  {r.conditions ? `: ${r.conditions}` : ""}
                </span>
                <span className="text-small text-subtle">
                  {w.people[r.by]?.name} · {dayOf(r.at)}
                </span>
              </Row>
            ))}
          </ul>
        )}
        {isReviewer &&
          g.status !== "awaiting-approval" &&
          g.status !== "awaiting-recipient" && (
            <RecordReview persona={persona} g={g} />
          )}
      </Section>

      {side === "funder" && (
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            type="button"
            className={btn("secondary")}
            onClick={() => setAsk(true)}
          >
            <MessageCircleQuestion className="size-4" aria-hidden="true" /> Ask
            Revivo about this record
          </button>
          <SimulatedAI />
        </div>
      )}
      <AskRevivo
        open={ask}
        onClose={() => setAsk(false)}
        persona={persona}
        agreementId={id}
      />
      <Panel open={!!doc} onClose={() => (setDoc(null), setDocExpense(null))} eyebrow="Supporting document · fictional" title={doc ? `${doc.kind} · ${doc.issuer}` : ""}>
        {doc && <FictionalDocument d={doc} />}
        {docExpense && side === "funder" && (persona.perms.includes("Finance") || persona.perms.includes("Verify")) && ["reported", "query"].includes(w.expenses[docExpense]?.status ?? "") && w.expenses[docExpense].by !== persona.id && (
          <ActionButton className="mt-5" actor={persona.id} type="checkExpense" args={{ expenseId: docExpense }} success="Checked against the receipt.">
            Receipt matches: check
          </ActionButton>
        )}
      </Panel>
      <p className="mt-8 text-small text-subtle">{HONESTY}</p>
    </div>
  );
}

/** The one next step for this viewer on this record. */
function NextForRecord({
  persona,
  g,
  side,
}: {
  persona: Person;
  g: Agreement;
  side: "funder" | "recipient";
}) {
  const { world: w } = useStore();
  const t = agreementTotals(w, g.id);
  const ex = Object.values(w.expenses).filter((e) => e.agreementId === g.id);
  if (g.status && g.status !== "active") return null;
  let msg: string | null = null;
  let action: React.ReactNode = null;
  const query = ex.find((e) => e.status === "query");
  if (side === "recipient" && canAct(w, persona, g)) {
    if (t.toConfirm > 0 && persona.role !== "coach") {
      msg = `Confirm that ${fmt(t.toConfirm)} arrived.`;
      action = (
        <ActionButton actor={persona.id} type="confirmReceipt" args={{ agreementId: g.id, entryId: `rc-${g.id}-${Date.now()}` }} success="Thank you. Arrival confirmed.">
          Confirm I received {fmt(t.toConfirm)}
        </ActionButton>
      );
    } else if (query) {
      msg = `The funder asked for the receipt for “${query.what}”.`;
      action = (
        <ActionButton actor={persona.id} type="addReceipt" args={{ expenseId: query.id }} success="Receipt added (simulated). The funder can check it now.">
          Add the receipt
        </ActionButton>
      );
    } else if (t.paid > t.spent && BEHAVIOUR_OF(w, g.fundId) !== "commercial") {
      msg = `${fmt(t.paid - t.spent)} is not yet accounted for.`;
      action = (
        <a className={btn("primary")} href={`#/app/${persona.id}/update/${g.id}`}>
          Add spending
        </a>
      );
    }
  } else if (side === "funder") {
    const toCheck = ex.filter((e) => e.status === "reported" && e.receipt);
    if (toCheck.length && (persona.perms.includes("Finance") || persona.perms.includes("Verify")))
      msg = `${toCheck.length} expense${toCheck.length > 1 ? "s" : ""} to check (${fmt(toCheck.reduce((a, e) => a + e.amount, 0))}), listed below.`;
    else if (t.stillToPay > 0 && t.paid === 0 && persona.perms.includes("Finance")) msg = "Record the first payment, below.";
  }
  if (!msg) return null;
  return (
    <div role="status" className="mt-6 flex flex-col gap-3 border-l-2 border-signal pl-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="font-medium">Next: {msg}</p>
      {action}
    </div>
  );
}

function ExistingFundingBanner({
  persona,
  g,
}: {
  persona: Person;
  g: Agreement;
}) {
  const { world: w } = useStore();
  if (g.origin !== "Existing agreement" || g.status === "active") return null;
  const ci = w.carriedIn?.[g.id];
  const fid = w.funds[g.fundId].funderId;
  return (
    <div className="mb-6 border-l-2 border-amber pl-4">
      <p className="font-medium">
        {g.status === "awaiting-approval"
          ? "Existing funding, waiting for a second person to approve it"
          : g.status === "awaiting-recipient"
            ? `Waiting for ${w.orgs[g.recipientId]?.name} to confirm the figures`
            : "The recipient disputed the figures"}
      </p>
      <p className="text-small text-muted">
        Prepared by {w.people[g.preparedBy ?? ""]?.name}. Paid before joining:{" "}
        {fmt(ci?.paid ?? 0)} · spent before joining: {fmt(ci?.spent ?? 0)}.
        {g.disputeReason ? ` Reason: “${g.disputeReason}”.` : ""}
      </p>
      {g.status === "awaiting-approval" &&
        persona.funderId === fid &&
        persona.perms.includes("Approve") &&
        persona.id !== g.preparedBy && (
          <ActionButton
            className="mt-3"
            actor={persona.id}
            type="approveExistingFunding"
            args={{ agreementId: g.id }}
            success="Approved. The recipient now confirms the figures."
          >
            Approve this funding
          </ActionButton>
        )}
      {g.status === "awaiting-recipient" && persona.orgId === g.recipientId && (
        <div className="mt-3 flex flex-wrap gap-3">
          <ActionButton
            actor={persona.id}
            type="confirmExistingFunding"
            args={{ agreementId: g.id, agree: true }}
            success="Confirmed. The agreement is active."
          >
            The figures are right
          </ActionButton>
          <ActionButton
            actor={persona.id}
            type="confirmExistingFunding"
            args={{
              agreementId: g.id,
              agree: false,
              reason: "The amount already spent is different in our records.",
            }}
            variant="secondary"
            success="Sent back with your reason."
          >
            Something is wrong
          </ActionButton>
        </div>
      )}
    </div>
  );
}

/** "When will the money come?" Both sides see the same schedule; scheduled is never shown as paid. */
function PaymentSchedule({ g, me }: { g: Agreement; me: boolean }) {
  const { world: w } = useStore();
  const sc = scheduleOf(w, g.id);
  const t = agreementTotals(w, g.id);
  if (sc.length < 2 && sc[0]?.status === "paid") return null;
  const nx = sc.find((x) => x.status !== "paid");
  const word: Record<string, string> = { paid: "Paid", "part-paid": "Part paid", due: "Due now", waiting: "Due, waiting on a condition", expected: "Expected", "on-hold": "On hold after the review" };
  return (
    <Section title="When will the money come?">
      <p className="mt-4">
        <span className="font-medium">{fmt(g.amount)}</span> {me ? "agreed" : "committed"} · <span className="font-medium">{fmt(t.paid)}</span> paid · <span className="font-medium">{fmt(t.stillToPay)}</span> still to pay
        {nx ? (
          <>
            {" "}· next: <span className="font-medium">{fmt(nx.amount - nx.paid)}</span> {nx.status === "due" ? "due now" : `expected ${nx.dueLabel}`}
            {nx.condition && !nx.conditionMet ? `, once ${nx.condition}` : ""}
          </>
        ) : null}
      </p>
      <ol className="mt-3">
        {sc.map((x) => (
          <li key={x.n} className="grid grid-cols-[1fr_auto] gap-x-4 border-b border-line py-3 sm:grid-cols-[14rem_7rem_1fr_auto]">
            <span className="font-medium">{x.dueLabel}</span>
            <span className="text-right tabular-nums sm:text-left">{fmt(x.amount)}</span>
            <span className="col-span-2 text-small text-subtle sm:col-span-1">{x.condition ? `Condition: ${x.condition}${x.conditionMet ? " (met)" : ""}` : "No condition"}</span>
            <span className="col-span-2 text-small sm:col-span-1 sm:text-right">
              {word[x.status]}
              {x.status === "paid" ? (x.received >= x.amount ? " · arrival confirmed" : " · not yet confirmed") : ""}
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-2 text-small text-subtle">A schedule shows what is planned. Only a recorded payment counts as paid (simulated: no money moves).</p>
    </Section>
  );
}

function RecordPayment({ persona, g }: { persona: Person; g: Agreement }) {
  const { world: w } = useStore();
  const t = agreementTotals(w, g.id);
  const halves = ["Scholarship award", "Sponsorship agreement"].includes(
    w.funds[g.fundId].type,
  );
  // The amount starts at what the schedule says is due now (never the whole balance), and only when nothing asks
  // finance to hold: a review that did not say "Continue" leaves it empty for a person to decide (P5 review).
  const nx = nextInstalment(w, g.id);
  const sched = scheduleOf(w, g.id);
  const dueNow = sched.filter((x) => x.status === "due" || x.status === "part-paid").reduce((a, x) => a + x.amount - x.paid, 0);
  const waitingFor = sched.find((x) => x.status !== "paid" && x.status !== "due" && x.status !== "part-paid");
  const lastReview = Object.values(w.reviews).filter((r) => r.agreementId === g.id).pop();
  const hold = !!lastReview && lastReview.decision !== "Continue";
  const [amount, setAmount] = useState(
    hold ? "" : String(dueNow || (nx ? nx.amount - nx.paid : halves && t.paid === 0 ? g.amount / 2 : t.stillToPay)),
  );
  const act = useAction(persona.id);
  const [paidOn, setPaidOn] = useState(DATE[w.moment]);
  const [ref, setRef] = useState("");
  const cond = Object.values(w.reviews)
    .filter((r) => r.agreementId === g.id)
    .pop();
  if (dueNow === 0 && t.stillToPay > 0)
    return (
      <div className="mt-6 border-t border-line pt-5">
        <Label>Record a payment (simulated)</Label>
        <p className="mt-2 text-muted">
          Nothing is due yet.{" "}
          {waitingFor ? `The next payment, ${fmt(waitingFor.amount - waitingFor.paid)} (${waitingFor.dueLabel}), ${waitingFor.condition && !waitingFor.conditionMet ? `waits until ${waitingFor.condition}` : "is not due yet"}.` : ""}
        </p>
      </div>
    );
  return (
    <div className="mt-6 border-t border-line pt-5">
      <Label>Record a payment (simulated)</Label>
      <div className="mt-2 flex flex-wrap items-end gap-3">
        <div>
          <label htmlFor={`pay-${g.id}`} className="block text-small text-subtle">
            Amount (USD), {fmt(t.stillToPay)} still to pay
          </label>
          <input
            id={`pay-${g.id}`}
            inputMode="numeric"
            className={cn(inputCls, "mt-1 max-w-[10rem]")}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <MoneyHint value={amount} />
        </div>
        <div>
          <label htmlFor={`pay-on-${g.id}`} className="block text-small text-subtle">
            Date paid
          </label>
          <input
            id={`pay-on-${g.id}`}
            type="date"
            max={DATE[w.moment]}
            className={cn(inputCls, "mt-1 max-w-[11rem]")}
            value={paidOn}
            onChange={(e) => setPaidOn(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor={`pay-ref-${g.id}`} className="block text-small text-subtle">
            Your payment reference (optional)
          </label>
          <input
            id={`pay-ref-${g.id}`}
            className={cn(inputCls, "mt-1 max-w-[14rem]")}
            value={ref}
            maxLength={40}
            placeholder="For example, a bank transfer number"
            onChange={(e) => setRef(e.target.value)}
          />
        </div>
        <Button
          variant={cond?.decision === "Continue" || !cond ? "primary" : "secondary"}
          onClick={() =>
            act.run(
              "recordRelease",
              { agreementId: g.id, amount: toDollars(amount), ref, paidOn, entryId: `le-${g.id}-${Date.now()}` },
              "Payment recorded. The recipient confirms when it arrives.",
            )
          }
        >
          Record payment
        </Button>
      </div>
      {cond && cond.decision !== "Continue" && (
        <p className="mt-2 text-small text-amber">
          Check first: the last review said “{cond.decision}
          {cond.conditions ? `: ${cond.conditions}` : ""}”.
        </p>
      )}
      <p className="mt-2 text-small text-subtle">
        This records a payment your finance team made. Revivo Impact never moves
        money.
      </p>
      <Message error={act.error} done={act.done} />
    </div>
  );
}

function RecordReview({ persona, g }: { persona: Person; g: Agreement }) {
  const { world: w } = useStore();
  const [decision, setDecision] = useState<
    "" | "Continue" | "Continue with conditions" | "Pause" | "Close"
  >("");
  const recent = Object.values(w.reviews).some((r) => r.agreementId === g.id && r.at === w.moment);
  const [again, setAgain] = useState(false);
  const [conditions, setConditions] = useState("");
  const act = useAction(persona.id);
  if (recent && !again)
    return (
      <button type="button" className={btn("quiet", "mt-4")} onClick={() => setAgain(true)}>
        Record another review
      </button>
    );
  return (
    <div className="mt-6 border-t border-line pt-5">
      <fieldset>
        <legend className="font-medium">Your decision</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {(
            ["Continue", "Continue with conditions", "Pause", "Close"] as const
          ).map((d) => (
            <label
              key={d}
              className={cn(
                "inline-flex min-h-11 cursor-pointer items-center rounded-full border px-4 text-small",
                decision === d
                  ? "border-ink bg-ink font-medium text-canvas before:content-['✓']"
                  : "border-line-strong",
              )}
            >
              <input
                type="radio"
                name={`dec-${g.id}`}
                className="sr-only"
                checked={decision === d}
                onChange={() => setDecision(d)}
              />
              {d}
            </label>
          ))}
        </div>
      </fieldset>
      {decision !== "Continue" && (
        <Field
          label={
            decision === "Continue with conditions"
              ? "The conditions"
              : "The reason"
          }
          htmlFor={`cond-${g.id}`}
        >
          <textarea
            id={`cond-${g.id}`}
            rows={2}
            className="w-full rounded-[6px] border border-control bg-surface-2 p-3 text-ink"
            value={conditions}
            onChange={(e) => setConditions(e.target.value)}
            placeholder={
              decision === "Continue with conditions"
                ? "For example: next payment once the missing receipt is added"
                : "Say why"
            }
          />
        </Field>
      )}
      <Button
        className="mt-4"
        variant="secondary"
        onClick={() =>
          act.run(
            "recordReview",
            {
              reviewId: `rv-${g.id}-${Date.now()}`,
              agreementId: g.id,
              decision,
              conditions: conditions || undefined,
            },
            "Review recorded.",
          )
        }
      >
        Record the review
      </Button>
      <Message error={act.error} done={act.done} />
    </div>
  );
}

/** Ask the recipient about one expense, in your own words (a question needs a reason). */
function AskAbout({ persona, expenseId }: { persona: Person; expenseId: string }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  if (!open)
    return (
      <button type="button" className={btn("quiet", "min-h-10")} onClick={() => setOpen(true)}>
        Ask a question
      </button>
    );
  return (
    <div className="flex w-full flex-wrap items-end gap-2">
      <label className="min-w-56 flex-1 text-small">
        <span className="text-subtle">Your question</span>
        <input className={cn(inputCls, "mt-1")} value={q} onChange={(e) => setQ(e.target.value)} placeholder="For example: is this the June or July invoice?" />
      </label>
      <ActionButton actor={persona.id} type="queryExpense" args={{ expenseId, reason: q }} variant="secondary" success="Sent. It shows as a question until they answer.">
        Send
      </ActionButton>
    </div>
  );
}

function Deliverables({
  persona,
  g,
  side,
}: {
  persona: Person;
  g: Agreement;
  side: "funder" | "recipient";
}) {
  const { world: w } = useStore();
  const [doc, setDoc] = useState<DocSpec | null>(null);
  const dels = Object.values(w.deliverables).filter(
    (d) => d.agreementId === g.id,
  );
  return (
    <Section title="What was agreed in return">
      {dels.length === 0 ? (
        <Empty>No deliverables recorded.</Empty>
      ) : (
        <ul>
          {dels.map((d) => (
            <Row key={d.id}>
              <div>
                <p className="font-medium">{d.label}</p>
                <p className="text-small text-subtle">
                  {d.done} of {d.target} done
                  {d.pending ? ` · ${d.pending} waiting for the sponsor` : ""}
                </p>
                {(d.evidence ?? []).map((ev, i) => (
                  <button key={i} type="button" className="mt-1 block min-h-9 text-left text-small underline underline-offset-4 hover:text-signal" onClick={() => setDoc(docForEvidence(w, d, i, persona))}>
                    View proof {i + 1}: {ev.text}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <Chip
                  kind={
                    d.status === "complete"
                      ? "verified"
                      : d.done || d.pending
                        ? "awaiting"
                        : "self"
                  }
                >
                  {d.status === "complete"
                    ? "Done"
                    : d.done || d.pending
                      ? "Under way"
                      : "Not started"}
                </Chip>
                {side === "recipient" &&
                  persona.id === g.recipientId &&
                  d.done + d.pending < d.target && (
                    <a
                      className={d.id === dels.find((x) => x.done + x.pending < x.target)?.id ? btn("secondary", "min-h-10") : "inline-flex min-h-10 items-center text-small underline underline-offset-4"}
                      href={`#/app/${persona.id}/update/${g.id}?proof`}
                    >
                      Send proof
                    </a>
                  )}
                {side === "funder" &&
                  d.pending > 0 &&
                  (persona.perms.includes("Approve") ||
                    persona.perms.includes("Review")) && (
                    <ActionButton
                      actor={persona.id}
                      type="acceptDeliverable"
                      args={{ deliverableId: d.id }}
                      success="Accepted."
                    >
                      Accept the proof
                    </ActionButton>
                  )}
              </div>
            </Row>
          ))}
        </ul>
      )}
      <p className="mt-3 text-small text-subtle">
        Deliverables are counted, never turned into money.
      </p>
    <Panel open={!!doc} onClose={() => setDoc(null)} eyebrow="Supporting document · fictional" title={doc ? `${doc.kind} · ${doc.issuer}` : ""}>
        {doc && <FictionalDocument d={doc} />}
      </Panel>
    </Section>
  );
}

/* ------------------------------------------------------ send an update */

export function UpdatePage({ persona, id }: { persona: Person; id: string }) {
  const { world: w, go } = useStore();
  const mine = Object.values(w.agreements).filter(
    (g) =>
      sideOf(w, persona, g) === "recipient" &&
      canAct(w, persona, g) &&
      g.status !== "awaiting-approval",
  );
  const [agId, setAgId] = useState(
    id && w.agreements[id] ? id : (mine[0]?.id ?? ""),
  );
  const g = w.agreements[agId];
  const commercial = g ? BEHAVIOUR_OF(w, g.fundId) === "commercial" : false;
  const initial = location.hash.includes("?progress")
    ? "progress"
    : location.hash.includes("?proof") || commercial
      ? "proof"
      : "spending";
  const [kind, setKind] = useState<"spending" | "progress" | "proof">(initial);
  if (!g || !mine.some((x) => x.id === g.id))
    return <Empty>There is no funding for you to update yet.</Empty>;
  // A guardian or coach sending an update writes about the athlete, not about themselves.
  const forOther = g.recipientKind === "athlete" && persona.id !== g.recipientId ? w.athletes[g.recipientId]?.name.split(" ")[0] : undefined;
  const back = () => go(`app/${persona.id}/agreement/${g.id}`);
  return (
    <div className="max-w-2xl pb-10">
      <PageHead
        eyebrow="Send an update"
        title={
          kind === "spending"
            ? forOther ? `What did ${forOther} spend money on?` : "What did you spend money on?"
            : kind === "progress"
              ? forOther ? `What happened in ${forOther}'s sport?` : "What happened in your sport?"
              : "What have you done for your sponsor?"
        }
      />
      {mine.length > 1 && (
        <Field label="Which funding is this for?" htmlFor="up-ag">
          <select
            id="up-ag"
            className={inputCls}
            value={agId}
            onChange={(e) => setAgId(e.target.value)}
          >
            {mine.map((x) => (
              <option key={x.id} value={x.id}>
                {w.funds[x.fundId].type} from{" "}
                {w.funders[w.funds[x.fundId].funderId].name} ({fmt(x.amount)})
              </option>
            ))}
          </select>
        </Field>
      )}
      <div
        className="mt-6 flex flex-wrap gap-2"
        role="group"
        aria-label="Type of update"
      >
        {(commercial
          ? (["proof"] as const)
          : (["spending", "progress"] as const)
        ).map((k) => (
          <button
            key={k}
            type="button"
            aria-pressed={kind === k}
            onClick={() => setKind(k)}
            className={cn(
              "min-h-11 rounded-full border px-5 text-small",
              kind === k
                ? "border-ink bg-ink font-medium text-canvas before:content-['✓']"
                : "border-line-strong",
            )}
          >
            {k === "spending"
              ? "Spending"
              : k === "progress"
                ? "Sporting progress"
                : "Sponsorship proof"}
          </button>
        ))}
      </div>
      {kind === "spending" && (
        <SpendingForm persona={persona} g={g} onDone={back} />
      )}
      {kind === "progress" && (
        <ProgressForm persona={persona} g={g} onDone={back} />
      )}
      {kind === "proof" && <ProofForm persona={persona} g={g} onDone={back} />}
    </div>
  );
}

function SpendingForm({
  persona,
  g,
  onDone,
}: {
  persona: Person;
  g: Agreement;
  onDone: () => void;
}) {
  const { world: w, setNotice } = useStore();
  const t = agreementTotals(w, g.id);
  const [what, setWhat] = useState("");
  const [amount, setAmount] = useState("");
  const [paidOn, setPaidOn] = useState("2027-06-30");
  const [receipt, setReceipt] = useState(false);
  const act = useAction(persona.id);
  const day = (d: string) =>
    new Date(d + "T12:00:00Z")
      .toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
        timeZone: "UTC",
      })
      .replace(",", "");
  return (
    <form
      className="mt-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (!what.trim()) return act.fail("Say what the money was spent on.");
        if (
          act.run(
            "addExpense",
            {
              expenseId: `ex-${g.id}-${Date.now()}`,
              agreementId: g.id,
              what,
              amount: toDollars(amount),
              paidOn: day(paidOn),
              receipt,
            },
            "Added.",
          )
        ) {
          setNotice(`${what.trim()} · ${fmt(toDollars(amount))} added. ${receipt ? "Waiting to be checked by the funder." : "Add the receipt when you have it."}`);
          onDone();
        }
      }}
    >
      <p className="mt-4 text-small text-muted">
        {fmt(t.paid - t.spent)} of the money paid is not yet accounted for.
      </p>
      <Field label="What was it for?" htmlFor="sp-what">
        <input
          id="sp-what"
          className={inputCls}
          value={what}
          onChange={(e) => setWhat(e.target.value)}
          placeholder="For example: coaching fees for June"
        />
      </Field>
      <div className="grid gap-x-4 sm:grid-cols-2">
        <Field label="How much? (USD)" htmlFor="sp-amount">
          <input
            id="sp-amount"
            inputMode="numeric"
            className={inputCls}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <MoneyHint value={amount} />
        </Field>
        <Field label="When did you pay?" htmlFor="sp-date">
          <input
            id="sp-date"
            type="date"
            className={inputCls}
            value={paidOn}
            max="2027-06-30"
            onChange={(e) => setPaidOn(e.target.value)}
          />
        </Field>
      </div>
      <div className="mt-5">
        <button
          type="button"
          aria-pressed={receipt}
          onClick={() => setReceipt((r) => !r)}
          className={btn("secondary")}
        >
          {receipt ? (
            <CircleCheck className="size-4 text-ok" aria-hidden="true" />
          ) : (
            <Receipt className="size-4" aria-hidden="true" />
          )}{" "}
          {receipt
            ? "Receipt added (tap to remove)"
            : "Add a photo of the receipt"}
        </button>
        <p className="mt-2 text-small text-subtle">
          Simulated: nothing is uploaded. No receipt yet? Add it later; the
          funder checks spending against receipts.
        </p>
      </div>
      <Button className="mt-6" type="submit">
        Add spending
      </Button>
      <Message error={act.error} done={act.done} />
    </form>
  );
}

function ProgressForm({
  persona,
  g,
  onDone,
}: {
  persona: Person;
  g: Agreement;
  onDone: () => void;
}) {
  const { world: w, setNotice } = useStore();
  const [kind, setKind] = useState<"result" | "training" | "milestone">(
    "result",
  );
  const [text, setText] = useState("");
  const [proof, setProof] = useState(false);
  const [photo, setPhoto] = useState(false);
  const act = useAction(persona.id);
  const athleteId = g.recipientKind === "athlete" ? g.recipientId : undefined;
  const photosOn =
    !!athleteId &&
    w.consents.some(
      (z) => z.athleteId === athleteId && z.purpose === "photos" && z.value,
    );
  return (
    <form
      className="mt-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (
          act.run(
            "sendProgress",
            {
              progressId: `pr-${g.id}-${Date.now()}`,
              agreementId: g.id,
              athleteId,
              orgId: athleteId ? undefined : g.recipientId,
              kind,
              text,
              proof,
              photo: photo || undefined,
            },
            "Sent. The funder sees it on the funding record.",
          )
        ) {
          setNotice("Update sent. The funder sees it on this record.");
          onDone();
          }
      }}
    >
      <fieldset className="mt-6">
        <legend className="font-medium">What kind of update?</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {(["result", "training", "milestone"] as const).map((k) => (
            <label
              key={k}
              className={cn(
                "inline-flex min-h-11 cursor-pointer items-center rounded-full border px-4 text-small",
                kind === k
                  ? "border-ink bg-ink font-medium text-canvas before:content-['✓']"
                  : "border-line-strong",
              )}
            >
              <input
                type="radio"
                name="pk"
                className="sr-only"
                checked={kind === k}
                onChange={() => setKind(k)}
              />
              {k === "result"
                ? "A result"
                : k === "training"
                  ? "Training"
                  : "Something else"}
            </label>
          ))}
        </div>
      </fieldset>
      <Field label="In a sentence" htmlFor="pg-text">
        <input
          id="pg-text"
          className={inputCls}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={
            kind === "result"
              ? "For example: 5th place, −63kg, Continental U21 Invitational"
              : kind === "training"
                ? "For example: 34 of 36 training sessions in May and June"
                : "For example: selected for the regional squad"
          }
        />
      </Field>
      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          aria-pressed={proof}
          onClick={() => setProof((v) => !v)}
          className={btn("secondary")}
        >
          {proof ? (
            <CircleCheck className="size-4 text-ok" aria-hidden="true" />
          ) : (
            <FileText className="size-4" aria-hidden="true" />
          )}{" "}
          {proof ? "Proof added" : "Add proof (results sheet, certificate)"}
        </button>
        {photosOn ? (
          <button
            type="button"
            aria-pressed={photo}
            onClick={() => setPhoto((v) => !v)}
            className={btn("secondary")}
          >
            <Camera className="size-4" aria-hidden="true" />{" "}
            {photo ? "Photo added" : "Add a photo"}
          </button>
        ) : null}
      </div>
      {!photosOn && athleteId && (
        <p className="mt-2 text-small text-subtle">
          Photos are off.{" "}
          {w.athletes[athleteId]?.minor ? "The guardian" : "You"} can turn them
          on in Consent &amp; safety.
        </p>
      )}
      <Button className="mt-6" type="submit">
        Send update
      </Button>
      <Message error={act.error} done={act.done} />
    </form>
  );
}

function ProofForm({
  persona,
  g,
  onDone,
}: {
  persona: Person;
  g: Agreement;
  onDone: () => void;
}) {
  const { world: w, setNotice } = useStore();
  const dels = Object.values(w.deliverables).filter(
    (d) => d.agreementId === g.id && d.done + d.pending < d.target,
  );
  const [did, setDid] = useState(dels[0]?.id ?? "");
  const [evidence, setEvidence] = useState("");
  const act = useAction(persona.id);
  if (!dels.length)
    return <Empty>Everything agreed has been sent. Nothing to add.</Empty>;
  return (
    <form
      className="mt-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (
          act.run(
            "submitDeliverable",
            { deliverableId: did, evidence },
            "Sent to your sponsor.",
          )
        ) {
          setNotice("Proof sent to your sponsor.");
          onDone();
          }
      }}
    >
      <Field label="Which one?" htmlFor="pf-d">
        <select
          id="pf-d"
          className={inputCls}
          value={did}
          onChange={(e) => setDid(e.target.value)}
        >
          {dels.map((d) => (
            <option key={d.id} value={d.id}>
              {d.label} ({d.done} of {d.target} done)
            </option>
          ))}
        </select>
      </Field>
      <Field label="What does your proof show?" htmlFor="pf-e">
        <input
          id="pf-e"
          className={inputCls}
          value={evidence}
          onChange={(e) => setEvidence(e.target.value)}
          placeholder="For example: kit worn at the Southern Open, photo attached"
        />
      </Field>
      <Button className="mt-6" type="submit">
        Send proof
      </Button>
      <Message error={act.error} done={act.done} />
    </form>
  );
}

/* --------------------------------------------------------- programme */

export function ProgrammePage({
  persona,
  id,
}: {
  persona: Person;
  id?: string;
}) {
  const { world: w } = useStore();
  const p =
    (id && w.programmes[id]) ||
    Object.values(w.programmes).find((x) => x.orgId === persona.orgId) ||
    Object.values(w.programmes).find(
      (x) =>
        persona.funderId &&
        w.funds[w.agreements[x.agreementId].fundId].funderId ===
          persona.funderId,
    );
  const [ask, setAsk] = useState(false);
  if (!p) return <Empty>No programme to show.</Empty>;
  const g = w.agreements[p.agreementId];
  const staff = persona.orgId === p.orgId;
  const funder =
    !!persona.funderId && w.funds[g.fundId].funderId === persona.funderId;
  if (!staff && !funder)
    return (
      <Empty>
        This programme is shared only with its organisation and its funder.
      </Empty>
    );
  const t = programmeTotals(w, p.id);
  const money = agreementTotals(w, g.id);
  const alerts = t.sites.filter((s) => s.alert);
  return (
    <div className="pb-10">
      <PageHead
        eyebrow={`${p.name} · ${w.orgs[p.orgId].name}${funder ? ` · funded by ${w.funders[persona.funderId!].name}` : ""}`}
        title={`Is ${p.name} on track?`}
        lead={`${t.due < t.planned ? `${t.delivered} of ${t.due} sessions recorded so far have run (${t.planned} planned this quarter)` : `${t.delivered} of ${t.planned} planned sessions ran this quarter`} · ${t.participants} participants · ${p.sites.length} sites${funder ? " · you see counts, never children's details" : ""}`}
      />
      {alerts.map((s) => (
        <SiteAlert
          key={s.site.id}
          persona={persona}
          programmeId={p.id}
          siteId={s.site.id}
          staff={staff}
        />
      ))}
      <Section
        title="Sessions by site"
        aside={
          <span className="text-small text-subtle">
            Each mark is one session: filled ran, crossed couldn&rsquo;t run
          </span>
        }
      >
        <ul>
          {t.sites.map((s) => (
            <li
              key={s.site.id}
              className="grid gap-3 border-b border-line py-4 md:grid-cols-[12rem_1fr_auto] md:items-center md:gap-6"
            >
              <div>
                <p className="font-medium">{s.site.name}</p>
                <p className="text-small text-subtle">
                  {s.site.participants} participants
                </p>
              </div>
              <SessionStrip
                w={w}
                programmeId={p.id}
                siteId={s.site.id}
                showNotes={staff}
              />
              <div className="flex flex-wrap items-center gap-3 md:justify-end">
                <span className="tabular-nums">
                  <span className="font-medium">{s.delivered}</span> of {s.due}{" "}
                  ran{s.unrecorded ? " · today not recorded yet" : ""}
                </span>
                <Chip
                  kind={
                    s.status === "On track"
                      ? "verified"
                      : s.status === "Behind"
                        ? "attention"
                        : "awaiting"
                  }
                >
                  {s.status}
                </Chip>
                {staff &&
                  persona.perms.includes("Verify") &&
                  s.toCheck > 0 &&
                  (persona.sites ?? []).includes(s.site.id) && (
                    <CheckSessions
                      persona={persona}
                      programmeId={p.id}
                      siteId={s.site.id}
                    />
                  )}
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-small text-subtle">
          {t.missed
            ? `${t.missed} couldn't run (${[t.weather && `${t.weather} weather`, t.coach && `${t.coach} no coach available`].filter(Boolean).join(", ")}). `
            : ""}
          {t.checked} sessions checked against registers
          {t.toCheck ? `, ${t.toCheck} still to check` : ""}.
          {t.sites.some((x) => x.unrecorded)
            ? ` ${t.sites.reduce((a, x) => a + x.unrecorded, 0)} from today not recorded yet.`
            : ""}{" "}
          On track means 95% or more of recorded sessions ran; behind means
          under 85%.
        </p>
      </Section>
      <Section title="How is the money being used?">
        <ul>
          <Row>
            <span>
              {fmt(money.paid)} paid · {fmt(money.spent)} spent ·{" "}
              {fmt(money.checked)} checked · {fmt(money.notYetSpent)} not yet
              spent
            </span>
            <a
              className={btn("secondary", "min-h-10")}
              href={`#/app/${persona.id}/agreement/${g.id}`}
            >
              See the spending{" "}
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </Row>
        </ul>
      </Section>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        {persona.role !== "programme-coach" && (
          <button
            type="button"
            className={btn("secondary")}
            onClick={() => setAsk(true)}
          >
            <MessageCircleQuestion className="size-4" aria-hidden="true" /> Ask
            Revivo about the programme
          </button>
        )}
        {persona.role !== "programme-coach" && (
          <a
            className={btn("secondary")}
            href={`#/app/${persona.id}/report/${g.id}`}
          >
            <FileText className="size-4" aria-hidden="true" />{" "}
            {staff ? "Quarterly report" : "Read the report"}
          </a>
        )}
      </div>
      <AskRevivo
        open={ask}
        onClose={() => setAsk(false)}
        persona={persona}
        programmeId={p.id}
      />
      <p className="mt-8 text-small text-subtle">{HONESTY}</p>
    </div>
  );
}

function SessionStrip({
  w,
  programmeId,
  siteId,
  showNotes,
}: {
  w: World;
  programmeId: string;
  siteId: string;
  showNotes: boolean;
}) {
  const p = w.programmes[programmeId];
  const byslot = Object.fromEntries(
    Object.values(w.sessions)
      .filter((x) => x.programmeId === programmeId && x.siteId === siteId)
      .map((x) => [x.slot, x]),
  );
  const due = LAST_SLOT[w.moment];
  const summary = Array.from(
    { length: p.sessionsPerSite },
    (_, i) => byslot[i],
  );
  const missed = summary.filter((x) => x?.status === "missed");
  return (
    <div>
      <ol
        className="grid max-w-[22rem] gap-[3px]"
        style={{ gridTemplateColumns: `repeat(${summary.length}, minmax(0, 1fr))` }}
        aria-label={`${summary.filter((x) => x?.status === "delivered").length} ran, ${missed.length} couldn't run, ${p.sessionsPerSite - 1 - due > 0 ? p.sessionsPerSite - 1 - due : 0} still to come`}
      >
        {summary.map((x, i) => (
          <li
            key={i}
            aria-hidden="true"
            title={
              x
                ? `${x.date}: ${x.status === "delivered" ? `ran${showNotes && x.attendance ? `, ${x.attendance} came` : ""}` : `couldn't run (${x.reason})`}`
                : i <= due
                  ? "Not recorded yet"
                  : "To come"
            }
            className={cn(
              "flex h-5 items-center justify-center rounded-[2px] text-[9px] font-bold",
              x?.status === "delivered"
                ? "bg-ink"
                : x?.status === "missed"
                  ? "border border-amber text-amber"
                  : i <= due
                    ? "border border-dashed border-steel"
                    : "border border-line-strong",
            )}
          >
            {x?.status === "missed" ? "×" : ""}
          </li>
        ))}
      </ol>
      {missed.length > 0 && (
        <p className="mt-1.5 text-small text-subtle">
          Couldn&rsquo;t run:{" "}
          {missed.map((x) => `${x.date} (${x.reason})`).join(", ")}
        </p>
      )}
    </div>
  );
}

function CheckSessions({
  persona,
  programmeId,
  siteId,
}: {
  persona: Person;
  programmeId: string;
  siteId: string;
}) {
  const { world: w } = useStore();
  const act = useAction(persona.id);
  const todo = Object.values(w.sessions).filter(
    (x) =>
      x.programmeId === programmeId &&
      x.siteId === siteId &&
      x.status === "delivered" &&
      !x.checked &&
      x.by !== persona.id,
  );
  if (!todo.length) return null;
  return (
    <div>
      <button
        type="button"
        className={btn("secondary", "min-h-10")}
        onClick={() =>
          todo.forEach((x) =>
            act.run(
              "checkSession",
              { sessionId: x.id },
              `${todo.length} checked against the register.`,
            ),
          )
        }
      >
        Check {todo.length} against the register
      </button>
      <Message error={act.error} done={act.done} />
    </div>
  );
}

function SiteAlert({
  persona,
  programmeId,
  siteId,
  staff,
}: {
  persona: Person;
  programmeId: string;
  siteId: string;
  staff: boolean;
}) {
  const { world: w } = useStore();
  const p = w.programmes[programmeId];
  const s = siteStatus(w, programmeId, siteId);
  const site = p.sites.find((x) => x.id === siteId)!;
  const action = Object.values(w.actions)
    .filter((x) => x.programmeId === programmeId && x.siteId === siteId)
    .pop();
  const plan = s.plan;
  const [text, setText] = useState("");
  const act = useAction(persona.id);
  const lead =
    w.people[
      Object.keys(w.people).find(
        (k) =>
          w.people[k].orgId === p.orgId &&
          (w.people[k].sites ?? []).includes(siteId) &&
          w.people[k].perms.includes("Verify"),
      ) ?? ""
    ];
  const isDirector = staff && persona.perms.includes("Approve");
  return (
    <section
      aria-label={`${site.name} needs attention`}
      className="mb-8 border-l-2 border-amber pl-4"
    >
      <p className="flex items-center gap-2 font-medium">
        <CircleAlert className="size-5 text-amber" aria-hidden="true" />{" "}
        {site.name} couldn&rsquo;t run {s.longestRun} sessions in a row
      </p>
      <p className="mt-1 text-small text-muted">
        {s.delivered} of {s.due} sessions have run. Reasons recorded:{" "}
        {s.weather} weather, {s.coach} no coach available.
      </p>
      {plan?.status === "approved" ? (
        <p className="mt-2 text-small">
          <CircleCheck
            className="mr-1 inline size-4 text-ok"
            aria-hidden="true"
          />{" "}
          Recovery plan approved by {w.people[plan.decidedBy ?? ""]?.name}:{" "}
          {plan.text}
        </p>
      ) : plan?.status === "submitted" ? (
        <div className="mt-2">
          <p className="text-small">
            Recovery plan from {w.people[plan.by]?.name}: &ldquo;{plan.text}
            &rdquo;
          </p>
          {isDirector && plan.by !== persona.id && (
            <div className="mt-3 flex flex-wrap gap-3">
              <ActionButton
                actor={persona.id}
                type="decideRecoveryPlan"
                args={{ planId: plan.id, approve: true }}
                success="Approved."
              >
                Approve the plan
              </ActionButton>
              <ActionButton
                actor={persona.id}
                type="decideRecoveryPlan"
                args={{
                  planId: plan.id,
                  approve: false,
                  reason: "Please add dates for the make-up sessions.",
                }}
                variant="secondary"
                success="Returned with your question."
              >
                Ask for changes
              </ActionButton>
            </div>
          )}
        </div>
      ) : staff ? (
        action && action.assignedTo === persona.id ? (
          <form
            className="mt-3 max-w-xl"
            onSubmit={(e) => {
              e.preventDefault();
              act.run(
                "submitRecoveryPlan",
                {
                  planId: `rp-${siteId}-${Date.now()}`,
                  programmeId,
                  siteId,
                  text,
                },
                "Sent for approval.",
              );
            }}
          >
            <label
              htmlFor={`rp-${siteId}`}
              className="block text-small font-medium"
            >
              How will the missed sessions be made up?
            </label>
            <textarea
              id={`rp-${siteId}`}
              rows={2}
              className="mt-1 w-full rounded-[6px] border border-control bg-surface-2 p-3 text-ink"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="For example: a relief coach from week 8 and 4 make-up sessions next quarter"
            />
            <Button className="mt-3" type="submit">
              Send for approval
            </Button>
            <Message error={act.error} done={act.done} />
          </form>
        ) : action ? (
          <p className="mt-2 text-small">
            Asked {w.people[action.assignedTo]?.name} to plan the recovery.
          </p>
        ) : isDirector && lead ? (
          <ActionButton
            className="mt-3"
            actor={persona.id}
            type="assignAction"
            args={{
              actionId: `act-${siteId}-${Date.now()}`,
              programmeId,
              siteId,
              text: `Plan how ${site.name} makes up its missed sessions`,
              assignedTo: lead.id,
            }}
            success={`Asked ${lead.name}.`}
          >
            Ask {lead.name} to plan the recovery
          </ActionButton>
        ) : null
      ) : (
        <p className="mt-2 text-small text-subtle">
          The organisation is planning the recovery.
        </p>
      )}
    </section>
  );
}

/* ------------------------------------------------------- today (coach) */

export function TodayPage({ persona }: { persona: Person }) {
  const { world: w } = useStore();
  const p = Object.values(w.programmes).find((x) => x.orgId === persona.orgId);
  if (!p) return <Empty>No programme sessions for you.</Empty>;
  const sites = p.sites.filter((s) => (persona.sites ?? []).includes(s.id));
  return (
    <div className="max-w-2xl pb-10">
      <PageHead
        eyebrow={`${p.name} · ${w.orgs[p.orgId].name}`}
        title="Who came today?"
        lead="Record each session in under a minute. Couldn't run? Say why: nothing is penalised automatically."
      />
      {sites.map((s, i) => (
        <SessionRecorder
          key={s.id}
          persona={persona}
          programmeId={p.id}
          siteId={s.id}
          first={
            i === sites.findIndex((x) => nextSlot(w, p.id, x.id) !== undefined)
          }
        />
      ))}
    </div>
  );
}

const nextSlot = (w: World, programmeId: string, siteId: string) => {
  const recorded = new Set(
    Object.values(w.sessions)
      .filter((x) => x.programmeId === programmeId && x.siteId === siteId)
      .map((x) => x.slot),
  );
  return Array.from({ length: LAST_SLOT[w.moment] + 1 }, (_, i) => i).find(
    (i) => !recorded.has(i),
  );
};

function SessionRecorder({
  persona,
  programmeId,
  siteId,
  first,
}: {
  persona: Person;
  programmeId: string;
  siteId: string;
  first: boolean;
}) {
  const { world: w } = useStore();
  const p = w.programmes[programmeId];
  const site = p.sites.find((x) => x.id === siteId)!;
  const slot = nextSlot(w, programmeId, siteId);
  const [count, setCount] = useState("");
  const [note, setNote] = useState("");
  const [why, setWhy] = useState(false);
  const act = useAction(persona.id);
  const last = Object.values(w.sessions)
    .filter((x) => x.programmeId === programmeId && x.siteId === siteId)
    .sort((a, b) => b.slot - a.slot)[0];
  return (
    <Section title={site.name}>
      {slot === undefined ? (
        <p className="py-4 text-muted">
          <CircleCheck
            className="mr-1 inline size-4 text-ok"
            aria-hidden="true"
          />{" "}
          All sessions so far are recorded. Last: {last?.date},{" "}
          {last?.status === "delivered"
            ? `${last.attendance} came`
            : `couldn't run (${last?.reason})`}
          .
        </p>
      ) : (
        <div className="py-4">
          <p className="font-display text-xl font-bold">
            Session on {sessionDate(slot)}
          </p>
          {!why ? (
            <>
              <label
                htmlFor={`note-${siteId}`}
                className="mt-3 block text-small text-subtle"
              >
                Note (optional; no names)
              </label>
              <input
                id={`note-${siteId}`}
                className={cn(inputCls, "mt-1")}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="For example: relay games; two new starters"
              />
              <div className="mt-3 flex flex-wrap items-end gap-3">
                <div>
                  <label
                    htmlFor={`cnt-${siteId}`}
                    className="block text-small text-subtle"
                  >
                    How many came? (of {site.participants})
                  </label>
                  <input
                    id={`cnt-${siteId}`}
                    inputMode="numeric"
                    className={cn(inputCls, "mt-1 max-w-[8rem] text-lg")}
                    value={count}
                    onChange={(e) =>
                      setCount(e.target.value.replace(/\D/g, ""))
                    }
                  />
                </div>
                <Button
                  variant={first ? "primary" : "secondary"}
                  onClick={() =>
                    act.run(
                      "recordSession",
                      {
                        sessionId: `ss-${siteId}-${slot}`,
                        programmeId,
                        siteId,
                        slot,
                        status: "delivered",
                        attendance: Number(count),
                        note,
                      },
                      "Recorded.",
                    )
                  }
                >
                  It ran
                </Button>
                <button
                  type="button"
                  className={btn("secondary")}
                  onClick={() => setWhy(true)}
                >
                  Couldn&rsquo;t run
                </button>
              </div>

            </>
          ) : (
            <div className="mt-3">
              <p className="font-medium">Why couldn&rsquo;t it run?</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(
                  [
                    "weather",
                    "coach availability",
                    "venue unavailable",
                    "other",
                  ] as const
                ).map((r) => (
                  <button
                    key={r}
                    type="button"
                    className={btn("secondary")}
                    onClick={() =>
                      act.run(
                        "recordSession",
                        {
                          sessionId: `ss-${siteId}-${slot}`,
                          programmeId,
                          siteId,
                          slot,
                          status: "missed",
                          reason: r,
                        },
                        "Recorded. Your programme director is told if a site misses two in a row.",
                      )
                    }
                  >
                    {r === "weather"
                      ? "Weather"
                      : r === "coach availability"
                        ? "No coach available"
                        : r === "venue unavailable"
                          ? "Venue not available"
                          : "Something else"}
                  </button>
                ))}
                <button
                  type="button"
                  className={btn("quiet")}
                  onClick={() => setWhy(false)}
                >
                  Back
                </button>
              </div>
            </div>
          )}
          <Message error={act.error} done={act.done} />
        </div>
      )}
    </Section>
  );
}

/* ------------------------------------------------------------ reports */

/* ------------------------------------------------------------ reports */

/** The figures a report shows: always calculated from the records at the moment of reading (founder, P4). */
export function reportFigures(w: World, agreementIds: string[]) {
  const ts = agreementIds.map((id) => agreementTotals(w, id));
  const add = (k: keyof ReturnType<typeof agreementTotals>) => ts.reduce((a, t) => a + (t[k] as number), 0);
  const progs = Object.values(w.programmes).filter((p) => agreementIds.includes(p.agreementId)).map((p) => ({ p, t: programmeTotals(w, p.id) }));
  const progress = Object.values(w.progress).filter((x) => x.agreementId && agreementIds.includes(x.agreementId) && !progressPaused(w, x.athleteId));
  const dels = Object.values(w.deliverables).filter((d) => agreementIds.includes(d.agreementId));
  return {
    ids: agreementIds,
    committed: add("committed"),
    paid: add("paid"),
    carriedPaid: add("carriedPaid"),
    carriedSpent: add("carriedSpent"),
    query: add("query"),
    received: add("received"),
    spent: add("spent"),
    checked: add("checked"),
    waiting: add("waiting"),
    notYetSpent: add("notYetSpent"),
    stillToPay: add("stillToPay"),
    progs,
    progress,
    dels,
  };
}

function figureRows(f: ReturnType<typeof reportFigures>) {
  return [
    ["Agreed", f.committed, "Committed by both sides"],
    ["Paid", f.paid, f.carriedPaid ? `Includes ${fmt(f.carriedPaid)} paid before joining Revivo Impact` : "Payments recorded by the funder (simulated)"],
    ["Received", f.received, ["Arrival confirmed by the recipient", ...(f.paid - f.received - f.carriedPaid > 0 ? [`${fmt(f.paid - f.received - f.carriedPaid)} paid is waiting for the recipient to confirm it arrived`] : []), ...(f.carriedPaid ? [`${fmt(f.carriedPaid)} was paid before joining Revivo Impact, so it is not counted here`] : [])].join("; ")],
    ["Spending reported", f.spent, ["What the money was spent on", ...(f.carriedSpent ? [`includes ${fmt(f.carriedSpent)} spent before joining Revivo Impact, which is not checked here`] : [])].join("; ")],
    ["Spending checked", f.checked, ["Checked against receipts by the funder", ...(f.query ? [`${fmt(f.query)} has a question from the funder`] : [])].join("; ")],
    ["Waiting to be checked", f.waiting, "Usually waiting for a receipt"],
    ["Not yet spent", f.notYetSpent, "Paid but not yet accounted for. Most updates are due at the end of each quarter"],
  ] as const;
}

const FIG_KEY = { Agreed: "committed", Paid: "paid", Received: "received", "Spending reported": "spent", "Spending checked": "checked", "Waiting to be checked": "waiting", "Not yet spent": "notYetSpent" } as const;

/** "See source" for a report figure: the agreements behind it, largest first (grouped agreements as one line). */
function reportSource(w: World, viewer: Person, f: ReturnType<typeof reportFigures>, label: keyof typeof FIG_KEY): Source {
  const k = FIG_KEY[label];
  const all = f.ids.map((id) => ({ g: w.agreements[id], v: agreementTotals(w, id)[k] as number })).filter((x) => x.v > 0);
  const named = all.filter((x) => !x.g.light).sort((a, b) => b.v - a.v);
  const light = all.filter((x) => x.g.light);
  return {
    title: `${label}: ${fmt(all.reduce((a, x) => a + x.v, 0))}`,
    rows: [...named.map((x) => ({ label: `${recipientName(w, x.g.recipientKind, x.g.recipientId, viewer)} · ${w.funds[x.g.fundId].type}`, value: fmt(x.v) })), ...(light.length ? [{ label: `${light.length} other agreements, grouped`, value: fmt(light.reduce((a, x) => a + x.v, 0)) }] : [])],
    note: "Added up from each agreement's payment, receipt and expense records each time the report opens.",
  };
}

/** The figures block: money, activities delivered, progress recorded and impact, each kept apart. */
function ReportFigures({ f, viewer }: { f: ReturnType<typeof reportFigures>; viewer: Person }) {
  const { world: w } = useStore();
  return (
    <div className="mt-2">
      <h2 className="label mt-6 text-subtle">The money</h2>
      <table className="mt-2 w-full text-table">
        <tbody>
          {figureRows(f).map(([k, v, d]) => (
            <tr key={k} className="border-b border-line">
              <th scope="row" className="py-2 pr-4 text-left font-medium">
                {k}
                <span className="block text-small font-normal text-subtle">{d}</span>
              </th>
              <td className="py-2 text-right font-medium tabular-nums">
                {v > 0 ? (
                  <SeeSource name={k} source={reportSource(w, viewer, f, k)}>
                    {fmt(v)}
                  </SeeSource>
                ) : (
                  fmt(v)
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2 className="label mt-8 text-subtle">Sporting activities delivered</h2>
      {f.progs.length ? (
        <ul className="mt-2">
          {f.progs.map(({ p, t }) => (
            <li key={p.id} className="border-b border-line py-2">
              <span className="font-medium">{p.name}:</span> {t.delivered} of {t.planned} planned sessions ran{t.due < t.planned ? ` (${t.due} recorded so far)` : ""}; {t.missed} couldn&rsquo;t run ({t.weather} weather, {t.coach} no coach available); {t.checked} checked against registers; {t.participants} participants registered.
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-muted">No programme sessions for this funding.</p>
      )}
      {f.dels.length > 0 && (
        <>
          <h2 className="label mt-8 text-subtle">What was agreed in return</h2>
          <ul className="mt-2">
            {f.dels.map((d) => (
              <li key={d.id} className="border-b border-line py-2">
                {d.label}: {d.done} of {d.target} done
              </li>
            ))}
          </ul>
        </>
      )}
      <h2 className="label mt-8 text-subtle">Sporting progress recorded</h2>
      {f.progress.length ? (
        <ul className="mt-2">
          {f.progress.slice(0, 8).map((x) => (
            <li key={x.id} className="border-b border-line py-2">
              {f.ids.length > 1 && x.agreementId && <span className="font-medium">{recipientName(w, w.agreements[x.agreementId].recipientKind, w.agreements[x.agreementId].recipientId, viewer)}: </span>}
              {x.text}
              <span className="text-small text-subtle"> · {x.proof ? "with proof" : x.attestedBy ? "confirmed by the coach" : "self-reported"}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-muted">No progress records.</p>
      )}
      <h2 className="label mt-8 text-subtle">Impact shown by independent evidence</h2>
      <p className="mt-2 text-muted">None recorded. Progress happened while this funding was in place; the records do not show that the funding caused it.</p>
    </div>
  );
}

/** "Download the figures": a CSV made in the browser from the same figures (nothing is sent anywhere). */
function downloadCsv(name: string, f: ReturnType<typeof reportFigures>, extra: string[][] = []) {
  const lines = [["Figure", "Amount (USD)"], ...figureRows(f).map(([k, v]) => [k, String(v)]), ...f.progs.map(({ p, t }) => [`${p.name}: sessions ran of planned`, `${t.delivered} of ${t.planned}`]), ...extra];
  const blob = new Blob([lines.map((l) => l.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-figures.csv`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function ExportButtons({ name, f, extra }: { name: string; f: ReturnType<typeof reportFigures>; extra?: string[][] }) {
  return (
    <div className="mt-6 flex flex-wrap gap-3" data-ri-print-hide>
      <button type="button" className={btn("secondary")} onClick={() => window.print()}>
        <Printer className="size-4" aria-hidden="true" /> Print or save as PDF
      </button>
      <button type="button" className={btn("quiet")} onClick={() => downloadCsv(name, f, extra)}>
        <FileText className="size-4" aria-hidden="true" /> Download the figures (CSV)
      </button>
    </div>
  );
}

export function ReportPage({ persona, id }: { persona: Person; id: string }) {
  const { world: w } = useStore();
  const g = w.agreements[id];
  const report = Object.values(w.reports).filter((r) => r.agreementId === id).pop();
  const [text, setText] = useState(report?.text ?? "");
  const [reason, setReason] = useState("");
  const act = useAction(persona.id);
  if (!g) return <Empty>This report does not exist.</Empty>;
  const side = sideOf(w, persona, g);
  if (!side) return <Empty>Reports are shared only with the organisation and its funder.</Empty>;
  const staff = side === "recipient" && persona.orgId === g.recipientId;
  const body = text || report?.text || "";
  const flags = claimsCheck(body, w, id);
  const editable = staff && (!report || report.status === "draft" || report.status === "returned");
  const funderName = w.funders[w.funds[g.fundId].funderId].name;
  const who = recipientName(w, g.recipientKind, g.recipientId, persona);
  const f = reportFigures(w, [id]);
  const prog = Object.values(w.programmes).find((p) => p.agreementId === id);
  return (
    <div className="max-w-3xl pb-10">
      <PageHead
        eyebrow={`Report · ${who} → ${funderName}`}
        title={staff ? (editable ? "What can we honestly report?" : "What we reported") : `What does ${who}'s report say?`}
        lead={`${report?.period ?? `${prog?.name ?? w.funds[g.fundId].name} · April to June 2027`} · ${report ? (report.status === "accepted" ? `accepted by ${w.people[report.decidedBy ?? ""]?.name}` : report.status === "submitted" ? "sent to the funder" : report.status === "returned" ? `returned: “${report.reason}”` : "draft") : "not written yet"}`}
      />
      <p className="text-small text-subtle">The figures below come straight from the records each time this page opens, so they always match. The words are the organisation&rsquo;s own.</p>
      <ReportFigures f={f} viewer={persona} />

      <h2 className="label mt-10 text-subtle">In {staff ? "our" : "their"} own words</h2>
      {!report && staff && (
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <ActionButton actor={persona.id} type="draftReport" args={{ reportId: `rep-${id}-${Date.now()}`, agreementId: id, period: "April to June 2027" }} success="Drafted from your records. Add your own words, then send it.">
            <Sparkles className="size-4" aria-hidden="true" /> Draft our words from the records
          </ActionButton>
          <SimulatedAI />
        </div>
      )}
      {!report && !staff && <p className="mt-3 text-muted">The organisation hasn&rsquo;t written its own words yet. The figures above are already current.</p>}
      {report && editable && (
        <>
          <label htmlFor="rep-text" className="sr-only">
            Report text
          </label>
          <textarea id="rep-text" rows={8} className="mt-3 w-full rounded-[6px] border border-control bg-surface-2 p-4 leading-relaxed text-ink" value={body} onChange={(e) => setText(e.target.value)} />
          <div role="status" className="mt-3 text-small">
            {flags.length ? (
              <div className="text-amber">
                <p>
                  <CircleAlert className="mr-1 inline size-4" aria-hidden="true" /> {flags.length === 1 ? "One thing to fix before you send:" : `${flags.length} things to fix before you send:`}
                </p>
                <ul className="mt-1 list-disc pl-6">
                  {flags.map((f) => (
                    <li key={f}>{f.startsWith("$") || /records show|does not match/.test(f) ? `${f}. Use the figures above, or leave the number out.` : `“${f}” claims more than your records show. Say what was measured instead, for example what participants said in a survey and how many answered.`}</li>
                  ))}
                </ul>
              </div>
            ) : body.includes("[") ? (
              <p className="text-muted">Replace the part in square brackets with your own words, or delete it.</p>
            ) : (
              <p className="text-muted">
                <CircleCheck className="mr-1 inline size-4 text-ok" aria-hidden="true" /> Nothing found to fix. The check looks for amounts and session counts that differ from your records, and for claims of impact the records can&rsquo;t show. It can&rsquo;t tell whether every sentence is true, so read it through before you send.
              </p>
            )}
          </div>
          <Button className="mt-5" onClick={() => act.run("submitReport", { reportId: report.id, text: body }, `Sent to ${funderName}.`)} arrow>
            Send to {funderName}
          </Button>
        </>
      )}
      {report && !editable && <article className="mt-3 whitespace-pre-line border-l-2 border-line-strong pl-5 leading-relaxed">{report.text}</article>}
      {report && !editable && flags.length > 0 && (
        <p role="status" className="mt-3 text-small text-amber">
          <CircleAlert className="mr-1 inline size-4" aria-hidden="true" /> Since this report was sent, the records no longer support: {flags.join("; ")}. The figures above are current; the words are as sent.
        </p>
      )}
      {report?.status === "submitted" && side === "funder" && (persona.perms.includes("Review") || persona.perms.includes("Approve")) && (
        <div className="mt-6 flex flex-wrap items-end gap-3" data-ri-print-hide>
          <ActionButton actor={persona.id} type="decideReport" args={{ reportId: report.id, accept: true }} success="Accepted.">
            Accept the report
          </ActionButton>
          <div className="min-w-64 flex-1">
            <label htmlFor="ret" className="block text-small text-subtle">
              Or return it with a question
            </label>
            <input id="ret" className={cn(inputCls, "mt-1")} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="For example: please add the minibus receipt" />
          </div>
          <ActionButton actor={persona.id} type="decideReport" args={{ reportId: report.id, accept: false, reason }} variant="secondary" success="Returned with your question.">
            Return it
          </ActionButton>
        </div>
      )}
      <Message error={act.error} done={act.done} />
      <ExportButtons name={`${who} report`} f={f} />
      <p className="mt-8 text-small text-subtle">{HONESTY}</p>
    </div>
  );
}

/** A funder's own report across everything it funds (founder: "generate reports"). Figures only from records. */
export function FunderReportPage({ persona }: { persona: Person }) {
  const { world: w } = useStore();
  const fid = persona.funderId;
  if (!fid) return <Empty>Funding reports are for funders.</Empty>;
  const funds = Object.values(w.funds).filter((x) => x.funderId === fid && BEHAVIOUR_OF(w, x.id) !== "inkind" && BEHAVIOUR_OF(w, x.id) !== "commercial");
  const theirs = Object.values(w.agreements).filter((g) => w.funds[g.fundId].funderId === fid && counts(g));
  // Commercial sponsorship and in-kind support never enter development or programme cash totals (invariant I6).
  const all = theirs.filter((g) => BEHAVIOUR_OF(w, g.fundId) !== "inkind" && BEHAVIOUR_OF(w, g.fundId) !== "commercial");
  const commercial = theirs.filter((g) => BEHAVIOUR_OF(w, g.fundId) === "commercial");
  const f = reportFigures(w, all.map((g) => g.id));
  const sportOf = (g: Agreement) => (g.recipientKind === "athlete" ? w.athletes[g.recipientId]?.sport : w.orgs[g.recipientId]?.sport) ?? "Other";
  const sports = [...new Set(all.map(sportOf))].map((sp) => {
    const gs = all.filter((g) => sportOf(g) === sp);
    const ff = reportFigures(w, gs.map((g) => g.id));
    return { sp, n: gs.length, athletes: gs.filter((g) => g.recipientKind === "athlete").length, committed: ff.committed, paid: ff.paid };
  }).sort((a, b) => b.committed - a.committed);
  const name = w.funders[fid].name;
  // The CSV carries the same two tables as the page: by fund and by sport.
  const byFund = funds
    .map((x) => ({ x, ff: reportFigures(w, all.filter((g) => g.fundId === x.id).map((g) => g.id)) }))
    .filter(({ ff }) => ff.committed > 0);
  const csvExtra: string[][] = [
    [],
    ["By fund", "Committed (USD)", "Paid (USD)", "Checked (USD)"],
    ...byFund.map(({ x, ff }) => [x.name, String(ff.committed), String(ff.paid), String(ff.checked)]),
    [],
    ["By sport", "Athletes", "Organisations", "Committed (USD)", "Paid (USD)"],
    ...sports.map((x) => [x.sp, String(x.athletes), String(x.n - x.athletes), String(x.committed), String(x.paid)]),
  ];
  return (
    <div className="max-w-3xl pb-10">
      <PageHead eyebrow={`Funding report · ${name}`} title="What has our funding done so far?" lead={`Everything ${name} funds on Revivo Impact, as at ${({ apr12: "Mon 12 Apr", may06: "Thu 6 May", jun30: "Wed 30 Jun" } as const)[w.moment]} 2027 · calculated from the records each time it opens`} />
      <ReportFigures f={f} viewer={persona} />
      <h2 className="label mt-10 text-subtle">By fund</h2>
      <table className="mt-2 w-full text-table">
        <thead>
          <tr className="label-data border-b border-line text-left text-subtle">
            <th className="py-2 pr-3">Fund</th>
            <th className="py-2 pr-3 text-right">Committed</th>
            <th className="py-2 pr-3 text-right">Paid</th>
            <th className="py-2 text-right">Checked</th>
          </tr>
        </thead>
        <tbody>
          {funds.map((x) => {
            const ff = reportFigures(w, all.filter((g) => g.fundId === x.id).map((g) => g.id));
            return ff.committed ? (
              <tr key={x.id} className="border-b border-line">
                <td className="py-2 pr-3">
                  {x.name}
                  {BEHAVIOUR_OF(w, x.id) === "commercial" ? <span className="block text-small text-subtle">Commercial sponsorship: counted apart</span> : null}
                </td>
                <td className="py-2 pr-3 text-right tabular-nums">{fmt(ff.committed)}</td>
                <td className="py-2 pr-3 text-right tabular-nums">{fmt(ff.paid)}</td>
                <td className="py-2 text-right tabular-nums">{fmt(ff.checked)}</td>
              </tr>
            ) : null;
          })}
        </tbody>
      </table>
      <h2 className="label mt-10 text-subtle">Who we fund, by sport</h2>
      <table className="mt-2 w-full text-table">
        <thead>
          <tr className="label-data border-b border-line text-left text-subtle">
            <th className="py-2 pr-3">Sport</th>
            <th className="py-2 pr-3 text-right">Athletes and organisations</th>
            <th className="py-2 pr-3 text-right">Committed</th>
            <th className="py-2 text-right">Paid</th>
          </tr>
        </thead>
        <tbody>
          {sports.map((x) => (
            <tr key={x.sp} className="border-b border-line">
              <td className="py-2 pr-3">{x.sp}</td>
              <td className="py-2 pr-3 text-right tabular-nums">
                {[x.athletes ? `${x.athletes} ${x.athletes === 1 ? "athlete" : "athletes"}` : "", x.n - x.athletes ? `${x.n - x.athletes} ${x.n - x.athletes === 1 ? "organisation" : "organisations"}` : ""].filter(Boolean).join(" · ")}
              </td>
              <td className="py-2 pr-3 text-right tabular-nums">{fmt(x.committed)}</td>
              <td className="py-2 text-right tabular-nums">{fmt(x.paid)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2 text-small text-subtle">Young athletes are counted, never named.</p>
      {commercial.length > 0 && (
        <>
          <h2 className="label mt-10 text-subtle">Commercial sponsorship (counted apart)</h2>
          <p className="mt-2 text-small text-muted">Sponsorship is a commercial agreement, so it is never added to the development and programme figures above.</p>
          <p className="mt-2 tabular-nums">
            {commercial.length} {commercial.length === 1 ? "agreement" : "agreements"} · {fmt(reportFigures(w, commercial.map((g) => g.id)).committed)} agreed · {fmt(reportFigures(w, commercial.map((g) => g.id)).paid)} paid
          </p>
        </>
      )}
      <ExportButtons name={`${name} funding report`} f={f} extra={csvExtra} />
      <p className="mt-8 text-small text-subtle">{HONESTY}</p>
    </div>
  );
}

/* ------------------------------------------- Ask Revivo for funders (AI C) */

export type FunderAnswer = { q: string; lead: string; rows: { label: string; value?: string; note?: string; href?: string }[]; from: string; refusal?: boolean };

export const FUNDER_QUESTIONS = [
  "Where has our funding been spent?",
  "Which expenses still need checking?",
  "Which athletes need to send updates?",
  "Which payments are coming up?",
  "Which sporting programmes are behind schedule?",
  "What should we review before renewing funding?",
];

/**
 * Simulated AI (AI C) for a whole funder: fixed, deterministic answers built only from this funder's records, each row
 * linking to the record where a person acts. Refuses ranking, deciding and identifying young people.
 */
export function funderAnswer(w: World, persona: Person, q: string): FunderAnswer {
  const REF = /\b(best|rank|ranking|top|worst|deserv\w*|should (we|i) (give|fund|stop|cut|increase|pay|renew|continue|drop)|more money|decide|approve|reject|most talented|potential|which child|identify|who is|surname|address|school)\b/i;
  if (REF.test(q)) return { q, lead: "That decision is yours, so I won't make it: I can't rank people, judge potential, decide funding or identify young participants. I can show the records that help you decide; try one of the questions above.", rows: [], from: "", refusal: true };
  const fid = persona.funderId!;
  const all = Object.values(w.agreements).filter((g) => w.funds[g.fundId].funderId === fid && counts(g) && BEHAVIOUR_OF(w, g.fundId) !== "inkind");
  // Money totals cover development and programme cash only; commercial sponsorship is reported apart (invariant I6).
  const mine = all.filter((g) => BEHAVIOUR_OF(w, g.fundId) !== "commercial");
  const named = mine.filter((g) => !g.light);
  const who = (g: Agreement) => recipientName(w, g.recipientKind, g.recipientId, persona);
  const link = (g: Agreement) => `#/app/${persona.id}/agreement/${g.id}`;
  const ql = q.toLowerCase();
  // A question about one named recipient ("How much did we pay Lanternfield…?") gets that record's figures.
  const one = all.filter((g) => !g.light && !(g.recipientKind === "athlete" && w.athletes[g.recipientId]?.minor)).find((g) => who(g).toLowerCase().split(/[\s·]+/).some((x) => x.length > 3 && !/^(sports?|sporting|club|academy|school|community|foundation|trust|fund|group|centre|anonymised|under|athletics|federation)$/.test(x) && new RegExp(`(^|[^a-z])${x.replace(/[^a-z]/g, "")}([^a-z]|$)`).test(ql)));
  if (one) {
    const t = agreementTotals(w, one.id);
    const ex = Object.values(w.expenses).filter((e) => e.agreementId === one.id);
    const next = nextInstalment(w, one.id);
    return { q, lead: `${who(one)}: ${fmt(t.committed)} agreed, ${fmt(t.paid)} paid, ${fmt(t.spent)} spent, ${fmt(t.checked)} checked against receipts.${BEHAVIOUR_OF(w, one.fundId) === "commercial" ? " This is commercial sponsorship, counted apart." : ""}`, rows: [...ex.map((e) => ({ label: e.what, value: fmt(e.amount), note: e.status === "checked" ? "Checked" : e.status === "query" ? "Question asked" : e.status === "carried-in" ? "Before joining Revivo Impact" : "Not yet checked", href: link(one) })), ...(next ? [{ label: `Next payment: ${next.dueLabel}`, value: fmt(next.amount - next.paid), note: next.condition && !next.conditionMet ? `Once ${next.condition}` : "No condition outstanding", href: link(one) }] : [])], from: "This agreement's payments, expenses and schedule" };
  }
  if (/(have we|did we|we've|so far).*(paid|pay)|still to pay|how much.*(paid|pay)|left to pay/.test(ql)) {
    const tt = mine.map((g) => agreementTotals(w, g.id));
    const paid = tt.reduce((a, t) => a + t.paid, 0);
    const left = tt.reduce((a, t) => a + t.stillToPay, 0);
    const comm = all.filter((g) => BEHAVIOUR_OF(w, g.fundId) === "commercial").map((g) => agreementTotals(w, g.id));
    return { q, lead: `You have paid ${fmt(paid)} and ${fmt(left)} is still to pay, across ${mine.length} development and programme agreements.${comm.length ? ` Commercial sponsorship is counted apart: ${fmt(comm.reduce((a, t) => a + t.paid, 0))} paid, ${fmt(comm.reduce((a, t) => a + t.stillToPay, 0))} still to pay.` : ""}`, rows: [{ label: "Agreed", value: fmt(tt.reduce((a, t) => a + t.committed, 0)) }, { label: "Paid", value: fmt(paid) }, { label: "Confirmed received", value: fmt(tt.reduce((a, t) => a + t.received, 0)), note: [tt.reduce((a, t) => a + t.toConfirm, 0) ? `${fmt(tt.reduce((a, t) => a + t.toConfirm, 0))} waiting for the recipient to confirm it arrived` : "", tt.reduce((a, t) => a + t.carriedPaid, 0) ? `${fmt(tt.reduce((a, t) => a + t.carriedPaid, 0))} paid before joining Revivo Impact` : ""].filter(Boolean).join("; ") || undefined }, { label: "Still to pay", value: fmt(left), note: "see “Which payments are coming up?” for dates" }], from: "Payment records (the ledger)" };
  }
  if (/spent|spend|where.*money|used/.test(ql) && !/check/.test(ql)) {
    const rows = named.map((g) => ({ g, t: agreementTotals(w, g.id) })).filter((x) => x.t.spent > 0).sort((a, b) => b.t.spent - a.t.spent);
    const total = rows.reduce((a, x) => a + x.t.spent, 0);
    return { q, lead: rows.length ? `${fmt(total)} of spending is recorded across ${rows.length} agreement${rows.length > 1 ? "s" : ""}; ${fmt(rows.reduce((a, x) => a + x.t.checked, 0))} of it is checked against receipts.` : "No spending has been recorded yet on the agreements you manage here.", rows: rows.map((x) => ({ label: who(x.g), value: fmt(x.t.spent), note: `${fmt(x.t.checked)} checked${x.t.waiting ? ` · ${fmt(x.t.waiting)} waiting` : ""}${x.t.carriedSpent ? " · includes spending before joining" : ""}`, href: link(x.g) })), from: "Expense records and receipts" };
  }
  if (/check|receipt|verify/.test(ql)) {
    const ex = Object.values(w.expenses).filter((e) => named.some((g) => g.id === e.agreementId) && (e.status === "reported" || e.status === "query"));
    return { q, lead: ex.length ? `${ex.length} expense${ex.length > 1 ? "s" : ""} (${fmt(ex.reduce((a, e) => a + e.amount, 0))}) still need checking. ${ex.filter((e) => !e.receipt).length ? `${ex.filter((e) => !e.receipt).length} have no receipt yet.` : "All have receipts."}` : "Nothing is waiting to be checked.", rows: ex.map((e) => ({ label: `${who(w.agreements[e.agreementId])}: ${e.what}`, value: fmt(e.amount), note: e.receipt ? "Receipt added: ready to check" : e.status === "query" ? `You asked: “${e.query}”` : "No receipt yet", href: link(w.agreements[e.agreementId]) })), from: "Expense records" };
  }
  if (/update|report|progress/.test(ql) && !/programme|behind/.test(ql)) {
    const quiet = (g: Agreement) => !Object.values(w.expenses).some((e) => e.agreementId === g.id && e.at === w.moment) && !Object.values(w.progress).some((x) => x.agreementId === g.id && x.at === w.moment);
    const due = mine.filter((g) => g.recipientKind === "athlete" && agreementTotals(w, g.id).paid > 0).filter(quiet);
    const dn = due.filter((g) => !g.light);
    const dl = due.filter((g) => g.light);
    const paused = named.filter((g) => g.recipientKind === "athlete" && progressPaused(w, g.recipientId));
    return { q, lead: due.length ? `${due.length} athlete${due.length > 1 ? "s have" : " has"} not sent an update this quarter.${paused.length ? ` Progress sharing is paused for ${paused.length}: a person should follow up; nothing is penalised automatically.` : ""}` : "Every athlete you fund has sent an update this quarter.", rows: [...dn.map((g) => ({ label: who(g), value: fmt(agreementTotals(w, g.id).notYetSpent), note: "paid but not yet accounted for", href: link(g) })), ...(dl.length ? [{ label: `${dl.length} more athletes on earlier agreements`, value: fmt(dl.reduce((a, g) => a + agreementTotals(w, g.id).notYetSpent, 0)), note: "Grouped as one line; their updates are due on the same quarterly date" }] : [])], from: "Payments, expenses and progress records" };
  }
  if (/pay|due|instal|tranche|coming/.test(ql)) {
    // Payments include commercial sponsorship (it is still money you pay), shown with its own figure.
    const left = (g: Agreement) => scheduleOf(w, g.id).filter((i) => i.status !== "paid").reduce((a, i) => a + i.amount - i.paid, 0);
    const toPay = all.reduce((a, g) => a + left(g), 0);
    const comm = all.filter((g) => BEHAVIOUR_OF(w, g.fundId) === "commercial").reduce((a, g) => a + left(g), 0);
    const rows = all
      .map((g) => ({ g, x: scheduleOf(w, g.id).find((i) => i.status !== "paid") }))
      .filter((r) => r.x)
      .sort((a, b) => (a.x!.status === "on-hold" ? 1 : 0) - (b.x!.status === "on-hold" ? 1 : 0) || a.x!.dueISO.localeCompare(b.x!.dueISO));
    const nowDue = rows.filter((r) => r.x!.status === "due" || r.x!.status === "part-paid");
    const nm = rows.filter((r) => !r.g.light);
    const light = rows.filter((r) => r.g.light);
    const note = (x: NonNullable<ReturnType<typeof nextInstalment>>) => (x.status === "on-hold" ? `On hold until ${x.condition}` : x.status === "due" || x.status === "part-paid" ? "Due now: ready to pay" : x.condition && !x.conditionMet ? `Once ${x.condition}` : "No condition outstanding");
    return { q, lead: rows.length ? `${fmt(toPay)} is still to pay across ${rows.length} agreements${comm ? ` (${fmt(comm)} of it commercial sponsorship)` : ""}. ${nowDue.length ? `${nowDue.length} ${nowDue.length === 1 ? "payment is" : "payments are"} due now (${fmt(nowDue.reduce((a, r) => a + r.x!.amount - r.x!.paid, 0))}).` : "Nothing is due today."} The list shows each agreement's next payment.` : "Nothing is left to pay.", rows: [...nm.slice(0, 8).map((r) => ({ label: `${r.x!.status === "due" || r.x!.status === "part-paid" ? "Due now" : r.x!.dueLabel}: ${who(r.g)}`, value: fmt(r.x!.amount - r.x!.paid), note: note(r.x!), href: link(r.g) })), ...(light.length ? [{ label: `${light.length} other agreements, grouped`, value: fmt(light.reduce((a, r) => a + r.x!.amount - r.x!.paid, 0)), note: `Next payments; ${light.filter((r) => r.x!.status === "due").length} due now. Record them from Funding.` }] : [])], from: "Payment schedules" };
  }
  if (/programme|behind|schedule|session|site/.test(ql)) {
    const progs = Object.values(w.programmes).filter((p) => mine.some((g) => g.id === p.agreementId));
    const rows = progs.flatMap((p) => programmeTotals(w, p.id).sites.filter((x) => x.status !== "On track").map((x) => ({ label: `${p.name}: ${x.site.name}`, value: `${x.delivered} of ${x.due}`, note: `${x.status}${x.plan?.status === "approved" ? " · recovery plan approved" : x.alert ? " · two missed in a row" : ""}`, href: `#/app/${persona.id}/programme/${p.id}` })));
    return { q, lead: progs.length ? (rows.length ? `${rows.length} site${rows.length > 1 ? "s are" : " is"} behind or needing attention. Counts only: you never see children's details.` : "Every site is on track.") : "You don't fund a programme with session records.", rows, from: "Session records (counts only)" };
  }
  if (/renew|review|before|risk|attention/.test(ql)) {
    const rows = named.flatMap((g) => {
      const t = agreementTotals(w, g.id);
      const out: string[] = [];
      const r = Object.values(w.reviews).filter((x) => x.agreementId === g.id).pop();
      if (r && r.decision !== "Continue") out.push(`last review: ${r.decision.toLowerCase()}${r.conditions ? ` (${r.conditions})` : ""}`);
      if (t.waiting) out.push(`${fmt(t.waiting)} of spending not yet checked`);
      if (t.notYetSpent && t.paid) out.push(`${fmt(t.notYetSpent)} paid but not accounted for`);
      const d = Object.values(w.deliverables).filter((x) => x.agreementId === g.id && x.status !== "complete");
      if (d.length) out.push(`${d.length} deliverable${d.length > 1 ? "s" : ""} not finished`);
      if (g.recipientKind === "athlete" && progressPaused(w, g.recipientId)) out.push("progress sharing paused");
      const p = Object.values(w.programmes).find((x) => x.agreementId === g.id);
      if (p) {
        const behind = programmeTotals(w, p.id).sites.filter((x) => x.status === "Behind");
        if (behind.length) out.push(`${behind.map((x) => x.site.name).join(", ")} behind`);
      }
      return out.length ? [{ label: who(g), note: out.join(" · "), href: link(g) }] : [];
    });
    return { q, lead: rows.length ? `${rows.length} agreement${rows.length > 1 ? "s have" : " has"} something to look at before renewing. Deciding is yours.` : "Nothing outstanding on the agreements you manage.", rows, from: "Reviews, expenses, deliverables, progress and sessions" };
  }
  return { q, lead: "I answer questions about your funding records. Try one of the questions above, ask how much you have paid, or name an athlete or organisation you fund.", rows: [], from: "", refusal: true };
}

export function FunderAskRevivo({ open, onClose, persona }: { open: boolean; onClose: () => void; persona: Person }) {
  const { world: w } = useStore();
  const [q, setQ] = useState("");
  const [answers, setAnswers] = useState<FunderAnswer[]>([]);
  const ask = (text: string) => text.trim() && setAnswers((a) => [funderAnswer(w, persona, text.trim()), ...a]);
  return (
    <Panel open={open} onClose={onClose} eyebrow="Ask Revivo · Simulated AI" title="What would you like to know?">
      <div className="flex flex-wrap gap-2">
        {FUNDER_QUESTIONS.map((s) => (
          <button key={s} type="button" className={btn("secondary", "min-h-10 px-3 font-sans text-small font-medium tracking-normal")} onClick={() => ask(s)}>
            {s}
          </button>
        ))}
      </div>
      <form
        className="mt-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          ask(q);
          setQ("");
        }}
      >
        <label htmlFor="fask-q" className="sr-only">
          Your question
        </label>
        <input id="fask-q" className={inputCls} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Or ask in your own words" />
        <Button type="submit" variant="secondary">
          Ask
        </Button>
      </form>
      <ul className="mt-5 space-y-6">
        {answers.map((a, i) => (
          <li key={i} className="border-t border-line pt-4">
            <p className="text-small text-subtle">{a.q}</p>
            <p className={cn("mt-2", a.refusal && "text-muted")}>{a.lead}</p>
            {a.rows.length > 0 && (
              <ul className="mt-2">
                {a.rows.map((r, k) => (
                  <li key={k} className="flex items-start justify-between gap-3 border-b border-line py-2 text-small">
                    <span>
                      {r.href ? (
                        <a className="font-medium underline underline-offset-4 hover:text-signal" href={r.href} onClick={onClose}>
                          {r.label}
                        </a>
                      ) : a.refusal ? (
                        <button type="button" className="text-left underline underline-offset-4" onClick={() => ask(r.label)}>
                          {r.label}
                        </button>
                      ) : (
                        <span className="font-medium">{r.label}</span>
                      )}
                      {r.note && <span className="block text-subtle">{r.note}</span>}
                    </span>
                    {r.value && <span className="shrink-0 tabular-nums">{r.value}</span>}
                  </li>
                ))}
              </ul>
            )}
            {a.from && <p className="mt-2 text-small text-subtle">From: {a.from}. Open a row to see the records and act.</p>}
          </li>
        ))}
      </ul>
      <p className="mt-6 text-small text-subtle">Simulated AI: fixed answers built only from your organisation&rsquo;s records, respecting consent and privacy. It never ranks people, decides funding or names young participants.</p>
    </Panel>
  );
}

/* ---------------------------------------------------- Ask Revivo (AI C) */

type Answer = { q: string; a: string[]; sources: string[]; refusal?: boolean };
const REFUSE =
  /\b(best|rank|ranking|top|worst|deserv\w*|should|decide|approve|reject|stop funding|most talented|potential|which child|identify|who is|name of|names of|surname|address|school)\b/i;

/** Simulated AI (AI C): fixed templates over the records the viewer may see; refuses ranking, deciding and identifying. */
export function answer(
  w: World,
  persona: Person,
  q: string,
  ctx: { agreementId?: string; programmeId?: string },
): Answer {
  if (REFUSE.test(q))
    return {
      q,
      a: [
        "I can't rank people, judge potential, decide who to fund or identify young participants. People make those decisions on Revivo Impact. I can summarise the records you're allowed to see.",
      ],
      sources: [],
      refusal: true,
    };
  const p = ctx.programmeId ? w.programmes[ctx.programmeId] : undefined;
  const ql = q.toLowerCase();
  if (p) {
    const t = programmeTotals(w, p.id);
    const site = p.sites.find((s) =>
      ql.includes(s.name.split(" ")[0].toLowerCase()),
    );
    if (site && /behind|why|miss/.test(ql)) {
      const s = siteStatus(w, p.id, site.id);
      const missed = s.sessions.filter((x) => x.status === "missed");
      return {
        q,
        a: [
          `${site.name} has run ${s.delivered} of ${s.due} sessions so far, so it is ${s.status.toLowerCase()}.`,
          `The sessions that couldn't run: ${missed.map((x) => `${x.date} (${x.reason})`).join(", ")}.`,
          s.plan
            ? `A recovery plan is ${s.plan.status}: ${s.plan.text}`
            : "No recovery plan has been written yet.",
        ],
        sources: [
          `${site.name}: ${s.sessions.length} session records`,
          ...(s.plan ? ["Recovery plan"] : []),
        ],
      };
    }
    if (/spend|money|expense|check/.test(ql)) {
      const m = agreementTotals(w, p.agreementId);
      return {
        q,
        a: [
          `${fmt(m.paid)} has been paid for ${p.name}; ${fmt(m.spent)} is recorded as spent.`,
          `${fmt(m.checked)} has been checked against receipts; ${fmt(m.waiting)} is waiting, usually for a receipt.`,
        ],
        sources: [
          "Payments ledger",
          `${Object.values(w.expenses).filter((e) => e.agreementId === p.agreementId).length} expense records`,
        ],
      };
    }
    return {
      q,
      a: [
        `${t.delivered} of ${t.due} sessions so far have run across ${p.sites.length} sites; ${t.missed} couldn't run (${t.weather} weather, ${t.coach} no coach available).`,
        `On track: ${
          t.sites
            .filter((s) => s.status === "On track")
            .map((s) => s.site.name)
            .join(", ") || "none"
        }. Needs attention or behind: ${
          t.sites
            .filter((s) => s.status !== "On track")
            .map((s) => `${s.site.name} (${s.delivered} of ${s.due})`)
            .join(", ") || "none"
        }.`,
      ],
      sources: [
        `${Object.values(w.sessions).filter((x) => x.programmeId === p.id).length} session records`,
      ],
    };
  }
  if (ctx.agreementId) {
    const g = w.agreements[ctx.agreementId];
    const m = agreementTotals(w, g.id);
    const who = athleteLabel(w, g.recipientId, persona);
    const ex = Object.values(w.expenses).filter((e) => e.agreementId === g.id);
    const pr = progressPaused(w, g.recipientKind === "athlete" ? g.recipientId : undefined) ? [] : Object.values(w.progress).filter((x) => x.agreementId === g.id);
    return {
      q,
      a: [
        `${who}: ${fmt(m.paid)} paid of ${fmt(m.committed)}; ${fmt(m.spent)} spent, ${fmt(m.checked)} checked${m.query ? `, ${fmt(m.query)} waiting for a receipt` : ""}; ${fmt(m.notYetSpent)} not yet spent.`,
        pr.length
          ? `Progress: ${pr.map((x) => x.text + (x.attestedBy ? " (confirmed by the coach)" : "")).join("; ")}.`
          : "No progress updates yet.",
      ],
      sources: [
        `${ex.length} expense records`,
        `${pr.length} progress updates`,
        "Payments ledger",
      ],
    };
  }
  return {
    q,
    a: [
      "I can only answer from the records on this page. Try one of the suggested questions.",
    ],
    sources: [],
    refusal: true,
  };
}

function AskRevivo({
  open,
  onClose,
  persona,
  agreementId,
  programmeId,
}: {
  open: boolean;
  onClose: () => void;
  persona: Person;
  agreementId?: string;
  programmeId?: string;
}) {
  const { world: w } = useStore();
  const [q, setQ] = useState("");
  const [answers, setAnswers] = useState<Answer[]>([]);
  const suggestions = programmeId
    ? [
        "Why is Greenpark behind?",
        "How is the money being used?",
        "Summarise this quarter",
      ]
    : [
        `Summarise ${agreementId ? athleteLabel(w, w.agreements[agreementId].recipientId, persona).split(" ")[0] : "this"}'s quarter`,
      ];
  const ask = (text: string) =>
    text.trim() &&
    setAnswers((a) => [
      answer(w, persona, text.trim(), { agreementId, programmeId }),
      ...a,
    ]);
  return (
    <Panel
      open={open}
      onClose={onClose}
      eyebrow="Ask Revivo · Simulated AI"
      title="Questions about these records"
    >
      <div className="flex flex-wrap gap-2">
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            className={btn("secondary", "min-h-10")}
            onClick={() => ask(s)}
          >
            {s}
          </button>
        ))}
      </div>
      <form
        className="mt-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          ask(q);
          setQ("");
        }}
      >
        <label htmlFor="ask-q" className="sr-only">
          Your question
        </label>
        <input
          id="ask-q"
          className={inputCls}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ask about these records"
        />
        <Button type="submit" variant="secondary">
          Ask
        </Button>
      </form>
      <ul className="mt-5 space-y-5">
        {answers.map((a, i) => (
          <li key={i} className="border-t border-line pt-4">
            <p className="text-small text-subtle">Answering: {a.q}</p>
            {a.a.map((line, k) => (
              <p key={k} className={cn("mt-2", a.refusal && "text-muted")}>
                {line}
              </p>
            ))}
            {a.sources.length > 0 && (
              <p className="mt-2 text-small text-subtle">
                From: {a.sources.join(" · ")}
              </p>
            )}
          </li>
        ))}
      </ul>
      <p className="mt-6 text-small text-subtle">
        Simulated AI: fixed answers built from the records you may see. It never
        ranks people, decides funding or identifies young participants. Check
        against the records.
      </p>
    </Panel>
  );
}
