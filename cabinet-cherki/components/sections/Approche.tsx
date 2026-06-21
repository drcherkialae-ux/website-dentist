import Reveal from "@/components/motion/Reveal";
import { SITE } from "@/lib/site";

export default function Approche() {
  return (
    <section
      id="approche"
      className="relative overflow-hidden bg-ink py-24 text-white md:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-aurora opacity-60" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[44rem] max-w-full -translate-x-1/2 rounded-full bg-teal/10 blur-[120px]" />

      <div className="relative mx-auto w-full max-w-7xl px-5 md:px-10">
        <div className="max-w-2xl">
          <Reveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-teal-light">
              Notre approche
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-display mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-[2.9rem]">
              La technologie, au service de l&apos;humain.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 text-base leading-relaxed text-white/65">
              Un cabinet où l&apos;exigence clinique rencontre l&apos;attention
              portée à chacun. Voici ce qui guide chaque geste.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/5 sm:grid-cols-2 lg:grid-cols-4">
          {SITE.approach.map((a, i) => (
            <Reveal
              key={a.title}
              delay={i * 0.08}
              className="group bg-ink/40 p-7 transition-colors duration-500 hover:bg-white/[0.06]"
            >
              <span className="font-display text-sm font-semibold text-teal-light/70">
                0{i + 1}
              </span>
              <h3 className="font-display mt-6 text-lg font-semibold tracking-tight">
                {a.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                {a.text}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
