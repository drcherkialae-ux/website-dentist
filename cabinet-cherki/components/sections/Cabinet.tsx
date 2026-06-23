import Image from "next/image";
import Reveal from "@/components/motion/Reveal";
import Parallax from "@/components/motion/Parallax";

type Tile = {
  caption: string;
  span: string;
  amount: number;
} & ({ kind: "video"; src: string; poster: string } | { kind: "image"; src: string });

const tiles: Tile[] = [
  {
    kind: "video",
    src: "/media/soin-1.mp4",
    poster: "/media/soin-1.jpg",
    caption: "Salle de soin",
    // Vidéo paysage (16:9) → tuile large, demi-hauteur (colonne de gauche, haut)
    span: "md:col-span-7 md:row-span-2",
    amount: 30,
  },
  {
    kind: "video",
    src: "/media/attente.mp4",
    poster: "/media/soin-2.jpg",
    caption: "Salle d'attente",
    // Vidéo paysage (16:9) → tuile large, demi-hauteur (colonne de gauche, bas)
    span: "md:col-span-7 md:row-span-2",
    amount: -30,
  },
  {
    kind: "video",
    src: "/media/soin-2.mp4",
    poster: "/media/soin-2.jpg",
    caption: "Technologie & confort",
    // Vidéo portrait (9:16) → tuile étroite, pleine hauteur (colonne de droite)
    span: "md:col-span-5 md:row-span-4",
    amount: 30,
  },
];

function TileMedia({ tile }: { tile: Tile }) {
  return (
    <Parallax amount={tile.amount} className="h-full">
      <div className="group relative h-full min-h-[260px] overflow-hidden rounded-[1.75rem] shadow-soft ring-1 ring-ink/5 md:min-h-0">
        {tile.kind === "video" ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={tile.poster}
            className="h-full w-full scale-105 object-cover transition-transform duration-[1.2s] group-hover:scale-110 md:scale-100 md:group-hover:scale-105"
          >
            <source src={tile.src} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={tile.src}
            alt={tile.caption}
            fill
            sizes="(max-width: 1024px) 90vw, 55vw"
            className="scale-105 object-cover transition-transform duration-[1.2s] group-hover:scale-110 md:scale-100 md:group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
        <span className="glass absolute bottom-4 left-4 rounded-full px-4 py-1.5 text-xs font-medium text-white">
          {tile.caption}
        </span>
      </div>
    </Parallax>
  );
}

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

        <div className="mt-12 grid grid-cols-1 gap-5 auto-rows-[minmax(260px,1fr)] md:grid-cols-12 md:grid-flow-row-dense md:auto-rows-[105px] lg:auto-rows-[185px]">
          {tiles.map((tile, i) => (
            <Reveal
              key={`${tile.caption}-${i}`}
              delay={(i % 2) * 0.1}
              className={`${tile.span} h-full`}
            >
              <TileMedia tile={tile} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
