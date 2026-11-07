"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import AnchorLink from "./AnchorLink";
import { buttonStyles } from "./ui/Button";
import { Phone } from "./ui/icons";
import { SITE } from "@/lib/site";

/**
 * Barre d'outils inférieure (mobile) en Liquid Glass : l'action principale
 * reste à portée de pouce. Masquée sur la photo d'accueil (qui a ses propres
 * boutons) et dès que le formulaire de rendez-vous est à l'écran.
 */
export default function StickyMobileCTA() {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("top");
    const rdv = document.getElementById("rendez-vous");
    let frame = 0;
    const update = () => {
      frame = 0;
      const pastHero = window.scrollY > (hero?.offsetHeight ?? 600) * 0.7;
      const rdvTop = rdv?.getBoundingClientRect().top ?? Infinity;
      setVisible(pastHero && rdvTop > window.innerHeight * 0.85);
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

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 28 }}
          transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
          className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(12px,env(safe-area-inset-bottom))] md:hidden"
        >
          <div className="glass mx-auto flex max-w-[480px] items-center gap-1.5 rounded-full p-1.5">
            <AnchorLink
              href="#rendez-vous"
              className={buttonStyles("prominent", "large", "flex-1")}
            >
              Prendre rendez-vous
            </AnchorLink>
            <a
              href={`tel:${SITE.contact.cabinetPhoneTel}`}
              aria-label={`Appeler le cabinet au ${SITE.contact.cabinetPhoneDisplay}`}
              className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-full bg-fill-tertiary text-label transition-transform duration-200 active:scale-95"
            >
              <Phone className="h-5 w-5" />
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
