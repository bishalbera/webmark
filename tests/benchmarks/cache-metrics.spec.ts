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
            { description: "Click on the first product in the list" },
            { description: "Select a size option if available" },
            { description: "Click Add to Cart", waitUntil: "Cart is updated" },
            { description: "Navigate back to the home page" },
          ],
          assertions: [
            { assertion: "The product was successfully added to the cart" },
            { assertion: "The home page shows a list of products" },
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
