"use client";

import { Listbox, ListboxButton, ListboxLabel, ListboxOption, ListboxOptions } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import type { AriaAttributes } from "react";
import { inputClass, labelClass } from "./form-field";

interface SelectOption {
  value: string;
  label: string;
}

/** Lista bajo el campo, sin superponer opciones al clic que la abre. */
export default function Select({
  id,
  label,
  value,
  onChange,
  options,
  className = inputClass,
  labelClassName = labelClass,
  disabled = false,
  "aria-invalid": invalid,
  "aria-describedby": describedBy,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly SelectOption[];
  className?: string;
  labelClassName?: string;
  disabled?: boolean;
  "aria-invalid"?: AriaAttributes["aria-invalid"];
  "aria-describedby"?: string;
}) {
  const selected = options.find((option) => option.value === value);

  return (
    <Listbox value={value} onChange={onChange} disabled={disabled}>
      <ListboxLabel className={labelClassName}>{label}</ListboxLabel>
      <ListboxButton
        id={id}
        type="button"
        className={`${className} flex items-center justify-between gap-3 text-left`}
        aria-invalid={invalid}
        aria-describedby={describedBy}
      >
        <span className="truncate">{selected?.label ?? "Elegí una opción"}</span>
        <ChevronDownIcon aria-hidden="true" className="pointer-events-none h-5 w-5 shrink-0" />
      </ListboxButton>
      <ListboxOptions
        anchor={{ to: "bottom start", gap: 6 }}
        modal={false}
        className="z-50 max-h-72 w-[var(--button-width)] overflow-y-auto overscroll-contain rounded-field border-3 border-ink bg-surface py-1 text-[17px] text-ink shadow-card focus:outline-none"
      >
        {options.map((option) => (
          <ListboxOption
            key={option.value}
            value={option.value}
            className="flex min-h-11 cursor-pointer items-center justify-between gap-3 px-4 py-2 select-none data-focus:bg-positive-soft data-selected:font-bold"
          >
            {({ selected }) => (
              <>
                <span>{option.label}</span>
                {selected && <CheckIcon aria-hidden="true" className="h-5 w-5 shrink-0" />}
              </>
            )}
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  );
}
