"use client";

import { useState } from "react";

/* Hamburger menu for the top nav on phones (≤720px, where the inline nav links
   and the Contact pill are hidden). Same destinations as the desktop nav. */
export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <div className="mobile-menu">
      <button
        type="button"
        className={`hamburger${open ? " is-open" : ""}`}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span />
        <span />
        <span />
      </button>

      {open && <div className="mobile-menu-backdrop" onClick={close} />}

      <div className={`mobile-menu-panel${open ? " is-open" : ""}`}>
        <a href="/services" onClick={close}>
          Services
        </a>
        <a href="/about" onClick={close}>
          About
        </a>
        <a href="/contact" className="mobile-menu-cta" onClick={close}>
          Contact Us
        </a>
      </div>
    </div>
  );
}
