import type { Metadata } from "next";
import HomeNav from "@/components/home/HomeNav";
import Services from "@/components/home/Services";
import Process from "@/components/home/Process";
import FAQ from "@/components/home/FAQ";
import FinalCTA from "@/components/home/FinalCTA";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Services — AI Tech Helper | Bronze, Silver & Gold AI Agent Packages",
  description:
    "Done-for-you AI voice and messaging agents for local service businesses in Oklahoma and surrounding areas. Three packages — Bronze, Silver and Gold — each built on the last. Answer every call, reply on every channel, and book the job automatically.",
};

/* Dedicated Services page. Reuses the homepage sections: the packages banner
   and cards, how it works, FAQ and the final CTA. */
export default function ServicesPage() {
  return (
    <main className="home">
      <HomeNav />
      <Services />
      <Process />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
