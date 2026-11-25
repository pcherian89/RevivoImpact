import { useStore } from "./state/store";
import { AppFrame, GuidePanel, personaById, PrototypeBar } from "./components/Shell";
import { Roles, Start } from "./screens/Start";
import { AthleteHome, FunderProfile, FundingRecord, Join, OpportunityPage, SeekerDiscover } from "./screens/Seeker";
import { FunderDiscover, FunderOverview, Portfolio, RequestPage } from "./screens/Funder";
import { Planned } from "./screens/Planned";
import { HOME_SCREEN } from "./data/structure";
import { PERSONAS } from "./data/world";

export default function App() {
  const { route } = useStore();
  const [top, pid, screen, param] = route;
  let body;
  if (top === "roles") body = <Roles />;
  else if (top === "join") body = <Join />;
  else if (top === "app") {
    const persona = personaById(pid) ?? PERSONAS[0];
    const sc = screen ?? HOME_SCREEN[persona.role];
    body = <AppFrame persona={persona} active={sc}>{renderScreen(sc, param, persona)}</AppFrame>;
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

function renderScreen(sc: string, param: string | undefined, persona: (typeof PERSONAS)[number]) {
  switch (sc) {
    case "home":
      return <AthleteHome persona={persona} />;
    case "discover":
      return <SeekerDiscover persona={persona} />;
    case "opportunity":
      return <OpportunityPage persona={persona} id={param ?? "eas"} />;
    case "profile":
      return <FunderProfile persona={persona} id={param ?? "oriel"} />;
    case "funding":
      return persona.id === "amira" ? <FundingRecord persona={persona} /> : <Planned n={17} persona={persona} />;
    case "overview":
      return <FunderOverview persona={persona} />;
    case "fdiscover":
      return <FunderDiscover persona={persona} />;
    case "request":
      return <RequestPage persona={persona} id={param ?? "nadia"} />;
    case "portfolio":
      return <Portfolio persona={persona} />;
    default: {
      const n = Number(sc.replace(/^s/, ""));
      return <Planned n={Number.isFinite(n) && n > 0 ? n : 3} persona={persona} />;
    }
  }
}
