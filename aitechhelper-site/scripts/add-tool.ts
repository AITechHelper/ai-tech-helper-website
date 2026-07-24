/**
 * Researches an AI tool, rates it, and writes it into content/ai-tools/.
 *
 * This is the WordPress generator rebuilt. The old one lived outside the repo
 * and POSTed finished posts into the `ai-tools` custom post type over the REST
 * API; when the WordPress site went away, so did the only copy of it. Here the
 * output is a JSON file you can read in the diff before it ever goes live —
 * the script writes, you review, git decides.
 *
 *   npm run add-tool -- "Notion AI"
 *   npm run add-tool -- "Notion AI" "Zapier" "Perplexity"
 *
 * Add --overwrite to re-research a tool that already has a file.
 *
 * Two passes per tool. The first searches the web and writes an assessment in
 * prose; the second turns that assessment into JSON against a schema. They are
 * split because search results arrive with citations attached, and citations
 * and structured outputs cannot be used on the same request.
 */

import fs from "node:fs";
import path from "node:path";
import Anthropic from "@anthropic-ai/sdk";
import {
  allCategorySlugs,
  finalScore,
  type Scores,
  type Tool,
} from "../lib/tools";

const CONTENT_DIR = path.join(process.cwd(), "content", "ai-tools");
const MODEL = "claude-opus-4-8";

const RATING_SCALE = `Rate the tool on four criteria, each an integer from 1 to 10:

- ease_of_use: how quickly a non-technical small-business owner gets to a
  result. Setup time, clarity of the interface, how much it assumes you know.
- output_quality: how good the thing it produces actually is, judged against
  what a competent human would produce.
- business_value: what it is worth to a small business specifically — hours
  saved, revenue captured, money not spent elsewhere — weighed against price.
- reliability: whether it does the same thing tomorrow. Uptime, consistency,
  how it fails, how long the company has been around.

Score honestly and use the whole range. A 7 is a good tool. Reserve 9 and 10
for tools that are genuinely the best available at what they do, and be willing
to go below 5 when a tool deserves it — a directory where everything scores 8+
is worth nothing to the reader.`;

const AUDIENCE = `The audience is small-business owners in Oklahoma — trades,
home services, clinics, shops. They are not engineers. Write plainly, in the
second person where it helps, and stay concrete about what the tool does for a
business rather than what features it has.`;

/** The research pass: search the web, come back with an assessment. */
async function research(client: Anthropic, toolName: string): Promise<string> {
  const stream = client.messages.stream({
    model: MODEL,
    max_tokens: 8000,
    thinking: { type: "adaptive" },
    output_config: { effort: "high" },
    tools: [{ type: "web_search_20260209", name: "web_search", max_uses: 8 }],
    system: `You research AI tools for a directory that rates them for small businesses. ${AUDIENCE}`,
    messages: [
      {
        role: "user",
        content: `Research the AI tool "${toolName}" and write an assessment of it.

Search for its official site, current pricing, what it actually does, and what
real users say — including the complaints. Prefer the vendor's own site for
pricing and capabilities, and independent sources for the criticism.

Cover, in prose:
- Its official URL.
- What it does, in a sentence a busy person would understand.
- Current pricing, including whether there is a free tier.
- Three genuine strengths.
- Three real limitations. Not fake modesty — things that would actually make
  someone regret choosing it.
- Which kinds of work it is for (automation, marketing, content, data,
  support, productivity, coding, or some combination).

${RATING_SCALE}

Give each of the four scores and a sentence of reasoning for each. If the tool
does not appear to exist or you cannot find reliable information about it, say
so plainly instead of guessing.`,
      },
    ],
  });

  const message = await stream.finalMessage();
  if (message.stop_reason === "refusal") {
    throw new Error(`research declined for "${toolName}"`);
  }
  return message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n");
}

const SCHEMA = {
  type: "object",
  properties: {
    found: {
      type: "boolean",
      description: "False if the research could not confirm the tool exists.",
    },
    name: { type: "string", description: "The tool's proper name." },
    slug: {
      type: "string",
      description: "Lowercase, hyphenated, no spaces. e.g. notion-ai",
    },
    excerpt: {
      type: "string",
      description:
        "One sentence for the directory card — what it does for a business. No marketing language.",
    },
    url: { type: "string", description: "The tool's official site." },
    pricing: {
      type: "string",
      description: 'Short, e.g. "Free" or "Free — $50/mo" or "$20/user/mo".',
    },
    fullDescription: {
      type: "string",
      description:
        "Two or three paragraphs for the tool's own page. Plain text, blank line between paragraphs.",
    },
    pros: {
      type: "array",
      items: { type: "string" },
      description: "Exactly three genuine strengths, one sentence each.",
    },
    cons: {
      type: "array",
      items: { type: "string" },
      description: "Exactly three real limitations, one sentence each.",
    },
    categories: {
      type: "array",
      items: { type: "string", enum: allCategorySlugs() },
      description: "Two to five slugs from the list. Most specific ones first.",
    },
    easeOfUse: { type: "integer" },
    easeOfUseWhy: { type: "string" },
    outputQuality: { type: "integer" },
    outputQualityWhy: { type: "string" },
    businessValue: { type: "integer" },
    businessValueWhy: { type: "string" },
    reliability: { type: "integer" },
    reliabilityWhy: { type: "string" },
  },
  required: [
    "found",
    "name",
    "slug",
    "excerpt",
    "url",
    "pricing",
    "fullDescription",
    "pros",
    "cons",
    "categories",
    "easeOfUse",
    "easeOfUseWhy",
    "outputQuality",
    "outputQualityWhy",
    "businessValue",
    "businessValueWhy",
    "reliability",
    "reliabilityWhy",
  ],
  additionalProperties: false,
} as const;

type Extracted = {
  found: boolean;
  name: string;
  slug: string;
  excerpt: string;
  url: string;
  pricing: string;
  fullDescription: string;
  pros: string[];
  cons: string[];
  categories: string[];
} & Scores;

/** The extraction pass: same findings, now as JSON against the schema. */
async function extract(client: Anthropic, assessment: string): Promise<Extracted> {
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 8000,
    output_config: { format: { type: "json_schema", schema: SCHEMA } },
    messages: [
      {
        role: "user",
        content: `Turn this research into the structured record. Carry the scores
and reasoning over unchanged — do not re-rate the tool. Pick categories only
from the allowed list.

${AUDIENCE}

<research>
${assessment}
</research>`,
      },
    ],
  });

  const text = response.content.find((b) => b.type === "text");
  if (!text || text.type !== "text") throw new Error("no JSON came back");
  return JSON.parse(text.text) as Extracted;
}

async function addTool(client: Anthropic, toolName: string, overwrite: boolean) {
  process.stdout.write(`\n${toolName}\n  researching…`);
  const assessment = await research(client, toolName);

  process.stdout.write(" extracting…");
  const d = await extract(client, assessment);

  if (!d.found) {
    console.log(`\n  skipped — could not confirm this tool exists.`);
    return;
  }

  const file = path.join(CONTENT_DIR, `${d.slug}.json`);
  if (fs.existsSync(file) && !overwrite) {
    console.log(`\n  skipped — ${d.slug}.json already exists (use --overwrite).`);
    return;
  }

  const scores: Scores = {
    easeOfUse: d.easeOfUse,
    easeOfUseWhy: d.easeOfUseWhy,
    outputQuality: d.outputQuality,
    outputQualityWhy: d.outputQualityWhy,
    businessValue: d.businessValue,
    businessValueWhy: d.businessValueWhy,
    reliability: d.reliability,
    reliabilityWhy: d.reliabilityWhy,
  };

  const tool: Tool = {
    slug: d.slug,
    name: d.name,
    excerpt: d.excerpt,
    url: d.url,
    pricing: d.pricing,
    // The cards show five stars; the scale underneath is out of 10. Round to
    // the nearest half so a 8.5/10 renders as 4.5 rather than a jittery 4.25.
    rating: Math.round((finalScore(scores) / 2) * 2) / 2,
    image: null,
    categories: d.categories,
    fullDescription: d.fullDescription,
    pros: d.pros,
    cons: d.cons,
    scores,
  };

  fs.mkdirSync(CONTENT_DIR, { recursive: true });
  fs.writeFileSync(file, JSON.stringify(tool, null, 2) + "\n");
  console.log(
    `\n  wrote content/ai-tools/${d.slug}.json — ${finalScore(scores).toFixed(1)}/10`,
  );
}

async function main() {
  const args = process.argv.slice(2);
  const overwrite = args.includes("--overwrite");
  const names = args.filter((a) => !a.startsWith("--"));

  if (names.length === 0) {
    console.error('Usage: npm run add-tool -- "Tool Name" ["Another Tool" …]');
    process.exit(1);
  }

  const client = new Anthropic();

  let failed = 0;
  for (const name of names) {
    try {
      await addTool(client, name, overwrite);
    } catch (err) {
      failed++;
      console.error(`\n  failed: ${err instanceof Error ? err.message : err}`);
    }
  }

  console.log(
    `\nDone. Review the files, then commit and push to publish.${
      failed ? ` (${failed} failed)` : ""
    }`,
  );
  if (failed) process.exit(1);
}

main();
