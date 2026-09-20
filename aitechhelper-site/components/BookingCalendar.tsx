"use client";

import Script from "next/script";

/* Embeds the GoHighLevel booking calendar. Used on the /contact page and in the
   timed assessment popup, so booking behaves identically everywhere. The
   form_embed.js script auto-sizes the iframe by posting its height back. */
const CAL_SRC = "https://api.leadconnectorhq.com/widget/booking/bdaJhv6QDSHAWZO26LiT";

export default function BookingCalendar() {
  return (
    <div className="booking-cal">
      <iframe
        src={CAL_SRC}
        title="Book a free AI assessment"
        className="booking-cal-frame"
        scrolling="no"
        id="bdaJhv6QDSHAWZO26LiT_1789880510693"
      />
      <Script
        src="https://link.msgsndr.com/js/form_embed.js"
        strategy="afterInteractive"
      />
    </div>
  );
}
