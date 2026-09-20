import ServicesCards from "@/components/home/ServicesCards";

/* The services block, in two parts:
   1. A full-bleed banner, the dashboard image as the background with a dark
      overlay and the section heading on top.
   2. The plan cards below it, which carry the #services anchor so the hero's
      "See our services" scroll lands right on the plans. Each card links
      straight through to its tier page. */
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
          <h2>One system that runs your front office</h2>
          <p>
            Three plans, each built on the last. Start where you&apos;re losing leads and
            grow into the rest when you&apos;re ready.
          </p>
        </div>
      </section>

      <section className="home-section home-services" id="services">
        <ServicesCards />

        <div className="home-services-foot">
          <a href="/services" className="home-soft-link">
            Want the full breakdown? See every solution in detail
            <span aria-hidden="true"> →</span>
          </a>
          <a href="/about" className="home-about-nudge">
            New to AI systems? Meet the person behind AI Tech Helper
            <span aria-hidden="true"> →</span>
          </a>
        </div>
      </section>
    </>
  );
}
