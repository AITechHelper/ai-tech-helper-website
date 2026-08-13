const REVIEWS = [
  {
    quote:
      "AI Tech Helper has helped me a ton with implementing AI into our company systems. I would highly recommend their team to anyone.",
    name: "Will H",
    business: "",
    initials: "WH",
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
                {r.business && <span>{r.business}</span>}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
