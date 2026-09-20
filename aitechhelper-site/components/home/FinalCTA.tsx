import { PHONE_NUMBER, PHONE_DISPLAY } from "@/lib/tiers";

/* The closing call to action, the last and clearest ask on the page. This is
   where the page's driving question lands. */
export default function FinalCTA() {
  return (
    <section className="home-section home-final" id="final-cta">
      <div className="home-final-card">
        <span className="home-kicker">Ready when you are</span>
        <h2>Ready to stop letting the phone cost you jobs?</h2>
        <p>
          Book a free assessment and we&apos;ll show you what to automate first, or call and
          talk it through. Oklahoma &amp; surrounding areas.
        </p>

        <div className="home-final-actions">
          <a href="/contact" className="btn-primary">
            Book a call
          </a>
          <a href={`tel:${PHONE_NUMBER}`} className="btn-ghost">
            Call {PHONE_DISPLAY}
          </a>
        </div>
      </div>
    </section>
  );
}
