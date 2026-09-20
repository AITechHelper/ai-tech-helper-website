/* Real 5-star Google reviews. Only the ones with written text are shown. */
const REVIEWS = [
  {
    quote:
      "This software company has been a HUGE help! I would recommend to anyone in need of their services!",
    name: "Cooper",
    business: "",
    initials: "C",
  },
  {
    quote:
      "I'm thoroughly impressed with the functionality of this app. It's helped solve many problems, I highly suggest it.",
    name: "Buddy James",
    business: "",
    initials: "BJ",
  },
  {
    quote: "Amazing! Great service to work with! Extremely reliable and super fast help!",
    name: "Fernanda Zelaya",
    business: "",
    initials: "FZ",
  },
  {
    quote: "Will is super knowledgeable and will be a great help to getting you set up!",
    name: "Jesse T.",
    business: "",
    initials: "JT",
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
