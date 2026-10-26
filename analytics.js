/* First-party analytics for shabnamraghavan.com. Sends small beacons to /api/collect.
   Same-origin on purpose: ad blockers leave first-party endpoints alone, which is the whole
   accuracy argument for building this rather than using Google Analytics. See design-context
   section 13. No cookie, no cross-day identifier, no IP stored, so no consent banner.

   Shared by every page. Keep it identical everywhere, like the nav and the footer. */
(function () {
  "use strict";

  // Only report from the live site. On localhost this is a no-op, which is expected, not a bug.
  if (!/(^|\.)shabnamraghavan\.com$/.test(location.hostname)) return;
  if (navigator.doNotTrack === "1" || window.doNotTrack === "1") return;
  // Shabnam's own devices: any browser that has opened the stats dashboard with her key
  // carries this flag and is never counted (stats.html sets it; stats.html#k= clears it).
  try { if (localStorage.getItem("shab-ignore") === "1") return; } catch (e) {}
  // Bots and automated browsers (crawlers, link previews, Lighthouse, headless test runs) are not visitors.
  if (navigator.webdriver) return;
  if (/bot|crawl|spider|slurp|preview|lighthouse|headless|phantom|puppeteer|playwright|facebookexternalhit|whatsapp|embedly|vercel|uptime|monitor/i.test(navigator.userAgent || "")) return;

  var ENDPOINT = "/api/collect";

  // A visitor id is one device on one day. It is regenerated at midnight, so nothing links
  // today's visit to tomorrow's and this cannot follow anyone over time.
  var vid = (function () {
    try {
      var today = new Date().toISOString().slice(0, 10);
      var raw = localStorage.getItem("shab-vid");
      if (raw) { var p = raw.split("|"); if (p[0] === today) return p[1]; }
      var id = (Math.random().toString(36) + Math.random().toString(36)).replace(/[^a-z0-9]/g, "").slice(0, 16);
      localStorage.setItem("shab-vid", today + "|" + id);
      return id;
    } catch (e) { return null; }
  })();

  var path = location.pathname;

  function send(payload) {
    payload.p = path;
    if (vid) payload.v = vid;
    var body = JSON.stringify(payload);
    try {
      // sendBeacon survives the page being closed, which is the only way dwell time ever arrives
      if (navigator.sendBeacon && navigator.sendBeacon(ENDPOINT, new Blob([body], { type: "application/json" }))) return;
    } catch (e) { /* fall through */ }
    try { fetch(ENDPOINT, { method: "POST", body: body, headers: { "Content-Type": "application/json" }, keepalive: true }); } catch (e) {}
  }

  /* ---- device type: phone, tablet or desktop only. Nothing more specific is sent. ---- */
  var device = (function () {
    var ua = navigator.userAgent || "";
    if (/iPad|Tablet|PlayBook|Silk/i.test(ua) || (/Android/i.test(ua) && !/Mobile/i.test(ua)) ||
        (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1)) return "tablet";   // iPadOS reports as a Mac
    if (/Mobi|iPhone|iPod|Android/i.test(ua)) return "phone";
    return "desktop";
  })();

  /* ---- pageview ---- */
  send({ t: "view", r: document.referrer || "", dv: device });

  /* ---- dwell time, counted only while the tab is actually visible ---- */
  var visible = document.visibilityState === "visible";
  var mark = Date.now(), acc = 0, sent = false;
  var firstOfSession = (function () {
    try {
      if (sessionStorage.getItem("shab-sess")) return false;
      sessionStorage.setItem("shab-sess", "1");
      return true;
    } catch (e) { return false; }
  })();

  function accrue() { if (visible) { acc += Date.now() - mark; } mark = Date.now(); }
  document.addEventListener("visibilitychange", function () {
    accrue();
    visible = document.visibilityState === "visible";
  });
  function flush() {
    if (sent) return;
    accrue();
    sent = true;
    send({ t: "dur", s: Math.round(acc / 1000), first: firstOfSession });
  }
  window.addEventListener("pagehide", flush);
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") flush();
  });

  /* ---- scroll depth, one beacon per threshold per page ---- */
  var hit = {};
  function depth() {
    var h = document.documentElement;
    var reach = (h.scrollTop + window.innerHeight) / Math.max(1, h.scrollHeight);
    [25, 50, 75, 90].forEach(function (d) {
      if (!hit[d] && reach >= d / 100) { hit[d] = 1; send({ t: "depth", d: d }); }
    });
  }
  window.addEventListener("scroll", function () {
    if (depth.q) return;
    depth.q = 1;
    setTimeout(function () { depth.q = 0; depth(); }, 300);
  }, { passive: true });
  depth();

  /* ---- events worth knowing about ---- */
  function ev(n) { send({ t: "event", n: n }); }

  document.addEventListener("click", function (e) {
    var a = e.target && e.target.closest && e.target.closest("a");
    if (!a) return;
    var href = a.getAttribute("href") || "";
    if (/\.pdf($|[?#])/i.test(href) || a.hasAttribute("download")) return ev("resume_download");
    if (/linkedin\.com|lnkd\.in/i.test(href)) return ev("linkedin_click");
    if (/^mailto:/i.test(href)) return ev("email_click");
    if (/case-study|tpa_ops/i.test(href) && !/^#/.test(href)) return ev("case_study_open");
  }, true);

  document.addEventListener("play", function (e) {
    var t = e.target;
    // Only a walkthrough the visitor chose to play counts. The card cover videos loop and are
    // started by script each time a card scrolls into view, so a looping video, or any video
    // inside a case study card, is never counted (they were, until 2026-10-26).
    // Walkthroughs hide the native controls behind a play button, so "has controls" is not a test.
    if (!t || t.tagName !== "VIDEO") return;
    if (t.loop || t.autoplay) return;
    if (t.closest && t.closest(".file-photo, .cs-thumb, .cs-card, .more-work")) return;
    ev("video_play");
  }, true);

  /* ---- client errors, so the dashboard's error panel has something real ---- */
  // A download cancelled because the visitor is leaving, or a video the browser aborted,
  // is not a failure on the site, so neither is reported.
  var leaving = false;
  window.addEventListener("pagehide", function () { leaving = true; });
  window.addEventListener("beforeunload", function () { leaving = true; });
  var errs = 0;
  window.addEventListener("error", function (e) {
    if (leaving) return;
    var tg = e.target;
    if (tg && (tg.tagName === "VIDEO" || tg.tagName === "AUDIO") && tg.error && tg.error.code === 1) return;   // MEDIA_ERR_ABORTED
    if (errs++ > 3) return;                       // never let a loop flood the collector
    var m = e.message || (e.target && (e.target.src || e.target.href) ? "Failed to load resource: " + String(e.target.src || e.target.href).split("/").pop() : "");
    if (m) send({ t: "error", m: String(m) });
  }, true);
})();
