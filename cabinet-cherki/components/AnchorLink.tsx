"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
  /** Appelé au clic (ex. fermer le menu). */
  onNavigate?: () => void;
};

/**
 * Lien d'ancre interne. Le défilement reste natif (il suit le geste) ;
 * la douceur vient de `scroll-behavior: smooth`, désactivée si la personne
 * a choisi « Réduire les animations ». `scroll-padding-top` tient compte de
 * la barre flottante.
 */
export default function AnchorLink({ href, children, onNavigate, onClick, ...props }: Props) {
  return (
    <a
      href={href}
      onClick={(e) => {
        onClick?.(e);
        onNavigate?.();
      }}
      {...props}
    >
      {children}
    </a>
  );
}
