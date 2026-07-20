import type { Metadata } from "next";
import TierPageView from "@/components/TierPageView";
import { getTier } from "@/lib/tiers";

export const metadata: Metadata = {
  title: "AI Tech Helper — Bronze | Voice Agent",
  description:
    "A voice agent that answers every call 24/7 — qualifying leads, booking appointments, and handling questions so you never lose another caller.",
};

export default function BronzePage() {
  return <TierPageView tier={getTier("bronze")} />;
}
