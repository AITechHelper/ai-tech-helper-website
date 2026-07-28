import HeroOrb from "@/components/HeroOrb";
import { PHONE_NUMBER, PHONE_DISPLAY } from "@/lib/tiers";

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
          Never miss a call.
          <br />
          Never lose a job.
        </h1>

        <p className="home-hero-sub">
          AI voice &amp; messaging agents for local service businesses — answering
          every call and message 24/7, qualifying the lead, and booking the job
          straight onto your calendar. Set up for you.
        </p>

        <div className="home-hero-actions">
          <a href={`tel:${PHONE_NUMBER}`} className="btn-primary">
            Call the live demo
          </a>
          <a href="#services" className="btn-ghost">
            See what we build
          </a>
        </div>

        <p className="home-hero-note">
          Call <a href={`tel:${PHONE_NUMBER}`}>{PHONE_DISPLAY}</a> and talk to the AI
          receptionist yourself — it&apos;s answering right now.
        </p>
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
