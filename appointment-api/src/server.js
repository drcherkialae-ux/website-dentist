import express from "express";
import cors from "cors";
import { Resend } from "resend";

const {
  RESEND_API_KEY,
  TO_EMAIL = "dr.cherkialae@gmail.com", // destinataire(s) cabinet, séparés par des virgules
  FROM_EMAIL = "Cabinet Dr. Alae Cherki <onboarding@resend.dev>",
  ALLOWED_ORIGIN = "*", // origine(s) du front, séparées par des virgules
  PORT = 8787,
} = process.env;

const CABINET = {
  name: "Cabinet Dentaire Dr. Alae Cherki",
  phone: "05 37 56 25 87",
  address: "Ouled Metaa, Témara",
  navy: "#16299c",
  teal: "#26bccb",
  ink: "#0a1330",
};

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

const app = express();
app.use(express.json({ limit: "10kb" }));
app.use(
  cors({
    origin:
      ALLOWED_ORIGIN === "*" ? true : ALLOWED_ORIGIN.split(",").map((s) => s.trim()),
    methods: ["POST", "GET", "OPTIONS"],
  }),
);

const isEmail = (v) => typeof v === "string" && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);
const esc = (v = "") =>
  String(v).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

app.get("/", (_req, res) => res.json({ ok: true, service: "cherki-appointment-api" }));
app.get("/health", (_req, res) => res.json({ ok: true, configured: Boolean(resend && TO_EMAIL) }));

app.post("/api/appointment", async (req, res) => {
  const { name, email, phone, service, date, note } = req.body ?? {};

  if (!name?.trim() || !phone?.trim() || !isEmail(email)) {
    return res
      .status(400)
      .json({ ok: false, error: "Nom, email et téléphone valides sont requis." });
  }
  if (!resend || !TO_EMAIL) {
    return res
      .status(500)
      .json({ ok: false, error: "Service d'email non configuré sur le serveur." });
  }

  try {
    // 1) Notification au cabinet (critique — réponse possible directement au patient)
    await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL.split(",").map((s) => s.trim()),
      replyTo: email,
      subject: `Nouvelle demande de rendez-vous — ${name}`,
      html: cabinetEmail({ name, email, phone, service, date, note }),
    });

    // 2) Confirmation au patient (best-effort).
    // En mode test Resend (sans domaine vérifié), l'envoi vers une adresse
    // arbitraire échoue : on n'échoue donc PAS toute la requête pour autant.
    let patientNotified = false;
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: `Votre demande de rendez-vous — ${CABINET.name}`,
        html: patientEmail({ name, service, date }),
      });
      patientNotified = true;
    } catch (err) {
      console.warn("Confirmation patient non envoyée:", err?.message || err);
    }

    return res.json({ ok: true, patientNotified });
  } catch (err) {
    console.error("Resend error:", err);
    return res.status(502).json({
      ok: false,
      error: "L'envoi a échoué. Merci de réessayer ou d'appeler le cabinet.",
    });
  }
});

app.listen(PORT, () => console.log(`cherki-appointment-api en écoute sur :${PORT}`));

/* ----------------------------- Templates email ----------------------------- */

function shell(title, inner) {
  return `<!doctype html><html lang="fr"><body style="margin:0;background:#f6f8fc;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:${CABINET.ink}">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 0"><tr><td align="center">
    <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#fff;border-radius:18px;overflow:hidden;box-shadow:0 18px 50px -28px rgba(10,19,48,.35)">
      <tr><td style="background:linear-gradient(120deg,${CABINET.navy},${CABINET.teal});padding:26px 32px">
        <div style="color:#fff;font-size:18px;font-weight:700;letter-spacing:-.02em">${CABINET.name}</div>
        <div style="color:rgba(255,255,255,.85);font-size:13px;margin-top:4px">${esc(title)}</div>
      </td></tr>
      <tr><td style="padding:28px 32px 32px">${inner}</td></tr>
      <tr><td style="padding:18px 32px;background:#0a1330;color:rgba(255,255,255,.6);font-size:12px;line-height:1.6">
        ${CABINET.name} · ${CABINET.address}<br/>Tél : ${CABINET.phone} · Urgences 24h/24
      </td></tr>
    </table>
  </td></tr></table></body></html>`;
}

function row(label, value) {
  if (!value) return "";
  return `<tr>
    <td style="padding:10px 0;border-bottom:1px solid #eef1f7;color:#6b7280;font-size:13px;width:140px;vertical-align:top">${esc(label)}</td>
    <td style="padding:10px 0;border-bottom:1px solid #eef1f7;font-size:14px;font-weight:600;color:${CABINET.ink}">${esc(value)}</td>
  </tr>`;
}

function cabinetEmail({ name, email, phone, service, date, note }) {
  const inner = `
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6">Une nouvelle demande de rendez-vous vient d'être reçue&nbsp;:</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${row("Nom", name)}
      ${row("Email", email)}
      ${row("Téléphone", phone)}
      ${row("Motif", service)}
      ${row("Disponibilité", date)}
      ${row("Message", note)}
    </table>
    <p style="margin:22px 0 0;font-size:13px;color:#6b7280">Répondez directement à cet email pour recontacter le patient.</p>`;
  return shell("Nouvelle demande de rendez-vous", inner);
}

function patientEmail({ name, service, date }) {
  const detail = [service ? `pour « ${esc(service)} »` : "", date ? `(${esc(date)})` : ""]
    .filter(Boolean)
    .join(" ");
  const inner = `
    <p style="margin:0 0 14px;font-size:15px;line-height:1.6">Bonjour ${esc(name)},</p>
    <p style="margin:0 0 14px;font-size:15px;line-height:1.6">
      Nous avons bien reçu votre demande de rendez-vous ${detail}. Notre équipe vous
      recontactera très prochainement pour confirmer le créneau.
    </p>
    <p style="margin:0 0 20px;font-size:15px;line-height:1.6">
      Pour toute urgence ou modification, vous pouvez nous joindre au
      <strong style="color:${CABINET.navy}">${CABINET.phone}</strong>.
    </p>
    <p style="margin:0;font-size:15px;line-height:1.6">À très bientôt,<br/><strong>${CABINET.name}</strong></p>`;
  return shell("Confirmation de votre demande", inner);
}
