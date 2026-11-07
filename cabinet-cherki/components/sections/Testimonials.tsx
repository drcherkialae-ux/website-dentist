"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { Container, Section, SectionHeader } from "@/components/ui/Section";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

const quote = (text: string) => `« ${text} »`;

/**
 * Avis : un seul avis lisible à la fois, choisi dans l'index des patients
 * (onglets, flèches du clavier). Tous les avis restent dans la page ; ils
 * sont superposés dans la même cellule, donc changer d'avis ne décale rien.
 */
export default function Testimonials() {
  const reviews = SITE.reviews;
  const [index, setIndex] = useState(() => Math.max(0, reviews.findIndex((r) => r.featured)));
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const last = reviews.length - 1;
    const next =
      e.key === "ArrowDown" || e.key === "ArrowRight"
        ? index === last ? 0 : index + 1
        : e.key === "ArrowUp" || e.key === "ArrowLeft"
          ? index === 0 ? last : index - 1
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? last
              : null;
    if (next === null) return;
    e.preventDefault();
    setIndex(next);
    tabs.current[next]?.focus();
  };

  return (
    <Section id="avis" tone="grouped" labelledBy="avis-title">
      <Container className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:grid-rows-[auto_1fr] lg:gap-x-20 lg:gap-y-12">
        <SectionHeader
          id="avis-title"
          eyebrow="Avis patients"
          title="Ils nous confient leur sourire."
          intro="Recommandé par ses patients à Témara, Rabat et alentours."
          className="lg:col-start-1 lg:row-start-1"
        />

        {/* Avis affiché (au-dessus de l'index sur téléphone, à droite sur ordinateur) */}
        <div
          id="avis-panneau"
          role="tabpanel"
          aria-labelledby={`avis-onglet-${index}`}
          className="grid lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center"
        >
          {reviews.map((r, i) => (
            <figure
              key={r.name}
              aria-hidden={i !== index}
              className={cn(
                "[grid-area:1/1] transition-[opacity,filter,visibility] duration-300 ease-out",
                i === index ? "visible opacity-100 blur-0" : "invisible opacity-0 blur-[3px]",
              )}
            >
              <blockquote className="font-display text-title1 font-normal text-label lg:text-display">
                {quote(r.text)}
              </blockquote>
              <figcaption className="mt-5 text-subheadline text-label-secondary">
                <span className="font-semibold text-label">{r.name}</span> · {r.city} ·{" "}
                {r.service}
              </figcaption>
            </figure>
          ))}
        </div>

        <div
          role="tablist"
          aria-label="Choisir un avis"
          aria-orientation="vertical"
          onKeyDown={onKeyDown}
          className="border-t border-separator lg:col-start-1 lg:row-start-2"
        >
          {reviews.map((r, i) => {
            const selected = i === index;
            return (
              <button
                key={r.name}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`avis-onglet-${i}`}
                aria-selected={selected}
                aria-controls="avis-panneau"
                tabIndex={selected ? 0 : -1}
                onClick={() => setIndex(i)}
                className={cn(
                  "group flex min-h-12 w-full items-center gap-3 border-b border-separator py-3 text-left transition-colors duration-200 [-webkit-tap-highlight-color:transparent]",
                  selected ? "text-label" : "text-label-secondary hover:text-label",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "h-px w-6 origin-left bg-current transition-[scale] duration-300 ease-out",
                    selected ? "scale-x-100" : "scale-x-0",
                  )}
                />
                <span className={cn("flex-1 text-body", selected && "font-semibold")}>{r.name}</span>
                <span className="text-footnote text-label-secondary">{r.service}</span>
              </button>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
