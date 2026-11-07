import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ChevronRight } from "./icons";

/**
 * Liste groupée en retrait (HIG — Lists and tables) : groupe arrondi,
 * séparateurs alignés sur le texte, pictogramme dans une pastille colorée.
 */
export function InsetGroup({
  title,
  accessory,
  footer,
  className,
  children,
}: {
  title?: string;
  accessory?: ReactNode;
  footer?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={className}>
      {(title || accessory) && (
        <div className="mb-2.5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-1">
          {title && <h3 className="text-title3">{title}</h3>}
          {accessory && <div className="text-subheadline text-label-secondary">{accessory}</div>}
        </div>
      )}
      <ul className="overflow-hidden rounded-card bg-bg-secondary">{children}</ul>
      {footer && <div className="mt-2 px-1 text-footnote text-label-secondary">{footer}</div>}
    </section>
  );
}

type RowProps = {
  icon?: ReactNode;
  /** Couleur de la pastille (classe de fond). */
  iconClassName?: string;
  title: ReactNode;
  detail?: ReactNode;
  trailing?: ReactNode;
  href?: string;
  external?: boolean;
  ariaLabel?: string;
  className?: string;
};

export function Row({
  icon,
  iconClassName,
  title,
  detail,
  trailing,
  href,
  external,
  ariaLabel,
  className,
}: RowProps) {
  const content = (
    <>
      {icon && (
        <span
          aria-hidden="true"
          className={cn(
            "grid h-[30px] w-[30px] shrink-0 place-items-center rounded-[8px] text-white [&>svg]:h-[17px] [&>svg]:w-[17px]",
            iconClassName,
          )}
        >
          {icon}
        </span>
      )}
      <span className="flex min-h-[60px] min-w-0 flex-1 items-center gap-3 border-t border-separator py-2.5 pr-4 group-first/row:border-t-0">
        <span className="min-w-0 flex-1">
          <span className="block text-body text-label">{title}</span>
          {detail && (
            <span className="block text-subheadline tabular-nums text-label-secondary">
              {detail}
            </span>
          )}
        </span>
        {trailing}
        {href &&
          (external ? (
            <ArrowUpRight className="h-4 w-4 shrink-0 text-label-tertiary" />
          ) : (
            <ChevronRight className="h-4 w-4 shrink-0 text-label-tertiary" />
          ))}
      </span>
    </>
  );

  const rowClass = cn("flex items-center gap-3.5 pl-4", className);

  return (
    <li className="group/row">
      {href ? (
        <a
          href={href}
          aria-label={ariaLabel}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className={cn(
            rowClass,
            "transition-colors duration-150 hover:bg-fill-quaternary active:bg-fill-tertiary [-webkit-tap-highlight-color:transparent]",
          )}
        >
          {content}
        </a>
      ) : (
        <div className={rowClass}>{content}</div>
      )}
    </li>
  );
}
