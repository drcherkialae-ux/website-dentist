"use client";

import { buttonStyles } from "@/components/ui/Button";
import { Container, Eyebrow, Section } from "@/components/ui/Section";
import { CheckCircle } from "@/components/ui/icons";
import { selectService } from "@/lib/events";
import { LQIP } from "@/lib/placeholders";

const benefits = [
  "Résultat visible dès la première séance",
  "Jusqu'à 3 à 8 teintes plus claires",
  "Séance de 45 à 60 minutes",
  "Convient aussi aux dents sensibles",
];

export default function BeforeAfter() {
  return (
    <Section id="resultats" tone="grouped" labelledBy="resultats-title">
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="lg:order-2">
          <figure>
            <div className="relative aspect-[1152/1434] overflow-hidden rounded-tile bg-bg-secondary">
              <div
                aria-hidden="true"
                className="absolute inset-0 scale-110 bg-cover bg-center blur-2xl"
                style={{ backgroundImage: `url(${LQIP.beforeAfter})` }}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/media/before-after-1152.webp"
                width={1152}
                height={1434}
                alt="Blanchiment dentaire réalisé au cabinet : à gauche le sourire avant la séance, à droite après."
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <figcaption className="mt-3 grid grid-cols-2 px-1 text-footnote text-label-secondary">
              <span>Avant</span>
              <span className="text-right">Après</span>
            </figcaption>
          </figure>
        </div>

        <div>
          <Eyebrow>Résultats</Eyebrow>
          <h2 id="resultats-title" className="mt-5 font-display text-display">
            Blanchiment fläsh : un sourire éclatant, en une séance.
          </h2>
          <p className="mt-5 text-lead text-label-secondary">
            Une technologie de blanchiment professionnelle, contrôlée et sans
            risque pour l&apos;émail. Un résultat naturel et immédiat, pensé pour
            sublimer votre sourire sans le dénaturer.
          </p>

          <ul className="mt-8 border-t border-separator">
            {benefits.map((b) => (
              <li
                key={b}
                className="flex items-center gap-3 border-b border-separator py-3.5 text-body"
              >
                <CheckCircle className="h-[22px] w-[22px] shrink-0 text-brand" />
                {b}
              </li>
            ))}
          </ul>

          <a
            href="#rendez-vous"
            onClick={() => selectService("Dentisterie esthétique")}
            className={buttonStyles("prominent", "regular", "mt-9")}
          >
            Réserver un blanchiment
          </a>
        </div>
      </Container>
    </Section>
  );
}
