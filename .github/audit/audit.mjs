// Daily site audit for shabnamraghavan.com (and a pre-push check against localhost).
//
//   SITE=https://www.shabnamraghavan.com node audit.mjs      (default)
//   SITE=http://localhost:8080 node audit.mjs                (before a push)
//
// Opens every page at a desktop and a phone size in real Chrome and fails (exit 1) on:
// a page or file that does not load, a script error, a paper card with no background
// (the 2026-09-26 bug), fonts that did not load, sideways scroll on phones, or an intro
// curtain that never opens. Screenshots of every page land in ./out for the artifact.
//
// It never counts as a visitor: the first-party tracker and Cloudflare are blocked, and
// videos are checked with a HEAD request instead of being downloaded.

import { chromium } from "playwright-core";
import { mkdirSync, writeFileSync, appendFileSync } from "node:fs";

const SITE = (process.env.SITE || "https://www.shabnamraghavan.com").replace(/\/$/, "");
const PAGES = process.env.PAGES ? process.env.PAGES.split(",") : [
  "/", "/about", "/resume",
  "/user-management", "/ai-features", "/tpa-ops", "/tpa-ops-detailed", "/nucleus-mobile", "/wisewoman",
];
const VIEWPORTS = [
  { name: "desktop", viewport: { width: 1440, height: 900 } },
  { name: "phone", viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3 },
];
// every card that should read as paper (or any element carrying the paper texture) must have a solid colour
const SURFACES = ".file-sheet, .pr-card, .proc-item, .paper, .ritual, .bcard";
const BLOCK = /\/api\/collect|cloudflareinsights\.com|\/analytics\.js$|clarity\.ms/;

mkdirSync("out", { recursive: true });
const failures = [];
const notes = [];
const fail = (where, msg) => failures.push(`${where}: ${msg}`);
const assets = new Set();

const browser = await chromium.launch({ channel: "chrome", args: ["--no-sandbox"] });

for (const vp of VIEWPORTS) {
  for (const path of PAGES) {
    const where = `${vp.name} ${path}`;
    const ctx = await browser.newContext({ ...vp, name: undefined });
    const page = await ctx.newPage();
    await page.route("**/*", (r) => {
      const u = r.request().url();
      if (BLOCK.test(u)) return r.abort();
      if (/\.(mp4|webm|mov)(\?|$)/i.test(u)) { assets.add(u.split("?")[0]); return r.abort(); }
      return r.continue();
    });
    page.on("pageerror", (e) => fail(where, `script error: ${e.message.slice(0, 160)}`));
    page.on("console", (m) => { if (m.type() === "error" && !/net::ERR_FAILED|ERR_BLOCKED|Failed to load resource/.test(m.text())) fail(where, `console error: ${m.text().slice(0, 160)}`); });
    page.on("response", (res) => {
      const u = res.url();
      if (res.status() >= 400 && !BLOCK.test(u)) fail(where, `${res.status()} ${u}`);
    });

    let res;
    try { res = await page.goto(SITE + path, { waitUntil: "load", timeout: 60000 }); }
    catch (e) { fail(where, `did not load: ${e.message.slice(0, 120)}`); await ctx.close(); continue; }
    if (!res || res.status() !== 200) fail(where, `page status ${res && res.status()}`);

    // walk down the page so lazy images and cards load, then come back up
    await page.evaluate(async () => {
      // instant jumps: on smooth-scrolling pages a 120ms smooth scroll never arrives, so the walk
      // would stop short of the lower sections
      document.documentElement.style.scrollBehavior = "auto";
      const step = Math.round(innerHeight * 0.8);
      for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
        window.scrollTo({ top: y, behavior: "instant" }); await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo({ top: 0, behavior: "instant" });
    });
    await page.waitForTimeout(800);

    // scroll-played content (the short case study's [data-a] parts) must all be visible once the
    // page has been read through: on 2026-10-27 a tall section never reached its 30% trigger and
    // its cards stayed invisible on the live site
    if (await page.evaluate(() => !!document.querySelector("[data-a]"))) {
      await page.waitForTimeout(4500);
      const hidden = await page.evaluate(() => [...document.querySelectorAll(".sx [data-a], .sx-w")]
        .filter((e) => parseFloat(getComputedStyle(e).opacity) < 0.5)
        .map((e) => String(e.textContent.trim() || e.getAttribute("class") || e.tagName).replace(/\s+/g, " ").slice(0, 40)));
      if (hidden.length) fail(where, `${hidden.length} scroll-animated parts never appeared, e.g. "${hidden[0]}"`);
    }

    const r = await page.evaluate(async (SURFACES) => {
      await document.fonts.ready;
      const out = { broken: [], seeThrough: [], urls: [], overflow: 0, fonts: {}, h1: "" };
      document.querySelectorAll("img").forEach((i) => {
        if (i.currentSrc) out.urls.push(i.currentSrc);
        if (i.complete && i.naturalWidth === 0 && i.currentSrc) out.broken.push(i.currentSrc);
      });
      document.querySelectorAll("video").forEach((v) => { if (v.poster) out.urls.push(v.poster); if (v.currentSrc || v.src) out.urls.push(v.currentSrc || v.src); });
      const els = new Set(document.querySelectorAll(SURFACES));
      document.querySelectorAll("*").forEach((e) => {
        const bi = getComputedStyle(e).backgroundImage;
        if (bi && bi.includes("paper-sheet")) els.add(e);
        (bi.match(/url\("([^"]+)"\)/g) || []).forEach((m) => out.urls.push(m.slice(5, -2)));
      });
      els.forEach((e) => {
        const cs = getComputedStyle(e);
        if (cs.display === "none" || cs.visibility === "hidden") return;
        const c = cs.backgroundColor, m = c.match(/rgba?\(([^)]+)\)/);
        const alpha = m ? (m[1].split(",")[3] === undefined ? 1 : parseFloat(m[1].split(",")[3])) : 0;
        if (alpha === 0) out.seeThrough.push((e.className || e.tagName).toString().slice(0, 40));
      });
      out.overflow = document.documentElement.scrollWidth - innerWidth;
      out.fonts = { Staatliches: document.fonts.check("16px Staatliches"), Manrope: document.fonts.check("16px Manrope") };
      out.h1 = (document.querySelector("h1") || {}).textContent || "";
      return out;
    }, SURFACES);

    r.broken.forEach((u) => fail(where, `image did not load: ${u}`));
    [...new Set(r.seeThrough)].forEach((c) => fail(where, `card has no background (see-through): .${c}`));
    if (!r.fonts.Staatliches) fail(where, "Staatliches font did not load");
    if (!r.fonts.Manrope) fail(where, "Manrope font did not load");
    if (vp.name === "phone" && r.overflow > 1) fail(where, `page scrolls sideways by ${r.overflow}px`);
    if (!r.h1.trim()) fail(where, "no main heading (h1) found");
    r.urls.forEach((u) => { if (u.startsWith(SITE)) assets.add(u.split("?")[0]); });

    const file = `out/${vp.name}${path.replace(/\//g, "_").replace(".html", "") || "_home"}.png`;
    await page.screenshot({ path: file, fullPage: true }).catch(() => {});
    await ctx.close();
  }
}

// the landing must show her name within 5 seconds (the curtain intro was removed 2026-10-26)
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.route("**/*", (r) => (BLOCK.test(r.request().url()) || /\.mp4/.test(r.request().url()) ? r.abort() : r.continue()));
  await page.goto(SITE + "/", { waitUntil: "load", timeout: 60000 });
  const shown = await page.waitForFunction(() => {
    const h = document.querySelector(".hero h1");
    return h && h.getBoundingClientRect().height > 0 && parseFloat(getComputedStyle(h).opacity) > 0.9;
  }, null, { timeout: 5000 }).then(() => true).catch(() => false);
  if (!shown) fail("desktop / landing", "the landing did not show her name within 5s");
  await ctx.close();
}
await browser.close();

// every file the pages use (including the videos the browser was told not to download)
for (const u of assets) {
  try {
    const res = await fetch(u, { method: "HEAD" });
    if (res.status >= 400) fail("files", `${res.status} ${u}`);
  } catch (e) { fail("files", `unreachable ${u}`); }
}
notes.push(`${PAGES.length} pages x ${VIEWPORTS.length} sizes, ${assets.size} files checked`);

const report = [
  `## Site audit: ${failures.length ? "FAILED" : "all clear"}`,
  `${SITE} · ${new Date().toISOString()}`,
  "", ...notes, "",
  ...(failures.length ? failures.map((f) => `- ${f}`) : ["No problems found."]),
].join("\n");
console.log(report);
writeFileSync("out/report.md", report);
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, report + "\n");
process.exit(failures.length ? 1 : 0);
