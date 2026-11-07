import type { CSSProperties } from "react";
import AnchorLink from "@/components/AnchorLink";
import OpenStatus from "@/components/OpenStatus";
import { buttonStyles } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import { LQIP } from "@/lib/placeholders";

/* Réception du cabinet, plein écran (2528 × 1696) */
const WIDTHS = [768, 1280, 1920, 2528];
const srcSet = (ext: "avif" | "webp") =>
  WIDTHS.map((w) => `/media/reception-${w}.${ext} ${w}w`).join(", ");

/* Entrée en cascade, en CSS : le titre est visible sans attendre JavaScript. */
const delay = (s: number) => ({ "--enter-delay": `${s}s` }) as CSSProperties;

/**
 * Accueil plein écran. Mouvement lié au défilement uniquement (zoom léger
 * de la photo, fondu du texte) : il suit le geste et disparaît avec
 * « Réduire les animations » — cf. globals.css (.hero, .hero-media…).
 */
export default function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="hero relative isolate flex min-h-[100svh] overflow-hidden bg-abyss text-white"
    >
      <div className="hero-media absolute inset-0 -z-10 origin-[62%_40%]">
        <div
          aria-hidden="true"
          className="absolute inset-0 scale-110 bg-cover bg-center blur-2xl"
          style={{ backgroundImage: `url(${LQIP.reception})` }}
        />
        <picture>
          <source type="image/avif" srcSet={srcSet("avif")} sizes="100vw" />
          <source type="image/webp" srcSet={srcSet("webp")} sizes="100vw" />
          <img
            src="/media/reception-1920.webp"
            srcSet={srcSet("webp")}
            sizes="100vw"
            width={2528}
            height={1696}
            alt="L'accueil du cabinet dentaire du Dr. Alae Cherki, à Témara"
            fetchPriority="high"
            loading="eager"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-[62%_46%]"
          />
        </picture>
      </div>

      {/* Voiles de lisibilité : texte à gauche, barre en haut, base de l'écran */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-abyss/85 via-abyss/40 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-gradient-to-t from-abyss/90 via-abyss/35 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-abyss/60 to-transparent"
      />

      <Container className="flex items-end pb-[clamp(48px,11vh,120px)] pt-32">
        <div className="hero-copy max-w-[660px]">
          <p className="enter text-headline text-white/80" style={delay(0.05)}>
            Cabinet dentaire · Témara
          </p>

          <h1 id="hero-title" className="enter mt-4 font-display text-hero" style={delay(0.12)}>
            Dr. Alae <span className="block text-champagne">Cherki</span>
          </h1>

          <p
            className="enter mt-5 max-w-[560px] text-lead text-white/85"
            style={delay(0.2)}
          >
            Dentisterie esthétique et multidisciplinaire. Là où l&apos;excellence
            médicale rencontre l&apos;art de recevoir.
          </p>

          <div
            className="enter mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
            style={delay(0.28)}
          >
            <AnchorLink href="#rendez-vous" className={buttonStyles("prominent", "large")}>
              Prendre rendez-vous
            </AnchorLink>
            <AnchorLink href="#cabinet" className={buttonStyles("glass", "large")}>
              Découvrir le cabinet
            </AnchorLink>
          </div>

          <p
            className="enter mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-subheadline text-white/80"
            style={delay(0.36)}
          >
            <OpenStatus onMedia />
            <span className="inline-flex items-center gap-2">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-red" />
              Urgences 24h/24
            </span>
          </p>
        </div>
      </Container>
    </section>
  );
}
