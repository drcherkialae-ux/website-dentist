"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Visite 3D d'une pièce du cabinet : mouvement de caméra automatique
 * (zoom/panoramique), rotation subtile au survol / toucher, chargement
 * différé avec loader luxe. 100 % images optimisées — aucune vidéo.
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
  widths: number[];
  sizes: string;
  imgW: number;
  imgH: number;
  className?: string;
};

const SLIDE_MS = 7600;

export default function RoomTour({
  slides,
  title,
  widths,
  sizes,
  imgW,
  imgH,
  className,
}: Props) {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);

  const [armed, setArmed] = useState(false); // entré dans le viewport → on charge
  const [ready, setReady] = useState(false); // 1re image décodée → on révèle
  const [inView, setInView] = useState(false); // visible → la caméra tourne
  const [active, setActive] = useState(0);

  const srcSet = (name: string, ext: "avif" | "webp") =>
    widths.map((w) => `/media/${name}-${w}.${ext} ${w}w`).join(", ");
  const fallbackW = widths[Math.min(1, widths.length - 1)];

  /* Chargement différé + pause de la caméra hors écran */
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((e) => e.isIntersecting);
        setInView(visible);
        if (visible) setArmed(true);
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* Caméra automatique : enchaîne lentement les points de vue */
  useEffect(() => {
    if (!ready || reduce || !inView || slides.length < 2) return;
    const t = setInterval(() => setActive((i) => (i + 1) % slides.length), SLIDE_MS);
    return () => clearInterval(t);
  }, [ready, reduce, inView, slides.length]);

  /* Rotation subtile au pointeur (souris + toucher) */
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 18, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 60, damping: 18, mass: 0.6 });
  const rotateY = useTransform(sx, [-0.5, 0.5], [-3.2, 3.2]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [2.4, -2.4]);
  const shiftX = useTransform(sx, [-0.5, 0.5], [8, -8]);
  const shiftY = useTransform(sy, [-0.5, 0.5], [6, -6]);

  const onPointerMove = (e: React.PointerEvent) => {
    if (reduce) return;
    const r = rootRef.current?.getBoundingClientRect();
    if (!r) return;
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onPointerLeave = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <div
      ref={rootRef}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={cn(
        "group relative touch-pan-y overflow-hidden bg-[#101b2e]",
        className,
      )}
      style={{ perspective: 1200 }}
      aria-label={`Visite immersive — ${title}`}
    >
      {/* Pile d'images — caméra lente + rotation 3D subtile */}
      <motion.div
        style={reduce ? undefined : { rotateX, rotateY, scale: 1.045 }}
        className="absolute inset-0 will-change-transform"
      >
        <motion.div style={reduce ? undefined : { x: shiftX, y: shiftY }} className="absolute inset-0">
          {armed &&
            slides.map((s, i) => {
              const isActive = i === active;
              return (
                <motion.div
                  key={s.name}
                  initial={false}
                  animate={{ opacity: ready ? (isActive ? 1 : 0) : 0 }}
                  transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  <motion.div
                    initial={false}
                    animate={
                      reduce
                        ? undefined
                        : isActive
                          ? { scale: s.to, x: s.drift }
                          : { scale: s.from, x: 0 }
                    }
                    transition={
                      isActive
                        ? { duration: SLIDE_MS / 1000 + 2.2, ease: "linear" }
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
                </motion.div>
              );
            })}
        </motion.div>
      </motion.div>

      {/* Éclairage : vignette + chaleur en bas — profondeur premium */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_38%,transparent_55%,rgba(6,11,26,0.45)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-abyss/70 via-abyss/15 to-transparent" />

      {/* Loader luxe — visible tant que la 1re image n'est pas décodée */}
      <motion.div
        initial={false}
        animate={{ opacity: ready ? 0 : 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        style={{ pointerEvents: ready ? "none" : "auto" }}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-[#0b1424]"
      >
        <span className="lux-ring h-12 w-12" aria-hidden="true" />
        <span className="lux-pulse text-[10px] font-medium uppercase tracking-[0.42em] text-champagne">
          Le cabinet
        </span>
      </motion.div>

      {/* Légende + indicateurs */}
      <motion.div
        initial={false}
        animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 12 }}
        transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-x-4 bottom-4 z-10 flex items-end justify-between gap-3"
      >
        <span className="glass rounded-full px-4 py-1.5 text-xs font-medium text-white">
          {title}
        </span>

        {slides.length > 1 && (
          <div className="flex items-center gap-1.5 pb-1" role="tablist" aria-label={`Vues — ${title}`}>
            {slides.map((s, i) => (
              <button
                key={s.name}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={`Vue ${i + 1}`}
                onClick={() => setActive(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-500",
                  i === active
                    ? "w-6 bg-champagne"
                    : "w-1.5 bg-white/40 hover:bg-white/70",
                )}
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
