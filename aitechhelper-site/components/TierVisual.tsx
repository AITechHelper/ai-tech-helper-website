import ReceptionistPhone from "@/components/ReceptionistPhone";
import MessagePhone from "@/components/MessagePhone";
import type { Tier } from "@/lib/tiers";

/** Gold leads with the live call phone, since the 24/7 voice agent is its whole
 *  pitch. Bronze and Silver are messaging based, so they show a text/DM thread
 *  instead of a call screen. */
export default function TierVisual({
  tier,
  interactive,
}: {
  tier: Tier;
  interactive: boolean;
}) {
  if (tier.slug === "gold") return <ReceptionistPhone interactive={interactive} />;
  return <MessagePhone tier={tier} />;
}
