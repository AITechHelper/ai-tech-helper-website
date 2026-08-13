import Link from "next/link";
import { TIERS, type Tier } from "@/lib/tiers";

const FEATURED: Tier["slug"] = "silver";

function Check() {
  return (
    <svg className="svc-check" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

/* The three packages shown side by side (Bronze / Silver / Gold), Silver
   featured. Static grid — replaces the rotating carousel — so all three are
   visible at once. Each card links through to its full tier page. */
export default function ServicesCards() {
  return (
    <div className="svc-cards">
      {TIERS.map((tier) => {
        const featured = tier.slug === FEATURED;
        return (
          <article
            key={tier.slug}
            className={`svc-card tier-card--${tier.slug}${featured ? " is-featured" : ""}`}
          >
            {featured && <span className="svc-badge">Most popular</span>}
            <span className="svc-kicker">{tier.cardKicker}</span>
            <h3 className="svc-name">{tier.name}</h3>
            <p className="svc-desc">{tier.cardDesc}</p>
            <ul className="svc-features">
              {tier.features.map((f) => (
                <li key={f.title}>
                  <Check />
                  {f.title}
                </li>
              ))}
            </ul>
            <Link href={`/${tier.slug}`} className="svc-cta">
              See {tier.name}
              <span aria-hidden="true"> →</span>
            </Link>
          </article>
        );
      })}
    </div>
  );
}
