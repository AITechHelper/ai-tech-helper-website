import type { Metadata } from "next";
import TierPageView from "@/components/TierPageView";
import { getTier } from "@/lib/tiers";

export const metadata: Metadata = {
  title: "AI Tech Helper, Gold | 24/7 Voice Agent",
  description:
    "Everything in Silver, plus a 24/7 AI voice agent that answers every call, qualifies the lead, and books the job live on your calendar. $1,000 setup, $400/mo.",
};

export default function GoldPage() {
  return <TierPageView tier={getTier("gold")} />;
}
