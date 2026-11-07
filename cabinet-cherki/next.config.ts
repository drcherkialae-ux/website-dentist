import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Export statique : génère un dossier `out/` déployable partout (Netlify Drop,
  // Netlify Git, etc.). À repasser en SSR quand le backend de réservation arrivera.
  output: "export",
  images: { unoptimized: true },
  // Plusieurs lockfiles existent sur la machine ; on fixe la racine du projet.
  turbopack: {
    root: __dirname,
  },
  // Dev uniquement : laisse un iPhone du même Wi-Fi charger le site
  // (http://192.168.1.27:3123). Sans effet sur l'export statique.
  allowedDevOrigins: ["192.168.1.27"],
};

export default nextConfig;
