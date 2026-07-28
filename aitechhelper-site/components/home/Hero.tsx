import HeroOrb from "@/components/HeroOrb";
import { PHONE_NUMBER } from "@/lib/tiers";

/* The hero: the orb as a quiet backdrop, with the plain-language pitch on top —
   what we do, who it's for, and where — plus the two primary actions and a row
   of quick trust signals. */
export default function Hero() {
  return (
    <section className="home-hero">
      <HeroOrb />

      <div className="home-hero-inner">
        <span className="home-eyebrow">AI Tech Helper · Oklahoma &amp; surrounding areas</span>

        <h1 className="home-hero-title">
          Save time and make more money with AI
        </h1>

        <p className="home-hero-sub">
          AI Tech Helper helps local service businesses win back hours and capture
          more revenue — voice and messaging agents that answer every call, reply on
          every channel, and book the job for you. Serving Oklahoma and surrounding
          areas.
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
