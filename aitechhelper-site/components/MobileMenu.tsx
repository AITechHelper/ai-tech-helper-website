"use client";

import { useState } from "react";

/* Hamburger menu for the top nav on phones (≤720px, where the inline nav links
   and the Contact pill are hidden). Same destinations as the desktop nav.
   "Services" scrolls the homepage into the services stage; on any other page it
   just navigates to /#services. */
export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  const onServices = (e: React.MouseEvent) => {
    if (typeof window !== "undefined" && window.location.pathname === "/") {
      const svc = document.getElementById("services");
      if (svc) {
        e.preventDefault();
        svc.scrollIntoView({ behavior: "smooth" });
      }
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
        <button
          type="button"
          className="mobile-menu-cta"
          onClick={() => {
            close();
            window.dispatchEvent(new Event("open-contact"));
          }}
        >
          Contact Us
        </button>
      </div>
    </div>
  );
}
