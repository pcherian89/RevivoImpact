// Captures the P1 shell at phone, tablet and laptop widths (docs/06 §6). Usage: node tools/screenshots.mjs <outDir> [scale]
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
  ["03-roles", "roles", "apr12"],
  ["04-athlete-home", "app/amira/home", "jun30"],
  ["05-athlete-discover", "app/amira/discover", "may06"],
  ["06-opportunity", "app/amira/opportunity/eas", "may06"],
  ["07-sponsor-profile", "app/nadia/profile/halvorsen", "jun30"],
  ["08-funder-discover", "app/kenji/fdiscover", "jun30"],
  ["09-request-minor", "app/kenji/request/rq-badminton", "jun30"],
  ["10-my-funding", "app/nadia/funding", "jun30"],
  ["11-funder-overview", "app/ingrid/overview", "may06"],
  ["12-portfolio", "app/ingrid/portfolio", "jun30"],
  ["13-review", "app/daniel/review/app-amira", "jun30"],
  ["14-applications-pipeline", "app/daniel/apps", "jun30"],
  ["15-sponsor-overview", "app/kenji/overview", "jun30"],
  ["16-athlete-commercial", "app/lucy/athlete/jonah", "jun30"],
  ["17-guardian-home", "app/rosa/home", "jun30"],
  ["18-safety", "app/rosa/safety", "jun30"],
  ["19-coach-home", "app/jonas/home", "jun30"],
  ["20-publish-minor", "app/rosa/publish", "may06"],
  ["21-admin", "app/alex/admin", "jun30"],
  ["22-applications-offers", "app/nadia/applications", "jun30"],
];
const widths = (process.env.WIDTHS ?? "375,768,1024,1440").split(",").map(Number);
const themes = (process.env.THEMES ?? "dark").split(",");
const only = process.env.ONLY ? process.env.ONLY.split(",") : null;
const browser = await chromium.launch();
for (const theme of themes)
  for (const w of widths) {
    const page = await browser.newPage({ viewport: { width: w, height: w < 600 ? 812 : w < 1100 ? 1024 : 900 }, deviceScaleFactor: scale });
    for (const [name, route, moment] of shots) {
      if (only && !only.includes(name)) continue;
      await page.goto(`${file}?moment=${moment}&theme=${theme}&motion=reduced#/${route}`);
      await page.waitForTimeout(250);
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
