"use client";

import { useState } from "react";
import { PHONE_NUMBER } from "@/lib/tiers";

/* Hamburger menu for the top nav on phones (≤720px, where the inline nav links
   and the Contact pill are hidden). Same destinations as the desktop nav.
   "Services" scrolls the homepage into the services stage; on any other page it
   just navigates to /#services. */
export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  const onServices = (e: React.MouseEvent) => {
    if (typeof window !== "undefined" && window.location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
    }
    close();
  };

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
        <a href="/#services" onClick={onServices}>
          Services
        </a>
        <a href="/ai-tools" onClick={close}>
          AI Tools
        </a>
        <a href="/ai-hub" onClick={close}>
          AI Hub
        </a>
        <a href={`tel:${PHONE_NUMBER}`} className="mobile-menu-cta" onClick={close}>
          Contact Us
        </a>
      </div>
    </div>
  );
}
