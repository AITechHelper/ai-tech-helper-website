"use client";

/* The "Contact Us" pill in the nav. Opens the global ContactModal (mounted in
   the root layout) rather than linking anywhere. */
export default function ContactButton({ className = "cta-pill" }: { className?: string }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new Event("open-contact"))}
    >
      Contact Us
    </button>
  );
}
