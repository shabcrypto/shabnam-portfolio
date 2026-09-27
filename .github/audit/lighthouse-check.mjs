// Reads Lighthouse's JSON for the home page (mobile) and fails below the floor.
// Lab scores wobble a few points run to run, so the floor sits well under today's 82.
import { readFileSync, appendFileSync } from "node:fs";
const FLOOR = 65;
const lh = JSON.parse(readFileSync(process.argv[2] || "lh.json", "utf8"));
const score = Math.round(lh.categories.performance.score * 100);
const a = lh.audits;
const line = `## Home page speed (mobile): ${score}/100 · LCP ${a["largest-contentful-paint"].displayValue} · FCP ${a["first-contentful-paint"].displayValue} · CLS ${a["cumulative-layout-shift"].displayValue} (floor ${FLOOR})`;
console.log(line);
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, line + "\n");
process.exit(score < FLOOR ? 1 : 0);
