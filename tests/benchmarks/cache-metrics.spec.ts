import { test, expect } from "@playwright/test";
import { runSteps } from "passmark";
import { timedRunSteps, printCacheSummary } from "../../lib/timer";

const FLOW_LABEL = "vercel-store-browse";
const RESULTS_FILE = "cache-run-results.json";

test.describe("Cache performance benchmark", () => {
  test.setTimeout(120_000);

  for (let run = 1; run <= 3; run++) {
    test(`Run ${run} — browse Vercel demo store`, async ({ page }) => {
      await timedRunSteps(
        {
          page,
          userFlow: "Browse Vercel demo store",
          steps: [
            { description: "Navigate to https://demo.vercel.store" },
            { description: "Click on the first product in the list", waitUntil: "The product detail page is visible" },
            { description: "Select a size option if available" },
            { description: "Select a colour option if available" },
            { description: "Click the Add to Cart button", waitUntil: "The cart count or cart drawer updates to show 1 item" },
          ],
          assertions: [
            { assertion: "The cart shows exactly 1 item — the product was added successfully" },
            { assertion: "The product name and price are visible on the page" },
          ],
          test,
          expect,
        },
        FLOW_LABEL,
        "vercel-store",
        run,
        RESULTS_FILE,
      );
    });
  }

  test("Print cache summary", async () => {
    printCacheSummary(RESULTS_FILE);
  });
});
