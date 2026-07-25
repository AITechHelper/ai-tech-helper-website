"use client";

import { useEffect, useState } from "react";
import EmailSignup from "@/components/EmailSignup";

/* A single global "Contact Us" popup, mounted once in the root layout. Any
   button opens it by dispatching a window "open-contact" event (see
   ContactButton and MobileMenu). It reuses the same EmailSignup form as the
   footer, so the ask is identical everywhere. */
export default function ContactModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const openFn = () => setOpen(true);
    window.addEventListener("open-contact", openFn);
    return () => window.removeEventListener("open-contact", openFn);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    // Lock background scroll while the modal is up.
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="contact-modal" role="dialog" aria-modal="true" aria-label="Contact us">
      <div className="contact-modal-backdrop" onClick={() => setOpen(false)} />
      <div className="contact-modal-card">
        <button
          type="button"
          className="contact-modal-close"
          aria-label="Close"
          onClick={() => setOpen(false)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
        <EmailSignup />
      </div>
    </div>
  );
}
