import { CircleCheck, Lock, ShieldCheck } from "lucide-react";
import { useStore } from "../state/store";
import type { Person } from "../domain/model";
import { fmt } from "../domain/engine";
import { btn, Chip, PageHead, seg, Tabs } from "../components/ui";
import { ActionButton, Empty, inputCls, Message, Row, Section, useAction } from "./common";
import { useManaging } from "../components/Shell";
import { useState } from "react";

/* ===================================================== Consent & safety (22) */

export function Safety({ persona }: { persona: Person }) {
  const { world: w } = useStore();
  const managing = useManaging();
  const athId = persona.role === "athlete" ? persona.id : managing;
  const ath = athId ? w.athletes[athId] : undefined;
  const act = useAction(persona.id);
  const [last, setLast] = useState<string>("");
  const [confirmBlock, setConfirmBlock] = useState<string | null>(null);
  if (!ath) return <Empty>Choose an athlete first.</Empty>;
  const consent = (p: "photos" | "progress") => w.consents.find((c) => c.athleteId === ath.id && c.purpose === p)?.value;
  const reps = w.authorisations.filter((a) => a.athleteId === ath.id);
  const reqs = Object.values(w.requests).filter((r) => r.ownerId === ath.id && r.status === "open");
  const funders = [...new Set(Object.values(w.offers).filter((o) => o.recipientId === ath.id).map((o) => w.funds[o.fundId].funderId))];
  const blocked = w.blocks.filter((b) => b.athleteId === ath.id).map((b) => b.funderId);
  const canChange = persona.role === "guardian" || persona.role === "athlete";
  return (
    <div className="pb-8">
      <PageHead eyebrow={persona.role === "athlete" ? "Consent & safety" : `Consent & safety · ${ath.name}`} title="Who can see what, and how do I stay in control?" lead="Every choice takes effect at once. Saying no changes nothing else." />
      <p className="-mt-2 mb-6">
        <a className="font-medium underline underline-offset-4 hover:text-signal" href={`#/app/${persona.id}/me`}>
          {persona.role === "athlete" ? "See exactly what funders see about me" : `See exactly what funders see about ${ath.name.split(" ")[0]}`}
        </a>
      </p>
      {!canChange && <p className="flex gap-2 text-muted"><Lock className="mt-1 size-4" aria-hidden="true" /> As a coach you can see these choices, but only {ath.name.split(" ")[0]}&rsquo;s guardian can change them, accept offers or publish requests.</p>}
      <Section title={canChange ? "Your choices" : `${ath.name.split(" ")[0]}'s choices`}>
        <ul>
          {(
            [
              ["photos", "Photos and stories in updates", "If you choose No, photos are removed from every update and report at once."],
              ["progress", "Progress reporting to funders", "If you choose No, funders see “sharing paused”; a person follows up; nothing is penalised automatically."],
            ] as const
          ).map(([p, label, effect]) => {
            const v = consent(p);
            return (
              <li key={p} className="border-b border-line py-4">
                <p className="font-medium">{label}</p>
                <p className="text-small text-subtle">{effect}</p>
                <div className="mt-3 flex gap-3">
                  {[true, false].map((val) => (
                    <button key={String(val)} type="button" disabled={!canChange} aria-pressed={v === val} onClick={() => (setLast(p), act.run("setConsent", { athleteId: ath.id, purpose: p, value: val }, val ? `${label}: on for ${ath.name.split(" ")[0]}.` : `${label}: off for ${ath.name.split(" ")[0]}. This takes effect now.`))} className={seg(v === val)}>
                      {val ? "Yes" : "No"}
                    </button>
                  ))}
                  <span className="self-center text-small text-subtle">{v === undefined ? "Not chosen yet" : "Change or withdraw at any time"}</span>
                </div>
                {last === p && <Message error={act.error} done={act.done} />}
              </li>
            );
          })}
        </ul>
      </Section>
      {reqs.length > 0 && (
        <Section title="Funding requests in Discover">
          <ul>
            {reqs.map((r) => (
              <Row key={r.id}>
                <span>
                  {r.title}
                </span>
                {r.discoverable && canChange ? (
                  <ActionButton actor={persona.id} type="hideRequest" args={{ requestId: r.id }} variant="secondary" success="Hidden from Discover. Existing offers and agreements continue.">
                    Hide from discovery
                  </ActionButton>
                ) : (
                  <Chip kind="self">{r.discoverable ? (r.minor ? "In Discover, without names" : "In Discover") : "Hidden from Discover"}</Chip>
                )}
              </Row>
            ))}
          </ul>
        </Section>
      )}
      <Section title={`Who can act for ${ath.name.split(" ")[0]}`}>
        <ul>
          {ath.minor && ath.guardianId && w.people[ath.guardianId] && (
            <Row>
              <span>{w.people[ath.guardianId].name} · guardian</span>
              <span className="text-small text-subtle">Everything: accepts offers, publishes requests, controls consent.</span>
            </Row>
          )}
          {reps.map((z) => (
            <Row key={z.coachId}>
              <span>
                {w.people[z.coachId]?.name} · coach
              </span>
              <span className="flex flex-col items-start gap-2 text-small text-subtle sm:items-end">
                May: prepare applications, submit updates. Never: submit for a minor, accept offers, publish requests, change consent.
                {canChange && (
                  <ActionButton actor={persona.id} type="removeCoach" args={{ athleteId: ath.id, coachId: z.coachId }} variant="secondary" success="Access removed. This takes effect now.">
                    Remove access
                  </ActionButton>
                )}
              </span>
            </Row>
          ))}
          {reps.length === 0 && <Empty li>No coach authorised.</Empty>}
        </ul>
        {canChange && !reps.some((z) => z.coachId === "jonas") && ath.club === "Saltmere Sports Academy" && ath.sport === "Swimming" && (
          <ActionButton className="mt-4" actor={persona.id} type="authoriseCoach" args={{ athleteId: ath.id, coachId: "jonas" }} variant="secondary" success="Jonas Becker authorised with limited powers.">
            Authorise Jonas Becker (prepare and updates only)
          </ActionButton>
        )}
      </Section>
      <Section title="Block or report">
        <ul>
          {funders.map((fid) => (
            <Row key={fid}>
              <span>{w.funders[fid].name}</span>
              {blocked.includes(fid) ? (
                <span className="flex flex-wrap items-center gap-2">
                  <Chip kind="self">Blocked: no new contact; existing agreements continue</Chip>
                  {canChange && (
                    <ActionButton actor={persona.id} type="unblockFunder" args={{ athleteId: ath.id, funderId: fid }} variant="secondary" success="Unblocked. They can contact you again; lapsed offers stay lapsed.">
                      Unblock
                    </ActionButton>
                  )}
                </span>
              ) : canChange && confirmBlock === fid ? (
                <span className="flex flex-col items-start gap-2 sm:items-end">
                  <span className="text-small text-muted">Block {w.funders[fid].name}? Their open offers lapse. Agreed funding continues.</span>
                  <span className="flex gap-2">
                    <ActionButton actor={persona.id} type="blockFunder" args={{ athleteId: ath.id, funderId: fid }} variant="secondary" success="Blocked. You can unblock at any time.">
                      Yes, block
                    </ActionButton>
                    <button type="button" className="min-h-11 px-3 text-small text-muted underline" onClick={() => setConfirmBlock(null)}>
                      Cancel
                    </button>
                  </span>
                </span>
              ) : canChange ? (
                <button type="button" className={btn("secondary")} onClick={() => setConfirmBlock(fid)}>
                  Block
                </button>
              ) : null}
            </Row>
          ))}
          {funders.length === 0 && <Empty li>No funder has contacted you yet.</Empty>}
        </ul>
        {canChange ? (
          <ActionButton className="mt-4" actor={persona.id} type="reportConcern" args={{ concernId: `cn-${ath.id}-${w.concerns.length + 1}`, athleteId: ath.id, funderId: funders[0], about: "Contact that did not feel right" }} variant="secondary" success="Sent to the platform safeguarding team (simulated). A person reviews it; nothing is decided automatically.">
            Report a concern
          </ActionButton>
        ) : null}
        <p className="mt-3 text-small text-subtle">&ldquo;Report a concern&rdquo; goes to the platform&rsquo;s safeguarding team (simulated), which a person reviews. Blocking takes effect at once.</p>
      </Section>
    </div>
  );
}

/* ============================================================ Audit & admin */

export function Admin({ persona }: { persona: Person }) {
  const { world: w } = useStore();
  const [tab, setTab] = useState<"safeguarding" | "verification" | "audit">("safeguarding");
  const [find, setFind] = useState("");
  const reviews = Object.values(w.offers).filter((o) => o.status === "safeguarding");
  const unverified = Object.values(w.funders).filter((f) => !f.verified);
  const cards = Object.values(w.requests).filter((r) => r.minor);
  return (
    <div className="pb-8">
      <PageHead eyebrow="Audit & admin" title="Who did what, when and why?" lead="Platform administration (simulated): safeguarding reviews, verification and the audit. Administrators never see athletes' documents." />
      <Tabs label="Admin" value={tab} onChange={setTab} tabs={[{ id: "safeguarding", label: "Safeguarding", count: reviews.length + w.concerns.length }, { id: "verification", label: "Verification", count: unverified.length }, { id: "audit", label: "Audit", count: w.audit.length }]} />
      {tab === "safeguarding" && (
        <>
          <Section title="Offers to young athletes from individual sponsors">
            {reviews.length === 0 ? <Empty>Nothing waiting. Offers from individual sponsors to athletes under 18 appear here before they reach the guardian.</Empty> : (
              <ul>
                {reviews.map((o) => (
                  <Row key={o.id}>
                    <div>
                      <p className="font-medium">
                        {w.funders[w.funds[o.fundId].funderId].name} offers {fmt(o.amount)} · {w.requests[o.requestId ?? ""]?.title}
                      </p>
                      <p className="text-small text-subtle">Enhanced safeguarding check on file (simulated) · contact only through the guardian · reason: &ldquo;{o.reason}&rdquo;</p>
                    </div>
                    <SafeguardingDecision persona={persona} offerId={o.id} />
                  </Row>
                ))}
              </ul>
            )}
          </Section>
          <Section title="Concerns reported">
            {w.concerns.length === 0 ? <Empty>No concerns reported.</Empty> : (
              <ul>
                {w.concerns.map((x) => (
                  <Row key={x.id}>
                    <span>
                      {x.about} · {x.funderId ? w.funders[x.funderId]?.name : "no funder named"} · reported by the {w.athletes[x.athleteId]?.minor ? "guardian of an athlete under 18" : "athlete"}
                    </span>
                    <Chip kind="attention">For a person to review</Chip>
                  </Row>
                ))}
              </ul>
            )}
          </Section>
          <Section title="Anonymised cards">
            <ul>
              {cards.map((r) => (
                <Row key={r.id}>
                  <span>
                    {r.sport} · {r.ageGroup} · {r.region} · {r.title}
                  </span>
                  <span className="flex items-center gap-2 text-small text-subtle">
                    <ShieldCheck className="size-4" aria-hidden="true" /> {r.safeguarding ?? "Checked"}
                  </span>
                </Row>
              ))}
            </ul>
          </Section>
        </>
      )}
      {tab === "verification" && (
        <Section title="Participating funders awaiting verification">
          {unverified.length === 0 ? <Empty>All participating funders are verified (simulated). New sponsors who join appear here.</Empty> : (
            <ul>
              {unverified.map((f) => (
                <Row key={f.id}>
                  <span>
                    {f.name} · {f.type}
                  </span>
                  <ActionButton actor={persona.id} type="verifyOrganisation" args={{ funderId: f.id }} success="Verified (simulated).">
                    Verify (simulated)
                  </ActionButton>
                </Row>
              ))}
            </ul>
          )}
        </Section>
      )}
      {tab === "audit" && (
        <div className="relative mt-4 overflow-x-auto">
          <label htmlFor="audit-find" className="text-small text-subtle">Find a person, action or record</label>
          <input id="audit-find" className={inputCls + " mt-1 mb-4 max-w-md"} value={find} onChange={(e) => setFind(e.target.value)} placeholder="For example: Kenji, offered, Greenpark" />
          <table className="w-full min-w-[44rem] text-table">
            <thead>
              <tr className="label-data border-b border-line text-left text-subtle">
                <th className="py-3 pr-4">#</th>
                <th className="py-3 pr-4">Date</th>
                <th className="py-3 pr-4">Who</th>
                <th className="py-3 pr-4">Action</th>
                <th className="py-3">Record</th>
              </tr>
            </thead>
            <tbody>
              {[...w.audit].reverse().filter((r) => !find.trim() || `${w.people[r.actor]?.name ?? r.actor} ${r.action} ${r.record}`.toLowerCase().includes(find.trim().toLowerCase())).slice(0, 80).map((r) => (
                <tr key={r.n} className="border-b border-line align-top">
                  <td className="py-2 pr-4 text-subtle">{r.n}</td>
                  <td className="py-2 pr-4">{r.at === "apr12" ? "12 Apr" : r.at === "may06" ? "6 May" : "30 Jun"}</td>
                  <td className="py-2 pr-4">
                    {w.people[r.actor]?.name ?? r.actor}
                    {r.onBehalf && <span className="block text-small text-subtle">on behalf of {r.onBehalf}</span>}
                  </td>
                  <td className="py-2 pr-4">{r.action}</td>
                  <td className="py-2">{r.record}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 flex gap-2 text-small text-subtle"><CircleCheck className="size-4" aria-hidden="true" /> Every action in the prototype writes one row, with the reason wherever one was given. Most recent 80 shown first; use Find for older rows.</p>
        </div>
      )}
    </div>
  );
}

/** A safeguarding review can pass an offer to the guardian, or stop it with a reason that is kept in the record. */
function SafeguardingDecision({ persona, offerId }: { persona: Person; offerId: string }) {
  const [stopping, setStopping] = useState(false);
  const [reason, setReason] = useState("");
  if (!stopping)
    return (
      <div className="flex flex-wrap gap-2">
        <ActionButton actor={persona.id} type="clearSafeguarding" args={{ offerId }} success="Safeguarding check passed. Sent to the guardian.">
          Check passed: send to the guardian
        </ActionButton>
        <button type="button" className={btn("secondary")} onClick={() => setStopping(true)}>
          Don&rsquo;t send it
        </button>
      </div>
    );
  return (
    <div className="w-full max-w-md">
      <label htmlFor={`sg-${offerId}`} className="block font-medium">Why is it not being sent?</label>
      <p className="text-small text-subtle">Kept in the record. The guardian never sees this offer; the sponsor is told it was not sent.</p>
      <textarea id={`sg-${offerId}`} rows={2} value={reason} onChange={(e) => setReason(e.target.value)} className="mt-2 w-full rounded-[6px] border border-control bg-surface-2 p-3 text-ink" placeholder="For example: the enhanced check is not complete" />
      <div className="mt-2 flex flex-wrap gap-2">
        <ActionButton actor={persona.id} type="stopSafeguarding" args={{ offerId, reason }} success="The offer was stopped and not sent to the guardian.">
          Stop the offer
        </ActionButton>
        <button type="button" className={btn("quiet")} onClick={() => setStopping(false)}>Back</button>
      </div>
    </div>
  );
}
