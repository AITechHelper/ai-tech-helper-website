import type { Metadata } from "next";
import HomeNav from "@/components/home/HomeNav";
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
    "AI voice and messaging agents for local service businesses in Oklahoma and surrounding areas. Answer every call 24/7, reply on every channel, qualify leads and book jobs, never miss a call again.",
};

export default function HomePage() {
  return (
    <main className="home">
      <HomeNav />
      <Hero />
      <Feature
        side="right"
        kicker="Who it's for"
        title="For local businesses that want AI but don't know where to start"
        body="Home services, trades, clinics, salons and contractors across Oklahoma and surrounding areas. You know AI could save you time and win you more work, you just don't have the hours to figure out which tools, how to set them up, or where to begin. That's exactly what we handle for you."
        img="/images/AdobeStock_249711013.webp"
        alt="A local service business owner running the day-to-day"
        bullets={[
          "We find where AI actually helps your business",
          "No jargon and no DIY, we set the whole thing up",
          "Start with one thing that hurts, add more as you grow",
          "Ongoing support as the tools keep changing",
        ]}
      />
      <ChannelHub />
      <Process />
      <Services />
      <Feature
        side="left"
        kicker="Done for you"
        title="We build it, train it, and keep it sharp"
        body="You don't touch any setup. We configure your agent on your existing number and channels, train it on your services and pricing, and refine it from real transcripts as you grow."
        img="/images/AdobeStock_586876572.webp"
        alt="The AI Tech Helper team configuring an agent for a client"
        bullets={[
          "Set up on your existing number",
          "Trained on your business, not a template",
          "Reviewed by you before it goes live",
          "Tuned every month as you scale",
        ]}
      />
      <Testimonials />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
