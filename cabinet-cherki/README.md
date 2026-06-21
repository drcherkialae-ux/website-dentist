# Cabinet Dentaire Dr. Alae Cherki — Site web

Site vitrine premium (français) pour le cabinet dentaire du Dr. Alae Cherki à
Témara. Objectif : inspirer confiance et convertir en **rendez-vous** (puis
appels), avec une narration cinématique et sobre, façon « santé de luxe ».

## Stack

- **Next.js 16** (App Router, TypeScript) + **Tailwind CSS v4**
- **Motion** (animations), **Lenis** (défilement fluide), **GSAP** (réserve scroll)
- Déploiement : **Netlify**

## Démarrer

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de production
```

## Modifier le contenu

Tout le contenu éditable est centralisé dans **`lib/site.ts`** :
coordonnées, horaires, services, avis patients, navigation. Modifier ce fichier
met à jour l'ensemble du site (aucun autre fichier à toucher pour le texte).

- Téléphones, WhatsApp, adresse, lien Plans → `SITE.contact`
- Horaires → `SITE.hours`
- Services → `SITE.services`
- Avis (témoignages marocains) → `SITE.reviews`

## Conversion

- Le formulaire de rendez-vous (`components/sections/Appointment.tsx`) génère un
  message **WhatsApp pré-rempli** (`lib/whatsapp.ts`) vers le mobile du cabinet.
- Boutons d'appel (`tel:`) et raccourci **Urgence 24h/24** présents partout.
- Barre CTA collante en bas sur mobile (`components/StickyMobileCTA.tsx`).
- _Backend de réservation : phase ultérieure._

## Médias

Les visuels et vidéos sont dans **`public/media/`** (noms web normalisés).
Les originaux sont conservés dans `../source-assets/`.

> **Higgsfield** : les assets cinématiques générés (boucle hero, clips
> d'ambiance retravaillés, photos upscalées, motion du logo) viendront remplacer
> ou compléter les fichiers de `public/media/` lors de la passe dédiée.

## Structure

```
app/            layout (polices, métadonnées, JSON-LD), page, styles
components/     shell (Navbar, Footer, CTA mobile) + motion + sections/
lib/            site.ts (contenu), whatsapp.ts, events.ts, utils.ts
public/media/   visuels et vidéos
```
