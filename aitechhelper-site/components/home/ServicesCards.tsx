import Link from "next/link";
import { TIERS, CUSTOM, type Tier } from "@/lib/tiers";

const FEATURED: Tier["slug"] = "silver";

function Check() {
  return (
    <svg className="pkg-check" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

/* The plans shown side by side (Bronze / Silver / Gold, Silver featured), plus a
   Custom card that routes to booking a call. Static grid so all are visible at
   once. Each tier card links through to its full page. */
export default function ServicesCards() {
  return (
    <>
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
            <p className="pkg-price">
              <span className="pkg-price-setup">${tier.price.setup} setup</span>
              <span className="pkg-price-mo">${tier.price.monthly}/mo</span>
            </p>
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

    <div className="pkg-custom-wide">
      <div className="pkg-custom-copy">
        <span className="pkg-kicker">{CUSTOM.kicker}</span>
        <h3 className="pkg-name">{CUSTOM.name}</h3>
        <p className="pkg-desc">{CUSTOM.desc}</p>
        <ul className="pkg-custom-points">
          {CUSTOM.points.map((p) => (
            <li key={p}>
              <Check />
              {p}
            </li>
          ))}
        </ul>
      </div>
      <a href="/contact" className="pkg-cta pkg-custom-cta">
        Book a call
        <span aria-hidden="true"> →</span>
      </a>
    </div>
    </>
  );
}
