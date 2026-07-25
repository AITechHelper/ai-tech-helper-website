import { NextResponse } from "next/server";

/* Lead capture for the footer "Get started" box.

   Leads are forwarded to GoHighLevel via an inbound webhook. To connect it:
     1. In GHL: Automation → Workflows → Create Workflow → add the
        "Inbound Webhook" trigger, and copy the webhook URL it gives you.
     2. Put that URL in the GHL_WEBHOOK_URL env var — in `.env.local` for local
        dev, and in the Vercel project's Environment Variables for production.
     3. In the same GHL workflow, add a "Create/Update Contact" action and map
        the incoming `email` field (plus any tags / campaign you want).

   Until GHL_WEBHOOK_URL is set the route still accepts submissions and logs
   them, so the form works in development without the webhook. */
export async function POST(req: Request) {
  let email = "";
  try {
    const body = await req.json();
    email = typeof body?.email === "string" ? body.email.trim() : "";
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!valid) {
    return NextResponse.json({ ok: false, error: "Enter a valid email." }, { status: 400 });
  }

  const webhook = process.env.GHL_WEBHOOK_URL;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source: "website-footer",
          submittedAt: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error(`GHL webhook responded ${res.status}`);
    } catch (err) {
      console.error("Failed to forward lead to GoHighLevel:", err);
      return NextResponse.json(
        { ok: false, error: "Could not submit right now. Please try again." },
        { status: 502 }
      );
    }
  } else {
    // No webhook configured yet — log so nothing is silently lost in dev.
    console.log("New lead (GHL_WEBHOOK_URL not set):", email);
  }

  return NextResponse.json({ ok: true });
}
