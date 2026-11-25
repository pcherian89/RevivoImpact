// Visits every role's screens at every demo date and reports crashes, overflow and console errors.
import { createRequire } from "node:module";
import { resolve } from "node:path";
const { chromium } = createRequire(import.meta.url)("playwright");
const file = "file://" + resolve(process.env.DIST ?? "dist/index.html");
const ROLES = {
  amira: ["home", "discover", "opportunity/eas", "profile/oriel", "apply/eas", "applications", "funding", "me"],
  nadia: ["home", "discover", "profile/halvorsen", "publish", "applications", "funding", "me"],
  jonah: ["home", "applications", "funding", "me"],
  rosa: ["home", "safety", "discover", "applications", "funding", "publish"],
  jonas: ["home", "me", "discover", "applications", "funding"],
  maya: ["home", "discover", "applications", "funding", "me"],
  ewan: ["home", "applications", "funding"],
  ingrid: ["overview", "fdiscover", "opps", "apps", "portfolio", "selection/eas"],
  daniel: ["overview", "apps", "review/app-amira"],
  priya: ["overview", "portfolio"],
  kenji: ["overview", "fdiscover", "request/rq-nadia", "request/rq-tiago", "athlete/nadia", "opps", "apps", "portfolio"],
  lucy: ["overview", "fdiscover", "athlete/jonah", "apps", "portfolio"],
  marcus: ["overview", "fdiscover", "apps", "portfolio"],
  farid: ["overview", "opps", "apps"],
  alex: ["admin"],
  sam: ["s20"],
};
const width = Number(process.env.W ?? 1440);
const browser = await chromium.launch();
let problems = 0, pages = 0;
for (const moment of ["apr12", "may06", "jun30"]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  const errs = [];
  page.on("pageerror", (e) => errs.push(String(e)));
  page.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  for (const [who, screens] of Object.entries(ROLES)) {
    for (const sc of screens) {
      pages++;
      await page.goto(`${file}?moment=${moment}&motion=reduced#/app/${who}/${sc}`);
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
