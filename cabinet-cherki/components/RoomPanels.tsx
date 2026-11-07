"use client";

import { useRef, useState } from "react";
import RoomTour, { type TourSlide } from "@/components/RoomTour";
import { LQIP } from "@/lib/placeholders";
import { cn } from "@/lib/utils";

export type Room = {
  id: string;
  title: string;
  caption: string;
  slides: TourSlide[];
  widths: number[];
  imgW: number;
  imgH: number;
};

/**
 * Le cabinet pièce par pièce : toutes les pièces côte à côte, comme des
 * portes le long d'un couloir. Une seule est ouverte ; survoler (souris) ou
 * toucher une pièce l'ouvre. Sur téléphone, les pièces s'empilent.
 */
export default function RoomPanels({ rooms, initial = 0 }: { rooms: Room[]; initial?: number }) {
  const [open, setOpen] = useState(initial);
  const intent = useRef<number | undefined>(undefined);
  const pending = useRef<number | null>(null);
  const items = useRef<(HTMLLIElement | null)[]>([]);

  // Survol : seulement quand la souris bouge vraiment (pas quand la page
  // défile sous un curseur immobile), avec une petite intention avant d'ouvrir.
  const hover = (i: number) => {
    if (pending.current === i) return;
    window.clearTimeout(intent.current);
    pending.current = i;
    intent.current = window.setTimeout(() => {
      pending.current = null;
      setOpen(i);
    }, 130);
  };
  const cancel = () => {
    window.clearTimeout(intent.current);
    pending.current = null;
  };

  const openRoom = (i: number) => {
    cancel();
    setOpen(i);
    const el = items.current[i];
    // Le bouton disparaît : le focus passe à la pièce ouverte.
    requestAnimationFrame(() => el?.focus({ preventScroll: true }));
    // Téléphone (pièces empilées) : la pièce du dessus se referme et le
    // contenu remonte ; on ramène la pièce ouverte au centre une fois dépliée.
    if (el && window.matchMedia("(max-width: 1023px)").matches) {
      const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const center = () => el.scrollIntoView({ block: "center", behavior: smooth ? "smooth" : "auto" });
      if (!smooth) {
        requestAnimationFrame(center);
        return;
      }
      // Attendre la fin du dépliage (hauteur finale connue), avec un filet de sécurité.
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        el.removeEventListener("transitionend", onEnd);
        center();
      };
      const onEnd = (e: TransitionEvent) => {
        if (e.target === el && e.propertyName === "height") finish();
      };
      el.addEventListener("transitionend", onEnd);
      window.setTimeout(finish, 900);
    }
  };

  return (
    <ul className="mx-auto flex max-w-[1600px] flex-col gap-2 px-3 sm:px-4 lg:h-[min(80svh,760px)] lg:flex-row lg:gap-3">
      {rooms.map((room, i) => {
        const isOpen = i === open;
        return (
          <li
            key={room.id}
            ref={(el) => {
              items.current[i] = el;
            }}
            tabIndex={-1}
            onPointerMove={(e) => {
              if (e.pointerType === "mouse" && !isOpen && (e.movementX || e.movementY)) hover(i);
            }}
            onPointerLeave={cancel}
            className={cn(
              "relative overflow-hidden rounded-tile bg-bg-secondary outline-none transition-[flex-grow,height] duration-500 ease-in-out lg:h-auto lg:basis-0",
              isOpen ? "h-[min(62svh,560px)] lg:grow-[9]" : "h-[72px] lg:grow",
            )}
          >
            <RoomTour
              slides={room.slides}
              title={room.title}
              caption={room.caption}
              active={isOpen}
              widths={room.widths}
              sizes="(min-width: 1024px) 66vw, 96vw"
              imgW={room.imgW}
              imgH={room.imgH}
              placeholder={LQIP[room.slides[0].name]}
              className="h-full w-full"
            />

            {/* Pièce fermée : toute la surface ouvre la pièce. */}
            <button
              type="button"
              onClick={() => openRoom(i)}
              aria-label={`Visiter : ${room.title}`}
              className={cn(
                "absolute inset-0 flex items-center bg-gradient-to-t from-black/65 via-black/30 to-black/10 text-white transition-opacity duration-300 ease-out [-webkit-tap-highlight-color:transparent] lg:items-end lg:justify-center lg:pb-7",
                isOpen ? "invisible opacity-0" : "opacity-100 hover:from-black/55",
              )}
            >
              <span className="px-5 font-display text-title3 font-normal lg:rotate-180 lg:px-0 lg:text-title2 lg:[writing-mode:vertical-rl]">
                {room.title}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
