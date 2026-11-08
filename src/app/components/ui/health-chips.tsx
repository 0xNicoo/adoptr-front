import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { HealthChip } from "@/lib/adoption/labels";

// Datos de salud: el «sí» en chip verde con contorno sólido y tilde; el «no» con contorno
// punteado, cruz y texto explícito (docs/arquitectura/sistema-visual.md#componentes-base).

export default function HealthChips({ chips, size = "sm" }: { chips: HealthChip[]; size?: "sm" | "md" }) {
  const text = size === "md" ? "text-[15px] px-3.5 py-1.5" : "text-[13px] px-2.5 py-1";
  return (
    <ul aria-label="Salud" className="flex flex-wrap gap-2">
      {chips.map((chip) => (
        <li
          key={chip.label}
          className={`inline-flex items-center gap-1.5 rounded-full border-2 font-semibold ${text} ${
            chip.positive ? "border-ink bg-positive-soft text-ink" : "border-dashed border-ink-soft text-ink-soft"
          }`}
        >
          {chip.positive ? (
            <CheckIcon aria-hidden="true" className="h-4 w-4 stroke-[2.5]" />
          ) : (
            <XMarkIcon aria-hidden="true" className="h-4 w-4 stroke-[2.5]" />
          )}
          {chip.label}
        </li>
      ))}
    </ul>
  );
}
