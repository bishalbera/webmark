import path from "path";
import fs from "fs";
import { FlowResult } from "./sites";

export interface FlowScore {
  siteId: string;
  siteName: string;
  flow: string;
  result: FlowResult;
  notes?: string;
  durationMs?: number;
  timestamp: string;
  assertionDetails?: AssertionLog[];
}

export interface AssertionLog {
  assertion: string;
  agreed: boolean;
  arbiterUsed: boolean;
  finalVerdict: "pass" | "fail";
  notes?: string;
}

const RESULTS_DIR = path.resolve(__dirname, "../results");
const SCORES_FILE = path.join(RESULTS_DIR, "site-scores.json");

const ensureDir = () => {
  if (!fs.existsSync(RESULTS_DIR)) {
    fs.mkdirSync(RESULTS_DIR, { recursive: true });
  }
};

export const logFlowScore = (score: FlowScore) => {
  ensureDir();
  const existing: FlowScore[] = fs.existsSync(SCORES_FILE)
    ? JSON.parse(fs.readFileSync(SCORES_FILE, "utf-8"))
    : [];

  // Replace existing entry for same site+flow, or append
  const idx = existing.findIndex(
    (s) => s.siteId === score.siteId && s.flow === score.flow,
  );
  if (idx >= 0) {
    existing[idx] = score;
  } else {
    existing.push(score);
  }

  fs.writeFileSync(SCORES_FILE, JSON.stringify(existing, null, 2));
  const icon =
    score.result === "pass" ? "✓" : score.result === "fail" ? "✗" : "~";
  console.log(
    `[webmark] ${icon} ${score.siteName} / ${score.flow} → ${score.result}`,
  );
};

export const loadScores = (): FlowScore[] => {
  ensureDir();
  return fs.existsSync(SCORES_FILE)
    ? JSON.parse(fs.readFileSync(SCORES_FILE, "utf-8"))
    : [];
};

export const printScorecard = () => {
  const scores = loadScores();
  if (scores.length === 0) return;

  const bySite = scores.reduce<Record<string, FlowScore[]>>((acc, s) => {
    acc[s.siteName] = acc[s.siteName] ?? [];
    acc[s.siteName].push(s);
    return acc;
  }, {});

  console.log("\n========= WebMark Scorecard =========");
  for (const [site, flows] of Object.entries(bySite)) {
    const passing = flows.filter((f) => f.result === "pass").length;
    const total = flows.length;
    console.log(`  ${site}: ${passing}/${total} flows passing`);
    for (const f of flows) {
      const icon = f.result === "pass" ? "✓" : f.result === "fail" ? "✗" : "~";
      console.log(`    ${icon} ${f.flow}${f.notes ? " — " + f.notes : ""}`);
    }
  }
  console.log("=====================================\n");
};
