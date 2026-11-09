import { CheckIcon } from "@heroicons/react/24/outline";

// Stepper del sistema visual (docs/arquitectura/sistema-visual.md#componentes-base):
// completo en verde con tilde, actual en naranja, pendientes con contorno punteado.

export default function Stepper({ steps, current }: { steps: readonly string[]; current: number }) {
  return (
    <ol aria-label="Pasos" className="flex items-center justify-between gap-0.5 sm:justify-start sm:gap-2">
      {steps.map((label, index) => {
        const number = index + 1;
        const state = number < current ? "done" : number === current ? "current" : "todo";
        return (
          <li
            key={label}
            aria-current={state === "current" ? "step" : undefined}
            className="flex flex-none items-center gap-2 sm:flex-auto sm:last:flex-none"
          >
            <span
              className={
                "flex size-8 flex-none items-center justify-center rounded-full text-[15px] font-bold sm:size-9 " +
                (state === "done"
                  ? "border-[2.5px] border-ink bg-positive"
                  : state === "current"
                    ? "border-[2.5px] border-ink bg-cta"
                    : "border-[2.5px] border-dashed border-ink-soft bg-surface text-ink-soft")
              }
            >
              {state === "done" ? <CheckIcon aria-hidden="true" className="h-5 w-5 stroke-[3]" /> : number}
            </span>
            <span className={`hidden font-semibold lg:inline ${state === "todo" ? "text-ink-soft" : ""}`}>
              {label}
              {state === "done" && <span className="sr-only"> (completo)</span>}
            </span>
            {number < steps.length && (
              <span
                aria-hidden="true"
                className={`hidden h-0 flex-1 border-t-[2.5px] sm:block ${state === "done" ? "border-ink" : "border-dashed border-ink-soft"}`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
