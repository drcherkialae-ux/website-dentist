import ServiceStory from "@/components/ServiceStory";
import { buttonStyles } from "@/components/ui/Button";
import { Container, SectionHeader } from "@/components/ui/Section";
import { Phone } from "@/components/ui/icons";
import { SITE } from "@/lib/site";

/**
 * Soins : section toujours sombre (scène 3D), qui se termine sur l'urgence.
 * Les jetons de couleur y prennent leurs valeurs du mode sombre (.scheme-dark).
 */
export default function Services() {
  const emergency = SITE.services.find((s) => s.emergency);
  const story = SITE.services.filter((s) => !s.emergency);

  return (
    <section
      id="services"
      aria-labelledby="services-title"
      className="scheme-dark relative bg-abyss text-label"
    >
      <ServiceStory
        services={story}
        intro={
          <SectionHeader
            id="services-title"
            eyebrow="Nos soins"
            title="Chaque soin, vu de près."
            intro="Faites défiler : la dent montre ce que change chaque soin, de la radiographie à la couronne."
            className="max-w-[500px]"
          />
        }
      />

      {emergency && (
        <Container className="pb-20 sm:pb-24 lg:pb-32">
          <div className="flex flex-col gap-8 border-t border-separator pt-10 md:flex-row md:items-end md:justify-between">
            <div className="max-w-[620px]">
              <p className="flex items-center gap-2.5 text-footnote font-semibold uppercase tracking-[0.14em] text-red">
                <span aria-hidden="true" className="h-2 w-2 rounded-full bg-red" />
                {emergency.name}
              </p>
              <h3 id="service-urgence" className="mt-4 font-display text-title1 font-normal">
                {emergency.short}
              </h3>
              <p className="mt-3 text-body text-label-secondary">{emergency.description}</p>
            </div>
            <div className="flex shrink-0 flex-col items-start gap-2.5 md:items-end">
              <a
                href={`tel:${SITE.contact.drPhoneTel}`}
                className={buttonStyles("destructive", "large")}
              >
                <Phone />
                Appeler maintenant
              </a>
              <span className="text-footnote tabular-nums text-label-secondary">
                {SITE.contact.drPhoneDisplay} · jour et nuit
              </span>
            </div>
          </div>
        </Container>
      )}
    </section>
  );
}
