import type { Metadata } from "next";
import TierPageView from "@/components/TierPageView";
import { getTier } from "@/lib/tiers";

export const metadata: Metadata = {
  title: "AI Tech Helper, Silver | Follow-Up & Reviews",
  description:
    "Everything in Bronze, plus automated quote follow-up, Google review and referral requests, appointment reminders and client check-ins. $750 setup, $300/mo.",
};

export default function SilverPage() {
  return <TierPageView tier={getTier("silver")} />;
}
