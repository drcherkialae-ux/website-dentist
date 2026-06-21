# Cherki Appointment API

Petit service Node/Express qui reçoit les demandes de rendez-vous du site et
envoie **deux emails via [Resend](https://resend.com)** :

1. au **cabinet** (notification, avec `reply-to` = email du patient) ;
2. au **patient** (confirmation de réception).

## Endpoint

`POST /api/appointment` — corps JSON :

```json
{ "name": "…", "email": "…", "phone": "…", "service": "…", "date": "…", "note": "…" }
```

`name`, `email` (valide) et `phone` sont requis. Réponses : `{ ok: true }` ou
`{ ok: false, error }`. Health-check : `GET /health`.

## Lancer en local

```bash
npm install
cp .env.example .env   # puis renseigner les variables
npm run dev            # http://localhost:8787
```

## Variables d'environnement

| Variable | Description |
|---|---|
| `RESEND_API_KEY` | Clé API Resend |
| `TO_EMAIL` | Email(s) du cabinet (séparés par des virgules) |
| `FROM_EMAIL` | Expéditeur — **domaine vérifié dans Resend** (ou `onboarding@resend.dev` pour tester) |
| `ALLOWED_ORIGIN` | Origine(s) du site autorisées par CORS (ex. l'URL Netlify) |
| `PORT` | Port local (Render le fournit automatiquement) |

## Déployer sur Render

1. Mettre ce dossier sur un dépôt Git (GitHub/GitLab).
2. Render → **New → Blueprint** et sélectionner le repo (utilise `render.yaml`),
   ou **New → Web Service** : Build `npm install`, Start `npm start`.
3. Renseigner les variables d'environnement (Resend, TO_EMAIL, FROM_EMAIL, ALLOWED_ORIGIN).
4. Déployer → récupérer l'URL `https://cherki-appointment-api.onrender.com`.

## Brancher le front

Dans le site (`cabinet-cherki`), définir au build :

```
NEXT_PUBLIC_API_URL=https://cherki-appointment-api.onrender.com
```

> **Resend** : pour envoyer depuis votre propre domaine, ajoutez-le et vérifiez
> les DNS dans Resend, puis utilisez-le dans `FROM_EMAIL`. En test, le domaine
> `onboarding@resend.dev` n'envoie qu'à l'adresse du compte Resend.
