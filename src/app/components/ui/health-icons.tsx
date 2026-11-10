import { GenderNeuter, Pill, Syringe } from "@phosphor-icons/react/dist/ssr";
import type { ComponentType } from "react";
import { HealthChip, HealthItem } from "@/lib/adoption/labels";

// Salud en versión compacta, para la tarjeta de mascota: un ícono por dato. Como en los chips,
// el «sí» y el «no» difieren en forma y no solo en color (docs/arquitectura/sistema-visual.md):
// «sí» en círculo verde con contorno sólido; «no» con contorno punteado, gris y el ícono tachado.
// El texto («Vacunada», «Sin castrar») va oculto para lectores de pantalla y como tooltip.

const ICONS: Record<HealthItem, ComponentType<{ className?: string; weight?: "bold"; "aria-hidden"?: boolean }>> = {
  vaccinated: Syringe,
  dewormed: Pill,
  neutered: GenderNeuter,
};

export default function HealthIcons({ chips, className = "" }: { chips: HealthChip[]; className?: string }) {
  return (
    <ul aria-label="Salud" className={`flex shrink-0 items-center gap-1.5 ${className}`}>
      {chips.map((chip) => {
        const Icon = ICONS[chip.item];
        return (
          <li
            key={chip.item}
            title={chip.label}
            className={`relative flex h-8 w-8 items-center justify-center rounded-full border-2 ${
              chip.positive ? "border-ink bg-positive-soft text-ink" : "border-dashed border-ink-soft text-ink-soft"
            }`}
          >
            <Icon aria-hidden={true} weight="bold" className="h-[18px] w-[18px]" />
            {!chip.positive && (
              <span aria-hidden="true" className="absolute h-0.5 w-6 -rotate-45 rounded-full bg-ink-soft" />
            )}
            <span className="sr-only">{chip.label}</span>
          </li>
        );
      })}
    </ul>
  );
}
