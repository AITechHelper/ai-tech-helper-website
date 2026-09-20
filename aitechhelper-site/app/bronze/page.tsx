import type { Metadata } from "next";
import TierPageView from "@/components/TierPageView";
import { getTier } from "@/lib/tiers";

export const metadata: Metadata = {
  title: "AI Tech Helper, Bronze | Instant Response",
  description:
    "Instant replies on every channel, call, text, DM, chat and email, plus missed-call text back, all in one hub synced to your CRM. $500 setup, $200/mo.",
};

export default function BronzePage() {
  return <TierPageView tier={getTier("bronze")} />;
}
