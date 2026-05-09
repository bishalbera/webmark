import { chromium } from "@playwright/test";
import path from "path";

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  // Navigate to the Acme Circles T-Shirt product page
  await page.goto("https://demo.vercel.store/product/acme-geometric-circles-t-shirt");
  await page.waitForLoadState("networkidle");

  // Scroll so the product price ($20) is visible at the top
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1000);

  // Select a color and size so the Add to Cart button becomes enabled
  await page.locator('button:has-text("Black")').first().click();
  await page.waitForTimeout(500);
  await page.locator('button:has-text("S")').first().click();
  await page.waitForTimeout(500);

  // Click Add to Cart to open the cart drawer showing $15
  const addToCart = page.locator('button:has-text("Add To Cart")').first();
  await addToCart.click();

  // Wait for cart drawer to appear
  await page.waitForSelector('text=$15.00', { timeout: 10000 });
  await page.waitForTimeout(1500);

  // Take the screenshot — product page ($20) left, cart drawer ($15) right
  const outPath = path.resolve(__dirname, "../assets/pricing-bug-both.png");
  await page.screenshot({ path: outPath, fullPage: false });
  console.log(`Screenshot saved: ${outPath}`);

  await browser.close();
})();
