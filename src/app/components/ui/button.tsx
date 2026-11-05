import Link from "next/link";
import type { ReactNode } from "react";

// Botón del sistema visual (docs/arquitectura/sistema-visual.md#componentes-base).
// Con `href` se renderiza como link; deshabilitado siempre es un <button disabled>,
// para que no se pueda navegar a un destino que todavía no existe.

export type ButtonVariant = "cta" | "primary" | "secondary";

export type ButtonSize = "md" | "sm";

// `tone="dark"`: para fondos tinta (navbar, pie), donde el contorno y la sombra
// tinta no se verían; pasan a papel.
export type ButtonTone = "light" | "dark";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full border-3 " +
  "font-bold no-underline transition-transform duration-75 " +
  "focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-accent-teal";

const sizes: Record<ButtonSize, string> = {
  md: "min-h-12 px-7 text-[17px]",
  sm: "min-h-11 px-5 text-base",
};

const tones: Record<ButtonTone, string> = {
  light: "border-ink shadow-hard",
  dark: "border-paper shadow-[3px_3px_0_var(--color-paper)]",
};

const enabled = "cursor-pointer active:translate-x-1 active:translate-y-1 active:shadow-none";

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
  size?: ButtonSize;
  tone?: ButtonTone;
  href?: string;
  disabled?: boolean;
  type?: "button" | "submit";
  onClick?: () => void;
  className?: string;
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  tone = "light",
  href,
  disabled = false,
  type = "button",
  onClick,
  className = "",
}: ButtonProps) {
  if (disabled) {
    return (
      <button type="button" disabled className={`${base} ${sizes[size]} ${disabledStyle} ${className}`}>
        {children}
      </button>
    );
  }

  const classes = `${base} ${sizes[size]} ${tones[tone]} ${enabled} ${variants[variant]} ${className}`;

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
