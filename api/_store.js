// Tiny Redis client over Upstash's REST API.
//
// Deliberately zero npm dependencies. This repo has no package.json and is deployed on Vercel
// as a plain static site; adding one would change how Vercel builds it, and a build change on a
// live portfolio is not worth a database driver. Upstash speaks HTTP, so plain fetch is enough.
//
// Needs two environment variables, both provided automatically when you add Upstash for Redis
// from the Vercel dashboard:
//   KV_REST_API_URL
//   KV_REST_API_TOKEN

const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

const configured = Boolean(URL_ && TOKEN);

// Upstash takes a command as a JSON array: ["INCR","key"]. Pipeline takes an array of those.
async function pipeline(commands) {
  if (!configured) throw new Error("store not configured");
  if (!commands.length) return [];
  const res = await fetch(URL_ + "/pipeline", {
    method: "POST",
    headers: { Authorization: "Bearer " + TOKEN, "Content-Type": "application/json" },
    body: JSON.stringify(commands),
  });
  if (!res.ok) throw new Error("store " + res.status + " " + (await res.text()).slice(0, 200));
  const out = await res.json();
  // Upstash answers 200 even when it refuses a command (quota spent, bad arguments) and puts the
  // reason on each item. Surface it: silently reading those as nulls once showed a live
  // dashboard full of zeros while every write was being refused.
  const bad = out.find((r) => r && r.error);
  if (bad) throw new Error("store refused: " + String(bad.error).slice(0, 200));
  return out.map((r) => (r && "result" in r ? r.result : null));
}

async function one(...command) {
  return (await pipeline([command]))[0];
}

// Every daily key expires on its own, so the database never grows without bound and there is
// no cleanup job to forget about. 120 days covers the dashboard's longest range (90) with room.
const TTL = 60 * 60 * 24 * 120;

function today(d) {
  return (d ? new Date(d) : new Date()).toISOString().slice(0, 10);
}

// last n dates, oldest first, as YYYY-MM-DD
function lastDays(n, from) {
  const end = from ? new Date(from + "T00:00:00Z") : new Date();
  const out = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(end);
    d.setUTCDate(d.getUTCDate() - i);
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

module.exports = { pipeline, one, configured, TTL, today, lastDays };
