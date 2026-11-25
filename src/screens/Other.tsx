import { CircleCheck, Lock, ShieldCheck } from "lucide-react";
import { useStore } from "../state/store";
import type { Person } from "../domain/model";
import { fmt } from "../domain/engine";
import { Chip, cn, PageHead, Tabs } from "../components/ui";
import { ActionButton, Empty, Row, Section, useAction } from "./common";
import { useManaging } from "../components/Shell";
import { useState } from "react";

/* ===================================================== Consent & safety (22) */

export function Safety({ persona }: { persona: Person }) {
  const { world: w } = useStore();
  const managing = useManaging();
  const athId = persona.role === "athlete" ? persona.id : managing;
  const ath = athId ? w.athletes[athId] : undefined;
  const act = useAction(persona.id);
  if (!ath) return <Empty>Choose an athlete first.</Empty>;
  const consent = (p: "photos" | "progress") => w.consents.find((c) => c.athleteId === ath.id && c.purpose === p)?.value;
  const reps = w.authorisations.filter((a) => a.athleteId === ath.id);
  const reqs = Object.values(w.requests).filter((r) => r.ownerId === ath.id && r.status === "open");
  const funders = [...new Set(Object.values(w.offers).filter((o) => o.recipientId === ath.id).map((o) => w.funds[o.fundId].funderId))];
  const blocked = w.blocks.filter((b) => b.athleteId === ath.id).map((b) => b.funderId);
  const canChange = persona.role === "guardian" || persona.role === "athlete";
  return (
    <div className="pb-8">
      <PageHead eyebrow={persona.role === "athlete" ? "Consent & safety" : `My Athletes · ${ath.name}`} title="Who can see what, and how do I stay in control?" lead="Every choice takes effect at once. Saying no changes nothing else." />
      {!canChange && <p className="flex gap-2 text-muted"><Lock className="mt-1 size-4" aria-hidden="true" /> As a coach you cannot change consent, accept offers or publish requests.</p>}
      <Section title="What you have agreed to">
        <ul>
          {(
            [
              ["photos", "Photos and stories in updates", "Photos are removed from every update and report at once."],
              ["progress", "Progress reporting to funders", "Funders see “sharing paused”; a person reviews; nothing is penalised automatically."],
            ] as const
          ).map(([p, label, effect]) => {
            const v = consent(p);
            return (
              <li key={p} className="border-b border-line py-4">
                <p className="font-medium">{label}</p>
                <p className="text-small text-subtle">{effect}</p>
                <div className="mt-3 flex gap-3">
                  {[true, false].map((val) => (
                    <button key={String(val)} type="button" disabled={!canChange} aria-pressed={v === val} onClick={() => act.run("setConsent", { athleteId: ath.id, purpose: p, value: val })} className={cn("min-h-11 min-w-24 rounded-full border px-5 font-display font-bold disabled:opacity-50", v === val ? (val ? "border-lime bg-lime text-on-lime" : "border-ink bg-ink text-canvas") : "border-control text-ink")}>
                      {val ? "Yes" : "No"}
                    </button>
                  ))}
                  <span className="self-center text-small text-subtle">{v === undefined ? "Not chosen yet" : "Change or withdraw at any time"}</span>
                </div>
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
                  {r.title} {r.minor && <Chip kind="neutral">Shown without names</Chip>}
                </span>
                {r.discoverable && canChange ? (
                  <ActionButton actor={persona.id} type="hideRequest" args={{ requestId: r.id }} variant="secondary" success="Hidden from Discover. Existing offers and agreements continue.">
                    Hide from discovery
                  </ActionButton>
                ) : (
                  <Chip kind="self">{r.discoverable ? "Visible" : "Hidden from discovery"}</Chip>
                )}
              </Row>
            ))}
          </ul>
        </Section>
      )}
      <Section title={`Who can act for ${ath.name.split(" ")[0]}`}>
        <ul>
          {reps.map((z) => (
            <Row key={z.coachId}>
              <span>
                {w.people[z.coachId]?.name} · coach
              </span>
              <span className="text-small text-subtle">May: prepare applications, submit updates. Never: submit for a minor, accept offers, publish requests, change consent.</span>
            </Row>
          ))}
          {reps.length === 0 && <Empty li>No coach authorised.</Empty>}
        </ul>
        {canChange && !reps.some((z) => z.coachId === "jonas") && ath.club === "Saltmere Sports Academy" && ath.sport === "Swimming" && (
          <ActionButton className="mt-4" actor={persona.id} type="authoriseCoach" args={{ athleteId: ath.id, coachId: "jonas" }} success="Jonas Becker authorised with limited powers.">
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
                <Chip kind="self">Blocked: no new contact; existing agreements continue</Chip>
              ) : canChange ? (
                <ActionButton actor={persona.id} type="blockFunder" args={{ athleteId: ath.id, funderId: fid }} variant="secondary" success="Blocked.">
                  Block
                </ActionButton>
              ) : null}
            </Row>
          ))}
          {funders.length === 0 && <Empty li>No funder has contacted you yet.</Empty>}
        </ul>
        <p className="mt-3 text-small text-subtle">To report a concern about any contact, use &ldquo;Report a concern&rdquo;: it goes to the platform&rsquo;s safeguarding team (simulated).</p>
      </Section>
    </div>
  );
}

/* ============================================================ Audit & admin */

export function Admin({ persona }: { persona: Person }) {
  const { world: w } = useStore();
  const [tab, setTab] = useState<"safeguarding" | "verification" | "audit">("safeguarding");
  const reviews = Object.values(w.offers).filter((o) => o.status === "safeguarding");
  const unverified = Object.values(w.funders).filter((f) => !f.verified);
  const cards = Object.values(w.requests).filter((r) => r.minor);
  return (
    <div className="pb-8">
      <PageHead eyebrow="Audit & admin" title="Who did what, when and why?" lead="Platform administration (simulated): safeguarding reviews, verification and the audit. Administrators never see athletes' documents." />
      <Tabs label="Admin" value={tab} onChange={setTab} tabs={[{ id: "safeguarding", label: "Safeguarding", count: reviews.length }, { id: "verification", label: "Verification", count: unverified.length }, { id: "audit", label: "Audit", count: w.audit.length }]} />
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
                    <ActionButton actor={persona.id} type="clearSafeguarding" args={{ offerId: o.id }} success="Released to the guardian.">
                      Release to the guardian
                    </ActionButton>
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
              {[...w.audit].reverse().slice(0, 80).map((r) => (
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
          <p className="mt-2 flex gap-2 text-small text-subtle"><CircleCheck className="size-4" aria-hidden="true" /> Every action in the prototype writes one row. Most recent first.</p>
        </div>
      )}
    </div>
  );
}
