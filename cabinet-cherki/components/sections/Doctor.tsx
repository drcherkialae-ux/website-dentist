import Image from "next/image";
import Reveal from "@/components/motion/Reveal";
import Parallax from "@/components/motion/Parallax";
import { RdvButton } from "@/components/cta";
import { SITE } from "@/lib/site";

const chips = [
  "Approche multidisciplinaire",
  "Technologie fläsh",
  "Hygiène rigoureuse",
  "À votre écoute",
];

export default function Doctor() {
  return (
    <section id="docteur" className="relative overflow-hidden bg-white py-24 md:py-32">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-14 px-5 md:px-10 lg:grid-cols-2 lg:gap-20">
        {/* Composition visuelle */}
        <div className="relative">
          <div className="pointer-events-none absolute -left-10 -top-10 h-72 w-72 rounded-full bg-teal/15 blur-[90px]" />
          <Parallax amount={40}>
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] shadow-soft ring-1 ring-ink/5">
              <Image
                src="/media/working-pc.jpg"
                alt={`${SITE.brand.doctor} au cabinet`}
                fill
                sizes="(max-width: 1024px) 90vw, 45vw"
                className="object-cover"
              />
            </div>
          </Parallax>

          {/* Image incrustée */}
          <div className="absolute -bottom-8 -right-2 w-44 sm:w-52 lg:-right-8">
            <Parallax amount={-28}>
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-lift ring-4 ring-white">
                <Image
                  src="/media/working-chair.jpg"
                  alt={`${SITE.brand.doctor} en soin`}
                  fill
                  sizes="220px"
                  className="object-cover"
                />
              </div>
            </Parallax>
          </div>
        </div>

        {/* Texte */}
        <div>
          <Reveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-teal">
              Le Docteur
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-display mt-4 text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl lg:text-[2.9rem]">
              Un soin d&apos;exception, porté par une vision humaine.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-ink/65">
              {SITE.brand.doctor}, {SITE.brand.role.toLowerCase()} à Témara, a
              fondé un cabinet pensé autour d&apos;une idée simple : des soins
              d&apos;excellence, dans un cadre rassurant et profondément humain.
              Diagnostic précis, explications claires, et le temps qu&apos;il
              faut pour chaque patient.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <blockquote className="mt-8 border-l-2 border-teal/50 pl-5">
              <p className="font-serif text-xl italic leading-relaxed text-ink/80 sm:text-2xl">
                « Chaque sourire raconte une histoire. Mon rôle est d&apos;en
                prendre soin — avec précision, et avec bienveillance. »
              </p>
            </blockquote>
          </Reveal>

          <Reveal delay={0.2}>
            <ul className="mt-8 flex flex-wrap gap-2.5">
              {chips.map((c) => (
                <li
                  key={c}
                  className="rounded-full border border-ink/10 bg-mist px-4 py-2 text-sm text-ink/70"
                >
                  {c}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.25}>
            <div className="mt-9">
              <RdvButton />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
