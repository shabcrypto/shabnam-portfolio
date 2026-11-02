// The mailbox. Every page posts small beacons here; this writes them into counters.
//
// Same-origin on shabnamraghavan.com, which is the whole reason this exists rather than Google
// Analytics: ad blockers leave first-party endpoints alone, and a design and tech audience blocks
// third-party analytics at 25 to 40%. See design-context.md section 13.
//
// It stores counters, never raw request logs. There is no cookie, no fingerprint that survives
// the day, and no IP is written down, so no consent banner is required.

const S = require("./_store");

const MAX_BODY = 4096;
const EVENTS = new Set([
  "resume_download", "video_play", "linkedin_click", "email_click", "case_study_open", "detailed_open",
]);
const DEPTHS = new Set(["25", "50", "75", "90"]);
const DEVICES = new Set(["phone", "tablet", "desktop"]);

// Where a visitor came from, bucketed. Anything unrecognised becomes Other rather than being
// stored verbatim, so this can never accumulate a list of arbitrary URLs.
function source(ref, host) {
  if (!ref) return "Direct";
  let h;
  try { h = new global.URL(ref).hostname.replace(/^www\./, "").toLowerCase(); } catch { return "Direct"; }
  if (!h || (host && h === String(host).replace(/^www\./, "").toLowerCase())) return "Direct";
  if (h.endsWith("linkedin.com") || h === "lnkd.in") return "LinkedIn";
  if (h.endsWith("google.com") || h.startsWith("google.")) return "Google";
  if (h.endsWith("behance.net")) return "Behance";
  if (h.endsWith("read.cv")) return "Read.cv";
  if (h.endsWith("dribbble.com")) return "Dribbble";
  if (h.endsWith("github.com")) return "GitHub";
  if (h.endsWith("medium.com")) return "Medium";
  if (h.endsWith("bing.com") || h.endsWith("duckduckgo.com")) return "Search";
  return "Other";
}

// Only paths this site actually has. An unknown path is dropped rather than stored, which keeps
// junk and scanner traffic out of the numbers. Since the clean URLs (2026-10-27) the case studies
// live at short addresses; until 2026-11-02 this list still held only the old ones, so every case
// study beacon in between was dropped. Old addresses redirect to the new ones, so a beacon
// arriving with an old path is folded into the new one.
// The short case studies are the ones the dashboard reports on; the detailed pages are counted
// only as a funnel step (a click on "Read the detailed case study") and as page views.
const SHORT_PATHS = ["/tpa-ops", "/user-management", "/ai-features", "/nucleus-mobile", "/wisewoman"];
const CASE_PATHS = SHORT_PATHS.concat(["/tpa-ops-detailed", "/user-management-detailed"]);
const OLD = {
  "/ihx_tpa_ops_": "/tpa-ops", "/ihx_tpa_ops_-full": "/tpa-ops-detailed",
  "/ihx-user-management-case-study": "/user-management", "/ihx-user-management-case-study-full": "/user-management-detailed",
  "/ihx-ai-features-case-study": "/ai-features", "/ihx-nucleus-mobile-case-study": "/nucleus-mobile",
  "/wisewomen-case-study": "/wisewoman",
};
const KNOWN = new Set(["/", "/about", "/resume", "/stats"].concat(CASE_PATHS));
const IS_SHORT = new Set(SHORT_PATHS);

// Upstash's free plan allows 500,000 commands a month and every command in a pipeline counts.
// So only what the dashboard shows is written (2026-11-02): no bounce or session counters, no
// "read to the end", and scroll depth and read time only for the short case studies. A short
// case study visit costs about 24 commands; any other page view about 12.

function cleanPath(p) {
  if (typeof p !== "string") return null;
  let s = p.split("?")[0].split("#")[0].replace(/\.html$/, "");
  if (s.length > 1) s = s.replace(/\/+$/, "");
  if (s === "/index" || s === "") s = "/";
  if (OLD[s]) s = OLD[s];
  return KNOWN.has(s) ? s : null;
}

// Dwell time goes into 15-second bins rather than being stored per visit. A histogram is enough
// to read a median off, and it means one counter per bin instead of a row per pageview.
const BIN = 15, BINS = 40;           // 0 to 10 minutes, everything longer lands in the last bin
function bin(sec) { return Math.min(BINS - 1, Math.max(0, Math.floor(sec / BIN))); }

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  // bots that post beacons anyway are accepted and dropped, never counted
  if (/bot|crawl|spider|slurp|preview|lighthouse|headless|phantom|puppeteer|playwright|facebookexternalhit|whatsapp|embedly|vercel|uptime|monitor/i.test(String(req.headers["user-agent"] || ""))) return res.status(204).end();
  if (!S.configured) return res.status(204).end();   // no store yet: accept and drop, never 500

  let body = req.body;
  if (typeof body === "string") {
    if (body.length > MAX_BODY) return res.status(413).end();
    try { body = JSON.parse(body); } catch { return res.status(400).json({ error: "bad json" }); }
  }
  if (!body || typeof body !== "object") return res.status(400).json({ error: "bad body" });

  const day = S.today();
  const path = cleanPath(body.p);
  if (!path) return res.status(204).end();

  // A visitor id is one device on one day: the client sends a random id it keeps for the day.
  // Nothing links today's id to tomorrow's, so this cannot follow anyone over time.
  const vid = typeof body.v === "string" ? body.v.slice(0, 40) : null;
  const cmds = [];
  const touch = (k) => cmds.push(["EXPIRE", k, S.TTL]);

  const type = body.t;

  if (type === "view") {
    const src = source(body.r, req.headers.host);
    const k = [
      `d:${day}:views`,
      `d:${day}:p:${path}`,
      `d:${day}:src:${src}`,
    ];
    k.forEach((key) => { cmds.push(["INCR", key]); touch(key); });
    // phone, tablet or desktop: one counter per day, nothing about the device beyond that
    if (DEVICES.has(body.dv)) { const dk = `d:${day}:dev:${body.dv}`; cmds.push(["INCR", dk]); touch(dk); }
    if (vid) {
      cmds.push(["PFADD", `d:${day}:uniq`, vid]); touch(`d:${day}:uniq`);
      cmds.push(["PFADD", `d:${day}:f:landed`, vid]); touch(`d:${day}:f:landed`);
      if (IS_SHORT.has(path)) {
        cmds.push(["PFADD", `d:${day}:f:case`, vid]); touch(`d:${day}:f:case`);
      }
    }
  } else if (type === "depth") {
    const d = String(body.d);
    if (!DEPTHS.has(d) || !IS_SHORT.has(path)) return res.status(204).end();
    const key = `d:${day}:depth:${path}:${d}`;
    cmds.push(["INCR", key]); touch(key);
  } else if (type === "dur") {
    const sec = Math.max(0, Math.min(3600, Number(body.s) || 0));
    // time on the whole portfolio: one running total per visitor id per day, every page adding
    // its visible seconds (2 commands a page view). The dashboard reads the median of these totals.
    if (vid && sec > 0) { const tk = `d:${day}:vt`; cmds.push(["HINCRBY", tk, vid, sec]); touch(tk); }
    // read time per case study, for the short case studies only
    if (IS_SHORT.has(path)) { const key = `d:${day}:dur:${path}:${bin(sec)}`; cmds.push(["INCR", key]); touch(key); }
    if (!cmds.length) return res.status(204).end();
  } else if (type === "event") {
    const name = String(body.n || "");
    if (!EVENTS.has(name)) return res.status(204).end();
    const key = `d:${day}:ev:${name}`;
    cmds.push(["INCR", key]); touch(key);
    // also per page, because the dashboard's case study table shows plays per case study
    const pk = `d:${day}:evp:${name}:${path}`;
    cmds.push(["INCR", pk]); touch(pk);
    if (name === "resume_download" && vid) {
      cmds.push(["PFADD", `d:${day}:f:resume`, vid]); touch(`d:${day}:f:resume`);
    }
    if (name === "detailed_open" && vid) {
      cmds.push(["PFADD", `d:${day}:f:detailed`, vid]); touch(`d:${day}:f:detailed`);
    }
  } else if (type === "error") {
    // Errors are capped and de-duplicated by message plus path, so a loop cannot flood the store.
    const msg = String(body.m || "").slice(0, 180);
    if (!msg) return res.status(204).end();
    const id = Buffer.from(msg + "|" + path).toString("base64url").slice(0, 48);
    cmds.push(["HINCRBY", `err:${id}`, "n", 1]);
    cmds.push(["HSET", `err:${id}`, "msg", msg, "where", path, "last", new Date().toISOString()]);
    cmds.push(["EXPIRE", `err:${id}`, S.TTL]);
    cmds.push(["ZADD", "errs", Date.now(), id]);
    cmds.push(["ZREMRANGEBYRANK", "errs", 0, -51]);   // keep the 50 most recent
  } else {
    return res.status(204).end();
  }

  try { await S.pipeline(cmds); } catch (e) { /* never let analytics break a page */ }
  return res.status(204).end();
};
