import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Logo from "@/components/Logo";
import NavLink from "@/components/NavLink";
import Footer from "@/components/Footer";
import { getTool, getTools } from "@/lib/tools.server";
import { finalScore, labelForCategory, SCORE_CRITERIA } from "@/lib/tools";

// Every tool is a file in the repo, so all slugs are known at build time.
export function generateStaticParams() {
  return getTools().map((t) => ({ slug: t.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const tool = getTool(params.slug);
  if (!tool) return { title: "AI Tools — AI Tech Helper" };
  return {
    title: `${tool.name} — AI Tools — AI Tech Helper`,
    description: tool.excerpt,
  };
}

export default function ToolPage({ params }: { params: { slug: string } }) {
  const tool = getTool(params.slug);
  if (!tool) notFound();

  const score = tool.scores ? finalScore(tool.scores) : null;

  return (
    <div className="page hub">
      <nav className="nav">
        <Logo />
        <div className="nav-links">
          <a href="/#services">Services</a>
          <NavLink href="/ai-tools">AI Tools</NavLink>
          <NavLink href="/ai-hub">AI Hub</NavLink>
        </div>
        <a href="#" className="cta-pill">
          Contact Us
        </a>
      </nav>

      <div className="tool-page">
        <Link href="/ai-tools" className="tool-back">
          ‹ All tools
        </Link>

        <header className="tool-head">
          <div>
            <span className="eyebrow">AI Tools</span>
            <h1>{tool.name}</h1>
            <p className="tool-lede">{tool.excerpt}</p>
            <div className="tool-head-meta">
              {tool.pricing && <span className="tool-pricing">{tool.pricing}</span>}
              {tool.categories.slice(0, 3).map((c) => (
                <span key={c} className="tool-tag">
                  {labelForCategory(c)}
                </span>
              ))}
            </div>
            <a
              className="call-btn"
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit {tool.name} →
            </a>
          </div>

          {score !== null && (
            <div className="tool-score">
              <span className="tool-score-num">{score.toFixed(1)}</span>
              <span className="tool-score-out">out of 10</span>
            </div>
          )}
        </header>

        {tool.fullDescription && (
          <section className="tool-body">
            {tool.fullDescription.split(/\n\s*\n/).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </section>
        )}

        {tool.scores && (
          <section className="tool-section">
            <h2>How it scored</h2>
            <div className="tool-criteria">
              {SCORE_CRITERIA.map(({ key, whyKey, label }) => {
                const value = tool.scores![key] as number;
                return (
                  <div className="tool-criterion" key={key}>
                    <div className="tool-criterion-head">
                      <span>{label}</span>
                      <span className="tool-criterion-num">{value}/10</span>
                    </div>
                    {/* The bar is the score; the sentence is why it got it. */}
                    <div className="tool-bar">
                      <div className="tool-bar-fill" style={{ width: `${value * 10}%` }} />
                    </div>
                    <p>{tool.scores![whyKey] as string}</p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {(tool.pros?.length || tool.cons?.length) && (
          <section className="tool-section tool-verdict">
            {tool.pros?.length ? (
              <div>
                <h2>What&rsquo;s good</h2>
                <ul className="tool-pros">
                  {tool.pros.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {tool.cons?.length ? (
              <div>
                <h2>What isn&rsquo;t</h2>
                <ul className="tool-cons">
                  {tool.cons.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </section>
        )}
      </div>

      <Footer />
    </div>
  );
}
