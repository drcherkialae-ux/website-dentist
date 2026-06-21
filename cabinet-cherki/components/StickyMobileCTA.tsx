"use client";

import { useState } from "react";
import { useLenis } from "lenis/react";
import { AnimatePresence, motion } from "motion/react";
import AnchorLink from "./AnchorLink";
import { SITE } from "@/lib/site";

/** Barre de conversion fixe en bas d'écran (mobile uniquement). */
export default function StickyMobileCTA() {
  const [visible, setVisible] = useState(false);

  useLenis(({ scroll }: { scroll: number }) => {
    setVisible(scroll > 420);
  });

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-40 lg:hidden"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div className="glass-light mx-3 mb-3 grid grid-cols-[1fr_auto] gap-2 rounded-2xl p-2 shadow-lift">
            <AnchorLink
              href="#rendez-vous"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-teal text-sm font-semibold tracking-tight text-white"
            >
              Prendre rendez-vous
            </AnchorLink>
            <a
              href={`tel:${SITE.contact.cabinetPhoneTel}`}
              aria-label="Appeler le cabinet"
              className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-ink/10 text-ink"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M6.6 10.8a13.4 13.4 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24c1.1.36 2.3.56 3.5.56a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.3a1 1 0 0 1 1 1c0 1.2.2 2.4.56 3.5a1 1 0 0 1-.24 1l-2.2 2.3Z"
                  fill="currentColor"
                />
              </svg>
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
