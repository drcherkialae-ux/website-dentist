import Reveal from "@/components/motion/Reveal";
import { SITE } from "@/lib/site";

function Stars() {
  return (
    <div className="flex gap-0.5 text-teal" aria-label="5 sur 5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="m12 17.3-6.18 3.7 1.64-7.03L2 9.24l7.19-.61L12 2l2.81 6.63 7.19.61-5.46 4.73L18.18 21z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section id="avis" className="relative overflow-hidden bg-mist py-24 md:py-32">
      <div className="mx-auto w-full max-w-7xl px-5 md:px-10">
        <div className="max-w-2xl">
          <Reveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-teal">
              Avis patients
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-display mt-4 text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl lg:text-[2.9rem]">
              Ils nous confient leur sourire.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 text-base leading-relaxed text-ink/60">
              Recommandé par ses patients à Témara, Rabat et alentours.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
          {SITE.reviews.map((r, i) => (
            <Reveal key={r.name} delay={(i % 3) * 0.08} className="break-inside-avoid">
              <figure className="rounded-3xl bg-white p-7 shadow-soft ring-1 ring-ink/5">
                <Stars />
                <blockquote className="mt-4 text-[15px] leading-relaxed text-ink/75">
                  « {r.text} »
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-navy to-teal text-sm font-semibold text-white">
                    {r.name.charAt(0)}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-ink">
                      {r.name}
                    </span>
                    <span className="block text-xs text-ink/50">
                      {r.city} · {r.service}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
