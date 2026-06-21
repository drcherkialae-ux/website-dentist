"use client";

import { useEffect, useState } from "react";
import { SITE } from "@/lib/site";
import { SELECT_SERVICE_EVENT } from "@/lib/events";
import { APPOINTMENT_ENDPOINT } from "@/lib/config";
import ContactMap from "./ContactMap";

const fieldClass =
  "w-full rounded-xl border border-ink/12 bg-mist/60 px-4 py-3 text-[15px] text-ink outline-none transition placeholder:text-ink/35 focus:border-teal focus:bg-white focus:ring-2 focus:ring-teal/25";

type Status = "idle" | "submitting" | "success" | "error";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  service: "",
  date: "",
  note: "",
};

const isEmail = (v: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);

export default function Appointment() {
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [patientNotified, setPatientNotified] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (detail) setForm((f) => ({ ...f, service: detail }));
    };
    window.addEventListener(SELECT_SERVICE_EVENT, handler);
    return () => window.removeEventListener(SELECT_SERVICE_EVENT, handler);
  }, []);

  const update =
    (key: keyof typeof form) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !isEmail(form.email)) {
      setError("Merci d'indiquer votre nom, un email valide et votre téléphone.");
      setStatus("error");
      return;
    }
    setError("");
    setStatus("submitting");
    try {
      const res = await fetch(APPOINTMENT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Échec de l'envoi.");
      }
      setPatientNotified(Boolean(data.patientNotified));
      setStatus("success");
    } catch {
      setError(
        "L'envoi a échoué. Merci de réessayer, ou appelez-nous au " +
          SITE.contact.cabinetPhoneDisplay +
          ".",
      );
      setStatus("error");
    }
  };

  const reset = () => {
    setForm(emptyForm);
    setStatus("idle");
    setError("");
  };

  return (
    <section
      id="rendez-vous"
      className="relative overflow-hidden bg-aurora py-24 text-white md:py-32"
    >
      <div className="pointer-events-none absolute -left-20 top-10 h-96 w-96 rounded-full bg-teal/15 blur-[120px]" />

      <div className="relative mx-auto w-full max-w-7xl px-5 md:px-10">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-teal-light">
            Rendez-vous
          </p>
          <h2 className="font-display mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-[3rem]">
            Réservez votre rendez-vous.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-white/70">
            Remplissez le formulaire : vous recevrez un email de confirmation et
            le cabinet vous recontactera rapidement. Une urgence ? Appelez-nous,
            à toute heure.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Formulaire / confirmation */}
          <div className="rounded-[1.75rem] bg-white p-6 text-ink shadow-lift sm:p-8">
            {status === "success" ? (
              <div className="flex h-full flex-col items-center justify-center py-10 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-teal/12 text-teal">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <h3 className="font-display mt-6 text-2xl font-semibold tracking-tight">
                  Demande envoyée !
                </h3>
                <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-ink/65">
                  {patientNotified
                    ? "Un email de confirmation vient de vous être adressé. Le cabinet vous recontactera très prochainement pour fixer le créneau."
                    : "Votre demande a bien été transmise au cabinet, qui vous recontactera très prochainement pour fixer le créneau."}
                </p>
                <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={reset}
                    className="inline-flex h-11 items-center justify-center rounded-full border border-ink/15 px-6 text-sm font-medium text-ink transition hover:bg-ink/[0.04]"
                  >
                    Nouvelle demande
                  </button>
                  <a
                    href={`tel:${SITE.contact.cabinetPhoneTel}`}
                    className="inline-flex h-11 items-center justify-center rounded-full bg-teal px-6 text-sm font-semibold text-white transition hover:brightness-[1.06]"
                  >
                    Appeler le cabinet
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ink/70">
                      Nom complet *
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      value={form.name}
                      onChange={update("name")}
                      placeholder="Votre nom"
                      className={fieldClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-ink/70">
                      Téléphone *
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      value={form.phone}
                      onChange={update("phone")}
                      placeholder="06 00 00 00 00"
                      className={fieldClass}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink/70">
                      Email *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={update("email")}
                      placeholder="vous@exemple.com"
                      className={fieldClass}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="service" className="mb-1.5 block text-sm font-medium text-ink/70">
                      Motif de consultation
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={form.service}
                      onChange={update("service")}
                      className={fieldClass}
                    >
                      <option value="">Choisir un service…</option>
                      {SITE.services.map((s) => (
                        <option key={s.id} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="date" className="mb-1.5 block text-sm font-medium text-ink/70">
                      Disponibilité souhaitée
                    </label>
                    <input
                      id="date"
                      name="date"
                      type="text"
                      value={form.date}
                      onChange={update("date")}
                      placeholder="Ex. mardi après-midi, ou dès que possible"
                      className={fieldClass}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="note" className="mb-1.5 block text-sm font-medium text-ink/70">
                      Message (facultatif)
                    </label>
                    <textarea
                      id="note"
                      name="note"
                      rows={3}
                      value={form.note}
                      onChange={update("note")}
                      placeholder="Précisez votre demande si besoin"
                      className={`${fieldClass} resize-none`}
                    />
                  </div>
                </div>

                {status === "error" && error && (
                  <p className="mt-4 text-sm text-red-500" role="alert">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="mt-6 inline-flex h-13 w-full items-center justify-center gap-2.5 rounded-full bg-teal px-7 py-3.5 text-[15px] font-semibold text-white shadow-soft transition-all duration-300 hover:shadow-lift hover:brightness-[1.06] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {status === "submitting" ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Envoi en cours…
                    </>
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="m4 6 8 6 8-6M4 6h16v12H4V6Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Envoyer ma demande
                    </>
                  )}
                </button>

                <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-ink/50">
                  <span className="inline-flex items-center gap-1.5">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.8" />
                      <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.8" />
                    </svg>
                    Données confidentielles
                  </span>
                  <span>·</span>
                  <a href={`tel:${SITE.contact.cabinetPhoneTel}`} className="font-medium text-teal hover:underline">
                    ou appeler le {SITE.contact.cabinetPhoneDisplay}
                  </a>
                </div>
              </form>
            )}
          </div>

          {/* Coordonnées + horaires */}
          <div className="flex flex-col gap-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <a
                href={`tel:${SITE.contact.cabinetPhoneTel}`}
                className="glass flex items-center gap-4 rounded-2xl p-5 transition-colors hover:bg-white/10"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-teal/20 text-teal-light">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M6.6 10.8a13.4 13.4 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24c1.1.36 2.3.56 3.5.56a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.3a1 1 0 0 1 1 1c0 1.2.2 2.4.56 3.5a1 1 0 0 1-.24 1l-2.2 2.3Z" />
                  </svg>
                </span>
                <span>
                  <span className="block text-xs text-white/55">Cabinet</span>
                  <span className="block font-medium tracking-tight">
                    {SITE.contact.cabinetPhoneDisplay}
                  </span>
                </span>
              </a>
              <a
                href={`tel:${SITE.contact.drPhoneTel}`}
                className="glass flex items-center gap-4 rounded-2xl p-5 transition-colors hover:bg-white/10"
              >
                <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-teal/20 text-teal-light">
                  <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3 rounded-full bg-teal">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal opacity-75" />
                  </span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M6.6 10.8a13.4 13.4 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24c1.1.36 2.3.56 3.5.56a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.3a1 1 0 0 1 1 1c0 1.2.2 2.4.56 3.5a1 1 0 0 1-.24 1l-2.2 2.3Z" />
                  </svg>
                </span>
                <span>
                  <span className="block text-xs text-white/55">Urgence 24h/24</span>
                  <span className="block font-medium tracking-tight">
                    {SITE.contact.drPhoneDisplay}
                  </span>
                </span>
              </a>
            </div>

            <div className="glass rounded-2xl p-5">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-light/80">
                Horaires
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                {SITE.hours.items.map((h) => (
                  <li key={h.days} className="flex items-center justify-between gap-4">
                    <span className="text-white/65">{h.days}</span>
                    <span className="font-medium tabular-nums">{h.time}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 border-t border-white/10 pt-3 text-sm text-teal-light">
                {SITE.hours.emergency}
              </p>
            </div>

            <ContactMap />
          </div>
        </div>
      </div>
    </section>
  );
}
