import { Container, Section, SectionHeader } from "@/components/ui/Section";
import { LQIP } from "@/lib/placeholders";
import { SITE } from "@/lib/site";

/* Le docteur au fauteuil (960 × 1280) */
const WIDTHS = [480, 800];
const SIZES = "(min-width: 1024px) 40vw, 92vw";
const srcSet = (ext: "avif" | "webp") =>
  WIDTHS.map((w) => `/media/working-chair-${w}.${ext} ${w}w`).join(", ");

/** Quatre engagements en liste éditoriale (titre, texte) : une photo réelle, pas de pictogrammes. */
export default function Approche() {
  return (
    <Section id="approche" tone="grouped" labelledBy="approche-title">
      <Container>
        <SectionHeader
          id="approche-title"
          eyebrow="Notre approche"
          title="La technologie, au service de l'humain."
          intro="Un cabinet où l'exigence clinique rencontre l'attention portée à chacun. Voici ce qui guide chaque geste."
        />

        <div className="mt-14 grid items-start gap-12 lg:mt-20 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
          <figure className="relative aspect-[4/5] overflow-hidden rounded-tile bg-bg-secondary lg:sticky lg:top-28">
            <div
              aria-hidden="true"
              className="absolute inset-0 scale-110 bg-cover bg-center blur-2xl"
              style={{ backgroundImage: `url(${LQIP.workingChair})` }}
            />
            <picture>
              <source type="image/avif" srcSet={srcSet("avif")} sizes={SIZES} />
              <source type="image/webp" srcSet={srcSet("webp")} sizes={SIZES} />
              <img
                src="/media/working-chair-800.webp"
                srcSet={srcSet("webp")}
                sizes={SIZES}
                width={960}
                height={1280}
                alt={`${SITE.brand.doctor} en soin, au fauteuil`}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover object-[50%_42%]"
              />
            </picture>
          </figure>

          <ul className="border-t border-separator">
            {SITE.approach.map((item) => (
              <li
                key={item.title}
                className="border-b border-separator py-8 sm:grid sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] sm:gap-10 sm:py-10"
              >
                <h3 className="font-display text-title1 font-normal">{item.title}</h3>
                <p className="mt-3 text-body text-label-secondary sm:mt-1">{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
