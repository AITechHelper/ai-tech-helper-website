import type { Metadata } from "next";
import HomeNav from "@/components/home/HomeNav";
import Hero from "@/components/home/Hero";
import TrustBar from "@/components/home/TrustBar";
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
      <TrustBar />
      <Services />
      <Process />
      <Testimonials />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
