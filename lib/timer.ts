import { runSteps } from "passmark";
import path from "path";
import fs from "fs";

export interface TimingResult {
  label: string;
  site: string;
  runNumber: number;
  timestamp: string;
  error?: string;
  ms: number;
  cached: boolean;
}

const RESULTS_DIR = path.resolve(__dirname, "../results");

const ensureResultsDir = () => {
  if (!fs.existsSync(RESULTS_DIR)) {
    fs.mkdirSync(RESULTS_DIR, { recursive: true });
  }
};

export const saveResult = (result: TimingResult, filename: string) => {
  ensureResultsDir();
  const filepath = path.join(RESULTS_DIR, filename);
  const existing: TimingResult[] = fs.existsSync(filepath)
    ? JSON.parse(fs.readFileSync(filepath, "utf-8"))
    : [];
  existing.push(result);
  fs.writeFileSync(filepath, JSON.stringify(existing, null, 2));
};

export const loadResults = (filename: string): TimingResult[] => {
  ensureResultsDir();
  const filepath = path.join(RESULTS_DIR, filename);
  return fs.existsSync(filepath)
    ? JSON.parse(fs.readFileSync(filepath, "utf-8"))
    : [];
};

export const timedRunSteps = async (
  opts: Parameters<typeof runSteps>[0],
  label: string,
  site: string,
  runNumber: number,
  resultsFile: string,
): Promise<TimingResult> => {
  const start = Date.now();
  let error: string | undefined;

  try {
    await runSteps(opts);
  } catch (e: any) {
    error = e?.message ?? String(e);
    throw e;
  } finally {
    const ms = Date.now() - start;

    const prev = loadResults(resultsFile).filter((r) => r.label === label);
    const firstRunMs = prev.find((r) => r.runNumber === 1)?.ms;

    const cached =
      runNumber > 1 && firstRunMs !== undefined
        ? ms < firstRunMs * 0.15
        : false;

    const result: TimingResult = {
      label,
      site,
      runNumber,
      cached,
      timestamp: new Date().toISOString(),
      ms,
      ...(error && { error }),
    };
    saveResult(result, resultsFile);
    console.log(
      `[webmark] ${label} | run ${runNumber} | ${ms}ms | ${cached ? "CACHED ✓" : "AI ✗"}`,
    );

    return result;
  }
};

export const printCacheSummary = (resultsFile: string) => {
  const results = loadResults(resultsFile);
  const labels = [...new Set(results.map((r) => r.label))];

  console.log("\n=== Cache Performance Summary ===");

  for (const label of labels) {
    const runs = results
      .filter((r) => r.label === label)
      .sort((a, b) => a.runNumber - b.runNumber);
    if (runs.length < 2) continue;

    const run1 = runs[0].ms;
    const cached = runs.slice(1);
    const avgCached = Math.round(
      cached.reduce((s, r) => s + r.ms, 0) / cached.length,
    );
    const speedup = Math.round(run1 / avgCached);

    console.log(`  ${label}`);
    console.log(`    First run (AI):   ${run1}ms`);
    console.log(`    Avg cached:       ${avgCached}ms`);
    console.log(`    Speedup:          ${speedup}x faster`);
  }
  console.log("=================================\n");
};
