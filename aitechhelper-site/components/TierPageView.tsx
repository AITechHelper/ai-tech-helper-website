import Logo from "@/components/Logo";
import { Icons } from "@/components/TierIcons";
import TierVisual from "@/components/TierVisual";
import { PHONE_DISPLAY, PHONE_NUMBER, type Tier } from "@/lib/tiers";

/**
 * The full body of a package page (/bronze, /silver, /gold).
 *
 * Laid out as three horizontal bands rather than one tall column: a hero that
 * carries the headline and the call-to-action above the fold, then the
 * capabilities, then the dashboard. Stacking all of it in the left column
 * left the right side half empty and made the page feel cramped.
 *
 * Single source of truth: each route renders this live, and the homepage
 * carousel renders the same component scaled onto its 3D card.
 *
 * `interactive` is false for the carousel preview — it drops the phone's
 * handlers and element ids so a scaled-down copy can't hijack a tap.
 */
export default function TierPageView({
  tier,
  interactive = true,
}: {
  tier: Tier;
  interactive?: boolean;
}) {
  return (
    /* The tier modifier carries the metal accent tokens (--m1/--m2/--glow),
       so everything inside inherits the colour of the package being read
       rather than the brand cyan. */
    <div className={`page page--${tier.slug}`}>
      <nav className="nav">
        <Logo />
        <div className="nav-links">
          <a href="/#stage">Agents</a>
          <a href="/#stage">Automations</a>
          <a href="/ai-hub">AI Hub</a>
        </div>
        <a href="#" className="cta-pill">
          Contact Us
        </a>
      </nav>

      <section className="tier-hero">
        <div className="tier-hero-copy">
          {/* `from` tells the carousel which card to park on so it can play
              the zoom-out-and-spin back to the menu on arrival. */}
          <a href={`/?from=${tier.slug}#stage`} className="page-back">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Back to services
          </a>

          <span className="eyebrow">{tier.eyebrow}</span>
          <h1>{tier.headline}</h1>
          <p className="subtext-page">{tier.subtext}</p>

          <div className="cta-block">
            <a
              href={`tel:${PHONE_NUMBER}`}
              className="call-btn"
              {...(interactive ? { "data-start-call": "true" } : {})}
            >
              {Icons.phone}
              Call {PHONE_DISPLAY}
            </a>
            <p className="cta-note">
              Talk to us about {tier.name} — no pressure, we&rsquo;ll tell you if it&rsquo;s not a
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

      {/* The dashboard is on every tier — it's the platform the agent runs on,
          not an upsell — so this band is identical across all three and only
          its module list grows. */}
      <section className="tier-band">
        <h2 className="band-label">Your dashboard, included</h2>
        <div className="dash-chips">
          {tier.dashboard.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
      </section>
    </div>
  );
}
