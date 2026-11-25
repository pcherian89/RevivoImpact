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
  sessionDate,
  type Agreement,
  type Person,
  type World,
} from "../domain/model";
import {
  agreementTotals,
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
  SimulatedAI,
} from "../components/ui";
import { FundingBar, FundingLine, MiniLine } from "../components/money";
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
  // On phones a one-line summary replaces the tall vertical line (the money bar below shows the figures).
  return (
    <>
      <p className="flex flex-wrap items-center gap-3 md:hidden">
        <MiniLine
          total={nodes.length}
          current={cur}
          label={`Step ${cur + 1} of ${nodes.length}`}
        />
        <span className="text-small">
          <span className="text-subtle">Now: </span>
          <span className="font-medium">{nodes[cur].full}</span>
          {nodes[cur].stat && nodes[cur].stat !== "Not yet"
            ? ` · ${nodes[cur].stat}`
            : ""}
        </span>
      </p>
      <div className="hidden md:block">{line}</div>
    </>
  );
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
        <AgreementStages w={w} g={g} viewer={persona} />
      </div>
      <NextForRecord persona={persona} g={g} side={side} />

      <Section title={commercial ? "Payments" : "Where the money is"}>
        <div className="mt-4">
          <FundingBar
            m={t}
            audience={me ? "recipient" : "funder"}
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
          t.paid > t.received &&
          canAct(w, persona, g) &&
          persona.role !== "coach" && (
            <ActionButton
              className="mt-5"
              actor={persona.id}
              type="confirmReceipt"
              args={{ agreementId: id, entryId: `rc-${id}-${Date.now()}` }}
              success="Thank you. Arrival confirmed (your confirmation, not a bank check)."
            >
              Confirm I received {fmt(t.paid - t.received)}
            </ActionButton>
          )}
      </Section>

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
                        persona.perms.includes("Review")) &&
                      (e.status === "reported" || e.status === "query") &&
                      e.receipt && (
                        <ActionButton
                          actor={persona.id}
                          type="checkExpense"
                          args={{ expenseId: e.id }}
                          variant="secondary"
                          success="Checked."
                        >
                          Check
                        </ActionButton>
                      )}
                    {side === "funder" &&
                      (persona.perms.includes("Finance") ||
                        persona.perms.includes("Review")) &&
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
          {progress.length === 0 ? (
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
                        ? ` · confirmed by ${w.people[p.attestedBy]?.name} (coach)`
                        : ""}
                      {p.by !== g.recipientId && w.people[p.by]
                        ? ` · sent by ${minor && !me ? "the athlete's coach" : w.people[p.by].name}`
                        : ""}
                    </p>
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
  let msg: string | null = null;
  if (side === "recipient") {
    if (t.paid > t.received)
      msg = `Confirm that ${fmt(t.paid - t.received)} arrived.`;
    else if (ex.some((e) => e.status === "query"))
      msg = "The funder asked for a receipt. Add it below.";
    else if (t.paid > t.spent && BEHAVIOUR_OF(w, g.fundId) !== "commercial")
      msg = `${fmt(t.paid - t.spent)} is not yet accounted for. Add spending as you go.`;
  } else {
    const toCheck = ex.filter((e) => e.status === "reported" && e.receipt);
    if (
      toCheck.length &&
      (persona.perms.includes("Finance") || persona.perms.includes("Review"))
    )
      msg = `${toCheck.length} expense${toCheck.length > 1 ? "s" : ""} to check (${fmt(toCheck.reduce((a, e) => a + e.amount, 0))}).`;
    else if (
      t.stillToPay > 0 &&
      t.paid === 0 &&
      persona.perms.includes("Finance") &&
      !g.status?.startsWith("awaiting")
    )
      msg = "Record the first payment.";
  }
  if (!msg) return null;
  return (
    <p
      role="status"
      className="mt-6 flex gap-2 border-l-2 border-signal pl-3 font-medium"
    >
      Next: {msg}
    </p>
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

function RecordPayment({ persona, g }: { persona: Person; g: Agreement }) {
  const { world: w } = useStore();
  const t = agreementTotals(w, g.id);
  const halves = ["Scholarship award", "Sponsorship agreement"].includes(
    w.funds[g.fundId].type,
  );
  const [amount, setAmount] = useState(
    String(halves && t.paid === 0 ? g.amount / 2 : t.stillToPay),
  );
  const act = useAction(persona.id);
  const n =
    w.ledger.filter((l) => l.agreementId === g.id && l.kind === "release")
      .length + 1;
  const cond = Object.values(w.reviews)
    .filter((r) => r.agreementId === g.id)
    .pop();
  return (
    <div className="mt-6 border-t border-line pt-5">
      <Label>Record a payment (simulated)</Label>
      <div className="mt-2 flex flex-wrap items-end gap-3">
        <div>
          <label
            htmlFor={`pay-${g.id}`}
            className="block text-small text-subtle"
          >
            Amount (USD), {fmt(t.stillToPay)} still to pay
          </label>
          <input
            id={`pay-${g.id}`}
            inputMode="numeric"
            className={cn(inputCls, "mt-1 max-w-[10rem]")}
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
          />
        </div>
        <Button
          variant={
            cond?.decision === "Continue" || !cond ? "primary" : "secondary"
          }
          onClick={() =>
            act.run(
              "recordRelease",
              {
                agreementId: g.id,
                amount: Number(amount),
                ref: `PAY-${g.id.toUpperCase()}-${n}`,
                entryId: `le-${g.id}-${Date.now()}`,
              },
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
  const [decision, setDecision] = useState<
    "Continue" | "Continue with conditions" | "Pause" | "Close"
  >("Continue");
  const [conditions, setConditions] = useState("");
  const act = useAction(persona.id);
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
                  ? "border-ink bg-surface-2 font-medium"
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
                      className={btn("secondary", "min-h-10")}
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
  const back = () => go(`app/${persona.id}/agreement/${g.id}`);
  return (
    <div className="max-w-2xl pb-10">
      <PageHead
        eyebrow="Send an update"
        title={
          kind === "spending"
            ? "What did you spend money on?"
            : kind === "progress"
              ? "What happened in your sport?"
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
                ? "border-ink bg-surface-2 font-medium"
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
  const { world: w } = useStore();
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
        if (
          act.run(
            "addExpense",
            {
              expenseId: `ex-${g.id}-${Date.now()}`,
              agreementId: g.id,
              what,
              amount: Number(amount),
              paidOn: day(paidOn),
              receipt,
            },
            "Added. The funder checks it against the receipt.",
          )
        )
          onDone();
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
            onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
          />
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
  const { world: w } = useStore();
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
        )
          onDone();
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
                  ? "border-ink bg-surface-2 font-medium"
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
  const { world: w } = useStore();
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
        )
          onDone();
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
        lead={`${t.delivered} of ${t.due} sessions so far have run (${t.planned} planned this quarter) · ${t.participants} participants · ${p.sites.length} sites${funder ? " · you see counts, never children's details" : ""}`}
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
        className="flex flex-wrap gap-1"
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
              "flex h-5 w-3.5 items-center justify-center rounded-[2px] text-[9px] font-bold",
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
        {site.name} missed two sessions in a row
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
                        : "Venue not available"}
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

export function ReportPage({ persona, id }: { persona: Person; id: string }) {
  const { world: w } = useStore();
  const g = w.agreements[id];
  const report = Object.values(w.reports)
    .filter((r) => r.agreementId === id)
    .pop();
  const [text, setText] = useState(report?.text ?? "");
  const [reason, setReason] = useState("");
  const act = useAction(persona.id);
  if (!g) return <Empty>This report does not exist.</Empty>;
  const side = sideOf(w, persona, g);
  if (!side)
    return (
      <Empty>
        Reports are shared only with the organisation and its funder.
      </Empty>
    );
  const staff = side === "recipient" && persona.orgId === g.recipientId;
  const flags = claimsCheck(text);
  const gap = text.includes("[What participants");
  const editable =
    staff &&
    (!report || report.status === "draft" || report.status === "returned");
  const funderName = w.funders[w.funds[g.fundId].funderId].name;
  return (
    <div className="max-w-3xl pb-10">
      <PageHead
        eyebrow={`Report · ${recipientName(w, g.recipientKind, g.recipientId, persona)} → ${funderName}`}
        title={
          staff
            ? editable
              ? "What can we honestly report?"
              : "What we reported"
            : "What does the report say?"
        }
        lead={
          report
            ? `${report.period} · ${report.status === "accepted" ? `accepted by ${w.people[report.decidedBy ?? ""]?.name}` : report.status === "submitted" ? "sent to the funder" : report.status === "returned" ? `returned: “${report.reason}”` : "draft"}`
            : "No report yet."
        }
      />
      {!report && staff && (
        <div className="flex flex-wrap items-center gap-3">
          <ActionButton
            actor={persona.id}
            type="draftReport"
            args={{
              reportId: `rep-${id}-${Date.now()}`,
              agreementId: id,
              period: "April to June 2027",
            }}
            success="Drafted from your records. Read it, add your own words, then send it."
          >
            <Sparkles className="size-4" aria-hidden="true" /> Draft it from our
            records
          </ActionButton>
          <SimulatedAI />
        </div>
      )}
      {report && editable && (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <SimulatedAI />
            <span className="text-small text-subtle">
              Drafted only from your records. Every figure can be traced. Edit
              freely.
            </span>
          </div>
          <label htmlFor="rep-text" className="sr-only">
            Report text
          </label>
          <textarea
            id="rep-text"
            rows={14}
            className="mt-3 w-full rounded-[6px] border border-control bg-surface-2 p-4 leading-relaxed text-ink"
            value={text || report.text}
            onChange={(e) => setText(e.target.value)}
          />
          <div role="status" className="mt-3 text-small">
            {flags.length ? (
              <p className="text-amber">
                <CircleAlert
                  className="mr-1 inline size-4"
                  aria-hidden="true"
                />{" "}
                &ldquo;{flags[0]}&rdquo; claims more than your records show. Say
                what was measured instead, for example what participants said in
                a survey and how many answered.
              </p>
            ) : (text || report.text).includes("[What participants") ? (
              <p className="text-muted">
                Replace the part in square brackets with your own words, or
                delete it.
              </p>
            ) : (
              <p className="text-muted">
                <CircleCheck
                  className="mr-1 inline size-4 text-ok"
                  aria-hidden="true"
                />{" "}
                Claims check passed: nothing claims more than the records show.
              </p>
            )}
          </div>
          <Button
            className="mt-5"
            onClick={() =>
              act.run(
                "submitReport",
                { reportId: report.id, text: text || report.text },
                `Sent to ${funderName}.`,
              )
            }
            arrow
          >
            Send to {funderName}
          </Button>
          {(flags.length > 0 || gap) && (
            <span className="sr-only">The report cannot be sent yet.</span>
          )}
        </>
      )}
      {report && !editable && (
        <article className="whitespace-pre-line border-l-2 border-line-strong pl-5 leading-relaxed">
          {report.text}
        </article>
      )}
      {report?.status === "submitted" &&
        side === "funder" &&
        (persona.perms.includes("Review") ||
          persona.perms.includes("Approve")) && (
          <div className="mt-6 flex flex-wrap items-end gap-3">
            <ActionButton
              actor={persona.id}
              type="decideReport"
              args={{ reportId: report.id, accept: true }}
              success="Accepted."
            >
              Accept the report
            </ActionButton>
            <div className="min-w-64 flex-1">
              <label htmlFor="ret" className="block text-small text-subtle">
                Or return it with a question
              </label>
              <input
                id="ret"
                className={cn(inputCls, "mt-1")}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="For example: please add the minibus receipt"
              />
            </div>
            <ActionButton
              actor={persona.id}
              type="decideReport"
              args={{ reportId: report.id, accept: false, reason }}
              variant="secondary"
              success="Returned with your question."
            >
              Return it
            </ActionButton>
          </div>
        )}
      {report && report.status !== "draft" && (
        <button
          type="button"
          className={btn("quiet", "mt-6")}
          onClick={() => window.print()}
        >
          <Printer className="size-4" aria-hidden="true" /> Print or save as PDF
        </button>
      )}
      <Message error={act.error} done={act.done} />
      <p className="mt-8 text-small text-subtle">
        {HONESTY} Outputs (sessions, spending), sporting outcomes and wider
        impact are kept apart.
      </p>
    </div>
  );
}

/* ---------------------------------------------------- Ask Revivo (AI C) */

type Answer = { q: string; a: string[]; sources: string[]; refusal?: boolean };
const REFUSE =
  /\b(best|rank|ranking|top|who should we fund|should we fund|most talented|potential|which child|name of|names of|who is the child|worst)\b/i;

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
    const pr = Object.values(w.progress).filter((x) => x.agreementId === g.id);
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
