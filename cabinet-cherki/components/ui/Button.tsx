import type { AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ChevronRight } from "./icons";

/**
 * Boutons — d'après les HIG (Buttons) :
 * · « prominent » (teinte d'action) pour l'action la plus probable, une ou
 *   deux fois par vue au maximum ;
 * · « tinted » / « gray » pour les actions secondaires ;
 * · « glass » pour les contrôles posés sur une photo ;
 * · « destructive » (rouge) réservé à l'appel d'urgence.
 * Zone tactile ≥ 44 pt pour les tailles regular / large, état pressé visible.
 */
export type ButtonVariant =
  | "prominent"
  | "tinted"
  | "gray"
  | "glass"
  | "destructive"
  | "destructiveTinted";
export type ButtonSize = "large" | "regular" | "compact" | "small";

const base =
  "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-[transform,background-color,color,filter] duration-200 ease-ios active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 [-webkit-tap-highlight-color:transparent]";

const variants: Record<ButtonVariant, string> = {
  prominent: "bg-tint-fill text-on-tint hover:bg-tint-fill-hover active:brightness-95",
  tinted:
    "bg-tint-soft text-tint hover:bg-[color-mix(in_srgb,var(--tint)_17%,transparent)]",
  gray: "bg-fill-tertiary text-label hover:bg-fill-secondary",
  glass: "glass-clear text-white hover:bg-white/20",
  destructive: "bg-red-fill text-white hover:brightness-110 active:brightness-95",
  destructiveTinted:
    "bg-red-soft text-red hover:bg-[color-mix(in_srgb,var(--red)_16%,transparent)]",
};

const sizes: Record<ButtonSize, string> = {
  large: "h-[52px] px-7 text-headline [&>svg]:h-[1.1em] [&>svg]:w-[1.1em]",
  regular: "h-11 px-5 text-subheadline [&>svg]:h-[1.05em] [&>svg]:w-[1.05em]",
  /* Barre de navigation (pointeur) : 40 px, au-dessus du minimum de 28 pt. */
  compact: "h-10 px-5 text-subheadline [&>svg]:h-[1.05em] [&>svg]:w-[1.05em]",
  small: "h-9 px-4 text-footnote [&>svg]:h-[1.1em] [&>svg]:w-[1.1em]",
};

export function buttonStyles(
  variant: ButtonVariant = "prominent",
  size: ButtonSize = "regular",
  className?: string,
) {
  return cn(base, variants[variant], sizes[size], className);
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
};

/** Lien d'action façon Apple : « Prendre rendez-vous › ». */
export function ChevronLink({ className, children, ...props }: LinkProps) {
  return (
    <a
      {...props}
      className={cn(
        "group -my-2.5 inline-flex items-center gap-0.5 py-2.5 font-normal text-tint [-webkit-tap-highlight-color:transparent] hover:underline hover:decoration-1 hover:underline-offset-4",
        className,
      )}
    >
      {children}
      <ChevronRight className="h-[0.75em] w-[0.75em] translate-y-px transition-transform duration-200 ease-ios group-hover:translate-x-0.5" />
    </a>
  );
}
