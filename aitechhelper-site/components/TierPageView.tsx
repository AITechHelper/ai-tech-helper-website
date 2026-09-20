import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { Icons } from "@/components/TierIcons";
import TierVisual from "@/components/TierVisual";
import { PHONE_DISPLAY, PHONE_NUMBER, type Tier } from "@/lib/tiers";

/**
 * The full body of a tier page (/bronze, /silver, /gold).
 *
 * Horizontal bands: a hero with the headline, price and call-to-action, then the
 * capabilities, then the dashboard. Gold shows the live call phone (voice is the
 * point there); Bronze and Silver show a messaging thread.
 *
 * `interactive` is false for any scaled-down preview render, it drops the phone's
 * handlers and element ids so a copy can't hijack a tap.
 */
export default function TierPageView({
  tier,
  interactive = true,
}: {
  tier: Tier;
  interactive?: boolean;
}) {
  const isGold = tier.slug === "gold";

  return (
    /* The tier modifier carries the metal accent tokens (--m1/--m2/--glow),
       so everything inside inherits the colour of the tier being read. */
    <div className={`page page--${tier.slug}`}>
      <SiteHeader />

      <section className="tier-hero">
        <div className="tier-hero-copy">
          <a href="/services" className="page-back">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Back to services
          </a>

          <span className="eyebrow">{tier.eyebrow}</span>
          <h1>{tier.headline}</h1>
          <p className="subtext-page">{tier.subtext}</p>

          <p className="tier-price">
            <span className="tier-price-setup">${tier.price.setup} setup</span>
            <span className="tier-price-mo">${tier.price.monthly}/mo</span>
          </p>

          <div className="cta-block">
            <a href="/contact" className="call-btn">
              {Icons.calendar}
              Book a call
            </a>
            {isGold && (
              <a
                href={`tel:${PHONE_NUMBER}`}
                className="tier-demo-link"
                {...(interactive ? { "data-start-call": "true" } : {})}
              >
                {Icons.phone}
                Or call the live demo, {PHONE_DISPLAY}
              </a>
            )}
            <p className="cta-note">
              Talk to us about {tier.name}, no pressure, we&rsquo;ll tell you if it&rsquo;s not a
              fit.
            </p>
          </div>
        </div>

        <div className="tier-hero-visual">
          <TierVisual tier={tier} interactive={interactive} />
        </div>
      </section>

      <section className="tier-band">
        <h2 className="band-label">
          {tier.builds_on ? `What ${tier.name} adds` : `What ${tier.name} does`}
        </h2>
        <div className="features">
          {tier.features.map((f) => (
            <div className="feature" key={f.title}>
              <div className="icon-badge">{Icons[f.icon]}</div>
              <h3>{f.title}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* The dashboard is on every tier, it's the platform the system runs on,
          not an upsell, so this band is identical across all three and only its
          module list grows. */}
      <section className="tier-band">
        <h2 className="band-label">Your dashboard, included</h2>
        <div className="dash-chips">
          {tier.dashboard.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
      </section>

      {/* No dead ends: a way back to compare, plus a trust nudge to the About
          page for anyone new to AI systems. */}
      {interactive && (
        <section className="tier-foot">
          <a href="/services" className="tier-foot-link">
            Not sure this is your fit? Compare every plan
            <span aria-hidden="true"> →</span>
          </a>
          <a href="/about" className="tier-foot-link">
            New to AI systems? Meet the person behind AI Tech Helper
            <span aria-hidden="true"> →</span>
          </a>
        </section>
      )}

      {interactive && <Footer />}
    </div>
  );
}
