"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Une pièce du cabinet : enchaînement lent des points de vue (fondu + léger
 * mouvement de caméra), titre et indicateur de page.
 *
 * HIG — Page controls, Loading, Accessibility :
 * · aperçu flou immédiat plutôt qu'un indicateur de chargement ;
 * · indicateurs monochromes, zone tactile ≥ 28 pt, minuteur visible ;
 * · défilement automatique en pause au survol / focus, arrêté dès qu'une
 *   vue est choisie, désactivé avec « Réduire les animations ».
 *
 * `active = false` (pièce fermée) : première vue seule, immobile, sans titre
 * ni indicateur — les autres vues ne se chargent qu'à l'ouverture.
 */

export type TourSlide = {
  name: string;
  alt: string;
  from: number;
  to: number;
  drift: number;
};

type Props = {
  slides: TourSlide[];
  title: string;
  caption?: string;
  active?: boolean;
  widths: number[];
  sizes: string;
  imgW: number;
  imgH: number;
  placeholder?: string;
  className?: string;
};

const SLIDE_MS = 6500;

export default function RoomTour({
  slides,
  title,
  caption,
  active = true,
  widths,
  sizes,
  imgW,
  imgH,
  placeholder,
  className,
}: Props) {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);

  const [armed, setArmed] = useState(false); // proche du viewport → on charge
  const [ready, setReady] = useState(false); // 1re image décodée
  const [inView, setInView] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [chosen, setChosen] = useState(false); // la personne a pris la main
  const [current, setCurrent] = useState(0);

  // À chaque ouverture, la visite repart de la première vue.
  const [wasActive, setWasActive] = useState(active);
  if (wasActive !== active) {
    setWasActive(active);
    if (active) {
      setCurrent(0);
      setChosen(false);
    }
  }

  const shown = active ? current : 0;
  const playing =
    active && ready && !reduce && inView && !hovered && !focused && !chosen && slides.length > 1;

  const srcSet = (name: string, ext: "avif" | "webp") =>
    widths.map((w) => `/media/${name}-${w}.${ext} ${w}w`).join(", ");
  const fallbackW = widths[Math.min(1, widths.length - 1)];

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((e) => e.isIntersecting);
        setInView(visible);
        if (visible) setArmed(true);
      },
      { rootMargin: "240px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => setCurrent((i) => (i + 1) % slides.length), SLIDE_MS);
    return () => clearTimeout(t);
  }, [playing, current, slides.length]);

  return (
    <div
      ref={rootRef}
      role="group"
      aria-roledescription="carrousel"
      aria-label={title}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocused(false);
      }}
      className={cn("relative isolate overflow-hidden bg-bg-secondary", className)}
    >
      {placeholder && (
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 scale-110 bg-cover bg-center blur-2xl"
          style={{ backgroundImage: `url(${placeholder})` }}
        />
      )}

      {armed &&
        (active ? slides : slides.slice(0, 1)).map((s, i) => {
          const isShown = i === shown;
          return (
            <div
              key={s.name}
              aria-hidden={!isShown}
              className={cn(
                "absolute inset-0 transition-opacity duration-[1200ms] ease-in-out",
                ready && isShown ? "opacity-100" : "opacity-0",
              )}
            >
              <motion.div
                initial={false}
                animate={
                  reduce
                    ? undefined
                    : isShown && active
                      ? { scale: s.to, x: s.drift }
                      : { scale: s.from, x: 0 }
                }
                transition={
                  isShown && active
                    ? { duration: SLIDE_MS / 1000 + 1.6, ease: "linear" }
                    : { duration: 0 }
                }
                className="absolute inset-0"
              >
                <picture>
                  <source type="image/avif" srcSet={srcSet(s.name, "avif")} sizes={sizes} />
                  <source type="image/webp" srcSet={srcSet(s.name, "webp")} sizes={sizes} />
                  <img
                    src={`/media/${s.name}-${fallbackW}.webp`}
                    srcSet={srcSet(s.name, "webp")}
                    sizes={sizes}
                    alt={s.alt}
                    width={imgW}
                    height={imgH}
                    loading="lazy"
                    decoding="async"
                    onLoad={i === 0 ? () => setReady(true) : undefined}
                    className="h-full w-full object-cover"
                  />
                </picture>
              </motion.div>
            </div>
          );
        })}

      {/* Titre de la pièce ouverte, lisible sur la photo */}
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-black/55 via-black/20 to-transparent px-5 pb-16 pt-5 text-white transition-opacity duration-300 ease-out sm:px-7 sm:pt-6",
          active ? "opacity-100" : "opacity-0",
        )}
      >
        <p className="font-display text-title1 font-normal">{title}</p>
        {caption ? (
          <p className="mt-1.5 max-w-[440px] text-subheadline text-white/85">{caption}</p>
        ) : null}
      </div>
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent transition-opacity duration-300",
          active ? "opacity-100" : "opacity-0",
        )}
      />

      {slides.length > 1 && (
        <div
          className={cn(
            "glass-clear absolute bottom-3.5 left-1/2 flex -translate-x-1/2 items-center rounded-full px-1.5 transition-opacity duration-300",
            active ? "opacity-100" : "invisible opacity-0",
          )}
        >
          {slides.map((s, i) => {
            const isShown = i === shown;
            return (
              <button
                key={s.name}
                type="button"
                aria-label={`Vue ${i + 1} sur ${slides.length}`}
                aria-current={isShown ? "true" : undefined}
                onClick={() => {
                  setChosen(true);
                  setCurrent(i);
                }}
                className="group grid h-7 min-w-7 place-items-center px-1"
              >
                <span
                  className={cn(
                    "relative block h-[7px] overflow-hidden rounded-full transition-[width,background-color] duration-300 ease-ios",
                    isShown
                      ? "w-5 bg-white/40"
                      : "w-[7px] bg-white/45 group-hover:bg-white/75",
                  )}
                >
                  {isShown && (
                    <span
                      key={`${shown}-${playing}`}
                      className="absolute inset-0 origin-left rounded-full bg-white"
                      style={
                        playing
                          ? { animation: `page-progress ${SLIDE_MS}ms linear forwards` }
                          : undefined
                      }
                    />
                  )}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
