import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Marges de lecture communes à toutes les sections. */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-page px-5 sm:px-8 lg:px-10", className)}>
      {children}
    </div>
  );
}

/** Rythme vertical des sections. `tone` suit la hiérarchie des fonds iOS. */
export function Section({
  id,
  tone = "plain",
  className,
  children,
  labelledBy,
}: {
  id: string;
  tone?: "plain" | "grouped";
  className?: string;
  children: ReactNode;
  labelledBy?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        "relative py-20 sm:py-24 lg:py-32",
        tone === "grouped" ? "bg-grouped" : "bg-bg",
        className,
      )}
    >
      {children}
    </section>
  );
}

/** Surtitre discret : un filet et un mot, sans couleur. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "flex items-center gap-3 text-footnote font-medium uppercase tracking-[0.14em] text-label-secondary",
        className,
      )}
    >
      <span aria-hidden="true" className="h-px w-8 bg-current opacity-60" />
      {children}
    </p>
  );
}

/** Surtitre + grand titre (Fraunces) + introduction, aligné sur le bord de lecture. */
export function SectionHeader({
  id,
  eyebrow,
  title,
  intro,
  className,
}: {
  id?: string;
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("max-w-[780px]", className)}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 id={id} className="mt-5 font-display text-large-title text-label">
        {title}
      </h2>
      {intro ? (
        <p className="mt-5 max-w-reading text-lead text-label-secondary">{intro}</p>
      ) : null}
    </div>
  );
}
