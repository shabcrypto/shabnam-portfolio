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

  /* ---- pageview ---- */
  send({ t: "view", r: document.referrer || "" });

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
    // the looping cover videos autoplay; only a walkthrough the visitor pressed counts
    if (t && t.tagName === "VIDEO" && !t.autoplay) ev("video_play");
  }, true);

  /* ---- client errors, so the dashboard's error panel has something real ---- */
  var errs = 0;
  window.addEventListener("error", function (e) {
    if (errs++ > 3) return;                       // never let a loop flood the collector
    var m = e.message || (e.target && (e.target.src || e.target.href) ? "Failed to load resource: " + String(e.target.src || e.target.href).split("/").pop() : "");
    if (m) send({ t: "error", m: String(m) });
  }, true);
})();
