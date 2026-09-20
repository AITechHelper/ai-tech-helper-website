import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import BookingCalendar from "@/components/BookingCalendar";
import { PHONE_NUMBER, PHONE_DISPLAY } from "@/lib/tiers";

export const metadata: Metadata = {
  title: "Contact, AI Tech Helper | Book a Free AI Assessment",
  description:
    "Book a free AI assessment for your business in Oklahoma and surrounding areas. Pick a time on the calendar or call us, and we'll map out what to automate first.",
};

/* The endpoint every path on the site funnels into. Replaces the old contact
   modal with a standalone page carrying the GoHighLevel booking calendar. */
export default function ContactPage() {
  return (
    <main className="home">
      <SiteHeader />

      <section className="contact-page">
        <div className="contact-page-head home-section-head">
          <span className="home-kicker">Let&apos;s talk</span>
          <h1>Book your free AI assessment</h1>
          <p>
            Pick a time that works and we&apos;ll show you exactly where AI can save you hours
            and win you more jobs. No cost, no pressure. Prefer to talk now? Call{" "}
            <a href={`tel:${PHONE_NUMBER}`} className="contact-inline-call">
              {PHONE_DISPLAY}
            </a>
            .
          </p>
        </div>

        <div className="contact-page-cal">
          <BookingCalendar />
        </div>

        <div className="contact-page-alt">
          <a href={`tel:${PHONE_NUMBER}`} className="btn-ghost">
            Or call {PHONE_DISPLAY}
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
