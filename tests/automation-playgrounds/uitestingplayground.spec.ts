import { test, expect } from "@playwright/test";
import { runSteps, configure } from "passmark";
import { logFlowScore } from "../../lib/logger";

const BASE_URL = "https://uitestingplayground.com";

test.describe("UI Testing Playground — snapshot vs CUA head-to-head", () => {
  test.setTimeout(180_000);

  test("Snapshot mode — dynamic ID button click", async ({ page }) => {
    const startMs = Date.now();
    let result: "pass" | "fail" | "partial" = "fail";
    let notes = "";

    try {
      await runSteps({
        page,
        userFlow: "UITP — dynamic ID (snapshot)",
        steps: [
          { description: `Navigate to ${BASE_URL}/dynamicid` },
          {
            description:
              "Click the blue 'Button with Dynamic ID' button on the page",
          },
        ],
        failAssertionsSilently: true,
        assertions: [
          {
            assertion:
              "The page did not navigate away from uitestingplayground.com — no error page is shown",
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
        siteId: "uitestingplayground",
        siteName: "UI Testing Playground",
        flow: "snapshot-dynamic-id",
        result,
        notes,
        durationMs: Date.now() - startMs,
        timestamp: new Date().toISOString(),
      });
    }
  });

  test("CUA mode — dynamic ID button click", async ({ page }) => {
    const startMs = Date.now();
    let result: "pass" | "fail" | "partial" = "fail";
    let notes = "";

    try {
      await runSteps({
        page,
        userFlow: "UITP — dynamic ID (CUA)",
        ai: { mode: "cua", gateway: "none" },
        steps: [
          { description: `Navigate to ${BASE_URL}/dynamicid` },
          {
            description:
              "Click the blue 'Button with Dynamic ID' button on the page",
            waitUntil: "The button has been clicked",
          },
        ],
        assertions: [
          {
            assertion:
              "The page is visible and stable — a blue button labelled 'Button with Dynamic ID' is present and the page has not crashed",
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
      configure({ ai: { gateway: "openrouter" } });
      logFlowScore({
        siteId: "uitestingplayground",
        siteName: "UI Testing Playground",
        flow: "cua-dynamic-id",
        result,
        notes,
        durationMs: Date.now() - startMs,
        timestamp: new Date().toISOString(),
      });
    }
  });

  test("Snapshot mode — AJAX load wait", async ({ page }) => {
    const startMs = Date.now();
    let result: "pass" | "fail" | "partial" = "fail";
    let notes = "";

    try {
      await runSteps({
        page,
        userFlow: "UITP — AJAX load (snapshot)",
        steps: [
          { description: `Navigate to ${BASE_URL}/ajax` },
          {
            description: "Click the 'Button Triggering AJAX Request' button",
            waitUntil:
              "A green success message or alert appears after a delay (the AJAX request completed)",
          },
        ],
        failAssertionsSilently: true,
        assertions: [
          {
            assertion:
              "A green success label or message is displayed on the page indicating the AJAX request completed successfully",
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
        siteId: "uitestingplayground",
        siteName: "UI Testing Playground",
        flow: "snapshot-ajax-load",
        result,
        notes,
        durationMs: Date.now() - startMs,
        timestamp: new Date().toISOString(),
      });
    }
  });

  test("CUA mode — AJAX load wait", async ({ page }) => {
    const startMs = Date.now();
    let result: "pass" | "fail" | "partial" = "fail";
    let notes = "";

    try {
      await runSteps({
        page,
        userFlow: "UITP — AJAX load (CUA)",
        ai: { mode: "cua", gateway: "none" },
        steps: [
          { description: `Navigate to ${BASE_URL}/ajax` },
          {
            description: "Click the 'Button Triggering AJAX Request' button",
            waitUntil:
              "A green success message or alert appears after a delay",
          },
        ],
        assertions: [
          {
            assertion:
              "A green success label or message is displayed on the page",
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
      configure({ ai: { gateway: "openrouter" } });
      logFlowScore({
        siteId: "uitestingplayground",
        siteName: "UI Testing Playground",
        flow: "cua-ajax-load",
        result,
        notes,
        durationMs: Date.now() - startMs,
        timestamp: new Date().toISOString(),
      });
    }
  });

  test("Snapshot mode — overlapping elements", async ({ page }) => {
    const startMs = Date.now();
    let result: "pass" | "fail" | "partial" = "fail";
    let notes = "";

    try {
      await runSteps({
        page,
        userFlow: "UITP — overlapping elements (snapshot)",
        steps: [
          { description: `Navigate to ${BASE_URL}/overlappedelement` },
          {
            description:
              "Click on the 'Button Covered by Another Element' that is partially hidden under an overlay",
          },
        ],
        failAssertionsSilently: true,
        assertions: [
          {
            assertion:
              "The overlapping/covered button was clicked — the page did not throw an error about the element not being clickable",
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
        siteId: "uitestingplayground",
        siteName: "UI Testing Playground",
        flow: "snapshot-overlapping",
        result,
        notes,
        durationMs: Date.now() - startMs,
        timestamp: new Date().toISOString(),
      });
    }
  });

  test("CUA mode — overlapping elements", async ({ page }) => {
    const startMs = Date.now();
    let result: "pass" | "fail" | "partial" = "fail";
    let notes = "";

    try {
      await runSteps({
        page,
        userFlow: "UITP — overlapping elements (CUA)",
        ai: { mode: "cua", gateway: "none" },
        steps: [
          { description: `Navigate to ${BASE_URL}/overlappedelement` },
          {
            description:
              "Click on the button that is covered or overlapped by another element",
          },
        ],
        assertions: [
          {
            assertion:
              "The button under the overlay was interacted with — no unclickable-element error is shown",
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
      configure({ ai: { gateway: "openrouter" } });
      logFlowScore({
        siteId: "uitestingplayground",
        siteName: "UI Testing Playground",
        flow: "cua-overlapping",
        result,
        notes,
        durationMs: Date.now() - startMs,
        timestamp: new Date().toISOString(),
      });
    }
  });
});
