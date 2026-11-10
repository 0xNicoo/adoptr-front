import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { HealthChip } from "@/lib/adoption/labels";

// Datos de salud: el «sí» en chip verde con contorno sólido y tilde; el «no» con contorno
// punteado, cruz y texto explícito (docs/arquitectura/sistema-visual.md#componentes-base).

// `xs` es para la tarjeta de mascota, donde los tres chips tienen que entrar en un renglón.
const SIZES = {
  xs: { chip: "text-[12px] px-2 py-0.5 gap-1", icon: "h-3 w-3", list: "gap-1.5" },
  sm: { chip: "text-[13px] px-2.5 py-1 gap-1.5", icon: "h-4 w-4", list: "gap-2" },
  md: { chip: "text-[15px] px-3.5 py-1.5 gap-1.5", icon: "h-4 w-4", list: "gap-2" },
};

export default function HealthChips({ chips, size = "sm" }: { chips: HealthChip[]; size?: "xs" | "sm" | "md" }) {
  const { chip: text, icon, list } = SIZES[size];
  return (
    <ul aria-label="Salud" className={`flex flex-wrap ${list}`}>
      {chips.map((chip) => (
        <li
          key={chip.label}
          className={`inline-flex items-center rounded-full border-2 font-semibold ${text} ${
            chip.positive ? "border-ink bg-positive-soft text-ink" : "border-dashed border-ink-soft text-ink-soft"
          }`}
        >
          {chip.positive ? (
            <CheckIcon aria-hidden="true" className={`${icon} stroke-[2.5]`} />
          ) : (
            <XMarkIcon aria-hidden="true" className={`${icon} stroke-[2.5]`} />
          )}
          {chip.label}
        </li>
      ))}
    </ul>
  );
}
