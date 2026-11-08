"use client";

import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import LocationSelector, { LocationValue } from "@/app/components/location-selector";
import Button from "@/app/components/ui/button";
import { Label, inputClass } from "@/app/components/ui/form-field";
import { CATALOG_PATH, CatalogFilters as Filters, catalogHref } from "@/lib/adoption/catalog-query";
import { SIZE_LABEL, lifeStageLabel } from "@/lib/adoption/labels";
import { LifeStage } from "@/lib/api/models/adoption/life-stage";
import { PetSex } from "@/lib/api/models/adoption/pet-sex";
import { PetSize } from "@/lib/api/models/adoption/pet-size";
import { Species } from "@/lib/api/models/adoption/species";
import { Locality } from "@/lib/api/models/locality/locality";
import { Province } from "@/lib/api/models/locality/province";

const SPECIES_OPTIONS: { value: Species | null; label: string }[] = [
  { value: null, label: "Todos" },
  { value: Species.DOG, label: "Perros" },
  { value: Species.CAT, label: "Gatos" },
];

/**
 * Filtros del catálogo. Al buscar navega a la URL de la búsqueda (/adoptions?species=dog…);
 * la página la lee en el servidor. El tamaño solo aparece con «Perros» y se borra al cambiar
 * de especie, para que no quede un filtro invisible aplicado.
 */
export default function CatalogFilters({
  provinces,
  initial,
  initialLocality,
}: {
  provinces: Province[];
  initial: Filters;
  /** Localidad elegida, con nombre para mostrarla (la URL solo trae el id). */
  initialLocality: Locality | null;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [species, setSpecies] = useState<Species | undefined>(initial.species);
  const [size, setSize] = useState<PetSize | undefined>(initial.size);
  const [sex, setSex] = useState<PetSex | undefined>(initial.sex);
  const [lifeStage, setLifeStage] = useState<LifeStage | undefined>(initial.lifeStage);
  const [location, setLocation] = useState<LocationValue>({
    provinceId: initial.provinceId ?? null,
    locality: initialLocality,
  });

  function chooseSpecies(next: Species | undefined) {
    setSpecies(next);
    if (next !== Species.DOG) setSize(undefined);
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    router.push(
      catalogHref({
        filters: {
          species,
          size: species === Species.DOG ? size : undefined,
          sex,
          lifeStage,
          provinceId: location.provinceId ?? undefined,
          localityId: location.locality?.id,
        },
        page: 1,
      }),
    );
  }

  return (
    <section aria-label="Filtros" className="rounded-card border-3 border-ink bg-surface p-5 shadow-panel md:p-6">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="catalog-filters"
        className="inline-flex min-h-11 items-center gap-2 rounded-full border-3 border-ink px-5 font-bold md:hidden"
      >
        <AdjustmentsHorizontalIcon aria-hidden="true" className="h-5 w-5" />
        Filtros
      </button>

      <form
        id="catalog-filters"
        onSubmit={submit}
        className={`${open ? "mt-5 flex" : "hidden"} flex-col gap-5 md:mt-0 md:flex`}
      >
        <fieldset>
          <legend className="sr-only">Especie</legend>
          <div className="flex flex-wrap gap-3">
            {SPECIES_OPTIONS.map((option) => (
              <label
                key={option.label}
                className={
                  "inline-flex min-h-11 cursor-pointer items-center rounded-full border-3 border-ink bg-surface px-5 font-bold " +
                  "has-checked:bg-ink has-checked:text-surface " +
                  "has-focus-visible:outline-3 has-focus-visible:outline-offset-3 has-focus-visible:outline-accent-teal"
                }
              >
                <input
                  type="radio"
                  name="species"
                  className="sr-only"
                  checked={species === (option.value ?? undefined)}
                  onChange={() => chooseSpecies(option.value ?? undefined)}
                />
                {option.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {species === Species.DOG && (
            <div>
              <Label htmlFor="filter-size">Tamaño</Label>
              <select
                id="filter-size"
                className={inputClass}
                value={size ?? ""}
                onChange={(e) => setSize((e.target.value as PetSize) || undefined)}
              >
                <option value="">Cualquiera</option>
                {Object.values(PetSize).map((value) => (
                  <option key={value} value={value}>
                    {SIZE_LABEL[value]}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <Label htmlFor="filter-sex">Sexo</Label>
            <select
              id="filter-sex"
              className={inputClass}
              value={sex ?? ""}
              onChange={(e) => setSex((e.target.value as PetSex) || undefined)}
            >
              <option value="">Cualquiera</option>
              <option value={PetSex.MALE}>Macho</option>
              <option value={PetSex.FEMALE}>Hembra</option>
            </select>
          </div>
          <div>
            <Label htmlFor="filter-life-stage">Edad</Label>
            <select
              id="filter-life-stage"
              className={inputClass}
              value={lifeStage ?? ""}
              onChange={(e) => setLifeStage((e.target.value as LifeStage) || undefined)}
            >
              <option value="">Cualquiera</option>
              {Object.values(LifeStage).map((value) => (
                <option key={value} value={value}>
                  {lifeStageLabel(value, species)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <LocationSelector provinces={provinces} value={location} onChange={setLocation} optional />

        <div className="flex flex-wrap items-center justify-end gap-4 border-t-2 border-dashed border-ink pt-5">
          <Link
            href={CATALOG_PATH}
            className="min-h-11 px-1.5 py-2.5 font-semibold text-primary underline underline-offset-3 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-accent-teal"
          >
            Limpiar filtros
          </Link>
          <Button type="submit" variant="cta">
            Buscar
          </Button>
        </div>
      </form>
    </section>
  );
}
