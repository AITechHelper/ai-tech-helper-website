import type { Metadata } from "next";
import Link from "next/link";
import Logo from "@/components/Logo";
import NavLink from "@/components/NavLink";
import Footer from "@/components/Footer";
import { formatDate, getPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "The AI Hub — AI Tech Helper",
  description:
    "A weekly briefing on the AI news that actually matters — new tools, real launches, and what they mean, in plain English.",
};

export default function AiHubPage() {
  const posts = getPosts();
  const [featured, ...rest] = posts;

  return (
    <div className="page hub">
      <nav className="nav">
        <Logo />
        <div className="nav-links">
          <a href="/#services">Agents</a>
          <NavLink href="/ai-tools">AI Tools</NavLink>
          <NavLink href="/ai-hub">AI Hub</NavLink>
        </div>
        <a href="#" className="cta-pill">
          Contact Us
        </a>
      </nav>

      <header className="hub-head">
        <span className="eyebrow">The AI Hub</span>
        <h1>The week in AI, in plain English</h1>
        <p className="hub-sub">
          Every Monday we read the whole week of AI news so you don&rsquo;t have to — the real
          launches, what changed, and why it matters. No jargon, no hype.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="hub-empty">New issues are on the way — check back Monday.</p>
      ) : (
        <div className="hub-wrap">
          {featured && (
            <Link href={`/ai-hub/${featured.slug}`} className="hub-featured">
              <div className="hub-featured-media">
                {featured.image && <img src={featured.image} alt={featured.imageAlt} />}
                <span className="hub-badge">Latest issue</span>
              </div>
              <div className="hub-featured-body">
                <time>{formatDate(featured.date)}</time>
                <h2>{featured.title}</h2>
                <p>{featured.excerpt}</p>
                <span className="hub-read">Read this week&rsquo;s briefing →</span>
              </div>
            </Link>
          )}

          {rest.length > 0 && (
            <div className="hub-grid">
              {rest.map((post) => (
                <Link href={`/ai-hub/${post.slug}`} className="hub-card" key={post.slug}>
                  <div className="hub-card-media">
                    {post.image && <img src={post.image} alt={post.imageAlt} />}
                  </div>
                  <div className="hub-card-body">
                    <time>{formatDate(post.date)}</time>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      <Footer />
    </div>
  );
}
