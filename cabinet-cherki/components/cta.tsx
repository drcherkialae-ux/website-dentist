"use client";

import AnchorLink from "./AnchorLink";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-all duration-300 will-change-transform active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/60 focus-visible:ring-offset-2";

/** CTA principal : prise de rendez-vous (ancre vers la section #rendez-vous). */
export function RdvButton({
  className,
  label = "Prendre rendez-vous",
  size = "md",
}: {
  className?: string;
  label?: string;
  size?: "md" | "lg";
}) {
  return (
    <AnchorLink
      href="#rendez-vous"
      className={cn(
        base,
        "bg-teal text-white shadow-soft hover:shadow-lift hover:brightness-[1.06]",
        size === "lg" ? "h-14 px-9 text-base" : "h-12 px-7 text-sm",
        className,
      )}
    >
      <span>{label}</span>
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="-mr-0.5"
      >
        <path
          d="M5 12h14M13 6l6 6-6 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </AnchorLink>
  );
}

/** CTA secondaire : appeler (tel:). `tone` adapte les couleurs au fond. */
export function CallButton({
  className,
  label = "Appeler le cabinet",
  phone = SITE.contact.cabinetPhoneTel,
  tone = "light",
  size = "md",
}: {
  className?: string;
  label?: string;
  phone?: string;
  tone?: "light" | "dark";
  size?: "md" | "lg";
}) {
  return (
    <a
      href={`tel:${phone}`}
      className={cn(
        base,
        tone === "dark"
          ? "border border-white/25 text-white hover:bg-white/10"
          : "border border-ink/15 text-ink hover:bg-ink/[0.04]",
        size === "lg" ? "h-14 px-8 text-base" : "h-12 px-6 text-sm",
        className,
      )}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M6.6 10.8a13.4 13.4 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24c1.1.36 2.3.56 3.5.56a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.3a1 1 0 0 1 1 1c0 1.2.2 2.4.56 3.5a1 1 0 0 1-.24 1l-2.2 2.3Z"
          fill="currentColor"
        />
      </svg>
      <span>{label}</span>
    </a>
  );
}
