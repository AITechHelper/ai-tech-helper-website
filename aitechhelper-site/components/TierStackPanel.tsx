import type { Tier } from "@/lib/tiers";

/**
 * The visual for Silver and Gold: the complete stack at a glance, with what
 * carries up from the tier below shown alongside what this tier adds. The
 * point is that the value of an upper tier is cumulative and easy to miss if
 * you only list what's new.
 */
export default function TierStackPanel({ tier }: { tier: Tier }) {
  return (
    <div className="stack-stage">
      <div className="stack-panel">
        <div className="stack-head">
          <span className="stack-name">{tier.name}</span>
          <span className="stack-count">
            {tier.inherits.length + tier.features.length} included
          </span>
        </div>

        <ul className="stack-list">
          {tier.inherits.map((item) => (
            <li key={item}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20 6 9 17l-5-5" />
              </svg>
              <span>{item}</span>
            </li>
          ))}
          {tier.features.map((f) => (
            <li className="is-new" key={f.title}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20 6 9 17l-5-5" />
              </svg>
              <span>{f.title}</span>
              <em>New</em>
            </li>
          ))}
        </ul>

        {tier.builds_on && (
          <p className="stack-foot">
            Builds on {tier.builds_on} — nothing is taken away.
          </p>
        )}
      </div>
    </div>
  );
}
