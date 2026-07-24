/**
 * The AI Tools directory.
 *
 * Ported from the WordPress build, where each tool was an `ai-tools` post and
 * its categories were a `tool-category` taxonomy. There, a PHP filter stamped
 * `tool-category-{slug}` onto every Elementor loop item and a script read those
 * classes back off the DOM to decide what to hide. None of that survives the
 * move: a tool is a JSON file, its categories are a field on it, and filtering
 * is React state over an array. Nothing is read out of the markup.
 *
 * Same arrangement as the AI Hub — content/ai-tools/*.json, baked in at build
 * time, git as the CMS. Reading those files is lib/tools.server.ts; everything
 * here is safe to import from the client.
 */

export type Tool = {
  slug: string;
  name: string;
  /** One line for the card. */
  excerpt: string;
  /** The tool's own site. */
  url: string;
  /** Free-text, e.g. "Free" or "Free — $50/mo". */
  pricing?: string;
  /** Out of 5, in halves. Omit for tools that have not been rated yet. */
  rating?: number;
  image?: string | null;
  /** Taxonomy slugs — the specific ones, e.g. "workflow-automation". */
  categories: string[];
  /** A few paragraphs for the tool's own page. */
  fullDescription?: string;
  pros?: string[];
  cons?: string[];
  /** The four-criteria score, each out of 10, with the reasoning behind each. */
  scores?: Scores;
};

/**
 * The rating scale, carried over from the WordPress build so old and new
 * reviews stay comparable. Four criteria out of 10; `rating` on the Tool is
 * their average put on the five-star scale the cards use.
 */
export type Scores = {
  easeOfUse: number;
  easeOfUseWhy: string;
  outputQuality: number;
  outputQualityWhy: string;
  businessValue: number;
  businessValueWhy: string;
  reliability: number;
  reliabilityWhy: string;
};

export const SCORE_CRITERIA: { key: keyof Scores; whyKey: keyof Scores; label: string }[] = [
  { key: "easeOfUse", whyKey: "easeOfUseWhy", label: "Ease of use" },
  { key: "outputQuality", whyKey: "outputQualityWhy", label: "Output quality" },
  { key: "businessValue", whyKey: "businessValueWhy", label: "Business value" },
  { key: "reliability", whyKey: "reliabilityWhy", label: "Reliability" },
];

/** The average of the four criteria, out of 10. */
export function finalScore(s: Scores): number {
  return (s.easeOfUse + s.outputQuality + s.businessValue + s.reliability) / 4;
}

/** Every taxonomy slug a tool may carry — the groups plus everything under them. */
export function allCategorySlugs(): string[] {
  const out = new Set<string>();
  for (const g of CATEGORY_GROUPS) {
    out.add(g.slug);
    for (const c of g.children) out.add(c);
  }
  return [...out];
}

/**
 * The filter bar. A tool is matched by a group if it carries the group's own
 * slug or any of the narrower slugs beneath it, which is what lets one button
 * gather up tools tagged a dozen different ways.
 *
 * Carried over unchanged from the old site's categoryMap so existing tool
 * taxonomy still lines up. `document-management` sits under two groups on
 * purpose — it belongs to both.
 */
export const CATEGORY_GROUPS: { slug: string; label: string; children: string[] }[] = [
  {
    slug: "automation",
    label: "Automation",
    children: [
      "workflow-automation",
      "ai-agents",
      "task-automation",
      "process-automation",
      "rpa-robotic-process-automation",
    ],
  },
  {
    slug: "marketing-sales",
    label: "Marketing & Sales",
    children: [
      "seo",
      "ads-campaigns",
      "email-marketing",
      "social-media",
      "lead-generation",
      "crm-sales-tools",
      "copywriting",
    ],
  },
  {
    slug: "content-creation",
    label: "Content Creation",
    children: [
      "image-generation",
      "video-generation",
      "audio-generation",
      "writing-blogging",
      "graphic-design",
      "presentation-tools",
      "document-management",
    ],
  },
  {
    slug: "data-analytics",
    label: "Data & Analytics",
    children: [
      "data-visualization",
      "predictive-analytics",
      "business-intelligence",
      "data-cleaning",
      "data-extraction",
      "research-tools",
      "data-analysis",
      "reporting",
    ],
  },
  {
    slug: "customer-support",
    label: "Customer Support",
    children: [
      "chatbots",
      "ai-assistants",
      "help-desk-automation",
      "voice-support",
      "ticketing-systems",
    ],
  },
  {
    slug: "productivity",
    label: "Productivity",
    children: [
      "note-taking",
      "task-management",
      "scheduling",
      "document-management",
      "personal-assistants",
    ],
  },
  {
    slug: "coding",
    label: "Coding",
    children: [
      "code-generation",
      "code-review",
      "debugging-tools",
      "api-tools",
      "devops-automation",
      "no-code-low-code",
      "debugging",
    ],
  },
];

/** Does this tool belong under the given filter button? */
export function matchesGroup(tool: Tool, groupSlug: string): boolean {
  if (groupSlug === "all") return true;
  if (tool.categories.includes(groupSlug)) return true;
  const group = CATEGORY_GROUPS.find((g) => g.slug === groupSlug);
  return !!group && group.children.some((child) => tool.categories.includes(child));
}

/** Turns "workflow-automation" back into "Workflow Automation" for the card. */
export function labelForCategory(slug: string): string {
  const group = CATEGORY_GROUPS.find((g) => g.slug === slug);
  if (group) return group.label;
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
