import Reveal from "@/components/motion/Reveal";
import RoomTour, { type TourSlide } from "@/components/RoomTour";

/* Formats 16:9 (2752 × 1536) — salles */
const LANDSCAPE = { widths: [960, 1440, 1920], imgW: 2752, imgH: 1536 };
/* Format portrait (1696 × 2528) — radio panoramique */
const PORTRAIT = { widths: [640, 1080, 1440], imgW: 1696, imgH: 2528 };

type Tile = {
  title: string;
  slides: TourSlide[];
  widths: number[];
  sizes: string;
  imgW: number;
  imgH: number;
  span: string;
};

const tiles: Tile[] = [
  {
    title: "Salle d'attente",
    ...LANDSCAPE,
    sizes: "(max-width: 767px) 94vw, 55vw",
    span: "md:col-span-7 md:row-span-2",
    slides: [
      { name: "salle-1", alt: "Salle d'attente du cabinet — vue d'ensemble", from: 1.08, to: 1.18, drift: -16 },
      { name: "salle-2", alt: "Canapé en velours camel baigné de lumière", from: 1.06, to: 1.16, drift: 14 },
      { name: "salle-3", alt: "Fauteuil moutarde et table basse du salon d'accueil", from: 1.1, to: 1.2, drift: -12 },
      { name: "salle-4", alt: "Bougainvillier et ambiance feutrée de la salle d'attente", from: 1.06, to: 1.17, drift: 12 },
    ],
  },
  {
    title: "Radiologie panoramique",
    ...PORTRAIT,
    sizes: "(max-width: 767px) 94vw, 40vw",
    span: "md:col-span-5 md:row-span-4",
    slides: [
      { name: "radio-1", alt: "Radio panoramique NewTom GO — vue d'ensemble", from: 1.08, to: 1.18, drift: -12 },
      { name: "radio-2", alt: "Bras de la radio panoramique NewTom GO", from: 1.06, to: 1.16, drift: 12 },
      { name: "radio-3", alt: "Support de positionnement du patient", from: 1.1, to: 1.2, drift: -10 },
      { name: "radio-4", alt: "Console de commande de la radiographie", from: 1.06, to: 1.16, drift: 10 },
    ],
  },
  {
    title: "Salle de soin 1",
    ...LANDSCAPE,
    sizes: "(max-width: 767px) 94vw, 55vw",
    span: "md:col-span-7 md:row-span-2",
    slides: [
      { name: "soin-a-1", alt: "Salle de soin — vue d'ensemble lumineuse", from: 1.08, to: 1.18, drift: 14 },
      { name: "soin-a-2", alt: "Fauteuil de soin et écran de contrôle", from: 1.06, to: 1.16, drift: -14 },
      { name: "soin-a-3", alt: "Salle de soin vue en plongée", from: 1.1, to: 1.2, drift: 12 },
      { name: "soin-a-4", alt: "Instruments de l'unité dentaire", from: 1.06, to: 1.17, drift: -12 },
    ],
  },
  {
    title: "Salle de soin 2",
    ...LANDSCAPE,
    sizes: "(max-width: 767px) 94vw, 55vw",
    span: "md:col-span-7 md:row-span-2",
    slides: [
      { name: "soin-b-1", alt: "Seconde salle de soin — vue d'ensemble", from: 1.08, to: 1.18, drift: -14 },
      { name: "soin-b-2", alt: "Fauteuil de soin et rangements", from: 1.06, to: 1.16, drift: 14 },
      { name: "soin-b-3", alt: "Fauteuil de la seconde salle vu en plongée", from: 1.1, to: 1.2, drift: -12 },
      { name: "soin-b-4", alt: "Tablette d'instruments de l'unité de soin", from: 1.06, to: 1.17, drift: 12 },
    ],
  },
  {
    title: "Stérilisation",
    ...LANDSCAPE,
    sizes: "(max-width: 767px) 94vw, 40vw",
    span: "md:col-span-5 md:row-span-2",
    slides: [
      { name: "sterile-1", alt: "Autoclave de stérilisation ouvert", from: 1.08, to: 1.18, drift: 12 },
      { name: "sterile-2", alt: "Panneau de commande de l'autoclave", from: 1.06, to: 1.16, drift: -12 },
      { name: "sterile-3", alt: "Contrôle du cycle de stérilisation", from: 1.1, to: 1.19, drift: 10 },
    ],
  },
];

export default function Cabinet() {
  return (
    <section id="cabinet" className="relative bg-sand/40 py-24 md:py-32">
      <div className="mx-auto w-full max-w-7xl px-5 md:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <Reveal>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-teal">
                Le Cabinet
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="font-display mt-4 text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl lg:text-[2.9rem]">
                Un cadre pensé pour votre sérénité.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-sm text-base leading-relaxed text-ink/60">
              Des espaces lumineux, un équipement de dernière génération et une
              hygiène irréprochable — pour des soins en toute confiance.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-12 md:grid-flow-row-dense md:auto-rows-[105px] lg:auto-rows-[185px]">
          {tiles.map((tile, i) => (
            <Reveal
              key={tile.title}
              delay={(i % 2) * 0.1}
              className={`${tile.span} h-full`}
            >
              <RoomTour
                slides={tile.slides}
                title={tile.title}
                widths={tile.widths}
                sizes={tile.sizes}
                imgW={tile.imgW}
                imgH={tile.imgH}
                className={`h-full rounded-[1.75rem] shadow-soft ring-1 ring-ink/5 ${
                  tile.span.includes("row-span-4")
                    ? "min-h-[420px]"
                    : "min-h-[280px]"
                }`}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
