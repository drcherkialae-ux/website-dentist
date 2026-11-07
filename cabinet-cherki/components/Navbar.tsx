"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import AnchorLink from "./AnchorLink";
import ThemeToggle from "./ThemeToggle";
import { buttonStyles } from "./ui/Button";
import { ChevronRight, Close, Menu, Phone } from "./ui/icons";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

const SECTION_IDS = [
  "docteur",
  "approche",
  "services",
  "resultats",
  "cabinet",
  "avis",
  "rendez-vous",
];

/**
 * Barre de navigation flottante en Liquid Glass (HIG — Toolbars, Materials) :
 * variante « clear » au-dessus de la photo d'accueil, « regular » ensuite,
 * avec un effet de bord de défilement. L'action principale (rendez-vous)
 * est seule mise en avant, côté droit.
 */
export default function Navbar() {
  const reduce = useReducedMotion();
  const [overHero, setOverHero] = useState(true);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  /* Apparence selon la position : sur la photo ou sur le contenu. */
  useEffect(() => {
    const hero = document.getElementById("top");
    let frame = 0;
    const update = () => {
      frame = 0;
      const isOver = window.scrollY < (hero?.offsetHeight ?? 0) - 72;
      setOverHero(isOver);
      if (isOver) setActive(null);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  /* Section courante : aide à se repérer (HIG — Toolbars, Navigation). */
  useEffect(() => {
    const els = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* Menu : focus sur le premier lien, Échap et clic extérieur pour fermer. */
  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  const clear = overHero && !open;
  const close = () => setOpen(false);

  return (
    <>
      {/* Effet de bord de défilement : le contenu se floute sous la barre. */}
      <div
        aria-hidden="true"
        className={cn(
          "scroll-edge pointer-events-none fixed inset-x-0 top-0 z-40 h-24 transition-opacity duration-300",
          overHero ? "opacity-0" : "opacity-100",
        )}
      />

      <header
        ref={headerRef}
        className="fixed inset-x-0 top-0 z-50 px-3 pt-[max(12px,env(safe-area-inset-top))] sm:px-5"
      >
        <nav
          aria-label="Navigation principale"
          className={cn(
            "relative mx-auto flex h-14 max-w-page items-center justify-between gap-2 rounded-full pl-2 pr-1.5 transition-[background-color,box-shadow,color] duration-300 ease-ios",
            clear ? "glass-clear text-white" : "glass text-label",
          )}
        >
          <a
            href="#top"
            aria-label="Dr. Alae Cherki — haut de page"
            className="flex min-w-0 items-center gap-2.5 rounded-full py-1.5 pl-1 pr-3"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={SITE.brand.logo}
              alt=""
              width={32}
              height={32}
              className="h-8 w-8 shrink-0 rounded-[9px]"
            />
            <span className="truncate text-headline">Dr. Alae Cherki</span>
          </a>

          <ul className="hidden items-center lg:flex">
            {SITE.nav.map((item) => {
              const isActive = active === item.href.slice(1);
              return (
                <li key={item.href} className="relative">
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      aria-hidden="true"
                      className={cn(
                        "absolute inset-0 rounded-full",
                        clear ? "bg-white/15" : "bg-fill-tertiary",
                      )}
                      transition={
                        reduce
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 520, damping: 42 }
                      }
                    />
                  )}
                  <a
                    href={item.href}
                    aria-current={isActive ? "location" : undefined}
                    className={cn(
                      "relative flex h-10 items-center rounded-full px-3.5 text-subheadline font-medium transition-colors duration-200",
                      clear
                        ? "text-white/85 hover:text-white"
                        : isActive
                          ? "text-label"
                          : "text-label-secondary hover:text-label",
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex shrink-0 items-center gap-1">
            <a
              href={`tel:${SITE.contact.drPhoneTel}`}
              className={cn(
                "hidden h-10 items-center gap-2 rounded-full px-3.5 text-subheadline font-medium transition-colors xl:flex",
                clear
                  ? "text-white/85 hover:text-white"
                  : "text-label-secondary hover:text-label",
              )}
            >
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-red" />
              Urgence 24h/24
            </a>

            <ThemeToggle onMedia={clear} />

            <AnchorLink
              href="#rendez-vous"
              className={buttonStyles("prominent", "compact", "max-md:hidden")}
            >
              Prendre rendez-vous
            </AnchorLink>

            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="menu-principal"
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
              className={cn(
                "grid h-11 w-11 place-items-center rounded-full transition-[background-color,transform] duration-200 active:scale-95 lg:hidden",
                clear ? "hover:bg-white/15" : "hover:bg-fill-tertiary",
              )}
            >
              {open ? <Close className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.div
              ref={panelRef}
              id="menu-principal"
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: -6 }}
              transition={{ duration: 0.24, ease: [0.32, 0.72, 0, 1] }}
              style={{ transformOrigin: "top right" }}
              className="glass absolute inset-x-3 top-[calc(100%+8px)] mx-auto max-w-page rounded-[28px] p-2 text-label sm:inset-x-5 lg:hidden"
            >
              <ul>
                {SITE.nav.map((item) => {
                  const isActive = active === item.href.slice(1);
                  return (
                    <li key={item.href}>
                      <AnchorLink
                        href={item.href}
                        onNavigate={close}
                        aria-current={isActive ? "location" : undefined}
                        className="flex h-12 items-center justify-between rounded-[20px] px-4 text-body font-medium transition-colors hover:bg-fill-tertiary active:bg-fill-secondary"
                      >
                        {item.label}
                        <ChevronRight className="h-4 w-4 text-label-tertiary" />
                      </AnchorLink>
                    </li>
                  );
                })}
              </ul>
              <div className="mx-4 my-2 h-px bg-separator" />
              <div className="grid gap-2 p-1 sm:grid-cols-2">
                <AnchorLink
                  href="#rendez-vous"
                  onNavigate={close}
                  className={buttonStyles("prominent", "large", "w-full")}
                >
                  Prendre rendez-vous
                </AnchorLink>
                <a
                  href={`tel:${SITE.contact.drPhoneTel}`}
                  className={buttonStyles("destructiveTinted", "large", "w-full")}
                >
                  <Phone />
                  Urgence 24h/24
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
