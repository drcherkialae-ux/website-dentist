import RoomPanels, { type Room } from "@/components/RoomPanels";
import { Container, Section, SectionHeader } from "@/components/ui/Section";

/* Formats 16:9 (2752 × 1536) — salles */
const LANDSCAPE = { widths: [960, 1440, 1920], imgW: 2752, imgH: 1536 };
/* Format portrait (1696 × 2528) — radio panoramique */
const PORTRAIT = { widths: [640, 1080, 1440], imgW: 1696, imgH: 2528 };

/* Ordre d'une visite : de l'accueil aux coulisses. */
const ROOMS: Room[] = [
  {
    id: "accueil",
    title: "Accueil",
    caption: "Là où commence chaque visite.",
    widths: [768, 1280, 1920, 2528],
    imgW: 2528,
    imgH: 1696,
    slides: [
      { name: "reception", alt: "L'accueil du cabinet : comptoir en marbre, fleurs et horloge", from: 1.04, to: 1.12, drift: 10 },
    ],
  },
  {
    id: "attente",
    title: "Salle d'attente",
    caption: "Velours camel, lumière douce, bougainvillier : un salon plus qu'une salle d'attente.",
    ...LANDSCAPE,
    slides: [
      { name: "salle-1", alt: "Salle d'attente du cabinet — vue d'ensemble", from: 1.08, to: 1.18, drift: -16 },
      { name: "salle-2", alt: "Canapé en velours camel baigné de lumière", from: 1.06, to: 1.16, drift: 14 },
      { name: "salle-3", alt: "Fauteuil moutarde et table basse du salon d'accueil", from: 1.1, to: 1.2, drift: -12 },
      { name: "salle-4", alt: "Bougainvillier et ambiance feutrée de la salle d'attente", from: 1.06, to: 1.17, drift: 12 },
    ],
  },
  {
    id: "soin-1",
    title: "Salle de soin 1",
    caption: "Fauteuil de soin, écran de contrôle et lumière naturelle.",
    ...LANDSCAPE,
    slides: [
      { name: "soin-a-1", alt: "Salle de soin — vue d'ensemble lumineuse", from: 1.08, to: 1.18, drift: 14 },
      { name: "soin-a-2", alt: "Fauteuil de soin et écran de contrôle", from: 1.06, to: 1.16, drift: -14 },
      { name: "soin-a-3", alt: "Salle de soin vue en plongée", from: 1.1, to: 1.2, drift: 12 },
      { name: "soin-a-4", alt: "Instruments de l'unité dentaire", from: 1.06, to: 1.17, drift: -12 },
    ],
  },
  {
    id: "soin-2",
    title: "Salle de soin 2",
    caption: "Une seconde salle de soin, entièrement équipée.",
    ...LANDSCAPE,
    slides: [
      { name: "soin-b-1", alt: "Seconde salle de soin — vue d'ensemble", from: 1.08, to: 1.18, drift: -14 },
      { name: "soin-b-2", alt: "Fauteuil de soin et rangements", from: 1.06, to: 1.16, drift: 14 },
      { name: "soin-b-3", alt: "Fauteuil de la seconde salle vu en plongée", from: 1.1, to: 1.2, drift: -12 },
      { name: "soin-b-4", alt: "Tablette d'instruments de l'unité de soin", from: 1.06, to: 1.17, drift: 12 },
    ],
  },
  {
    id: "radiologie",
    title: "Radiologie",
    caption: "Radio panoramique NewTom GO sur place : vos clichés sans vous déplacer.",
    ...PORTRAIT,
    slides: [
      { name: "radio-1", alt: "Radio panoramique NewTom GO — vue d'ensemble", from: 1.08, to: 1.18, drift: -12 },
      { name: "radio-2", alt: "Bras de la radio panoramique NewTom GO", from: 1.06, to: 1.16, drift: 12 },
      { name: "radio-3", alt: "Support de positionnement du patient", from: 1.1, to: 1.2, drift: -10 },
      { name: "radio-4", alt: "Console de commande de la radiographie", from: 1.06, to: 1.16, drift: 10 },
    ],
  },
  {
    id: "sterilisation",
    title: "Stérilisation",
    caption: "Autoclave et contrôle de chaque cycle : l'hygiène, jusque dans les coulisses.",
    ...LANDSCAPE,
    slides: [
      { name: "sterile-1", alt: "Autoclave de stérilisation ouvert", from: 1.08, to: 1.18, drift: 12 },
      { name: "sterile-2", alt: "Panneau de commande de l'autoclave", from: 1.06, to: 1.16, drift: -12 },
      { name: "sterile-3", alt: "Contrôle du cycle de stérilisation", from: 1.1, to: 1.19, drift: 10 },
    ],
  },
];

export default function Cabinet() {
  return (
    <Section id="cabinet" labelledBy="cabinet-title">
      <Container>
        <SectionHeader
          id="cabinet-title"
          eyebrow="Le Cabinet"
          title="Entrez, pièce par pièce."
          intro="De l'accueil à la stérilisation, chaque espace est pensé pour votre sérénité. Ouvrez une pièce pour la visiter."
        />
      </Container>
      <div className="mt-12 lg:mt-16">
        <RoomPanels rooms={ROOMS} initial={1} />
      </div>
    </Section>
  );
}
