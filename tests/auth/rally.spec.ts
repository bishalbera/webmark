import { test, expect } from "@playwright/test";
import { runSteps } from "passmark";
import { logFlowScore } from "../../lib/logger";

test.describe("Rally - scheduling flow", () => {
  test.setTimeout(180_000); 

  test("Create a scheduling poll as guest", async ({ page }) => {
    const startMs = Date.now();
    let result: "pass" | "fail" | "partial" = "fail";
    let notes = "";

    try {
      await runSteps({
        page,
        userFlow: "Create a Rally scheduling poll",
        steps: [
          { description: "Navigate to https://rallly.co/" },
          {
            description: "Click the button to create a new poll or get started",
            waitUntil: "A poll creation form or page title input is visible",
          },
          {
            description: "Enter a title for the poll",
            data: { value: "Webmark test meeting" },
          },
          {
            description: "Enter a description for the poll",
            data: { value: "Testing Rally with AI regression testing " },
          },
        //   {
        //     description: "Enter the organiser name",
        //     data: { value: "Webmark Tester" },
        //   },
        //   {
        //     description: "Enter the organiser email",
        //     data: { value: "{{run.dynamicEmail}}" },
        //   },
          {
            description: "Continue to the next step or date selection",
            waitUntil: "A date picker or date selection interface is visible",
          },
          {
            description: "Select at least 2 date options for the poll",
            waitUntil: "At lease one date appears selected or highlighted",
          },
          {
            description: "Continue to the final step and create the poll",
            waitUntil: "A confirmation message or the poll page is visible,",
          },
        ],
        assertions: [
          {
            assertion:
              "The poll was created succesfully - a shareable poll page or confirmation poll page or confirmation message is visible",
          },
          {
            assertion:
              "The poll title `Webmark Test Meeting` is visioble on the page",
          },
          {
            assertion:
              "A shareable link or invite option is visible for the poll",
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
        siteId: "rally",
        siteName: "Rally",
        flow: "create-poll",
        result,
        notes,
        durationMs: Date.now() - startMs,
        timestamp: new Date().toISOString(),
      });
    }
  });

  test("Vote on an existing poll as a participant", async ({ page }) => {
    const startMs = Date.now();
    let result: "pass" | "fail" | "partial" = "fail";
    let notes = "";

    try {
      await runSteps({
        page,
        userFlow: "Vote on a Rallly poll",
        steps: [
          {
            description: "Navigate to https://rallly.co",
          },
          {
            description:
              "Find and click a demo poll link or any publicly accessible poll",
            waitUntil: "A poll with date options is visible",
          },
          {
            description: "Enter a participant name in the name field",
            data: { value: "AI Tester" },
          },
          {
            description: "Select at least one date option by clicking it",
            waitUntil: "A date option shows as selected or highlighted",
          },
          {
            description: "Submit the vote or click the Save button",
            waitUntil: "A confirmation that the vote was recorded is visible",
          },
        ],
        assertions: [
          {
            assertion:
              "The vote was recorded — a confirmation message or updated results are visible",
          },
          {
            assertion:
              "The participant name 'AI Tester' appears in the responses or confirmation",
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

    test("Form validation — submit poll creation with missing fields", async ({
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
            description: "Click to create a new poll",
            waitUntil: "The poll creation form is visible",
          },
          {
            description:
              "Leave the title field empty and try to continue to the next step",
          },
        ],
        assertions: [
          {
            assertion:
              "An error or validation message appears — the form does not allow proceeding without a title",
          },
          {
            assertion:
              "The user remains on the first step of poll creation — they were not advanced forward",
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
