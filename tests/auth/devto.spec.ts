import { test, expect } from "@playwright/test";
import { runSteps } from "passmark";
import { logFlowScore } from "../../lib/logger";

test.describe("DEV Community — auth and browsing flows", () => {
  test.setTimeout(180_000);

  test("Browse the DEV feed", async ({ page }) => {
    const startMs = Date.now();
    let result: "pass" | "fail" | "partial" = "fail";
    let notes = "";

    try {
      await runSteps({
        page,
        userFlow: "DEV Community — browse feed",
        steps: [
          { description: "Navigate to https://dev.to" },
          {
            description: "Wait for the homepage feed to load with article cards",
            waitUntil: "At least 3 article cards are visible in the feed",
          },
          {
            description: "Click on the first article in the feed",
            waitUntil: "The article page is visible with a title and author name",
          },
        ],
        assertions: [
          {
            assertion:
              "An article page is displayed with a clear title at the top and at least one paragraph of content",
          },
          {
            assertion:
              "An author name or avatar is visible on the article page — not a blank or error page",
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
        siteId: "devto",
        siteName: "DEV Community",
        flow: "browse-feed",
        result,
        notes,
        durationMs: Date.now() - startMs,
        timestamp: new Date().toISOString(),
      });
    }
  });

  test("Search for articles", async ({ page }) => {
    const startMs = Date.now();
    let result: "pass" | "fail" | "partial" = "fail";
    let notes = "";

    try {
      await runSteps({
        page,
        userFlow: "DEV Community — search for articles",
        steps: [
          { description: "Navigate to https://dev.to" },
          {
            description: "Find and click the search icon or search input",
            waitUntil: "A search input field is focused or visible",
          },
          {
            description: "Type the search term 'playwright testing' into the search field",
            data: { value: "playwright testing" },
          },
          {
            description: "Submit the search by pressing Enter or clicking the search button",
            waitUntil: "Search results are visible on the page",
          },
        ],
        assertions: [
          {
            assertion:
              "Search results for 'playwright testing' are displayed — at least one article card with a relevant title is visible",
          },
          {
            assertion:
              "No error page or 'something went wrong' message is shown",
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
        siteId: "devto",
        siteName: "DEV Community",
        flow: "search",
        result,
        notes,
        durationMs: Date.now() - startMs,
        timestamp: new Date().toISOString(),
      });
    }
  });

  test("Signup with magic link email OTP", async ({ page }) => {
    const startMs = Date.now();
    let result: "pass" | "fail" | "partial" = "fail";
    let notes = "";

    try {
      await runSteps({
        page,
        userFlow: "DEV Community — signup with magic link",
        steps: [
          { description: "Navigate to https://dev.to/enter" },
          {
            description: "Click on the option to sign in with email (magic link)",
            waitUntil: "An email input field is visible",
          },
          {
            description: "Enter the email address into the email field",
            data: { value: "{{run.dynamicEmail}}" },
          },
          {
            description: "Click the button to send the magic link or submit the email form",
            waitUntil: "A confirmation message saying to check your email is visible",
          },
        ],
        assertions: [
          {
            assertion:
              "A confirmation or 'check your email' message is displayed after submitting the email — the magic link was requested",
          },
        ],
        test,
        expect,
      });

      result = "partial";

      await runSteps({
        page,
        userFlow: "DEV Community — click magic link from email",
        steps: [
          {
            description: "Navigate to the magic link received in the email",
            data: {
              value:
                "{{email.link:click the sign in link or magic link:{{run.dynamicEmail}}}}",
            },
            waitUntil: "The DEV.to dashboard or user profile page is visible",
          },
        ],
        assertions: [
          {
            assertion:
              "The user is now signed in — a user avatar, username, or dashboard link is visible in the navigation bar",
          },
          {
            assertion:
              "No error message or 'invalid token' message is displayed",
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
        siteId: "devto",
        siteName: "DEV Community",
        flow: "signup-email-otp",
        result,
        notes,
        durationMs: Date.now() - startMs,
        timestamp: new Date().toISOString(),
      });
    }
  });
});
