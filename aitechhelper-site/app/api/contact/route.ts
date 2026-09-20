import { NextResponse } from "next/server";

/* Contact form capture for the /contact page. Forwards to GoHighLevel via an
   inbound webhook so a workflow (e.g. an SMS chatbot) can pick it up.

   To connect it:
     1. In GHL: Automation → Workflows → Create Workflow → add the
        "Inbound Webhook" trigger, and copy the webhook URL.
     2. Put that URL in the GHL_CONTACT_WEBHOOK_URL env var (in `.env.local` for
        local dev, and in the Vercel project's Environment Variables for prod).
     3. In the same workflow, add a "Create/Update Contact" action mapping name,
        phone, email, and message, then your SMS steps. Only fire SMS when
        smsConsent is true (it's passed through below).

   Until GHL_CONTACT_WEBHOOK_URL is set the route still accepts submissions and
   logs them, so the form works in development without the webhook. */
function fail(error: string, status = 400) {
  return NextResponse.json({ ok: false, error }, { status });
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return fail("Invalid request.");
  }

  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const name = str(body.name);
  const phone = str(body.phone);
  const email = str(body.email);
  const message = str(body.message);
  const smsConsent = body.smsConsent === true;

  if (!name) return fail("Please enter your name.");
  if (phone.replace(/\D/g, "").length < 10) return fail("Please enter a valid phone number.");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail("Please enter a valid email.");
  if (!smsConsent) return fail("Please agree to receive text messages so we can reach you.");

  const webhook = process.env.GHL_CONTACT_WEBHOOK_URL;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          message,
          smsConsent,
          source: "website-contact-form",
          submittedAt: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error(`GHL webhook responded ${res.status}`);
    } catch (err) {
      console.error("Failed to forward contact lead to GoHighLevel:", err);
      return fail("Could not submit right now. Please try again.", 502);
    }
  } else {
    console.log("New contact lead (GHL_CONTACT_WEBHOOK_URL not set):", { name, phone, email, message, smsConsent });
  }

  return NextResponse.json({ ok: true });
}
