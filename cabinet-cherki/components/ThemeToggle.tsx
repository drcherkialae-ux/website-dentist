"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/**
 * Bascule clair / sombre. Le thème est posé sur <html data-theme> avant
 * l'affichage (script dans layout.tsx) : réglage de l'appareil par défaut,
 * puis le choix de la personne, mémorisé. Changement en fondu enchaîné
 * (View Transitions) sauf avec « Réduire les animations ».
 */
type Theme = "light" | "dark";
const EVENT = "themechange";
const KEY = "theme";

const stored = (): Theme | null => {
  try {
    const t = localStorage.getItem(KEY);
    return t === "light" || t === "dark" ? t : null;
  } catch {
    return null;
  }
};

const subscribe = (onChange: () => void) => {
  const system = window.matchMedia("(prefers-color-scheme: dark)");
  // Sans choix mémorisé, on suit l'appareil s'il change en cours de visite.
  const onSystem = () => {
    if (stored()) return;
    document.documentElement.dataset.theme = system.matches ? "dark" : "light";
    onChange();
  };
  window.addEventListener(EVENT, onChange);
  system.addEventListener("change", onSystem);
  return () => {
    window.removeEventListener(EVENT, onChange);
    system.removeEventListener("change", onSystem);
  };
};

const read = (): Theme => (document.documentElement.dataset.theme === "dark" ? "dark" : "light");

export default function ThemeToggle({ onMedia = false }: { onMedia?: boolean }) {
  // null côté serveur : l'icône n'apparaît qu'une fois le thème connu.
  const theme = useSyncExternalStore(subscribe, read, () => null);
  const dark = theme === "dark";

  const toggle = () => {
    const next: Theme = dark ? "light" : "dark";
    const apply = () => {
      document.documentElement.dataset.theme = next;
      try {
        localStorage.setItem(KEY, next);
      } catch {
        /* navigation privée : le choix vaut pour la visite */
      }
      window.dispatchEvent(new Event(EVENT));
    };
    const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (doc.startViewTransition && !reduce) doc.startViewTransition(apply);
    else apply();
  };

  const icon = "absolute h-5 w-5 transition-[opacity,scale,rotate] duration-300 ease-out";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={theme === null ? undefined : dark}
      aria-label="Mode sombre"
      title={dark ? "Passer en mode clair" : "Passer en mode sombre"}
      className={cn(
        "relative grid h-11 w-11 place-items-center rounded-full transition-[background-color,transform] duration-200 active:scale-95 lg:h-10 lg:w-10",
        onMedia ? "hover:bg-white/15" : "hover:bg-fill-tertiary",
      )}
    >
      <Sun
        className={cn(
          icon,
          theme === "light" ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-50 opacity-0",
        )}
      />
      <Moon
        className={cn(icon, dark ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-50 opacity-0")}
      />
    </button>
  );
}
