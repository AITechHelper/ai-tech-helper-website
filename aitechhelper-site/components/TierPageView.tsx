import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { Icons } from "@/components/TierIcons";
import TierVisual from "@/components/TierVisual";
import { PHONE_DISPLAY, PHONE_NUMBER, TIERS, type Tier, type TierFeature } from "@/lib/tiers";

function OrbitFeature({ f }: { f: TierFeature }) {
  return (
    <div className="tier-orbit-feat">
      <div className="icon-badge">{Icons[f.icon]}</div>
      <div className="tier-orbit-feat-text">
        <h3>{f.title}</h3>
        <p>{f.desc}</p>
      </div>
    </div>
  );
}

/**
 * A tier page (/bronze, /silver, /gold), built around the phone.
 *
 * The phone is the centerpiece: headline above it, the tier's capabilities
 * flanking it left and right, and the price + call-to-action below. Gold shows
 * the live call phone (voice is the point); Bronze and Silver show a messaging
 * thread.
 */
export default function TierPageView({
  tier,
  interactive = true,
}: {
  tier: Tier;
  interactive?: boolean;
}) {
  const isGold = tier.slug === "gold";
  const left = tier.features.slice(0, 2);
  const right = tier.features.slice(2, 4);
  const others = TIERS.filter((t) => t.slug !== tier.slug);

  return (
    /* The tier modifier carries the metal accent tokens (--m1/--m2/--glow). */
    <div className={`page page--${tier.slug}`}>
      <SiteHeader />

      <section className="tier-stage">
        <a href="/services" className="page-back">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Back to services
        </a>

        <div className="tier-stage-head">
          <span className="eyebrow">{tier.eyebrow}</span>
          <h1>{tier.headline}</h1>
          <p className="subtext-page">{tier.subtext}</p>
        </div>

        <div className="tier-orbit">
          <div className="tier-orbit-side left">
            {left.map((f) => (
              <OrbitFeature key={f.title} f={f} />
            ))}
          </div>

          <div className="tier-orbit-phone">
            <TierVisual tier={tier} interactive={interactive} />
          </div>

          <div className="tier-orbit-side right">
            {right.map((f) => (
              <OrbitFeature key={f.title} f={f} />
            ))}
          </div>
        </div>

        <div className="tier-stage-cta">
          <p className="tier-price">
            <span className="tier-price-setup">${tier.price.setup} setup</span>
            <span className="tier-price-mo">${tier.price.monthly}/mo</span>
          </p>
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
      </section>

      {/* The dashboard is on every tier, so this band is identical across all
          three and only its module list grows. */}
      <section className="tier-band">
        <h2 className="band-label">Your dashboard, included</h2>
        <div className="dash-chips">
          {tier.dashboard.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
      </section>

      {interactive && (
        <section className="tier-band tier-switch">
          <h2 className="band-label">Compare the plans</h2>
          <div className="tier-switch-btns">
            {others.map((t) => (
              <a key={t.slug} href={`/${t.slug}`} className={`tier-switch-btn tier-card--${t.slug}`}>
                <span className="tier-switch-name">{t.name}</span>
                <span className="tier-switch-price">
                  ${t.price.setup} setup · ${t.price.monthly}/mo
                </span>
                <span className="tier-switch-go" aria-hidden="true">See {t.name} →</span>
              </a>
            ))}
          </div>
        </section>
      )}

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
