"use client";

import { useSyncExternalStore } from "react";
import { clinicNow, getOpenState, type OpenTone } from "@/lib/hours";
import { cn } from "@/lib/utils";

/* Horloge partagée : rafraîchie toutes les 30 s, absente côté serveur
   (l'export statique ne doit pas figer une heure de génération). */
const subscribe = (onChange: () => void) => {
  const t = setInterval(onChange, 30_000);
  return () => clearInterval(t);
};
const readStatus = () => {
  const s = getOpenState();
  return `${s.tone}|${s.label}`;
};
const readToday = () => clinicNow().day;

/** Jour courant (0 = dimanche) dans le fuseau du cabinet, ou -1 côté serveur. */
export function useClinicToday() {
  return useSyncExternalStore(subscribe, readToday, () => -1);
}

const dot: Record<OpenTone, string> = {
  open: "bg-green",
  closing: "bg-orange",
  closed: "bg-label-tertiary",
};

/**
 * Statut d'ouverture intégré à l'interface (HIG — Feedback : afficher
 * l'état de façon passive, là où on en a besoin).
 */
export default function OpenStatus({
  className,
  onMedia = false,
}: {
  className?: string;
  onMedia?: boolean;
}) {
  const snapshot = useSyncExternalStore(subscribe, readStatus, () => "");

  // Côté serveur (et avant l'hydratation) : rien, pour ne pas décaler la
  // ligne avec un espace vide. Le statut apparaît pendant le fondu d'entrée.
  if (!snapshot) return null;

  const [tone, label] = snapshot.split("|") as [OpenTone, string];
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span
        aria-hidden="true"
        className={cn(
          "h-2 w-2 shrink-0 rounded-full",
          tone === "closed" && onMedia ? "bg-white/50" : dot[tone],
        )}
      />
      {label}
    </span>
  );
}
