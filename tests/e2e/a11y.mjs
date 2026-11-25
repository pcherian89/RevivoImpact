// axe-core scan of key screens in Dark and Daylight (WCAG 2.2 AA rules); reports serious and critical issues.
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const axe = readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
const file = "file://" + resolve(process.env.DIST ?? "dist/index.html");
const routes = ["start", "join", "roles", "app/amira/home", "app/amira/discover", "app/amira/opportunity/eas", "app/amira/apply/eas", "app/nadia/applications", "app/nadia/funding", "app/jonah/me", "app/rosa/safety", "app/rosa/publish", "app/kenji/overview", "app/kenji/fdiscover", "app/kenji/request/rq-badminton", "app/ingrid/selection/eas", "app/daniel/review/app-amira", "app/daniel/apps", "app/ingrid/portfolio", "app/alex/admin", "app/amira/funding", "app/amira/update/ag-amira", "app/priya/agreement/ag-amira", "app/maya/programme/play-every-day", "app/sam/today", "app/maya/report/ag-pe1", "app/daniel/portfolio", "app/jonah/agreement/ag-cv-jonah"];
const browser = await chromium.launch();
let total = 0;
for (const theme of ["dark", "daylight"]) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  for (const r of routes) {
    await page.goto(`${file}?story=complete&theme=${theme}&motion=reduced#/${r}`);
    await page.waitForTimeout(80);
    await page.addScriptTag({ content: axe });
    const res = await page.evaluate(async () => await window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] } }));
    const bad = res.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    for (const v of bad) {
      total++;
      console.log(`${theme} ${r}: ${v.id} (${v.impact}) ×${v.nodes.length} · ${v.nodes[0].target.join(" ")} · ${v.nodes[0].failureSummary?.split("\n")[1] ?? ""}`);
    }
  }
  await page.close();
}
await browser.close();
console.log(`${total} serious/critical issues`);
process.exitCode = total ? 1 : 0;
