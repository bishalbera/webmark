export type Category = "auth" | "ecommerce" | "automation" | "forms";
export type FlowResult = "pass" | "fail" | "partial" | "skip";

export interface Site {
  id: string;
  name: string;
  url: string;
  category: Category;
  description: string;
  flows: string[];
}

export const SITES: Site[] = [
  {
    id: "vercel-store",
    name: "Vercel Commerce",
    url: "https://demo.vercel.store",
    category: "ecommerce",
    description: "Next.js e-commerce demo by Vercel.",
    flows: ["browse-add-to-cart", "cart-global-state", "pricing-accuracy"],
  },
  {
    id: "rallly",
    name: "Rallly",
    url: "https://rallly.co",
    category: "auth",
    description: "Open-source scheduling tool for group polls.",
    flows: ["create-poll", "vote-on-poll", "form-validation"],
  },
  {
    id: "devto",
    name: "DEV Community",
    url: "https://dev.to",
    category: "auth",
    description: "Developer community platform with magic-link auth.",
    flows: ["browse-feed", "search", "signup-email-otp"],
  },
  {
    id: "saucedemo",
    name: "Sauce Demo",
    url: "https://www.saucedemo.com",
    category: "ecommerce",
    description: "Sauce Labs demo store for testing different user profiles.",
    flows: ["login-standard", "login-locked-out", "visual-user-bugs", "checkout-pricing"],
  },
  {
    id: "uitestingplayground",
    name: "UI Testing Playground",
    url: "https://uitestingplayground.com",
    category: "automation",
    description: "Playground for testing dynamic IDs, AJAX, overlapping elements.",
    flows: ["snapshot-dynamic-id", "cua-dynamic-id", "snapshot-ajax-load", "cua-ajax-load", "snapshot-overlapping", "cua-overlapping"],
  },
  {
    id: "hoppscotch",
    name: "Hoppscotch",
    url: "https://hoppscotch.io",
    category: "automation",
    description: "Open-source API testing platform with complex React UI.",
    flows: ["snapshot-get-request", "cua-get-request", "snapshot-post-request", "cua-post-request"],
  },
];

export const getSite = (id: string): Site => {
  const site = SITES.find((s) => s.id === id);
  if (!site) {
    throw new Error(`Unknown site id: ${id}`);
  }
  return site;
};
