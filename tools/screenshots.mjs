// Captures the prototype at phone, tablet and laptop widths (docs/06 §6). Usage: node tools/screenshots.mjs <outDir> [scale]
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("playwright"); // pre-installed browser (not a project dependency)
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";

const out = resolve(process.argv[2] ?? "docs/p1-previews");
const scale = Number(process.argv[3] ?? 2);
mkdirSync(out, { recursive: true });
const file = "file://" + resolve(process.env.DIST ?? "dist/index.html");
const shots = [
  ["01-start", "start", "apr12"],
  ["02-join", "join", "apr12"],
  ["03-athlete-home", "app/amira/home", "jun30"],
  ["04-athlete-discover", "app/amira/discover", "may06"],
  ["05-my-funding", "app/amira/funding", "complete"],
  ["06-send-an-update", "app/amira/update/ag-amira", "jun30"],
  ["07-funding-record-funder", "app/priya/agreement/ag-amira", "complete"],
  ["08-funding-record-athlete", "app/amira/agreement/ag-amira", "complete"],
  ["09-sponsorship-record", "app/jonah/agreement/ag-cv-jonah", "complete"],
  ["10-programme", "app/maya/programme/play-every-day", "complete"],
  ["11-programme-funder-view", "app/daniel/programme/play-every-day", "complete"],
  ["12-today-sessions", "app/sam/today", "may06"],
  ["13-report", "app/maya/report/ag-pe1", "complete"],
  ["14-funder-funding", "app/daniel/portfolio", "complete"],
  ["15-existing-funding", "app/farid/agreement/ag-ostral", "complete"],
  ["16-funder-overview", "app/ingrid/overview", "may06"],
  ["17-funder-discover", "app/kenji/fdiscover", "may06"],
  ["18-selection", "app/ingrid/selection/eas", "may06"],
  ["19-guardian-safety", "app/rosa/safety", "complete"],
  ["20-coach-home", "app/jonas/home", "jun30"],
  ["21-organisation-home", "app/maya/home", "jun30"],
  ["22-admin", "app/alex/admin", "complete"],
  // P4: payments coming up, the funder report, Ask Revivo for funders, a fictional receipt, the guided demo
  ["23-payments-coming-up", "app/priya/portfolio", "jun30"],
  ["24-funder-report", "app/ingrid/freport", "complete"],
  ["25-ask-revivo-funder", "app/ingrid/overview", "complete", ["Ask Revivo about our funding", "Which payments are coming up?"]],
  ["26-receipt-preview", "app/priya/agreement/ag-amira", "complete", ["View the receipt"]],
  ["27-guided-demo", "app/ingrid/opps", "apr12", ["Guided journeys"]],
  ["28-opportunity-eligibility", "app/amira/opportunity/eas", "may06"],
  ["29-sponsor-profile", "app/nadia/profile/halvorsen", "may06"],
  ["30-individual-sponsor-overview", "app/marcus/overview", "may06"],
  ["31-guardian-home", "app/rosa/home", "jun30"],
  ["32-camp-grant", "app/amira/opportunity/ardent-hp", "may06"],
  ["33-brand-profile", "app/nadia/profile/corvane", "may06"],
];
const widths = (process.env.WIDTHS ?? "375,768,1024,1440").split(",").map(Number);
const themes = (process.env.THEMES ?? "dark").split(",");
const only = process.env.ONLY ? process.env.ONLY.split(",") : null;
const browser = await chromium.launch();
for (const theme of themes)
  for (const w of widths) {
    const page = await browser.newPage({ viewport: { width: w, height: w < 600 ? 812 : w < 1100 ? 1024 : 900 }, deviceScaleFactor: scale });
    for (const [name, route, moment, clicks = []] of shots) {
      if (only && !only.includes(name)) continue;
      await page.goto(`${file}?${moment === "complete" ? "story=complete" : `moment=${moment}`}&theme=${theme}&motion=reduced&s=${name}#/${route}`);
      await page.waitForTimeout(250);
      for (const c of clicks) {
        await page.getByRole("button", { name: c }).first().click();
        await page.waitForTimeout(250);
      }
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      if (overflow > 0) console.log(`OVERFLOW ${overflow}px: ${name} @ ${w} ${theme}`);
      // Grow the viewport to the page height so fixed bars (phone navigation) sit at the bottom of the image.
      const h = await page.evaluate(() => document.documentElement.scrollHeight);
      const vh = page.viewportSize().height;
      await page.setViewportSize({ width: w, height: Math.max(vh, h) });
      await page.waitForTimeout(100);
      const jpg = process.env.FORMAT === "jpeg";
      await page.screenshot({ path: `${out}/${name}-${w}-${theme}.${jpg ? "jpg" : "png"}`, ...(jpg ? { type: "jpeg", quality: 82 } : {}) });
      await page.setViewportSize({ width: w, height: vh });
    }
    await page.close();
  }
await browser.close();
console.log("done", out);
