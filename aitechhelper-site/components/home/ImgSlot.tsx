"use client";

import { useState } from "react";

/* An image with a graceful fallback. If the file exists it renders; if it's
   missing (you haven't dropped it in yet) it shows a clean labelled placeholder
   instead of a broken-image icon. Replace the placeholder simply by adding the
   file at the given path — see /public/images/README.md. */
export default function ImgSlot({
  src,
  alt,
  label,
  ratio = "16 / 9",
  className = "",
}: {
  src: string;
  alt: string;
  label: string;
  ratio?: string;
  className?: string;
}) {
  const [ok, setOk] = useState(true);

  return (
    <div className={`home-imgslot ${className}`} style={{ aspectRatio: ratio }}>
      {ok ? (
        <img src={src} alt={alt} loading="lazy" onError={() => setOk(false)} />
      ) : (
        <span className="home-imgslot-ph">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="m21 15-5-5L5 21" />
          </svg>
          {label}
        </span>
      )}
    </div>
  );
}
