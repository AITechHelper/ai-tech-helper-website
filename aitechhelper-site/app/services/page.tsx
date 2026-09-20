import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import ServiceBreakdown from "@/components/home/ServiceBreakdown";
import ServicesCards from "@/components/home/ServicesCards";
import FinalCTA from "@/components/home/FinalCTA";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Services, AI Tech Helper | Bronze, Silver & Gold AI Plans",
  description:
    "Done-for-you AI systems for local businesses in Oklahoma and surrounding areas. Instant response on every channel, automated follow-up, reviews, and a 24/7 voice agent. Compare Bronze, Silver and Gold.",
};

/* The Services page: the detailed, everything-by-outcome page for people still
   comparing. Reached from the nav, not pushed hard from the homepage. Ends by
   sending the visitor to pick a plan. */
export default function ServicesPage() {
  return (
    <main className="home">
      <SiteHeader />

      <section className="svc-page-hero">
        <div className="home-section-head">
          <span className="home-kicker">Our services</span>
          <h1>What we offer</h1>
          <p>Every service we run for you, and which plan it lives in.</p>
        </div>
        <div className="svc-page-hero-cta">
          <a href="/contact" className="btn-primary">Book a call</a>
          <a href="#services" className="btn-ghost">See the plans</a>
        </div>
      </section>

      <section className="home-section home-services" id="services">
        <div className="home-section-head">
          <span className="home-kicker">Ready to choose?</span>
          <h2>Pick your plan</h2>
        </div>
        <ServicesCards />
      </section>

      <ServiceBreakdown />

      <FinalCTA />
      <Footer />
    </main>
  );
}
