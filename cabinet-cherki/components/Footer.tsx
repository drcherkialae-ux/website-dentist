import { Container } from "./ui/Section";
import { Instagram } from "./ui/icons";
import { SITE } from "@/lib/site";

const link = "-my-1.5 inline-block py-1.5 text-label-secondary transition-colors hover:text-label hover:underline hover:underline-offset-2";

export default function Footer() {
  return (
    <footer className="bg-bg-secondary text-footnote text-label-secondary">
      <Container className="py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={SITE.brand.logo}
                alt=""
                width={36}
                height={36}
                className="h-9 w-9 rounded-[10px]"
              />
              <span className="text-headline text-label">{SITE.brand.shortName}</span>
            </div>
            <p className="mt-4 max-w-[300px]">{SITE.brand.intro}</p>
            <a
              href={SITE.contact.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className={`${link} mt-4 inline-flex items-center gap-2`}
            >
              <Instagram className="h-[18px] w-[18px]" />
              {SITE.brand.instagramHandle}
            </a>
          </div>

          <nav aria-label="Plan du site">
            <h2 className="text-footnote font-semibold text-label">Navigation</h2>
            <ul className="mt-3 space-y-2">
              {SITE.nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className={link}>
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="#rendez-vous" className={link}>
                  Prendre rendez-vous
                </a>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className="text-footnote font-semibold text-label">Contact</h2>
            <ul className="mt-3 space-y-2">
              <li>
                <a href={`tel:${SITE.contact.cabinetPhoneTel}`} className={link}>
                  Cabinet · {SITE.contact.cabinetPhoneDisplay}
                </a>
              </li>
              <li>
                <a href={`tel:${SITE.contact.drPhoneTel}`} className={link}>
                  Urgences · {SITE.contact.drPhoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={SITE.contact.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={link}
                >
                  {SITE.contact.addressLine}
                  <br />
                  {SITE.contact.city}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-footnote font-semibold text-label">Horaires</h2>
            <ul className="mt-3 space-y-2">
              {SITE.hours.items.map((h) => (
                <li key={h.label} className="flex justify-between gap-4 sm:block">
                  <span>{h.label}</span>
                  <span className="tabular-nums sm:before:content-['_:_']">{h.time}</span>
                </li>
              ))}
              <li className="pt-1 text-label">{SITE.hours.emergency}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-separator pt-5 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE.brand.name}. Tous droits réservés.
          </p>
          <p>Témara — Boulevard Sahl Rhône, Maroc</p>
        </div>
      </Container>
    </footer>
  );
}
