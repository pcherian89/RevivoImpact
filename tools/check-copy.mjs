// Copy lint (docs/06 §6, CLAUDE.md §4): fails on banned words and retired names in visible copy (src/).
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const BANNED = [
  /AI built for the pulse of sport/i, /Deliver sport\. Demonstrate impact/i, /Track the difference/i, /proven impact/i,
  /\bguarantee(d)?\b(?! an award)/i, /life-changing/i, /transformed lives/i, /\bSROI\b/, /\blaunch(ed|es)?\b/i,
  /available now/i, /(book|request) a demo/i, /our products/i, /verified athlete/i, /AI decides/i, /\brejected\b/i,
  /\bfailed\b/i, /Horizon Sports Foundation/, /Brightwater/, /Pulse of Sport\. Mind of the Game/, /\bdisbursement\b/i,
  /\bcompliant\b/i, /\bcertified\b/i, /tax-deductible/i, /CSR-eligible/i, /Mendes/, /Watanabe/,
];
const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
let bad = 0;
for (const file of walk("src").filter((f) => /\.(tsx?|css)$/.test(f))) {
  readFileSync(file, "utf8").split("\n").forEach((line, i) => {
    if (/^\s*(\/\/|\*|\/\*)/.test(line)) return; // comments are not visible copy
    for (const re of BANNED) if (re.test(line)) { console.log(`${file}:${i + 1}  ${re}  ${line.trim().slice(0, 100)}`); bad++; }
  });
}
if (bad) { console.error(`check:copy failed: ${bad} issue(s)`); process.exit(1); }
console.log("check:copy passed");
