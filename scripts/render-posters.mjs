/**
 * Render the 3D posters (the LCP images and reduced-motion / no-WebGL fallbacks)
 * from the live scenes, at the real stage size and 2× density:
 *
 *   src/assets/hero/panel-{day,night}.png   ← src/scripts/panel3d.ts on /
 *   src/assets/globe/globe-{day,night}.png  ← src/scripts/globe3d.ts on /adventures
 *
 * Usage (needs a running preview of the current build):
 *   npm run build && npm run preview -- --host 127.0.0.1 --port 4321 &
 *   node scripts/render-posters.mjs            # BASE_URL=http://127.0.0.1:4321
 *   npm run build                              # rebuild with the new posters
 *
 * Uses the Chromium that ships with @playwright/test (SwiftShader WebGL, so it
 * also works headless without a GPU). Set CHROMIUM_PATH to use another binary.
 */
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const BASE = process.env.BASE_URL ?? "http://127.0.0.1:4321";
const root = fileURLToPath(new URL("..", import.meta.url));
const DPR = 2;

const jobs = [
  {
    name: "panel",
    path: `/?panel-capture=${DPR}`,
    flag: "__panelReady",
    canvas: ".panel-canvas",
    out: "src/assets/hero/panel",
  },
  {
    name: "globe",
    path: `/adventures?globe-capture=${DPR}`,
    flag: "__globeReady",
    canvas: ".globe-canvas",
    out: "src/assets/globe/globe",
  },
];

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
});

try {
  for (const theme of ["day", "night"]) {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
      colorScheme: theme === "night" ? "dark" : "light",
      reducedMotion: "no-preference",
    });
    await context.addInitScript((t) => {
      try {
        localStorage.setItem("theme", t === "night" ? "dark" : "light");
      } catch {
        /* ignore */
      }
    }, theme);
    const page = await context.newPage();
    page.on("pageerror", (e) => console.error(`[${theme}] page error:`, e.message));
    for (const job of jobs) {
      await page.goto(BASE + job.path, { waitUntil: "networkidle" });
      await page.waitForFunction((flag) => Boolean(window[flag]), job.flag, { timeout: 60_000 });
      const { dataUrl, width, height } = await page.evaluate((sel) => {
        const c = document.querySelector(sel);
        return { dataUrl: c.toDataURL("image/png"), width: c.width, height: c.height };
      }, job.canvas);
      const file = `${root}${job.out}-${theme}.png`;
      await writeFile(file, Buffer.from(dataUrl.split(",")[1], "base64"));
      console.log(`${job.name} ${theme}: ${width}×${height} → ${job.out}-${theme}.png`);
    }
    await context.close();
  }
} finally {
  await browser.close();
}
