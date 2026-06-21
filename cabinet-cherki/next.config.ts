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
};

export default nextConfig;
