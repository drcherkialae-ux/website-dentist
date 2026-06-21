"use client";

import Image from "next/image";
import { useState } from "react";
import { useLenis } from "lenis/react";
import { AnimatePresence, motion } from "motion/react";
import AnchorLink from "./AnchorLink";
import { RdvButton } from "./cta";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useLenis(({ scroll }: { scroll: number }) => {
    setScrolled(scroll > 24);
  });

  const solid = scrolled || open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        solid
          ? "glass-light shadow-[0_1px_0_rgba(10,19,48,0.06)]"
          : "bg-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 md:h-[72px] md:px-10">
        {/* Logo + wordmark */}
        <AnchorLink
          href="#top"
          className="flex items-center gap-3"
          ariaLabel="Retour en haut"
        >
          <span className="relative h-9 w-9 overflow-hidden rounded-xl ring-1 ring-white/15 md:h-10 md:w-10">
            <Image
              src={SITE.brand.logo}
              alt={SITE.brand.name}
              fill
              sizes="40px"
              className="object-cover"
            />
          </span>
          <span
            className={cn(
              "font-display text-[15px] font-semibold leading-none tracking-tight transition-colors md:text-base",
              solid ? "text-ink" : "text-white",
            )}
          >
            Dr. Alae Cherki
          </span>
        </AnchorLink>

        {/* Liens desktop */}
        <ul className="hidden items-center gap-8 lg:flex">
          {SITE.nav.map((item) => (
            <li key={item.href}>
              <AnchorLink
                href={item.href}
                className={cn(
                  "group relative text-sm tracking-tight transition-colors",
                  solid
                    ? "text-ink/70 hover:text-ink"
                    : "text-white/80 hover:text-white",
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "absolute -bottom-1 left-0 h-px w-0 bg-teal transition-all duration-300 group-hover:w-full",
                  )}
                />
              </AnchorLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href={`tel:${SITE.contact.drPhoneTel}`}
            className={cn(
              "hidden items-center gap-1.5 text-xs font-medium tracking-tight transition-colors sm:flex",
              solid ? "text-ink/70 hover:text-teal" : "text-white/80 hover:text-white",
            )}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-teal" />
            </span>
            Urgence 24h/24
          </a>

          <div className="hidden sm:block">
            <RdvButton className="h-10 px-5 text-[13px]" />
          </div>

          {/* Burger mobile */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full transition-colors lg:hidden",
              solid ? "text-ink hover:bg-ink/5" : "text-white hover:bg-white/10",
            )}
          >
            <div className="relative h-4 w-5">
              <span
                className={cn(
                  "absolute left-0 h-0.5 w-5 bg-current transition-all duration-300",
                  open ? "top-1.5 rotate-45" : "top-0",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 top-1.5 h-0.5 w-5 bg-current transition-all duration-300",
                  open ? "opacity-0" : "opacity-100",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 h-0.5 w-5 bg-current transition-all duration-300",
                  open ? "top-1.5 -rotate-45" : "top-3",
                )}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* Menu mobile */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-ink/5 bg-white/95 backdrop-blur-xl lg:hidden"
          >
            <ul className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-5 py-4">
              {SITE.nav.map((item) => (
                <li key={item.href}>
                  <AnchorLink
                    href={item.href}
                    onNavigate={() => setOpen(false)}
                    className="block rounded-xl px-3 py-3 text-lg font-medium tracking-tight text-ink hover:bg-mist"
                  >
                    {item.label}
                  </AnchorLink>
                </li>
              ))}
              <li className="mt-2 grid grid-cols-1 gap-2">
                <RdvButton className="w-full" />
                <a
                  href={`tel:${SITE.contact.drPhoneTel}`}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-teal/30 text-sm font-medium text-teal"
                >
                  Urgence 24h/24 — Appeler
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
