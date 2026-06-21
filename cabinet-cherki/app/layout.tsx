import type { Metadata, Viewport } from "next";
import { Inter, Sora, Fraunces } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/site";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  style: ["normal", "italic"],
  display: "swap",
});

const siteUrl = "https://www.cabinet-cherki.ma";

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
    "Ouled Metaa",
  ],
  authors: [{ name: SITE.brand.name }],
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
        height: 1600,
        alt: SITE.brand.doctor,
      },
    ],
  },
  alternates: { canonical: siteUrl },
};

export const viewport: Viewport = {
  themeColor: "#16299c",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Dentist",
  name: SITE.brand.name,
  description: SITE.brand.intro,
  image: `${siteUrl}/media/portrait-1.jpg`,
  url: siteUrl,
  telephone: SITE.contact.cabinetPhoneTel,
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Ouled Metaa",
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
    <html
      lang="fr"
      className={`${inter.variable} ${sora.variable} ${fraunces.variable}`}
    >
      <body className="min-h-screen bg-white antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SmoothScroll>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </SmoothScroll>
        <StickyMobileCTA />
      </body>
    </html>
  );
}
