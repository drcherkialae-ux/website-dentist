"use client";

import { useLenis } from "lenis/react";
import { motion, useReducedMotion } from "motion/react";
import { SITE, type Service } from "@/lib/site";
import { selectService } from "@/lib/events";
import { cn } from "@/lib/utils";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

function Icon({ id }: { id: string }) {
  const common = {
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    "aria-hidden": true,
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (id) {
    case "urgence":
      return (
        <svg {...common}>
          <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
        </svg>
      );
    case "consultation":
      return (
        <svg {...common}>
          <path d="M9 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
          <path d="M9 8h6M9 12h6M9 16h3" />
        </svg>
      );
    case "esthetique":
      return (
        <svg {...common}>
          <path d="M12 3c1.2 3 2.8 4.6 5.8 5.8-3 1.2-4.6 2.8-5.8 5.8-1.2-3-2.8-4.6-5.8-5.8C9.2 7.6 10.8 6 12 3Z" />
          <path d="M18.5 15.5c.5 1.2 1.1 1.8 2.3 2.3-1.2.5-1.8 1.1-2.3 2.3-.5-1.2-1.1-1.8-2.3-2.3 1.2-.5 1.8-1.1 2.3-2.3Z" />
        </svg>
      );
    case "prothese":
      return (
        <svg {...common}>
          <path d="M7 4c-2.2 0-3.5 1.8-3 4.5.4 2 .3 3 .8 5 .5 2.2 1 4.5 2.2 4.5 1.1 0 1.2-2.5 3-2.5s1.9 2.5 3 2.5c1.2 0 1.7-2.3 2.2-4.5.5-2 .4-3 .8-5C19.5 5.8 18.2 4 16 4c-1.6 0-2.4.9-4 .9S8.6 4 7 4Z" />
        </svg>
      );
    case "pediatrie":
      return (
        <svg {...common}>
          <path d="M12 21s-7-4.3-7-9.5A4.5 4.5 0 0 1 12 8a4.5 4.5 0 0 1 7 3.5C19 16.7 12 21 12 21Z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Services() {
  const lenis = useLenis();
  const reduce = useReducedMotion();

  const goToRdv = (service: Service) => {
    selectService(service.name);
    const el = document.querySelector("#rendez-vous");
    if (el) {
      if (lenis) lenis.scrollTo(el as HTMLElement, { offset: -76 });
      else el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="services" className="relative bg-mist py-24 md:py-32">
      <div className="mx-auto w-full max-w-7xl px-5 md:px-10">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-teal">
            Nos services
          </p>
          <h2 className="font-display mt-4 text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl lg:text-[2.9rem]">
            Une expertise complète, sous un même toit.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-ink/60">
            De l&apos;urgence à l&apos;esthétique, chaque soin est pensé comme
            une étape vers votre confort et votre confiance.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SITE.services.map((service, i) => {
            const isUrgence = service.emergency;
            return (
              <motion.article
                key={service.id}
                initial={reduce ? false : { opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                transition={{ duration: 0.7, delay: i * 0.07, ease }}
                className={cn(
                  "group relative flex flex-col rounded-3xl p-7 transition-all duration-500",
                  isUrgence
                    ? "bg-ink text-white shadow-lift ring-1 ring-white/10"
                    : "bg-white text-ink shadow-soft ring-1 ring-ink/5 hover:-translate-y-1 hover:shadow-lift",
                )}
              >
                {isUrgence && (
                  <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-teal/20 blur-3xl" />
                )}
                <div
                  className={cn(
                    "relative flex h-12 w-12 items-center justify-center rounded-2xl",
                    isUrgence ? "bg-teal/20 text-teal-light" : "bg-mist text-teal",
                  )}
                >
                  <Icon id={service.id} />
                </div>

                <h3 className="font-display relative mt-6 text-xl font-semibold tracking-tight">
                  {service.name}
                </h3>
                <p
                  className={cn(
                    "relative mt-2 text-sm font-medium",
                    isUrgence ? "text-teal-light" : "text-teal",
                  )}
                >
                  {service.short}
                </p>
                <p
                  className={cn(
                    "relative mt-3 flex-1 text-sm leading-relaxed",
                    isUrgence ? "text-white/65" : "text-ink/60",
                  )}
                >
                  {service.description}
                </p>

                <div className="relative mt-7">
                  {isUrgence ? (
                    <a
                      href={`tel:${SITE.contact.drPhoneTel}`}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-teal px-6 text-sm font-semibold text-white transition hover:brightness-110"
                    >
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                      </span>
                      Appeler maintenant
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => goToRdv(service)}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink transition-colors hover:text-teal"
                    >
                      Prendre rendez-vous
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                        <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
