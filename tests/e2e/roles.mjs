// Visits every role's screens at every demo date and reports crashes, overflow and console errors.
import { createRequire } from "node:module";
import { resolve } from "node:path";
const { chromium } = createRequire(import.meta.url)("playwright");
const file = "file://" + resolve(process.env.DIST ?? "dist/index.html");
const ROLES = {
  amira: ["home", "discover", "opportunity/eas", "profile/oriel", "apply/eas", "applications", "funding", "me", "agreement/ag-amira", "update/ag-amira"],
  nadia: ["home", "discover", "profile/halvorsen", "publish", "applications", "funding", "me", "agreement/ag-oriel-nadia", "update/ag-hal-nadia"],
  jonah: ["home", "applications", "funding", "me", "agreement/ag-cv-jonah", "update/ag-cv-jonah"],
  rosa: ["home", "safety", "discover", "applications", "funding", "publish"],
  jonas: ["home", "me", "discover", "applications", "funding", "agreement/ag-oriel-tiago"],
  maya: ["home", "programme", "discover", "applications", "funding", "agreement/ag-pe1", "report/ag-pe1"],
  lena: ["home", "programme"],
  ewan: ["home", "applications", "funding"],
  ingrid: ["overview", "fdiscover", "opps", "apps", "portfolio", "selection/eas"],
  daniel: ["overview", "apps", "review/app-amira", "portfolio", "agreement/ag-amira", "programme/play-every-day", "report/ag-pe1"],
  priya: ["overview", "portfolio", "agreement/ag-amira", "agreement/ag-pe1"],
  kenji: ["overview", "fdiscover", "request/rq-nadia", "request/rq-tiago", "athlete/nadia", "opps", "apps", "portfolio"],
  lucy: ["overview", "fdiscover", "athlete/jonah", "apps", "portfolio", "agreement/ag-cv-jonah"],
  marcus: ["overview", "fdiscover", "apps", "portfolio"],
  farid: ["overview", "opps", "apps", "portfolio"],
  alex: ["admin"],
  sam: ["today", "programme"],
};
const width = Number(process.env.W ?? 1440);
const browser = await chromium.launch();
let problems = 0, pages = 0;
for (const moment of ["apr12", "may06", "jun30", "complete"]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  const errs = [];
  page.on("pageerror", (e) => errs.push(String(e)));
  page.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  for (const [who, screens] of Object.entries(ROLES)) {
    for (const sc of screens) {
      pages++;
      await page.goto(`${file}?${moment === "complete" ? "story=complete" : `moment=${moment}`}&motion=reduced#/app/${who}/${sc}`);
      await page.waitForTimeout(60);
      const txt = await page.evaluate(() => document.querySelector("main")?.innerText ?? "");
      const over = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      if (errs.length || !txt.trim() || over > 0) {
        problems++;
        console.log(`PROBLEM ${moment} ${who}/${sc}: ${errs.join(" | ").slice(0, 300)} ${!txt.trim() ? "EMPTY" : ""} ${over > 0 ? "OVERFLOW " + over : ""}`);
        errs.length = 0;
      }
    }
  }
  await page.close();
}
await browser.close();
console.log(`${pages} pages checked at ${width}px, ${problems} problems`);
process.exitCode = problems ? 1 : 0;
