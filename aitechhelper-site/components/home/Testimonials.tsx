/* ⚠ PLACEHOLDER REVIEWS — replace with real ones before relying on them.
   Swap the quote, name, business and initials below with genuine customer
   feedback. Nothing here is a real quote; it's template copy so the section
   looks right until you drop yours in. */
const REVIEWS = [
  {
    quote:
      "It caught three after-hours calls in the first week that would have gone to voicemail. Two of them booked. It paid for itself immediately.",
    name: "Client Name",
    business: "Business · Tulsa, OK",
    initials: "CN",
  },
  {
    quote:
      "I stopped answering the phone during jobs and stopped losing work because of it. Every lead gets a reply in seconds now, day or night.",
    name: "Client Name",
    business: "Business · Oklahoma City, OK",
    initials: "CN",
  },
  {
    quote:
      "Setup was done for me and it just worked. The dashboard shows me every call and message in one place — I finally know what's coming in.",
    name: "Client Name",
    business: "Business · Broken Arrow, OK",
    initials: "CN",
  },
];

function Stars() {
  return (
    <span className="home-stars" aria-label="5 out of 5 stars">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </span>
  );
}

export default function Testimonials() {
  return (
    <section className="home-section home-reviews" id="reviews">
      <div className="home-section-head">
        <span className="home-kicker">Reviews</span>
        <h2>What local owners say</h2>
        <p className="home-note">
          Sample layout — your real customer reviews drop straight in.
        </p>
      </div>

      <div className="home-review-grid">
        {REVIEWS.map((r, i) => (
          <figure className="home-review" key={i}>
            <Stars />
            <blockquote>&ldquo;{r.quote}&rdquo;</blockquote>
            <figcaption>
              <span className="home-review-avatar" aria-hidden="true">
                {r.initials}
              </span>
              <span className="home-review-who">
                <strong>{r.name}</strong>
                <span>{r.business}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
