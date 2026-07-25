"use client";

import { useState } from "react";

/* Footer lead-capture box. Posts to /api/subscribe, which currently just
   validates and accepts the address — see that route to forward leads on. */
export default function EmailSignup() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "sending") return;
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Something went wrong.");
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="footer-signup">
        <h3>You&rsquo;re on the list</h3>
        <p className="footer-signup-done">Thanks — we&rsquo;ll be in touch shortly.</p>
      </div>
    );
  }

  return (
    <div className="footer-signup">
      <h3>Get started</h3>
      <p className="footer-signup-sub">
        Drop your email and we&rsquo;ll show you what AI can do for your business.
      </p>
      <form className="footer-signup-form" onSubmit={onSubmit}>
        <input
          type="email"
          required
          placeholder="you@business.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Email address"
        />
        <button type="submit" disabled={state === "sending"}>
          {state === "sending" ? "Sending…" : "Get Started"}
        </button>
      </form>
      {state === "error" && <p className="footer-signup-err">{error}</p>}
    </div>
  );
}
