"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/* A nav link that stays useful when you're already on its page. A Next.js
   <Link> (or a bare anchor) to the current route is a dead click — nothing
   happens. Here, when the link points at the page you're on, clicking it
   scrolls back to the top instead, so the nav never feels broken. */
export default function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isCurrent = pathname === href;

  if (isCurrent) {
    return (
      <a
        href={href}
        aria-current="page"
        onClick={(e) => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        {children}
      </a>
    );
  }

  return <Link href={href}>{children}</Link>;
}
