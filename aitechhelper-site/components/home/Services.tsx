import ImgSlot from "@/components/home/ImgSlot";
import ServicesCarousel from "@/components/home/ServicesCarousel";

/* The services section: header, a dashboard image slot, and the rotating card
   carousel (ServicesCarousel) driven by lib/tiers. */
export default function Services() {
  return (
    <section className="home-section home-services" id="services">
      <div className="home-section-head">
        <span className="home-kicker">What we build</span>
        <h2>One system that runs the front office</h2>
        <p>
          Three packages, each one built on the last — start where your phone hurts
          most and grow into the rest when you&apos;re ready.
        </p>
      </div>

      <figure className="home-shot">
        <ImgSlot
          src="/images/AdobeStock_303627699.webp"
          alt="Reviewing calls, messages and booking activity at a glance"
          label="Add your dashboard screenshot at /public/images/dashboard.png"
        />
        <figcaption>One place for every call, message, booking and invoice.</figcaption>
      </figure>

      <ServicesCarousel />
    </section>
  );
}
