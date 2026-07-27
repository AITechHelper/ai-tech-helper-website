import Link from "next/link";
import ImgSlot from "@/components/home/ImgSlot";
import { Icons, type IconName } from "@/components/TierIcons";
import { TIERS, type Tier } from "@/lib/tiers";

const ROW_ICON: Record<string, IconName> = {
  bronze: "phone",
  silver: "message",
  gold: "star",
};
const FEATURED: Tier["slug"] = "silver";

/* The services section: the three packages, each built on the last, pulled
   straight from lib/tiers so the homepage can't drift from the package pages.
   A dashboard image slot sits above it (drop a screenshot at
   /public/images/dashboard.png — see /public/images/README.md). */
export default function Services() {
  return (
    <section className="home-section home-services" id="services">
      <div className="home-section-head">
        <span className="home-kicker">What we build</span>
        <h2>One system that runs the front office</h2>
        <p>
          Three packages, each one built on the last — start where your phone hurts
          most and grow into the rest when you&apos;re ready.
        </p>
      </div>

      <figure className="home-shot">
        <ImgSlot
          src="/images/dashboard.png"
          alt="The AI Tech Helper dashboard showing calls, messages and bookings"
          label="Add your dashboard screenshot at /public/images/dashboard.png"
        />
        <figcaption>Every call, message, booking and invoice in one dashboard.</figcaption>
      </figure>

      <div className="home-tier-grid">
        {TIERS.map((tier, i) => (
          <article
            className={`home-tier${tier.slug === FEATURED ? " is-featured" : ""}`}
            key={tier.slug}
          >
            {tier.slug === FEATURED && <span className="home-tier-flag">Most popular</span>}

            <div className="home-tier-top">
              <span className="icon-badge">{Icons[ROW_ICON[tier.slug]]}</span>
              <span className="home-tier-rank">{String(i + 1).padStart(2, "0")}</span>
            </div>

            <h3>{tier.name}</h3>
            <span className="home-tier-kicker">{tier.cardKicker}</span>
            <p className="home-tier-desc">{tier.cardDesc}</p>

            <span className="home-tier-includes">
              {tier.builds_on ? `Everything in ${tier.builds_on}, plus` : "Where it starts"}
            </span>
            <ul className="home-tier-features">
              {tier.features.map((f) => (
                <li key={f.title}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  {f.title}
                </li>
              ))}
            </ul>

            <Link className="home-tier-cta" href={`/${tier.slug}`}>
              Explore {tier.name}
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
