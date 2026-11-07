import type { ReactNode } from "react";

// Piezas de formulario del sistema visual (docs/arquitectura/sistema-visual.md).
// Los campos marcan el error con aria-invalid: el estilo sale de ese atributo,
// así el estado visual y el que leen los lectores de pantalla no se separan.

export const inputClass =
  "w-full min-h-13 rounded-field border-3 border-ink bg-surface px-4 py-3 text-[17px] text-ink " +
  "placeholder:text-ink-soft focus:outline-3 focus:outline-offset-2 focus:outline-cta " +
  "aria-invalid:border-danger aria-invalid:bg-danger-soft " +
  "disabled:cursor-not-allowed disabled:bg-disabled disabled:text-ink-soft";

export const labelClass = "mb-2 block text-[13px] font-semibold uppercase tracking-[0.08em]";

export function Label({ htmlFor, children }: { htmlFor: string; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className={labelClass}>
      {children}
    </label>
  );
}

export function FieldError({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <p id={id} className="mt-2 text-sm font-semibold text-danger">
      {children}
    </p>
  );
}

export function FieldHelp({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <p id={id} className="mt-2 text-sm leading-normal text-ink-soft">
      {children}
    </p>
  );
}

/** Opción de radio con forma de pastilla (por ejemplo, el género). */
export function RadioPill({
  name,
  value,
  checked,
  onChange,
  children,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  children: ReactNode;
}) {
  return (
    <label
      className={
        "relative inline-flex min-h-12 cursor-pointer items-center rounded-full border-[2.5px] border-ink bg-surface px-6 " +
        "font-semibold has-checked:bg-primary has-checked:text-white has-checked:shadow-[3px_3px_0_var(--color-ink)] " +
        "has-focus-visible:outline-3 has-focus-visible:outline-offset-3 has-focus-visible:outline-cta"
      }
    >
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="sr-only" />
      {children}
    </label>
  );
}

/** Opción de radio con forma de tarjeta, con título y descripción. */
export function RadioCard({
  name,
  value,
  checked,
  onChange,
  title,
  description,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  title: string;
  description: string;
}) {
  return (
    <label
      className={
        "group relative flex min-h-33 cursor-pointer flex-col gap-2 rounded-card border-3 border-ink bg-surface px-6 py-5 " +
        "has-checked:bg-primary has-checked:text-white has-checked:shadow-card " +
        "has-focus-visible:outline-3 has-focus-visible:outline-offset-3 has-focus-visible:outline-cta"
      }
    >
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="sr-only" />
      <span className="font-display text-[28px] leading-tight">{title}</span>
      <span className="text-base leading-normal text-ink-soft group-has-checked:text-white">{description}</span>
    </label>
  );
}
