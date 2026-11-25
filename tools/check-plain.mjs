// Plain-language check (docs/04 §1.1, docs/06 §6.1): reads the VISIBLE text of every role's main screens in the built
// prototype and fails on grant-admin, finance or software jargon. It supports, but never replaces, a person's review.
import { createRequire } from "node:module";
import { resolve } from "node:path";
const { chromium } = createRequire(import.meta.url)("playwright");
const file = "file://" + resolve(process.env.DIST ?? "dist/index.html");
const JARGON = [
  /\bdisburse/i, /\bbeneficiar/i, /\bexpenditure/i, /\butilis/i, /\breconcil/i, /\bpipeline/i, /funding instrument/i, /\bvariance\b/i,
  /\bsubstantiat/i, /\btranche/i, /\bremittance/i, /\bReleased\b/, /\bpledged\b/i, /\bannounced\b/i, /\btiers?\b/i, /\bportfolio\b/i,
  /\boutstanding\b/i, /\bunspent\b/i, /\bremaining\b/i, /\(I\d+\)/, /\bseeded\b/i, /\bcheckpoint\b/i, /\battest/i, /\bvalidat/i, /\bworkflow\b/i,
  /\bKPI\b/, /\bstakeholder/i, /\bleverage\b/i, /\butili[sz]e\b/i, /\bfacilitat/i, /\bnull\b|\bundefined\b|\bNaN\b|\[object/,
];
const ROUTES = {
  amira: ["home", "discover", "opportunity/eas", "apply/eas", "applications", "funding", "me", "agreement/ag-amira", "update/ag-amira"],
  nadia: ["home", "publish", "funding", "profile/halvorsen", "applications"],
  jonah: ["home", "funding", "agreement/ag-cv-jonah", "me"],
  rosa: ["home", "safety", "publish", "funding", "applications"],
  jonas: ["home", "me", "funding", "applications"],
  maya: ["home", "programme", "funding", "report/ag-pe1", "agreement/ag-pe1", "discover"],
  lena: ["home", "programme"],
  sam: ["today", "programme"],
  ewan: ["home", "funding", "applications"],
  ingrid: ["overview", "opps", "apps", "selection/eas", "portfolio"],
  daniel: ["overview", "apps", "review/app-amira", "agreement/ag-amira", "programme/play-every-day", "portfolio"],
  priya: ["overview", "portfolio", "agreement/ag-amira"],
  kenji: ["overview", "fdiscover", "request/rq-nadia", "athlete/nadia", "apps", "portfolio"],
  lucy: ["overview", "fdiscover", "agreement/ag-cv-jonah", "portfolio"],
  marcus: ["overview", "fdiscover", "apps", "portfolio"],
  farid: ["overview", "portfolio"],
  alex: ["admin"],
};
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
let bad = 0, n = 0;
for (const q of ["moment=apr12", "moment=may06", "story=complete"])
  for (const [who, scs] of Object.entries(ROUTES))
    for (const sc of scs) {
      n++;
      await page.goto(`${file}?${q}&motion=reduced&r=${who}-${sc}#/app/${who}/${sc}`);
      await page.waitForTimeout(60);
      const txt = await page.evaluate(() => document.querySelector("main")?.innerText ?? "");
      for (const line of txt.split("\n"))
        for (const re of JARGON)
          if (re.test(line)) {
            bad++;
            console.log(`${q} ${who}/${sc}  ${re}  ${line.trim().slice(0, 110)}`);
          }
    }
await browser.close();
console.log(bad ? `check:plain failed: ${bad} line(s) on ${n} screens` : `check:plain passed: ${n} screens`);
process.exitCode = bad ? 1 : 0;
