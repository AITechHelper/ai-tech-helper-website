import type { Metadata } from "next";
import TierPageView from "@/components/TierPageView";
import { getTier } from "@/lib/tiers";

export const metadata: Metadata = {
  title: "AI Tech Helper — Silver | Voice + Messaging",
  description:
    "Everything in Bronze, plus instant replies across SMS, chat, Instagram, Facebook, WhatsApp and email — with reminders, estimate follow-up, and review requests.",
};

export default function SilverPage() {
  return <TierPageView tier={getTier("silver")} />;
}
