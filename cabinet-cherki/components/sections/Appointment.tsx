"use client";

import { useEffect, useRef, useState } from "react";
import OpenStatus, { useClinicToday } from "@/components/OpenStatus";
import { buttonStyles } from "@/components/ui/Button";
import { SelectField, TextArea, TextField } from "@/components/ui/Field";
import { InsetGroup, Row } from "@/components/ui/List";
import { Container, Section, SectionHeader } from "@/components/ui/Section";
import {
  Check,
  Exclamation,
  Lock,
  MapPin,
  MedicalCase,
  Message,
  Phone,
} from "@/components/ui/icons";
import { APPOINTMENT_ENDPOINT } from "@/lib/config";
import { SELECT_SERVICE_EVENT } from "@/lib/events";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "success" | "error";
type Required = "name" | "phone" | "email";

const SLOTS = ["Dès que possible", "Matin", "Après-midi", "Samedi"];

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  service: "",
  slot: "",
  dateDetail: "",
  note: "",
};

const isEmail = (v: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.trim());
const digitCount = (v: string) => v.replace(/\D/g, "").length;

/* Messages près du champ, sans reproche, avec la marche à suivre. */
function validate(form: typeof emptyForm): Record<Required, string> {
  return {
    name: form.name.trim() ? "" : "Indiquez votre nom complet.",
    phone: !form.phone.trim()
      ? "Indiquez un numéro pour que le cabinet vous rappelle."
      : digitCount(form.phone) < 9
        ? "Ce numéro semble incomplet. Exemple : 06 12 34 56 78."
        : "",
    email: !form.email.trim()
      ? "Indiquez votre adresse email."
      : isEmail(form.email)
        ? ""
        : "Saisissez une adresse au format nom@exemple.com.",
  };
}

const mapEmbed =
  "https://www.google.com/maps?q=" +
  encodeURIComponent("Boulevard Sahl Rhône, Témara, Maroc") +
  "&z=16&output=embed";

export default function Appointment() {
  const [form, setForm] = useState(emptyForm);
  const [touched, setTouched] = useState<Record<Required, boolean>>({
    name: false,
    phone: false,
    email: false,
  });
  const [status, setStatus] = useState<Status>("idle");
  const [patientNotified, setPatientNotified] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const today = useClinicToday();

  /* Pré-sélection du motif depuis les cartes de services. */
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (detail) setForm((f) => ({ ...f, service: detail }));
    };
    window.addEventListener(SELECT_SERVICE_EVENT, handler);
    return () => window.removeEventListener(SELECT_SERVICE_EVENT, handler);
  }, []);

  /* Confirmation : on y place le focus pour qu'elle soit annoncée. */
  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  const errors = validate(form);
  const shown = (k: Required) => (touched[k] ? errors[k] : "");

  const set =
    (key: keyof typeof emptyForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));
  const touch = (key: Required) => () => setTouched((t) => ({ ...t, [key]: true }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;
    const refs = { name: nameRef, phone: phoneRef, email: emailRef };
    const firstInvalid = (["name", "phone", "email"] as Required[]).find((k) => errors[k]);
    if (firstInvalid) {
      setTouched({ name: true, phone: true, email: true });
      refs[firstInvalid].current?.focus();
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch(APPOINTMENT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          service: form.service,
          date: [form.slot, form.dateDetail.trim()].filter(Boolean).join(" — "),
          note: form.note.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || "Échec de l'envoi.");
      setPatientNotified(Boolean(data.patientNotified));
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const reset = () => {
    setForm(emptyForm);
    setTouched({ name: false, phone: false, email: false });
    setStatus("idle");
  };

  return (
    <Section id="rendez-vous" labelledBy="rendez-vous-title">
      <Container>
        <SectionHeader
          id="rendez-vous-title"
          eyebrow="Rendez-vous"
          title="Prenez rendez-vous."
          intro="Remplissez le formulaire : un email de confirmation vous est envoyé et le cabinet vous rappelle rapidement. Une urgence ? Appelez, à toute heure."
        />

        <div className="mt-12 grid items-start gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-12">
          {/* ------------------------- Formulaire ------------------------- */}
          <div className="rounded-tile bg-bg-secondary p-5 sm:p-8">
            {status === "success" ? (
              <div className="flex flex-col items-center px-2 py-12 text-center" role="status">
                <span className="grid h-16 w-16 place-items-center rounded-full bg-green text-white">
                  <Check className="h-8 w-8" />
                </span>
                <h3
                  ref={successRef}
                  tabIndex={-1}
                  className="mt-6 text-title1 outline-none"
                >
                  Demande envoyée
                </h3>
                <p className="mt-3 max-w-[400px] text-body text-label-secondary">
                  {patientNotified
                    ? "Un email de confirmation vient de vous être envoyé. Le cabinet vous rappelle très vite pour fixer le créneau."
                    : "Le cabinet a bien reçu votre demande et vous rappelle très vite pour fixer le créneau."}
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <button type="button" onClick={reset} className={buttonStyles("gray", "regular")}>
                    Nouvelle demande
                  </button>
                  <a
                    href={`tel:${SITE.contact.cabinetPhoneTel}`}
                    className={buttonStyles("tinted", "regular")}
                  >
                    <Phone />
                    Appeler le cabinet
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate aria-describedby="champs-obligatoires">
                <p id="champs-obligatoires" className="mb-4 px-1 text-footnote text-label-secondary">
                  Les champs marqués d&apos;un astérisque (*) sont obligatoires.
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  <TextField
                    id="name"
                    name="name"
                    label="Nom complet"
                    required
                    autoComplete="name"
                    autoCapitalize="words"
                    enterKeyHint="next"
                    value={form.name}
                    onChange={set("name")}
                    onBlur={touch("name")}
                    inputRef={nameRef}
                    error={shown("name")}
                  />
                  <TextField
                    id="phone"
                    name="phone"
                    type="tel"
                    label="Téléphone"
                    required
                    autoComplete="tel"
                    inputMode="tel"
                    enterKeyHint="next"
                    value={form.phone}
                    onChange={set("phone")}
                    onBlur={touch("phone")}
                    inputRef={phoneRef}
                    error={shown("phone")}
                  />
                  <TextField
                    id="email"
                    name="email"
                    type="email"
                    label="Email"
                    required
                    autoComplete="email"
                    inputMode="email"
                    autoCapitalize="none"
                    spellCheck={false}
                    enterKeyHint="next"
                    value={form.email}
                    onChange={set("email")}
                    onBlur={touch("email")}
                    inputRef={emailRef}
                    error={shown("email")}
                    wrapperClassName="sm:col-span-2"
                  />
                  <SelectField
                    id="service"
                    name="service"
                    label="Motif de consultation"
                    value={form.service}
                    onChange={set("service")}
                    wrapperClassName="sm:col-span-2"
                  >
                    <option value="">Choisir un motif…</option>
                    {SITE.services.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </SelectField>
                </div>

                {/* Préférence de créneau : un choix plutôt qu'une saisie */}
                <fieldset className="mt-5">
                  <legend className="px-1 text-subheadline font-semibold text-label">
                    Créneau préféré
                  </legend>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {SLOTS.map((slot) => (
                      <label key={slot} className="relative">
                        <input
                          type="radio"
                          name="slot"
                          value={slot}
                          checked={form.slot === slot}
                          onChange={set("slot")}
                          className="peer sr-only"
                        />
                        <span className="inline-flex h-11 cursor-pointer select-none items-center gap-1.5 rounded-full border border-field-border bg-field px-4 text-subheadline text-label transition-[background-color,border-color,color,transform] duration-200 ease-ios active:scale-[0.97] peer-checked:border-tint peer-checked:bg-tint-soft peer-checked:font-semibold peer-checked:text-tint peer-focus-visible:shadow-[0_0_0_4px_var(--tint-soft)] [&>svg]:hidden peer-checked:[&>svg]:block">
                          <Check className="h-3.5 w-3.5" />
                          {slot}
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="mt-4 grid gap-3">
                  <TextField
                    id="dateDetail"
                    name="dateDetail"
                    label="Jour ou horaire précis (facultatif)"
                    enterKeyHint="next"
                    value={form.dateDetail}
                    onChange={set("dateDetail")}
                  />
                  <TextArea
                    id="note"
                    name="note"
                    label="Message (facultatif)"
                    rows={3}
                    value={form.note}
                    onChange={set("note")}
                  />
                </div>

                {status === "error" && (
                  <div
                    role="alert"
                    className="mt-5 flex gap-3 rounded-[16px] bg-red-soft p-4 text-subheadline text-label"
                  >
                    <Exclamation className="h-5 w-5 shrink-0 text-red" />
                    <p>
                      La demande n&apos;a pas pu être envoyée. Réessayez dans un
                      instant, ou appelez le cabinet au{" "}
                      <a
                        href={`tel:${SITE.contact.cabinetPhoneTel}`}
                        className="whitespace-nowrap font-semibold text-tint underline-offset-2 hover:underline"
                      >
                        {SITE.contact.cabinetPhoneDisplay}
                      </a>
                      .
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  aria-busy={status === "submitting" || undefined}
                  className={buttonStyles("prominent", "large", "mt-6 w-full")}
                >
                  {status === "submitting" ? (
                    <>
                      <ActivityIndicator />
                      Envoi en cours…
                    </>
                  ) : (
                    "Envoyer la demande"
                  )}
                </button>

                <p className="mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-footnote text-label-secondary">
                  <span className="inline-flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5" />
                    Données confidentielles
                  </span>
                  <span aria-hidden="true">·</span>
                  <a
                    href={`tel:${SITE.contact.cabinetPhoneTel}`}
                    className="-my-2 py-2 text-tint hover:underline"
                  >
                    ou appelez le {SITE.contact.cabinetPhoneDisplay}
                  </a>
                </p>
              </form>
            )}
          </div>

          {/* ------------------------ Coordonnées ------------------------- */}
          <div className="flex flex-col gap-8">
            <InsetGroup title="Contact">
              <Row
                href={`tel:${SITE.contact.cabinetPhoneTel}`}
                icon={<Phone />}
                iconClassName="bg-green"
                title="Cabinet"
                detail={SITE.contact.cabinetPhoneDisplay}
                ariaLabel={`Appeler le cabinet au ${SITE.contact.cabinetPhoneDisplay}`}
              />
              <Row
                href={`tel:${SITE.contact.drPhoneTel}`}
                icon={<MedicalCase />}
                iconClassName="bg-red-fill"
                title="Urgences 24h/24"
                detail={SITE.contact.drPhoneDisplay}
                ariaLabel={`Appeler les urgences au ${SITE.contact.drPhoneDisplay}`}
              />
              <Row
                href={`https://wa.me/${SITE.contact.whatsapp}`}
                external
                icon={<Message />}
                iconClassName="bg-[#25d366]"
                title="WhatsApp"
                detail="Écrire au cabinet"
                ariaLabel="Écrire au cabinet sur WhatsApp (nouvelle fenêtre)"
              />
            </InsetGroup>

            <InsetGroup
              title="Horaires"
              accessory={<OpenStatus />}
              footer={SITE.hours.emergency}
            >
              {SITE.hours.items.map((h) => {
                const isToday = h.days.includes(today);
                return (
                  <Row
                    key={h.label}
                    title={
                      <span className={cn(isToday && "font-semibold")}>
                        {h.label}
                        {isToday && <span className="sr-only"> (aujourd&apos;hui)</span>}
                      </span>
                    }
                    trailing={
                      <span
                        className={cn(
                          "text-body tabular-nums",
                          isToday ? "font-semibold text-label" : "text-label-secondary",
                        )}
                      >
                        {h.time}
                      </span>
                    }
                  />
                );
              })}
            </InsetGroup>

            <InsetGroup title="Accès">
              <li className="block">
                <iframe
                  title="Localisation du cabinet — Boulevard Sahl Rhône, Témara"
                  src={mapEmbed}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="block h-[240px] w-full border-0 dark:brightness-[0.85]"
                />
              </li>
              <Row
                href={SITE.contact.mapsUrl}
                external
                icon={<MapPin />}
                iconClassName="bg-[#0a84ff]"
                title="Itinéraire"
                detail={`${SITE.contact.addressLine} · ${SITE.contact.city}`}
                ariaLabel="Itinéraire vers le cabinet dans Google Maps (nouvelle fenêtre)"
              />
            </InsetGroup>
          </div>
        </div>
      </Container>
    </Section>
  );
}

/** Indicateur d'activité à huit rayons, aux couleurs du libellé du bouton. */
function ActivityIndicator() {
  return (
    <svg viewBox="0 0 24 24" className="activity-indicator h-5 w-5" aria-hidden="true">
      {Array.from({ length: 8 }).map((_, i) => (
        <line
          key={i}
          x1="12"
          y1="3"
          x2="12"
          y2="7"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          opacity={0.25 + (i / 8) * 0.75}
          transform={`rotate(${i * 45} 12 12)`}
        />
      ))}
    </svg>
  );
}
