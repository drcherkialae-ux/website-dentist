import { SITE } from "./site";

export type OpenTone = "open" | "closing" | "closed";
export type OpenState = { tone: OpenTone; label: string };

const DAY_NAMES = [
  "dimanche",
  "lundi",
  "mardi",
  "mercredi",
  "jeudi",
  "vendredi",
  "samedi",
];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const formatHour = (h: number) => `${h}h`;

/** Jour (0 = dimanche) et heure décimale, dans le fuseau du cabinet. */
export function clinicNow(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: SITE.hours.timeZone,
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return {
    day: WEEKDAYS.indexOf(get("weekday")),
    time: Number(get("hour")) + Number(get("minute")) / 60,
  };
}

const slotFor = (day: number) =>
  SITE.hours.items.find(
    (i) => i.days.includes(day) && i.open !== undefined && i.close !== undefined,
  );

/** « Ouvert · ferme à 19h », « Fermé · ouvre lundi à 9h »… */
export function getOpenState(date = new Date()): OpenState {
  const { day, time } = clinicNow(date);
  const today = slotFor(day);

  if (today && time >= today.open! && time < today.close!) {
    return today.close! - time <= 1
      ? { tone: "closing", label: `Ferme bientôt · à ${formatHour(today.close!)}` }
      : { tone: "open", label: `Ouvert · ferme à ${formatHour(today.close!)}` };
  }
  if (today && time < today.open!) {
    return { tone: "closed", label: `Fermé · ouvre à ${formatHour(today.open!)}` };
  }
  for (let i = 1; i <= 7; i++) {
    const d = (day + i) % 7;
    const next = slotFor(d);
    if (next) {
      const when = i === 1 ? "demain" : DAY_NAMES[d];
      return { tone: "closed", label: `Fermé · ouvre ${when} à ${formatHour(next.open!)}` };
    }
  }
  return { tone: "closed", label: "Fermé" };
}
