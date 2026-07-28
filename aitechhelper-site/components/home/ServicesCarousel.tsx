"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Icons, type IconName } from "@/components/TierIcons";
import { TIERS, type Tier } from "@/lib/tiers";

const ROW_ICON: Record<string, IconName> = {
  bronze: "phone",
  silver: "message",
  gold: "star",
};
const FEATURED: Tier["slug"] = "silver";

/* A light 3D card carousel for the services. Pure CSS transforms on three
   cards (no WebGL, no live page previews — that's what made the old ring heavy),
   so it's smooth on phones too. Auto-rotates, pauses on hover/interaction, and
   supports arrows, dots and swipe. Each card links through to its page. */
export default function ServicesCarousel() {
  const n = TIERS.length;
  const [active, setActive] = useState(1); // start on Silver (the featured middle)
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setActive((a) => (a + 1) % n), 4200);
    return () => clearInterval(id);
  }, [paused, n]);

  const go = (dir: number) => setActive((a) => (a + dir + n) % n);

  // Swipe / drag to rotate.
  const startX = useRef<number | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    startX.current = e.clientX;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (startX.current !== null) {
      const dx = e.clientX - startX.current;
      if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    }
    startX.current = null;
  };

  return (
    <div
      className="svc-carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="svc-stage"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        {TIERS.map((tier, i) => {
          let rel = ((i - active) % n + n) % n; // 0,1,2
          if (rel > n / 2) rel -= n; // wrap to -1,0,1
          const isActive = rel === 0;
          return (
            <article
              key={tier.slug}
              className={`svc-card${tier.slug === FEATURED ? " is-featured" : ""}`}
              data-rel={rel}
              aria-hidden={!isActive}
              onClick={() => !isActive && setActive(i)}
            >
              {tier.slug === FEATURED && <span className="svc-flag">Most popular</span>}

              <div className="svc-card-top">
                <span className="icon-badge">{Icons[ROW_ICON[tier.slug]]}</span>
                <span className="svc-rank">{String(i + 1).padStart(2, "0")}</span>
              </div>

              <h3>{tier.name}</h3>
              <span className="svc-kicker">{tier.cardKicker}</span>
              <p className="svc-desc">{tier.cardDesc}</p>

              <ul className="svc-features">
                {tier.features.map((f) => (
                  <li key={f.title}>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    {f.title}
                  </li>
                ))}
              </ul>

              {isActive ? (
                <Link className="svc-cta" href={`/${tier.slug}`}>
                  Explore {tier.name}
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>
              ) : (
                <span className="svc-cta" aria-hidden="true">
                  Explore {tier.name}
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              )}
            </article>
          );
        })}
      </div>

      <div className="svc-controls">
        <button className="svc-arrow" type="button" onClick={() => go(-1)} aria-label="Previous service">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div className="svc-dots">
          {TIERS.map((tier, i) => (
            <button
              key={tier.slug}
              type="button"
              className={`svc-dot${i === active ? " is-on" : ""}`}
              onClick={() => setActive(i)}
              aria-label={`Show ${tier.name}`}
            />
          ))}
        </div>
        <button className="svc-arrow" type="button" onClick={() => go(1)} aria-label="Next service">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
