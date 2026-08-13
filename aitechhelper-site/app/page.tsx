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
  title: "AI Tech Helper — AI Phone & Messaging Agents for Oklahoma Businesses",
  description:
    "AI voice and messaging agents for local service businesses in Oklahoma and surrounding areas. Answer every call 24/7, reply on every channel, qualify leads and book jobs — never miss a call again.",
};

export default function HomePage() {
  return (
    <main className="home">
      <HomeNav />
      <Hero />
      <ChannelHub />
      <Feature
        side="right"
        kicker="Who it's for"
        title="For the businesses that live and die by the phone"
        body="Home services, trades, clinics, salons and contractors across Oklahoma and surrounding areas. If a missed call is a missed job, your AI agent makes sure it never happens again."
        img="/images/AdobeStock_249711013.webp"
        alt="A service technician taking a customer call on the job"
        bullets={[
          "Answers while you're on the tools or on a job",
          "Qualifies the lead and books it on your calendar",
          "Follows up so quotes don't go cold",
          "Works nights, weekends and holidays",
        ]}
      />
      <Services />
      <Process />
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
