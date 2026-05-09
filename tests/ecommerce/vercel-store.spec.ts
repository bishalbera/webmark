import { test, expect } from "@playwright/test";
import { runSteps } from "passmark";
import { logFlowScore } from "../../lib/logger";

test.describe("Vercel Commerce — ecommerce flows", () => {
  test.setTimeout(180_000);

  test("Browse and add product to cart", async ({ page }) => {
    const startMs = Date.now();
    let result: "pass" | "fail" | "partial" = "fail";
    let notes = "";

    try {
      await runSteps({
        page,
        executionId: "vercel-store-session",
        userFlow: "Vercel store — browse and add to cart",
        steps: [
          { description: "Navigate to https://demo.vercel.store" },
          {
            description: "Click on the first product shown on the homepage",
            waitUntil: "The product detail page is visible with a title and price",
          },
          {
            description:
              "If there are colour or size options available, select the first one for each",
          },
          {
            description: "Click the Add to Cart button",
            waitUntil: "A cart drawer or cart count indicator updates to show 1 item",
          },
          {
            description:
              "Save the name of the product just added to the cart as {{global.vercelLastProduct}}",
          },
        ],
        assertions: [
          {
            assertion:
              "A cart icon or drawer shows exactly 1 item — the product was added successfully",
          },
          {
            assertion:
              "The product name visible on the page matches what was saved as {{global.vercelLastProduct}}",
          },
        ],
        test,
        expect,
      });
      result = "pass";
    } catch (e: any) {
      notes = e?.message?.slice(0, 300) ?? String(e);
      result = "fail";
      throw e;
    } finally {
      logFlowScore({
        siteId: "vercel-store",
        siteName: "Vercel Commerce",
        flow: "browse-add-to-cart",
        result,
        notes,
        durationMs: Date.now() - startMs,
        timestamp: new Date().toISOString(),
      });
    }
  });

  test("Cart global state — product persists from previous test", async ({ page }) => {
    const startMs = Date.now();
    let result: "pass" | "fail" | "partial" = "fail";
    let notes = "";

    try {
      await runSteps({
        page,
        executionId: "vercel-store-session",
        userFlow: "Vercel store — verify cross-test global state in cart",
        steps: [
          { description: "Navigate to https://demo.vercel.store" },
          {
            description:
              "Open the shopping cart drawer or navigate to the cart page",
            waitUntil: "The cart contents are visible",
          },
        ],
        assertions: [
          {
            assertion:
              "The cart contains the product {{global.vercelLastProduct}} that was added in the previous test — global state persisted correctly across test boundaries via Redis",
          },
          {
            assertion:
              "The cart shows at least 1 item with a non-zero price displayed",
          },
        ],
        test,
        expect,
      });
      result = "pass";
    } catch (e: any) {
      notes = e?.message?.slice(0, 300) ?? String(e);
      result = "fail";
      throw e;
    } finally {
      logFlowScore({
        siteId: "vercel-store",
        siteName: "Vercel Commerce",
        flow: "cart-global-state",
        result,
        notes,
        durationMs: Date.now() - startMs,
        timestamp: new Date().toISOString(),
      });
    }
  });

  test("Pricing accuracy — item total matches line items", async ({ page }) => {
    const startMs = Date.now();
    let result: "pass" | "fail" | "partial" = "fail";
    let notes = "";

    try {
      await runSteps({
        page,
        executionId: "vercel-store-session",
        userFlow: "Vercel store — add product for pricing check",
        steps: [
          { description: "Navigate to https://demo.vercel.store" },
          {
            description: "Click on any product on the homepage",
            waitUntil: "The product page is fully loaded with a price visible",
          },
          {
            description:
              "Note the product price displayed on the page and save it as {{global.vercelProductPrice}}",
          },
          {
            description: "Click Add to Cart",
            waitUntil: "Cart shows 1 item",
          },
        ],
        assertions: [
          { assertion: "A product with a visible price has been added to the cart" },
        ],
        test,
        expect,
      });

      await runSteps({
        page,
        executionId: "vercel-store-session",
        userFlow: "Vercel store — verify pricing math in cart",
        steps: [
          {
            description: "Open the shopping cart drawer",
            waitUntil: "Cart drawer is open and shows the product with its price",
          },
        ],
        assertions: [
          {
            assertion:
              "The price shown for the item in the cart matches {{global.vercelProductPrice}} — the price displayed on the product page and the cart match exactly, with no rounding errors",
          },
          {
            assertion:
              "A subtotal or total is shown in the cart that is greater than zero",
          },
        ],
        test,
        expect,
      });

      result = "pass";
    } catch (e: any) {
      notes = e?.message?.slice(0, 300) ?? String(e);
      result = "fail";
      throw e;
    } finally {
      logFlowScore({
        siteId: "vercel-store",
        siteName: "Vercel Commerce",
        flow: "pricing-accuracy",
        result,
        notes,
        durationMs: Date.now() - startMs,
        timestamp: new Date().toISOString(),
      });
    }
  });
});
