"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLink } from "@/components/ui/Button";
import { Container, Eyebrow } from "@/components/ui/Section";
import { selectService } from "@/lib/events";
import type { Service } from "@/lib/site";
import type { ToothLayout, ToothScene } from "@/lib/tooth/scene";
import { cn } from "@/lib/utils";

/* Cadrage de la dent : à droite sur grand écran ; sur téléphone, entre la
   barre de navigation et le texte de l'étape. */
const layout = (w: number): ToothLayout =>
  w >= 1024 ? { x: 0.72, y: 0.54, height: 0.66 } : { x: 0.5, y: 0.27, height: 0.34 };

/**
 * Récit des soins : une dent en 3D reste à l'écran pendant que les étapes
 * défilent, et montre ce que change chaque soin. Le texte porte toute
 * l'information ; la scène est illustrative (aria-hidden) et ne se charge
 * qu'à l'approche de la section. Sans WebGL (ou en économie de données),
 * le texte reste seul. « Réduire les animations » : la dent change d'état
 * d'une étape à l'autre, sans mouvement continu.
 */
export default function ServiceStory({
  intro,
  services,
}: {
  intro: ReactNode;
  services: readonly Service[];
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stepsRef = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(-1);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    let scene: ToothScene | null = null;
    let disposed = false;
    let frame = 0;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    /** -1 pendant l'introduction, puis 0 … n-1 quand l'étape passe au centre. */
    const story = () => {
      const mid = window.innerHeight / 2;
      const centers = stepsRef.current.map((el) => {
        const r = el?.getBoundingClientRect();
        return r ? r.top + r.height / 2 : 0;
      });
      if (mid <= centers[0]) return -1;
      for (let i = 0; i < centers.length - 1; i++) {
        if (mid <= centers[i + 1]) {
          return i - 1 + (mid - centers[i]) / (centers[i + 1] - centers[i]);
        }
      }
      return centers.length - 2;
    };

    const update = () => {
      frame = 0;
      const u = story();
      setActive(Math.round(u));
      scene?.setStory(reduce.matches ? Math.round(u) : u, reduce.matches);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    schedule();

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const connection = (navigator as Navigator & { connection?: { saveData?: boolean } })
          .connection;
        if (connection?.saveData) return;
        import("@/lib/tooth/scene")
          .then(({ createToothScene }) => {
            if (disposed) return;
            const wide = window.innerWidth >= 1024;
            scene = createToothScene(canvas, {
              quality: wide && (navigator.hardwareConcurrency ?? 4) >= 4 ? "high" : "low",
              layout,
            });
            scene.setStory(story(), true);
            setReady(true);
          })
          .catch(() => {
            /* WebGL indisponible : le récit reste lisible sans la dent. */
          });
      },
      { rootMargin: "100% 0px" },
    );
    io.observe(root);

    const ro = new ResizeObserver(() => scene?.resize());
    ro.observe(canvas);

    return () => {
      disposed = true;
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
      scene?.dispose();
    };
  }, []);

  return (
    <div ref={rootRef} className="relative">
      {/* Scène : reste à l'écran pendant que les étapes défilent par-dessus. */}
      <div aria-hidden="true" className="sticky top-0 h-[100svh] overflow-hidden">
        <canvas
          ref={canvasRef}
          className={cn(
            "absolute inset-0 h-full w-full transition-opacity duration-1000 ease-out",
            ready ? "opacity-100" : "opacity-0",
          )}
        />
        {/* Téléphone : voile sous le texte, en bas de l'écran */}
        <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-abyss via-abyss/75 to-transparent lg:hidden" />
      </div>

      <div className="relative -mt-[100svh]">
        <div
          ref={(el) => {
            stepsRef.current[0] = el;
          }}
          className="flex min-h-[100svh] items-end pb-[14svh] lg:items-center lg:pb-0"
        >
          <Container>{intro}</Container>
        </div>

        <ol>
          {services.map((s, i) => (
            <li
              key={s.id}
              ref={(el) => {
                stepsRef.current[i + 1] = el;
              }}
              className="flex min-h-[92svh] items-end pb-[12svh] lg:items-center lg:pb-0"
            >
              <Container>
                <article
                  aria-labelledby={`soin-${s.id}`}
                  className={cn(
                    "max-w-[460px] transition-opacity duration-500 ease-out",
                    active === i ? "opacity-100" : "opacity-40",
                  )}
                >
                  {s.focus ? <Eyebrow>{s.focus}</Eyebrow> : null}
                  <h3 id={`soin-${s.id}`} className="mt-5 font-display text-large-title">
                    {s.name}
                  </h3>
                  <p className="mt-5 text-lead text-label">{s.short}</p>
                  <p className="mt-3 text-callout text-label-secondary">{s.description}</p>
                  <ChevronLink
                    href="#rendez-vous"
                    onClick={() => selectService(s.name)}
                    className="mt-6 text-body"
                  >
                    Prendre rendez-vous
                    <span className="sr-only"> — {s.name}</span>
                  </ChevronLink>
                </article>
              </Container>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
