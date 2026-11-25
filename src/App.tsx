import { useStore } from "./state/store";
import { AppFrame, GuidePanel, PrototypeBar } from "./components/Shell";
import { Roles, Start } from "./screens/Start";
import { Apply, FunderProfile, Join, MyFunding, MyProfile, OpportunityPage, Publish, SeekerApplications, SeekerDiscover, SeekerHome } from "./screens/Seeker";
import { AthleteForFunder, FunderApplications, FunderDiscover, FunderOpportunities, FunderOverview, Portfolio, RequestPage, ReviewPage, SelectionPage } from "./screens/Funder";
import { Admin, Safety } from "./screens/Other";
import { Planned } from "./screens/Planned";
import { HOME_SCREEN } from "./data/structure";
import type { Person } from "./domain/model";

export default function App() {
  const { route, world } = useStore();
  const [top, pid, screen, param] = route;
  let body;
  if (top === "roles") body = <Roles />;
  else if (top === "join") body = <Join />;
  else if (top === "app" && world.people[pid]) {
    const persona = world.people[pid];
    const sc = (screen ?? HOME_SCREEN[persona.role]).split("?")[0];
    body = (
      <AppFrame persona={persona} active={sc}>
        {/* Keyed by person and record, so a form or message never carries over from one person's screen to another's. */}
        <div key={`${pid}/${sc}/${param ?? ""}`}>{renderScreen(sc, param?.split("?")[0], persona)}</div>
      </AppFrame>
    );
  } else body = <Start />;
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-canvas focus:p-2">
        Skip to content
      </a>
      <PrototypeBar />
      {body}
      <GuidePanel />
    </>
  );
}

const FUNDER_ONLY = ["request", "athlete", "opps", "apps", "review", "selection"];

function renderScreen(sc: string, param: string | undefined, p: Person) {
  const funder = !!p.funderId && p.role !== "athlete";
  // Screens belong to a role: a link opened by someone else shows a plain note, never another role's records.
  if (FUNDER_ONLY.includes(sc) && !funder) return <RoleNote />;
  if (sc === "admin" && p.role !== "admin") return <RoleNote />;
  switch (sc) {
    case "home":
      return <SeekerHome persona={p} />;
    case "overview":
      return funder ? <FunderOverview persona={p} /> : <SeekerHome persona={p} />;
    case "discover":
      return <SeekerDiscover persona={p} />;
    case "fdiscover":
      return funder ? <FunderDiscover persona={p} /> : <SeekerDiscover persona={p} />;
    case "opportunity":
      return <OpportunityPage persona={p} id={param ?? "eas"} />;
    case "profile":
      return <FunderProfile persona={p} id={param ?? "oriel"} />;
    case "apply":
      return <Apply persona={p} oppId={param ?? "eas"} />;
    case "applications":
      return <SeekerApplications persona={p} />;
    case "funding":
      return <MyFunding persona={p} />;
    case "me":
      return <MyProfile persona={p} />;
    case "publish":
      return <Publish persona={p} />;
    case "safety":
      return <Safety persona={p} />;
    case "request":
      return <RequestPage persona={p} id={param ?? ""} />;
    case "athlete":
      return <AthleteForFunder persona={p} id={param ?? ""} />;
    case "opps":
      return <FunderOpportunities persona={p} />;
    case "apps":
      return <FunderApplications persona={p} />;
    case "review":
      return <ReviewPage persona={p} id={param ?? ""} />;
    case "selection":
      return <SelectionPage persona={p} id={param ?? "eas"} />;
    case "portfolio":
      return funder ? <Portfolio persona={p} /> : <MyFunding persona={p} />;
    case "admin":
      return <Admin persona={p} />;
    default: {
      const n = Number(sc.replace(/^s/, ""));
      return <Planned n={Number.isFinite(n) && n > 0 ? n : 3} persona={p} />;
    }
  }
}

function RoleNote() {
  return <p className="border-b border-line py-8 text-muted">This screen belongs to another role. Use the menu to continue.</p>;
}
