import CloudBackground from "@/components/home/CloudBackground";
import { PHONE_NUMBER } from "@/lib/tiers";

/* The hero: a living cloud mesh gradient as the backdrop, with the plain-language
   pitch on top, what we do, who it's for, and where, plus the two primary
   actions and a row of quick trust signals. */
export default function Hero() {
  return (
    <section className="home-hero">
      <CloudBackground />

      {/* City glass-tower backdrop behind the living gradient and the copy.
          Darkened/masked in CSS so the headline stays readable while the
          buildings ground the hero in something real. Decorative, no alt. */}
      <div className="home-hero-skyline" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/hero-buildings.webp" alt="" />
      </div>

      <div className="home-hero-inner">
        <span className="home-eyebrow">AI Tech Helper · Oklahoma &amp; surrounding areas</span>

        <h1 className="home-hero-title">
          Save time and make more money with AI
        </h1>

        <p className="home-hero-sub">
          Capture every lead, follow up in seconds, and stay on top of every client.
          AI voice and messaging agents that work for you around the clock.
        </p>

        <div className="home-hero-actions">
          <a href="#services" className="btn-primary">
            See our services
          </a>
          <a href={`tel:${PHONE_NUMBER}`} className="btn-ghost">
            Call the live demo
          </a>
        </div>
      </div>

      <a href="#services" className="home-scroll-cue" aria-label="Scroll to services">
        <span>Scroll</span>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 5v14M6 13l6 6 6-6" />
        </svg>
      </a>
    </section>
  );
}
