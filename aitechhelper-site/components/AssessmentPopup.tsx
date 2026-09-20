"use client";

import { useEffect, useState } from "react";
import BookingCalendar from "@/components/BookingCalendar";

/* A timed popup that appears 5 seconds after the first visit, offering a free AI
   assessment with the GoHighLevel booking calendar built right in, so a visitor
   can grab a time on the spot. Shows once per browser session. */
export default function AssessmentPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let shown = false;
    try {
      shown = sessionStorage.getItem("assessment-popup-shown") === "1";
    } catch {
      shown = false;
    }
    if (shown) return;

    const t = setTimeout(() => {
      setOpen(true);
      try {
        sessionStorage.setItem("assessment-popup-shown", "1");
      } catch {
        /* private mode, ignore */
      }
    }, 5000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="assess-pop" role="dialog" aria-modal="true" aria-label="Free AI assessment">
      <div className="assess-pop-backdrop" onClick={() => setOpen(false)} />
      <div className="assess-pop-card">
        <button
          type="button"
          className="assess-pop-close"
          aria-label="Close"
          onClick={() => setOpen(false)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
        <div className="assess-pop-head">
          <span className="home-kicker">Free AI assessment</span>
          <h2>See exactly where AI can help your business</h2>
          <p>Pick a time below. We&apos;ll map out what to automate first, no cost, no pressure.</p>
        </div>
        <BookingCalendar />
      </div>
    </div>
  );
}
