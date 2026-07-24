/**
 * Reads the tool files. Server only — content/ai-tools/*.json is baked in at
 * build time, so this must not be pulled into the client bundle. The types and
 * the category logic live in lib/tools.ts, which the directory component
 * imports instead.
 */

import fs from "node:fs";
import path from "node:path";
import type { Tool } from "@/lib/tools";

const CONTENT_DIR = path.join(process.cwd(), "content", "ai-tools");

export function getTool(slug: string): Tool | null {
  const file = path.join(CONTENT_DIR, `${slug}.json`);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf8")) as Tool;
}

export function getTools(): Tool[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, f), "utf8")) as Tool)
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || a.name.localeCompare(b.name));
}
