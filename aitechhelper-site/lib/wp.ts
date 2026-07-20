/**
 * Reads the AI Hub newsletter from WordPress.
 *
 * The weekly post is authored entirely by the generator in the `the-ai-hub`
 * repo, which runs on a GitHub Action every Monday and publishes to
 * aitechhelper.com. This site never writes — it reads the public REST API and
 * renders each issue in its own design. New posts therefore appear here
 * automatically (see the revalidate window below); no deploy required.
 */

const WP = "https://aitechhelper.com/wp-json/wp/v2";

// The category every weekly briefing is filed under ("AI Tools"). Stable id.
const CATEGORY_AI_HUB = 1381;

// How long a fetched page may be served before Next refetches. An hour means a
// Monday-morning post is live within the hour without a rebuild, while normal
// traffic is served from cache.
const REVALIDATE_SECONDS = 3600;

export type Post = {
  id: number;
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  contentHtml: string;
  image: string | null;
  imageAlt: string;
};

type WpMedia = { source_url?: string; alt_text?: string };
type WpPost = {
  id: number;
  slug: string;
  date: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  _embedded?: { "wp:featuredmedia"?: WpMedia[] };
};

function stripTags(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/\[&hellip;\]|\[…\]/g, "…")
    .trim();
}

/** Decode the handful of HTML entities WordPress emits in titles/excerpts. */
function decode(s: string): string {
  return s
    .replace(/&#8217;|&#8216;/g, "’")
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&#038;|&amp;/g, "&")
    .replace(/&#8230;|&hellip;/g, "…")
    .replace(/&nbsp;/g, " ");
}

/**
 * The generator spaces its markup with empty paragraphs and horizontal rules
 * (it emits `</p><br>` etc. and WordPress wraps the result). Those are visual
 * hacks that fight a real stylesheet, so strip them and let CSS own spacing.
 * Also unwrap the redundant <b> inside each story's <h3>.
 */
function cleanContent(html: string): string {
  return html
    .replace(/<p>\s*(?:&nbsp;|\s)*<\/p>/gi, "")
    .replace(/<hr\s*\/?>/gi, "")
    .replace(/<h3>\s*<b>([\s\S]*?)<\/b>\s*<\/h3>/gi, "<h3>$1</h3>")
    .replace(/<br\s*\/?>\s*<br\s*\/?>/gi, "")
    .trim();
}

function toPost(p: WpPost): Post {
  const media = p._embedded?.["wp:featuredmedia"]?.[0];
  return {
    id: p.id,
    slug: p.slug,
    title: decode(p.title.rendered),
    date: p.date,
    excerpt: decode(stripTags(p.excerpt.rendered)),
    contentHtml: cleanContent(p.content.rendered),
    image: media?.source_url ?? null,
    imageAlt: media?.alt_text ? decode(media.alt_text) : "",
  };
}

export async function getPosts(perPage = 24): Promise<Post[]> {
  const res = await fetch(
    `${WP}/posts?categories=${CATEGORY_AI_HUB}&per_page=${perPage}&_embed=1`,
    { next: { revalidate: REVALIDATE_SECONDS } }
  );
  if (!res.ok) return [];
  const data = (await res.json()) as WpPost[];
  return data.map(toPost);
}

export async function getPost(slug: string): Promise<Post | null> {
  const res = await fetch(`${WP}/posts?slug=${encodeURIComponent(slug)}&_embed=1`, {
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!res.ok) return null;
  const data = (await res.json()) as WpPost[];
  return data.length ? toPost(data[0]) : null;
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
  const words = stripTags(html).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
