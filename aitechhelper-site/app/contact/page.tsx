import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import BookMeetingButton from "@/components/BookMeetingButton";
import { PHONE_NUMBER, PHONE_DISPLAY } from "@/lib/tiers";

export const metadata: Metadata = {
  title: "Contact, AI Tech Helper | Get in Touch",
  description:
    "Tell us about your business and our AI will text you to set up a free assessment, usually within minutes. Or book a meeting now, or call us. Oklahoma and surrounding areas.",
};

/* The endpoint every path on the site funnels into. Form-first: drop details and
   our AI texts you to book. Self-booking (GHL calendar) and a phone call are the
   secondary options. */
export default function ContactPage() {
  return (
    <main className="home">
      <SiteHeader />

      <section className="contact-page">
        <div className="contact-page-head home-section-head">
          <span className="home-kicker">Let&apos;s talk</span>
          <h1>Get in touch</h1>
          <p>
            Tell us about your business and our AI will text you to set up your free
            assessment, usually within minutes. Yes, that&rsquo;s the same system we build
            for you.
          </p>
        </div>

        <div className="contact-card">
          <ContactForm />
        </div>

        <div className="contact-page-alt">
          <span className="contact-alt-label">Rather do it yourself?</span>
          <div className="contact-alt-actions">
            <BookMeetingButton className="btn-ghost" />
            <a href={`tel:${PHONE_NUMBER}`} className="btn-ghost">
              Call {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
