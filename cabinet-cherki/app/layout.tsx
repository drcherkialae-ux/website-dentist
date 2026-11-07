import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/site";
import Navbar from "@/components/Navbar";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import Footer from "@/components/Footer";

/* Texte : police système (SF Pro) sur les appareils Apple ; Inter, très
   proche, partout ailleurs. */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/* Titres : Fraunces, avec ses tailles optiques (plus fine en grand). */
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz"],
  display: "swap",
});

/* Thème posé avant le premier affichage (pas de flash) : choix mémorisé,
   sinon réglage de l'appareil. Cf. components/ThemeToggle.tsx. */
const THEME_SCRIPT = `(function(){var t;try{t=localStorage.getItem("theme")}catch(e){}if(t!=="light"&&t!=="dark")t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.dataset.theme=t})()`;

const siteUrl = "https://drcherkialae.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Dr. Alae Cherki — Cabinet Dentaire à Témara",
    template: "%s | Dr. Alae Cherki",
  },
  description:
    "Cabinet dentaire multidisciplinaire à Témara. Dentisterie esthétique, prothèse, pédiatrie, consultation et urgences 24h/24. Prenez rendez-vous avec le Dr. Alae Cherki.",
  keywords: [
    "dentiste Témara",
    "cabinet dentaire Témara",
    "blanchiment dentaire",
    "dentisterie esthétique",
    "urgence dentaire Témara",
    "Dr Alae Cherki",
    "prothèse dentaire",
    "pédiatrie dentaire",
    "Boulevard Sahl Rhône Témara",
  ],
  authors: [{ name: SITE.brand.name }],
  /* Safari iOS transforme sinon les numéros et l'adresse en liens avant que
     React ne prenne la main (erreur d'hydratation). Les numéros utiles sont
     déjà des liens tel: explicites. */
  formatDetection: { telephone: false, address: false, email: false },
  openGraph: {
    type: "website",
    locale: "fr_MA",
    url: siteUrl,
    title: "Dr. Alae Cherki — Cabinet Dentaire à Témara",
    description: SITE.brand.intro,
    siteName: SITE.brand.name,
    images: [
      {
        url: "/media/portrait-1.jpg",
        width: 1200,
        height: 2176,
        alt: SITE.brand.doctor,
      },
    ],
  },
  alternates: { canonical: siteUrl },
};

export const viewport: Viewport = {
  /* Accordé à la photo d'accueil, premier écran visible. */
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#060b1a" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Dentist",
  name: SITE.brand.name,
  description: SITE.brand.intro,
  image: `${siteUrl}/media/portrait-1.jpg`,
  logo: `${siteUrl}/media/logo-512.png`,
  url: siteUrl,
  telephone: SITE.contact.cabinetPhoneTel,
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Boulevard Sahl Rhône, Imm 28, App N°8 (2ᵉ étage)",
    addressLocality: "Témara",
    addressCountry: "MA",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "19:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "09:00",
      closes: "14:00",
    },
  ],
  availableService: SITE.services.map((s) => ({
    "@type": "MedicalProcedure",
    name: s.name,
  })),
  sameAs: [SITE.contact.instagram],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // data-theme est ajouté par le script de thème avant l'hydratation.
    <html lang="fr" className={`${inter.variable} ${fraunces.variable}`} suppressHydrationWarning>
      <body className="min-h-screen">
        {/* Script bloquant en tout début de <body> : il s'exécute avant que le
            moindre contenu ne soit analysé ou affiché (next/script le
            différerait, d'où un flash clair en mode sombre). */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[60] focus:rounded-full focus:bg-tint-fill focus:px-5 focus:py-3 focus:text-subheadline focus:font-semibold focus:text-on-tint"
        >
          Aller au contenu
        </a>
        <Navbar />
        <main id="contenu">{children}</main>
        <Footer />
        <StickyMobileCTA />
      </body>
    </html>
  );
}
