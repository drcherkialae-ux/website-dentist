/**
 * URL du backend d'envoi d'email (service Render).
 * Définir NEXT_PUBLIC_API_URL au moment du build (Netlify) ;
 * par défaut, on cible le backend local de développement.
 */
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:8787";

export const APPOINTMENT_ENDPOINT = `${API_BASE}/api/appointment`;
