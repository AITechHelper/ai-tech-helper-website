import CloudBackground from "@/components/home/CloudBackground";
import { Icons } from "@/components/TierIcons";
import { PHONE_NUMBER } from "@/lib/tiers";

const SIGNALS = [
  { icon: "message" as const, label: "Instant Response" },
  { icon: "clock" as const, label: "Automated Follow Up" },
  { icon: "star" as const, label: "Review Requests" },
  { icon: "phone" as const, label: "Missed Call Text Back" },
];

/* The hero: a living cloud mesh gradient backdrop, the core promise on top, a
   row of the four things the system does, and the two primary actions. */
export default function Hero() {
  return (
    <section className="home-hero">
      <CloudBackground />

      {/* City glass-tower backdrop behind the living gradient and the copy.
          Darkened/masked in CSS so the headline stays readable. Decorative. */}
      <div className="home-hero-skyline" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/hero-buildings.webp" alt="" />
      </div>

      <div className="home-hero-inner">
        <span className="home-eyebrow">AI Tech Helper · Oklahoma &amp; surrounding areas</span>

        <h1 className="home-hero-title">
          Every call answered. Every lead followed up. Every time.
        </h1>

        <p className="home-hero-sub">
          Never miss a lead. Automate your follow ups. Turn happy clients into new ones.
          All without lifting a finger.
        </p>

        <ul className="home-hero-icons">
          {SIGNALS.map((s) => (
            <li key={s.label}>
              <span className="home-hero-icon" aria-hidden="true">{Icons[s.icon]}</span>
              {s.label}
            </li>
          ))}
        </ul>

        <div className="home-hero-actions">
          <a href="#process" className="btn-primary">
            Show me how it works
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
