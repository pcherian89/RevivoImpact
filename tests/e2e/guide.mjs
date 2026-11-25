// Runs every P2 step of every journey through the guide panel ("Load the story" then "Show me").
import { createRequire } from "node:module";
import { resolve } from "node:path";
const { chromium } = createRequire(import.meta.url)("playwright");
const file = "file://" + resolve(process.env.DIST ?? "dist/index.html");
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errs = [];
page.on("pageerror", (e) => errs.push(String(e)));
page.on("dialog", (d) => d.accept());
await page.goto(`${file}?moment=apr12&motion=reduced#/start`);
await page.waitForTimeout(150);
await page.getByRole("button", { name: "Start the guided journey" }).click();
let ok = 0, bad = 0;
const guide = page.getByRole("complementary", { name: "Guided journeys" });
for (const j of ["A", "B", "C", "E"]) {
  await guide.getByRole("tab", { name: j, exact: true }).click();
  const steps = await guide.locator("ol > li").count();
  for (let i = 0; i < steps; i++) {
    await guide.locator("ol > li").nth(i).getByRole("button").click();
    await page.waitForTimeout(40);
    const label = (await guide.locator("h3").innerText()).trim();
    const p3 = (await guide.innerText()).includes("coming in the next build");
    if (p3) continue;
    const load = guide.getByRole("button", { name: "Load the story to this step" });
    if (await load.count()) { await load.click(); await page.waitForTimeout(80); }
    const show = guide.getByRole("button", { name: "Show me", exact: true });
    if (await show.count()) {
      await show.click();
      await page.waitForTimeout(80);
      const alert = await guide.locator('[role="alert"]').count();
      const done = (await guide.innerText()).includes("Done.");
      if (alert || !done) { bad++; console.log(`FAIL ${j}${i + 1} ${label}: ${alert ? await guide.locator('[role="alert"]').innerText() : "not marked done"}`); }
      else ok++;
    } else {
      const openBtn = guide.getByRole("button", { name: /Open this screen|Show me the screen/ });
      if (!(await openBtn.count())) { bad++; console.log(`FAIL ${j}${i + 1} ${label}: no button. ${(await guide.innerText()).slice(0, 400).replace(/\n/g, " | ")}`); continue; }
      ok++; // a "look" step: open the screen
      await openBtn.click();
      await page.waitForTimeout(40);
      const main = await page.evaluate(() => document.querySelector("main")?.innerText ?? "");
      if (!main.trim()) { bad++; console.log(`FAIL ${j}${i + 1} empty screen`); }
    }
  }
}
if (errs.length) { bad++; console.log(errs.slice(0, 3)); }
console.log(`${ok} guided steps passed, ${bad} failed`);
await browser.close();
process.exitCode = bad ? 1 : 0;
