import { test, expect } from "@playwright/test";
import { runSteps } from "passmark";
import { logFlowScore } from "../../lib/logger";

const EXECUTION_ID = "rallly-poll-session";

test.describe("Rallly - scheduling flow", () => {
  test.setTimeout(300_000);

  test("Create a scheduling poll as guest", async ({ page }) => {
    const startMs = Date.now();
    let result: "pass" | "fail" | "partial" = "fail";
    let notes = "";

    try {
      await runSteps({
        page,
        executionId: EXECUTION_ID,
        userFlow: "Rallly create poll — event details",
        steps: [
          { description: "Navigate to https://rallly.co/" },
          {
            description:
              "Click the button to create a new event or meeting poll",
            waitUntil: "A form with a Title field is visible",
          },
          {
            description: "Click on the Title input field and type the event title",
            data: { value: "WebMark Test Meeting" },
          },
          {
            description: "Click on the Description field and type a description",
            data: { value: "Testing Rallly with AI regression testing" },
          },
          {
            description:
              "Click the Continue button (the one that goes to the date/time selection step, NOT the Create Poll button)",
            waitUntil: "A date picker or calendar grid is visible on the page",
          },
        ],
        assertions: [
          {
            assertion:
              "A calendar or date picker is now visible — the user successfully advanced from the event details step",
          },
        ],
        test,
        expect,
      });

      result = "partial";

      await runSteps({
        page,
        executionId: EXECUTION_ID,
        userFlow: "Rallly create poll — date selection and submit",
        steps: [
          {
            description:
              "Click on at least 2 different calendar dates to select them as time options for the poll",
            waitUntil: "At least one date appears highlighted or selected",
          },
          {
            description:
              "Click the Continue or Next button to proceed to the review or final step",
            waitUntil: "A review page, summary, or Create Poll button is visible",
          },
          {
            description: "Click the Create Poll button to finalise the poll",
            waitUntil: "A success message, poll page, or shareable link is visible",
          },
          {
            description:
              "Save the current page URL as {{global.ralllyPollUrl}}",
          },
        ],
        assertions: [
          {
            assertion:
              "The poll was created successfully — a poll management page, shareable link, or success confirmation is visible",
          },
          {
            assertion:
              "The poll title 'WebMark Test Meeting' is visible on the page",
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
        siteId: "rallly",
        siteName: "Rallly",
        flow: "create-poll",
        result,
        notes,
        durationMs: Date.now() - startMs,
        timestamp: new Date().toISOString(),
      });
    }
  });

  test("Vote on the poll created in the previous test", async ({ page }) => {
    const startMs = Date.now();
    let result: "pass" | "fail" | "partial" = "fail";
    let notes = "";

    try {
      await runSteps({
        page,
        executionId: EXECUTION_ID,
        userFlow: "Vote on a Rallly poll",
        steps: [
          {
            description:
              "Navigate to the poll URL that was saved as {{global.ralllyPollUrl}}",
            waitUntil: "A poll page with date options or voting interface is visible",
          },
          {
            description: "Enter a participant name in the Your Name field",
            data: { value: "AI Tester" },
          },
          {
            description:
              "Click on at least one date option to indicate availability",
            waitUntil: "A date option shows as selected, highlighted, or toggled",
          },
          {
            description: "Click the Submit Vote or Save button",
            waitUntil: "A confirmation that the vote was recorded is visible",
          },
        ],
        assertions: [
          {
            assertion:
              "The vote was recorded — a confirmation message, updated results table, or thank-you message is visible",
          },
          {
            assertion:
              "The participant name 'AI Tester' appears in the responses or is acknowledged",
          },
          {
            assertion: "No error message is shown after submitting the vote",
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
        siteId: "rallly",
        siteName: "Rallly",
        flow: "vote-on-poll",
        result,
        notes,
        durationMs: Date.now() - startMs,
        timestamp: new Date().toISOString(),
      });
    }
  });

  test("Form validation — submit poll creation with missing title", async ({
    page,
  }) => {
    const startMs = Date.now();
    let result: "pass" | "fail" | "partial" = "fail";
    let notes = "";

    try {
      await runSteps({
        page,
        userFlow: "Rallly form validation probe",
        steps: [
          { description: "Navigate to https://rallly.co" },
          {
            description: "Click to create a new event or meeting poll",
            waitUntil: "The event creation form with a Title field is visible",
          },
          {
            description:
              "Leave the Title field completely empty and click the Continue button",
          },
        ],
        assertions: [
          {
            assertion:
              "An error or validation message appears on or near the Title field indicating the title is required — the form cannot be submitted without a title",
          },
          {
            assertion:
              "No poll was created — there is no success modal, shareable link, or 'Poll created' message visible on the page",
          },
        ],
        test,
        expect,
      });

      result = "pass";
    } catch (e: any) {
      notes = e?.message?.slice(0, 300) ?? String(e);
      result = "fail";
    } finally {
      logFlowScore({
        siteId: "rallly",
        siteName: "Rallly",
        flow: "form-validation",
        result,
        notes,
        durationMs: Date.now() - startMs,
        timestamp: new Date().toISOString(),
      });
    }
  });
});
