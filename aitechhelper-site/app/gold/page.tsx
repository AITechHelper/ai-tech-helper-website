import type { Metadata } from "next";
import TierPageView from "@/components/TierPageView";
import { getTier } from "@/lib/tiers";

export const metadata: Metadata = {
  title: "AI Tech Helper — Gold | Complete Package",
  description:
    "Everything in Silver, plus contract signing, invoice follow-up, client onboarding, and custom email pipelines — your whole job lifecycle running itself.",
};

export default function GoldPage() {
  return <TierPageView tier={getTier("gold")} />;
}
