import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import Hero from "@/components/home/Hero";
import ChannelHub from "@/components/home/ChannelHub";
import Feature from "@/components/home/Feature";
import Services from "@/components/home/Services";
import Process from "@/components/home/Process";
import Testimonials from "@/components/home/Testimonials";
import FAQ from "@/components/home/FAQ";
import FinalCTA from "@/components/home/FinalCTA";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "AI Tech Helper, AI Phone & Messaging Agents for Oklahoma Businesses",
  description:
    "Answer every call, text and DM instantly, follow up on every lead, and turn happy clients into reviews and referrals. Done-for-you AI systems for local businesses in Oklahoma and surrounding areas.",
};

export default function HomePage() {
  return (
    <main className="home">
      <SiteHeader />
      <Hero />
      <ChannelHub />
      <Feature
        side="right"
        kicker="Who it's for"
        title="For local businesses that don't want to miss another lead"
        body="Home services, trades, clinics, salons and contractors around Oklahoma. If leads slip through because you're on a job, up a ladder, or asleep, that's the gap we close for you."
        img="/images/AdobeStock_249711013.webp"
        alt="A local service business owner running the day-to-day"
        bullets={[
          "Every call, text and DM answered right away",
          "Missed calls get a text back in seconds",
          "Quiet quotes chased until they book",
          "One inbox for everything, synced to your CRM",
        ]}
      />
      <Process />
      <Services />
      <Testimonials />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
