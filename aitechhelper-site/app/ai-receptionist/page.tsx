import type { Metadata } from "next";
import ReceptionistPageView from "@/components/ReceptionistPageView";

export const metadata: Metadata = {
  title: "AI Tech Helper — AI Receptionist",
  description:
    "The AI Receptionist that never misses a call — answers, qualifies, and books appointments 24/7.",
};

export default function AiReceptionistPage() {
  return <ReceptionistPageView />;
}
