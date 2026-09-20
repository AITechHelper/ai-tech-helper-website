/* Embeds the GoHighLevel booking calendar. Used on the /contact page and in the
   timed assessment popup, so booking behaves identically everywhere. The
   auto-resize script (form_embed.js) is loaded once, globally, in the root
   layout, so its resize listener is always active before this iframe appears
   (otherwise the calendar can render collapsed inside the popup). */
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
    </div>
  );
}
