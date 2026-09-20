import type { Metadata } from "next";
import TierPageView from "@/components/TierPageView";
import { getTier } from "@/lib/tiers";

export const metadata: Metadata = {
  title: "AI Tech Helper, Gold | 24/7 Voice Agent & Full Lifecycle",
  description:
    "Everything in Silver, plus a 24/7 AI voice agent, contracts and e-sign, invoicing, client onboarding, and a custom email pipeline. $1,000 setup, $400/mo.",
};

export default function GoldPage() {
  return <TierPageView tier={getTier("gold")} />;
}
