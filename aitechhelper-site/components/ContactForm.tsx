"use client";

import { useState } from "react";

/* The "prefer we reach out?" form on the /contact page. Captures name, phone,
   email and message with explicit TCPA SMS consent, then posts to /api/contact,
   which forwards to GoHighLevel so a workflow (SMS chatbot) can follow up. */
export default function ContactForm() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "sending") return;
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, smsConsent: consent }),
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
      <div className="contact-form contact-form--done">
        <h3>You&rsquo;re all set</h3>
        <p>We&rsquo;ll text you shortly to get a time on the calendar. Talk soon.</p>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={onSubmit}>
      <div className="contact-form-row">
        <label>
          <span>Name</span>
          <input type="text" required value={form.name} onChange={set("name")} placeholder="Your name" />
        </label>
        <label>
          <span>Phone</span>
          <input type="tel" required value={form.phone} onChange={set("phone")} placeholder="(555) 555-5555" />
        </label>
      </div>
      <label>
        <span>Email <em>(optional)</em></span>
        <input type="email" value={form.email} onChange={set("email")} placeholder="you@business.com" />
      </label>
      <label>
        <span>What do you need? <em>(optional)</em></span>
        <textarea rows={3} value={form.message} onChange={set("message")} placeholder="Tell us a bit about your business" />
      </label>

      <label className="contact-consent">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} required />
        <span>
          By submitting, you agree to receive text messages from AI Tech Helper at the number
          provided. Msg &amp; data rates may apply. Msg frequency varies. Reply STOP to opt out.
          See our <a href="/privacy">Privacy Policy</a>.
        </span>
      </label>

      {state === "error" && <p className="contact-form-err">{error}</p>}

      <button type="submit" className="btn-primary" disabled={state === "sending"}>
        {state === "sending" ? "Sending…" : "Have us reach out"}
      </button>
    </form>
  );
}
