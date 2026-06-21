"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "motion/react";
import { useRef } from "react";
import { RdvButton, CallButton } from "@/components/cta";
import { SITE } from "@/lib/site";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function Hero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
  };
  const item: Variants = reduce
    ? {}
    : {
        hidden: { opacity: 0, y: 24 },
        show: { opacity: 1, y: 0, transition: { duration: 0.9, ease } },
      };

  return (
    <section
      id="top"
      ref={ref}
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-aurora pt-24 pb-16 text-white md:pt-28"
    >
      {/* Couche vidéo d'ambiance (très discrète) */}
      <motion.div
        style={reduce ? undefined : { y: bgY }}
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/media/soin-1.jpg"
          className="h-full w-full object-cover opacity-25 blur-[1px]"
        >
          <source src="/media/hero-clinic.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-night/70 via-ink/80 to-ink" />
      </motion.div>

      {/* Halo lumineux */}
      <div className="pointer-events-none absolute -right-24 top-1/4 -z-10 h-[36rem] w-[36rem] rounded-full bg-teal/20 blur-[120px]" />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-5 md:px-10 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Texte */}
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.p
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-teal-light"
          >
            Cabinet dentaire · Témara
          </motion.p>

          <motion.h1
            variants={item}
            className="font-display mt-6 text-[2.6rem] font-semibold leading-[1.04] tracking-tight sm:text-6xl lg:text-[4.2rem]"
          >
            Votre sourire,
            <br />
            <span className="text-gradient">notre expertise.</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg"
          >
            Centre dentaire multidisciplinaire alliant soins d&apos;excellence,
            technologie avancée et une approche profondément humaine.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <RdvButton size="lg" />
            <CallButton size="lg" tone="dark" />
          </motion.div>

          <motion.div
            variants={item}
            className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/55"
          >
            {["Urgences 24h/24", "Technologie fläsh", "Approche multidisciplinaire"].map(
              (t) => (
                <span key={t} className="inline-flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-teal" />
                  {t}
                </span>
              ),
            )}
          </motion.div>
        </motion.div>

        {/* Portrait du docteur */}
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease, delay: 0.2 }}
          className="relative mx-auto w-full max-w-md lg:max-w-none"
        >
          <motion.div
            style={reduce ? undefined : { y: portraitY }}
            className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-lift ring-1 ring-white/15"
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              poster="/media/portrait-2.jpg"
              aria-label={`${SITE.brand.doctor}, ${SITE.brand.role}`}
              className="absolute inset-0 h-full w-full object-cover object-top"
            >
              <source src="/media/doctor-portrait.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />

            {/* Carte flottante : le docteur au centre de la marque */}
            <div className="glass absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl px-4 py-3">
              <div>
                <p className="font-display text-base font-semibold tracking-tight text-white">
                  {SITE.brand.doctor}
                </p>
                <p className="text-xs text-white/70">{SITE.brand.role}</p>
              </div>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal/90">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M20 6 9 17l-5-5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Indice de défilement */}
      <motion.div
        style={reduce ? undefined : { opacity: fade }}
        className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/50 md:flex"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Découvrir</span>
        <span className="flex h-9 w-5 items-start justify-center rounded-full border border-white/25 p-1">
          <motion.span
            animate={reduce ? undefined : { y: [0, 10, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="h-1.5 w-1.5 rounded-full bg-teal"
          />
        </span>
      </motion.div>
    </section>
  );
}
