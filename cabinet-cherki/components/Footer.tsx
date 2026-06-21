import Image from "next/image";
import AnchorLink from "./AnchorLink";
import { SITE } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink text-white">
      <div className="pointer-events-none absolute inset-0 bg-aurora opacity-40" />
      <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-5 py-16 md:grid-cols-[1.4fr_1fr_1fr] md:px-10 md:py-20">
        {/* Marque */}
        <div>
          <div className="flex items-center gap-3">
            <span className="sheen relative h-11 w-11 overflow-hidden rounded-xl ring-1 ring-white/15">
              <Image
                src={SITE.brand.logo}
                alt={SITE.brand.name}
                fill
                sizes="44px"
                className="object-cover"
              />
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">
              Dr. Alae Cherki
            </span>
          </div>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/60">
            {SITE.brand.intro}
          </p>
          <a
            href={SITE.contact.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-teal"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
            </svg>
            {SITE.brand.instagramHandle}
          </a>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-light/80">
            Navigation
          </h3>
          <ul className="mt-5 space-y-3 text-sm">
            {SITE.nav.map((item) => (
              <li key={item.href}>
                <AnchorLink
                  href={item.href}
                  className="text-white/65 transition-colors hover:text-white"
                >
                  {item.label}
                </AnchorLink>
              </li>
            ))}
            <li>
              <AnchorLink
                href="#rendez-vous"
                className="text-white/65 transition-colors hover:text-white"
              >
                Prendre rendez-vous
              </AnchorLink>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-light/80">
            Contact
          </h3>
          <ul className="mt-5 space-y-3 text-sm text-white/65">
            <li>
              <a href={`tel:${SITE.contact.cabinetPhoneTel}`} className="hover:text-white">
                Cabinet · {SITE.contact.cabinetPhoneDisplay}
              </a>
            </li>
            <li>
              <a href={`tel:${SITE.contact.drPhoneTel}`} className="hover:text-white">
                Dr · {SITE.contact.drPhoneDisplay}
              </a>
            </li>
            <li>
              <a
                href={SITE.contact.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                {SITE.contact.addressLine}
                <br />
                {SITE.contact.city}
              </a>
            </li>
            <li className="pt-2 text-white/50">
              {SITE.hours.items.map((h) => (
                <span key={h.days} className="block">
                  {h.days} : {h.time}
                </span>
              ))}
              <span className="mt-1 block text-teal-light/80">
                {SITE.hours.emergency}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-5 py-6 text-xs text-white/40 md:flex-row md:items-center md:justify-between md:px-10">
          <span>
            © {new Date().getFullYear()} {SITE.brand.name}. Tous droits réservés.
          </span>
          <span>Témara — Ouled Metaa, Maroc</span>
        </div>
      </div>
    </footer>
  );
}
