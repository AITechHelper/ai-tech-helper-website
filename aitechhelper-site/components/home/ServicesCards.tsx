import Link from "next/link";
import { TIERS, type Tier } from "@/lib/tiers";

const FEATURED: Tier["slug"] = "silver";

function Check() {
  return (
    <svg className="pkg-check" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

/* The three packages shown side by side (Bronze / Silver / Gold), Silver
   featured. Static grid — replaces the rotating carousel — so all three are
   visible at once. Each card links through to its full tier page.
   NB: classes are prefixed `pkg-` (not `svc-`) to avoid colliding with the
   retired carousel's `.svc-card` rules still in globals.css. */
export default function ServicesCards() {
  return (
    <div className="pkg-grid">
      {TIERS.map((tier) => {
        const featured = tier.slug === FEATURED;
        return (
          <article
            key={tier.slug}
            className={`pkg-card tier-card--${tier.slug}${featured ? " pkg-featured" : ""}`}
          >
            {featured && <span className="pkg-badge">Most popular</span>}
            <span className="pkg-kicker">{tier.cardKicker}</span>
            <h3 className="pkg-name">{tier.name}</h3>
            <p className="pkg-desc">{tier.cardDesc}</p>
            <ul className="pkg-features">
              {tier.features.map((f) => (
                <li key={f.title}>
                  <Check />
                  {f.title}
                </li>
              ))}
            </ul>
            <Link href={`/${tier.slug}`} className="pkg-cta">
              See {tier.name}
              <span aria-hidden="true"> →</span>
            </Link>
          </article>
        );
      })}
    </div>
  );
}
