import type { Metadata } from "next";
import Logo from "@/components/Logo";
import ContactButton from "@/components/ContactButton";
import MobileMenu from "@/components/MobileMenu";
import NavLink from "@/components/NavLink";
import Footer from "@/components/Footer";
import ImgSlot from "@/components/home/ImgSlot";
import { PHONE_NUMBER, PHONE_DISPLAY } from "@/lib/tiers";

export const metadata: Metadata = {
  title: "About, AI Tech Helper | Meet Will Henderson",
  description:
    "The story behind AI Tech Helper, a Broken Arrow, Oklahoma founder helping local businesses grow with AI systems and tools. Built on real experience with 20+ AI products.",
};

export default function AboutPage() {
  return (
    <div className="page about">
      <nav className="nav">
        <Logo />
        <div className="nav-links">
          <a href="/#services">Services</a>
          <NavLink href="/about">About</NavLink>
          <NavLink href="/ai-hub">AI Hub</NavLink>
        </div>
        <ContactButton />
        <MobileMenu />
      </nav>

      <header className="about-hero">
        <div className="about-hero-copy">
          <span className="eyebrow">About</span>
          <h1>
            Hi, I&rsquo;m Will, the person behind AI Tech Helper
          </h1>
          <p className="about-lede">
            I help local businesses across Oklahoma put AI to work, not as a buzzword,
            but as real systems that save hours and win more jobs. Here&rsquo;s how I got
            here, and why I built this.
          </p>
          <div className="about-hero-actions">
            <a href={`tel:${PHONE_NUMBER}`} className="btn-primary">
              Call {PHONE_DISPLAY}
            </a>
            <ContactButton className="btn-ghost" />
          </div>
        </div>

        <div className="about-hero-photo">
          <ImgSlot
            src="/images/will-headshot.webp"
            alt="Will Henderson, founder of AI Tech Helper"
            label="Add /images/will-headshot.webp"
            ratio="4 / 5"
          />
        </div>
      </header>

      {/* Full-bleed Tulsa skyline band, grounds the story in the city. */}
      <div className="about-banner">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/tulsa-skyline.webp" alt="Downtown Tulsa, Oklahoma skyline" />
        <div className="about-banner-caption">
          <span className="home-kicker">Based in Tulsa, Oklahoma</span>
          <p>Born here, building here, helping Oklahoma businesses win with AI.</p>
        </div>
      </div>

      <div className="about-body">
        <article className="about-block">
          <div className="about-block-text">
            <h2>Where I come from</h2>
            <p>
              I got my start at one of the fastest-growing consulting firms in the central
              United States, on the web-development team, pushing projects across the finish
              line and advancing the technology that powered our systems. It taught me how
              real businesses actually run, and how the right technology, built the right way,
              quietly changes everything.
            </p>
          </div>
          <div className="about-block-media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/about-hero.webp" alt="A modern business team at work" />
          </div>
        </article>

        <article className="about-block">
          <div className="about-block-text">
            <h2>Why AI</h2>
            <p>
              I started working with AI the moment it went public, and I haven&rsquo;t stopped
              since. I&rsquo;ve dialed in more than <strong>20 different AI products</strong>, 
              learning first-hand what genuinely moves the needle for a business and what&rsquo;s
              just hype. That&rsquo;s the difference between buying AI and actually getting results
              from it, and it&rsquo;s exactly what I bring to every client.
            </p>
          </div>
          <div className="about-block-media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/about-towers.webp" alt="Modern city business towers" />
          </div>
        </article>

        <article className="about-block">
          <div className="about-block-text">
            <h2>What I&rsquo;m building</h2>
            <p>
              Now I&rsquo;m building out a team called <strong>AI Tech Helper</strong>, dedicated
              to helping local businesses grow using AI systems and tools. Voice agents that
              never miss a call, messaging that answers in seconds, automations that handle the
              busywork, set up for you, tuned to your business, and always improving. Big-company
              technology, built for the shop down the street.
            </p>
          </div>
          <div className="about-block-media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/contact-bg.webp" alt="Downtown Tulsa, Oklahoma" />
          </div>
        </article>

        <section className="about-personal">
          <h2>Beyond the work</h2>
          <p>
            Born and raised in Oklahoma and a proud Broken Arrow High School grad, I&rsquo;m a
            Christian and attend Guts Church. Before this, I was a Taekwondo instructor and ran
            my own martial arts school, which is where I learned that discipline, patience, and
            showing up every day are what actually build something that lasts.
          </p>
          <ul className="about-facts">
            <li>
              <span>Roots</span>Born &amp; raised in Oklahoma · Broken Arrow High School
            </li>
            <li>
              <span>Faith</span>Christian · Guts Church
            </li>
            <li>
              <span>Before this</span>Taekwondo instructor &amp; martial arts school owner
            </li>
            <li>
              <span>Now</span>Founder, AI Tech Helper
            </li>
          </ul>
        </section>
      </div>

      <section className="home-section home-final" id="about-cta">
        <div className="home-final-card">
          <span className="home-kicker">Let&rsquo;s talk</span>
          <h2>See what AI can do for your business</h2>
          <p>
            Call the live demo and hear it for yourself, or send a message and I&rsquo;ll
            set the whole thing up for you. Oklahoma &amp; surrounding areas.
          </p>
          <div className="home-final-actions">
            <a href={`tel:${PHONE_NUMBER}`} className="btn-primary">
              Call {PHONE_DISPLAY}
            </a>
            <ContactButton className="btn-ghost" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
