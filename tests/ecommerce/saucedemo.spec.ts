import { test, expect } from "@playwright/test";
import { runSteps } from "passmark";
import { logFlowScore } from "../../lib/logger";

test.describe("Sauce Demo — login and checkout flows", () => {
  test.setTimeout(180_000);

  test("Standard user — login and browse products", async ({ page }) => {
    const startMs = Date.now();
    let result: "pass" | "fail" | "partial" = "fail";
    let notes = "";

    try {
      await runSteps({
        page,
        userFlow: "Sauce Demo — standard_user login",
        steps: [
          { description: "Navigate to https://www.saucedemo.com" },
          {
            description: "Enter the username into the username field",
            data: { value: "standard_user" },
          },
          {
            description: "Enter the password into the password field",
            data: { value: "secret_sauce" },
          },
          {
            description: "Click the Login button",
            waitUntil: "The products inventory page is visible with product cards",
          },
        ],
        assertions: [
          {
            assertion:
              "The products inventory page is displayed with at least 4 product cards visible — login was successful",
          },
          {
            assertion:
              "No error message or 'Epic sadface' banner is shown — the login succeeded without errors",
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
        siteId: "saucedemo",
        siteName: "Sauce Demo",
        flow: "login-standard",
        result,
        notes,
        durationMs: Date.now() - startMs,
        timestamp: new Date().toISOString(),
      });
    }
  });

  test("Locked-out user — error message on login attempt", async ({ page }) => {
    const startMs = Date.now();
    let result: "pass" | "fail" | "partial" = "fail";
    let notes = "";

    try {
      await runSteps({
        page,
        userFlow: "Sauce Demo — locked_out_user login rejection",
        steps: [
          { description: "Navigate to https://www.saucedemo.com" },
          {
            description: "Enter the username into the username field",
            data: { value: "locked_out_user" },
          },
          {
            description: "Enter the password into the password field",
            data: { value: "secret_sauce" },
          },
          {
            description: "Click the Login button",
            waitUntil: "An error message or banner appears on the login page",
          },
        ],
        assertions: [
          {
            assertion:
              "An error message is displayed stating the user is locked out — the exact message should mention 'locked out' or 'Sorry, this user has been locked out'",
          },
          {
            assertion:
              "The user remains on the login page and was NOT redirected to the products page",
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
        siteId: "saucedemo",
        siteName: "Sauce Demo",
        flow: "login-locked-out",
        result,
        notes,
        durationMs: Date.now() - startMs,
        timestamp: new Date().toISOString(),
      });
    }
  });

  test("Visual user — product images are correct (AI vision check)", async ({ page }) => {
    const startMs = Date.now();
    let result: "pass" | "fail" | "partial" = "fail";
    let notes = "";

    try {
      await runSteps({
        page,
        userFlow: "Sauce Demo — visual_user product image correctness",
        steps: [
          { description: "Navigate to https://www.saucedemo.com" },
          {
            description: "Enter the username into the username field",
            data: { value: "visual_user" },
          },
          {
            description: "Enter the password into the password field",
            data: { value: "secret_sauce" },
          },
          {
            description: "Click the Login button",
            waitUntil: "The products inventory page is visible",
          },
        ],
        assertions: [
          {
            assertion:
              "The products page is displayed — products are visible",
          },
          {
            assertion:
              "The product images are correctly matched to their product names — for example, a backpack product should show a backpack image and not a t-shirt or other wrong item. Look carefully at each product card to check if the image matches the product title.",
          },
          {
            assertion:
              "All product images are fully rendered and visible — none are broken, missing, or showing a placeholder",
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
        siteId: "saucedemo",
        siteName: "Sauce Demo",
        flow: "visual-user-bugs",
        result,
        notes,
        durationMs: Date.now() - startMs,
        timestamp: new Date().toISOString(),
      });
    }
  });

  test("Checkout — add to cart, checkout, verify pricing math", async ({ page }) => {
    const startMs = Date.now();
    let result: "pass" | "fail" | "partial" = "fail";
    let notes = "";

    try {
      // Step 1: Login and add product to cart
      await runSteps({
        page,
        userFlow: "Sauce Demo — login and add Backpack to cart",
        steps: [
          { description: "Navigate to https://www.saucedemo.com" },
          {
            description: "Enter the username into the username field",
            data: { value: "standard_user" },
          },
          {
            description: "Enter the password into the password field",
            data: { value: "secret_sauce" },
          },
          {
            description: "Click the Login button",
            waitUntil: "Products inventory page is visible",
          },
          {
            description: "Click the 'Add to cart' button on the Sauce Labs Backpack product",
            waitUntil: "The cart badge in the top right shows 1 item",
          },
        ],
        assertions: [
          {
            assertion:
              "The cart badge shows exactly 1 item — the Backpack has been added",
          },
        ],
        test,
        expect,
      });

      result = "partial";

      // Step 2: Go to cart
      await runSteps({
        page,
        userFlow: "Sauce Demo — view cart",
        steps: [
          {
            description: "Click on the shopping cart icon to open the cart",
            waitUntil: "The cart page shows the Sauce Labs Backpack with its price",
          },
        ],
        assertions: [
          {
            assertion:
              "The cart shows the Sauce Labs Backpack with price $29.99 — exactly one item, correct name, correct price",
          },
        ],
        test,
        expect,
      });

      // Step 3: Checkout
      await runSteps({
        page,
        userFlow: "Sauce Demo — checkout flow",
        steps: [
          {
            description: "Click the Checkout button",
            waitUntil: "A checkout information form is visible with First Name, Last Name, and Zip/Postal Code fields",
          },
          {
            description: "Enter the first name into the First Name field",
            data: { value: "Test" },
          },
          {
            description: "Enter the last name into the Last Name field",
            data: { value: "Tester" },
          },
          {
            description: "Enter the zip code into the Zip/Postal Code field",
            data: { value: "12345" },
          },
          {
            description: "Click the Continue button",
            waitUntil: "The checkout overview page is visible with item total and tax",
          },
        ],
        assertions: [
          {
            assertion:
              "The checkout overview shows: Item total = $29.99, Tax = $2.40, Total = $32.39 — the math is exactly correct and all three numbers are visible",
          },
          {
            assertion:
              "The product 'Sauce Labs Backpack' is listed in the order summary with its $29.99 price",
          },
        ],
        test,
        expect,
      });

      result = "pass";
    } catch (e: any) {
      notes = e?.message?.slice(0, 300) ?? String(e);
      if (result !== "partial") result = "fail";
      throw e;
    } finally {
      logFlowScore({
        siteId: "saucedemo",
        siteName: "Sauce Demo",
        flow: "checkout-pricing",
        result,
        notes,
        durationMs: Date.now() - startMs,
        timestamp: new Date().toISOString(),
      });
    }
  });
});
