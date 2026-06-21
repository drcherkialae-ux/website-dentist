"use client";

import { useLenis } from "lenis/react";
import type { ReactNode } from "react";

type Props = {
  href: string;
  className?: string;
  children: ReactNode;
  onNavigate?: () => void;
  ariaLabel?: string;
};

/** Lien d'ancre interne qui défile en douceur via Lenis (offset navbar). */
export default function AnchorLink({
  href,
  className,
  children,
  onNavigate,
  ariaLabel,
}: Props) {
  const lenis = useLenis();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!href.startsWith("#")) return;
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) {
      if (lenis) lenis.scrollTo(el as HTMLElement, { offset: -76 });
      else el.scrollIntoView({ behavior: "smooth" });
    }
    onNavigate?.();
  };

  return (
    <a
      href={href}
      className={className}
      onClick={handleClick}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
}
