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
          AI phone &amp; messaging agents that
          <br />
          answer every call and win the job
        </h1>

        <p className="home-hero-sub">
          We build AI voice and messaging agents for local service businesses — so you
          never miss a call, lose a lead, or chase an invoice again. Set up for you,
          working 24/7, live on your calendar.
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

        <ul className="home-trustchips">
          <li>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2 4 5v6c0 5 3.4 8.5 8 11 4.6-2.5 8-6 8-11V5l-8-3Z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            Oklahoma-based &amp; owner-run
          </li>
          <li>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 3" />
            </svg>
            Answers 24/7 — nights &amp; weekends
          </li>
          <li>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20 6 9 17l-5-5" />
            </svg>
            No missed calls, no voicemail
          </li>
          <li>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 3v18h18" />
              <path d="m7 14 3-3 3 3 5-6" />
            </svg>
            Every call logged &amp; transcribed
          </li>
        </ul>
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
