import type {
  InputHTMLAttributes,
  ReactNode,
  Ref,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Exclamation } from "./icons";

/**
 * Champs de saisie (HIG — Text fields, Entering data) :
 * libellé flottant qui reste visible pendant la saisie, message d'erreur
 * placé juste sous le champ, clavier et remplissage automatique adaptés.
 * Dimensions en `em` : les champs grandissent avec la taille du texte.
 */

const control =
  "peer block w-full rounded-field border bg-field px-4 text-body leading-[1.3] text-label outline-none transition-[border-color,box-shadow] duration-200 ease-ios placeholder:text-transparent";

const states = (invalid: boolean) =>
  invalid
    ? "border-red focus:shadow-[0_0_0_4px_var(--red-soft)]"
    : "border-field-border focus:border-tint focus:shadow-[0_0_0_4px_var(--tint-soft)]";

const labelBase =
  "pointer-events-none absolute left-4 right-4 origin-top-left truncate text-body leading-[1.3] text-label-secondary transition-[top,translate,scale] duration-200 ease-ios";

/* Libellé réduit en haut du champ (état « flottant »). */
const raised = "top-[0.42em] translate-y-0 scale-[0.765]";
const raiseOnInput =
  "peer-focus:top-[0.42em] peer-focus:translate-y-0 peer-focus:scale-[0.765] peer-[:not(:placeholder-shown)]:top-[0.42em] peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:scale-[0.765]";

function RequiredMark({ required }: { required?: boolean }) {
  if (!required) return null;
  return (
    <span aria-hidden="true" className="text-label-tertiary">
      {" "}
      *
    </span>
  );
}

export function FieldError({ id, children }: { id: string; children?: ReactNode }) {
  if (!children) return null;
  return (
    <p id={id} className="mt-1.5 flex items-start gap-1.5 px-1 text-footnote text-red">
      <Exclamation className="mt-px h-4 w-4 shrink-0" />
      <span>{children}</span>
    </p>
  );
}

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  error?: string;
  inputRef?: Ref<HTMLInputElement>;
  wrapperClassName?: string;
};

export function TextField({
  id,
  label,
  error,
  required,
  inputRef,
  wrapperClassName,
  className,
  ...props
}: TextFieldProps) {
  const errorId = `${id}-erreur`;
  return (
    <div className={wrapperClassName}>
      <div className="relative">
        <input
          id={id}
          ref={inputRef}
          required={required}
          placeholder=" "
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            control,
            states(Boolean(error)),
            "h-[3.3em] pb-[0.35em] pt-[1.35em]",
            className,
          )}
          {...props}
        />
        <label
          htmlFor={id}
          className={cn(labelBase, "top-1/2 -translate-y-1/2", raiseOnInput)}
        >
          {label}
          <RequiredMark required={required} />
        </label>
      </div>
      <FieldError id={errorId}>{error}</FieldError>
    </div>
  );
}

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  id: string;
  label: string;
  wrapperClassName?: string;
};

export function TextArea({ id, label, wrapperClassName, className, ...props }: TextAreaProps) {
  return (
    <div className={cn("relative", wrapperClassName)}>
      <textarea
        id={id}
        placeholder=" "
        className={cn(
          control,
          states(false),
          "min-h-[6.6em] resize-none pb-[0.6em] pt-[1.45em]",
          className,
        )}
        {...props}
      />
      <label htmlFor={id} className={cn(labelBase, "top-[0.95em]", raiseOnInput)}>
        {label}
      </label>
    </div>
  );
}

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  id: string;
  label: string;
  wrapperClassName?: string;
  children: ReactNode;
};

/** Menu de choix (HIG — Pop-up buttons) : le sélecteur natif du système. */
export function SelectField({
  id,
  label,
  wrapperClassName,
  className,
  children,
  ...props
}: SelectFieldProps) {
  return (
    <div className={cn("relative", wrapperClassName)}>
      <select
        id={id}
        className={cn(
          control,
          states(false),
          "h-[3.3em] cursor-pointer appearance-none pb-[0.35em] pr-11 pt-[1.35em]",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <label htmlFor={id} className={cn(labelBase, raised)}>
        {label}
      </label>
      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-label-secondary" />
    </div>
  );
}
