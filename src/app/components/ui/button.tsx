import Link from "next/link";
import type { ReactNode } from "react";

// Botón del sistema visual (docs/arquitectura/sistema-visual.md#componentes-base).
// Con `href` se renderiza como link; deshabilitado siempre es un <button disabled>,
// para que no se pueda navegar a un destino que todavía no existe.

export type ButtonVariant = "cta" | "primary" | "secondary";

const base =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-3 px-7 " +
  "text-[17px] font-bold no-underline transition-transform duration-75 " +
  "focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-accent-teal";

const enabled =
  "border-ink shadow-hard cursor-pointer active:translate-x-1 active:translate-y-1 active:shadow-none";

const variants: Record<ButtonVariant, string> = {
  cta: "bg-cta text-ink hover:bg-cta-hover",
  primary: "bg-primary text-white",
  secondary: "bg-surface text-ink",
};

const disabledStyle =
  "cursor-not-allowed border-dashed border-ink-soft bg-disabled text-ink-soft";

type ButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  href?: string;
  disabled?: boolean;
  type?: "button" | "submit";
  onClick?: () => void;
  className?: string;
};

export default function Button({
  children,
  variant = "primary",
  href,
  disabled = false,
  type = "button",
  onClick,
  className = "",
}: ButtonProps) {
  if (disabled) {
    return (
      <button type="button" disabled className={`${base} ${disabledStyle} ${className}`}>
        {children}
      </button>
    );
  }

  const classes = `${base} ${enabled} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
