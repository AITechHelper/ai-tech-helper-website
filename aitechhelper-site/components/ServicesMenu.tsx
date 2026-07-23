import { Icons, type IconName } from "@/components/TierIcons";
import { COMPARISON, TIERS, type Tier } from "@/lib/tiers";

const ROW_ICON: Record<string, IconName> = {
  bronze: "phone",
  silver: "message",
  gold: "star",
};

/** The badge shown on the tier we want the eye to land on first. */
const FEATURED: Tier["slug"] = "silver";

/**
 * What a tier adds over the one below it, taken from the comparison matrix:
 * a row belongs to the first tier that includes it. Derived rather than
 * duplicated so the packages can't drift apart from the matrix they came from.
 */
const addedBy = (slug: Tier["slug"]) =>
  COMPARISON.filter((row) => row.tiers[0] === slug).map((row) => row.label);

/**
 * The services menu — the card the ring rests on.
 *
 * Three branded package cards, one per tier. Each card is the carousel's
 * navigation: HeroCarousel delegates clicks by looking for
 * `.service-row[data-index]`, so the data-index values here drive which card
 * the ring spins to. Index 0 is the menu itself, hence the +1.
 *
 * Rather than sitting beside a separate comparison matrix, each card carries
 * its own slice of it — what that tier adds — plus an explicit "everything in
 * the tier below" line, so the ladder reads down the page instead of across a
 * grid of ticks.
 */
export default function ServicesMenu() {
  return (
    <>
      <div className="menu-head">
        <div className="eyebrow">What we build</div>
        <h1>Our services</h1>
        <p className="menu-sub">
          Three packages, each one built on the last — start where your phone hurts most.
        </p>
      </div>

      <div className="tier-grid">
        {TIERS.map((tier, i) => (
          <button
            className={`service-row tier-card tier-card--${tier.slug}${
              tier.slug === FEATURED ? " is-featured" : ""
            }`}
            data-index={i + 1}
            key={tier.slug}
            type="button"
          >
            {/* Decorative light that sweeps across the metal on hover. */}
            <span className="tier-sheen" aria-hidden="true" />

            {tier.slug === FEATURED && <span className="tier-flag">Most popular</span>}

            <span className="tier-top">
              <span className="icon-badge">{Icons[ROW_ICON[tier.slug]]}</span>
              <span className="tier-rank">{String(i + 1).padStart(2, "0")}</span>
            </span>

            <span className="tier-name">{tier.name}</span>
            <span className="tier-kicker">{tier.cardKicker}</span>
            <span className="tier-desc">{tier.cardDesc}</span>

            <span className="tier-includes">
              {tier.builds_on ? `Everything in ${tier.builds_on}, plus` : "Where it starts"}
            </span>

            <span className="tier-adds">
              {addedBy(tier.slug).map((label) => (
                <span className="tier-add" key={label}>
                  <svg className="tick" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  {label}
                </span>
              ))}
            </span>

            <span className="tier-cta">
              Explore {tier.name}
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </button>
        ))}
      </div>
    </>
  );
}
