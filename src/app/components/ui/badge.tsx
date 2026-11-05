import type { ReactNode } from "react";

// Badges del sistema visual (docs/arquitectura/sistema-visual.md#componentes-base).

export type BadgeVariant = "positive" | "danger" | "surface" | "soon" | "soon-light" | "accent";

const variants: Record<BadgeVariant, string> = {
  positive: "rounded-full bg-positive text-ink",
  danger: "rounded-full bg-danger text-white",
  surface: "rounded-full bg-surface text-ink",
  // «Próximamente»: rectangular y levemente girada.
  soon: "rounded-lg bg-accent-mustard text-ink uppercase tracking-[0.06em] text-[13px] -rotate-3",
  // Igual que «soon», para usar sobre fondos de color (tarjetas mostaza o turquesa).
  "soon-light": "rounded-lg bg-surface text-ink uppercase tracking-[0.06em] text-[13px] -rotate-3",
  accent: "rounded-lg bg-accent-teal text-ink uppercase tracking-[0.06em] text-[14px] -rotate-2",
};

type BadgeProps = {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
};

export default function Badge({ children, variant = "surface", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 border-2 border-ink px-3.5 py-1.5 text-sm font-bold ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
