"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { RdvButton } from "@/components/cta";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const benefits = [
  "Résultat visible dès la première séance",
  "Jusqu'à 3 à 8 teintes plus claires",
  "Séance de 45 à 60 minutes",
  "Convient aussi aux dents sensibles",
];

export default function BeforeAfter() {
  const reduce = useReducedMotion();

  return (
    <section id="resultats" className="relative overflow-hidden bg-white py-24 md:py-32">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-14 px-5 md:px-10 lg:grid-cols-2 lg:gap-20">
        {/* Texte */}
        <div className="order-2 lg:order-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-teal">
            Résultats
          </p>
          <h2 className="font-display mt-4 text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl lg:text-[2.9rem]">
            Blanchiment fläsh : un sourire éclatant, en une séance.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink/65">
            Une technologie de blanchiment professionnelle, contrôlée et sans
            risque pour l&apos;émail. Un résultat naturel et immédiat, pensé pour
            sublimer votre sourire sans le dénaturer.
          </p>

          <ul className="mt-8 space-y-3">
            {benefits.map((b, i) => (
              <motion.li
                key={b}
                initial={reduce ? false : { opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08, ease }}
                className="flex items-center gap-3 text-[15px] text-ink/75"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal/12 text-teal">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                {b}
              </motion.li>
            ))}
          </ul>

          <div className="mt-9">
            <RdvButton label="Réserver mon blanchiment" />
          </div>
        </div>

        {/* Visuel avant / après */}
        <div className="order-1 lg:order-2">
          <motion.div
            initial={reduce ? false : { clipPath: "inset(0 100% 0 0 round 1.75rem)" }}
            whileInView={{ clipPath: "inset(0 0% 0 0 round 1.75rem)" }}
            viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            transition={{ duration: 1.1, ease }}
            className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.75rem] shadow-lift ring-1 ring-ink/5"
          >
            <Image
              src="/media/before-after.jpg"
              alt="Avant / après — blanchiment dentaire au cabinet Dr. Alae Cherki"
              fill
              sizes="(max-width: 1024px) 90vw, 45vw"
              className="object-cover"
            />

            {/* Ligne de séparation lumineuse */}
            <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-white/70 shadow-[0_0_24px_rgba(255,255,255,0.6)]" />
            <span className="absolute bottom-4 left-4 rounded-full bg-ink/55 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-white backdrop-blur">
              Avant
            </span>
            <span className="absolute bottom-4 right-4 rounded-full bg-teal/90 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-white">
              Après
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
