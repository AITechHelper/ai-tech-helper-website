import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate, getPost, getPosts, readingTime } from "@/lib/wp";

// Pre-render the issues we know about at build time; let any newer slug render
// on first request and then cache (see revalidate in lib/wp).
export const dynamicParams = true;

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: "The AI Hub — AI Tech Helper" };
  return {
    title: `${post.title} — The AI Hub`,
    description: post.excerpt,
    openGraph: post.image ? { images: [{ url: post.image }] } : undefined,
  };
}

export default async function AiHubPost({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  return (
    <div className="page hub">
      <nav className="nav">
        <div className="logo">
          <div className="logo-mark">AI</div>TECH <span className="dim">HELPER</span>
        </div>
        <div className="nav-links">
          <a href="/#stage">Agents</a>
          <a href="/#stage">Automations</a>
          <Link href="/ai-hub">AI Hub</Link>
        </div>
        <a href="#" className="cta-pill">
          Contact Us
        </a>
      </nav>

      <article className="article">
        <div className="article-head">
          <Link href="/ai-hub" className="page-back">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            All issues
          </Link>

          <span className="eyebrow">The AI Hub Weekly</span>
          <h1>{post.title}</h1>
          <div className="article-meta">
            <time>{formatDate(post.date)}</time>
            <span className="dot" />
            <span>{readingTime(post.contentHtml)} min read</span>
          </div>
        </div>

        {post.image && (
          <div className="article-hero">
            <img src={post.image} alt={post.imageAlt} />
          </div>
        )}

        <div
          className="aihub-article"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        <div className="article-foot">
          <p>Want this in your inbox every Monday?</p>
          <a href="tel:+15722204756" className="call-btn">
            Talk to AI Tech Helper
          </a>
        </div>
      </article>
    </div>
  );
}
