import ContactButton from "@/components/ContactButton";
import { PHONE_NUMBER, PHONE_DISPLAY } from "@/lib/tiers";

/* The closing call to action — the last, clearest ask on the page. */
export default function FinalCTA() {
  return (
    <section className="home-section home-final" id="final-cta">
      <div className="home-final-card">
        <span className="home-kicker">Ready when you are</span>
        <h2>Stop letting the phone cost you jobs</h2>
        <p>
          Call the live demo and hear your new receptionist in action, or send us a
          message and we&apos;ll set the whole thing up for you. Oklahoma &amp;
          surrounding areas.
        </p>

        <div className="home-final-actions">
          <a href={`tel:${PHONE_NUMBER}`} className="btn-primary">
            Call {PHONE_DISPLAY}
          </a>
          <ContactButton className="btn-ghost" />
        </div>
      </div>
    </section>
  );
}
