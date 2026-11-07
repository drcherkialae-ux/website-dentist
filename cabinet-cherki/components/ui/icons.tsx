import type { SVGProps } from "react";

/**
 * Pictogrammes maison, dessinés dans l'esprit des SF Symbols (grille 24,
 * trait unique, extrémités arrondies). Les SF Symbols eux-mêmes sont
 * réservés aux apps des plateformes Apple : on ne les embarque pas sur le web.
 */
type IconProps = SVGProps<SVGSVGElement>;

function Glyph({ children, strokeWidth = 1.75, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

/* ----------------------------- Actions ------------------------------ */

export const ChevronRight = (p: IconProps) => (
  <Glyph strokeWidth={2.25} {...p}>
    <path d="m9.5 5.5 6.5 6.5-6.5 6.5" />
  </Glyph>
);

export const ChevronDown = (p: IconProps) => (
  <Glyph strokeWidth={2.25} {...p}>
    <path d="m6 9.5 6 6 6-6" />
  </Glyph>
);

export const ArrowUpRight = (p: IconProps) => (
  <Glyph strokeWidth={2} {...p}>
    <path d="M7 17 17 7M9 7h8v8" />
  </Glyph>
);

export const Menu = (p: IconProps) => (
  <Glyph strokeWidth={2} {...p}>
    <path d="M4.5 9h15M4.5 15h15" />
  </Glyph>
);

export const Close = (p: IconProps) => (
  <Glyph strokeWidth={2} {...p}>
    <path d="m6.5 6.5 11 11M17.5 6.5l-11 11" />
  </Glyph>
);

export const Check = (p: IconProps) => (
  <Glyph strokeWidth={2.25} {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Glyph>
);

export const CheckCircle = (p: IconProps) => (
  <Glyph {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="m8.25 12.25 2.5 2.5 5-5" />
  </Glyph>
);

export const Exclamation = (p: IconProps) => (
  <Glyph {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5v5.25" />
    <circle cx="12" cy="16.25" r="0.6" fill="currentColor" />
  </Glyph>
);

export const Lock = (p: IconProps) => (
  <Glyph {...p}>
    <rect x="5" y="10.5" width="14" height="10" rx="2.5" />
    <path d="M8.25 10.5V8a3.75 3.75 0 0 1 7.5 0v2.5" />
  </Glyph>
);

/* ---------------------------- Contact ------------------------------- */

export const Phone = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" {...p}>
    <path d="M6.6 10.8a13.4 13.4 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24c1.1.36 2.3.56 3.5.56a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.3a1 1 0 0 1 1 1c0 1.2.2 2.4.56 3.5a1 1 0 0 1-.24 1l-2.2 2.3Z" />
  </svg>
);

export const Message = (p: IconProps) => (
  <Glyph {...p}>
    <path d="M12 3.5a8.5 8.5 0 0 0-7.4 12.7L3.5 20.5l4.4-1.1A8.5 8.5 0 1 0 12 3.5Z" />
  </Glyph>
);

export const MapPin = (p: IconProps) => (
  <Glyph {...p}>
    <path d="M12 21s-6.75-5.1-6.75-10.75a6.75 6.75 0 0 1 13.5 0C18.75 15.9 12 21 12 21Z" />
    <circle cx="12" cy="10.25" r="2.4" />
  </Glyph>
);

export const Clock = (p: IconProps) => (
  <Glyph {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.25 2" />
  </Glyph>
);

export const Instagram = (p: IconProps) => (
  <Glyph strokeWidth={1.6} {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="3.9" />
    <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
  </Glyph>
);

export const Star = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" {...p}>
    <path d="m12 17.3-6.18 3.7 1.64-7.03L2 9.24l7.19-.61L12 2l2.81 6.63 7.19.61-5.46 4.73L18.18 21z" />
  </svg>
);

/* ------------------------ Soins & approche -------------------------- */

/** Trousse médicale : urgence. */
export const MedicalCase = (p: IconProps) => (
  <Glyph {...p}>
    <rect x="3" y="7" width="18" height="13" rx="3" />
    <path d="M9 7V5.75C9 4.78 9.78 4 10.75 4h2.5c.97 0 1.75.78 1.75 1.75V7" />
    <path d="M12 10.75v5.5M9.25 13.5h5.5" />
  </Glyph>
);

/** Stéthoscope : consultation. */
export const Stethoscope = (p: IconProps) => (
  <Glyph {...p}>
    <path d="M6.5 3.5H5v5a5 5 0 0 0 10 0v-5h-1.5" />
    <path d="M10 13.5V15a5 5 0 0 0 10 0v-2.25" />
    <circle cx="20" cy="10.75" r="2" />
  </Glyph>
);

/** Étincelles : esthétique. */
export const Sparkles = (p: IconProps) => (
  <Glyph {...p}>
    <path d="M11 3.5c1.1 2.9 2.6 4.4 5.5 5.5-2.9 1.1-4.4 2.6-5.5 5.5-1.1-2.9-2.6-4.4-5.5-5.5 2.9-1.1 4.4-2.6 5.5-5.5Z" />
    <path d="M18 14.5c.55 1.35 1.15 1.95 2.5 2.5-1.35.55-1.95 1.15-2.5 2.5-.55-1.35-1.15-1.95-2.5-2.5 1.35-.55 1.95-1.15 2.5-2.5Z" />
  </Glyph>
);

/** Dent : prothèse. */
export const Tooth = (p: IconProps) => (
  <Glyph {...p}>
    <path d="M7.5 3.75c-2.4 0-3.9 2-3.35 4.9.4 2.1.35 3.2.85 5.25.55 2.35 1.1 4.6 2.35 4.6 1.2 0 1.3-2.6 3.15-2.6h3c1.85 0 1.95 2.6 3.15 2.6 1.25 0 1.8-2.25 2.35-4.6.5-2.05.45-3.15.85-5.25.55-2.9-.95-4.9-3.35-4.9-1.7 0-2.6 1-4.5 1s-2.8-1-4.5-1Z" />
  </Glyph>
);

/** Visage souriant : pédiatrie. */
export const Smile = (p: IconProps) => (
  <Glyph {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8.25 14c.9 1.35 2.15 2 3.75 2s2.85-.65 3.75-2" />
    <circle cx="9" cy="9.75" r="0.75" fill="currentColor" stroke="none" />
    <circle cx="15" cy="9.75" r="0.75" fill="currentColor" stroke="none" />
  </Glyph>
);

/** Quatre pôles réunis : approche multidisciplinaire. */
export const Specialties = (p: IconProps) => (
  <Glyph {...p}>
    <rect x="3.5" y="3.5" width="7" height="7" rx="2" />
    <rect x="13.5" y="3.5" width="7" height="7" rx="2" />
    <rect x="3.5" y="13.5" width="7" height="7" rx="2" />
    <rect x="13.5" y="13.5" width="7" height="7" rx="3.5" />
  </Glyph>
);

/** Écran d'imagerie : technologie. */
export const Imaging = (p: IconProps) => (
  <Glyph {...p}>
    <rect x="3" y="4" width="18" height="12.5" rx="2.5" />
    <path d="M9 20h6M12 16.5V20" />
    <path d="M6.5 10.5h2.25l1.5-3 2.75 6 1.5-3h3" />
  </Glyph>
);

/** Bouclier coché : hygiène. */
export const ShieldCheck = (p: IconProps) => (
  <Glyph {...p}>
    <path d="M12 3 5 5.75v5.5c0 4.35 2.95 8.2 7 9.5 4.05-1.3 7-5.15 7-9.5v-5.5L12 3Z" />
    <path d="m9 12.25 2.1 2.1L15.25 10" />
  </Glyph>
);

/** Deux bulles : écoute et explications. */
export const Conversation = (p: IconProps) => (
  <Glyph {...p}>
    <path d="M14.5 9.5h3A2.5 2.5 0 0 1 20 12v4.25a2.5 2.5 0 0 1-2.5 2.5H17v2l-2.75-2H12A2.5 2.5 0 0 1 9.5 16.25V15.5" />
    <path d="M6.25 3.5h6a2.25 2.25 0 0 1 2.25 2.25v5.5a2.25 2.25 0 0 1-2.25 2.25H9l-3.25 2.5V13.5h.5A2.25 2.25 0 0 1 4 11.25v-5.5A2.25 2.25 0 0 1 6.25 3.5Z" />
  </Glyph>
);

/* ------------------------------ Thème ------------------------------- */

export const Sun = (p: IconProps) => (
  <Glyph {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.9v2.2M12 18.9v2.2M2.9 12h2.2M18.9 12h2.2M5.57 5.57l1.56 1.56M16.87 16.87l1.56 1.56M5.57 18.43l1.56-1.56M16.87 7.13l1.56-1.56" />
  </Glyph>
);

/* Croissant : disque de rayon 8,5 entamé par un second disque décalé. */
export const Moon = (p: IconProps) => (
  <Glyph {...p}>
    <path d="M20.25 14.5A8.5 8.5 0 0 1 9.5 3.75a8.5 8.5 0 1 0 10.75 10.75Z" />
  </Glyph>
);
