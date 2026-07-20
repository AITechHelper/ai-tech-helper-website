import ReceptionistPhone from "@/components/ReceptionistPhone";
import TierStackPanel from "@/components/TierStackPanel";
import type { Tier } from "@/lib/tiers";

/** Bronze leads with the live demo phone, since "call it yourself" is its
 *  whole pitch. The upper tiers lead with what they stack up instead. */
export default function TierVisual({
  tier,
  interactive,
}: {
  tier: Tier;
  interactive: boolean;
}) {
  if (tier.slug === "bronze") return <ReceptionistPhone interactive={interactive} />;
  return <TierStackPanel tier={tier} />;
}
