import { ChevronLink } from "@/components/ui/Button";
import { Container, Eyebrow, Section } from "@/components/ui/Section";
import { LQIP } from "@/lib/placeholders";
import { SITE } from "@/lib/site";

/* Portrait studio du docteur (1856 × 2304) */
const WIDTHS = [640, 1080, 1440];
const SIZES = "(min-width: 1024px) 46vw, 92vw";
const srcSet = (ext: "avif" | "webp") =>
  WIDTHS.map((w) => `/media/doctor-portrait-${w}.${ext} ${w}w`).join(", ");

export default function Doctor() {
  const role = SITE.brand.role.toLowerCase();

  return (
    <Section id="docteur" labelledBy="docteur-title">
      <Container className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-20">
        <figure className="relative aspect-[4/5] overflow-hidden rounded-tile bg-bg-secondary">
          <div
            aria-hidden="true"
            className="absolute inset-0 scale-110 bg-cover bg-center blur-2xl"
            style={{ backgroundImage: `url(${LQIP.doctorPortrait})` }}
          />
          <picture>
            <source type="image/avif" srcSet={srcSet("avif")} sizes={SIZES} />
            <source type="image/webp" srcSet={srcSet("webp")} sizes={SIZES} />
            <img
              src="/media/doctor-portrait-1080.webp"
              srcSet={srcSet("webp")}
              sizes={SIZES}
              width={1440}
              height={1788}
              alt={`Portrait du ${SITE.brand.doctor}, ${role}`}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </picture>
        </figure>

        <div>
          <Eyebrow>Le Docteur</Eyebrow>
          <h2 id="docteur-title" className="mt-5 font-display text-display">
            Un soin d&apos;exception, porté par une vision humaine.
          </h2>
          <p className="mt-5 text-lead text-label-secondary">
            {`${SITE.brand.doctor}, ${role} à Témara, a fondé un cabinet pensé autour d'une idée simple : des soins d'excellence, dans un cadre rassurant et profondément humain. Diagnostic précis, explications claires, et le temps qu'il faut pour chaque patient.`}
          </p>

          <figure className="mt-10 border-t border-separator pt-8">
            <blockquote className="font-display text-title1 font-normal text-label">
              {"« Chaque sourire raconte une histoire. Mon rôle est d'en prendre soin — avec précision, et avec bienveillance. »"}
            </blockquote>
            <figcaption className="mt-4 text-subheadline text-label-secondary">
              {SITE.brand.doctor} · {SITE.brand.role}
            </figcaption>
          </figure>

          <ChevronLink href="#rendez-vous" className="mt-8 text-body">
            Prendre rendez-vous
          </ChevronLink>
        </div>
      </Container>
    </Section>
  );
}
