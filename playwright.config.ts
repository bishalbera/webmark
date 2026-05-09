import dotenv from "dotenv";
import path from "path";
import { defineConfig, devices } from "@playwright/test";

dotenv.config({ path: path.resolve(__dirname, ".env") });

const requiredEnvVars = ["OPENROUTER_API_KEY"];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Environment variable not set: ${envVar}`);
  }
}

const { configure, emailsinkProvider } = require("passmark") as typeof import("passmark");

configure({
  ai: {
    gateway: "openrouter",
    models: {
      stepExecution: "google/gemini-2.5-flash",
      userFlowLow: "google/gemini-2.5-flash",
      userFlowHigh: "google/gemini-2.5-flash",
      assertionSecondary: "google/gemini-2.5-flash",
      assertionArbiter: "google/gemini-2.5-flash",
    },
  },
  email: emailsinkProvider({}),
});

console.log(
  "[webmark] Passmark configured. Redis:",
  process.env.REDIS_URL ? "enabled :)" : "disabled :( set REDIS_URL",
);

export default defineConfig({
  testDir: "./tests",
  timeout: 180_000,
  retries: 1,
  workers: 1,
  fullyParallel: false,
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
    ["json", { outputFile: "results/playwright-results.json" }],
  ],

  use: {
    headless: true,
    screenshot: "on",
    trace: "retain-on-failure",
    video: "retain-on-failure",
    actionTimeout: 60_000,
    navigationTimeout: 60_000,
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  testMatch: [
    "**/benchmarks/cache-metrics.spec.ts",
    "**/auth/**/*.spec.ts",
    "**/ecommerce/**/*.spec.ts",
    "**/automation-playgrounds/uitestingplayground.spec.ts",
    "**/automation-playgrounds/hoppscotch.spec.ts",
  ],
});
