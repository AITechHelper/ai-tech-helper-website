"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CATEGORY_GROUPS, labelForCategory, matchesGroup, type Tool } from "@/lib/tools";

/* The old site filtered by walking the DOM — reading tool-category-* classes
   off each card and setting style.display. Here the list is just data, so the
   filter is a derived value: pick a group, type a query, and the grid is
   whatever survives. No polling for cards to exist, no hidden nodes left in
   the tree, and the count can never disagree with what is on screen. */

function Stars({ rating }: { rating: number }) {
  return (
    <span className="tool-stars" aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= Math.round(rating) ? "on" : ""}>
          ★
        </span>
      ))}
      <span className="tool-rating-num">{rating.toFixed(1)}</span>
    </span>
  );
}

export default function ToolsDirectory({ tools }: { tools: Tool[] }) {
  const [group, setGroup] = useState("all");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tools.filter((tool) => {
      if (!matchesGroup(tool, group)) return false;
      if (!q) return true;
      // The old version searched the card's heading only, so a tool whose
      // description was the only place the word appeared looked missing.
      return (
        tool.name.toLowerCase().includes(q) ||
        tool.excerpt.toLowerCase().includes(q) ||
        tool.categories.some((c) => labelForCategory(c).toLowerCase().includes(q))
      );
    });
  }, [tools, group, query]);

  const buttons = [{ slug: "all", label: "All" }, ...CATEGORY_GROUPS];

  return (
    <>
      <div className="tool-filter-bar">
        <div className="tool-search-wrap">
          <input
            type="text"
            className="tool-search"
            placeholder="Search AI Tools..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search AI tools"
          />
          <span className="tool-results-count" aria-live="polite">
            {visible.length} {visible.length === 1 ? "result" : "results"}
          </span>
        </div>

        <div className="tool-filters">
          {buttons.map((b) => (
            <button
              key={b.slug}
              type="button"
              className={`filter-btn${group === b.slug ? " active" : ""}`}
              aria-pressed={group === b.slug}
              onClick={() => setGroup(b.slug)}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="tool-empty">
          No tools found{query ? ` for “${query}”` : ""}.
        </p>
      ) : (
        <div className="tool-grid">
          {/* The card opens our review, not the vendor — the outbound link
              lives on the tool's own page, under the rating that earned it. */}
          {visible.map((tool) => (
            <Link key={tool.slug} className="tool-card" href={`/ai-tools/${tool.slug}`}>
              <div className="tool-card-top">
                {tool.image ? (
                  <img className="tool-logo" src={tool.image} alt="" />
                ) : (
                  <div className="tool-logo tool-logo--letter">{tool.name.charAt(0)}</div>
                )}
                {typeof tool.rating === "number" && <Stars rating={tool.rating} />}
              </div>

              <h3>{tool.name}</h3>
              <p>{tool.excerpt}</p>

              <div className="tool-card-foot">
                {tool.pricing && <span className="tool-pricing">{tool.pricing}</span>}
                <span className="tool-cats">
                  {tool.categories.slice(0, 2).map((c) => (
                    <span key={c} className="tool-tag">
                      {labelForCategory(c)}
                    </span>
                  ))}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
