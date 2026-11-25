import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./brand/tokens.css";
import App from "./App";
import { StoreProvider } from "./state/store";
import { SourceProvider } from "./components/ui";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StoreProvider>
      <SourceProvider>
        <App />
      </SourceProvider>
    </StoreProvider>
  </StrictMode>,
);
