import { SITE } from "@/lib/site";

const mapEmbed =
  "https://www.google.com/maps?q=" +
  encodeURIComponent("Boulevard Sahl Rhône, Témara, Maroc") +
  "&z=16&output=embed";

export default function ContactMap() {
  return (
    <div className="relative overflow-hidden rounded-[1.75rem] shadow-lift ring-1 ring-white/10">
      <iframe
        title="Localisation du cabinet — Boulevard Sahl Rhône, Témara"
        src={mapEmbed}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-[300px] w-full grayscale-[0.2] md:h-[360px]"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-ink/80 to-transparent p-5">
        <div className="text-white">
          <p className="font-display text-base font-semibold tracking-tight">
            {SITE.brand.name}
          </p>
          <p className="text-sm text-white/75">
            {SITE.contact.addressLine} · {SITE.contact.city}
          </p>
        </div>
        <a
          href={SITE.contact.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-ink transition hover:bg-white/90"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 21s-7-5.2-7-11a7 7 0 1 1 14 0c0 5.8-7 11-7 11Z" stroke="currentColor" strokeWidth="1.7" />
            <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.7" />
          </svg>
          Itinéraire
        </a>
      </div>
    </div>
  );
}
