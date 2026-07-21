/**
 * Reads the AI Hub newsletter from the repo itself.
 *
 * Each weekly issue is a JSON file in content/ai-hub/, with its featured image
 * in public/ai-hub/. Git is the CMS: the generator in the `the-ai-hub` repo
 * writes a new file and commits it, that push deploys, and the issue is live.
 * This replaced reading the WordPress REST API — nothing here touches the
 * network, so posts are baked in at build time.
 */

import fs from "node:fs";
import path from "node:path";

const CONTENT_DIR = path.join(process.cwd(), "content", "ai-hub");

export type Post = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  image: string | null;
  imageAlt: string;
  contentHtml: string;
};

function readAll(): Post[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, f), "utf8")) as Post)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export function getPosts(): Post[] {
  return readAll();
}

export function getPost(slug: string): Post | null {
  const file = path.join(CONTENT_DIR, `${slug}.json`);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf8")) as Post;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Rough reading time from the rendered content. */
export function readingTime(html: string): number {
  const words = html
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
