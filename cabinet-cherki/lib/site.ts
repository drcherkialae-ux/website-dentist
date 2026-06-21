/**
 * Source unique de vérité pour tout le contenu éditable du site.
 * (Coordonnées, horaires, services, avis, navigation.)
 * Modifier ici met à jour l'ensemble du site.
 */

export type Service = {
  id: string;
  name: string;
  short: string;
  description: string;
  emergency?: boolean;
};

export type Review = {
  name: string;
  city: string;
  text: string;
  service: string;
};

export const SITE = {
  brand: {
    name: "Cabinet Dentaire Dr. Alae Cherki",
    shortName: "Dr. Alae Cherki",
    doctor: "Dr. Alae Cherki",
    role: "Chirurgien-dentiste",
    tagline: "Votre sourire, notre expertise.",
    intro:
      "Centre dentaire multidisciplinaire à Témara — expertise, soins et technologie avancée, dans un cadre profondément humain.",
    instagramHandle: "@drcherkialae",
    logo: "/media/logo.png",
  },

  contact: {
    // Cabinet (fixe)
    cabinetPhoneDisplay: "05 37 56 25 87",
    cabinetPhoneTel: "+212537562587",
    // Docteur (mobile / WhatsApp)
    drPhoneDisplay: "+212 687-961441",
    drPhoneTel: "+212687961441",
    whatsapp: "212687961441", // format international sans "+"
    instagram: "https://instagram.com/drcherkialae",
    mapsUrl: "https://maps.apple/p/Rd8Z1s.gJUgx_T",
    addressLine: "Ouled Metaa, Témara",
    city: "Témara, Maroc",
  },

  hours: {
    items: [
      { days: "Lundi – Vendredi", time: "9h – 19h" },
      { days: "Samedi", time: "9h – 14h" },
      { days: "Dimanche", time: "Fermé" },
    ],
    emergency: "Urgences 24h/24 — en cas de douleur",
  },

  nav: [
    { label: "Le Docteur", href: "#docteur" },
    { label: "Services", href: "#services" },
    { label: "Résultats", href: "#resultats" },
    { label: "Le Cabinet", href: "#cabinet" },
    { label: "Avis", href: "#avis" },
  ],

  services: [
    {
      id: "urgence",
      name: "Urgence 24h/24",
      short: "Une douleur ? Une prise en charge immédiate, à toute heure.",
      description:
        "Rage de dent, traumatisme, abcès : nous vous recevons en priorité, de jour comme de nuit, pour soulager la douleur rapidement.",
      emergency: true,
    },
    {
      id: "consultation",
      name: "Consultation",
      short: "Un bilan complet et personnalisé de votre santé bucco-dentaire.",
      description:
        "Examen approfondi, diagnostic clair et plan de traitement sur-mesure, expliqué pas à pas. Prévenir avant de soigner.",
    },
    {
      id: "esthetique",
      name: "Dentisterie esthétique",
      short: "Un sourire harmonieux, lumineux et naturel.",
      description:
        "Blanchiment professionnel fläsh, facettes et soins esthétiques pour révéler l'éclat de votre sourire, sans jamais le dénaturer.",
    },
    {
      id: "prothese",
      name: "Prothèse",
      short: "Retrouvez confort, fonction et confiance.",
      description:
        "Prothèses fixes et amovibles réalisées sur-mesure, avec un souci constant du détail et du rendu naturel.",
    },
    {
      id: "pediatrie",
      name: "Pédiatrie",
      short: "Des soins doux, pensés pour les enfants.",
      description:
        "Une approche rassurante et bienveillante pour que les plus jeunes apprivoisent le dentiste en toute sérénité.",
    },
  ] as Service[],

  approach: [
    {
      title: "Approche multidisciplinaire",
      text: "Esthétique, prothèse, pédiatrie, urgences : une prise en charge complète, sous un même toit.",
    },
    {
      title: "Technologie avancée",
      text: "Imagerie, blanchiment fläsh et équipements de dernière génération au service de la précision.",
    },
    {
      title: "Hygiène irréprochable",
      text: "Stérilisation rigoureuse et protocoles stricts, pour des soins en toute sécurité.",
    },
    {
      title: "Une relation de confiance",
      text: "Le temps de l'écoute, des explications claires, et le respect de votre rythme.",
    },
  ],

  reviews: [
    {
      name: "Salma B.",
      city: "Témara",
      service: "Dentisterie esthétique",
      text: "Accueil chaleureux et un travail d'une grande précision. Le Dr Cherki prend vraiment le temps d'expliquer. Mon blanchiment fläsh est tout simplement bluffant.",
    },
    {
      name: "Youssef El Amrani",
      city: "Rabat",
      service: "Urgence",
      text: "Une urgence un dimanche soir, pris en charge en moins d'une heure. Professionnalisme et humanité — je recommande à 100%.",
    },
    {
      name: "Fatima-Zahra K.",
      city: "Témara",
      service: "Pédiatrie",
      text: "Cabinet moderne, impeccable, et un dentiste à l'écoute. Mes enfants n'ont plus peur d'aller chez le dentiste.",
    },
    {
      name: "Mehdi T.",
      city: "Harhoura",
      service: "Prothèse",
      text: "Pose de prothèse parfaite, résultat naturel. On sent la maîtrise et le souci du détail à chaque étape.",
    },
    {
      name: "Imane R.",
      city: "Rabat",
      service: "Consultation",
      text: "Du matériel dernier cri et une hygiène irréprochable. On se sent en confiance dès l'entrée dans le cabinet.",
    },
    {
      name: "Othmane B.",
      city: "Témara",
      service: "Dentisterie esthétique",
      text: "Enfin un dentiste qui allie technologie et douceur. Rendez-vous facile à prendre et ponctualité au rendez-vous.",
    },
  ] as Review[],
} as const;

export type SiteConfig = typeof SITE;
