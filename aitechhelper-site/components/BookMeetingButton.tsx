"use client";

import { useEffect, useState } from "react";
import BookingCalendar from "@/components/BookingCalendar";

/* A button that opens the GoHighLevel booking calendar in a modal, so the
   contact page can lead with the form and keep self-booking one click away
   without embedding the whole calendar inline. Reuses the .assess-pop modal. */
export default function BookMeetingButton({ className = "btn-ghost" }: { className?: string }) {
  const [open, setOpen] = useState(false);

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

  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)}>
        Book a meeting now
      </button>

      {open && (
        <div className="assess-pop" role="dialog" aria-modal="true" aria-label="Book a meeting">
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
              <h2>Pick a time that works</h2>
            </div>
            <BookingCalendar />
          </div>
        </div>
      )}
    </>
  );
}
