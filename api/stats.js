// The notebook being read back. Aggregates the counters written by /api/collect into exactly
// the shape stats.html already expects, so nothing below the DATA seam on that page changes.
//
// Everything here is derived from counters. There are no raw events to scan, so this stays fast
// regardless of traffic: the work is proportional to days in the range, not to visits.

const S = require("./_store");

const PAGES = [
  { path: "/",                                 name: "Home" },
  { path: "/ihx-nucleus-mobile-case-study",    name: "Nucleus Mobile" },
  { path: "/ihx_tpa_ops_",                     name: "TPA Ops" },
  { path: "/ihx-ai-features-case-study",       name: "AI Features" },
  { path: "/ihx-user-management-case-study",   name: "User Management" },
  { path: "/wisewomen-case-study",             name: "WiseWoman" },
  { path: "/about",                            name: "About" },
  { path: "/resume",                           name: "Resume" },
];
const CASES = PAGES.slice(1, 6);
const SOURCES = ["Direct", "LinkedIn", "Google", "Behance", "Read.cv", "Dribbble", "GitHub", "Medium", "Search", "Other"];
const EVENT_LABEL = {
  resume_download: "Resume downloaded",
  video_play: "Walkthrough video played",
  linkedin_click: "LinkedIn clicked",
  email_click: "Email clicked",
  case_study_open: "Case study opened",
};
const BIN = 15, BINS = 40;

const n = (x) => (x == null ? 0 : Number(x) || 0);
const sum = (a) => a.reduce((t, x) => t + x, 0);

// The median read off a 15-second histogram. Returns the midpoint of the bin the 50th percentile
// falls in, so it is accurate to about 7 seconds, which is finer than this number is ever read.
function medianFromBins(bins) {
  const total = sum(bins);
  if (!total) return 0;
  let seen = 0;
  for (let i = 0; i < bins.length; i++) {
    seen += bins[i];
    if (seen >= total / 2) return i * BIN + Math.floor(BIN / 2);
  }
  return 0;
}

// 12 evenly spaced points across a daily series, for the sparklines.
// Counts are summed inside each bucket and rates are averaged: averaging a count would flatten
// the exact spike the sparkline exists to show.
function spark(series, kind) {
  const pts = 12, out = [];
  if (!series.length) return new Array(pts).fill(0);
  const per = series.length / pts;
  for (let i = 0; i < pts; i++) {
    const a = Math.floor(i * per), b = Math.max(a + 1, Math.floor((i + 1) * per));
    const slice = series.slice(a, b);
    out.push(Math.round(kind === "rate" ? sum(slice) / slice.length : sum(slice)));
  }
  return out;
}
const pct = (now, prev) => (prev ? Math.round(((now - prev) / prev) * 100) : (now ? 100 : 0));

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  // Fail closed. stats.html is noindex but otherwise open to anyone who guesses the URL, so the
  // numbers are gated here rather than on the page. Set STATS_KEY in the Vercel project's
  // environment variables, then open the dashboard once as stats.html#k=<that value>; it
  // remembers the key in localStorage afterwards.
  const KEY = process.env.STATS_KEY;
  if (!KEY) {
    return res.status(503).json({
      error: "no STATS_KEY set",
      hint: "Add an environment variable STATS_KEY in Vercel, then open stats.html#k=<value> once.",
    });
  }
  const given = (req.query && req.query.k) || req.headers["x-stats-key"];
  if (given !== KEY) return res.status(401).json({ error: "wrong or missing key" });

  if (!S.configured) {
    return res.status(503).json({ error: "store not configured", hint: "add Upstash for Redis in Vercel and redeploy" });
  }

  // 180 days so a 90 day range can be compared against the 90 before it
  const days = S.lastDays(180);

  const cmds = [];
  const at = {};                                  // remembers where each answer lands
  const push = (label, cmd) => { at[label] = cmds.length; cmds.push(cmd); };

  days.forEach((d) => {
    push(`views|${d}`,  ["GET", `d:${d}:views`]);
    push(`uniq|${d}`,   ["PFCOUNT", `d:${d}:uniq`]);
    push(`bounce|${d}`, ["GET", `d:${d}:bounce`]);
    push(`sess|${d}`,   ["GET", `d:${d}:sessions`]);
    SOURCES.forEach((s) => push(`src|${d}|${s}`, ["GET", `d:${d}:src:${s}`]));
    Object.keys(EVENT_LABEL).forEach((e) => push(`ev|${d}|${e}`, ["GET", `d:${d}:ev:${e}`]));
    PAGES.forEach((p) => push(`pv|${d}|${p.path}`, ["GET", `d:${d}:p:${p.path}`]));
    CASES.forEach((p) => {
      ["25", "50", "75", "90"].forEach((b) => push(`dep|${d}|${p.path}|${b}`, ["GET", `d:${d}:depth:${p.path}:${b}`]));
      push(`plays|${d}|${p.path}`, ["GET", `d:${d}:evp:video_play:${p.path}`]);
      for (let i = 0; i < BINS; i++) push(`dur|${d}|${p.path}|${i}`, ["GET", `d:${d}:dur:${p.path}:${i}`]);
    });
    ["landed", "case", "finished", "resume"].forEach((f) => push(`fun|${d}|${f}`, ["PFCOUNT", `d:${d}:f:${f}`]));
  });

  let raw;
  try { raw = await S.pipeline(cmds); }
  catch (e) { return res.status(502).json({ error: "store unreachable" }); }
  const g = (label) => n(raw[at[label]]);

  const inRange = (r) => days.slice(days.length - r);
  const prevRange = (r) => days.slice(days.length - r * 2, days.length - r);

  // ---- daily visitor line, last 90 ----
  const last90 = inRange(90);
  const daysOut = last90.map((d) => ({ date: d, visitors: g(`uniq|${d}`) }));

  // ---- sources, last 90 ----
  const sources = SOURCES
    .map((s) => ({ name: s, v: sum(last90.map((d) => g(`src|${d}|${s}`))) }))
    .filter((x) => x.v > 0)
    .sort((a, b) => b.v - a.v);

  // ---- funnel, last 90. Daily uniques summed, so a repeat visitor counts once per day. ----
  const fun = (f, r) => sum(inRange(r).map((d) => g(`fun|${d}|${f}`)));
  const funnel = [
    { name: "Landed on the site",   v: fun("landed", 90) },
    { name: "Opened a case study",  v: fun("case", 90) },
    { name: "Read one to the end",  v: fun("finished", 90) },
    { name: "Downloaded the resume", v: fun("resume", 90) },
  ];

  // ---- per case study ----
  const pages = CASES.map((p) => {
    const bins = [];
    for (let i = 0; i < BINS; i++) bins.push(sum(last90.map((d) => g(`dur|${d}|${p.path}|${i}`))));
    const views = sum(last90.map((d) => g(`pv|${d}|${p.path}`)));
    const reach90 = sum(last90.map((d) => g(`dep|${d}|${p.path}|90`)));
    return {
      name: p.name,
      views,
      median: medianFromBins(bins),
      // clamped: a reload re-fires the depth beacon, so a share can otherwise exceed 100
      finished: views ? Math.min(100, Math.round((reach90 / views) * 100)) : 0,
      plays: sum(last90.map((d) => g(`plays|${d}|${p.path}`))),
    };
  }).sort((a, b) => b.views - a.views);

  const depth = CASES.map((p) => {
    const views = sum(last90.map((d) => g(`pv|${d}|${p.path}`)));
    const b = ["25", "50", "75", "90"].map((k) => sum(last90.map((d) => g(`dep|${d}|${p.path}|${k}`))));
    return { name: p.name, buckets: views ? b.map((x) => Math.min(100, Math.round((x / views) * 100))) : [0, 0, 0, 0] };
  }).sort((a, b) => b.buckets[3] - a.buckets[3]);

  const events = Object.keys(EVENT_LABEL)
    .map((e) => ({ name: EVENT_LABEL[e], v: sum(last90.map((d) => g(`ev|${d}|${e}`))) }))
    .sort((a, b) => b.v - a.v);

  // ---- headline tiles, per range ----
  function block(r) {
    const cur = inRange(r), prv = prevRange(r);
    const visitors = sum(cur.map((d) => g(`uniq|${d}`)));
    const downloads = sum(cur.map((d) => g(`ev|${d}|resume_download`)));
    const sessions = sum(cur.map((d) => g(`sess|${d}`)));
    const bounced = sum(cur.map((d) => g(`bounce|${d}`)));
    const bounce = sessions ? Math.min(100, Math.round((bounced / sessions) * 100)) : 0;

    const bins = [];
    for (let i = 0; i < BINS; i++) {
      bins.push(sum(cur.map((d) => sum(CASES.map((p) => g(`dur|${d}|${p.path}|${i}`))))));
    }
    const median = medianFromBins(bins);

    const pVisitors = sum(prv.map((d) => g(`uniq|${d}`)));
    const pDownloads = sum(prv.map((d) => g(`ev|${d}|resume_download`)));
    const pSessions = sum(prv.map((d) => g(`sess|${d}`)));
    const pBounced = sum(prv.map((d) => g(`bounce|${d}`)));
    const pBounce = pSessions ? Math.round((pBounced / pSessions) * 100) : 0;
    const pBins = [];
    for (let i = 0; i < BINS; i++) {
      pBins.push(sum(prv.map((d) => sum(CASES.map((p) => g(`dur|${d}|${p.path}|${i}`))))));
    }

    // each tile plots its own metric, never a shared series: design-context section 13
    const dailyMedian = cur.map((d) => {
      const b = [];
      for (let i = 0; i < BINS; i++) b.push(sum(CASES.map((p) => g(`dur|${d}|${p.path}|${i}`))));
      return medianFromBins(b);
    });
    const dailyBounce = cur.map((d) => {
      const s = g(`sess|${d}`);
      return s ? Math.round((g(`bounce|${d}`) / s) * 100) : 0;
    });

    return {
      visitors, downloads, median, bounce,
      dVisitors: pct(visitors, pVisitors),
      dDownloads: pct(downloads, pDownloads),
      dMedian: pct(median, medianFromBins(pBins)),
      dBounce: pct(bounce, pBounce),
      sparks: {
        downloads: spark(cur.map((d) => g(`ev|${d}|resume_download`)), "count"),
        median: spark(dailyMedian, "rate"),
        bounce: spark(dailyBounce, "rate"),
        plays: spark(cur.map((d) => g(`ev|${d}|video_play`)), "count"),
      },
    };
  }

  // ---- recent client errors ----
  let errors = [];
  try {
    const ids = (await S.one("ZREVRANGE", "errs", 0, 7)) || [];
    if (ids.length) {
      const rows = await S.pipeline(ids.map((id) => ["HGETALL", `err:${id}`]));
      errors = rows.map(toObj).filter((h) => h && h.msg).map((h) => ({
        msg: h.msg, where: h.where || "/", n: n(h.n), last: ago(h.last),
      }));
    }
  } catch (e) { /* errors panel is not worth failing the page for */ }

  return res.status(200).json({
    generated: new Date().toISOString(),
    days: daysOut, sources, funnel, pages, depth,
    depthLabels: ["25%", "50%", "75%", "90%"],
    events, errors,
    stats: { 7: block(7), 30: block(30), 90: block(90) },
  });
};

// Upstash returns HGETALL as a flat array
function toObj(flat) {
  if (!flat) return null;
  if (!Array.isArray(flat)) return flat;
  const o = {};
  for (let i = 0; i < flat.length; i += 2) o[flat[i]] = flat[i + 1];
  return o;
}
function ago(iso) {
  if (!iso) return "";
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 3600) return Math.round(s / 60) + " min ago";
  if (s < 86400) return Math.round(s / 3600) + " hours ago";
  const d = Math.round(s / 86400);
  return d + (d === 1 ? " day ago" : " days ago");
}
