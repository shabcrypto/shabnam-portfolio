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
  "resume_download", "video_play", "linkedin_click", "email_click", "case_study_open",
]);
const DEPTHS = new Set(["25", "50", "75", "90"]);

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
// junk and scanner traffic out of the numbers.
const KNOWN = new Set([
  "/", "/about", "/resume", "/stats",
  "/ihx-nucleus-mobile-case-study", "/ihx_tpa_ops_", "/ihx-ai-features-case-study",
  "/ihx-user-management-case-study", "/wisewomen-case-study",
]);

function cleanPath(p) {
  if (typeof p !== "string") return null;
  let s = p.split("?")[0].split("#")[0].replace(/\.html$/, "");
  if (s.length > 1) s = s.replace(/\/+$/, "");
  if (s === "/index" || s === "") s = "/";
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
    if (vid) {
      cmds.push(["PFADD", `d:${day}:uniq`, vid]); touch(`d:${day}:uniq`);
      cmds.push(["PFADD", `d:${day}:f:landed`, vid]); touch(`d:${day}:f:landed`);
      if (path !== "/" && path !== "/about" && path !== "/resume" && path !== "/stats") {
        cmds.push(["PFADD", `d:${day}:f:case`, vid]); touch(`d:${day}:f:case`);
      }
    }
  } else if (type === "depth") {
    const d = String(body.d);
    if (!DEPTHS.has(d)) return res.status(204).end();
    const key = `d:${day}:depth:${path}:${d}`;
    cmds.push(["INCR", key]); touch(key);
    if (d === "90" && vid) { cmds.push(["PFADD", `d:${day}:f:finished`, vid]); touch(`d:${day}:f:finished`); }
  } else if (type === "dur") {
    const sec = Math.max(0, Math.min(3600, Number(body.s) || 0));
    const key = `d:${day}:dur:${path}:${bin(sec)}`;
    cmds.push(["INCR", key]); touch(key);
    // Bounce is defined, not measured: one page, under 15 seconds. Stated on the dashboard.
    if (body.first && sec < 15) { cmds.push(["INCR", `d:${day}:bounce`]); touch(`d:${day}:bounce`); }
    if (body.first) { cmds.push(["INCR", `d:${day}:sessions`]); touch(`d:${day}:sessions`); }
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
