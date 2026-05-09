import { test, expect } from "@playwright/test";
import { runSteps, configure } from "passmark";
import { logFlowScore } from "../../lib/logger";

test.describe("Hoppscotch — snapshot vs CUA API client flows", () => {
  test.setTimeout(300_000);

  test("Snapshot mode — send GET request", async ({ page }) => {
    const startMs = Date.now();
    let result: "pass" | "fail" | "partial" = "fail";
    let notes = "";

    try {
      await runSteps({
        page,
        userFlow: "Hoppscotch — GET request (snapshot)",
        steps: [
          { description: "Navigate to https://hoppscotch.io" },
          {
            description: "Wait for the Hoppscotch REST client interface to fully load",
            waitUntil: "The URL input field and Send button are visible",
          },
          {
            description:
              "Clear the URL field and enter the test URL",
            data: { value: "https://jsonplaceholder.typicode.com/todos/1" },
          },
          {
            description: "Make sure the HTTP method is set to GET",
          },
          {
            description: "Click the Send button to execute the request",
            waitUntil: "A response body or status code is visible in the response panel",
          },
        ],
        assertions: [
          {
            assertion:
              "A successful HTTP 200 status code is displayed in the response area",
          },
          {
            assertion:
              "The response body contains JSON with a 'userId', 'id', 'title', and 'completed' fields — the GET request returned the expected todo item",
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
        siteId: "hoppscotch",
        siteName: "Hoppscotch",
        flow: "snapshot-get-request",
        result,
        notes,
        durationMs: Date.now() - startMs,
        timestamp: new Date().toISOString(),
      });
    }
  });

  test("CUA mode — send GET request", async ({ page }) => {
    const startMs = Date.now();
    let result: "pass" | "fail" | "partial" = "fail";
    let notes = "";

    try {
      await runSteps({
        page,
        userFlow: "Hoppscotch — GET request (CUA)",
        ai: { mode: "cua", gateway: "none" },
        steps: [
          { description: "Navigate to https://hoppscotch.io" },
          {
            description: "Wait for the Hoppscotch interface to fully load",
            waitUntil: "The URL input and Send button are visible",
          },
          {
            description:
              "Click on the URL input field and type the test API URL",
            data: { value: "https://jsonplaceholder.typicode.com/todos/1" },
          },
          {
            description: "Ensure the method selector shows GET, then click Send",
            waitUntil: "Response is visible in the response panel",
          },
        ],
        assertions: [
          {
            assertion:
              "HTTP 200 status is shown in the response panel",
          },
          {
            assertion:
              "The response body shows JSON with 'userId', 'id', 'title', and 'completed' keys",
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
        siteId: "hoppscotch",
        siteName: "Hoppscotch",
        flow: "cua-get-request",
        result,
        notes,
        durationMs: Date.now() - startMs,
        timestamp: new Date().toISOString(),
      });
    }
  });

  test("Snapshot mode — send POST request", async ({ page }) => {
    const startMs = Date.now();
    let result: "pass" | "fail" | "partial" = "fail";
    let notes = "";

    try {
      await runSteps({
        page,
        userFlow: "Hoppscotch — POST request (snapshot)",
        steps: [
          { description: "Navigate to https://hoppscotch.io" },
          {
            description: "Wait for the REST client interface to fully load",
            waitUntil: "The URL input field and Send button are visible",
          },
          {
            description: "Click the HTTP method selector and choose POST",
            waitUntil: "The method selector shows POST",
          },
          {
            description: "Click the URL input field and type the endpoint URL",
            data: { value: "https://jsonplaceholder.typicode.com/posts" },
          },
          {
            description: "Click the Send button to execute the POST request",
            waitUntil: "A response status code is visible in the response panel",
          },
        ],
        assertions: [
          {
            assertion:
              "A response status code is visible in the response panel — the request was sent successfully",
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
        siteId: "hoppscotch",
        siteName: "Hoppscotch",
        flow: "snapshot-post-request",
        result,
        notes,
        durationMs: Date.now() - startMs,
        timestamp: new Date().toISOString(),
      });
    }
  });

  test("CUA mode — send POST request", async ({ page }) => {
    const startMs = Date.now();
    let result: "pass" | "fail" | "partial" = "fail";
    let notes = "";

    try {
      await runSteps({
        page,
        userFlow: "Hoppscotch — POST request (CUA)",
        ai: { mode: "cua", gateway: "none" },
        steps: [
          { description: "Navigate to https://hoppscotch.io" },
          {
            description: "Wait for the interface to load fully",
            waitUntil: "URL input and method selector are visible",
          },
          {
            description: "Click the method dropdown and select POST",
            waitUntil: "Method shows POST",
          },
          {
            description: "Click the URL input and type the endpoint",
            data: { value: "https://jsonplaceholder.typicode.com/posts" },
          },
          {
            description: "Click the Body tab and select JSON body type, then type the request body",
            data: {
              value: '{"title":"WebMark test","body":"AI regression testing","userId":1}',
            },
          },
          {
            description: "Click Send and wait for the response",
            waitUntil: "Response status and body are visible",
          },
        ],
        assertions: [
          {
            assertion: "Status 201 is shown in the response panel",
          },
          {
            assertion:
              "The response JSON contains an 'id' field confirming the resource was created",
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
        siteId: "hoppscotch",
        siteName: "Hoppscotch",
        flow: "cua-post-request",
        result,
        notes,
        durationMs: Date.now() - startMs,
        timestamp: new Date().toISOString(),
      });
    }
  });
});
