/* The "Contact Us" button/pill. Links to the /contact page (which carries the
   booking calendar). Kept as a component so every CTA across the site funnels
   to the same endpoint with consistent styling. */
export default function ContactButton({ className = "cta-pill" }: { className?: string }) {
  return (
    <a href="/contact" className={className}>
      Contact Us
    </a>
  );
}
