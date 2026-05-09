import fs from "fs";
import path from "path";
import { loadScores, type FlowScore } from "../lib/logger";
import { SITES } from "../lib/sites";

const OUT = path.resolve(__dirname, "index.html");

const FLOW_LABELS: Record<string, string> = {
  "signup-email-otp": "Signup + Email OTP",
  "login-global-state": "Login (global state)",
  "error-handling-enumeration": "Error handling",
  "browse-add-to-cart": "Browse + Add to cart",
  "cart-global-state": "Cart (global state)",
  "cart-pricing-accuracy": "Pricing accuracy",
  search: "Search",
  "snapshot-dynamic-id": "Dynamic ID (snapshot)",
  "cua-dynamic-id": "Dynamic ID (CUA)",
  "snapshot-ajax-load": "AJAX load (snapshot)",
  "cua-ajax-load": "AJAX load (CUA)",
  "snapshot-overlapping": "Overlapping (snapshot)",
  "cua-overlapping": "Overlapping (CUA)",
  "snapshot-progress-bar": "Progress bar (snapshot)",
};

function resultBadge(result?: "pass" | "fail" | "partial" | "skip"): string {
  if (!result || result === "skip") return `<span class="badge skip">—</span>`;
  if (result === "pass") return `<span class="badge pass">✓ pass</span>`;
  if (result === "partial")
    return `<span class="badge partial">~ partial</span>`;
  return `<span class="badge fail">✗ fail</span>`;
}

function buildScorecard(scores: FlowScore[]): string {
  const rows = SITES.map((site) => {
    const siteScores = scores.filter((s) => s.siteId === site.id);
    const flows = site.flows.map((flow) => {
      const score = siteScores.find((s) => s.flow === flow);
      const label = FLOW_LABELS[flow] ?? flow;
      return `<td title="${score?.notes ?? ""}">${resultBadge(score?.result)}<br><small>${label}</small></td>`;
    });

    const passing = siteScores.filter((s) => s.result === "pass").length;
    const total = siteScores.length;
    const pct = total > 0 ? Math.round((passing / total) * 100) : 0;
    const scoreClass = pct >= 75 ? "good" : pct >= 40 ? "medium" : "bad";

    return `
      <tr>
        <td class="site-name">
          <strong>${site.name}</strong><br>
          <small class="url">${site.url}</small><br>
          <small class="category">${site.category}</small>
        </td>
        <td class="score ${scoreClass}">${passing}/${total}<br><small>${pct}%</small></td>
        ${flows.join("")}
      </tr>`;
  });

  return rows.join("");
}


function generate() {
  const scores = loadScores();

  const passCount = scores.filter((s) => s.result === "pass").length;
  const failCount = scores.filter((s) => s.result === "fail").length;
  const partialCount = scores.filter((s) => s.result === "partial").length;
  const totalFlows = scores.length;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>WebMark — State of the Web</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #0f0f11; color: #e2e2e4; padding: 2rem; }
    h1 { font-size: 2rem; font-weight: 700; margin-bottom: 0.25rem; }
    h2 { font-size: 1.25rem; font-weight: 600; margin: 2rem 0 1rem; color: #a0a0a8; border-bottom: 1px solid #2a2a30; padding-bottom: 0.5rem; }
    .subtitle { color: #70707a; margin-bottom: 2rem; font-size: 0.9rem; }
    .summary { display: flex; gap: 1.5rem; margin-bottom: 2.5rem; flex-wrap: wrap; }
    .stat { background: #1a1a20; border: 1px solid #2a2a30; border-radius: 10px; padding: 1rem 1.5rem; min-width: 120px; }
    .stat .number { font-size: 2rem; font-weight: 700; }
    .stat .label { font-size: 0.8rem; color: #70707a; margin-top: 0.25rem; }
    .stat.green .number { color: #4ade80; }
    .stat.red .number { color: #f87171; }
    .stat.yellow .number { color: #fbbf24; }
    table { width: 100%; border-collapse: collapse; background: #1a1a20; border-radius: 10px; overflow: hidden; font-size: 0.85rem; }
    th { background: #2a2a30; padding: 0.75rem 1rem; text-align: left; font-weight: 600; color: #a0a0a8; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; }
    td { padding: 0.75rem 1rem; border-bottom: 1px solid #2a2a30; vertical-align: top; }
    tr:last-child td { border-bottom: none; }
    .site-name { min-width: 200px; }
    .url { color: #70707a; }
    .category { background: #2a2a30; border-radius: 4px; padding: 1px 6px; font-size: 0.7rem; color: #a0a0a8; }
    .score { font-weight: 700; font-size: 1rem; text-align: center; min-width: 70px; }
    .score.good { color: #4ade80; }
    .score.medium { color: #fbbf24; }
    .score.bad { color: #f87171; }
    .badge { display: inline-block; border-radius: 4px; padding: 2px 7px; font-size: 0.75rem; font-weight: 600; }
    .badge.pass { background: #14532d; color: #4ade80; }
    .badge.fail { background: #450a0a; color: #f87171; }
    .badge.partial { background: #451a03; color: #fbbf24; }
    .badge.skip { background: #1a1a20; color: #70707a; }
    .assertion { font-style: italic; color: #c0c0c8; max-width: 400px; }
    .pass { color: #4ade80; }
    .fail { color: #f87171; }
    footer { margin-top: 3rem; color: #70707a; font-size: 0.8rem; text-align: center; }
    a { color: #818cf8; }
  </style>
</head>
<body>
  <h1>🌐 WebMark</h1>
  <p class="subtitle">AI regression testing across 12 public websites · Hashnode Breaking Things Hackathon 2026 · Powered by <a href="https://passmark.dev" target="_blank">Passmark</a></p>

  <div class="summary">
    <div class="stat green"><div class="number">${passCount}</div><div class="label">Flows passing</div></div>
    <div class="stat red"><div class="number">${failCount}</div><div class="label">Flows failing</div></div>
    <div class="stat yellow"><div class="number">${partialCount}</div><div class="label">Partial</div></div>
    <div class="stat"><div class="number">${totalFlows}</div><div class="label">Total flows tested</div></div>
    <div class="stat"><div class="number">${SITES.length}</div><div class="label">Sites tested</div></div>
  </div>

  <h2>Site Scorecard</h2>
  <table>
    <thead>
      <tr>
        <th>Site</th>
        <th>Score</th>
        <th colspan="6">Flows</th>
      </tr>
    </thead>
    <tbody>
      ${buildScorecard(scores)}
    </tbody>
  </table>

  <footer>
    Generated ${new Date().toUTCString()} ·
    <a href="https://github.com/yourusername/webmark" target="_blank">GitHub</a> ·
    <a href="https://hashnode.com/hackathons/breaking-things" target="_blank">Breaking Things Hackathon</a>
  </footer>
</body>
</html>`;

  fs.writeFileSync(OUT, html);
  console.log(`[webmark] Dashboard written to ${OUT}`);
  console.log(
    `[webmark] ${passCount} passing, ${failCount} failing, ${partialCount} partial across ${totalFlows} flows on ${SITES.length} sites`,
  );
}

generate();
