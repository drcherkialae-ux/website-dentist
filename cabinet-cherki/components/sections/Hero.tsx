"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import AnchorLink from "@/components/AnchorLink";
import { SITE } from "@/lib/site";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* Fond : la réception du cabinet, plein écran (2528 × 1696) */
const BG_WIDTHS = [768, 1280, 1920, 2528];
const BG_SIZES = "100vw";
const bgSrcSet = (ext: "avif" | "webp") =>
  BG_WIDTHS.map((w) => `/media/reception-${w}.${ext} ${w}w`).join(", ");

export default function Hero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  /* L'image (SSR) peut être décodée avant l'hydratation → onLoad manqué */
  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const cueFade = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  /* Profondeur 3D au pointeur : le décor pivote, le texte glisse en sens inverse */
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 55, damping: 18, mass: 0.7 });
  const sy = useSpring(py, { stiffness: 55, damping: 18, mass: 0.7 });
  const rotateY = useTransform(sx, [-0.5, 0.5], [-2.2, 2.2]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [1.6, -1.6]);
  const bgShiftX = useTransform(sx, [-0.5, 0.5], [12, -12]);
  const bgShiftY = useTransform(sy, [-0.5, 0.5], [8, -8]);
  const fgShiftX = useTransform(sx, [-0.5, 0.5], [-7, 7]);
  const fgShiftY = useTransform(sy, [-0.5, 0.5], [-5, 5]);

  const onPointerMove = (e: React.PointerEvent) => {
    if (reduce) return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onPointerLeave = () => {
    px.set(0);
    py.set(0);
  };

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.14, delayChildren: 0.15 } },
  };
  const item: Variants = reduce
    ? {}
    : {
        hidden: { opacity: 0, y: 26 },
        show: { opacity: 1, y: 0, transition: { duration: 1, ease } },
      };

  return (
    <section
      id="top"
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="bg-hero-lux grain relative isolate overflow-hidden text-white"
      style={{ perspective: 1400 }}
    >
      {/* ------------------------------------------------ */}
      {/*  Fond — la réception en profondeur 3D             */}
      {/* ------------------------------------------------ */}
      <motion.div
        aria-hidden="true"
        style={reduce ? undefined : { rotateX, rotateY, y: bgY }}
        className="absolute inset-0 -z-10 will-change-transform"
      >
        <motion.div
          style={reduce ? undefined : { x: bgShiftX, y: bgShiftY }}
          className="absolute inset-0"
        >
          <motion.div
            initial={false}
            animate={
              reduce
                ? { opacity: loaded ? 1 : 0 }
                : {
                    opacity: loaded ? 1 : 0,
                    scale: [1.08, 1.14, 1.08],
                  }
            }
            transition={{
              opacity: { duration: 1.4, ease },
              scale: { duration: 30, repeat: Infinity, ease: "easeInOut" },
            }}
            className="absolute inset-0"
          >
            <picture>
              <source type="image/avif" srcSet={bgSrcSet("avif")} sizes={BG_SIZES} />
              <source type="image/webp" srcSet={bgSrcSet("webp")} sizes={BG_SIZES} />
              <img
                ref={imgRef}
                src="/media/reception-1920.webp"
                srcSet={bgSrcSet("webp")}
                sizes={BG_SIZES}
                width={2528}
                height={1696}
                alt=""
                fetchPriority="high"
                loading="eager"
                decoding="async"
                onLoad={() => setLoaded(true)}
                className="h-full w-full object-cover object-[62%_46%]"
              />
            </picture>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Voiles de lisibilité : latéral pour le texte, haut pour la nav, bas pour la jonction */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-abyss/90 via-abyss/45 to-abyss/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-36 bg-gradient-to-b from-abyss/70 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-44 bg-gradient-to-t from-[#05080f] via-abyss/40 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(120%_95%_at_58%_40%,transparent_52%,rgba(6,11,26,0.6)_100%)]"
      />

      {/* ------------------------------------------------ */}
      {/*  Contenu                                          */}
      {/* ------------------------------------------------ */}
      <div className="mx-auto flex min-h-[100svh] w-full max-w-[1760px] items-center px-5 pb-24 pt-28 sm:px-10 xl:px-14 2xl:px-20">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          style={reduce ? undefined : { x: fgShiftX, y: fgShiftY }}
          className="relative z-10 max-w-[27rem] sm:max-w-[30rem] 2xl:max-w-[33rem]"
        >
          <motion.p
            variants={item}
            className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.34em] text-champagne"
          >
            <span className="hairline-champagne h-px w-10" aria-hidden="true" />
            Cabinet dentaire · Témara
          </motion.p>

          <motion.h1
            variants={item}
            className="font-serif mt-7 text-[3.1rem] font-medium leading-[1.02] tracking-tight sm:text-[3.8rem] xl:text-[4rem] 2xl:text-[4.5rem]"
          >
            Dr. Alae
            <br />
            <span className="bg-gradient-to-r from-[#f3e6cd] via-champagne to-champagne-deep bg-clip-text text-transparent">
              Cherki
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-5 text-base font-light tracking-wide text-white/85 sm:text-lg"
          >
            Dentisterie esthétique &amp; multidisciplinaire premium
          </motion.p>

          <motion.p
            variants={item}
            className="font-serif mt-6 max-w-md text-lg italic leading-relaxed text-white/60 sm:text-xl"
          >
            Là où l&apos;excellence médicale rencontre l&apos;art de
            recevoir.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-10 flex flex-col gap-3.5 sm:flex-row sm:flex-wrap sm:items-center"
          >
            <AnchorLink
              href="#rendez-vous"
              className="btn-sheen group inline-flex h-[3.4rem] items-center justify-center whitespace-nowrap rounded-full bg-white px-7 text-[15px] font-medium tracking-tight text-ink shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift active:scale-[0.98]"
            >
              Réserver une consultation
            </AnchorLink>

            <AnchorLink
              href="#cabinet"
              className="group inline-flex h-[3.4rem] items-center justify-center gap-2.5 whitespace-nowrap rounded-full border border-white/25 px-6 text-[15px] font-medium tracking-tight text-white/90 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-champagne/60 hover:bg-white/[0.06] hover:text-white active:scale-[0.98]"
            >
              Découvrir le cabinet
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </AnchorLink>
          </motion.div>
        </motion.div>
      </div>

      {/* Légende du lieu */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 14 }}
        transition={{ duration: 1, delay: 0.5, ease }}
        className="pointer-events-none absolute bottom-7 right-5 z-10 sm:right-10"
      >
        <div className="glass rounded-2xl px-4 py-3">
          <p className="text-[10px] uppercase tracking-[0.3em] text-champagne">
            {SITE.brand.doctor}
          </p>
          <p className="mt-1 text-sm font-medium text-white">
            L&apos;accueil du cabinet — Témara
          </p>
        </div>
      </motion.div>

      {/* Indice de défilement */}
      <motion.div
        style={reduce ? undefined : { opacity: cueFade }}
        className="pointer-events-none absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2.5 text-white/45 xl:flex"
      >
        <span className="text-[10px] uppercase tracking-[0.32em]">Découvrir</span>
        <span className="flex h-9 w-5 items-start justify-center rounded-full border border-white/20 p-1">
          <motion.span
            animate={reduce ? undefined : { y: [0, 10, 0] }}
            transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
            className="h-1.5 w-1.5 rounded-full bg-champagne"
          />
        </span>
      </motion.div>
    </section>
  );
}
