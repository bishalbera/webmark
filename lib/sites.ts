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
    id: "rally",
    name: "Rally",
    url: "https://rally.co",
    category: "auth",
    description: "A simple way to schedule meetings and events.",
    flows: ["create-poll", "email-invite", "vote-on-poll"],
  },
];

export const getSite = (id: string): Site => {
  const site = SITES.find((s) => s.id === id);
  if (!site) {
    throw new Error(`Unknown site id: ${id}`);
  }
  return site;
};
