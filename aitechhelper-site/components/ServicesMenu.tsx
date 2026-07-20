import { Icons, type IconName } from "@/components/TierIcons";
import { COMPARISON, TIERS } from "@/lib/tiers";

const ROW_ICON: Record<string, IconName> = {
  bronze: "phone",
  silver: "message",
  gold: "star",
};

/**
 * The services menu — the card the ring rests on.
 *
 * The three rows on the left are the carousel's navigation: HeroCarousel
 * delegates clicks by looking for `.service-row[data-index]`, so the
 * data-index values here drive which card the ring spins to. Index 0 is the
 * menu itself, hence the +1.
 *
 * The matrix on the right is the at-a-glance version of the same three
 * packages, so a visitor can compare without opening each page.
 */
export default function ServicesMenu() {
  return (
    <>
      <div className="menu-head">
        <div className="eyebrow">What we build</div>
        <h1>Our services</h1>
      </div>

      <div className="menu-split">
        <div className="service-list">
          {TIERS.map((tier, i) => (
            <button className="service-row" data-index={i + 1} key={tier.slug} type="button">
              <div className="icon-badge">{Icons[ROW_ICON[tier.slug]]}</div>
              <div className="text">
                <h3>{tier.name}</h3>
                <p>{tier.cardDesc}</p>
              </div>
              <div className="arrow">
                <svg viewBox="0 0 24 24">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </div>
            </button>
          ))}
        </div>

        <div className="compare">
          <div className="compare-row compare-head">
            <span />
            {TIERS.map((t) => (
              <span key={t.slug}>{t.name}</span>
            ))}
          </div>

          {COMPARISON.map((row) => (
            <div className="compare-row" key={row.label}>
              <span className="compare-label">{row.label}</span>
              {TIERS.map((t) => (
                <span key={t.slug}>
                  {row.tiers.includes(t.slug) ? (
                    <svg className="tick" viewBox="0 0 24 24" aria-label="included">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  ) : (
                    <i className="dash" aria-label="not included" />
                  )}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
