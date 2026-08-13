import ServicesCards from "@/components/home/ServicesCards";

/* The services block, in two parts:
   1. A full-bleed banner — the dashboard image as the background with a dark
      overlay and the section heading on top.
   2. The three package cards below it, which carry the #services anchor so the
      nav's "See our services" lands right on the packages. */
export default function Services() {
  return (
    <>
      <section className="svc-banner">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/AdobeStock_303627699.webp"
          alt="Reviewing calls, messages and booking activity at a glance"
        />
        <div className="svc-banner-overlay" />
        <div className="svc-banner-content home-section-head">
          <span className="home-kicker">What we build</span>
          <h2>One system that runs the front office</h2>
          <p>
            Three packages, each one built on the last — start where your phone hurts
            most and grow into the rest when you&apos;re ready.
          </p>
        </div>
      </section>

      <section className="home-section home-services" id="services">
        <ServicesCards />
      </section>
    </>
  );
}
